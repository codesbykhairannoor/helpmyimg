// src/components/workspace/tools/convert/convertEngine.ts
// Engine dedicated to Image Format Conversion (PNG, JPG, WEBP, GIF, BMP, ICO, AVIF, JXL, SVG Vector)

import { processImage, type SvgVectorMode } from '../../../../utils/imageOperations';

export type ImageMimeType =
  | 'image/png'
  | 'image/jpeg'
  | 'image/webp'
  | 'image/gif'
  | 'image/bmp'
  | 'image/x-icon'
  | 'image/avif'
  | 'image/jxl'
  | 'image/svg+xml';

export class ConvertEngine {
  /**
   * Convert an image to a different MIME format via WASM codecs or True Vector SVG Tracer
   */
  public static async convert(
    file: File | Blob,
    targetMimeType: ImageMimeType,
    quality: number = 0.92,
    svgMode: SvgVectorMode = 'color'
  ): Promise<Blob> {
    return processImage(file, {
      mimeType: targetMimeType,
      quality,
      svgMode,
    });
  }
}
