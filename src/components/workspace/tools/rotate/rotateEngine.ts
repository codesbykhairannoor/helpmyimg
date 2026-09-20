// src/components/workspace/tools/rotate/rotateEngine.ts
// Engine dedicated to Image Rotation and Horizontal/Vertical Flipping

import { rotateImage } from '../../../../utils/imageOperations';

export interface RotateOptions {
  rotationDeg: number;
  flipH?: boolean;
  flipV?: boolean;
}

export class RotateEngine {
  /**
   * Rotate and flip image on Canvas
   */
  public static async rotate(file: File | Blob, options: RotateOptions): Promise<Blob> {
    const { rotationDeg, flipH = false, flipV = false } = options;
    return rotateImage(file, {
      rotationDeg,
      flipH,
      flipV,
    });
  }
}
