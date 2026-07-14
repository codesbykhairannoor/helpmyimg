// src/components/workspace/tools/ColorBgControl.tsx
// Kontrol Penggantian Warna Solid Resmi (Pas Foto CPNS/KTP), Gradasi, dan Rasio Potong

import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Palette, RefreshCw, Check } from 'lucide-react';

interface ColorBgControlProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  onReset: () => void;
  isProcessing: boolean;
}

export const ColorBgControl: React.FC<ColorBgControlProps> = ({
  selectedColor,
  setSelectedColor,
  onReset,
  isProcessing,
}) => {
  const { t } = useTranslation();

  const officialColors = [
    { label: t('color.off.red'), hex: '#DB1514' },
    { label: t('color.off.blue'), hex: '#00529C' },
    { label: t('color.off.white'), hex: '#FFFFFF' },
    { label: t('color.off.black'), hex: '#111827' },
  ];

  return (
    <div className="space-y-6 overflow-y-visible">
      {/* Warna Resmi Indonesia */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Palette className="w-4 h-4 text-neon-pink" />
          <span>{t('color.official')}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {officialColors.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setSelectedColor(c.hex);
              }}
              className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all duration-200 text-left ${
                selectedColor === c.hex
                  ? 'border-neon-cyan bg-dark-700/80 shadow-glow-cyan'
                  : 'border-dark-600 bg-dark-800/60 hover:bg-dark-700'
              }`}
            >
              <div
                className="w-6 h-6 rounded-lg border border-white/20 flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: c.hex }}
              >
                {selectedColor === c.hex && (
                  <Check className={`w-3.5 h-3.5 ${c.hex === '#FFFFFF' ? 'text-black' : 'text-white'}`} />
                )}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-slate-200 truncate">{c.label}</div>
                <div className="text-[10px] font-mono text-slate-400">{c.hex}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Custom Color Picker */}
        <div className="flex items-center gap-3 pt-1">
          <label className="text-xs font-medium text-slate-400">{t('color.custom')}</label>
          <div className="flex items-center gap-2 bg-dark-800 border border-dark-600 px-2.5 py-1 rounded-xl flex-1">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
              }}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <span className="font-mono text-xs uppercase text-slate-300 font-bold">
              {selectedColor}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-medium text-sm transition-colors border border-dark-600 disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t('editor.reset')}</span>
        </button>
      </div>
    </div>
  );
};
