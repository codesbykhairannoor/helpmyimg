import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { staticCatalog } from './staticCatalog';

// Convert the generated static catalog into i18next resources format
const resources: Record<string, any> = {};
Object.keys(staticCatalog).forEach(lang => {
  resources[lang] = {
    translation: staticCatalog[lang]
  };
});

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    keySeparator: false,
    react: { 
      // Suspense is no longer a bottleneck since translations are synchronous
      useSuspense: false 
    }
  });

export default i18n;
