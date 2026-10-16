// src/components/Navbar.tsx
// Navigasi Atas dengan Pemilih 10 Bahasa dan Lencana Kecepatan AI (Subdirectory Router)

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from '../context/RouterContext';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/translations';
import { Globe, ChevronDown, Sun, Moon, Menu, X, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToolFromSlug, getLocalizedSlug, type InternalTool } from '../utils/urlMapper';
import { getInfoPageFromSlug, getLocalizedInfoSlug, type InfoPageType } from '../utils/infoUrlMapper';
// Suppress unused InfoPageType import warning
const _unusedInfoPageType: InfoPageType = 'about';
void _unusedInfoPageType;

import { tools, categories } from '../config/tools';

const TOOL_COLORS: Record<string, string> = {
  remove: '#06b6d4',
  compress: '#a855f7',
  convert: '#0284c7',
  resize: '#10b981',
  crop: '#f43f5e',
  rotate: '#8b5cf6',
  color: '#ec4899',
  design: '#f59e0b',
  picker: '#6366f1',
  watermark: '#3b82f6',
  blurface: '#14b8a6',
  brush: '#f97316',
  metadata: '#10b981',
  editexif: '#eab308',
};

export const Navbar: React.FC = () => {
 const { lang, setLang, t } = useTranslation();
 const { theme, toggleTheme } = useTheme();
 const [langOpen, setLangOpen] = useState(false);
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [mobileSearch, setMobileSearch] = useState('');
 const [searchQuery, setSearchQuery] = useState('');
 const { navigatePath } = useRouter();

 useEffect(() => {
   if (mobileMenuOpen) {
     document.body.style.overflow = 'hidden';
   } else {
     document.body.style.overflow = '';
     setMobileSearch('');
   }
   return () => {
     document.body.style.overflow = '';
   };
 }, [mobileMenuOpen]);

 const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

 const filteredLangs = SUPPORTED_LANGUAGES.filter((l) =>
 l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 l.code.toLowerCase().includes(searchQuery.toLowerCase())
 );

 const handleLangChange = (newLang: Language) => {
 setLang(newLang);
 setLangOpen(false);
 
 const currentPath = window.location.pathname;
 const pathParts = currentPath.split('/').filter(Boolean);
 let oldLang = 'en';
 let toolSlugIndex = 0;

 if (pathParts.length > 0 && SUPPORTED_LANGUAGES.some(l => l.code === pathParts[0])) {
 oldLang = pathParts[0];
 toolSlugIndex = 1;
 }

 const toolSlug = pathParts[toolSlugIndex];
 if (toolSlug) {
 const infoPage = getInfoPageFromSlug(toolSlug);
 if (infoPage) {
 // Informational page, translate its slug
 const newSlug = getLocalizedInfoSlug(infoPage, newLang);
 const rest = pathParts.slice(toolSlugIndex + 1);
 const newPathParts = newLang === 'en' ? [newSlug, ...rest] : [newLang, newSlug, ...rest];
 navigatePath('/' + newPathParts.join('/'));
 } else {
 // Map current localized slug back to internal tool, then map to new localized slug
 const internalTool = getToolFromSlug(toolSlug, oldLang);
 const newSlug = getLocalizedSlug(internalTool, newLang);
 
 const rest = pathParts.slice(toolSlugIndex + 1);
 const newPathParts = newLang === 'en' ? [newSlug, ...rest] : [newLang, newSlug, ...rest];
 navigatePath('/' + newPathParts.join('/'));
 }
 } else {
 navigatePath(newLang === 'en' ? '/' : `/${newLang}`);
 }
 };

 return (
 <>
 <header className="sticky top-0 z-[10001] w-full border-b border-slate-200 dark:border-dark-500/40 bg-white dark:bg-dark-900 shadow-sm dark:shadow-none">
 <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
 {/* Kiri: Brand Logo */}
 <div className="flex items-center justify-start flex-shrink-0">
 <a href={lang === 'en' ? '/' : `/${lang}`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? '/' : `/${lang}`); }} className="flex items-center gap-2 sm:gap-2.5 group">
 <div className="brand-logo-container w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] flex-shrink-0 transition-all duration-300 group-hover:scale-105 drop-shadow-glow-cyan" style={{ width: 34, height: 34, minWidth: 34, minHeight: 34 }}>
 <img src="/logobaru-sm.png" alt="HelpMyIMG Logo" width="34" height="34" decoding="async" className="brand-logo-img w-full h-full object-contain" style={{ width: 34, height: 34, maxWidth: 38, maxHeight: 38, objectFit: 'contain' }} />
 </div>
 <div className="flex flex-col">
 <span className="text-[1.2rem] sm:text-xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
 HelpMy<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-emerald">IMG</span>
 </span>
 </div>
 </a>
 </div>

 {/* Tengah: Navigation Links (Desktop) */}
 <div className="hidden lg:flex items-center justify-center flex-1 relative group px-4">
 <nav className="flex items-center gap-2 xl:gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
 <a href={lang === 'en' ? `/${getLocalizedSlug('remove', lang)}` : `/${lang}/${getLocalizedSlug('remove', lang)}`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? `/${getLocalizedSlug('remove', lang)}` : `/${lang}/${getLocalizedSlug('remove', lang)}`); (document.activeElement as HTMLElement)?.blur(); }} className="hover:text-neon-cyan transition-colors font-bold text-[13.5px] uppercase px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800/50">
 {t('nav.removeBg', { defaultValue: 'Remove Background' })}
 </a>
 <a href={lang === 'en' ? `/${getLocalizedSlug('compress', lang)}` : `/${lang}/${getLocalizedSlug('compress', lang)}`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? `/${getLocalizedSlug('compress', lang)}` : `/${lang}/${getLocalizedSlug('compress', lang)}`); (document.activeElement as HTMLElement)?.blur(); }} className="hover:text-neon-cyan transition-colors font-bold text-[13.5px] uppercase px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800/50">
 {t('nav.compress', { defaultValue: 'Compress Image' })}
 </a>
 <a href={lang === 'en' ? `/${getLocalizedSlug('resize', lang)}` : `/${lang}/${getLocalizedSlug('resize', lang)}`} onClick={(e) => { e.preventDefault(); navigatePath(lang === 'en' ? `/${getLocalizedSlug('resize', lang)}` : `/${lang}/${getLocalizedSlug('resize', lang)}`); (document.activeElement as HTMLElement)?.blur(); }} className="hover:text-neon-cyan transition-colors font-bold text-[13.5px] uppercase px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800/50">
 {t('nav.resize', { defaultValue: 'Resize Image' })}
 </a>
 
 {/* Menu Dropdown All Tools */}
 <div className="relative group/dropdown ml-1">
 <button className="flex items-center gap-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-cyan-800 dark:text-neon-cyan px-3.5 py-1.5 rounded-lg transition-all duration-200 font-bold text-[13.5px] uppercase ">
 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
 {t('nav.tools') === 'AI Tools' ? 'All Photo Tools' : (t('nav.tools', { defaultValue: 'All Photo Tools' }))} 
 <ChevronDown className="w-4 h-4 group-hover/dropdown:rotate-180 transition-transform duration-200" />
 </button>
 
 {/* Premium Full-Width Mega Menu (4 Columns) */}
 <div className="fixed left-0 right-0 top-[55px] bg-white dark:bg-dark-900/95 backdrop-blur-2xl border-b-2 border-neon-cyan shadow-[0_24px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.4)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 py-8 z-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-8 text-left">
 {categories.filter(c => c.id !== 'all').map(cat => {
 const catTools = tools.filter(t => t.category === cat.id);
 if (catTools.length === 0) return null;
 
 return (
 <div key={cat.id} className="flex flex-col">
 <div className="flex items-center gap-2 text-[13.5px] font-bold text-cyan-600 dark:text-neon-cyan uppercase border-b border-slate-100 dark:border-dark-700 pb-2 mb-3">
 {t(cat.labelKey, { defaultValue: cat.defaultLabel })}
 </div>
 <div className="flex flex-col gap-1.5">
 {catTools.map(tool => {
 return (
 <a 
 key={tool.id} 
 href={lang === 'en' ? `/${getLocalizedSlug(tool.id, lang)}` : `/${lang}/${getLocalizedSlug(tool.id, lang)}`} 
 onClick={(e) => {
 e.preventDefault();
 navigatePath(lang === 'en' ? `/${getLocalizedSlug(tool.id, lang)}` : `/${lang}/${getLocalizedSlug(tool.id, lang)}`);
 (document.activeElement as HTMLElement)?.blur();
 }}
 className="flex items-center gap-3.5 py-2 px-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors group/item"
 >
 <tool.icon strokeWidth={1.5} className="w-5 h-5 flex-shrink-0 text-slate-600 dark:text-slate-400 group-hover/item:text-neon-emerald transition-colors" />
 <span className="text-[13.5px] uppercase text-slate-700 dark:text-slate-200 font-bold truncate group-hover/item:text-neon-emerald transition-colors">
 {t(tool.titleKey, { defaultValue: tool.defaultTitle })}
 </span>
 </a>
 );
 })}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </div>
 </nav>
 </div>

 {/* Kanan: Theme Toggle, Language Switcher, Mobile Menu */}
 <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">

 {/* Theme Toggle Button (Light Mode / Dark Mode) - Hidden on Mobile like SolveMyMedia */}
 <button
 onClick={toggleTheme}
 className="hidden sm:flex items-center justify-center w-9 h-9 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-500/60 rounded-xl text-slate-600 dark:text-slate-200 transition-all duration-200 shadow-sm"
 aria-label="Toggle Theme"
 title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
 >
 {theme === 'dark' ? (
 <Sun className="w-4 h-4 text-amber-500 hover:rotate-45 transition-transform duration-300" />
 ) : (
 <Moon className="w-4 h-4 text-indigo-400 hover:-rotate-12 transition-transform duration-300" />
 )}
 </button>

 {/* Language Switcher Dropdown (30 Bahasa with Search) */}
 <div className="relative">
 <button
 onClick={() => {
 setLangOpen(!langOpen);
 setSearchQuery('');
 }}
 className="flex items-center gap-1.5 sm:gap-2 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-500/60 px-2.5 sm:px-3 h-9 rounded-xl text-[13px] sm:text-[14px] font-semibold text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm"
 aria-label="Pilih Bahasa"
 >
 <Globe className="w-4 h-4 text-cyan-600 dark:text-neon-cyan" />
 <span className="text-sm">{currentLang.flag}</span>
 <span className="uppercase font-mono text-[13px] sm:text-[14px] font-bold">{currentLang.code}</span>
 <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
 </button>

 <AnimatePresence>
 {langOpen && (
 <>
 <div
 className="fixed inset-0 z-[55]"
 onClick={() => setLangOpen(false)}
 />
 <motion.div
 initial={{ opacity: 0, y: -10, scale: 0.95 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: -10, scale: 0.95 }}
 transition={{ duration: 0.15 }}
 className="absolute right-0 mt-2 w-64 sm:w-72 bg-dark-800 border border-dark-500/80 rounded-2xl shadow-2xl py-2 z-[60] max-h-96 flex flex-col overflow-hidden"
 >
 <div className="px-3 py-1.5 text-[13.5px] font-semibold text-slate-400 uppercase border-b border-dark-600/50 mb-1 flex items-center justify-between">
 <span>{t('nav.selectLang', { defaultValue: 'Select Language / Locale' })}</span>
 <span className="text-neon-cyan font-mono">{filteredLangs.length}</span>
 </div>
 
 {/* Search Input */}
 <div className="px-3 py-1.5 border-b border-dark-600/50 bg-dark-900/50">
 <input
 type="text"
 placeholder={t('nav.searchLang', { defaultValue: '🔍 Search locale (e.g., Korea, ES, RU)...' })}
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-dark-800 text-[13.5px] text-white px-2.5 py-1.5 rounded-lg border border-dark-500 focus:outline-none focus:border-neon-cyan transition-colors"
 autoFocus
 />
 </div>

 <div className="overflow-y-auto flex-1 divide-y divide-dark-700/40">
 {filteredLangs.length === 0 ? (
 <div className="p-4 text-center text-xs text-slate-400">
 {t('nav.noLang', { defaultValue: 'No locale found' })}
 </div>
 ) : (
 filteredLangs.map((l) => (
 <a
 key={l.code}
 href={l.code === 'en' ? '/' : `/${l.code}`}
 onClick={(e) => {
 e.preventDefault();
 handleLangChange(l.code as Language);
 }}
 className={`w-full flex items-center justify-between px-3.5 py-2 text-[15px] transition-colors ${
 lang === l.code
 ? 'bg-neon-cyan/15 text-neon-cyan font-semibold'
 : 'text-slate-300 hover:bg-dark-700 hover:text-white'
 }`}
 >
 <span className="flex items-center gap-2.5">
 <span className="text-base">{l.flag}</span>
 <span>{l.name}</span>
 <span className="text-[13px] font-mono text-slate-500 uppercase">({l.code})</span>
 </span>
 {lang === l.code && (
 <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
 )}
 </a>
 ))
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>

 {/* Mobile Menu Toggle - 44x44px Touch Target Standard (Apple HIG / SolveMyMedia) */}
 <button
 onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
 className="lg:hidden flex items-center justify-center w-11 h-11 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-500/60 rounded-xl text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm flex-shrink-0 ml-1"
 aria-label="Toggle Mobile Menu"
 >
 {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
 </button>
 </div>
 </div>

 </header>

  {/* Mobile Nav Drawer (SolveMyMedia Layout - 1-Column Stack rendered in Portal) */}
  {mobileMenuOpen && typeof document !== 'undefined' && createPortal(
    <>
      <div
        className="mobile-nav-backdrop"
        onClick={() => setMobileMenuOpen(false)}
      />
      <div
        className="mobile-nav-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-nav-inner">
          {/* Quick Search Tool Input */}
        <div className="mobile-nav-search-bar">
          <Search size={16} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder={lang === 'id' ? 'Cari dari 14 alat foto...' : (lang === 'ms' ? 'Cari semua 14 alat foto...' : 'Search all 14 photo tools...')}
            value={mobileSearch}
            onChange={(e) => setMobileSearch(e.target.value)}
          />
          {mobileSearch && (
            <button
              type="button"
              onClick={() => setMobileSearch('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Result or Category Lists */}
        {mobileSearch.trim() ? (
          <div className="flex flex-col gap-1">
            <div className="mobile-nav-section-label">
              {lang === 'id' ? 'HASIL PENCARIAN' : (lang === 'ms' ? 'KEPUTUSAN CARIAN' : 'SEARCH RESULTS')}
            </div>
            <div className="mobile-nav-list">
              {tools
                .filter(tool => {
                  const name = t(tool.titleKey, { defaultValue: tool.defaultTitle }).toLowerCase();
                  const query = mobileSearch.toLowerCase().trim();
                  return name.includes(query) || tool.id.includes(query) || tool.defaultTitle.toLowerCase().includes(query);
                })
                .map(tool => {
                  const slug = getLocalizedSlug(tool.id, lang);
                  const targetHref = lang === 'en' ? `/${slug}` : `/${lang}/${slug}`;
                  const color = TOOL_COLORS[tool.id] || '#06b6d4';
                  return (
                    <a
                      key={tool.id}
                      href={targetHref}
                      onClick={(e) => {
                        e.preventDefault();
                        navigatePath(targetHref);
                        setMobileMenuOpen(false);
                        document.body.style.overflow = '';
                      }}
                      className="mobile-nav-item"
                    >
                      <div className="mobile-nav-icon-wrap" style={{ color: color, background: `${color}18` }}>
                        <tool.icon size={18} strokeWidth={2} />
                      </div>
                      <div className="mobile-nav-text-wrap">
                        <span className="mobile-nav-title">{t(tool.titleKey, { defaultValue: tool.defaultTitle })}</span>
                      </div>
                      {tool.isNew && <span className="mobile-nav-badge">NEW</span>}
                      <ChevronRight size={16} className="mobile-nav-arrow" />
                    </a>
                  );
                })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {categories.filter(c => c.id !== 'all').map(cat => {
              const catTools = tools.filter(t => t.category === cat.id);
              if (catTools.length === 0) return null;

              return (
                <div key={cat.id}>
                  <div className="mobile-nav-section-label">
                    {t(cat.labelKey, { defaultValue: cat.defaultLabel })}
                  </div>
                  <div className="mobile-nav-list">
                    {catTools.map(tool => {
                      const slug = getLocalizedSlug(tool.id, lang);
                      const targetHref = lang === 'en' ? `/${slug}` : `/${lang}/${slug}`;
                      const color = TOOL_COLORS[tool.id] || '#06b6d4';
                      return (
                        <a
                          key={tool.id}
                          href={targetHref}
                          onClick={(e) => {
                            e.preventDefault();
                            navigatePath(targetHref);
                            setMobileMenuOpen(false);
                            document.body.style.overflow = '';
                          }}
                          className="mobile-nav-item"
                        >
                          <div className="mobile-nav-icon-wrap" style={{ color: color, background: `${color}18` }}>
                            <tool.icon size={18} strokeWidth={2} />
                          </div>
                          <div className="mobile-nav-text-wrap">
                            <span className="mobile-nav-title">{t(tool.titleKey, { defaultValue: tool.defaultTitle })}</span>
                          </div>
                          {tool.isNew && <span className="mobile-nav-badge">NEW</span>}
                          <ChevronRight size={16} className="mobile-nav-arrow" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Theme Card */}
        <div className="mobile-nav-theme-card">
          <div className="flex items-center gap-2.5">
            {theme === 'dark' ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
            <div>
              <div className="text-[0.88rem] font-bold text-slate-900 dark:text-white">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </div>
              <div className="text-[0.74rem] text-slate-500 dark:text-slate-400">
                {lang === 'id' ? 'Ubah tema tampilan' : 'Switch appearance'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[0.82rem] font-bold cursor-pointer transition-all border border-amber-500/40 bg-amber-50 dark:bg-indigo-950/60 dark:border-indigo-500/40 text-amber-700 dark:text-indigo-300 shadow-xs"
          >
            {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-indigo-400" />}
            <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
        </div>
        </div>
      </div>
    </>,
    document.body
  )}
  </>
 );
};
