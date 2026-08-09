// src/components/workspace/ToolWorkspace.tsx
// Ruang Kerja Utama: Drag-and-Drop Batch Upload, Canvas Viewport, Navigasi Tab Utilitas & Engine Selector

import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { useRouter } from '../../context/RouterContext';
import { useTranslation } from '../../context/LanguageContext';
import { aiService } from '../../services/aiService';
import { Upload, Download, Loader2, Sparkles, Archive, Trash2, Settings2, ChevronDown } from 'lucide-react';
import JSZip from 'jszip';
import { motion, AnimatePresence } from 'framer-motion';
import { trackEvent } from '../../utils/analytics';

import { lazyWithRetry } from '../../utils/lazyWithRetry';
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
import { InteractiveCropOverlay } from './tools/InteractiveCropOverlay';
import { ImageCompareSlider } from './tools/ImageCompareSlider';

import { BlurFaceControl } from './tools/BlurFaceControl';
import type { BlurBox } from './tools/BlurFaceControl';
import { BlurBoxOverlay } from './tools/BlurBoxOverlay';
import { DesignEditorControl } from './tools/DesignEditorControl';

import { processImage, cropImage, rotateImage, smartCropImage, applyWatermark } from '../../utils/imageOperations';
import { buildColorInfo, hexToColorInfo, extractDominantColors, type ColorInfo } from '../../utils/colorUtils';
export type { ColorInfo };
import type { WatermarkPosition } from './tools/WatermarkControl';
export type { WatermarkPosition };

export type TabType = 'remove' | 'color' | 'brush' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker' | 'blurface' | 'design';

export interface BatchItem {
  id: string;
  name: string;
  file: Blob;
  originalUrl: string;
  transparentUrl: string | null;
  processedUrl: string | null;
  compressBlob?: Blob;
  compressUrl?: string;
  compressSourceSize?: number;
  modelType: 'rmbg' | 'isnet';
  status: 'idle' | 'queued' | 'processing' | 'done' | 'error';
  progress: number;
  progressStep: string;
  errorMessage?: string;
  rotateBaseUrl?: string;
  rotateBaseFile?: Blob;
  initialFile?: Blob;
  initialOriginalUrl?: string;
  initialDimensions?: { width: number; height: number };
}

