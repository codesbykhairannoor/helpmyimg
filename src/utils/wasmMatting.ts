// Native C -> WebAssembly Matting Engine Wrapper
// Provides zero-overhead O(N) bicubic probability upsampling, connected-component island cleaning,
// He et al. 3x3 RGB Fast Guided Filter, van Herk morphological trimap generation,
// ViTMatte-S crop alpha fusion, and Photoroom 2-pass Blur-Fusion foreground color estimation.

import mattingWasmUrl from '../assets/matting_engine.wasm?url';

interface MattingWasmExports {
  memory: WebAssembly.Memory;
  reset_heap: () => void;
  get_heap_top: () => number;
  alloc_bytes: (bytes: number) => number;
  apply_sigmoid_if_logits: (bufPtr: number, n: number) => void;
  bicubic_upsample_f32: (srcPtr: number, sw: number, sh: number, dstPtr: number, dw: number, dh: number) => void;
  clean_islands_f32: (alphaPtr: number, w: number, h: number) => void;
  fast_guided_filter_rgb: (
    rgbaPtr: number,
    alphaPtr: number,
    w: number,
    h: number,
    radius: number,
    eps: number,
    blendStrength: number
  ) => void;
  build_adaptive_trimap: (
    alphaPtr: number,
    w: number,
    h: number,
    trimapPtr: number,
    erodeR: number,
    dilateR: number,
    outMetaPtr: number
  ) => void;
  merge_vitmatte_crop: (
    fullAlphaPtr: number,
    w: number,
    h: number,
    trimapPtr: number,
    vitAlphasPtr: number,
    padW: number,
    cropW: number,
    cropH: number,
    bx0: number,
    by0: number,
    bw: number,
    bh: number
  ) => void;
  soft_calibrate_matte: (alphaPtr: number, n: number, loCut: number, hiCut: number) => void;
  blur_fusion_foreground_composite: (
    inRgbaPtr: number,
    alphaPtr: number,
    outRgbaPtr: number,
    w: number,
    h: number,
    r1: number,
    r2: number
  ) => void;
}

export interface VitMatteCropRunner {
  (
    cropRgb: Uint8Array,
    cropTrimap: Uint8Array,
    cropW: number,
    cropH: number
  ): Promise<{ alphas: Float32Array; padW: number } | null>;
}

export interface MattingRefinementOptions {
  /** Raw segmentation model output (logits or 0..1 probabilities) */
  rawMask: Float32Array;
  maskWidth: number;
  maskHeight: number;
  /** Original image RGBA pixels */
  rgba: Uint8ClampedArray;
  width: number;
  height: number;
  /** Optional Stage-2 ViTMatte crop refiner for hair/fur/fine edges */
  vitmatteRunner?: VitMatteCropRunner | null;
  /** Target max side for ViTMatte crop inference (default 640) */
  vitmatteMaxSide?: number;
  /** Enable/disable Blur-Fusion foreground color decontamination (default true) */
  enableBlurFusion?: boolean;
}

let wasmInstancePromise: Promise<MattingWasmExports> | null = null;

