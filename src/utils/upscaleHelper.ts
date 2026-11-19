// src/utils/upscaleHelper.ts
// Real 4K Ultra-HD (3840px) Client-Side Upscaling Engine
// Powered by Rust WASM MagicKernelSharp2021 (@jsquash/resize) + Optional Swin2SR AI Super-Resolution + OxiPNG

import { resizeImageDataWasm, encodePngWasm } from './wasmEncoder';

export interface UpscaleResult {
  url: string;
  width: number;
  height: number;
  revoked: boolean;
  wasUpscaled: boolean;
}

export interface UpscaleOptions {
  useAiSr?: boolean;
}

/**
 * Unsharp Masking Kernel for crisp micro-detail after upscaling
 */
function applyUnsharpMask(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number = 0.16) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    const w4 = width * 4;
    const invAmount = 1 - amount;

    for (let y = 1; y < height - 1; y++) {
      const row = y * w4;
      for (let x = 1; x < width - 1; x++) {
        const idx = row + x * 4;

        for (let c = 0; c < 3; c++) {
          const center = copy[idx + c];
          const top = copy[idx - w4 + c];
          const bottom = copy[idx + w4 + c];
          const left = copy[idx - 4 + c];
          const right = copy[idx + 4 + c];

          const sharpened = center * 5 - (top + bottom + left + right);
          data[idx + c] = Math.min(255, Math.max(0, center * invAmount + sharpened * amount));
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    console.warn('Unsharp mask skipped due to canvas memory constraints:', e);
  }
}

async function loadUrlToImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Upscale image to genuine 4K Ultra-HD (longest side = 3840px) using Rust WASM MagicKernelSharp2021
 * and optional neural Swin2SR super-resolution for small source images.
 */
export async function exportTo4k(
  sourceUrl: string,
  targetMaxDimension: number = 3840,
  options: UpscaleOptions = {}
): Promise<UpscaleResult> {
  let workingImg = await loadUrlToImage(sourceUrl);
  const origW = workingImg.naturalWidth || workingImg.width;
  const origH = workingImg.naturalHeight || workingImg.height;

  // Already >= 4K: export natively without resampling
  if (origW >= targetMaxDimension || origH >= targetMaxDimension) {
    return {
      url: sourceUrl,
      width: origW,
      height: origH,
      revoked: false,
      wasUpscaled: false,
    };
  }

  const maxSide = Math.max(origW, origH);
  const scale = targetMaxDimension / maxSide;
  const targetW = Math.round(origW * scale);
  const targetH = Math.round(origH * scale);

  // Optional Neural Swin2SR 2x pre-upscale for compact images when PRO AI SR is requested
  let tempSrUrl: string | null = null;
  if (options.useAiSr && maxSide <= 640) {
    try {
      const { aiService } = await import('../services/aiService');
      const srcRes = await fetch(sourceUrl);
      const srcBlob = await srcRes.blob();
      const srBlob = await aiService.upscaleAiAsync(srcBlob);
      tempSrUrl = URL.createObjectURL(srBlob);
      workingImg = await loadUrlToImage(tempSrUrl);
    } catch (srErr) {
      console.warn('[HelpMyIMG 4K] Swin2SR AI upscale fallback to WASM MagicKernelSharp2021:', srErr);
    }
  }

  try {
    const w = workingImg.naturalWidth || workingImg.width;
    const h = workingImg.naturalHeight || workingImg.height;

    const srcCanvas = document.createElement('canvas');
    srcCanvas.width = w;
    srcCanvas.height = h;
    const srcCtx = srcCanvas.getContext('2d');
    if (!srcCtx) {
      return { url: sourceUrl, width: origW, height: origH, revoked: false, wasUpscaled: false };
    }
    srcCtx.drawImage(workingImg, 0, 0, w, h);

    // Execute Rust WASM MagicKernelSharp2021 upscale directly to 4K target dimensions
    let finalCanvas: HTMLCanvasElement;
    try {
      const srcData = srcCtx.getImageData(0, 0, w, h);
      const resized = await resizeImageDataWasm(srcData, targetW, targetH, 'magicKernelSharp2021');
      finalCanvas = document.createElement('canvas');
      finalCanvas.width = resized.width;
      finalCanvas.height = resized.height;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) {
        return { url: sourceUrl, width: origW, height: origH, revoked: false, wasUpscaled: false };
      }
      finalCtx.putImageData(resized, 0, 0);
      applyUnsharpMask(finalCtx, finalCanvas.width, finalCanvas.height, 0.14);
    } catch (wasmErr) {
      console.warn('[HelpMyIMG 4K] WASM MagicKernel fallback to stepped Canvas:', wasmErr);
      finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetW;
      finalCanvas.height = targetH;
      const finalCtx = finalCanvas.getContext('2d');
      if (!finalCtx) {
        return { url: sourceUrl, width: origW, height: origH, revoked: false, wasUpscaled: false };
      }
      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';
      finalCtx.drawImage(srcCanvas, 0, 0, targetW, targetH);
      applyUnsharpMask(finalCtx, targetW, targetH, 0.18);
    } finally {
      srcCanvas.width = 0;
      srcCanvas.height = 0;
    }

    // Encode crisp lossless output via OxiPNG WASM (fallback to Canvas PNG)
    let outBlob: Blob | null = null;
    try {
      const fCtx = finalCanvas.getContext('2d');
      if (fCtx) {
        const finalData = fCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
        outBlob = await encodePngWasm(finalData, 1.0, 'lossless');
      }
    } catch {
      outBlob = await new Promise<Blob | null>((resolve) => finalCanvas.toBlob(resolve, 'image/png', 1.0));
    }

    finalCanvas.width = 0;
    finalCanvas.height = 0;

    if (!outBlob) {
      return { url: sourceUrl, width: origW, height: origH, revoked: false, wasUpscaled: false };
    }

    return {
      url: URL.createObjectURL(outBlob),
      width: targetW,
      height: targetH,
      revoked: true,
      wasUpscaled: true,
    };
  } finally {
    if (tempSrUrl) {
      URL.revokeObjectURL(tempSrUrl);
    }
  }
}