interface ToolWorkspaceProps {
  initialTab?: TabType;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ initialTab = 'remove' }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [prevInitialTab, setPrevInitialTab] = useState<TabType>(initialTab);

  if (initialTab !== prevInitialTab) {
    setPrevInitialTab(initialTab);
    setActiveTab(initialTab);
  }

  useEffect(() => {
    setActiveTab(initialTab);
    setPrevInitialTab(initialTab);
  }, [initialTab]);

  const { route } = useRouter();
  const { keywordSlug } = route;

  useEffect(() => {
    if (keywordSlug) {
      const lower = keywordSlug.toLowerCase();
      setSelectedColor(lower.includes('biru') ? '#00529C' : '#DB1514');
      
      // Auto-configure compression quality if pSEO keyword targets exact KB sizes
      if (lower.includes('50kb')) setCompressQuality(0.5);
      else if (lower.includes('100kb')) setCompressQuality(0.65);
      else if (lower.includes('200kb') || lower.includes('500kb')) setCompressQuality(0.75);

      // Auto-configure target convert format if pSEO keyword specifies format
      if (lower.includes('webp')) setConvertFormat('image/webp');
      else if (lower.includes('jpg') || lower.includes('jpeg')) setConvertFormat('image/jpeg');
      else if (lower.includes('png')) setConvertFormat('image/png');
    }
  }, [keywordSlug]);

  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [_isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [imageType, setImageType] = useState<'photo' | 'logo' | 'general'>('photo');
  const imageTypeRef = useRef<'photo' | 'logo' | 'general'>('photo');

  // Keep ref in sync with state
  useEffect(() => { imageTypeRef.current = imageType; }, [imageType]);

  // --- MEMORY GC / LEAK PREVENTION ---
  const prevBatchItemsRef = useRef<BatchItem[]>([]);
  useEffect(() => {
    const prevItems = prevBatchItemsRef.current;
    const currentUrls = new Set<string>();
    
    batchItems.forEach(item => {
      if (item.originalUrl) currentUrls.add(item.originalUrl);
      if (item.transparentUrl) currentUrls.add(item.transparentUrl);
      if (item.processedUrl) currentUrls.add(item.processedUrl);
      if (item.compressUrl) currentUrls.add(item.compressUrl);
    });

    prevItems.forEach(item => {
      if (item.originalUrl && !currentUrls.has(item.originalUrl)) URL.revokeObjectURL(item.originalUrl);
      if (item.transparentUrl && !currentUrls.has(item.transparentUrl)) URL.revokeObjectURL(item.transparentUrl);
      if (item.processedUrl && !currentUrls.has(item.processedUrl)) URL.revokeObjectURL(item.processedUrl);
      if (item.compressUrl && !currentUrls.has(item.compressUrl)) URL.revokeObjectURL(item.compressUrl);
    });

    prevBatchItemsRef.current = batchItems;
  }, [batchItems]);

  useEffect(() => {
    return () => {
      // Complete cleanup on unmount (e.g. changing tabs)
      const items = prevBatchItemsRef.current;
      items.forEach(item => {
        if (item.originalUrl) URL.revokeObjectURL(item.originalUrl);
        if (item.transparentUrl) URL.revokeObjectURL(item.transparentUrl);
        if (item.processedUrl) URL.revokeObjectURL(item.processedUrl);
        if (item.compressUrl) URL.revokeObjectURL(item.compressUrl);
      });
      // Also cleanup watermark image if it exists
      setWatermarkImage(prev => {
        if (prev && prev.src && prev.src.startsWith('blob:')) {
          URL.revokeObjectURL(prev.src);
        }
        return prev;
      });
    };
  }, []);
  // ------------------------------------

  // Parameter Alat
  const initialColor = keywordSlug && keywordSlug.toLowerCase().includes('biru') ? '#00529C' : '#DB1514';
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [brushMode, setBrushMode] = useState<'restore' | 'erase'>('restore');
  const [brushSize, setBrushSize] = useState(25);
  
  const [watermarkText, setWatermarkText] = useState('');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5);
  const [watermarkPosition, setWatermarkPosition] = useState<WatermarkPosition>('center');
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');
  const [watermarkImage, setWatermarkImage] = useState<HTMLImageElement | null>(null);
  const [watermarkScale, setWatermarkScale] = useState(1);
  const [watermarkRotation, setWatermarkRotation] = useState(0);

  const [customZipName, setCustomZipName] = useState('');
  const [isZipping, setIsZipping] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);

  // --- Handlers ---
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleZipDownload = async () => {
    if (isZipping) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const zipName = customZipName.trim() || `HelpMyIMG_Batch_${Date.now()}`;
      
      for (let i = 0; i < batchItems.length; i++) {
        const item = batchItems[i];
        const url = item.transparentUrl || item.processedUrl || item.originalUrl;
        if (!url) continue;
        
        const res = await fetch(url);
        const blob = await res.blob();
        
        // Ensure filename has an extension
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

  const [compressQuality, setCompressQuality] = useState(0.8);
  const [convertFormat, setConvertFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/bmp' | 'image/x-icon' | 'image/avif' | 'image/svg+xml'>('image/jpeg');
  const [resizeWidth, setResizeWidth] = useState(0);
  const [resizeHeight, setResizeHeight] = useState(0);
  const [resizeMaintainRatio, setResizeMaintainRatio] = useState(false);
  const [resizeMode, setResizeMode] = useState<'standard' | 'smart'>('standard');
  
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  // Crop State
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropWidth, setCropWidth] = useState(0);
  const [cropHeight, setCropHeight] = useState(0);
  const [cropRadius, setCropRadius] = useState(0);

  // Rotate State
  const [rotationDeg, setRotationDeg] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Picker State
  const [pickedColor, setPickedColor] = useState<ColorInfo | null>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  // --- Blur Face State ---
  const [blurBoxes, setBlurBoxes] = useState<BlurBox[]>([]);
  const [blurIntensity, setBlurIntensity] = useState(10);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const isDrawingRef = useRef(false);

  const currentItem = batchItems[selectedIndex] || null;

  useEffect(() => {
    if (currentItem && currentItem.originalUrl) {
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        if (!currentItem.initialDimensions) {
          setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
            ...item,
            initialDimensions: { width: img.width, height: img.height }
          } : item));
        }
        // Set initial values or reset if dimensions changed to prevent out of bounds
        setResizeWidth(img.width);
        setResizeHeight(img.height);
        
        // Reset crop box to full image size whenever a new image loads or is transformed
        setCropX(0);
        setCropY(0);
        setCropWidth(img.width);
        setCropHeight(img.height);
      };
      img.src = currentItem.originalUrl;
    }
  }, [currentItem?.originalUrl, currentItem?.id]);

  // Clear preview of current item ONLY when quality changes
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compressQuality]);

  // Duplicate Watermark Live Preview removed because applyCurrentEffect handles it in real-time.

  // Proses Batch Upload
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 10); // Batasi 10 foto batch
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
        status: ['remove', 'color', 'brush'].includes(activeTab) ? 'queued' : 'idle',
        progress: 0,
        progressStep: ['remove', 'color', 'brush'].includes(activeTab) ? t('work.startAi', { defaultValue: 'Memulai AI...' }) : t('work.waiting'),
      };
    });

    setBatchItems((prev) => {
      const merged = [...prev, ...newItems];
      
      // Bypass AI instantly for some tools, otherwise leave as idle or queued
      if (['watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design'].includes(activeTab)) {
        return merged.map(i => 
          newItems.some(n => n.id === i.id) 
            ? { ...i, status: 'done', transparentUrl: i.originalUrl, processedUrl: i.originalUrl, progress: 100, progressStep: 'Instan' }
            : i
        );
      }
      return merged;
    });

    if (batchItems.length === 0) setSelectedIndex(0);
  };

  // --- AI Queue System ---
  const isProcessingRef = useRef(false);

  const processSingleItem = useCallback(async (item: BatchItem) => {
    setBatchItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progressStep: t('work.startAi') } : i))
    );

    try {
      console.log('--- START PROCESSING:', item.id, 'imageType:', imageTypeRef.current);
      const resultBlob = await aiService.removeBackgroundAsync(item.file, 'rmbg', 80, (step, pct) => {
        console.log(`--- PROGRESS: ${step} (${pct}%)`);
        setBatchItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, progress: pct, progressStep: step } : i))
        );
      }, imageTypeRef.current);

      console.log('--- DONE PROCESSING. BLOB SIZE:', resultBlob.size);
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
  }, [t]);

  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingRef.current) return;

      const nextItem = batchItems.find(
        (i) =>
          i.status === 'queued' &&
          !['watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design'].includes(activeTab)
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
  }, [batchItems, activeTab, processSingleItem]);

  // Otomatis hapus background jika masuk ke tab color/remove/brush tapi item belum transparan
  useEffect(() => {
    if (['remove', 'color', 'brush'].includes(activeTab)) {
      setBatchItems((prev) =>
        prev.map((item) => {
          if ((!item.transparentUrl || item.transparentUrl === item.originalUrl || item.status === 'idle') && item.status !== 'processing' && item.status !== 'queued' && item.status !== 'error') {
            return {
              ...item,
              status: 'queued',
              progressStep: t('work.startAi', { defaultValue: 'Memulai AI...' })
            };
          }
          return item;
        })
      );
    }
  }, [activeTab, batchItems.length]);

  // Menerapkan perubahan efek pada gambar terpilih
  const applyCurrentEffect = async () => {
    if (!currentItem || !currentItem.transparentUrl) return;

    // Jika tab tidak menggunakan AI tapi item ini belum pernah diproses AI (karena di-bypass)
    // We intentionally removed auto-processing here so the user can manually trigger it.

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
      const transSrc = (activeTab === 'rotate' && currentItem.rotateBaseUrl)
        ? currentItem.rotateBaseUrl
        : (currentItem.transparentUrl || currentItem.originalUrl);
      await Promise.all([
        loadImg(origImg, currentItem.originalUrl),
        loadImg(transImg, transSrc),
      ]);
    } catch (err) {
      console.error(err);
      return;
    }

    let resultCanvas: HTMLCanvasElement | null = null;
    let refinedTransImg: HTMLImageElement | HTMLCanvasElement = transImg;

    if (activeTab === 'remove' || activeTab === 'brush') {
      resultCanvas = document.createElement('canvas');
      resultCanvas.width = refinedTransImg.width;
      resultCanvas.height = refinedTransImg.height;
      const ctx = resultCanvas.getContext('2d')!;
      ctx.drawImage(refinedTransImg, 0, 0);
    } else if (activeTab === 'color') {
      resultCanvas = aiService.applyColorBackground(refinedTransImg, selectedColor);
    } else if (activeTab === 'watermark') {
      // Watermark applied to the original image!
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
    } else if (activeTab === 'resize' && resizeWidth > 0 && resizeHeight > 0) {
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
            maintainAspectRatio: false
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
                  status: 'done'
                };
              }
              return i;
            })
          );
        }
      } catch (err) {
        console.error('Auto-resize failed', err);
      }
      return; // Early return for resize since blob is already handled
    } else {
      return;
    }

    if (resultCanvas) {
      const currentSeq = ++effectSequenceRef.current;
      resultCanvas.toBlob((blob) => {
        if (blob && currentSeq === effectSequenceRef.current) {
          const url = URL.createObjectURL(blob);
          setBatchItems((prev) =>
            prev.map((i, idx) => {
              if (idx === selectedIndex) {
                return {
                  ...i,
                  processedUrl: url,
                  status: 'done'
                };
              }
              return i;
            })
          );
        }
      }, 'image/png');
    }
  };

  const previousImageType = useRef(imageType);

  useEffect(() => {
    if (previousImageType.current !== imageType) {
      previousImageType.current = imageType;
    }
  }, [imageType]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const effectSequenceRef = useRef(0);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const delay = activeTab === 'resize' ? 500 : 50;
    debounceTimerRef.current = setTimeout(() => {
      applyCurrentEffect();
    }, delay);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [
    activeTab,
    selectedColor,
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
    resizeMaintainRatio
  ]);

  // Handle menggambar kuas pada canvas di mode Brush
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab === 'picker') {
      handleCanvasClick(e);
      return;
    }
    if (activeTab !== 'brush' || !canvasRef.current || !currentItem?.processedUrl) return;
    isDrawingRef.current = true;
    drawBrush(e);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTab !== 'picker' || !canvasRef.current || !currentItem) return;
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
          prev.map((i, idx) =>
            idx === selectedIndex ? { ...i, processedUrl: url, transparentUrl: url } : i
          )
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

  // Render Canvas untuk mode Brush / Picker
  useEffect(() => {
    if ((activeTab === 'brush' || activeTab === 'picker') && currentItem?.processedUrl && canvasRef.current) {
      const img = new Image();
      img.src = currentItem.processedUrl;
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        if (activeTab === 'picker') {
          // Extract dominant colors on load
          const colors = extractDominantColors(canvas, 8);
          setDominantColors(colors);
        }
      };
    }
  }, [activeTab, currentItem?.processedUrl]);

  const handleUploadOther = useCallback(() => {
    setBatchItems([]);
    setSelectedIndex(0);
    setTimeout(() => {
      fileInputRef.current?.click();
    }, 50);
  }, []);

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
          {/* Main Dropzone / Viewport Area */}
            {batchItems.length === 0 ? (
              /* Dropzone Kosong */
              <div
                aria-label={`${t('dropzone.title')} - remove background online, transparent background maker, free photo background editor`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full min-h-[320px] sm:min-h-[380px] md:min-h-0 md:aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 sm:p-10 text-center cursor-pointer relative overflow-hidden group ${
                  isDragging
                    ? 'border-neon-cyan bg-neon-cyan/10 shadow-glow-cyan scale-[0.99]'
                    : 'border-dark-500/80 bg-dark-800/40 hover:border-neon-cyan/60 hover:bg-dark-800/70'
                }`}
              >
                <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-neon-cyan/20 to-neon-indigo/20 border border-neon-cyan/40 flex items-center justify-center mb-3 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-7 h-7 md:w-10 md:h-10 text-neon-cyan animate-bounce" />
                </div>

                <h3 className="text-lg md:text-2xl font-heading font-extrabold text-white mb-2 px-2 tracking-tight">
                  {currentItem?.status === 'error' ? (
                    <>
                      <span className="font-bold text-red-600 block mb-1">⚠️ {t('work.failedAi')}</span>
                      <span className="text-xs md:text-sm text-gray-600 block">{batchItems[selectedIndex].errorMessage || t('work.errorHint')}</span>
                    </>
                  ) : t('dropzone.title', { defaultValue: 'Upload Photos Here' }).replace(/^[⚡✨🔄\s]+/u, '')}
                </h3>
                <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto mb-6 px-4 leading-relaxed font-body">
                  {t('dropzone.subtitle', { defaultValue: 'Drag and drop images (PNG, JPG, WEBP) or click to browse' })}
                </p>

                <div className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold shadow-glow-cyan transform group-hover:-translate-y-0.5 transition-all text-sm sm:text-base tracking-wide mb-6 md:mb-0 shadow-lg cursor-pointer">
                  <Sparkles className="w-4 h-4 fill-dark-900 shrink-0" />
                  <span>{t('dropzone.btn', { defaultValue: 'Select Photos' }).replace(/^[⚡✨🔄\s]+/u, '')}</span>
                </div>

                <div className="md:absolute md:bottom-4 left-0 right-0 text-center text-[10px] md:text-xs text-slate-400/80 font-medium px-4">
                  {t('dropzone.privacy')}
                </div>
              </div>
            ) : (
              /* Viewport Gambar Terpilih */
              <div className="space-y-4 lg:static">
                <div className={`w-full rounded-3xl border border-dark-500/80 bg-dark-900/90 shadow-glass overflow-hidden relative flex items-center justify-center checkerboard-bg transition-all duration-150 ${
                  activeTab === 'design' ? 'h-[75vh] md:h-auto md:aspect-[4/3]' : 'h-[420px] sm:h-[480px] md:h-[540px] lg:h-auto lg:aspect-[4/3]'
                }`}>
                  {currentItem?.status === 'processing' && (
                    <div className="absolute inset-0 bg-dark-900 md:bg-dark-900/80 md:backdrop-blur-md flex flex-col items-center justify-center z-20 space-y-4 p-6 text-center">
                      <div className="w-16 h-16 rounded-full border-4 border-neon-cyan/30 border-t-neon-cyan animate-spin" />
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-white text-lg">
                          {currentItem.progressStep === 'ai_processing' ? t('work.startAi') : currentItem.progressStep}
                        </h4>
                        <div className="w-64 h-2 bg-dark-700 rounded-full overflow-hidden mx-auto">
                          <div
                            className="h-full bg-gradient-to-r from-neon-cyan to-neon-indigo transition-all duration-300"
                            style={{ width: `${currentItem.progress}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-neon-cyan font-bold">
                          {currentItem.progress}%
                        </span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'brush' || activeTab === 'picker' ? (
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleCanvasMouseDown}
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                      className={`max-h-full max-w-full object-contain shadow-2xl rounded-lg ${
                        activeTab === 'picker' ? 'cursor-picker' : 'cursor-brush'
                      }`}
                    />
                  ) : (
                    (currentItem?.processedUrl || currentItem?.originalUrl) && (
                      <>
                        {activeTab === 'compress' && currentItem?.compressBlob && currentItem?.compressUrl ? (
                          <ImageCompareSlider
                            beforeImage={currentItem.transparentUrl || currentItem.originalUrl}
                            afterImage={currentItem.compressUrl}
                            originalSize={currentItem.compressSourceSize || currentItem.file?.size}
                            compressedSize={currentItem.compressBlob.size}
                          />
                        ) : (
                          <motion.img
                            key={currentItem.id}
                            ref={setImageElement as React.Ref<HTMLImageElement>}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{
                              opacity: 1,
                              scale: activeTab === 'rotate' && Math.abs(rotationDeg % 180) === 90 && originalDimensions.width > originalDimensions.height && originalDimensions.height > 0
                                ? Math.min(1, originalDimensions.height / originalDimensions.width)
                                : 1,
                              rotate: activeTab === 'rotate' ? rotationDeg : 0,
                              scaleX: activeTab === 'rotate' ? (flipH ? -1 : 1) : 1,
                              scaleY: activeTab === 'rotate' ? (flipV ? -1 : 1) : 1,
                            }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            src={activeTab === 'blurface' ? currentItem.originalUrl : (currentItem.processedUrl || currentItem.originalUrl)}
                            alt="Image"
                            className="max-h-full max-w-full shadow-2xl rounded-lg object-contain"
                          />
                        )}
                        {activeTab === 'crop' && (
                          <InteractiveCropOverlay
                            imageElement={imageElement}
                            originalWidth={originalDimensions.width}
                            originalHeight={originalDimensions.height}
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
                          />
                        )}
                        {activeTab === 'blurface' && (
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

                  {activeTab === 'design' && currentItem?.originalUrl && (
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

                  {/* Removed absolute top-4 left-4 input */}
                </div>

                {/* Strip Thumbnail Batch */}
                {batchItems.length > 0 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 p-2 bg-dark-800/50 rounded-2xl border border-dark-600/50">
                    {batchItems.map((item, idx) => (
                      <div key={item.id} className="relative shrink-0 group">
                        <button
                          onClick={() => setSelectedIndex(idx)}
                          className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all block ${
                            selectedIndex === idx
                              ? 'border-neon-cyan scale-105 shadow-glow-cyan'
                              : 'border-dark-600 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={item.processedUrl || item.originalUrl}
                            alt="Thumb"
                            className="w-full h-full object-cover checkerboard-bg"
                          />
                          {item.status === 'processing' && (
                            <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-neon-cyan animate-spin" />
                            </div>
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setBatchItems(prev => prev.filter((_, i) => i !== idx));
                            if (selectedIndex >= idx && selectedIndex > 0) {
                              setSelectedIndex(selectedIndex - 1);
                            }
                          }}
                          className="absolute -top-2 -right-2 bg-dark-900 border border-dark-600 text-slate-400 hover:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-16 h-16 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dashed border-dark-500 flex flex-col items-center justify-center text-slate-400 hover:text-white shrink-0 text-[10px] gap-1 font-semibold"
                      >
                        <Upload className="w-4 h-4 text-neon-cyan" />
                        <span>{t('work.addMore')}</span>
                      </button>
                    </div>
                  )}
              </div>
            )}
          </div>

          {/* Sidebar Kontrol Alat (4 Kolom di Desktop) */}
          <div className="lg:col-span-5 xl:col-span-4 glass-panel p-6 flex flex-col space-y-6 max-h-[85vh]">

                <div className="flex flex-col gap-4 border-b border-dark-600/60 pb-4 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-white text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-neon-cyan" />
                  <span>{t('editor.settings')}</span>
                </h3>
                <span className="text-xs px-2.5 py-1 rounded-lg bg-neon-cyan/15 text-neon-cyan font-mono font-bold border border-neon-cyan/30">
                  {activeTab === 'remove' && t('work.badge.remove')}
                  {activeTab === 'color' && t('work.badge.color')}
                  {activeTab === 'brush' && t('work.badge.brush')}
                  {activeTab === 'watermark' && t('work.badge.watermark')}
                  {activeTab === 'compress' && t('work.badge.compress')}
                  {activeTab === 'convert' && t('work.badge.convert')}
                  {activeTab === 'resize' && t('work.badge.resize')}
                  {activeTab === 'crop' && t('work.badge.crop')}
                  {activeTab === 'rotate' && t('work.badge.rotate')}
                  {activeTab === 'picker' && t('work.badge.picker')}
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
              <Suspense fallback={
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
                </div>
              }>
                {activeTab === 'remove' && (
                  <RemoveBgControl
                    currentTransparentUrl={currentItem?.processedUrl || null}
                    currentFileName={currentItem?.name}
                    batchUrls={batchItems
                      .filter((i) => i.status === 'done' && i.transparentUrl)
                      .map((i) => ({ name: i.name, url: i.transparentUrl! }))}
                    onReset={() => {
                      if (currentItem?.originalUrl) {
                        setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
                          ...item,
                          transparentUrl: null,
                          processedUrl: item.originalUrl,
                          status: 'done'
                        } : item));
                      }
                    }}
                    isProcessing={currentItem?.status === 'processing' || currentItem?.status === 'queued' || batchItems.some(i => i.status === 'processing' || i.status === 'queued')}
                    status={currentItem?.status || 'idle'}
                    onProcessNow={() => currentItem && setBatchItems(prev => prev.map(i => i.id === currentItem.id ? { ...i, status: 'queued', progressStep: t('work.queued', { defaultValue: 'Queued' }) } : i))}
                    onProcessBatch={() => {
                      setBatchItems(prev => prev.map(i => i.status === 'idle' ? { ...i, status: 'queued', progressStep: t('work.queued', { defaultValue: 'Queued' }) } : i));
                    }}
                    batchCount={batchItems.length}
                    imageType={imageType}
                    setImageType={setImageType}
                    hasProcessedAi={currentItem?.transparentUrl !== currentItem?.originalUrl}
                    onUploadOther={handleUploadOther}
                  />
                )}

                {activeTab === 'color' && (
                  <ColorBgControl
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}

                    onReset={() => {
                      setSelectedColor('#ffffff');
                      if (currentItem) {
                        setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
                          ...item,
                          processedUrl: item.transparentUrl || item.originalUrl,
                          status: 'done'
                        } : item));
                      }
                    }}
                    onUploadOther={handleUploadOther}
                    isProcessing={currentItem?.status === 'processing'}
                    batchCount={batchItems.length}
                  />
                )}

                {activeTab === 'brush' && (
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

                {activeTab === 'watermark' && (
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
                      setBatchItems(prev => prev.map(item => ({ ...item, status: 'processing' })));
                      await new Promise(r => setTimeout(r, 50));
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
                            rotation: watermarkRotation
                          });
                          const url = URL.createObjectURL(blob);
                          newItems[i] = { ...item, processedUrl: url, status: 'done' };
                        } catch (err) {
                          newItems[i] = { ...item, status: 'error', errorMessage: 'Watermark failed' };
                        }
                        setBatchItems([...newItems]);
                        await new Promise(r => setTimeout(r, 60));
                      }
                    }}
                    onReset={() => {
                      setWatermarkText('');
                      setWatermarkImage(null);
                      if (currentItem) {
                        setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
                          ...item,
                          processedUrl: item.transparentUrl || item.originalUrl,
                          status: 'done'
                        } : item));
                      }
                    }}
                    onUploadOther={handleUploadOther}
                    isProcessing={currentItem?.status === 'processing'}
                  />
                )}

                {activeTab === 'compress' && (
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
                            const blob = await processImage(sourceBlob, { mimeType: 'image/jpeg', quality: compressQuality });
                            const finalBlob = blob.size > sourceBlob.size ? sourceBlob : blob;
                            const url = URL.createObjectURL(finalBlob);
                            setBatchItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, compressSourceSize: sourceBlob.size, compressBlob: finalBlob, compressUrl: url, processedUrl: url } : item));
                          }
                        } catch (err) {
                          console.error('Compress preview failed', err);
                        }
                      }
                    }}
                    batchCount={batchItems.length}
                    onProcessBatch={async () => {
                      setBatchItems(prev => prev.map(item => ({ ...item, status: 'processing' })));
                      await new Promise(r => setTimeout(r, 50));
                      
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
                            const blob = await processImage(sourceBlob, { mimeType: 'image/jpeg', quality: compressQuality });
                            const finalBlob = blob.size > sourceBlob.size ? sourceBlob : blob;
                            const url = URL.createObjectURL(finalBlob);
                            newItems[i] = { ...item, compressSourceSize: sourceBlob.size, compressBlob: finalBlob, compressUrl: url, processedUrl: url, status: 'done' };
                          }
                        } catch (err) {
                          newItems[i] = { ...item, status: 'error', errorMessage: 'Compress failed' };
                        }
                        setBatchItems([...newItems]);
                        await new Promise(r => setTimeout(r, 60));
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
                        setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
                          ...item,
                          compressBlob: undefined,
                          compressUrl: undefined,
                          processedUrl: item.transparentUrl || item.originalUrl,
                          status: 'done'
                        } : item));
                      }
                    }}
                    onUploadOther={handleUploadOther}
                    isProcessing={currentItem?.status === 'processing'}
                  />
                )}

                {activeTab === 'convert' && (
                  <ConvertControl
                    format={convertFormat}
                    setFormat={setConvertFormat}
                    onConvert={async () => {
                      if (currentItem?.file) {
                        try {
                          const blob = await processImage(currentItem.file, { mimeType: convertFormat, quality: 0.95 });
                          const url = URL.createObjectURL(blob);
                          const extMap: Record<string, string> = { 'image/x-icon': 'ico', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/bmp': 'bmp', 'image/avif': 'avif', 'image/svg+xml': 'svg' };
                          const ext = extMap[convertFormat] || convertFormat.split('/')[1];
                          let baseName = currentItem.name || `HelpMyIMG_${Date.now()}`;
                          if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
                          const newName = `${baseName}.${ext}`;
                          const newFile = new File([blob], newName, { type: blob.type || convertFormat });
                          setBatchItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, file: newFile, name: newName, processedUrl: url, status: 'done' } : item));
                        } catch (err: any) {
                          console.error('Convert failed', err);
                          setBatchItems(prev => prev.map(item => item.id === currentItem.id ? { ...item, status: 'error', errorMessage: err.message || 'Convert failed' } : item));
                        }
                      }
                    }}
                    onUploadOther={handleUploadOther}
                    batchCount={batchItems.length}
                    onProcessBatch={async () => {
                      setBatchItems(prev => prev.map(item => ({ ...item, status: 'processing' })));
                      await new Promise(r => setTimeout(r, 50));
                      const newItems = [...batchItems];
                      for (let i = 0; i < newItems.length; i++) {
                        const item = newItems[i];
                        try {
                          const blob = await processImage(item.file, { mimeType: convertFormat, quality: 0.95 });
                          const url = URL.createObjectURL(blob);
                          const extMap: Record<string, string> = { 'image/x-icon': 'ico', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/bmp': 'bmp', 'image/avif': 'avif', 'image/svg+xml': 'svg' };
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
                        await new Promise(r => setTimeout(r, 60));
                      }
                    }}
                    onReset={() => {
                      setConvertFormat('image/jpeg');
                    }}
                    isProcessing={currentItem?.status === 'processing'}
                  />
                )}

                {activeTab === 'resize' && (
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
                          if (currentItem.transparentUrl && currentItem.transparentUrl !== currentItem.originalUrl) {
                            const res = await fetch(currentItem.transparentUrl);
                            sourceBlob = await res.blob();
                          } else if (currentItem.processedUrl && currentItem.processedUrl !== currentItem.originalUrl) {
                            const res = await fetch(currentItem.processedUrl);
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
                              maintainAspectRatio: false
                            });
                          }
                          const url = URL.createObjectURL(blob);
                          const newFile = new File([blob], currentItem.name, { type: blob.type || 'image/png' });
                          setBatchItems(prev => prev.map(item => item.id === currentItem.id ? { 
                            ...item, 
                            file: newFile,
                            originalUrl: url,
                            transparentUrl: item.transparentUrl ? url : null,
                            processedUrl: url, 
                            status: 'done' 
                          } : item));
                          setOriginalDimensions({ width: Math.round(resizeWidth), height: Math.round(resizeHeight) });
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
                        setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
                          ...item,
                          file: targetFile,
                          originalUrl: targetUrl,
                          transparentUrl: item.transparentUrl ? targetUrl : null,
                          processedUrl: targetUrl,
                          status: 'done'
                        } : item));
                      }
                    }}
                    onUploadOther={handleUploadOther}
                    batchCount={batchItems.length}
                    isProcessing={currentItem?.status === 'processing'}
                  />
                )}

                {activeTab === 'crop' && (
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
                          if (currentItem.transparentUrl && currentItem.transparentUrl !== currentItem.originalUrl) {
                            const res = await fetch(currentItem.transparentUrl);
                            sourceBlob = await res.blob();
                          } else if (currentItem.processedUrl && currentItem.processedUrl !== currentItem.originalUrl) {
                            const res = await fetch(currentItem.processedUrl);
                            sourceBlob = await res.blob();
                          }
                          const blob = await cropImage(sourceBlob, cropX, cropY, cropWidth, cropHeight, sourceBlob.type, 0.95, cropRadius);
                          const url = URL.createObjectURL(blob);
                          const newFile = new File([blob], currentItem.name, { type: blob.type || 'image/png' });
                          setBatchItems(prev => prev.map(item => item.id === currentItem.id ? { 
                            ...item, 
                            file: newFile,
                            originalUrl: url,
                            transparentUrl: item.transparentUrl ? url : null,
                            processedUrl: url, 
                            status: 'done' 
                          } : item));
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

                {activeTab === 'rotate' && (
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
                          if (currentItem.transparentUrl && currentItem.transparentUrl !== currentItem.originalUrl) {
                            const res = await fetch(currentItem.transparentUrl);
                            sourceBlob = await res.blob();
                          } else if (currentItem.processedUrl && currentItem.processedUrl !== currentItem.originalUrl) {
                            const res = await fetch(currentItem.processedUrl);
                            sourceBlob = await res.blob();
                          }
                          const blob = await rotateImage(sourceBlob, rotationDeg, flipH, flipV);
                          const url = URL.createObjectURL(blob);
                          const newFile = new File([blob], currentItem.name, { type: blob.type || 'image/png' });
                          setBatchItems(prev => prev.map(item => item.id === currentItem.id ? { 
                            ...item, 
                            file: newFile,
                            originalUrl: url,
                            transparentUrl: item.transparentUrl ? url : null,
                            processedUrl: url, 
                            status: 'done' 
                          } : item));
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
                        setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
                          ...item,
                          file: item.rotateBaseFile || item.file,
                          originalUrl: item.rotateBaseUrl || item.originalUrl,
                          transparentUrl: item.transparentUrl ? (item.rotateBaseUrl || item.transparentUrl) : null,
                          processedUrl: item.rotateBaseUrl || item.processedUrl,
                          status: 'done'
                        } : item));
                      }
                    }}
                    onUploadOther={handleUploadOther}
                    batchCount={batchItems.length}
                    isProcessing={currentItem?.status === 'processing'}
                  />
                )}

                {activeTab === 'picker' && (
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

                {activeTab === 'blurface' && (
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
                          
                          // Apply blur to each box area
                          blurBoxes.forEach(box => {
                             ctx.save();
                             ctx.filter = `blur(${blurIntensity}px)`;
                             ctx.drawImage(imageElement, box.x, box.y, box.width, box.height, box.x, box.y, box.width, box.height);
                             ctx.restore();
                          });

                          canvas.toBlob((blob) => {
                            if (!blob) return;
                            const url = URL.createObjectURL(blob);
                            const newFile = new File([blob], currentItem.name, { type: blob.type || 'image/jpeg' });
                            setBatchItems(prev => prev.map(item => item.id === currentItem.id ? { 
                              ...item, 
                              file: newFile,
                              originalUrl: url,
                              transparentUrl: item.transparentUrl ? url : null,
                              processedUrl: url, 
                              status: 'done' 
                            } : item));
                            setBlurBoxes([]);
                          }, currentItem.file.type || 'image/jpeg', 0.95);
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
                        setBatchItems(prev => prev.map(item => item.id === currentItem.id ? {
                          ...item,
                          file: targetFile,
                          originalUrl: targetUrl,
                          transparentUrl: item.transparentUrl ? targetUrl : null,
                          processedUrl: targetUrl,
                          status: 'done'
                        } : item));
                      }
                    }}
                    onUploadOther={handleUploadOther}
                    batchCount={batchItems.length}
                    isProcessing={false}
                  />
                )}

                {activeTab === 'design' && (
                  <div className="flex flex-col bg-dark-900 rounded-2xl border border-dark-600 overflow-hidden shrink-0">
                    <div className="p-4 border-b border-dark-600 bg-dark-800">
                      <h3 className="text-base font-heading font-bold text-white mb-0.5">{t('design.settings')}</h3>
                      <p className="text-[10px] text-slate-400 font-medium">{t('design.desc')}</p>
                    </div>
                    <div className="p-4 flex flex-col gap-4">
                      <div className="bg-dark-800/50 p-4 rounded-xl border border-dark-600/30 flex flex-col gap-3 text-center">
                        <p className="text-xs text-slate-300">
                          {t('design.info1')}
                        </p>
                        <button 
                          onClick={() => {
                            // Try to find and click Filerobot's internal save button
                            const saveBtn = document.querySelector('[data-element="SaveButton"], [class*="FIE_topbar-save-btn"], [class*="save-btn"]') as HTMLElement;
                            if (saveBtn) {
                              saveBtn.click();
                            } else {
                              // Fallback: try to find button containing "Save" text
                              const allBtns = Array.from(document.querySelectorAll('button'));
                              const saveTxtBtn = allBtns.find(b => b.textContent?.toLowerCase().includes('save'));
                              if (saveTxtBtn) saveTxtBtn.click();
                            }
                          }}
                          className="w-full py-3 bg-gradient-to-r from-neon-indigo to-neon-cyan text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:shadow-glow-cyan transition-all tracking-wide"
                        >
                          <Download className="w-4 h-4" />
                          {t('design.saveBtn')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Suspense>
              
              {/* Sidebar Batch Download UI & Rename */}
              {batchItems.length > 0 && activeTab !== 'picker' && (
                <div className="mt-6 pt-6 border-t border-dark-600/60 shrink-0 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('work.exportSettingsTitle', { defaultValue: 'Export & Download Options' })}</div>
                    <button 
                      onClick={() => setShowExportOptions(!showExportOptions)}
                      className="text-xs flex items-center gap-1 text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      {t('work.settings', { defaultValue: 'Export Settings' })}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
                    </button>
                  </div>

                  {showExportOptions && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="flex flex-col gap-5 overflow-hidden"
                    >
                      {/* Batch Rename UI */}
                      {batchItems.length > 1 ? (
                        <div className="flex flex-col gap-2.5">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('work.batchRename', { defaultValue: 'Rename Files' })}</div>
                          <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                            {batchItems.map((item, idx) => {
                              const nameParts = item.name.split('.');
                              const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
                              const base = nameParts.length > 0 ? nameParts.join('.') : item.name;
                              return (
                                <div key={item.id} className="flex items-center gap-2 bg-dark-800/50 p-1.5 rounded-lg border border-dark-600/50 focus-within:border-neon-cyan/50 transition-colors group">
                                  <div className="w-8 h-8 rounded shrink-0 overflow-hidden bg-dark-900 border border-dark-600 flex items-center justify-center">
                                    <img src={item.originalUrl} className="max-w-full max-h-full object-cover" />
                                  </div>
                                  <input
                                    type="text"
                                    value={base}
                                    onChange={(e) => {
                                      const newBase = e.target.value;
                                      setBatchItems(prev => prev.map((img, i) => i === idx ? { ...img, name: `${newBase}${ext}` } : img));
                                    }}
                                    className="flex-1 bg-transparent text-xs text-white outline-none w-full min-w-0"
                                    placeholder="Name"
                                  />
                                  <span className="text-[10px] text-slate-500 font-mono pr-1 shrink-0">{ext}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2.5">
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('work.renameFile', { defaultValue: 'Rename File' })}</div>
                          {(() => {
                               const nameParts = batchItems[0].name.split('.');
                               const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
                               const base = nameParts.length > 0 ? nameParts.join('.') : batchItems[0].name;
                               return (
                                 <div className="flex items-center gap-2 bg-dark-800/50 p-2 rounded-lg border border-dark-600/50 focus-within:border-neon-cyan/50 transition-colors">
                                   <input
                                     type="text"
                                     value={base}
                                     onChange={(e) => {
                                       const newBase = e.target.value;
                                       setBatchItems(prev => prev.map((img, i) => i === 0 ? { ...img, name: `${newBase}${ext}` } : img));
                                     }}
                                     className="flex-1 bg-transparent text-xs text-white outline-none px-1 w-full min-w-0"
                                     placeholder="File name"
                                   />
                                   {ext && (
                                     <span className="text-xs font-mono text-neon-cyan font-bold pr-2 shrink-0">
                                       {ext}
                                     </span>
                                   )}
                                 </div>
                               );
                             })()}
                        </div>
                      )}

                      {/* ZIP Download Custom Name */}
                      {batchItems.length > 1 && (
                        <div>
                          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{t('work.zipName', { defaultValue: 'ZIP Filename' })}</div>
                          <input
                            type="text"
                            value={customZipName}
                            onChange={(e) => setCustomZipName(e.target.value)}
                            placeholder={t('work.zipNamePlaceholder', { defaultValue: 'Custom ZIP Name (Optional)' })}
                            className="w-full bg-dark-800/50 border border-dark-600/50 focus:border-neon-cyan text-white px-3 py-2.5 rounded-lg text-xs outline-none transition-all"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Main Download Buttons */}
                  <div className="flex gap-2">
                    {batchItems.length > 1 ? (
                      <button
                        onClick={() => {
                          if (batchItems.some(i => !i.name.trim() || i.name.startsWith('.'))) {
                            showToast(t('work.emptyFileNameAlert', { defaultValue: 'Nama file tidak boleh kosong! / File name cannot be empty!' }));
                            return;
                          }
                          trackEvent('file_downloaded', { count: batchItems.length, type: 'zip', tool: activeTab });
                          handleZipDownload();
                        }}
                        disabled={isZipping || batchItems.some(i => i.status !== 'done')}
                        className="flex-1 px-4 py-3.5 bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:opacity-95"
                      >
                        {isZipping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
                        <span>{t('work.downloadZip', { defaultValue: 'Download All (ZIP)' })}</span>
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const item = batchItems[0];
                          if (!item.name.trim() || item.name.startsWith('.')) {
                            showToast(t('work.emptyFileNameAlert', { defaultValue: 'Nama file tidak boleh kosong! / File name cannot be empty!' }));
                            return;
                          }
                          if (!item) return;
                          trackEvent('file_downloaded', { count: 1, type: 'single', tool: activeTab });

                          // For single resize, the auto-save (debounce) has already updated processedUrl.
                          // We just download it directly like any other effect.
                          
                          if (item && item.processedUrl) {
                            const a = document.createElement('a');
                            a.href = item.processedUrl;
                            a.download = item.name;
                            a.click();
                          }
                        }}
                        disabled={batchItems[0]?.status !== 'done'}
                        className="flex-1 px-4 py-3.5 bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:opacity-95"
                      >
                        <Download className="w-5 h-5" />
                        <span>{t('editor.download', { defaultValue: 'Download Image' })}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
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
            <span className="text-sm font-bold text-white tracking-wide">
              {toastMessage}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
