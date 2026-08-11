import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, ShieldAlert, ShieldCheck } from 'lucide-react';

export const CompetitorMatrix: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.05)_0%,transparent_60%)] pointer-events-none -z-10" />
      
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
          {t('landing.geo.matrix.tag', { defaultValue: 'THE BEST ALTERNATIVE' })}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-6">
          {t('landing.geo.matrix.title', { defaultValue: 'Why HelpMyIMG Beats Cloud Editors' })}
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed font-body">
          {t('landing.geo.matrix.desc', { defaultValue: 'When comparing HelpMyIMG against massive cloud platforms like Canva, Remove.bg, and ILoveIMG, the difference in privacy and cost is absolute.' })}
        </p>
      </div>

      <div className="w-full max-w-[100vw] overflow-x-auto pb-8 sm:px-0 hide-scrollbar">
        <div className="min-w-[650px] md:min-w-[800px] w-full glass-panel rounded-2xl md:rounded-3xl border border-dark-600/50 overflow-hidden shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-800/80 border-b border-dark-600">
                <th className="p-4 md:p-6 text-slate-400 font-mono text-xs md:text-sm uppercase tracking-wider w-1/4">Feature</th>
                <th className="p-4 md:p-6 border-l border-dark-600/50 bg-[#05DAED]/5 relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#05DAED]" />
                  <span className="text-white font-black text-lg md:text-xl flex items-center gap-2">
                    <img src="/logobaru.png" alt="HelpMyIMG" className="w-5 h-5 md:w-6 md:h-6" />
                    HelpMyIMG
                  </span>
                </th>
                <th className="p-4 md:p-6 border-l border-dark-600/50 text-slate-400 font-bold text-base md:text-lg">
                  {t('landing.geo.matrix.cloud', { defaultValue: 'Cloud Editors (Canva, Remove.bg)' })}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-600/50">
              
              {/* Privacy Row */}
              <tr className="hover:bg-dark-800/30 transition-colors">
                <td className="p-4 md:p-6 font-bold text-white text-sm md:text-base flex items-center gap-2 md:gap-3">
                  <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-[#12DA91] shrink-0" />
                  {t('landing.geo.matrix.privacy.title', { defaultValue: 'Data Privacy & Uploads' })}
                </td>
                <td className="p-4 md:p-6 border-l border-dark-600/50 bg-[#05DAED]/5">
                  <div className="flex items-center gap-2 text-[#12DA91] font-bold text-sm md:text-base">
                    <Check className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    {t('landing.geo.matrix.privacy.us', { defaultValue: '100% Private. 0 Uploads.' })}
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-1 font-body leading-snug">Processed strictly in your local browser.</p>
                </td>
                <td className="p-4 md:p-6 border-l border-dark-600/50">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm md:text-base">
                    <ShieldAlert className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    {t('landing.geo.matrix.privacy.them', { defaultValue: 'Files sent to remote servers.' })}
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1 font-body leading-snug">Subject to data breaches & terms of service.</p>
                </td>
              </tr>

              {/* Cost Row */}
              <tr className="hover:bg-dark-800/30 transition-colors">
                <td className="p-4 md:p-6 font-bold text-white text-sm md:text-base">
                  {t('landing.geo.matrix.price.title', { defaultValue: 'Pricing & Watermarks' })}
                </td>
                <td className="p-4 md:p-6 border-l border-dark-600/50 bg-[#05DAED]/5">
                  <div className="flex items-center gap-2 text-[#05DAED] font-bold text-sm md:text-base">
                    <Check className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    {t('landing.geo.matrix.price.us', { defaultValue: '100% Free Forever.' })}
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-1 font-body leading-snug">No subscriptions, no credits, no watermarks.</p>
                </td>
                <td className="p-4 md:p-6 border-l border-dark-600/50">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm md:text-base">
                    <X className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                    {t('landing.geo.matrix.price.them', { defaultValue: 'Freemium / Paywalls' })}
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1 font-body leading-snug">Requires credit packs or monthly subscriptions.</p>
                </td>
              </tr>

              {/* Speed Row */}
              <tr className="hover:bg-dark-800/30 transition-colors">
                <td className="p-4 md:p-6 font-bold text-white text-sm md:text-base">
                  {t('landing.geo.matrix.speed.title', { defaultValue: 'Network Latency' })}
                </td>
                <td className="p-4 md:p-6 border-l border-dark-600/50 bg-[#05DAED]/5">
                  <div className="flex items-center gap-2 text-white font-bold text-sm md:text-base">
                    <Check className="w-4 h-4 md:w-5 md:h-5 text-[#12DA91] shrink-0" />
                    {t('landing.geo.matrix.speed.us', { defaultValue: '0ms Latency (Instant)' })}
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-400 mt-1 md:mt-1 font-body leading-snug">Uses local CPU/GPU via WebAssembly.</p>
                </td>
                <td className="p-4 md:p-6 border-l border-dark-600/50">
                  <div className="flex items-center gap-2 text-slate-400 font-bold text-sm md:text-base">
                    <X className="w-4 h-4 md:w-5 md:h-5 text-red-400 shrink-0" />
                    {t('landing.geo.matrix.speed.them', { defaultValue: 'High Latency' })}
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1 font-body leading-snug">Waiting for image uploads and downloads.</p>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
