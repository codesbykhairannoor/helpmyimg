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
    // Observe image element for changes
    const observer = new ResizeObserver(updateDimensions);
    if (imageElement) observer.observe(imageElement);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (imageElement) observer.unobserve(imageElement);
    };
  }, [imageElement]);

  const handleRemove = (id: string) => {
    setBoxes(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none z-20">
      {boxes.map(box => {
        const left = offset.x + box.x * scale.x;
        const top = offset.y + box.y * scale.y;
        const width = box.width * scale.x;
        const height = box.height * scale.y;

        return (
          <div
            key={box.id}
            className="absolute border-2 border-neon-cyan bg-neon-cyan/20 backdrop-blur-md cursor-move pointer-events-auto rounded-lg shadow-lg group transition-all"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${Math.max(20, width)}px`,
              height: `${Math.max(20, height)}px`,
            }}
            // Note: Full drag/resize logic omitted for brevity, fallback to static boxes that blur
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(box.id);
              }}
              className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs font-bold opacity-0 group-hover:opacity-100">
              BLUR AREA
            </div>
          </div>
        );
      })}
    </div>
  );
};
