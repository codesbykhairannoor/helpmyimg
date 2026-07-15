// @refresh reset
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { getLocalizedSlug } from '../utils/urlMapper';
import { tools, categories } from '../config/tools';
import type { ToolCategory } from '../config/tools';

export const ToolGrid: React.FC = () => {
  const { t, lang } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<ToolCategory | 'all'>('all');

  const filteredTools = activeFilter === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeFilter);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveFilter(cat.id as ToolCategory | 'all')}
            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeFilter === cat.id
                ? 'bg-gradient-to-r from-neon-cyan to-neon-indigo text-white shadow-glow-cyan'
                : 'bg-dark-800 text-slate-400 border border-dark-600 hover:bg-dark-700 hover:text-white'
            }`}
          >
            {t(cat.labelKey)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {/* Invisible H2 to preserve strict semantic heading hierarchy H1 -> H2 -> H3 */}
      <h2 className="sr-only">AI Image & Photo Studio Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.id}
              to={`/${lang}/${getLocalizedSlug(tool.id, lang)}`}
              className="group relative flex flex-col p-6 rounded-2xl bg-dark-800/50 backdrop-blur-sm border border-dark-600/50 hover:bg-dark-700/80 hover:border-neon-cyan/50 transition-all duration-300 overflow-hidden"
            >
              {/* Background Glow Effect on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/10 via-neon-violet/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              
              {tool.isNew && (
                <span className="absolute top-4 right-4 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-sm">
                  New!
                </span>
              )}
              
              <div className="w-14 h-14 rounded-xl bg-dark-900 border border-dark-500/50 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-neon-cyan/50 group-hover:shadow-glow-cyan transition-all duration-300 relative z-10">
                <Icon className="w-6 h-6 text-slate-300 group-hover:text-neon-cyan transition-colors" />
              </div>

              <h3 className="text-xl font-heading font-bold text-white mb-2 relative z-10">
                {t(tool.titleKey)}
              </h3>
              
              <p className="text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors relative z-10 line-clamp-3">
                {t(tool.descKey)}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
