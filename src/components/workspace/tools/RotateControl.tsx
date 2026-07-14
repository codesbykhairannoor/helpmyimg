// src/components/workspace/tools/RotateControl.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';

interface RotateControlProps {
  rotation: number;
  setRotation: (r: number) => void;
  flipH: boolean;
  setFlipH: (f: boolean) => void;
  flipV: boolean;
  setFlipV: (f: boolean) => void;
  onApply?: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

export const RotateControl: React.FC<RotateControlProps> = ({
  rotation,
  setRotation,
  flipH,
  setFlipH,
  flipV,
  setFlipV,
  onReset,
  isProcessing,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 overflow-y-visible">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <RotateCw className="w-4 h-4 text-neon-orange" />
          <span>{t('rotate.title')}</span>
        </div>

        {/* Quick Rotation Buttons */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">{t('rotate.quickRotate')}</label>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => setRotation((rotation + 270) % 360)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-orange hover:bg-dark-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-400">-90°</span>
            </button>
            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-orange hover:bg-dark-700 transition-colors"
            >
              <RotateCw className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-400">+90°</span>
            </button>
            <button
              onClick={() => setRotation(180)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-orange hover:bg-dark-700 transition-colors"
            >
              <RotateCw className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-400">180°</span>
            </button>
            <button
              onClick={() => setRotation(0)}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-dark-800 border border-dark-600 hover:border-neon-orange hover:bg-dark-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5 text-slate-300" />
              <span className="text-[10px] font-bold text-slate-400">0°</span>
            </button>
          </div>
        </div>

        {/* Custom Angle Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-slate-400 font-medium">{t('rotate.customAngle')}</label>
            <span className="text-sm font-mono font-bold text-neon-orange">{rotation}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={359}
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full h-2 bg-dark-700 rounded-full appearance-none cursor-pointer accent-neon-orange"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0°</span><span>90°</span><span>180°</span><span>270°</span><span>359°</span>
          </div>
        </div>

        {/* Flip Controls */}
        <div className="space-y-2">
          <label className="text-xs text-slate-400 font-medium">{t('rotate.flip')}</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFlipH(!flipH)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                flipH 
                  ? 'bg-neon-orange/20 border-neon-orange text-neon-orange' 
                  : 'bg-dark-800 border-dark-600 text-slate-300 hover:border-neon-orange'
              }`}
            >
              <FlipHorizontal className="w-5 h-5" />
              <span className="text-xs font-bold">{t('rotate.flipH')}</span>
            </button>
            <button
              onClick={() => setFlipV(!flipV)}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all ${
                flipV 
                  ? 'bg-neon-orange/20 border-neon-orange text-neon-orange' 
                  : 'bg-dark-800 border-dark-600 text-slate-300 hover:border-neon-orange'
              }`}
            >
              <FlipVertical className="w-5 h-5" />
              <span className="text-xs font-bold">{t('rotate.flipV')}</span>
            </button>
          </div>
        </div>

        {/* Current State Info */}
        <div className="bg-dark-800/60 rounded-xl p-3 border border-dark-600/50">
          <div className="text-xs text-slate-400 space-y-1">
            <div className="flex justify-between"><span>{t('rotate.angle')}</span><span className="text-neon-orange font-mono font-bold">{rotation}°</span></div>
            <div className="flex justify-between"><span>{t('rotate.flipH')}</span><span className={`font-bold ${flipH ? 'text-neon-orange' : 'text-slate-500'}`}>{flipH ? '✓' : '—'}</span></div>
            <div className="flex justify-between"><span>{t('rotate.flipV')}</span><span className={`font-bold ${flipV ? 'text-neon-orange' : 'text-slate-500'}`}>{flipV ? '✓' : '—'}</span></div>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-2">
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
