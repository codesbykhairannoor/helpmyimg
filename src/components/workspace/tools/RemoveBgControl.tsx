// src/components/workspace/tools/RemoveBgControl.tsx
// Kontrol untuk mengunduh hasil potongan background transparan (Tunggal & Batch) serta Kontrol Toleransi Warna

import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Download, Package, RefreshCw, CheckCircle2, Play, Sparkles, Image as ImageIcon, PaintBucket } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RemoveBgControlProps {
  currentTransparentUrl: string | null;
  currentFileName?: string;
  batchUrls: { name: string; url: string }[];
  onReset: () => void;
  isProcessing: boolean;
  status?: 'idle' | 'processing' | 'done' | 'error';
  onProcessNow?: () => void;
  onProcessBatch?: () => void;
  batchCount?: number;
  imageType?: 'photo' | 'logo' | 'general';
  setImageType?: (val: 'photo' | 'logo' | 'general') => void;
}

export const RemoveBgControl: React.FC<RemoveBgControlProps> = ({
  currentTransparentUrl,
  currentFileName,
  batchUrls,
  onReset,
  isProcessing,
  status = 'idle',
  onProcessNow,
  onProcessBatch,
  batchCount = 1,
  imageType = 'photo',
  setImageType,
}) => {
  const { t } = useTranslation();

  const handleDownloadSingle = () => {
    if (!currentTransparentUrl) return;
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.8 } });
    
    const a = document.createElement('a');
    a.href = currentTransparentUrl;
    let baseName = currentFileName || `HelpMyIMG_${Date.now()}`;
    if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
    a.download = `${baseName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadBatch = () => {
    if (batchUrls.length === 0) return;
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.7 } });

    batchUrls.forEach((item, index) => {
      setTimeout(() => {
        const a = document.createElement('a');
        a.href = item.url;
        a.download = `HelpMyIMG_Batch_${index + 1}_${item.name.replace(/\.[^/.]+$/, '')}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, index * 350);
    });
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection UI (Redesigned) */}
      {setImageType && (
        <div className="space-y-4 bg-dark-800/50 p-5 rounded-2xl border border-dark-600/80 shadow-inner">
          <label className="text-sm font-bold text-white flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span>{t('remove.modeTitle')}</span>
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
              <span className={`text-xs font-bold ${imageType === 'photo' ? 'text-white' : ''}`}>{t('remove.modeAi')}</span>
              <span className="text-[9px] text-slate-500 font-medium text-center">{t('remove.modeAiDesc')}</span>
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
              <span className={`text-xs font-bold ${imageType === 'logo' ? 'text-white' : ''}`}>{t('remove.modeLogo')}</span>
              <span className="text-[9px] text-slate-500 font-medium text-center">{t('remove.modeLogoDesc')}</span>
            </button>
          </div>


        </div>
      )}

      {/* Tombol Action saat Status Idle (Belum Diproses) */}
      {status === 'idle' && (
        <div className="space-y-3">
          <button
            onClick={onProcessNow}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Play className="w-5 h-5 fill-dark-900" />
            <span>{t('work.action.cut')}</span>
          </button>

          {batchCount > 1 && onProcessBatch && (
            <button
              onClick={onProcessBatch}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 border border-neon-cyan/50 text-white font-bold text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-neon-cyan" />
              <span>{t('work.action.batch')} ({batchCount} {t('work.action.photos')})</span>
            </button>
          )}
        </div>
      )}

      {/* Tampilan Saat Sukses Diproses */}
      {status === 'done' && (
        <>
          <div className="p-4 rounded-xl bg-dark-900/60 border border-dark-600/50">
            <div className="flex items-center gap-2 text-neon-emerald font-semibold mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('remove.successTitle')}</span>
            </div>
            <p className="text-xs text-slate-300">
              {t('remove.successDesc')}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleDownloadSingle}
              disabled={!currentTransparentUrl || isProcessing}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-indigo hover:from-neon-cyan/90 hover:to-neon-indigo/90 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>{t('editor.download')}</span>
            </button>

            {batchUrls.length > 1 && (
              <button
                onClick={handleDownloadBatch}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 border border-neon-indigo/50 text-white font-bold transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Package className="w-5 h-5 text-neon-indigo" />
                <span>{t('editor.downloadBatch')} ({batchUrls.length} {t('remove.photoCount')})</span>
              </button>
            )}

            {/* Tombol Proses Ulang */}
            {onProcessNow && (
              <div className="pt-2 border-t border-dark-600">
                <button
                  onClick={onProcessNow}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-neon-cyan transition-colors text-sm font-semibold border border-dark-600"
                >
                  <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                  <span>{isProcessing ? t('work.processing') : t('remove.processAgain')}</span>
                </button>
              </div>
            )}

            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-medium text-sm transition-colors border border-dark-600 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('editor.reset')}</span>
            </button>
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center justify-center py-6 gap-3">
          <div className="text-red-500 font-bold">⚠️ {t('work.failedAi')}</div>
          <span className="text-xs font-medium text-slate-400 text-center">
            {t('work.errorHint')}
          </span>
          {onProcessNow && (
            <button
              onClick={onProcessNow}
              className="mt-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg text-white text-xs font-bold"
            >
              {t('work.action.retry')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
