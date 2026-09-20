import React from 'react';
import { ScanFace, RefreshCw, Trash2, Droplets, RotateCcw, Upload } from 'lucide-react';
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
            disabled={isProcessing || boxes.length === 0}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide"
          >
          <span>{isProcessing ? t('btn.processing') : t('work.action.apply')}</span>
        </button>

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
    </div>
  );
};
