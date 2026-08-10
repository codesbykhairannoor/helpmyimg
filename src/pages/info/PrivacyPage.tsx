import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { ShieldCheck, Lock, EyeOff, ServerOff, Cookie, Activity, Database, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export const PrivacyPage: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t('footer.privacy')} | HelpMyIMG`}</title>
        <meta name="description" content={t('privacy.intro')} />
        <meta name="keywords" content="HelpMyIMG privacy policy, offline image editing privacy, GDPR compliant image editor, zero data collection AI" />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/privacy`} />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* HEADER SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm font-mono font-bold mb-8">
            <ShieldCheck className="w-4 h-4" />
            {t('privacy.badge') || 'PRIVACY POLICY'}
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 tracking-tight leading-tight">
            {t('privacy.title')}
          </h1>
          <p className="text-lg text-slate-500 font-mono tracking-widest uppercase mb-6">
            {t('privacy.lastUpdated') || 'Effective Date: July 11, 2026'}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm md:text-base font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo') || '100% Free, 0 Rupiah, No Subscriptions.'}
          </div>
        </motion.div>

        {/* TL;DR HIGHLIGHT BOX */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-dark-800 to-dark-900 border border-neon-emerald/40 rounded-3xl p-8 md:p-12 mb-16 shadow-[0_0_50px_-15px_rgba(16,185,129,0.2)] flex flex-col md:flex-row gap-8 items-center"
        >
          <div className="p-6 bg-neon-emerald/10 rounded-3xl shrink-0 border border-neon-emerald/20">
            <EyeOff className="w-16 h-16 text-neon-emerald" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-0 mb-4 font-heading">{t('privacy.highlight.title')}</h2>
            <p className="text-slate-300 text-lg leading-relaxed m-0">
              {t('privacy.highlight.desc')}
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <span className="inline-flex items-center gap-2 text-sm text-neon-emerald font-bold bg-neon-emerald/5 px-3 py-1.5 rounded-lg border border-neon-emerald/10">
                <CheckSquare className="w-4 h-4" /> {t('privacy.tag.noUploads')}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-neon-emerald font-bold bg-neon-emerald/5 px-3 py-1.5 rounded-lg border border-neon-emerald/10">
                <CheckSquare className="w-4 h-4" /> {t('privacy.tag.noTracking')}
              </span>
              <span className="inline-flex items-center gap-2 text-sm text-neon-emerald font-bold bg-neon-emerald/5 px-3 py-1.5 rounded-lg border border-neon-emerald/10">
                <CheckSquare className="w-4 h-4" /> {t('privacy.tag.offline')}
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="prose prose-invert prose-slate max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-300"
        >
          <p className="text-xl text-slate-200 mb-12 border-l-4 border-neon-emerald/50 pl-6 py-2 bg-dark-800/30 rounded-r-2xl">
            {t('privacy.intro')}
          </p>

          <div className="space-y-16">
            <section className="bg-dark-800/50 p-8 md:p-12 rounded-3xl border border-dark-600">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <div className="p-3 bg-dark-700 rounded-xl text-neon-cyan"><ServerOff className="w-6 h-6" /></div>
                {t('privacy.s1.title')}
              </h2>
              <div className="space-y-4">
                <p>{t('privacy.s1.desc1')}</p>
                <p>{t('privacy.s1.desc2')}</p>
              </div>
            </section>

            <section className="bg-dark-800/50 p-8 md:p-12 rounded-3xl border border-dark-600">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <div className="p-3 bg-dark-700 rounded-xl text-neon-indigo"><Database className="w-6 h-6" /></div>
                {t('privacy.s2.title')}
              </h2>
              <div className="space-y-4">
                <p>{t('privacy.s2.desc1')}</p>
                <p>{t('privacy.s2.desc2')}</p>
                <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-300">
                  <li>{t('privacy.s2.bullet1')}</li>
                  <li>{t('privacy.s2.bullet2')}</li>
                  <li>{t('privacy.s2.bullet3')}</li>
                </ul>
              </div>
            </section>

            <section className="bg-dark-800/50 p-8 md:p-12 rounded-3xl border border-dark-600">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <div className="p-3 bg-dark-700 rounded-xl text-neon-purple"><Cookie className="w-6 h-6" /></div>
                {t('privacy.s3.title')}
              </h2>
              <div className="space-y-4">
                <p>{t('privacy.s3.desc1')}</p>
                <p>{t('privacy.s3.desc2')}</p>
              </div>
            </section>

            <section className="bg-dark-800/50 p-8 md:p-12 rounded-3xl border border-dark-600">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <div className="p-3 bg-dark-700 rounded-xl text-neon-pink"><Lock className="w-6 h-6" /></div>
                {t('privacy.s4.title')}
              </h2>
              <div className="space-y-4">
                <p>{t('privacy.s4.desc1')}</p>
                <p>{t('privacy.s4.desc2')}</p>
              </div>
            </section>

            <section className="bg-dark-800/50 p-8 md:p-12 rounded-3xl border border-dark-600">
              <h2 className="text-3xl text-white mb-6 flex items-center gap-4">
                <div className="p-3 bg-dark-700 rounded-xl text-slate-300"><Activity className="w-6 h-6" /></div>
                {t('privacy.s5.title')}
              </h2>
              <div className="space-y-4">
                <p>{t('privacy.s5.desc1')}</p>
                <p>{t('privacy.s5.desc2')}</p>
              </div>
            </section>
            
            <section className="pt-12 text-center">
              <div className="inline-block bg-gradient-to-r from-dark-800 to-dark-900 border border-dark-600 rounded-[30px] p-12 w-full max-w-3xl">
                <h2 className="text-3xl font-black text-white mb-6 font-heading">
                  {t('privacy.s6.title')}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  {t('privacy.s6.desc')}
                </p>
                <a href="mailto:privacy@helpmyimg.com" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-neon-emerald text-dark-900 font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  privacy@helpmyimg.com
                </a>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </>
  );
};
