import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const TermsPage: React.FC = () => {
  const { t, lang } = useTranslation();

  const rawTitle = t('terms.title', { defaultValue: 'Terms of Service' });
  const titleWords = rawTitle.split(' ');
  const splitIndex = Math.min(2, Math.max(1, Math.floor(titleWords.length * 0.4)));
  const gradientPart = titleWords.slice(0, splitIndex).join(' ');
  const solidPart = titleWords.slice(splitIndex).join(' ');

  return (
    <>
      <Helmet>
        <title>{`${t('footer.terms')} | HelpMyIMG`}</title>
        <meta name="description" content={t('terms.intro')} />
        <meta name="keywords" content="HelpMyIMG terms of service, usage policy, free AI editor terms, API limits" />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/terms`} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16">
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-sm font-mono font-bold mb-8">
            <FileText className="w-4 h-4" />
            {t('terms.badge', { defaultValue: 'TERMS OF SERVICE' })}
          </div>
          <h1 
            className="font-heading font-black mb-6"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15 }}
          >
            <span className="bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo bg-clip-text text-transparent drop-shadow-sm">
              {gradientPart}
            </span>{' '}
            <span className="text-slate-800 dark:text-white">
              {solidPart}
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-mono tracking-widest uppercase mb-12">
            {t('terms.lastUpdated', { defaultValue: 'Effective Date: July 11, 2026' })}
          </p>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed border-l-4 border-neon-purple/50 pl-6 py-4 bg-dark-800/30 rounded-r-2xl text-left mb-6">
            {t('terms.intro')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm md:text-base font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo', { defaultValue: '100% Free, 0 Rupiah, No Subscriptions.' })}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* QUICK LINKS SIDEBAR (Hidden on mobile) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:col-span-3 sticky top-32 bg-dark-800/50 border border-dark-600 rounded-3xl p-6"
          >
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6 font-mono text-neon-purple">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <li key={num}>
                  <a href={`#section-${num}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-neon-purple" />
                    <span className="group-hover:translate-x-1 transition-transform">{t(`terms.s${num}.title`)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* MAIN CONTENT */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-9 space-y-16 prose prose-invert prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-300"
          >
            <section id="section-1" className="scroll-mt-32">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 border border-dark-600 text-lg text-neon-purple font-mono">1</span>
                {t('terms.s1.title')}
              </h2>
              <div className="pl-14 space-y-4">
                <p>{t('terms.s1.desc1')}</p>
                <p>{t('terms.s1.desc2')}</p>
              </div>
            </section>

            <section id="section-2" className="scroll-mt-32">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 border border-dark-600 text-lg text-neon-purple font-mono">2</span>
                {t('terms.s2.title')}
              </h2>
              <div className="pl-14 space-y-4">
                <p>{t('terms.s2.desc1')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-300">
                  <li>{t('terms.s2.bullet1')}</li>
                  <li>{t('terms.s2.bullet2')}</li>
                  <li>{t('terms.s2.bullet3')}</li>
                </ul>
              </div>
            </section>

            <section id="section-3" className="scroll-mt-32">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 border border-dark-600 text-lg text-neon-purple font-mono">3</span>
                {t('terms.s3.title')}
              </h2>
              <div className="pl-14 space-y-4">
                <p>{t('terms.s3.desc1')}</p>
                <p>{t('terms.s3.desc2')}</p>
              </div>
            </section>

            <section id="section-4" className="scroll-mt-32">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 border border-dark-600 text-lg text-neon-purple font-mono">4</span>
                {t('terms.s4.title')}
              </h2>
              <div className="pl-14 space-y-4">
                <p>{t('terms.s4.desc1')}</p>
                <p className="border-l-2 border-neon-pink pl-4 text-slate-400 italic">
                  {t('terms.s4.desc2')}
                </p>
              </div>
            </section>

            <section id="section-5" className="scroll-mt-32">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 border border-dark-600 text-lg text-neon-purple font-mono">5</span>
                {t('terms.s5.title')}
              </h2>
              <div className="pl-14 space-y-4">
                <p>{t('terms.s5.desc1')}</p>
                <p>{t('terms.s5.desc2')}</p>
              </div>
            </section>

            <section id="section-6" className="scroll-mt-32">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 border border-dark-600 text-lg text-neon-purple font-mono">6</span>
                {t('terms.s6.title')}
              </h2>
              <div className="pl-14 space-y-4">
                <p>{t('terms.s6.desc1')}</p>
              </div>
            </section>
            
            <section id="section-7" className="pt-12 border-t border-dark-600/50 mt-12 scroll-mt-32">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-800 border border-dark-600 text-lg text-neon-purple font-mono">7</span>
                {t('terms.s7.title')}
              </h2>
              <div className="pl-14 space-y-6">
                <p className="text-slate-400 leading-relaxed">
                  {t('terms.s7.desc1')}
                </p>
                <div className="bg-dark-800/80 border border-dark-600 p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold font-heading mb-2">Legal & DMCA Inquiries</h4>
                    <p className="text-slate-400 text-sm">Please allow up to 48 hours for a response.</p>
                  </div>
                  <a href="mailto:legal@helpmyimg.com" className="px-8 py-4 rounded-xl bg-neon-purple/20 text-neon-purple font-bold hover:bg-neon-purple hover:text-white transition-all whitespace-nowrap">
                    legal@helpmyimg.com
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};
