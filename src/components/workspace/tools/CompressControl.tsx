import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { FileArchive, RefreshCw, RotateCcw, Upload } from 'lucide-react';

interface CompressControlProps {
  quality: number;
  setQuality: (q: number) => void;
  hasCompressed?: boolean;
  onProcess: () => void;
  onProcessBatch?: () => void;
  onDownload?: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const CompressControl: React.FC<CompressControlProps> = ({
  quality,
  setQuality,
  onProcess,
  onProcessBatch,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();

  const handleProcess = () => {
    onProcess();
  };

  const handleProcessBatch = () => {
    if (onProcessBatch) onProcessBatch();
  };


  return (
    <div className="space-y-6 overflow-y-visible">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-sm font-semibold text-white">
          <div className="flex items-center gap-2">
            <FileArchive className="w-4 h-4 text-neon-cyan" />
            <span>{t('compress.quality')}</span>
          </div>
          <span className="font-mono text-neon-cyan">{Math.round(quality * 100)}%</span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
        />
        <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider pt-1">
          <span className={`${quality <= 0.3 ? 'text-neon-cyan' : 'text-slate-500'}`}>{t('compress.maxCompress', { defaultValue: 'Max Compress' })}</span>
          <span className={`${quality > 0.3 && quality <= 0.7 ? 'text-neon-cyan' : 'text-slate-500'}`}>{t('compress.balanced', { defaultValue: 'Balanced' })}</span>
          <span className={`${quality > 0.7 ? 'text-neon-cyan' : 'text-slate-500'}`}>{t('compress.highQuality', { defaultValue: 'High Quality' })}</span>
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleProcess}
          disabled={isProcessing || batchCount === 0}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide"
        >
          <RefreshCw className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? t('btn.processing') : (t('compress.process') || 'Compress Now')}</span>
        </button>

        {onProcessBatch && batchCount > 1 && (
          <button
            onClick={handleProcessBatch}
            disabled={isProcessing || batchCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 border border-neon-cyan/50 text-white font-extrabold text-sm tracking-wide transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{t('compress.processAll', { count: String(batchCount) }) === 'compress.processAll' ? `Process All (${batchCount})` : t('compress.processAll', { count: String(batchCount) })}</span>
          </button>
        )}

        {/* Standardized 2-Button Action Grid */}
        {batchCount >= 1 && (
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-dark-700/80 mt-2">
            <button
              type="button"
              onClick={onReset}
              disabled={isProcessing}
              title={t('editor.resetDesc', { defaultValue: 'Kembalikan foto ini ke kondisi asli tanpa perubahan' })}
              className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
              <span className="truncate">{t('editor.resetOriginal', { defaultValue: 'Reset ke Asli' })}</span>
            </button>

            <button
              type="button"
              onClick={onUploadOther}
              disabled={isProcessing}
              title={t('editor.replacePhotoDesc', { defaultValue: 'Ganti foto ini dengan foto baru dari perangkat' })}
              className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
              <span className="truncate">{t('editor.replacePhoto', { defaultValue: 'Ganti Foto' })}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
