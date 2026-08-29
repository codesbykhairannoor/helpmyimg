import { ShieldCheck, EyeOff, Lock, AlertOctagon, CarFront, FileLock2, ServerCrash } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export function BlurPlateSections() {
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'blurplate' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'blurplate' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden dark:bg-[#0B1121]">
      
      {/* SECTION 1: High Security Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 mb-8 text-sm font-bold tracking-wide uppercase border border-red-200 dark:border-red-800">
          <ShieldCheck className="w-4 h-4" />
          <span>100% Offline Privacy Guarantee</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-slate-900 dark:text-slate-900 dark:text-white mb-6 leading-tight">
          {config.extraSectionTitle || config.h1}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-16">
          {config.extraSectionDesc || config.description}
        </p>

        {/* Censor Demonstration */}
        <div className="max-w-4xl mx-auto bg-slate-100 dark:bg-slate-800/50 p-4 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
           <div className="relative aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center" />
              {/* Blur Box */}
              <div className="absolute bottom-[20%] left-[30%] w-[40%] h-[15%] backdrop-blur-xl bg-black/20 border-2 border-white/50 rounded flex items-center justify-center shadow-2xl">
                 <Lock className="w-8 h-8 text-slate-900 dark:text-white/80" />
              </div>
              
              <div className="absolute top-4 left-4 right-4 flex justify-between">
                <div className="bg-red-500 text-white px-3 py-1 rounded shadow-lg text-sm font-bold animate-pulse">
                  {config.beforeImageLabel}
                </div>
                <div className="bg-emerald-500 text-slate-900 dark:text-white px-3 py-1 rounded shadow-lg text-sm font-bold">
                  {config.afterImageLabel}
                </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 2: The Security Risk */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-red-50 dark:bg-red-950/20 rounded-3xl p-8 md:p-12 border border-red-100 dark:border-red-900 flex flex-col md:flex-row items-center gap-10">
           <div className="w-24 h-24 shrink-0 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
             <AlertOctagon className="w-12 h-12" />
           </div>
           <div>
              <p className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {config.extraSectionDesc || config.description}
              </p>
              <p className="text-red-600 dark:text-red-400 font-medium">
                {config.quantitativeProof}
              </p>
           </div>
        </div>
      </section>

      {/* SECTION 3: Why Offline Processing Matters */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{config.extraSectionTitle}</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{config.extraSectionDesc}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(config.extraSectionItems || []).map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-600 dark:text-slate-300 rounded-full flex items-center justify-center mb-6">
                {[<FileLock2 />, <CarFront />, <ServerCrash />][i]}
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-lg">{item}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: Types of Censors */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className=" rounded-3xl p-8 md:p-12 text-slate-900 dark:text-white shadow-2xl">
           <h3 className="text-3xl font-bold mb-4">{config.extraSection2Title}</h3>
           <p className="text-slate-500 dark:text-slate-400 mb-10">{config.extraSection2Desc}</p>
           
           <div className="grid md:grid-cols-3 gap-6">
              {(config.extraSection2Items || []).map((item, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 shadow-md dark:shadow-none rounded-xl p-6 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors">
                   <div className="h-12 w-full bg-slate-700 rounded overflow-hidden mb-4 relative">
                      {i === 0 && <div className="absolute inset-0 backdrop-blur-md bg-white/10" />}
                      {i === 1 && <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #334155 20%, transparent 20%)', backgroundSize: '4px 4px' }} />}
                      {i === 2 && <div className="absolute inset-0 bg-black" />}
                   </div>
                   <p className="font-bold">{item}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* SECTION 5: Trust FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full mb-12">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Privacy FAQ</h3>
        <div className="space-y-6">
          {config.faqs.map((faq, i) => (
            <div key={i} className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                <EyeOff className="w-5 h-5 text-blue-500" />
                {faq.question}
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-7">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
