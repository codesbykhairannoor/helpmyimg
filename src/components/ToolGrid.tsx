// @refresh reset
import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedSlug } from '../utils/urlMapper';
import { tools, categories } from '../config/tools';
import type { ToolCategory } from '../config/tools';
import { trackEvent } from '../utils/analytics';
import { ChevronRight } from 'lucide-react';

export const ToolGrid: React.FC = () => {
  const { t, lang } = useTranslation();
  const { navigatePath } = useRouter();
  const [activeFilter, setActiveFilter] = useState<ToolCategory | 'all'>('all');

  const filteredTools = activeFilter === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeFilter);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10" id="tools-section">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
        
        {/* Sidebar Categories (HelpMyFile style) */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
            <button
              onClick={() => {
                setActiveFilter('all');
                trackEvent('filter_clicked', { filter_id: 'all', lang });
              }}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 shadow-lg shadow-[#05DAED]/20'
                  : 'bg-dark-800/40 text-slate-400 hover:bg-dark-700 hover:text-white border border-dark-600/30'
              }`}
            >
              <span>{t('landing.tools.cat.all', { defaultValue: 'All Tools' })}</span>
              {activeFilter === 'all' && <ChevronRight className="w-5 h-5 hidden lg:block" />}
            </button>
            
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveFilter(cat.id as ToolCategory);
                  trackEvent('filter_clicked', { filter_id: cat.id, lang });
                }}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold transition-all whitespace-nowrap lg:whitespace-normal shrink-0 ${
                  activeFilter === cat.id
                    ? 'bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 shadow-lg shadow-[#05DAED]/20'
                    : 'bg-dark-800/40 text-slate-400 hover:bg-dark-700 hover:text-white border border-dark-600/30'
                }`}
              >
                <span>{t(cat.labelKey)}</span>
                {activeFilter === cat.id && <ChevronRight className="w-5 h-5 hidden lg:block" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid Area */}
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mb-2">
              {t('landing.tools.title', { defaultValue: 'AI Image & Photo Studio Tools' })}
            </h2>
            <p className="text-slate-400 text-lg">
              {t('landing.tools.subtitle', { defaultValue: 'Professional grade processing right in your browser.' })}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
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
                  className="group relative flex flex-col p-6 rounded-[2rem] bg-dark-800/60 border border-dark-600 hover:border-[#05DAED]/50 transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-[#05DAED]/10"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#05DAED]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {tool.isNew && (
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full bg-[#12DA91]/20 text-[#12DA91] border border-[#12DA91]/30">
                      {t('common.new', { defaultValue: 'New!' })}
                    </span>
                  )}
                  
                  <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#05DAED]/30 group-hover:bg-[#05DAED]/10 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-slate-300 group-hover:text-[#05DAED] transition-colors" />
                  </div>

                  <h3 className="text-xl font-bold font-heading text-white mb-3 group-hover:text-[#05DAED] transition-colors">
                    {t(tool.titleKey)}
                  </h3>
                  
                  <p className="text-slate-400 text-sm leading-relaxed mt-auto">
                    {t(tool.descKey)}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
