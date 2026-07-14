import AIWorker from '../workers/aiWorker?worker';

class AIService {
  private worker: Worker | null = null;
  private messageIdCounter = 0;
  private pendingPromises = new Map<number, { resolve: (data: any) => void; reject: (error: any) => void }>();
  private onProgressCallback: ((step: string, progress: number) => void) | null = null;

  constructor() {
    this.initWorker();
  }

  private initWorker() {
    if (!this.worker) {
      this.worker = new AIWorker();
      this.worker.onmessage = (e: MessageEvent) => {
        const { type, payload, id } = e.data;
        if (type === 'PROGRESS' && this.onProgressCallback) {
          this.onProgressCallback(payload.status, payload.progress);
        } else if (type === 'RESULT' && this.pendingPromises.has(id)) {
          this.pendingPromises.get(id)!.resolve(payload);
          this.pendingPromises.delete(id);
        } else if (type === 'ERROR' && this.pendingPromises.has(id)) {
          this.pendingPromises.get(id)!.reject(new Error(payload));
          this.pendingPromises.delete(id);
        }
      };
      
      // Initialize model early in the background
      this.worker.postMessage({ type: 'INIT', id: this.messageIdCounter++ });
    }
  }

  /**
   * Menghapus background gambar secara asinkron menggunakan Web Worker.
   */
  public async removeBackgroundAsync(
    file: File | Blob,
    _modelType: 'rmbg' | 'isnet' = 'rmbg',
    _blurRadius: number = 80,
    onProgress?: (step: string, percentage: number) => void,
    imageType: 'photo' | 'logo' | 'general' = 'photo',
    colorTolerance: number = 45
  ): Promise<Blob> {
    try {
      // ===== LOGO MODE: Gunakan Color-Key Flood Fill =====
      if (imageType === 'logo') {
        return await this.removeBackgroundByColorKey(file, colorTolerance);
      }

      // ===== PHOTO MODE: Gunakan AI Web Worker =====
      if (!this.worker) this.initWorker();
      this.onProgressCallback = onProgress || null;
      
      const id = this.messageIdCounter++;
      const objectUrl = URL.createObjectURL(file);

      return new Promise<Blob>((resolve, reject) => {
        this.pendingPromises.set(id, {
          resolve: (blob) => {
            URL.revokeObjectURL(objectUrl);
            resolve(blob);
          },
          reject: (err) => {
            URL.revokeObjectURL(objectUrl);
            reject(err);
          }
        });
        
        this.worker!.postMessage({ type: 'REMOVE_BG', id, payload: { imageUrl: objectUrl } });
      });
      
    } catch (error: any) {
      console.error('[HelpMyIMG AI] Gagal mengeksekusi model Web Worker:', error);
      throw error;
    }
  }

