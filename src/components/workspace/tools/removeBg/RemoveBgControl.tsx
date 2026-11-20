// src/components/workspace/tools/removeBg/RemoveBgControl.tsx
// Kontrol UI untuk Background Removal: Otomatis, Single Morphing Action Button & Presisi Tinggi Seperti Remove.bg

import React from 'react';
import { useTranslation } from '../../../../context/LanguageContext';
import { Loader2, Sparkles, RotateCcw, Upload, CheckCircle2, Download, Crown, AlertTriangle } from 'lucide-react';
import type { AiModelTier } from '../../../../workers/aiWorker';
import type { CutoutMode } from '../../types';

export interface RemoveBgControlProps {
  currentTransparentUrl?: string | null;
  currentFileName?: string;
  batchUrls?: { name: string; url: string }[];
  onReset: () => void;
  onUploadOther?: () => void;
  isProcessing: boolean;
  status?: 'idle' | 'queued' | 'processing' | 'done' | 'error';
  onProcessNow?: () => void;
  onProcessBatch?: () => void;
  onDownload?: (is4k?: boolean) => void;
  batchCount?: number;
  imageType?: CutoutMode;
  setImageType?: (val: CutoutMode) => void;
  modelTier?: AiModelTier;
  setModelTier?: (tier: AiModelTier) => void;
  hasProcessedAi?: boolean;
}

export const RemoveBgControl: React.FC<RemoveBgControlProps> = ({
  currentTransparentUrl,
  onReset,
  onUploadOther,
  isProcessing,
  status = 'idle',
  onProcessNow,
  onProcessBatch,
  onDownload,
  batchCount = 0,
}) => {
  const { t } = useTranslation();

  const isCutoutDone = status === 'done' && Boolean(currentTransparentUrl);

  return (
    <div className="space-y-6">
      {/* Engine Status Info Header */}
      <div className="flex items-center justify-between bg-dark-800/60 p-3.5 rounded-2xl border border-dark-600/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              {t('remove.engineTitle', { defaultValue: 'Auto AI Cutout' })}
            </div>
            <div className="text-[10px] text-slate-400">
              {t('remove.engineSubtitle', { defaultValue: 'Subpixel edge matting & zero color fringing' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-semibold text-emerald-400">
          <CheckCircle2 className="w-3 h-3" />
          <span>{isCutoutDone ? t('remove.doneBadge', { defaultValue: 'Diproses' }) : t('remove.readyBadge', { defaultValue: 'Ready' })}</span>
        </div>
      </div>

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center py-4 gap-2 bg-red-900/20 border border-red-500/30 rounded-xl p-3 text-center mt-2">
          <div className="text-red-400 font-bold flex items-center gap-2 text-xs">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{t('work.failedAi', { defaultValue: 'Gagal diproses AI' })}</span>
          </div>
          <span className="text-[11px] text-red-200/80">
            {t('work.errorHint', { defaultValue: 'Coba gunakan foto lain atau coba lagi.' })}
          </span>
          {onProcessNow && (
            <button
              type="button"
              onClick={onProcessNow}
              className="mt-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 text-xs font-semibold w-full transition-colors cursor-pointer"
            >
              {t('work.action.retry', { defaultValue: 'Coba Lagi' })}
            </button>
          )}
        </div>
      )}

      {/* Tombol Action Utama (Di Bawah) - Morphing Single Button (Belajar dari d:audiovideo) */}
      <div className="space-y-3 pt-2">
        {isCutoutDone ? (
          // STATE 3: Sudah Dipotong AI -> Tombol Morphs menjadi Opsi Download
          <div className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => onDownload?.(false)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-xs sm:text-sm tracking-wide cursor-pointer"
              >
                <Download className="w-4 h-4 text-slate-950 stroke-[2]" />
                <span>{t('editor.downloadPhoto', { defaultValue: 'Download Foto' })}</span>
              </button>

              <button
                type="button"
                onClick={() => onDownload?.(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-1.5 py-3.5 px-3 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 border border-amber-500/40 hover:border-amber-400 font-semibold text-xs sm:text-sm transition-all cursor-pointer group"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="truncate">{t('editor.downloadPro', { defaultValue: 'Download 4K Ultra-HD' })}</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  PRO
                </span>
              </button>
            </div>
          </div>
        ) : (
          // STATE 1 & 2: Belum Diproses / Sedang Proses -> Tombol Hapus Background Sekarang
          <button
            type="button"
            onClick={onProcessNow}
            disabled={isProcessing || status === 'processing' || batchCount === 0}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-semibold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-sm tracking-wide cursor-pointer"
          >
            {isProcessing || status === 'processing' ? (
              <>
                <Loader2 className="w-4 h-4 text-dark-900 animate-spin shrink-0" />
                <span>{t('work.processing', { defaultValue: 'Memproses Potong AI...' })}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-dark-900 shrink-0" />
                <span>{t('work.startAi', { defaultValue: 'Hapus Background Sekarang' })}</span>
              </>
            )}
          </button>
        )}

        {/* Batch Process button (hanya jika > 1 foto) */}
        {batchCount > 1 && onProcessBatch && (
          <button
            type="button"
            onClick={onProcessBatch}
            disabled={isProcessing || batchCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 border border-neon-cyan/50 text-white font-semibold text-sm tracking-wide transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan shrink-0" />
            <span>{t('work.action.batch', { defaultValue: '✨ Process All' })} ({batchCount} {t('work.action.photos', { defaultValue: 'Photos' })})</span>
          </button>
        )}
      </div>

      {/* Standardized 2-Button Action Grid */}
      {batchCount >= 1 && (
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-dark-700/80 mt-2">
          <button
            type="button"
            onClick={onReset}
            disabled={isProcessing}
            title={t('editor.resetDesc', { defaultValue: 'Kembalikan foto ini ke kondisi asli tanpa potongan' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-semibold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span className="truncate">{t('editor.resetOriginal', { defaultValue: 'Reset ke Asli' })}</span>
          </button>

          <button
            type="button"
            onClick={onUploadOther}
            disabled={isProcessing}
            title={t('editor.replacePhotoDesc', { defaultValue: 'Ganti foto ini dengan foto baru dari perangkat' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-semibold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
            <span className="truncate">{t('editor.replacePhoto', { defaultValue: 'Ganti Foto' })}</span>
          </button>
        </div>
      )}
    </div>
  );
};
