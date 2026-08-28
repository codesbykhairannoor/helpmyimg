import React, { useEffect } from 'react';
import { useRouter } from '../context/RouterContext';
import { getPSeoConfigBySlug, PSEO_KEYWORD_MATRIX, type PSeoKeywordConfig } from '../data/pseoKeywords';
import { SeoHead } from '../components/seo/SeoHead';
import { Hero } from '../components/Hero';
import { LandingSections } from '../components/landing/LandingSections';
import { HomeSections } from '../components/landing/HomeSections';
import { ToolFaqSection } from '../components/landing/ToolFaqSection';
import { ToolGrid } from '../components/ToolGrid';
import { useTranslation } from '../context/LanguageContext';
import { type Language } from '../i18n/translations';
import { synthesizeDynamicPSeo } from '../utils/dynamicPSeoSynthesizer';
import { ToolWorkspace } from '../components/workspace/ToolWorkspace';
import { usePSeoData } from '../hooks/usePSeoData';
import { DynamicPSeoSections } from '../components/seo/DynamicPSeoSections';

export const ToolLandingPage: React.FC = () => {
  const { setLang, lang: currentLang, t } = useTranslation();
  const { route } = useRouter();
  let { lang, tool, keywordSlug } = route;

  // Sync language dari URL ke context
  useEffect(() => {
    if (lang && lang !== currentLang) {
      setLang(lang as Language);
    }
  }, [lang, currentLang, setLang]);

  const { data: dynamicJsonData } = usePSeoData(keywordSlug || undefined, lang as string);

  // The route.tool is already parsed as the internal tool by RouterContext
  const internalTool = tool || 'remove';

  // Cari konfigurasi SEO dari matriks
  let config: PSeoKeywordConfig | undefined = keywordSlug ? getPSeoConfigBySlug(keywordSlug) : undefined;
  if (!config && (internalTool === 'compress100kb' || internalTool === 'compress50kb' || internalTool === 'resizeig' || internalTool === 'removelogo' || internalTool === 'colorwhite' || internalTool === 'compress200kb' || internalTool === 'resizepassport')) {
    config = getPSeoConfigBySlug(keywordSlug || '') || PSEO_KEYWORD_MATRIX.find(c => c.tool === internalTool && c.lang === lang);
  }

  const defaultTitle = !tool 
    ? t('home.tab.title', { defaultValue: "HelpMyIMG | All Image Tools in One Place" })
    : internalTool === 'color' 
    ? t('landing.default.title.color') 
    : internalTool === 'watermark'
    ? t('landing.default.title.watermark')
    : internalTool === 'compress'
    ? t('landing.default.title.compress')
    : (internalTool === 'compress100kb' || internalTool === 'compress50kb' || internalTool === 'resizeig') && config
    ? config.title
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
    : internalTool === 'brush'
    ? t('brush.title')
    : t('landing.default.title.remove');

  const defaultH1 = !tool
    ? t('landing.default.title.home', { defaultValue: "Every AI tool you need to edit images in bulk" })
    : internalTool === 'color' 
    ? t('landing.default.title.color') 
    : internalTool === 'watermark'
    ? t('landing.default.title.watermark')
    : internalTool === 'compress'
    ? t('landing.default.title.compress')
    : (internalTool === 'compress100kb' || internalTool === 'compress50kb' || internalTool === 'resizeig') && config
    ? config.h1
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
    : internalTool === 'brush'
    ? t('brush.title')
    : t('landing.default.title.remove');

  const defaultDesc = !tool
    ? t('landing.default.desc.home', { defaultValue: "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser." })
    : internalTool === 'color' 
    ? t('landing.default.desc.color') 
    : internalTool === 'watermark'
    ? t('landing.default.desc.watermark')
    : internalTool === 'compress'
    ? t('landing.default.desc.compress')
    : (internalTool === 'compress100kb' || internalTool === 'compress50kb' || internalTool === 'resizeig') && config
    ? config.description
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
    ? t('brush.desc')
    : internalTool === 'blurface'
    ? t('landing.default.desc.blurface')
    : internalTool === 'design'
    ? t('landing.default.desc.design')
    : t('landing.default.desc.remove');

  // Resolve tool string for i18n keys
  const toolMapName = ['remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'brush', 'blurface', 'design'].includes(internalTool) ? internalTool : 'remove';

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
        key={`${lang}-${tool || 'home'}`}
        title={dynamicJsonData ? dynamicJsonData.title : displayConfig.title}
        description={dynamicJsonData ? dynamicJsonData.description : displayConfig.description}
        canonicalPath={`/${lang === 'en' ? '' : lang + '/'}${tool || 'remove-background'}${keywordSlug ? `/${keywordSlug}` : ''}`.replace('//', '/')}
        lang={lang}
        citationFirst={displayConfig.citationFirst}
        quantitativeProof={displayConfig.quantitativeProof}
        internalTool={internalTool}
        keywordSlug={keywordSlug || undefined}
      />

      {/* Hero Section */}
      <Hero 
        title={dynamicJsonData ? dynamicJsonData.h1 : (!tool ? undefined : displayConfig.h1)} 
        description={dynamicJsonData ? dynamicJsonData.description : (!tool ? undefined : displayConfig.description)} 
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
        ) : dynamicJsonData ? (
          <DynamicPSeoSections data={dynamicJsonData} />
        ) : (
          <>
            <LandingSections tool={displayConfig.tool as any} />
          
          {/* Tool Specific FAQ Section - Unified 4 Questions Redesign */}
          {/* Tool Specific FAQ Section - Dynamic Variants */}
          {!['compress100kb', 'compress50kb', 'resizeig', 'removelogo', 'colorwhite', 'compress200kb', 'resizepassport'].includes(internalTool) && (
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
                toolMapName === 'brush' ? 'accordion' :
                toolMapName === 'blurface' ? 'accordion' :
                toolMapName === 'convert' ? 'split' : 'grid'
              } 
            />
          )}
        </>
      )}
      </div>
    </div>
  );
};
