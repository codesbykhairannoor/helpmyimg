// src/components/workspace/tools/blur/useBlur.ts
// Hook dedicated to Privacy Blur / Pixelate state & box management

import { useState } from 'react';
import type { BlurBox } from '../../types';
import { BlurEngine } from './blurEngine';

export interface UseBlurReturn {
  blurBoxes: BlurBox[];
  setBlurBoxes: React.Dispatch<React.SetStateAction<BlurBox[]>>;
  blurIntensity: number;
  setBlurIntensity: (val: number) => void;
  addBlurBox: (box: Omit<BlurBox, 'id'>) => void;
  removeBlurBox: (id: string) => void;
  clearBlurBoxes: () => void;
  renderCanvas: (baseImage: HTMLImageElement | HTMLCanvasElement) => HTMLCanvasElement;
}

export function useBlur(initialIntensity: number = 10): UseBlurReturn {
  const [blurBoxes, setBlurBoxes] = useState<BlurBox[]>([]);
  const [blurIntensity, setBlurIntensity] = useState<number>(initialIntensity);

  const addBlurBox = (box: Omit<BlurBox, 'id'>) => {
    const newBox: BlurBox = {
      ...box,
      id: `box_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setBlurBoxes((prev) => [...prev, newBox]);
  };

  const removeBlurBox = (id: string) => {
    setBlurBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  const clearBlurBoxes = () => {
    setBlurBoxes([]);
  };

  const renderCanvas = (baseImage: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement => {
    return BlurEngine.applyBlurBoxes(baseImage, blurBoxes, blurIntensity);
  };

  return {
    blurBoxes,
    setBlurBoxes,
    blurIntensity,
    setBlurIntensity,
    addBlurBox,
    removeBlurBox,
    clearBlurBoxes,
    renderCanvas,
  };
}
