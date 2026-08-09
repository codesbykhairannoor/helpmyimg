import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from '../../context/LanguageContext';
import { Scale, Zap, ShieldCheck, Coins, Timer, WifiOff, ChevronDown, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ComparePage: React.FC = () => {
  const { t, lang } = useTranslation();
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <Helmet>
        <title>{t('compare.title') || 'Compare HelpMyIMG'} | HelpMyIMG</title>
        <meta name="description" content={t('compare.subtitle') || 'See how our local WebAssembly engine crushes cloud-based competitors.'} />
        <link rel="canonical" href={`https://helpmyimg.com/${lang}/compare`} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* SECTION 1: HERO */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-neon-purple/20 blur-[150px] rounded-full pointer-events-none -z-10" />
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-sm font-mono font-bold mb-8">
            <Scale className="w-4 h-4" />
            {t('compare.badge') || 'HEAD-TO-HEAD COMPARISON'}
          </div>
          <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-8 tracking-tight leading-tight">
            {t('compare.title') || 'HelpMyIMG vs The Rest'}
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
            {t('compare.subtitle') || 'We rebuilt AI image processing from the ground up to run locally. See why the cloud is obsolete.'}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/20 text-neon-emerald text-sm md:text-base font-bold max-w-2xl mx-auto text-center">
            {t('info.freePromo') || '100% Free, 0 Rupiah, No Subscriptions.'}
          </div>
        </motion.div>

        {/* SECTION 2: COMPARISON MATRIX */}
        <div className="mb-32 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="col-span-1"></div>
              <div className="col-span-1 bg-neon-purple/20 border-2 border-neon-purple text-white p-6 rounded-t-3xl text-center">
                <h3 className="text-2xl font-black font-heading mb-2">HelpMyIMG</h3>
                <div className="text-neon-purple font-mono text-sm tracking-widest uppercase">Local WASM</div>
              </div>
              <div className="col-span-1 bg-dark-800 border border-dark-600 text-slate-300 p-6 rounded-t-3xl text-center opacity-70">
                <h3 className="text-xl font-bold mb-2">Cloud APIs</h3>
                <div className="text-slate-500 font-mono text-sm uppercase">AWS / GCP</div>
              </div>
              <div className="col-span-1 bg-dark-800 border border-dark-600 text-slate-300 p-6 rounded-t-3xl text-center opacity-70">
                <h3 className="text-xl font-bold mb-2">SaaS Editors</h3>
                <div className="text-slate-500 font-mono text-sm uppercase">Subscription</div>
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-4">
              {[
                { label: 'Latency / Speed', ours: '0ms (Instant)', theirs1: '500ms+', theirs2: '800ms+' },
                { label: 'Privacy', ours: '100% Local (Zero-Trust)', theirs1: 'Data Uploaded', theirs2: 'Data Stored' },
                { label: 'Offline Mode', ours: 'Fully Supported', theirs1: 'Fails completely', theirs2: 'Fails completely' },
                { label: 'Pricing', ours: '0 IDR / Forever Free', theirs1: 'Pay per API call', theirs2: 'Monthly Subs' },
                { label: 'Batch Processing', ours: 'Up to 10 parallel', theirs1: 'Queue based', theirs2: '1 by 1 limit' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-4 gap-4 items-center">
                  <div className="col-span-1 bg-dark-900 border border-dark-700 p-5 rounded-2xl font-bold text-white shadow-inner">
                    {t(`compare.row${i+1}.label`) || row.label}
                  </div>
                  <div className="col-span-1 bg-neon-purple/5 border border-neon-purple/30 p-5 rounded-2xl text-center font-bold text-neon-purple flex flex-col items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {t(`compare.row${i+1}.ours`) || row.ours}
                  </div>
                  <div className="col-span-1 bg-dark-800 border border-dark-700 p-5 rounded-2xl text-center text-slate-400 flex flex-col items-center gap-2 opacity-70">
                    <XCircle className="w-5 h-5 text-red-500/50" />
                    {t(`compare.row${i+1}.t1`) || row.theirs1}
                  </div>
                  <div className="col-span-1 bg-dark-800 border border-dark-700 p-5 rounded-2xl text-center text-slate-400 flex flex-col items-center gap-2 opacity-70">
                    <XCircle className="w-5 h-5 text-red-500/50" />
                    {t(`compare.row${i+1}.t2`) || row.theirs2}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 3: THE SPEED DIFFERENCE */}
        <div className="mb-32 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 bg-dark-800 rounded-3xl p-8 border border-dark-600 relative">
            <div className="space-y-8">
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-neon-emerald font-bold">HelpMyIMG (Local)</span>
                  <span className="text-neon-emerald">2.4s total</span>
                </div>
                <div className="h-4 bg-dark-900 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '15%' }} viewport={{ once: true }} className="h-full bg-neon-emerald" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2 font-mono">
                  <span className="text-red-400">Cloud Competitors</span>
                  <span className="text-red-400">12.0s total</span>
                </div>
                <div className="h-4 bg-dark-900 rounded-full overflow-hidden flex">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '40%' }} viewport={{ once: true }} className="h-full bg-orange-500 relative"><span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/50">Upload</span></motion.div>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '20%' }} viewport={{ once: true }} className="h-full bg-red-500 relative"><span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/50">Process</span></motion.div>
                  <motion.div initial={{ width: 0 }} whileInView={{ width: '30%' }} viewport={{ once: true }} className="h-full bg-yellow-500 relative"><span className="absolute inset-0 flex items-center justify-center text-[10px] text-white/50">Download</span></motion.div>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex p-3 rounded-2xl bg-neon-emerald/10 mb-6">
              <Zap className="w-8 h-8 text-neon-emerald" />
            </div>
            <h2 className="text-4xl font-heading font-black text-white mb-6">
              {t('compare.s3.title') || 'Network Latency is the Enemy.'}
            </h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              {t('compare.s3.desc') || 'Cloud editors waste 80% of your time just transferring files back and forth. By processing directly on your hardware, we eliminate the network entirely, resulting in speeds up to 5x faster.'}
            </p>
          </div>
        </div>

        {/* SECTION 4: OFFLINE CAPABILITY */}
        <div className="mb-32 bg-gradient-to-r from-dark-800 to-dark-900 rounded-[40px] p-8 md:p-16 border border-dark-600 text-center">
          <WifiOff className="w-16 h-16 text-neon-cyan mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-heading font-black text-white mb-6">
            {t('compare.s4.title') || 'Works Without Internet.'}
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-8">
            {t('compare.s4.desc') || 'Once the page loads, you can disconnect from Wi-Fi. The AI models run completely locally via your browser\'s WebAssembly engine.'}
          </p>
        </div>

        {/* SECTION 5: THE QUALITY PROOF */}
        <div className="mb-32 text-center">
          <h2 className="text-3xl font-heading font-black text-white mb-16">
            {t('compare.s5.title') || 'No Compromise on Quality'}
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-dark-900 p-8 rounded-3xl border border-dark-700">
              <h3 className="text-xl font-bold text-white mb-4">Competitors</h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Downscale large images to save server bandwidth, resulting in blurry edges.
              </p>
            </div>
            <div className="bg-neon-purple/10 p-8 rounded-3xl border border-neon-purple/30">
              <h3 className="text-xl font-bold text-neon-purple mb-4">HelpMyIMG</h3>
              <p className="text-neon-purple/80 text-lg leading-relaxed mb-6">
                Processes native resolutions directly in RAM, maintaining pixel-perfect HD precision.
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 6: FAQ */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30 mb-4 inline-block">
              FAQ
            </span>
            <h2 className="text-3xl font-heading font-black text-white">
              {t('compare.faq.title') || 'Comparison FAQ'}
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
                    {t(`compare.faq${idx}.q`) || `Comparison Question ${idx}?`}
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
                        {t(`compare.faq${idx}.a`) || `Detailed answer explaining why our local approach is superior, faster, and more secure than cloud-based competitors.`}
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
