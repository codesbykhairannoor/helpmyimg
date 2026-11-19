// src/utils/wasmEncoder.ts
// Pure Client-Side WebAssembly Codecs, Vectorizers & Resamplers:
// MozJPEG, OxiPNG (Rust WASM), UPNG Palette Quantizer (TinyPNG-grade), LibWebP, LibAVIF, LibJXL,
// Lanczos3 / MagicKernelSharp2021 / HQX WASM Resizers, Potrace WASM + Full-Color SVG Vectorizer.

export type ResizeKernelMethod = 'lanczos3' | 'magicKernelSharp2021' | 'mitchell' | 'hqx';
export type SvgVectorMode = 'color' | 'monochrome';
export type PngCompressMode = 'quant' | 'lossless';

/**
 * Extract ImageData cleanly from an HTMLCanvasElement
 */
export function getCanvasImageData(canvas: HTMLCanvasElement): ImageData {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Encode ImageData using MozJPEG WASM (trellis quantization + progressive Huffman optimization)
 */
export async function encodeMozJpeg(imageData: ImageData, quality: number = 0.85): Promise<Blob> {
  const encodeJpeg = (await import('@jsquash/jpeg/encode')).default;
  const qPct = Math.max(5, Math.min(100, Math.round(quality * 100)));
  const buffer = await encodeJpeg(imageData, {
    quality: qPct,
    progressive: true,
    optimize_coding: true,
    trellis_multipass: true,
    trellis_opt_zero: true,
  });
  return new Blob([buffer], { type: 'image/jpeg' });
}

/**
 * Encode PNG with either:
 * - 'quant': UPNG 256-color perceptual quantization + Rust OxiPNG lossless pass (TinyPNG-class 60-80% size reduction with alpha preserved)
 * - 'lossless': Pure Rust OxiPNG lossless compression
 */
export async function encodePngWasm(
  imageData: ImageData,
  quality: number = 0.9,
  mode: PngCompressMode = 'lossless'
): Promise<Blob> {
  if (mode === 'quant' || quality < 0.9) {
    // @ts-ignore - upng-js ships without official TS declaration
    const mod: any = await import('upng-js');
    const UPNG = mod.default || mod;
    // Map quality 0.1..0.9 -> color count 32..256 (0 means lossless in UPNG)
    const cnum = quality >= 0.95 ? 0 : Math.max(24, Math.min(256, Math.round(32 + quality * 224)));
    const rgbaSlice = imageData.data.buffer.slice(
      imageData.data.byteOffset,
      imageData.data.byteOffset + imageData.data.byteLength
    );
    const quantBuffer: ArrayBuffer = UPNG.encode([rgbaSlice], imageData.width, imageData.height, cnum);
    try {
      const optimisePng = (await import('@jsquash/oxipng/optimise')).default;
      const optimised = await optimisePng(quantBuffer, { level: 2, interlace: false, optimiseAlpha: true });
      return new Blob([optimised], { type: 'image/png' });
    } catch {
      return new Blob([quantBuffer], { type: 'image/png' });
    }
  }

  const optimisePng = (await import('@jsquash/oxipng/optimise')).default;
  const optimised = await optimisePng(imageData, { level: 2, interlace: false, optimiseAlpha: true });
  return new Blob([optimised], { type: 'image/png' });
}

/**
 * Encode WebP using libwebp WASM
 */
export async function encodeWebpWasm(imageData: ImageData, quality: number = 0.88): Promise<Blob> {
  const encodeWebp = (await import('@jsquash/webp/encode')).default;
  const qPct = Math.max(5, Math.min(100, Math.round(quality * 100)));
  const buffer = await encodeWebp(imageData, { quality: qPct });
  return new Blob([buffer], { type: 'image/webp' });
}

/**
 * Encode AVIF using libavif WASM (works across all browsers including Safari/older Chromium)
 */
export async function encodeAvifWasm(imageData: ImageData, quality: number = 0.8): Promise<Blob> {
  const encodeAvif = (await import('@jsquash/avif/encode')).default;
  const qPct = Math.max(5, Math.min(100, Math.round(quality * 100)));
  const buffer = await encodeAvif(imageData, {
    quality: qPct,
    speed: 6,
  });
  return new Blob([buffer], { type: 'image/avif' });
}

/**
 * Encode next-gen JPEG XL (`.jxl`) using libjxl WASM
 */
export async function encodeJxlWasm(imageData: ImageData, quality: number = 0.85): Promise<Blob> {
  const encodeJxl = (await import('@jsquash/jxl/encode')).default;
  const qPct = Math.max(5, Math.min(100, Math.round(quality * 100)));
  const buffer = await encodeJxl(imageData, {
    quality: qPct,
    effort: 5,
    lossless: qPct >= 99,
  });
  return new Blob([buffer], { type: 'image/jxl' });
}

/**
 * High-precision Rust/WASM Image Resampling:
 * - lanczos3: Razor-sharp downscale & standard photography
 * - magicKernelSharp2021: Ultra-crisp 4K enlarging & sharpening kernel
 * - mitchell: Smooth studio bicubic-family filter
 * - hqx: Pixel-art / crisp icon edge-preserving scaler (2x/3x/4x)
 */
export async function resizeImageDataWasm(
  imageData: ImageData,
  targetWidth: number,
  targetHeight: number,
  method: ResizeKernelMethod = 'lanczos3'
): Promise<ImageData> {
  const w = Math.max(1, Math.round(targetWidth));
  const h = Math.max(1, Math.round(targetHeight));
  if (w === imageData.width && h === imageData.height) {
    return imageData;
  }

  const wasmResize = (await import('@jsquash/resize')).default;

  // @jsquash/resize `hqx` requires integer scale factor on square or proportional steps;
  // run hqx step first then Lanczos3 if exact target differs.
  if (method === 'hqx') {
    const ratio = Math.max(w / imageData.width, h / imageData.height);
    if (ratio >= 1.5 && imageData.width <= 1200 && imageData.height <= 1200) {
      const hqxScale = ratio >= 3.5 ? 4 : ratio >= 2.5 ? 3 : 2;
      const hqxOut = await wasmResize(imageData, {
        width: imageData.width * hqxScale,
        height: imageData.height * hqxScale,
        method: 'hqx',
        fitMethod: 'stretch',
        premultiply: true,
        linearRGB: true,
      });
      if (hqxOut.width === w && hqxOut.height === h) {
        return hqxOut;
      }
      return wasmResize(hqxOut, {
        width: w,
        height: h,
        method: 'lanczos3',
        fitMethod: 'stretch',
        premultiply: true,
        linearRGB: true,
      });
    }
    // Fallback to lanczos3 when shrinking
    return wasmResize(imageData, {
      width: w,
      height: h,
      method: 'lanczos3',
      fitMethod: 'stretch',
      premultiply: true,
      linearRGB: true,
    });
  }

  return wasmResize(imageData, {
    width: w,
    height: h,
    method,
    fitMethod: 'stretch',
    premultiply: true,
    linearRGB: method !== 'mitchell',
  });
}

/**
 * True Raster-to-SVG Vector Tracer (Zero raster <image> wrapper!)
 * - 'color': Full-color multi-layer SVG Bezier curves (`imagetracerjs`)
 * - 'monochrome': Ultra-clean monochrome vector logo trace (`esm-potrace-wasm`)
 */
export async function vectorizeToSvgBlob(
  canvas: HTMLCanvasElement,
  mode: SvgVectorMode = 'color'
): Promise<Blob> {
  // Constrain oversized photos slightly before tracing to prevent multi-MB pathological SVGs
  const maxTraceDim = 1280;
  let traceCanvas = canvas;
  if (canvas.width > maxTraceDim || canvas.height > maxTraceDim) {
    const ratio = Math.min(maxTraceDim / canvas.width, maxTraceDim / canvas.height);
    traceCanvas = document.createElement('canvas');
    traceCanvas.width = Math.max(1, Math.round(canvas.width * ratio));
    traceCanvas.height = Math.max(1, Math.round(canvas.height * ratio));
    const tCtx = traceCanvas.getContext('2d');
    if (tCtx) {
      tCtx.imageSmoothingEnabled = true;
      tCtx.imageSmoothingQuality = 'high';
      tCtx.drawImage(canvas, 0, 0, traceCanvas.width, traceCanvas.height);
    }
  }

  try {
    if (mode === 'monochrome') {
      const { potrace, init } = await import('esm-potrace-wasm');
      await init();
      // Composite onto white so dark/black logos trace accurately
      const monoCanvas = document.createElement('canvas');
      monoCanvas.width = traceCanvas.width;
      monoCanvas.height = traceCanvas.height;
      const mCtx = monoCanvas.getContext('2d');
      if (mCtx) {
        mCtx.fillStyle = '#FFFFFF';
        mCtx.fillRect(0, 0, monoCanvas.width, monoCanvas.height);
        mCtx.drawImage(traceCanvas, 0, 0);
      }
      const svgString = await potrace(monoCanvas, {
        turdsize: 2,
        alphamax: 1,
        opticurve: 1,
        opttolerance: 0.2,
      });
      return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    }

    // Full-color multi-path SVG curve tracing
    // @ts-ignore - imagetracerjs ships without TS types
    const mod: any = await import('imagetracerjs');
    const ImageTracer = mod.default || mod;
    const imgData = getCanvasImageData(traceCanvas);
    const svgString: string = ImageTracer.imagedataToSVG(imgData, {
      numberofcolors: 24,
      ltres: 1,
      qtres: 1,
      pathomit: 8,
      scale: 1,
      roundcoords: 1,
      viewbox: true,
      desc: false,
    });
    return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  } finally {
    if (traceCanvas !== canvas) {
      traceCanvas.width = 0;
      traceCanvas.height = 0;
    }
  }
}
