// src/components/workspace/tools/BrushControl.tsx
// Kontrol Kuas Manual (Restore / Erase) untuk merapikan tepi potret atau helai rambut

import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Brush, Eraser, RotateCcw, RefreshCw } from 'lucide-react';

interface BrushControlProps {
  brushMode: 'restore' | 'erase';
  setBrushMode: (mode: 'restore' | 'erase') => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onResetBrush: () => void;
  onReset: () => void;
  onUploadOther?: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const BrushControl: React.FC<BrushControlProps> = ({
  brushMode,
  setBrushMode,
  brushSize,
  setBrushSize,
  onResetBrush,
  onReset,
  onUploadOther,
  isProcessing,
  batchCount = 0,
}) => {
  const { t } = useTranslation();


  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-dark-900/60 border border-dark-600/50">
        <div className="flex items-center gap-2 text-neon-pink font-semibold mb-2">
          <Brush className="w-5 h-5 text-neon-pink" />
          <span>{t('brush.title')}</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          {t('brush.desc')}
        </p>
      </div>

      {/* Toggle Restore / Erase */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {t('brush.mode')}
        </span>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setBrushMode('restore')}
            className={`py-3 px-3.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-all duration-200 ${
              brushMode === 'restore'
                ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald shadow-[0_0_15px_hsla(150,80%,48%,0.3)]'
                : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700'
            }`}
          >
            <Brush className="w-4 h-4" />
            <span>{t('brush.restore')}</span>
          </button>

          <button
            onClick={() => setBrushMode('erase')}
            className={`py-3 px-3.5 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-all duration-200 ${
              brushMode === 'erase'
                ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_15px_hsla(330,85%,60%,0.3)]'
                : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700'
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span>{t('brush.erase')}</span>
          </button>
        </div>
      </div>

      {/* Slider Ukuran Kuas */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-slate-200">{t('brush.size')}</span>
          <span className="font-mono text-neon-pink font-bold bg-dark-900 px-2.5 py-0.5 rounded-lg border border-dark-600">
            {brushSize} px
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer accent-neon-pink"
        />
      </div>

      {/* Tombol Reset Kuas */}
      <button
        onClick={onResetBrush}
        disabled={isProcessing}
        className="w-full py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-500 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t('brush.resetMask')}</span>
      </button>

      {/* Action Buttons */}
      {batchCount === 1 && (
        <div className="space-y-3 pt-2">
          <button
            onClick={onUploadOther || onReset}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-medium text-sm transition-colors border border-dark-600 disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('editor.reset')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
