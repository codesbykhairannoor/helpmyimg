import React, { useEffect, useRef, useState, useCallback } from 'react';

interface InteractiveCropOverlayProps {
  imageElement: HTMLImageElement | null;
  originalWidth: number;
  originalHeight: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  onCropChange: (x: number, y: number, w: number, h: number) => void;
}

export const InteractiveCropOverlay: React.FC<InteractiveCropOverlayProps> = ({
  imageElement,
  originalWidth,
  originalHeight,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  onCropChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [renderRect, setRenderRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  const updateRenderRect = useCallback(() => {
    if (!imageElement || !containerRef.current) return;
    const img = imageElement;
    const container = containerRef.current;

    const containerRatio = container.clientWidth / container.clientHeight;
    // Handle cases where natural dimensions aren't loaded yet
    const imgNaturalW = img.naturalWidth || originalWidth;
    const imgNaturalH = img.naturalHeight || originalHeight;
    
    if (!imgNaturalW || !imgNaturalH) return;
    
    const imageRatio = imgNaturalW / imgNaturalH;

    let renderWidth, renderHeight;
    if (containerRatio > imageRatio) {
      renderHeight = container.clientHeight;
      renderWidth = container.clientHeight * imageRatio;
    } else {
      renderWidth = container.clientWidth;
      renderHeight = container.clientWidth / imageRatio;
    }

    const left = (container.clientWidth - renderWidth) / 2;
    const top = (container.clientHeight - renderHeight) / 2;

    setRenderRect({ left, top, width: renderWidth, height: renderHeight });
  }, [imageElement, originalWidth, originalHeight]);

  useEffect(() => {
    updateRenderRect();
    window.addEventListener('resize', updateRenderRect);
    // Observe image load
    if (imageElement) {
      imageElement.addEventListener('load', updateRenderRect);
    }
    return () => {
      window.removeEventListener('resize', updateRenderRect);
      if (imageElement) {
        imageElement.removeEventListener('load', updateRenderRect);
      }
    };
  }, [updateRenderRect, imageElement]);

  // Convert image pixels to overlay coordinates
  const scaleX = renderRect.width / originalWidth;
  const scaleY = renderRect.height / originalHeight;

  // Interaction State
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState<string | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0, cx: 0, cy: 0, cw: 0, ch: 0 });

  // Local state for instant 0ms dragging without triggering heavy parent re-render
  const [localCrop, setLocalCrop] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  // Sync when outside props change while not actively dragging
  useEffect(() => {
    if (!isDragging) {
      setLocalCrop(null);
    }
  }, [cropX, cropY, cropWidth, cropHeight, isDragging]);

  const rawCrop = localCrop || { x: cropX, y: cropY, w: cropWidth, h: cropHeight };
  const currentCrop = {
    x: Math.max(0, Math.min(rawCrop.x, Math.max(0, originalWidth - 10))),
    y: Math.max(0, Math.min(rawCrop.y, Math.max(0, originalHeight - 10))),
    w: Math.max(10, Math.min(rawCrop.w, originalWidth - Math.max(0, Math.min(rawCrop.x, originalWidth - 10)))),
    h: Math.max(10, Math.min(rawCrop.h, originalHeight - Math.max(0, Math.min(rawCrop.y, originalHeight - 10)))),
  };

  // Actual bounding box in container coordinates
  const boxX = renderRect.left + currentCrop.x * scaleX;
  const boxY = renderRect.top + currentCrop.y * scaleY;
  const boxW = currentCrop.w * scaleX;
  const boxH = currentCrop.h * scaleY;

  const handlePointerDown = (e: React.PointerEvent, handle: string) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragHandle(handle);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      cx: currentCrop.x,
      cy: currentCrop.y,
      cw: currentCrop.w,
      ch: currentCrop.h
    };
    setLocalCrop(currentCrop);
    try { (e.target as HTMLElement).setPointerCapture(e.pointerId); } catch(err) {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragHandle) return;
    e.preventDefault();

    const dx = (e.clientX - dragStartRef.current.x) / scaleX;
    const dy = (e.clientY - dragStartRef.current.y) / scaleY;

    let { cx, cy, cw, ch } = dragStartRef.current;

    if (dragHandle === 'move') {
      cx += dx;
      cy += dy;
    } else {
      if (dragHandle.includes('w')) {
        cx += dx;
        cw -= dx;
      }
      if (dragHandle.includes('e')) {
        cw += dx;
      }
      if (dragHandle.includes('n')) {
        cy += dy;
        ch -= dy;
      }
      if (dragHandle.includes('s')) {
        ch += dy;
      }
    }

    // Constraints
    if (dragHandle === 'move') {
      cx = Math.max(0, Math.min(cx, originalWidth - cw));
      cy = Math.max(0, Math.min(cy, originalHeight - ch));
    } else {
      // Prevent negative width/height
      if (cw < 10) {
        if (dragHandle.includes('w')) cx -= (10 - cw);
        cw = 10;
      }
      if (ch < 10) {
        if (dragHandle.includes('n')) cy -= (10 - ch);
        ch = 10;
      }
      
      // Prevent exceeding boundaries
      if (cx < 0) {
        cw += cx;
        cx = 0;
      }
      if (cy < 0) {
        ch += cy;
        cy = 0;
      }
      if (cx + cw > originalWidth) cw = originalWidth - cx;
      if (cy + ch > originalHeight) ch = originalHeight - cy;
    }

    const newX = Math.round(cx);
    const newY = Math.round(cy);
    const newW = Math.round(cw);
    const newH = Math.round(ch);

    // Update local state instantaneously at 120 FPS
    setLocalCrop({ x: newX, y: newY, w: newW, h: newH });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (localCrop && isDragging) {
      onCropChange(localCrop.x, localCrop.y, localCrop.w, localCrop.h);
    }
    setIsDragging(false);
    setDragHandle(null);
    try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch(err) {}
  };

  if (!renderRect.width || !renderRect.height || !originalWidth || !originalHeight) {
    return <div ref={containerRef} className="absolute inset-0 pointer-events-none" />;
  }

  const handleSize = 18; // Larger visual handle (18px)
  const hitTargetSize = 44; // Apple/Google standard 44px touch hit target for HP

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none">
      {/* Darkened overlay mask */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <path
          d={`
            M 0 0 H 10000 V 10000 H 0 Z
            M ${boxX} ${boxY} H ${boxX + boxW} V ${boxY + boxH} H ${boxX} Z
          `}
          fill="rgba(0, 0, 0, 0.65)"
          fillRule="evenodd"
        />
        {/* Solid Border */}
        <rect
          x={boxX}
          y={boxY}
          width={boxW}
          height={boxH}
          fill="none"
          stroke="#00F0FF"
          strokeWidth="2"
          className="pointer-events-none"
        />
        {/* Rule of Thirds Grid */}
        <line x1={boxX + boxW / 3} y1={boxY} x2={boxX + boxW / 3} y2={boxY + boxH} stroke="#00F0FF" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" className="pointer-events-none" />
        <line x1={boxX + (boxW * 2) / 3} y1={boxY} x2={boxX + (boxW * 2) / 3} y2={boxY + boxH} stroke="#00F0FF" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" className="pointer-events-none" />
        <line x1={boxX} y1={boxY + boxH / 3} x2={boxX + boxW} y2={boxY + boxH / 3} stroke="#00F0FF" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" className="pointer-events-none" />
        <line x1={boxX} y1={boxY + (boxH * 2) / 3} x2={boxX + boxW} y2={boxY + (boxH * 2) / 3} stroke="#00F0FF" strokeWidth="1" opacity="0.4" strokeDasharray="3 3" className="pointer-events-none" />
      </svg>

      {/* Interactive Move Area with touch-action: none for HP */}
      <div
        className="absolute cursor-move pointer-events-auto"
        style={{ left: boxX, top: boxY, width: boxW, height: boxH, touchAction: 'none' }}
        onPointerDown={(e) => handlePointerDown(e, 'move')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      />

      {/* Resize Handles with 44px touch hit targets for easy HP dragging */}
      {[
        { id: 'nw', cursor: 'nwse-resize', x: boxX, y: boxY },
        { id: 'n', cursor: 'ns-resize', x: boxX + boxW / 2, y: boxY },
        { id: 'ne', cursor: 'nesw-resize', x: boxX + boxW, y: boxY },
        { id: 'w', cursor: 'ew-resize', x: boxX, y: boxY + boxH / 2 },
        { id: 'e', cursor: 'ew-resize', x: boxX + boxW, y: boxY + boxH / 2 },
        { id: 'sw', cursor: 'nesw-resize', x: boxX, y: boxY + boxH },
        { id: 's', cursor: 'ns-resize', x: boxX + boxW / 2, y: boxY + boxH },
        { id: 'se', cursor: 'nwse-resize', x: boxX + boxW, y: boxY + boxH },
      ].map((handle) => (
        <div
          key={handle.id}
          className="absolute pointer-events-auto flex items-center justify-center"
          style={{
            left: handle.x - hitTargetSize / 2,
            top: handle.y - hitTargetSize / 2,
            width: hitTargetSize,
            height: hitTargetSize,
            cursor: handle.cursor,
            touchAction: 'none',
          }}
          onPointerDown={(e) => handlePointerDown(e, handle.id)}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* Visual Dot */}
          <div
            className="bg-neon-cyan border-2 border-dark-900 rounded-full shadow-lg transition-transform active:scale-125"
            style={{
              width: handleSize,
              height: handleSize,
            }}
          />
        </div>
      ))}
    </div>
  );
};
