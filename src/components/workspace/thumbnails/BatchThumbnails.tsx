// src/components/workspace/thumbnails/BatchThumbnails.tsx
// Thumbnail Strip for Batch Image Uploads

import React from 'react';
import { Loader2, Trash2, Upload } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { BatchItem } from '../types';

interface BatchThumbnailsProps {
  batchItems: BatchItem[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onDelete: (index: number) => void;
  onAddMore: () => void;
}

export const BatchThumbnails: React.FC<BatchThumbnailsProps> = ({
  batchItems,
  selectedIndex,
  onSelect,
  onDelete,
  onAddMore,
}) => {
  const { t } = useTranslation();

  if (batchItems.length === 0) return null;

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-2 p-2 bg-dark-800/50 rounded-2xl border border-dark-600/50">
      {batchItems.map((item, idx) => (
        <div key={item.id} className="relative shrink-0 group">
          <button
            type="button"
            onClick={() => onSelect(idx)}
            className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all block cursor-pointer ${
              selectedIndex === idx
                ? 'border-neon-cyan scale-105 shadow-glow-cyan'
                : 'border-dark-600 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={item.processedUrl || item.originalUrl}
              alt="Thumbnail"
              className="w-full h-full object-cover checkerboard-bg"
            />
            {item.status === 'processing' && (
              <div className="absolute inset-0 bg-dark-900/80 flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-neon-cyan animate-spin" />
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(idx);
            }}
            className="absolute -top-2 -right-2 bg-dark-900 border border-dark-600 text-slate-400 hover:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20 shadow-lg cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={onAddMore}
        className="w-16 h-16 rounded-xl bg-dark-800 hover:bg-dark-700 border border-dashed border-dark-500 flex flex-col items-center justify-center text-slate-400 hover:text-white shrink-0 text-[10px] gap-1 font-semibold cursor-pointer transition-colors"
      >
        <Upload className="w-4 h-4 text-neon-cyan" />
        <span>{t('work.addMore')}</span>
      </button>
    </div>
  );
};
