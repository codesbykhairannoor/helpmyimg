import React, { createContext, useContext, useEffect, useState } from 'react';
import { SUPPORTED_LANGUAGES, type Language } from '../i18n/translations';
import { getToolFromSlug, getLocalizedSlug } from '../utils/urlMapper';
import { getInfoPageFromSlug, getLocalizedInfoSlug, type InfoPageType } from '../utils/infoUrlMapper';

export interface RouteState {
  lang: Language;
  tool: string | null;
  keywordSlug: string | null;
  page: 'tool' | 'about' | 'privacy' | 'terms' | 'faq' | 'home' | 'security' | 'pricing' | 'compare' | 'languages';
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
      const infoPage = getInfoPageFromSlug(toolSlug);
      if (infoPage) {
        page = infoPage as any;
      } else {
        page = 'tool';
        tool = getToolFromSlug(toolSlug, detectedLang);
      }
    }

    return { lang: detectedLang, tool, keywordSlug: keywordSlug || null, page };
  };

  const [route, setRoute] = useState<RouteState>(parseUrl());

  useEffect(() => {
    // If user lands on a legacy 3-segment pSEO URL, immediately normalize the URL in the address bar
    if (route.keywordSlug && route.tool) {
      const cleanSlug = getLocalizedSlug(route.tool as any, route.lang);
      const cleanPath = `/${route.lang}/${cleanSlug}/`;
      if (window.location.pathname !== cleanPath) {
        window.history.replaceState(null, '', cleanPath);
      }
    }

    const handlePopState = () => {
      setRoute(parseUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [route.keywordSlug, route.tool, route.lang]);

  const navigate = (newLang: Language, newTool: string | null = null, newPage: RouteState['page'] = 'tool') => {
    let newPath = newLang === 'en' ? '/' : `/${newLang}`;
    
    if (newPage !== 'home' && newPage !== 'tool') {
      const localizedInfoSlug = getLocalizedInfoSlug(newPage as InfoPageType, newLang);
      newPath = newLang === 'en' ? `/${localizedInfoSlug}` : `/${newLang}/${localizedInfoSlug}`;
    } else if (newTool) {
      const localizedToolSlug = getLocalizedSlug(newTool as any, newLang);
      newPath = newLang === 'en' ? `/${localizedToolSlug}` : `/${newLang}/${localizedToolSlug}`;
    }

    // Hanya ubah state jika URL benar-benar berbeda
    if (window.location.pathname !== newPath) {
      const oldRoute = route;
      window.history.pushState({}, '', newPath);
      const newRoute = parseUrl();
      setRoute(newRoute);
      
      // Jika tool berubah atau halaman berubah, baru scroll ke atas instan
      if (oldRoute.page !== newRoute.page || oldRoute.tool !== newRoute.tool) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    } else {
      setRoute(parseUrl());
    }
  };

  const navigatePath = (path: string) => {
    if (window.location.pathname !== path) {
      const oldRoute = route;
      window.history.pushState({}, '', path);
      const newRoute = parseUrl();
      setRoute(newRoute);
      
      if (oldRoute.page !== newRoute.page || oldRoute.tool !== newRoute.tool) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
  };

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
