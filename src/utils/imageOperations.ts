// src/utils/imageOperations.ts
// Pure client-side Canvas operations for compressing, converting, and resizing images

import { decodeForeignImageToPngBlob, decodeAvifFallback, needsForeignDecode } from './wasmDecoder';
import {
  encodeMozJpeg,
  encodePngWasm,
  encodeWebpWasm,
  encodeAvifWasm,
  encodeJxlWasm,
  resizeImageDataWasm,
  vectorizeToSvgBlob,
  getCanvasImageData,
  type ResizeKernelMethod,
  type SvgVectorMode,
  type PngCompressMode,
} from './wasmEncoder';

export type { ResizeKernelMethod, SvgVectorMode, PngCompressMode };

/**
 * Common config for operations
 */
export interface ImageOpConfig {
  mimeType: string;
  quality: number; // 0.0 to 1.0
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  resizeMethod?: ResizeKernelMethod;
  svgMode?: SvgVectorMode;
  pngMode?: PngCompressMode;
  useWasm?: boolean; // default true
}

/**
 * Helper to safely load any image file (including SVG, HEIC, RAW, PSD, TIFF, JXL, AVIF) into an HTMLImageElement
 */
export async function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  const isSvg =
    file.type === 'image/svg+xml' ||
    (file instanceof File && file.name.toLowerCase().endsWith('.svg'));

  if (isSvg) {
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');

      if (svgEl) {
        if (!svgEl.getAttribute('xmlns')) {
          svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        }

        const widthAttr = svgEl.getAttribute('width');
        const heightAttr = svgEl.getAttribute('height');
        const viewBox = svgEl.getAttribute('viewBox');

        let vbW = 0;
        let vbH = 0;
        if (viewBox) {
          const parts = viewBox.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            vbW = parts[2];
            vbH = parts[3];
          }
        }

        const isNumeric = (val: string | null) => val && !val.includes('%') && parseFloat(val) > 0;
        let finalW = isNumeric(widthAttr) ? parseFloat(widthAttr!) : (vbW || 1024);
        let finalH = isNumeric(heightAttr) ? parseFloat(heightAttr!) : (vbH || 1024);

        // Jika SVG berukuran icon kecil (< 256px), scale up agar hasil render PNG/JPG super tajam
        if (finalW < 256 && finalH < 256 && finalW > 0 && finalH > 0) {
          const scale = Math.max(1024 / finalW, 1024 / finalH);
          finalW = Math.round(finalW * scale);
          finalH = Math.round(finalH * scale);
        }

        svgEl.setAttribute('width', finalW.toString());
        svgEl.setAttribute('height', finalH.toString());

        const serializer = new XMLSerializer();
        const cleanSvg = serializer.serializeToString(svgEl);
        const svgBlob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);

        return await new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            URL.revokeObjectURL(svgUrl);
            resolve(img);
          };
          img.onerror = () => {
            URL.revokeObjectURL(svgUrl);
            const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(cleanSvg)}`;
            const fallbackImg = new Image();
            fallbackImg.onload = () => resolve(fallbackImg);
            fallbackImg.onerror = () => reject(new Error('Gagal memuat file SVG'));
            fallbackImg.src = dataUrl;
          };
          img.src = svgUrl;
        });
      }
    } catch (e) {
      console.warn('SVG preprocessing error, falling back to standard loader', e);
    }
  }

  let sourceBlob: Blob = file;
  if (needsForeignDecode(file)) {
    const decoded = await decodeForeignImageToPngBlob(file);
    sourceBlob = decoded.blob;
  }

  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(sourceBlob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = async () => {
      URL.revokeObjectURL(url);
      // Try AVIF WASM fallback if native AVIF decode failed
      const ext = file instanceof File ? file.name.split('.').pop()?.toLowerCase() : '';
      if (sourceBlob.type === 'image/avif' || ext === 'avif') {
        try {
          const fallbackPng = await decodeAvifFallback(sourceBlob);
          const fbUrl = URL.createObjectURL(fallbackPng);
          const fbImg = new Image();
          fbImg.onload = () => {
            URL.revokeObjectURL(fbUrl);
            resolve(fbImg);
          };
          fbImg.onerror = () => {
            URL.revokeObjectURL(fbUrl);
            reject(new Error('Gagal memuat gambar AVIF'));
          };
          fbImg.src = fbUrl;
          return;
        } catch {
          // Fall through to reject
        }
      }
      reject(new Error('Gagal memuat gambar'));
    };
    img.src = url;
  });
}

function canvasToBlobFallback(canvas: HTMLCanvasElement, mimeType: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Gagal membuat blob gambar'));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Process image based on config using Rust/C++ WebAssembly codecs, resizers, and vector tracers
 */
export async function processImage(file: Blob | File, config: ImageOpConfig): Promise<Blob> {
  const img = await loadImage(file);

  const srcW = img.naturalWidth || img.width || config.width || 800;
  const srcH = img.naturalHeight || img.height || config.height || 800;

  // Hitung dimensi akhir
  let finalWidth = srcW;
  let finalHeight = srcH;

  if (config.width || config.height) {
    if (config.maintainAspectRatio) {
      if (config.width && !config.height) {
        finalWidth = config.width;
        finalHeight = Math.round((srcH / srcW) * finalWidth);
      } else if (config.height && !config.width) {
        finalHeight = config.height;
        finalWidth = Math.round((srcW / srcH) * finalHeight);
      } else if (config.width && config.height) {
        // Fit within bounding box while maintaining aspect ratio
        const ratioX = config.width / srcW;
        const ratioY = config.height / srcH;
        const ratio = Math.min(ratioX, ratioY);
        finalWidth = Math.round(srcW * ratio);
        finalHeight = Math.round(srcH * ratio);
      }
    } else {
      finalWidth = config.width || srcW;
      finalHeight = config.height || srcH;
    }
  }

  finalWidth = Math.max(1, Math.round(finalWidth));
  finalHeight = Math.max(1, Math.round(finalHeight));

  // Render source pixels first
  const srcCanvas = document.createElement('canvas');
  srcCanvas.width = srcW;
  srcCanvas.height = srcH;
  const srcCtx = srcCanvas.getContext('2d');
  if (!srcCtx) throw new Error('Gagal membuat canvas context');

  const needsOpaqueWhite = config.mimeType === 'image/jpeg' || config.mimeType === 'image/bmp';
  if (needsOpaqueWhite) {
    srcCtx.fillStyle = '#FFFFFF';
    srcCtx.fillRect(0, 0, srcW, srcH);
  }
  srcCtx.drawImage(img, 0, 0, srcW, srcH);

  // Target canvas at final dimensions
  let canvas = srcCanvas;
  const needsResize = finalWidth !== srcW || finalHeight !== srcH;
  const useWasm = config.useWasm !== false;

  if (needsResize) {
    let resizedByWasm = false;
    if (useWasm) {
      try {
        const srcImageData = srcCtx.getImageData(0, 0, srcW, srcH);
        const resizedData = await resizeImageDataWasm(
          srcImageData,
          finalWidth,
          finalHeight,
          config.resizeMethod || 'lanczos3'
        );
        const dstCanvas = document.createElement('canvas');
        dstCanvas.width = resizedData.width;
        dstCanvas.height = resizedData.height;
        const dstCtx = dstCanvas.getContext('2d');
        if (dstCtx) {
          dstCtx.putImageData(resizedData, 0, 0);
          srcCanvas.width = 0;
          srcCanvas.height = 0;
          canvas = dstCanvas;
          resizedByWasm = true;
        }
      } catch (wasmResizeErr) {
        console.warn('[HelpMyIMG] WASM resize fallback to Canvas:', wasmResizeErr);
      }
    }

    if (!resizedByWasm) {
      const dstCanvas = document.createElement('canvas');
      dstCanvas.width = finalWidth;
      dstCanvas.height = finalHeight;
      const dstCtx = dstCanvas.getContext('2d');
      if (!dstCtx) throw new Error('Gagal membuat target canvas context');
      if (needsOpaqueWhite) {
        dstCtx.fillStyle = '#FFFFFF';
        dstCtx.fillRect(0, 0, finalWidth, finalHeight);
      }
      dstCtx.imageSmoothingEnabled = true;
      dstCtx.imageSmoothingQuality = 'high';
      dstCtx.drawImage(srcCanvas, 0, 0, finalWidth, finalHeight);
      srcCanvas.width = 0;
      srcCanvas.height = 0;
      canvas = dstCanvas;
    }
  }

  try {
    // 1. True Vector SVG Tracing (Potrace Monochrome WASM or Full-Color Curve Tracer)
    if (config.mimeType === 'image/svg+xml') {
      return await vectorizeToSvgBlob(canvas, config.svgMode || 'color');
    }

    // 2. Multi-Header Windows ICO
    if (config.mimeType === 'image/x-icon') {
      const pngBlob = await canvasToBlobFallback(canvas, 'image/png', 1.0);
      const pngBuffer = await pngBlob.arrayBuffer();
      const header = new Uint8Array(22);
      const view = new DataView(header.buffer);
      view.setUint16(0, 0, true);
      view.setUint16(2, 1, true);
      view.setUint16(4, 1, true);
      header[6] = canvas.width >= 256 ? 0 : canvas.width;
      header[7] = canvas.height >= 256 ? 0 : canvas.height;
      header[8] = 0;
      header[9] = 0;
      view.setUint16(10, 1, true);
      view.setUint16(12, 32, true);
      view.setUint32(14, pngBuffer.byteLength, true);
      view.setUint32(18, 22, true);
      return new Blob([header, pngBuffer], { type: 'image/x-icon' });
    }

    // 3. WASM Codecs (MozJPEG, OxiPNG/UPNG, LibWebP, LibAVIF, LibJXL)
    if (useWasm) {
      const imageData = getCanvasImageData(canvas);

      if (config.mimeType === 'image/jxl') {
        return await encodeJxlWasm(imageData, config.quality);
      }

      if (config.mimeType === 'image/avif') {
        try {
          return await encodeAvifWasm(imageData, config.quality);
        } catch (avifErr) {
          console.warn('[HelpMyIMG] WASM AVIF failed, attempting native canvas fallback:', avifErr);
        }
      }

      if (config.mimeType === 'image/jpeg') {
        try {
          return await encodeMozJpeg(imageData, config.quality);
        } catch (mozErr) {
          console.warn('[HelpMyIMG] MozJPEG fallback to Canvas JPEG:', mozErr);
        }
      }

      if (config.mimeType === 'image/png') {
        try {
          return await encodePngWasm(
            imageData,
            config.quality,
            config.pngMode || (config.quality < 0.9 ? 'quant' : 'lossless')
          );
        } catch (pngErr) {
          console.warn('[HelpMyIMG] OxiPNG/UPNG fallback to Canvas PNG:', pngErr);
        }
      }

      if (config.mimeType === 'image/webp') {
        try {
          return await encodeWebpWasm(imageData, config.quality);
        } catch (webpErr) {
          console.warn('[HelpMyIMG] WebP WASM fallback to Canvas WebP:', webpErr);
        }
      }
    }

    // 4. Native Canvas fallback (BMP, GIF, or WASM fallback)
    const blob = await canvasToBlobFallback(canvas, config.mimeType, config.quality);
    if (config.mimeType !== 'image/png' && blob.type === 'image/png' && config.mimeType === 'image/avif') {
      throw new Error(`Format ${config.mimeType} belum didukung penuh oleh browser ini.`);
    }
    return blob;
  } finally {
    canvas.width = 0;
    canvas.height = 0;
  }
}

/**
 * Crop image to specified region
 */
export async function cropImage(
  file: Blob | File,
  x: number, y: number, w: number, h: number,
  mimeType = 'image/png', quality = 0.95,
  borderRadius = 0
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Gagal membuat canvas context');

  if (borderRadius > 0) {
    mimeType = 'image/png'; // Force PNG for transparency
    ctx.beginPath();
    // Border radius is a percentage from 0 to 50, where 50 is a perfect circle/pill
    const radiusPx = (Math.min(w, h) / 2) * (borderRadius / 50);
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(0, 0, w, h, radiusPx);
    } else {
      // Fallback for very old browsers
      ctx.arcTo(w, 0, w, h, radiusPx);
    }
    ctx.clip();
  } else if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
  }

  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0;
        canvas.height = 0;
        if (blob) resolve(blob);
        else reject(new Error('Gagal membuat blob gambar'));
      },
      mimeType, quality
    );
  });
}

/**
 * Rotate and/or flip image
 */
export async function rotateImage(
  file: Blob | File,
  degrees: number,
  flipH: boolean,
  flipV: boolean,
  mimeType = 'image/png',
  quality = 0.95
): Promise<Blob> {
  const img = await loadImage(file);
  const radians = (degrees * Math.PI) / 180;

  // For 90/270 rotations, swap width and height
  const is90 = degrees === 90 || degrees === 270;
  const canvasW = is90 ? img.height : img.width;
  const canvasH = is90 ? img.width : img.height;

  const canvas = document.createElement('canvas');
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Gagal membuat canvas context');

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  ctx.translate(canvasW / 2, canvasH / 2);
  ctx.rotate(radians);
  ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0;
        canvas.height = 0;
        if (blob) resolve(blob);
        else reject(new Error('Gagal membuat blob gambar'));
      },
      mimeType, quality
    );
  });
}

import smartcrop from 'smartcrop';

export async function smartCropImage(
  file: Blob | File,
  targetWidth: number,
  targetHeight: number,
  mimeType: string = 'image/jpeg',
  resizeMethod: ResizeKernelMethod = 'lanczos3'
): Promise<Blob> {
  const img = await loadImage(file);

  // Smart crop algorithm calculates the best bounding box
  const result = await smartcrop.crop(img, { width: targetWidth, height: targetHeight });
  const crop = result.topCrop;

  // Render exact crop region first, then apply Rust/WASM resampling
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width = Math.max(1, Math.round(crop.width));
  cropCanvas.height = Math.max(1, Math.round(crop.height));
  const cropCtx = cropCanvas.getContext('2d');
  if (!cropCtx) throw new Error('Canvas 2D context not available');

  if (mimeType === 'image/jpeg') {
    cropCtx.fillStyle = '#FFFFFF';
    cropCtx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
  }
  cropCtx.drawImage(
    img,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    cropCanvas.width,
    cropCanvas.height
  );

  let finalCanvas = cropCanvas;
  const w = Math.max(1, Math.round(targetWidth));
  const h = Math.max(1, Math.round(targetHeight));

  try {
    const srcImgData = cropCtx.getImageData(0, 0, cropCanvas.width, cropCanvas.height);
    const resized = await resizeImageDataWasm(srcImgData, w, h, resizeMethod);
    const outCanvas = document.createElement('canvas');
    outCanvas.width = resized.width;
    outCanvas.height = resized.height;
    const outCtx = outCanvas.getContext('2d');
    if (outCtx) {
      outCtx.putImageData(resized, 0, 0);
      cropCanvas.width = 0;
      cropCanvas.height = 0;
      finalCanvas = outCanvas;
    }
  } catch {
    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const outCtx = outCanvas.getContext('2d');
    if (outCtx) {
      outCtx.imageSmoothingEnabled = true;
      outCtx.imageSmoothingQuality = 'high';
      outCtx.drawImage(cropCanvas, 0, 0, w, h);
      cropCanvas.width = 0;
      cropCanvas.height = 0;
      finalCanvas = outCanvas;
    }
  }

  try {
    const imageData = getCanvasImageData(finalCanvas);
    if (mimeType === 'image/jpeg') {
      try {
        return await encodeMozJpeg(imageData, 0.94);
      } catch {
        // fallback below
      }
    } else if (mimeType === 'image/webp') {
      try {
        return await encodeWebpWasm(imageData, 0.94);
      } catch {
        // fallback below
      }
    } else if (mimeType === 'image/png') {
      try {
        return await encodePngWasm(imageData, 0.95, 'lossless');
      } catch {
        // fallback below
      }
    }
    return await canvasToBlobFallback(finalCanvas, mimeType, 0.95);
  } finally {
    finalCanvas.width = 0;
    finalCanvas.height = 0;
  }
}

export type WatermarkPosition = 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'tiled';

export interface WatermarkConfig {
  type: 'text' | 'image';
  text?: string;
  image?: HTMLImageElement | null;
  color: string;
  opacity: number;
  position: WatermarkPosition;
  scale: number;
  rotation: number;
}

export async function applyWatermark(file: Blob | File, config: WatermarkConfig): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Draw original image
  ctx.drawImage(img, 0, 0);

  // Apply watermark
  ctx.globalAlpha = config.opacity;

  const baseDimension = Math.sqrt(img.width * img.height);

  if (config.type === 'text' && config.text) {
    const fontSize = Math.max(16, (baseDimension / 25) * config.scale);
    ctx.font = `bold ${fontSize}px "Inter", sans-serif`;
    ctx.fillStyle = config.color;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    // Draw text with shadow for better visibility
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = Math.max(2, fontSize / 10);
    ctx.shadowOffsetX = Math.max(1, fontSize / 20);
    ctx.shadowOffsetY = Math.max(1, fontSize / 20);

    const metrics = ctx.measureText(config.text);
    const textWidth = metrics.width;
    const textHeight = fontSize;

    if (config.position === 'tiled') {
      const stepX = textWidth * 1.5;
      const stepY = textHeight * 3;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((config.rotation * Math.PI) / 180);
      
      const diag = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
      const limit = diag / 2;
      
      const startX = -Math.ceil(limit / stepX) * stepX;
      const endX = Math.ceil(limit / stepX) * stepX;
      const startY = -Math.ceil(limit / stepY) * stepY;
      const endY = Math.ceil(limit / stepY) * stepY;

      for (let y = startY; y <= endY; y += stepY) {
        for (let x = startX; x <= endX; x += stepX) {
          ctx.fillText(config.text, x, y);
        }
      }
      ctx.restore();
    } else {
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      const padding = Math.max(10, baseDimension * 0.03);

      if (config.position === 'bottom-right') {
        x = canvas.width - textWidth / 2 - padding;
        y = canvas.height - textHeight / 2 - padding;
      } else if (config.position === 'bottom-left') {
        x = textWidth / 2 + padding;
        y = canvas.height - textHeight / 2 - padding;
      } else if (config.position === 'top-right') {
        x = canvas.width - textWidth / 2 - padding;
        y = textHeight / 2 + padding;
      } else if (config.position === 'top-left') {
        x = textWidth / 2 + padding;
        y = textHeight / 2 + padding;
      }

      ctx.translate(x, y);
      ctx.rotate((config.rotation * Math.PI) / 180);
      ctx.fillText(config.text, 0, 0);
    }
  } else if (config.type === 'image' && config.image) {
    const wmImg = config.image;
    // Scale watermark relative to the image
    const maxWmWidth = (baseDimension / 8) * config.scale;
    const scaleRatio = maxWmWidth / wmImg.width;
    const wmW = wmImg.width * scaleRatio;
    const wmH = wmImg.height * scaleRatio;

    if (config.position === 'tiled') {
      const stepX = wmW * 1.5;
      const stepY = wmH * 1.5;
      
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((config.rotation * Math.PI) / 180);
      
      const diag = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
      const limit = diag / 2;
      
      const startX = -Math.ceil(limit / stepX) * stepX;
      const endX = Math.ceil(limit / stepX) * stepX;
      const startY = -Math.ceil(limit / stepY) * stepY;
      const endY = Math.ceil(limit / stepY) * stepY;

      for (let y = startY; y <= endY; y += stepY) {
        for (let x = startX; x <= endX; x += stepX) {
          ctx.drawImage(wmImg, x - wmW/2, y - wmH/2, wmW, wmH);
        }
      }
      ctx.restore();
    } else {
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      const padding = Math.max(20, canvas.width * 0.05);

      if (config.position === 'bottom-right') {
        x = canvas.width - wmW / 2 - padding;
        y = canvas.height - wmH / 2 - padding;
      } else if (config.position === 'bottom-left') {
        x = wmW / 2 + padding;
        y = canvas.height - wmH / 2 - padding;
      } else if (config.position === 'top-right') {
        x = canvas.width - wmW / 2 - padding;
        y = wmH / 2 + padding;
      } else if (config.position === 'top-left') {
        x = wmW / 2 + padding;
        y = wmH / 2 + padding;
      }

      ctx.translate(x, y);
      ctx.rotate((config.rotation * Math.PI) / 180);
      ctx.drawImage(wmImg, -wmW/2, -wmH/2, wmW, wmH);
    }
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      canvas.width = 0;
      canvas.height = 0;
      if (blob) resolve(blob);
      else reject(new Error('Gagal menerapkan watermark'));
    }, file.type || 'image/png', 0.95);
  });
}
