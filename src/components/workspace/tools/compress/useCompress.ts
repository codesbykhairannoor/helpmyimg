// src/components/workspace/tools/compress/useCompress.ts
// Hook dedicated to Image Compression state & execution

import { useState, useCallback } from 'react';
import { CompressEngine, type CompressEngineMode } from './compressEngine';

export interface UseCompressReturn {
  compressQuality: number;
  setCompressQuality: (q: number) => void;
  compressMode: CompressEngineMode;
  setCompressMode: (mode: CompressEngineMode) => void;
  targetKB: number | null;
  setTargetKB: (kb: number | null) => void;
  compressFile: (file: File | Blob) => Promise<Blob>;
}

export function useCompress(
  initialQuality: number = 0.8,
  initialTargetKB: number | null = null
): UseCompressReturn {
  const [compressQuality, setCompressQuality] = useState<number>(initialQuality);
  const [compressMode, setCompressMode] = useState<CompressEngineMode>('auto');
  const [targetKB, setTargetKB] = useState<number | null>(initialTargetKB);

  const compressFile = useCallback(
    async (file: File | Blob): Promise<Blob> => {
      return CompressEngine.compress(file, {
        quality: compressQuality,
        mimeType: file.type || 'image/jpeg',
        compressMode,
        targetKB,
      });
    },
    [compressQuality, compressMode, targetKB]
  );

  return {
    compressQuality,
    setCompressQuality,
    compressMode,
    setCompressMode,
    targetKB,
    setTargetKB,
    compressFile,
  };
}