  /**
   * Hapus background dengan Color-Key Flood Fill (Magic Wand dari 8 arah & Global Color Key).
   * Teknik ini 100% deterministik dan selalu berhasil untuk logo dengan latar solid maupun lubang internal.
   * Toleransi: 0 = exact match, 100 = hapus semua warna mirip
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

        // 1. Deteksi warna dominan pada keliling/border gambar
        const borderPixels: { r: number; g: number; b: number }[] = [];
        for (let x = 0; x < w; x++) {
          let pi = (0 * w + x) * 4;
          if (data[pi + 3] > 20) borderPixels.push({ r: data[pi], g: data[pi + 1], b: data[pi + 2] });
          pi = ((h - 1) * w + x) * 4;
          if (data[pi + 3] > 20) borderPixels.push({ r: data[pi], g: data[pi + 1], b: data[pi + 2] });
        }
        for (let y = 1; y < h - 1; y++) {
          let pi = (y * w + 0) * 4;
          if (data[pi + 3] > 20) borderPixels.push({ r: data[pi], g: data[pi + 1], b: data[pi + 2] });
          pi = (y * w + (w - 1)) * 4;
          if (data[pi + 3] > 20) borderPixels.push({ r: data[pi], g: data[pi + 1], b: data[pi + 2] });
        }

        // Cari median warna latar dari border
        let targetR = 255, targetG = 255, targetB = 255;
        if (borderPixels.length > 0) {
          borderPixels.sort((a, b) => (a.r + a.g + a.b) - (b.r + b.g + b.b));
          const median = borderPixels[Math.floor(borderPixels.length / 2)];
          targetR = median.r;
          targetG = median.g;
          targetB = median.b;
        }

        const alphaMap = new Uint8Array(totalPixels).fill(255);
        const visited = new Uint8Array(totalPixels).fill(0);

        const colorMatchDistSq = (idx: number, tr: number, tg: number, tb: number): number => {
          const pi = idx * 4;
          if (data[pi + 3] < 10) return 0;
          const dr = data[pi] - tr;
          const dg = data[pi + 1] - tg;
          const db = data[pi + 2] - tb;
          return dr * dr + dg * dg + db * db;
        };

        const tolSq = tolerance * tolerance * 3;
        const globalTolSq = (tolerance * 1.35) * (tolerance * 1.35) * 3;

        // BFS Flood fill 8-connected dari titik awal ke area terhubung
        const floodFill = (startX: number, startY: number) => {
          const startIdx = startY * w + startX;
          if (visited[startIdx]) return;
          visited[startIdx] = 1;

          const pi = startIdx * 4;
          const tr = data[pi];
          const tg = data[pi + 1];
          const tb = data[pi + 2];

          const queue: number[] = [startIdx];
          while (queue.length > 0) {
            const idx = queue.shift()!;
            alphaMap[idx] = 0;

            const x = idx % w;
            const y = Math.floor(idx / w);

            const neighbors = [
              x > 0 ? idx - 1 : -1,
              x < w - 1 ? idx + 1 : -1,
              y > 0 ? idx - w : -1,
              y < h - 1 ? idx + w : -1,
              x > 0 && y > 0 ? idx - w - 1 : -1,
              x < w - 1 && y > 0 ? idx - w + 1 : -1,
              x > 0 && y < h - 1 ? idx + w - 1 : -1,
              x < w - 1 && y < h - 1 ? idx + w + 1 : -1,
            ];

            for (const nIdx of neighbors) {
              if (nIdx >= 0 && !visited[nIdx]) {
                const distSq = colorMatchDistSq(nIdx, tr, tg, tb);
                if (distSq <= tolSq) {
                  visited[nIdx] = 1;
                  queue.push(nIdx);
                }
              }
            }
          }
        };

        // 1. Flood fill dari 4 sudut & 4 sisi
        floodFill(0, 0);
        floodFill(w - 1, 0);
        floodFill(0, h - 1);
        floodFill(w - 1, h - 1);
        floodFill(Math.floor(w / 2), 0);
        floodFill(Math.floor(w / 2), h - 1);
        floodFill(0, Math.floor(h / 2));
        floodFill(w - 1, Math.floor(h / 2));

        // 2. Global matching & anti-aliasing edge fade
        for (let i = 0; i < totalPixels; i++) {
          if (alphaMap[i] === 0) continue;
          const distSq = colorMatchDistSq(i, targetR, targetG, targetB);
          if (distSq <= tolSq) {
            alphaMap[i] = 0;
          } else if (distSq <= globalTolSq) {
            const ratio = (Math.sqrt(distSq) - Math.sqrt(tolSq)) / (Math.sqrt(globalTolSq) - Math.sqrt(tolSq));
            const smoothAlpha = Math.min(255, Math.max(0, Math.round(ratio * 255)));
            if (smoothAlpha < alphaMap[i]) {
              alphaMap[i] = smoothAlpha;
            }
          }
        }

        // Terapkan alpha map ke image data
        for (let i = 0; i < totalPixels; i++) {
          data[i * 4 + 3] = Math.min(data[i * 4 + 3], alphaMap[i]);
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

  // --- Fungsi Manipulasi Kanvas ---
  public applyColorBackground(transparentImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement, color: string): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = transparentImg.width;
    canvas.height = transparentImg.height;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(transparentImg, 0, 0);

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
        // Denser tiling pattern with offset
        const stepX = canvas.width / 4;
        const stepY = canvas.height / 6;
        let row = 0;
        for (let j = -stepY * 2; j <= canvas.height + stepY * 2; j += stepY) {
          const offsetX = (row % 2 === 1) ? stepX / 2 : 0;
          for (let i = -stepX * 2; i <= canvas.width + stepX * 2; i += stepX) {
            drawSingleWatermark(i + offsetX, j, watermarkImg);
          }
          row++;
        }
      } else {
        if (position === 'bottom-right') {
           x = canvas.width - padding - (isImage && watermarkImg ? (watermarkImg.width * scale / 2) : 100 * scale);
           y = canvas.height - padding - (isImage && watermarkImg ? (watermarkImg.height * scale / 2) : 24 * scale);
        } else if (position === 'bottom-left') {
           x = padding + (isImage && watermarkImg ? (watermarkImg.width * scale / 2) : 100 * scale);
           y = canvas.height - padding - (isImage && watermarkImg ? (watermarkImg.height * scale / 2) : 24 * scale);
        } else if (position === 'top-right') {
           x = canvas.width - padding - (isImage && watermarkImg ? (watermarkImg.width * scale / 2) : 100 * scale);
           y = padding + (isImage && watermarkImg ? (watermarkImg.height * scale / 2) : 24 * scale);
        } else if (position === 'top-left') {
           x = padding + (isImage && watermarkImg ? (watermarkImg.width * scale / 2) : 100 * scale);
           y = padding + (isImage && watermarkImg ? (watermarkImg.height * scale / 2) : 24 * scale);
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
