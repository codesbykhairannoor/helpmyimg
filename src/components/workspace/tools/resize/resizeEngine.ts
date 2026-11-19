// src/components/workspace/tools/resize/resizeEngine.ts
// Engine dedicated to Image Resizing (Rust WASM Lanczos3, MagicKernelSharp2021, HQX, & Smart Crop)

import { processImage, smartCropImage, type ResizeKernelMethod } from '../../../../utils/imageOperations';

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
  mode?: 'standard' | 'smart';
  resizeMethod?: ResizeKernelMethod;
  mimeType?: string;
  quality?: number;
}

export class ResizeEngine {
  /**
   * Resize image with Rust/WASM high-precision resampling or AI Smart Crop
   */
  public static async resize(file: File | Blob, options: ResizeOptions): Promise<Blob> {
    const {
      width,
      height,
      maintainAspectRatio = true,
      mode = 'standard',
      resizeMethod = 'lanczos3',
      mimeType = file.type || 'image/jpeg',
      quality = 0.92,
    } = options;

    if (mode === 'smart') {
      return smartCropImage(file, width, height, mimeType, resizeMethod);
    }

    return processImage(file, {
      width,
      height,
      maintainAspectRatio,
      resizeMethod,
      mimeType,
      quality,
    });
  }
}
