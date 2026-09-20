// src/components/workspace/hooks/useWorkspaceState.ts
// Comprehensive State Management Hook for HelpMyIMG Workspace

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { useRouter } from '../../../context/RouterContext';
import { aiService } from '../../../services/aiService';
import { processImage, smartCropImage } from '../../../utils/imageOperations';
import { buildColorInfo, extractDominantColors } from '../../../utils/colorUtils';
import { PRESET_SCENES, GRADIENT_PRESETS } from '../tools/ColorBgControl';
import JSZip from 'jszip';
import type { BatchItem, ColorInfo, WatermarkPosition, BlurBox, BgMode } from '../types';

export function useWorkspaceState(initialTab: string) {
  const { t } = useTranslation();
  const { route } = useRouter();
  const { keywordSlug } = route;

  // --- STATE DECLARATIONS ---
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [_isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [imageType, setImageType] = useState<'photo' | 'logo' | 'general'>('photo');

  // Background Changing States
  const initialColor =
    initialTab === 'colorwhite'
      ? '#FFFFFF'
      : keywordSlug && keywordSlug.toLowerCase().includes('biru')
      ? '#00529C'
      : '#DB1514';
  const [bgMode, setBgMode] = useState<BgMode>('color');
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_PRESETS[0].value);
  const [_customBgFile, setCustomBgFile] = useState<File | null>(null);
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);
  const [customBgImageElement, setCustomBgImageElement] = useState<HTMLImageElement | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>(PRESET_SCENES[0].id);
  const [presetBgImageElement, setPresetBgImageElement] = useState<HTMLImageElement | null>(null);
  const [bgBlur, setBgBlur] = useState<number>(0);

  // Brush States
  const [brushMode, setBrushMode] = useState<'restore' | 'erase'>('restore');
  const [brushSize, setBrushSize] = useState(25);

  // Watermark States
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('center');
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
  const [watermarkScale, setWatermarkScale] = useState(1);
  const [watermarkRotation, setWatermarkRotation] = useState(0);

  // Export & Zip States
  const [isZipping, setIsZipping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isApplyingEffect, setIsApplyingEffect] = useState(false);

  // Compression, Conversion & Resize States
  const [compressQuality, setCompressQuality] = useState(0.8);
  const [convertFormat, setConvertFormat] = useState<
    | 'image/png'
    | 'image/jpeg'
    | 'image/webp'
    | 'image/gif'
    | 'image/bmp'
    | 'image/x-icon'
    | 'image/avif'
    | 'image/svg+xml'
  >('image/jpeg');
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [resizeMaintainRatio, setResizeMaintainRatio] = useState(false);
  const [resizeMode, setResizeMode] = useState<'standard' | 'smart'>('standard');
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  // Crop States
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [cropRadius, setCropRadius] = useState(0);

  // Rotate States
  const [rotationDeg, setRotationDeg] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Picker & Blur Face States
  const [pickedColor, setPickedColor] = useState<ColorInfo | null>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [blurBoxes, setBlurBoxes] = useState<BlurBox[]>([]);
  const [blurIntensity, setBlurIntensity] = useState(10);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  // --- REFS ---
  const imageTypeRef = useRef<'photo' | 'logo' | 'general'>('photo');
  const prevBatchItemsRef = useRef<BatchItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const isProcessingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectSequenceRef = useRef(0);

  // Keep imageTypeRef in sync with state
  useEffect(() => {
    imageTypeRef.current = imageType;
  }, [imageType]);

  const currentItem = batchItems[selectedIndex] || null;

  // Sync keywordSlug to tool settings
  useEffect(() => {
    if (keywordSlug) {
      const lower = keywordSlug.toLowerCase();
      setSelectedColor(lower.includes('biru') ? '#00529C' : '#DB1514');

      if (lower.includes('50kb')) setCompressQuality(0.5);
      else if (lower.includes('100kb')) setCompressQuality(0.65);
      else if (lower.includes('200kb') || lower.includes('500kb')) setCompressQuality(0.75);

      if (lower.includes('webp')) setConvertFormat('image/webp');
      else if (lower.includes('jpg') || lower.includes('jpeg')) setConvertFormat('image/jpeg');
      else if (lower.includes('png')) setConvertFormat('image/png');
    }
  }, [keywordSlug]);

  // Pre-load preset background scene image
  useEffect(() => {
    const scene = PRESET_SCENES.find((s) => s.id === selectedPreset) || PRESET_SCENES[0];
    if (scene) {
      const img = new Image();
      img.onload = () => setPresetBgImageElement(img);
      img.src = scene.dataUrl;
    }
  }, [selectedPreset]);

  // Clean memory URLs
  useEffect(() => {
    const prevItems = prevBatchItemsRef.current;
    const currentUrls = new Set<string>();

    batchItems.forEach((item) => {
      if (item.originalUrl) currentUrls.add(item.originalUrl);
      if (item.transparentUrl) currentUrls.add(item.transparentUrl);
      if (item.processedUrl) currentUrls.add(item.processedUrl);
      if (item.compressUrl) currentUrls.add(item.compressUrl);
    });

    prevItems.forEach((item) => {
      if (item.originalUrl && !currentUrls.has(item.originalUrl)) URL.revokeObjectURL(item.originalUrl);
      if (item.transparentUrl && !currentUrls.has(item.transparentUrl)) URL.revokeObjectURL(item.transparentUrl);
      if (item.processedUrl && !currentUrls.has(item.processedUrl)) URL.revokeObjectURL(item.processedUrl);
      if (item.compressUrl && !currentUrls.has(item.compressUrl)) URL.revokeObjectURL(item.compressUrl);
    });

    prevBatchItemsRef.current = batchItems;
  }, [batchItems]);

  useEffect(() => {
    return () => {
      const items = prevBatchItemsRef.current;
      items.forEach((item) => {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.transparentUrl) URL.revokeObjectURL(item.transparentUrl);
        if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
        if (item.compressUrl) URL.revokeObjectURL(item.compressUrl);
      });
      if (customBgUrl) {
        URL.revokeObjectURL(customBgUrl);
      }
    };
  }, [customBgUrl]);

  const handleUploadCustomBg = useCallback(
    (file: File) => {
      if (customBgUrl) {
        URL.revokeObjectURL(customBgUrl);
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setCustomBgFile(file);
        setCustomBgUrl(url);
        setCustomBgImageElement(img);
        setBgMode('image');
      };
      img.src = url;
    },
    [customBgUrl]
  );

  const handleClearCustomBg = useCallback(() => {
    if (customBgUrl) {
      URL.revokeObjectURL(customBgUrl);
    }
    setCustomBgFile(null);
    setCustomBgUrl(null);
    setCustomBgImageElement(null);
    setBgMode('color');
  }, [customBgUrl]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleZipDownload = async () => {
    if (isZipping) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const zipName = `HelpMyIMG_Batch_${Date.now()}`;

      for (let i = 0; i < batchItems.length; i++) {
        const item = batchItems[i];
        const url = item.transparentUrl || item.processedUrl || item.originalUrl;
        if (!url) continue;

        const res = await fetch(url);
        const blob = await res.blob();

        let fname = item.name;
        if (!fname.includes('.')) {
          const ext = blob.type.split('/')[1] || 'png';
          fname = `${fname}.${ext}`;
        }

        zip.file(fname, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const downloadUrl = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${zipName}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  const handleUploadOther = useCallback(() => {
    setBatchItems([]);
    setSelectedIndex(0);
    setPickedColor(null);
    setDominantColors([]);
    setBgMode('color');
    setSelectedColor(initialColor);
    setBgBlur(0);
    setRotationDeg(0);
    setFlipH(false);
    setFlipV(false);
    setCropX(0);
    setCropY(0);
    setBlurBoxes([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, [initialColor]);

  const handleResetCurrent = useCallback(() => {
    if (!currentItem) return;
    setBgMode('color');
    setSelectedColor(initialColor);
    setBgBlur(0);
    setRotationDeg(0);
    setFlipH(false);
    setFlipV(false);
    setCropX(0);
    setCropY(0);
    setCompressQuality(0.8);
    setWatermarkText('');
    setBatchItems((prev) =>
      prev.map((item, idx) =>
        idx === selectedIndex
          ? {
              ...item,
              processedUrl: item.transparentUrl || item.originalUrl,
              rotateBaseUrl: undefined,
              compressBlob: undefined,
              compressUrl: undefined,
              status: 'done',
            }
          : item
      )
    );
  }, [currentItem, initialColor, selectedIndex]);

  // Load image dimensions
  useEffect(() => {
    if (currentItem && currentItem.originalUrl) {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        if (!currentItem.initialDimensions) {
          setBatchItems((prev) =>
            prev.map((item) =>
              item.id === currentItem.id
                ? {
                    ...item,
                    initialDimensions: { width: img.width, height: img.height },
                  }
                : item
            )
          );
        }
        setResizeWidth(img.width);
        setResizeHeight(img.height);

        setCropX(0);
        setCropY(0);
        setCropWidth(img.width);
        setCropHeight(img.height);
      };
      img.src = currentItem.originalUrl;
    }
  }, [currentItem?.originalUrl, currentItem?.id]);

  // Clear preview when quality changes
  useEffect(() => {
    if (!currentItem) return;
    setBatchItems((prev) =>
      prev.map((item, idx) => {
        if (idx === selectedIndex && (item.compressBlob || item.compressUrl)) {
          return { ...item, compressBlob: undefined, compressUrl: undefined, compressSourceSize: undefined };
        }
        return item;
      })
    );
  }, [compressQuality, selectedIndex]);

  // Handle file uploads
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 10);
    if (fileArray.length === 0) return;

    const newItems: BatchItem[] = fileArray.map((f) => {
      const url = URL.createObjectURL(f);
      return {
        id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        name: f.name,
        file: f,
        originalUrl: url,
        transparentUrl: null,
        processedUrl: null,
        initialFile: f,
        initialOriginalUrl: url,
        modelType: 'rmbg',
        status: ['remove', 'color', 'colorwhite', 'removelogo', 'removeperson', 'brush'].includes(initialTab)
          ? 'queued'
          : 'idle',
        progress: 0,
        progressStep: ['remove', 'color', 'colorwhite', 'removelogo', 'removeperson', 'brush'].includes(initialTab)
          ? t('work.startAi', { defaultValue: 'Memulai AI...' })
          : t('work.waiting'),
      };
    });

    setBatchItems((prev) => {
      const merged = [...prev, ...newItems];
      if (
        [
          'watermark',
          'watermarkbulk',
          'compress',
          'compress100kb',
          'compress50kb',
          'compress200kb',
          'convert',
          'convertwebp',
          'resize',
          'resizeig',
          'resizepassport',
          'crop',
          'rotate',
          'picker',
          'blurface',
          'blurplate',
          'design',
        ].includes(initialTab)
      ) {
        return merged.map((i) =>
          newItems.some((n) => n.id === i.id)
            ? { ...i, status: 'done', transparentUrl: i.originalUrl, processedUrl: i.originalUrl, progress: 100 }
            : i
        );
      }
      return merged;
    });

    if (batchItems.length === 0) setSelectedIndex(0);
  };

  // --- AI Queue Execution ---
  const processSingleItem = useCallback(
    async (item: BatchItem) => {
      setBatchItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progressStep: t('work.startAi') } : i))
      );

      try {
        const resultBlob = await aiService.removeBackgroundAsync(
          item.file,
          'rmbg',
          80,
          (step, pct) => {
            setBatchItems((prev) =>
              prev.map((i) => (i.id === item.id ? { ...i, progress: pct, progressStep: step } : i))
            );
          },
          imageTypeRef.current
        );

        const transUrl = URL.createObjectURL(resultBlob);
        setBatchItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'done', transparentUrl: transUrl, processedUrl: transUrl, progress: 100 }
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
    [t]
  );

  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingRef.current) return;

      const nextItem = batchItems.find(
        (i) =>
          i.status === 'queued' &&
          ![
            'watermark',
            'watermarkbulk',
            'compress',
            'compress100kb',
            'compress50kb',
            'compress200kb',
            'convert',
            'convertwebp',
            'resize',
            'resizeig',
            'resizepassport',
            'crop',
            'rotate',
            'picker',
            'blurface',
            'blurplate',
            'design',
          ].includes(initialTab)
      );

      if (nextItem) {
        isProcessingRef.current = true;
        setIsProcessingQueue(true);
        await processSingleItem(nextItem);
        isProcessingRef.current = false;
        setIsProcessingQueue(false);
      }
    };

    processQueue();
  }, [batchItems, initialTab, processSingleItem]);

  // Auto-queue for transparent tabs
  useEffect(() => {
    if (['remove', 'color', 'colorwhite', 'removelogo', 'removeperson', 'brush'].includes(initialTab)) {
      setBatchItems((prev) =>
        prev.map((item) => {
          if (
            (!item.transparentUrl || item.transparentUrl === item.originalUrl || item.status === 'idle') &&
            item.status !== 'processing' &&
            item.status !== 'queued' &&
            item.status !== 'error'
          ) {
            return {
              ...item,
              status: 'queued',
              progressStep: t('work.startAi', { defaultValue: 'Memulai AI...' }),
            };
          }
          return item;
        })
      );
    }
  }, [initialTab, batchItems.length, t]);

  // Apply Current Effect to Canvas
  const applyCurrentEffect = async () => {
    if (!currentItem) return;

    const transSrc =
      initialTab === 'rotate' && currentItem.rotateBaseUrl
        ? currentItem.rotateBaseUrl
        : currentItem.transparentUrl || currentItem.processedUrl || currentItem.originalUrl;
    if (!transSrc) return;

    setIsApplyingEffect(true);

    const origImg = new Image();
    const transImg = new Image();

    const loadImg = (img: HTMLImageElement, src: string) => {
      return new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
      });
    };

    try {
      await Promise.all([loadImg(origImg, currentItem.originalUrl), loadImg(transImg, transSrc)]);
    } catch (err) {
      console.error(err);
      setIsApplyingEffect(false);
      return;
    }

    let resultCanvas: HTMLCanvasElement | null = null;
    const refinedTransImg: HTMLImageElement | HTMLCanvasElement = transImg;

    if (
      initialTab === 'remove' ||
      initialTab === 'removelogo' ||
      initialTab === 'removeperson' ||
      initialTab === 'brush'
    ) {
      resultCanvas = document.createElement('canvas');
      resultCanvas.width = refinedTransImg.width;
      resultCanvas.height = refinedTransImg.height;
      const ctx = resultCanvas.getContext('2d')!;
      ctx.drawImage(refinedTransImg, 0, 0);
    } else if (initialTab === 'color' || initialTab === 'colorwhite') {
      let bgVal = selectedColor;
      let bgImgEl: HTMLImageElement | null = null;
      if (bgMode === 'gradient') {
        bgVal = selectedGradient;
      } else if (bgMode === 'image') {
        bgImgEl = customBgImageElement;
      } else if (bgMode === 'preset') {
        bgImgEl = presetBgImageElement;
      }
      resultCanvas = aiService.applyCustomBackground(refinedTransImg, bgMode, bgVal, bgImgEl, bgBlur);
    } else if (initialTab === 'watermark' || initialTab === 'watermarkbulk') {
      resultCanvas = aiService.applyWatermark(
        origImg,
        watermarkType,
        watermarkText,
        watermarkImage,
        watermarkColor,
        watermarkOpacity,
        watermarkPosition,
        watermarkScale,
        watermarkRotation
      );
    } else if (
      (initialTab === 'resize' || initialTab === 'resizeig' || initialTab === 'resizepassport') &&
      resizeWidth > 0 &&
      resizeHeight > 0
    ) {
      const currentSeq = ++effectSequenceRef.current;
      try {
        let sourceBlob = currentItem.file;
        if (currentItem.transparentUrl && currentItem.transparentUrl !== currentItem.originalUrl) {
          const res = await fetch(currentItem.transparentUrl);
          sourceBlob = await res.blob();
        }

        let blob: Blob;
        if (resizeMode === 'smart') {
          blob = await smartCropImage(sourceBlob, resizeWidth, resizeHeight, currentItem.file.type || 'image/jpeg');
        } else {
          blob = await processImage(sourceBlob, {
            mimeType: currentItem.file.type || 'image/jpeg',
            quality: 0.95,
            width: resizeWidth,
            height: resizeHeight,
            maintainAspectRatio: false,
          });
        }

        if (currentSeq === effectSequenceRef.current) {
          const url = URL.createObjectURL(blob);
          setBatchItems((prev) =>
            prev.map((i, idx) => {
              if (idx === selectedIndex) {
                return {
                  ...i,
                  processedUrl: url,
                  status: 'done',
                };
              }
              return i;
            })
          );
        }
      } catch (err) {
        console.error('Auto-resize failed', err);
      } finally {
        setIsApplyingEffect(false);
      }
      return;
    } else {
      setIsApplyingEffect(false);
      return;
    }

    if (resultCanvas) {
      const currentSeq = ++effectSequenceRef.current;
      resultCanvas.toBlob((blob) => {
        setIsApplyingEffect(false);
        if (blob && currentSeq === effectSequenceRef.current) {
          const url = URL.createObjectURL(blob);
          setBatchItems((prev) =>
            prev.map((i, idx) => {
              if (idx === selectedIndex) {
                return {
                  ...i,
                  processedUrl: url,
                  status: 'done',
                };
              }
              return i;
            })
          );
        }
      }, 'image/png');
    } else {
      setIsApplyingEffect(false);
    }
  };

  // Debounced Effect Application
  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const delay = initialTab === 'resize' || initialTab === 'resizeig' || initialTab === 'resizepassport' ? 500 : 50;
    debounceTimerRef.current = setTimeout(() => {
      applyCurrentEffect();
    }, delay);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [
    initialTab,
    bgMode,
    selectedColor,
    selectedGradient,
    customBgUrl,
    customBgImageElement,
    selectedPreset,
    presetBgImageElement,
    bgBlur,
    brushMode,
    watermarkType,
    watermarkText,
    watermarkImage,
    watermarkColor,
    watermarkOpacity,
    watermarkPosition,
    watermarkScale,
    watermarkRotation,
    selectedIndex,
    rotationDeg,
    flipH,
    flipV,
    batchItems.length,
    batchItems[selectedIndex]?.transparentUrl,
    batchItems[selectedIndex]?.status,
    compressQuality,
    convertFormat,
    resizeWidth,
    resizeHeight,
    resizeMaintainRatio,
  ]);

  // Brush and Color Picker Canvas Handlers
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
        setPickedColor(info);
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
          prev.map((i, idx) => (idx === selectedIndex ? { ...i, processedUrl: url, transparentUrl: url } : i))
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
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);

      if (brushMode === 'erase') {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fill();
      } else if (img) {
        ctx.clip();
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      ctx.restore();
    };

    if (brushMode === 'restore') {
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
          setDominantColors(colors);
        }
      };
    }
  }, [initialTab, currentItem?.processedUrl]);

  return {
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
    // Refs
    fileInputRef,
    canvasRef,
    // Handlers
    handleFiles,
    processSingleItem,
    handleUploadOther,
    handleResetCurrent,
    handleCanvasMouseDown,
    handleCanvasMouseMove,
    handleCanvasMouseUp,
  };
}