export async function getWasmMattingExports(): Promise<MattingWasmExports> {
  if (wasmInstancePromise) return wasmInstancePromise;

  wasmInstancePromise = (async () => {
    const response = await fetch(mattingWasmUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch matting_engine.wasm: ${response.status}`);
    }
    let result: WebAssembly.WebAssemblyInstantiatedSource;
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        result = await WebAssembly.instantiateStreaming(response.clone(), {});
      } catch {
        const bytes = await response.arrayBuffer();
        result = await WebAssembly.instantiate(bytes, {});
      }
    } else {
      const bytes = await response.arrayBuffer();
      result = await WebAssembly.instantiate(bytes, {});
    }
    return result.instance.exports as unknown as MattingWasmExports;
  })().catch((err) => {
    wasmInstancePromise = null;
    throw err;
  });

  return wasmInstancePromise;
}

/**
 * Downsamples RGBA buffer with bilinear box interpolation on CPU for working-resolution WASM pass
 * when source photos exceed 2048px.
 */
function resizeRgbaBilinear(
  src: Uint8ClampedArray,
  sw: number,
  sh: number,
  dw: number,
  dh: number
): Uint8ClampedArray {
  const dst = new Uint8ClampedArray(dw * dh * 4);
  const scaleX = sw / dw;
  const scaleY = sh / dh;

  for (let y = 0; y < dh; y++) {
    const gy = (y + 0.5) * scaleY - 0.5;
    const y0 = Math.max(0, Math.min(sh - 1, Math.floor(gy)));
    const y1 = Math.min(sh - 1, y0 + 1);
    const fy = Math.max(0, Math.min(1, gy - y0));

    for (let x = 0; x < dw; x++) {
      const gx = (x + 0.5) * scaleX - 0.5;
      const x0 = Math.max(0, Math.min(sw - 1, Math.floor(gx)));
      const x1 = Math.min(sw - 1, x0 + 1);
      const fx = Math.max(0, Math.min(1, gx - x0));

      const i00 = (y0 * sw + x0) * 4;
      const i01 = (y0 * sw + x1) * 4;
      const i10 = (y1 * sw + x0) * 4;
      const i11 = (y1 * sw + x1) * 4;

      const w00 = (1 - fx) * (1 - fy);
      const w01 = fx * (1 - fy);
      const w10 = (1 - fx) * fy;
      const w11 = fx * fy;

      const di = (y * dw + x) * 4;
      dst[di] = Math.round(src[i00] * w00 + src[i01] * w01 + src[i10] * w10 + src[i11] * w11);
      dst[di + 1] = Math.round(src[i00 + 1] * w00 + src[i01 + 1] * w01 + src[i10 + 1] * w10 + src[i11 + 1] * w11);
      dst[di + 2] = Math.round(src[i00 + 2] * w00 + src[i01 + 2] * w01 + src[i10 + 2] * w10 + src[i11 + 2] * w11);
      dst[di + 3] = 255;
    }
  }
  return dst;
}

/**
 * Extracts & resizes cropped RGB + Grayscale Trimap for Stage-2 ViTMatte inference
 */
function prepareVitMatteCrop(
  rgba: Uint8ClampedArray,
  trimap: Uint8Array,
  w: number,
  h: number,
  bx0: number,
  by0: number,
  bw: number,
  bh: number,
  maxSide: number
): { cropRgb: Uint8Array; cropTrimap: Uint8Array; cropW: number; cropH: number } {
  const scale = Math.max(bw, bh) > maxSide ? maxSide / Math.max(bw, bh) : 1;
  // Dimensions must be >= 32
  const cropW = Math.max(32, Math.round(bw * scale));
  const cropH = Math.max(32, Math.round(bh * scale));

  const cropRgb = new Uint8Array(cropW * cropH * 3);
  const cropTrimap = new Uint8Array(cropW * cropH);

  const sxScale = bw / cropW;
  const syScale = bh / cropH;

  for (let y = 0; y < cropH; y++) {
    const gy = by0 + (y + 0.5) * syScale - 0.5;
    const y0 = Math.max(0, Math.min(h - 1, Math.floor(gy)));
    const y1 = Math.min(h - 1, y0 + 1);
    const fy = Math.max(0, Math.min(1, gy - y0));

    // Nearest pixel for crisp trimap class labels (0 / 128 / 255)
    const yn = Math.max(0, Math.min(h - 1, Math.round(gy)));

    for (let x = 0; x < cropW; x++) {
      const gx = bx0 + (x + 0.5) * sxScale - 0.5;
      const x0 = Math.max(0, Math.min(w - 1, Math.floor(gx)));
      const x1 = Math.min(w - 1, x0 + 1);
      const fx = Math.max(0, Math.min(1, gx - x0));
      const xn = Math.max(0, Math.min(w - 1, Math.round(gx)));

      const i00 = (y0 * w + x0) * 4;
      const i01 = (y0 * w + x1) * 4;
      const i10 = (y1 * w + x0) * 4;
      const i11 = (y1 * w + x1) * 4;

      const w00 = (1 - fx) * (1 - fy);
      const w01 = fx * (1 - fy);
      const w10 = (1 - fx) * fy;
      const w11 = fx * fy;

      const dstIdx = (y * cropW + x) * 3;
      cropRgb[dstIdx] = Math.round(rgba[i00] * w00 + rgba[i01] * w01 + rgba[i10] * w10 + rgba[i11] * w11);
      cropRgb[dstIdx + 1] = Math.round(rgba[i00 + 1] * w00 + rgba[i01 + 1] * w01 + rgba[i10 + 1] * w10 + rgba[i11 + 1] * w11);
      cropRgb[dstIdx + 2] = Math.round(rgba[i00 + 2] * w00 + rgba[i01 + 2] * w01 + rgba[i10 + 2] * w10 + rgba[i11 + 2] * w11);

      cropTrimap[y * cropW + x] = trimap[yn * w + xn];
    }
  }

  return { cropRgb, cropTrimap, cropW, cropH };
}

/**
 * Runs complete SOTA C-WASM Matting + ViTMatte-S (optional) + Photoroom Blur-Fusion pipeline.
 * Returns final halo-free RGBA buffer matching input `(width, height)`.
 */
export async function refineNeuralAlphaWithWasm(
  options: MattingRefinementOptions
): Promise<Uint8ClampedArray> {
  const {
    rawMask,
    maskWidth,
    maskHeight,
    rgba,
    width,
    height,
    vitmatteRunner = null,
    vitmatteMaxSide = 640,
    enableBlurFusion = true,
  } = options;

  const wasm = await getWasmMattingExports();

  // Bound peak WASM working resolution to 2048px on longest side so even 24MP DSLR photos
  // run fast (< 80ms) with bounded WASM heap (< 180MB), while transferring full-res solid interiors.
  const maxWorkSide = 2048;
  const needsDownscale = Math.max(width, height) > maxWorkSide;
  const workW = needsDownscale
    ? Math.max(16, Math.round((width * maxWorkSide) / Math.max(width, height)))
    : width;
  const workH = needsDownscale
    ? Math.max(16, Math.round((height * maxWorkSide) / Math.max(width, height)))
    : height;

  const workRgba = needsDownscale ? resizeRgbaBilinear(rgba, width, height, workW, workH) : rgba;
  const workN = workW * workH;
  const maskN = maskWidth * maskHeight;

  wasm.reset_heap();

  // Allocate primary WASM buffers
  const rawMaskPtr = wasm.alloc_bytes(maskN * 4);
  const alphaPtr = wasm.alloc_bytes(workN * 4);
  const rgbaPtr = wasm.alloc_bytes(workN * 4);
  const outRgbaPtr = wasm.alloc_bytes(workN * 4);
  const trimapPtr = wasm.alloc_bytes(workN);
  const metaPtr = wasm.alloc_bytes(6 * 4);

  if (!rawMaskPtr || !alphaPtr || !rgbaPtr || !outRgbaPtr || !trimapPtr || !metaPtr) {
    throw new Error('WASM heap allocation failed for matting pipeline');
  }

  // Copy raw neural probabilities/logits & working RGB into WASM memory
  new Float32Array(wasm.memory.buffer, rawMaskPtr, maskN).set(rawMask);
  new Uint8Array(wasm.memory.buffer, rgbaPtr, workN * 4).set(workRgba);

  // 1. Convert logits via sigmoid if needed, then Catmull-Rom bicubic upsample to working resolution
  wasm.apply_sigmoid_if_logits(rawMaskPtr, maskN);
  wasm.bicubic_upsample_f32(rawMaskPtr, maskWidth, maskHeight, alphaPtr, workW, workH);

  // 2. Connected-component island cleaner (remove stray background confetti)
  wasm.clean_islands_f32(alphaPtr, workW, workH);

  // 3. Stage-2 Trimap-Guided ViTMatte-S Hair/Fur Refinement (if runner supplied)
  let vitmatteApplied = false;
  if (vitmatteRunner) {
    const erodeR = Math.max(3, Math.min(14, Math.round(Math.max(workW, workH) * 0.008)));
    const dilateR = Math.max(6, Math.min(26, Math.round(Math.max(workW, workH) * 0.016)));

    wasm.build_adaptive_trimap(alphaPtr, workW, workH, trimapPtr, erodeR, dilateR, metaPtr);
    const meta = new Int32Array(wasm.memory.buffer, metaPtr, 6);
    const rawBx0 = meta[0];
    const rawBy0 = meta[1];
    const rawBx1 = meta[2];
    const rawBy1 = meta[3];
    const unknownCount = meta[4];
    const fgCount = meta[5];

    if (unknownCount > 256 && fgCount > 64 && rawBx1 > rawBx0 && rawBy1 > rawBy0) {
      const subjW = rawBx1 - rawBx0 + 1;
      const subjH = rawBy1 - rawBy0 + 1;
      const pad = Math.max(16, Math.round(Math.max(subjW, subjH) * 0.12));
      const bx0 = Math.max(0, rawBx0 - pad);
      const by0 = Math.max(0, rawBy0 - pad);
      const bx1 = Math.min(workW - 1, rawBx1 + pad);
      const by1 = Math.min(workH - 1, rawBy1 + pad);
      const bw = bx1 - bx0 + 1;
      const bh = by1 - by0 + 1;

      // Copy trimap view safely before async call
      const trimapCopy = new Uint8Array(wasm.memory.buffer, trimapPtr, workN).slice();
      const { cropRgb, cropTrimap, cropW, cropH } = prepareVitMatteCrop(
        workRgba,
        trimapCopy,
        workW,
        workH,
        bx0,
        by0,
        bw,
        bh,
        vitmatteMaxSide
      );

      try {
        const vitOut = await vitmatteRunner(cropRgb, cropTrimap, cropW, cropH);
        if (vitOut && vitOut.alphas.length >= cropW * cropH) {
          const vitPtr = wasm.alloc_bytes(vitOut.alphas.length * 4);
          if (vitPtr) {
            new Float32Array(wasm.memory.buffer, vitPtr, vitOut.alphas.length).set(vitOut.alphas);
            wasm.merge_vitmatte_crop(
              alphaPtr,
              workW,
              workH,
              trimapPtr,
              vitPtr,
              vitOut.padW,
              cropW,
              cropH,
              bx0,
              by0,
              bw,
              bh
            );
            vitmatteApplied = true;
          }
        }
      } catch (vitErr) {
        console.warn('[wasmMatting] Stage-2 ViTMatte refinement skipped:', vitErr);
      }
    }
  }

  // 4. He et al. Full 3x3 RGB Color Fast Guided Filter in boundary edge band
  const guidedRadius = Math.max(3, Math.min(10, Math.round(Math.max(workW, workH) * 0.005)));
  const guidedBlend = vitmatteApplied ? 0.45 : 0.80;
  wasm.fast_guided_filter_rgb(rgbaPtr, alphaPtr, workW, workH, guidedRadius, 1e-4, guidedBlend);

  // 5. Gentle sub-threshold background haze cleanup (preserves 3%-95% soft hair wisps)
  wasm.soft_calibrate_matte(alphaPtr, workN, 0.012, 0.988);

  // 6. Photoroom 2-Pass Blur-Fusion Foreground Color Estimation
  let workOutRgba: Uint8ClampedArray;
  if (enableBlurFusion) {
    const r1 = Math.max(24, Math.min(90, Math.round(Math.max(workW, workH) * 0.045)));
    const r2 = Math.max(4, Math.min(8, Math.round(Math.max(workW, workH) * 0.0055)));
    wasm.blur_fusion_foreground_composite(rgbaPtr, alphaPtr, outRgbaPtr, workW, workH, r1, r2);
    workOutRgba = new Uint8ClampedArray(wasm.memory.buffer, outRgbaPtr, workN * 4).slice();
  } else {
    const finalAlpha = new Float32Array(wasm.memory.buffer, alphaPtr, workN);
    workOutRgba = new Uint8ClampedArray(workRgba);
    for (let i = 0; i < workN; i++) {
      workOutRgba[i * 4 + 3] = Math.round(Math.max(0, Math.min(1, finalAlpha[i])) * 255);
    }
  }

  // If image was within 2048px limit, workOutRgba IS the exact full-resolution result!
  if (!needsDownscale) {
    return workOutRgba;
  }

  // Otherwise, preserve 100% original crisp pixels for solid interior at full resolution (>2048px),
  // while transferring bicubic-upscaled alpha + Blur-Fusion decontaminated foreground edge colors.
  const fullN = width * height;
  const fullOut = new Uint8ClampedArray(fullN * 4);
  const scaleX = workW / width;
  const scaleY = workH / height;

  for (let y = 0; y < height; y++) {
    const gy = (y + 0.5) * scaleY - 0.5;
    const y0 = Math.max(0, Math.min(workH - 1, Math.floor(gy)));
    const y1 = Math.min(workH - 1, y0 + 1);
    const fy = Math.max(0, Math.min(1, gy - y0));

    for (let x = 0; x < width; x++) {
      const gx = (x + 0.5) * scaleX - 0.5;
      const x0 = Math.max(0, Math.min(workW - 1, Math.floor(gx)));
      const x1 = Math.min(workW - 1, x0 + 1);
      const fx = Math.max(0, Math.min(1, gx - x0));

      const i00 = (y0 * workW + x0) * 4;
      const i01 = (y0 * workW + x1) * 4;
      const i10 = (y1 * workW + x0) * 4;
      const i11 = (y1 * workW + x1) * 4;

      const w00 = (1 - fx) * (1 - fy);
      const w01 = fx * (1 - fy);
      const w10 = (1 - fx) * fy;
      const w11 = fx * fy;

      const a = Math.round(
        workOutRgba[i00 + 3] * w00 +
          workOutRgba[i01 + 3] * w01 +
          workOutRgba[i10 + 3] * w10 +
          workOutRgba[i11 + 3] * w11
      );

      const fi = (y * width + x) * 4;
      if (a >= 253) {
        fullOut[fi] = rgba[fi];
        fullOut[fi + 1] = rgba[fi + 1];
        fullOut[fi + 2] = rgba[fi + 2];
        fullOut[fi + 3] = 255;
      } else {
        fullOut[fi] = Math.round(
          workOutRgba[i00] * w00 +
            workOutRgba[i01] * w01 +
            workOutRgba[i10] * w10 +
            workOutRgba[i11] * w11
        );
        fullOut[fi + 1] = Math.round(
          workOutRgba[i00 + 1] * w00 +
            workOutRgba[i01 + 1] * w01 +
            workOutRgba[i10 + 1] * w10 +
            workOutRgba[i11 + 1] * w11
        );
        fullOut[fi + 2] = Math.round(
          workOutRgba[i00 + 2] * w00 +
            workOutRgba[i01 + 2] * w01 +
            workOutRgba[i10 + 2] * w10 +
            workOutRgba[i11 + 2] * w11
        );
        fullOut[fi + 3] = a <= 2 ? 0 : a;
      }
    }
  }

  return fullOut;
}
