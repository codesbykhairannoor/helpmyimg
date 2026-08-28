import { RefreshCcw, FileType, CheckCircle2, AlertTriangle, Monitor, Smartphone, Globe, CloudOff } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export function ConvertWebpSections() {
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'convertwebp' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'convertwebp' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden bg-slate-50 dark:bg-slate-900/20">
      
      {/* SECTION 1: Converter Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 mb-8 text-sm font-medium">
          <RefreshCcw className="w-4 h-4 animate-spin-slow" />
          <span>Local Batch Processor</span>
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
          {config.h1}
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12">
          {config.description}
        </p>

        {/* Format Pipeline Visualizer */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-3xl mx-auto">
          {/* WEBP Source */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 w-full md:w-64 text-center">
             <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileType className="w-8 h-8" />
             </div>
             <p className="font-bold text-lg mb-1">{config.beforeImageLabel}</p>
             <p className="text-xs text-slate-500 uppercase font-medium">.webp format</p>
          </div>

          {/* Engine */}
          <div className="flex flex-col items-center">
             <div className="h-10 w-0.5 md:w-16 md:h-0.5 bg-emerald-500 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white rounded-full p-2 shadow-lg shadow-emerald-500/30 animate-pulse">
                   <RefreshCcw className="w-6 h-6" />
                </div>
             </div>
          </div>

          {/* JPG Target */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border-2 border-emerald-500 w-full md:w-64 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg">
               Universal
             </div>
             <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                <FileType className="w-8 h-8" />
             </div>
             <p className="font-bold text-lg mb-1">{config.afterImageLabel}</p>
             <p className="text-xs text-slate-500 uppercase font-medium">.jpg / .jpeg</p>
          </div>
        </div>
      </section>

      {/* SECTION 2: WEBP vs JPG Technical Table */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{config.extraSectionTitle}</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{config.extraSectionDesc}</p>
        </div>
        
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50">
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white">Feature</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-blue-600 dark:text-blue-400">WEBP</th>
                <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-semibold text-emerald-600 dark:text-emerald-400">JPG</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">File Size</td>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700">~30% Smaller</td>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700">Standard Size</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">Compatibility</td>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> Limited</td>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% Universal</td>
              </tr>
              <tr>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-700 dark:text-slate-300">Transparency</td>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700">Supported</td>
                <td className="p-4 border-b border-slate-200 dark:border-slate-700">No (Replaced with White)</td>
              </tr>
              <tr>
                <td className="p-4 font-medium text-slate-700 dark:text-slate-300">Best Use Case</td>
                <td className="p-4">{(config.extraSectionItems || [])[0].replace('WEBP: ', '')}</td>
                <td className="p-4">{(config.extraSectionItems || [])[1].replace('JPG: ', '')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 3: Performance Quote */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-800 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">WebAssembly Engine</h3>
            <p className="text-lg text-slate-700 dark:text-slate-300 italic mb-4">"{config.citationFirst}"</p>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm uppercase tracking-wide">
              <Monitor className="w-5 h-5" />
              <span>{config.quantitativeProof}</span>
            </div>
          </div>
          <div className="w-full md:w-1/3 flex justify-center">
             <CloudOff className="w-32 h-32 text-emerald-200 dark:text-emerald-900/50" />
          </div>
        </div>
      </section>

      {/* SECTION 4: Bulleted Benefits */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{config.extraSection2Title}</h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2">{config.extraSection2Desc}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(config.extraSection2Items || []).map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {[<Globe />, <Monitor />, <Smartphone />][i % 3]}
              </div>
              <p className="font-semibold text-slate-900 dark:text-white">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: FAQ Cards */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Converter FAQ</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {config.faqs.map((faq, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
              <h4 className="font-bold text-lg text-slate-900 dark:text-white mb-3">{faq.question}</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-auto">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
