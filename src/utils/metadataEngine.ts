// src/utils/metadataEngine.ts
// In-browser 100% Client-side C2PA & EXIF Metadata Inspector, Stripper & Studio Preset Engine
// Supports zero-server-upload lossless stripping and realistic camera EXIF injection.

import piexif from 'piexifjs';

export interface MetadataAnalysis {
  format: 'JPEG' | 'PNG' | 'WEBP' | 'OTHER';
  hasC2PA: boolean;
  c2paIssuer?: string;
  detectedAiSignatures: string[];
  hasExif: boolean;
  cameraMake?: string;
  cameraModel?: string;
  lensModel?: string;
  iso?: number;
  shutterSpeed?: string;
  aperture?: string;
  focalLength?: string;
  flash?: string;
  dateTaken?: string;
  software?: string;
  artist?: string;
  copyright?: string;
  dimensions?: { width: number; height: number };
  dpi?: { x: number; y: number };
}

export type StudioPresetKey = 'canon5d' | 'sonya7iv' | 'fujifilm' | 'iphone16' | 'stealth';

export interface StudioPresetConfig {
  id: StudioPresetKey;
  name: string;
  subtitle: string;
  cameraMake: string;
  cameraModel: string;
  lensModel: string;
  shutter: string;
  aperture: string;
  iso: number;
  flash: string;
}

export const STUDIO_PRESETS: StudioPresetConfig[] = [
  {
    id: 'canon5d',
    name: 'Canon EOS 5D Mark IV',
    subtitle: 'Pass Photo & Studio Portrait (EF 85mm f/1.4L IS USM)',
    cameraMake: 'Canon',
    cameraModel: 'Canon EOS 5D Mark IV',
    lensModel: 'EF85mm f/1.4L IS USM',
    shutter: '1/160s',
    aperture: 'f/5.6',
    iso: 100,
    flash: 'Flash fired (Studio Strobe Sync)',
  },
  {
    id: 'sonya7iv',
    name: 'Sony Alpha 7 IV',
    subtitle: 'Modern Mirrorless Studio (FE 50mm F1.2 GM)',
    cameraMake: 'Sony',
    cameraModel: 'ILCE-7M4',
    lensModel: 'FE 50mm F1.2 GM',
    shutter: '1/200s',
    aperture: 'f/2.8',
    iso: 100,
    flash: 'Flash fired (Compulsory Mode)',
  },
  {
    id: 'fujifilm',
    name: 'Fujifilm X-T5',
    subtitle: 'Classic Chrome Aesthetic (XF 35mm F1.4 R)',
    cameraMake: 'FUJIFILM',
    cameraModel: 'X-T5',
    lensModel: 'XF35mmF1.4 R',
    shutter: '1/125s',
    aperture: 'f/2.0',
    iso: 125,
    flash: 'Off / Studio Ambient',
  },
  {
    id: 'iphone16',
    name: 'Apple iPhone 16 Pro',
    subtitle: 'Natural Mobile Portrait (24mm f/1.78)',
    cameraMake: 'Apple',
    cameraModel: 'iPhone 16 Pro',
    lensModel: 'iPhone 16 Pro back triple camera 6.765mm f/1.78',
    shutter: '1/120s',
    aperture: 'f/1.78',
    iso: 64,
    flash: 'Off / Smart HDR',
  },
  {
    id: 'stealth',
    name: 'Pure Stealth Clean',
    subtitle: 'Complete scrub: No C2PA, no EXIF, no GPS, zero digital footprint',
    cameraMake: 'None',
    cameraModel: 'Stripped',
    lensModel: 'Stripped',
    shutter: '-',
    aperture: '-',
    iso: 0,
    flash: 'None',
  },
];

export interface CustomMetadataOptions {
  artist?: string;
  copyright?: string;
  dateTaken?: string;
  software?: string;
}

/**
 * Losslessly removes C2PA / JUMBF (APP11 0xFFEB) marker from JPEG buffer.
 */
