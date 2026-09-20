// src/components/workspace/tools/ColorPickerControl.tsx
// Color Picker & Extractor: Click on image to pick colors, show RGB/HEX/HSL/CMYK detail
import React, { useState } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Pipette, Copy, Check, Palette, RotateCcw, Upload } from 'lucide-react';

import { type ColorInfo } from '../../../utils/colorUtils';

export interface ColorPickerControlProps {
  pickedColor: ColorInfo | null;
  colorHistory?: ColorInfo[];
  dominantColors: string[];
  onSelectColor?: (colorHex: string) => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const ColorPickerControl: React.FC<ColorPickerControlProps> = ({
  pickedColor,
  dominantColors,
  onSelectColor,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
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

      {/* Dominant Palette (No Horizontal Scroll - Clean Grid) */}
      {dominantColors.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Palette className="w-3.5 h-3.5 text-neon-cyan" />
            <span>{t('picker.palette')}</span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2.5 pt-1">
            {dominantColors.map((c, i) => (
              <button
                key={i}
                onClick={() => {
                  copyToClipboard(c.toUpperCase(), `pal-${i}`);
                  if (onSelectColor) onSelectColor(c);
                }}
                className="group relative w-full aspect-square rounded-xl border border-dark-500 hover:scale-105 transition-all shadow-md"
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
            title={t('editor.uploadOtherDesc', { defaultValue: 'Pilih dan unggah foto baru dari perangkat' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
          >
            <Upload className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
            <span className="truncate">{t('editor.uploadOther', { defaultValue: 'Upload Lain' })}</span>
          </button>
        </div>
      )}
    </div>
  );
};
