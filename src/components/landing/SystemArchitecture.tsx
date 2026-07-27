import React from 'react';
import { useTranslation } from 'react-i18next';
import { Lock, Zap, Sparkles } from 'lucide-react';

interface SystemArchitectureProps {
  variant?: 'grid' | 'bento' | 'split' | 'minimal' | 'cards' | 'list';
}

export const SystemArchitecture: React.FC<SystemArchitectureProps> = ({ variant = 'grid' }) => {
  const { t } = useTranslation();

  const headerTag = t('landing.flex.tag', { defaultValue: 'SYSTEM ARCHITECTURE' });
  const headerTitle = t('landing.flex.title', { defaultValue: 'Engineered for Extreme Privacy & Millisecond Performance' });
  const headerDesc = t('landing.flex.desc', { defaultValue: 'We don\'t rely on slow cloud servers. HelpMyIMG utilizes next-generation WebAssembly to run complex AI algorithms directly inside your browser memory.' });

  const c1Title = t('landing.flex.c1.title', { defaultValue: 'Local AI Processing' });
  const c1Desc = t('landing.flex.c1.desc', { defaultValue: 'Your sensitive files never touch our servers. All AI operations are executed locally on your device for 100% privacy.' });

  const c2Title = t('landing.flex.c2.title', { defaultValue: '0ms Network Latency' });
  const c2Desc = t('landing.flex.c2.desc', { defaultValue: 'Skip the upload and download wait times. Processing begins the exact millisecond you drag and drop your photos.' });

  const c3Title = t('landing.flex.c3.title', { defaultValue: 'WebAssembly Powered' });
  const c3Desc = t('landing.flex.c3.desc', { defaultValue: 'Leveraging ultra-fast WASM binaries, HelpMyIMG matches the performance of native desktop applications inside the web browser.' });

  const HeaderText = () => (
    <>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
        {headerTag}
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white font-heading">
        {headerTitle}
      </h2>
      <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mt-6 max-w-2xl mx-auto">
        {headerDesc}
      </p>
    </>
  );

  const HeaderTextLeft = () => (
    <>
      <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mb-4">
        {headerTag}
      </span>
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-white font-heading">
        {headerTitle}
      </h2>
      <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mt-6 max-w-xl">
        {headerDesc}
      </p>
    </>
  );

  if (variant === 'bento') {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <HeaderText />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Large Hero Card */}
          <div className="bg-gradient-to-br from-[#05DAED]/10 to-transparent p-10 rounded-[2.5rem] border border-[#05DAED]/30 hover:border-[#05DAED]/60 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#05DAED]/20 blur-3xl -z-10 rounded-full" />
            <div className="w-16 h-16 bg-[#05DAED]/20 text-[#05DAED] rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">{c1Title}</h3>
            <p className="text-xl text-slate-300 leading-relaxed">{c1Desc}</p>
          </div>
          {/* Stacked Small Cards */}
          <div className="flex flex-col gap-6">
            <div className="bg-dark-800/60 p-8 rounded-[2rem] border border-white/5 hover:border-[#12DA91]/40 transition-colors group flex-1 flex flex-col justify-center">
              <div className="w-12 h-12 bg-[#12DA91]/10 text-[#12DA91] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{c2Title}</h3>
              <p className="text-slate-400">{c2Desc}</p>
            </div>
            <div className="bg-dark-800/60 p-8 rounded-[2rem] border border-white/5 hover:border-[#8B5CF6]/40 transition-colors group flex-1 flex flex-col justify-center">
              <div className="w-12 h-12 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{c3Title}</h3>
              <p className="text-slate-400">{c3Desc}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'split') {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <HeaderTextLeft />
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-6 bg-dark-800/40 p-6 rounded-3xl border border-white/5 hover:bg-dark-800/80 transition-colors">
              <div className="w-14 h-14 shrink-0 bg-[#05DAED]/10 text-[#05DAED] rounded-2xl flex items-center justify-center">
                <Lock className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{c1Title}</h3>
                <p className="text-slate-400">{c1Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-6 bg-dark-800/40 p-6 rounded-3xl border border-white/5 hover:bg-dark-800/80 transition-colors">
              <div className="w-14 h-14 shrink-0 bg-[#12DA91]/10 text-[#12DA91] rounded-2xl flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{c2Title}</h3>
                <p className="text-slate-400">{c2Desc}</p>
              </div>
            </div>
            <div className="flex items-start gap-6 bg-dark-800/40 p-6 rounded-3xl border border-white/5 hover:bg-dark-800/80 transition-colors">
              <div className="w-14 h-14 shrink-0 bg-[#8B5CF6]/10 text-[#8B5CF6] rounded-2xl flex items-center justify-center">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">{c3Title}</h3>
                <p className="text-slate-400">{c3Desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'list') {
    return (
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-20 px-4">
          <HeaderText />
        </div>
        <div className="space-y-12">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#05DAED]/20 to-transparent rounded-full flex items-center justify-center border border-[#05DAED]/30 shadow-[0_0_30px_rgba(5,218,237,0.15)] relative">
                <Lock className="w-12 h-12 text-[#05DAED]" />
                <div className="absolute inset-0 bg-[#05DAED]/10 blur-xl rounded-full" />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">{c1Title}</h3>
              <p className="text-lg text-slate-400">{c1Desc}</p>
            </div>
          </div>
          {/* Row 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-10">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#12DA91]/20 to-transparent rounded-full flex items-center justify-center border border-[#12DA91]/30 shadow-[0_0_30px_rgba(18,218,145,0.15)] relative">
                <Zap className="w-12 h-12 text-[#12DA91]" />
                <div className="absolute inset-0 bg-[#12DA91]/10 blur-xl rounded-full" />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-right">
              <h3 className="text-2xl font-bold text-white mb-4">{c2Title}</h3>
              <p className="text-lg text-slate-400">{c2Desc}</p>
            </div>
          </div>
          {/* Row 3 */}
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent rounded-full flex items-center justify-center border border-[#8B5CF6]/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative">
                <Sparkles className="w-12 h-12 text-[#8B5CF6]" />
                <div className="absolute inset-0 bg-[#8B5CF6]/10 blur-xl rounded-full" />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-4">{c3Title}</h3>
              <p className="text-lg text-slate-400">{c3Desc}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'minimal') {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <HeaderText />
        </div>
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-16">
          <div className="w-full sm:w-[45%] lg:w-[30%] text-center">
            <Lock className="w-10 h-10 text-[#05DAED] mx-auto mb-5 drop-shadow-[0_0_15px_rgba(5,218,237,0.5)]" />
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">{c1Title}</h3>
            <div className="h-0.5 w-12 bg-[#05DAED]/50 mx-auto mb-4" />
            <p className="text-slate-400 leading-relaxed">{c1Desc}</p>
          </div>
          <div className="w-full sm:w-[45%] lg:w-[30%] text-center">
            <Zap className="w-10 h-10 text-[#12DA91] mx-auto mb-5 drop-shadow-[0_0_15px_rgba(18,218,145,0.5)]" />
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">{c2Title}</h3>
            <div className="h-0.5 w-12 bg-[#12DA91]/50 mx-auto mb-4" />
            <p className="text-slate-400 leading-relaxed">{c2Desc}</p>
          </div>
          <div className="w-full sm:w-[45%] lg:w-[30%] text-center">
            <Sparkles className="w-10 h-10 text-[#8B5CF6] mx-auto mb-5 drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
            <h3 className="text-xl font-bold text-white mb-3 tracking-wide uppercase text-sm">{c3Title}</h3>
            <div className="h-0.5 w-12 bg-[#8B5CF6]/50 mx-auto mb-4" />
            <p className="text-slate-400 leading-relaxed">{c3Desc}</p>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'cards') {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 py-16 bg-dark-800/20 border-y border-white/5 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-64 bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.05)_0%,transparent_60%)] pointer-events-none -z-10" />
        
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <HeaderText />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          <div className="bg-dark-900 shadow-xl rounded-2xl p-8 border-t-[3px] border-t-[#05DAED] hover:-translate-y-2 transition-transform duration-300">
            <Lock className="w-8 h-8 text-[#05DAED] mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">{c1Title}</h3>
            <p className="text-slate-400 leading-relaxed">{c1Desc}</p>
          </div>
          <div className="bg-dark-900 shadow-xl rounded-2xl p-8 border-t-[3px] border-t-[#12DA91] hover:-translate-y-2 transition-transform duration-300 delay-100">
            <Zap className="w-8 h-8 text-[#12DA91] mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">{c2Title}</h3>
            <p className="text-slate-400 leading-relaxed">{c2Desc}</p>
          </div>
          <div className="bg-dark-900 shadow-xl rounded-2xl p-8 border-t-[3px] border-t-[#8B5CF6] hover:-translate-y-2 transition-transform duration-300 delay-200">
            <Sparkles className="w-8 h-8 text-[#8B5CF6] mb-6" />
            <h3 className="text-xl font-bold text-white mb-4">{c3Title}</h3>
            <p className="text-slate-400 leading-relaxed">{c3Desc}</p>
          </div>
        </div>
      </section>
    );
  }

  // Default 'grid'
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
      <div className="text-center max-w-3xl mx-auto mb-16 px-4">
        <HeaderText />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-800/40 p-8 rounded-3xl border border-[#05DAED]/20 hover:border-[#05DAED]/50 transition-colors group">
          <div className="w-12 h-12 bg-[#05DAED]/10 text-[#05DAED] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{c1Title}</h3>
          <p className="text-slate-400">{c1Desc}</p>
        </div>

        <div className="bg-dark-800/40 p-8 rounded-3xl border border-[#05DAED]/20 hover:border-[#05DAED]/50 transition-colors group">
          <div className="w-12 h-12 bg-[#05DAED]/10 text-[#05DAED] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{c2Title}</h3>
          <p className="text-slate-400">{c2Desc}</p>
        </div>

        <div className="bg-dark-800/40 p-8 rounded-3xl border border-[#12DA91]/20 hover:border-[#12DA91]/50 transition-colors group">
          <div className="w-12 h-12 bg-[#12DA91]/10 text-[#12DA91] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">{c3Title}</h3>
          <p className="text-slate-400">{c3Desc}</p>
        </div>
      </div>
    </section>
  );
};
