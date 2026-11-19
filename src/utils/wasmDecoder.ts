// src/utils/wasmDecoder.ts
// Pure Client-Side Universal Image Decoder powered by WebAssembly
// Decodes HEIC/HEIF, Camera RAW (CR2/NEF/ARW/DNG/RAF/RW2), Photoshop PSD, TIFF, JPEG XL (.jxl), and AVIF fallback.

const RAW_EXTENSIONS = new Set([
  'cr2',
  'cr3',
  'nef',
  'nrw',
  'arw',
  'srf',
  'sr2',
  'dng',
  'raf',
  'rw2',
  'orf',
  'pef',
  'srw',
  'raw',
  'mrw',
  'erf',
  'rwl',
  '3fr',
  'fff',
]);

const HEIC_EXTENSIONS = new Set(['heic', 'heif', 'hif']);
const TIFF_EXTENSIONS = new Set(['tif', 'tiff']);

function getExtension(file: File | Blob): string {
  if (file instanceof File && file.name) {
    const idx = file.name.lastIndexOf('.');
    if (idx !== -1) return file.name.slice(idx + 1).trim().toLowerCase();
  }
  return '';
}

export function isRawExtension(ext: string): boolean {
  return RAW_EXTENSIONS.has(ext.toLowerCase());
}

export function needsForeignDecode(file: File | Blob): boolean {
  const ext = getExtension(file);
  const type = (file.type || '').toLowerCase();

  if (
    HEIC_EXTENSIONS.has(ext) ||
    type.includes('heic') ||
    type.includes('heif') ||
    RAW_EXTENSIONS.has(ext) ||
    ext === 'psd' ||
    type.includes('photoshop') ||
    TIFF_EXTENSIONS.has(ext) ||
    type.includes('tiff') ||
    ext === 'jxl' ||
    type.includes('jxl')
  ) {
    return true;
  }
  return false;
}

function imageDataToPngBlob(imageData: ImageData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');
  ctx.putImageData(imageData, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0;
        canvas.height = 0;
        if (blob) resolve(blob);
        else reject(new Error('Failed to encode decoded frame to PNG'));
      },
      'image/png',
      1.0
    );
  });
}

function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to export PSD composite canvas'));
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Decode Apple HEIC/HEIF using libheif WASM (`heic-to`)
 */
async function decodeHeicBlob(file: Blob): Promise<Blob> {
  const { heicTo } = await import('heic-to');
  const bitmap = await heicTo({ blob: file, type: 'bitmap' });
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable for HEIC');
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close?.();
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        canvas.width = 0;
        canvas.height = 0;
        if (blob) resolve(blob);
        else reject(new Error('Failed to render HEIC to PNG'));
      },
      'image/png',
      1.0
    );
  });
}

/**
 * Decode Next-Gen JPEG XL (`.jxl`) using libjxl WASM (`@jsquash/jxl`)
 */
async function decodeJxlBlob(file: Blob): Promise<Blob> {
  const decodeJxl = (await import('@jsquash/jxl/decode')).default;
  const buffer = await file.arrayBuffer();
  const imageData = await decodeJxl(buffer);
  return imageDataToPngBlob(imageData);
}

/**
 * Decode AVIF via libavif WASM (`@jsquash/avif/decode`) when browser native decode fails
 */
export async function decodeAvifFallback(file: Blob): Promise<Blob> {
  const decodeAvif = (await import('@jsquash/avif/decode')).default;
  const buffer = await file.arrayBuffer();
  const imageData = await decodeAvif(buffer);
  if (!imageData) throw new Error('LibAVIF WASM could not decode AVIF file');
  return imageDataToPngBlob(imageData);
}

/**
 * Decode TIFF using `utif`
 */
