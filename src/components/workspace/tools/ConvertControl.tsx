import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Image as ImageIcon, RefreshCw, RotateCcw, Upload, ArrowRight } from 'lucide-react';
import type { ImageMimeType } from './convert/convertEngine';
import type { SvgVectorMode } from '../../utils/imageOperations';

interface ConvertControlProps {
  format: ImageMimeType;
  setFormat: (f: ImageMimeType) => void;
  svgMode?: SvgVectorMode;
  setSvgMode?: (m: SvgVectorMode) => void;
  sourceFormat?: string;
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
  svgMode = 'color',
  setSvgMode,
  sourceFormat,
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
    if (onConvert) onConvert();
    else if (onDownload) onDownload();
  };

  const handleProcessBatch = () => {
    if (onProcessBatch) onProcessBatch();
  };

  const formats = [
    { label: 'PNG', value: 'image/png', ext: 'PNG', badge: 'OxiPNG' },
    { label: 'JPG', value: 'image/jpeg', ext: 'JPG', badge: 'MozJPEG' },
    { label: 'WEBP', value: 'image/webp', ext: 'WEBP', badge: 'LibWebP' },
    { label: 'AVIF', value: 'image/avif', ext: 'AVIF', badge: 'LibAVIF' },
    { label: 'JXL', value: 'image/jxl', ext: 'JXL', badge: 'JPEG XL' },
    { label: 'SVG', value: 'image/svg+xml', ext: 'SVG', badge: 'Vector' },
    { label: 'ICO', value: 'image/x-icon', ext: 'ICO', badge: 'Favicon' },
    { label: 'GIF', value: 'image/gif', ext: 'GIF', badge: 'Graphic' },
    { label: 'BMP', value: 'image/bmp', ext: 'BMP', badge: 'Bitmap' },
  ] as const;

  const currentFormatObj = formats.find((f) => f.value === format) || formats[0];

  return (
    <div className="space-y-5 overflow-y-visible">
      {/* Format Selection Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <ImageIcon className="w-4 h-4 text-neon-cyan" />
            <span>{t('convert.format', { defaultValue: 'Pilih Format Target' })}</span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-neon-cyan/15 text-neon-cyan font-mono text-[10px] font-bold border border-neon-cyan/30">
            {currentFormatObj.badge}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {formats.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFormat(f.value)}
              className={`py-2 px-1 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer text-center ${
                format === f.value
                  ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan shadow-glow-cyan'
                  : 'border-dark-600 bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white hover:border-dark-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* True Vector SVG Tracing Mode Selector (Visible only when SVG is selected) */}
      {format === 'image/svg+xml' && setSvgMode && (
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            {t('convert.svgModeLabel', { defaultValue: 'SVG Vector Mode' })}
          </div>
          <div className="grid grid-cols-2 gap-1.5 bg-dark-900/70 p-1 rounded-xl border border-dark-700">
            <button
              type="button"
              onClick={() => setSvgMode('color')}
              className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer truncate ${
                svgMode === 'color'
                  ? 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {t('convert.svgColor', { defaultValue: 'Full-Color Curves' })}
            </button>
            <button
              type="button"
              onClick={() => setSvgMode('monochrome')}
              className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer truncate ${
                svgMode === 'monochrome'
                  ? 'bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {t('convert.svgMono', { defaultValue: 'Monochrome Potrace' })}
            </button>
          </div>
        </div>
      )}

      {/* Conversion Path Info Card */}
      <div className="p-3.5 rounded-2xl bg-dark-800/80 border border-dark-600/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-lg bg-dark-700 border border-dark-500 text-xs font-mono font-bold text-slate-300 uppercase">
            {sourceFormat || 'ORIGINAL'}
          </span>
          <ArrowRight className="w-4 h-4 text-neon-cyan shrink-0" />
          <span className="px-2.5 py-1 rounded-lg bg-neon-cyan/20 border border-neon-cyan/60 text-xs font-mono font-bold text-neon-cyan uppercase shadow-sm">
            {currentFormatObj.ext}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-400 text-right">
          {currentFormatObj.badge} Output
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        {/* Main Action Button: Convert Now / Convert All */}
        {batchCount > 1 ? (
          <button
            type="button"
            onClick={handleProcessBatch}
            disabled={isProcessing || batchCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold text-sm tracking-wide shadow-glow-cyan transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>
              {isProcessing
                ? t('work.processing', { defaultValue: 'Converting...' })
                : t('convert.processAll', { count: String(batchCount), defaultValue: `Convert All (${batchCount})` })}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConvert}
            disabled={isProcessing || batchCount === 0}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold text-sm tracking-wide shadow-glow-cyan transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 shrink-0 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>
              {isProcessing
                ? t('work.processing', { defaultValue: 'Converting...' })
                : t('convert.convertNow', { defaultValue: 'Convert Now' })}
            </span>
          </button>
        )}

        {/* Standardized 2-Button Action Grid */}
        {batchCount >= 1 && (
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-dark-700/80">
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
