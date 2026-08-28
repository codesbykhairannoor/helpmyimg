import React, { useState } from 'react';
import { Camera, Maximize, Grip, Image as ImageIcon, CheckCircle, ChevronDown, Sparkles, Smartphone, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export const ResizeIgSections: React.FC = () => {
  const { route } = useRouter();
  const currentLang = route.lang || 'en';
  
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'resizeig' && c.lang === currentLang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'resizeig' && c.lang === 'en');

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!config) return null;

  return (
    <div className="w-full flex flex-col gap-24 relative z-10 pb-32 pt-12 overflow-hidden bg-white dark:bg-slate-950">
      
      {/* SECTION 1: Instagram Vibe Hero + Mockup */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Colorful mesh gradient blob */}
        <div className="absolute top-0 right-0 w-full md:w-[60%] h-[500px] bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full blur-[100px] opacity-10 dark:opacity-20 pointer-events-none transform translate-x-1/3 -translate-y-1/4" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 font-medium text-sm border border-pink-200 dark:border-pink-500/20">
              <Sparkles className="w-4 h-4" />
              <span>Perfect Fit Aspect Ratios</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-tight">
              {config.h1}
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg font-medium">
              {config.citationFirst}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl">
                <Maximize className="w-4 h-4 text-purple-500" />
                <span>4:5 Portrait</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold bg-slate-100 dark:bg-slate-900 px-4 py-2 rounded-xl">
                <Smartphone className="w-4 h-4 text-pink-500" />
                <span>9:16 Stories</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative flex justify-center"
          >
            {/* Phone Mockup Representation */}
            <div className="relative w-72 h-[580px] bg-slate-900 rounded-[3rem] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col">
              {/* Top Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-800 rounded-b-3xl mx-16 z-20" />
              
              {/* Instagram-ish Header */}
              <div className="h-16 bg-white dark:bg-slate-950 flex items-center px-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                  <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full" />
                </div>
                <div className="ml-3 h-3 w-24 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
              
              {/* Post Content (Before/After Illusion) */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-900 relative overflow-hidden group">
                {/* The "Blurred" Background */}
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1707343843437-caacff5cfa74')] bg-cover bg-center blur-md scale-110 opacity-60 dark:opacity-40 transition-transform duration-1000 group-hover:scale-125" />
                
                {/* The actual photo */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="w-full aspect-video bg-[url('https://images.unsplash.com/photo-1707343843437-caacff5cfa74')] bg-cover bg-center shadow-lg rounded-sm" />
                </div>
                
                {/* Labels */}
                <div className="absolute inset-x-0 bottom-4 flex justify-between px-4">
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg opacity-100 group-hover:opacity-0 transition-opacity">
                    {config.beforeImageLabel}
                  </span>
                  <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    {config.afterImageLabel}
                  </span>
                </div>
              </div>
              
              {/* Instagram-ish Footer */}
              <div className="h-12 bg-white dark:bg-slate-950 flex items-center justify-around border-t border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
                <div className="w-6 h-6 bg-slate-200 dark:bg-slate-800 rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Checklist Features */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-slate-50 dark:bg-slate-900/40 rounded-[3rem] py-16 md:py-24 border border-slate-200 dark:border-slate-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">No More Cropping.</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 italic">"{config.quantitativeProof}"</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {[
            { title: "Smart Blur Padding", icon: Layers, color: "text-pink-500" },
            { title: "Perfect 4:5 Portrait", icon: Camera, color: "text-purple-500" },
            { title: "9:16 Stories Support", icon: Smartphone, color: "text-yellow-500" },
            { title: "Lossless Export Quality", icon: Grip, color: "text-emerald-500" }
          ].map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
            >
              <div className={`p-3 rounded-full bg-slate-50 dark:bg-slate-900 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.title}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Minimalist FAQs Grid */}
      {config.faqs && config.faqs.length > 0 && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3 sticky top-24">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white leading-tight">Common Questions</h2>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Everything you need to know about preparing photos for Instagram.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 gap-6">
              {config.faqs.map((faq, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl"
                >
                  <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">{faq.question}</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};
