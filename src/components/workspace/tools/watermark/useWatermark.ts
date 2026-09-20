// src/components/workspace/tools/watermark/useWatermark.ts
// Hook dedicated to Watermark state & image management

import { useState } from 'react';
import type { WatermarkPosition } from '../../types';
import { WatermarkEngine } from './watermarkEngine';

export interface UseWatermarkReturn {
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  watermarkColor: string;
  setWatermarkColor: (color: string) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (opacity: number) => void;
  watermarkPosition: WatermarkPosition;
  setWatermarkPosition: (pos: WatermarkPosition) => void;
  watermarkType: 'text' | 'image';
  setWatermarkType: (type: 'text' | 'image') => void;
  watermarkImage: HTMLImageElement | null;
  setWatermarkImage: (img: HTMLImageElement | null) => void;
  watermarkScale: number;
  setWatermarkScale: (scale: number) => void;
  watermarkRotation: number;
  setWatermarkRotation: (rotation: number) => void;
  renderCanvas: (baseImage: HTMLImageElement | HTMLCanvasElement) => HTMLCanvasElement;
}

export function useWatermark(): UseWatermarkReturn {
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('center');
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
  const [watermarkScale, setWatermarkScale] = useState(1);
  const [watermarkRotation, setWatermarkRotation] = useState(0);

  const renderCanvas = (baseImage: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement => {
    return WatermarkEngine.applyWatermark(baseImage, {
      type: watermarkType,
      text: watermarkText,
      color: watermarkColor,
      opacity: watermarkOpacity,
      position: watermarkPosition,
      image: watermarkImage,
      scale: watermarkScale,
      rotation: watermarkRotation,
    });
  };

  return {
    watermarkText,
    setWatermarkText,
    watermarkColor,
    setWatermarkColor,
    watermarkOpacity,
    setWatermarkOpacity,
    watermarkPosition,
    setWatermarkPosition,
    watermarkType,
    setWatermarkType,
    watermarkImage,
    setWatermarkImage,
    watermarkScale,
    setWatermarkScale,
    watermarkRotation,
    setWatermarkRotation,
    renderCanvas,
  };
}
