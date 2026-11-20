// src/components/workspace/tools/design/components/StudioCanvas.tsx
// Viewport Kanvas Interaktif: WebGL 60fps shader, pan-zoom, layer teks drag-and-drop, dan kanvas kuas

import React, { useRef, useEffect, useState, useCallback } from 'react';
import type {
  StudioAdjustments,
  StudioTransform,
  StudioTextLayer,
  StudioBrushStroke,
  StudioTab,
} from '../types';
import { WebglShaderEngine } from '../webglShaderEngine';

interface StudioCanvasProps {
  sourceImage: HTMLImageElement | null;
  adjustments: StudioAdjustments;
  transform: StudioTransform;
  activeTab: StudioTab;
  textLayers: StudioTextLayer[];
  selectedTextId: string | null;
  onSelectTextId: (id: string | null) => void;
  onUpdateTextLayer: (id: string, updates: Partial<StudioTextLayer>) => void;
  brushStrokes: StudioBrushStroke[];
  onAddBrushStroke: (stroke: StudioBrushStroke) => void;
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
  zoom: number;
  pan: { x: number; y: number };
  onPanChange: (pan: { x: number; y: number }) => void;
  isComparing: boolean;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  sourceImage,
  adjustments,
  transform,
  activeTab,
  textLayers,
  selectedTextId,
  onSelectTextId,
  onUpdateTextLayer,
  brushStrokes,
  onAddBrushStroke,
  brushColor,
  brushSize,
  brushOpacity,
  zoom,
  pan,
  onPanChange,
  isComparing,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const brushCanvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WebglShaderEngine | null>(null);

