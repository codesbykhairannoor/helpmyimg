// src/components/workspace/tools/CropControl.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Crop, RefreshCw } from 'lucide-react';

interface CropControlProps {
  originalWidth: number;
  originalHeight: number;
  cropX: number;
  setCropX: (v: number) => void;
  cropY: number;
  setCropY: (v: number) => void;
  cropWidth: number;
  setCropWidth: (v: number) => void;
  cropHeight: number;
  setCropHeight: (v: number) => void;
  cropRadius: number;
  setCropRadius: (v: number) => void;
  onApply: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const CropControl: React.FC<CropControlProps> = ({
  originalWidth,
  originalHeight,
  cropX,
  setCropX,
  cropY,
  setCropY,
  cropWidth,
  setCropWidth,
  cropHeight,
  setCropHeight,
  cropRadius = 0,
  setCropRadius,
  onApply,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();

  // Presets
  const presets = [
    { label: '1:1', w: Math.min(originalWidth, originalHeight), h: Math.min(originalWidth, originalHeight) },
    { label: '4:3', w: originalWidth, h: Math.round(originalWidth * 3 / 4) },
    { label: '16:9', w: originalWidth, h: Math.round(originalWidth * 9 / 16) },
    { label: '3:2', w: originalWidth, h: Math.round(originalWidth * 2 / 3) },
  ];

  return (
    <div className="space-y-6 overflow-y-visible">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Crop className="w-4 h-4 text-neon-violet" />
          <span>{t('crop.title')}</span>
        </div>

        {/* Crop Presets */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">{t('crop.presets')}</label>
          <div className="flex flex-wrap gap-2">
            {presets.map(p => (
              <button
                key={p.label}
                onClick={() => {
                  setCropX(0);
                  setCropY(0);
                  setCropWidth(Math.min(p.w, originalWidth));
                  setCropHeight(Math.min(p.h, originalHeight));
                }}
                className="px-3 py-1.5 rounded-lg bg-dark-800 border border-dark-600 hover:border-neon-violet text-xs font-semibold text-slate-300 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* X & Y Position */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">X ({t('crop.offset')})</label>
            <input
              type="number"
              value={cropX || 0}
              min={0}
              max={originalWidth - 1}
              onChange={(e) => setCropX(Math.max(0, Math.min(parseInt(e.target.value) || 0, originalWidth - 1)))}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-violet text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">Y ({t('crop.offset')})</label>
            <input
              type="number"
              value={cropY || 0}
              min={0}
              max={originalHeight - 1}
              onChange={(e) => setCropY(Math.max(0, Math.min(parseInt(e.target.value) || 0, originalHeight - 1)))}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-violet text-sm"
            />
          </div>
        </div>

        {/* Width & Height */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">{t('crop.width')} (px)</label>
            <input
              type="number"
              value={cropWidth || ''}
              min={1}
              max={originalWidth - cropX}
              onChange={(e) => setCropWidth(Math.max(1, Math.min(parseInt(e.target.value) || 1, originalWidth - cropX)))}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-violet text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-400 font-medium">{t('crop.height')} (px)</label>
            <input
              type="number"
              value={cropHeight || ''}
              min={1}
              max={originalHeight - cropY}
              onChange={(e) => setCropHeight(Math.max(1, Math.min(parseInt(e.target.value) || 1, originalHeight - cropY)))}
              className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-violet text-sm"
            />
          </div>
        </div>
        
        {/* Border Radius (Lengkungan) */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <label className="text-slate-400 font-medium">{t('crop.radius', { defaultValue: 'Lengkungan' })}</label>
            <span className="text-neon-violet font-bold">{cropRadius}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={cropRadius}
            onChange={(e) => setCropRadius(parseInt(e.target.value))}
            className="w-full accent-neon-violet h-1.5 bg-dark-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>


      <div className="space-y-3 pt-2">
        <button
          onClick={onApply}
          disabled={isProcessing || cropWidth <= 0 || cropHeight <= 0}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide"
        >
          <span>{isProcessing ? t('btn.processing') : t('work.action.apply', { defaultValue: 'Apply' })}</span>
        </button>

        {batchCount === 1 && (
          <button
            onClick={onUploadOther || onReset}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dark-600 bg-dark-800 text-slate-300 font-semibold hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4 text-neon-cyan" />
            <span>{t('editor.reset')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
