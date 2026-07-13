import React, { useState, useEffect, useRef } from 'react';
import type { BlurBox } from './BlurFaceControl';
import { X } from 'lucide-react';

interface BlurBoxOverlayProps {
  imageElement: HTMLImageElement | null;
  boxes: BlurBox[];
  setBoxes: React.Dispatch<React.SetStateAction<BlurBox[]>>;
}

export const BlurBoxOverlay: React.FC<BlurBoxOverlayProps> = ({
  imageElement,
  boxes,
  setBoxes,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState({ x: 1, y: 1 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentBox, setCurrentBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (imageElement && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const imgRect = imageElement.getBoundingClientRect();
        
        // Calculate the scale and offset of the rendered image vs natural size
        const scaleX = imgRect.width / imageElement.naturalWidth;
        const scaleY = imgRect.height / imageElement.naturalHeight;
        
        setScale({ x: scaleX, y: scaleY });
        
        // Offset is relative to the container
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    // Check if clicked outside image area
    if (
      clientX < offset.x || 
      clientY < offset.y || 
      clientX > offset.x + (imageElement?.naturalWidth || 0) * scale.x ||
      clientY > offset.y + (imageElement?.naturalHeight || 0) * scale.y
    ) {
      return;
    }

    setIsDrawing(true);
    setStartPoint({ x: clientX, y: clientY });
    setCurrentBox({ x: clientX, y: clientY, w: 0, h: 0 });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    setCurrentBox({
      x: Math.min(startPoint.x, currentX),
      y: Math.min(startPoint.y, currentY),
      w: Math.abs(currentX - startPoint.x),
      h: Math.abs(currentY - startPoint.y),
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);

    if (currentBox && currentBox.w > 10 && currentBox.h > 10) {
      // Convert back to natural image coordinates
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
  };

  const handleRemove = (id: string) => {
    setBoxes(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-20 cursor-crosshair touch-none"
      onPointerDown={handlePointerDown}
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
            className="absolute border-2 border-neon-cyan bg-neon-cyan/20 backdrop-blur-md pointer-events-auto rounded-lg shadow-lg group transition-all"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${Math.max(20, width)}px`,
              height: `${Math.max(20, height)}px`,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(box.id);
              }}
              className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600 z-30"
              title="Remove Blur"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-bold opacity-0 group-hover:opacity-100 pointer-events-none">
              BLUR AREA
            </div>
          </div>
        );
      })}

      {/* Current Drawing Box */}
      {currentBox && (
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