  // Status interaksi
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingTextId, setDraggingTextId] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokePoints = useRef<{ x: number; y: number }[]>([]);

  // 1. Inisialisasi WebGL Engine
  useEffect(() => {
    const canvas = glCanvasRef.current;
    if (!canvas) return;

    const engine = new WebglShaderEngine();
    const success = engine.init(canvas);
    if (success) {
      engineRef.current = engine;
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  // 2. Muat Sumber Gambar ke WebGL Texture
  useEffect(() => {
    const engine = engineRef.current;
    const canvas = glCanvasRef.current;
    if (!engine || !canvas || !sourceImage) return;

    const imgW = sourceImage.naturalWidth || sourceImage.width;
    const imgH = sourceImage.naturalHeight || sourceImage.height;

    // Batasi ukuran kanvas viewport agar performa interaktif 60fps selalu stabil
    const maxViewportDim = 2560; // 2K max preview buffer
    let viewW = imgW;
    let viewH = imgH;
    if (viewW > maxViewportDim || viewH > maxViewportDim) {
      const scale = Math.min(maxViewportDim / viewW, maxViewportDim / viewH);
      viewW = Math.round(viewW * scale);
      viewH = Math.round(viewH * scale);
    }

    canvas.width = viewW;
    canvas.height = viewH;

    // Sesuaikan kanvas kuas
    if (brushCanvasRef.current) {
      brushCanvasRef.current.width = viewW;
      brushCanvasRef.current.height = viewH;
    }

    engine.loadSource(sourceImage, viewW, viewH);
    engine.render(isComparing ? { ...adjustments, brightness: 0, contrast: 0, exposure: 0, saturation: 0, vibrance: 0, temperature: 0, tint: 0, highlights: 0, shadows: 0, sharpen: 0, vignette: 0, blur: 0 } : adjustments);
  }, [sourceImage, isComparing]);

  // 3. Render Ulang WebGL saat Slider Digeser (Real-Time 60 FPS)
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !sourceImage) return;

    if (isComparing) {
      // Tampilkan foto asli tanpa efek saat tombol Compare ditekan
      engine.render({
        ...adjustments,
        brightness: 0,
        contrast: 0,
        exposure: 0,
        saturation: 0,
        vibrance: 0,
        temperature: 0,
        tint: 0,
        highlights: 0,
        shadows: 0,
        sharpen: 0,
        vignette: 0,
        blur: 0,
      });
    } else {
      engine.render(adjustments);
    }
  }, [adjustments, isComparing, sourceImage]);

  // 4. Render Coretan Kuas di Kanvas Overlay
  const redrawBrushCanvas = useCallback(() => {
    const canvas = brushCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of brushStrokes) {
      if (!stroke.points || stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = Math.max(1, (stroke.size / 1000) * canvas.width);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = stroke.opacity;

      ctx.moveTo(stroke.points[0].x * canvas.width, stroke.points[0].y * canvas.height);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x * canvas.width, stroke.points[i].y * canvas.height);
      }
      ctx.stroke();
    }
  }, [brushStrokes]);

  useEffect(() => {
    redrawBrushCanvas();
  }, [brushStrokes, redrawBrushCanvas]);

  // Event Handlers untuk Menggambar Kuas
  const handleBrushMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab !== 'brush') return;
    const canvas = brushCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setIsDrawing(true);
    currentStrokePoints.current = [{ x, y }];
  };

  const handleBrushMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTab !== 'brush') return;
    const canvas = brushCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    currentStrokePoints.current.push({ x, y });

    // Live feedback di kanvas
    const ctx = canvas.getContext('2d');
    if (ctx && currentStrokePoints.current.length >= 2) {
      const len = currentStrokePoints.current.length;
      const p1 = currentStrokePoints.current[len - 2];
      const p2 = currentStrokePoints.current[len - 1];

      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = Math.max(1, (brushSize / 1000) * canvas.width);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = brushOpacity;
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    }
  };

  const handleBrushMouseUp = () => {
    if (!isDrawing || activeTab !== 'brush') return;
    setIsDrawing(false);
    if (currentStrokePoints.current.length >= 2) {
      onAddBrushStroke({
        color: brushColor,
        size: brushSize,
        opacity: brushOpacity,
        points: [...currentStrokePoints.current],
      });
    }
    currentStrokePoints.current = [];
  };

  // Touch Handlers untuk Menggambar Kuas di Layar Sentuh Mobile
  const handleBrushTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (activeTab !== 'brush') return;
    const canvas = brushCanvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    setIsDrawing(true);
    currentStrokePoints.current = [{ x, y }];
  };

  const handleBrushTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || activeTab !== 'brush') return;
    const canvas = brushCanvasRef.current;
    if (!canvas || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;

    currentStrokePoints.current.push({ x, y });

    const ctx = canvas.getContext('2d');
    if (ctx && currentStrokePoints.current.length >= 2) {
      const len = currentStrokePoints.current.length;
      const p1 = currentStrokePoints.current[len - 2];
      const p2 = currentStrokePoints.current[len - 1];

      ctx.beginPath();
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = Math.max(1, (brushSize / 1000) * canvas.width);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = brushOpacity;
      ctx.moveTo(p1.x * canvas.width, p1.y * canvas.height);
      ctx.lineTo(p2.x * canvas.width, p2.y * canvas.height);
      ctx.stroke();
    }
  };

  const handleBrushTouchEnd = () => {
    handleBrushMouseUp();
  };

  // Dragging Layer Teks
  const handleTextMouseDown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectTextId(id);
    setDraggingTextId(id);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleTextTouchStart = (id: string, e: React.TouchEvent) => {
    e.stopPropagation();
    onSelectTextId(id);
    setDraggingTextId(id);
    if (e.touches.length > 0) {
      setDragStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (draggingTextId) {
      const layer = textLayers.find((l) => l.id === draggingTextId);
      const canvas = glCanvasRef.current;
      if (layer && canvas) {
        const rect = canvas.getBoundingClientRect();
        const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;

        onUpdateTextLayer(draggingTextId, {
          x: Math.max(0, Math.min(100, +(layer.x + deltaX).toFixed(1))),
          y: Math.max(0, Math.min(100, +(layer.y + deltaY).toFixed(1))),
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    } else if (isPanning) {
      onPanChange({
        x: pan.x + (e.clientX - panStart.x),
        y: pan.y + (e.clientY - panStart.y),
      });
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleContainerTouchMove = (e: React.TouchEvent) => {
    if (draggingTextId && e.touches.length > 0) {
      const touch = e.touches[0];
      const layer = textLayers.find((l) => l.id === draggingTextId);
      const canvas = glCanvasRef.current;
      if (layer && canvas) {
        const rect = canvas.getBoundingClientRect();
        const deltaX = ((touch.clientX - dragStart.x) / rect.width) * 100;
        const deltaY = ((touch.clientY - dragStart.y) / rect.height) * 100;

        onUpdateTextLayer(draggingTextId, {
          x: Math.max(0, Math.min(100, +(layer.x + deltaX).toFixed(1))),
          y: Math.max(0, Math.min(100, +(layer.y + deltaY).toFixed(1))),
        });
        setDragStart({ x: touch.clientX, y: touch.clientY });
      }
    }
  };

  const handleContainerMouseUp = () => {
    setDraggingTextId(null);
    setIsPanning(false);
  };

  const handleContainerTouchEnd = () => {
    setDraggingTextId(null);
  };

  const handleContainerMouseDown = (e: React.MouseEvent) => {
    // Klik background kanvas deselect teks
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'CANVAS') {
      if (activeTab !== 'brush') {
        onSelectTextId(null);
      }
    }

    // Drag untuk pan jika klik tengah atau menahan spasi
    if (e.button === 1 || e.altKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      onMouseMove={handleContainerMouseMove}
      onMouseUp={handleContainerMouseUp}
      onTouchMove={handleContainerTouchMove}
      onTouchEnd={handleContainerTouchEnd}
      className="relative flex-1 w-full h-[40vh] sm:h-[48vh] md:h-full bg-[#090d16] overflow-hidden flex items-center justify-center p-2 sm:p-4 md:p-6 select-none cursor-default shrink-0 md:shrink"
      style={{
        backgroundImage:
          'radial-gradient(#1e293b 1px, transparent 1px), radial-gradient(#1e293b 1px, #090d16 1px)',
        backgroundSize: '24px 24px',
        backgroundPosition: '0 0, 12px 12px',
      }}
    >
      {/* Container Kanvas yang bisa di-Zoom & Pan */}
      <div
        className="relative transition-transform duration-75 origin-center shadow-2xl rounded-lg overflow-hidden border border-slate-800/80"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${transform.rotation}deg) scaleX(${
            transform.flipH ? -1 : 1
          }) scaleY(${transform.flipV ? -1 : 1})`,
        }}
      >
        {/* Kanvas WebGL Hardware-Accelerated */}
        <canvas
          ref={glCanvasRef}
          className="block max-w-full max-h-[38vh] sm:max-h-[46vh] md:max-h-[75vh] object-contain"
        />

        {/* Kanvas Overlay Kuas */}
        <canvas
          ref={brushCanvasRef}
          onMouseDown={handleBrushMouseDown}
          onMouseMove={handleBrushMouseMove}
          onMouseUp={handleBrushMouseUp}
          onTouchStart={handleBrushTouchStart}
          onTouchMove={handleBrushTouchMove}
          onTouchEnd={handleBrushTouchEnd}
          className={`absolute inset-0 w-full h-full ${
            activeTab === 'brush' ? 'cursor-crosshair pointer-events-auto touch-none' : 'pointer-events-none'
          }`}
        />

        {/* Layer Teks Draggable */}
        {textLayers.map((layer) => {
          const isSelected = layer.id === selectedTextId;
          return (
            <div
              key={layer.id}
              onMouseDown={(e) => handleTextMouseDown(layer.id, e)}
              onTouchStart={(e) => handleTextTouchStart(layer.id, e)}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move select-none whitespace-pre transition-shadow ${
                isSelected
                  ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black/50 rounded'
                  : 'hover:ring-1 hover:ring-white/40 rounded'
              }`}
              style={{
                left: `${layer.x}%`,
                top: `${layer.y}%`,
                fontSize: `${layer.fontSize}px`,
                fontFamily: layer.fontFamily,
                color: layer.color,
                backgroundColor: layer.bgColor !== 'transparent' ? layer.bgColor : undefined,
                fontWeight: layer.bold ? 'bold' : 'normal',
                fontStyle: layer.italic ? 'italic' : 'normal',
                padding: layer.bgColor !== 'transparent' ? '4px 12px' : undefined,
                borderRadius: layer.bgColor !== 'transparent' ? '8px' : undefined,
                textShadow: '0 2px 8px rgba(0,0,0,0.8)',
              }}
            >
              {layer.text || 'Text'}
            </div>
          );
        })}
      </div>
    </div>
  );
};
