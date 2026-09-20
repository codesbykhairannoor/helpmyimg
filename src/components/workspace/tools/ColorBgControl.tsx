// src/components/workspace/tools/ColorBgControl.tsx
// Kontrol Penggantian Background Lengkap: Warna Solid Pas Foto, Gradasi Modern, Upload Foto Background Sendiri, & Preset Scene Studio

import React, { useRef } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Palette, RefreshCw, Check, Upload, Image as ImageIcon, Sparkles, Sliders, X } from 'lucide-react';

export type BgMode = 'color' | 'gradient' | 'image' | 'preset';

export interface PresetScene {
  id: string;
  name: string;
  dataUrl: string;
}

// Preset Scene backdrops generated as lightweight SVG Data URLs (100% offline & instant)
export const PRESET_SCENES: PresetScene[] = [
  {
    id: 'studio_spotlight',
    name: 'Photo Studio',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><defs><radialGradient id="g" cx="50%" cy="40%" r="65%"><stop offset="0%" stop-color="%23475569"/><stop offset="50%" stop-color="%231e293b"/><stop offset="100%" stop-color="%230f172a"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23g)"/></svg>`
  },
  {
    id: 'modern_office',
    name: 'Modern Office',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><defs><linearGradient id="o" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%23334155"/><stop offset="100%" stop-color="%230f172a"/></linearGradient><radialGradient id="light" cx="80%" cy="20%" r="50%"><stop offset="0%" stop-color="%2338bdf8" stop-opacity="0.35"/><stop offset="100%" stop-color="%23000000" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23o)"/><rect width="100%" height="100%" fill="url(%23light)"/></svg>`
  },
  {
    id: 'bokeh_lights',
    name: 'Bokeh Lights',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><defs><radialGradient id="bg" cx="50%" cy="50%" r="70%"><stop offset="0%" stop-color="%2318181b"/><stop offset="100%" stop-color="%2309090b"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23bg)"/><circle cx="250" cy="200" r="140" fill="%23f59e0b" opacity="0.18" filter="blur(40px)"/><circle cx="950" cy="250" r="180" fill="%23ec4899" opacity="0.16" filter="blur(50px)"/><circle cx="600" cy="700" r="160" fill="%2306b6d4" opacity="0.15" filter="blur(45px)"/><circle cx="800" cy="500" r="120" fill="%238b5cf6" opacity="0.2" filter="blur(35px)"/></svg>`
  },
  {
    id: 'nature_garden',
    name: 'Nature Blur',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><defs><linearGradient id="n" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%23064e3b"/><stop offset="50%" stop-color="%23047857"/><stop offset="100%" stop-color="%23022c22"/></linearGradient><circle id="sun" cx="850" cy="150" r="220" fill="%23fde047" opacity="0.25" filter="blur(60px)"/></defs><rect width="100%" height="100%" fill="url(%23n)"/><use href="%23sun"/><circle cx="300" cy="650" r="180" fill="%2310b981" opacity="0.3" filter="blur(40px)"/></svg>`
  },
  {
    id: 'aesthetic_minimal',
    name: 'Aesthetic Wall',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><defs><linearGradient id="w" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23f8fafc"/><stop offset="50%" stop-color="%23e2e8f0"/><stop offset="100%" stop-color="%23cbd5e1"/></linearGradient><radialGradient id="shadow" cx="30%" cy="30%" r="60%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.9"/><stop offset="100%" stop-color="%2364748b" stop-opacity="0.25"/></radialGradient></defs><rect width="100%" height="100%" fill="url(%23w)"/><rect width="100%" height="100%" fill="url(%23shadow)"/></svg>`
  },
  {
    id: 'sunset_vibes',
    name: 'Sunset Ambient',
    dataUrl: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900"><defs><linearGradient id="s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff512f"/><stop offset="50%" stop-color="%23dd2476"/><stop offset="100%" stop-color="%237928ca"/></linearGradient></defs><rect width="100%" height="100%" fill="url(%23s)"/></svg>`
  }
];

export interface GradientOption {
  id: string;
  name: string;
  value: string;
}

