// src/components/workspace/tools/brush/useBrush.ts
// Hook dedicated to Brush tool state & interaction

import { useState } from 'react';

export interface UseBrushReturn {
  brushMode: 'restore' | 'erase';
  setBrushMode: (mode: 'restore' | 'erase') => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
}

export function useBrush(initialMode: 'restore' | 'erase' = 'restore', initialSize: number = 25): UseBrushReturn {
  const [brushMode, setBrushMode] = useState<'restore' | 'erase'>(initialMode);
  const [brushSize, setBrushSize] = useState<number>(initialSize);

  return {
    brushMode,
    setBrushMode,
    brushSize,
    setBrushSize,
  };
}
