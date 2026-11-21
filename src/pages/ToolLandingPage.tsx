import React, { useEffect, Suspense, lazy } from 'react';
import { useRouter } from '../context/RouterContext';
import { SeoHead } from '../components/seo/SeoHead';
import { Hero } from '../components/Hero';
import { LandingSections } from '../components/landing/LandingSections';
import { ToolFaqSection } from '../components/landing/ToolFaqSection';
import { ToolGrid } from '../components/ToolGrid';
import { useTranslation } from '../context/LanguageContext';
import { type Language } from '../i18n/translations';
import { getLocalizedSlug } from '../utils/urlMapper';

const ToolWorkspace = lazy(() => import('../components/workspace/ToolWorkspace').then(m => ({ default: m.ToolWorkspace })));
const HomeSections = lazy(() => import('../components/landing/HomeSections').then(m => ({ default: m.HomeSections })));

export const ToolLandingPage: React.FC = () => {
  const { setLang, lang: currentLang, t } = useTranslation();
  const { route, hasActiveFiles, setHasActiveFiles } = useRouter();
  const { lang, tool } = route;

  useEffect(() => {
    if (lang && lang !== currentLang) {
      setLang(lang as Language);
    }
  }, [lang, currentLang, setLang]);

  const internalTool = tool || 'remove';

  const defaultTitle = !tool
    ? t('home.tab.title', { defaultValue: 'HelpMyIMG — Private Browser AI Photo Editor' })
    : t(`landing.default.title.${internalTool}`, { defaultValue: t('landing.default.title.remove') });

  const defaultH1 = !tool
    ? t('landing.default.title.home', { defaultValue: 'Every AI tool you need to edit images in bulk' })
    : t(`landing.default.title.${internalTool}`, { defaultValue: t('landing.default.title.remove') });

  const defaultDesc = !tool
    ? t('hero.subtitle.short', { defaultValue: 'Free local AI photo editor. Remove backgrounds, compress, resize, and convert images directly in your browser.' })
    : t(`landing.default.desc.${internalTool}`, { defaultValue: t('landing.default.desc.remove') });

  useEffect(() => {
    setHasActiveFiles(false);
  }, [tool, setHasActiveFiles]);

  // Build route-matched FAQs for JSON-LD schema
  const pageFaqs: { question: string; answer: string }[] = [];
  if (!tool) {
    for (let i = 1; i <= 6; i++) {
      const q = t(`landing.faq${i}.q`, { defaultValue: '' }) || t(`faq${i}.q`, { defaultValue: '' });
      const a = t(`landing.faq${i}.a`, { defaultValue: '' }) || t(`faq${i}.a`, { defaultValue: '' });
      if (q && a && q !== `landing.faq${i}.q` && q !== `faq${i}.q`) {
        pageFaqs.push({ question: q, answer: a });
      }
    }
  } else {
    for (let i = 1; i <= 6; i++) {
      const q = t(`landing.${internalTool}.faq${i}.q`, { defaultValue: '' });
      const a = t(`landing.${internalTool}.faq${i}.a`, { defaultValue: '' });
      if (q && a && q !== `landing.${internalTool}.faq${i}.q`) {
        pageFaqs.push({ question: q, answer: a });
      }
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SeoHead
        key={`${lang}-${tool || 'home'}`}
        title={defaultTitle}
        description={defaultDesc}
        canonicalPath={lang === 'en' ? (!tool ? '/' : `/${getLocalizedSlug(internalTool as any, 'en')}/`) : (!tool ? `/${lang}/` : `/${lang}/${getLocalizedSlug(internalTool as any, lang as any)}/`)}
        lang={lang}
        internalTool={tool ? internalTool : undefined}
        faqs={pageFaqs}
      />

      {/* Hero Section - Hidden in Workspace/Edit Mode to maximize vertical screen space */}
      {!hasActiveFiles && (
        <Hero
          title={!tool ? undefined : defaultH1}
          description={!tool ? undefined : defaultDesc}
        />
      )}

      {/* CORE TOOL WORKSPACE OR HOMEPAGE GRID */}
      <div className={hasActiveFiles ? "pt-2 md:pt-4 relative z-10" : "-mt-4 relative z-10"}>
        {!tool ? (
          <ToolGrid />
        ) : (
          <Suspense fallback={
            <div className="w-full max-w-4xl mx-auto px-4 py-12 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <ToolWorkspace
              key={internalTool}
              initialTab={internalTool as any}
              onActiveChange={setHasActiveFiles}
            />
          </Suspense>
        )}
      </div>

      {/* SECTIONS & FAQ: Hidden in Workspace/Edit Mode for clean distraction-free workspace */}
      {!hasActiveFiles && (
        <div className="mt-32 sm:mt-40">
          <Suspense fallback={null}>
            {!tool ? (
              <HomeSections />
            ) : (
              <>
                <LandingSections tool={internalTool as any} />
                <ToolFaqSection
                  toolMapName={internalTool}
                  variant={
                    internalTool === 'remove' ? 'grid' :
                    internalTool === 'compress' ? 'cards' :
                    internalTool === 'color' ? 'accordion' :
                    internalTool === 'resize' ? 'split' :
                    internalTool === 'crop' ? 'cards' :
                    internalTool === 'rotate' ? 'accordion' :
                    internalTool === 'watermark' ? 'split' :
                    internalTool === 'design' ? 'grid' :
                    internalTool === 'picker' ? 'cards' :
                    internalTool === 'brush' ? 'accordion' :
                    internalTool === 'blurface' ? 'accordion' :
                    internalTool === 'metadata' ? 'cards' :
                    internalTool === 'editexif' ? 'accordion' :
                    internalTool === 'convert' ? 'split' : 'grid'
                  }
                />
              </>
            )}
          </Suspense>
        </div>
      )}
    </div>
  );
};
