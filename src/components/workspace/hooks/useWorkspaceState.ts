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
import { BrushEngine } from '../tools/brush/brushEngine';
import { GRADIENT_PRESETS } from '../tools/ColorBgControl';

export function useWorkspaceState(initialTab: TabType = 'remove', keywordSlug?: string, rawInitialTab?: string) {
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
    rawInitialTab === 'colorwhite' || initialTab === 'colorwhite'
      ? '#FFFFFF'
      : keywordSlug && keywordSlug.toLowerCase().includes('biru')
      ? '#00529C'
      : '#DB1514';

  const resolvedRaw = rawInitialTab || initialTab;
  const initialTargetKB =
    resolvedRaw === 'compress50kb'
      ? 50
      : resolvedRaw === 'compress100kb'
      ? 100
      : resolvedRaw === 'compress200kb'
      ? 200
      : null;

  const initialBrushMode =
    resolvedRaw === 'removeperson' || resolvedRaw === 'removelogo' ? 'inpaint' : 'restore';
  const initialConvertFormat = resolvedRaw === 'convertwebp' ? 'image/webp' : 'image/jpeg';

  const removeBg = useRemoveBg('photo');
  const colorBg = useColorBg(initialColor);
  const brush = useBrush(initialBrushMode, 25);
  const watermark = useWatermark();
  const compress = useCompress(0.8, initialTargetKB);
  const convert = useConvert(initialConvertFormat);
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
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const restoreImageRef = useRef<HTMLImageElement | null>(null);
  const effectSequenceRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync keywordSlug & route slug presets to tool settings
  useEffect(() => {
    if (resolvedRaw === 'compress50kb') compress.setTargetKB(50);
    else if (resolvedRaw === 'compress100kb') compress.setTargetKB(100);
    else if (resolvedRaw === 'compress200kb') compress.setTargetKB(200);
    else if (resolvedRaw === 'compress') compress.setTargetKB(null);

    if (resolvedRaw === 'convertwebp') convert.setConvertFormat('image/webp');
    if (resolvedRaw === 'removeperson' || resolvedRaw === 'removelogo') brush.setBrushMode('inpaint');
    if (resolvedRaw === 'colorwhite') colorBg.setSelectedColor('#FFFFFF');
  }, [resolvedRaw]);

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
    if (!currentItem) {
      setImageElement(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // NOTE: imageElement must be set by the actual rendered DOM element (<motion.img>)
      // in WorkspaceViewport to provide real getBoundingClientRect() on-screen dimensions.
      resize.setOriginalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      resize.setResizeWidth(img.naturalWidth);
      resize.setResizeHeight(img.naturalHeight);
      // Initialize Crop Box to cover full image by default
      crop.setCropX(0);
      crop.setCropY(0);
      crop.setCropWidth(img.naturalWidth);
      crop.setCropHeight(img.naturalHeight);
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

    // Only live-composite background color and watermark previews.
    // Resize, Rotate, Crop, and Brush should NEVER auto-mutate processedUrl in the background!
    const isLiveCompositeTab =
      initialTab === 'color' ||
      initialTab === 'colorwhite' ||
      initialTab === 'watermark' ||
      initialTab === 'watermarkbulk';

    if (!isLiveCompositeTab) {
      return;
    }

    // Only live-composite background color if the image has already been cut out (transparentUrl exists)
    if (initialTab === 'color' || initialTab === 'colorwhite') {
      if (!currentItem.transparentUrl) {
        return;
      }
    }

    // Watermark preview should only be rendered on demand, not auto-setting status: 'done' on mount
    if (initialTab === 'watermark' || initialTab === 'watermarkbulk') {
      return;
    }

    const baseSrc = currentItem.transparentUrl;
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
          shadowEffect: colorBg.shadowEffect,
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
      } else {
        return;
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
    colorBg.shadowEffect,
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
    colorBg.shadowEffect,
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

  // Preload original image for instantaneous 0ms restore brush strokes
  useEffect(() => {
    if (currentItem?.originalUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        restoreImageRef.current = img;
      };
      img.src = currentItem.originalUrl;
    } else {
      restoreImageRef.current = null;
    }
  }, [currentItem?.originalUrl]);

  // --- Brush & Color Picker Canvas Handlers ---
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (initialTab === 'picker') {
      handleCanvasClick(e);
      return;
    }
    const imageSource = currentItem?.processedUrl || currentItem?.transparentUrl || currentItem?.originalUrl;
    if (initialTab !== 'brush' || !canvasRef.current || !imageSource) return;
    isDrawingRef.current = true;
    lastPointRef.current = null;
    drawBrush(e);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (initialTab !== 'picker' || !canvasRef.current || !currentItem) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const fracX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const fracY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const x = Math.floor(fracX * canvas.width);
    const y = Math.floor(fracY * canvas.height);

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
    lastPointRef.current = null;
    canvasRef.current.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setBatchItems((prev) =>
          prev.map((i, idx) => (idx === selectedIndex ? { ...i, processedUrl: url, status: 'done' } : i))
        );
      }
    }, 'image/png');
  };

  // Ensure drawing stops cleanly if user releases mouse anywhere on the page
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (isDrawingRef.current) {
        handleCanvasMouseUp();
      }
    };
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => window.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  const drawBrush = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const fracX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const fracY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const currentX = fracX * canvas.width;
    const currentY = fracY * canvas.height;

    // Scale radius in canvas coordinates so that on screen it matches brush.brushSize exactly in CSS pixels
    const displayWidth = canvas.clientWidth > 0 ? canvas.clientWidth : rect.width;
    const displayHeight = canvas.clientHeight > 0 ? canvas.clientHeight : rect.height;
    const scale = ((canvas.width / displayWidth) + (canvas.height / displayHeight)) / 2;
    const canvasRadius = Math.max(1, (brush.brushSize / 2) * scale);

    const start = lastPointRef.current || { x: currentX, y: currentY };
    const dist = Math.hypot(currentX - start.x, currentY - start.y);
    const step =
      brush.brushMode === 'inpaint'
        ? Math.max(2, canvasRadius * 0.6)
        : Math.max(1, canvasRadius * 0.25);
    const steps = Math.ceil(dist / step);

    const targetImg = restoreImageRef.current;

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 1 : i / steps;
      const px = start.x + (currentX - start.x) * t;
      const py = start.y + (currentY - start.y) * t;
      BrushEngine.applyStroke({
        ctx,
        originalImg: targetImg,
        x: px,
        y: py,
        radius: canvasRadius,
        mode: brush.brushMode,
      });
    }

    lastPointRef.current = { x: currentX, y: currentY };
  };

  // Render Canvas for Brush / Picker
  useEffect(() => {
    if (isDrawingRef.current) return;
    const imageSource = currentItem?.processedUrl || currentItem?.transparentUrl || currentItem?.originalUrl;
    if ((initialTab === 'brush' || initialTab === 'picker') && imageSource && canvasRef.current) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageSource;
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        if (initialTab === 'picker') {
          const colors = extractDominantColors(canvas, 8);
          colorPicker.setDominantColors(colors);
        }
      };
    }
  }, [initialTab, currentItem?.id, currentItem?.transparentUrl, currentItem?.originalUrl]);

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
      crop.setCropX(0);
      crop.setCropY(0);
      crop.setCropWidth(img.naturalWidth);
      crop.setCropHeight(img.naturalHeight);
      crop.setCropRadius(0);
    };
    img.src = currentItem.originalUrl;
    resize.setMaintainRatio(true);
    resize.setResizeMode('standard');
    resize.setResizeMethod('lanczos3');

    rotate.setRotationDeg(0);
    rotate.setFlipH(false);
    rotate.setFlipV(false);

    colorBg.setSelectedColor(initialColor);
    colorBg.setBgMode('color');
    colorBg.setSelectedGradient(GRADIENT_PRESETS[0].value);
    colorBg.handleClearCustomBg();
    colorBg.setBgBlur(0);
    colorBg.setShadowEffect('none');

    watermark.setWatermarkText('');
    watermark.setWatermarkImage(null);
    watermark.setWatermarkOpacity(0.8);
    watermark.setWatermarkRotation(0);
    watermark.setWatermarkScale(0.2);

    blur.setBlurBoxes([]);
    blur.setBlurIntensity(20);

    brush.resetBrush();
  }, [handleReset, currentItem, initialColor, resize, crop, rotate, colorBg, watermark, blur, brush]);

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
    modelTier: removeBg.modelTier,
    setModelTier: removeBg.setModelTier,
    modelTierRef: removeBg.modelTierRef,
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
    shadowEffect: colorBg.shadowEffect,
    setShadowEffect: colorBg.setShadowEffect,
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
    compressMode: compress.compressMode,
    setCompressMode: compress.setCompressMode,
    targetKB: compress.targetKB,
    setTargetKB: compress.setTargetKB,
    // Convert
    convertFormat: convert.convertFormat,
    setConvertFormat: convert.setConvertFormat,
    svgMode: convert.svgMode,
    setSvgMode: convert.setSvgMode,
    // Resize
    resizeWidth: resize.resizeWidth,
    setResizeWidth: resize.setResizeWidth,
    resizeHeight: resize.resizeHeight,
    setResizeHeight: resize.setResizeHeight,
    resizeMaintainRatio: resize.resizeMaintainRatio,
    setResizeMaintainRatio: resize.setResizeMaintainRatio,
    resizeMode: resize.resizeMode,
    setResizeMode: resize.setResizeMode,
    resizeMethod: resize.resizeMethod,
    setResizeMethod: resize.setResizeMethod,
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
    applyCurrentEffect,
  };
}
