// src/components/workspace/viewport/WorkspaceViewport.tsx
// Main Canvas & Image Viewport with AI Scanner and Interactive Overlays

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, RotateCcw, Upload } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import { AiScanOverlay } from './AiScanOverlay';
import { ImageCompareSlider } from '../tools/ImageCompareSlider';
import { InteractiveCropOverlay } from '../tools/InteractiveCropOverlay';
import { BlurBoxOverlay } from '../tools/BlurBoxOverlay';
import { DesignEditorControl } from '../tools/DesignEditorControl';
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
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 lg:static">
      <div
        className={`w-full rounded-3xl border border-dark-500/80 bg-dark-900/90 shadow-glass overflow-hidden relative flex items-center justify-center checkerboard-bg transition-all duration-150 ${
          initialTab === 'design'
            ? 'h-[75vh] md:h-auto md:aspect-[4/3]'
            : 'h-[420px] sm:h-[480px] md:h-[540px] lg:h-auto lg:aspect-[4/3]'
        }`}
      >
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
          <canvas
            ref={canvasRef}
            onMouseDown={onCanvasMouseDown}
            onMouseMove={onCanvasMouseMove}
            onMouseUp={onCanvasMouseUp}
            onMouseLeave={onCanvasMouseUp}
            className={`max-h-full max-w-full object-contain shadow-2xl rounded-lg ${
              initialTab === 'picker' ? 'cursor-picker' : 'cursor-brush'
            }`}
          />
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
                resizeHeight > 0 ? (
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
                  ref={setImageElement as React.Ref<HTMLImageElement>}
                  initial={{ opacity: 0, scale: 0.95 }}
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
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
