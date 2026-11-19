// src/components/workspace/tools/convert/useConvert.ts
// Hook dedicated to Image Format Conversion state & execution

import { useState, useCallback } from 'react';
import type { ImageMimeType } from './convertEngine';
import type { SvgVectorMode } from '../../../../utils/imageOperations';
import { ConvertEngine } from './convertEngine';

export interface UseConvertReturn {
  convertFormat: ImageMimeType;
  setConvertFormat: (fmt: ImageMimeType) => void;
  svgMode: SvgVectorMode;
  setSvgMode: (mode: SvgVectorMode) => void;
  convertFile: (file: File | Blob) => Promise<Blob>;
}

export function useConvert(initialFormat: ImageMimeType = 'image/jpeg'): UseConvertReturn {
  const [convertFormat, setConvertFormat] = useState<ImageMimeType>(initialFormat);
  const [svgMode, setSvgMode] = useState<SvgVectorMode>('color');

  const convertFile = useCallback(
    async (file: File | Blob): Promise<Blob> => {
      return ConvertEngine.convert(file, convertFormat, 0.92, svgMode);
    },
    [convertFormat, svgMode]
  );

  return {
    convertFormat,
    setConvertFormat,
    svgMode,
    setSvgMode,
    convertFile,
  };
}