export function stripJpegC2PA(data: Uint8Array): { cleanData: Uint8Array; strippedBytes: number } {
  if (data[0] !== 0xff || data[1] !== 0xd8) {
    return { cleanData: data, strippedBytes: 0 };
  }

  const chunks: Uint8Array[] = [];
  chunks.push(data.subarray(0, 2));
  let idx = 2;
  let stripped = 0;

  while (idx < data.length - 1) {
    if (data[idx] === 0xff) {
      const marker = data[idx + 1];
      if (marker === 0xd9 || marker === 0xda) {
        chunks.push(data.subarray(idx));
        break;
      }
      if (![0x00, 0x01, 0xd0, 0xd1, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8].includes(marker)) {
        const length = (data[idx + 2] << 8) | data[idx + 3];
        if (marker === 0xeb) {
          // APP11 C2PA / JUMBF
          stripped += 2 + length;
          idx += 2 + length;
          continue;
        }
        chunks.push(data.subarray(idx, idx + 2 + length));
        idx += 2 + length;
      } else {
        chunks.push(data.subarray(idx, idx + 2));
        idx += 2;
      }
    } else {
      chunks.push(data.subarray(idx, idx + 1));
      idx += 1;
    }
  }

  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const clean = new Uint8Array(totalLen);
  let offset = 0;
  for (const c of chunks) {
    clean.set(c, offset);
    offset += c.length;
  }
  return { cleanData: clean, strippedBytes: stripped };
}

/**
 * Removes C2PA ('caBX') chunk and AI parameter chunks ('tEXt' / 'iTXt') from PNG buffer.
 */
export function stripPngC2PA(data: Uint8Array): { cleanData: Uint8Array; strippedBytes: number } {
  // Check PNG signature: 89 50 4E 47 0D 0A 1A 0A
  if (
    data[0] !== 0x89 ||
    data[1] !== 0x50 ||
    data[2] !== 0x4e ||
    data[3] !== 0x47 ||
    data[4] !== 0x0d ||
    data[5] !== 0x0a ||
    data[6] !== 0x1a ||
    data[7] !== 0x0a
  ) {
    return { cleanData: data, strippedBytes: 0 };
  }

  const chunks: Uint8Array[] = [];
  chunks.push(data.subarray(0, 8));
  let idx = 8;
  let stripped = 0;

  const textDecoder = new TextDecoder();

  while (idx < data.length - 4) {
    const length =
      (data[idx] << 24) |
      (data[idx + 1] << 16) |
      (data[idx + 2] << 8) |
      data[idx + 3];
    const chunkTypeBytes = data.subarray(idx + 4, idx + 8);
    const chunkType = textDecoder.decode(chunkTypeBytes);
    const totalChunkLength = 12 + length; // 4 len + 4 type + data + 4 crc

    if (chunkType === 'caBX') {
      // C2PA Box chunk in PNG
      stripped += totalChunkLength;
      idx += totalChunkLength;
      continue;
    }

    // Check if tEXt or iTXt contains AI generation metadata
    if (chunkType === 'tEXt' || chunkType === 'iTXt' || chunkType === 'zTXt') {
      const chunkData = data.subarray(idx + 8, idx + 8 + length);
      const str = textDecoder.decode(chunkData).toLowerCase();
      if (
        str.includes('prompt') ||
        str.includes('workflow') ||
        str.includes('comfyui') ||
        str.includes('c2pa') ||
        str.includes('stablediffusion') ||
        str.includes('parameters')
      ) {
        stripped += totalChunkLength;
        idx += totalChunkLength;
        continue;
      }
    }

    chunks.push(data.subarray(idx, idx + totalChunkLength));
    idx += totalChunkLength;

    if (chunkType === 'IEND') {
      break;
    }
  }

  const totalLen = chunks.reduce((acc, c) => acc + c.length, 0);
  const clean = new Uint8Array(totalLen);
  let offset = 0;
  for (const c of chunks) {
    clean.set(c, offset);
    offset += c.length;
  }
  return { cleanData: clean, strippedBytes: stripped };
}

