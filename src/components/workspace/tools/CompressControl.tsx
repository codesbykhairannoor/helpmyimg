// src/components/workspace/tools/CompressControl.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { FileArchive, Download, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompressControlProps {
  quality: number;
  setQuality: (q: number) => void;
  originalSize?: number;
  compressedSize?: number;
  onProcess: () => void;
  onDownload: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export const CompressControl: React.FC<CompressControlProps> = ({
  quality,
  setQuality,
  originalSize,
  compressedSize,
  onProcess,
  onDownload,
  onReset,
  isProcessing,
}) => {
  const { t } = useTranslation();

  const handleProcess = () => {
    onProcess();
  };

  const handleDownload = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
    onDownload();
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const savedPercent = originalSize && compressedSize 
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

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
          <span className={`${quality <= 0.3 ? 'text-neon-cyan' : 'text-slate-500'}`}>Max Compress</span>
          <span className={`${quality > 0.3 && quality <= 0.7 ? 'text-neon-cyan' : 'text-slate-500'}`}>Balanced</span>
          <span className={`${quality > 0.7 ? 'text-neon-cyan' : 'text-slate-500'}`}>High Quality</span>
        </div>
        <p className="text-xs text-slate-400 mt-2 bg-dark-800/50 p-2.5 rounded-lg border border-dark-600/30">
          💡 {t('compress.hint')}
        </p>
      </div>

      {compressedSize ? (
        <div className="bg-dark-800/40 rounded-xl p-3.5 border border-dark-600/50 mt-4 mb-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Result Preview</div>
          <div className="flex justify-between items-center text-xs text-slate-400 mb-1.5">
            <span>Original Size:</span>
            <span className="font-mono text-slate-300">{formatSize(originalSize)}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-slate-400 mb-2">
            <span>Compressed:</span>
            <span className="font-mono text-neon-cyan font-bold">{formatSize(compressedSize)}</span>
          </div>
          <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-emerald-400">
            <span>Saved {savedPercent}%!</span>
          </div>
        </div>
      ) : null}

      <div className="space-y-3 pt-2">
        {!compressedSize ? (
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-dark-700 hover:bg-dark-600 text-white font-extrabold shadow-sm transition-all duration-200 disabled:opacity-50 border border-dark-500"
          >
            <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? t('btn.processing') : (t('compress.process') || 'Process Image')}</span>
          </button>
        ) : (
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-indigo text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            <Download className="w-5 h-5" />
            <span>{t('compress.download') || 'Download Compressed Image'}</span>
          </button>
        )}

        <button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dark-600 bg-dark-800 text-slate-300 font-semibold hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t('btn.reset')}</span>
        </button>
      </div>
    </div>
  );
};
