import React from 'react';
import { getLocalizedSlug } from '../../utils/urlMapper';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { useTranslation } from '../../context/LanguageContext';

export const SeoFooterMatrix: React.FC = () => {
  const { t } = useTranslation();
  const coreTools = ['remove', 'color', 'brush', 'compress', 'convert', 'resize', 'crop', 'rotate', 'watermark'] as const;
  
  return (
    <div className="w-full bg-dark-950 border-t border-dark-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Language & Tool Matrix for Crawlers */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-slate-200 mb-6 font-heading">Global Tools Matrix</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <div key={lang.code} className="space-y-3">
                <a 
                  href={`/${lang.code}`} 
                  hrefLang={lang.code}
                  className="font-bold text-neon-cyan hover:underline text-sm block"
                  title={`${lang.name} AI Image Editor`}
                >
                  {lang.name} ({lang.code.toUpperCase()})
                </a>
                <ul className="space-y-1.5">
                  {coreTools.slice(0, 4).map(tool => (
                    <li key={tool}>
                      <a 
                        href={`/${lang.code}/${getLocalizedSlug(tool, lang.code)}`}
                        hrefLang={lang.code}
                        className="text-xs text-slate-400 hover:text-slate-200 hover:underline block truncate"
                        title={`${tool} in ${lang.name}`}
                      >
                        {getLocalizedSlug(tool, lang.code).replace(/-/g, ' ')}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* SEO Explainer Text */}
        <div className="prose prose-invert max-w-none text-xs text-slate-500">
          <p>
            {/* Using the translation key for the massive SEO description */}
            <span dangerouslySetInnerHTML={{ __html: t('landing.default.desc').replace('Why HelpMyIMG is the Ultimate Image Tool:', '<strong>Why HelpMyIMG is the Ultimate Image Tool:</strong>').replace('0ms latency', '<strong>0ms latency</strong>').replace('absolute 100% privacy', '<strong>absolute 100% privacy</strong>').replace('unlimited batch processing', '<strong>unlimited batch processing</strong>') }} />
          </p>
        </div>
      </div>
    </div>
  );
};