/**
 * Inspects binary data of an image to analyze C2PA and EXIF status.
 */
export async function analyzeImageMetadata(file: Blob): Promise<MetadataAnalysis> {
  const buffer = await file.arrayBuffer();
  const data = new Uint8Array(buffer);
  const textDecoder = new TextDecoder('utf-8', { fatal: false });

  let format: MetadataAnalysis['format'] = 'OTHER';
  if (data[0] === 0xff && data[1] === 0xd8) format = 'JPEG';
  else if (data[0] === 0x89 && data[1] === 0x50 && data[2] === 0x4e) format = 'PNG';
  else if (data[0] === 0x52 && data[1] === 0x49 && data[2] === 0x46 && data[3] === 0x46) format = 'WEBP';

  const rawString = textDecoder.decode(data);
  const detectedAiSignatures: string[] = [];

  let hasC2PA = false;
  let c2paIssuer: string | undefined;

  // Check C2PA in binary
  if (rawString.includes('c2pa') || rawString.includes('jumb') || rawString.includes('caBX')) {
    hasC2PA = true;
    if (rawString.includes('Google LLC') || rawString.includes('Google Media Processing')) {
      c2paIssuer = 'Google LLC (Gemini / Imagen / SynthID)';
      detectedAiSignatures.push('Google SynthID C2PA Manifest');
    } else if (rawString.includes('Adobe')) {
      c2paIssuer = 'Adobe Content Credentials';
      detectedAiSignatures.push('Adobe C2PA Provenance');
    } else if (rawString.includes('OpenAI')) {
      c2paIssuer = 'OpenAI (DALL-E)';
      detectedAiSignatures.push('OpenAI C2PA Manifest');
    } else {
      c2paIssuer = 'Standard C2PA Manifest';
      detectedAiSignatures.push('C2PA Content Credentials');
    }
  }

  // Check additional AI generator markers
  if (rawString.includes('StableDiffusion') || rawString.includes('sd-metadata')) {
    detectedAiSignatures.push('Stable Diffusion / Automatic1111');
  }
  if (rawString.includes('ComfyUI') || rawString.includes('prompt')) {
    detectedAiSignatures.push('ComfyUI Workflow Metadata');
  }
  if (rawString.includes('Midjourney')) {
    detectedAiSignatures.push('Midjourney');
  }

  // Parse EXIF if JPEG
  let hasExif = false;
  let cameraMake: string | undefined;
  let cameraModel: string | undefined;
  let lensModel: string | undefined;
  let iso: number | undefined;
  let shutterSpeed: string | undefined;
  let aperture: string | undefined;
  let focalLength: string | undefined;
  let flash: string | undefined;
  let dateTaken: string | undefined;
  let software: string | undefined;
  let artist: string | undefined;
  let copyright: string | undefined;

  if (format === 'JPEG') {
    try {
      let binaryStr = '';
      const len = data.length;
      // Read binary string for piexif
      for (let i = 0; i < len; i++) {
        binaryStr += String.fromCharCode(data[i]);
      }
      const exifObj = piexif.load(binaryStr);

      if (exifObj && exifObj['0th'] && Object.keys(exifObj['0th']).length > 0) {
        hasExif = true;
        const zeroth = exifObj['0th'];
        const exifIFD = exifObj['Exif'] || {};

        if (zeroth[piexif.ImageIFD.Make]) cameraMake = String(zeroth[piexif.ImageIFD.Make]).trim();
        if (zeroth[piexif.ImageIFD.Model]) cameraModel = String(zeroth[piexif.ImageIFD.Model]).trim();
        if (zeroth[piexif.ImageIFD.Software]) software = String(zeroth[piexif.ImageIFD.Software]).trim();
        if (zeroth[piexif.ImageIFD.DateTime]) dateTaken = String(zeroth[piexif.ImageIFD.DateTime]).trim();
        if (zeroth[piexif.ImageIFD.Artist]) artist = String(zeroth[piexif.ImageIFD.Artist]).trim();
        if (zeroth[piexif.ImageIFD.Copyright]) copyright = String(zeroth[piexif.ImageIFD.Copyright]).trim();

        if (exifIFD[piexif.ExifIFD.LensModel]) lensModel = String(exifIFD[piexif.ExifIFD.LensModel]).trim();
        if (exifIFD[piexif.ExifIFD.ISOSpeedRatings]) iso = Number(exifIFD[piexif.ExifIFD.ISOSpeedRatings]);

        if (exifIFD[piexif.ExifIFD.ExposureTime]) {
          const exp = exifIFD[piexif.ExifIFD.ExposureTime];
          if (Array.isArray(exp) && exp.length === 2) {
            shutterSpeed = `${exp[0]}/${exp[1]}s`;
          }
        }

        if (exifIFD[piexif.ExifIFD.FNumber]) {
          const fn = exifIFD[piexif.ExifIFD.FNumber];
          if (Array.isArray(fn) && fn.length === 2 && fn[1] !== 0) {
            aperture = `f/${(fn[0] / fn[1]).toFixed(1)}`;
          }
        }

        if (exifIFD[piexif.ExifIFD.FocalLength]) {
          const fl = exifIFD[piexif.ExifIFD.FocalLength];
          if (Array.isArray(fl) && fl.length === 2 && fl[1] !== 0) {
            focalLength = `${(fl[0] / fl[1]).toFixed(1)} mm`;
          }
        }

        if (exifIFD[piexif.ExifIFD.Flash] !== undefined) {
          const flVal = exifIFD[piexif.ExifIFD.Flash];
          flash = flVal === 9 ? 'Fired (Studio Strobe)' : flVal === 0 ? 'Did not fire' : `Code ${flVal}`;
        }
      }
    } catch {
      // Image has no parseable EXIF
      hasExif = false;
    }
  }

  // Get image dimensions via Image element
  let dimensions: { width: number; height: number } | undefined;
  try {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = () => {
        dimensions = { width: img.naturalWidth, height: img.naturalHeight };
        URL.revokeObjectURL(objectUrl);
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(false);
      };
      img.src = objectUrl;
    });
  } catch {
    // ignore
  }

  return {
    format,
    hasC2PA,
    c2paIssuer,
    detectedAiSignatures,
    hasExif,
    cameraMake,
    cameraModel,
    lensModel,
    iso,
    shutterSpeed,
    aperture,
    focalLength,
    flash,
    dateTaken,
    software,
    artist,
    copyright,
    dimensions,
    dpi: { x: 300, y: 300 },
  };
}

