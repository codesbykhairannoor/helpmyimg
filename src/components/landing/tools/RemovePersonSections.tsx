import { Sparkles, Eraser, Move, ScanLine, Image as ImageIcon, Zap, CheckCircle2 } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export function RemovePersonSections() {
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'removeperson' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'removeperson' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden">
      
      {/* SECTION 1: Magic Eraser Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20">
          <Eraser className="w-10 h-10" />
        </div>
        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white mb-6 leading-tight">
          {config.extraSectionTitle || config.h1}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-600 dark:text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          {config.extraSectionDesc || config.description}
        </p>

        {/* Interactive Inpainting Showcase */}
        <div className="relative mx-auto max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
          <div className="aspect-video relative overflow-hidden group">
            {/* Background Base */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center" />
            
            {/* Photobomber Layer (Animated out on hover) */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center transition-opacity duration-700 group-hover:opacity-0 flex items-center justify-center">
               <div className="absolute inset-y-0 right-1/4 w-1/4 bg-red-500/30 mix-blend-multiply flex items-center justify-center border-2 border-red-500 border-dashed rounded-lg animate-pulse">
                  <span className="bg-red-600 text-slate-900 dark:text-white px-3 py-1 rounded text-sm font-bold shadow-lg">Target Detected</span>
               </div>
            </div>

            {/* AI Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent h-full w-full opacity-0 group-hover:opacity-100 group-hover:animate-scanline pointer-events-none" />

            {/* Label */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none">
              <span className=" /80 backdrop-blur-md text-slate-900 dark:text-white px-4 py-2 rounded-full font-medium shadow-lg transition-opacity group-hover:opacity-0">
                {config.beforeImageLabel}
              </span>
              <span className="bg-purple-600/90 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium shadow-lg opacity-0 transition-opacity group-hover:opacity-100">
                {config.afterImageLabel}
              </span>
            </div>
            
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none group-hover:opacity-0 transition-opacity">
               <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                 <Move className="w-8 h-8 text-slate-900 dark:text-white animate-bounce-x" />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: Technical Citation */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-32 h-32" />
          </div>
          <p className="text-xl md:text-2xl font-serif italic text-slate-700 dark:text-slate-300 relative z-10">
            "{config.extraSectionDesc || config.description}"
          </p>
          <div className="mt-8 flex items-center gap-4 relative z-10">
            <div className="h-12 w-1 bg-purple-500 rounded-full" />
            <div>
              <p className="font-bold text-slate-900 dark:text-white">AI Vision Model v4</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{config.quantitativeProof}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: Why Inpainting is Better */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{config.extraSectionTitle}</h3>
          <p className="text-slate-600 dark:text-slate-400">{config.extraSectionDesc}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {(config.extraSectionItems || []).map((item, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-colors shadow-sm">
              <CheckCircle2 className="w-8 h-8 text-purple-500 mb-4" />
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">{item}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Contextual Situations (Bento Grid) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-8 text-slate-900 dark:text-white shadow-xl relative overflow-hidden">
             <div className="absolute -right-10 -top-10 opacity-20">
                <ScanLine className="w-48 h-48" />
             </div>
             <h3 className="text-2xl font-bold mb-2 relative z-10">{config.extraSection2Title}</h3>
             <p className="text-purple-100 mb-6 max-w-md relative z-10">{config.extraSection2Desc}</p>
             <div className="space-y-3 relative z-10">
               {(config.extraSection2Items || []).map((item, i) => (
                 <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-white/20">
                   <Zap className="w-5 h-5 text-purple-200" />
                   <span className="font-medium">{item}</span>
                 </div>
               ))}
             </div>
          </div>
          <div className="bg-slate-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center border border-slate-800">
             <ImageIcon className="w-16 h-16 text-slate-400 mb-6" />
             <p className="text-slate-300 font-medium">100% Local Processing</p>
             <p className="text-sm text-slate-500 mt-2">No images are sent to any server. Complete privacy.</p>
          </div>
        </div>
      </section>

      {/* SECTION 5: FAQ Accordion */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
        </div>
        <div className="space-y-4">
          {config.faqs.map((faq, i) => (
            <details key={i} className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                {faq.question}
                <span className="transition group-open:rotate-180">
                  <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                </span>
              </summary>
              <p className="text-slate-600 dark:text-slate-300 px-6 pb-6 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

    </div>
  );
}
