// src/components/workspace/tools/design/components/StudioExportModal.tsx
// Modal Ekspor Gambar Studio: Format (PNG/JPG/WebP), Kualitas & Resolusi

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Download, Loader2, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { ExportOptions } from '../exportCompositor';

interface StudioExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalDimensions: { width: number; height: number };
  onConfirmExport: (options: ExportOptions) => Promise<void>;
  isExporting: boolean;
}

export const StudioExportModal: React.FC<StudioExportModalProps> = ({
  isOpen,
  onClose,
  originalDimensions,
  onConfirmExport,
  isExporting,
}) => {
  const { t } = useTranslation();

  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [quality, setQuality] = useState<number>(0.92);
  const [resolutionMode, setResolutionMode] = useState<'original' | 'fhd' | 'hd'>('original');

  if (!isOpen) return null;

  const maxDimension =
    resolutionMode === 'original'
      ? undefined
      : resolutionMode === 'fhd'
      ? 1920
      : 1280;

  const handleExport = async () => {
    await onConfirmExport({
      format,
      quality,
      maxDimension,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-5 select-none text-slate-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {t('studio.export.title', { defaultValue: 'Ekspor Hasil Editan' })}
              </h3>
              <p className="text-xs text-slate-400">
                {t('studio.export.subtitle', { defaultValue: 'Pilih format dan resolusi penyimpanan' })}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Pilihan Format */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {t('studio.export.format', { defaultValue: 'Format Gambar' })}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'png', label: 'PNG', desc: 'Lossless' },
                { id: 'jpeg', label: 'JPEG', desc: 'Foto Ringan' },
                { id: 'webp', label: 'WEBP', desc: 'Web Modern' },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFormat(item.id)}
                className={`py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  format === item.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="text-xs">{item.label}</div>
                <div className="text-[10px] opacity-75">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Slider Kualitas (Hanya jika JPEG / WebP) */}
        {format !== 'png' && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">
                {t('studio.export.quality', { defaultValue: 'Kualitas Kompresi' })}
              </span>
              <span className="font-mono text-cyan-400 font-bold">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>
        )}

        {/* Pilihan Resolusi */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300">
            {t('studio.export.resolution', { defaultValue: 'Resolusi Output' })}
          </label>
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setResolutionMode('original')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                resolutionMode === 'original'
                  ? 'bg-cyan-500/15 border-cyan-400 text-white font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-200">
                  {t('studio.export.resOriginal', { defaultValue: 'Resolusi Asli (Kualitas Penuh)' })}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {originalDimensions.width} × {originalDimensions.height} px
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                PRO • HD
              </span>
            </button>

            <button
              type="button"
              onClick={() => setResolutionMode('fhd')}
              className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                resolutionMode === 'fhd'
                  ? 'bg-cyan-500/15 border-cyan-400 text-white font-medium'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800/60'
              }`}
            >
              <div>
                <div className="text-xs font-bold text-slate-200">Full HD (1080p)</div>
                <div className="text-[11px] text-slate-400">Ideal untuk Instagram, WhatsApp & Web</div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                FAVORIT
              </span>
            </button>
          </div>
        </div>

        {/* Tombol Aksi */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isExporting}
            className="flex-1 h-11 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            {t('common.cancel', { defaultValue: 'Batal' })}
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-[2] h-11 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>{t('studio.export.rendering', { defaultValue: 'Merender 4K...' })}</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('studio.export.downloadBtn', { defaultValue: 'Unduh Sekarang' })}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
