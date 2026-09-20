// src/components/workspace/tools/colorPicker/useColorPicker.ts
// Hook dedicated to Color Picker state & palette extraction

import { useState } from 'react';
import type { ColorInfo } from '../../types';
import { ColorPickerEngine } from './colorPickerEngine';

export interface UseColorPickerReturn {
  pickedColor: ColorInfo | null;
  setPickedColor: (color: ColorInfo | null) => void;
  dominantColors: string[];
  setDominantColors: (colors: string[]) => void;
  extractPalette: (canvas: HTMLCanvasElement) => void;
}

export function useColorPicker(): UseColorPickerReturn {
  const [pickedColor, setPickedColor] = useState<ColorInfo | null>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);

  const extractPalette = (canvas: HTMLCanvasElement) => {
    const palette = ColorPickerEngine.extractDominantColors(canvas, 6);
    setDominantColors(palette);
  };

  return {
    pickedColor,
    setPickedColor,
    dominantColors,
    setDominantColors,
    extractPalette,
  };
}
