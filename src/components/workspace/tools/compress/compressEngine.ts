// src/components/workspace/tools/compress/compressEngine.ts
// Engine dedicated to WASM Image Compression (MozJPEG, UPNG+OxiPNG, LibWebP)

import { processImage, type PngCompressMode } from '../../../../utils/imageOperations';

export type CompressEngineMode = 'auto' | 'quant' | 'lossless';

export interface CompressOptions {
  quality: number; // 0.1 - 1.0
  mimeType?: string;
  compressMode?: CompressEngineMode;
  targetKB?: number | null;
}

export class CompressEngine {
  /**
   * Compress image using WASM codecs (MozJPEG, UPNG Quant+OxiPNG, LibWebP)
   */
  public static async compress(file: File | Blob, options: CompressOptions): Promise<Blob> {
    const { quality, mimeType, compressMode = 'auto', targetKB = null } = options;

    if (targetKB && targetKB > 0) {
      const targetMime = mimeType === 'image/webp' ? 'image/webp' : 'image/jpeg';
      return this.compressToTargetKB(file, targetKB, targetMime);
    }

    let resolvedMime = mimeType || file.type || 'image/jpeg';
    let pngMode: PngCompressMode | undefined;

    if (compressMode === 'quant') {
      resolvedMime = 'image/png';
      pngMode = 'quant';
    } else if (compressMode === 'lossless') {
      resolvedMime = 'image/png';
      pngMode = 'lossless';
    } else if (resolvedMime === 'image/png') {
      pngMode = quality < 0.9 ? 'quant' : 'lossless';
    } else if (resolvedMime !== 'image/webp' && resolvedMime !== 'image/avif') {
      resolvedMime = 'image/jpeg';
    }

    const effectiveQuality = compressMode === 'lossless' ? 1.0 : quality;
    const compressed = await processImage(file, {
      mimeType: resolvedMime,
      quality: effectiveQuality,
      pngMode,
    });

    // Preserve smaller result unless user explicitly forced a format/lossless conversion
    if (compressMode === 'auto' && compressed.size > file.size && resolvedMime === (file.type || 'image/jpeg')) {
      return file;
    }
    return compressed;
  }

  /**
   * Auto compress image to target KB size (e.g. 50KB, 100KB, 200KB) using MozJPEG / LibWebP binary search
   */
  public static async compressToTargetKB(
    file: File | Blob,
    targetKB: number,
    mimeType: 'image/jpeg' | 'image/webp' = 'image/jpeg'
  ): Promise<Blob> {
    let minQ = 0.08;
    let maxQ = 0.95;
    let bestBlob: Blob | null = null;
    const targetBytes = targetKB * 1024;

    for (let i = 0; i < 6; i++) {
      const midQ = (minQ + maxQ) / 2;
      const blob = await processImage(file, {
        quality: midQ,
        mimeType,
      });

      if (!bestBlob || Math.abs(blob.size - targetBytes) < Math.abs(bestBlob.size - targetBytes)) {
        bestBlob = blob;
      }

      if (blob.size <= targetBytes && targetBytes - blob.size < targetBytes * 0.08) {
        bestBlob = blob;
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
