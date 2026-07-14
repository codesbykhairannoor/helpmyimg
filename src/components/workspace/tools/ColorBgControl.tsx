// src/components/workspace/tools/ColorBgControl.tsx
// Kontrol Penggantian Warna Solid Resmi (Pas Foto CPNS/KTP), Gradasi, dan Rasio Potong

import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Palette, RefreshCw, Check } from 'lucide-react';

interface ColorBgControlProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onReset: () => void;
  onUploadOther?: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const ColorBgControl: React.FC<ColorBgControlProps> = ({
  selectedColor,
  setSelectedColor,
  onReset,
  onUploadOther,
  isProcessing,
  batchCount = 0,
}) => {
  const { t } = useTranslation();

  const officialColors = [
    { label: t('color.off.red'), hex: '#DB1514' },
    { label: t('color.off.blue'), hex: '#00529C' },
    { label: t('color.off.white'), hex: '#FFFFFF' },
    { label: t('color.off.black'), hex: '#111827' },
  ];

  return (
    <div className="space-y-6">
      {/* Warna Resmi Pas Foto CPNS & KTP */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Palette className="w-4 h-4 text-neon-cyan" />
          <span>{t('color.officialTitle')}</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {officialColors.map((col) => (
            <button
              key={col.hex}
              onClick={() => setSelectedColor(col.hex)}
              disabled={isProcessing}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                selectedColor === col.hex
                  ? 'border-neon-cyan bg-neon-cyan/10 text-white font-bold shadow-sm'
                  : 'border-dark-600 bg-dark-800/80 hover:bg-dark-700 text-slate-300'
              }`}
            >
              <span
                className="w-5 h-5 rounded-full border border-white/20 shrink-0 flex items-center justify-center shadow-inner"
                style={{ backgroundColor: col.hex }}
              >
                {selectedColor === col.hex && (
                  <Check className={`w-3 h-3 ${col.hex === '#FFFFFF' ? 'text-dark-900' : 'text-white'}`} />
                )}
              </span>
              <span className="text-xs truncate">{col.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="space-y-3 pt-2 border-t border-dark-700/60">
        <label className="text-xs font-bold text-slate-300">{t('color.customTitle')}</label>
        <div className="flex items-center gap-3 bg-dark-800 p-2.5 rounded-xl border border-dark-600">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            disabled={isProcessing}
            className="w-10 h-10 rounded-lg bg-transparent cursor-pointer border-0 p-0"
          />
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">HEX Code</span>
            <span className="text-sm font-mono font-bold text-white uppercase tracking-wide">
              {selectedColor}
            </span>
          </div>
        </div>
      </div>

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
