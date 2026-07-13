// src/context/LanguageContext.tsx
// Language Context wrapper using react-i18next

import React, { createContext, useContext, useEffect } from 'react';
import { useTranslation as useI18nextTranslation } from 'react-i18next';
import { type Language, SUPPORTED_LANGUAGES } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t: i18nT, i18n } = useI18nextTranslation();

  const lang = (i18n.resolvedLanguage || i18n.language || 'en') as Language;

  const setLang = (newLang: Language) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('helpmyimg_lang', newLang);
  };

  const t = (key: string, params?: Record<string, string>): string => {
    return i18nT(key, params) as string;
  };

  const currentLangInfo = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
  const dir = currentLangInfo?.dir || 'ltr';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation harus digunakan di dalam LanguageProvider');
  }
  return context;
};
