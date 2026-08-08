// src/App.tsx
// Perakitan Komponen Utama HelpMyIMG Super AI Platform V2 (Multi-Page Subdirectory SEO Router)

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { lazy, Suspense } from 'react';
import './i18n/i18n';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JsonLd } from './components/seo/JsonLd';
import ScrollToTop from './components/ScrollToTop';


// Lazy loaded routes for extreme performance
const ToolLandingPage = lazy(() => import('./pages/ToolLandingPage').then(m => ({ default: m.ToolLandingPage })));
const AboutPage = lazy(() => import('./pages/info/AboutPage').then(m => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/info/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/info/TermsPage').then(m => ({ default: m.TermsPage })));
const FaqPage = lazy(() => import('./pages/info/FaqPage').then(m => ({ default: m.FaqPage })));




function App() {
  return (
    <HelmetProvider>
      <Suspense fallback={<div className="min-h-screen bg-dark-900 flex items-center justify-center"><div className="w-16 h-16 border-4 border-[#05DAED]/20 border-t-[#05DAED] rounded-full animate-spin"></div></div>}>
        <ThemeProvider>
        <LanguageProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 font-body flex flex-col transition-colors duration-300 selection:bg-[#05DAED]/30 selection:text-[#05DAED]">
              <JsonLd />
              <Navbar />
              
              <main className="flex-1 w-full flex flex-col gap-8 md:gap-16 pt-8 sm:pt-10 md:pt-14 pb-16 min-h-screen">
                <div className="relative">
                  {/* Dekorasi Cahaya Latar Belakang - Optimized: Removed heavy blur-[120px] and used pre-rendered radial gradients to eliminate scroll GPU lag */}
                  <div className="fixed top-1/2 left-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.12)_0%,transparent_60%)] rounded-full pointer-events-none -z-10" />
                  <div className="fixed top-1/3 right-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_60%)] rounded-full pointer-events-none -z-10" />
                  
                  <Routes>
                    {/* Root Route -> English Default without Geo-Redirect */}
                    <Route path="/" element={<ToolLandingPage />} />
                    
                    {/* English SEO Info Pages */}
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/faq" element={<FaqPage />} />

                    {/* 1. Language Root Route (/id, /es, dll) or English Tool Route (/remove-background) */}
                    <Route path="/:lang" element={<ToolLandingPage />} />
                    
                    {/* Localized SEO Info Pages */}
                    <Route path="/:lang/about" element={<AboutPage />} />
                    <Route path="/:lang/privacy" element={<PrivacyPage />} />
                    <Route path="/:lang/terms" element={<TermsPage />} />
                    <Route path="/:lang/faq" element={<FaqPage />} />
                    
                    {/* 2. Tool Hub Route (/id/remove-background) or English pSEO (/remove-background/keyword) */}
                    <Route path="/:lang/:tool" element={<ToolLandingPage />} />
                    
                    {/* 3. pSEO Thousands Keyword Matrix Route (/id/change-background/merah-cpns-pas-foto) */}
                    <Route path="/:lang/:tool/:keywordSlug" element={<ToolLandingPage />} />

                    {/* Fallback untuk SEO */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </div>
              </main>

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
