// @refresh reset
import React, { useState, useMemo } from 'react';
import { useRouter } from '../context/RouterContext';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedSlug } from '../utils/urlMapper';
import { tools, categories } from '../config/tools';
import type { ToolCategory } from '../config/tools';
import { trackEvent } from '../utils/analytics';
import { ArrowRight, Search } from 'lucide-react';

export const ToolGrid: React.FC = () => {
  const { t, lang } = useTranslation();
  const { navigatePath } = useRouter();
  const [activeFilter, setActiveFilter] = useState<ToolCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Derived title mapping for category display
  const getCategoryTitle = () => {
    if (activeFilter === 'all') return t('landing.tools.cat.all', { defaultValue: 'All Tools' });
    const cat = categories.find(c => c.id === activeFilter);
    return cat ? t(cat.labelKey) : 'Tools';
  };

  const filteredTools = useMemo(() => {
    let result = tools;
    
    if (activeFilter !== 'all') {
      result = result.filter(tool => tool.category === activeFilter);
    }
    
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(tool => {
        const title = t(tool.titleKey).toLowerCase();
        const desc = t(tool.descKey).toLowerCase();
        return title.includes(query) || desc.includes(query);
      });
    }
    
    return result;
  }, [activeFilter, searchQuery, t]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10" id="tools-section">
      
      {/* Search Bar (Like HelpMyFile) */}
      <div className="flex justify-center mb-10">
        <div className="relative w-full max-w-2xl group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-[#05DAED] transition-colors" />
          </div>
          <input
            type="text"
            className="block w-full pl-14 pr-6 py-4 rounded-full bg-dark-800/80 border border-dark-600 focus:border-[#05DAED]/50 focus:ring-4 focus:ring-[#05DAED]/10 text-white placeholder-slate-500 transition-all shadow-lg"
            placeholder={t('landing.tools.search', { defaultValue: 'Search image tools (Remove Background, Compress, Convert...)' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Horizontal Pill Categories (Like HelpMyFile) */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
        <button
          onClick={() => {
            setActiveFilter('all');
            trackEvent('filter_clicked', { filter_id: 'all', lang });
          }}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
            activeFilter === 'all'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] border-transparent'
              : 'bg-dark-800 border border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white'
          }`}
        >
          {t('landing.tools.cat.all', { defaultValue: 'All Tools' })}
        </button>
        
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveFilter(cat.id as ToolCategory);
              trackEvent('filter_clicked', { filter_id: cat.id, lang });
            }}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeFilter === cat.id
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] border-transparent'
                : 'bg-dark-800 border border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Section Header */}
      <div className="flex items-end gap-3 mb-10">
        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
          {getCategoryTitle()}
        </h2>
        <span className="text-xl sm:text-2xl text-slate-500 font-medium pb-0.5">
          ({filteredTools.length})
        </span>
      </div>
      
      {/* Grid of Tools */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            
            return (
              <a
                key={tool.id}
                href={lang === 'en' ? `/${getLocalizedSlug(tool.id, lang)}` : `/${lang}/${getLocalizedSlug(tool.id, lang)}`}
                onClick={(e) => {
                  e.preventDefault();
                  trackEvent('tool_clicked', { tool_id: tool.id, category: tool.category, lang });
                  navigatePath(lang === 'en' ? `/${getLocalizedSlug(tool.id, lang)}` : `/${lang}/${getLocalizedSlug(tool.id, lang)}`);
                }}
                className="group relative flex flex-col p-8 sm:p-10 rounded-[2.5rem] bg-dark-900/80 border border-dark-600 hover:border-rose-500/30 hover:bg-dark-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.1)] min-h-[340px]"
              >
                {/* Top Row: Icon and Badge */}
                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-[1.25rem] bg-dark-800 border border-dark-600 flex items-center justify-center group-hover:bg-rose-500/10 group-hover:border-rose-500/30 transition-colors duration-300 shadow-sm">
                    <Icon className="w-6 h-6 text-slate-300 group-hover:text-rose-500 transition-colors" />
                  </div>
                  
                  {tool.isNew ? (
                    <span className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                      {t('common.new', { defaultValue: 'New!' })}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full bg-dark-800 text-slate-500 border border-dark-600 uppercase">
                      IMG
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="relative z-10 flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mb-4 group-hover:text-rose-400 transition-colors leading-tight">
                    {t(tool.titleKey)}
                  </h3>
                  
                  <p className="text-slate-400 text-base leading-relaxed line-clamp-3">
                    {t(tool.descKey)}
                  </p>
                </div>

                {/* Bottom Try Now Row */}
                <div className="mt-8 pt-6 border-t border-dark-700 flex justify-between items-center text-slate-500 group-hover:text-rose-500 transition-colors relative z-10">
                  <span className="font-bold text-sm uppercase tracking-wider">
                    {t('landing.tools.tryNow', { defaultValue: 'Try Now' })}
                  </span>
                  <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-dark-900/50 rounded-[2.5rem] border border-dark-600">
          <p className="text-xl text-slate-400">
            {t('landing.tools.noResults', { defaultValue: 'No tools found matching your search.' })}
          </p>
        </div>
      )}
    </div>
  );
};
