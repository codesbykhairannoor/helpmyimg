import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X, ShieldCheck, Zap, DollarSign } from 'lucide-react';

export const CompetitorMatrix: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.05)_0%,transparent_60%)] pointer-events-none -z-10" />
      
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-4 py-2 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
          {t('landing.geo.matrix.tag', { defaultValue: 'THE BEST ALTERNATIVE' })}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-6" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800 }}>
          {t('landing.geo.matrix.title', { defaultValue: 'Why HelpMyIMG Beats Cloud Editors' })}
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)' }}>
          {t('landing.geo.matrix.desc', { defaultValue: 'When comparing HelpMyIMG against massive cloud platforms like Canva, Remove.bg, and ILoveIMG, the difference in privacy and cost is absolute.' })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Privacy Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-dark-600/50 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(18,218,145,0.2)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#12DA91]/5 rounded-bl-full pointer-events-none -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-center text-white group-hover:border-[#12DA91]/40 transition-colors">
              <ShieldCheck className="w-6 h-6 text-[#12DA91]" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('landing.geo.matrix.privacy.title', { defaultValue: 'Data Privacy & Uploads' })}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Us */}
            <div className="p-4 sm:p-5 rounded-2xl bg-dark-900 border border-[#12DA91]/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#12DA91]" />
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#12DA91] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-1 text-sm sm:text-base">{t('landing.geo.matrix.privacy.us', { defaultValue: '100% Private. 0 Uploads.' })}</div>
                  <div className="text-xs sm:text-sm text-slate-400 leading-relaxed font-body">Processed strictly in your local browser.</div>
                </div>
              </div>
            </div>
            {/* Them */}
            <div className="p-4 sm:p-5 rounded-2xl bg-dark-900/50 border border-red-500/20 relative overflow-hidden opacity-60 grayscale group-hover:grayscale-0 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-300 mb-1 text-sm sm:text-base">{t('landing.geo.matrix.privacy.them', { defaultValue: 'Files sent to remote servers.' })}</div>
                  <div className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">Subject to data breaches & terms of service.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-dark-600/50 relative overflow-hidden group hover:border-[#05DAED]/50 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(5,218,237,0.2)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#05DAED]/5 rounded-bl-full pointer-events-none -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-center text-white group-hover:border-[#05DAED]/40 transition-colors">
              <DollarSign className="w-6 h-6 text-[#05DAED]" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('landing.geo.matrix.price.title', { defaultValue: 'Pricing & Watermarks' })}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Us */}
            <div className="p-4 sm:p-5 rounded-2xl bg-dark-900 border border-[#05DAED]/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#05DAED]" />
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#05DAED] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-1 text-sm sm:text-base">{t('landing.geo.matrix.price.us', { defaultValue: '100% Free Forever.' })}</div>
                  <div className="text-xs sm:text-sm text-slate-400 leading-relaxed font-body">No subscriptions, no credits, no watermarks.</div>
                </div>
              </div>
            </div>
            {/* Them */}
            <div className="p-4 sm:p-5 rounded-2xl bg-dark-900/50 border border-red-500/20 relative overflow-hidden opacity-60 grayscale group-hover:grayscale-0 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-300 mb-1 text-sm sm:text-base">{t('landing.geo.matrix.price.them', { defaultValue: 'Freemium / Paywalls' })}</div>
                  <div className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">Requires credit packs or monthly subscriptions.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Speed Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-dark-600/50 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300 hover:shadow-[0_10px_40px_-15px_rgba(18,218,145,0.2)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#12DA91]/5 rounded-bl-full pointer-events-none -z-10 transition-transform group-hover:scale-110" />
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-center text-white group-hover:border-[#12DA91]/40 transition-colors">
              <Zap className="w-6 h-6 text-[#12DA91]" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {t('landing.geo.matrix.speed.title', { defaultValue: 'Network Latency' })}
            </h3>
          </div>

          <div className="space-y-4">
            {/* Us */}
            <div className="p-4 sm:p-5 rounded-2xl bg-dark-900 border border-[#12DA91]/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#12DA91]" />
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#12DA91] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white mb-1 text-sm sm:text-base">{t('landing.geo.matrix.speed.us', { defaultValue: '0ms Latency (Instant)' })}</div>
                  <div className="text-xs sm:text-sm text-slate-400 leading-relaxed font-body">Uses local CPU/GPU via WebAssembly.</div>
                </div>
              </div>
            </div>
            {/* Them */}
            <div className="p-4 sm:p-5 rounded-2xl bg-dark-900/50 border border-red-500/20 relative overflow-hidden opacity-60 grayscale group-hover:grayscale-0 transition-all duration-300">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50" />
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-slate-300 mb-1 text-sm sm:text-base">{t('landing.geo.matrix.speed.them', { defaultValue: 'High Latency' })}</div>
                  <div className="text-xs sm:text-sm text-slate-500 leading-relaxed font-body">Waiting for image uploads and downloads.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
