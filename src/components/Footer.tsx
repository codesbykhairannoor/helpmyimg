// src/components/Footer.tsx
// Komponen Footer Premium ala Apple-Style & Super GEO/SEO Ready
// Mengintegrasikan navigasi cepat, indikasi 30 Bahasa Dunia, dan kepatuhan privasi

import React from 'react';
import { Zap } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <footer className="w-full border-t border-dark-600/60 bg-dark-900/90 backdrop-blur-xl py-12 mt-20 text-slate-600 dark:text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          
          {/* Brand */}
          <div className="space-y-4 max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 drop-shadow-glow-cyan">
                <img src="/logobaru.png" alt="HelpMyIMG Logo" width="36" height="36" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
                HelpMyIMG
              </span>
            </div>
            <p className="text-[12px] text-slate-500 leading-relaxed font-body font-medium">
              100% Free, Private, Zero-Cloud AI Image Editing.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12 sm:gap-24 text-[13px] font-body">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('nav.tools')}</h3>
              <ul className="space-y-2.5 text-slate-500 dark:text-slate-400">
                <li><a href={`/${lang}/remove-background`} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.removeBg')}</a></li>
                <li><a href={`/${lang}/change-background`} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.colorBg')}</a></li>
                <li><a href={`/${lang}/compress-image`} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.compress') || 'Compress Image'}</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('footer.legal')}</h3>
              <ul className="space-y-2.5 text-slate-500 dark:text-slate-400">
                <li><a href={`/${lang}/about`} className="hover:text-cyan-600 dark:hover:text-white transition-colors">About Us</a></li>
                <li><a href={`/${lang}/privacy`} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                <li><a href={`/${lang}/terms`} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.terms')}</a></li>
                <li><a href={`/${lang}/faq`} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.faq')}</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
          <p>&copy; {new Date().getFullYear()} HelpMyIMG AI Platform. {t('footer.rights')}</p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Local WebGPU AI</span>
            <Zap className="w-3.5 h-3.5 text-cyan-500 inline fill-cyan-500/20" />
          </p>
        </div>
      </div>
    </footer>
  );
};