export const GRADIENT_PRESETS: GradientOption[] = [
  { id: 'sunset', name: 'Sunset Glow', value: '#FF512F,#DD2476' },
  { id: 'cyberpunk', name: 'Cyber Neon', value: '#00F2FE,#4FACFE' },
  { id: 'deepspace', name: 'Deep Space', value: '#1A1A2E,#16213E' },
  { id: 'studio', name: 'Studio Gray', value: '#E2E8F0,#94A3B8' },
  { id: 'velvet', name: 'Royal Velvet', value: '#8A2387,#E94057' },
  { id: 'emerald', name: 'Emerald Aura', value: '#11998E,#38EF7D' },
  { id: 'peach', name: 'Warm Peach', value: '#FA709A,#FEE140' },
  { id: 'frosted', name: 'Frosted Sky', value: '#89F7FE,#66A6FF' },
];

interface ColorBgControlProps {
  bgMode: BgMode;
  setBgMode: (mode: BgMode) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedGradient: string;
  setSelectedGradient: (gradient: string) => void;
  customBgUrl: string | null;
  onUploadCustomBg: (file: File) => void;
  onClearCustomBg: () => void;
  selectedPreset: string;
  setSelectedPreset: (presetId: string) => void;
  bgBlur: number;
  setBgBlur: (blur: number) => void;
  onReset: () => void;
  onUploadOther?: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const ColorBgControl: React.FC<ColorBgControlProps> = ({
  bgMode,
  setBgMode,
  selectedColor,
  setSelectedColor,
  selectedGradient,
  setSelectedGradient,
  customBgUrl,
  onUploadCustomBg,
  onClearCustomBg,
  selectedPreset,
  setSelectedPreset,
  bgBlur,
  setBgBlur,
  onReset,
  onUploadOther,
  isProcessing,
  batchCount = 0,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const officialColors = [
    { label: t('color.off.red', { defaultValue: 'Merah Paspor' }), hex: '#DB1514' },
    { label: t('color.off.blue', { defaultValue: 'Biru Paspor' }), hex: '#00529C' },
    { label: t('color.off.white', { defaultValue: 'Putih Bersih' }), hex: '#FFFFFF' },
    { label: t('color.off.black', { defaultValue: 'Hitam Studio' }), hex: '#111827' },
    { label: t('color.off.gray', { defaultValue: 'Abu Soft' }), hex: '#E5E7EB' },
    { label: t('color.off.pink', { defaultValue: 'Pastel Pink' }), hex: '#F472B6' },
    { label: t('color.off.green', { defaultValue: 'Mint Green' }), hex: '#10B981' },
    { label: t('color.off.sky', { defaultValue: 'Sky Blue' }), hex: '#0284C7' },
  ];

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Custom Background Image */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            onUploadCustomBg(e.target.files[0]);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-dark-900 rounded-xl border border-dark-700/80">
        <button
          type="button"
          onClick={() => setBgMode('color')}
          className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            bgMode === 'color'
              ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span className="truncate">{t('color.tab.solid', { defaultValue: 'Solid' })}</span>
        </button>

        <button
          type="button"
          onClick={() => setBgMode('gradient')}
          className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            bgMode === 'gradient'
              ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="truncate">{t('color.tab.gradient', { defaultValue: 'Gradient' })}</span>
        </button>

        <button
          type="button"
          onClick={() => setBgMode('image')}
          className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            bgMode === 'image'
              ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span className="truncate">{t('color.tab.upload', { defaultValue: 'Upload' })}</span>
        </button>

        <button
          type="button"
          onClick={() => setBgMode('preset')}
          className={`py-2 px-1 text-xs font-bold rounded-lg flex flex-col sm:flex-row items-center justify-center gap-1 transition-all ${
            bgMode === 'preset'
              ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span className="truncate">{t('color.tab.scenes', { defaultValue: 'Scene' })}</span>
        </button>
      </div>

      {/* Tab 1: Solid Color */}
      {bgMode === 'color' && (
        <div className="space-y-4">
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Palette className="w-4 h-4 text-neon-cyan" />
              <span>{t('color.officialTitle', { defaultValue: 'Official Passport & ID Colors' })}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {officialColors.map((col) => (
                <button
                  key={col.hex}
                  type="button"
                  onClick={() => setSelectedColor(col.hex)}
                  disabled={isProcessing}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
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
                      <Check className={`w-3 h-3 ${col.hex === '#FFFFFF' || col.hex === '#E5E7EB' ? 'text-dark-900' : 'text-white'}`} />
                    )}
                  </span>
                  <span className="text-xs truncate">{col.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div className="space-y-2.5 pt-2 border-t border-dark-700/60">
            <label className="text-xs font-bold text-slate-300">{t('color.customTitle', { defaultValue: 'Custom Hex Color Picker' })}</label>
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
        </div>
      )}

      {/* Tab 2: Gradient Backgrounds */}
      {bgMode === 'gradient' && (
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span>{t('color.gradientTitle', { defaultValue: 'Modern Studio Gradients' })}</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {GRADIENT_PRESETS.map((grad) => {
              const [c1, c2] = grad.value.split(',');
              const isSelected = selectedGradient === grad.value;
              return (
                <button
                  key={grad.id}
                  type="button"
                  onClick={() => setSelectedGradient(grad.value)}
                  disabled={isProcessing}
                  className={`flex items-center gap-2.5 p-2 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neon-cyan bg-neon-cyan/10 text-white font-bold shadow-sm'
                      : 'border-dark-600 bg-dark-800/80 hover:bg-dark-700 text-slate-300'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-lg border border-white/20 shrink-0 flex items-center justify-center shadow-inner"
                    style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                  </span>
                  <span className="text-xs truncate">{grad.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Upload Custom Background Photo */}
      {bgMode === 'image' && (
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <Upload className="w-4 h-4 text-neon-cyan" />
            <span>{t('color.uploadTitle', { defaultValue: 'Upload Custom Background Image' })}</span>
          </label>

          {customBgUrl ? (
            <div className="flex flex-col gap-3 p-3 bg-dark-800/90 rounded-2xl border border-neon-cyan/30">
              <div className="relative aspect-video rounded-xl overflow-hidden border border-dark-600 bg-dark-900">
                <img
                  src={customBgUrl}
                  alt="Custom Background"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={onClearCustomBg}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-dark-900/80 hover:bg-red-500 text-white transition-all shadow-md"
                  title="Remove Custom Background"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2 px-3 rounded-xl bg-dark-700 hover:bg-dark-600 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-dark-500 transition-colors"
              >
                <Upload className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{t('color.changeBgImage', { defaultValue: 'Ganti Foto Background' })}</span>
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-dark-500 hover:border-neon-cyan bg-dark-800/40 hover:bg-dark-800/80 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-neon-cyan" />
              </div>
              <p className="text-xs font-bold text-white mb-1">
                {t('color.dropCustomBg', { defaultValue: 'Klik untuk Upload Background' })}
              </p>
              <p className="text-[11px] text-slate-400">
                JPG, PNG, atau WEBP dari perangkat kamu
              </p>
            </div>
          )}

          {/* Blur slider for custom background */}
          {customBgUrl && (
            <div className="space-y-2 pt-2 border-t border-dark-700/60">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{t('color.bgBlur', { defaultValue: 'Background Blur (DSLR Effect)' })}</span>
                </span>
                <span className="font-mono text-neon-cyan font-bold">{bgBlur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={bgBlur}
                onChange={(e) => setBgBlur(Number(e.target.value))}
                className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
              />
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Preset Studio & Scenic Backdrops */}
      {bgMode === 'preset' && (
        <div className="space-y-4">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-neon-cyan" />
            <span>{t('color.presetTitle', { defaultValue: 'Preset Studio & Backdrops' })}</span>
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {PRESET_SCENES.map((scene) => {
              const isSelected = selectedPreset === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => setSelectedPreset(scene.id)}
                  disabled={isProcessing}
                  className={`group relative aspect-video rounded-xl overflow-hidden border transition-all ${
                    isSelected
                      ? 'border-neon-cyan ring-2 ring-neon-cyan/40 scale-[1.02] shadow-glow-cyan'
                      : 'border-dark-600 hover:border-dark-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={scene.dataUrl}
                    alt={scene.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent flex items-end p-2">
                    <span className="text-[11px] font-bold text-white truncate drop-shadow">
                      {scene.name}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-neon-cyan text-dark-900 flex items-center justify-center font-bold shadow">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Blur slider for preset scenes */}
          <div className="space-y-2 pt-2 border-t border-dark-700/60">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{t('color.bgBlur', { defaultValue: 'Background Blur (DSLR Effect)' })}</span>
              </span>
              <span className="font-mono text-neon-cyan font-bold">{bgBlur}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={bgBlur}
              onChange={(e) => setBgBlur(Number(e.target.value))}
              className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {batchCount === 1 && (
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={onUploadOther || onReset}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-medium text-sm transition-colors border border-dark-600 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{t('editor.reset', { defaultValue: 'Reset / Upload Foto Lain' })}</span>
          </button>
        </div>
      )}
    </div>
  );
};
