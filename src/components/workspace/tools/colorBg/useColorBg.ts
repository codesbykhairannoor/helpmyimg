// src/components/workspace/tools/colorBg/useColorBg.ts
// Hook dedicated to Background Changing tool state & logic

import { useState, useEffect } from 'react';
import type { BgMode } from '../../types';
import { GRADIENT_PRESETS, PRESET_SCENES } from '../ColorBgControl';
import { ColorBgEngine } from './colorBgEngine';

export interface UseColorBgReturn {
  bgMode: BgMode;
  setBgMode: (mode: BgMode) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedGradient: string;
  setSelectedGradient: (grad: string) => void;
  customBgFile: File | null;
  customBgUrl: string | null;
  customBgImageElement: HTMLImageElement | null;
  handleUploadCustomBg: (file: File) => void;
  handleClearCustomBg: () => void;
  selectedPreset: string;
  setSelectedPreset: (presetId: string) => void;
  presetBgImageElement: HTMLImageElement | null;
  bgBlur: number;
  setBgBlur: (blur: number) => void;
  renderCanvas: (transparentImg: HTMLImageElement | HTMLCanvasElement) => HTMLCanvasElement;
}

export function useColorBg(initialColor: string = '#DB1514'): UseColorBgReturn {
  const [bgMode, setBgMode] = useState<BgMode>('color');
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].value);
  const [customBgFile, setCustomBgFile] = useState<File | null>(null);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [customBgImageElement, setCustomBgImageElement] = useState<HTMLImageElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESET_SCENES[0].id);
  const [presetBgImageElement, setPresetBgImageElement] = useState<HTMLImageElement | null>(null);
  const [bgBlur, setBgBlur] = useState<number>(0);

  // Pre-load preset image whenever selectedPreset changes
  useEffect(() => {
    if (bgMode === 'preset') {
      const scene = PRESET_SCENES.find((p) => p.id === selectedPreset);
      if (scene) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => setPresetBgImageElement(img);
        img.src = scene.url;
      }
    }
  }, [bgMode, selectedPreset]);

  // Handle custom background image upload
  const handleUploadCustomBg = (file: File) => {
    setCustomBgFile(file);
    const url = URL.createObjectURL(file);
    setCustomBgUrl(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => setCustomBgImageElement(img);
    img.src = url;
    setBgMode('custom');
  };

  const handleClearCustomBg = () => {
    if (customBgUrl) URL.revokeObjectURL(customBgUrl);
    setCustomBgFile(null);
    setCustomBgUrl(null);
    setCustomBgImageElement(null);
    setBgMode('color');
  };

  const renderCanvas = (transparentImg: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement => {
    return ColorBgEngine.applyBackground(transparentImg, {
      mode: bgMode,
      color: selectedColor,
      gradient: selectedGradient,
      customBgElement: customBgImageElement,
      presetBgElement: presetBgImageElement,
      blur: bgBlur,
    });
  };

  return {
    bgMode,
    setBgMode,
    selectedColor,
    setSelectedColor,
    selectedGradient,
    setSelectedGradient,
    customBgFile,
    customBgUrl,
    customBgImageElement,
    handleUploadCustomBg,
    handleClearCustomBg,
    selectedPreset,
    setSelectedPreset,
    presetBgImageElement,
    bgBlur,
    setBgBlur,
    renderCanvas,
  };
}
