import React from 'react';
import { SystemArchitecture } from '../SystemArchitecture';
import { useTranslation } from '../../../context/LanguageContext';
import { Crop, Move, Scissors, Grid3X3, Image as ImageIcon, Crosshair, Download } from 'lucide-react';

export const CropSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.crop.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
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

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'HOW TO CROP')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
            {tr('stepsTitle', 'Perfect Framing in Seconds')}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-16 relative z-10">
          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)] group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-8 h-8 text-[#12DA91]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3">{tr('s1Title', 'Upload Photo')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Drag and drop your image into the workspace.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#05DAED]/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)] group-hover:scale-110 transition-transform duration-300">
              <Crosshair className="w-8 h-8 text-[#05DAED]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3">{tr('s2Title', 'Drag the Box')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Use the corner handles to adjust the crop area.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/50 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)] group-hover:scale-110 transition-transform duration-300">
              <Download className="w-8 h-8 text-[#12DA91]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3">{tr('s3Title', 'Apply & Save')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Hit crop and download your extracted image.')}</p>
          </div>
        </div>
      </section>

    
      <SystemArchitecture variant="cards" />
    </div>
  );
};