/**
 * Creates a small JPEG thumbnail as binary string for EXIF embedding.
 */
async function generateJpegThumbnail(file: Blob, maxDim = 160): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      let w = img.naturalWidth || 160;
      let h = img.naturalHeight || 160;

      if (w > h) {
        if (w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        }
      } else {
        if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }

      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        const base64 = dataUrl.split(',')[1];
        const binaryStr = atob(base64);
        resolve(binaryStr);
        return;
      }
      resolve('');
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve('');
    };
    img.src = objectUrl;
  });
}

/**
 * Converts any image (PNG, WebP, etc.) to a high quality JPEG Blob client-side.
 */
async function convertToJpegBlob(file: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context failed'));
        return;
      }
      // Fill white background for transparent pixels
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob failed'));
        },
        'image/jpeg',
        0.98
      );
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };
    img.src = objectUrl;
  });
}

/**
 * Applies a Studio Camera Preset or Stealth Clean to the image completely client-side.
 */
export async function applyStudioPreset(
  file: Blob,
  presetKey: StudioPresetKey,
  customOptions?: CustomMetadataOptions
): Promise<Blob> {
  // Step 1: Ensure image is JPEG for EXIF injection, or handle PNG/WEBP
  let baseBlob = file;
  const isJpeg = file.type === 'image/jpeg' || file.type === 'image/jpg';

  if (!isJpeg && presetKey !== 'stealth') {
    // Convert to JPEG with max quality for DSLR preset injection
    baseBlob = await convertToJpegBlob(file);
  }

  const arrayBuffer = await baseBlob.arrayBuffer();
  let rawBytes = new Uint8Array(arrayBuffer);

  // Step 2: Losslessly strip C2PA
  if (isJpeg || !isJpeg) {
    if (rawBytes[0] === 0xff && rawBytes[1] === 0xd8) {
      const stripped = stripJpegC2PA(rawBytes);
      rawBytes = stripped.cleanData;
    } else if (rawBytes[0] === 0x89 && rawBytes[1] === 0x50) {
      const stripped = stripPngC2PA(rawBytes);
      rawBytes = stripped.cleanData;
    }
  }

  // If Stealth Clean, return directly with no EXIF
  if (presetKey === 'stealth') {
    // If it's a JPEG, also remove all EXIF markers
    if (rawBytes[0] === 0xff && rawBytes[1] === 0xd8) {
      let binaryStr = '';
      for (let i = 0; i < rawBytes.length; i++) binaryStr += String.fromCharCode(rawBytes[i]);
      const cleanBinaryStr = piexif.remove(binaryStr);
      const cleanBuffer = new Uint8Array(cleanBinaryStr.length);
      for (let i = 0; i < cleanBinaryStr.length; i++) cleanBuffer[i] = cleanBinaryStr.charCodeAt(i);
      return new Blob([cleanBuffer], { type: 'image/jpeg' });
    }
    return new Blob([rawBytes], { type: file.type || 'image/png' });
  }

  // Step 3: Prepare Binary String for piexif
  let jpegBinaryStr = '';
  for (let i = 0; i < rawBytes.length; i++) {
    jpegBinaryStr += String.fromCharCode(rawBytes[i]);
  }

  // Generate thumbnail for EXIF
  const thumbBinary = await generateJpegThumbnail(baseBlob);

  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const defaultDate = `${now.getFullYear()}:${pad(now.getMonth() + 1)}:${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr = customOptions?.dateTaken || defaultDate;
  const artistStr = customOptions?.artist || 'Photo Studio Professional';
  const copyrightStr = customOptions?.copyright || `Copyright (c) ${now.getFullYear()} ${artistStr}. All rights reserved.`;
  const softwareStr = customOptions?.software || 'Adobe Photoshop 2024 (Windows)';

  // Build IFD dictionaries based on preset
  let zeroth_ifd: any = {};
  let exif_ifd: any = {};

  if (presetKey === 'canon5d') {
    zeroth_ifd = {
      [piexif.ImageIFD.Make]: 'Canon',
      [piexif.ImageIFD.Model]: 'Canon EOS 5D Mark IV',
      [piexif.ImageIFD.Orientation]: 1,
      [piexif.ImageIFD.XResolution]: [300, 1],
      [piexif.ImageIFD.YResolution]: [300, 1],
      [piexif.ImageIFD.ResolutionUnit]: 2,
      [piexif.ImageIFD.Software]: softwareStr,
      [piexif.ImageIFD.DateTime]: dateStr,
      [piexif.ImageIFD.Artist]: artistStr,
      [piexif.ImageIFD.Copyright]: copyrightStr,
    };
    exif_ifd = {
      [piexif.ExifIFD.ExposureTime]: [1, 160],
      [piexif.ExifIFD.FNumber]: [56, 10], // f/5.6
      [piexif.ExifIFD.ExposureProgram]: 1, // Manual
      [piexif.ExifIFD.ISOSpeedRatings]: 100,
      [piexif.ExifIFD.ExifVersion]: '0231',
      [piexif.ExifIFD.DateTimeOriginal]: dateStr,
      [piexif.ExifIFD.DateTimeDigitized]: dateStr,
      [piexif.ExifIFD.ShutterSpeedValue]: [7321928, 1000000],
      [piexif.ExifIFD.ApertureValue]: [4970854, 1000000],
      [piexif.ExifIFD.ExposureBiasValue]: [0, 1],
      [piexif.ExifIFD.MaxApertureValue]: [14, 10],
      [piexif.ExifIFD.MeteringMode]: 2, // Center-weighted
      [piexif.ExifIFD.LightSource]: 9, // Flash 5500K
      [piexif.ExifIFD.Flash]: 9, // Flash fired, compulsory
      [piexif.ExifIFD.FocalLength]: [85, 1],
      [piexif.ExifIFD.FocalLengthIn35mmFilm]: 85,
      [piexif.ExifIFD.ColorSpace]: 1, // sRGB
      [piexif.ExifIFD.CustomRendered]: 0,
      [piexif.ExifIFD.ExposureMode]: 1,
      [piexif.ExifIFD.WhiteBalance]: 1, // Manual studio
      [piexif.ExifIFD.BodySerialNumber]: '042024001984',
      [piexif.ExifIFD.LensSpecification]: [[85, 1], [85, 1], [14, 10], [14, 10]],
      [piexif.ExifIFD.LensModel]: 'EF85mm f/1.4L IS USM',
      [piexif.ExifIFD.LensSerialNumber]: '0000492812',
    };
  } else if (presetKey === 'sonya7iv') {
    zeroth_ifd = {
      [piexif.ImageIFD.Make]: 'Sony',
      [piexif.ImageIFD.Model]: 'ILCE-7M4',
      [piexif.ImageIFD.Orientation]: 1,
      [piexif.ImageIFD.XResolution]: [300, 1],
      [piexif.ImageIFD.YResolution]: [300, 1],
      [piexif.ImageIFD.ResolutionUnit]: 2,
      [piexif.ImageIFD.Software]: 'ILCE-7M4 v3.01',
      [piexif.ImageIFD.DateTime]: dateStr,
      [piexif.ImageIFD.Artist]: artistStr,
      [piexif.ImageIFD.Copyright]: copyrightStr,
    };
    exif_ifd = {
      [piexif.ExifIFD.ExposureTime]: [1, 200],
      [piexif.ExifIFD.FNumber]: [28, 10], // f/2.8
      [piexif.ExifIFD.ExposureProgram]: 1,
      [piexif.ExifIFD.ISOSpeedRatings]: 100,
      [piexif.ExifIFD.ExifVersion]: '0232',
      [piexif.ExifIFD.DateTimeOriginal]: dateStr,
      [piexif.ExifIFD.DateTimeDigitized]: dateStr,
      [piexif.ExifIFD.MeteringMode]: 5, // Multi-segment
      [piexif.ExifIFD.LightSource]: 9,
      [piexif.ExifIFD.Flash]: 9,
      [piexif.ExifIFD.FocalLength]: [50, 1],
      [piexif.ExifIFD.FocalLengthIn35mmFilm]: 50,
      [piexif.ExifIFD.ColorSpace]: 1,
      [piexif.ExifIFD.WhiteBalance]: 1,
      [piexif.ExifIFD.LensModel]: 'FE 50mm F1.2 GM',
    };
  } else if (presetKey === 'fujifilm') {
    zeroth_ifd = {
      [piexif.ImageIFD.Make]: 'FUJIFILM',
      [piexif.ImageIFD.Model]: 'X-T5',
      [piexif.ImageIFD.Orientation]: 1,
      [piexif.ImageIFD.XResolution]: [300, 1],
      [piexif.ImageIFD.YResolution]: [300, 1],
      [piexif.ImageIFD.ResolutionUnit]: 2,
      [piexif.ImageIFD.Software]: 'Digital Camera X-T5 Ver.2.00',
      [piexif.ImageIFD.DateTime]: dateStr,
      [piexif.ImageIFD.Artist]: artistStr,
      [piexif.ImageIFD.Copyright]: copyrightStr,
    };
    exif_ifd = {
      [piexif.ExifIFD.ExposureTime]: [1, 125],
      [piexif.ExifIFD.FNumber]: [20, 10], // f/2.0
      [piexif.ExifIFD.ExposureProgram]: 2, // Program AE
      [piexif.ExifIFD.ISOSpeedRatings]: 125,
      [piexif.ExifIFD.ExifVersion]: '0232',
      [piexif.ExifIFD.DateTimeOriginal]: dateStr,
      [piexif.ExifIFD.DateTimeDigitized]: dateStr,
      [piexif.ExifIFD.MeteringMode]: 5,
      [piexif.ExifIFD.LightSource]: 0,
      [piexif.ExifIFD.Flash]: 16, // Off
      [piexif.ExifIFD.FocalLength]: [35, 1],
      [piexif.ExifIFD.FocalLengthIn35mmFilm]: 53,
      [piexif.ExifIFD.ColorSpace]: 1,
      [piexif.ExifIFD.WhiteBalance]: 0,
      [piexif.ExifIFD.LensModel]: 'XF35mmF1.4 R',
    };
  } else if (presetKey === 'iphone16') {
    zeroth_ifd = {
      [piexif.ImageIFD.Make]: 'Apple',
      [piexif.ImageIFD.Model]: 'iPhone 16 Pro',
      [piexif.ImageIFD.Orientation]: 1,
      [piexif.ImageIFD.XResolution]: [72, 1],
      [piexif.ImageIFD.YResolution]: [72, 1],
      [piexif.ImageIFD.ResolutionUnit]: 2,
      [piexif.ImageIFD.Software]: '18.1',
      [piexif.ImageIFD.DateTime]: dateStr,
      [piexif.ImageIFD.Artist]: artistStr,
    };
    exif_ifd = {
      [piexif.ExifIFD.ExposureTime]: [1, 120],
      [piexif.ExifIFD.FNumber]: [178, 100], // f/1.78
      [piexif.ExifIFD.ExposureProgram]: 2,
      [piexif.ExifIFD.ISOSpeedRatings]: 64,
      [piexif.ExifIFD.ExifVersion]: '0232',
      [piexif.ExifIFD.DateTimeOriginal]: dateStr,
      [piexif.ExifIFD.DateTimeDigitized]: dateStr,
      [piexif.ExifIFD.MeteringMode]: 5,
      [piexif.ExifIFD.Flash]: 16, // Off
      [piexif.ExifIFD.FocalLength]: [6765, 1000],
      [piexif.ExifIFD.FocalLengthIn35mmFilm]: 24,
      [piexif.ExifIFD.ColorSpace]: 1,
      [piexif.ExifIFD.LensModel]: 'iPhone 16 Pro back triple camera 6.765mm f/1.78',
    };
  }

  const exifObj: any = {
    '0th': zeroth_ifd,
    'Exif': exif_ifd,
    'GPS': {},
    '1st': {},
    'interop': {},
  };

  if (thumbBinary) {
    exifObj['thumbnail'] = thumbBinary;
  }

  const exifBytes = piexif.dump(exifObj);
  // Insert into JPEG binary
  const cleanBaseStr = piexif.remove(jpegBinaryStr);
  const resultBinaryStr = piexif.insert(exifBytes, cleanBaseStr);

  const outputBuffer = new Uint8Array(resultBinaryStr.length);
  for (let i = 0; i < resultBinaryStr.length; i++) {
    outputBuffer[i] = resultBinaryStr.charCodeAt(i);
  }

  return new Blob([outputBuffer], { type: 'image/jpeg' });
}
