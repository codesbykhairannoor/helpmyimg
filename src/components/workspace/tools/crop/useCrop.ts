// src/components/workspace/tools/crop/useCrop.ts
// Hook dedicated to Image Cropping state & actions

import { useState, useCallback } from 'react';
import { CropEngine } from './cropEngine';

export interface UseCropReturn {
  cropX: number;
  setCropX: (x: number) => void;
  cropY: number;
  setCropY: (y: number) => void;
  cropWidth: number;
  setCropWidth: (w: number) => void;
  cropHeight: number;
  setCropHeight: (h: number) => void;
  cropRadius: number;
  setCropRadius: (r: number) => void;
  cropFile: (file: File | Blob) => Promise<Blob>;
}

export function useCrop(): UseCropReturn {
  const [cropX, setCropX] = useState<number>(0);
  const [cropY, setCropY] = useState<number>(0);
  const [cropWidth, setCropWidth] = useState<number>(0);
  const [cropHeight, setCropHeight] = useState<number>(0);
  const [cropRadius, setCropRadius] = useState<number>(0);

  const cropFile = useCallback(
    async (file: File | Blob): Promise<Blob> => {
      return CropEngine.crop(file, {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
        radius: cropRadius,
      });
    },
    [cropX, cropY, cropWidth, cropHeight, cropRadius]
  );

  return {
    cropX,
    setCropX,
    cropY,
    setCropY,
    cropWidth,
    setCropWidth,
    cropHeight,
    setCropHeight,
    cropRadius,
    setCropRadius,
    cropFile,
  };
}
