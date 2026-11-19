// src/components/workspace/tools/brush/useBrush.ts
// Hook dedicated to Brush tool state & interaction

import { useState, useCallback } from 'react';
import type { BrushMode } from './brushEngine';

export interface UseBrushReturn {
  brushMode: BrushMode;
  setBrushMode: (mode: BrushMode) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  resetBrush: () => void;
}

export function useBrush(initialMode: BrushMode = 'restore', initialSize: number = 25): UseBrushReturn {
  const [brushMode, setBrushMode] = useState<BrushMode>(initialMode);
  const [brushSize, setBrushSize] = useState<number>(initialSize);

  const resetBrush = useCallback(() => {
    setBrushMode(initialMode);
    setBrushSize(initialSize);
  }, [initialMode, initialSize]);

  return {
    brushMode,
    setBrushMode,
    brushSize,
    setBrushSize,
    resetBrush,
  };
}
