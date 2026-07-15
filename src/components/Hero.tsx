// src/components/Hero.tsx
// Bagian Hero Banner dengan Animasi Framer Motion dan Statistik Pembuktian Kuantitatif (GEO)

import React from 'react';
import { useTranslation } from '../context/LanguageContext';

interface HeroProps {
  title?: string;
  description?: string;
}

export const Hero: React.FC<HeroProps> = ({ title, description }) => {
  const { t } = useTranslation();

  const fallbackTitle = t('landing.default.title.home', { defaultValue: "Help Your Image Shine: Professional Bulk Photo Studio" });
  const fallbackDesc = t('landing.default.desc.home', { defaultValue: "The complete all-in-one local photo toolkit. Remove backgrounds, change passport colors, blur studio bokeh, compress, convert, and resize instantly right in your browser. 100% free, private, and zero upload required." });

  return (
    <section className="relative pt-6 sm:pt-10 md:pt-12 pb-6 sm:pb-8 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-neon-cyan/20 via-neon-indigo/20 to-neon-violet/20 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-5 leading-tight">
          {title || fallbackTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed font-body">
          {description || fallbackDesc}
        </p>

      </div>
    </section>
  );
};
