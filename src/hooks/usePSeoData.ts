import { useState, useEffect } from 'react';

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

const pseoModules = import.meta.glob('../locales/pseo/**/*.json') as Record<string, () => Promise<any>>;

export const usePSeoData = (keywordSlug: string | undefined, lang: string) => {
  const [data, setData] = useState<PSeoJsonData | null>(null);

  useEffect(() => {
    if (!keywordSlug) {
      setData(null);
      return;
    }
    const exactPath = `../locales/pseo/${keywordSlug}/${lang}.json`;
    const fallbackPath = `../locales/pseo/${keywordSlug}/en.json`;
    const loader = pseoModules[exactPath] || pseoModules[fallbackPath];
    if (!loader) {
      setData(null);
      return;
    }
    let cancelled = false;
    loader()
      .then((mod) => {
        if (!cancelled) {
          setData((mod?.default ?? mod) as PSeoJsonData);
        }
      })
      .catch(() => {
        if (!cancelled) setData(null);
      });
    return () => {
      cancelled = true;
    };
  }, [keywordSlug, lang]);

  return { data };
};
