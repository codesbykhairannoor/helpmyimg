import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageCompareSliderProps {
  beforeImage: string;
  afterImage: string;
}

export const ImageCompareSlider: React.FC<ImageCompareSliderProps> = ({ beforeImage, afterImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
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

  // We use a ResizeObserver to measure the exact rendered size of the layout image
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!imageRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setImageSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });
    observer.observe(imageRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      className="relative flex items-center justify-center max-w-full max-h-full"
      style={{ width: '100%', height: '100%' }}
      ref={containerRef}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
    >
      <motion.div 
        className="relative select-none cursor-ew-resize rounded-lg overflow-hidden shadow-2xl"
        style={{
          width: imageSize.width > 0 ? imageSize.width : 'auto',
          height: imageSize.height > 0 ? imageSize.height : 'auto',
          maxWidth: '100%',
          maxHeight: '100%'
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {/* Layout Image - strictly used to let the browser compute the aspect ratio natively */}
        <img
          ref={imageRef}
          src={beforeImage}
          alt="Layout"
          className="max-w-full max-h-full object-contain pointer-events-none opacity-0"
          style={{ visibility: imageSize.width > 0 ? 'hidden' : 'visible' }}
        />

        {/* Visible Before Image */}
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-contain pointer-events-none"
          style={{ backgroundImage: `url(${beforeImage})` }}
        />

        {/* Visible After Image */}
        <div 
          className="absolute inset-0 bg-no-repeat bg-center bg-contain pointer-events-none"
          style={{ 
            backgroundImage: `url(${afterImage})`,
            clipPath: `inset(0 0 0 ${sliderPosition}%)` 
          }}
        />

        {/* Slider Line and Handle */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-[0_0_5px_rgba(0,0,0,0.5)] z-10"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center pointer-events-auto cursor-ew-resize">
            <div className="flex gap-1">
              <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
              <div className="w-0.5 h-3 bg-slate-300 rounded-full" />
            </div>
          </div>
        </div>

        {/* Labels overlayed directly on the images */}
        <div className="absolute bottom-4 left-0 right-0 pointer-events-none">
          {sliderPosition > 15 && (
            <div className="absolute left-4 bottom-0 bg-dark-900/80 backdrop-blur-sm px-3 py-1.5 text-xs text-white font-bold rounded-lg shadow-sm border border-dark-600/50 transition-opacity">
              Original
            </div>
          )}
          {sliderPosition < 85 && (
            <div className="absolute right-4 bottom-0 bg-dark-900/80 backdrop-blur-sm px-3 py-1.5 text-xs text-neon-cyan font-bold rounded-lg shadow-sm border border-neon-cyan/20 transition-opacity">
              Compressed
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
