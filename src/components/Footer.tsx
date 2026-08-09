// src/components/Footer.tsx
// Komponen Footer Premium ala Apple-Style & Super GEO/SEO Ready
// Mengintegrasikan navigasi cepat, indikasi 30 Bahasa Dunia, dan kepatuhan privasi

import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Zap } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedSlug } from '../utils/urlMapper';

export const Footer: React.FC = () => {
  const { navigatePath } = useRouter();
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
                <li><a href={lang === 'en' ? `/${getLocalizedSlug('remove', lang)}` : `/${lang}/${getLocalizedSlug('remove', lang)}`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? `/${getLocalizedSlug('remove', lang)}` : `/${lang}/${getLocalizedSlug('remove', lang)}`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.removeBg')}</a></li>
                <li><a href={lang === 'en' ? `/${getLocalizedSlug('color', lang)}` : `/${lang}/${getLocalizedSlug('color', lang)}`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? `/${getLocalizedSlug('color', lang)}` : `/${lang}/${getLocalizedSlug('color', lang)}`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.colorBg')}</a></li>
                <li><a href={lang === 'en' ? `/${getLocalizedSlug('compress', lang)}` : `/${lang}/${getLocalizedSlug('compress', lang)}`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? `/${getLocalizedSlug('compress', lang)}` : `/${lang}/${getLocalizedSlug('compress', lang)}`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.compress') || 'Compress Image'}</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('footer.legal')}</h3>
              <ul className="space-y-2.5 text-slate-500 dark:text-slate-400">
                <li><a href={lang === 'en' ? '/about' : `/${lang}/about`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/about' : `/${lang}/about`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.about') || 'About Us'}</a></li>
                <li><a href={lang === 'en' ? '/privacy' : `/${lang}/privacy`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/privacy' : `/${lang}/privacy`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.privacy')}</a></li>
                <li><a href={lang === 'en' ? '/terms' : `/${lang}/terms`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/terms' : `/${lang}/terms`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.terms')}</a></li>
                <li><a href={lang === 'en' ? '/faq' : `/${lang}/faq`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/faq' : `/${lang}/faq`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('nav.faq')}</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 dark:text-white">{t('footer.resources') || 'Resources'}</h3>
              <ul className="space-y-2.5 text-slate-500 dark:text-slate-400">
                <li><a href={lang === 'en' ? '/security' : `/${lang}/security`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/security' : `/${lang}/security`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.security') || 'Security & Trust'}</a></li>
                <li><a href={lang === 'en' ? '/pricing' : `/${lang}/pricing`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/pricing' : `/${lang}/pricing`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.pricing') || 'Pricing'}</a></li>
                <li><a href={lang === 'en' ? '/compare' : `/${lang}/compare`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/compare' : `/${lang}/compare`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.compare') || 'Compare'}</a></li>
                <li><a href={lang === 'en' ? '/languages' : `/${lang}/languages`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/languages' : `/${lang}/languages`); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">{t('footer.languages') || 'Supported Languages'}</a></li>
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