async function decodeTiffBlob(file: Blob): Promise<Blob> {
  const mod: any = await import('utif');
  const UTIF = mod.default || mod;
  const buffer = await file.arrayBuffer();
  const ifds = UTIF.decode(buffer);
  if (!ifds || ifds.length === 0) throw new Error('Empty or invalid TIFF file');
  const firstPage = ifds[0];
  UTIF.decodeImage(buffer, firstPage);
  const rgba = UTIF.toRGBA8(firstPage);
  const width = firstPage.width;
  const height = firstPage.height;
  const imageData = new ImageData(new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.byteLength), width, height);
  return imageDataToPngBlob(imageData);
}

/**
 * Decode Adobe Photoshop PSD using `ag-psd`
 */
async function decodePsdBlob(file: Blob): Promise<Blob> {
  const { readPsd } = await import('ag-psd');
  const buffer = await file.arrayBuffer();
  const psd = readPsd(buffer);
  if (psd.canvas) {
    return canvasToPngBlob(psd.canvas);
  }
  if (psd.imageData) {
    return imageDataToPngBlob(psd.imageData as ImageData);
  }
  throw new Error('PSD does not contain a composite image layer');
}

/**
 * Decode Professional Camera RAW (CR2, NEF, ARW, DNG, RAF, RW2, ORF) via LibRaw WASM
 */
async function decodeCameraRawBlob(file: Blob): Promise<Blob> {
  const { LibRaw } = await import('@colorhythm/libraw-wasm');
  const wasmUrlMod = await import('@colorhythm/libraw-wasm/libraw.wasm?url');
  const wasmUrl = wasmUrlMod.default;
  await LibRaw.initialize(fetch(wasmUrl));

  const raw = new LibRaw();
  await raw.waitUntilReady();

  try {
    const buffer = await file.arrayBuffer();
    raw.open(buffer);

    try {
      raw.unpack();
      raw.raw2image();
      raw.dcrawProcess();
      const processed = raw.dcrawMakeMemImage();
      const { width, height, colors, bits, data } = processed;

      // Convert raw processed image to RGBA ImageData
      if (processed.type === 'LIBRAW_IMAGE_JPEG') {
        const bytes = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        return new Blob([bytes], { type: 'image/jpeg' });
      }

      const numPixels = width * height;
      const rgba = new Uint8ClampedArray(numPixels * 4);
      const is16Bit = bits === 16;

      for (let i = 0; i < numPixels; i++) {
        if (is16Bit) {
          const srcIdx = i * colors * 2;
          rgba[i * 4] = data[srcIdx + 1] ?? 0;
          rgba[i * 4 + 1] = colors >= 3 ? (data[srcIdx + 3] ?? 0) : rgba[i * 4];
          rgba[i * 4 + 2] = colors >= 3 ? (data[srcIdx + 5] ?? 0) : rgba[i * 4];
          rgba[i * 4 + 3] = colors === 4 ? (data[srcIdx + 7] ?? 255) : 255;
        } else {
          const srcIdx = i * colors;
          rgba[i * 4] = data[srcIdx] ?? 0;
          rgba[i * 4 + 1] = colors >= 3 ? (data[srcIdx + 1] ?? 0) : rgba[i * 4];
          rgba[i * 4 + 2] = colors >= 3 ? (data[srcIdx + 2] ?? 0) : rgba[i * 4];
          rgba[i * 4 + 3] = colors === 4 ? (data[srcIdx + 3] ?? 255) : 255;
        }
      }

      const imageData = new ImageData(rgba, width, height);
      return await imageDataToPngBlob(imageData);
    } catch (rawErr) {
      // Fallback to embedded high-res JPEG preview thumbnail inside RAW container
      raw.unpackThumb();
      const thumb = raw.dcrawMakeMemThumb();
      const bytes = new Uint8Array(thumb.data.buffer, thumb.data.byteOffset, thumb.data.byteLength);
      if (thumb.type === 'LIBRAW_IMAGE_JPEG') {
        return new Blob([bytes], { type: 'image/jpeg' });
      }
      throw rawErr;
    }
  } finally {
    raw.dispose();
  }
}

