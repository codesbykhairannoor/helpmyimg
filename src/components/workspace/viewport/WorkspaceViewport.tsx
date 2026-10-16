// src/components/workspace/viewport/WorkspaceViewport.tsx
// Main Canvas & Image Viewport with AI Scanner and Interactive Overlays

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, Upload, Info, X } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import { AiScanOverlay } from './AiScanOverlay';
import { ImageCompareSlider } from '../tools/ImageCompareSlider';
import { InteractiveCropOverlay } from '../tools/InteractiveCropOverlay';
import { BlurBoxOverlay } from '../tools/BlurBoxOverlay';
import { DesignEditorControl } from '../tools/DesignEditorControl';
import { analyzeImageMetadata, type MetadataAnalysis } from '../../../utils/metadataEngine';
import type { BatchItem, BlurBox } from '../types';

interface WorkspaceViewportProps {
  initialTab: string;
  currentItem: BatchItem | null;
  isApplyingEffect: boolean;
  onRetry: () => void;
  onUploadOther: () => void;
  // Canvas refs and handlers for brush/picker
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  onCanvasMouseDown: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onCanvasMouseUp: () => void;
  // Image element for overlays
  imageElement: HTMLImageElement | null;
  setImageElement: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>;
  originalDimensions: { width: number; height: number };
  // Rotation & Flip
  rotationDeg: number;
  flipH: boolean;
  flipV: boolean;
  // Crop states
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
  cropRadius: number;
  onCropChange: (x: number, y: number, w: number, h: number) => void;
  // Blur face states
  blurBoxes: BlurBox[];
  setBlurBoxes: React.Dispatch<React.SetStateAction<BlurBox[]>>;
  blurIntensity: number;
  // Resize states for instant real-time live preview
  resizeWidth?: number;
  resizeHeight?: number;
  resizeMode?: 'standard' | 'smart';
  // Brush states for dynamic hover cursor
  brushSize?: number;
  brushMode?: 'restore' | 'erase';
}

