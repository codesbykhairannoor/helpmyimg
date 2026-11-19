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
 * Mendapatkan resolusi dimensi asli gambar secara asynchronous
 */
export async function getImageDimensions(sourceUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = sourceUrl;
  });
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

      const srcCanvas = document.createElement('canvas');
      srcCanvas.width = width;
      srcCanvas.height = height;
      const srcCtx = srcCanvas.getContext('2d');
      if (!srcCtx) {
        resolve({
          url: sourceUrl,
          revoked: false,
          wasDownscaled: false,
          originalWidth: width,
          originalHeight: height,
        });
        return;
      }
      srcCtx.drawImage(img, 0, 0, width, height);

      (async () => {
        try {
          const { resizeImageDataWasm } = await import('./wasmEncoder');
          const srcData = srcCtx.getImageData(0, 0, width, height);
          const resizedData = await resizeImageDataWasm(srcData, targetW, targetH, 'lanczos3');
          srcCanvas.width = 0;
          srcCanvas.height = 0;

          const outCanvas = document.createElement('canvas');
          outCanvas.width = resizedData.width;
          outCanvas.height = resizedData.height;
          const outCtx = outCanvas.getContext('2d');
          if (outCtx) {
            outCtx.putImageData(resizedData, 0, 0);
            outCanvas.toBlob(
              (blob) => {
                outCanvas.width = 0;
                outCanvas.height = 0;
                if (!blob) {
                  resolve({ url: sourceUrl, revoked: false, wasDownscaled: false, originalWidth: width, originalHeight: height });
                  return;
                }
                resolve({
                  url: URL.createObjectURL(blob),
                  revoked: true,
                  wasDownscaled: true,
                  originalWidth: width,
                  originalHeight: height,
                });
              },
              'image/png',
              1.0
            );
            return;
          }
        } catch {
          // Canvas fallback
        }

        const fallbackCanvas = document.createElement('canvas');
        fallbackCanvas.width = targetW;
        fallbackCanvas.height = targetH;
        const fbCtx = fallbackCanvas.getContext('2d');
        if (!fbCtx) {
          srcCanvas.width = 0;
          srcCanvas.height = 0;
          resolve({ url: sourceUrl, revoked: false, wasDownscaled: false, originalWidth: width, originalHeight: height });
          return;
        }
        fbCtx.imageSmoothingEnabled = true;
        fbCtx.imageSmoothingQuality = 'high';
        fbCtx.drawImage(srcCanvas, 0, 0, targetW, targetH);
        srcCanvas.width = 0;
        srcCanvas.height = 0;

        fallbackCanvas.toBlob(
          (blob) => {
            fallbackCanvas.width = 0;
            fallbackCanvas.height = 0;
            if (!blob) {
              resolve({ url: sourceUrl, revoked: false, wasDownscaled: false, originalWidth: width, originalHeight: height });
              return;
            }
            resolve({
              url: URL.createObjectURL(blob),
              revoked: true,
              wasDownscaled: true,
              originalWidth: width,
              originalHeight: height,
            });
          },
          'image/png',
          1.0
        );
      })();
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
