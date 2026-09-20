// src/components/workspace/tools/rotate/useRotate.ts
// Hook dedicated to Image Rotation & Flip state

import { useState, useCallback } from 'react';
import { RotateEngine } from './rotateEngine';

export interface UseRotateReturn {
  rotationDeg: number;
  setRotationDeg: (deg: number) => void;
  flipH: boolean;
  setFlipH: (flip: boolean) => void;
  flipV: boolean;
  setFlipV: (flip: boolean) => void;
  rotateFile: (file: File | Blob) => Promise<Blob>;
}

export function useRotate(): UseRotateReturn {
  const [rotationDeg, setRotationDeg] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  const rotateFile = useCallback(
    async (file: File | Blob): Promise<Blob> => {
      return RotateEngine.rotate(file, {
        rotationDeg,
        flipH,
        flipV,
      });
    },
    [rotationDeg, flipH, flipV]
  );

  return {
    rotationDeg,
    setRotationDeg,
    flipH,
    setFlipH,
    flipV,
    setFlipV,
    rotateFile,
  };
}
