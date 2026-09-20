// src/components/workspace/tools/watermark/watermarkEngine.ts
// Engine dedicated to Text & Image Watermark stamping

import type { WatermarkPosition } from '../../types';

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  color?: string;
  opacity?: number;
  position?: WatermarkPosition;
  image?: HTMLImageElement | null;
  scale?: number;
  rotation?: number;
}

export class WatermarkEngine {
  /**
   * Stamp watermark onto a canvas
   */
  public static applyWatermark(
    baseImage: HTMLImageElement | HTMLCanvasElement,
    options: WatermarkOptions
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = baseImage.width;
    canvas.height = baseImage.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return canvas;

    // Draw base image
    ctx.drawImage(baseImage, 0, 0);

    const {
      type = 'text',
      text = '',
      color = '#ffffff',
      opacity = 0.5,
      position = 'center',
      image = null,
      scale = 1,
      rotation = 0,
    } = options;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

    const w = canvas.width;
    const h = canvas.height;

    // Calculate watermark position
    let x = w / 2;
    let y = h / 2;

    if (type === 'text' && text) {
      const fontSize = Math.max(16, Math.round((w / 25) * scale));
      ctx.font = `bold ${fontSize}px sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (position === 'tiled') {
        const textMetrics = ctx.measureText(text);
        const textWidth = Math.max(textMetrics.width, fontSize * 2);
        const stepX = textWidth + fontSize * 3;
        const stepY = fontSize * 4;
        const angle = rotation !== 0 ? (rotation * Math.PI) / 180 : (-25 * Math.PI) / 180;

        for (let row = -1; row * stepY < h + stepY * 2; row++) {
          const offsetX = (row % 2) * (stepX / 2);
          for (let col = -1; col * stepX < w + stepX * 2; col++) {
            const tileX = col * stepX + offsetX;
            const tileY = row * stepY;
            ctx.save();
            ctx.translate(tileX, tileY);
            ctx.rotate(angle);
            ctx.fillText(text, 0, 0);
            ctx.restore();
          }
        }
      } else {
        let x = w / 2;
        let y = h / 2;

        switch (position) {
          case 'top-left':
            x = fontSize * 2;
            y = fontSize * 2;
            ctx.textAlign = 'left';
            break;
          case 'top-right':
            x = w - fontSize * 2;
            y = fontSize * 2;
            ctx.textAlign = 'right';
            break;
          case 'bottom-left':
            x = fontSize * 2;
            y = h - fontSize * 2;
            ctx.textAlign = 'left';
            break;
          case 'bottom-right':
            x = w - fontSize * 2;
            y = h - fontSize * 2;
            ctx.textAlign = 'right';
            break;
          case 'center':
          default:
            x = w / 2;
            y = h / 2;
            break;
        }

        ctx.translate(x, y);
        if (rotation !== 0) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        ctx.fillText(text, 0, 0);
      }
    } else if (type === 'image' && image) {
      const imgW = (w / 5) * scale;
      const imgH = (image.height / image.width) * imgW;

      if (position === 'tiled') {
        const stepX = imgW * 1.8;
        const stepY = imgH * 1.8;
        const angle = rotation !== 0 ? (rotation * Math.PI) / 180 : 0;

        for (let row = -1; row * stepY < h + stepY * 2; row++) {
          const offsetX = (row % 2) * (stepX / 2);
          for (let col = -1; col * stepX < w + stepX * 2; col++) {
            const tileX = col * stepX + offsetX;
            const tileY = row * stepY;
            ctx.save();
            ctx.translate(tileX + imgW / 2, tileY + imgH / 2);
            if (angle !== 0) {
              ctx.rotate(angle);
            }
            ctx.drawImage(image, -imgW / 2, -imgH / 2, imgW, imgH);
            ctx.restore();
          }
        }
      } else {
        let x = (w - imgW) / 2;
        let y = (h - imgH) / 2;

        switch (position) {
          case 'top-left':
            x = 20;
            y = 20;
            break;
          case 'top-right':
            x = w - imgW - 20;
            y = 20;
            break;
          case 'bottom-left':
            x = 20;
            y = h - imgH - 20;
            break;
          case 'bottom-right':
            x = w - imgW - 20;
            y = h - imgH - 20;
            break;
          case 'center':
          default:
            x = (w - imgW) / 2;
            y = (h - imgH) / 2;
            break;
        }

        ctx.translate(x + imgW / 2, y + imgH / 2);
        if (rotation !== 0) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        ctx.drawImage(image, -imgW / 2, -imgH / 2, imgW, imgH);
      }
    }

    ctx.restore();
    return canvas;
  }
}