export const WorkspaceViewport: React.FC<WorkspaceViewportProps> = ({
  initialTab,
  currentItem,
  isApplyingEffect,
  onRetry,
  onUploadOther,
  canvasRef,
  onCanvasMouseDown,
  onCanvasMouseMove,
  onCanvasMouseUp,
  imageElement,
  setImageElement,
  originalDimensions,
  rotationDeg,
  flipH,
  flipV,
  cropX,
  cropY,
  cropWidth,
  cropHeight,
  cropRadius,
  onCropChange,
  blurBoxes,
  setBlurBoxes,
  blurIntensity,
  resizeWidth = 0,
  resizeHeight = 0,
  resizeMode = 'standard',
  brushSize = 25,
  brushMode = 'restore',
}) => {
  const { t } = useTranslation();
  const viewportContainerRef = useRef<HTMLDivElement>(null);
  const brushCursorRef = useRef<HTMLDivElement>(null);
  const [isBrushHovering, setIsBrushHovering] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -1000, y: -1000 });
  const [showMetadataHud, setShowMetadataHud] = useState(false);
  const [metadataInfo, setMetadataInfo] = useState<MetadataAnalysis | null>(null);

  useEffect(() => {
    let isCancelled = false;
    if (showMetadataHud && currentItem?.file) {
      analyzeImageMetadata(currentItem.file)
        .then((res) => {
          if (!isCancelled) setMetadataInfo(res);
        })
        .catch(() => {
          if (!isCancelled) setMetadataInfo(null);
        });
    }
    return () => {
      isCancelled = true;
    };
  }, [showMetadataHud, currentItem]);

  const getPageZoom = useCallback(() => {
    if (typeof document === 'undefined') return 1;
    const zoom = parseFloat(getComputedStyle(document.body).zoom);
    return !isNaN(zoom) && zoom > 0 ? zoom : 1;
  }, []);

  return (
    <div className="space-y-4 lg:static">
      <div
        ref={viewportContainerRef}
        className={`w-full rounded-3xl border border-dark-500/80 bg-dark-900/90 shadow-glass overflow-hidden relative flex items-center justify-center checkerboard-bg transition-all duration-150 ${
          initialTab === 'design'
            ? 'h-[75vh] md:h-auto md:aspect-[4/3]'
            : 'h-[380px] sm:h-[440px] md:h-[480px] lg:h-auto lg:aspect-[4/3] lg:max-h-[500px]'
        }`}
      >
        {/* Floating Metadata HUD Button on Image */}
        {(currentItem?.processedUrl || currentItem?.originalUrl) && initialTab !== 'design' && (
          <button
            type="button"
            onClick={() => setShowMetadataHud(!showMetadataHud)}
            className={`absolute top-4 left-4 z-30 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
              showMetadataHud
                ? 'bg-neon-cyan text-dark-900 border-neon-cyan font-bold shadow-glow-cyan'
                : 'bg-dark-900/85 hover:bg-dark-900 text-slate-200 hover:text-white border-dark-600/80'
            }`}
            title={showMetadataHud ? t('work.hideMetadataHud', { defaultValue: 'Tutup Info' }) : t('work.viewMetadataHud', { defaultValue: 'Info Metadata' })}
          >
            {showMetadataHud ? <X className="w-3.5 h-3.5" /> : <Info className="w-3.5 h-3.5 text-neon-cyan" />}
            <span>{showMetadataHud ? t('work.hideMetadataHud', { defaultValue: 'Tutup Info' }) : t('work.viewMetadataHud', { defaultValue: 'Info Metadata' })}</span>
          </button>
        )}

        {/* Floating Glassmorphism Metadata Card HUD */}
        <AnimatePresence>
          {showMetadataHud && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-14 left-4 z-30 max-w-xs w-[calc(100%-2rem)] p-3.5 rounded-2xl bg-dark-950/90 border border-neon-cyan/40 text-white shadow-2xl backdrop-blur-xl space-y-2.5 text-xs font-sans"
            >
              <div className="flex items-center justify-between border-b border-dark-700/80 pb-2">
                <div className="flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-neon-cyan shrink-0" />
                  <span className="font-mono font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                    {t('editexif.inspectTitle', { defaultValue: 'ORIGINAL METADATA' })}
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan font-bold border border-neon-cyan/30 uppercase">
                  {metadataInfo?.format || 'IMAGE'}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 text-[11px]">{t('editexif.fieldCamera', { defaultValue: 'Kamera' })}:</span>
                  <span className="font-semibold text-slate-100 text-right text-[11px] truncate">
                    {metadataInfo?.cameraModel || metadataInfo?.cameraMake
                      ? `${metadataInfo?.cameraMake || ''} ${metadataInfo?.cameraModel || ''}`.trim()
                      : '-'}
                  </span>
                </div>

                {metadataInfo?.lensModel && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">{t('editexif.fieldLens', { defaultValue: 'Lensa' })}:</span>
                    <span className="text-slate-300 text-right text-[11px] truncate">{metadataInfo.lensModel}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 text-[11px]">{t('editexif.fieldExposure', { defaultValue: 'Eksposur' })}:</span>
                  <span className="font-mono text-neon-cyan text-right text-[11px] truncate">
                    {[metadataInfo?.shutterSpeed, metadataInfo?.aperture, metadataInfo?.iso ? `ISO ${metadataInfo.iso}` : null, metadataInfo?.focalLength].filter(Boolean).join(' • ') || '-'}
                  </span>
                </div>

                {metadataInfo?.dateTaken && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">{t('editexif.fieldDateCreated', { defaultValue: 'Waktu' })}:</span>
                    <span className="font-mono text-slate-200 text-right text-[10px] truncate">{metadataInfo.dateTaken}</span>
                  </div>
                )}

                {originalDimensions.width > 0 && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">{t('editexif.fieldDimensions', { defaultValue: 'Dimensi' })}:</span>
                    <span className="font-mono text-slate-300 text-right text-[11px]">{originalDimensions.width} × {originalDimensions.height} px</span>
                  </div>
                )}

                {currentItem?.file && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">{t('editexif.fieldFileSize', { defaultValue: 'Ukuran' })}:</span>
                    <span className="font-mono text-slate-300 text-right text-[11px]">{(currentItem.file.size / 1024).toFixed(1)} KB</span>
                  </div>
                )}

                {metadataInfo?.artist && (
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 text-[11px]">{t('editexif.fieldAuthor', { defaultValue: 'Kreator' })}:</span>
                    <span className="text-slate-200 text-right text-[11px] truncate">{metadataInfo.artist}</span>
                  </div>
                )}

                <div className="pt-1 flex items-center justify-between border-t border-dark-700/60">
                  <span className="text-[10px] text-slate-400">C2PA / Provenance:</span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase ${
                    metadataInfo?.hasC2PA
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {metadataInfo?.hasC2PA ? 'Flagged' : 'Clean'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Neural Scanning Animation & HUD Overlay */}
        {currentItem?.status === 'processing' && <AiScanOverlay currentItem={currentItem} />}

        {/* Top-Edge Laser Sweep & Floating Pill when Applying Background/Effect */}
        <AnimatePresence>
          {isApplyingEffect && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-pink shadow-glow-cyan z-30 overflow-hidden"
              >
                <motion.div
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-1/2 h-full bg-white blur-xs"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                className="absolute top-4 right-4 z-30 px-3.5 py-1.5 rounded-full bg-dark-900/90 border border-neon-cyan/50 backdrop-blur-md flex items-center gap-2 shadow-glow-cyan"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neon-cyan animate-spin" />
                <span className="text-xs font-bold text-white font-heading tracking-wide">
                  {t('editor.applying', { defaultValue: 'Applying Effect...' })}
                </span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Error State Overlay */}
        {currentItem?.status === 'error' && (
          <div className="absolute inset-0 bg-dark-900/90 backdrop-blur-md flex flex-col items-center justify-center z-20 space-y-4 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h4 className="font-heading font-bold text-white text-base">
                {t('work.failedAi', { defaultValue: 'AI Processing Failed' })}
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentItem.errorMessage ||
                  t('work.errorHint', {
                    defaultValue: 'Tip: Try using a smaller resolution image, or click retry below.',
                  })}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{t('work.action.retry', { defaultValue: 'Retry Processing' })}</span>
              </button>
              <button
                type="button"
                onClick={onUploadOther}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-300 border border-dark-500 text-xs font-semibold transition-all cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-neon-emerald" />
                <span>{t('editor.uploadOther', { defaultValue: 'Upload Lain' })}</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Canvas for Brush & Color Picker */}
        {initialTab === 'brush' || initialTab === 'picker' ? (
          <>
            <canvas
              ref={canvasRef}
              onMouseDown={onCanvasMouseDown}
              onMouseMove={(e) => {
                if (initialTab === 'brush') {
                  const zoom = getPageZoom();
                  const vpRect = viewportContainerRef.current?.getBoundingClientRect();
                  if (vpRect) {
                    const x = (e.clientX - vpRect.left) / zoom;
                    const y = (e.clientY - vpRect.top) / zoom;
                    setCursorPos({ x, y });
                    if (brushCursorRef.current) {
                      brushCursorRef.current.style.left = `${x}px`;
                      brushCursorRef.current.style.top = `${y}px`;
                    }
                  }
                }
                onCanvasMouseMove(e);
              }}
              onMouseEnter={(e) => {
                if (initialTab === 'brush') {
                  const zoom = getPageZoom();
                  const vpRect = viewportContainerRef.current?.getBoundingClientRect();
                  if (vpRect) {
                    const x = (e.clientX - vpRect.left) / zoom;
                    const y = (e.clientY - vpRect.top) / zoom;
                    setCursorPos({ x, y });
                    setIsBrushHovering(true);
                    if (brushCursorRef.current) {
                      brushCursorRef.current.style.left = `${x}px`;
                      brushCursorRef.current.style.top = `${y}px`;
                    }
                  }
                }
              }}
              onMouseLeave={() => {
                setIsBrushHovering(false);
                onCanvasMouseUp();
              }}
              onMouseUp={onCanvasMouseUp}
              className={`shadow-2xl rounded-lg block max-h-full max-w-full object-contain ${
                initialTab === 'picker' ? 'cursor-picker' : 'cursor-none'
              }`}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
            {/* Dynamic Real-time Brush Size Hover Indicator Ring */}
            {initialTab === 'brush' && isBrushHovering && (
              <div
                ref={brushCursorRef}
                className="pointer-events-none absolute z-50 rounded-full select-none"
                style={{
                  left: `${cursorPos.x}px`,
                  top: `${cursorPos.y}px`,
                  width: `${brushSize}px`,
                  height: `${brushSize}px`,
                  transform: 'translate(-50%, -50%)',
                  border: brushMode === 'restore' ? '2.5px solid #10b981' : '2.5px solid #f43f5e',
                  backgroundColor:
                    brushMode === 'restore' ? 'rgba(16, 185, 129, 0.22)' : 'rgba(244, 63, 94, 0.22)',
                  boxShadow:
                    brushMode === 'restore'
                      ? '0 0 14px rgba(16, 185, 129, 0.8), inset 0 0 6px rgba(16, 185, 129, 0.4)'
                      : '0 0 14px rgba(244, 63, 94, 0.8), inset 0 0 6px rgba(244, 63, 94, 0.4)',
                }}
              >
                {/* Center crosshair pinpoint dot */}
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: brushMode === 'restore' ? '#10b981' : '#f43f5e',
                    boxShadow: '0 0 3px rgba(0, 0, 0, 0.9)',
                  }}
                />
              </div>
            )}
          </>
        ) : (
          (currentItem?.processedUrl || currentItem?.originalUrl) && (
            <>
              {initialTab === 'compress' && currentItem?.compressBlob && currentItem?.compressUrl ? (
                <ImageCompareSlider
                  beforeImage={currentItem.transparentUrl || currentItem.originalUrl}
                  afterImage={currentItem.compressUrl}
                  originalSize={currentItem.compressSourceSize || currentItem.file?.size}
                  compressedSize={currentItem.compressBlob.size}
                />
              ) : (initialTab === 'resize' || initialTab === 'resizeig' || initialTab === 'resizepassport') &&
                resizeWidth > 0 &&
                resizeHeight > 0 &&
                (resizeWidth !== originalDimensions.width || resizeHeight !== originalDimensions.height) ? (
                /* Real-time Instantaneous 0ms GPU Live Resize Preview */
                <div
                  className="relative max-h-full max-w-full flex items-center justify-center p-3 transition-all duration-150 ease-out"
                  style={{
                    aspectRatio: `${resizeWidth} / ${resizeHeight}`,
                    width: resizeWidth >= resizeHeight ? '100%' : 'auto',
                    height: resizeHeight > resizeWidth ? '100%' : 'auto',
                    maxHeight: '100%',
                    maxWidth: '100%',
                  }}
                >
                  <img
                    ref={setImageElement as React.Ref<HTMLImageElement>}
                    src={currentItem.transparentUrl || currentItem.originalUrl}
                    alt="Resize Live Preview"
                    className={`w-full h-full rounded-lg shadow-2xl transition-all duration-150 ${
                      resizeMode === 'smart' ? 'object-cover' : 'object-fill'
                    }`}
                  />
                  {/* Floating Live Dimension HUD Badge */}
                  <div className="absolute top-5 left-5 px-3 py-1 rounded-full bg-dark-900/90 border border-neon-cyan/50 text-neon-cyan font-mono text-xs font-bold shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-1.5 whitespace-nowrap z-10 animate-in fade-in zoom-in-95 duration-100">
                    <span className="text-neon-cyan">📐</span>
                    <span>
                      {resizeWidth} × {resizeHeight} px
                    </span>
                    <span className="text-slate-400 font-normal">
                      ({resizeMode === 'smart' ? 'Smart Auto' : 'Squish'})
                    </span>
                  </div>
                </div>
              ) : (
                <motion.img
                  key={currentItem.id}
                  id="workspace-preview-image"
                  crossOrigin="anonymous"
                  ref={(el) => {
                    if (el) setImageElement(el);
                  }}
                  onLoad={(e) => {
                    setImageElement(e.currentTarget);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    scale:
                      initialTab === 'rotate' &&
                      Math.abs(rotationDeg % 180) === 90 &&
                      originalDimensions.width > originalDimensions.height &&
                      originalDimensions.height > 0
                        ? Math.min(1, originalDimensions.height / originalDimensions.width)
                        : 1,
                    rotate: initialTab === 'rotate' ? rotationDeg : 0,
                    scaleX: initialTab === 'rotate' ? (flipH ? -1 : 1) : 1,
                    scaleY: initialTab === 'rotate' ? (flipV ? -1 : 1) : 1,
                  }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  src={
                    currentItem.processedUrl || currentItem.originalUrl
                  }
                  alt="Image Preview"
                  className="max-h-full max-w-full shadow-2xl rounded-lg object-contain"
                />
              )}
              {initialTab === 'crop' && (
                <InteractiveCropOverlay
                  imageElement={imageElement}
                  originalWidth={originalDimensions.width}
                  originalHeight={originalDimensions.height}
                  cropX={cropX}
                  cropY={cropY}
                  cropWidth={cropWidth}
                  cropHeight={cropHeight}
                  cropRadius={cropRadius}
                  onCropChange={onCropChange}
                />
              )}
              {(initialTab === 'blurface' || initialTab === 'blurplate') && (
                <BlurBoxOverlay
                  imageElement={imageElement}
                  originalWidth={originalDimensions.width}
                  originalHeight={originalDimensions.height}
                  boxes={blurBoxes}
                  setBoxes={setBlurBoxes}
                  blurIntensity={blurIntensity}
                />
              )}
            </>
          )
        )}

        {/* Design Editor (Filerobot Integration) */}
        {initialTab === 'design' && currentItem?.originalUrl && (
          <DesignEditorControl
            imageUrl={currentItem.processedUrl || currentItem.originalUrl}
            onDownload={(dataUrl) => {
              const a = document.createElement('a');
              a.href = dataUrl;
              let baseName = currentItem.name || `HelpMyIMG_${Date.now()}`;
              if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
              a.download = `${baseName}.png`;
              a.click();
            }}
          />
        )}
      </div>
    </div>
  );
};
