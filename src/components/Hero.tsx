// src/components/Hero.tsx
// Bagian Hero Banner dengan Animasi Framer Motion dan Statistik Pembuktian Kuantitatif (GEO)

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from '../context/LanguageContext';

interface HeroProps {
  title?: string;
  description?: string;
}

export const Hero: React.FC<HeroProps> = ({ title, description }) => {
  const { t } = useTranslation();

  const fallbackTitle = t('landing.default.title.home', { defaultValue: "Every AI tool you need to edit images in bulk" });
  const fallbackDesc = t('landing.default.desc.home', { defaultValue: "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser." });

  return (
    <section className="relative pt-6 pb-4 md:pt-10 md:pb-6 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-neon-cyan/20 via-neon-indigo/20 to-neon-violet/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 leading-tight"
        >
          {title || fallbackTitle}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed"
        >
          {description || fallbackDesc}
        </motion.p>

      </div>
    </section>
  );
};
