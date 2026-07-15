// src/components/Footer.tsx
// Komponen Footer Premium ala Apple-Style & Super GEO/SEO Ready
// Mengintegrasikan navigasi cepat, indikasi 30 Bahasa Dunia, dan kepatuhan privasi

import React from 'react';
import { Sparkles, Shield, Zap, Globe, Heart } from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <footer className="w-full border-t border-dark-600/60 bg-dark-900/90 backdrop-blur-xl py-14 mt-20 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Section: Brand & GEO Status */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-dark-700/60">
          <div className="space-y-3 max-w-sm">
            <div className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-neon-cyan via-blue-500 to-neon-indigo p-[1.5px] shadow-glow-cyan">
                <div className="w-full h-full bg-dark-900 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-neon-cyan animate-pulse" />
                </div>
              </div>
              <span className="text-xl font-heading font-extrabold tracking-tight text-white">
                HelpMyIMG <span className="text-neon-cyan text-sm px-2 py-0.5 rounded-full bg-neon-cyan/10 border border-neon-cyan/30 font-mono">{t('footer.badge.ai')}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-body leading-relaxed">
              {t('landing.default.desc')}
            </p>
          </div>

          {/* Geo & Tech Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-800/80 border border-dark-600 text-neon-cyan">
              <Zap className="w-4 h-4" />
              <span>{t('footer.badge.latency')}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-800/80 border border-dark-600 text-neon-emerald">
              <Shield className="w-4 h-4" />
              <span>{t('footer.badge.privacy')}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-800/80 border border-dark-600 text-neon-purple">
              <Globe className="w-4 h-4" />
              <span>{t('footer.badge.lang', { lang: lang.toUpperCase() })}</span>
            </div>
          </div>
        </div>

        {/* Middle Section: Quick Navigation & SEO Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-4 text-sm font-body">
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white uppercase text-xs tracking-wider text-cyan-300">
              {t('nav.tools')}
            </h3>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li><a href={`/${lang}/remove-background`} className="hover:text-white transition-colors py-1.5 block">{t('nav.removeBg')}</a></li>
              <li><a href={`/${lang}/change-background`} className="hover:text-white transition-colors py-1.5 block">{t('nav.colorBg')}</a></li>
              <li><a href={`/${lang}/watermark-image`} className="hover:text-white transition-colors py-1.5 block">{t('nav.watermark') || 'Watermark Image'}</a></li>
              <li><a href={`/${lang}/compress-image`} className="hover:text-white transition-colors py-1.5 block">{t('nav.compress') || 'Compress Image'}</a></li>
              <li><a href={`/${lang}/convert-image`} className="hover:text-white transition-colors py-1.5 block">{t('nav.convert') || 'Convert Image'}</a></li>
              <li><a href={`/${lang}/resize-image`} className="hover:text-white transition-colors py-1.5 block">{t('nav.resize') || 'Resize Image'}</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white uppercase text-xs tracking-wider text-emerald-300">
              {t('nav.pseo')}
            </h3>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li><a href={`/${lang}/change-background/ganti-background-merah-cpns-pas-foto`} className="hover:text-white transition-colors py-1.5 block">{t('footer.link.cpns')}</a></li>
              <li><a href={`/${lang}/change-background/ganti-background-biru-ktp-ijazah`} className="hover:text-white transition-colors py-1.5 block">{t('footer.link.ktp')}</a></li>
              <li><a href={`/${lang}/remove-background/hapus-background-transparan-shopee-tokopedia`} className="hover:text-white transition-colors py-1.5 block">{t('footer.link.shopee')}</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white uppercase text-xs tracking-wider text-indigo-300">
              {t('nav.geo')}
            </h3>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li><a href="#geo-spec" className="hover:text-white transition-colors py-1.5 block">{t('footer.link.zeroCloud')}</a></li>
              <li><a href="#geo-spec" className="hover:text-white transition-colors py-1.5 block">{t('footer.link.citation')}</a></li>
              <li><a href="#geo-spec" className="hover:text-white transition-colors py-1.5 block">{t('footer.link.wasm')}</a></li>
              <li><a href="#geo-spec" className="hover:text-white transition-colors py-1.5 block">{t('footer.link.zeroModel')}</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-heading font-bold text-white uppercase text-xs tracking-wider text-purple-300">
              {t('footer.legal')}
            </h3>
            <ul className="space-y-2 text-slate-300 text-xs">
              <li><a href={`/${lang}/about`} className="hover:text-white transition-colors py-1.5 block">{t('about.title') || 'About Us'}</a></li>
              <li><a href={`/${lang}/privacy`} className="hover:text-white transition-colors py-1.5 block">{t('footer.privacy')}</a></li>
              <li><a href={`/${lang}/terms`} className="hover:text-white transition-colors py-1.5 block">{t('footer.terms')}</a></li>
              <li><a href={`/${lang}/faq`} className="hover:text-white transition-colors py-1.5 block">{t('nav.faq')}</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Built With */}
        <div className="pt-8 border-t border-dark-700/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono mb-4">
          <p className="flex items-center gap-1.5">
            <span>&copy; {new Date().getFullYear()} HelpMyIMG AI Platform.</span>
            <span>{t('footer.rights')}</span>
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>{t('footer.built')}</span>
            <Heart className="w-3.5 h-3.5 text-neon-cyan inline fill-neon-cyan/20" />
          </p>
        </div>

        {/* LSI Keywords Tag Cloud - Rule #4 */}
        <div className="text-[11px] text-zinc-400 opacity-30 leading-relaxed font-sans max-w-7xl mx-auto text-justify pb-4">
          {[
            'remove background online', 'free background remover', 'transparent background maker', 'change photo background', 
            'passport photo maker', 'red background cpns', 'blue background ktp', 'official document photo', 'webgpu ai processing',
            'client-side image editing', 'no server upload privacy', '0ms latency rendering', 'batch background removal', 
            'studio bokeh blur', 'dslr depth of field simulation', 'e-commerce white background', 'shopee product catalog',
            'amazon image compliance', 'linkedin professional portrait', 'ai photo editor', 'magic eraser', 'smart matting algorithm',
            'hair edge cutout precision', '100% free hd download'
          ].map((kw, idx, arr) => (
            <React.Fragment key={idx}>
              <span>{kw}</span>
              {idx < arr.length - 1 && <span className="mx-2 opacity-30">•</span>}
            </React.Fragment>
          ))}
        </div>

      </div>
    </footer>
  );
};
