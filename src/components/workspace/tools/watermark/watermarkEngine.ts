// src/components/workspace/tools/watermark/watermarkEngine.ts
// Engine dedicated to Text & Image Watermark stamping with Tiled Grid Pattern support

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
    canvas.width = baseImage.width || 800;
    canvas.height = baseImage.height || 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) return canvas;

    // Draw base image
    ctx.drawImage(baseImage, 0, 0);

    const {
      type = 'text',
      text = 'HelpMyIMG',
      color = '#ffffff',
      opacity = 0.6,
      position = 'center',
      image = null,
      scale = 1,
      rotation = 0,
    } = options;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

    const w = canvas.width;
    const h = canvas.height;
    const baseDimension = Math.sqrt(w * h);
    const diag = Math.sqrt(w * w + h * h);

    if (type === 'text') {
      const activeText = text && text.trim().length > 0 ? text : 'HelpMyIMG';
      const fontSize = Math.max(16, Math.round((baseDimension / 25) * Math.max(0.2, scale)));
      ctx.font = `bold ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, sans-serif`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Drop shadow for crisp visibility on any background
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = Math.max(2, fontSize / 8);
      ctx.shadowOffsetX = Math.max(1, fontSize / 16);
      ctx.shadowOffsetY = Math.max(1, fontSize / 16);

      const textMetrics = ctx.measureText(activeText);
      const textWidth = Math.max(textMetrics.width, fontSize * 2);
      const textHeight = fontSize;

      if (position === 'tiled') {
        const stepX = Math.max(80, textWidth * 1.6);
        const stepY = Math.max(50, textHeight * 3.5);

        ctx.save();
        ctx.translate(w / 2, h / 2);
        // Default -25 deg tilt for tiled watermark unless user sets a custom rotation
        const angle = rotation !== 0 ? (rotation * Math.PI) / 180 : (-25 * Math.PI) / 180;
        ctx.rotate(angle);

        const limit = diag / 2;
        const startX = -Math.ceil(limit / stepX) * stepX - stepX;
        const endX = Math.ceil(limit / stepX) * stepX + stepX;
        const startY = -Math.ceil(limit / stepY) * stepY - stepY;
        const endY = Math.ceil(limit / stepY) * stepY + stepY;

        for (let y = startY; y <= endY; y += stepY) {
          const rowIdx = Math.round(y / stepY);
          const rowOffset = rowIdx % 2 !== 0 ? stepX / 2 : 0;
          for (let x = startX; x <= endX; x += stepX) {
            ctx.fillText(activeText, x + rowOffset, y);
          }
        }
        ctx.restore();
      } else {
        let x = w / 2;
        let y = h / 2;
        const padding = Math.max(16, baseDimension * 0.04);

        if (position === 'bottom-right') {
          x = w - textWidth / 2 - padding;
          y = h - textHeight / 2 - padding;
        } else if (position === 'bottom-left') {
          x = textWidth / 2 + padding;
          y = h - textHeight / 2 - padding;
        } else if (position === 'top-right') {
          x = w - textWidth / 2 - padding;
          y = textHeight / 2 + padding;
        } else if (position === 'top-left') {
          x = textWidth / 2 + padding;
          y = textHeight / 2 + padding;
        } else {
          // center
          x = w / 2;
          y = h / 2;
        }

        ctx.save();
        ctx.translate(x, y);
        if (rotation !== 0) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        ctx.fillText(activeText, 0, 0);
        ctx.restore();
      }
    } else if (type === 'image' && image) {
      const maxWmWidth = Math.max(30, (baseDimension / 6) * Math.max(0.2, scale));
      const scaleRatio = maxWmWidth / (image.width || 100);
      const imgW = (image.width || 100) * scaleRatio;
      const imgH = (image.height || 100) * scaleRatio;

      if (position === 'tiled') {
        const stepX = imgW * 1.8;
        const stepY = imgH * 1.8;

        ctx.save();
        ctx.translate(w / 2, h / 2);
        const angle = (rotation * Math.PI) / 180;
        if (angle !== 0) {
          ctx.rotate(angle);
        }

        const limit = diag / 2;
        const startX = -Math.ceil(limit / stepX) * stepX - stepX;
        const endX = Math.ceil(limit / stepX) * stepX + stepX;
        const startY = -Math.ceil(limit / stepY) * stepY - stepY;
        const endY = Math.ceil(limit / stepY) * stepY + stepY;

        for (let y = startY; y <= endY; y += stepY) {
          const rowIdx = Math.round(y / stepY);
          const rowOffset = rowIdx % 2 !== 0 ? stepX / 2 : 0;
          for (let x = startX; x <= endX; x += stepX) {
            ctx.drawImage(image, x + rowOffset - imgW / 2, y - imgH / 2, imgW, imgH);
          }
        }
        ctx.restore();
      } else {
        let x = (w - imgW) / 2;
        let y = (h - imgH) / 2;
        const padding = Math.max(16, baseDimension * 0.04);

        if (position === 'bottom-right') {
          x = w - imgW - padding;
          y = h - imgH - padding;
        } else if (position === 'bottom-left') {
          x = padding;
          y = h - imgH - padding;
        } else if (position === 'top-right') {
          x = w - imgW - padding;
          y = padding;
        } else if (position === 'top-left') {
          x = padding;
          y = padding;
        }

        ctx.save();
        ctx.translate(x + imgW / 2, y + imgH / 2);
        if (rotation !== 0) {
          ctx.rotate((rotation * Math.PI) / 180);
        }
        ctx.drawImage(image, -imgW / 2, -imgH / 2, imgW, imgH);
        ctx.restore();
      }
    }

    ctx.restore();
    return canvas;
  }
}
