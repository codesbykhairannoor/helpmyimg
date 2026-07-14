import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPSeoConfigBySlug, type PSeoKeywordConfig } from '../data/pseoKeywords';
import { SeoHead } from '../components/seo/SeoHead';
import { Hero } from '../components/Hero';
import { LandingSections } from '../components/landing/LandingSections';
import { LandingStats } from '../components/landing/LandingStats';
import { ToolGrid } from '../components/ToolGrid';
import { useTranslation } from '../context/LanguageContext';
import { type Language } from '../i18n/translations';
import { CheckCircle2, Loader2 } from 'lucide-react';

import { getToolFromSlug } from '../utils/urlMapper';

const ToolWorkspace = React.lazy(() => import('../components/workspace/ToolWorkspace').then(module => ({ default: module.ToolWorkspace })));

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
    ? "Every AI tool you need to edit images in bulk"
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
    ? "Every AI tool you need to edit images in bulk"
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
    ? "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser."
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

  let dynamicTitle = defaultTitle;
  let dynamicH1 = defaultH1;
  
  if (keywordSlug && !config) {
    // Ubah slug seperti "ganti-background-merah" menjadi "Ganti Background Merah"
    const formattedSlug = keywordSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    dynamicTitle = formattedSlug;
    dynamicH1 = formattedSlug;
  }

  // Ensure title always has (LANG) suffix for consistency and NO HelpMyIMG as requested
  const finalTitle = `${dynamicTitle} (${lang.toUpperCase()})`;

  // Resolve tool string for i18n keys
  const toolMapName = ['remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker'].includes(internalTool) ? internalTool : 'remove';

  const displayConfig = config || {
    slug: keywordSlug || tool || '',
    tool: internalTool,
    lang: lang,
    title: finalTitle,
    h1: dynamicH1,
    description: defaultDesc,
    citationFirst: defaultDesc,
    quantitativeProof: defaultDesc,
    beforeImageLabel: 'Original',
    afterImageLabel: 'HD Result',
    faqs: [
      {
        question: t(`landing.${toolMapName}.faq1.q`),
        answer: t(`landing.${toolMapName}.faq1.a`)
      },
      {
        question: t(`landing.${toolMapName}.faq2.q`),
        answer: t(`landing.${toolMapName}.faq2.a`)
      }
    ]
  };

  return (
    <div className="min-h-screen bg-dark-900 text-slate-100 transition-colors duration-300">
      <SeoHead
        title={displayConfig.title}
        description={displayConfig.description}
        canonicalPath={`/${lang}/${tool || 'remove-background'}${keywordSlug ? `/${keywordSlug}` : ''}`}
        lang={lang}
        faqs={displayConfig.faqs}
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
            <ToolWorkspace initialTab={displayConfig.tool} />
          </React.Suspense>
        )}
      </div>
      
      {/* STATISTICS */}
      <LandingStats />

      {/* LANDING SECTIONS (Only show if a specific tool is selected, or if we want to show it on homepage too) */}
      {tool && (
        <LandingSections tool={(displayConfig.tool === 'brush' ? 'remove' : displayConfig.tool) as any} />
      )}

      {/* FAQ SECTION (Clean & Simple) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white text-center mb-8">
          {t(`landing.${toolMapName}.faqTitle`)}
        </h2>
        <div className="space-y-4">
          {displayConfig.faqs.map((faq, idx) => (
            <div key={idx} className="glass-panel p-6 border-dark-500/30">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-3 pl-8 leading-relaxed font-body">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
