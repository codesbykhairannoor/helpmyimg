// src/components/workspace/tools/convert/useConvert.ts
// Hook dedicated to Image Format Conversion state & execution

import { useState, useCallback } from 'react';
import type { ImageMimeType } from './convertEngine';
import { ConvertEngine } from './convertEngine';

export interface UseConvertReturn {
  convertFormat: ImageMimeType;
  setConvertFormat: (fmt: ImageMimeType) => void;
  convertFile: (file: File | Blob) => Promise<Blob>;
}

export function useConvert(initialFormat: ImageMimeType = 'image/jpeg'): UseConvertReturn {
  const [convertFormat, setConvertFormat] = useState<ImageMimeType>(initialFormat);

  const convertFile = useCallback(
    async (file: File | Blob): Promise<Blob> => {
      return ConvertEngine.convert(file, convertFormat);
    },
    [convertFormat]
  );

  return {
    convertFormat,
    setConvertFormat,
    convertFile,
  };
}
