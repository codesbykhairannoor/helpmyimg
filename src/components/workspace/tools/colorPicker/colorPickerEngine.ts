// src/components/workspace/tools/colorPicker/colorPickerEngine.ts
// Engine dedicated to Image Color Picking and Dominant Palette Extraction

import { hexToColorInfo, rgbToHex } from '../../../../utils/colorUtils';
import type { ColorInfo } from '../../types';

export class ColorPickerEngine {
  /**
   * Extract dominant color palette from an image canvas
   */
  public static extractDominantColors(
    canvas: HTMLCanvasElement,
    maxColors: number = 6
  ): string[] {
    const ctx = canvas.getContext('2d');
    if (!ctx) return ['#FFFFFF', '#000000'];

    const sampleStep = 10;
    const colorCount = new Map<string, number>();
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let i = 0; i < data.length; i += 4 * sampleStep) {
      if (data[i + 3] < 50) continue; // Ignore transparent
      const hex = rgbToHex(data[i], data[i + 1], data[i + 2]);
      colorCount.set(hex, (colorCount.get(hex) || 0) + 1);
    }

    return Array.from(colorCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxColors)
      .map(([hex]) => hex);
  }

  /**
   * Get color info for a single hex code
   */
  public static getColorInfo(hex: string): ColorInfo {
    return hexToColorInfo(hex);
  }
}
