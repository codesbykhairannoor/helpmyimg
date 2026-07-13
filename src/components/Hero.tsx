// src/components/Hero.tsx
// Bagian Hero Banner dengan Animasi Framer Motion dan Statistik Pembuktian Kuantitatif (GEO)

import React from 'react';
import { useTranslation } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Award } from 'lucide-react';

interface HeroProps {
  title?: string;
  description?: string;
}

export const Hero: React.FC<HeroProps> = ({ title, description }) => {
  const { t } = useTranslation();

  return (
    <section className="relative pt-8 pb-6 md:pt-12 md:pb-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-neon-cyan/20 via-neon-indigo/20 to-neon-violet/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/80 border border-neon-cyan/40 shadow-glow-cyan text-sm font-medium text-slate-200 mb-8"
        >
          <span className="flex h-2 w-2 rounded-full bg-neon-cyan animate-ping" />
          <span>{t('hero.badge')}</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.15]"
        >
          {title || "Every AI tool you need to edit images in bulk"}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed"
        >
          {description || "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser."}
        </motion.p>

        {/* Tool Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-10 border-t border-dark-600/40"
        >
          {[
            { icon: Zap, iconColor: 'text-neon-cyan', glowBase: 'bg-neon-cyan/10', glowHover: 'group-hover:bg-neon-cyan/20', key: 'time' },
            { icon: Award, iconColor: 'text-neon-emerald', glowBase: 'bg-neon-emerald/10', glowHover: 'group-hover:bg-neon-emerald/20', key: 'prec' },
            { icon: Shield, iconColor: 'text-neon-indigo', glowBase: 'bg-neon-indigo/10', glowHover: 'group-hover:bg-neon-indigo/20', key: 'priv' },
            { icon: Cpu, iconColor: 'text-neon-pink', glowBase: 'bg-neon-pink/10', glowHover: 'group-hover:bg-neon-pink/20', key: 'batch' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            const rawVal = t(`stat.${stat.key}.val`) || '';
            const cleanVal = rawVal.replace(/^[^a-zA-Z0-9\p{L}\p{N}]+\s*/u, '').trim();
            const label = t(`stat.${stat.key}.label`);

            return (
              <div key={idx} className="glass-card p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 border border-dark-500/40 text-left">
                {/* Subtle Hover Glow */}
                <div className={`absolute top-0 right-0 w-24 h-24 ${stat.glowBase} ${stat.glowHover} rounded-full blur-2xl -mr-8 -mt-8 transition-all duration-300 pointer-events-none`} />
                
                <div className="w-10 h-10 rounded-xl bg-dark-800/50 border border-dark-600/50 flex items-center justify-center mb-4 shadow-sm">
                  <Icon className={`w-5 h-5 ${stat.iconColor} stroke-[2.5]`} />
                </div>
                
                <div className="text-xl font-heading font-extrabold text-slate-100 group-hover:text-white transition-colors mb-1">
                  {cleanVal}
                </div>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  {label}
                </p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
