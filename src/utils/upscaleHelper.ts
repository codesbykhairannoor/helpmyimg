// src/utils/upscaleHelper.ts
// Real 4K Ultra-HD (3840px) Client-Side Upscaling Engine
// Zero Gimmick: Menghasilkan gambar resolusi asli 4K (3840px pada sisi terpanjang)
// Menggunakan teknik Multi-Pass Stepped Scaling + Unsharp Masking Kernel di Canvas browser secara lokal & privat

export interface UpscaleResult {
  url: string;
  width: number;
  height: number;
  revoked: boolean;
  wasUpscaled: boolean;
}

/**
 * Menerapkan Unsharp Masking Kernel untuk mempertajam tepi dan detail pada hasil upscale 4K
 */
function applyUnsharpMask(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number = 0.25) {
  try {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    // 3x3 Sharpen Kernel:
    // [  0, -1,  0 ]
    // [ -1,  5, -1 ]
    // [  0, -1,  0 ]
    const w4 = width * 4;
    const invAmount = 1 - amount;

    for (let y = 1; y < height - 1; y++) {
      const row = y * w4;
      for (let x = 1; x < width - 1; x++) {
        const idx = row + (x * 4);

        for (let c = 0; c < 3; c++) {
          const center = copy[idx + c];
          const top = copy[idx - w4 + c];
          const bottom = copy[idx + w4 + c];
          const left = copy[idx - 4 + c];
          const right = copy[idx + 4 + c];

          const sharpened = (center * 5) - (top + bottom + left + right);
          data[idx + c] = Math.min(255, Math.max(0, (center * invAmount) + (sharpened * amount)));
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
  } catch (e) {
    // Canvas context memory protection fallback
    console.warn('Unsharp mask skipped due to canvas security/memory constraints:', e);
  }
}

/**
 * Melakukan konversi atau upscale gambar menjadi resolusi murni 4K Ultra-HD (Sisi terpanjang = 3840px)
 */
export async function exportTo4k(sourceUrl: string, targetMaxDimension: number = 3840): Promise<UpscaleResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      // Jika gambar memang sudah 4K atau lebih besar (>= 3840px), ekspor apa adanya secara lossless
      if (origW >= targetMaxDimension || origH >= targetMaxDimension) {
        resolve({
          url: sourceUrl,
          width: origW,
          height: origH,
          revoked: false,
          wasUpscaled: false,
        });
        return;
      }

      // Hitung resolusi target 4K proporsional
      const maxSide = Math.max(origW, origH);
      const scale = targetMaxDimension / maxSide;
      const targetW = Math.round(origW * scale);
      const targetH = Math.round(origH * scale);

      // Multi-pass stepped scaling:
      // Penskalaan bertahap (1.5x - 2x per langkah) agar interpolasi piksel menghasilkan tepi tajam alami
      let currentW = origW;
      let currentH = origH;

      let tempCanvas = document.createElement('canvas');
      tempCanvas.width = currentW;
      tempCanvas.height = currentH;
      let tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) {
        resolve({ url: sourceUrl, width: origW, height: origH, revoked: false, wasUpscaled: false });
        return;
      }
      tempCtx.drawImage(img, 0, 0, currentW, currentH);

      // Lakukan upscale bertahap hingga mencapai target 4K
      while (currentW * 1.8 < targetW && currentH * 1.8 < targetH) {
        const nextW = Math.round(currentW * 1.8);
        const nextH = Math.round(currentH * 1.8);

        const nextCanvas = document.createElement('canvas');
        nextCanvas.width = nextW;
        nextCanvas.height = nextH;
        const nextCtx = nextCanvas.getContext('2d');
        if (!nextCtx) break;

        nextCtx.imageSmoothingEnabled = true;
        nextCtx.imageSmoothingQuality = 'high';
        nextCtx.drawImage(tempCanvas, 0, 0, nextW, nextH);

        tempCanvas = nextCanvas;
        tempCtx = nextCtx;
        currentW = nextW;
        currentH = nextH;
      }

      // Langkah final ke tepat 3840px 4K
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = targetW;
      finalCanvas.height = targetH;
      const finalCtx = finalCanvas.getContext('2d');

      if (!finalCtx) {
        resolve({ url: sourceUrl, width: origW, height: origH, revoked: false, wasUpscaled: false });
        return;
      }

      finalCtx.imageSmoothingEnabled = true;
      finalCtx.imageSmoothingQuality = 'high';
      finalCtx.drawImage(tempCanvas, 0, 0, targetW, targetH);

      // Pertajam tepi untuk memberikan hasil true 4K Ultra-HD
      applyUnsharpMask(finalCtx, targetW, targetH, 0.18);

      finalCanvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve({ url: sourceUrl, width: origW, height: origH, revoked: false, wasUpscaled: false });
            return;
          }
          const blobUrl = URL.createObjectURL(blob);
          resolve({
            url: blobUrl,
            width: targetW,
            height: targetH,
            revoked: true,
            wasUpscaled: true,
          });
        },
        'image/png',
        1.0
      );
    };

    img.onerror = (err) => {
      console.error('Failed to load image for 4K upscale:', err);
      reject(err);
    };

    img.src = sourceUrl;
  });
}
