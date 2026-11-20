// src/components/workspace/tools/design/components/StudioTopBar.tsx
// Header Toolbar untuk Studio Image Editor

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ArrowLeft,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Eye,
  Download,
  SlidersHorizontal,
} from 'lucide-react';

interface StudioTopBarProps {
  fileName: string;
  imageDimensions: { width: number; height: number };
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onResetAll: () => void;
  isComparing: boolean;
  onToggleCompare: () => void;
  onOpenExport: () => void;
  onClose: () => void;
}

export const StudioTopBar: React.FC<StudioTopBarProps> = ({
  fileName,
  imageDimensions,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onResetAll,
  isComparing,
  onToggleCompare,
  onOpenExport,
  onClose,
}) => {
  const { t } = useTranslation();

  const is4K = imageDimensions.width >= 3840 || imageDimensions.height >= 3840;
  const isHD = imageDimensions.width >= 1920 || imageDimensions.height >= 1920;

  return (
    <header className="h-12 sm:h-16 bg-white/95 dark:bg-dark-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-2 sm:px-5 flex items-center justify-between gap-1.5 sm:gap-2 select-none z-30 shrink-0 text-slate-800 dark:text-slate-200">
      {/* Kiri: Tombol Kembali & Info File */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onClose}
          className="h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 cursor-pointer"
          title={t('studio.backTooltip', { defaultValue: 'Kembali / Ganti Gambar' })}
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">{t('studio.back', { defaultValue: 'Ganti Foto' })}</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />

        <div className="min-w-0 flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[70px] xs:max-w-[100px] sm:max-w-[200px] md:max-w-[280px]">
            {fileName || 'Untitled.jpg'}
          </span>
          {imageDimensions.width > 0 && (
            <span
              className={`hidden sm:inline-flex text-[11px] font-mono font-medium px-2 py-0.5 rounded border shrink-0 ${
                is4K
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : isHD
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {is4K ? '4K • ' : isHD ? 'FHD • ' : ''}
              {imageDimensions.width}×{imageDimensions.height}
            </span>
          )}
        </div>
      </div>

      {/* Tengah: Undo, Redo, Zoom, & Compare Controls */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-900/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
              canUndo
                ? 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-xs'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title={t('studio.undo', { defaultValue: 'Urungkan (Ctrl+Z)' })}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center transition-colors cursor-pointer ${
              canRedo
                ? 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 shadow-xs'
                : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
            }`}
            title={t('studio.redo', { defaultValue: 'Ulangi (Ctrl+Y)' })}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-900/90 rounded-lg p-0.5 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onZoomOut}
            className="w-8 h-8 rounded flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('studio.zoomOut', { defaultValue: 'Perkecil' })}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onResetZoom}
            className="px-2 h-8 rounded flex items-center justify-center text-[11px] font-mono font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('studio.resetZoom', { defaultValue: 'Reset Zoom (100%)' })}
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={onZoomIn}
            className="w-8 h-8 rounded flex items-center justify-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={t('studio.zoomIn', { defaultValue: 'Perbesar' })}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Compare Before / After Toggle */}
        <button
          type="button"
          onClick={onToggleCompare}
          className={`h-7 sm:h-9 px-2 sm:px-3 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 transition-all cursor-pointer border ${
            isComparing
              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/50 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
          }`}
          title={t('studio.compareTooltip', { defaultValue: 'Bandingkan dengan foto asli sebelum diedit' })}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">
            {isComparing
              ? t('studio.showingOriginal', { defaultValue: 'Foto Asli' })
              : t('studio.compare', { defaultValue: 'Bandingkan' })}
          </span>
        </button>

        {/* Reset All */}
        <button
          type="button"
          onClick={onResetAll}
          className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
          title={t('studio.resetAll', { defaultValue: 'Reset Semua Editan' })}
        >
          <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Kanan: Tombol Ekspor Utama */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onOpenExport}
          className="h-8 sm:h-10 px-2.5 sm:px-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>{t('studio.export', { defaultValue: 'Simpan' })}</span>
        </button>
      </div>
    </header>
  );
};
