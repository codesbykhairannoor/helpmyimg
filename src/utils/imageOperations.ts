// src/utils/imageOperations.ts
// Pure client-side Canvas operations for compressing, converting, and resizing images

/**
 * Common config for operations
 */
export interface ImageOpConfig {
  mimeType: string;
  quality: number; // 0.0 to 1.0
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
}

/**
 * Helper to load file into an Image object
 */
function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Gagal memuat gambar'));
    };
    img.src = url;
  });
}

/**
 * Process image based on config
 */
export async function processImage(file: Blob | File, config: ImageOpConfig): Promise<Blob> {
  const img = await loadImage(file);
  
  // Hitung dimensi akhir
  let finalWidth = img.width;
  let finalHeight = img.height;

  if (config.width || config.height) {
    if (config.maintainAspectRatio) {
      if (config.width && !config.height) {
        finalWidth = config.width;
        finalHeight = Math.round((img.height / img.width) * finalWidth);
      } else if (config.height && !config.width) {
        finalHeight = config.height;
        finalWidth = Math.round((img.width / img.height) * finalHeight);
      } else if (config.width && config.height) {
        // Fit within bounding box while maintaining aspect ratio
        const ratioX = config.width / img.width;
        const ratioY = config.height / img.height;
        const ratio = Math.min(ratioX, ratioY);
        finalWidth = Math.round(img.width * ratio);
        finalHeight = Math.round(img.height * ratio);
      }
    } else {
      finalWidth = config.width || img.width;
      finalHeight = config.height || img.height;
    }
  }

  // Buat canvas
  const canvas = document.createElement('canvas');
  canvas.width = finalWidth;
  canvas.height = finalHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Gagal membuat canvas context');
  }

  // Jika convert ke JPEG/WebP dari PNG, kita beri background putih (untuk transparansi)
  if (config.mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, finalWidth, finalHeight);
  }

  // Draw scaled image
  ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

  // Return blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Gagal membuat blob gambar'));
      },
      config.mimeType,
      config.quality
    );
  });
}

/**
 * Crop image to specified region
 */
export async function cropImage(
  file: Blob | File,
  x: number, y: number, w: number, h: number,
  mimeType = 'image/png', quality = 0.95
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Gagal membuat canvas context');

  if (mimeType === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);
  }

  ctx.drawImage(img, x, y, w, h, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => { if (blob) resolve(blob); else reject(new Error('Gagal membuat blob gambar')); },
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
      (blob) => { if (blob) resolve(blob); else reject(new Error('Gagal membuat blob gambar')); },
      mimeType, quality
    );
  });
}

import smartcrop from 'smartcrop';

export async function smartCropImage(file: Blob | File, targetWidth: number, targetHeight: number, mimeType: string = 'image/jpeg'): Promise<Blob> {
  const img = await loadImage(file);
  
  // Smart crop algorithm calculates the best bounding box
  const result = await smartcrop.crop(img, { width: targetWidth, height: targetHeight });
  const crop = result.topCrop;
  
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // Draw the best region scaled to the target size
  ctx.drawImage(
    img, 
    crop.x, crop.y, crop.width, crop.height,
    0, 0, targetWidth, targetHeight
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Gagal mengekspor smart cropped gambar'));
    }, mimeType, 0.95);
  });
}
