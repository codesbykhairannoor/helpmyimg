// src/components/workspace/hooks/useWorkspaceCore.ts
// Core workspace coordinator for Batch Items, Uploads, Selection, Drag-and-Drop, and File Export

import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
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
  handleDownloadSingle: (item: BatchItem) => void;
  handleDownloadZip: () => Promise<void>;
  removeItem: (id: string) => void;
  clearAllItems: () => void;
}

export function useWorkspaceCore(initialTab: TabType = 'remove'): UseWorkspaceCoreReturn {
  const { t } = useTranslation();
  const [batchItems, setBatchItems] = useState<BatchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const currentItem = batchItems[selectedIndex] || null;

  // Auto hide toast after 3s
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const isReplacingRef = useRef(false);

  // Handle file uploads
  const handleFiles = useCallback(
    async (files: FileList | File[], forceReplace?: boolean) => {
      const fileArray = Array.from(files).slice(0, 10);
      if (fileArray.length === 0) return;

      const isReplacing = forceReplace ?? isReplacingRef.current;
      isReplacingRef.current = false;

      // Revoke old URLs if replacing
      if (isReplacing) {
        batchItems.forEach((i) => {
          if (i.originalUrl) URL.revokeObjectURL(i.originalUrl);
          if (i.transparentUrl && i.transparentUrl !== i.originalUrl) URL.revokeObjectURL(i.transparentUrl);
          if (i.processedUrl && i.processedUrl !== i.originalUrl) URL.revokeObjectURL(i.processedUrl);
        });
      }

      const newItems: BatchItem[] = fileArray.map((f) => {
        const url = URL.createObjectURL(f);
        return {
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: f.name,
          file: f,
          originalUrl: url,
          transparentUrl: null,
          processedUrl: url,
          initialFile: f,
          initialOriginalUrl: url,
          modelType: 'rmbg',
          status: 'idle',
          progress: 0,
          progressStep: t('work.waiting', { defaultValue: 'Ready to process' }),
        };
      });

      setBatchItems((prev) => {
        const baseList = isReplacing ? [] : prev;
        const merged = [...baseList, ...newItems];
        if (['convert', 'convertwebp'].includes(initialTab)) {
          return merged.map((i) =>
            newItems.some((n) => n.id === i.id)
              ? { ...i, status: 'idle', transparentUrl: i.originalUrl, processedUrl: null, progress: 0 }
              : i
          );
        }

        // For non-cutout utility tabs, instantly mark as ready/done for direct preview
        if (
          [
            'watermark',
            'watermarkbulk',
            'compress',
            'compress100kb',
            'compress50kb',
            'compress200kb',
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

      if (isReplacing || batchItems.length === 0) setSelectedIndex(0);
    },
    [batchItems, initialTab, t]
  );

  // Reset current item back to original unedited state (Keep file in workspace)
  const handleReset = useCallback(() => {
    if (!currentItem) return;
    const isRemoveTab = initialTab === 'remove';
    setBatchItems((prev) =>
      prev.map((i) =>
        i.id === currentItem.id
          ? {
              ...i,
              processedUrl: i.originalUrl,
              transparentUrl: isRemoveTab ? null : i.originalUrl,
              status: isRemoveTab ? 'idle' : 'done',
              progress: isRemoveTab ? 0 : 100,
              progressStep: t('work.waiting', { defaultValue: 'Ready to process' }),
            }
          : i
      )
    );
    setToastMessage(t('editor.resetSuccess', { defaultValue: 'Gambar dikembalikan ke kondisi awal.' }));
  }, [currentItem, initialTab, t]);

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

  // Download single item
  const handleDownloadSingle = useCallback(
    (item: BatchItem) => {
      const urlToDownload = item.processedUrl || item.transparentUrl || item.originalUrl;
      if (!urlToDownload) return;

      const a = document.createElement('a');
      a.href = urlToDownload;
      const baseName = item.name.replace(/\.[^/.]+$/, '');
      a.download = `${baseName}_HelpMyIMG.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    []
  );

  // Download all as ZIP
  const handleDownloadZip = useCallback(async () => {
    if (batchItems.length === 0) return;
    setIsZipping(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      for (const item of batchItems) {
        const url = item.processedUrl || item.transparentUrl || item.originalUrl;
        if (!url) continue;
        const res = await fetch(url);
        const blob = await res.blob();
        const baseName = item.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}_HelpMyIMG.png`, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `HelpMyIMG_Batch_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setToastMessage(t('editor.zipSuccess', { defaultValue: 'Batch ZIP downloaded successfully!' }));
    } catch (err) {
      console.error('ZIP Error:', err);
      setToastMessage(t('editor.zipError', { defaultValue: 'Failed to create ZIP.' }));
    } finally {
      setIsZipping(false);
    }
  }, [batchItems, t]);

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
