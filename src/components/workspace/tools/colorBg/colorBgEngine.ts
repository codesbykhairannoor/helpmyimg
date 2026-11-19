// src/components/workspace/tools/colorBg/colorBgEngine.ts
// Engine dedicated to Background Color, Gradient, Scene Presets, Custom Backgrounds, Blur, and Studio Shadows

import { aiService, type StudioShadowEffect } from '../../../../services/aiService';
import type { BgMode } from '../../types';

export interface ApplyBgOptions {
  mode: BgMode;
  color?: string;
  gradient?: string;
  customBgElement?: HTMLImageElement | null;
  presetBgElement?: HTMLImageElement | null;
  blur?: number;
  shadowEffect?: StudioShadowEffect;
}

export class ColorBgEngine {
  /**
   * Apply background color, gradient, preset image, or custom image with optional studio drop shadow or reflection
   */
  public static applyBackground(
    transparentImg: HTMLImageElement | ImageBitmap | HTMLCanvasElement,
    options: ApplyBgOptions
  ): HTMLCanvasElement {
    const {
      mode,
      color = '#FFFFFF',
      gradient,
      customBgElement,
      presetBgElement,
      blur = 0,
      shadowEffect = 'none',
    } = options;

    if (mode === 'color') {
      return aiService.applyColorBackground(transparentImg, color, shadowEffect);
    }

    if (mode === 'gradient' && gradient) {
      return aiService.applyGradientBackground(transparentImg, gradient, shadowEffect);
    }

    if (mode === 'preset' && presetBgElement) {
      return aiService.applyCustomBackground(transparentImg, 'preset', '', presetBgElement, blur, shadowEffect);
    }

    if (mode === 'image' && customBgElement) {
      return aiService.applyCustomBackground(transparentImg, 'image', '', customBgElement, blur, shadowEffect);
    }

    // Default fallback
    return aiService.applyColorBackground(transparentImg, color, shadowEffect);
  }
}
