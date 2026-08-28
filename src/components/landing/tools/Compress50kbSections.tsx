import React, { useState } from 'react';
import { ShieldAlert, Zap, Layers, CheckCircle, ChevronDown, Rocket, Smartphone, Building, GraduationCap, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export const Compress50kbSections: React.FC = () => {
  const { route } = useRouter();
  const currentLang = route.lang || 'en';
  
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'compress50kb' && c.lang === currentLang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'compress50kb' && c.lang === 'en');

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!config) return null;

  return (
    <div className="w-full flex flex-col gap-24 relative z-10 pb-32 pt-12 overflow-hidden bg-zinc-950">
      
      {/* Background Orbs for dark aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />

      {/* SECTION 1: Dark Aesthetic Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-2xl"
        >
          <Rocket className="w-4 h-4 text-violet-400" />
          <span className="text-sm font-semibold tracking-wide uppercase">WebGPU Engine</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 leading-tight"
        >
          {config.h1}
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed"
        >
          {config.citationFirst}
        </motion.p>
      </section>

      {/* SECTION 2: Bento Grid Layout */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          
          {/* Bento Box 1: Quantitative Proof (Spans 2 columns) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="md:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-48 h-48 text-violet-500" />
            </div>
            <div className="relative z-10 flex flex-col justify-center h-full max-w-md">
              <h3 className="text-2xl font-bold text-white mb-4">High-Speed Processing</h3>
              <p className="text-lg text-zinc-400 font-medium italic border-l-4 border-violet-500 pl-4 py-2">
                "{config.quantitativeProof}"
              </p>
            </div>
          </motion.div>

          {/* Bento Box 2: Visual Stats */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center group"
          >
            <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center mb-4 group-hover:bg-fuchsia-500/20 transition-colors">
              <ShieldAlert className="w-8 h-8 text-fuchsia-400" />
            </div>
            <div className="text-3xl font-black text-white mb-1">50KB</div>
            <div className="text-zinc-500 font-semibold uppercase tracking-widest text-xs">Target Limit</div>
          </motion.div>

          {/* Bento Box 3: Before & After Compact */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800/50">
                <span className="text-zinc-500 font-medium text-sm">{config.beforeImageLabel}</span>
                <span className="text-red-400 font-bold text-sm line-through">Heavy</span>
              </div>
              <div className="flex justify-center">
                <div className="w-px h-6 bg-zinc-800" />
              </div>
              <div className="flex items-center justify-between p-3 bg-violet-500/10 rounded-xl border border-violet-500/20">
                <span className="text-zinc-300 font-medium text-sm">{config.afterImageLabel}</span>
                <span className="text-violet-400 font-bold text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Ready
                </span>
              </div>
            </div>
          </motion.div>

          {/* Bento Box 4: Features span 2 */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2 bg-gradient-to-tr from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-8 grid grid-cols-2 gap-8"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-blue-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Smart Quality Retention</h4>
              <p className="text-sm text-zinc-400">Our algorithm automatically adjusts compression curves to retain edge sharpness even at extremely low bitrates.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-white">Mobile Optimized</h4>
              <p className="text-sm text-zinc-400">Works flawlessly on iOS and Android browsers without requiring any app installations or backend uploads.</p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* SECTION 3: Use Cases Grid */}
      {config.extraSectionTitle && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">{config.extraSectionTitle}</h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">{config.extraSectionDesc}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Building, color: "text-blue-400", bg: "bg-blue-500/10", text: (config.extraSectionItems || [])?.[0] },
              { icon: GraduationCap, color: "text-amber-400", bg: "bg-amber-500/10", text: (config.extraSectionItems || [])?.[1] },
              { icon: Plane, color: "text-emerald-400", bg: "bg-emerald-500/10", text: (config.extraSectionItems || [])?.[2] }
            ].map((useCase, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex flex-col items-center text-center hover:border-zinc-700 transition-colors"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${useCase.bg}`}>
                  <useCase.icon className={`w-7 h-7 ${useCase.color}`} />
                </div>
                <p className="text-zinc-300 font-medium leading-relaxed">{useCase.text}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: FAQs (Minimalist Dark Layout) */}
      {config.faqs && config.faqs.length > 0 && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
          <div className="border border-zinc-800 bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] p-8 md:p-12">
            <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
            <div className="space-y-2">
              {config.faqs.map((faq, idx) => (
                <div key={idx} className="border-b border-zinc-800/50 last:border-0">
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-medium text-zinc-300 group-hover:text-white transition-colors">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-violet-400' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 text-zinc-500 leading-relaxed text-base">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
