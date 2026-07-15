// src/components/Navbar.tsx
// Navigasi Atas dengan Pemilih 10 Bahasa dan Lencana Kecepatan AI (Subdirectory Router)

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/translations';
import { Globe, ChevronDown, Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToolFromSlug, getLocalizedSlug } from '../utils/urlMapper';
import { tools, categories } from '../config/tools';

export const Navbar: React.FC = () => {
  const { lang, setLang, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  const filteredLangs = SUPPORTED_LANGUAGES.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    setLangOpen(false);
    
    // Ganti subdirektori bahasa di URL saat ini (misal /id/hapus... -> /en/remove...)
    const currentPath = location.pathname;
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 0 && SUPPORTED_LANGUAGES.some(l => l.code === pathParts[0])) {
      const oldLang = pathParts[0];
      pathParts[0] = newLang;
      
      if (pathParts[1]) {
        // Map current localized slug back to internal tool, then map to new localized slug
        const internalTool = getToolFromSlug(pathParts[1], oldLang);
        pathParts[1] = getLocalizedSlug(internalTool, newLang);
      }
      
      navigate('/' + pathParts.join('/'));
    } else {
      navigate(`/${newLang}/${getLocalizedSlug('remove', newLang)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-500/40 bg-dark-900 md:bg-dark-900/80 md:backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Kiri: Brand Logo */}
        <div className="flex items-center justify-start flex-shrink-0">
          <Link to={`/${lang}`} className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 flex-shrink-0 transition-all duration-300 group-hover:scale-105 drop-shadow-glow-cyan">
              <img src="/logo.webp" alt="HelpMyIMG Logo" width="40" height="40" decoding="async" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-heading font-extrabold tracking-tight text-white flex items-center gap-1">
                HelpMyIMG
              </span>
            </div>
          </Link>
        </div>

        {/* Tengah: Navigation Links (Desktop) */}
        <div className="hidden lg:flex items-center justify-center flex-1 relative group px-4">
          <nav className="flex items-center gap-4 xl:gap-6 text-sm font-medium text-slate-300">
            <Link to={`/${lang}/${getLocalizedSlug('remove', lang)}`} className="hover:text-neon-cyan transition-colors font-semibold flex items-center gap-1.5 whitespace-nowrap capitalize">
              {t('nav.removeBg')}
            </Link>
            <Link to={`/${lang}/${getLocalizedSlug('compress', lang)}`} className="hover:text-neon-cyan transition-colors font-semibold flex items-center gap-1.5 whitespace-nowrap capitalize">
              {t('nav.compress') || 'Compress'}
            </Link>
            <Link to={`/${lang}/${getLocalizedSlug('resize', lang)}`} className="hover:text-neon-cyan transition-colors font-semibold flex items-center gap-1.5 whitespace-nowrap capitalize">
              {t('nav.resize')}
            </Link>
            <Link to={`/${lang}/${getLocalizedSlug('convert', lang)}`} className="hover:text-neon-cyan transition-colors font-semibold flex items-center gap-1.5 whitespace-nowrap capitalize">
              {t('nav.convert') || 'Convert Format'}
            </Link>
            
            {/* Menu Dropdown Lainnya */}
            <div className="relative group/dropdown">
              <button className="flex items-center gap-1 text-slate-300 hover:text-neon-cyan transition-colors font-semibold py-2">
                {t('nav.tools') === 'AI Tools' ? 'All Photo Tools' : (t('nav.tools') || 'All Photo Tools')} <ChevronDown className="w-3.5 h-3.5" />
              </button>
              
              {/* Mega Menu Dropdown */}
              {/* Mega Menu Dropdown */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[680px] bg-white dark:bg-dark-800/95 backdrop-blur-xl border border-slate-200 dark:border-dark-500/80 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.25)] dark:shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 p-6 z-50">
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {/* Kolom 1: OPTIMIZE (2) + STUDIO & EDIT (3) = 5 Tools */}
                  <div className="space-y-5">
                    {categories.filter(c => ['optimize', 'edit'].includes(c.id)).map(cat => {
                      const catTools = tools.filter(t => t.category === cat.id);
                      if (catTools.length === 0) return null;
                      
                      return (
                        <div key={cat.id} className="space-y-2">
                          <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-dark-600/50 pb-1.5 flex items-center justify-between">
                            <span>{t(cat.labelKey)}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">{catTools.length} {catTools.length === 1 ? 'tool' : 'tools'}</span>
                          </div>
                          <div className="space-y-1">
                            {catTools.map(tool => (
                              <Link 
                                key={tool.id} 
                                to={`/${lang}/${getLocalizedSlug(tool.id, lang)}`} 
                                className="flex items-start gap-3 p-2 -mx-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-dark-700/60 transition-all duration-200 group/item border border-transparent hover:border-slate-200/50 dark:hover:border-dark-500/50"
                              >
                                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-dark-700 flex items-center justify-center shrink-0 group-hover/item:bg-neon-cyan/10 dark:group-hover/item:bg-neon-cyan/20 group-hover/item:text-neon-cyan transition-colors text-slate-500 dark:text-slate-400 shadow-sm dark:shadow-none group-hover/item:scale-105">
                                  <tool.icon className="w-4 h-4" />
                                </div>
                                <div className="pt-0.5 min-w-0 flex-1">
                                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-neon-cyan transition-colors flex items-center gap-1.5">
                                    <span className="truncate">{t(tool.titleKey)}</span>
                                    {tool.isNew && (
                                      <span className="text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-rose-600 text-white shrink-0 tracking-wider">
                                        New
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                                    {t(tool.descKey)}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Kolom 2: MODIFY (2) + CONVERT (1) + SECURITY (2) = 5 Tools */}
                  <div className="space-y-5">
                    {categories.filter(c => ['modify', 'convert', 'security'].includes(c.id)).map(cat => {
                      const catTools = tools.filter(t => t.category === cat.id);
                      if (catTools.length === 0) return null;
                      
                      return (
                        <div key={cat.id} className="space-y-2">
                          <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-dark-600/50 pb-1.5 flex items-center justify-between">
                            <span>{t(cat.labelKey)}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 font-normal">{catTools.length} {catTools.length === 1 ? 'tool' : 'tools'}</span>
                          </div>
                          <div className="space-y-1">
                            {catTools.map(tool => (
                              <Link 
                                key={tool.id} 
                                to={`/${lang}/${getLocalizedSlug(tool.id, lang)}`} 
                                className="flex items-start gap-3 p-2 -mx-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-dark-700/60 transition-all duration-200 group/item border border-transparent hover:border-slate-200/50 dark:hover:border-dark-500/50"
                              >
                                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-dark-700 flex items-center justify-center shrink-0 group-hover/item:bg-neon-cyan/10 dark:group-hover/item:bg-neon-cyan/20 group-hover/item:text-neon-cyan transition-colors text-slate-500 dark:text-slate-400 shadow-sm dark:shadow-none group-hover/item:scale-105">
                                  <tool.icon className="w-4 h-4" />
                                </div>
                                <div className="pt-0.5 min-w-0 flex-1">
                                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-neon-cyan transition-colors flex items-center gap-1.5">
                                    <span className="truncate">{t(tool.titleKey)}</span>
                                    {tool.isNew && (
                                      <span className="text-[8px] uppercase font-extrabold px-1.5 py-0.5 rounded-full bg-rose-600 text-white shrink-0 tracking-wider">
                                        New
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-2">
                                    {t(tool.descKey)}
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </div>

        {/* Kanan: Theme Toggle, Language Switcher, Mobile Menu */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">

          {/* Theme Toggle Button (Light Mode / Dark Mode) - Hidden on Mobile */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex items-center justify-center w-9 h-9 bg-dark-800 hover:bg-dark-700 border border-dark-500/60 rounded-xl text-slate-200 transition-all duration-200 shadow-sm"
            aria-label="Toggle Theme"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
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
              className="flex items-center gap-2 bg-dark-800 hover:bg-dark-700 border border-dark-500/60 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-200 transition-all duration-200 shadow-sm"
              aria-label="Pilih Bahasa"
            >
              <Globe className="w-4 h-4 text-neon-cyan" />
              <span>{currentLang.flag}</span>
              <span className="hidden sm:inline uppercase font-mono text-xs">{currentLang.code}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-64 sm:w-72 bg-dark-800 border border-dark-500/80 rounded-2xl shadow-2xl py-2 z-50 max-h-96 flex flex-col overflow-hidden"
                  >
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-dark-600/50 mb-1 flex items-center justify-between">
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
                        className="w-full bg-dark-800 text-xs text-white px-2.5 py-1.5 rounded-lg border border-dark-500 focus:outline-none focus:border-neon-cyan transition-colors"
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
                          <Link
                            key={l.code}
                            to={`/${l.code}`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLangChange(l.code as Language);
                            }}
                            className={`w-full flex items-center justify-between px-3.5 py-2 text-sm transition-colors ${
                              lang === l.code
                                ? 'bg-neon-cyan/15 text-neon-cyan font-semibold'
                                : 'text-slate-300 hover:bg-dark-700 hover:text-white'
                            }`}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="text-base">{l.flag}</span>
                              <span>{l.name}</span>
                              <span className="text-xs font-mono text-slate-500 uppercase">({l.code})</span>
                            </span>
                            {lang === l.code && (
                              <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
                            )}
                          </Link>
                        ))
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-9 h-9 bg-dark-800 hover:bg-dark-700 border border-dark-500/60 rounded-xl text-slate-200 transition-all duration-200 shadow-sm ml-1"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-dark-900 border-b border-dark-500/40 shadow-2xl"
          >
            <div className="flex flex-col px-4 pt-4 pb-6 space-y-5 h-[calc(100vh-64px)] overflow-y-auto custom-scrollbar">
              
              {/* Theme Toggle inside Mobile Menu */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full p-3 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-xl transition-colors shadow-sm"
              >
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </span>
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>

              <nav className="flex flex-col space-y-5">
                {categories.filter(c => c.id !== 'all').map(cat => {
                  const catTools = tools.filter(t => t.category === cat.id);
                  if (catTools.length === 0) return null;

                  return (
                    <div key={cat.id} className="space-y-2">
                      <div className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-1">
                        {t(cat.labelKey)}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {catTools.map(tool => (
                          <Link
                            key={tool.id}
                            to={`/${lang}/${getLocalizedSlug(tool.id, lang)}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2.5 p-2 rounded-xl bg-dark-800 border border-dark-600/50 hover:border-neon-cyan/50 active:bg-dark-700 transition-all group shadow-sm"
                          >
                            <div className="w-8 h-8 rounded-lg bg-dark-900 flex items-center justify-center shrink-0 group-active:scale-95 transition-transform border border-dark-600/50 group-hover:border-neon-cyan/30">
                              <tool.icon className="w-4 h-4 text-neon-cyan" />
                            </div>
                            <div className="flex flex-col justify-center min-w-0 pr-1">
                              <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight line-clamp-2">{t(tool.titleKey)}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
