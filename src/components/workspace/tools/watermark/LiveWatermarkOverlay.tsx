// src/components/workspace/tools/watermark/LiveWatermarkOverlay.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { WatermarkPosition } from '../../types';

export interface LiveWatermarkOverlayProps {
  imageElement: HTMLImageElement | null;
  type: 'text' | 'image';
  text: string;
  color: string;
  opacity: number;
  position: WatermarkPosition;
  image: HTMLImageElement | null;
  scale: number;
  rotation: number;
}

export const LiveWatermarkOverlay: React.FC<LiveWatermarkOverlayProps> = ({
  imageElement,
  type,
  text,
  color,
  opacity,
  position,
  image,
  scale,
  rotation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTick] = useState(0);

  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const getTargetImage = useCallback((): HTMLImageElement | null => {
    if (imageElement && imageElement.isConnected && imageElement.getBoundingClientRect().width > 0) {
      return imageElement;
    }
    if (typeof document !== 'undefined') {
      const domImg = document.getElementById('workspace-preview-image') as HTMLImageElement | null;
      if (domImg && domImg.isConnected && domImg.getBoundingClientRect().width > 0) {
        return domImg;
      }
    }
    return null;
  }, [imageElement]);

  useEffect(() => {
    window.addEventListener('resize', forceUpdate);
    const ro = containerRef.current ? new ResizeObserver(forceUpdate) : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);

    const targetImg = getTargetImage();
    let imgRo: ResizeObserver | null = null;
    if (targetImg) {
      targetImg.addEventListener('load', forceUpdate);
      imgRo = new ResizeObserver(forceUpdate);
      imgRo.observe(targetImg);
    }

    return () => {
      window.removeEventListener('resize', forceUpdate);
      if (ro) ro.disconnect();
      if (imgRo) imgRo.disconnect();
      if (targetImg) targetImg.removeEventListener('load', forceUpdate);
    };
  }, [forceUpdate, getTargetImage]);

  // Redraw watermark on canvas in real-time
  useEffect(() => {
    const canvas = canvasRef.current;
    const targetImg = getTargetImage();
    const vpRect = containerRef.current?.getBoundingClientRect();
    if (!canvas || !targetImg || !vpRect) return;

    const imgRect = targetImg.getBoundingClientRect();
    if (imgRect.width <= 0 || imgRect.height <= 0) return;

    const zoom = typeof document !== 'undefined' ? parseFloat(getComputedStyle(document.body).zoom) || 1 : 1;

    const left = (imgRect.left - vpRect.left) / zoom;
    const top = (imgRect.top - vpRect.top) / zoom;
    const w = imgRect.width / zoom;
    const h = imgRect.height / zoom;

    // Position canvas precisely over image
    canvas.style.left = `${left}px`;
    canvas.style.top = `${top}px`;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.globalAlpha = Math.max(0, Math.min(1, opacity));

    const baseDimension = Math.sqrt(w * h);

    if (type === 'text' && text.trim()) {
      const fontSize = Math.max(12, (baseDimension / 25) * scale);
      ctx.font = `bold ${fontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = Math.max(2, fontSize / 10);
      ctx.shadowOffsetX = Math.max(1, fontSize / 20);
      ctx.shadowOffsetY = Math.max(1, fontSize / 20);

      const metrics = ctx.measureText(text);
      const textWidth = metrics.width;
      const textHeight = fontSize;

      if (position === 'tiled') {
        const stepX = textWidth * 1.5;
        const stepY = textHeight * 3;
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const diag = Math.sqrt(w * w + h * h);
        const limit = diag / 2;
        const startX = -Math.ceil(limit / stepX) * stepX;
        const endX = Math.ceil(limit / stepX) * stepX;
        const startY = -Math.ceil(limit / stepY) * stepY;
        const endY = Math.ceil(limit / stepY) * stepY;

        for (let y = startY; y <= endY; y += stepY) {
          for (let x = startX; x <= endX; x += stepX) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      } else {
        let x = w / 2;
        let y = h / 2;
        const padding = Math.max(10, baseDimension * 0.03);

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
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.fillText(text, 0, 0);
        ctx.restore();
      }
    } else if (type === 'image' && image) {
      const maxWmW = (baseDimension / 8) * scale;
      const scaleRatio = maxWmW / image.width;
      const wmW = image.width * scaleRatio;
      const wmH = image.height * scaleRatio;

      if (position === 'tiled') {
        const stepX = wmW * 1.5;
        const stepY = wmH * 1.5;
        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate((rotation * Math.PI) / 180);

        const diag = Math.sqrt(w * w + h * h);
        const limit = diag / 2;
        const startX = -Math.ceil(limit / stepX) * stepX;
        const endX = Math.ceil(limit / stepX) * stepX;
        const startY = -Math.ceil(limit / stepY) * stepY;
        const endY = Math.ceil(limit / stepY) * stepY;

        for (let y = startY; y <= endY; y += stepY) {
          for (let x = startX; x <= endX; x += stepX) {
            ctx.drawImage(image, x - wmW / 2, y - wmH / 2, wmW, wmH);
          }
        }
        ctx.restore();
      } else {
        let x = w / 2;
        let y = h / 2;
        const padding = Math.max(10, baseDimension * 0.03);

        if (position === 'bottom-right') {
          x = w - wmW / 2 - padding;
          y = h - wmH / 2 - padding;
        } else if (position === 'bottom-left') {
          x = wmW / 2 + padding;
          y = h - wmH / 2 - padding;
        } else if (position === 'top-right') {
          x = w - wmW / 2 - padding;
          y = wmH / 2 + padding;
        } else if (position === 'top-left') {
          x = wmW / 2 + padding;
          y = wmH / 2 + padding;
        }

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(image, -wmW / 2, -wmH / 2, wmW, wmH);
        ctx.restore();
      }
    }

    ctx.restore();
  }, [getTargetImage, type, text, color, opacity, position, image, scale, rotation]);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <canvas ref={canvasRef} className="absolute pointer-events-none" />
    </div>
  );
};
