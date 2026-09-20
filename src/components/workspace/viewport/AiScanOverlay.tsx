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

  const getLocalizedStep = () => {
    const rawStep = currentItem.progressStep || '';
    if (!rawStep || rawStep === 'init' || rawStep.includes('Initializing') || rawStep.includes('Inisialisasi')) {
      return t('work.step.init', { defaultValue: 'Inisialisasi AI & Model...' });
    }
    if (rawStep.startsWith('downloading:') || rawStep.includes('Mengunduh') || rawStep.includes('Downloading')) {
      const pctMatch = rawStep.match(/\d+/);
      const pct = pctMatch ? `${pctMatch[0]}%` : `${currentItem.progress || 0}%`;
      return t('work.step.downloading', { pct, defaultValue: `Mengunduh Memori AI (${pct})...` });
    }
    if (rawStep === 'vector' || rawStep.includes('vektor') || rawStep.includes('Vector') || rawStep.includes('logo')) {
      return t('work.step.vector', { defaultValue: 'Memproses Presisi Vektor Logo...' });
    }
    return t('work.processing', { defaultValue: 'Memproses gambar dengan AI...' });
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-dark-950/70 backdrop-blur-xs select-none">
      <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-dark-900/90 border border-dark-600/80 shadow-2xl">
        <Loader2 className="w-10 h-10 text-neon-cyan animate-spin" />
        <span className="text-sm font-bold text-white tracking-wide">
          {getLocalizedStep()}
        </span>
      </div>
    </div>
  );
};

