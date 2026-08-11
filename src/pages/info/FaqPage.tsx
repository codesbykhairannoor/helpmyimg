import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { HelpCircle, ChevronDown, MessageCircleQuestion, Zap, Shield, Image as ImageIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FaqPage: React.FC = () => {
  const { t, lang } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<'general' | 'privacy' | 'tech' | 'usage'>('general');

  // We organize 12 FAQs into categories
  const faqCategories = {
    general: [1, 2, 3],
    privacy: [4, 5, 6],
    tech: [7, 8, 9],
    usage: [10, 11, 12]
  };

  const categories = [
    { id: 'general', icon: MessageCircleQuestion, label: t('faq.cat.general', { defaultValue: 'General' }) },
    { id: 'privacy', icon: Shield, label: t('faq.cat.privacy', { defaultValue: 'Privacy & Security' }) },
    { id: 'tech', icon: Zap, label: t('faq.cat.tech', { defaultValue: 'Technology' }) },
    { id: 'usage', icon: ImageIcon, label: t('faq.cat.usage', { defaultValue: 'Usage & Limits' }) },
  ] as const;

  const currentFaqs = faqCategories[activeCategory];

  const rawTitle = t('faq.title', { defaultValue: 'Frequently Asked Questions' });
  const titleWords = rawTitle.split(' ');
  const splitIndex = Math.min(2, Math.max(1, Math.floor(titleWords.length * 0.4)));
  const gradientPart = titleWords.slice(0, splitIndex).join(' ');
  const solidPart = titleWords.slice(splitIndex).join(' ');

  return (
    <>
      <Helmet>
        <title>{`${t('nav.faq')} | HelpMyIMG`}</title>
        <meta name="description" content={t('faq.subtitle')} />
        <meta name="keywords" content="HelpMyIMG FAQ, help center, offline AI questions, image background remover help" />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/faq`} />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16">
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon-cyan/20 blur-[100px] rounded-full pointer-events-none -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-mono font-bold mb-8">
            <HelpCircle className="w-4 h-4" />
            {t('faq.badge', { defaultValue: 'HELP CENTER & FAQ' })}
          </div>
          <h1 
            className="font-heading font-black mb-6"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15 }}
          >
            <span className="bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo bg-clip-text text-transparent drop-shadow-sm">
              {gradientPart}
            </span>{' '}
            <span className="text-slate-800 dark:text-white">
              {solidPart}
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
            {t('faq.subtitle')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm md:text-base font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo', { defaultValue: '100% Free, 0 Rupiah, No Subscriptions.' })}
          </div>
        </motion.div>

        {/* CATEGORY SELECTOR */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null); // Close all when switching category
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl transition-all duration-300 font-bold font-heading ${
                activeCategory === cat.id 
                  ? 'bg-neon-cyan text-dark-900 shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
                  : 'bg-dark-800/80 text-slate-400 border border-dark-600 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* FAQ ACCORDION */}
        <motion.div 
          key={activeCategory} // Force re-render animation on category change
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          {currentFaqs.map((num, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={num} 
                className={`border rounded-[24px] overflow-hidden transition-all duration-300 ${
                  isOpen 
                    ? 'bg-dark-800/90 border-neon-cyan/40 shadow-[0_10px_30px_-10px_rgba(34,211,238,0.15)]' 
                    : 'bg-dark-800/30 border-dark-600/50 hover:bg-dark-800/60 hover:border-dark-500'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-6 md:px-8 md:py-7 flex items-start md:items-center justify-between text-left gap-6"
                >
                  <span className={`text-lg md:text-xl font-bold font-heading transition-colors ${isOpen ? 'text-neon-cyan' : 'text-slate-200'}`}>
                    {t(`faq.q${num}`)}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${isOpen ? 'bg-neon-cyan text-dark-900 rotate-180 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'bg-dark-700/80 text-slate-400 border border-dark-600'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 md:px-8 md:pb-8"
                    >
                      <div className="border-t border-dark-600/50 pt-6">
                        <p className="text-slate-300 text-lg leading-relaxed">
                          {t(`faq.a${num}`)}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </motion.div>

        {/* SUPPORT CTA SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-24 text-center bg-gradient-to-tr from-dark-800 to-dark-900 rounded-[40px] p-10 md:p-16 border border-dark-600 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-neon-purple/10 blur-[80px] rounded-full pointer-events-none" />
          <Settings className="w-16 h-16 text-slate-500 mx-auto mb-8 opacity-50" />
          <h3 className="text-3xl font-black text-white mb-4 font-heading">{t('faq.more.title')}</h3>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">{t('faq.more.desc')}</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="mailto:support@helpmyimg.com" 
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-dark-900 font-bold hover:bg-slate-200 hover:scale-105 transition-all text-lg w-full sm:w-auto"
            >
              Contact Support
            </a>
            <a 
              href={`/${lang}/about`} 
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-dark-700 text-white font-bold border border-dark-600 hover:bg-dark-600 hover:border-dark-500 transition-all text-lg w-full sm:w-auto"
            >
              About HelpMyIMG
            </a>
          </div>
        </motion.div>
      </div>
    </>
  );
};
