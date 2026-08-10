import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { Globe2, Languages, MessageCircle, Settings, ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';

export const LanguagesPage: React.FC = () => {
  const { t, lang, setLang } = useTranslation();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>{`${t('footer.languages')} | HelpMyIMG`}</title>
        <meta name="description" content={t('languages.subtitle') || 'HelpMyIMG is natively translated into 30 global languages.'} />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/languages`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* SECTION 1: HERO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-indigo/20 blur-[150px] rounded-full pointer-events-none -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-indigo/10 border border-neon-indigo/20 text-neon-indigo text-sm font-mono font-bold mb-8">
            <Globe2 className="w-4 h-4" />
            {t('languages.badge') || 'GLOBAL ACCESSIBILITY'}
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tight leading-tight">
            {t('languages.title') || 'Designed for the World.'}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('languages.subtitle') || 'We believe powerful AI should be accessible to everyone, everywhere. That is why HelpMyIMG is natively localized into 30 different languages.'}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm md:text-base font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo') || '100% Free, 0 Rupiah, No Subscriptions.'}
          </div>
        </motion.div>

        {/* SECTION 2: WORLD GRID */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('languages.s2.title') || 'Select Your Native Language'}
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              {t('languages.s2.desc') || 'Click on any language below to instantly switch the entire application interface.'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as any)}
                className={`p-4 rounded-2xl border text-center transition-all ${
                  lang === l.code 
                    ? 'bg-neon-indigo/20 border-neon-indigo text-white shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                    : 'bg-dark-800 border-dark-600 hover:border-neon-indigo/50 hover:bg-dark-700 text-slate-400 hover:text-white'
                }`}
              >
                <div className="text-2xl mb-2">{l.flag}</div>
                <div className="font-bold text-sm truncate">{l.name}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-70 mt-1">{l.code}</div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 3: NATIVE TRANSLATIONS */}
        <div className="mb-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex p-3 rounded-2xl bg-neon-indigo/10 mb-6">
              <Languages className="w-8 h-8 text-neon-indigo" />
            </div>
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
              {t('languages.s3.title') || 'More Than Just Auto-Translate.'}
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-6">
              {t('languages.s3.desc') || 'We don\'t just plug our text into Google Translate and call it a day. Our localization engine adapts URLs, SEO meta tags, and cultural nuances so the platform feels truly native.'}
            </p>
            <ul className="space-y-4">
              {[
                'Localized URLs for better SEO',
                'Right-to-Left (RTL) support (coming soon)',
                'Culturally adapted idioms and examples'
              ].map((item, i) => (
                <li key={i} className="flex gap-3 text-slate-300">
                  <CheckCircle2 className="w-6 h-6 text-neon-indigo shrink-0" />
                  <span>{t(`languages.s3.l${i+1}`) || item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-tr from-dark-800 to-dark-900 border border-dark-600 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-indigo/10 blur-[80px] rounded-full" />
            <div className="space-y-4 relative z-10">
              <div className="bg-dark-950 p-4 rounded-xl border border-dark-700 font-mono text-sm text-green-400">
                "remove-background"
              </div>
              <div className="flex justify-center">
                <div className="w-1 h-6 border-r-2 border-dashed border-slate-700" />
              </div>
              <div className="bg-dark-950 p-4 rounded-xl border border-neon-indigo/50 font-mono text-sm text-neon-indigo shadow-[0_0_15px_rgba(79,70,229,0.2)]">
                "quitar-fondo" (Spanish)
              </div>
              <div className="flex justify-center">
                <div className="w-1 h-6 border-r-2 border-dashed border-slate-700" />
              </div>
              <div className="bg-dark-950 p-4 rounded-xl border border-neon-emerald/50 font-mono text-sm text-neon-emerald shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                "hapus-latar-belakang" (Indonesian)
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: INSTANT SWITCH */}
        <div className="mb-32 bg-dark-800/50 rounded-[40px] p-8 md:p-16 border border-dark-600 text-center">
          <Settings className="w-16 h-16 text-slate-400 mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
            {t('languages.s4.title') || 'Zero Page Reloads.'}
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
            {t('languages.s4.desc') || 'Built on React context, our i18n engine swaps all 1,500+ translation strings instantly without refreshing the page or interrupting your work.'}
          </p>
        </div>

        {/* SECTION 5: REQUEST A LANGUAGE */}
        <div className="mb-32 bg-gradient-to-r from-neon-indigo/10 to-transparent border border-neon-indigo/20 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('languages.s5.title') || 'Missing Your Language?'}
            </h2>
            <p className="text-slate-400">
              {t('languages.s5.desc') || 'We are constantly expanding. Let us know if you need HelpMyIMG in your native tongue.'}
            </p>
          </div>
          <button className="shrink-0 px-8 py-4 bg-neon-indigo hover:bg-neon-indigo/80 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            {t('languages.s5.btn') || 'Request Translation'}
          </button>
        </div>

        {/* SECTION 6: FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30 mb-4 inline-block">
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-black text-white">
              {t('languages.faq.title') || 'Localization FAQ'}
            </h2>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="bg-dark-800 border border-dark-600 rounded-2xl overflow-hidden transition-all duration-300 hover:border-neon-cyan/30">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-bold text-white pr-4">
                    {t(`languages.faq${idx}.q`) || `Language Question ${idx}?`}
                  </span>
                  <div className={`shrink-0 w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center transition-transform duration-300 ${openFaq === idx ? 'rotate-180 bg-neon-cyan/20 text-neon-cyan' : 'text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-slate-400 leading-relaxed font-body">
                        {t(`languages.faq${idx}.a`) || `Detailed answer explaining how our localization framework works and how users can contribute or request changes.`}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};
