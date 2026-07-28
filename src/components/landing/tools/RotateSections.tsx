import React from 'react';
import { SystemArchitecture } from '../SystemArchitecture';
import { useTranslation } from '../../../context/LanguageContext';
import { RotateCw, FlipHorizontal, FlipVertical, Image as ImageIcon, Download, SlidersHorizontal, MousePointerClick } from 'lucide-react';

export const RotateSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.rotate.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / SPATIAL CONTROL THEME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#05DAED]/5 to-[#12DA91]/5 rounded-full blur-[100px] -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-600 shadow-xl shadow-dark-900/50 hover:border-[#12DA91]/50 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900">
                <RotateCw className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {tr('heroBadge', 'SPATIAL CONTROL')}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black leading-tight">
              {tr('heroTitle', 'Rotate and Flip.')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#05DAED] to-[#12DA91]">{tr('heroTitle2', 'Perfect Orientation.')}</span>
            </h2>
            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {tr('heroDesc', 'Correct sideways photos, create mirror effects, and fine-tune image rotation by exact degrees. Fast, free, and done entirely in your browser.')}
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 perspective-1000 flex justify-center">
            {/* 3D Animated Rotating Card */}
            <div className="relative w-64 h-80 sm:w-80 sm:h-96 transform-gpu animate-[spin_10s_linear_infinite] [transform-style:preserve-3d]">
              {/* Front Face */}
              <div className="absolute inset-0 bg-dark-800 border-2 border-[#05DAED] rounded-3xl p-4 [backface-visibility:hidden] shadow-[0_0_50px_rgba(5,218,237,0.2)] flex flex-col">
                <div className="flex-1 bg-dark-900 rounded-2xl flex items-center justify-center border border-dark-600 overflow-hidden relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                   <RotateCw className="w-16 h-16 text-white relative z-10 drop-shadow-2xl" />
                </div>
                <div className="h-16 flex items-center justify-center gap-4 mt-4">
                  <div className="w-8 h-8 rounded-full bg-dark-700" />
                  <div className="w-24 h-2 bg-dark-700 rounded-full" />
                </div>
              </div>
              {/* Back Face */}
              <div className="absolute inset-0 bg-dark-800 border-2 border-[#12DA91] rounded-3xl p-4 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-[0_0_50px_rgba(18,218,145,0.2)] flex flex-col">
                 <div className="flex-1 bg-dark-900 rounded-2xl flex items-center justify-center border border-dark-600 overflow-hidden relative transform scale-x-[-1]">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
                   <FlipHorizontal className="w-16 h-16 text-white relative z-10 drop-shadow-2xl transform scale-x-[-1]" />
                </div>
                <div className="h-16 flex items-center justify-center gap-4 mt-4">
                  <div className="w-24 h-2 bg-dark-700 rounded-full" />
                  <div className="w-8 h-8 rounded-full bg-dark-700" />
                </div>
              </div>
            </div>
            {/* Axis Ring UI Overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-dashed border-[#05DAED]/30 rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* OVERLAPPING FLEX BLOCKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Block 1: 90 Degree Steps */}
        <div className="flex flex-col md:flex-row items-center gap-8 group">
          <div className="flex-1 relative z-10">
            <div className="bg-dark-800/80 p-10 sm:p-12 rounded-[3rem] border border-dark-600 backdrop-blur-xl shadow-2xl relative md:-mr-12 group-hover:border-[#05DAED]/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] mb-8">
                <RotateCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:lg:mb-6">{tr('feat1Title', 'Quick 90° Turns')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-6">
                {tr('feat1Desc', 'Fix photos taken in the wrong orientation instantly. Rotate left or right in precise 90-degree increments to snap images upright.')}
              </p>
              <div className="flex gap-4">
                 <button className="px-6 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white font-mono text-sm hover:border-[#05DAED] transition-colors">-90°</button>
                 <button className="px-6 py-3 bg-dark-900 border border-[#05DAED]/50 rounded-xl text-[#05DAED] font-mono text-sm shadow-[0_0_15px_rgba(5,218,237,0.2)] hover:bg-[#05DAED]/10 transition-colors">+90°</button>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full md:w-auto h-64 md:h-96 bg-dark-900 rounded-[3rem] border border-dark-700 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,218,237,0.1),transparent_70%)]" />
             <ImageIcon className="w-32 h-32 text-dark-700 transform rotate-90" />
          </div>
        </div>

        {/* Block 2: Mirroring */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 group">
          <div className="flex-1 relative z-10">
            <div className="bg-dark-800/80 p-10 sm:p-12 rounded-[3rem] border border-dark-600 backdrop-blur-xl shadow-2xl relative md:-ml-12 group-hover:border-[#12DA91]/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] mb-8">
                <FlipHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:lg:mb-6">{tr('feat2Title', 'Mirror Effects')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-6">
                {tr('feat2Desc', 'Flip images horizontally to fix mirrored selfies, or vertically for creative reflection effects. The transformation is applied instantly without reloading.')}
              </p>
               <div className="flex gap-4">
                 <button className="px-6 py-3 bg-dark-900 border border-[#12DA91]/50 rounded-xl text-[#12DA91] font-mono text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(18,218,145,0.2)] hover:bg-[#12DA91]/10 transition-colors"><FlipHorizontal className="w-4 h-4" /> Flip X</button>
                 <button className="px-6 py-3 bg-dark-900 border border-dark-600 rounded-xl text-white font-mono text-sm flex items-center gap-2 hover:border-[#12DA91] transition-colors"><FlipVertical className="w-4 h-4" /> Flip Y</button>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full md:w-auto h-64 md:h-96 bg-dark-900 rounded-[3rem] border border-dark-700 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,218,145,0.1),transparent_70%)]" />
             <div className="flex items-center gap-2">
               <ImageIcon className="w-24 h-24 text-dark-700" />
               <div className="w-1 h-24 bg-dark-600 rounded-full" />
               <ImageIcon className="w-24 h-24 text-[#12DA91]/20 transform scale-x-[-1]" />
             </div>
          </div>
        </div>

        {/* Block 3: Fine Tuning */}
        <div className="flex flex-col md:flex-row items-center gap-8 group">
          <div className="flex-1 relative z-10">
            <div className="bg-dark-800/80 p-10 sm:p-12 rounded-[3rem] border border-dark-600 backdrop-blur-xl shadow-2xl relative md:-mr-12 group-hover:border-[#8B5CF6]/50 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] mb-8">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:lg:mb-6">{tr('feat3Title', 'Fine-Tune Horizon')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-6">
                {tr('feat3Desc', 'Got a crooked landscape photo? Use the precise rotation slider to level the horizon by exact degrees. Auto-crops boundaries seamlessly.')}
              </p>
               <div className="bg-dark-900 rounded-2xl p-6 border border-dark-600">
                  <div className="flex justify-between text-xs text-slate-500 font-mono mb-4">
                    <span>-45°</span>
                    <span className="text-[#8B5CF6] font-bold">12°</span>
                    <span>45°</span>
                  </div>
                  <div className="h-2 bg-dark-700 rounded-full relative">
                    <div className="absolute top-0 left-1/2 h-full bg-[#8B5CF6] rounded-full w-12" />
                    <div className="absolute top-1/2 left-[calc(50%+3rem)] w-4 h-4 bg-white rounded-full -translate-y-1/2 -translate-x-1/2 shadow-lg" />
                  </div>
               </div>
            </div>
          </div>
          <div className="flex-1 w-full md:w-auto h-64 md:h-96 bg-dark-900 rounded-[3rem] border border-dark-700 relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.1),transparent_70%)]" />
             <div className="relative">
               <ImageIcon className="w-32 h-32 text-dark-700 transform rotate-12" />
               <div className="absolute top-1/2 left-[-2rem] right-[-2rem] h-[1px] bg-[#8B5CF6]/50" />
             </div>
          </div>
        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'WORKFLOW')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
            {tr('stepsTitle', 'Reorient in 3 Steps')}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-16">
          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#05DAED]/50 transition-colors">
              <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#05DAED] transition-colors" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s1Title', 'Upload')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Add the images you want to fix.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border-[#05DAED]/40 border flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
              <MousePointerClick className="w-8 h-8 text-[#05DAED]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s2Title', 'Adjust')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Use the rotate and flip buttons.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)]">
              <Download className="w-8 h-8 text-[#12DA91]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s3Title', 'Save')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Download the corrected images.')}</p>
          </div>
        </div>
      </section>

    
      <SystemArchitecture variant="minimal" />
    </div>
  );
};
