import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPSeoConfigBySlug, type PSeoKeywordConfig } from '../data/pseoKeywords';
import { SeoHead } from '../components/seo/SeoHead';
import { Hero } from '../components/Hero';
import { LandingSections } from '../components/landing/LandingSections';
import { HomeSections } from '../components/landing/HomeSections';
import { ToolGrid } from '../components/ToolGrid';
import { useTranslation } from '../context/LanguageContext';
import { type Language } from '../i18n/translations';
import { Loader2, HelpCircle } from 'lucide-react';

import { getToolFromSlug } from '../utils/urlMapper';
import { synthesizeDynamicPSeo } from '../utils/dynamicPSeoSynthesizer';
import { lazyWithRetry } from '../utils/lazyWithRetry';

const ToolWorkspace = lazyWithRetry(() => import('../components/workspace/ToolWorkspace').then(module => ({ default: module.ToolWorkspace })), 'ToolWorkspace');

export const ToolLandingPage: React.FC = () => {
  const { lang = 'en', tool, keywordSlug } = useParams<{ lang: string; tool: string; keywordSlug: string }>();
  const { setLang, lang: currentLang, t } = useTranslation();

  // Sync language dari URL ke context
  useEffect(() => {
    if (lang && lang !== currentLang) {
      setLang(lang as Language);
    }
  }, [lang, currentLang, setLang]);

  // Translate localized URL slug back to internal tool ID
  const internalTool = tool ? getToolFromSlug(tool, lang) : 'remove';

  // Cari konfigurasi SEO dari matriks
  const config: PSeoKeywordConfig | undefined = keywordSlug ? getPSeoConfigBySlug(keywordSlug) : undefined;

  const defaultTitle = !tool 
    ? t('landing.default.title.home', { defaultValue: "Every AI tool you need to edit images in bulk" })
    : internalTool === 'color' 
    ? t('landing.default.title.color') 
    : internalTool === 'watermark'
    ? t('landing.default.title.watermark')
    : internalTool === 'compress'
    ? t('landing.default.title.compress')
    : internalTool === 'convert'
    ? t('landing.default.title.convert')
    : internalTool === 'resize'
    ? t('landing.default.title.resize')
    : internalTool === 'crop'
    ? t('landing.default.title.crop')
    : internalTool === 'rotate'
    ? t('landing.default.title.rotate')
    : internalTool === 'picker'
    ? t('landing.default.title.picker')
    : internalTool === 'blurface'
    ? t('landing.default.title.blurface')
    : internalTool === 'design'
    ? t('landing.default.title.design')
    : t('landing.default.title.remove');

  const defaultH1 = !tool
    ? t('landing.default.title.home', { defaultValue: "Every AI tool you need to edit images in bulk" })
    : internalTool === 'color' 
    ? t('landing.default.title.color') 
    : internalTool === 'watermark'
    ? t('landing.default.title.watermark')
    : internalTool === 'compress'
    ? t('landing.default.title.compress')
    : internalTool === 'convert'
    ? t('landing.default.title.convert')
    : internalTool === 'resize'
    ? t('landing.default.title.resize')
    : internalTool === 'crop'
    ? t('landing.default.title.crop')
    : internalTool === 'rotate'
    ? t('landing.default.title.rotate')
    : internalTool === 'picker'
    ? t('landing.default.title.picker')
    : internalTool === 'blurface'
    ? t('landing.default.title.blurface')
    : internalTool === 'design'
    ? t('landing.default.title.design')
    : t('landing.default.title.remove');

  const defaultDesc = !tool
    ? t('landing.default.desc.home', { defaultValue: "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser." })
    : internalTool === 'color' 
    ? t('landing.default.desc.color') 
    : internalTool === 'watermark'
    ? t('landing.default.desc.watermark')
    : internalTool === 'compress'
    ? t('landing.default.desc.compress')
    : internalTool === 'convert'
    ? t('landing.default.desc.convert')
    : internalTool === 'resize'
    ? t('landing.default.desc.resize')
    : internalTool === 'crop'
    ? t('landing.default.desc.crop')
    : internalTool === 'rotate'
    ? t('landing.default.desc.rotate')
    : internalTool === 'picker'
    ? t('landing.default.desc.picker')
    : internalTool === 'brush'
    ? t('landing.default.desc.blur')
    : internalTool === 'blurface'
    ? t('landing.default.desc.blurface')
    : internalTool === 'design'
    ? t('landing.default.desc.design')
    : t('landing.default.desc.remove');

  // Resolve tool string for i18n keys
  const toolMapName = ['remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker'].includes(internalTool) ? internalTool : 'remove';

  let displayConfig: PSeoKeywordConfig;
  if (config) {
    displayConfig = config;
  } else if (keywordSlug) {
    // Gunakan Mesin Sintesis pSEO dinamis untuk memproses slug seperti kompres-foto-100kb atau compress-20-photos
    displayConfig = synthesizeDynamicPSeo(keywordSlug, internalTool, lang, defaultTitle, defaultDesc);
  } else {
    displayConfig = {
      slug: tool || '',
      tool: internalTool as any,
      lang: lang,
      title: `${defaultTitle} (${lang.toUpperCase()})`,
      h1: defaultH1,
      description: defaultDesc,
      citationFirst: defaultDesc,
      quantitativeProof: defaultDesc,
      beforeImageLabel: 'Original',
      afterImageLabel: 'HD Result',
      faqs: []
    };
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SeoHead
        title={displayConfig.title}
        description={displayConfig.description}
        canonicalPath={`/${lang}/${tool || 'remove-background'}${keywordSlug ? `/${keywordSlug}` : ''}`}
        lang={lang}
        citationFirst={displayConfig.citationFirst}
        quantitativeProof={displayConfig.quantitativeProof}
        internalTool={internalTool}
        keywordSlug={keywordSlug}
      />

      {/* Hero Section */}
      <Hero 
        title={!tool ? undefined : displayConfig.h1} 
        description={!tool ? undefined : displayConfig.description} 
      />


      {/* CORE TOOL WORKSPACE ATAU HOMEPAGE GRID */}
      <div className="-mt-4 relative z-10">
        {!tool ? (
          <ToolGrid />
        ) : (
          <React.Suspense fallback={
            <div className="w-full max-w-7xl mx-auto h-[600px] glass-panel rounded-3xl flex flex-col items-center justify-center">
              <Loader2 className="w-12 h-12 text-neon-cyan animate-spin mb-4" />
              <p className="text-slate-400 font-medium">Memuat Workspace...</p>
            </div>
          }>
            <ToolWorkspace key={displayConfig.tool} initialTab={displayConfig.tool} />
          </React.Suspense>
        )}
      </div>
      


      {/* SECTIONS & FAQ: Home Domination vs Tool Specific */}
      <div className="mt-32 sm:mt-40">
        {!tool ? (
          <HomeSections />
        ) : (
          <>
            <LandingSections tool={(displayConfig.tool === 'brush' ? 'remove' : displayConfig.tool) as any} />
          
          {/* Tool Specific FAQ Section - Unified 4 Questions Redesign */}
          <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-16 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none -z-10" />
            
            <div className="text-center mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30">
                {t('landing.global.faq.tag', { defaultValue: 'HELP CENTER & FAQ' })}
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-6 tracking-tight">
                {t('landing.global.faq.title', { defaultValue: 'Frequently Asked Questions' })}
              </h2>
              <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto">
                {t('landing.global.faq.desc', { defaultValue: 'Everything you need to know about our local processing engine.' })}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {[1, 2, 3, 4].map((num) => {
                const qKey = `landing.${toolMapName}.faq${num}.q`;
                const aKey = `landing.${toolMapName}.faq${num}.a`;
                const qText = t(qKey);
                const aText = t(aKey);
                
                // If the translation key equals the result, it means it doesn't exist for this tool
                if (qText === qKey) return null;
                
                return (
                  <div key={num} className="glass-panel p-8 rounded-3xl border border-dark-600/50 hover:border-neon-cyan/40 hover:bg-dark-800/80 transition-all duration-300 group hover:shadow-[0_10px_30px_-15px_rgba(34,211,238,0.2)] flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-neon-cyan mb-6 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/30 transition-colors">
                        <HelpCircle className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-neon-cyan transition-colors">
                        {qText}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-body">
                        {aText}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}
      </div>
    </div>
  );
};
