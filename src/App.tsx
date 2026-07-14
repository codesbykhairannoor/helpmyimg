// src/App.tsx
// Perakitan Komponen Utama HelpMyIMG Super AI Platform V2 (Multi-Page Subdirectory SEO Router)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense } from 'react';
import './i18n/i18n';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JsonLd } from './components/seo/JsonLd';
import { ToolLandingPage } from './pages/ToolLandingPage';
import { AboutPage } from './pages/info/AboutPage';
import { PrivacyPage } from './pages/info/PrivacyPage';
import { TermsPage } from './pages/info/TermsPage';
import { FaqPage } from './pages/info/FaqPage';
import ScrollToTop from './components/ScrollToTop';
import { shouldAutoRedirectToLang } from './services/geoDetector';
import { SUPPORTED_LANGUAGES } from './i18n/translations';

/**
 * RootRedirector: Mekanisme rahasia "Chameleon / Secret Hat"
 * Manusia -> Redirect otomatis ke subdirektori bahasa mereka (/id, /en, /es, /ko, /ru, dll.)
 * Bot Crawler (Googlebot/AI) -> BYPASS REDIRECT! Biarkan mengindeks 30 subdirektori tanpa cloaking trap.
 */
const RootRedirector: React.FC = () => {
  const supportedCodes = SUPPORTED_LANGUAGES.map((l) => l.code);
  const targetPath = shouldAutoRedirectToLang(window.location.pathname, supportedCodes);
  if (targetPath) {
    return <Navigate to={targetPath} replace />;
  }
  return <Navigate to="/en" replace />;
};

import { SeoFooterMatrix } from './components/seo/SeoFooterMatrix';


function App() {
  return (
    <HelmetProvider>
      <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="w-16 h-16 border-4 border-neon-cyan/20 border-t-neon-cyan rounded-full animate-spin"></div></div>}>
        <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-dark-900 text-slate-100 font-body flex flex-col transition-colors duration-300 selection:bg-neon-cyan/30 selection:text-neon-cyan">
              <JsonLd />
              <Navbar />
              
              <main className="flex-1 w-full flex flex-col gap-8 md:gap-16 pb-16 min-h-screen">
                <div className="relative">
                  {/* Dekorasi Cahaya Latar Belakang */}
                  <div className="absolute top-1/2 left-0 w-72 h-72 bg-neon-cyan/10 blur-[120px] rounded-full pointer-events-none -z-10" />
                  <div className="absolute top-1/3 right-0 w-96 h-96 bg-neon-indigo/10 blur-[120px] rounded-full pointer-events-none -z-10" />
                  
                  <Routes>
                    {/* Root Route -> Secret Hat Bot-Aware Redirector */}
                    <Route path="/" element={<RootRedirector />} />
                    
                    {/* 1. Language Root Route (/id, /en, /es, dll) */}
                    <Route path="/:lang" element={<ToolLandingPage />} />
                    
                    {/* SEO Info Pages */}
                    <Route path="/:lang/about" element={<AboutPage />} />
                    <Route path="/:lang/privacy" element={<PrivacyPage />} />
                    <Route path="/:lang/terms" element={<TermsPage />} />
                    <Route path="/:lang/faq" element={<FaqPage />} />
                    
                    {/* 2. Tool Hub Route (/id/remove-background, /en/change-background, dll) */}
                    <Route path="/:lang/:tool" element={<ToolLandingPage />} />
                    
                    {/* 3. pSEO Thousands Keyword Matrix Route (/id/change-background/merah-cpns-pas-foto) */}
                    <Route path="/:lang/:tool/:keywordSlug" element={<ToolLandingPage />} />

                    {/* Fallback untuk SEO */}
                    <Route path="*" element={<Navigate to="/id" replace />} />
                  </Routes>
                </div>
              </main>

              <SeoFooterMatrix />
              <Footer />
            </div>
          </BrowserRouter>
        </LanguageProvider>
        </ThemeProvider>
      </Suspense>
    </HelmetProvider>
  );
}

export default App;
