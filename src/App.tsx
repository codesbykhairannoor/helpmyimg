// src/App.tsx
// Perakitan Komponen Utama HelpMyIMG Super AI Platform V2 (Zero-Latency State Routing)

import React, { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import './i18n/i18n';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { ProGateProvider } from './context/ProGateContext';
import { ProGateModal } from './components/auth/ProGateModal';

import { ToolLandingPage } from './pages/ToolLandingPage';

const AboutPage = lazy(() => import('./pages/info/AboutPage').then(m => ({ default: m.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/info/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/info/TermsPage').then(m => ({ default: m.TermsPage })));
const FaqPage = lazy(() => import('./pages/info/FaqPage').then(m => ({ default: m.FaqPage })));
const SecurityPage = lazy(() => import('./pages/info/SecurityPage').then(m => ({ default: m.SecurityPage })));
const PricingPage = lazy(() => import('./pages/info/PricingPage').then(m => ({ default: m.PricingPage })));
const ComparePage = lazy(() => import('./pages/info/ComparePage').then(m => ({ default: m.ComparePage })));
const LanguagesPage = lazy(() => import('./pages/info/LanguagesPage').then(m => ({ default: m.LanguagesPage })));

// Main Content Dispatcher
const MainContent = () => {
  const { route } = useRouter();

  let content = null;
  switch (route.page) {
    case 'about':
      content = <AboutPage />;
      break;
    case 'privacy':
      content = <PrivacyPage />;
      break;
    case 'terms':
      content = <TermsPage />;
      break;
    case 'faq':
      content = <FaqPage />;
      break;
    case 'security':
      content = <SecurityPage />;
      break;
    case 'pricing':
      content = <PricingPage />;
      break;
    case 'compare':
      content = <ComparePage />;
      break;
    case 'languages':
      content = <LanguagesPage />;
      break;
    case 'home':
    case 'tool':
    default:
      content = <ToolLandingPage />;
      break;
  }

  const { hasActiveFiles } = useRouter();

  return (
    <main className={`flex-1 w-full flex flex-col min-h-screen ${hasActiveFiles ? 'gap-0 pt-0 pb-4' : 'gap-8 md:gap-16 pt-12 pb-16'}`}>
      <div className="relative overflow-x-clip">
        <div className="fixed top-1/2 left-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.12)_0%,transparent_60%)] rounded-full pointer-events-none -z-10" />
        <div className="fixed top-1/3 right-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_60%)] rounded-full pointer-events-none -z-10" />
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
          {content}
        </Suspense>
      </div>
    </main>
  );
};

const AppLayout = () => {
  const { hasActiveFiles } = useRouter();

  return (
    <div className="min-h-screen overflow-x-clip bg-dark-900 text-slate-900 dark:text-slate-100 font-body flex flex-col selection:bg-[#05DAED]/30 selection:text-[#05DAED]">
      <Navbar />
      <MainContent />
      {!hasActiveFiles && <Footer />}
      <AuthModal />
      <ProGateModal />
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <ProGateProvider>
              <RouterProvider>
                <AppLayout />
              </RouterProvider>
            </ProGateProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
