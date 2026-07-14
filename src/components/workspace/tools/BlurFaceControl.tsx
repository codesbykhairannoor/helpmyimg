import React from 'react';
import { ScanFace, RefreshCw, Trash2, Droplets } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';

export interface BlurBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface BlurFaceControlProps {
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

  return (
    <div className="flex flex-col h-full bg-dark-900 overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-dark-600">
        <h3 className="text-lg font-heading font-bold text-white mb-1 flex items-center gap-2">
          <ScanFace className="w-4 h-4 text-neon-pink" />
          {t('blur.options')}
        </h3>
        <p className="text-xs text-slate-400 font-medium">{t('blur.desc')}</p>
      </div>

      <div className="p-4 flex-1 flex flex-col gap-4">
        
        {/* Action Area */}
        <div className="bg-dark-800 p-4 rounded-xl border border-dark-600/50 flex flex-col gap-3">
          <div className="text-center">
            <p className="text-xs text-slate-300">{t('blur.manualDesc')}</p>
          </div>
          
          {/* Intensity Slider */}
          <div className="border-t border-dark-600 pt-3 mt-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1"><Droplets className="w-3 h-3 text-neon-cyan" /> {t('blur.intensity')}</span>
              <span className="text-xs font-bold text-white bg-dark-700 px-2 py-0.5 rounded-md border border-dark-500">{blurIntensity}px</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="50" 
              value={blurIntensity} 
              onChange={(e) => setBlurIntensity(Number(e.target.value))}
              className="w-full h-1.5 bg-dark-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan"
            />
          </div>

          {boxes.length > 0 && (
            <div className="mt-2 border-t border-dark-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Total Areas: {boxes.length}</span>
                <button onClick={() => setBoxes([])} className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1 bg-red-400/10 px-2 py-1 rounded-md border border-red-400/20">
                  <Trash2 className="w-3 h-3" /> Clear All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-dark-600 bg-dark-900/90 backdrop-blur-md sticky bottom-0 z-10 space-y-2.5">
        <button
          onClick={onApply}
          disabled={isProcessing || batchCount === 0}
          className="w-full py-3.5 bg-gradient-to-r from-neon-cyan to-neon-indigo text-dark-900 font-extrabold rounded-xl hover:shadow-glow-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wider"
        >
          <span>{isProcessing ? t('btn.processing') : t('work.action.apply', { defaultValue: 'Apply Now' })}</span>
        </button>

        <button
          onClick={onReset}
          disabled={isProcessing}
          className="w-full py-3 px-4 rounded-xl border border-dark-600 bg-dark-800 text-slate-300 font-semibold hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-4 h-4 text-neon-pink" />
          <span>{t('btn.reset', { defaultValue: 'Atur Ulang / Kembalikan' })}</span>
        </button>

        {batchCount === 1 && (
          <button
            onClick={onUploadOther || onReset}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dark-600 bg-dark-800 text-slate-300 font-semibold hover:bg-dark-700 hover:text-white transition-colors disabled:opacity-50"
          >
            <RefreshCw className="w-4 h-4 text-neon-cyan" />
            <span>{t('editor.reset')}</span>
          </button>
        )}
      </div>
    </div>
  );
};
