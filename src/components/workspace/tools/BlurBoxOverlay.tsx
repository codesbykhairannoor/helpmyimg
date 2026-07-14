import React, { useState, useEffect, useRef } from 'react';
import type { BlurBox } from './BlurFaceControl';
import { X } from 'lucide-react';

interface BlurBoxOverlayProps {
  imageElement: HTMLImageElement | null;
  boxes: BlurBox[];
  setBoxes: React.Dispatch<React.SetStateAction<BlurBox[]>>;
  blurIntensity: number;
}

export const BlurBoxOverlay: React.FC<BlurBoxOverlayProps> = ({
  imageElement,
  boxes,
  setBoxes,
  blurIntensity
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

  const [currentBox, setCurrentBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (imageElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imgRect = imageElement.getBoundingClientRect();
        
        const scaleX = imgRect.width / imageElement.naturalWidth;
        const scaleY = imgRect.height / imageElement.naturalHeight;
        
        setScale({ x: scaleX, y: scaleY });
        
        setOffset({
          x: imgRect.left - containerRect.left,
          y: imgRect.top - containerRect.top
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    const observer = new ResizeObserver(updateDimensions);
    if (imageElement) observer.observe(imageElement);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (imageElement) observer.unobserve(imageElement);
    };
  }, [imageElement]);

  const getClientCoords = (e: React.PointerEvent | PointerEvent) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDownContainer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeAction) return;
    
    // Check if clicked exactly on container (not on a box)
    if (e.target !== containerRef.current) return;

    const { x, y } = getClientCoords(e);
    
    // Ensure click is within image bounds
    if (
      x < offset.x || y < offset.y || 
      x > offset.x + (imageElement?.naturalWidth || 0) * scale.x ||
      y > offset.y + (imageElement?.naturalHeight || 0) * scale.y
    ) return;

    setActiveAction({
      type: 'draw',
      startX: x,
      startY: y
    });
    setCurrentBox({ x, y, w: 0, h: 0 });
    try { (e.target as HTMLElement).setPointerCapture(e.pointerId); } catch(err) {}
  };

  const handlePointerDownBox = (e: React.PointerEvent<HTMLDivElement>, box: BlurBox, isHandle: boolean = false, handleType?: 'tl' | 'tr' | 'bl' | 'br') => {
    e.stopPropagation();
    const { x, y } = getClientCoords(e);
    setActiveAction({
      id: box.id,
      type: isHandle ? 'resize' : 'drag',
      handle: handleType,
      startX: x,
      startY: y,
      initialBox: { ...box }
    });
    try { (e.target as HTMLElement).setPointerCapture(e.pointerId); } catch(err) {}
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeAction || !containerRef.current) return;
    const { x, y } = getClientCoords(e);
    const dx = x - activeAction.startX;
    const dy = y - activeAction.startY;

    if (activeAction.type === 'draw') {
      setCurrentBox({
        x: Math.min(activeAction.startX, x),
        y: Math.min(activeAction.startY, y),
        w: Math.abs(x - activeAction.startX),
        h: Math.abs(y - activeAction.startY),
      });
    } else if (activeAction.type === 'drag' && activeAction.initialBox && activeAction.id) {
      const naturalDx = dx / scale.x;
      const naturalDy = dy / scale.y;
      
      setBoxes(prev => prev.map(b => {
        if (b.id !== activeAction.id) return b;
        
        let newX = activeAction.initialBox!.x + naturalDx;
        let newY = activeAction.initialBox!.y + naturalDy;
        
        newX = Math.max(0, Math.min(newX, (imageElement?.naturalWidth || 0) - b.width));
        newY = Math.max(0, Math.min(newY, (imageElement?.naturalHeight || 0) - b.height));
        
        return { ...b, x: newX, y: newY };
      }));
    } else if (activeAction.type === 'resize' && activeAction.initialBox && activeAction.id && activeAction.handle) {
      const naturalDx = dx / scale.x;
      const naturalDy = dy / scale.y;
      
      setBoxes(prev => prev.map(b => {
        if (b.id !== activeAction.id) return b;
        const init = activeAction.initialBox!;
        let newX = init.x;
        let newY = init.y;
        
        let rightEdge = init.x + init.width;
        let bottomEdge = init.y + init.height;

        if (activeAction.handle!.includes('l')) {
          newX = Math.max(0, Math.min(init.x + naturalDx, rightEdge - 10));
        }
        if (activeAction.handle!.includes('r')) {
          rightEdge = Math.min((imageElement?.naturalWidth || 0), init.x + init.width + naturalDx);
        }
        if (activeAction.handle!.includes('t')) {
          newY = Math.max(0, Math.min(init.y + naturalDy, bottomEdge - 10));
        }
        if (activeAction.handle!.includes('b')) {
          bottomEdge = Math.min((imageElement?.naturalHeight || 0), init.y + init.height + naturalDy);
        }
        
        return { ...b, x: newX, y: newY, width: rightEdge - newX, height: bottomEdge - newY };
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!activeAction) return;
    
    if (activeAction.type === 'draw' && currentBox) {
      if (currentBox.w > 10 && currentBox.h > 10) {
        const naturalX = (currentBox.x - offset.x) / scale.x;
        const naturalY = (currentBox.y - offset.y) / scale.y;
        const naturalW = currentBox.w / scale.x;
        const naturalH = currentBox.h / scale.y;

        setBoxes(prev => [...prev, {
          id: `box_${Date.now()}`,
          x: Math.max(0, naturalX),
          y: Math.max(0, naturalY),
          width: naturalW,
          height: naturalH
        }]);
      }
      setCurrentBox(null);
    }
    
    setActiveAction(null);
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const handleRemove = (id: string) => {
    setBoxes(prev => prev.filter(b => b.id !== id));
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
      {boxes.map(box => {
        const left = offset.x + box.x * scale.x;
        const top = offset.y + box.y * scale.y;
        const width = box.width * scale.x;
        const height = box.height * scale.y;

        return (
          <div
            key={box.id}
            className="absolute border-2 border-white bg-transparent pointer-events-auto shadow-sm group cursor-move"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${Math.max(20, width)}px`,
              height: `${Math.max(20, height)}px`,
              backdropFilter: `blur(${blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${blurIntensity}px)`
            }}
            onPointerDown={(e) => handlePointerDownBox(e, box)}
          >
            {/* Corner Handles */}
            {handles.map(h => (
              <div 
                key={h.type}
                className={`absolute ${h.pos} w-4 h-4 bg-white border border-slate-400 rounded-full shadow-sm`}
                style={{ cursor: h.cursor }}
                onPointerDown={(e) => handlePointerDownBox(e, box, true, h.type)}
              />
            ))}

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(box.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-10"
              title="Remove Blur Box"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}

      {/* Current Drawing Box */}
      {currentBox && activeAction?.type === 'draw' && (
        <div
          className="absolute border-2 border-dashed border-neon-cyan bg-neon-cyan/10 pointer-events-none"
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
