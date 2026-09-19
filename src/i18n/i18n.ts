import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { type Language, SUPPORTED_LANGUAGES } from './translations';
import enTranslations from '../../public/locales/en/translation.json';

export function getLanguageFromUrl(): Language {
  const pathname = window.location.pathname.replace(/^\/+/, '');
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LANGUAGES.some(l => l.code === segments[0])) {
    return segments[0] as Language;
  }
  return 'en';
}

export async function fetchTranslation(lang: Language): Promise<Record<string, any>> {
  if (lang === 'en') {
    return enTranslations;
  }
  try {
    const response = await fetch(`/locales/${lang}/translation.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch translation for lang "${lang}", falling back to English:`, error);
    return enTranslations;
  }
}

// Initial placeholder initialization with full English base so i18n never displays raw keys
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    keySeparator: false,
    react: { 
      useSuspense: false 
    }
  });

export async function initI18n(lang: Language) {
  if (lang === 'en') {
    await i18n.changeLanguage('en');
    return;
  }
  try {
    const initialTranslation = await fetchTranslation(lang);
    i18n.addResourceBundle(lang, 'translation', initialTranslation, true, true);
    await i18n.changeLanguage(lang);
  } catch (err) {
    console.warn(`Could not load translations for "${lang}", staying on fallback:`, err);
    await i18n.changeLanguage('en');
  }
}

export default i18n;


