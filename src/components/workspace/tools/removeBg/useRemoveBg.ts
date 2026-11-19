// src/components/workspace/tools/removeBg/useRemoveBg.ts
// Hook dedicated to Background Removal tool state & execution

import { useState, useRef, useEffect, useCallback } from 'react';
import type { CutoutMode, BatchItem } from '../../types';
import type { AiModelTier } from '../../../../workers/aiWorker';
import { RemoveBgEngine } from './removeBgEngine';

export interface UseRemoveBgReturn {
  imageType: CutoutMode;
  setImageType: (val: CutoutMode) => void;
  imageTypeRef: React.MutableRefObject<CutoutMode>;
  modelTier: AiModelTier;
  setModelTier: (tier: AiModelTier) => void;
  modelTierRef: React.MutableRefObject<AiModelTier>;
  processItem: (
    item: BatchItem,
    updateProgress?: (step: string, progress: number) => void
  ) => Promise<{ transparentUrl: string }>;
}

export function useRemoveBg(initialMode: CutoutMode = 'photo'): UseRemoveBgReturn {
  const [imageType, setImageType] = useState<CutoutMode>(initialMode);
  const imageTypeRef = useRef<CutoutMode>(initialMode);
  const [modelTier, setModelTier] = useState<AiModelTier>('standard');
  const modelTierRef = useRef<AiModelTier>('standard');

  useEffect(() => {
    imageTypeRef.current = imageType;
  }, [imageType]);

  useEffect(() => {
    modelTierRef.current = modelTier;
  }, [modelTier]);

  const processItem = useCallback(
    async (
      item: BatchItem,
      updateProgress?: (step: string, progress: number) => void
    ): Promise<{ transparentUrl: string }> => {
      const result = await RemoveBgEngine.process(item.file, {
        mode: imageTypeRef.current,
        modelTier: modelTierRef.current,
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
    modelTier,
    setModelTier,
    modelTierRef,
    processItem,
  };
}
