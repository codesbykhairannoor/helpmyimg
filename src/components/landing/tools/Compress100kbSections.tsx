import React from 'react';
import { Shield, Zap, FileJson, CheckCircle2, CloudOff } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import { motion } from 'framer-motion';

export const Compress100kbSections: React.FC = () => {
  useTranslation(); // we call it if we need context, but not using t here. Or simply remove useTranslation if entirely unused.

  return (
    <div className="w-full flex flex-col gap-16 md:gap-24 overflow-hidden relative z-10 pb-20">
      
      {/* SECTION 1: Hardcoded Left-Right Split (Unique Layout) */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 font-medium text-sm border border-indigo-500/20">
              <CloudOff className="w-4 h-4" />
              <span>100% Offline Processing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-slate-100 to-slate-400">
              Why Compress to 100KB?
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Most government forms, university applications, and HR portals strictly require identity documents to be under 100KB or 200KB. 
              Our specialized client-side WebGPU tool guarantees exact sizing without sending your sensitive documents to a server.
            </p>
            <ul className="space-y-4 pt-4">
              {[
                "Zero data collection. Your privacy is absolute.",
                "Instant processing right inside your browser.",
                "Maintains readability of text and facial features.",
                "Works seamlessly on both Mobile and Desktop."
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-300">
                  <CheckCircle2 className="w-6 h-6 text-indigo-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Visual Abstract Representation */}
            <div className="aspect-square sm:aspect-[4/3] rounded-3xl bg-slate-800/50 border border-slate-700/50 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-48 h-64 bg-slate-200 rounded-lg shadow-2xl overflow-hidden transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-1/2 bg-slate-300 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="w-full h-2 bg-slate-400 rounded-full" />
                    <div className="w-3/4 h-2 bg-slate-400 rounded-full" />
                    <div className="w-1/2 h-2 bg-slate-400 rounded-full" />
                  </div>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    5 MB
                  </div>
                </div>
                
                <div className="z-10 bg-indigo-500 p-3 rounded-full shadow-xl mx-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                
                <div className="relative w-40 h-56 bg-slate-200 rounded-lg shadow-2xl overflow-hidden transform rotate-6 group-hover:rotate-0 transition-transform duration-500">
                  <div className="w-full h-1/2 bg-slate-300" />
                  <div className="p-4 space-y-3">
                    <div className="w-full h-2 bg-slate-400 rounded-full" />
                    <div className="w-3/4 h-2 bg-slate-400 rounded-full" />
                    <div className="w-1/2 h-2 bg-slate-400 rounded-full" />
                  </div>
                  <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg border border-green-400">
                    98 KB
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: Grid Features (Unique Icons/Colors) */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-slate-100 to-slate-400">
            Advanced Client-Side Engineering
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Absolute Privacy",
              desc: "By utilizing WebWorkers, images never leave your device. Serverless architecture prevents data leaks."
            },
            {
              icon: Zap,
              title: "Lightning Fast",
              desc: "Powered by browser-native APIs. Compressing a 5MB image to 100KB takes less than 0.5 seconds."
            },
            {
              icon: FileJson,
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
              className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/60 transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};
