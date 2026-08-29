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

  const isPseoTool = ['compress100kb', 'compress50kb', 'compress200kb', 'resizeig', 'resizepassport', 'removelogo', 'colorwhite', 'removeperson', 'convertwebp', 'watermarkbulk', 'blurplate'].includes(internalTool);


  // Cari konfigurasi SEO dari matriks
  let config: PSeoKeywordConfig | undefined = keywordSlug ? getPSeoConfigBySlug(keywordSlug) : undefined;
  if (!config && isPseoTool) {
    config = getPSeoConfigBySlug(keywordSlug || '') || PSEO_KEYWORD_MATRIX.find(c => c.tool === internalTool && c.lang === lang);
  }

  const defaultTitle = isPseoTool ? t(`seo.title.${internalTool}`, { defaultValue: config?.title || "HelpMyIMG" }) : (!tool 
    ? t('home.tab.title', { defaultValue: "HelpMyIMG | All Image Tools in One Place" })
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
    : internalTool === 'brush'
    ? t('brush.title')
    : t('landing.default.title.remove'));

  const defaultH1 = isPseoTool && config ? t(`seo.h1.${internalTool}`, { defaultValue: config.h1 }) : (!tool
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
    : internalTool === 'brush'
    ? t('brush.title')
    : t('landing.default.title.remove'));

  const defaultDesc = isPseoTool && config ? t(`seo.desc.${internalTool}`, { defaultValue: config.description || '' }) : (!tool
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
    : internalTool === 'blurface'
    ? t('landing.default.desc.blurface')
    : internalTool === 'design'
    ? t('landing.default.desc.design')
    : internalTool === 'brush'
    ? t('brush.desc')
    : t('landing.default.desc.remove'));

  const toolMapName = internalTool;
  const displayConfig = {
    title: defaultTitle,
    description: defaultDesc,
    h1: defaultH1,
    tool: internalTool
  };

  return (

    <div className="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SeoHead
        key={`${lang}-${tool || 'home'}`}
        title={dynamicJsonData ? dynamicJsonData.title : displayConfig.title}
        description={dynamicJsonData ? dynamicJsonData.description : displayConfig.description}
        canonicalPath={`/${lang === 'en' ? '' : lang + '/'}${tool || 'remove-background'}${keywordSlug ? `/${keywordSlug}` : ''}`.replace('//', '/')}
        lang={lang}
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
          </>
        )}
      </div>
    </div>
  );
};
