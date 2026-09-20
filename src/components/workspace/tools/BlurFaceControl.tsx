import React, { useState } from 'react';
import { ScanFace, Trash2, Droplets, RotateCcw, Upload, Plus, ShieldCheck, Grid } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';

export interface BlurBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type?: 'blur' | 'pixelate';
}

export interface BlurFaceControlProps {
  imageElement: HTMLImageElement | null;
  boxes: BlurBox[];
  setBoxes: React.Dispatch<React.SetStateAction<BlurBox[]>>;
  blurIntensity: number;
  setBlurIntensity: (val: number) => void;
  onApply: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const BlurFaceControl: React.FC<BlurFaceControlProps> = ({
  imageElement,
  boxes,
  setBoxes,
  blurIntensity,
  setBlurIntensity,
  onApply,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<'blur' | 'pixelate'>('blur');

  const handleAddBox = (type: 'blur' | 'pixelate', preset: 'center' | 'face' | 'plate' = 'center') => {
    const nw = imageElement?.naturalWidth || 800;
    const nh = imageElement?.naturalHeight || 600;

    let bw = Math.round(nw * 0.3);
    let bh = Math.round(nh * 0.3);
    let bx = Math.round((nw - bw) / 2);
    let by = Math.round((nh - bh) / 2);

    if (preset === 'face') {
      bw = Math.round(nw * 0.32);
      bh = Math.round(nh * 0.35);
      bx = Math.round((nw - bw) / 2);
      by = Math.round(nh * 0.12);
    } else if (preset === 'plate') {
      bw = Math.round(nw * 0.45);
      bh = Math.round(nh * 0.18);
      bx = Math.round((nw - bw) / 2);
      by = Math.round(nh * 0.72);
    }

    setBoxes((prev) => [
      ...prev,
      {
        id: `box_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        x: Math.max(0, bx),
        y: Math.max(0, by),
        width: Math.max(20, bw),
        height: Math.max(20, bh),
        type,
      },
    ]);
  };

  const handleChangeAllType = (newType: 'blur' | 'pixelate') => {
    setSelectedType(newType);
    setBoxes((prev) =>
      prev.map((b) => ({
        ...b,
        type: newType,
      }))
    );
  };

  return (
    <div className="flex flex-col h-full bg-dark-900 space-y-4 overflow-y-visible">
      {/* Header Info */}
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-white flex items-center gap-2">
          <ScanFace className="w-4 h-4 text-neon-cyan" />
          <span>{t('blur.options', { defaultValue: 'Sensor Wajah & Area Privat' })}</span>
        </h4>
        <p className="text-xs text-slate-400">
          {t('blur.desc', { defaultValue: 'Tarik kotak langsung di atas foto atau gunakan tombol preset di bawah.' })}
        </p>
      </div>

      {/* Style Type Selector: Blur vs Pixelate */}
      <div className="bg-dark-800/80 p-1.5 rounded-xl border border-dark-600/70 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => handleChangeAllType('blur')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'blur'
              ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-700/50 border border-transparent'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>{t('blur.typeBlur', { defaultValue: 'Blur (Halus)' })}</span>
        </button>

        <button
          type="button"
          onClick={() => handleChangeAllType('pixelate')}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            selectedType === 'pixelate'
              ? 'bg-neon-indigo/20 text-neon-indigo border border-neon-indigo/50 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-dark-700/50 border border-transparent'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{t('blur.typePixelate', { defaultValue: 'Pixelate (Mosaik)' })}</span>
        </button>
      </div>

      {/* Preset Quick Add Buttons */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {t('blur.quickAdd', { defaultValue: 'Tambah Cepat Area Sensor' })}
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => handleAddBox(selectedType, 'center')}
            className="flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-cyan/50 text-slate-300 hover:text-white font-bold text-[11px] transition-all cursor-pointer group"
          >
            <Plus className="w-3.5 h-3.5 text-neon-cyan group-hover:scale-110 transition-transform" />
            <span className="truncate">{t('blur.presetDefault', { defaultValue: 'Kotak Baru' })}</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddBox(selectedType, 'face')}
            className="flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-emerald/50 text-slate-300 hover:text-white font-bold text-[11px] transition-all cursor-pointer group"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-neon-emerald group-hover:scale-110 transition-transform" />
            <span className="truncate">{t('blur.presetFace', { defaultValue: 'Sensor Wajah' })}</span>
          </button>

          <button
            type="button"
            onClick={() => handleAddBox(selectedType, 'plate')}
            className="flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-indigo/50 text-slate-300 hover:text-white font-bold text-[11px] transition-all cursor-pointer group"
          >
            <span className="text-xs group-hover:scale-110 transition-transform">🚗</span>
            <span className="truncate">{t('blur.presetPlate', { defaultValue: 'Plat Nomor' })}</span>
          </button>
        </div>
      </div>

      {/* Intensity Settings Card */}
      <div className="bg-dark-800/80 p-3.5 rounded-2xl border border-dark-600/70 flex flex-col gap-3">
        {/* Intensity Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{t('blur.intensity', { defaultValue: 'Kekuatan Sensor' })}</span>
            </span>
            <span className="text-xs font-mono font-bold text-neon-cyan bg-dark-900/90 px-2 py-0.5 rounded-md border border-neon-cyan/30">
              {blurIntensity} px
            </span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            step="1"
            value={blurIntensity}
            onChange={(e) => setBlurIntensity(Number(e.target.value))}
            className="w-full h-2 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
          />
        </div>

        {/* Box Count & Clear */}
        <div className="flex items-center justify-between pt-2 border-t border-dark-700">
          <span className="text-xs font-semibold text-slate-400">
            {t('blur.activeAreas', { defaultValue: 'Area Aktif' })}: <strong className="text-white">{boxes.length}</strong>
          </span>
          {boxes.length > 0 && (
            <button
              type="button"
              onClick={() => setBoxes([])}
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/20 cursor-pointer transition-all active:scale-95"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t('blur.clearAll', { defaultValue: 'Hapus Semua' })}</span>
            </button>
          )}
        </div>
      </div>

      {/* Action Area */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={onApply}
          disabled={isProcessing || boxes.length === 0}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-xs tracking-wide cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isProcessing ? t('btn.processing') : t('blur.applyNow', { defaultValue: 'Terapkan Sensor Permanen' })}</span>
        </button>

        {/* Standardized 2-Button Action Grid */}
        {batchCount >= 1 && (
          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-dark-700/80">
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
    </div>
  );
};
