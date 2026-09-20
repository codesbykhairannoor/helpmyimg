// src/components/workspace/viewport/AiScanOverlay.tsx
// Simple, clean circular spinner overlay

import React from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { BatchItem } from '../types';

interface AiScanOverlayProps {
  currentItem: BatchItem;
}

export const AiScanOverlay: React.FC<AiScanOverlayProps> = ({ currentItem }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-dark-950/70 backdrop-blur-xs select-none">
      <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-dark-900/90 border border-dark-600/80 shadow-2xl">
        <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
        <span className="text-sm font-bold text-white tracking-wide">
          {currentItem.progressStep || t('work.processing', { defaultValue: 'Memproses gambar...' })}
        </span>
      </div>
    </div>
  );
};

