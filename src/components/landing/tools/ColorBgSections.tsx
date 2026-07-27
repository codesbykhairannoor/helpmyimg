import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Palette, Wand2, Image as ImageIcon, Focus, Monitor, LayoutGrid, Droplet, Download, Lock } from 'lucide-react';

export const ColorBgSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.color.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-32 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / VIBRANT SPLIT LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#05DAED]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#12DA91]/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-600 shadow-xl shadow-dark-900/50 group hover:border-[#05DAED]/50 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900">
                <Palette className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                {tr('heroBadge', 'INSTANT COLOR STUDIO')}
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl sm:lg:font-heading font-black bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 leading-tight">
              {tr('heroTitle', 'Transform Background Colors in Real-Time')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {tr('heroDesc', 'Apply solid colors, smooth gradients, or custom hex codes instantly. Perfect for product photography and profile pictures, powered entirely on your browser.')}
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 perspective-1000">
            {/* Visual Color Palette Representation */}
            <div className="grid grid-cols-2 grid-rows-2 gap-4 aspect-square sm:aspect-[4/3] lg:aspect-square transform-gpu rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
              <div className="bg-[#05DAED] rounded-3xl shadow-[0_0_30px_rgba(5,218,237,0.3)] flex items-center justify-center p-8 group overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                 <span className="text-dark-900 font-mono font-bold text-2xl relative z-10">#05DAED</span>
              </div>
              <div className="bg-[#12DA91] rounded-3xl shadow-[0_0_30px_rgba(18,218,145,0.3)] flex items-center justify-center p-8 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-bl from-white/20 to-transparent" />
                 <span className="text-dark-900 font-mono font-bold text-2xl relative z-10">#12DA91</span>
              </div>
              <div className="bg-[#FF3366] rounded-3xl shadow-[0_0_30px_rgba(255,51,102,0.3)] flex items-center justify-center p-8 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent" />
                 <span className="text-white font-mono font-bold text-2xl relative z-10">#FF3366</span>
              </div>
              <div className="bg-dark-800 rounded-3xl border border-dark-600 flex flex-col items-center justify-center p-8 gap-4 overflow-hidden relative group">
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-bg-pan" />
                 <Wand2 className="w-10 h-10 text-slate-400 group-hover:text-white transition-colors relative z-10" />
                 <span className="text-slate-400 font-mono font-bold group-hover:text-white transition-colors relative z-10">CUSTOM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - ASYMMETRIC BENTO BOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]">
          {/* Big Feature */}
          <div className="md:col-span-8 glass-panel p-10 sm:p-12 rounded-[2.5rem] border-dark-600/30 hover:border-[#05DAED]/40 transition-colors flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#05DAED]/20 to-transparent blur-3xl rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 w-3/4">
              <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] mb-8">
                <Palette className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 font-heading">{tr('feat1Title', 'Infinite Color Canvas')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat1Desc', 'Choose from our curated palette of conversion-optimized colors, or enter any HEX/RGB code to perfectly match your brand identity.')}</p>
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-4 glass-panel p-10 rounded-[2.5rem] border-dark-600/30 hover:border-[#12DA91]/40 transition-colors flex flex-col justify-between">
            <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91]">
              <Focus className="w-7 h-7" />
            </div>
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 font-heading">{tr('feat2Title', 'Edge Smoothing')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat2Desc', 'Colors naturally blend with your subject edges, avoiding harsh pixelated halos.')}</p>
            </div>
          </div>

          {/* Small Feature 2 */}
          <div className="md:col-span-4 glass-panel p-10 rounded-[2.5rem] border-dark-600/30 hover:border-[#05DAED]/40 transition-colors flex flex-col justify-between">
            <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED]">
              <Monitor className="w-7 h-7" />
            </div>
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 font-heading">{tr('feat3Title', 'Live Preview')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat3Desc', 'See color changes instantly without waiting for reloads or server processing.')}</p>
            </div>
          </div>

          {/* Medium Feature */}
          <div className="md:col-span-8 glass-panel p-10 sm:p-12 rounded-[2.5rem] border-dark-600/30 hover:border-[#12DA91]/40 transition-colors flex flex-col justify-end relative overflow-hidden group">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#12DA91]/20 to-transparent blur-3xl rounded-full transform translate-x-1/3 translate-y-1/3 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 w-3/4">
              <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] mb-8">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 font-heading">{tr('feat4Title', '100% Private Sandbox')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat4Desc', 'The color manipulation is rendered directly on your local device\'s Canvas API. Zero network requests mean zero privacy risks.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* USE CASES - CLEAN CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
            {tr('whoTag', 'PROFESSIONAL USES')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
            {tr('whoTitle', 'Built for Visual Creators')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-800/80 rounded-[2rem] p-8 border border-dark-600 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-[#12DA91]/20 to-[#05DAED]/20 border border-[#12DA91]/30 text-[#12DA91] rounded-2xl flex items-center justify-center mb-6">
              <LayoutGrid className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 font-heading">{tr('who1Title', 'E-Commerce Catalogs')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('who1Desc', 'Standardize product backgrounds with pure white or brand-specific hex codes for consistent store listings.')}</p>
          </div>
          
          <div className="bg-dark-800/80 rounded-[2rem] p-8 border border-dark-600 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-[#05DAED]/20 to-[#FF3366]/20 border border-[#05DAED]/30 text-[#05DAED] rounded-2xl flex items-center justify-center mb-6">
              <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 font-heading">{tr('who2Title', 'Profile Portraits')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('who2Desc', 'Instantly add vibrant, eye-catching backgrounds to LinkedIn, Twitter, or corporate headshots.')}</p>
          </div>

          <div className="bg-dark-800/80 rounded-[2rem] p-8 border border-dark-600 hover:-translate-y-2 transition-transform duration-300">
            <div className="w-14 h-14 bg-gradient-to-br from-[#FF3366]/20 to-[#12DA91]/20 border border-[#FF3366]/30 text-[#FF3366] rounded-2xl flex items-center justify-center mb-6">
              <Droplet className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 font-heading">{tr('who3Title', 'Marketing Materials')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('who3Desc', 'Prepare transparent assets by applying solid chroma key greens or matching ad campaign palettes.')}</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - MINIMAL TIMELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-12 rounded-[3rem] border-dark-600/30">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
              {tr('stepsTitle', 'Colorize in 3 Steps')}
            </h2>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
            <div className="flex-1 text-center group">
              <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#05DAED]/50 transition-colors">
                <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#05DAED] transition-colors" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2 font-heading">{tr('s1Title', 'Upload Image')}</h3>
              <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Ensure your image has a transparent background first.')}</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

            <div className="flex-1 text-center group">
              <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#05DAED]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
                <Palette className="w-8 h-8 text-[#05DAED]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2 font-heading">{tr('s2Title', 'Pick a Color')}</h3>
              <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Use the color picker or enter your custom HEX code.')}</p>
            </div>

            <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

            <div className="flex-1 text-center group">
              <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)]">
                <Download className="w-8 h-8 text-[#12DA91]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2 font-heading">{tr('s3Title', 'Export')}</h3>
              <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Download your newly colored image in full resolution.')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
