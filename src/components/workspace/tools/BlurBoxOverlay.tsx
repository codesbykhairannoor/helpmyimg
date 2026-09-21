import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { BlurBox } from './BlurFaceControl';
import { X, ShieldCheck } from 'lucide-react';

export interface BlurBoxOverlayProps {
  imageElement: HTMLImageElement | null;
  originalWidth?: number;
  originalHeight?: number;
  boxes: BlurBox[];
  setBoxes: React.Dispatch<React.SetStateAction<BlurBox[]>>;
  blurIntensity: number;
}

export const BlurBoxOverlay: React.FC<BlurBoxOverlayProps> = ({
  imageElement,
  originalWidth,
  originalHeight,
  boxes,
  setBoxes,
  blurIntensity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Interaction state
  const [activeAction, setActiveAction] = useState<{
    id?: string;
    type: 'draw' | 'drag' | 'resize';
    handle?: 'tl' | 'tr' | 'bl' | 'br';
    startX: number;
    startY: number;
    initialBox?: BlurBox;
  } | null>(null);

  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const updateDimensions = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    if (containerW <= 0 || containerH <= 0) return;

    const nw = originalWidth || imageElement?.naturalWidth || 800;
    const nh = originalHeight || imageElement?.naturalHeight || 600;
    if (!nw || !nh) return;

    const imageRatio = nw / nh;
    const containerRatio = containerW / containerH;

    let renderW: number, renderH: number;
    if (containerRatio > imageRatio) {
      renderH = containerH;
      renderW = containerH * imageRatio;
    } else {
      renderW = containerW;
      renderH = containerW / imageRatio;
    }

    const left = (containerW - renderW) / 2;
    const top = (containerH - renderH) / 2;
    const scaleX = renderW / nw;
    const scaleY = renderH / nh;

    if (scaleX > 0 && scaleY > 0) {
      setScale({ x: scaleX, y: scaleY });
      setOffset({ x: left, y: top });
    }
  }, [containerRef, imageElement, originalWidth, originalHeight]);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const container = containerRef.current;
    let observer: ResizeObserver | null = null;
    if (container) {
      observer = new ResizeObserver(updateDimensions);
      observer.observe(container);
    }
    if (imageElement) {
      imageElement.addEventListener('load', updateDimensions);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (observer) observer.disconnect();
      if (imageElement) {
        imageElement.removeEventListener('load', updateDimensions);
      }
    };
  }, [updateDimensions, imageElement]);

  const getClientCoords = (e: React.PointerEvent | PointerEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDownContainer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeAction) return;

    // Check if clicked directly on container (not on a box or handle)
    if (e.target !== containerRef.current) return;

    const { x, y } = getClientCoords(e);

    const nw = originalWidth || imageElement?.naturalWidth || 800;
    const nh = originalHeight || imageElement?.naturalHeight || 600;

    // Ensure click is within image bounds
    if (
      x < offset.x ||
      y < offset.y ||
      x > offset.x + nw * scale.x ||
      y > offset.y + nh * scale.y
    ) {
      return;
    }

    setActiveAction({
      type: 'draw',
      startX: x,
      startY: y,
    });
    setCurrentBox({ x, y, w: 0, h: 0 });
    try {
      containerRef.current?.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerDownBox = (
    e: React.PointerEvent<HTMLDivElement>,
    box: BlurBox,
    isHandle: boolean = false,
    handleType?: 'tl' | 'tr' | 'bl' | 'br'
  ) => {
    e.stopPropagation();
    const { x, y } = getClientCoords(e);
    setActiveAction({
      id: box.id,
      type: isHandle ? 'resize' : 'drag',
      handle: handleType,
      startX: x,
      startY: y,
      initialBox: { ...box },
    });
    try {
      containerRef.current?.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeAction || !containerRef.current) return;
    const { x, y } = getClientCoords(e);
    const dx = x - activeAction.startX;
    const dy = y - activeAction.startY;

    const safeScaleX = scale.x > 0 ? scale.x : 1;
    const safeScaleY = scale.y > 0 ? scale.y : 1;

    const nw = originalWidth || imageElement?.naturalWidth || 800;
    const nh = originalHeight || imageElement?.naturalHeight || 600;

    if (activeAction.type === 'draw') {
      setCurrentBox({
        x: Math.min(activeAction.startX, x),
        y: Math.min(activeAction.startY, y),
        w: Math.abs(x - activeAction.startX),
        h: Math.abs(y - activeAction.startY),
      });
    } else if (activeAction.type === 'drag' && activeAction.initialBox && activeAction.id) {
      const naturalDx = dx / safeScaleX;
      const naturalDy = dy / safeScaleY;

      setBoxes((prev) =>
        prev.map((b) => {
          if (b.id !== activeAction.id) return b;

          let newX = activeAction.initialBox!.x + naturalDx;
          let newY = activeAction.initialBox!.y + naturalDy;

          // Free unrestricted dragging across the entire width and height of the image
          newX = Math.max(0, Math.min(newX, Math.max(0, nw - 10)));
          newY = Math.max(0, Math.min(newY, Math.max(0, nh - 10)));

          return { ...b, x: newX, y: newY };
        })
      );
    } else if (
      activeAction.type === 'resize' &&
      activeAction.initialBox &&
      activeAction.id &&
      activeAction.handle
    ) {
      const naturalDx = dx / safeScaleX;
      const naturalDy = dy / safeScaleY;

      setBoxes((prev) =>
        prev.map((b) => {
          if (b.id !== activeAction.id) return b;
          const init = activeAction.initialBox!;
          let newX = init.x;
          let newY = init.y;

          let rightEdge = init.x + init.width;
          let bottomEdge = init.y + init.height;

          if (activeAction.handle!.includes('l')) {
            newX = Math.max(0, Math.min(init.x + naturalDx, rightEdge - 15));
          }
          if (activeAction.handle!.includes('r')) {
            rightEdge = Math.min(nw, Math.max(newX + 15, init.x + init.width + naturalDx));
          }
          if (activeAction.handle!.includes('t')) {
            newY = Math.max(0, Math.min(init.y + naturalDy, bottomEdge - 15));
          }
          if (activeAction.handle!.includes('b')) {
            bottomEdge = Math.min(nh, Math.max(newY + 15, init.y + init.height + naturalDy));
          }

          return {
            ...b,
            x: newX,
            y: newY,
            width: Math.max(15, rightEdge - newX),
            height: Math.max(15, bottomEdge - newY),
          };
        })
      );
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeAction) return;

    if (activeAction.type === 'draw' && currentBox) {
      const safeScaleX = scale.x > 0 ? scale.x : 1;
      const safeScaleY = scale.y > 0 ? scale.y : 1;

      if (currentBox.w > 12 && currentBox.h > 12) {
        const naturalX = (currentBox.x - offset.x) / safeScaleX;
        const naturalY = (currentBox.y - offset.y) / safeScaleY;
        const naturalW = currentBox.w / safeScaleX;
        const naturalH = currentBox.h / safeScaleY;

        setBoxes((prev) => [
          ...prev,
          {
            id: `box_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            x: Math.max(0, naturalX),
            y: Math.max(0, naturalY),
            width: Math.max(20, naturalW),
            height: Math.max(20, naturalH),
            type: 'blur',
          },
        ]);
      }
      setCurrentBox(null);
    }

    setActiveAction(null);
    try {
      containerRef.current?.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handleRemove = (id: string) => {
    setBoxes((prev) => prev.filter((b) => b.id !== id));
  };

  const handles = [
    { type: 'tl', cursor: 'nwse-resize', pos: '-top-2 -left-2' },
    { type: 'tr', cursor: 'nesw-resize', pos: '-top-2 -right-2' },
    { type: 'bl', cursor: 'nesw-resize', pos: '-bottom-2 -left-2' },
    { type: 'br', cursor: 'nwse-resize', pos: '-bottom-2 -right-2' },
  ] as const;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20 cursor-crosshair touch-none"
      onPointerDown={handlePointerDownContainer}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Existing Boxes */}
      {boxes.map((box) => {
        const left = offset.x + box.x * scale.x;
        const top = offset.y + box.y * scale.y;
        const width = box.width * scale.x;
        const height = box.height * scale.y;

        const isPixelate = box.type === 'pixelate';

        return (
          <div
            key={box.id}
            className="absolute border-2 border-neon-cyan/90 group cursor-move select-none rounded-lg shadow-glow-cyan/40 transition-shadow"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${Math.max(24, width)}px`,
              height: `${Math.max(24, height)}px`,
              backgroundColor: isPixelate ? 'rgba(6, 182, 212, 0.1)' : 'rgba(56, 189, 248, 0.1)',
            }}
            onPointerDown={(e) => handlePointerDownBox(e, box)}
          >
            {/* Corner Handles */}
            {handles.map((h) => (
              <div
                key={h.type}
                className={`absolute ${h.pos} w-4 h-4 bg-neon-cyan border-2 border-white rounded-full shadow-md z-30 hover:scale-125 transition-transform`}
                style={{ cursor: h.cursor }}
                onPointerDown={(e) => handlePointerDownBox(e, box, true, h.type)}
              />
            ))}

            {/* Remove / Delete Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(box.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute -top-3.5 -right-3.5 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg border border-white/50 z-30 transition-transform active:scale-90 cursor-pointer"
              title="Hapus area sensor ini"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Quick Tag Label */}
            <div className="absolute bottom-1 left-1.5 px-1.5 py-0.5 rounded bg-dark-900/80 text-[9px] font-mono font-bold text-neon-cyan border border-neon-cyan/30 pointer-events-none flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5 text-neon-emerald" />
              <span>{isPixelate ? 'PIXELATE' : 'BLUR'}</span>
            </div>
          </div>
        );
      })}

      {/* Current Drawing Box */}
      {currentBox && activeAction?.type === 'draw' && (
        <div
          className="absolute border-2 border-dashed border-neon-cyan bg-neon-cyan/20 pointer-events-none rounded-lg shadow-glow-cyan"
          style={{
            left: `${currentBox.x}px`,
            top: `${currentBox.y}px`,
            width: `${currentBox.w}px`,
            height: `${currentBox.h}px`,
          }}
        />
      )}
    </div>
  );
};
