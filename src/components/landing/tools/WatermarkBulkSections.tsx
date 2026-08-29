import { Layers, Shield, CopyPlus, LayoutGrid, CheckCircle2, Award } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';
import { useTranslation } from '../../../context/LanguageContext';

export function WatermarkBulkSections() {
  const { t } = useTranslation();
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'watermarkbulk' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'watermarkbulk' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden">
      
      {/* SECTION 1: Dark Mode Pro Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center">
        <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
          <CopyPlus className="w-10 h-10" />
        </div>
        <h2 className="font-heading text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-900 dark:text-white mb-6 leading-tight">
          {config.extraSectionTitle || config.h1}
        </h2>
        <p className="font-body text-xl text-slate-600 dark:text-slate-600 dark:text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-16">
          {config.extraSectionDesc || config.description}
        </p>

        {/* Batch Workflow Showcase Grid */}
        <div className="relative mx-auto max-w-5xl">
           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 blur-3xl rounded-full" />
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="aspect-square dark:bg-slate-800 shadow-md dark:shadow-none rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden relative group">
                  <div className={`absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506744626753-1fa28f673b0c?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60`} />
                  {/* The Watermark Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/40">
                     <div className="text-slate-900 dark:text-white/60 font-black text-2xl rotate-[-30deg] select-none tracking-widest drop-shadow-md">BRAND</div>
                  </div>
                  {/* UI Checkmark */}
                  <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle2 className="w-4 h-4 text-slate-900 dark:text-white" />
                  </div>
                </div>
              ))}
           </div>
           
           {/* Center Floating Console */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-6 rounded-2xl shadow-2xl z-20 flex flex-col items-center min-w-[250px]">
              <Layers className="w-8 h-8 text-amber-500 mb-2 animate-bounce" />
              <p className="font-body text-slate-900 dark:text-white font-bold text-lg mb-1">Batch Processing</p>
              <div className="w-full h-2 bg-white dark:bg-slate-800 shadow-xl dark:shadow-none rounded-full overflow-hidden">
                 <div className="w-full h-full bg-amber-500 animate-pulse" />
              </div>
              <p className="font-body text-slate-500 dark:text-slate-400 text-xs mt-2">Applying 100/100...</p>
           </div>
        </div>
      </section>

      {/* SECTION 2: The Pitch Deck */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 shadow-xl dark:shadow-none rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row gap-12 items-center">
           <div className="flex-1 space-y-6">
              <Shield className="w-12 h-12 text-amber-500" />
              <h3 className="font-heading text-3xl font-bold text-slate-900 dark:text-white">{config.extraSection2Title}</h3>
              <p className="font-body text-slate-600 dark:text-slate-300 text-lg leading-relaxed">{config.extraSectionDesc || config.description}</p>
              <p className="font-body text-amber-400 font-semibold">{config.quantitativeProof}</p>
           </div>
           <div className="w-full md:w-1/3 flex flex-col gap-4">
              {(config.extraSection2Items || []).map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 flex items-start gap-3">
                   <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                   <p className="font-body text-slate-700 dark:text-slate-200 text-sm">{item}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 3: Features Grid */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h3 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-4">{config.extraSectionTitle}</h3>
          <p className="font-body text-slate-500 dark:text-slate-400">{config.extraSectionDesc}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(config.extraSectionItems || []).map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 shadow-xl dark:shadow-none p-8 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-500/50 transition-all text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-900 shadow-xl dark:shadow-none rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-500/10 transition-colors">
                {[<LayoutGrid className="text-blue-400" />, <Layers className="text-purple-400" />, <Award className="text-amber-400" />][i]}
              </div>
              <h4 className="font-heading font-bold text-slate-900 dark:text-white text-lg">{item}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Dual Info Split */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
           <div className="flex-1 bg-blue-900/20 border border-blue-500/20 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
             <h4 className="font-heading text-blue-400 font-bold mb-4 uppercase tracking-widest">{config.beforeImageLabel}</h4>
             <p className="font-body text-slate-600 dark:text-slate-300">Images uploaded directly to social media are instantly scraped by bots and AI models. Your metadata is stripped.</p>
           </div>
           <div className="flex-1 bg-amber-900/20 border border-amber-500/20 rounded-3xl p-10 flex flex-col items-center justify-center text-center">
             <h4 className="font-heading text-amber-500 font-bold mb-4 uppercase tracking-widest">{config.afterImageLabel}</h4>
             <p className="font-body text-slate-600 dark:text-slate-300">A hard-coded watermark permanently embeds your ownership into the pixel data, ensuring credit across the web.</p>
           </div>
        </div>
      </section>

      {/* SECTION 5: Dark Mode FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full text-left">
        <h3 className="font-heading text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">{t('longtail.faq', { defaultValue: 'Frequently Asked Questions' })}</h3>
        <div className="space-y-4">
          {config.faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 shadow-md dark:shadow-none rounded-xl p-6 border border-slate-200 dark:border-slate-700">
              <h4 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-3 flex items-start gap-3">
                <span className="text-amber-500">Q.</span> {faq.question}
              </h4>
              <p className="font-body text-slate-500 dark:text-slate-400 pl-8 leading-relaxed">
                <span className="text-slate-500 mr-2">A.</span> {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
