// src/components/workspace/tools/compress/compressEngine.ts
// Engine dedicated to Image Compression

import { processImage } from '../../../../utils/imageOperations';

export interface CompressOptions {
  quality: number; // 0.1 - 1.0
  mimeType?: string;
}

export class CompressEngine {
  /**
   * Compress image to a specific quality
   */
  public static async compress(file: File | Blob, options: CompressOptions): Promise<Blob> {
    const { quality, mimeType = file.type || 'image/jpeg' } = options;
    return processImage(file, {
      mimeType,
      quality,
    });
  }

  /**
   * Auto compress image to target KB size (e.g. 50KB, 100KB, 200KB)
   */
  public static async compressToTargetKB(file: File | Blob, targetKB: number): Promise<Blob> {
    let minQ = 0.05;
    let maxQ = 0.95;
    let bestBlob: Blob | null = null;
    const targetBytes = targetKB * 1024;

    for (let i = 0; i < 5; i++) {
      const midQ = (minQ + maxQ) / 2;
      const blob = await this.compress(file, { quality: midQ, mimeType: 'image/jpeg' });
      bestBlob = blob;

      if (Math.abs(blob.size - targetBytes) < targetBytes * 0.1) {
        break;
      }

      if (blob.size > targetBytes) {
        maxQ = midQ;
      } else {
        minQ = midQ;
      }
    }

    return bestBlob || file;
  }
}
