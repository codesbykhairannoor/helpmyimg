import React, { createContext, useContext, useEffect, useState } from 'react';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/translations';
import { getToolFromSlug, getLocalizedSlug } from '../utils/urlMapper';

export interface RouteState {
  lang: Language;
  tool: string | null;
  keywordSlug: string | null;
  page: 'tool' | 'about' | 'privacy' | 'terms' | 'faq' | 'home';
}

interface RouterContextType {
  route: RouteState;
  navigate: (newLang: Language, newTool?: string | null, newPage?: RouteState['page']) => void;
  navigatePath: (path: string) => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

    // Hanya ubah state jika URL benar-benar berbeda
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
      setRoute(parseUrl());
      
      // Jika tool berubah atau halaman berubah, baru scroll ke atas instan
      const coreCurrent = getCorePath(window.location.pathname);
      const coreNew = getCorePath(newPath);
      if (coreCurrent !== coreNew) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    } else {
      setRoute(parseUrl());
    }
  };

  const navigatePath = (path: string) => {
    if (window.location.pathname !== path) {
      const coreCurrent = getCorePath(window.location.pathname);
      const coreNew = getCorePath(path);
      
      window.history.pushState({}, '', path);
      setRoute(parseUrl());
      
      if (coreCurrent !== coreNew) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
  };

  function getCorePath(path: string) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length > 0 && parts[0].length === 2) {
      return parts.slice(1).join('/');
    }
    return parts.join('/');
  }

  return (
    <RouterContext.Provider value={{ route, navigate, navigatePath }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = (): RouterContextType => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
