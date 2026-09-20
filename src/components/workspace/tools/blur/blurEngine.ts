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
    blurIntensity: number = 10
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return canvas;

    ctx.drawImage(baseImage, 0, 0);

    if (boxes.length === 0) return canvas;

    for (const box of boxes) {
      const bx = Math.round(box.x);
      const by = Math.round(box.y);
      const bw = Math.round(box.width);
      const bh = Math.round(box.height);

      if (bw <= 0 || bh <= 0) continue;

      ctx.save();

      if (box.type === 'pixelate') {
        // Pixelation logic
        const pixelSize = Math.max(4, Math.round(blurIntensity));
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.max(1, Math.floor(bw / pixelSize));
        tempCanvas.height = Math.max(1, Math.floor(bh / pixelSize));
        const tempCtx = tempCanvas.getContext('2d')!;

        tempCtx.drawImage(canvas, bx, by, bw, bh, 0, 0, tempCanvas.width, tempCanvas.height);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, bx, by, bw, bh);
      } else {
        // Standard Gaussian-like Box Blur
        ctx.filter = `blur(${Math.max(2, blurIntensity)}px)`;
        ctx.beginPath();
        ctx.rect(bx, by, bw, bh);
        ctx.clip();
        ctx.drawImage(canvas, 0, 0);
      }

      ctx.restore();
    }

    return canvas;
  }
}
