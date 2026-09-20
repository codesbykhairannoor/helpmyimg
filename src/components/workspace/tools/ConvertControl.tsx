import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Image as ImageIcon, RefreshCw, RotateCcw, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ConvertControlProps {
  format: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/bmp' | 'image/x-icon' | 'image/avif' | 'image/svg+xml';
  setFormat: (f: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif' | 'image/bmp' | 'image/x-icon' | 'image/avif' | 'image/svg+xml') => void;
  onConvert?: () => void;
  onDownload?: () => void;
  onProcessBatch?: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const ConvertControl: React.FC<ConvertControlProps> = ({
  format,
  setFormat,
  onConvert,
  onDownload,
  onProcessBatch,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();

  const handleConvert = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
    if (onConvert) onConvert();
    else if (onDownload) onDownload();
  };

  const handleProcessBatch = () => {
    if (onProcessBatch) onProcessBatch();
  };

  const formats = [
    { label: 'PNG', value: 'image/png' },
    { label: 'JPG / JPEG', value: 'image/jpeg' },
    { label: 'WEBP', value: 'image/webp' },
    { label: 'AVIF', value: 'image/avif' },
    { label: 'GIF', value: 'image/gif' },
    { label: 'BMP', value: 'image/bmp' },
    { label: 'ICO', value: 'image/x-icon' },
    { label: 'SVG', value: 'image/svg+xml' },
  ] as const;

  return (
    <div className="space-y-6 overflow-y-visible">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <ImageIcon className="w-4 h-4 text-neon-violet" />
          <span>{t('convert.format')}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {formats.map((f) => (
            <button
              key={f.value}
              onClick={() => setFormat(f.value)}
              className={`px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                format === f.value
                  ? 'border-neon-violet bg-neon-violet/10 text-neon-violet shadow-glow-violet'
                  : 'border-dark-600 bg-dark-800/60 hover:bg-dark-700 text-slate-300 hover:text-white hover:border-dark-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleConvert}
          disabled={isProcessing || batchCount === 0}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide"
        >
          <RefreshCw className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
          <span>{isProcessing ? t('btn.processing') : t('convert.action', { defaultValue: 'Convert Now' }).replace(/^⚡\s*/, '')}</span>
        </button>
        
        {onProcessBatch && batchCount > 1 && (
          <button
            onClick={handleProcessBatch}
            disabled={isProcessing || batchCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 border border-neon-cyan/50 text-white font-extrabold text-sm tracking-wide transition-all duration-200 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{t('convert.processAll', { count: String(batchCount) }) === 'convert.processAll' ? `Convert All (${batchCount})` : t('convert.processAll', { count: String(batchCount) })}</span>
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
              title={t('editor.uploadOtherDesc', { defaultValue: 'Pilih dan unggah foto baru dari perangkat' })}
              className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
              <span className="truncate">{t('editor.uploadOther', { defaultValue: 'Upload Lain' })}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
