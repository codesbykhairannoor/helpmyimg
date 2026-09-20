// src/components/workspace/ToolWorkspace.tsx
// Ruang Kerja Utama: Drag-and-Drop Batch Upload, Canvas Viewport, Navigasi Tab Utilitas & Engine Selector

import React, { Suspense } from 'react';
import { Loader2, Sparkles, RotateCcw, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useWorkspaceState } from './hooks/useWorkspaceState';
import { WorkspaceDropzone } from './dropzone/WorkspaceDropzone';
import { WorkspaceViewport } from './viewport/WorkspaceViewport';
import { BatchThumbnails } from './thumbnails/BatchThumbnails';
import { ExportPanel } from './export/ExportPanel';

import { RemoveBgControl } from './tools/RemoveBgControl';
import { ColorBgControl } from './tools/ColorBgControl';
import { BrushControl } from './tools/BrushControl';
import { WatermarkControl } from './tools/WatermarkControl';
import { CompressControl } from './tools/CompressControl';
import { ConvertControl } from './tools/ConvertControl';
import { ResizeControl } from './tools/ResizeControl';
import { CropControl } from './tools/CropControl';
import { RotateControl } from './tools/RotateControl';
import { ColorPickerControl } from './tools/ColorPickerControl';
import { BlurFaceControl } from './tools/BlurFaceControl';
import { DesignEditorControl } from './tools/DesignEditorControl';

import { processImage, cropImage, rotateImage, smartCropImage, applyWatermark } from '../../utils/imageOperations';
import { hexToColorInfo } from '../../utils/colorUtils';
import type { TabType, BatchItem, ColorInfo, WatermarkPosition, ToolWorkspaceProps } from './types';

