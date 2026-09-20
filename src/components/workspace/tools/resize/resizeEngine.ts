// src/components/workspace/tools/resize/resizeEngine.ts
// Engine dedicated to Image Resizing (Standard Aspect Ratio & Smart Crop Resize)

import { processImage, smartCropImage } from '../../../../utils/imageOperations';

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
  mode?: 'standard' | 'smart';
  mimeType?: string;
  quality?: number;
}

export class ResizeEngine {
  /**
   * Resize image with standard canvas scaling or AI Smart Crop
   */
  public static async resize(file: File | Blob, options: ResizeOptions): Promise<Blob> {
    const {
      width,
      height,
      maintainAspectRatio = true,
      mode = 'standard',
      mimeType = file.type || 'image/jpeg',
      quality = 0.92,
    } = options;

    if (mode === 'smart') {
      return smartCropImage(file, width, height);
    }

    return processImage(file, {
      width,
      height,
      maintainAspectRatio,
      mimeType,
      quality,
    });
  }
}
