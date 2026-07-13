// src/components/workspace/tools/ResizeControl.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Download, RefreshCw, Link as LinkIcon, Unlink } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResizeControlProps {
  originalWidth: number;
  originalHeight: number;
  width: number;
  setWidth: (w: number) => void;
  height: number;
  setHeight: (h: number) => void;
  maintainAspectRatio: boolean;
  setMaintainAspectRatio: (m: boolean) => void;
  onDownload: () => void;
  onReset: () => void;
  isProcessing: boolean;
  resizeMode: 'standard' | 'smart';
  setResizeMode: (mode: 'standard' | 'smart') => void;
}

export const ResizeControl: React.FC<ResizeControlProps> = ({
  originalWidth,
  originalHeight,
  width,
  setWidth,
  height,
  setHeight,
  maintainAspectRatio,
  setMaintainAspectRatio,
  onDownload,
  onReset,
  isProcessing,
  resizeMode,
  setResizeMode,
}) => {
  const { t } = useTranslation();
  const aspectRatio = originalWidth && originalHeight ? originalWidth / originalHeight : 1;

  // Sync width/height based on aspect ratio when changed
  const handleWidthChange = (val: string) => {
    const w = parseInt(val, 10) || 0;
    setWidth(w);
    if (maintainAspectRatio && w > 0) {
      setHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val, 10) || 0;
    setHeight(h);
    if (maintainAspectRatio && h > 0) {
      setWidth(Math.round(h * aspectRatio));
    }
  };

  const [unit, setUnit] = React.useState('px');

  const handleDownload = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
    onDownload();
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
            Standard (Squish)
          </button>
          <button
            onClick={() => setResizeMode('smart')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${resizeMode === 'smart' ? 'bg-gradient-to-r from-neon-cyan to-neon-indigo text-dark-900 shadow-glow-cyan' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-[10px]">✨</span> Smart (AI)
          </button>
        </div>
        
        <div className="space-y-4 animate-in fade-in zoom-in duration-200">
            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={() => { setWidth(1080); setHeight(1080); setMaintainAspectRatio(false); }} className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-600 hover:border-neon-green text-xs font-semibold text-slate-300 transition-colors">
                1:1
              </button>
              <button onClick={() => { setWidth(1920); setHeight(1080); setMaintainAspectRatio(false); }} className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-600 hover:border-neon-green text-xs font-semibold text-slate-300 transition-colors">
                16:9
              </button>
              <button onClick={() => { setWidth(1440); setHeight(1080); setMaintainAspectRatio(false); }} className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-600 hover:border-neon-green text-xs font-semibold text-slate-300 transition-colors">
                4:3
              </button>
              <button onClick={() => { setWidth(1080); setHeight(1920); setMaintainAspectRatio(false); }} className="px-2.5 py-1 rounded-lg bg-dark-800 border border-dark-600 hover:border-neon-green text-xs font-semibold text-slate-300 transition-colors">
                9:16
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-slate-400 font-medium">Width</label>
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
                  value={width || ''}
                  onChange={(e) => handleWidthChange(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-green"
                  placeholder={originalWidth.toString()}
                />
              </div>
              
              <button
                onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                className={`p-2 rounded-lg mt-5 transition-colors ${
                  maintainAspectRatio ? 'bg-neon-green/20 text-neon-green' : 'bg-dark-700 text-slate-400'
                }`}
                title={maintainAspectRatio ? t('resize.lock') : t('resize.unlock')}
              >
                {maintainAspectRatio ? <LinkIcon className="w-4 h-4" /> : <Unlink className="w-4 h-4" />}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-xs text-slate-400 font-medium">Height</label>
                   {/* Dummy space for symmetry with width unit selector */}
                   <span className="text-xs font-bold text-transparent px-2">px</span>
                </div>
                <input
                  type="number"
                  value={height || ''}
                  onChange={(e) => handleHeightChange(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-600 rounded-lg px-3 py-2 text-white outline-none focus:border-neon-green"
                  placeholder={originalHeight.toString()}
                />
              </div>
            </div>
          </div>
      </div>

      <div className="space-y-3 pt-2">
        <button
          onClick={handleDownload}
          disabled={isProcessing || width <= 0 || height <= 0}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-extrabold shadow-lg transition-all duration-200 disabled:opacity-50 transform hover:-translate-y-0.5"
        >
          <Download className="w-5 h-5" />
          <span>{isProcessing ? t('btn.processing') : t('btn.download')}</span>
        </button>

        <button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dark-600 bg-dark-800 text-slate-300 font-semibold hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t('btn.reset')}</span>
        </button>
      </div>
    </div>
  );
};
