// src/components/workspace/hooks/useWorkspaceState.ts
// Clean, Modular Workspace Orchestrator - Composes Dedicated Hooks for All 12 Tools

import { useState, useRef, useEffect, useCallback } from 'react';
import type { TabType, BatchItem, ColorInfo, WatermarkPosition } from '../types';

// Core State
import { useWorkspaceCore } from './useWorkspaceCore';

// 12 Dedicated Tool Hooks
import { useRemoveBg } from '../tools/removeBg/useRemoveBg';
import { useColorBg } from '../tools/colorBg/useColorBg';
import { useBrush } from '../tools/brush/useBrush';
import { useWatermark } from '../tools/watermark/useWatermark';
import { useCompress } from '../tools/compress/useCompress';
import { useConvert } from '../tools/convert/useConvert';
import { useResize } from '../tools/resize/useResize';
import { useCrop } from '../tools/crop/useCrop';
import { useRotate } from '../tools/rotate/useRotate';
import { useColorPicker } from '../tools/colorPicker/useColorPicker';
import { useBlur } from '../tools/blur/useBlur';
import { useDesign } from '../tools/design/useDesign';

// Engines for canvas effects
import { ColorBgEngine } from '../tools/colorBg/colorBgEngine';
import { WatermarkEngine } from '../tools/watermark/watermarkEngine';
import { BlurEngine } from '../tools/blur/blurEngine';
import { CompressEngine } from '../tools/compress/compressEngine';
import { ConvertEngine } from '../tools/convert/convertEngine';
import { ResizeEngine } from '../tools/resize/resizeEngine';
import { CropEngine } from '../tools/crop/cropEngine';
import { RotateEngine } from '../tools/rotate/rotateEngine';
import { ColorPickerEngine } from '../tools/colorPicker/colorPickerEngine';

