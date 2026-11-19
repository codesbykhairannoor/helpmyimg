import AIWorker from '../workers/aiWorker?worker';
import type { AiModelTier } from '../workers/aiWorker';

export type StudioShadowEffect = 'none' | 'drop' | 'reflection';

class AIService {
  private worker: Worker | null = null;
  private messageIdCounter = 0;
  private pendingPromises = new Map<number, { resolve: (data: any) => void; reject: (error: any) => void }>();
  private progressCallbacks = new Map<number, (step: string, progress: number) => void>();

  constructor() {
    // Lazy worker initialization: do not instantiate worker or download model weights
    // until user actively processes or checks capabilities.
  }

  private initWorker() {
    if (!this.worker) {
      this.worker = new AIWorker();
      this.worker.onmessage = (e: MessageEvent) => {
        const { type, payload, id } = e.data;
        if (type === 'PROGRESS') {
          const cb = this.progressCallbacks.get(id);
          if (cb) cb(payload.status, payload.progress);
        } else if (type === 'RESULT' && this.pendingPromises.has(id)) {
          this.pendingPromises.get(id)!.resolve(payload);
          this.pendingPromises.delete(id);
          this.progressCallbacks.delete(id);
        } else if (type === 'ERROR' && this.pendingPromises.has(id)) {
          this.pendingPromises.get(id)!.reject(new Error(payload));
          this.pendingPromises.delete(id);
          this.progressCallbacks.delete(id);
        }
      };
    }
  }

  public async checkCapabilities(): Promise<{ webgpu: boolean; device: 'webgpu' | 'wasm' }> {
    try {
      const gpu = (navigator as any).gpu;
      if (gpu && typeof gpu.requestAdapter === 'function') {
        const adapter = await gpu.requestAdapter();
        if (adapter) return { webgpu: true, device: 'webgpu' };
      }
    } catch {
      // ignore
    }
    return { webgpu: false, device: 'wasm' };
  }

  private runWorkerTask<T>(
    type: string,
    payload: Record<string, any>,
    onProgress?: (step: string, percentage: number) => void
  ): Promise<T> {
    if (!this.worker) this.initWorker();
    const id = this.messageIdCounter++;
    if (onProgress) {
      this.progressCallbacks.set(id, onProgress);
    }

    return new Promise<T>((resolve, reject) => {
      this.pendingPromises.set(id, { resolve, reject });
      this.worker!.postMessage({ type, id, payload });
    });
  }

  /**
   * Menghapus background gambar secara asinkron menggunakan Web Worker (Standard RMBG-1.4 atau PRO BiRefNet WebGPU) atau Color-Key.
   */
  public async removeBackgroundAsync(
    file: File | Blob,
    _modelType: 'rmbg' | 'isnet' = 'rmbg',
    _blurRadius: number = 80,
    onProgress?: (step: string, percentage: number) => void,
    imageType: 'photo' | 'logo' = 'photo',
    colorTolerance: number = 45,
    modelTier: AiModelTier = 'standard'
  ): Promise<Blob> {
    try {
      // ===== LOGO / FLAT GRAPHIC: Gunakan Color-Key Vector Precision =====
      if (imageType === 'logo') {
        if (onProgress) onProgress('vector', 50);
        const result = await this.removeBackgroundByColorKey(file, colorTolerance);
        if (onProgress) onProgress('ready', 100);
        return result;
      }

      // ===== NATURAL PHOTO / COMPLEX SCENE: Gunakan Neural AI Web Worker =====
      const objectUrl = URL.createObjectURL(file);
      try {
        return await this.runWorkerTask<Blob>(
          'REMOVE_BG',
          { imageBlob: file, imageUrl: objectUrl, modelTier },
          onProgress
        );
      } finally {
        URL.revokeObjectURL(objectUrl);
      }
    } catch (error: any) {
      console.error('[HelpMyIMG AI] Gagal mengeksekusi model Web Worker:', error);
      throw error;
    }
  }

