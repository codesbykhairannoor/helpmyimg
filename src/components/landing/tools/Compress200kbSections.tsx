import { Database, Check, Server, TerminalSquare } from 'lucide-react';
import { PSEO_KEYWORD_MATRIX } from '../../../data/pseoKeywords';
import { useRouter } from '../../../context/RouterContext';

export function Compress200kbSections() {
  const { route } = useRouter();
  const lang = route.lang;
  const config = PSEO_KEYWORD_MATRIX.find(c => c.tool === 'compress200kb' && c.lang === lang)
              || PSEO_KEYWORD_MATRIX.find(c => c.tool === 'compress200kb' && c.lang === 'en');

  if (!config) return null;

  return (
    <div className="w-full flex flex-col items-center gap-16 py-12 font-mono">
      
      {/* SECTION 1: Technical Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-emerald-400 mb-6 uppercase tracking-wider">
          {"[ " + config.h1 + " ]"}
        </h2>
        <div className="bg-black/50 border border-emerald-500/30 rounded-xl p-6 text-emerald-50/80 leading-relaxed">
           <span className="text-emerald-500 mr-2">&gt;</span> {config.citationFirst}
        </div>
      </section>

      {/* SECTION 2: Data Comparison Table */}
      {config.extraSectionTitle && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
          <div className="mb-8 flex items-center gap-3">
             <Database className="w-6 h-6 text-emerald-400" />
             <h3 className="text-2xl font-bold text-white uppercase">{config.extraSectionTitle}</h3>
          </div>
          <p className="text-zinc-400 mb-8">{config.extraSectionDesc}</p>
          
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-900 border-b border-zinc-800">
                  <th className="p-4 text-zinc-300 font-semibold uppercase text-sm">Target Size</th>
                  <th className="p-4 text-zinc-300 font-semibold uppercase text-sm">Best Use Case</th>
                  <th className="p-4 text-zinc-300 font-semibold uppercase text-sm">Quality Retention</th>
                </tr>
              </thead>
              <tbody className="bg-black">
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4 text-emerald-400 font-bold border-r border-zinc-800/50">200KB</td>
                  <td className="p-4 text-zinc-400">{(config.extraSectionItems || [])?.[0]?.split(':')[1] || "Blogs & Forums"}</td>
                  <td className="p-4 text-zinc-400 flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500"/> Excellent</td>
                </tr>
                <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4 text-amber-400 font-bold border-r border-zinc-800/50">100KB</td>
                  <td className="p-4 text-zinc-400">{(config.extraSectionItems || [])?.[1]?.split(':')[1] || "App Forms"}</td>
                  <td className="p-4 text-zinc-400 flex items-center gap-2"><Check className="w-4 h-4 text-amber-500"/> Good</td>
                </tr>
                <tr className="hover:bg-zinc-900/30 transition-colors">
                  <td className="p-4 text-red-400 font-bold border-r border-zinc-800/50">50KB</td>
                  <td className="p-4 text-zinc-400">{(config.extraSectionItems || [])?.[2]?.split(':')[1] || "Gov IDs"}</td>
                  <td className="p-4 text-zinc-400 flex items-center gap-2"><Check className="w-4 h-4 text-red-500"/> Acceptable</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* SECTION 3: How We Retain Quality */}
      {config.extraSection2Title && (
        <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full mb-12">
          <div className="bg-emerald-900/10 border border-emerald-500/20 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
               <Server className="w-32 h-32 text-emerald-500/50" />
            </div>
            <div className="md:w-2/3">
               <h3 className="text-2xl font-bold text-white mb-3">{config.extraSection2Title}</h3>
               <p className="text-emerald-400 mb-6">{config.extraSection2Desc}</p>
               <ul className="space-y-3">
                 {(config.extraSection2Items || [])?.map((item, idx) => (
                    <li key={idx} className="flex gap-3 text-zinc-300">
                      <TerminalSquare className="w-5 h-5 text-emerald-500 shrink-0" />
                      {item}
                    </li>
                 ))}
               </ul>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: Server Logs / FAQ style */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
         <div className="bg-[#0a0a0a] rounded-xl border border-zinc-800 p-1">
            <div className="bg-zinc-900 rounded-t-lg p-3 flex gap-2 border-b border-zinc-800">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-amber-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="p-6 space-y-6">
              {config.faqs?.map((faq, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-emerald-400 flex gap-2">
                    <span className="opacity-50">~</span>
                    <span className="opacity-50">$</span>
                    <span className="font-semibold">{faq.question}</span>
                  </div>
                  <div className="text-zinc-400 pl-6 border-l-2 border-zinc-800">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
         </div>
      </section>

    </div>
  );
}
