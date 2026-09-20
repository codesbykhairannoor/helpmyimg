// src/components/workspace/tools/ResizeControl.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { RotateCcw, Upload, Link as LinkIcon, Unlink } from 'lucide-react';

interface ResizeControlProps {
  originalWidth: number;
  originalHeight: number;
  resizeWidth: number;
  setResizeWidth: (w: number) => void;
  resizeHeight: number;
  setResizeHeight: (h: number) => void;
  maintainRatio: boolean;
  setMaintainRatio: (r: boolean) => void;
  resizeMode: 'standard' | 'smart';
  setResizeMode: (m: 'standard' | 'smart') => void;
  onApply?: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const ResizeControl: React.FC<ResizeControlProps> = ({
  originalWidth,
  originalHeight,
  resizeWidth,
  setResizeWidth,
  resizeHeight,
  setResizeHeight,
  maintainRatio,
  setMaintainRatio,
  resizeMode,
  setResizeMode,
  onApply: _onApply,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();
  const aspectRatio = originalWidth && originalHeight ? originalWidth / originalHeight : 1;
  const [unit, setUnit] = React.useState('px');



  // Sync width/height based on aspect ratio when changed
  const handleWidthChange = (val: string) => {
    const w = parseInt(val, 10) || 0;
    setResizeWidth(w);
    if (maintainRatio && w > 0) {
      setResizeHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val, 10) || 0;
    setResizeHeight(h);
    if (maintainRatio && h > 0) {
      setResizeWidth(Math.round(h * aspectRatio));
    }
  };

  return (
    <div className="space-y-6 overflow-y-visible">
      <div className="space-y-4">
        {/* Mode Toggle */}
        <div className="flex bg-dark-800 p-1 rounded-xl mb-4">
          <button
            onClick={() => setResizeMode('standard')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${resizeMode === 'standard' ? 'bg-dark-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {t('resize.modeStandard', { defaultValue: 'Standar (Regang)' })}
          </button>
          <button
            onClick={() => setResizeMode('smart')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${resizeMode === 'smart' ? 'bg-gradient-to-r from-neon-cyan to-neon-indigo text-dark-900 shadow-glow-cyan' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-[10px]">✨</span> {t('resize.modeSmart', { defaultValue: 'Otomatis Pintar' })}
          </button>
        </div>
        
        <div className="space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[
                { label: '1:1', w: 1080, h: 1080 },
                { label: '16:9', w: 1920, h: 1080 },
                { label: '4:3', w: 1440, h: 1080 },
                { label: '9:16', w: 1080, h: 1920 },
              ].map((preset) => {
                const isActive = resizeWidth === preset.w && resizeHeight === preset.h;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setResizeWidth(preset.w);
                      setResizeHeight(preset.h);
                      setMaintainRatio(false);
                    }}
                    className={`py-1.5 px-2 rounded-lg border text-xs font-bold transition-all cursor-pointer text-center ${
                      isActive
                        ? 'bg-neon-cyan/20 border-neon-cyan text-neon-cyan shadow-glow-cyan'
                        : 'bg-dark-800 border-dark-600 hover:border-slate-400 text-slate-300 hover:text-white'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400 font-medium">{t('resize.width', { defaultValue: 'Lebar' })}</label>
                  <select 
                    value={unit} 
                    onChange={(e) => setUnit(e.target.value)}
                    className="bg-transparent text-xs text-slate-300 font-bold outline-none cursor-pointer"
                  >
                    <option value="px" className="bg-dark-900">px</option>
                    <option value="cm" className="bg-dark-900">cm</option>
                    <option value="mm" className="bg-dark-900">mm</option>
                    <option value="in" className="bg-dark-900">in</option>
                    <option value="vh" className="bg-dark-900">vh</option>
                    <option value="vw" className="bg-dark-900">vw</option>
                  </select>
                </div>
                <input
                  type="number"
                  value={resizeWidth || ''}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-green"
                  placeholder={originalWidth.toString()}
                />
              </div>
              
              <button
                onClick={() => setMaintainRatio(!maintainRatio)}
                className={`p-2 rounded-lg mt-5 transition-colors ${
                  maintainRatio ? 'bg-neon-green/20 text-neon-green' : 'bg-dark-700 text-slate-400'
                }`}
                title={maintainRatio ? t('resize.lock', { defaultValue: 'Kunci Rasio' }) : t('resize.unlock', { defaultValue: 'Buka Kunci Rasio' })}
              >
                {maintainRatio ? <LinkIcon className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-xs text-slate-400 font-medium">{t('resize.height', { defaultValue: 'Tinggi' })}</label>
                   {/* Dummy space for symmetry with width unit selector */}
                   <span className="text-xs font-bold text-transparent px-2">px</span>
                </div>
                <input
                  type="number"
                  value={resizeHeight || ''}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-green"
                  placeholder={originalHeight.toString()}
                />
              </div>
            </div>
          </div>
      </div>

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
  );
};
