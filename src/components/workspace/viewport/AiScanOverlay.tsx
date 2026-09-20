// src/components/workspace/viewport/AiScanOverlay.tsx
// High-tech Cyberpunk AI Neural Laser Scanner & Floating HUD Card

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import type { BatchItem } from '../types';

interface AiScanOverlayProps {
  currentItem: BatchItem;
}

export const AiScanOverlay: React.FC<AiScanOverlayProps> = ({ currentItem }) => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-hidden select-none">
      {/* Holographic Matrix Grid & Cyber Accents */}
      <div className="absolute inset-0 bg-dark-950/75 md:backdrop-blur-sm bg-[linear-gradient(to_right,#00f0ff0d_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff0d_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* 4 Cybernetic Corner Brackets */}
      <div className="absolute top-4 left-4 w-7 h-7 border-t-2 border-l-2 border-neon-cyan/80 rounded-tl-md shadow-[0_0_10px_#00f0ff]" />
      <div className="absolute top-4 right-4 w-7 h-7 border-t-2 border-r-2 border-neon-cyan/80 rounded-tr-md shadow-[0_0_10px_#00f0ff]" />
      <div className="absolute bottom-4 left-4 w-7 h-7 border-b-2 border-l-2 border-neon-cyan/80 rounded-bl-md shadow-[0_0_10px_#00f0ff]" />
      <div className="absolute bottom-4 right-4 w-7 h-7 border-b-2 border-r-2 border-neon-cyan/80 rounded-br-md shadow-[0_0_10px_#00f0ff]" />

      {/* Animated Neon Laser Scanning Beam */}
      <motion.div
        animate={{ top: ['4%', '92%', '4%'] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-neon-cyan to-transparent shadow-[0_0_24px_4px_#00f0ff] z-40 pointer-events-none"
      >
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-dark-900/95 border border-neon-cyan/80 text-[10px] font-mono text-neon-cyan font-bold tracking-widest shadow-glow-cyan flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-ping" />
          <span>AI SCANNING // NEURAL MATTING</span>
        </div>
      </motion.div>

      {/* Glassmorphic Central AI Status HUD Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-40 max-w-sm w-[90%] p-6 md:p-8 rounded-3xl bg-dark-900/90 border border-neon-cyan/40 backdrop-blur-xl shadow-[0_0_60px_rgba(0,240,255,0.25)] text-center space-y-4"
      >
        <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-neon-cyan/30 border-t-neon-cyan animate-spin" />
          <div
            className="absolute inset-1 rounded-full border-2 border-neon-pink/20 border-b-neon-pink animate-spin"
            style={{ animationDirection: 'reverse', animationDuration: '3s' }}
          />
          <Sparkles className="w-7 h-7 text-neon-cyan animate-pulse" />
        </div>

        <div className="space-y-1.5">
          <h4 className="font-heading font-black text-white text-lg tracking-wide bg-gradient-to-r from-white via-neon-cyan to-neon-indigo bg-clip-text text-transparent">
            {currentItem.progressStep === 'ai_processing'
              ? t('work.startAi', { defaultValue: 'AI Neural Matting Active' })
              : currentItem.progressStep}
          </h4>
          <p className="text-xs text-slate-300 font-medium">
            {currentItem.progress < 30
              ? t('work.step.init', { defaultValue: 'Initializing ONNX AI pipeline & tensors...' })
              : currentItem.progress < 70
              ? t('work.step.segment', { defaultValue: 'Segmenting foreground subject & alpha mask...' })
              : t('work.step.refine', { defaultValue: 'Refining ultra-crisp hair & edge transparency...' })}
          </p>
        </div>

        {/* High-Tech Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2.5 bg-dark-800 rounded-full overflow-hidden p-0.5 border border-dark-600">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo shadow-[0_0_12px_#00f0ff] transition-all duration-300"
              style={{ width: `${Math.max(currentItem.progress, 15)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono font-bold px-1">
            <span className="text-neon-cyan flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              {currentItem.progress}%
            </span>
            <span className="text-slate-400">WebGPU / WASM Local Engine</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
