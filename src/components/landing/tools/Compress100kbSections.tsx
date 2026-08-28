import React, { useState } from 'react';
import { Shield, Zap, FileJson, CloudOff, ChevronDown, Activity, Lock, Cpu, Upload, ArrowRight, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export const Compress100kbSections: React.FC = () => {
  const { route } = useRouter();
  const currentLang = route.lang || 'en';
  
  // Ambil config yang sesuai dengan bahasa saat ini, atau fallback ke bahasa Inggris
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'compress100kb' && c.lang === currentLang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'compress100kb' && c.lang === 'en');

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!config) return null;

  return (
    <div className="w-full flex flex-col gap-20 md:gap-32 overflow-hidden relative z-10 pb-24 pt-8">
      
      {/* SECTION 1: Citation First (Split Layout with Abstract Visualization) */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium text-sm border border-indigo-500/20">
              <CloudOff className="w-4 h-4" />
              <span>Client-Side Architecture</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 leading-tight">
              {config.extraSectionTitle || config.h1}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              {config.extraSectionDesc || config.description}
            </p>
            <div className="pt-4 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-lg">
                  <Lock className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">100% Secure</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-500/10 dark:bg-pink-500/20 rounded-lg">
                  <Cpu className="w-5 h-5 text-pink-500 dark:text-pink-400" />
                </div>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">WebGPU Powered</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Visual Abstract Representation */}
            <div className="aspect-[4/3] rounded-[2rem] border border-slate-800 overflow-hidden relative group shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-pink-500/10 opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                
                {/* Before Image Card */}
                <div className="relative w-48 h-64 dark:bg-slate-800 shadow-md dark:shadow-none rounded-xl shadow-2xl overflow-hidden transform -rotate-12 group-hover:-rotate-6 transition-transform duration-500 border border-slate-700">
                  <div className="w-full h-3/5 bg-slate-700 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="w-full h-2 bg-slate-600 rounded-full" />
                    <div className="w-3/4 h-2 bg-slate-600 rounded-full" />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="bg-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full border border-red-500/30">
                      {config.beforeImageLabel}
                    </span>
                  </div>
                </div>
                
                {/* Action Button Icon */}
                <div className="z-10 bg-gradient-to-r from-indigo-500 to-pink-500 p-4 rounded-full shadow-[0_0_30px_rgba(99,102,241,0.5)] mx-[-20px]">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                
                {/* After Image Card */}
                <div className="relative w-48 h-64 bg-white dark:bg-slate-800 shadow-md dark:shadow-none rounded-xl shadow-2xl overflow-hidden transform rotate-12 group-hover:rotate-6 transition-transform duration-500 border border-indigo-500/30">
                  <div className="w-full h-3/5 bg-slate-700" />
                  <div className="p-4 space-y-3">
                    <div className="w-full h-2 bg-slate-600 rounded-full" />
                    <div className="w-3/4 h-2 bg-slate-600 rounded-full" />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <span className="bg-green-500/20 text-green-400 text-xs font-bold px-3 py-1 rounded-full border border-green-500/30">
                      {config.afterImageLabel}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Quantitative Proof (Stats / Banner Layout) */}
      <section className="relative w-full bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 py-16">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-5 flex justify-center md:justify-start"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 rounded-full" />
                <Activity className="w-32 h-32 text-indigo-500 dark:text-indigo-400 relative z-10" />
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-7 space-y-4 text-center md:text-left"
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Proven Performance</h3>
              <p className="text-xl text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-indigo-500 pl-4 py-2 bg-white dark:bg-slate-800/30 shadow-sm dark:shadow-none rounded-r-xl">
                "{config.quantitativeProof}"
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Technical Features Grid */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              color: "text-emerald-500 dark:text-emerald-400",
              bg: "bg-emerald-500/10",
              border: "border-emerald-500/20",
              title: "Absolute Privacy",
              desc: "By utilizing WebWorkers, images never leave your device. Serverless architecture prevents data leaks."
            },
            {
              icon: Zap,
              color: "text-amber-500 dark:text-amber-400",
              bg: "bg-amber-500/10",
              border: "border-amber-500/20",
              title: "Lightning Fast",
              desc: "Powered by browser-native APIs. Compressing a 5MB image to 100KB takes less than 0.5 seconds."
            },
            {
              icon: FileJson,
              color: "text-blue-500 dark:text-blue-400",
              bg: "bg-blue-500/10",
              border: "border-blue-500/20",
              title: "Batch Ready",
              desc: "Drag and drop up to 50 images at once. They process concurrently without crashing your tab."
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-3xl p-8 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all hover:-translate-y-1 shadow-lg group"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.bg} ${feature.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 4: New "How to Compress" Visual Guide */}
      {config.extraSectionTitle && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{config.extraSectionTitle}</h2>
            <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{config.extraSectionDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Upload, title: "1. Upload", desc: (config.extraSectionItems || [])?.[0] || "Upload your file", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
              { icon: Zap, title: "2. AI Shrink", desc: (config.extraSectionItems || [])?.[1] || "AI processes it", color: "text-purple-500", bg: "bg-purple-100 dark:bg-purple-900/30" },
              { icon: Download, title: "3. Download", desc: (config.extraSectionItems || [])?.[2] || "Save result", color: "text-green-500", bg: "bg-green-100 dark:bg-green-900/30" }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="relative bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center shadow-sm"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 ${step.bg}`}>
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.desc}</p>
                
                {idx < 2 && (
                  <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-slate-300 dark:text-slate-700">
                    <ArrowRight className="w-8 h-8" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 5: Localized FAQs (Accordion Layout) */}
      {config.faqs && config.faqs.length > 0 && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-indigo-500 mx-auto rounded-full" />
          </div>
          <div className="space-y-4">
            {config.faqs.map((faq, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm dark:shadow-none"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="text-lg font-semibold text-slate-800 dark:text-slate-200 pr-8">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 dark:text-slate-400 transition-transform duration-300 shrink-0 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/50 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