/**
 * Sniff binary magic bytes to detect HEIC/TIFF/PSD/JXL even if extension/MIME is missing
 */
async function sniffHeader(file: Blob): Promise<'heic' | 'psd' | 'tiff' | 'jxl' | null> {
  if (file.size < 16) return null;
  const header = new Uint8Array(await file.slice(0, 16).arrayBuffer());

  // PSD: "8BPS"
  if (header[0] === 0x38 && header[1] === 0x42 && header[2] === 0x50 && header[3] === 0x53) {
    return 'psd';
  }
  // TIFF: II*\0 or MM\0*
  if (
    (header[0] === 0x49 && header[1] === 0x49 && header[2] === 0x2a && header[3] === 0x00) ||
    (header[0] === 0x4d && header[1] === 0x4d && header[2] === 0x00 && header[3] === 0x2a)
  ) {
    return 'tiff';
  }
  // JXL: 0xFF 0x0A codestream or ISO BMFF "...JXL "
  if (
    (header[0] === 0xff && header[1] === 0x0a) ||
    (header[4] === 0x4a && header[5] === 0x58 && header[6] === 0x4c && header[7] === 0x20)
  ) {
    return 'jxl';
  }
  // HEIC/HEIF: ftyp at bytes 4..7 followed by heic/heix/mif1/msf1/hevc
  if (header[4] === 0x66 && header[5] === 0x74 && header[6] === 0x79 && header[7] === 0x70) {
    const brand = String.fromCharCode(header[8], header[9], header[10], header[11]);
    if (['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand)) {
      return 'heic';
    }
  }
  return null;
}

/**
 * Universally decode any foreign/pro image format into a browser-compatible PNG/JPEG Blob.
 * Returns original blob untouched for native browser formats (PNG, JPG, WebP, GIF, BMP, SVG).
 */
export async function decodeForeignImageToPngBlob(file: File | Blob): Promise<{ blob: Blob; decoded: boolean }> {
  const ext = getExtension(file);
  const type = (file.type || '').toLowerCase();

  try {
    if (HEIC_EXTENSIONS.has(ext) || type.includes('heic') || type.includes('heif')) {
      return { blob: await decodeHeicBlob(file), decoded: true };
    }
    if (ext === 'jxl' || type.includes('jxl')) {
      return { blob: await decodeJxlBlob(file), decoded: true };
    }
    if (ext === 'psd' || type.includes('photoshop')) {
      return { blob: await decodePsdBlob(file), decoded: true };
    }
    if (TIFF_EXTENSIONS.has(ext) || type.includes('tiff')) {
      return { blob: await decodeTiffBlob(file), decoded: true };
    }
    if (RAW_EXTENSIONS.has(ext)) {
      return { blob: await decodeCameraRawBlob(file), decoded: true };
    }

    // Header sniff if extension wasn't definitive
    const sniffed = await sniffHeader(file);
    if (sniffed === 'heic') return { blob: await decodeHeicBlob(file), decoded: true };
    if (sniffed === 'jxl') return { blob: await decodeJxlBlob(file), decoded: true };
    if (sniffed === 'psd') return { blob: await decodePsdBlob(file), decoded: true };
    if (sniffed === 'tiff') return { blob: await decodeTiffBlob(file), decoded: true };
  } catch (err) {
    console.warn('[WasmDecoder] Foreign decode fallback triggered:', err);
    throw err;
  }

  return { blob: file, decoded: false };
}

export const ACCEPTED_UPLOAD_TYPES =
  'image/*,.svg,.heic,.heif,.jxl,.psd,.tif,.tiff,.cr2,.cr3,.nef,.arw,.dng,.raf,.rw2,.orf,.pef,image/svg+xml,image/png,image/jpeg,image/webp,image/jpg,image/avif,image/jxl,image/heic,image/heif,image/tiff,image/gif,image/bmp,image/x-icon';
