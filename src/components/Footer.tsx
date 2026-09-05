// src/components/Footer.tsx
// Komponen Footer Premium ala Apple-Style & Super GEO/SEO Ready
// Mengintegrasikan navigasi cepat seluruh alat, halaman legal, sumber daya, dan kepatuhan privasi

import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Zap } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedSlug, type InternalTool } from '../utils/urlMapper';
import { getLocalizedInfoSlug, type InfoPageType } from '../utils/infoUrlMapper';

export const Footer: React.FC = () => {
  const { navigatePath } = useRouter();
  const { t, lang } = useTranslation();

  const getToolLink = (tool: InternalTool) => {
    const slug = getLocalizedSlug(tool, lang);
    return lang === 'en' ? `/${slug}` : `/${lang}/${slug}`;
  };

  const getInfoLink = (page: InfoPageType) => {
    const slug = getLocalizedInfoSlug(page, lang);
    return lang === 'en' ? `/${slug}` : `/${lang}/${slug}`;
  };

  return (
    <footer className="w-full border-t border-dark-600/60 bg-dark-900/90 backdrop-blur-xl py-12 mt-20 text-slate-600 dark:text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Mission */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 drop-shadow-glow-cyan">
                <img src="/logobaru.png" alt="HelpMyIMG Logo" width="36" height="36" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
                HelpMy<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-emerald">IMG</span>
              </span>
            </div>
            <p className="text-[13px] text-slate-400 leading-relaxed font-body font-medium max-w-sm">
              100% Free, Private, Zero-Cloud AI Image Editing. All machine learning models run securely inside your browser using WebAssembly.
            </p>
          </div>

          {/* Tools Column 1: Core AI & Edit */}
          <div className="space-y-3.5 text-[13px] font-body">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">{t('nav.tools', { defaultValue: 'AI Image Tools' })}</h3>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li>
                <a href={getToolLink('remove')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('remove')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.removeBg', { defaultValue: 'Remove Background' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('color')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('color')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.colorBg', { defaultValue: 'Change Background' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('compress')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('compress')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.compress', { defaultValue: 'Compress Image' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('convert')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('convert')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.convert', { defaultValue: 'Convert Format' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('resize')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('resize')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.resize', { defaultValue: 'Resize Image' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('crop')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('crop')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.crop', { defaultValue: 'Crop & Smart Crop' })}
                </a>
              </li>
            </ul>
          </div>

          {/* Tools Column 2: Security & Advanced */}
          <div className="space-y-3.5 text-[13px] font-body">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">{t('grid.catSecurity', { defaultValue: 'Security & Edit' })}</h3>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li>
                <a href={getToolLink('watermark')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('watermark')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.watermark', { defaultValue: 'Watermark Image' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('blurface')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('blurface')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.blurface', { defaultValue: 'Blur Face & Plate' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('brush')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('brush')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('tab.brush', { defaultValue: 'Magic Brush Eraser' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('rotate')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('rotate')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.rotate', { defaultValue: 'Rotate & Flip' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('picker')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('picker')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.picker', { defaultValue: 'Color Picker' })}
                </a>
              </li>
              <li>
                <a href={getToolLink('design')} onClick={(e) => { e.preventDefault(); navigatePath(getToolLink('design')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.design', { defaultValue: 'Design Editor' })}
                </a>
              </li>
            </ul>
          </div>

          {/* Resources & Legal */}
          <div className="space-y-3.5 text-[13px] font-body">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide">{t('footer.resources', { defaultValue: 'Company & Legal' })}</h3>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400">
              <li>
                <a href={getInfoLink('about')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('about')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('footer.about', { defaultValue: 'About Us' })}
                </a>
              </li>
              <li>
                <a href={getInfoLink('security')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('security')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('footer.security', { defaultValue: 'Security & Trust' })}
                </a>
              </li>
              <li>
                <a href={getInfoLink('pricing')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('pricing')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('footer.pricing', { defaultValue: 'Pricing' })}
                </a>
              </li>
              <li>
                <a href={getInfoLink('compare')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('compare')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('footer.compare', { defaultValue: 'Compare' })}
                </a>
              </li>
              <li>
                <a href={getInfoLink('faq')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('faq')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('nav.faq', { defaultValue: 'FAQ' })}
                </a>
              </li>
              <li>
                <a href={getInfoLink('languages')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('languages')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('footer.languages', { defaultValue: 'Supported Languages' })}
                </a>
              </li>
              <li>
                <a href={getInfoLink('privacy')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('privacy')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('footer.privacy', { defaultValue: 'Privacy Policy' })}
                </a>
              </li>
              <li>
                <a href={getInfoLink('terms')} onClick={(e) => { e.preventDefault(); navigatePath(getInfoLink('terms')); }} className="hover:text-cyan-600 dark:hover:text-white transition-colors">
                  {t('footer.terms', { defaultValue: 'Terms of Service' })}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
          <p>&copy; {new Date().getFullYear()} HelpMyIMG AI Platform. {t('footer.rights', { defaultValue: 'All rights reserved.' })}</p>
          <p className="flex items-center gap-1.5">
            <span>Powered by Local WebGPU AI</span>
            <Zap className="w-3.5 h-3.5 text-cyan-500 inline fill-cyan-500/20" />
          </p>
        </div>
      </div>
    </footer>
  );
};
