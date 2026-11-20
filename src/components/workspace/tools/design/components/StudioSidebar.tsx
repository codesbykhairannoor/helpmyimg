// src/components/workspace/tools/design/components/StudioSidebar.tsx
// Inspector Sidebar untuk Studio Image Editor: Adjust, Presets, Enhance, Transform, Text, Brush

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  SlidersHorizontal,
  Sparkles,
  Wand2,
  Crop,
  Type,
  Paintbrush,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Plus,
  Trash2,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sun,
  Contrast,
  Thermometer,
  Zap,
} from 'lucide-react';
import type {
  StudioTab,
  StudioAdjustments,
  StudioTransform,
  StudioTextLayer,
  StudioPresetId,
} from '../types';
import { STUDIO_PRESETS } from '../presets';

interface StudioSidebarProps {
  activeTab: StudioTab;
  onSelectTab: (tab: StudioTab) => void;
  adjustments: StudioAdjustments;
  onUpdateAdjustment: (key: keyof StudioAdjustments, value: number) => void;
  onApplyPreset: (presetId: StudioPresetId) => void;
  transform: StudioTransform;
  onRotateCW: () => void;
  onRotateCCW: () => void;
  onToggleFlipH: () => void;
  onToggleFlipV: () => void;
  onSetCropAspect: (aspect: StudioTransform['cropAspect']) => void;
  onResetCrop: () => void;
  textLayers: StudioTextLayer[];
  selectedTextId: string | null;
  onSelectTextId: (id: string | null) => void;
  onAddTextLayer: () => void;
  onUpdateTextLayer: (id: string, updates: Partial<StudioTextLayer>) => void;
  onRemoveTextLayer: (id: string) => void;
  brushColor: string;
  onSetBrushColor: (color: string) => void;
  brushSize: number;
  onSetBrushSize: (size: number) => void;
  brushOpacity: number;
  onSetBrushOpacity: (opacity: number) => void;
  onClearBrushStrokes: () => void;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeTab,
  onSelectTab,
  adjustments,
  onUpdateAdjustment,
  onApplyPreset,
  transform,
  onRotateCW,
  onRotateCCW,
  onToggleFlipH,
  onToggleFlipV,
  onSetCropAspect,
  onResetCrop,
  textLayers,
  selectedTextId,
  onSelectTextId,
  onAddTextLayer,
  onUpdateTextLayer,
  onRemoveTextLayer,
  brushColor,
  onSetBrushColor,
  brushSize,
  onSetBrushSize,
  brushOpacity,
  onSetBrushOpacity,
  onClearBrushStrokes,
}) => {
  const { t } = useTranslation();

  const tabs: { id: StudioTab; labelKey: string; defaultLabel: string; icon: React.ElementType }[] = [
    { id: 'adjust', labelKey: 'studio.tab.adjust', defaultLabel: 'Warna', icon: SlidersHorizontal },
    { id: 'presets', labelKey: 'studio.tab.presets', defaultLabel: 'Filter', icon: Sparkles },
    { id: 'enhance', labelKey: 'studio.tab.enhance', defaultLabel: 'Detail', icon: Wand2 },
    { id: 'transform', labelKey: 'studio.tab.transform', defaultLabel: 'Potong', icon: Crop },
    { id: 'text', labelKey: 'studio.tab.text', defaultLabel: 'Teks', icon: Type },
    { id: 'brush', labelKey: 'studio.tab.brush', defaultLabel: 'Kuas', icon: Paintbrush },
  ];

  // Helper untuk Slider Kontrol
  const renderSlider = (
    key: keyof StudioAdjustments,
    labelKey: string,
    defaultLabel: string,
    min = -100,
    max = 100,
    step = 1
  ) => {
    const val = (adjustments[key] as number) || 0;
    return (
      <div className="space-y-1.5 py-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium">{t(labelKey, { defaultValue: defaultLabel })}</span>
          <button
            type="button"
            onClick={() => onUpdateAdjustment(key, 0)}
            className="font-mono text-slate-400 hover:text-cyan-400 transition-colors text-[11px] cursor-pointer"
            title="Klik untuk reset ke 0"
          >
            {val > 0 ? `+${val}` : val}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={val}
            onChange={(e) => onUpdateAdjustment(key, Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>
      </div>
    );
  };

  const selectedTextLayer = textLayers.find((l) => l.id === selectedTextId) || null;

  return (
    <aside className="w-full md:w-80 lg:w-88 bg-[#0f172a]/95 backdrop-blur-md border-t md:border-t-0 md:border-l border-slate-800/80 flex flex-col h-auto md:h-full select-none z-20 shrink-0">
      {/* Tab Navigation Bar */}
      <div className="flex items-center justify-between p-2 border-b border-slate-800/80 bg-slate-900/60 overflow-x-auto no-scrollbar shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex-1 min-w-[52px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 font-bold border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 font-medium'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[11px] truncate max-w-full">
                {t(tab.labelKey, { defaultValue: tab.defaultLabel })}
              </span>
            </button>
          );
        })}
      </div>

      {/* Konten Tab Inspector */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-slate-200">
        {/* TAB 1: ADJUST (PENYESUAIAN WARNA) */}
        {activeTab === 'adjust' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('studio.section.light', { defaultValue: 'Pencahayaan & Eksposur' })}</span>
              </h4>
            </div>
            <div className="space-y-2">
              {renderSlider('exposure', 'studio.slider.exposure', 'Exposure', -100, 100)}
              {renderSlider('brightness', 'studio.slider.brightness', 'Brightness', -100, 100)}
              {renderSlider('contrast', 'studio.slider.contrast', 'Contrast', -100, 100)}
              {renderSlider('highlights', 'studio.slider.highlights', 'Highlights', -100, 100)}
              {renderSlider('shadows', 'studio.slider.shadows', 'Shadows', -100, 100)}
            </div>

            <div className="border-b border-slate-800 pb-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('studio.section.color', { defaultValue: 'Warna & Temperatur' })}</span>
              </h4>
            </div>
            <div className="space-y-2">
              {renderSlider('saturation', 'studio.slider.saturation', 'Saturation', -100, 100)}
              {renderSlider('vibrance', 'studio.slider.vibrance', 'Vibrance', -100, 100)}
              {renderSlider('temperature', 'studio.slider.temperature', 'Warmth / Temperature', -100, 100)}
              {renderSlider('tint', 'studio.slider.tint', 'Tint (Green / Magenta)', -100, 100)}
            </div>
          </div>
        )}

        {/* TAB 2: PRESETS (FILTER FILM) */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('studio.section.presets', { defaultValue: 'Preset Color Grading' })}</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {STUDIO_PRESETS.map((preset) => {
                const isSelected = adjustments.preset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => onApplyPreset(preset.id)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-400 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div
                        className="w-7 h-7 rounded-lg shadow-inner border border-white/20 shrink-0"
                        style={{ background: preset.colorPreview }}
                      />
                      {preset.badge && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                          {preset.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white truncate">
                        {t(preset.titleKey, { defaultValue: preset.defaultTitle })}
                      </div>
                      <div className="text-[10px] text-slate-400 line-clamp-1">
                        {t(preset.descriptionKey, { defaultValue: preset.defaultDesc })}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ENHANCE (DETAIL & KETAJAMAN) */}
        {activeTab === 'enhance' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('studio.section.enhance', { defaultValue: 'Detail & Efek Khusus' })}</span>
              </h4>
            </div>
            <div className="space-y-3">
              {renderSlider('sharpen', 'studio.slider.sharpen', 'Sharpen / Clarity', 0, 100)}
              {renderSlider('vignette', 'studio.slider.vignette', 'Vignette (Framing Gelap)', 0, 100)}
              {renderSlider('blur', 'studio.slider.blur', 'Soft Blur / Glow', 0, 100)}
            </div>
          </div>
        )}

        {/* TAB 4: TRANSFORM (ROTASI & POTONG) */}
        {activeTab === 'transform' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('studio.section.orient', { defaultValue: 'Rotasi & Cermin' })}</span>
              </h4>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onRotateCCW}
                className="h-10 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-cyan-400" />
                <span>-90°</span>
              </button>
              <button
                type="button"
                onClick={onRotateCW}
                className="h-10 px-3 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4 text-cyan-400" />
                <span>+90°</span>
              </button>
              <button
                type="button"
                onClick={onToggleFlipH}
                className={`h-10 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  transform.flipH
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <FlipHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Flip H</span>
              </button>
              <button
                type="button"
                onClick={onToggleFlipV}
                className={`h-10 px-3 border rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  transform.flipV
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <FlipVertical className="w-4 h-4 text-cyan-400" />
                <span>Flip V</span>
              </button>
            </div>

            <div className="border-b border-slate-800 pb-2 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Crop className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('studio.section.crop', { defaultValue: 'Rasio Aspek Crop' })}</span>
              </h4>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {(['free', '1:1', '4:5', '16:9', '9:16', '4:3', '3:2'] as const).map((aspect) => (
                <button
                  key={aspect}
                  type="button"
                  onClick={() => onSetCropAspect(aspect)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer text-center ${
                    transform.cropAspect === aspect
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {aspect === 'free' ? t('studio.crop.free', { defaultValue: 'Bebas' }) : aspect}
                </button>
              ))}
            </div>

            {transform.cropRect && (
              <button
                type="button"
                onClick={onResetCrop}
                className="w-full py-2 px-3 rounded-lg border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-colors cursor-pointer"
              >
                {t('studio.crop.reset', { defaultValue: 'Batalkan Potongan' })}
              </button>
            )}
          </div>
        )}

        {/* TAB 5: TEXT (TEKS & ANOTASI) */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={onAddTextLayer}
              className="w-full h-10 px-4 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('studio.text.add', { defaultValue: 'Tambah Teks Baru' })}</span>
            </button>

            {/* List Layer Teks */}
            <div className="space-y-2">
              {textLayers.map((layer) => {
                const isSelected = layer.id === selectedTextId;
                return (
                  <div
                    key={layer.id}
                    onClick={() => onSelectTextId(layer.id)}
                    className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-400 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-medium text-slate-200 truncate">{layer.text || '(Kosong)'}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveTextLayer(layer.id);
                      }}
                      className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Editor Teks yang Sedang Dipilih */}
            {selectedTextLayer && (
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
                <input
                  type="text"
                  value={selectedTextLayer.text}
                  onChange={(e) => onUpdateTextLayer(selectedTextLayer.id, { text: e.target.value })}
                  placeholder="Ketik teks di sini..."
                  className="w-full h-9 px-3 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:border-cyan-400 focus:outline-none"
                />

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTextLayer.fontFamily}
                    onChange={(e) => onUpdateTextLayer(selectedTextLayer.id, { fontFamily: e.target.value })}
                    className="flex-1 h-8 px-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
                  >
                    <option value="Inter, sans-serif">Inter Modern</option>
                    <option value="'Playfair Display', serif">Playfair Serif</option>
                    <option value="'Bebas Neue', cursive">Bebas Display</option>
                    <option value="monospace">Monospace</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onUpdateTextLayer(selectedTextLayer.id, { bold: !selectedTextLayer.bold })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        selectedTextLayer.bold ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateTextLayer(selectedTextLayer.id, { italic: !selectedTextLayer.italic })}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                        selectedTextLayer.italic ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-950 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{t('studio.text.size', { defaultValue: 'Ukuran Font' })}</span>
                    <span className="font-mono">{selectedTextLayer.fontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="120"
                    value={selectedTextLayer.fontSize}
                    onChange={(e) => onUpdateTextLayer(selectedTextLayer.id, { fontSize: Number(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-slate-400">{t('studio.text.color', { defaultValue: 'Warna Teks' })}</span>
                  <input
                    type="color"
                    value={selectedTextLayer.color}
                    onChange={(e) => onUpdateTextLayer(selectedTextLayer.id, { color: e.target.value })}
                    className="w-8 h-7 bg-transparent rounded cursor-pointer border border-slate-700"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: BRUSH (MENGGAMBAR BEBAS) */}
        {activeTab === 'brush' && (
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Paintbrush className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t('studio.section.brush', { defaultValue: 'Coretan Kuas Bebas' })}</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>{t('studio.brush.size', { defaultValue: 'Ukuran Kuas' })}</span>
                  <span className="font-mono text-cyan-400 text-[11px]">{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="60"
                  value={brushSize}
                  onChange={(e) => onSetBrushSize(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300 font-medium">
                  <span>{t('studio.brush.opacity', { defaultValue: 'Opasitas' })}</span>
                  <span className="font-mono text-cyan-400 text-[11px]">{Math.round(brushOpacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={brushOpacity}
                  onChange={(e) => onSetBrushOpacity(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-xs text-slate-300 font-medium">{t('studio.brush.color', { defaultValue: 'Pilihan Warna' })}</span>
                <div className="flex items-center gap-2">
                  {['#ffffff', '#38bdf8', '#facc15', '#f43f5e', '#4ade80', '#09090b'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => onSetBrushColor(color)}
                      className={`w-7 h-7 rounded-lg border transition-transform cursor-pointer ${
                        brushColor === color ? 'scale-110 border-white shadow-md' : 'border-slate-700 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={brushColor}
                    onChange={(e) => onSetBrushColor(e.target.value)}
                    className="w-7 h-7 rounded-lg bg-transparent cursor-pointer border border-slate-700"
                    title="Pilih warna bebas"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={onClearBrushStrokes}
                className="w-full py-2.5 px-3 rounded-xl border border-rose-500/30 text-rose-300 hover:bg-rose-500/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer pt-2"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('studio.brush.clear', { defaultValue: 'Hapus Semua Coretan' })}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
