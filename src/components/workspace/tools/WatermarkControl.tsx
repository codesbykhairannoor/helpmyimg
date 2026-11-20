// src/components/workspace/tools/WatermarkControl.tsx
import React, { useRef } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Type, Loader2, Layers, Image as ImageIcon, Upload, RotateCcw, Download, Sparkles } from 'lucide-react';

export type WatermarkPosition = 'center' | 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'tiled';

interface WatermarkControlProps {
  watermarkType: 'text' | 'image';
  setWatermarkType: (type: 'text' | 'image') => void;
  watermarkImage: HTMLImageElement | null;
  setWatermarkImage: (img: HTMLImageElement | null) => void;
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  watermarkColor: string;
  setWatermarkColor: (color: string) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (val: number) => void;
  watermarkPosition: WatermarkPosition;
  setWatermarkPosition: (pos: WatermarkPosition) => void;
  watermarkScale: number;
  setWatermarkScale: (val: number) => void;
  watermarkRotation: number;
  setWatermarkRotation: (val: number) => void;
  onApply?: () => void;
  onDownload?: () => void;
  onProcessBatch?: () => void;
  onReset: () => void;
  onUploadOther?: () => void;
  isProcessing: boolean;
  status?: 'idle' | 'queued' | 'processing' | 'done' | 'error';
  batchCount?: number;
}

