import { Layers, ShieldCheck, Star, PenTool, Eraser, MoveUpRight, Wand2, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export function RemoveLogoSections() {
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'removelogo' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'removelogo' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-20 py-16">
      
      {/* SECTION 1: Logo Grid Showcase */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-6">
            {config.citationFirst.split('.')[0] + '.'}
          </h2>
          <p className="font-body text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            {config.citationFirst.split('.').slice(1).join('.')}
          </p>
        </div>

        {/* The "Logo Clean Up" Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {[
            { name: "Tech Brand", color: "from-blue-500 to-blue-400" },
            { name: "Coffee Shop", color: "from-amber-600 to-orange-400" },
            { name: "Startup", color: "from-emerald-500 to-teal-400" },
            { name: "Studio", color: "from-purple-500 to-pink-500" }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative group rounded-3xl overflow-hidden border border-slate-800 aspect-square flex items-center justify-center"
            >
              <div className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-500 flex items-center justify-center z-10">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} shadow-lg flex items-center justify-center text-white font-bold text-xs`}>
                  {item.name}
                </div>
                <div className="absolute bottom-4 text-xs font-semibold text-slate-500 dark:text-slate-400">{config.beforeImageLabel}</div>
              </div>
              <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-0 w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 shadow-2xl flex items-center justify-center text-white font-bold text-xs">
                {item.name}
              </div>
              <div className="absolute bottom-4 text-xs font-semibold text-indigo-400 z-0">{config.afterImageLabel}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Why You Need It (Bento Layout) */}
      {config.extraSectionTitle && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20 rounded-[3rem] p-8 md:p-16 border border-blue-500/10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-900 dark:text-white mb-6 leading-tight">
                {config.extraSectionTitle}
              </h2>
              <p className="font-body text-lg text-indigo-200/70 mb-8">
                {config.extraSectionDesc}
              </p>
              <ul className="space-y-4">
                {(config.extraSectionItems || [])?.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 text-white">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-slate-600 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative h-[300px] md:h-[400px] rounded-3xl bg-white dark:bg-slate-900 shadow-xl dark:shadow-none border border-slate-800 overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
               <PenTool className="w-32 h-32 text-indigo-500/50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
               <div className="relative z-10 px-8 py-4 bg-blue-600 rounded-full font-bold text-white shadow-xl shadow-blue-500/20 flex items-center gap-3">
                 <Eraser className="w-5 h-5" /> Auto-Erase BG
               </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: Step by step Guide */}
      {config.extraSection2Title && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center">
          <h2 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-4">{config.extraSection2Title}</h2>
          <p className="font-body text-slate-600 dark:text-slate-400 mb-12">{config.extraSection2Desc}</p>
          
          <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent -translate-y-1/2 hidden md:block"></div>
             {[
               { icon: Layers, text: (config.extraSection2Items || [])?.[0] },
               { icon: Wand2, text: (config.extraSection2Items || [])?.[1] },
               { icon: Download, text: (config.extraSection2Items || [])?.[2] }
             ].map((step, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                  className="relative z-10 flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 flex flex-col items-center"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500 flex items-center justify-center mb-6">
                    <step.icon className="w-8 h-8" />
                  </div>
                  <p className="font-body font-medium text-slate-800 dark:text-slate-200">{step.text}</p>
                </motion.div>
             ))}
          </div>
        </section>
      )}

      {/* SECTION 4: Trust & FAQs */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-400 font-medium text-sm mb-12">
          <Star className="w-4 h-4" /> {config.quantitativeProof}
        </div>

        <div className="space-y-6 text-left">
          {config.faqs?.map((faq, i) => (
            <details key={i} className="group bg-white dark:bg-slate-900 shadow-xl dark:shadow-none border border-slate-800 rounded-2xl cursor-pointer overflow-hidden">
              <summary className="flex items-center justify-between p-6 font-semibold text-lg text-slate-700 dark:text-slate-200 marker:content-none hover:bg-slate-800/50 transition-colors">
                {faq.question}
                <MoveUpRight className="w-5 h-5 text-slate-500 group-open:rotate-45 transition-transform" />
              </summary>
              <div className="p-6 pt-0 text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-800">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
