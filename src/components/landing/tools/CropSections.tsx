import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Crop, Move, Scissors, Grid3X3, Image as ImageIcon, Crosshair, Download, Lock, Zap, Sparkles } from 'lucide-react';

export const CropSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.crop.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-32 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / FOCUS THEME (CENTERED) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-3xl flex items-center justify-center -z-10 opacity-30">
          <div className="w-full aspect-video border-[1px] border-dark-600 rounded-3xl relative">
            <div className="absolute top-1/3 left-0 w-full h-[1px] bg-dark-600" />
            <div className="absolute top-2/3 left-0 w-full h-[1px] bg-dark-600" />
            <div className="absolute top-0 left-1/3 w-[1px] h-full bg-dark-600" />
            <div className="absolute top-0 left-2/3 w-[1px] h-full bg-dark-600" />
            <div className="absolute -inset-4 border-2 border-[#12DA91] rounded-[2rem] opacity-50" />
            <div className="absolute -inset-8 border border-[#05DAED] rounded-[2.5rem] opacity-20" />
          </div>
        </div>

        <div className="text-center max-w-4xl mx-auto space-y-8 z-10 pt-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-600 shadow-xl shadow-dark-900/50 hover:border-[#12DA91]/50 transition-colors">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#12DA91] to-[#05DAED] text-dark-900">
              <Crop className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {tr('heroBadge', 'SMART COMPOSITION')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black leading-[1.1]">
            {tr('heroTitle', 'Crop Out the Noise.')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#12DA91] to-[#05DAED]">{tr('heroTitle2', 'Focus on What Matters.')}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {tr('heroDesc', 'Frame your photos perfectly with freeform or fixed-ratio cropping. Cut out unwanted elements and improve image composition in seconds.')}
          </p>
        </div>
      </section>

      {/* 3 VERTICAL CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="glass-panel p-8 sm:p-10 rounded-t-[3rem] rounded-b-3xl border-dark-600/30 hover:border-[#05DAED]/50 transition-colors h-full flex flex-col group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#05DAED]/20 to-transparent blur-2xl rounded-full" />
            <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] mb-8 relative z-10">
              <Move className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 relative z-10">{tr('feat1Title', 'Freeform Selection')}</h3>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed flex-1 relative z-10">{tr('feat1Desc', 'Drag the crop box edges freely to frame your subject exactly the way you want without any dimension restrictions.')}</p>
          </div>

          <div className="glass-panel p-8 sm:p-10 rounded-3xl border-dark-600/30 hover:border-[#12DA91]/50 transition-colors h-full flex flex-col group relative overflow-hidden transform md:-translate-y-8">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-b from-[#12DA91]/20 to-transparent blur-2xl rounded-full" />
            <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] mb-8 relative z-10 mx-auto">
              <Grid3X3 className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 relative z-10 text-center">{tr('feat2Title', 'Fixed Aspect Ratios')}</h3>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed flex-1 relative z-10 text-center">{tr('feat2Desc', 'Need a perfect square? Or a 16:9 thumbnail? Lock the crop aspect ratio to maintain exact proportions effortlessly.')}</p>
          </div>

          <div className="glass-panel p-8 sm:p-10 rounded-b-[3rem] rounded-t-3xl border-dark-600/30 hover:border-[#05DAED]/50 transition-colors h-full flex flex-col group relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-[#05DAED]/20 to-transparent blur-2xl rounded-full" />
            <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] mb-8 relative z-10">
              <Scissors className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 relative z-10">{tr('feat3Title', 'Lossless Extraction')}</h3>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed flex-1 relative z-10">{tr('feat3Desc', 'When you crop an image, we extract the pixels natively ensuring there is absolutely zero compression or quality loss in the process.')}</p>
          </div>
        </div>
      </section>

      {/* VERTICAL TIMELINE WORKFLOW */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'HOW TO CROP')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
            {tr('stepsTitle', 'Perfect Framing in Seconds')}
          </h2>
        </div>

        <div className="relative pl-8 sm:pl-0">
          {/* Glowing Vertical Line */}
          <div className="absolute left-8 sm:left-1/2 top-0 bottom-0 w-[2px] bg-dark-600 sm:-translate-x-1/2">
             <div className="absolute top-0 w-full h-1/2 bg-gradient-to-b from-[#12DA91] to-[#05DAED] animate-pulse" />
          </div>

          <div className="space-y-16">
            <div className="relative sm:flex items-center justify-between group">
              <div className="sm:w-5/12 text-left sm:text-right pr-0 sm:pr-12">
                <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3">{tr('s1Title', 'Upload Photo')}</h3>
                <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Drag and drop your image into the workspace.')}</p>
              </div>
              <div className="absolute left-[-42px] sm:left-1/2 w-12 h-12 rounded-full bg-dark-900 border-2 border-[#12DA91] flex items-center justify-center sm:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(18,218,145,0.4)]">
                <ImageIcon className="w-5 h-5 text-[#12DA91]" />
              </div>
              <div className="sm:w-5/12 pl-0 sm:pl-12 mt-6 sm:mt-0 hidden sm:block">
                <div className="h-24 bg-dark-800 rounded-2xl border border-dark-600 opacity-50" />
              </div>
            </div>

            <div className="relative sm:flex items-center justify-between group flex-row-reverse">
              <div className="sm:w-5/12 text-left pl-0 sm:pl-12">
                <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3">{tr('s2Title', 'Drag the Box')}</h3>
                <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Use the corner handles to adjust the crop area.')}</p>
              </div>
              <div className="absolute left-[-42px] sm:left-1/2 w-12 h-12 rounded-full bg-dark-900 border-2 border-[#05DAED] flex items-center justify-center sm:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(5,218,237,0.4)]">
                <Crosshair className="w-5 h-5 text-[#05DAED]" />
              </div>
              <div className="sm:w-5/12 pr-0 sm:pr-12 mt-6 sm:mt-0 hidden sm:block">
                 <div className="h-24 bg-dark-800 rounded-2xl border border-[#05DAED]/30 relative flex items-center justify-center opacity-80">
                    <div className="w-16 h-12 border border-dashed border-[#05DAED]" />
                 </div>
              </div>
            </div>

            <div className="relative sm:flex items-center justify-between group">
              <div className="sm:w-5/12 text-left sm:text-right pr-0 sm:pr-12">
                <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3">{tr('s3Title', 'Apply & Save')}</h3>
                <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Hit crop and download your extracted image.')}</p>
              </div>
              <div className="absolute left-[-42px] sm:left-1/2 w-12 h-12 rounded-full bg-dark-900 border-2 border-[#12DA91] flex items-center justify-center sm:-translate-x-1/2 z-10 shadow-[0_0_15px_rgba(18,218,145,0.4)]">
                <Download className="w-5 h-5 text-[#12DA91]" />
              </div>
              <div className="sm:w-5/12 pl-0 sm:pl-12 mt-6 sm:mt-0 hidden sm:block">
                <div className="h-24 bg-dark-800 rounded-2xl border border-dark-600 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE - FLEXING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {t('landing.flex.tag', { defaultValue: 'SYSTEM ARCHITECTURE' })}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black leading-tight">
            {t('landing.flex.title', { defaultValue: 'Engineered for Extreme Privacy & Millisecond Performance' })}
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mt-6 max-w-2xl mx-auto">
            {t('landing.flex.desc', { defaultValue: 'We don\'t rely on slow cloud servers. HelpMyIMG utilizes next-generation WebAssembly to run complex AI algorithms directly inside your browser memory.' })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-800/40 p-8 rounded-3xl border border-[#05DAED]/20 hover:border-[#05DAED]/50 transition-colors group">
            <div className="w-12 h-12 bg-[#05DAED]/10 text-[#05DAED] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t('landing.flex.c1.title', { defaultValue: 'Local AI Processing' })}</h3>
            <p className="text-slate-400">{t('landing.flex.c1.desc', { defaultValue: 'Your sensitive files never touch our servers. All AI operations are executed locally on your device for 100% privacy.' })}</p>
          </div>

          <div className="bg-dark-800/40 p-8 rounded-3xl border border-[#05DAED]/20 hover:border-[#05DAED]/50 transition-colors group">
            <div className="w-12 h-12 bg-[#05DAED]/10 text-[#05DAED] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t('landing.flex.c2.title', { defaultValue: '0ms Network Latency' })}</h3>
            <p className="text-slate-400">{t('landing.flex.c2.desc', { defaultValue: 'Skip the upload and download wait times. Processing begins the exact millisecond you drag and drop your photos.' })}</p>
          </div>

          <div className="bg-dark-800/40 p-8 rounded-3xl border border-[#12DA91]/20 hover:border-[#12DA91]/50 transition-colors group">
            <div className="w-12 h-12 bg-[#12DA91]/10 text-[#12DA91] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{t('landing.flex.c3.title', { defaultValue: 'WebAssembly Powered' })}</h3>
            <p className="text-slate-400">{t('landing.flex.c3.desc', { defaultValue: 'Leveraging ultra-fast WASM binaries, HelpMyIMG matches the performance of native desktop applications inside the web browser.' })}</p>
          </div>
        </div>
      </section>

    </div>
  );
};
