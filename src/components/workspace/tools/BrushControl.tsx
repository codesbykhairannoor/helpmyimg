// src/components/workspace/tools/BrushControl.tsx
// Kontrol Kuas Manual (Restore / Erase) untuk merapikan tepi potret atau helai rambut

import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Brush, Eraser, RotateCcw, Upload } from 'lucide-react';

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
      {/* Toggle Restore / Erase */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {t('brush.mode', { defaultValue: 'Mode Kuas Manual' })}
        </span>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setBrushMode('restore')}
            className={`py-3 px-3.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              brushMode === 'restore'
                ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald shadow-[0_0_15px_hsla(150,80%,48%,0.3)]'
                : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700'
            }`}
          >
            <Brush className="w-4 h-4" />
            <span>{t('brush.restore', { defaultValue: 'Pulihkan Objek' })}</span>
          </button>

          <button
            type="button"
            onClick={() => setBrushMode('erase')}
            className={`py-3 px-3.5 rounded-xl text-xs font-bold border flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
              brushMode === 'erase'
                ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_15px_hsla(330,85%,60%,0.3)]'
                : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700'
            }`}
          >
            <Eraser className="w-4 h-4" />
            <span>{t('brush.erase', { defaultValue: 'Hapus / Gosok' })}</span>
          </button>
        </div>
      </div>

      {/* Slider Ukuran Kuas */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-300">
            {t('brush.size', { defaultValue: 'Ukuran Diameter Kuas' })}
          </span>
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
        type="button"
        onClick={onResetBrush}
        disabled={isProcessing}
        className="w-full py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-500 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-sm active:scale-98"
      >
        <RotateCcw className="w-3.5 h-3.5 text-neon-pink" />
        <span>{t('brush.resetMask', { defaultValue: 'Reset Goresan Kuas' })}</span>
      </button>

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
  );
};
