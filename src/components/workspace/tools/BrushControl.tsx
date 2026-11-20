// src/components/workspace/tools/BrushControl.tsx
// Manual Brush Control (Restore / Erase / Smart Heal Inpaint) to refine edges or remove objects

import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Brush, Eraser, Wand2, RotateCcw, Upload, Download } from 'lucide-react';
import type { BrushMode } from './brush/brushEngine';

interface BrushControlProps {
  brushMode: BrushMode;
  setBrushMode: (mode: BrushMode) => void;
  brushSize: number;
  setBrushSize: (size: number) => void;
  onResetBrush: () => void;
  onReset: () => void;
  onUploadOther?: () => void;
  onDownload?: () => void;
  hasBrushed?: boolean;
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
  onDownload,
  hasBrushed = false,
  isProcessing,
  batchCount = 0,
}) => {
  const { t } = useTranslation();

  const activeColor =
    brushMode === 'restore' ? '#10b981' : brushMode === 'inpaint' ? '#f59e0b' : '#f43f5e';
  const activeBg =
    brushMode === 'restore'
      ? 'rgba(16, 185, 129, 0.25)'
      : brushMode === 'inpaint'
      ? 'rgba(245, 158, 11, 0.25)'
      : 'rgba(244, 63, 94, 0.25)';

  return (
    <div className="space-y-6">
      {/* Toggle Restore / Erase / Smart Heal */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {t('brush.mode', { defaultValue: 'Manual Brush Mode' })}
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setBrushMode('restore')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer truncate ${
              brushMode === 'restore'
                ? 'bg-neon-emerald/20 border-neon-emerald text-neon-emerald shadow-[0_0_15px_hsla(150,80%,48%,0.3)]'
                : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700'
            }`}
          >
            <Brush className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('brush.restore', { defaultValue: 'Restore' })}</span>
          </button>

          <button
            type="button"
            onClick={() => setBrushMode('erase')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer truncate ${
              brushMode === 'erase'
                ? 'bg-neon-pink/20 border-neon-pink text-neon-pink shadow-[0_0_15px_hsla(330,85%,60%,0.3)]'
                : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700'
            }`}
          >
            <Eraser className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('brush.erase', { defaultValue: 'Erase' })}</span>
          </button>

          <button
            type="button"
            onClick={() => setBrushMode('inpaint')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer truncate ${
              brushMode === 'inpaint'
                ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{t('brush.inpaint', { defaultValue: 'Smart Heal' })}</span>
          </button>
        </div>
      </div>

      {/* Brush Size Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-slate-300">
            {t('brush.size', { defaultValue: 'Brush Diameter Size' })}
          </span>
          <div className="flex items-center gap-2">
            <span
              className="inline-block rounded-full border transition-all duration-150"
              style={{
                width: `${Math.min(22, Math.max(8, brushSize / 2.5))}px`,
                height: `${Math.min(22, Math.max(8, brushSize / 2.5))}px`,
                borderColor: activeColor,
                backgroundColor: activeBg,
              }}
              title={`${brushSize}px preview`}
            />
            <span
              className={`font-mono font-bold bg-dark-900 px-2.5 py-0.5 rounded-lg border border-dark-600 ${
                brushMode === 'restore'
                  ? 'text-neon-emerald'
                  : brushMode === 'inpaint'
                  ? 'text-amber-400'
                  : 'text-neon-pink'
              }`}
            >
              {brushSize} px
            </span>
          </div>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className={`w-full h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer ${
            brushMode === 'restore'
              ? 'accent-neon-emerald'
              : brushMode === 'inpaint'
              ? 'accent-amber-400'
              : 'accent-neon-pink'
          }`}
        />
      </div>

      {/* Reset Brush Strokes Button */}
      <button
        type="button"
        onClick={onResetBrush}
        disabled={isProcessing}
        className="w-full py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dark-500 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-sm active:scale-98"
      >
        <RotateCcw className="w-3.5 h-3.5 text-neon-pink" />
        <span>{t('brush.resetMask', { defaultValue: 'Reset Brush Strokes' })}</span>
      </button>

      {/* Download Button (Morphs when strokes are applied) */}
      {hasBrushed && onDownload && (
        <button
          type="button"
          onClick={onDownload}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide cursor-pointer"
        >
          <Download className="w-4 h-4 text-slate-950 stroke-[2]" />
          <span>{t('editor.downloadPhoto', { defaultValue: 'Download Photo' })}</span>
        </button>
      )}

      {/* Standardized 2-Button Action Grid */}
      {batchCount >= 1 && (
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-dark-700/80 mt-2">
          <button
            type="button"
            onClick={onReset}
            disabled={isProcessing}
            title={t('editor.resetDesc', { defaultValue: 'Reset photo to original condition without changes' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span className="truncate">{t('editor.resetOriginal', { defaultValue: 'Reset to Original' })}</span>
          </button>

          <button
            type="button"
            onClick={onUploadOther}
            disabled={isProcessing}
            title={t('editor.replacePhotoDesc', { defaultValue: 'Replace this photo with a new photo from your device' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
            <span className="truncate">{t('editor.replacePhoto', { defaultValue: 'Replace Photo' })}</span>
          </button>
        </div>
      )}
    </div>
  );
};
