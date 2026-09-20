// src/components/workspace/hooks/useWorkspaceState.ts
// Clean, Modular Workspace Orchestrator - Composes Dedicated Hooks for All 12 Tools

import { useState, useRef, useEffect, useCallback } from 'react';
import type { TabType, BatchItem, ColorInfo, WatermarkPosition } from '../types';
import { buildColorInfo, extractDominantColors } from '../../../utils/colorUtils';

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

export function useWorkspaceState(initialTab: TabType = 'remove', keywordSlug?: string) {
  // 1. Core Batch & File Management
  const core = useWorkspaceCore(initialTab);
  const {
    t,
    batchItems,
    setBatchItems,
    selectedIndex,
    setSelectedIndex,
    currentItem,
    isDragging,
    setIsDragging,
    isZipping,
    setIsZipping,
    toastMessage,
    setToastMessage,
    fileInputRef,
    canvasRef,
    handleFiles,
    handleReset,
    handleUploadOther,
    handleDownloadSingle,
    handleDownloadZip,
  } = core;

  // 2. Individual Tool State Hooks
  const initialColor =
    initialTab === 'colorwhite'
      ? '#FFFFFF'
      : keywordSlug && keywordSlug.toLowerCase().includes('biru')
      ? '#00529C'
      : '#DB1514';

  const removeBg = useRemoveBg('photo');
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

  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

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

  // Load natural dimensions and imageElement when currentItem changes
  useEffect(() => {
    if (!currentItem) {
      setImageElement(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageElement(img);
      resize.setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      if (resize.resizeWidth === 0 || resize.resizeHeight === 0) {
        resize.setResizeWidth(img.naturalWidth);
        resize.setResizeHeight(img.naturalHeight);
      }
    };
    img.src = currentItem.originalUrl;
  }, [currentItem?.id, currentItem?.originalUrl]);

  // --- Background Removal Execution for a Single Item ---
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
        const { transparentUrl } = await removeBg.processItem(item, (step, pct) => {
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
                  initialTransparentUrl: transparentUrl,
                  processedUrl: transparentUrl,
                  progress: 100,
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
      } else if (initialTab === 'resize' || initialTab === 'resizeig' || initialTab === 'resizepassport') {
        const targetW = resize.resizeWidth > 0 ? resize.resizeWidth : img.width;
        const targetH = resize.resizeHeight > 0 ? resize.resizeHeight : img.height;
        resultCanvas = document.createElement('canvas');
        resultCanvas.width = targetW;
        resultCanvas.height = targetH;
        const ctx = resultCanvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        if (resize.resizeMode === 'smart') {
          // Smart Auto mode: preserve aspect ratio, cover canvas centered
          const scale = Math.max(targetW / img.width, targetH / img.height);
          const scaledW = img.width * scale;
          const scaledH = img.height * scale;
          const offsetX = (targetW - scaledW) / 2;
          const offsetY = (targetH - scaledH) / 2;
          ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
        } else {
          // Standard squish mode: stretch to exact targetW x targetH
          ctx.drawImage(img, 0, 0, targetW, targetH);
        }
      } else if (initialTab === 'rotate') {
        const rad = (rotate.rotationDeg * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const newW = Math.max(1, Math.round(img.width * cos + img.height * sin));
        const newH = Math.max(1, Math.round(img.width * sin + img.height * cos));

        resultCanvas = document.createElement('canvas');
        resultCanvas.width = newW;
        resultCanvas.height = newH;
        const ctx = resultCanvas.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.translate(newW / 2, newH / 2);
        ctx.rotate(rad);
        ctx.scale(rotate.flipH ? -1 : 1, rotate.flipV ? -1 : 1);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
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
    resize.resizeWidth,
    resize.resizeHeight,
    resize.maintainRatio,
    resize.resizeMode,
    rotate.rotationDeg,
    rotate.flipH,
    rotate.flipV,
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
    resize.resizeWidth,
    resize.resizeHeight,
    resize.maintainRatio,
    resize.resizeMode,
    rotate.rotationDeg,
    rotate.flipH,
    rotate.flipV,
    currentItem?.transparentUrl,
    currentItem?.originalUrl,
    selectedIndex,
  ]);

  // --- Brush & Color Picker Canvas Handlers ---
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (initialTab === 'picker') {
      handleCanvasClick(e);
      return;
    }
    if (initialTab !== 'brush' || !canvasRef.current || !currentItem?.processedUrl) return;
    isDrawingRef.current = true;
    drawBrush(e);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (initialTab !== 'picker' || !canvasRef.current || !currentItem) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);

    if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const [r, g, b, a] = pixel;
      if (a > 0) {
        const info = buildColorInfo(r, g, b);
        colorPicker.setPickedColor(info);
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    drawBrush(e);
  };

  const handleCanvasMouseUp = () => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    isDrawingRef.current = false;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setBatchItems((prev) =>
          prev.map((i, idx) => (idx === selectedIndex ? { ...i, processedUrl: url } : i))
        );
      }
    }, 'image/png');
  };

  const drawBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const doDraw = (img?: HTMLImageElement) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, brush.brushSize / 2, 0, Math.PI * 2);

      if (brush.brushMode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();
      } else if (img) {
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      ctx.restore();
    };

    if (brush.brushMode === 'restore') {
      const origImg = new Image();
      origImg.onload = () => doDraw(origImg);
      origImg.src = currentItem!.originalUrl;
    } else {
      doDraw();
    }
  };

  // Render Canvas for Brush / Picker
  useEffect(() => {
    if ((initialTab === 'brush' || initialTab === 'picker') && currentItem?.processedUrl && canvasRef.current) {
      const img = new Image();
      img.src = currentItem.processedUrl;
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        if (initialTab === 'picker') {
          const colors = extractDominantColors(canvas, 8);
          colorPicker.setDominantColors(colors);
        }
      };
    }
  }, [initialTab, currentItem?.processedUrl]);

  // Enhanced Reset handler that resets batchItem state AND tool parameters
  const handleEnhancedReset = useCallback(() => {
    handleReset();
    if (!currentItem) return;

    // Reset sub-tool states
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resize.setResizeWidth(img.naturalWidth);
      resize.setResizeHeight(img.naturalHeight);
      resize.setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = currentItem.originalUrl;
    resize.setMaintainRatio(true);
    resize.setResizeMode('standard');

    rotate.setRotationDeg(0);
    rotate.setFlipH(false);
    rotate.setFlipV(false);

    colorBg.setSelectedColor(initialColor);
    colorBg.setBgMode('color');
    colorBg.setSelectedGradient(null);
    colorBg.setCustomBgUrl(null);
    colorBg.setBgBlur(0);

    watermark.setWatermarkText('');
    watermark.setWatermarkImage(null);
    watermark.setWatermarkOpacity(0.8);
    watermark.setWatermarkRotation(0);
    watermark.setWatermarkScale(0.2);

    blur.setBlurBoxes([]);
    blur.setBlurIntensity(20);

    brush.resetBrush();
  }, [handleReset, currentItem, initialColor, resize, rotate, colorBg, watermark, blur, brush]);

  return {
    t,
    batchItems,
    setBatchItems,
    selectedIndex,
    setSelectedIndex,
    currentItem,
    isDragging,
    setIsDragging,
    isZipping,
    setIsZipping,
    toastMessage,
    showToast: setToastMessage,
    isApplyingEffect,
    imageElement,
    setImageElement,
    fileInputRef,
    canvasRef,
    // Handlers
    handleFiles,
    processSingleItem,
    handleUploadOther,
    handleResetCurrent: handleEnhancedReset,
    handleZipDownload: handleDownloadZip,
    handleDownloadSingle,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
    // Remove Background
    imageType: removeBg.imageType,
    setImageType: removeBg.setImageType,
    imageTypeRef: removeBg.imageTypeRef,
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
    setOriginalDimensions: resize.setOriginalDimensions,
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
    setDominantColors: colorPicker.setDominantColors,
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
    applyCurrentEffect,
  };
}
