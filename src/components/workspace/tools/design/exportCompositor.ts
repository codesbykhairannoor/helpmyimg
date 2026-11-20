// src/components/workspace/tools/design/exportCompositor.ts
// Compositor berkecepatan tinggi untuk menggabungkan WebGL shader, transformasi, layer teks, dan coretan kuas ke resolusi penuh

import type { StudioAdjustments, StudioTransform, StudioTextLayer, StudioBrushStroke } from './types';
import { WebglShaderEngine } from './webglShaderEngine';

export interface ExportOptions {
  format: 'png' | 'jpeg' | 'webp';
  quality: number; // 0.1 .. 1.0
  maxDimension?: number; // resolusi maksimal (misal 1920 untuk free, 3840/asli untuk pro)
}

export interface ExportResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
}

export class ExportCompositor {
  public static async renderFullResolution(
    sourceImage: HTMLImageElement,
    adjustments: StudioAdjustments,
    transform: StudioTransform,
    textLayers: StudioTextLayer[],
    brushStrokes: StudioBrushStroke[],
    options: ExportOptions
  ): Promise<ExportResult> {
    const origW = sourceImage.naturalWidth || sourceImage.width;
    const origH = sourceImage.naturalHeight || sourceImage.height;

    // Hitung scaling jika ada batasan resolusi maksimal
    let targetW = origW;
    let targetH = origH;
    if (options.maxDimension && (targetW > options.maxDimension || targetH > options.maxDimension)) {
      const scale = Math.min(options.maxDimension / targetW, options.maxDimension / targetH);
      targetW = Math.round(targetW * scale);
      targetH = Math.round(targetH * scale);
    }

    // 1. Render Layer Efek Shader via WebGL Canvas Offscreen
    const shaderCanvas = document.createElement('canvas');
    shaderCanvas.width = targetW;
    shaderCanvas.height = targetH;

    const glEngine = new WebglShaderEngine();
    const isGlOk = glEngine.init(shaderCanvas);

    if (isGlOk) {
      glEngine.loadSource(sourceImage, targetW, targetH);
      glEngine.render(adjustments);
    } else {
      // Fallback 2D Canvas jika WebGL offscreen gagal
      const sCtx = shaderCanvas.getContext('2d');
      if (sCtx) {
        sCtx.drawImage(sourceImage, 0, 0, targetW, targetH);
      }
    }

    // 2. Render Transformasi (Rotasi, Flip & Crop)
    const isRotated90 = transform.rotation === 90 || transform.rotation === 270;
    const intermediateW = isRotated90 ? targetH : targetW;
    const intermediateH = isRotated90 ? targetW : targetH;

    const transformCanvas = document.createElement('canvas');
    transformCanvas.width = intermediateW;
    transformCanvas.height = intermediateH;
    const tCtx = transformCanvas.getContext('2d');
    if (!tCtx) throw new Error('Gagal menginisialisasi kanvas transformasi');

    tCtx.save();
    tCtx.translate(intermediateW / 2, intermediateH / 2);
    if (transform.rotation !== 0) {
      tCtx.rotate((transform.rotation * Math.PI) / 180);
    }
    tCtx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
    tCtx.drawImage(shaderCanvas, -targetW / 2, -targetH / 2, targetW, targetH);
    tCtx.restore();

    // Hapus alokasi shader canvas
    glEngine.destroy();

    // 3. Tangani Crop jika aktif
    let finalCanvas = transformCanvas;
    if (transform.cropRect) {
      const { x, y, width, height } = transform.cropRect;
      const cropW = Math.max(1, Math.min(intermediateW - x, width));
      const cropH = Math.max(1, Math.min(intermediateH - y, height));

      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropW;
      croppedCanvas.height = cropH;
      const cCtx = croppedCanvas.getContext('2d');
      if (cCtx) {
        cCtx.drawImage(transformCanvas, x, y, cropW, cropH, 0, 0, cropW, cropH);
        finalCanvas = croppedCanvas;
      }
    }

    const finalW = finalCanvas.width;
    const finalH = finalCanvas.height;
    const fCtx = finalCanvas.getContext('2d');
    if (!fCtx) throw new Error('Gagal menginisialisasi kanvas final');

    // 4. Komposisi Coretan Kuas (Brush Strokes)
    if (brushStrokes.length > 0) {
      fCtx.save();
      for (const stroke of brushStrokes) {
        if (!stroke.points || stroke.points.length < 2) continue;
        fCtx.beginPath();
        fCtx.strokeStyle = stroke.color;
        fCtx.lineWidth = Math.max(1, (stroke.size / 1000) * finalW);
        fCtx.lineCap = 'round';
        fCtx.lineJoin = 'round';
        fCtx.globalAlpha = stroke.opacity;

        const firstPt = stroke.points[0];
        fCtx.moveTo(firstPt.x * finalW, firstPt.y * finalH);
        for (let i = 1; i < stroke.points.length; i++) {
          const pt = stroke.points[i];
          fCtx.lineTo(pt.x * finalW, pt.y * finalH);
        }
        fCtx.stroke();
      }
      fCtx.restore();
    }

    // 5. Komposisi Teks & Anotasi
    if (textLayers.length > 0) {
      fCtx.save();
      for (const layer of textLayers) {
        if (!layer.text.trim()) continue;

        const pxX = (layer.x / 100) * finalW;
        const pxY = (layer.y / 100) * finalH;
        // Skala font dinamis sesuai resolusi kanvas
        const scaleFactor = finalW / 1200;
        const calculatedFontSize = Math.max(14, Math.round(layer.fontSize * scaleFactor));

        const fontStyle = `${layer.italic ? 'italic ' : ''}${layer.bold ? 'bold ' : ''}${calculatedFontSize}px ${layer.fontFamily || 'sans-serif'}`;
        fCtx.font = fontStyle;
        fCtx.textAlign = layer.align || 'center';
        fCtx.textBaseline = 'middle';

        const metrics = fCtx.measureText(layer.text);
        const textWidth = metrics.width;
        const textHeight = calculatedFontSize * 1.25;

        // Gambar background pill badge jika bukan transparan
        if (layer.bgColor && layer.bgColor !== 'transparent') {
          fCtx.fillStyle = layer.bgColor;
          const padX = calculatedFontSize * 0.4;
          const padY = calculatedFontSize * 0.2;
          let rectX = pxX - textWidth / 2 - padX;
          if (layer.align === 'left') rectX = pxX - padX;
          if (layer.align === 'right') rectX = pxX - textWidth - padX;

          const rectY = pxY - textHeight / 2 - padY;
          const rectW = textWidth + padX * 2;
          const rectH = textHeight + padY * 2;
          const radius = Math.min(8, rectH / 3);

          fCtx.beginPath();
          fCtx.roundRect(rectX, rectY, rectW, rectH, radius);
          fCtx.fill();
        }

        // Gambar bayangan teks lembut agar terbaca di segala latar
        fCtx.shadowColor = 'rgba(0,0,0,0.6)';
        fCtx.shadowBlur = Math.max(2, calculatedFontSize * 0.15);
        fCtx.shadowOffsetX = 1;
        fCtx.shadowOffsetY = 1;

        fCtx.fillStyle = layer.color;
        fCtx.fillText(layer.text, pxX, pxY);

        fCtx.shadowColor = 'transparent';
      }
      fCtx.restore();
    }

    // 6. Encode ke Format Terpilih (PNG / JPEG / WebP)
    const mimeType =
      options.format === 'png'
        ? 'image/png'
        : options.format === 'webp'
        ? 'image/webp'
        : 'image/jpeg';

    const blob = await new Promise<Blob>((resolve, reject) => {
      finalCanvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Gagal mengekspor blob kanvas'));
        },
        mimeType,
        options.quality
      );
    });

    const dataUrl = URL.createObjectURL(blob);

    return {
      blob,
      dataUrl,
      width: finalW,
      height: finalH,
      sizeBytes: blob.size,
    };
  }
}
