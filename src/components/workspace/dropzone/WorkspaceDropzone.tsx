// src/components/workspace/dropzone/WorkspaceDropzone.tsx
// Dropzone Upload Area for workspace

import React from 'react';
import { Upload, Sparkles, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { BatchItem } from '../types';

interface WorkspaceDropzoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
  currentItem?: BatchItem | null;
  onRetry?: () => void;
}

export const WorkspaceDropzone: React.FC<WorkspaceDropzoneProps> = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
  currentItem,
  onRetry,
}) => {
  const { t } = useTranslation();

  return (
    <div
      aria-label={`${t('dropzone.title')} - remove background online, transparent background maker, free photo background editor`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onClick}
      className={`w-full min-h-[320px] sm:min-h-[380px] md:min-h-0 md:aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 sm:p-10 text-center cursor-pointer relative overflow-hidden group ${
        isDragging
          ? 'border-neon-cyan bg-neon-cyan/10 shadow-glow-cyan scale-[0.99]'
          : 'border-dark-500/80 bg-dark-800/40 hover:border-neon-cyan/60 hover:bg-dark-800/70'
      }`}
    >
      <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-neon-cyan/20 to-neon-indigo/20 border border-neon-cyan/40 flex items-center justify-center mb-3 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
        <Upload className="w-7 h-7 md:w-10 md:h-10 text-neon-cyan animate-bounce" />
      </div>

      <h3 className="text-lg md:text-2xl font-heading font-extrabold text-white mb-2 px-2 tracking-tight">
        {currentItem?.status === 'error' ? (
          <div className="space-y-3">
            <span className="font-bold text-red-400 block mb-1">
              ⚠️ {t('work.failedAi', { defaultValue: 'AI Processing Failed' })}
            </span>
            <span className="text-xs md:text-sm text-slate-300 block font-normal max-w-sm mx-auto">
              {currentItem?.errorMessage ||
                t('work.errorHint', {
                  defaultValue: 'Tip: Try using a smaller resolution image, or click retry below.',
                })}
            </span>
            {onRetry && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRetry();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/40 text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{t('work.action.retry', { defaultValue: 'Retry Processing' })}</span>
              </button>
            )}
          </div>
        ) : (
          t('dropzone.title', { defaultValue: 'Upload Photos Here' }).replace(/^[⚡✨🔄\s]+/u, '')
        )}
      </h3>
      <p className="text-xs md:text-sm text-slate-400 max-w-md mx-auto mb-6 px-4 leading-relaxed font-body">
        {t('dropzone.subtitle', { defaultValue: 'Drag and drop images (PNG, JPG, WEBP) or click to browse' })}
      </p>

      <div className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold shadow-glow-cyan transform group-hover:-translate-y-0.5 transition-all text-sm sm:text-base tracking-wide mb-6 md:mb-0 shadow-lg cursor-pointer">
        <Sparkles className="w-4 h-4 fill-dark-900 shrink-0" />
        <span>{t('dropzone.btn', { defaultValue: 'Select Photos' }).replace(/^[⚡✨🔄\s]+/u, '')}</span>
      </div>

      <div className="md:absolute md:bottom-4 left-0 right-0 text-center text-[10px] md:text-xs text-slate-400/80 font-medium px-4">
        {t('dropzone.privacy', { defaultValue: '🔒 100% Private: AI processing runs locally in your browser' })}
      </div>
    </div>
  );
};
