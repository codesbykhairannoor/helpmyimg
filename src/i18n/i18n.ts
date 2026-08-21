import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { type Language, SUPPORTED_LANGUAGES } from './translations';

export function getLanguageFromUrl(): Language {
  const pathname = window.location.pathname.replace(/^\/+/, '');
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && SUPPORTED_LANGUAGES.some(l => l.code === segments[0])) {
    return segments[0] as Language;
  }
  return 'en';
}

export async function fetchTranslation(lang: Language): Promise<Record<string, any>> {
  try {
    const response = await fetch(`/locales/${lang}/translation.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch translation for lang "${lang}", falling back to English:`, error);
    if (lang === 'en') return {};
    try {
      const fallbackResponse = await fetch('/locales/en/translation.json');
      return await fallbackResponse.json();
    } catch (fallbackError) {
      console.error('Failed to fetch English fallback translation:', fallbackError);
      return {};
    }
  }
}

// Initial placeholder initialization so i18n functions don't crash before loading completes
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {},
    fallbackLng: 'en',
    keySeparator: false,
    react: { 
      useSuspense: false 
    }
  });

export async function initI18n(lang: Language) {
  const initialTranslation = await fetchTranslation(lang);
  i18n.addResourceBundle(lang, 'translation', initialTranslation, true, true);
  await i18n.changeLanguage(lang);
}

export default i18n;

