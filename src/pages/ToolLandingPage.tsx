import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPSeoConfigBySlug, type PSeoKeywordConfig } from '../data/pseoKeywords';
import { SeoHead } from '../components/seo/SeoHead';
import { Hero } from '../components/Hero';
import { LandingSections } from '../components/landing/LandingSections';
import { HomeSections } from '../components/landing/HomeSections';
import { ToolFaqSection } from '../components/landing/ToolFaqSection';
import { ToolGrid } from '../components/ToolGrid';
import { useTranslation } from '../context/LanguageContext';
import { type Language, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { Loader2 } from 'lucide-react';

import { getToolFromSlug } from '../utils/urlMapper';
import { synthesizeDynamicPSeo } from '../utils/dynamicPSeoSynthesizer';
import { ToolWorkspace } from '../components/workspace/ToolWorkspace';

export const ToolLandingPage: React.FC = () => {
  let { lang, tool, keywordSlug } = useParams<{ lang: string; tool: string; keywordSlug: string }>();
  const { setLang, lang: currentLang, t } = useTranslation();

  // If lang is not a valid language code (e.g. /remove-background), it means it's an English route.
  // Shift the params accordingly.
  const isLangValid = lang && SUPPORTED_LANGUAGES.some(l => l.code === lang);
  if (!isLangValid && lang) {
    keywordSlug = tool;
    tool = lang;
    lang = 'en';
  } else if (!lang) {
    lang = 'en';
  }

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
      title: defaultTitle,
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
        canonicalPath={`/${lang === 'en' ? '' : lang + '/'}${tool || 'remove-background'}${keywordSlug ? `/${keywordSlug}` : ''}`.replace('//', '/')}
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
          <ToolWorkspace initialTab={displayConfig.tool as any} />
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
          {/* Tool Specific FAQ Section - Dynamic Variants */}
          <ToolFaqSection 
            toolMapName={toolMapName} 
            variant={
              toolMapName === 'remove' ? 'grid' :
              toolMapName === 'compress' ? 'cards' :
              toolMapName === 'color' ? 'accordion' :
              toolMapName === 'resize' ? 'split' :
              toolMapName === 'crop' ? 'cards' :
              toolMapName === 'rotate' ? 'accordion' :
              toolMapName === 'watermark' ? 'split' :
              toolMapName === 'design' ? 'grid' :
              toolMapName === 'picker' ? 'cards' :
              toolMapName === 'blurface' ? 'accordion' :
              toolMapName === 'convert' ? 'split' : 'grid'
            } 
          />
        </>
      )}
      </div>
    </div>
  );
};