  /**
   * Neural 2x Super-Resolution using Swin2SR via Web Worker (WebGPU/WASM)
   */
  public async upscaleAiAsync(
    file: File | Blob,
    onProgress?: (step: string, percentage: number) => void
  ): Promise<Blob> {
    const objectUrl = URL.createObjectURL(file);
    try {
      return await this.runWorkerTask<Blob>(
        'UPSCALE_AI',
        { imageBlob: file, imageUrl: objectUrl },
        onProgress
      );
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  /**
   * Monocular Depth Map Estimation using Depth Anything V2 Small via Web Worker
   */
  public async estimateDepthAsync(
    file: File | Blob,
    onProgress?: (step: string, percentage: number) => void
  ): Promise<Blob> {
    const objectUrl = URL.createObjectURL(file);
    try {
      return await this.runWorkerTask<Blob>(
        'DEPTH_ESTIMATE',
        { imageBlob: file, imageUrl: objectUrl },
        onProgress
      );
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  /**
   * Hapus background dengan Color-Key Flood Fill (Magic Wand O(N) dari 8 arah & Perceptual Edge Unmixing).
   */
  public async removeBackgroundByColorKey(file: File | Blob, tolerance: number = 45): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const w = canvas.width;
        const h = canvas.height;
        const totalPixels = w * h;

        // 1. Sample perimeter border pixels to detect uniform backdrop color
        const borderPixels: { r: number; g: number; b: number; lum: number }[] = [];
        for (let x = 0; x < w; x++) {
          let pi = x * 4;
          if (data[pi + 3] > 20) {
            borderPixels.push({
              r: data[pi],
              g: data[pi + 1],
              b: data[pi + 2],
              lum: data[pi] + data[pi + 1] + data[pi + 2],
            });
          }
          pi = ((h - 1) * w + x) * 4;
          if (data[pi + 3] > 20) {
            borderPixels.push({
              r: data[pi],
              g: data[pi + 1],
              b: data[pi + 2],
              lum: data[pi] + data[pi + 1] + data[pi + 2],
            });
          }
        }
        for (let y = 1; y < h - 1; y++) {
          let pi = (y * w) * 4;
          if (data[pi + 3] > 20) {
            borderPixels.push({
              r: data[pi],
              g: data[pi + 1],
              b: data[pi + 2],
              lum: data[pi] + data[pi + 1] + data[pi + 2],
            });
          }
          pi = (y * w + (w - 1)) * 4;
          if (data[pi + 3] > 20) {
            borderPixels.push({
              r: data[pi],
              g: data[pi + 1],
              b: data[pi + 2],
              lum: data[pi] + data[pi + 1] + data[pi + 2],
            });
          }
        }

        let targetR = 255;
        let targetG = 255;
        let targetB = 255;
        if (borderPixels.length > 0) {
          borderPixels.sort((a, b) => a.lum - b.lum);
          const median = borderPixels[Math.floor(borderPixels.length / 2)];
          targetR = median.r;
          targetG = median.g;
          targetB = median.b;
        }

        const alphaMap = new Uint8Array(totalPixels).fill(255);
        const visited = new Uint8Array(totalPixels).fill(0);
        const bfsQueue = new Int32Array(totalPixels);

        // Perceptual redmean color distance (matches human sensitivity to G/R/B ratios)
        const perceptualDist = (idx: number, tr: number, tg: number, tb: number): number => {
          const pi = idx * 4;
          if (data[pi + 3] < 10) return 0;
          const rmean = (data[pi] + tr) * 0.5;
          const dr = data[pi] - tr;
          const dg = data[pi + 1] - tg;
          const db = data[pi + 2] - tb;
          const weighted =
            (((512 + rmean) * dr * dr) >> 8) +
            4 * dg * dg +
            (((767 - rmean) * db * db) >> 8);
          return Math.sqrt(weighted / 9);
        };

        const hardTol = Math.max(8, tolerance * 0.75);
        const softTol = Math.max(hardTol + 8, tolerance * 1.45);

        const floodFill = (startX: number, startY: number) => {
          const startIdx = startY * w + startX;
          if (visited[startIdx]) return;
          if (perceptualDist(startIdx, targetR, targetG, targetB) > softTol) return;

          visited[startIdx] = 1;
          let head = 0;
          let tail = 0;
          bfsQueue[tail++] = startIdx;

          while (head < tail) {
            const idx = bfsQueue[head++];
            alphaMap[idx] = 0;

            const x = idx % w;
            const y = (idx / w) | 0;

            const pi = idx * 4;
            const curR = data[pi];
            const curG = data[pi + 1];
            const curB = data[pi + 2];

            // 8-connected neighbors
            for (let dy = -1; dy <= 1; dy++) {
              const ny = y + dy;
              if (ny < 0 || ny >= h) continue;
              for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                if (nx < 0 || nx >= w) continue;
                const nIdx = ny * w + nx;
                if (visited[nIdx]) continue;

                // Must match both local neighbor continuity and detected backdrop tone
                if (
                  perceptualDist(nIdx, curR, curG, curB) <= hardTol &&
                  perceptualDist(nIdx, targetR, targetG, targetB) <= softTol
                ) {
                  visited[nIdx] = 1;
                  bfsQueue[tail++] = nIdx;
                }
              }
            }
          }
        };

        // Flood fill from corners and mid-edges
        floodFill(0, 0);
        floodFill(w - 1, 0);
        floodFill(0, h - 1);
        floodFill(w - 1, h - 1);
        floodFill(Math.floor(w / 2), 0);
        floodFill(Math.floor(w / 2), h - 1);
        floodFill(0, Math.floor(h / 2));
        floodFill(w - 1, Math.floor(h / 2));

        // Feather & unmix interior holes and anti-aliased border edges
        for (let i = 0; i < totalPixels; i++) {
          if (alphaMap[i] === 0) continue;
          const dist = perceptualDist(i, targetR, targetG, targetB);
          if (dist <= hardTol) {
            alphaMap[i] = 0;
          } else if (dist <= softTol) {
            const ratio = (dist - hardTol) / (softTol - hardTol);
            const smoothAlpha = Math.min(255, Math.max(0, Math.round(ratio * 255)));
            if (smoothAlpha < alphaMap[i]) {
              alphaMap[i] = smoothAlpha;
            }
          }
        }

        // Foreground color unmixing on semi-transparent anti-aliased edge pixels
        for (let i = 0; i < totalPixels; i++) {
          const a = Math.min(data[i * 4 + 3], alphaMap[i]);
          data[i * 4 + 3] = a;
          if (a > 0 && a < 252) {
            const an = a / 255;
            const pi = i * 4;
            data[pi] = Math.min(255, Math.max(0, Math.round((data[pi] - (1 - an) * targetR) / an)));
            data[pi + 1] = Math.min(255, Math.max(0, Math.round((data[pi + 1] - (1 - an) * targetG) / an)));
            data[pi + 2] = Math.min(255, Math.max(0, Math.round((data[pi + 2] - (1 - an) * targetB) / an)));
          }
        }

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Gagal membuat blob logo'));
        }, 'image/png');
      };
      img.onerror = () => reject(new Error('Gagal load gambar logo'));
      img.src = url;
    });
  }

  /**
   * Draw foreground subject with optional Studio Drop Shadow or Mirror Floor Reflection
   */
  private drawForegroundWithEffect(
    ctx: CanvasRenderingContext2D,
    transparentImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    width: number,
    height: number,
    shadowEffect: StudioShadowEffect = 'none'
  ) {
    if (shadowEffect === 'drop') {
      ctx.save();
      const baseBlur = Math.max(10, Math.round(Math.min(width, height) * 0.032));
      const offsetY = Math.max(6, Math.round(height * 0.018));
      ctx.shadowColor = 'rgba(0, 0, 0, 0.42)';
      ctx.shadowBlur = baseBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = offsetY;
      ctx.drawImage(transparentImg, 0, 0, width, height);
      ctx.restore();
      return;
    }

    if (shadowEffect === 'reflection') {
      // 1. Subtle studio floor gradient contact shadow
      ctx.save();
      const floorGrad = ctx.createRadialGradient(
        width / 2,
        height * 0.92,
        width * 0.05,
        width / 2,
        height * 0.92,
        width * 0.42
      );
      floorGrad.addColorStop(0, 'rgba(0, 0, 0, 0.35)');
      floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, height * 0.72, width, height * 0.28);
      ctx.restore();

      // 2. Inverted soft reflection
      ctx.save();
      ctx.globalAlpha = 0.24;
      ctx.translate(0, height * 1.92);
      ctx.scale(1, -0.35);
      ctx.filter = `blur(${Math.max(2, Math.round(height * 0.004))}px)`;
      ctx.drawImage(transparentImg, 0, 0, width, height);
      ctx.restore();

      // 3. Sharp main subject on top
      ctx.drawImage(transparentImg, 0, 0, width, height);
      return;
    }

    ctx.drawImage(transparentImg, 0, 0, width, height);
  }

  // --- Fungsi Manipulasi Kanvas ---
  public applyColorBackground(
    transparentImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    color: string,
    shadowEffect: StudioShadowEffect = 'none'
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = transparentImg.width;
    canvas.height = transparentImg.height;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.drawForegroundWithEffect(ctx, transparentImg, canvas.width, canvas.height, shadowEffect);

    return canvas;
  }

  public applyGradientBackground(
    transparentImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    gradient: string,
    shadowEffect: StudioShadowEffect = 'none'
  ): HTMLCanvasElement {
    return this.applyCustomBackground(transparentImg, 'gradient', gradient, null, 0, shadowEffect);
  }

  public applyCustomBackground(
    transparentImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    bgType: 'color' | 'gradient' | 'image' | 'preset',
    bgValue: string,
    bgImgElement?: HTMLImageElement | null,
    bgBlur: number = 0,
    shadowEffect: StudioShadowEffect = 'none'
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = transparentImg.width;
    canvas.height = transparentImg.height;
    const ctx = canvas.getContext('2d')!;

    if ((bgType === 'image' || bgType === 'preset') && bgImgElement && bgImgElement.complete && bgImgElement.naturalWidth > 0) {
      ctx.save();
      if (bgBlur > 0) {
        ctx.filter = `blur(${bgBlur}px)`;
      }

      // Calculate aspect ratio cover fit
      const imgRatio = bgImgElement.naturalWidth / bgImgElement.naturalHeight;
      const canvasRatio = canvas.width / canvas.height;
      let drawW = canvas.width;
      let drawH = canvas.height;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        drawW = canvas.height * imgRatio;
        drawX = (canvas.width - drawW) / 2;
      } else {
        drawH = canvas.width / imgRatio;
        drawY = (canvas.height - drawH) / 2;
      }

      const margin = bgBlur > 0 ? bgBlur * 2.5 : 0;
      ctx.drawImage(bgImgElement, drawX - margin, drawY - margin, drawW + margin * 2, drawH + margin * 2);
      ctx.restore();
    } else if (bgType === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      const colors = bgValue.split(',').map(c => c.trim());
      if (colors.length >= 2) {
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
      } else {
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(1, '#9333ea');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = bgValue || '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.drawForegroundWithEffect(ctx, transparentImg, canvas.width, canvas.height, shadowEffect);

    return canvas;
  }

  public applyWatermark(
    originalImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    type: 'text' | 'image',
    text: string,
    imageSrc: HTMLImageElement | null,
    color: string,
    opacity: number,
    position: 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'tiled',
    scale: number,
    rotation: number
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = originalImg.width;
    canvas.height = originalImg.height;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(originalImg, 0, 0);
    ctx.globalAlpha = opacity;
    const isImage = type === 'image' && imageSrc;

    const drawSingleWatermark = (x: number, y: number, watermarkImg?: HTMLImageElement) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);

      if (isImage && watermarkImg) {
        const w = watermarkImg.width * scale;
        const h = watermarkImg.height * scale;
        ctx.drawImage(watermarkImg, -w / 2, -h / 2, w, h);
      } else if (text) {
        const fontSize = 48 * scale * (canvas.width / 1000);
        ctx.font = `bold ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.shadowColor = color === '#ffffff' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
        ctx.shadowBlur = 4;

        ctx.fillText(text, 0, 0);
      }
      ctx.restore();
    };

    const drawAll = (watermarkImg?: HTMLImageElement) => {
      let x = canvas.width / 2;
      let y = canvas.height / 2;
      const padding = 40 * (canvas.width / 1000);

      if (position === 'tiled') {
        const stepX = canvas.width / 4;
        const stepY = canvas.height / 6;
        let row = 0;
        for (let j = -stepY * 2; j <= canvas.height + stepY * 2; j += stepY) {
          const offsetX = row % 2 === 1 ? stepX / 2 : 0;
          for (let i = -stepX * 2; i <= canvas.width + stepX * 2; i += stepX) {
            drawSingleWatermark(i + offsetX, j, watermarkImg);
          }
          row++;
        }
      } else {
        if (position === 'bottom-right') {
          x = canvas.width - padding - (isImage && watermarkImg ? (watermarkImg.width * scale) / 2 : 100 * scale);
          y = canvas.height - padding - (isImage && watermarkImg ? (watermarkImg.height * scale) / 2 : 24 * scale);
        } else if (position === 'bottom-left') {
          x = padding + (isImage && watermarkImg ? (watermarkImg.width * scale) / 2 : 100 * scale);
          y = canvas.height - padding - (isImage && watermarkImg ? (watermarkImg.height * scale) / 2 : 24 * scale);
        } else if (position === 'top-right') {
          x = canvas.width - padding - (isImage && watermarkImg ? (watermarkImg.width * scale) / 2 : 100 * scale);
          y = padding + (isImage && watermarkImg ? (watermarkImg.height * scale) / 2 : 24 * scale);
        } else if (position === 'top-left') {
          x = padding + (isImage && watermarkImg ? (watermarkImg.width * scale) / 2 : 100 * scale);
          y = padding + (isImage && watermarkImg ? (watermarkImg.height * scale) / 2 : 24 * scale);
        }
        drawSingleWatermark(x, y, watermarkImg);
      }
    };

    if (isImage && imageSrc) {
      drawAll(imageSrc);
    } else {
      drawAll();
    }

    ctx.globalAlpha = 1.0;
    return canvas;
  }
}

export const aiService = new AIService();
