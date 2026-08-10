import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { Sparkles, Check, Infinity, Zap, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PricingPage: React.FC = () => {
  const { t, lang } = useTranslation();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>{`${t('footer.pricing')} | HelpMyIMG`}</title>
        <meta name="description" content={t('pricing.subtitle') || 'Stop paying for cloud AI. HelpMyIMG is 100% free.'} />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/pricing`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* SECTION 1: HERO */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-24 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-neon-cyan/20 blur-[150px] rounded-full pointer-events-none -z-10" />
          <h1 className="text-5xl md:text-8xl font-heading font-black text-white mb-8 tracking-tight leading-none uppercase">
            {t('pricing.title') || 'Stop Paying for Cloud AI.'}
          </h1>
          <p className="text-2xl md:text-3xl text-neon-cyan font-bold max-w-4xl mx-auto leading-relaxed mb-6">
            {t('pricing.subtitle') || 'Enterprise-grade image processing, absolutely free.'}
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-base md:text-lg font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo') || '100% Free, 0 Rupiah, No Subscriptions.'}
          </div>
        </motion.div>

        {/* SECTION 2: THE FOREVER FREE TIER */}
        <div className="mb-32 flex justify-center">
          <div className="bg-dark-800 border-2 border-neon-cyan/40 rounded-[40px] p-8 md:p-16 max-w-3xl w-full shadow-[0_0_80px_rgba(5,218,237,0.15)] relative overflow-hidden group hover:border-neon-cyan/60 transition-colors">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-neon-cyan/20 blur-[80px] rounded-full group-hover:bg-neon-cyan/30 transition-colors" />
            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-sm font-bold tracking-widest uppercase mb-6">
                <Sparkles className="w-4 h-4" />
                {t('pricing.tierName') || 'Unlimited Edge Plan'}
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-4">
                <span className="text-3xl text-slate-400 font-bold">IDR/USD</span>
                <span className="text-7xl md:text-9xl font-black text-white tracking-tighter">0</span>
              </div>
              <p className="text-xl text-slate-400">{t('pricing.period') || 'Forever. No credit card required.'}</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 relative z-10">
              {[
                'Unlimited AI Background Removal',
                'Unlimited Batch Processing',
                'Unlimited Image Compressions',
                'Zero Server Uploads (100% Private)',
                'Full High-Definition Exports',
                'No Watermarks on Results'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center shrink-0">
                    <Check className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <span className="text-slate-200 font-medium">{t(`pricing.f${i+1}`) || feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: COST SAVINGS CALCULATOR */}
        <div className="mb-32">
          <div className="bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-600 rounded-3xl p-8 md:p-16 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-8">
              {t('pricing.s3.title') || 'How much will you save?'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { name: 'Generic Cloud APIs', cost: '$0.20 / image', ours: '$0.00' },
                { name: 'Subscription Apps', cost: '$15 / month', ours: '$0.00' },
                { name: 'Enterprise Software', cost: '$300+ / year', ours: '$0.00' }
              ].map((item, i) => (
                <div key={i} className="bg-dark-900 p-6 rounded-2xl border border-dark-700">
                  <div className="text-slate-400 mb-2">{t(`pricing.s3.c${i+1}.name`) || item.name}</div>
                  <div className="text-red-400 font-bold line-through text-xl mb-4">{item.cost}</div>
                  <div className="text-neon-emerald font-black text-3xl">{t('pricing.s3.ours') || item.ours}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 4: WHY IS IT FREE? */}
        <div className="mb-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
              {t('pricing.s4.title') || 'Why is it 100% Free?'}
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed mb-6">
              {t('pricing.s4.desc1') || 'Cloud companies charge you money because running AI on cloud GPUs is incredibly expensive. Every time you upload an image, it costs them server power.'}
            </p>
            <p className="text-xl text-neon-cyan leading-relaxed font-medium">
              {t('pricing.s4.desc2') || 'HelpMyIMG uses WebAssembly to run the AI directly inside your browser. Because we don\'t use cloud servers to process your images, our server costs are practically zero. So we pass those savings directly to you.'}
            </p>
          </div>
          <div className="bg-dark-800 border border-neon-indigo/30 rounded-3xl p-12 text-center shadow-[0_0_50px_rgba(79,70,229,0.1)]">
            <Infinity className="w-24 h-24 text-neon-indigo mx-auto mb-8" />
            <h3 className="text-2xl font-bold text-white mb-4">{t('pricing.s4.boxTitle') || 'Infinite Scalability'}</h3>
            <p className="text-slate-400">{t('pricing.s4.boxDesc') || 'Since your device does the computing, our platform can handle millions of users simultaneously without slowing down or increasing our costs.'}</p>
          </div>
        </div>

        {/* SECTION 5: NO CREDIT CARD */}
        <div className="mb-32 bg-neon-emerald/5 border border-neon-emerald/20 rounded-[40px] p-8 md:p-16 text-center">
          <Zap className="w-16 h-16 text-neon-emerald mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-heading font-black text-white mb-6">
            {t('pricing.s5.title') || 'No Accounts. No Credit Cards. No Bullshit.'}
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {t('pricing.s5.desc') || 'Just open the website and start processing. We respect your time and your privacy.'}
          </p>
        </div>

        {/* SECTION 6: FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30 mb-4 inline-block">
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-black text-white">
              {t('pricing.faq.title') || 'Pricing FAQ'}
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
                    {t(`pricing.faq${idx}.q`) || `Pricing Question ${idx}?`}
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
                        {t(`pricing.faq${idx}.a`) || `Detailed answer explaining why there are no hidden fees, no subscriptions, and how the edge-computing model allows us to offer this entirely for free.`}
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
