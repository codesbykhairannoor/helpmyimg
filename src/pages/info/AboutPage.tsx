import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { Sparkles, Shield, Cpu, Zap, Globe, Heart, Activity, Code, Server, ZapOff, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutPage: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('footer.about')} | HelpMyIMG</title>
        <meta name="description" content={t('about.subtitle')} />
        <meta name="keywords" content="HelpMyIMG, AI offline, privacy first image editor, webassembly ai, client side machine learning, free image background remover" />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/about`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-cyan/20 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-sm font-mono font-bold mb-8">
            <Sparkles className="w-4 h-4" />
            {t('about.badge') || 'ABOUT US: THE HELPMYIMG STORY'}
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tight leading-tight">
            {t('about.title')}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-6">
            {t('about.subtitle')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm md:text-base font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo') || '100% Free, 0 Rupiah, No Subscriptions.'}
          </div>
        </motion.div>

        {/* MISSION & VISION */}
        <div className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center mb-32">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-neon-indigo to-neon-purple p-0.5 shadow-glow-indigo">
              <div className="w-full h-full bg-dark-900 rounded-[22px] flex items-center justify-center">
                <Shield className="w-8 h-8 text-neon-indigo" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white">
              {t('about.sec1.title')}
            </h2>
            <div className="space-y-6 text-slate-400 leading-relaxed text-lg">
              <p>{t('about.sec1.desc1')}</p>
              <p>{t('about.sec1.desc2')}</p>
              <p>{t('about.sec1.desc3')}</p>
            </div>
            <ul className="space-y-4 pt-4">
              {[1, 2, 3].map((item) => (
                <li key={item} className="flex items-start gap-4">
                  <div className="mt-1 bg-neon-emerald/20 p-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
                  </div>
                  <span className="text-slate-300">{t(`about.sec1.bullet${item}`)}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-neon-indigo/20 to-neon-purple/20  rounded-full" />
            <div className="relative aspect-square rounded-[40px] overflow-hidden border border-dark-600 bg-dark-800 p-10 flex items-center justify-center shadow-2xl">
              <div className="grid grid-cols-2 gap-6 w-full h-full">
                <div className="bg-dark-700/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 border border-dark-600 hover:border-neon-cyan/50 transition-colors">
                  <Cpu className="w-10 h-10 text-neon-cyan" />
                  <span className="text-sm font-bold text-slate-200">{t('about.feature.local')}</span>
                  <span className="text-xs text-slate-500">{t('about.feature.local.desc')}</span>
                </div>
                <div className="bg-dark-700/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 border border-dark-600 mt-12 hover:border-neon-emerald/50 transition-colors">
                  <Shield className="w-10 h-10 text-neon-emerald" />
                  <span className="text-sm font-bold text-slate-200">{t('about.feature.privacy')}</span>
                  <span className="text-xs text-slate-500">{t('about.feature.privacy.desc')}</span>
                </div>
                <div className="bg-dark-700/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 border border-dark-600 -mt-12 hover:border-neon-indigo/50 transition-colors">
                  <Zap className="w-10 h-10 text-neon-indigo" />
                  <span className="text-sm font-bold text-slate-200">{t('about.feature.fast')}</span>
                  <span className="text-xs text-slate-500">{t('about.feature.fast.desc')}</span>
                </div>
                <div className="bg-dark-700/50 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 border border-dark-600 hover:border-neon-purple/50 transition-colors">
                  <Globe className="w-10 h-10 text-neon-purple" />
                  <span className="text-sm font-bold text-slate-200">{t('about.feature.free')}</span>
                  <span className="text-xs text-slate-500">{t('about.feature.free.desc')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* TECHNOLOGY SECTION */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
              {t('about.tech.title')}
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              {t('about.tech.subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Code, color: 'text-neon-cyan', bg: 'bg-neon-cyan/10', title: 'about.tech.b1.title', desc: 'about.tech.b1.desc' },
              { icon: Activity, color: 'text-neon-emerald', bg: 'bg-neon-emerald/10', title: 'about.tech.b2.title', desc: 'about.tech.b2.desc' },
              { icon: Server, color: 'text-neon-purple', bg: 'bg-neon-purple/10', title: 'about.tech.b3.title', desc: 'about.tech.b3.desc' }
            ].map((block, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-dark-800/80 border border-dark-600 rounded-3xl p-8 hover:bg-dark-700 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${block.bg} flex items-center justify-center mb-6`}>
                  <block.icon className={`w-7 h-7 ${block.color}`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{t(block.title)}</h3>
                <p className="text-slate-400 leading-relaxed">{t(block.desc)}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ENVIRONMENTAL IMPACT SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-dark-800 border border-neon-emerald/30 rounded-[40px] p-10 md:p-16 mb-32 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-emerald/10 blur-[150px] rounded-full pointer-events-none" />
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neon-emerald/20 text-neon-emerald text-sm font-mono font-bold mb-6">
                <ZapOff className="w-4 h-4" />
                {t('about.green.badge')}
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
                {t('about.green.title')}
              </h2>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                {t('about.green.desc1')}
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                {t('about.green.desc2')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-dark-900/80 border border-dark-600 p-6 rounded-3xl text-center">
                <div className="text-4xl font-black text-neon-emerald mb-2">0%</div>
                <div className="text-sm text-slate-400 font-bold">{t('about.green.stat1')}</div>
              </div>
              <div className="bg-dark-900/80 border border-dark-600 p-6 rounded-3xl text-center">
                <div className="text-4xl font-black text-neon-cyan mb-2">100%</div>
                <div className="text-sm text-slate-400 font-bold">{t('about.green.stat2')}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TEAM & MISSION STATEMENT */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-600 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-5 mix-blend-overlay" />
          <Heart className="w-16 h-16 text-neon-pink mx-auto mb-8 relative z-10" />
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-8 relative z-10">
            {t('about.mission.title')}
          </h2>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-12 relative z-10 font-light">
            "{t('about.mission.quote')}"
          </p>
          <div className="text-sm font-mono text-slate-500 uppercase tracking-widest relative z-10 flex items-center justify-center gap-3">
            <span className="w-12 h-[1px] bg-dark-600" />
            {t('about.madeWithLove')}
            <span className="w-12 h-[1px] bg-dark-600" />
          </div>
        </motion.div>
      </div>
    </>
  );
};
