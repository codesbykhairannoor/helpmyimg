// @refresh reset
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedSlug } from '../utils/urlMapper';
import { tools, categories } from '../config/tools';
import type { ToolCategory } from '../config/tools';
import { trackEvent } from '../utils/analytics';

export const ToolGrid: React.FC = () => {
  const { t, lang } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<ToolCategory | 'all'>('all');

  const filteredTools = activeFilter === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeFilter);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      
      {/* Filters (Centered like the image) */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveFilter(cat.id as ToolCategory | 'all');
              trackEvent('filter_clicked', { filter_id: cat.id, lang });
            }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-sm ${
              activeFilter === cat.id
                ? 'bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-white shadow-lg shadow-neon-cyan/30'
                : 'bg-white dark:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-dark-600 hover:bg-slate-50 dark:hover:bg-dark-700'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Grid: Bento Layout for Desktop, Compact List for Mobile */}
      <h2 className="sr-only">AI Image & Photo Studio Tools</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 auto-rows-[minmax(180px,auto)]">
        {filteredTools.map((tool) => {
          const Icon = tool.icon;
          
          // Logic for Bento Grid: Feature the first two tools if viewing all
          const isFeaturedLarge = activeFilter === 'all' && (tool.id === 'remove');
          const isFeaturedWide = activeFilter === 'all' && (tool.id === 'design' || tool.id === 'color');
          
          let colSpan = "col-span-1";
          let rowSpan = "row-span-1";
          
          if (isFeaturedLarge) {
            colSpan = "md:col-span-2 lg:col-span-2";
            rowSpan = "md:row-span-2 lg:row-span-2";
          } else if (isFeaturedWide) {
            colSpan = "md:col-span-2 lg:col-span-2";
          }

          return (
            <Link
              key={tool.id}
              to={`/${lang}/${getLocalizedSlug(tool.id, lang)}`}
              onClick={() => trackEvent('tool_clicked', { tool_id: tool.id, category: tool.category, lang })}
              className={`group relative flex flex-col ${isFeaturedLarge ? 'p-8 md:p-10' : 'p-6 md:p-8'} rounded-[2rem] bg-dark-800/40 backdrop-blur-xl border border-white/5 hover:bg-dark-700/60 hover:border-neon-cyan/40 transition-all duration-500 overflow-hidden shadow-2xl ${colSpan} ${rowSpan}`}
            >
              {/* Premium Background Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 via-neon-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              {tool.isNew && (
                <span className="absolute top-5 right-5 text-[10px] md:text-xs uppercase font-black tracking-widest px-3 py-1.5 rounded-full bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/20 z-20">
                  {t('common.new', { defaultValue: 'New!' })}
                </span>
              )}
              
              <div className={`${isFeaturedLarge ? 'w-16 h-16 md:w-20 md:h-20 mb-8' : 'w-12 h-12 md:w-14 md:h-14 mb-5'} rounded-2xl bg-dark-900 border border-dark-600/50 flex items-center justify-center group-hover:scale-110 group-hover:border-neon-cyan/50 group-hover:bg-neon-cyan/10 group-hover:shadow-[0_0_20px_rgba(5,218,237,0.3)] transition-all duration-500 relative z-10`}>
                <Icon className={`${isFeaturedLarge ? 'w-8 h-8 md:w-10 md:h-10' : 'w-6 h-6'} text-slate-300 group-hover:text-neon-cyan transition-colors`} />
              </div>

              <div className="mt-auto relative z-10">
                <h3 className={`${isFeaturedLarge ? 'text-2xl md:text-4xl mb-3' : 'text-xl font-bold mb-2'} font-heading font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 transition-all`}>
                  {t(tool.titleKey)}
                </h3>
                
                <p className={`${isFeaturedLarge ? 'text-base md:text-lg text-slate-300 line-clamp-3 md:line-clamp-none' : 'text-sm text-slate-400 line-clamp-2'} leading-relaxed group-hover:text-slate-200 transition-colors`}>
                  {t(tool.descKey)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