export function useWorkspaceState(initialTab: TabType = 'remove', keywordSlug?: string) {
  // 1. Core Batch & File Management
  const core = useWorkspaceCore(initialTab);
  const { t, batchItems, setBatchItems, selectedIndex, setSelectedIndex, currentItem } = core;

  // 2. Individual Tool State Hooks
  const initialColor =
    initialTab === 'colorwhite'
      ? '#FFFFFF'
      : keywordSlug && keywordSlug.toLowerCase().includes('biru')
      ? '#00529C'
      : '#DB1514';

  const removeBg = useRemoveBg('auto');
  const colorBg = useColorBg(initialColor);
  const brush = useBrush('restore', 25);
  const watermark = useWatermark();
  const compress = useCompress(0.8);
  const convert = useConvert('image/jpeg');
  const resize = useResize();
  const crop = useCrop();
  const rotate = useRotate();
  const colorPicker = useColorPicker();
  const blur = useBlur(10);
  const design = useDesign();

  // Processing Queue Refs
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [isApplyingEffect, setIsApplyingEffect] = useState(false);
  const isProcessingRef = useRef(false);
  const isDrawingRef = useRef(false);
  const effectSequenceRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync keywordSlug to tool settings
  useEffect(() => {
    if (keywordSlug) {
      const lower = keywordSlug.toLowerCase();
      if (lower.includes('merah')) colorBg.setSelectedColor('#DB1514');
      else if (lower.includes('biru')) colorBg.setSelectedColor('#00529C');
      else if (lower.includes('putih')) colorBg.setSelectedColor('#FFFFFF');
      else if (lower.includes('hitam')) colorBg.setSelectedColor('#000000');
      else if (lower.includes('kuning')) colorBg.setSelectedColor('#FACC15');
      else if (lower.includes('hijau')) colorBg.setSelectedColor('#16A34A');
    }
  }, [keywordSlug]);

  // Load natural dimensions when currentItem changes
  useEffect(() => {
    if (!currentItem) return;
    const img = new Image();
    img.onload = () => {
      resize.setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      if (resize.resizeWidth === 0 && resize.resizeHeight === 0) {
        resize.setResizeWidth(img.naturalWidth);
        resize.setResizeHeight(img.naturalHeight);
      }
    };
    img.src = currentItem.originalUrl;
  }, [currentItem?.id]);

  // --- Background Removal Queue Execution ---
  const processSingleItem = useCallback(
    async (item: BatchItem) => {
      setBatchItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                status: 'processing',
                progress: 25,
                progressStep: t('work.step.init', { defaultValue: 'Initializing ONNX AI pipeline & tensors...' }),
              }
            : i
        )
      );

      try {
        const { transparentUrl, detectedType } = await removeBg.processItem(item, (step, pct) => {
          setBatchItems((prev) =>
            prev.map((i) => (i.id === item.id ? { ...i, progress: Math.max(pct, 30), progressStep: step } : i))
          );
        });

        setBatchItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  status: 'done',
                  transparentUrl,
                  processedUrl: transparentUrl,
                  progress: 100,
                  detectedType,
                }
              : i
          )
        );
      } catch (err: any) {
        console.error('[HelpMyIMG Batch Error]:', err);
        setBatchItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'error', errorMessage: err.message || err.toString() } : i))
        );
      }
    },
    [removeBg, setBatchItems, t]
  );

  // Queue runner for queued items
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingRef.current) return;
      const nextItem = batchItems.find((i) => i.status === 'queued');

      if (nextItem) {
        isProcessingRef.current = true;
        setIsProcessingQueue(true);
        await processSingleItem(nextItem);
        isProcessingRef.current = false;
        setIsProcessingQueue(false);
      }
    };

    processQueue();
  }, [batchItems, processSingleItem]);

  // --- Apply Active Effect to Canvas Viewport ---
  const applyCurrentEffect = useCallback(async () => {
    if (!currentItem) return;

    // For background removal, don't auto-apply if not processed
    if (initialTab === 'remove' && currentItem.status === 'idle') return;

    const baseSrc = currentItem.transparentUrl || currentItem.originalUrl;
    if (!baseSrc) return;

    const currentSeq = ++effectSequenceRef.current;
    setIsApplyingEffect(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = baseSrc;
      });

      if (currentSeq !== effectSequenceRef.current) return;

      let resultCanvas: HTMLCanvasElement;

      // Dispatch to specific pure engine
      if (initialTab === 'color' || initialTab === 'colorwhite') {
        resultCanvas = ColorBgEngine.applyBackground(img, {
          mode: colorBg.bgMode,
          color: colorBg.selectedColor,
          gradient: colorBg.selectedGradient,
          customBgElement: colorBg.customBgImageElement,
          presetBgElement: colorBg.presetBgImageElement,
          blur: colorBg.bgBlur,
        });
      } else if (initialTab === 'watermark' || initialTab === 'watermarkbulk') {
        resultCanvas = WatermarkEngine.applyWatermark(img, {
          type: watermark.watermarkType,
          text: watermark.watermarkText,
          color: watermark.watermarkColor,
          opacity: watermark.watermarkOpacity,
          position: watermark.watermarkPosition,
          image: watermark.watermarkImage,
          scale: watermark.watermarkScale,
          rotation: watermark.watermarkRotation,
        });
      } else if (initialTab === 'blurface' || initialTab === 'blurplate') {
        resultCanvas = BlurEngine.applyBlurBoxes(img, blur.blurBoxes, blur.blurIntensity);
      } else if (initialTab === 'picker') {
        resultCanvas = document.createElement('canvas');
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        resultCanvas.getContext('2d')?.drawImage(img, 0, 0);
        colorPicker.extractPalette(resultCanvas);
      } else {
        resultCanvas = document.createElement('canvas');
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        resultCanvas.getContext('2d')?.drawImage(img, 0, 0);
      }

      const blob = await new Promise<Blob | null>((resolve) => resultCanvas.toBlob(resolve, 'image/png'));
      if (blob && currentSeq === effectSequenceRef.current) {
        const url = URL.createObjectURL(blob);
        setBatchItems((prev) =>
          prev.map((i) => (i.id === currentItem.id ? { ...i, processedUrl: url, status: 'done', progress: 100 } : i))
        );
      }
    } catch (err) {
      console.error('Error applying effect:', err);
    } finally {
      if (currentSeq === effectSequenceRef.current) {
        setIsApplyingEffect(false);
      }
    }
  }, [
    currentItem,
    initialTab,
    colorBg.bgMode,
    colorBg.selectedColor,
    colorBg.selectedGradient,
    colorBg.customBgImageElement,
    colorBg.presetBgImageElement,
    colorBg.bgBlur,
    watermark.watermarkType,
    watermark.watermarkText,
    watermark.watermarkColor,
    watermark.watermarkOpacity,
    watermark.watermarkPosition,
    watermark.watermarkImage,
    watermark.watermarkScale,
    watermark.watermarkRotation,
    blur.blurBoxes,
    blur.blurIntensity,
    colorPicker,
    setBatchItems,
  ]);

  // Debounce effect update on parameter changes
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      applyCurrentEffect();
    }, 40);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [
    colorBg.bgMode,
    colorBg.selectedColor,
    colorBg.selectedGradient,
    colorBg.customBgImageElement,
    colorBg.presetBgImageElement,
    colorBg.bgBlur,
    watermark.watermarkText,
    watermark.watermarkColor,
    watermark.watermarkOpacity,
    watermark.watermarkPosition,
    watermark.watermarkType,
    watermark.watermarkImage,
    watermark.watermarkScale,
    watermark.watermarkRotation,
    blur.blurBoxes,
    blur.blurIntensity,
    currentItem?.transparentUrl,
    selectedIndex,
  ]);

  // Handle manual removal trigger
  const handleProcessNow = useCallback(() => {
    if (!currentItem) return;
    setBatchItems((prev) =>
      prev.map((i) => (i.id === currentItem.id ? { ...i, status: 'queued', progress: 5 } : i))
    );
  }, [currentItem, setBatchItems]);

  // Handle batch removal trigger
  const handleProcessBatch = useCallback(() => {
    setBatchItems((prev) => prev.map((i) => ({ ...i, status: 'queued', progress: 5 })));
  }, [setBatchItems]);

  // Execute manual actions for specific utility tools
  const handleExecuteUtility = useCallback(
    async (toolType: TabType) => {
      if (!currentItem) return;
      try {
        let resultBlob: Blob | null = null;

        if (toolType === 'compress' || toolType.startsWith('compress')) {
          resultBlob = await compress.compressFile(currentItem.file);
        } else if (toolType === 'convert' || toolType.startsWith('convert')) {
          resultBlob = await convert.convertFile(currentItem.file);
        } else if (toolType === 'resize' || toolType.startsWith('resize')) {
          resultBlob = await resize.resizeFile(currentItem.file);
        } else if (toolType === 'crop') {
          resultBlob = await crop.cropFile(currentItem.file);
        } else if (toolType === 'rotate') {
          resultBlob = await rotate.rotateFile(currentItem.file);
        }

        if (resultBlob) {
          const url = URL.createObjectURL(resultBlob);
          setBatchItems((prev) =>
            prev.map((i) => (i.id === currentItem.id ? { ...i, processedUrl: url, status: 'done', progress: 100 } : i))
          );
          core.setToastMessage(t('editor.processSuccess', { defaultValue: 'Processed successfully!' }));
        }
      } catch (err: any) {
        console.error('Execute Utility Error:', err);
        core.setToastMessage(err.message || 'Operation failed');
      }
    },
    [currentItem, compress, convert, resize, crop, rotate, setBatchItems, core, t]
  );

  return {
    ...core,
    // Remove Background
    imageType: removeBg.imageType,
    setImageType: removeBg.setImageType,
    imageTypeRef: removeBg.imageTypeRef,
    detectedType: removeBg.detectedType,
    handleProcessNow,
    handleProcessBatch,
    // Color Background
    initialColor,
    bgMode: colorBg.bgMode,
    setBgMode: colorBg.setBgMode,
    selectedColor: colorBg.selectedColor,
    setSelectedColor: colorBg.setSelectedColor,
    selectedGradient: colorBg.selectedGradient,
    setSelectedGradient: colorBg.setSelectedGradient,
    customBgFile: colorBg.customBgFile,
    customBgUrl: colorBg.customBgUrl,
    customBgImageElement: colorBg.customBgImageElement,
    handleUploadCustomBg: colorBg.handleUploadCustomBg,
    handleClearCustomBg: colorBg.handleClearCustomBg,
    selectedPreset: colorBg.selectedPreset,
    setSelectedPreset: colorBg.setSelectedPreset,
    presetBgImageElement: colorBg.presetBgImageElement,
    bgBlur: colorBg.bgBlur,
    setBgBlur: colorBg.setBgBlur,
    // Brush
    brushMode: brush.brushMode,
    setBrushMode: brush.setBrushMode,
    brushSize: brush.brushSize,
    setBrushSize: brush.setBrushSize,
    isDrawingRef,
    // Watermark
    watermarkText: watermark.watermarkText,
    setWatermarkText: watermark.setWatermarkText,
    watermarkColor: watermark.watermarkColor,
    setWatermarkColor: watermark.setWatermarkColor,
    watermarkOpacity: watermark.watermarkOpacity,
    setWatermarkOpacity: watermark.setWatermarkOpacity,
    watermarkPosition: watermark.watermarkPosition,
    setWatermarkPosition: watermark.setWatermarkPosition,
    watermarkType: watermark.watermarkType,
    setWatermarkType: watermark.setWatermarkType,
    watermarkImage: watermark.watermarkImage,
    setWatermarkImage: watermark.setWatermarkImage,
    watermarkScale: watermark.watermarkScale,
    setWatermarkScale: watermark.setWatermarkScale,
    watermarkRotation: watermark.watermarkRotation,
    setWatermarkRotation: watermark.setWatermarkRotation,
    // Compress
    compressQuality: compress.compressQuality,
    setCompressQuality: compress.setCompressQuality,
    // Convert
    convertFormat: convert.convertFormat,
    setConvertFormat: convert.setConvertFormat,
    // Resize
    resizeWidth: resize.resizeWidth,
    setResizeWidth: resize.setResizeWidth,
    resizeHeight: resize.resizeHeight,
    setResizeHeight: resize.setResizeHeight,
    resizeMaintainRatio: resize.resizeMaintainRatio,
    setResizeMaintainRatio: resize.setResizeMaintainRatio,
    resizeMode: resize.resizeMode,
    setResizeMode: resize.setResizeMode,
    originalDimensions: resize.originalDimensions,
    // Crop
    cropX: crop.cropX,
    setCropX: crop.setCropX,
    cropY: crop.cropY,
    setCropY: crop.setCropY,
    cropWidth: crop.cropWidth,
    setCropWidth: crop.setCropWidth,
    cropHeight: crop.cropHeight,
    setCropHeight: crop.setCropHeight,
    cropRadius: crop.cropRadius,
    setCropRadius: crop.setCropRadius,
    // Rotate
    rotationDeg: rotate.rotationDeg,
    setRotationDeg: rotate.setRotationDeg,
    flipH: rotate.flipH,
    setFlipH: rotate.setFlipH,
    flipV: rotate.flipV,
    setFlipV: rotate.setFlipV,
    // Color Picker
    pickedColor: colorPicker.pickedColor,
    setPickedColor: colorPicker.setPickedColor,
    dominantColors: colorPicker.dominantColors,
    // Blur
    blurBoxes: blur.blurBoxes,
    setBlurBoxes: blur.setBlurBoxes,
    blurIntensity: blur.blurIntensity,
    setBlurIntensity: blur.setBlurIntensity,
    // Design
    isEditorOpen: design.isEditorOpen,
    setIsEditorOpen: design.setIsEditorOpen,
    // Queue & Execution
    isProcessingQueue,
    isApplyingEffect,
    handleExecuteUtility,
    applyCurrentEffect,
  };
}
