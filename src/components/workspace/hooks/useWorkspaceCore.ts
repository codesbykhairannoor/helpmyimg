// src/components/workspace/hooks/useWorkspaceCore.ts
// Core workspace coordinator for Batch Items, Uploads, Selection, Drag-and-Drop, and File Export
// Enforces: Batch Limits (Free: 10, PRO: 100) & Resolution Limits (Free: Max 1920px HD, PRO: Uncompressed 4K)

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useProGate } from '../../../context/ProGateContext';
import { getExportUrl, getImageDimensions } from '../../../utils/resolutionHelper';
import { exportTo4k } from '../../../utils/upscaleHelper';
import { getMaxBatchAllowed } from '../../../utils/quotaManager';
import { decodeForeignImageToPngBlob, needsForeignDecode } from '../../../utils/wasmDecoder';
import type { BatchItem, TabType } from '../types';

export interface UseWorkspaceCoreReturn {
  t: (key: string, options?: any) => string;
  batchItems: BatchItem[];
  setBatchItems: React.Dispatch<React.SetStateAction<BatchItem[]>>;
  selectedIndex: number;
  setSelectedIndex: (idx: number) => void;
  currentItem: BatchItem | null;
  isDragging: boolean;
  setIsDragging: (val: boolean) => void;
  isZipping: boolean;
  setIsZipping: (val: boolean) => void;
  toastMessage: string | null;
  setToastMessage: (msg: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  handleFiles: (files: FileList | File[]) => Promise<void>;
  handleReset: () => void;
  handleUploadOther: () => void;
  handleDownloadSingle: (item: BatchItem, force4k?: boolean) => Promise<void>;
  handleDownloadZip: (customZipName?: string) => Promise<void>;
  removeItem: (id: string) => void;
  clearAllItems: () => void;
}

export function useWorkspaceCore(initialTab: TabType = 'remove'): UseWorkspaceCoreReturn {
  const { t } = useTranslation();
  const { user, isPro, openAuthModal } = useAuth();
  const { openProGate, quotaState, consume4k } = useProGate();
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentItem = batchItems[selectedIndex] || null;

  // Auto hide toast after 3.5s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Clean up blob URLs on unmount when user switches tools or navigates pages
  const batchItemsRef = useRef(batchItems);
  batchItemsRef.current = batchItems;
  useEffect(() => {
    return () => {
      batchItemsRef.current.forEach((i) => {
        if (i.originalUrl) URL.revokeObjectURL(i.originalUrl);
        if (i.transparentUrl && i.transparentUrl !== i.originalUrl) URL.revokeObjectURL(i.transparentUrl);
        if (i.processedUrl && i.processedUrl !== i.originalUrl) URL.revokeObjectURL(i.processedUrl);
      });
    };
  }, []);

  const isReplacingRef = useRef(false);

  // Handle file uploads across all tools (including HEIC, RAW, PSD, TIFF, JXL via WASM decoder)
  const handleFiles = useCallback(
    async (files: FileList | File[], forceReplace?: boolean) => {
      const rawFiles = Array.from(files);
      const isReplacing = forceReplace ?? isReplacingRef.current;
      isReplacingRef.current = false;

      const maxBatch = getMaxBatchAllowed(Boolean(user), isPro);
      const currentCount = isReplacing ? 0 : batchItems.length;
      const availableSlots = Math.max(0, maxBatch - currentCount);

      if (availableSlots <= 0) {
        openProGate({ feature: 'batch-limit' });
        return;
      }

      if (rawFiles.length > availableSlots) {
        openProGate({ feature: 'batch-limit' });
      }

      const fileArray = rawFiles.slice(0, availableSlots);
      if (fileArray.length === 0) return;

      // Revoke old URLs if replacing
      if (isReplacing) {
        batchItems.forEach((i) => {
          if (i.originalUrl) URL.revokeObjectURL(i.originalUrl);
          if (i.transparentUrl && i.transparentUrl !== i.originalUrl) URL.revokeObjectURL(i.transparentUrl);
          if (i.processedUrl && i.processedUrl !== i.originalUrl) URL.revokeObjectURL(i.processedUrl);
        });
      }

      const decodedItems = await Promise.all(
        fileArray.map(async (rawFile) => {
          let f: File = rawFile;
          if (rawFile.name.toLowerCase().endsWith('.svg') && (!rawFile.type || !rawFile.type.includes('svg'))) {
            f = new File([rawFile], rawFile.name, { type: 'image/svg+xml' });
          } else if (needsForeignDecode(rawFile)) {
            try {
              const { blob, decoded } = await decodeForeignImageToPngBlob(rawFile);
              if (decoded) {
                f = new File([blob], rawFile.name, { type: blob.type || 'image/png' });
              }
            } catch (decodeErr) {
              console.warn('[HelpMyIMG] Foreign WASM decode skipped:', decodeErr);
            }
          }
          const url = URL.createObjectURL(f);
          return {
            id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
            name: rawFile.name,
            file: f,
            originalUrl: url,
            transparentUrl: null,
            processedUrl: null,
            initialFile: f,
            initialOriginalUrl: url,
            modelType: 'rmbg' as const,
            status: 'idle' as const,
            progress: 0,
            progressStep: t('work.waiting', { defaultValue: 'Ready to process' }),
          };
        })
      );

      const newItems: BatchItem[] = decodedItems;

      setBatchItems((prev) => {
        const baseList = isReplacing ? [] : prev;
        const merged = [...baseList, ...newItems];
        // All tools initialize in 'idle' state with processedUrl: null so action buttons (Apply/Process) are shown first
        return merged.map((i) =>
          newItems.some((n) => n.id === i.id)
            ? { ...i, status: 'idle', transparentUrl: null, processedUrl: null, progress: 0 }
            : i
        );
      });

      if (isReplacing || batchItems.length === 0) setSelectedIndex(0);
    },
    [batchItems, initialTab, t, isPro, openAuthModal]
  );

  // Reset current item back to original unedited state (Keep file in workspace)
  const handleReset = useCallback(() => {
    if (!currentItem) return;
    setBatchItems((prev) =>
      prev.map((i) =>
        i.id === currentItem.id
          ? {
            ...i,
            processedUrl: null,
            transparentUrl: null,
            status: 'idle',
            progress: 0,
            progressStep: t('work.waiting', { defaultValue: 'Ready to process' }),
          }
          : i
      )
    );
    setToastMessage(t('editor.resetSuccess', { defaultValue: 'Gambar dikembalikan ke kondisi awal.' }));
  }, [currentItem, t]);

  // Upload other image (Replaces current active photo cleanly)
  const handleUploadOther = useCallback(() => {
    isReplacingRef.current = true;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }, []);

  // Remove single item
  const removeItem = useCallback((id: string) => {
    setBatchItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      return next;
    });
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  }, []);

  // Clear all items
  const clearAllItems = useCallback(() => {
    batchItems.forEach((i) => {
      if (i.originalUrl) URL.revokeObjectURL(i.originalUrl);
      if (i.transparentUrl && i.transparentUrl !== i.originalUrl) URL.revokeObjectURL(i.transparentUrl);
    });
    setBatchItems([]);
    setSelectedIndex(0);
  }, [batchItems]);

  // Download single item with 4K vs HD 1080p resolution gate & daily trial quota
  const handleDownloadSingle = useCallback(
    async (item: BatchItem, force4k?: boolean) => {
      const isCompressTool = ['compress', 'compress50kb', 'compress100kb', 'compress200kb'].includes(initialTab || '');
      const isUpscaleTool = ['remove', 'removeperson', 'removelogo', 'color', 'colorwhite', 'design', 'brush'].includes(initialTab || '');

      // Compress, convert, resize, crop, rotate, watermark, metadata: Direct download without resolution/quality mutations
      if (isCompressTool || item.compressBlob || !isUpscaleTool) {
        const downloadUrl = item.compressUrl || item.processedUrl || item.transparentUrl || item.originalUrl;
        if (!downloadUrl) return;

        let baseName = item.name || `HelpMyIMG_${Date.now()}`;
        if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
        const ext = item.compressBlob
          ? (item.compressBlob.type === 'image/png' ? 'png' : item.compressBlob.type === 'image/webp' ? 'webp' : 'jpg')
          : (item.name.split('.').pop() || 'jpg');

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${baseName}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }

      const urlToDownload = item.processedUrl || item.transparentUrl || item.originalUrl;
      if (!urlToDownload) return;

      const performDownload = async (is4k: boolean = false) => {
        let finalUrl: string;
        let revoked = false;

        if (is4k) {
          const res = await exportTo4k(urlToDownload, 3840, { useAiSr: isPro });
          finalUrl = res.url;
          revoked = res.revoked;
        } else {
          const res = await getExportUrl(urlToDownload, false);
          finalUrl = res.url;
          revoked = res.revoked;
        }

        const a = document.createElement('a');
        a.href = finalUrl;
        const nameParts = item.name.split('.');
        const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '.png';
        const base = nameParts.join('.');
        a.download = is4k ? `${base}_4K_UltraHD${ext}` : `${base}_HelpMyIMG${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (revoked) {
          setTimeout(() => URL.revokeObjectURL(finalUrl), 5000);
        }
      };

      if (force4k === true) {
        if (isPro) {
          await performDownload(true);
          return;
        }
        if (user && quotaState.remaining4k > 0) {
          consume4k();
          setToastMessage(
            t('gate.quotaSuccessToast', {
              remaining: quotaState.remaining4k - 1,
              defaultValue: `Ekspor 4K Asli Berhasil! (Sisa kuota 4K hari ini: ${quotaState.remaining4k - 1})`,
            })
          );
          await performDownload(true);
        } else {
          openProGate({
            feature: 'export-4k',
            onProceedFallback: () => performDownload(false),
            onSuccess: () => {
              consume4k();
              performDownload(true);
            },
          });
        }
        return;
      }

      if (force4k === false) {
        await performDownload(false);
        return;
      }

      const dims = await getImageDimensions(urlToDownload);
      const isHighRes = dims.width > 1920 || dims.height > 1920;

      if (isHighRes && !isPro) {
        if (user && quotaState.remaining4k > 0) {
          consume4k();
          setToastMessage(
            t('gate.quotaSuccessToast', {
              remaining: quotaState.remaining4k - 1,
              defaultValue: `Ekspor 4K Asli Berhasil! (Sisa kuota 4K hari ini: ${quotaState.remaining4k - 1})`,
            })
          );
          await performDownload(true);
        } else {
          openProGate({
            feature: 'export-4k',
            onProceedFallback: () => performDownload(false),
            onSuccess: () => {
              consume4k();
              performDownload(true);
            },
          });
          return;
        }
      } else {
        await performDownload(isPro);
      }
    },
    [isPro, user, quotaState, consume4k, openProGate, t, initialTab]
  );

  // Download all as ZIP with intelligent format and resolution preservation
  const handleDownloadZip = useCallback(async (customZipName?: string) => {
    if (batchItems.length === 0) return;
    setIsZipping(true);
    let anyDownscaled = false;
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const isCompressTool = ['compress', 'compress50kb', 'compress100kb', 'compress200kb'].includes(initialTab || '');
      const isUpscaleTool = ['remove', 'removeperson', 'removelogo', 'color', 'colorwhite', 'design'].includes(initialTab || '');

      for (const item of batchItems) {
        let finalUrl = item.compressUrl || item.processedUrl || item.transparentUrl || item.originalUrl;
        let isRevokable = false;
        let ext = item.name.split('.').pop() || 'png';

        if (isCompressTool || item.compressBlob) {
          finalUrl = item.compressUrl || item.processedUrl || item.originalUrl;
        } else if (!isPro && isUpscaleTool) {
          const rawUrl = item.processedUrl || item.transparentUrl || item.originalUrl;
          if (rawUrl) {
            const expRes = await getExportUrl(rawUrl, false);
            finalUrl = expRes.url;
            isRevokable = expRes.revoked;
            if (expRes.wasDownscaled) anyDownscaled = true;
          }
        }

        if (!finalUrl) continue;

        const res = await fetch(finalUrl);
        const blob = await res.blob();
        const baseName = item.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}_HelpMyIMG.${ext}`, blob);

        if (isRevokable) {
          URL.revokeObjectURL(finalUrl);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      const zipFileName = isPro && customZipName?.trim()
        ? `${customZipName.trim().replace(/\.zip$/i, '')}.zip`
        : `HelpMyIMG_Batch_${Date.now()}.zip`;
      a.download = zipFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (anyDownscaled && !isPro) {
        setToastMessage(
          t('work.downscaleZipNotice', {
            defaultValue: 'File ZIP diekspor dalam resolusi Standar HD (1080p). Upgrade ke PRO untuk mengunduh 4K asli!',
          })
        );
      } else {
        setToastMessage(t('editor.zipSuccess', { defaultValue: 'Batch ZIP downloaded successfully!' }));
      }
    } catch (err) {
      console.error('ZIP Error:', err);
      setToastMessage(t('editor.zipError', { defaultValue: 'Failed to create ZIP.' }));
    } finally {
      setIsZipping(false);
    }
  }, [batchItems, isPro, t]);

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
    setToastMessage,
    fileInputRef,
    canvasRef,
    handleFiles,
    handleReset,
    handleUploadOther,
    handleDownloadSingle,
    handleDownloadZip,
    removeItem,
    clearAllItems,
  };
}
