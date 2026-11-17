// src/components/Navbar.tsx
// Navigasi Atas dengan Launcher Ekosistem 9-Dots, 30 Bahasa, Desain Capitalize, Darkmode & Mobile Drawer Lengkap

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from '../context/RouterContext';
import { useTranslation } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/translations';
import {
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  Search,
  ChevronRight,
  LogIn,
  LogOut,
  Crown,
  Monitor,
  Smartphone,
  CreditCard,
  ShieldCheck,
  Sparkles,
  FileText,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getToolFromSlug, getLocalizedSlug } from '../utils/urlMapper';
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
  const { user, isPro, openAuthModal, signOut } = useAuth();
  const { navigatePath } = useRouter();

  // Desktop Language Dropdown & Launcher Drawer states
  const [langOpen, setLangOpen] = useState(false);
  const [desktopLangSearch, setDesktopLangSearch] = useState('');
  const desktopLangRef = useRef<HTMLDivElement>(null);

  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [suiteView, setSuiteView] = useState<'main' | 'language'>('main');
  const [suiteLangSearch, setSuiteLangSearch] = useState('');
  const suiteRef = useRef<HTMLDivElement>(null);

  // User menu & Mobile states
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [mobileLangSearch, setMobileLangSearch] = useState('');

  // Close Desktop Language Dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    if (langOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [langOpen]);

  // Close Suite Launcher on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suiteRef.current && !suiteRef.current.contains(event.target as Node)) {
        setIsSuiteOpen(false);
      }
    };
    if (isSuiteOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSuiteOpen]);

  // Handle body overflow lock for mobile drawer
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setMobileSearch('');
      setMobileLangOpen(false);
      setMobileLangSearch('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const currentLang = SUPPORTED_LANGUAGES.find((l) => l.code === lang) || SUPPORTED_LANGUAGES[0];

  const handleLangChange = (newLang: Language) => {
    setLang(newLang);
    setIsSuiteOpen(false);
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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">

          {/* Kiri: Brand Logo - Proportional and fits nicely on mobile */}
          <div className="flex items-center justify-start flex-shrink-0">
            <a
              href={lang === 'en' ? '/' : `/${lang}`}
              onClick={(e) => {
                e.preventDefault();
                navigatePath(lang === 'en' ? '/' : `/${lang}`);
              }}
              className="flex items-center gap-2 sm:gap-2.5 group"
            >
              <div
                className="brand-logo-container w-[28px] h-[28px] sm:w-[34px] sm:h-[34px] flex-shrink-0 transition-all duration-300 group-hover:scale-105 drop-shadow-glow-cyan"
                style={{ width: 28, height: 28, minWidth: 28, minHeight: 28 }}
              >
                <img
                  src="/logobaru-sm.png"
                  alt="HelpMyIMG Logo"
                  width="28"
                  height="28"
                  decoding="async"
                  className="brand-logo-img w-full h-full object-contain"
                  style={{ width: 28, height: 28, maxWidth: 34, maxHeight: 34, objectFit: 'contain' }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[1.08rem] sm:text-xl font-heading font-extrabold text-slate-900 dark:text-white tracking-tight">
                  HelpMy<span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-emerald">IMG</span>
                </span>
              </div>
            </a>
          </div>

          {/* Tengah: Navigation Links (Desktop) - Clean Capitalize / Title Case with +1px font size (15px) */}
          <div className="hidden lg:flex items-center justify-center flex-1 relative group px-4">
            <nav className="flex items-center gap-2 xl:gap-4 font-medium text-slate-700 dark:text-slate-300">
              <a
                href={lang === 'en' ? `/${getLocalizedSlug('remove', lang)}/` : `/${lang}/${getLocalizedSlug('remove', lang)}/`}
                onClick={(e) => {
                  e.preventDefault();
                  navigatePath(lang === 'en' ? `/${getLocalizedSlug('remove', lang)}/` : `/${lang}/${getLocalizedSlug('remove', lang)}/`);
                  (document.activeElement as HTMLElement)?.blur();
                }}
                className="hover:text-neon-cyan transition-colors font-bold text-[15px] px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800/50"
              >
                {t('nav.removeBg', { defaultValue: 'Remove Background' })}
              </a>
              <a
                href={lang === 'en' ? `/${getLocalizedSlug('compress', lang)}/` : `/${lang}/${getLocalizedSlug('compress', lang)}/`}
                onClick={(e) => {
                  e.preventDefault();
                  navigatePath(lang === 'en' ? `/${getLocalizedSlug('compress', lang)}/` : `/${lang}/${getLocalizedSlug('compress', lang)}/`);
                  (document.activeElement as HTMLElement)?.blur();
                }}
                className="hover:text-neon-cyan transition-colors font-bold text-[15px] px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800/50"
              >
                {t('nav.compress', { defaultValue: 'Compress Image' })}
              </a>
              <a
                href={lang === 'en' ? `/${getLocalizedSlug('resize', lang)}/` : `/${lang}/${getLocalizedSlug('resize', lang)}/`}
                onClick={(e) => {
                  e.preventDefault();
                  navigatePath(lang === 'en' ? `/${getLocalizedSlug('resize', lang)}/` : `/${lang}/${getLocalizedSlug('resize', lang)}/`);
                  (document.activeElement as HTMLElement)?.blur();
                }}
                className="hover:text-neon-cyan transition-colors font-bold text-[15px] px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg hover:bg-slate-50 dark:hover:bg-dark-800/50"
              >
                {t('nav.resize', { defaultValue: 'Resize Image' })}
              </a>

              {/* Menu Dropdown All Photo Tools */}
              <div className="relative group/dropdown ml-1">
                <button className="flex items-center gap-2 bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/30 text-cyan-800 dark:text-neon-cyan px-3.5 py-1.5 rounded-lg transition-all duration-200 font-bold text-[15px]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  <span>{t('nav.tools') === 'AI Tools' ? 'All Photo Tools' : (t('nav.tools', { defaultValue: 'All Photo Tools' }))}</span>
                  <ChevronDown className="w-4 h-4 group-hover/dropdown:rotate-180 transition-transform duration-200" />
                </button>

                {/* Premium Full-Width Mega Menu (4 Columns) - +1px font size */}
                <div className="fixed left-0 right-0 top-[55px] bg-white dark:bg-dark-900/95 backdrop-blur-2xl border-b-2 border-neon-cyan shadow-[0_24px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.4)] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 py-8 z-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-x-8 gap-y-8 text-left">
                    {categories.filter(c => c.id !== 'all').map(cat => {
                      const catTools = tools.filter(t => t.category === cat.id);
                      if (catTools.length === 0) return null;

                      return (
                        <div key={cat.id} className="flex flex-col">
                          <div className="flex items-center gap-2 text-[15px] font-bold text-cyan-600 dark:text-neon-cyan border-b border-slate-100 dark:border-dark-700 pb-2 mb-3">
                            {t(cat.labelKey, { defaultValue: cat.defaultLabel })}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {catTools.map(tool => {
                              return (
                                <a
                                  key={tool.id}
                                  href={lang === 'en' ? `/${getLocalizedSlug(tool.id, lang)}/` : `/${lang}/${getLocalizedSlug(tool.id, lang)}/`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    navigatePath(lang === 'en' ? `/${getLocalizedSlug(tool.id, lang)}/` : `/${lang}/${getLocalizedSlug(tool.id, lang)}/`);
                                    (document.activeElement as HTMLElement)?.blur();
                                  }}
                                  className="flex items-center gap-3.5 py-2 px-3 -mx-3 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-800 transition-colors group/item"
                                >
                                  <tool.icon strokeWidth={1.5} className="w-5 h-5 flex-shrink-0 text-slate-600 dark:text-slate-400 group-hover/item:text-neon-emerald transition-colors" />
                                  <span className="text-[15px] text-slate-700 dark:text-slate-200 font-bold truncate group-hover/item:text-neon-emerald transition-colors">
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

          {/* Kanan: Language Switcher, Sign In, 9-Dots Launcher Drawer, Mobile Menu Button */}
          <div className="flex items-center justify-end gap-2 sm:gap-2.5 flex-shrink-0">

            {/* Desktop Language Switcher Dropdown (30 Bahasa with Search) */}
            <div className="relative hidden lg:flex items-center" ref={desktopLangRef}>
              <button
                onClick={() => {
                  setLangOpen(!langOpen);
                  setDesktopLangSearch('');
                  setIsSuiteOpen(false);
                  setUserMenuOpen(false);
                }}
                className="flex items-center gap-1.5 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-600 px-2.5 h-[38px] rounded-xl text-[13.5px] font-bold text-slate-700 dark:text-slate-200 transition-all duration-150 shadow-xs cursor-pointer"
                aria-label="Pilih Bahasa"
              >
                <span className="text-[15px]">{currentLang.flag}</span>
                <span className="uppercase font-mono text-[13px]">{currentLang.code}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <>
                    <div className="fixed inset-0 z-[55]" onClick={() => setLangOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.98 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-2xl shadow-2xl py-2 z-[60] max-h-[calc(100vh-80px)] flex flex-col overflow-hidden"
                    >
                      <div className="px-3.5 py-2 text-[12.5px] font-bold text-slate-500 dark:text-slate-400 uppercase border-b border-slate-100 dark:border-dark-700/60 mb-1 flex items-center justify-between shrink-0">
                        <span>{lang === 'id' ? 'Pilih Bahasa' : 'Select Language'}</span>
                        <span className="text-cyan-600 dark:text-neon-cyan font-mono font-bold">30</span>
                      </div>

                      {/* Search Input */}
                      <div className="px-3 py-1.5 border-b border-slate-100 dark:border-dark-700/60 bg-slate-50/50 dark:bg-dark-900/50 shrink-0">
                        <input
                          type="text"
                          placeholder={lang === 'id' ? 'Cari bahasa...' : 'Search language...'}
                          value={desktopLangSearch}
                          onChange={(e) => setDesktopLangSearch(e.target.value)}
                          className="w-full bg-white dark:bg-dark-750 text-xs text-slate-900 dark:text-white px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-dark-600 focus:outline-none focus:border-neon-cyan transition-colors"
                          autoFocus
                        />
                      </div>

                      <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-dark-700/40">
                        {SUPPORTED_LANGUAGES
                          .filter(l => l.name.toLowerCase().includes(desktopLangSearch.toLowerCase()) || l.code.toLowerCase().includes(desktopLangSearch.toLowerCase()))
                          .map((l) => (
                            <a
                              key={l.code}
                              href={l.code === 'en' ? '/' : `/${l.code}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleLangChange(l.code);
                                setLangOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3.5 py-2 text-[13.5px] transition-colors ${lang === l.code
                                ? 'bg-cyan-500/10 text-cyan-600 dark:text-neon-cyan font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-700 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                              <span className="flex items-center gap-2.5">
                                <span className="text-base">{l.flag}</span>
                                <span>{l.name}</span>
                                <span className="text-[11px] font-mono text-slate-400 uppercase">({l.code})</span>
                              </span>
                              {lang === l.code && (
                                <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
                              )}
                            </a>
                          ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Auth Action: Sign In Button or User Profile Menu */}
            {!user ? (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 sm:gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-[#05DAED] border border-cyan-500/30 hover:border-[#05DAED]/60 px-2.5 sm:px-3 h-8 sm:h-[38px] rounded-xl text-[12.5px] sm:text-[14px] font-semibold transition-all duration-200 shadow-xs cursor-pointer"
                aria-label="Sign In"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{t('nav.signIn', { defaultValue: 'Masuk' })}</span>
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="relative flex items-center gap-2 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-500/60 pl-1.5 pr-2.5 h-8 sm:h-[38px] rounded-xl text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm cursor-pointer"
                  aria-label="User Account"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover ring-1 ring-cyan-500/40"
                    />
                  ) : (
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-[12.5px] sm:text-[13px] font-semibold max-w-[80px] sm:max-w-[90px] truncate hidden md:inline">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                  {isPro ? (
                    <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                      PRO
                    </span>
                  ) : (
                    <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase">
                      FREE
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-[55]" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-[calc(100%+8px)] right-0 w-64 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-500/80 rounded-2xl shadow-2xl py-3 z-[60] overflow-hidden"
                      >
                        <div className="px-4 pb-3 border-b border-slate-100 dark:border-dark-700/60">
                          <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                            {user.displayName || 'Pengguna'}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {user.email}
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Status:</span>
                            {isPro ? (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Crown className="w-3 h-3" /> PRO Member
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded-full">
                                Free Plan
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 px-2">
                          {!isPro && (
                            <a
                              href={lang === 'en' ? '/pricing/' : `/${lang}/pricing/`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigatePath(lang === 'en' ? '/pricing/' : `/${lang}/pricing/`);
                                setUserMenuOpen(false);
                              }}
                              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors mb-1"
                            >
                              <Crown className="w-4 h-4 text-amber-500" />
                              <span>{t('auth.upgradeToPro', { defaultValue: 'Upgrade ke PRO' })}</span>
                            </a>
                          )}

                          <button
                            onClick={() => {
                              signOut();
                              setUserMenuOpen(false);
                            }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t('auth.signOut', { defaultValue: 'Keluar Akun' })}</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Desktop 9-Dots Launcher Button & Drawer (+1px font size) */}
            <div className="relative hidden lg:flex items-center" ref={suiteRef}>
              <button
                onClick={() => {
                  setIsSuiteOpen(!isSuiteOpen);
                  setSuiteView('main');
                  setUserMenuOpen(false);
                  setLangOpen(false);
                }}
                aria-label="Aplikasi & Pengaturan"
                title={lang === 'id' ? 'Aplikasi & Pengaturan' : 'Apps & Preferences'}
                className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition-all duration-150 border cursor-pointer ${isSuiteOpen
                  ? 'bg-cyan-500/15 border-cyan-500/50 text-cyan-600 dark:text-neon-cyan shadow-xs'
                  : 'bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-300'
                  }`}
              >
                {/* 3x3 Grid Dots SVG */}
                <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="4.5" cy="4.5" r="2" />
                  <circle cx="12" cy="4.5" r="2" />
                  <circle cx="19.5" cy="4.5" r="2" />
                  <circle cx="4.5" cy="12" r="2" />
                  <circle cx="12" cy="12" r="2" />
                  <circle cx="19.5" cy="12" r="2" />
                  <circle cx="4.5" cy="19.5" r="2" />
                  <circle cx="12" cy="19.5" r="2" />
                  <circle cx="19.5" cy="19.5" r="2" />
                </svg>
              </button>

              {/* Suite Flyout Card */}
              {isSuiteOpen && (
                <div
                  className="absolute top-[calc(100%+10px)] right-0 w-[840px] max-w-[calc(100vw-24px)] bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-600/80 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.22)] overflow-hidden z-[10002] animate-in fade-in-0 duration-150"
                >
                  {suiteView === 'main' ? (
                    <div>
                      {/* 2-Pane Split Content */}
                      <div className="grid grid-cols-[1.42fr_1fr] min-h-[330px]">

                        {/* LEFT PANE: ECOSYSTEM APPS & PLATFORMS */}
                        <div className="p-5 border-r border-slate-200 dark:border-dark-700/80">
                          <div className="text-[13px] font-extrabold text-cyan-600 dark:text-neon-cyan tracking-wider uppercase mb-3">
                            {lang === 'id' ? 'Aplikasi Web Ekosistem (0% Upload)' : 'Ecosystem Web Apps (0% Server Upload)'}
                          </div>

                          {/* 2x2 Grid of Web Apps */}
                          <div className="grid grid-cols-2 gap-2.5 mb-4">
                            {/* App 1: HelpMyIMG - ACTIVE */}
                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
                              <img
                                src="/ecosystem/helpmyimg.png"
                                alt="HelpMyIMG"
                                className="w-[34px] h-[34px] rounded-lg object-contain shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[15px] font-bold text-cyan-600 dark:text-neon-cyan">HelpMyIMG</span>
                                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-neon-cyan">
                                    Active
                                  </span>
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                                  {lang === 'id' ? 'AI Photo & Edit Foto' : 'AI Photo & Local Editor'}
                                </div>
                              </div>
                            </div>

                            {/* App 2: HandleMyFile */}
                            <a
                              href="https://handlemyfile.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/70 hover:border-rose-500/40 transition-all duration-150 group"
                            >
                              <img
                                src="/ecosystem/handlemyfile.png"
                                alt="HandleMyFile"
                                className="w-[34px] h-[34px] rounded-lg object-contain shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-rose-500 transition-colors">HandleMyFile</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-500 transition-colors shrink-0" />
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                                  {lang === 'id' ? 'Tools PDF & Dokumen' : 'PDF & Document Studio'}
                                </div>
                              </div>
                            </a>

                            {/* App 3: SolveMyMedia */}
                            <a
                              href="https://solvemymedia.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/70 hover:border-purple-500/40 transition-all duration-150 group"
                            >
                              <img
                                src="/ecosystem/solvemymedia.png"
                                alt="SolveMyMedia"
                                className="w-[34px] h-[34px] rounded-lg object-contain shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-purple-400 transition-colors">SolveMyMedia</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-400 transition-colors shrink-0" />
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                                  {lang === 'id' ? 'Video & Audio Lossless' : 'Lossless Video & Audio'}
                                </div>
                              </div>
                            </a>

                            {/* App 4: CreateMy-QR */}
                            <a
                              href="https://createmy-qr.com"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/70 hover:border-amber-500/40 transition-all duration-150 group"
                            >
                              <img
                                src="/ecosystem/createmy-qr.png"
                                alt="CreateMy-QR"
                                className="w-[34px] h-[34px] rounded-lg object-contain shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">CreateMy-QR</span>
                                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-500 transition-colors shrink-0" />
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                                  {lang === 'id' ? 'QR Code & Barcode' : 'Vector QR & Barcodes'}
                                </div>
                              </div>
                            </a>
                          </div>

                          {/* Native Clients Section */}
                          <div className="text-[13px] font-extrabold text-cyan-600 dark:text-neon-cyan tracking-wider uppercase mb-2">
                            {lang === 'id' ? 'Aplikasi Desktop & Mobile' : 'Desktop & Mobile Clients'}
                          </div>
                          <div className="grid grid-cols-2 gap-2.5">
                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700/70">
                              <div className="w-7 h-7 rounded-lg bg-slate-200/60 dark:bg-dark-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                                <Monitor className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[14px] font-bold text-slate-800 dark:text-white">Windows 64-bit</span>
                                  <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-dark-700 text-slate-600 dark:text-slate-400">
                                    {lang === 'id' ? 'Segera' : 'Soon'}
                                  </span>
                                </div>
                                <div className="text-[12.5px] text-slate-500 dark:text-slate-400">100% Offline .exe</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-dark-800 border border-slate-200 dark:border-dark-700/70">
                              <div className="w-7 h-7 rounded-lg bg-slate-200/60 dark:bg-dark-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                                <Smartphone className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[14px] font-bold text-slate-800 dark:text-white">Android App</span>
                                  <span className="text-[11px] font-bold px-1.5 py-0.2 rounded bg-slate-200 dark:bg-dark-700 text-slate-600 dark:text-slate-400">
                                    {lang === 'id' ? 'Segera' : 'Soon'}
                                  </span>
                                </div>
                                <div className="text-[12.5px] text-slate-500 dark:text-slate-400">Zero-Upload APK</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RIGHT PANE: COMPANY & SECURITY */}
                        <div className="p-5 bg-slate-50/60 dark:bg-dark-900/60">
                          <div className="text-[13px] font-extrabold text-cyan-600 dark:text-neon-cyan tracking-wider uppercase mb-3">
                            {lang === 'id' ? 'Perusahaan & Keamanan' : 'Company & Security'}
                          </div>

                          <div className="flex flex-col gap-2">
                            {/* Paket Harga */}
                            <a
                              href={lang === 'en' ? '/pricing/' : `/${lang}/pricing/`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                navigatePath(lang === 'en' ? '/pricing/' : `/${lang}/pricing/`);
                              }}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/70 hover:border-cyan-500/40 transition-all duration-150 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                                <CreditCard className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-cyan-500 transition-colors">
                                  {lang === 'id' ? 'Paket Harga' : 'Pricing & Plans'}
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400">
                                  {lang === 'id' ? 'Free Starter, Pro & Founder' : 'Starter, Pro & Founder Pass'}
                                </div>
                              </div>
                            </a>

                            {/* Privasi Zero-Server */}
                            <a
                              href={lang === 'en' ? '/privacy/' : `/${lang}/privacy/`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                navigatePath(lang === 'en' ? '/privacy/' : `/${lang}/privacy/`);
                              }}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/70 hover:border-emerald-500/40 transition-all duration-150 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
                                <ShieldCheck className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-emerald-500 transition-colors">
                                  {lang === 'id' ? 'Privasi Zero-Server' : 'Zero-Server Privacy'}
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400">
                                  {lang === 'id' ? '100% Olah di browser via WASM' : '100% Client-Side WebAssembly'}
                                </div>
                              </div>
                            </a>

                            {/* Tentang HelpMyIMG */}
                            <a
                              href={lang === 'en' ? '/about/' : `/${lang}/about/`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                navigatePath(lang === 'en' ? '/about/' : `/${lang}/about/`);
                              }}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/70 hover:border-purple-500/40 transition-all duration-150 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                                <Sparkles className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-purple-400 transition-colors">
                                  {lang === 'id' ? 'Tentang HelpMyIMG' : 'About HelpMyIMG'}
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400">
                                  {lang === 'id' ? 'Misi privasi lokal tanpa server' : 'Our local privacy mission'}
                                </div>
                              </div>
                            </a>

                            {/* Syarat & Transparansi */}
                            <a
                              href={lang === 'en' ? '/terms/' : `/${lang}/terms/`}
                              onClick={(e) => {
                                e.preventDefault();
                                setIsSuiteOpen(false);
                                navigatePath(lang === 'en' ? '/terms/' : `/${lang}/terms/`);
                              }}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700/70 hover:border-slate-500/40 transition-all duration-150 group"
                            >
                              <div className="w-7 h-7 rounded-lg bg-slate-500/10 text-slate-500 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-[15px] font-bold text-slate-800 dark:text-white group-hover:text-cyan-500 transition-colors">
                                  {lang === 'id' ? 'Syarat & Transparansi' : 'Terms & Legal'}
                                </div>
                                <div className="text-[13px] text-slate-500 dark:text-slate-400">
                                  {lang === 'id' ? 'Ketentuan layanan & data' : 'Service terms & transparency'}
                                </div>
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Footer Bar: Appearance Toggle + Sliding Language Selector Trigger */}
                      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 dark:border-dark-700/80 bg-slate-50 dark:bg-dark-900/70">
                        {/* Theme Mode Toggle Button */}
                        <button
                          onClick={toggleTheme}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-750 border border-slate-200 dark:border-dark-700 text-slate-800 dark:text-slate-200 text-[14px] font-bold cursor-pointer transition-all duration-150 shadow-xs"
                          title={lang === 'id' ? 'Ganti mode terang/gelap' : 'Toggle appearance'}
                        >
                          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                          <span>
                            {lang === 'id'
                              ? (theme === 'dark' ? 'Mode Terang' : 'Mode Gelap')
                              : (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
                          </span>
                        </button>

                        {/* Klaim Promo Founder Pass (Directs to /pricing/) */}
                        <a
                          href={lang === 'en' ? '/pricing/' : `/${lang}/pricing/`}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsSuiteOpen(false);
                            navigatePath(lang === 'en' ? '/pricing/' : `/${lang}/pricing/`);
                          }}
                          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/15 hover:from-amber-500/20 hover:to-orange-500/25 border border-amber-500/35 hover:border-amber-500/60 text-amber-700 dark:text-amber-400 text-[14px] font-bold cursor-pointer transition-all duration-150 shadow-xs group"
                          title={lang === 'id' ? 'Klaim Penawaran Founder Pass' : 'Claim Founder Pass Deal'}
                        >
                          <Crown className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                          <span>{lang === 'id' ? 'Klaim Promo Founder' : 'Claim Founder Pass'}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
                        </a>
                      </div>
                    </div>
                  ) : (
                    /* ── Sliding Language Selector Sub-Panel ── */
                    <div className="animate-in fade-in-0 duration-150">
                      {/* Sub-Header with Back Button */}
                      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-dark-700/80 bg-slate-50 dark:bg-dark-900/70">
                        <button
                          onClick={() => setSuiteView('main')}
                          className="inline-flex items-center gap-1.5 text-cyan-600 dark:text-neon-cyan font-bold text-[14px] hover:underline cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>{lang === 'id' ? 'Kembali ke Menu Suite' : 'Back to Ecosystem'}</span>
                        </button>
                        <div className="text-[14px] font-extrabold text-slate-900 dark:text-white">
                          {lang === 'id' ? 'Pilih Bahasa (30 Bahasa)' : 'Select Language (30 Available)'}
                        </div>
                      </div>

                      {/* Language Search Input */}
                      <div className="p-3 border-b border-slate-200 dark:border-dark-700/80">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 rounded-lg px-3 py-1.5">
                          <Search className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="text"
                            value={suiteLangSearch}
                            onChange={(e) => setSuiteLangSearch(e.target.value)}
                            placeholder={lang === 'id' ? 'Cari bahasa (contoh: English, Español, Indonesia)...' : 'Search language (e.g. English, Español, Deutsch)...'}
                            className="border-none bg-transparent outline-none w-full text-[14px] text-slate-900 dark:text-white placeholder-slate-400"
                            autoFocus
                          />
                          {suiteLangSearch && (
                            <button onClick={() => setSuiteLangSearch('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 3-Column Grid of 30 Languages */}
                      <div className="grid grid-cols-3 gap-1.5 p-4 max-h-[290px] overflow-y-auto">
                        {SUPPORTED_LANGUAGES
                          .filter(l => l.name.toLowerCase().includes(suiteLangSearch.toLowerCase()) || l.code.toLowerCase().includes(suiteLangSearch.toLowerCase()))
                          .map(l => (
                            <a
                              key={l.code}
                              href={l.code === 'en' ? '/' : `/${l.code}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleLangChange(l.code);
                              }}
                              className={`flex items-center justify-between p-2 rounded-lg text-[14px] transition-colors ${lang === l.code
                                ? 'bg-cyan-500/15 text-cyan-700 dark:text-neon-cyan font-bold border border-cyan-500/30'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-dark-800'
                                }`}
                            >
                              <span className="flex items-center gap-2 truncate">
                                <span className="text-[15px]">{l.flag}</span>
                                <span className="truncate">{l.name}</span>
                              </span>
                              {lang === l.code && <Check className="w-3.5 h-3.5 text-neon-cyan shrink-0" />}
                            </a>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button (Touch Friendly) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-700 border border-slate-200 dark:border-dark-500/60 rounded-xl text-slate-700 dark:text-slate-200 transition-all duration-200 shadow-sm flex-shrink-0"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Drawer (Rendered in Portal) */}
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
              {/* Mobile User Profile Card */}
              {user && (
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-600/70 mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/30 shrink-0" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.displayName || 'User'}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isPro ? (
                      <span className="bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        PRO
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          navigatePath(lang === 'en' ? '/pricing/' : `/${lang}/pricing/`);
                          setMobileMenuOpen(false);
                          document.body.style.overflow = '';
                        }}
                        className="text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/30 cursor-pointer"
                      >
                        Upgrade
                      </button>
                    )}
                    <button
                      onClick={() => {
                        signOut();
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                      title="Keluar"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                </div>
              )}

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
                        const targetHref = lang === 'en' ? `/${slug}/` : `/${lang}/${slug}/`;
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
                            const targetHref = lang === 'en' ? `/${slug}/` : `/${lang}/${slug}/`;
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

              {/* Bottom Mobile Drawer Section: Theme Toggle, Language Switcher, and Founder Pass Promo */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-dark-700 flex flex-col gap-3">

                {/* 1. Theme Option (Dark / Light Mode) */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white dark:bg-dark-700 flex items-center justify-center border border-slate-200 dark:border-dark-600 shadow-xs">
                      {theme === 'dark' ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-500" />}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-bold text-slate-900 dark:text-white">
                        {theme === 'dark' ? (lang === 'id' ? 'Mode Gelap' : 'Dark Mode') : (lang === 'id' ? 'Mode Terang' : 'Light Mode')}
                      </div>
                      <div className="text-[11.5px] text-slate-500 dark:text-slate-400">
                        {lang === 'id' ? 'Ubah tema tampilan' : 'Switch appearance'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all border border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-indigo-300 dark:border-indigo-500/40 dark:bg-indigo-500/10 shadow-xs"
                  >
                    {theme === 'dark' ? <Sun size={13} className="text-amber-400" /> : <Moon size={13} className="text-indigo-400" />}
                    <span>{theme === 'dark' ? (lang === 'id' ? 'Terang' : 'Light') : (lang === 'id' ? 'Gelap' : 'Dark')}</span>
                  </button>
                </div>

                {/* 2. Language Change Option (30 Bahasa) */}
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700">
                  <button
                    type="button"
                    onClick={() => setMobileLangOpen(!mobileLangOpen)}
                    className="w-full flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-dark-700 flex items-center justify-center text-lg border border-slate-200 dark:border-dark-600 shadow-xs">
                        {currentLang.flag}
                      </div>
                      <div className="text-left">
                        <div className="text-[13.5px] font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{currentLang.name}</span>
                          <span className="text-[11px] font-mono text-cyan-600 dark:text-neon-cyan uppercase">({currentLang.code})</span>
                        </div>
                        <div className="text-[11.5px] text-slate-500 dark:text-slate-400">
                          {lang === 'id' ? '30 Bahasa tersedia' : '30 Languages available'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>{lang === 'id' ? 'Ganti' : 'Change'}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${mobileLangOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {mobileLangOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-200 dark:border-dark-700">
                      <div className="mb-2">
                        <input
                          type="text"
                          value={mobileLangSearch}
                          onChange={(e) => setMobileLangSearch(e.target.value)}
                          placeholder={lang === 'id' ? 'Cari bahasa...' : 'Search language...'}
                          className="w-full bg-white dark:bg-dark-900 text-xs text-slate-900 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-600 focus:outline-none focus:border-neon-cyan"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {SUPPORTED_LANGUAGES
                          .filter(l => l.name.toLowerCase().includes(mobileLangSearch.toLowerCase()) || l.code.toLowerCase().includes(mobileLangSearch.toLowerCase()))
                          .map(l => (
                            <a
                              key={l.code}
                              href={l.code === 'en' ? '/' : `/${l.code}`}
                              onClick={(e) => {
                                e.preventDefault();
                                handleLangChange(l.code);
                                setMobileMenuOpen(false);
                                document.body.style.overflow = '';
                              }}
                              className={`flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${lang === l.code
                                ? 'bg-cyan-500/15 text-cyan-700 dark:text-neon-cyan font-bold border border-cyan-500/30'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-dark-700'
                                }`}
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <span>{l.flag}</span>
                                <span className="truncate">{l.name}</span>
                              </span>
                              {lang === l.code && <Check className="w-3.5 h-3.5 text-neon-cyan shrink-0 ml-1" />}
                            </a>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Promo Offer Card directing to Pricing - High-Contrast Class-Guarded */}
                <a
                  href={lang === 'en' ? '/pricing/' : `/${lang}/pricing/`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigatePath(lang === 'en' ? '/pricing/' : `/${lang}/pricing/`);
                    setMobileMenuOpen(false);
                    document.body.style.overflow = '';
                  }}
                  className="mobile-promo-card relative group block overflow-hidden rounded-2xl p-4 transition-all shadow-md text-left cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-xs">
                      <Crown className="w-3 h-3 text-slate-950" /> {lang === 'id' ? 'PROMO FOUNDER PASS' : 'FOUNDER PASS DEAL'}
                    </span>
                    <span className="text-[12px] font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      {lang === 'id' ? 'Lihat Paket' : 'View Plans'} <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div className="mobile-promo-title text-[15px] font-heading font-extrabold leading-snug mb-1">
                    {lang === 'id' ? 'All-in-One 4 Web Suite Selamanya' : '4-in-1 Lifetime Suite Access'}
                  </div>
                  <p className="mobile-promo-desc text-[12.5px] leading-relaxed font-normal">
                    {lang === 'id'
                      ? 'Sekali bayar tanpa langganan. Dapatkan akses penuh ke HelpMyIMG, HandleMyFile, SolveMyMedia, & CreateMy-QR.'
                      : 'One-time payment, zero subscriptions. Get full lifetime access across all 4 ecosystem web apps.'}
                  </p>
                </a>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};
