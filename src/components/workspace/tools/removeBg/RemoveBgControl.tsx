// src/components/workspace/tools/removeBg/RemoveBgControl.tsx
// Kontrol UI untuk Background Removal: Photo AI & Vector Mode Terpisah Secara Eksplisit

import React from 'react';
import { useTranslation } from '../../../../context/LanguageContext';
import { RefreshCw, Sparkles, Image as ImageIcon, PaintBucket, RotateCcw, Upload } from 'lucide-react';
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
  batchCount?: number;
  imageType?: CutoutMode;
  setImageType?: (val: CutoutMode) => void;
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
  batchCount = 0,
  imageType = 'photo',
  setImageType,
  hasProcessedAi = true,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Mode Selection UI (2 Explicit Clean Modes: Photo AI vs Logo Non-AI) */}
      {setImageType && (
        <div className="space-y-3 bg-dark-800/50 p-4 rounded-2xl border border-dark-600/80 shadow-inner">
          <label className="text-xs font-bold text-white flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{t('remove.modeTitle', { defaultValue: 'Cutout Engine' })}</span>
            </span>
            <span className="text-[10px] text-neon-cyan font-mono font-semibold px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
              {imageType === 'logo'
                ? t('remove.modeLogoActive', { defaultValue: 'Vector Mode' })
                : t('remove.modeAiActive', { defaultValue: 'AI Neural Mode' })}
            </span>
          </label>
          
          <div className="grid grid-cols-2 gap-2 bg-dark-900/70 p-1.5 rounded-xl border border-dark-700">
            {/* 1. Photo AI (Default) */}
            <button
              type="button"
              onClick={() => setImageType('photo')}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg transition-all cursor-pointer ${
                imageType === 'photo' 
                  ? 'bg-gradient-to-b from-dark-700 to-dark-800 shadow-md border border-neon-cyan/50 text-white' 
                  : 'hover:bg-dark-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <ImageIcon className={`w-4 h-4 ${imageType === 'photo' ? 'text-neon-cyan' : 'opacity-70'}`} />
              <span className="text-xs font-bold truncate">{t('remove.modeAi', { defaultValue: 'Photo AI' })}</span>
              <span className="text-[9px] text-slate-400 font-medium text-center truncate">{t('remove.modeAiDesc', { defaultValue: 'Human, Portrait & Object' })}</span>
            </button>

            {/* 2. Logo Vector Mode */}
            <button
              type="button"
              onClick={() => setImageType('logo')}
              className={`flex flex-col items-center justify-center gap-1 py-2.5 px-2 rounded-lg transition-all cursor-pointer ${
                imageType === 'logo' 
                  ? 'bg-gradient-to-b from-dark-700 to-dark-800 shadow-md border border-neon-pink/50 text-white' 
                  : 'hover:bg-dark-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <PaintBucket className={`w-4 h-4 ${imageType === 'logo' ? 'text-neon-pink' : 'opacity-70'}`} />
              <span className="text-xs font-bold truncate">{t('remove.modeLogo', { defaultValue: 'Logo / Vector' })}</span>
              <span className="text-[9px] text-slate-400 font-medium text-center truncate">{t('remove.modeLogoDesc', { defaultValue: 'Flat Color Graphics (0ms)' })}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tombol Action Utama */}
      <div className="space-y-3">
        <button
          onClick={onProcessNow}
          disabled={isProcessing || status === 'processing' || batchCount === 0}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none text-sm tracking-wide cursor-pointer"
        >
          {isProcessing || status === 'processing' ? (
            <>
              <RefreshCw className="w-4 h-4 text-dark-900 animate-spin shrink-0" />
              <span>{t('work.processing', { defaultValue: 'Processing AI Cutout...' })}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-dark-900 shrink-0" />
              <span>
                {hasProcessedAi && currentTransparentUrl
                  ? t('work.reprocessAi', { defaultValue: '⚡ Re-run AI Cutout' })
                  : t('work.startAi', { defaultValue: 'Remove Background Now' })}
              </span>
            </>
          )}
        </button>

        {batchCount > 1 && onProcessBatch && (
          <button
            onClick={onProcessBatch}
            disabled={isProcessing || batchCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 border border-neon-cyan/50 text-white font-extrabold text-sm tracking-wide transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-neon-cyan shrink-0" />
            <span>{t('work.action.batch', { defaultValue: '✨ Process All' })} ({batchCount} {t('work.action.photos', { defaultValue: 'Photos' })})</span>
          </button>
        )}
      </div>

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center py-6 gap-3 bg-red-900/20 border border-red-500/30 rounded-xl p-4 text-center mt-2">
          <div className="text-red-400 font-bold flex items-center gap-2">
            <span className="text-xl">⚠️</span> {t('work.failedAi')}
          </div>
          <span className="text-[11px] font-medium text-red-200/80">
            {t('work.errorHint')} (Tip: Try using a smaller resolution image, your device might be running out of memory.)
          </span>
          {onProcessNow && (
            <button
              onClick={onProcessNow}
              className="mt-2 px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 transition-colors rounded-lg text-red-300 text-xs font-bold w-full"
            >
              {t('work.action.retry')}
            </button>
          )}
        </div>
      )}

      {/* Tombol Reset ke Asli & Upload Gambar Lain (Dua Opsi Berbeda & Terpisah) */}
      {batchCount >= 1 && (
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-dark-700/80 mt-2">
          {/* Opsi 1: Reset ke Asli (Foto tetap ada di workspace, dibersihkan seperti awal upload) */}
          <button
            type="button"
            onClick={onReset}
            disabled={isProcessing}
            title={t('editor.resetDesc', { defaultValue: 'Kembalikan foto ini ke kondisi asli tanpa potongan' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span className="truncate">{t('editor.resetOriginal', { defaultValue: 'Reset ke Asli' })}</span>
          </button>

          {/* Opsi 2: Upload Gambar Lain (Pilih foto baru dari komputer) */}
          <button
            type="button"
            onClick={onUploadOther}
            disabled={isProcessing}
            title={t('editor.uploadOtherDesc', { defaultValue: 'Pilih dan unggah foto baru dari perangkat' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
            <span className="truncate">{t('editor.uploadOther', { defaultValue: 'Upload Lain' })}</span>
          </button>
        </div>
      )}
    </div>
  );
};
