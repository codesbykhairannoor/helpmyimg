import React from 'react';
import { SystemArchitecture } from '../SystemArchitecture';
import { useTranslation } from '../../../context/LanguageContext';
import { Maximize, Layers, Unlock, Share2, Globe, MonitorSmartphone, Download, Image as ImageIcon } from 'lucide-react';

export const ResizeSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.resize.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-32 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / PRECISION THEME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Technical grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(5,218,237,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(5,218,237,0.03)_1px,transparent_1px)] bg-[size:40px_40px] -z-10 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-600 shadow-xl shadow-dark-900/50 group hover:border-[#05DAED]/50 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900">
                <Maximize className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                {tr('heroBadge', 'PIXEL-PERFECT SCALING')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black leading-tight">
              {tr('heroTitle', 'Resize Images with Absolute Precision')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {tr('heroDesc', 'Scale your photos by exact pixel dimensions or percentages. Perfect for social media, websites, and printing without compromising quality.')}
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 flex justify-center">
            {/* Visual Bounding Box */}
            <div className="relative w-72 h-72 sm:w-96 sm:h-96">
              {/* Outer box */}
              <div className="absolute inset-0 border-2 border-dashed border-slate-600 rounded-3xl" />
              {/* Animated Inner box */}
              <div className="absolute inset-8 border-2 border-[#05DAED] rounded-2xl bg-[#05DAED]/10 backdrop-blur-sm flex items-center justify-center animate-pulse shadow-[0_0_50px_rgba(5,218,237,0.2)]">
                <div className="flex flex-col items-center">
                  <span className="text-[#05DAED] font-mono text-xl font-bold tracking-widest">1920</span>
                  <span className="text-slate-400 text-xs mt-1">x 1080 px</span>
                </div>
              </div>
              {/* Corner nodes */}
              <div className="absolute top-6 left-6 w-4 h-4 bg-white rounded-full shadow-lg" />
              <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full shadow-lg" />
              <div className="absolute bottom-6 left-6 w-4 h-4 bg-white rounded-full shadow-lg" />
              <div className="absolute bottom-6 right-6 w-4 h-4 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ZIG ZAG FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Block 1 */}
        <div className="flex flex-col md:flex-row items-center gap-12 group">
          <div className="flex-1 order-2 md:order-1">
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:lg:mb-6">
              <span className="text-[#05DAED] mr-4">01.</span>{tr('feat1Title', 'Exact Pixel Dimensions')}
            </h3>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-6">
              {tr('feat1Desc', 'Take full control over your image size. Input specific width and height values in pixels to meet strict platform requirements.')}
            </p>
            <ul className="space-y-3 font-mono text-sm text-slate-300">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#05DAED]" /> {tr('feat1Li1', 'Lock aspect ratio')}</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#05DAED]" /> {tr('feat1Li2', 'Custom width & height')}</li>
            </ul>
          </div>
          <div className="flex-1 order-1 md:order-2 w-full">
            <div className="aspect-video rounded-3xl bg-dark-800 border border-dark-600 p-8 flex items-center justify-center relative overflow-hidden group-hover:border-[#05DAED]/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#05DAED]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex gap-4 items-center">
                <div className="bg-dark-900 rounded-xl p-4 border border-dark-700 text-center w-24">
                  <span className="text-xs text-slate-500 block mb-1">WIDTH</span>
                  <span className="text-white font-mono font-bold">1200</span>
                </div>
                <Unlock className="w-5 h-5 text-slate-500" />
                <div className="bg-dark-900 rounded-xl p-4 border border-dark-700 text-center w-24">
                  <span className="text-xs text-slate-500 block mb-1">HEIGHT</span>
                  <span className="text-white font-mono font-bold">630</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Block 2 */}
        <div className="flex flex-col md:flex-row items-center gap-12 group">
          <div className="flex-1 order-1 w-full">
            <div className="aspect-video rounded-3xl bg-dark-800 border border-dark-600 p-8 flex items-center justify-center relative overflow-hidden group-hover:border-[#12DA91]/50 transition-colors">
              <div className="absolute inset-0 bg-gradient-to-tl from-[#12DA91]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Layers className="w-20 h-20 text-[#12DA91]" />
            </div>
          </div>
          <div className="flex-1 order-2">
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:lg:mb-6">
              <span className="text-[#12DA91] mr-4">02.</span>{tr('feat2Title', 'Percentage Scaling')}
            </h3>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-6">
              {tr('feat2Desc', 'Need it twice as large or half the size? Use the percentage slider to quickly scale images up or down proportionally.')}
            </p>
            <ul className="space-y-3 font-mono text-sm text-slate-300">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#12DA91]" /> {tr('feat2Li1', 'Quick 50% / 200% buttons')}</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#12DA91]" /> {tr('feat2Li2', 'Maintains visual quality')}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PLATFORM READY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel p-10 sm:p-14 rounded-[3rem] border-dark-600/30">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
              {tr('socialTitle', 'Perfect for Every Platform')}
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 mt-4">{tr('socialDesc', 'Meet strict upload requirements for social media without hassle.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-dark-900 rounded-3xl p-8 border border-dark-700 hover:border-[#05DAED]/50 transition-colors text-center">
              <MonitorSmartphone className="w-10 h-10 text-pink-500 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Instagram</h4>
              <p className="text-sm font-mono text-[#05DAED]">1080 x 1080 px</p>
            </div>
            <div className="bg-dark-900 rounded-3xl p-8 border border-dark-700 hover:border-[#05DAED]/50 transition-colors text-center">
              <Share2 className="w-10 h-10 text-blue-400 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Twitter</h4>
              <p className="text-sm font-mono text-[#05DAED]">1200 x 675 px</p>
            </div>
            <div className="bg-dark-900 rounded-3xl p-8 border border-dark-700 hover:border-[#05DAED]/50 transition-colors text-center">
              <Globe className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h4 className="text-white font-bold mb-2">Facebook</h4>
              <p className="text-sm font-mono text-[#05DAED]">1200 x 630 px</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'HOW IT WORKS')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
            {tr('stepsTitle', 'Resize in 3 Steps')}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center items-start">
          <div className="flex-1 text-center group">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#12DA91]/50 transition-colors">
              <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#12DA91] transition-colors" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s1Title', 'Upload Images')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Drop up to 10 photos into the tool.')}</p>
          </div>

          <div className="flex-1 text-center group">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#05DAED]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
              <Maximize className="w-8 h-8 text-[#05DAED]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s2Title', 'Set Dimensions')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Input your target width and height.')}</p>
          </div>

          <div className="flex-1 text-center group">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)]">
              <Download className="w-8 h-8 text-[#12DA91]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s3Title', 'Save')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Download the resized photos instantly.')}</p>
          </div>
        </div>
      </section>

    
      <SystemArchitecture variant="grid" />
    </div>
  );
};
