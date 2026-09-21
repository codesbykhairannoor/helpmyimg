import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  blurIntensity: _blurIntensity,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setTick] = useState(0);

  // Force re-render on resize so imgLayout updates
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    window.addEventListener('resize', forceUpdate);
    const ro = containerRef.current ? new ResizeObserver(forceUpdate) : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);
    if (imageElement) imageElement.addEventListener('load', forceUpdate);

    return () => {
      window.removeEventListener('resize', forceUpdate);
      if (ro) ro.disconnect();
      if (imageElement) imageElement.removeEventListener('load', forceUpdate);
    };
  }, [forceUpdate, imageElement]);

  // Interaction state
  const [activeAction, setActiveAction] = useState<{
    id?: string;
    type: 'draw' | 'drag' | 'resize';
    handle?: 'tl' | 'tr' | 'bl' | 'br';
    startClientX: number;
    startClientY: number;
    startFracX?: number;
    startFracY?: number;
    initialBox?: BlurBox;
  } | null>(null);

  const [currentBox, setCurrentBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const nw = originalWidth || imageElement?.naturalWidth || 800;
  const nh = originalHeight || imageElement?.naturalHeight || 600;

  const getZoom = () => {
    if (typeof document === 'undefined') return 1;
    const zoom = parseFloat(getComputedStyle(document.body).zoom);
    return !isNaN(zoom) && zoom > 0 ? zoom : 1;
  };

  const getLayout = () => {
    const zoom = getZoom();
    const vpRect = containerRef.current?.getBoundingClientRect();
    const imgRect = imageElement?.getBoundingClientRect();

    if (vpRect && imgRect && imgRect.width > 0 && imgRect.height > 0) {
      return {
        left: (imgRect.left - vpRect.left) / zoom,
        top: (imgRect.top - vpRect.top) / zoom,
        width: imgRect.width / zoom,
        height: imgRect.height / zoom,
        imgRect,
      };
    }

    const w = containerRef.current?.clientWidth || 700;
    const h = containerRef.current?.clientHeight || 525;
    return {
      left: 0,
      top: 0,
      width: w,
      height: h,
      imgRect: vpRect,
    };
  };

  const layout = getLayout();

  const handlePointerDownContainer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeAction) return;
    if (e.target !== containerRef.current) return;
    if (!containerRef.current) return;

    const imgRect = imageElement?.getBoundingClientRect() || containerRef.current.getBoundingClientRect();
    if (!imgRect || imgRect.width <= 0 || imgRect.height <= 0) return;

    // Check if pointer is on the image
    if (
      e.clientX < imgRect.left - 5 ||
      e.clientX > imgRect.right + 5 ||
      e.clientY < imgRect.top - 5 ||
      e.clientY > imgRect.bottom + 5
    ) {
      return;
    }

    const fracX = Math.max(0, Math.min(1, (e.clientX - imgRect.left) / imgRect.width));
    const fracY = Math.max(0, Math.min(1, (e.clientY - imgRect.top) / imgRect.height));

    setActiveAction({
      type: 'draw',
      startClientX: e.clientX,
      startClientY: e.clientY,
      startFracX: fracX,
      startFracY: fracY,
    });
    setCurrentBox({ x: fracX * nw, y: fracY * nh, w: 0, h: 0 });
    try {
      containerRef.current.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerDownBox = (
    e: React.PointerEvent<HTMLDivElement>,
    box: BlurBox,
    isHandle: boolean = false,
    handleType?: 'tl' | 'tr' | 'bl' | 'br'
  ) => {
    e.stopPropagation();
    if (!containerRef.current) return;

    setActiveAction({
      id: box.id,
      type: isHandle ? 'resize' : 'drag',
      handle: handleType,
      startClientX: e.clientX,
      startClientY: e.clientY,
      initialBox: { ...box },
    });
    try {
      containerRef.current.setPointerCapture(e.pointerId);
    } catch (err) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeAction || !containerRef.current) return;
    const imgRect = imageElement?.getBoundingClientRect() || containerRef.current.getBoundingClientRect();
    if (!imgRect || imgRect.width <= 0 || imgRect.height <= 0) return;

    if (activeAction.type === 'draw' && activeAction.startFracX !== undefined && activeAction.startFracY !== undefined) {
      const fracX = Math.max(0, Math.min(1, (e.clientX - imgRect.left) / imgRect.width));
      const fracY = Math.max(0, Math.min(1, (e.clientY - imgRect.top) / imgRect.height));

      const leftFrac = Math.min(activeAction.startFracX, fracX);
      const topFrac = Math.min(activeAction.startFracY, fracY);
      const widthFrac = Math.abs(fracX - activeAction.startFracX);
      const heightFrac = Math.abs(fracY - activeAction.startFracY);

      setCurrentBox({
        x: leftFrac * nw,
        y: topFrac * nh,
        w: widthFrac * nw,
        h: heightFrac * nh,
      });
    } else if (activeAction.type === 'drag' && activeAction.initialBox && activeAction.id) {
      const naturalDx = ((e.clientX - activeAction.startClientX) / imgRect.width) * nw;
      const naturalDy = ((e.clientY - activeAction.startClientY) / imgRect.height) * nh;

      setBoxes((prev) =>
        prev.map((b) => {
          if (b.id !== activeAction.id) return b;
          const newX = Math.max(0, Math.min(nw - b.width, activeAction.initialBox!.x + naturalDx));
          const newY = Math.max(0, Math.min(nh - b.height, activeAction.initialBox!.y + naturalDy));
          return { ...b, x: newX, y: newY };
        })
      );
    } else if (
      activeAction.type === 'resize' &&
      activeAction.initialBox &&
      activeAction.id &&
      activeAction.handle
    ) {
      const naturalDx = ((e.clientX - activeAction.startClientX) / imgRect.width) * nw;
      const naturalDy = ((e.clientY - activeAction.startClientY) / imgRect.height) * nh;

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
      if (currentBox.w > 12 && currentBox.h > 12) {
        setBoxes((prev) => [
          ...prev,
          {
            id: `box_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            x: Math.max(0, currentBox.x),
            y: Math.max(0, currentBox.y),
            width: Math.max(20, currentBox.w),
            height: Math.max(20, currentBox.h),
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
      className="absolute inset-0 z-20 cursor-crosshair touch-none select-none"
      onPointerDown={handlePointerDownContainer}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Existing Boxes */}
      {boxes.map((box) => {
        const left = layout.left + (box.x / nw) * layout.width;
        const top = layout.top + (box.y / nh) * layout.height;
        const width = (box.width / nw) * layout.width;
        const height = (box.height / nh) * layout.height;

        const isPixelate = box.type === 'pixelate';

        return (
          <div
            key={box.id}
            className="absolute border-2 border-neon-cyan/90 group cursor-move select-none rounded-lg shadow-glow-cyan/40 transition-shadow box-border"
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
          className="absolute border-2 border-dashed border-neon-cyan bg-neon-cyan/20 pointer-events-none rounded-lg shadow-glow-cyan box-border"
          style={{
            left: `${layout.left + (currentBox.x / nw) * layout.width}px`,
            top: `${layout.top + (currentBox.y / nh) * layout.height}px`,
            width: `${(currentBox.w / nw) * layout.width}px`,
            height: `${(currentBox.h / nh) * layout.height}px`,
          }}
        />
      )}
    </div>
  );
};
