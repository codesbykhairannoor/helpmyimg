// src/components/workspace/tools/CompressControl.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { FileArchive, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CompressControlProps {
  quality: number;
  setQuality: (q: number) => void;
  hasCompressed?: boolean;
  onProcess: () => void;
  onProcessBatch?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const CompressControl: React.FC<CompressControlProps> = ({
  quality,
  setQuality,
  hasCompressed,
  onProcess,
  onProcessBatch,
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
        {!hasCompressed ? (
          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              disabled={isProcessing || batchCount === 0}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl bg-dark-700 hover:bg-dark-600 text-white font-extrabold shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-dark-500"
            >
              <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
              <span className="text-xs">{isProcessing ? t('btn.processing') : (t('compress.process') || 'Process 1')}</span>
            </button>
            {onProcessBatch && batchCount > 1 && (
              <button
                onClick={handleProcessBatch}
                disabled={isProcessing}
                className="flex-1 flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan font-extrabold shadow-sm transition-all duration-200 disabled:opacity-50 border border-neon-cyan/50"
              >
                <RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
                <span className="text-xs">{t('compress.processAll', { count: String(batchCount) }) === 'compress.processAll' ? `Process All (${batchCount})` : t('compress.processAll', { count: String(batchCount) })}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-dark-900/60 border border-dark-600/50 mb-3">
            <div className="flex items-center gap-2 text-neon-emerald font-semibold mb-2">
              <span className="text-xl">✅</span>
              <span>{t('remove.successTitle', { defaultValue: 'Processed Successfully' })}</span>
            </div>
            <p className="text-xs text-slate-300">
              {t('remove.successDesc', { defaultValue: 'Ready for export at the bottom of the sidebar.' })}
            </p>
          </div>
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
