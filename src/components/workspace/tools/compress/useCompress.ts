// src/components/workspace/tools/compress/useCompress.ts
// Hook dedicated to Image Compression state & execution

import { useState, useCallback } from 'react';
import { CompressEngine } from './compressEngine';

export interface UseCompressReturn {
  compressQuality: number;
  setCompressQuality: (q: number) => void;
  compressFile: (file: File | Blob) => Promise<Blob>;
}

export function useCompress(initialQuality: number = 0.8): UseCompressReturn {
  const [compressQuality, setCompressQuality] = useState<number>(initialQuality);

  const compressFile = useCallback(
    async (file: File | Blob): Promise<Blob> => {
      return CompressEngine.compress(file, {
        quality: compressQuality,
        mimeType: file.type || 'image/jpeg',
      });
    },
    [compressQuality]
  );

  return {
    compressQuality,
    setCompressQuality,
    compressFile,
  };
}
