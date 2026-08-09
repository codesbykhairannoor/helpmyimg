import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/translations';
import { getToolFromSlug, getLocalizedSlug } from '../utils/urlMapper';

export interface RouteState {
  lang: Language;
  tool: string | null;
  keywordSlug: string | null;
  page: 'tool' | 'about' | 'privacy' | 'terms' | 'faq' | 'home';
}

export function useRouter() {
  const parseUrl = (): RouteState => {
    const pathname = window.location.pathname.replace(/^\/+/, '');
    const segments = pathname.split('/').filter(Boolean);

    let detectedLang: Language = 'en';
    let toolSlug = '';
    let keywordSlug = '';

    if (segments.length > 0 && SUPPORTED_LANGUAGES.some(l => l.code === segments[0])) {
      detectedLang = segments[0] as Language;
      toolSlug = segments[1] || '';
      keywordSlug = segments[2] || '';
    } else if (segments.length > 0) {
      toolSlug = segments[0];
      keywordSlug = segments[1] || '';
    }

    let page: RouteState['page'] = 'home';
    let tool: string | null = null;

    if (toolSlug) {
      if (['about', 'privacy', 'terms', 'faq'].includes(toolSlug)) {
        page = toolSlug as any;
      } else {
        page = 'tool';
        tool = getToolFromSlug(toolSlug, detectedLang);
      }
    }

    return { lang: detectedLang, tool, keywordSlug: keywordSlug || null, page };
  };

  const [route, setRoute] = useState<RouteState>(parseUrl());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parseUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (newLang: Language, newTool: string | null = null, newPage: RouteState['page'] = 'tool') => {
    let newPath = newLang === 'en' ? '/' : `/${newLang}`;
    
    if (newPage !== 'home' && newPage !== 'tool') {
      newPath = newLang === 'en' ? `/${newPage}` : `/${newLang}/${newPage}`;
    } else if (newTool) {
      const localizedToolSlug = getLocalizedSlug(newTool, newLang);
      newPath = newLang === 'en' ? `/${localizedToolSlug}` : `/${newLang}/${localizedToolSlug}`;
    }

    window.history.pushState({}, '', newPath);
    setRoute(parseUrl());
  };

  return { route, navigate };
}