export const WatermarkControl: React.FC<WatermarkControlProps> = ({
  watermarkType,
  setWatermarkType,
  watermarkImage,
  setWatermarkImage,
  watermarkText,
  setWatermarkText,
  watermarkColor,
  setWatermarkColor,
  watermarkOpacity,
  setWatermarkOpacity,
  watermarkPosition,
  setWatermarkPosition,
  watermarkScale,
  setWatermarkScale,
  watermarkRotation,
  setWatermarkRotation,
  onApply,
  onDownload,
  onProcessBatch,
  onReset,
  onUploadOther,
  isProcessing,
  status = 'idle',
  batchCount = 0,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        setWatermarkImage(img);
        
      };
      img.src = url;
    }
  };

  const positions: { val: WatermarkPosition; label: string }[] = [
    { val: 'center', label: t('watermark.pos.center', { defaultValue: 'Tengah' }) },
    { val: 'top-left', label: t('watermark.pos.tl', { defaultValue: 'Kiri Atas' }) },
    { val: 'top-right', label: t('watermark.pos.tr', { defaultValue: 'Kanan Atas' }) },
    { val: 'bottom-left', label: t('watermark.pos.bl', { defaultValue: 'Kiri Bawah' }) },
    { val: 'bottom-right', label: t('watermark.pos.br', { defaultValue: 'Kanan Bawah' }) },
    { val: 'tiled', label: t('watermark.pos.tiled', { defaultValue: 'Pola Berulang' }) },
  ];

  return (
    <div className="space-y-6 overflow-y-visible">
      
      {/* Type Selector */}
      <div className="flex bg-dark-800 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => { setWatermarkType('text'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${watermarkType === 'text' ? 'bg-neon-indigo text-white shadow-glow-indigo' : 'text-slate-400 hover:text-white'}`}
        >
          <Type className="w-4 h-4" /> {t('watermark.type.text')}
        </button>
        <button
          type="button"
          onClick={() => { setWatermarkType('image'); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer ${watermarkType === 'image' ? 'bg-neon-cyan text-dark-900 shadow-glow-cyan' : 'text-slate-400 hover:text-white'}`}
        >
          <ImageIcon className="w-4 h-4" /> {t('watermark.type.image')}
        </button>
      </div>

      {watermarkType === 'text' ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Type className="w-4 h-4 text-neon-cyan" />
              <span>{t('watermark.textLabel')}</span>
            </div>
          </div>
          <input
            type="text"
            value={watermarkText}
            onChange={(e) => {
              setWatermarkText(e.target.value);
            }}
            placeholder="HelpMyIMG"
            className="w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/50"
          />
        </div>
      ) : (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ImageIcon className="w-4 h-4 text-neon-cyan" />
              <span>{t('watermark.uploadLabel')}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 bg-dark-800 border border-dashed border-neon-cyan/50 rounded-xl px-4 py-4 text-sm text-slate-300 hover:bg-dark-700 transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5 text-neon-cyan" />
            <span>{watermarkImage ? t('watermark.changeLogo') : t('watermark.selectLogo')}</span>
          </button>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Advanced Settings: Color, Opacity, Scale, Rotation */}
      <div className="grid grid-cols-2 gap-4">
        {watermarkType === 'text' && (
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-400 block">{t('watermark.color')}</label>
            <div className="flex items-center gap-2 bg-dark-800 border border-dark-600 px-2.5 py-1.5 rounded-xl">
              <input
                type="color"
                value={watermarkColor}
                onChange={(e) => {
                  setWatermarkColor(e.target.value);
                }}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-xs uppercase text-slate-300 font-bold flex-1 text-center">
                {watermarkColor}
              </span>
            </div>
          </div>
        )}
        
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 block">
            {t('watermark.opacity')} ({Math.round(watermarkOpacity * 100)}%)
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={watermarkOpacity}
            onChange={(e) => {
              setWatermarkOpacity(parseFloat(e.target.value));
            }}
            className="w-full accent-neon-cyan mt-3"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 block">{t('watermark.scale')} ({Math.round(watermarkScale * 100)}%)</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={watermarkScale}
            onChange={(e) => {
              setWatermarkScale(parseFloat(e.target.value));
            }}
            className="w-full accent-neon-indigo mt-3"
          />
        </div>
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-400 block">{t('watermark.rotation')} ({watermarkRotation}°)</label>
          <input
            type="range"
            min="-180"
            max="180"
            step="5"
            value={watermarkRotation}
            onChange={(e) => {
              setWatermarkRotation(parseInt(e.target.value));
            }}
            className="w-full accent-neon-pink mt-3"
          />
        </div>
      </div>

      {/* Posisi Watermark */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Layers className="w-4 h-4 text-neon-indigo" />
          <span>{t('watermark.position')}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {positions.map((p) => (
            <button
              key={p.val}
              type="button"
              onClick={() => {
                setWatermarkPosition(p.val);
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border text-center transition-all duration-150 cursor-pointer ${
                watermarkPosition === p.val
                  ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-glow-cyan'
                  : 'bg-dark-800 border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white hover:border-dark-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-dark-600/50">
        {/* Single Photo Morphing Button */}
        {batchCount <= 1 && (
          status === 'done' && onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-semibold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 text-sm tracking-wide cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-950 stroke-[2]" />
              <span>{t('editor.downloadPhoto', { defaultValue: 'Download Foto' })}</span>
            </button>
          ) : onApply ? (
            <button
              type="button"
              onClick={onApply}
              disabled={isProcessing || (watermarkType === 'text' ? !watermarkText.trim() : !watermarkImage)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-semibold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-dark-900" />
                  <span>{t('btn.processing', { defaultValue: 'Memproses...' })}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-dark-900 shrink-0" />
                  <span>{t('watermark.apply', { defaultValue: 'Terapkan Watermark' })}</span>
                </>
              )}
            </button>
          ) : null
        )}

        {/* Batch Watermark Button */}
        {onProcessBatch && batchCount > 1 && (
          <button
            type="button"
            onClick={() => onProcessBatch()}
            disabled={isProcessing || (watermarkType === 'text' ? !watermarkText.trim() : !watermarkImage)}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-semibold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide cursor-pointer"
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 text-dark-900 animate-spin shrink-0" />
            ) : (
              <Sparkles className="w-4 h-4 text-dark-900 shrink-0" />
            )}
            <span>{t('watermark.processAll', { count: String(batchCount), defaultValue: `Watermark All (${batchCount})` })}</span>
          </button>
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
              title={t('editor.replacePhotoDesc', { defaultValue: 'Ganti foto ini dengan foto baru dari perangkat' })}
              className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white font-bold text-xs transition-all border border-dark-600 cursor-pointer disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
              <span className="truncate">{t('editor.replacePhoto', { defaultValue: 'Ganti Foto' })}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
