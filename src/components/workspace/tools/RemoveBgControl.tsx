// src/components/workspace/tools/RemoveBgControl.tsx
// Kontrol untuk mengunduh hasil potongan background transparan (Tunggal & Batch) serta Kontrol Toleransi Warna

import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { RefreshCw, Sparkles, Image as ImageIcon, PaintBucket } from 'lucide-react';

interface RemoveBgControlProps {
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
  imageType?: 'photo' | 'logo' | 'general';
  setImageType?: (val: 'photo' | 'logo' | 'general') => void;
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
  hasProcessedAi = true, // Default true to maintain behavior if not passed
}) => {
  const { t } = useTranslation();

  const shouldShowActionButtons =
    status === 'idle' ||
    status === 'error' ||
    (!hasProcessedAi && status !== 'processing' && status !== 'queued' && status !== 'done');

  return (
    <div className="space-y-6">
      {/* Mode Selection UI (Redesigned) */}
      {setImageType && (
        <div className="space-y-4 bg-dark-800/50 p-5 rounded-2xl border border-dark-600/80 shadow-inner">
          <label className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span>{t('remove.modeTitle', { defaultValue: 'Cutout Mode' })}</span>
          </label>
          
          <div className="flex bg-dark-900/60 p-1 rounded-xl border border-dark-700">
            <button
              onClick={() => setImageType('photo')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                imageType === 'photo' 
                  ? 'bg-dark-700 shadow-md border border-dark-500' 
                  : 'hover:bg-dark-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <ImageIcon className={`w-5 h-5 ${imageType === 'photo' ? 'text-neon-cyan' : 'opacity-70'}`} />
              <span className={`text-xs font-bold ${imageType === 'photo' ? 'text-white' : ''}`}>{t('remove.modeAi', { defaultValue: 'Standard AI' })}</span>
              <span className="text-[9px] text-slate-500 font-medium text-center">{t('remove.modeAiDesc', { defaultValue: 'Photo, Object, Human' })}</span>
            </button>
            <button
              onClick={() => setImageType('logo')}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-lg transition-all ${
                imageType === 'logo' 
                  ? 'bg-dark-700 shadow-md border border-dark-500' 
                  : 'hover:bg-dark-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <PaintBucket className={`w-5 h-5 ${imageType === 'logo' ? 'text-neon-pink' : 'opacity-70'}`} />
              <span className={`text-xs font-bold ${imageType === 'logo' ? 'text-white' : ''}`}>{t('remove.modeLogo', { defaultValue: 'Non-AI' })}</span>
              <span className="text-[9px] text-slate-500 font-medium text-center">{t('remove.modeLogoDesc', { defaultValue: 'Logo & Solid Graphics' })}</span>
            </button>
          </div>
        </div>
      )}

      {/* Tombol Action Utama (Selalu Muncul & Jelas) */}
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

      {/* Tombol Unggah Foto Lain / Upload Other Photos (Muncul HANYA saat tepat 1 foto terupload) */}
      {batchCount === 1 && (
        <div className="pt-3 border-t border-dark-700/80 mt-2">
          <button
            onClick={onUploadOther || onReset}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-medium text-sm transition-colors border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4 text-neon-cyan" />
            <span>{t('editor.reset')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
