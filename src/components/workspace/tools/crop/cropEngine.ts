// src/components/workspace/tools/crop/cropEngine.ts
// Engine dedicated to Image Cropping (Rectangular & Rounded/Circle)

import { cropImage } from '../../../../utils/imageOperations';

export interface CropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number;
}

export class CropEngine {
  /**
   * Crop an image with coordinates and optional corner radius
   */
  public static async crop(file: File | Blob, options: CropOptions): Promise<Blob> {
    const { x, y, width, height, radius = 0 } = options;
    return cropImage(file, {
      x,
      y,
      width,
      height,
      radius,
    });
  }
}
