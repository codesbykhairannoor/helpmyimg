// src/hooks/usePSeoData.ts
// Hook untuk membaca file JSON statis hasil kompilasi 30 bahasa

export interface PSeoSectionData {
  type: string;
  title: string;
  content: string;
  badgeText: string;
}

export interface PSeoJsonData {
  title: string;
  h1: string;
  description: string;
  sections: PSeoSectionData[];
  faqs: { q: string; a: string }[];
  faqTitle: string;
  supportCenter: string;
  buttonText: string;
}

// Vite eager loading untuk zero-latency routing
const pseoModules = import.meta.glob('../locales/pseo/**/*.json', { eager: true }) as Record<string, any>;

export const usePSeoData = (keywordSlug: string | undefined, lang: string) => {
  if (!keywordSlug) return { data: null };

  const exactPath = `../locales/pseo/${keywordSlug}/${lang}.json`;
  const fallbackPath = `../locales/pseo/${keywordSlug}/en.json`;
  
  let module = pseoModules[exactPath];
  if (!module) {
    module = pseoModules[fallbackPath];
  }

  return { data: module ? (module.default ?? module) as PSeoJsonData : null };
};