export type { TabType, BatchItem, ColorInfo, WatermarkPosition, ToolWorkspaceProps };

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ initialTab: rawInitialTab = 'remove' }) => {
  const resolveBaseTab = (tab: string): TabType => {
    switch (tab) {
      case 'colorwhite':
        return 'color';
      case 'watermarkbulk':
        return 'watermark';
      case 'removeperson':
        return 'brush';
      case 'removelogo':
        return 'brush';
      case 'convertwebp':
        return 'convert';
      case 'blurplate':
        return 'blurface';
      case 'resizeig':
        return 'resize';
      case 'resizepassport':
        return 'resize';
      case 'compress50kb':
        return 'compress';
      case 'compress100kb':
        return 'compress';
      case 'compress200kb':
        return 'compress';
      default:
        return tab as TabType;
    }
  };

  const initialTab = resolveBaseTab(rawInitialTab);
  const state = useWorkspaceState(initialTab);

  const {
    t,
    batchItems,
    setBatchItems,
    selectedIndex,
    setSelectedIndex,
    currentItem,
    isDragging,
    setIsDragging,
    imageType,
    setImageType,
    imageTypeRef,
    // Background
    initialColor,
    bgMode,
    setBgMode,
    selectedColor,
    setSelectedColor,
    selectedGradient,
    setSelectedGradient,
    customBgUrl,
    handleUploadCustomBg,
    handleClearCustomBg,
    selectedPreset,
    setSelectedPreset,
    bgBlur,
    setBgBlur,
    // Brush
    brushMode,
    setBrushMode,
    brushSize,
    setBrushSize,
    // Watermark
    watermarkText,
    setWatermarkText,
    watermarkColor,
    setWatermarkColor,
    watermarkOpacity,
    setWatermarkOpacity,
    watermarkPosition,
    setWatermarkPosition,
    watermarkType,
    setWatermarkType,
    watermarkImage,
    setWatermarkImage,
    watermarkScale,
    setWatermarkScale,
    watermarkRotation,
    setWatermarkRotation,
    // Export & Zip
    isZipping,
    handleZipDownload,
    toastMessage,
    showToast,
    isApplyingEffect,
    // Compression & Conversion
    compressQuality,
    setCompressQuality,
    convertFormat,
    setConvertFormat,
    // Resize
    resizeWidth,
    setResizeWidth,
    resizeHeight,
    setResizeHeight,
    resizeMaintainRatio,
    setResizeMaintainRatio,
    resizeMode,
    setResizeMode,
    originalDimensions,
    setOriginalDimensions,
    // Crop
    cropX,
    setCropX,
    cropY,
    setCropY,
    cropWidth,
    setCropWidth,
    cropHeight,
    setCropHeight,
    cropRadius,
    setCropRadius,
    // Rotate
    rotationDeg,
    setRotationDeg,
    flipH,
    setFlipH,
    flipV,
    setFlipV,
    // Picker & Blur
    pickedColor,
    setPickedColor,
    dominantColors,
    blurBoxes,
    setBlurBoxes,
    blurIntensity,
    setBlurIntensity,
    imageElement,
    setImageElement,
    // Refs & Handlers
    fileInputRef,
    canvasRef,
    handleFiles,
    processSingleItem,
    handleUploadOther,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  } = state;

  return (
    <section id="workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
      {/* Grid Workspace: Viewport Kiri & Panel Kontrol Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-start">
        {/* Viewport & Dropzone (8 Kolom di Desktop) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,image/png,image/jpeg,image/webp,image/jpg"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
                e.target.value = '';
              }
            }}
            className="hidden"
          />

          {batchItems.length === 0 ? (
            <WorkspaceDropzone
              isDragging={isDragging}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              currentItem={currentItem}
              onRetry={() => currentItem && processSingleItem(currentItem)}
            />
          ) : (
            <div className="space-y-4 lg:static">
              <WorkspaceViewport
                initialTab={initialTab}
                currentItem={currentItem}
                isApplyingEffect={isApplyingEffect}
                onRetry={() => currentItem && processSingleItem(currentItem)}
                onUploadOther={handleUploadOther}
                canvasRef={canvasRef}
                onCanvasMouseDown={handleCanvasMouseDown}
                onCanvasMouseMove={handleCanvasMouseMove}
                onCanvasMouseUp={handleCanvasMouseUp}
                imageElement={imageElement}
                setImageElement={setImageElement}
                originalDimensions={originalDimensions}
                rotationDeg={rotationDeg}
                flipH={flipH}
                flipV={flipV}
                cropX={cropX}
                cropY={cropY}
                cropWidth={cropWidth}
                cropHeight={cropHeight}
                cropRadius={cropRadius}
                onCropChange={(x, y, w, h) => {
                  setCropX(x);
                  setCropY(y);
                  setCropWidth(w);
                  setCropHeight(h);
                }}
                blurBoxes={blurBoxes}
                setBlurBoxes={setBlurBoxes}
                blurIntensity={blurIntensity}
              />

              <BatchThumbnails
                batchItems={batchItems}
                selectedIndex={selectedIndex}
                onSelect={(idx) => setSelectedIndex(idx)}
                onDelete={(idx) => {
                  setBatchItems((prev) => prev.filter((_, i) => i !== idx));
                  if (selectedIndex >= idx && selectedIndex > 0) {
                    setSelectedIndex(selectedIndex - 1);
                  }
                }}
                onAddMore={() => fileInputRef.current?.click()}
              />
            </div>
          )}
        </div>

        {/* Sidebar Kontrol Alat (4 Kolom di Desktop) */}
        <div className="lg:col-span-5 xl:col-span-4 glass-panel p-6 flex flex-col space-y-6 h-fit">
          <div className="flex flex-col gap-3 border-b border-dark-600/60 pb-4 shrink-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="font-heading font-extrabold text-white text-lg flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-cyan" />
                <span>{t('editor.settings', { defaultValue: 'Tool Settings' })}</span>
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (currentItem?.originalUrl) {
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                transparentUrl: null,
                                processedUrl: item.originalUrl,
                                status: 'idle',
                                progress: 0,
                              }
                            : item
                        )
                      );
                    }
                  }}
                  title={t('editor.resetDesc', { defaultValue: 'Kembalikan foto ini ke kondisi asli tanpa potongan' })}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-dark-700/80 hover:bg-dark-600 hover:border-neon-cyan/40 text-slate-300 hover:text-white text-xs font-semibold border border-dark-500 transition-all shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{t('editor.resetOriginal', { defaultValue: 'Reset ke Asli' })}</span>
                </button>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-neon-cyan/15 text-neon-cyan font-mono font-bold border border-neon-cyan/30">
                  {(initialTab === 'remove' || initialTab === 'removelogo' || initialTab === 'removeperson') &&
                    t('work.badge.remove', { defaultValue: 'Remove Background' })}
                  {(initialTab === 'color' || initialTab === 'colorwhite') &&
                    t('work.badge.color', { defaultValue: 'Change Background' })}
                  {initialTab === 'brush' && t('work.badge.brush', { defaultValue: 'Magic Brush' })}
                  {(initialTab === 'watermark' || initialTab === 'watermarkbulk') &&
                    t('work.badge.watermark', { defaultValue: 'Watermark' })}
                  {(initialTab === 'compress' ||
                    initialTab === 'compress100kb' ||
                    initialTab === 'compress50kb' ||
                    initialTab === 'compress200kb') &&
                    t('work.badge.compress', { defaultValue: 'Compress' })}
                  {(initialTab === 'convert' || initialTab === 'convertwebp') &&
                    t('work.badge.convert', { defaultValue: 'Convert' })}
                  {(initialTab === 'resize' || initialTab === 'resizeig' || initialTab === 'resizepassport') &&
                    t('work.badge.resize', { defaultValue: 'Resize' })}
                  {initialTab === 'crop' && t('work.badge.crop', { defaultValue: 'Crop' })}
                  {initialTab === 'rotate' && t('work.badge.rotate', { defaultValue: 'Rotate' })}
                  {initialTab === 'picker' && t('work.badge.picker', { defaultValue: 'Color Picker' })}
                  {(initialTab === 'blurface' || initialTab === 'blurplate') &&
                    t('work.badge.blurface', { defaultValue: 'Blur Face' })}
                  {initialTab === 'design' && t('work.badge.design', { defaultValue: 'Design Editor' })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <Suspense
              fallback={
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                </div>
              }
            >
              {(initialTab === 'remove' || initialTab === 'removelogo' || initialTab === 'removeperson') && (
                <RemoveBgControl
                  currentTransparentUrl={currentItem?.processedUrl || null}
                  currentFileName={currentItem?.name}
                  batchUrls={batchItems
                    .filter((i) => i.status === 'done' && i.transparentUrl)
                    .map((i) => ({ name: i.name, url: i.transparentUrl! }))}
                  onReset={() => {
                    if (currentItem?.originalUrl) {
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                transparentUrl: null,
                                processedUrl: item.originalUrl,
                                status: 'idle',
                                progress: 0,
                              }
                            : item
                        )
                      );
                    }
                  }}
                  isProcessing={
                    currentItem?.status === 'processing' ||
                    currentItem?.status === 'queued' ||
                    batchItems.some((i) => i.status === 'processing' || i.status === 'queued')
                  }
                  status={currentItem?.status || 'idle'}
                  onProcessNow={() => {
                    if (currentItem) {
                      processSingleItem(currentItem);
                    }
                  }}
                  onProcessBatch={() => {
                    batchItems.forEach((item) => {
                      processSingleItem(item);
                    });
                  }}
                  batchCount={batchItems.length}
                  imageType={imageType}
                  detectedType={currentItem?.detectedType}
                  setImageType={(newType) => {
                    setImageType(newType);
                    imageTypeRef.current = newType;
                    if (currentItem) {
                      setTimeout(() => {
                        processSingleItem(currentItem);
                      }, 20);
                    }
                  }}
                  hasProcessedAi={Boolean(
                    currentItem?.transparentUrl && currentItem?.transparentUrl !== currentItem?.originalUrl
                  )}
                  onUploadOther={handleUploadOther}
                />
              )}

              {(initialTab === 'color' || initialTab === 'colorwhite') && (
                <ColorBgControl
                  bgMode={bgMode}
                  setBgMode={setBgMode}
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  selectedGradient={selectedGradient}
                  setSelectedGradient={setSelectedGradient}
                  customBgUrl={customBgUrl}
                  onUploadCustomBg={handleUploadCustomBg}
                  onClearCustomBg={handleClearCustomBg}
                  selectedPreset={selectedPreset}
                  setSelectedPreset={setSelectedPreset}
                  bgBlur={bgBlur}
                  setBgBlur={setBgBlur}
                  onReset={() => {
                    setBgMode('color');
                    setSelectedColor(initialColor);
                    setBgBlur(0);
                    if (currentItem) {
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                processedUrl: item.transparentUrl || item.originalUrl,
                                status: 'done',
                              }
                            : item
                        )
                      );
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  isProcessing={
                    currentItem?.status === 'processing' ||
                    currentItem?.status === 'queued' ||
                    batchItems.some((i) => i.status === 'processing' || i.status === 'queued')
                  }
                  status={currentItem?.status || 'idle'}
                  onProcessNow={() => {
                    if (currentItem) {
                      processSingleItem(currentItem);
                    }
                  }}
                  hasProcessedAi={Boolean(
                    currentItem?.transparentUrl && currentItem?.transparentUrl !== currentItem?.originalUrl
                  )}
                  batchCount={batchItems.length}
                />
              )}

              {initialTab === 'brush' && (
                <BrushControl
                  brushMode={brushMode}
                  setBrushMode={setBrushMode}
                  brushSize={brushSize}
                  setBrushSize={setBrushSize}
                  onResetBrush={() => {
                    if (currentItem) {
                      setBatchItems((prev) =>
                        prev.map((i, idx) =>
                          idx === selectedIndex ? { ...i, processedUrl: i.transparentUrl } : i
                        )
                      );
                    }
                  }}
                  onReset={() => {
                    if (currentItem) {
                      setBatchItems((prev) =>
                        prev.map((i, idx) =>
                          idx === selectedIndex ? { ...i, processedUrl: i.transparentUrl || i.originalUrl } : i
                        )
                      );
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  isProcessing={currentItem?.status === 'processing'}
                  batchCount={batchItems.length}
                />
              )}

              {initialTab === 'watermark' && (
                <WatermarkControl
                  watermarkType={watermarkType}
                  setWatermarkType={setWatermarkType}
                  watermarkImage={watermarkImage}
                  setWatermarkImage={setWatermarkImage}
                  watermarkText={watermarkText}
                  setWatermarkText={setWatermarkText}
                  watermarkColor={watermarkColor}
                  setWatermarkColor={setWatermarkColor}
                  watermarkOpacity={watermarkOpacity}
                  setWatermarkOpacity={setWatermarkOpacity}
                  watermarkPosition={watermarkPosition}
                  setWatermarkPosition={setWatermarkPosition}
                  watermarkScale={watermarkScale}
                  setWatermarkScale={setWatermarkScale}
                  watermarkRotation={watermarkRotation}
                  setWatermarkRotation={setWatermarkRotation}
                  batchCount={batchItems.length}
                  onProcessBatch={async () => {
                    setBatchItems((prev) => prev.map((item) => ({ ...item, status: 'processing' })));
                    await new Promise((r) => setTimeout(r, 50));
                    const newItems = [...batchItems];
                    for (let i = 0; i < newItems.length; i++) {
                      const item = newItems[i];
                      try {
                        const blob = await applyWatermark(item.file, {
                          type: watermarkType,
                          text: watermarkText,
                          image: watermarkImage,
                          color: watermarkColor,
                          opacity: watermarkOpacity,
                          position: watermarkPosition,
                          scale: watermarkScale,
                          rotation: watermarkRotation,
                        });
                        const url = URL.createObjectURL(blob);
                        newItems[i] = { ...item, processedUrl: url, status: 'done' };
                      } catch (err) {
                        newItems[i] = { ...item, status: 'error', errorMessage: 'Watermark failed' };
                      }
                      setBatchItems([...newItems]);
                      await new Promise((r) => setTimeout(r, 60));
                    }
                  }}
                  onReset={() => {
                    setWatermarkText('');
                    setWatermarkImage(null);
                    if (currentItem) {
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                processedUrl: item.transparentUrl || item.originalUrl,
                                status: 'done',
                              }
                            : item
                        )
                      );
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {(initialTab === 'compress' || initialTab === 'compress100kb') && (
                <CompressControl
                  quality={compressQuality}
                  setQuality={setCompressQuality}
                  hasCompressed={!!currentItem?.compressBlob}
                  onProcess={async () => {
                    if (currentItem) {
                      try {
                        let sourceBlob = currentItem.file;
                        if (currentItem.processedUrl && currentItem.processedUrl !== currentItem.originalUrl) {
                          const res = await fetch(currentItem.processedUrl);
                          sourceBlob = await res.blob();
                        } else if (!sourceBlob && currentItem.originalUrl) {
                          const res = await fetch(currentItem.originalUrl);
                          sourceBlob = await res.blob();
                        }

                        if (sourceBlob) {
                          const blob = await processImage(sourceBlob, {
                            mimeType: 'image/jpeg',
                            quality: compressQuality,
                          });
                          const finalBlob = blob.size > sourceBlob.size ? sourceBlob : blob;
                          const url = URL.createObjectURL(finalBlob);
                          setBatchItems((prev) =>
                            prev.map((item) =>
                              item.id === currentItem.id
                                ? {
                                    ...item,
                                    compressSourceSize: sourceBlob.size,
                                    compressBlob: finalBlob,
                                    compressUrl: url,
                                    processedUrl: url,
                                  }
                                : item
                            )
                          );
                        }
                      } catch (err) {
                        console.error('Compress preview failed', err);
                      }
                    }
                  }}
                  batchCount={batchItems.length}
                  onProcessBatch={async () => {
                    setBatchItems((prev) => prev.map((item) => ({ ...item, status: 'processing' })));
                    await new Promise((r) => setTimeout(r, 50));

                    const newItems = [...batchItems];
                    for (let i = 0; i < newItems.length; i++) {
                      const item = newItems[i];
                      try {
                        let sourceBlob = item.file;
                        if (item.transparentUrl && item.transparentUrl !== item.originalUrl) {
                          const res = await fetch(item.transparentUrl);
                          sourceBlob = await res.blob();
                        } else if (!sourceBlob && item.originalUrl) {
                          const res = await fetch(item.originalUrl);
                          sourceBlob = await res.blob();
                        }

                        if (sourceBlob) {
                          const blob = await processImage(sourceBlob, {
                            mimeType: 'image/jpeg',
                            quality: compressQuality,
                          });
                          const finalBlob = blob.size > sourceBlob.size ? sourceBlob : blob;
                          const url = URL.createObjectURL(finalBlob);
                          newItems[i] = {
                            ...item,
                            compressSourceSize: sourceBlob.size,
                            compressBlob: finalBlob,
                            compressUrl: url,
                            processedUrl: url,
                            status: 'done',
                          };
                        }
                      } catch (err) {
                        newItems[i] = { ...item, status: 'error', errorMessage: 'Compress failed' };
                      }
                      setBatchItems([...newItems]);
                      await new Promise((r) => setTimeout(r, 60));
                    }
                  }}
                  onDownload={() => {
                    if (currentItem?.compressBlob && currentItem) {
                      const url = URL.createObjectURL(currentItem.compressBlob);
                      const a = document.createElement('a');
                      a.href = url;
                      let baseName = currentItem.name || `HelpMyIMG_${Date.now()}`;
                      if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
                      a.download = `${baseName}.jpg`;
                      a.click();
                    }
                  }}
                  onReset={() => {
                    setCompressQuality(0.8);
                    if (currentItem) {
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                compressBlob: undefined,
                                compressUrl: undefined,
                                processedUrl: item.transparentUrl || item.originalUrl,
                                status: 'done',
                              }
                            : item
                        )
                      );
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {initialTab === 'convert' && (
                <ConvertControl
                  format={convertFormat}
                  setFormat={setConvertFormat}
                  onConvert={async () => {
                    if (currentItem?.file) {
                      try {
                        const blob = await processImage(currentItem.file, {
                          mimeType: convertFormat,
                          quality: 0.95,
                        });
                        const url = URL.createObjectURL(blob);
                        const extMap: Record<string, string> = {
                          'image/x-icon': 'ico',
                          'image/jpeg': 'jpg',
                          'image/png': 'png',
                          'image/gif': 'gif',
                          'image/bmp': 'bmp',
                          'image/avif': 'avif',
                          'image/svg+xml': 'svg',
                        };
                        const ext = extMap[convertFormat] || convertFormat.split('/')[1];
                        let baseName = currentItem.name || `HelpMyIMG_${Date.now()}`;
                        if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
                        const newName = `${baseName}.${ext}`;
                        const newFile = new File([blob], newName, { type: blob.type || convertFormat });
                        setBatchItems((prev) =>
                          prev.map((item) =>
                            item.id === currentItem.id
                              ? { ...item, file: newFile, name: newName, processedUrl: url, status: 'done' }
                              : item
                          )
                        );
                      } catch (err: any) {
                        console.error('Convert failed', err);
                        setBatchItems((prev) =>
                          prev.map((item) =>
                            item.id === currentItem.id
                              ? { ...item, status: 'error', errorMessage: err.message || 'Convert failed' }
                              : item
                          )
                        );
                      }
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  batchCount={batchItems.length}
                  onProcessBatch={async () => {
                    setBatchItems((prev) => prev.map((item) => ({ ...item, status: 'processing' })));
                    await new Promise((r) => setTimeout(r, 50));
                    const newItems = [...batchItems];
                    for (let i = 0; i < newItems.length; i++) {
                      const item = newItems[i];
                      try {
                        const blob = await processImage(item.file, { mimeType: convertFormat, quality: 0.95 });
                        const url = URL.createObjectURL(blob);
                        const extMap: Record<string, string> = {
                          'image/x-icon': 'ico',
                          'image/jpeg': 'jpg',
                          'image/png': 'png',
                          'image/gif': 'gif',
                          'image/bmp': 'bmp',
                          'image/avif': 'avif',
                          'image/svg+xml': 'svg',
                        };
                        const ext = extMap[convertFormat] || convertFormat.split('/')[1];
                        let baseName = item.name;
                        if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
                        const newName = `${baseName}.${ext}`;
                        const newFile = new File([blob], newName, { type: blob.type || convertFormat });
                        newItems[i] = { ...item, file: newFile, name: newName, processedUrl: url, status: 'done' };
                      } catch (err: any) {
                        newItems[i] = { ...item, status: 'error', errorMessage: err.message || 'Convert failed' };
                      }
                      setBatchItems([...newItems]);
                      await new Promise((r) => setTimeout(r, 60));
                    }
                  }}
                  onReset={() => {
                    setConvertFormat('image/jpeg');
                  }}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {initialTab === 'resize' && (
                <ResizeControl
                  originalWidth={originalDimensions.width}
                  originalHeight={originalDimensions.height}
                  resizeWidth={resizeWidth}
                  setResizeWidth={setResizeWidth}
                  resizeHeight={resizeHeight}
                  setResizeHeight={setResizeHeight}
                  maintainRatio={resizeMaintainRatio}
                  setMaintainRatio={setResizeMaintainRatio}
                  resizeMode={resizeMode}
                  setResizeMode={setResizeMode}
                  onApply={async () => {
                    if (currentItem?.file) {
                      try {
                        let sourceBlob = currentItem.file;
                        if (
                          currentItem.transparentUrl &&
                          currentItem.transparentUrl !== currentItem.originalUrl
                        ) {
                          const res = await fetch(currentItem.transparentUrl);
                          sourceBlob = await res.blob();
                        } else if (
                          currentItem.processedUrl &&
                          currentItem.processedUrl !== currentItem.originalUrl
                        ) {
                          const res = await fetch(currentItem.processedUrl);
                          sourceBlob = await res.blob();
                        }
                        let blob: Blob;
                        if (resizeMode === 'smart') {
                          blob = await smartCropImage(
                            sourceBlob,
                            resizeWidth,
                            resizeHeight,
                            currentItem.file.type || 'image/jpeg'
                          );
                        } else {
                          blob = await processImage(sourceBlob, {
                            mimeType: currentItem.file.type || 'image/jpeg',
                            quality: 0.95,
                            width: resizeWidth,
                            height: resizeHeight,
                            maintainAspectRatio: false,
                          });
                        }
                        const url = URL.createObjectURL(blob);
                        const newFile = new File([blob], currentItem.name, { type: blob.type || 'image/png' });
                        setBatchItems((prev) =>
                          prev.map((item) =>
                            item.id === currentItem.id
                              ? {
                                  ...item,
                                  file: newFile,
                                  originalUrl: url,
                                  transparentUrl: item.transparentUrl ? url : null,
                                  processedUrl: url,
                                  status: 'done',
                                }
                              : item
                          )
                        );
                        setOriginalDimensions({
                          width: Math.round(resizeWidth),
                          height: Math.round(resizeHeight),
                        });
                        setCropWidth(Math.round(resizeWidth));
                        setCropHeight(Math.round(resizeHeight));
                      } catch (err) {
                        console.error('Resize failed', err);
                      }
                    }
                  }}
                  onReset={() => {
                    if (currentItem && currentItem.initialDimensions) {
                      setOriginalDimensions(currentItem.initialDimensions);
                      setResizeWidth(currentItem.initialDimensions.width);
                      setResizeHeight(currentItem.initialDimensions.height);
                    } else {
                      setResizeWidth(originalDimensions.width);
                      setResizeHeight(originalDimensions.height);
                    }
                    setResizeMaintainRatio(false);
                    if (currentItem) {
                      const targetFile = currentItem.initialFile || currentItem.file;
                      const targetUrl = currentItem.initialOriginalUrl || currentItem.originalUrl;
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                file: targetFile,
                                originalUrl: targetUrl,
                                transparentUrl: item.transparentUrl ? targetUrl : null,
                                processedUrl: targetUrl,
                                status: 'done',
                              }
                            : item
                        )
                      );
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  batchCount={batchItems.length}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {initialTab === 'crop' && (
                <CropControl
                  originalWidth={originalDimensions.width}
                  originalHeight={originalDimensions.height}
                  cropX={cropX}
                  setCropX={setCropX}
                  cropY={cropY}
                  setCropY={setCropY}
                  cropWidth={cropWidth}
                  setCropWidth={setCropWidth}
                  cropHeight={cropHeight}
                  setCropHeight={setCropHeight}
                  cropRadius={cropRadius}
                  setCropRadius={setCropRadius}
                  onApply={async () => {
                    if (currentItem?.file) {
                      try {
                        let sourceBlob = currentItem.file;
                        if (
                          currentItem.transparentUrl &&
                          currentItem.transparentUrl !== currentItem.originalUrl
                        ) {
                          const res = await fetch(currentItem.transparentUrl);
                          sourceBlob = await res.blob();
                        } else if (
                          currentItem.processedUrl &&
                          currentItem.processedUrl !== currentItem.originalUrl
                        ) {
                          const res = await fetch(currentItem.processedUrl);
                          sourceBlob = await res.blob();
                        }
                        const blob = await cropImage(
                          sourceBlob,
                          cropX,
                          cropY,
                          cropWidth,
                          cropHeight,
                          sourceBlob.type,
                          0.95,
                          cropRadius
                        );
                        const url = URL.createObjectURL(blob);
                        const newFile = new File([blob], currentItem.name, { type: blob.type || 'image/png' });
                        setBatchItems((prev) =>
                          prev.map((item) =>
                            item.id === currentItem.id
                              ? {
                                  ...item,
                                  file: newFile,
                                  originalUrl: url,
                                  transparentUrl: item.transparentUrl ? url : null,
                                  processedUrl: url,
                                  status: 'done',
                                }
                              : item
                          )
                        );
                        setOriginalDimensions({ width: Math.round(cropWidth), height: Math.round(cropHeight) });
                        setCropX(0);
                        setCropY(0);
                        setCropWidth(Math.round(cropWidth));
                        setCropHeight(Math.round(cropHeight));
                        setResizeWidth(Math.round(cropWidth));
                        setResizeHeight(Math.round(cropHeight));
                      } catch (err) {
                        console.error('Crop failed', err);
                      }
                    }
                  }}
                  onReset={() => {
                    setCropX(0);
                    setCropY(0);
                    setCropWidth(originalDimensions.width);
                    setCropHeight(originalDimensions.height);
                  }}
                  onUploadOther={handleUploadOther}
                  batchCount={batchItems.length}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {initialTab === 'rotate' && (
                <RotateControl
                  rotation={rotationDeg}
                  setRotation={setRotationDeg}
                  flipH={flipH}
                  setFlipH={setFlipH}
                  flipV={flipV}
                  setFlipV={setFlipV}
                  onApply={async () => {
                    if (currentItem?.file) {
                      try {
                        let sourceBlob = currentItem.file;
                        if (
                          currentItem.transparentUrl &&
                          currentItem.transparentUrl !== currentItem.originalUrl
                        ) {
                          const res = await fetch(currentItem.transparentUrl);
                          sourceBlob = await res.blob();
                        } else if (
                          currentItem.processedUrl &&
                          currentItem.processedUrl !== currentItem.originalUrl
                        ) {
                          const res = await fetch(currentItem.processedUrl);
                          sourceBlob = await res.blob();
                        }
                        const blob = await rotateImage(sourceBlob, rotationDeg, flipH, flipV);
                        const url = URL.createObjectURL(blob);
                        const newFile = new File([blob], currentItem.name, { type: blob.type || 'image/png' });
                        setBatchItems((prev) =>
                          prev.map((item) =>
                            item.id === currentItem.id
                              ? {
                                  ...item,
                                  file: newFile,
                                  originalUrl: url,
                                  transparentUrl: item.transparentUrl ? url : null,
                                  processedUrl: url,
                                  status: 'done',
                                }
                              : item
                          )
                        );
                        setRotationDeg(0);
                        setFlipH(false);
                        setFlipV(false);
                      } catch (err) {
                        console.error('Rotate failed', err);
                      }
                    }
                  }}
                  onReset={() => {
                    setRotationDeg(0);
                    setFlipH(false);
                    setFlipV(false);
                    if (currentItem?.rotateBaseUrl) {
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                file: item.rotateBaseFile || item.file,
                                originalUrl: item.rotateBaseUrl || item.originalUrl,
                                transparentUrl: item.transparentUrl
                                  ? item.rotateBaseUrl || item.transparentUrl
                                  : null,
                                processedUrl: item.rotateBaseUrl || item.processedUrl,
                                status: 'done',
                              }
                            : item
                        )
                      );
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  batchCount={batchItems.length}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {initialTab === 'picker' && (
                <ColorPickerControl
                  pickedColor={pickedColor}
                  dominantColors={dominantColors}
                  onSelectColor={(hex) => setPickedColor(hexToColorInfo(hex))}
                  onReset={() => {}}
                  onUploadOther={handleUploadOther}
                  batchCount={batchItems.length}
                  isProcessing={false}
                />
              )}

              {initialTab === 'blurface' && (
                <BlurFaceControl
                  imageElement={imageElement}
                  boxes={blurBoxes}
                  setBoxes={setBlurBoxes}
                  blurIntensity={blurIntensity}
                  setBlurIntensity={setBlurIntensity}
                  onApply={async () => {
                    if (imageElement && currentItem?.file) {
                      try {
                        const canvas = document.createElement('canvas');
                        canvas.width = imageElement.naturalWidth;
                        canvas.height = imageElement.naturalHeight;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;

                        ctx.drawImage(imageElement, 0, 0);

                        blurBoxes.forEach((box) => {
                          ctx.save();
                          ctx.filter = `blur(${blurIntensity}px)`;
                          ctx.drawImage(
                            imageElement,
                            box.x,
                            box.y,
                            box.width,
                            box.height,
                            box.x,
                            box.y,
                            box.width,
                            box.height
                          );
                          ctx.restore();
                        });

                        canvas.toBlob(
                          (blob) => {
                            if (!blob) return;
                            const url = URL.createObjectURL(blob);
                            const newFile = new File([blob], currentItem.name, {
                              type: blob.type || 'image/jpeg',
                            });
                            setBatchItems((prev) =>
                              prev.map((item) =>
                                item.id === currentItem.id
                                  ? {
                                      ...item,
                                      file: newFile,
                                      originalUrl: url,
                                      transparentUrl: item.transparentUrl ? url : null,
                                      processedUrl: url,
                                      status: 'done',
                                    }
                                  : item
                              )
                            );
                            setBlurBoxes([]);
                          },
                          currentItem.file.type || 'image/jpeg',
                          0.95
                        );
                      } catch (err) {
                        console.error('Blur failed', err);
                      }
                    }
                  }}
                  onReset={() => {
                    setBlurBoxes([]);
                    if (currentItem) {
                      const targetFile = currentItem.initialFile || currentItem.file;
                      const targetUrl = currentItem.initialOriginalUrl || currentItem.originalUrl;
                      setBatchItems((prev) =>
                        prev.map((item) =>
                          item.id === currentItem.id
                            ? {
                                ...item,
                                file: targetFile,
                                originalUrl: targetUrl,
                                transparentUrl: item.transparentUrl ? targetUrl : null,
                                processedUrl: targetUrl,
                                status: 'done',
                              }
                            : item
                        )
                      );
                    }
                  }}
                  onUploadOther={handleUploadOther}
                  batchCount={batchItems.length}
                  isProcessing={false}
                />
              )}

              {initialTab === 'design' && (
                <div className="flex flex-col bg-dark-900 rounded-2xl border border-dark-600 overflow-hidden shrink-0">
                  <div className="p-4 border-b border-dark-600 bg-dark-800">
                    <h3 className="text-base font-heading font-bold text-white mb-0.5">{t('design.settings')}</h3>
                    <p className="text-[10px] text-slate-400 font-medium">{t('design.desc')}</p>
                  </div>
                  <div className="p-4 flex flex-col gap-4">
                    <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-600/30 flex flex-col gap-3 text-center">
                      <p className="text-xs text-slate-300">{t('design.info1')}</p>
                      <button
                        type="button"
                        onClick={() => {
                          const saveBtn = document.querySelector(
                            '[data-element="SaveButton"], [class*="FIE_topbar-save-btn"], [class*="save-btn"]'
                          ) as HTMLElement;
                          if (saveBtn) {
                            saveBtn.click();
                          } else {
                            const allBtns = Array.from(document.querySelectorAll('button'));
                            const saveTxtBtn = allBtns.find((b) => b.textContent?.toLowerCase().includes('save'));
                            if (saveTxtBtn) saveTxtBtn.click();
                          }
                        }}
                        className="w-full py-3 bg-gradient-to-r from-neon-indigo to-neon-cyan text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:shadow-glow-cyan transition-all tracking-wide cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        {t('design.saveBtn')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Suspense>

            {/* Export & Download Options Panel */}
            <ExportPanel
              batchItems={batchItems}
              setBatchItems={setBatchItems}
              initialTab={initialTab}
              isZipping={isZipping}
              onZipDownload={handleZipDownload}
              showToast={showToast}
            />
          </div>
        </div>
      </div>

      {/* Global Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 bg-dark-800 border border-dark-600 shadow-2xl rounded-2xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <span className="text-red-500 text-lg">⚠️</span>
            </div>
            <span className="text-sm font-bold text-white tracking-wide">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
