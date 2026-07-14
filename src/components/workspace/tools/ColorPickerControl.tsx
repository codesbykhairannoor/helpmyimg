// src/components/workspace/tools/ColorPickerControl.tsx
// Color Picker & Extractor: Click on image to pick colors, show RGB/HEX/HSL/CMYK detail
import React, { useState } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Pipette, Copy, Check, Palette, RefreshCw } from 'lucide-react';

import { type ColorInfo } from '../../../utils/colorUtils';

export interface ColorPickerControlProps {
  pickedColor: ColorInfo | null;
  colorHistory: ColorInfo[];
  dominantColors: string[];
  onReset: () => void;
  isProcessing: boolean;
}

export const ColorPickerControl: React.FC<ColorPickerControlProps> = ({
  pickedColor,
  colorHistory,
  dominantColors,
  onReset,
  isProcessing,
}) => {
  const { t } = useTranslation();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const CopyBtn = ({ value, field }: { value: string; field: string }) => (
    <button
      onClick={() => copyToClipboard(value, field)}
      className="p-1 rounded hover:bg-dark-600 transition-colors"
      title="Copy"
    >
      {copiedField === field ? <Check className="w-3.5 h-3.5 text-neon-emerald" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
    </button>
  );

  return (
    <div className="space-y-5 max-h-[600px] overflow-y-auto pr-1">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm font-semibold text-white">
        <Pipette className="w-4 h-4 text-neon-pink" />
        <span>{t('picker.title')}</span>
      </div>

      {/* Instruction */}
      <div className="bg-dark-800/60 rounded-xl p-3 border border-neon-pink/30 text-xs text-slate-300 flex items-start gap-2">
        <Pipette className="w-4 h-4 text-neon-pink shrink-0 mt-0.5" />
        <span>{t('picker.instruction')}</span>
      </div>

      {/* Picked Color Display */}
      {pickedColor ? (
        <div className="space-y-4">
          {/* Big Color Swatch */}
          <div className="flex items-center gap-3 md:gap-4">
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-dark-500 shadow-lg shrink-0"
              style={{ backgroundColor: pickedColor.hex }}
            />
            <div className="flex-1 space-y-0.5 md:space-y-1">
              <div className="text-xl md:text-2xl font-mono font-extrabold text-white">{pickedColor.hex.toUpperCase()}</div>
              <div className="text-[10px] md:text-xs text-slate-400">{t('picker.clickedColor')}</div>
            </div>
          </div>

          {/* Color Values Grid (Genius UX: 2 columns on all devices) */}
          <div className="grid grid-cols-2 gap-2">
            {/* HEX */}
            <div className="flex flex-col justify-center bg-dark-800 rounded-lg p-2 border border-dark-600 relative group">
              <span className="text-[9px] font-bold text-slate-500 mb-0.5">HEX</span>
              <span className="text-xs md:text-sm font-mono text-white truncate pr-6">{pickedColor.hex.toUpperCase()}</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <CopyBtn value={pickedColor.hex.toUpperCase()} field="hex" />
              </div>
            </div>

            {/* RGB */}
            <div className="flex flex-col justify-center bg-dark-800 rounded-lg p-2 border border-dark-600 relative group">
              <span className="text-[9px] font-bold text-slate-500 mb-0.5">RGB</span>
              <span className="text-[10px] md:text-xs font-mono text-white truncate pr-6">{pickedColor.r}, {pickedColor.g}, {pickedColor.b}</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <CopyBtn value={`rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`} field="rgb" />
              </div>
            </div>

            {/* HSL */}
            <div className="flex flex-col justify-center bg-dark-800 rounded-lg p-2 border border-dark-600 relative group">
              <span className="text-[9px] font-bold text-slate-500 mb-0.5">HSL</span>
              <span className="text-[10px] md:text-xs font-mono text-white truncate pr-6">{pickedColor.h}, {pickedColor.s}%, {pickedColor.l}%</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <CopyBtn value={`hsl(${pickedColor.h}, ${pickedColor.s}%, ${pickedColor.l}%)`} field="hsl" />
              </div>
            </div>

            {/* CMYK */}
            <div className="flex flex-col justify-center bg-dark-800 rounded-lg p-2 border border-dark-600 relative group">
              <span className="text-[9px] font-bold text-slate-500 mb-0.5">CMYK</span>
              <span className="text-[10px] md:text-xs font-mono text-white truncate pr-6">{pickedColor.c}, {pickedColor.m}, {pickedColor.y}, {pickedColor.k}</span>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <CopyBtn value={`cmyk(${pickedColor.c}, ${pickedColor.m}, ${pickedColor.y}, ${pickedColor.k})`} field="cmyk" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500 text-sm">
          {t('picker.noColor')}
        </div>
      )}

      {/* Dominant Palette */}
      {dominantColors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5" />
            <span>{t('picker.palette')}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {dominantColors.map((c, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(c.toUpperCase(), `pal-${i}`)}
                className="group relative w-10 h-10 shrink-0 rounded-xl border border-dark-500 hover:scale-110 transition-transform shadow-md"
                style={{ backgroundColor: c }}
                title={c.toUpperCase()}
              >
                {copiedField === `pal-${i}` && (
                  <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color History */}
      {colorHistory.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center">
            <span>{t('picker.history')} ({colorHistory.length})</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
            {colorHistory.map((c, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(c.hex.toUpperCase(), `hist-${i}`)}
                className="group relative w-7 h-7 shrink-0 rounded-full border border-dark-500 hover:scale-110 transition-transform shadow-sm"
                style={{ backgroundColor: c.hex }}
                title={c.hex.toUpperCase()}
              >
                {copiedField === `hist-${i}` && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        disabled={isProcessing}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dark-600 bg-dark-800 text-slate-300 font-semibold hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50"
      >
        <RefreshCw className="w-4 h-4" />
        <span>{t('btn.reset')}</span>
      </button>
    </div>
  );
};
