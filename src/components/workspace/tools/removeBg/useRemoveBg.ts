// src/components/workspace/tools/removeBg/useRemoveBg.ts
// Hook dedicated to Background Removal tool state & execution

import { useState, useRef, useEffect, useCallback } from 'react';
import type { CutoutMode, BatchItem } from '../../types';
import { RemoveBgEngine } from './removeBgEngine';

export interface UseRemoveBgReturn {
  imageType: CutoutMode;
  setImageType: (val: CutoutMode) => void;
  imageTypeRef: React.MutableRefObject<CutoutMode>;
  processItem: (
    item: BatchItem,
    updateProgress?: (step: string, progress: number) => void
  ) => Promise<{ transparentUrl: string }>;
}

export function useRemoveBg(initialMode: CutoutMode = 'photo'): UseRemoveBgReturn {
  const [imageType, setImageType] = useState<CutoutMode>(initialMode);
  const imageTypeRef = useRef<CutoutMode>(initialMode);

  useEffect(() => {
    imageTypeRef.current = imageType;
  }, [imageType]);

  const processItem = useCallback(
    async (
      item: BatchItem,
      updateProgress?: (step: string, progress: number) => void
    ): Promise<{ transparentUrl: string }> => {
      const result = await RemoveBgEngine.process(item.file, {
        mode: imageTypeRef.current,
        onProgress: (step, pct) => {
          if (updateProgress) updateProgress(step, pct);
        },
      });

      return { transparentUrl: result.url };
    },
    []
  );

  return {
    imageType,
    setImageType,
    imageTypeRef,
    processItem,
  };
}
