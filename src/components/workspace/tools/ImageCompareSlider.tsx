import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageCompareSliderProps {
  beforeImage: string;
  afterImage: string;
  originalSize?: number;
  compressedSize?: number;
}

const formatSize = (bytes: number) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({ beforeImage, afterImage, originalSize, compressedSize }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const onMouseMove = (e: React.MouseEvent | MouseEvent) => {
    if (isDragging) {
      if ('touches' in e) {
        handleMove((e as unknown as TouchEvent).touches[0].clientX);
      } else {
        handleMove((e as MouseEvent).clientX);
      }
    }
  };

  const onTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (isDragging) {
      handleMove((e as TouchEvent).touches[0].clientX);
    }
  };

  useEffect(() => {
    if (isDragging) {
      const handleMouseUp = () => setIsDragging(false);
      window.addEventListener('mousemove', onMouseMove as EventListener);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', onTouchMove as EventListener, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', onMouseMove as EventListener);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', onTouchMove as EventListener);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <motion.div 
      className="grid cursor-ew-resize rounded-lg overflow-hidden shadow-2xl max-h-full max-w-full"
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      style={{ 
        display: 'grid',
        aspectRatio: aspectRatio || 'auto',
      }}
    >
      {/* Before Image (Base layout) */}
      <img
        src={beforeImage}
        alt="Before"
        onLoad={(e) => {
          const { naturalWidth, naturalHeight } = e.currentTarget;
          if (naturalWidth && naturalHeight) {
            setAspectRatio(`${naturalWidth} / ${naturalHeight}`);
          }
        }}
        className="col-start-1 row-start-1 w-full h-full object-cover block pointer-events-none"
      />

      {/* After Image (Clipped) */}
      <img
        src={afterImage}
        alt="After"
        className="col-start-1 row-start-1 w-full h-full object-cover block pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      />

      {/* Slider Handle */}
      <div 
        className="col-start-1 row-start-1 z-10 w-1 h-full bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none relative"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-none">
          <div className="flex gap-1">
            <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
            <div className="w-0.5 h-3 bg-slate-400 rounded-full" />
          </div>
        </div>
      </div>
      
      {/* Labels */}
      <div className="col-start-1 row-start-1 z-10 pointer-events-none flex justify-between items-end p-4 h-full">
        <div 
          className="bg-dark-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-dark-600/50 transition-opacity flex flex-col items-start"
          style={{ opacity: sliderPosition > 15 ? 1 : 0 }}
        >
          <span className="text-xs text-white font-bold">Original</span>
          {originalSize && (
            <span className="text-[10px] text-slate-300 font-mono mt-0.5">{formatSize(originalSize)}</span>
          )}
        </div>
        <div 
          className="bg-dark-900/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-neon-cyan/20 transition-opacity flex flex-col items-end"
          style={{ opacity: sliderPosition < 85 ? 1 : 0 }}
        >
          <span className="text-xs text-neon-cyan font-bold">Compressed</span>
          {compressedSize && (
            <span className="text-[10px] text-neon-cyan/80 font-mono mt-0.5">{formatSize(compressedSize)}</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
