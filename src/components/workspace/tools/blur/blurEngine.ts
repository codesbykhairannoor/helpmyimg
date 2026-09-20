// src/components/workspace/tools/blur/blurEngine.ts
// Engine dedicated to Face & License Plate Privacy Blur / Pixelation

import type { BlurBox } from '../../types';

export class BlurEngine {
  /**
   * Apply blur and pixelation boxes onto a canvas
   */
  public static applyBlurBoxes(
    baseImage: HTMLImageElement | HTMLCanvasElement,
    boxes: BlurBox[],
    blurIntensity: number = 15
  ): HTMLCanvasElement {
    const nw = 'naturalWidth' in baseImage && baseImage.naturalWidth ? baseImage.naturalWidth : baseImage.width;
    const nh = 'naturalHeight' in baseImage && baseImage.naturalHeight ? baseImage.naturalHeight : baseImage.height;

    const width = Math.max(1, nw || 800);
    const height = Math.max(1, nh || 600);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) return canvas;

    // Draw base image onto canvas
    ctx.drawImage(baseImage, 0, 0, width, height);

    if (!boxes || boxes.length === 0) return canvas;

    for (const box of boxes) {
      const bx = Math.max(0, Math.min(width - 1, Math.round(box.x)));
      const by = Math.max(0, Math.min(height - 1, Math.round(box.y)));
      const bw = Math.max(1, Math.min(width - bx, Math.round(box.width)));
      const bh = Math.max(1, Math.min(height - by, Math.round(box.height)));

      if (bw <= 0 || bh <= 0) continue;

      if (box.type === 'pixelate') {
        // Pixelate effect: downscale then upscale without interpolation
        const pixelSize = Math.max(4, Math.round(blurIntensity * 0.75));
        const pW = Math.max(1, Math.floor(bw / pixelSize));
        const pH = Math.max(1, Math.floor(bh / pixelSize));

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = pW;
        tempCanvas.height = pH;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.drawImage(baseImage, bx, by, bw, bh, 0, 0, pW, pH);

          ctx.save();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tempCanvas, 0, 0, pW, pH, bx, by, bw, bh);
          ctx.restore();
        }
      } else {
        // High quality Gaussian Blur with extended margin sampling
        const intensity = Math.max(3, blurIntensity);
        const margin = Math.round(intensity * 1.5);
        const cropX = Math.max(0, bx - margin);
        const cropY = Math.max(0, by - margin);
        const cropW = Math.min(width - cropX, bw + margin * 2);
        const cropH = Math.min(height - cropY, bh + margin * 2);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cropW;
        tempCanvas.height = cropH;
        const tempCtx = tempCanvas.getContext('2d');

        if (tempCtx) {
          tempCtx.filter = `blur(${intensity}px)`;
          tempCtx.drawImage(baseImage, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

          ctx.save();
          ctx.beginPath();
          ctx.rect(bx, by, bw, bh);
          ctx.clip();
          ctx.drawImage(tempCanvas, cropX, cropY);
          ctx.restore();
        }
      }
    }

    return canvas;
  }
}
