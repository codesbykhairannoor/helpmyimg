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

  const rawTitle = title || t('hero.title', { defaultValue: t('landing.default.title.home', { defaultValue: "Professional Photo Studio & Bulk Toolkit" }) });
  
  // Split title intelligently for the gradient effect requested
  const words = rawTitle.split(' ');
  const splitIndex = Math.max(1, Math.ceil(words.length * 0.6));
  const gradientPart = words.slice(0, splitIndex).join(' ');
  const solidPart = words.slice(splitIndex).join(' ');

  // Keep description short as requested
  const shortDesc = description || t('hero.subtitle.short', { defaultValue: "Combine, split, compress, convert, and process photos directly in your browser. 100% offline via WebAssembly. Free, unlimited, and highly secure." });

  return (
    <section className="relative pt-2 md:pt-6 pb-8 md:pb-12 overflow-hidden flex flex-col items-center justify-center text-center">
      {/* Very subtle background light/dark aware */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-100 dark:from-dark-800 to-transparent opacity-50 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
        
        {/* Title: Gradient + Solid, Centered, Huge */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black tracking-tighter mb-6 leading-[1.15]">
          <span className="bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo bg-clip-text text-transparent drop-shadow-sm">
            {gradientPart}
          </span>{' '}
          <span className="text-slate-800 dark:text-slate-100">
            {solidPart}
          </span>
        </h1>

        {/* Short Description */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          {shortDesc}
        </p>

        {/* Search Bar matching the image layout */}
        {!title && (
          <div className="relative max-w-2xl mx-auto mb-8 shadow-xl shadow-slate-200/20 dark:shadow-none rounded-full group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-neon-cyan transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-6 py-4 rounded-full border-0 bg-white dark:bg-dark-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-neon-cyan focus:outline-none sm:text-lg transition-all duration-300"
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
