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
          <div className="flex items-center gap-4">
            <div
              className="w-20 h-20 rounded-2xl border-2 border-dark-500 shadow-lg shrink-0"
              style={{ backgroundColor: pickedColor.hex }}
            />
            <div className="flex-1 space-y-1">
              <div className="text-2xl font-mono font-extrabold text-white">{pickedColor.hex.toUpperCase()}</div>
              <div className="text-xs text-slate-400">{t('picker.clickedColor')}</div>
            </div>
          </div>

          {/* Color Values Grid */}
          <div className="space-y-2">
            {/* HEX */}
            <div className="flex items-center justify-between bg-dark-800 rounded-lg px-3 py-2 border border-dark-600">
              <span className="text-xs font-bold text-slate-400">HEX</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white">{pickedColor.hex.toUpperCase()}</span>
                <CopyBtn value={pickedColor.hex.toUpperCase()} field="hex" />
              </div>
            </div>

            {/* RGB */}
            <div className="flex items-center justify-between bg-dark-800 rounded-lg px-3 py-2 border border-dark-600">
              <span className="text-xs font-bold text-slate-400">RGB</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white">rgb({pickedColor.r}, {pickedColor.g}, {pickedColor.b})</span>
                <CopyBtn value={`rgb(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`} field="rgb" />
              </div>
            </div>

            {/* HSL */}
            <div className="flex items-center justify-between bg-dark-800 rounded-lg px-3 py-2 border border-dark-600">
              <span className="text-xs font-bold text-slate-400">HSL</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white">hsl({pickedColor.h}, {pickedColor.s}%, {pickedColor.l}%)</span>
                <CopyBtn value={`hsl(${pickedColor.h}, ${pickedColor.s}%, ${pickedColor.l}%)`} field="hsl" />
              </div>
            </div>

            {/* CMYK */}
            <div className="flex items-center justify-between bg-dark-800 rounded-lg px-3 py-2 border border-dark-600">
              <span className="text-xs font-bold text-slate-400">CMYK</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-white">cmyk({pickedColor.c}, {pickedColor.m}, {pickedColor.y}, {pickedColor.k})</span>
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
          <div className="flex gap-2 flex-wrap">
            {dominantColors.map((c, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(c.toUpperCase(), `pal-${i}`)}
                className="group relative w-10 h-10 rounded-xl border border-dark-500 hover:scale-110 transition-transform shadow-md"
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
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {t('picker.history')} ({colorHistory.length})
          </div>
          <div className="flex gap-1.5 flex-wrap max-h-24 overflow-y-auto">
            {colorHistory.map((c, i) => (
              <button
                key={i}
                onClick={() => copyToClipboard(c.hex.toUpperCase(), `hist-${i}`)}
                className="w-7 h-7 rounded-lg border border-dark-600 hover:scale-110 transition-transform"
                style={{ backgroundColor: c.hex }}
                title={c.hex.toUpperCase()}
              />
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
