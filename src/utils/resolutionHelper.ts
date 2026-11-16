// src/utils/resolutionHelper.ts
// Utility to enforce resolution limits: Max 1920px (Standard HD) for Free vs Native Uncompressed 4K/8K for PRO

export interface ExportUrlResult {
  url: string;
  revoked: boolean;
  wasDownscaled: boolean;
  originalWidth: number;
  originalHeight: number;
}

/**
 * Ensures that free users are constrained to Standard HD (max 1920px dimension)
 * while PRO users receive 100% full original native 4K/8K lossless resolution.
 */
export async function getExportUrl(
  sourceUrl: string,
  isPro: boolean,
  maxFreeDimension: number = 1920
): Promise<ExportUrlResult> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const width = img.naturalWidth || img.width;
      const height = img.naturalHeight || img.height;

      // PRO users get 100% original uncompressed dimensions (4K/8K/etc.)
      if (isPro) {
        resolve({
          url: sourceUrl,
          revoked: false,
          wasDownscaled: false,
          originalWidth: width,
          originalHeight: height,
        });
        return;
      }

      // Free user: if within 1920px, no scaling required
      if (width <= maxFreeDimension && height <= maxFreeDimension) {
        resolve({
          url: sourceUrl,
          revoked: false,
          wasDownscaled: false,
          originalWidth: width,
          originalHeight: height,
        });
        return;
      }

      // Free user: image exceeds 1920px -> scale down proportionally to 1080p Standard HD
      const ratio = Math.min(maxFreeDimension / width, maxFreeDimension / height);
      const targetW = Math.max(1, Math.round(width * ratio));
      const targetH = Math.max(1, Math.round(height * ratio));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({
          url: sourceUrl,
          revoked: false,
          wasDownscaled: false,
          originalWidth: width,
          originalHeight: height,
        });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({
              url: sourceUrl,
              revoked: false,
              wasDownscaled: false,
              originalWidth: width,
              originalHeight: height,
            });
            return;
          }
          const downscaledUrl = URL.createObjectURL(blob);
          resolve({
            url: downscaledUrl,
            revoked: true,
            wasDownscaled: true,
            originalWidth: width,
            originalHeight: height,
          });
        },
        'image/png',
        1.0
      );
    };

    img.onerror = () => {
      resolve({
        url: sourceUrl,
        revoked: false,
        wasDownscaled: false,
        originalWidth: 0,
        originalHeight: 0,
      });
    };

    img.src = sourceUrl;
  });
}
