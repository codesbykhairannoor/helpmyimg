import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { Shield, Lock, ServerOff, Database, CheckCircle2, ChevronDown, EyeOff, FileLock2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SecurityPage: React.FC = () => {
  const { t, lang } = useTranslation();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const rawTitle = t('security.title') || 'Your Data Never Leaves Your Device.';
  const titleWords = rawTitle.split(' ');
  const splitIndex = Math.min(2, Math.max(1, Math.floor(titleWords.length * 0.4)));
  const gradientPart = titleWords.slice(0, splitIndex).join(' ');
  const solidPart = titleWords.slice(splitIndex).join(' ');

  return (
    <>
      <Helmet>
        <title>{`${t('footer.security')} | HelpMyIMG`}</title>
        <meta name="description" content={t('security.subtitle') || 'Learn how our Zero-Cloud architecture protects your privacy.'} />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/security`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-16">
        {/* SECTION 1: HERO */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neon-emerald/20 blur-[120px] rounded-full pointer-events-none -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm font-mono font-bold mb-8">
            <Shield className="w-4 h-4" />
            {t('security.badge') || 'ZERO-TRUST SECURITY MODEL'}
          </div>
          <h1 
            className="font-heading font-black mb-8"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15 }}
          >
            <span className="bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo bg-clip-text text-transparent drop-shadow-sm">
              {gradientPart}
            </span>{' '}
            <span className="text-slate-800 dark:text-white">
              {solidPart}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('security.subtitle') || 'Experience 100% private AI image editing powered by local WebAssembly. We cannot see, store, or sell your photos because they never reach our servers.'}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm md:text-base font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo') || '100% Free, 0 Rupiah, No Subscriptions.'}
          </div>
        </motion.div>

        {/* SECTION 2: LOCAL PROCESSING VISUAL */}
        <div className="mb-32">
          <div className="bg-dark-800 border border-dark-600 rounded-[40px] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-neon-emerald/10 to-transparent pointer-events-none" />
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-6">
                  {t('security.s2.title') || 'Client-Side Processing Execution'}
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed mb-8">
                  {t('security.s2.desc') || 'Traditional image editors upload your sensitive files to their cloud servers, exposing them to breaches. HelpMyIMG downloads the AI neural network (Wasm) directly to your browser memory, processing everything locally.'}
                </p>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="mt-1 bg-neon-emerald/20 p-1 rounded-full shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-neon-emerald" />
                      </div>
                      <span className="text-slate-300">{t(`security.s2.bullet${i}`) || `Security feature bullet ${i}`}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Graphic */}
              <div className="relative aspect-square md:aspect-video lg:aspect-square bg-dark-900 rounded-3xl border border-dark-700 p-6 flex flex-col items-center justify-center">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-20 h-20 bg-dark-800 border border-neon-emerald/50 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                    <Database className="w-8 h-8 text-neon-emerald" />
                  </div>
                  <div className="w-16 h-1 border-t-2 border-dashed border-dark-500 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-dark-900 px-2 text-xs text-red-500 font-bold border border-red-500/30 rounded">BLOCKED</div>
                  </div>
                  <div className="w-20 h-20 bg-dark-800 border border-red-500/50 rounded-2xl flex items-center justify-center">
                    <ServerOff className="w-8 h-8 text-red-500" />
                  </div>
                </div>
                <div className="text-center font-mono text-sm text-slate-400">
                  {t('security.s2.graphic') || 'Cloud Uploads Disabled Internally'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: COMPLIANCE BADGES */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
              {t('security.s3.title') || 'Global Privacy Compliance'}
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'GDPR Article 5', desc: 'By not collecting data, we bypass complex consent requirements natively.' },
              { title: 'CCPA Compliant', desc: 'Zero data means zero data to sell. California users have automatic full protection.' },
              { title: 'HIPAA Friendly', desc: 'Since files remain on local RAM, medical images are never transmitted over networks.' }
            ].map((badge, idx) => (
              <div key={idx} className="bg-gradient-to-b from-dark-800 to-dark-900 border border-dark-600 rounded-3xl p-8 hover:border-neon-cyan/50 transition-colors group">
                <div className="w-16 h-16 bg-dark-900 border border-dark-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/30">
                  <FileLock2 className="w-8 h-8 text-neon-cyan" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{t(`security.s3.b${idx+1}.title`) || badge.title}</h3>
                <p className="text-slate-400 leading-relaxed">{t(`security.s3.b${idx+1}.desc`) || badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: DATA FLOW */}
        <div className="mb-32 bg-dark-800/50 rounded-[40px] p-8 md:p-16 border border-dark-600">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{t('security.s4.title', { defaultValue: 'Data Flow Comparison' })}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-dark-900 p-8 rounded-3xl border border-red-500/20">
              <h3 className="text-red-400 font-bold mb-6">{t('security.s4.old', { defaultValue: 'Traditional Cloud Editors' })}</h3>
              <ul className="space-y-4 text-slate-400 text-sm">
                <li className="flex gap-3"><EyeOff className="w-5 h-5 text-red-500 shrink-0" /> {t('security.s4.old.1', { defaultValue: 'You upload a photo to their server.' })}</li>
                <li className="flex gap-3"><EyeOff className="w-5 h-5 text-red-500 shrink-0" /> {t('security.s4.old.2', { defaultValue: 'AI processes it on their GPU.' })}</li>
                <li className="flex gap-3"><EyeOff className="w-5 h-5 text-red-500 shrink-0" /> {t('security.s4.old.3', { defaultValue: 'They store the original and result.' })}</li>
                <li className="flex gap-3"><EyeOff className="w-5 h-5 text-red-500 shrink-0" /> {t('security.s4.old.4', { defaultValue: 'Risk of intercept or data breach.' })}</li>
              </ul>
            </div>
            <div className="bg-dark-900 p-8 rounded-3xl border border-neon-emerald/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <h3 className="text-neon-emerald font-bold mb-6">{t('security.s4.new', { defaultValue: 'HelpMyIMG Local Engine' })}</h3>
              <ul className="space-y-4 text-slate-300 text-sm">
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-neon-emerald shrink-0" /> {t('security.s4.new.1', { defaultValue: 'You open the web page.' })}</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-neon-emerald shrink-0" /> {t('security.s4.new.2', { defaultValue: 'WebAssembly engine loads into RAM.' })}</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-neon-emerald shrink-0" /> {t('security.s4.new.3', { defaultValue: 'Photo is processed by your own CPU.' })}</li>
                <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-neon-emerald shrink-0" /> {t('security.s4.new.4', { defaultValue: '0 bytes transmitted. Absolute privacy.' })}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 5: ZERO TRUST */}
        <div className="mb-32 text-center">
          <Lock className="w-16 h-16 text-neon-indigo mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-8">
            {t('security.s5.title', { defaultValue: "Don't Trust Us. Trust the Code." })}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {t('security.s5.desc', { defaultValue: 'You can disconnect from the internet after loading the page, and the AI will still function perfectly. That is the ultimate mathematical proof of privacy.' })}
          </p>
        </div>

        {/* SECTION 6: FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30 mb-4 inline-block">
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-black text-white">
              {t('security.faq.title') || 'Security FAQ'}
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
                    {t(`security.faq${idx}.q`) || `Security Question ${idx}?`}
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
                        {t(`security.faq${idx}.a`) || `Detailed answer explaining exactly why the security protocols are ironclad and user data is protected at all times without server intervention.`}
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
