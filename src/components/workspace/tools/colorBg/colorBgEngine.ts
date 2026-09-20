// src/components/workspace/tools/colorBg/colorBgEngine.ts
// Engine dedicated to Background Color, Gradient, Scene Presets, Custom Backgrounds, and Blur

import { aiService } from '../../../../services/aiService';
import type { BgMode } from '../../types';

export interface ApplyBgOptions {
  mode: BgMode;
  color?: string;
  gradient?: string;
  customBgElement?: HTMLImageElement | null;
  presetBgElement?: HTMLImageElement | null;
  blur?: number;
}

export class ColorBgEngine {
  /**
   * Apply background color, gradient, preset image, or custom image to a transparent image
   */
  public static applyBackground(
    transparentImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    options: ApplyBgOptions
  ): HTMLCanvasElement {
    const { mode, color = '#FFFFFF', gradient, customBgElement, presetBgElement, blur = 0 } = options;

    if (mode === 'color') {
      return aiService.applyColorBackground(transparentImg, color);
    }

    if (mode === 'gradient' && gradient) {
      return aiService.applyGradientBackground(transparentImg, gradient);
    }

    if (mode === 'preset' && presetBgElement) {
      return aiService.applyCustomBackground(transparentImg, 'preset', '', presetBgElement, blur);
    }

    if (mode === 'custom' && customBgElement) {
      return aiService.applyCustomBackground(transparentImg, 'custom', '', customBgElement, blur);
    }

    // Default fallback
    return aiService.applyColorBackground(transparentImg, color);
  }
}
