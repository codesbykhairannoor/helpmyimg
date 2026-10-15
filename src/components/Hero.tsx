import React, { useState } from 'react';
import { useTranslation } from '../context/LanguageContext';
import { Search } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

interface HeroProps {
  title?: string;
  description?: string;
}

export const Hero: React.FC<HeroProps> = ({ title, description }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');


  
  // Highlight only the core keywords using the translation keys if available
  let gradientPart = '';
  let solidPart = '';
  let gradientFirst = true;
  
  if (title) {
    // For tool specific titles (e.g. 'Free Image Compressor')
    // Strip trailing pipes '|' or dashes '-' to keep H1 clean, focused, and punchy
    const cleanTitle = title.split(/\s*[-|]\s*/)[0].trim();
    const words = cleanTitle.split(/\s+/).filter(Boolean);
    
    // Balanced word split: solid part vs gradient part
    if (words.length <= 1) {
      solidPart = cleanTitle;
      gradientPart = '';
    } else if (words.length <= 3) {
      solidPart = words[0];
      gradientPart = words.slice(1).join(' ');
    } else {
      const splitPoint = Math.floor(words.length / 2);
      solidPart = words.slice(0, splitPoint).join(' ');
      gradientPart = words.slice(splitPoint).join(' ');
    }
    gradientFirst = false;
  } else {
    // For home page, use explicitly translated highlighted and solid parts
    gradientPart = t('home.hero.titleHighlight', { defaultValue: 'All Image' });
    solidPart = t('home.hero.titleSolid', { defaultValue: 'Tools in One Place' });
    gradientFirst = true;
  }

  // Keep description short as requested
  const shortDesc = description || t('hero.subtitle.short', { defaultValue: "Combine, split, compress, convert, and process images directly in your browser. 100% offline via WebAssembly. Free, unlimited, and highly secure." });

  return (
    <section className="relative pt-2 md:pt-6 pb-2 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Very subtle background light/dark aware */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-100 dark:from-dark-800 to-transparent opacity-50 pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
        
        {/* Title: Gradient + Solid, Centered, Huge */}
        <h1 
          className="font-heading font-black mb-6 text-center"
          style={{ 
            fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.03em', 
            lineHeight: 1.15 
          }}
        >
          {gradientFirst ? (
            <>
              <span className="bg-gradient-to-r from-neon-cyan to-neon-indigo bg-clip-text text-transparent drop-shadow-sm inline">
                {gradientPart}
              </span>
              {' '}
              <span className="text-slate-800 dark:text-slate-100 inline">
                {solidPart}
              </span>
            </>
          ) : (
            <>
              <span className="text-slate-800 dark:text-slate-100 inline">
                {solidPart}
              </span>
              {' '}
              {gradientPart && (
                <span className="bg-gradient-to-r from-neon-cyan to-neon-indigo bg-clip-text text-transparent drop-shadow-sm inline">
                  {gradientPart}
                </span>
              )}
            </>
          )}
        </h1>

        {/* Short Description */}
        <p 
          className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
          style={{
            fontSize: 'clamp(0.9rem, 2vw, 1.25rem)',
            fontWeight: 500,
            lineHeight: 1.6
          }}
        >
          {shortDesc}
        </p>

        {/* Search Bar matching the image layout */}
        {!title && (
          <div className="relative max-w-2xl mx-auto mb-4 shadow-xl shadow-slate-200/20 dark:shadow-none rounded-full group">
            <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-neon-cyan transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-full border-0 bg-white dark:bg-dark-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-neon-cyan focus:outline-none text-sm sm:text-lg transition-all duration-300"
              placeholder={t('hero.search.placeholder', { defaultValue: "Search tools (Remove BG, Compress, Edit)..." })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  trackEvent('search', { search_term: searchQuery });
                }
              }}
            />
          </div>
        )}

      </div>
    </section>
  );
};
