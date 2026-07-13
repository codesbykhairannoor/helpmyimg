// src/components/workspace/ToolWorkspace.tsx
// Ruang Kerja Utama: Drag-and-Drop Batch Upload, Canvas Viewport, Navigasi Tab Utilitas & Engine Selector

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../../context/LanguageContext';
import { aiService } from '../../services/aiService';
import { Upload, Scissors, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const RemoveBgControl = React.lazy(() => import('./tools/RemoveBgControl').then(m => ({ default: m.RemoveBgControl })));
const ColorBgControl = React.lazy(() => import('./tools/ColorBgControl').then(m => ({ default: m.ColorBgControl })));
const BrushControl = React.lazy(() => import('./tools/BrushControl').then(m => ({ default: m.BrushControl })));
const WatermarkControl = React.lazy(() => import('./tools/WatermarkControl').then(m => ({ default: m.WatermarkControl })));
const CompressControl = React.lazy(() => import('./tools/CompressControl').then(m => ({ default: m.CompressControl })));
const ConvertControl = React.lazy(() => import('./tools/ConvertControl').then(m => ({ default: m.ConvertControl })));
const ResizeControl = React.lazy(() => import('./tools/ResizeControl').then(m => ({ default: m.ResizeControl })));
const CropControl = React.lazy(() => import('./tools/CropControl').then(m => ({ default: m.CropControl })));
const RotateControl = React.lazy(() => import('./tools/RotateControl').then(m => ({ default: m.RotateControl })));
const ColorPickerControl = React.lazy(() => import('./tools/ColorPickerControl').then(m => ({ default: m.ColorPickerControl })));
import { InteractiveCropOverlay } from './tools/InteractiveCropOverlay';
import { ImageCompareSlider } from './tools/ImageCompareSlider';

import { processImage, cropImage, rotateImage, smartCropImage } from '../../utils/imageOperations';
import { buildColorInfo, extractDominantColors, type ColorInfo } from '../../utils/colorUtils';
export type { ColorInfo };
import type { WatermarkPosition } from './tools/WatermarkControl';
export type { WatermarkPosition };

export type TabType = 'remove' | 'color' | 'brush' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker';

export interface BatchItem {
  id: string;
  name: string;
  file: Blob;
  originalUrl: string;
  transparentUrl: string | null;
  processedUrl: string | null;
  modelType: 'rmbg' | 'isnet';
  status: 'idle' | 'processing' | 'done' | 'error';
  progress: number;
  progressStep: string;
  errorMessage?: string;
}

interface ToolWorkspaceProps {
  initialTab?: TabType;
}

export const ToolWorkspace: React.FC<ToolWorkspaceProps> = ({ initialTab = 'remove' }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const { keywordSlug } = useParams<{ keywordSlug?: string }>();

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (keywordSlug) {
      setSelectedColor(keywordSlug.toLowerCase().includes('biru') ? '#00529C' : '#DB1514');
    }
  }, [keywordSlug]);

  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingQueue, setIsProcessingQueue] = useState(false);
  const [imageType, setImageType] = useState<'photo' | 'logo' | 'general'>('photo');

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

  // New Tool States
  const [compressQuality, setCompressQuality] = useState(0.8);
  const [compressBlob, setCompressBlob] = useState<Blob | null>(null);
  const [compressUrl, setCompressUrl] = useState<string | null>(null);
  const [compressSourceSize, setCompressSourceSize] = useState<number | null>(null);
  const [convertFormat, setConvertFormat] = useState<'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/bmp' | 'image/x-icon' | 'image/avif'>('image/jpeg');
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

  // Rotate State
  const [rotationDeg, setRotationDeg] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  // Picker State
  const [pickedColor, setPickedColor] = useState<ColorInfo | null>(null);
  const [colorHistory, setColorHistory] = useState<ColorInfo[]>([]);
  const [dominantColors, setDominantColors] = useState<string[]>([]);

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
        // Set initial values if not set
        if (resizeWidth === 0 && resizeHeight === 0) {
          setResizeWidth(img.width);
          setResizeHeight(img.height);
        }
        if (cropWidth === 0 && cropHeight === 0) {
          setCropWidth(img.width);
          setCropHeight(img.height);
        }
      };
      img.src = currentItem.originalUrl;
    }
  }, [currentItem?.originalUrl]);

  // Proses Batch Upload
  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, 10); // Batasi 10 foto batch
    if (fileArray.length === 0) return;

    const newItems: BatchItem[] = fileArray.map((f) => ({
      id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: f.name,
      file: f,
      originalUrl: URL.createObjectURL(f),
      transparentUrl: null,
      processedUrl: null,
      modelType: 'rmbg',
      status: 'idle',
      progress: 0,
      progressStep: t('work.waiting'),
    }));

    setBatchItems((prev) => {
      const merged = [...prev, ...newItems];
      
      // Bypass AI instantly for some tools, otherwise let the Queue handle it
      if (['watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker'].includes(activeTab)) {
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
  useEffect(() => {
    const processQueue = async () => {
      if (isProcessingQueue) return;

      const nextItem = batchItems.find((i) => i.status === 'idle' && !['watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker'].includes(activeTab));
      if (nextItem) {
        setIsProcessingQueue(true);
        await processSingleItem(nextItem);
        setIsProcessingQueue(false);
      }
    };
    
    processQueue();
  }, [batchItems, isProcessingQueue, activeTab]);

  const processSingleItem = async (item: BatchItem) => {
    setBatchItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, status: 'processing', progressStep: t('work.startAi') } : i))
    );

    try {
      console.log('--- START PROCESSING:', item.id);
      const resultBlob = await aiService.removeBackgroundAsync(item.file, 'rmbg', 80, (step, pct) => {
        console.log(`--- PROGRESS: ${step} (${pct}%)`);
        setBatchItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, progress: pct, progressStep: step } : i))
        );
      }, imageType);

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
  };

  // Menerapkan perubahan efek pada gambar terpilih
  const applyCurrentEffect = async () => {
    if (!currentItem || !currentItem.transparentUrl) return;

    // Jika tab tidak menggunakan AI tapi item ini belum pernah diproses AI (karena di-bypass)
    if (!['watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker'].includes(activeTab) && currentItem.transparentUrl === currentItem.originalUrl && currentItem.status !== 'processing') {
      processSingleItem(currentItem);
      return;
    }

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
      await Promise.all([
        loadImg(origImg, currentItem.originalUrl),
        loadImg(transImg, currentItem.transparentUrl),
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
    } else if (activeTab === 'crop') {
      // Do not auto-crop the preview! Just show the full image so the InteractiveCropOverlay works correctly.
      setBatchItems((prev) =>
        prev.map((i, idx) => (idx === selectedIndex ? { ...i, processedUrl: i.transparentUrl || i.originalUrl } : i))
      );
      return;
    } else if (activeTab === 'rotate') {
      resultCanvas = document.createElement('canvas');
      const radians = (rotationDeg * Math.PI) / 180;
      const is90 = Math.abs(rotationDeg) === 90 || Math.abs(rotationDeg) === 270;
      resultCanvas.width = is90 ? refinedTransImg.height : refinedTransImg.width;
      resultCanvas.height = is90 ? refinedTransImg.width : refinedTransImg.height;
      const ctx = resultCanvas.getContext('2d')!;
      ctx.translate(resultCanvas.width / 2, resultCanvas.height / 2);
      ctx.rotate(radians);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(refinedTransImg, -refinedTransImg.width / 2, -refinedTransImg.height / 2);
    }

    if (resultCanvas) {
      resultCanvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setBatchItems((prev) =>
            prev.map((i, idx) => (idx === selectedIndex ? { ...i, processedUrl: url } : i))
          );
        }
      }, 'image/png');
    }
  };

  const previousImageType = useRef(imageType);

  useEffect(() => {
    if (previousImageType.current !== imageType) {
      previousImageType.current = imageType;
      const currentItem = batchItems[selectedIndex];
      if (currentItem && currentItem.status === 'done') {
        processSingleItem(currentItem);
      }
    }
  }, [imageType, selectedIndex, batchItems]);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => {
      applyCurrentEffect();
    }, 50);

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
        setColorHistory(prev => {
          // Avoid duplicate adjacent colors in history
          if (prev.length > 0 && prev[0].hex === info.hex) return prev;
          return [info, ...prev.slice(0, 19)];
        });
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

  return (
    <section id="workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Grid Workspace: Viewport Kiri & Panel Kontrol Kanan */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Viewport & Dropzone (8 Kolom di Desktop) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Viewport Canvas */}
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
                className={`w-full aspect-video md:aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-8 text-center cursor-pointer relative overflow-hidden group ${
                  isDragging
                    ? 'border-neon-cyan bg-neon-cyan/10 shadow-glow-cyan scale-[0.99]'
                    : 'border-dark-500/80 bg-dark-800/40 hover:border-neon-cyan/60 hover:bg-dark-800/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={(e) => e.target.files && handleFiles(e.target.files)}
                  className="hidden"
                />

                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-neon-cyan/20 to-neon-indigo/20 border border-neon-cyan/40 flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-10 h-10 text-neon-cyan animate-bounce" />
                </div>

                <h3 className="text-xl md:text-2xl font-heading font-extrabold text-white mb-2">
                  {currentItem?.status === 'error' ? (
                    <>
                      <h3 className="font-bold text-red-600 mb-2">⚠️ {t('work.failedAi')}</h3>
                      <p className="text-sm text-gray-600 mb-4">{batchItems[selectedIndex].errorMessage || t('work.errorHint')}</p>
                    </>
                  ) : t('dropzone.title')}
                </h3>
                <p className="text-sm text-slate-400 max-w-md mb-6">
                  {t('dropzone.subtitle')}
                </p>

                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-indigo text-dark-900 font-extrabold shadow-glow-cyan transform group-hover:-translate-y-0.5 transition-all">
                  <Sparkles className="w-4 h-4 fill-dark-900" />
                  <span>{t('dropzone.btn')}</span>
                </div>

                <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400 font-medium">
                  {t('dropzone.privacy')}
                </div>
              </div>
            ) : (
              /* Viewport Gambar Terpilih */
              <div className="space-y-4">
                <div className="w-full aspect-video md:aspect-[4/3] rounded-3xl border border-dark-500/80 bg-dark-900/90 shadow-glass overflow-hidden relative flex items-center justify-center checkerboard-bg">
                  {currentItem?.status === 'processing' && (
                    <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-md flex flex-col items-center justify-center z-20 space-y-4 p-6 text-center">
                      <div className="w-16 h-16 rounded-full border-4 border-neon-cyan/30 border-t-neon-cyan animate-spin" />
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-white text-lg">
                          {currentItem.progressStep}
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
                        activeTab === 'picker' ? 'cursor-crosshair' : 'cursor-crosshair'
                      }`}
                    />
                  ) : (
                    (currentItem?.processedUrl || currentItem?.originalUrl) && (
                      <>
                        {activeTab === 'compress' && compressBlob && compressUrl ? (
                          <ImageCompareSlider
                            beforeImage={currentItem.processedUrl || currentItem.originalUrl}
                            afterImage={compressUrl}
                          />
                        ) : (
                          <motion.img
                            key={currentItem.id}
                            ref={setImageElement as React.Ref<HTMLImageElement>}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            src={currentItem.processedUrl || currentItem.originalUrl}
                            alt="Image"
                            style={activeTab === 'resize' && resizeWidth > 0 && resizeHeight > 0 ? {
                               aspectRatio: `${resizeWidth} / ${resizeHeight}`,
                               objectFit: resizeMode === 'smart' ? 'cover' : 'fill'
                            } : {}}
                            className={`max-h-full max-w-full shadow-2xl rounded-lg ${activeTab !== 'resize' ? 'object-contain' : ''}`}
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
                            onCropChange={(x, y, w, h) => {
                              setCropX(x);
                              setCropY(y);
                              setCropWidth(w);
                              setCropHeight(h);
                            }}
                          />
                        )}
                        {currentItem?.status === 'idle' && (
                          <div className="absolute inset-0 bg-dark-900/50 backdrop-blur-[2px] flex flex-col items-center justify-center z-10 p-6 text-center">
                            <button
                              aria-label={`${t('work.action.cut')} - magic eraser, smart matting algorithm, precise cutout`}
                              onClick={() => processSingleItem(currentItem)}
                              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold text-base sm:text-lg shadow-glow-cyan transform hover:scale-105 transition-all flex items-center gap-3 animate-pulse cursor-pointer"
                            >
                              <Scissors className="w-6 h-6" />
                              <span>{t('work.action.cut')}</span>
                            </button>
                            <span className="text-xs text-slate-200 mt-3 font-medium bg-dark-900/80 px-3 py-1.5 rounded-full border border-dark-600">
                              {t('work.action.hint')}
                            </span>
                          </div>
                        )}
                      </>
                    )
                  )}

                  <div className="absolute top-4 left-4 bg-dark-900/80 backdrop-blur-md border border-dark-500 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-neon-cyan" />
                    <span className="truncate max-w-[200px]">{currentItem?.name}</span>
                  </div>
                </div>

                {/* Strip Thumbnail Batch (Jika > 1 foto) */}
                {batchItems.length > 1 && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 p-2 bg-dark-800/50 rounded-2xl border border-dark-600/50">
                    {batchItems.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedIndex(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
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
          <div className="lg:col-span-5 xl:col-span-4 glass-panel p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-dark-600/60 pb-4">
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

            <Suspense fallback={
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 text-neon-cyan animate-spin" />
              </div>
            }>
              {activeTab === 'remove' && (
                <RemoveBgControl
                  currentTransparentUrl={currentItem?.processedUrl || null}
                  batchUrls={batchItems
                    .filter((i) => i.status === 'done' && i.transparentUrl)
                    .map((i) => ({ name: i.name, url: i.transparentUrl! }))}
                  onReset={() => setBatchItems([])}
                  isProcessing={currentItem?.status === 'processing'}
                  status={currentItem?.status || 'idle'}
                  onProcessNow={() => currentItem && processSingleItem(currentItem)}
                  onProcessBatch={() => {
                    batchItems.forEach((i) => {
                      if (i.status !== 'done') processSingleItem(i);
                    });
                  }}
                  batchCount={batchItems.length}
                  imageType={imageType}
                  setImageType={setImageType}

                />
              )}

              {activeTab === 'color' && (
                <ColorBgControl
                  selectedColor={selectedColor}
                  setSelectedColor={setSelectedColor}
                  onDownload={() => {
                    if (currentItem?.processedUrl) {
                      const a = document.createElement('a');
                      a.href = currentItem.processedUrl;
                      a.download = `HelpMyIMG_PasFoto_${Date.now()}.png`;
                      a.click();
                    }
                  }}
                  onReset={() => setBatchItems([])}
                  isProcessing={currentItem?.status === 'processing'}
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
                  onDownload={() => {
                    if (currentItem?.processedUrl) {
                      const a = document.createElement('a');
                      a.href = currentItem.processedUrl;
                      a.download = `HelpMyIMG_Brush_${Date.now()}.png`;
                      a.click();
                    }
                  }}
                  onReset={() => setBatchItems([])}
                  isProcessing={currentItem?.status === 'processing'}
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
                  onDownload={async () => {
                    if (currentItem?.processedUrl) {
                      const a = document.createElement('a');
                      a.href = currentItem.processedUrl;
                      a.download = `HelpMyIMG_Watermark_${Date.now()}.png`;
                      a.click();
                    }
                  }}
                  onReset={() => {
                    setWatermarkText('');
                    setWatermarkImage(null);
                    setBatchItems([]);
                  }}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {activeTab === 'compress' && (
                <CompressControl
                  quality={compressQuality}
                  setQuality={setCompressQuality}
                  originalSize={compressSourceSize || currentItem?.file?.size}
                  compressedSize={compressBlob?.size}
                  onProcess={async () => {
                    if (currentItem) {
                      try {
                        let sourceBlob = currentItem.file;
                        if (currentItem.processedUrl) {
                          const res = await fetch(currentItem.processedUrl);
                          sourceBlob = await res.blob();
                        } else if (!sourceBlob && currentItem.originalUrl) {
                          const res = await fetch(currentItem.originalUrl);
                          sourceBlob = await res.blob();
                        }
                        
                        if (sourceBlob) {
                          setCompressSourceSize(sourceBlob.size);
                          const blob = await processImage(sourceBlob, { mimeType: 'image/jpeg', quality: compressQuality });
                          setCompressBlob(blob);
                          setCompressUrl(URL.createObjectURL(blob));
                        }
                      } catch (err) {
                        console.error('Compress preview failed', err);
                      }
                    }
                  }}
                  onDownload={() => {
                    if (compressBlob) {
                      const url = URL.createObjectURL(compressBlob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `HelpMyIMG_Compress_${Date.now()}.jpg`;
                      a.click();
                    }
                  }}
                  onReset={() => {
                    setCompressQuality(0.8);
                    setCompressBlob(null);
                    if (compressUrl) URL.revokeObjectURL(compressUrl);
                    setCompressUrl(null);
                    setBatchItems([]);
                  }}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {activeTab === 'convert' && (
                <ConvertControl
                  format={convertFormat}
                  setFormat={setConvertFormat}
                  onDownload={async () => {
                    if (currentItem?.file) {
                      try {
                        const blob = await processImage(currentItem.file, { mimeType: convertFormat, quality: 0.95 });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        const extMap: Record<string, string> = { 'image/x-icon': 'ico', 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/bmp': 'bmp', 'image/avif': 'avif' };
                        const ext = extMap[convertFormat] || convertFormat.split('/')[1];
                        a.download = `HelpMyIMG_Convert_${Date.now()}.${ext}`;
                        a.click();
                      } catch (err) {
                        console.error('Convert failed', err);
                      }
                    }
                  }}
                  onReset={() => {
                    setConvertFormat('image/jpeg');
                    setBatchItems([]);
                  }}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {activeTab === 'resize' && (
                <ResizeControl
                  originalWidth={originalDimensions.width}
                  originalHeight={originalDimensions.height}
                  width={resizeWidth}
                  setWidth={setResizeWidth}
                  height={resizeHeight}
                  setHeight={setResizeHeight}
                  maintainAspectRatio={resizeMaintainRatio}
                  setMaintainAspectRatio={setResizeMaintainRatio}
                  resizeMode={resizeMode}
                  setResizeMode={setResizeMode}
                  onDownload={async () => {
                    if (currentItem?.file) {
                      try {
                        let blob: Blob;
                        if (resizeMode === 'smart') {
                          blob = await smartCropImage(currentItem.file, resizeWidth, resizeHeight, currentItem.file.type || 'image/jpeg');
                        } else {
                          blob = await processImage(currentItem.file, { 
                            mimeType: currentItem.file.type || 'image/jpeg', 
                            quality: 0.95,
                            width: resizeWidth,
                            height: resizeHeight,
                            maintainAspectRatio: false
                          });
                        }
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        const ext = (currentItem.file.type || 'image/jpeg').split('/')[1];
                        a.download = `HelpMyIMG_Resize_${Date.now()}.${ext}`;
                        a.click();
                      } catch (err) {
                        console.error('Resize failed', err);
                      }
                    }
                  }}
                  onReset={() => {
                    setResizeWidth(originalDimensions.width);
                    setResizeHeight(originalDimensions.height);
                    setBatchItems([]);
                  }}
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
                  onDownload={async () => {
                    if (currentItem?.file) {
                      try {
                        const blob = await cropImage(currentItem.file, cropX, cropY, cropWidth, cropHeight);
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `HelpMyIMG_Crop_${Date.now()}.png`;
                        a.click();
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
                    setBatchItems([]);
                  }}
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
                  onDownload={async () => {
                    if (currentItem?.file) {
                      try {
                        const blob = await rotateImage(currentItem.file, rotationDeg, flipH, flipV);
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `HelpMyIMG_Rotate_${Date.now()}.png`;
                        a.click();
                      } catch (err) {
                        console.error('Rotate failed', err);
                      }
                    }
                  }}
                  onReset={() => {
                    setRotationDeg(0);
                    setFlipH(false);
                    setFlipV(false);
                    setBatchItems([]);
                  }}
                  isProcessing={currentItem?.status === 'processing'}
                />
              )}

              {activeTab === 'picker' && (
                <ColorPickerControl
                  pickedColor={pickedColor}
                  colorHistory={colorHistory}
                  dominantColors={dominantColors}
                  onReset={() => setBatchItems([])}
                  isProcessing={false}
                />
              )}
            </Suspense>
          </div>
        </div>
    </section>
  );
};
