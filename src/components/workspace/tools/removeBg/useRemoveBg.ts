// src/components/workspace/tools/removeBg/useRemoveBg.ts
// Hook dedicated to Background Removal tool state & execution

import { useState, useRef, useEffect, useCallback } from 'react';
import type { CutoutMode, BatchItem } from '../../types';
import { RemoveBgEngine } from './removeBgEngine';

export interface UseRemoveBgReturn {
  imageType: CutoutMode;
  setImageType: (val: CutoutMode) => void;
  imageTypeRef: React.MutableRefObject<CutoutMode>;
  detectedType: 'photo' | 'logo';
  setDetectedType: (val: 'photo' | 'logo') => void;
  processItem: (
    item: BatchItem,
    updateProgress?: (step: string, progress: number) => void
  ) => Promise<{ transparentUrl: string; detectedType: 'photo' | 'logo' }>;
}

export function useRemoveBg(initialMode: CutoutMode = 'auto'): UseRemoveBgReturn {
  const [imageType, setImageType] = useState<CutoutMode>(initialMode);
  const [detectedType, setDetectedType] = useState<'photo' | 'logo'>('photo');
  const imageTypeRef = useRef<CutoutMode>(initialMode);

  useEffect(() => {
    imageTypeRef.current = imageType;
  }, [imageType]);

  const processItem = useCallback(
    async (
      item: BatchItem,
      updateProgress?: (step: string, progress: number) => void
    ): Promise<{ transparentUrl: string; detectedType: 'photo' | 'logo' }> => {
      const result = await RemoveBgEngine.process(item.file, {
        mode: imageTypeRef.current,
        onProgress: (step, pct) => {
          if (updateProgress) updateProgress(step, pct);
        },
      });

      setDetectedType(result.detectedType);
      return { transparentUrl: result.url, detectedType: result.detectedType };
    },
    []
  );

  return {
    imageType,
    setImageType,
    imageTypeRef,
    detectedType,
    setDetectedType,
    processItem,
  };
}
