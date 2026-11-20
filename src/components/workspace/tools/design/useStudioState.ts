// src/components/workspace/tools/design/useStudioState.ts
// Hook state terpadu untuk Advanced Studio Image Editor

import { useState, useCallback, useRef } from 'react';
import type {
  StudioTab,
  StudioAdjustments,
  StudioTransform,
  StudioTextLayer,
  StudioBrushStroke,
  StudioHistoryEntry,
  StudioPresetId,
} from './types';
import { DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM } from './types';
import { STUDIO_PRESETS } from './presets';

const MAX_HISTORY = 40;

export function useStudioState() {
  const [activeTab, setActiveTab] = useState<StudioTab>('adjust');

  // Parameter Penyesuaian Warna & Efek
  const [adjustments, setAdjustments] = useState<StudioAdjustments>(DEFAULT_ADJUSTMENTS);

  // Parameter Transformasi (Rotasi, Flip, Crop)
  const [transform, setTransform] = useState<StudioTransform>(DEFAULT_TRANSFORM);

  // Layer Teks Anotasi
  const [textLayers, setTextLayers] = useState<StudioTextLayer[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<string | null>(null);

  // Coretan Kuas (Freehand Brush)
  const [brushStrokes, setBrushStrokes] = useState<StudioBrushStroke[]>([]);
  const [brushColor, setBrushColor] = useState<string>('#38bdf8');
  const [brushSize, setBrushSize] = useState<number>(18);
  const [brushOpacity, setBrushOpacity] = useState<number>(0.9);

  // Zoom & Pan Viewport
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mode Bandingkan Asli (Before / After Split / Quick Compare)
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [splitPosition, setSplitPosition] = useState<number>(50); // 0 .. 100%

  // Riwayat Undo / Redo (Berbasis Parameter, Sangat Hemat RAM)
  const [history, setHistory] = useState<StudioHistoryEntry[]>([
    {
      adjustments: DEFAULT_ADJUSTMENTS,
      transform: DEFAULT_TRANSFORM,
      textLayers: [],
      brushStrokes: [],
    },
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Ref untuk debounce push riwayat
  const pushTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pushHistory = useCallback(
    (
      newAdj: StudioAdjustments,
      newTrans: StudioTransform,
      newTexts: StudioTextLayer[],
      newStrokes: StudioBrushStroke[]
    ) => {
      if (pushTimeoutRef.current) clearTimeout(pushTimeoutRef.current);
      pushTimeoutRef.current = setTimeout(() => {
        setHistory((prev) => {
          const sliced = prev.slice(0, historyIndex + 1);
          const next = [
            ...sliced,
            {
              adjustments: { ...newAdj },
              transform: { ...newTrans },
              textLayers: [...newTexts],
              brushStrokes: [...newStrokes],
            },
          ];
          if (next.length > MAX_HISTORY) next.shift();
          return next;
        });
        setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
      }, 300);
    },
    [historyIndex]
  );

  // Update Adjustment Tunggal
  const updateAdjustment = useCallback(
    (key: keyof StudioAdjustments, value: any) => {
      setAdjustments((prev) => {
        const next = { ...prev, [key]: value };
        pushHistory(next, transform, textLayers, brushStrokes);
        return next;
      });
    },
    [transform, textLayers, brushStrokes, pushHistory]
  );

  // Terapkan Preset Warna
  const applyPreset = useCallback(
    (presetId: StudioPresetId) => {
      const found = STUDIO_PRESETS.find((p) => p.id === presetId);
      if (!found) return;

      setAdjustments((prev) => {
        const next: StudioAdjustments = {
          ...DEFAULT_ADJUSTMENTS,
          ...found.adjustments,
          preset: presetId,
        };
        pushHistory(next, transform, textLayers, brushStrokes);
        return next;
      });
    },
    [transform, textLayers, brushStrokes, pushHistory]
  );

  // Transformasi
  const rotateCW = useCallback(() => {
    setTransform((prev) => {
      const nextRotation = (prev.rotation + 90) % 360;
      const next = { ...prev, rotation: nextRotation };
      pushHistory(adjustments, next, textLayers, brushStrokes);
      return next;
    });
  }, [adjustments, textLayers, brushStrokes, pushHistory]);

  const rotateCCW = useCallback(() => {
    setTransform((prev) => {
      const nextRotation = (prev.rotation - 90 + 360) % 360;
      const next = { ...prev, rotation: nextRotation };
      pushHistory(adjustments, next, textLayers, brushStrokes);
      return next;
    });
  }, [adjustments, textLayers, brushStrokes, pushHistory]);

  const toggleFlipH = useCallback(() => {
    setTransform((prev) => {
      const next = { ...prev, flipH: !prev.flipH };
      pushHistory(adjustments, next, textLayers, brushStrokes);
      return next;
    });
  }, [adjustments, textLayers, brushStrokes, pushHistory]);

  const toggleFlipV = useCallback(() => {
    setTransform((prev) => {
      const next = { ...prev, flipV: !prev.flipV };
      pushHistory(adjustments, next, textLayers, brushStrokes);
      return next;
    });
  }, [adjustments, textLayers, brushStrokes, pushHistory]);

  const setCropAspect = useCallback((aspect: StudioTransform['cropAspect']) => {
    setTransform((prev) => ({ ...prev, cropAspect: aspect }));
  }, []);

  const setCropRect = useCallback((rect: StudioTransform['cropRect']) => {
    setTransform((prev) => ({ ...prev, cropRect: rect }));
  }, []);

  const applyCrop = useCallback(() => {
    pushHistory(adjustments, transform, textLayers, brushStrokes);
  }, [adjustments, transform, textLayers, brushStrokes, pushHistory]);

  const resetCrop = useCallback(() => {
    setTransform((prev) => {
      const next = { ...prev, cropRect: null, cropAspect: 'free' as const };
      pushHistory(adjustments, next, textLayers, brushStrokes);
      return next;
    });
  }, [adjustments, textLayers, brushStrokes, pushHistory]);

  // Manajemen Teks
  const addTextLayer = useCallback(() => {
    const newLayer: StudioTextLayer = {
      id: `text_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      text: 'Double click to edit',
      x: 50,
      y: 50,
      fontSize: 36,
      fontFamily: 'Inter, sans-serif',
      color: '#ffffff',
      bgColor: 'transparent',
      bold: true,
      italic: false,
      align: 'center',
    };
    setTextLayers((prev) => {
      const next = [...prev, newLayer];
      pushHistory(adjustments, transform, next, brushStrokes);
      return next;
    });
    setSelectedTextId(newLayer.id);
  }, [adjustments, transform, brushStrokes, pushHistory]);

  const updateTextLayer = useCallback(
    (id: string, updates: Partial<StudioTextLayer>) => {
      setTextLayers((prev) => {
        const next = prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
        pushHistory(adjustments, transform, next, brushStrokes);
        return next;
      });
    },
    [adjustments, transform, brushStrokes, pushHistory]
  );

  const removeTextLayer = useCallback(
    (id: string) => {
      setTextLayers((prev) => {
        const next = prev.filter((l) => l.id !== id);
        pushHistory(adjustments, transform, next, brushStrokes);
        return next;
      });
      setSelectedTextId(null);
    },
    [adjustments, transform, brushStrokes, pushHistory]
  );

  // Manajemen Kuas
  const addBrushStroke = useCallback(
    (stroke: StudioBrushStroke) => {
      setBrushStrokes((prev) => {
        const next = [...prev, stroke];
        pushHistory(adjustments, transform, textLayers, next);
        return next;
      });
    },
    [adjustments, transform, textLayers, pushHistory]
  );

  const clearBrushStrokes = useCallback(() => {
    setBrushStrokes([]);
    pushHistory(adjustments, transform, textLayers, []);
  }, [adjustments, transform, textLayers, pushHistory]);

  // Undo / Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;
    const targetIdx = historyIndex - 1;
    const entry = history[targetIdx];
    if (entry) {
      setAdjustments(entry.adjustments);
      setTransform(entry.transform);
      setTextLayers(entry.textLayers);
      setBrushStrokes(entry.brushStrokes);
      setHistoryIndex(targetIdx);
    }
  }, [canUndo, historyIndex, history]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const targetIdx = historyIndex + 1;
    const entry = history[targetIdx];
    if (entry) {
      setAdjustments(entry.adjustments);
      setTransform(entry.transform);
      setTextLayers(entry.textLayers);
      setBrushStrokes(entry.brushStrokes);
      setHistoryIndex(targetIdx);
    }
  }, [canRedo, historyIndex, history]);

  const resetAll = useCallback(() => {
    setAdjustments(DEFAULT_ADJUSTMENTS);
    setTransform(DEFAULT_TRANSFORM);
    setTextLayers([]);
    setBrushStrokes([]);
    setSelectedTextId(null);
    setZoom(1);
    setPan({ x: 0, y: 0 });
    pushHistory(DEFAULT_ADJUSTMENTS, DEFAULT_TRANSFORM, [], []);
  }, [pushHistory]);

  // Zoom controls
  const zoomIn = useCallback(() => setZoom((z) => Math.min(3, +(z + 0.15).toFixed(2))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(0.3, +(z - 0.15).toFixed(2))), []);
  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return {
    activeTab,
    setActiveTab,
    adjustments,
    updateAdjustment,
    applyPreset,
    transform,
    rotateCW,
    rotateCCW,
    toggleFlipH,
    toggleFlipV,
    setCropAspect,
    setCropRect,
    applyCrop,
    resetCrop,
    textLayers,
    selectedTextId,
    setSelectedTextId,
    addTextLayer,
    updateTextLayer,
    removeTextLayer,
    brushStrokes,
    addBrushStroke,
    clearBrushStrokes,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    brushOpacity,
    setBrushOpacity,
    zoom,
    setZoom,
    pan,
    setPan,
    zoomIn,
    zoomOut,
    resetZoom,
    isComparing,
    setIsComparing,
    splitPosition,
    setSplitPosition,
    canUndo,
    canRedo,
    undo,
    redo,
    resetAll,
  };
}
