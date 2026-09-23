// src/App.tsx
// Perakitan Komponen Utama HelpMyIMG Super AI Platform V2 (Zero-Latency State Routing)

import { HelmetProvider } from 'react-helmet-async';
import './i18n/i18n';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { JsonLd } from './components/seo/JsonLd';

import { ToolLandingPage } from './pages/ToolLandingPage';
import { AboutPage } from './pages/info/AboutPage';
import { PrivacyPage } from './pages/info/PrivacyPage';
import { TermsPage } from './pages/info/TermsPage';
import { FaqPage } from './pages/info/FaqPage';
import { SecurityPage } from './pages/info/SecurityPage';
import { PricingPage } from './pages/info/PricingPage';
import { ComparePage } from './pages/info/ComparePage';
import { LanguagesPage } from './pages/info/LanguagesPage';

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
      <div className="relative">
        <div className="fixed top-1/2 left-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.12)_0%,transparent_60%)] rounded-full pointer-events-none -z-10" />
        <div className="fixed top-1/3 right-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_60%)] rounded-full pointer-events-none -z-10" />
        {content}
      </div>
    </main>
  );
};

const AppLayout = () => {
  const { hasActiveFiles } = useRouter();

  return (
    <div className="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 font-body flex flex-col transition-colors duration-300 selection:bg-[#05DAED]/30 selection:text-[#05DAED]">
      <JsonLd />
      <Navbar />
      <MainContent />
      {!hasActiveFiles && <Footer />}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <RouterProvider>
            <AppLayout />
          </RouterProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
