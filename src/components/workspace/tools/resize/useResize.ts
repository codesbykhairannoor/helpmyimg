// src/components/workspace/tools/resize/useResize.ts
// Hook dedicated to Image Resizing state & execution

import { useState, useCallback } from 'react';
import { ResizeEngine } from './resizeEngine';
import type { ResizeKernelMethod } from '../../../../utils/imageOperations';

export interface UseResizeReturn {
  resizeWidth: number;
  setResizeWidth: (w: number) => void;
  resizeHeight: number;
  setResizeHeight: (h: number) => void;
  resizeMaintainRatio: boolean;
  setResizeMaintainRatio: (maintain: boolean) => void;
  resizeMode: 'standard' | 'smart';
  setResizeMode: (mode: 'standard' | 'smart') => void;
  resizeMethod: ResizeKernelMethod;
  setResizeMethod: (method: ResizeKernelMethod) => void;
  originalDimensions: { width: number; height: number };
  setOriginalDimensions: (dim: { width: number; height: number }) => void;
  resizeFile: (file: File | Blob) => Promise<Blob>;
}

export function useResize(): UseResizeReturn {
  const [resizeWidth, setResizeWidth] = useState<number>(0);
  const [resizeHeight, setResizeHeight] = useState<number>(0);
  const [resizeMaintainRatio, setResizeMaintainRatio] = useState<boolean>(true);
  const [resizeMode, setResizeMode] = useState<'standard' | 'smart'>('standard');
  const [resizeMethod, setResizeMethod] = useState<ResizeKernelMethod>('lanczos3');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const resizeFile = useCallback(
    async (file: File | Blob): Promise<Blob> => {
      return ResizeEngine.resize(file, {
        width: resizeWidth,
        height: resizeHeight,
        maintainAspectRatio: resizeMaintainRatio,
        mode: resizeMode,
        resizeMethod,
      });
    },
    [resizeWidth, resizeHeight, resizeMaintainRatio, resizeMode, resizeMethod]
  );

  return {
    resizeWidth,
    setResizeWidth,
    resizeHeight,
    setResizeHeight,
    resizeMaintainRatio,
    setResizeMaintainRatio,
    resizeMode,
    setResizeMode,
    resizeMethod,
    setResizeMethod,
    originalDimensions,
    setOriginalDimensions,
    resizeFile,
  };
}
