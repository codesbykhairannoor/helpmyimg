import React from 'react';
import { SystemArchitecture } from '../SystemArchitecture';
import { useTranslation } from '../../../context/LanguageContext';
import { Wand2, Type, Square, Layers, Download, Move, Palette } from 'lucide-react';

export const DesignSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.design.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / CREATIVE STUDIO THEME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6]/5 to-transparent -z-10 rounded-3xl" />
        
        <div className="text-center max-w-4xl mx-auto space-y-8 z-10 pt-8 pb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-600 shadow-xl shadow-dark-900/50 hover:border-[#8B5CF6]/50 transition-colors">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white">
              <Wand2 className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              {tr('heroBadge', 'CREATIVE SUITE')}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black leading-tight">
            {tr('heroTitle', 'Design Beautiful Visuals.')}<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]">{tr('heroTitle2', 'Right in Your Browser.')}</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {tr('heroDesc', 'A full-featured image editor packed with professional filters, text tools, shapes, and drawing capabilities. No software installation required.')}
          </p>
        </div>

        {/* Massive Central Mockup */}
        <div className="relative max-w-5xl mx-auto perspective-1000">
          <div className="w-full aspect-[16/9] bg-dark-900 border border-dark-600 rounded-3xl shadow-2xl shadow-[#8B5CF6]/20 overflow-hidden transform-gpu rotate-x-[2deg] hover:rotate-x-0 transition-transform duration-700">
            {/* Fake toolbar top */}
            <div className="h-12 border-b border-dark-700 bg-dark-800/80 flex items-center px-4 gap-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1" />
              <div className="flex gap-4 text-slate-400">
                <Type className="w-4 h-4" />
                <Square className="w-4 h-4" />
                <Layers className="w-4 h-4" />
              </div>
            </div>
            {/* Fake workspace */}
            <div className="flex h-full">
              {/* Fake left sidebar */}
              <div className="w-16 border-r border-dark-700 bg-dark-800/50 flex flex-col items-center py-4 gap-6 text-slate-500">
                <Move className="w-5 h-5 text-white" />
                <Type className="w-5 h-5" />
                <Square className="w-5 h-5" />
                <Palette className="w-5 h-5" />
              </div>
              {/* Fake canvas area */}
              <div className="flex-1 bg-dark-950 flex items-center justify-center p-8">
                <div className="w-full h-full bg-dark-800 border-2 border-dashed border-dark-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/20 to-[#EC4899]/20" />
                   <div className="text-white font-heading font-black text-4xl transform -rotate-12">DESIGN MODE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MASONRY GRID FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(280px,auto)]">
          {/* Big Feature */}
          <div className="md:col-span-8 glass-panel p-10 sm:p-12 rounded-[2.5rem] border-dark-600/30 hover:border-[#8B5CF6]/40 transition-colors flex flex-col justify-end relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#8B5CF6]/20 to-transparent  rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 w-3/4">
              <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] mb-8">
                <Type className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 font-heading">{tr('feat1Title', 'Rich Typography')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat1Desc', 'Add custom text layers, choose from hundreds of web fonts, and style them with strokes, shadows, and gradients for maximum impact.')}</p>
            </div>
          </div>

          {/* Small Feature 1 */}
          <div className="md:col-span-4 glass-panel p-10 rounded-[2.5rem] border-dark-600/30 hover:border-[#EC4899]/40 transition-colors flex flex-col justify-between">
            <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-[#EC4899]/30 flex items-center justify-center text-[#EC4899]">
              <Palette className="w-7 h-7" />
            </div>
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 font-heading">{tr('feat2Title', 'Pro Filters')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat2Desc', 'Apply cinematic color grading and professional adjustments natively.')}</p>
            </div>
          </div>

          {/* Small Feature 2 */}
          <div className="md:col-span-4 glass-panel p-10 rounded-[2.5rem] border-dark-600/30 hover:border-[#05DAED]/40 transition-colors flex flex-col justify-between">
            <div className="w-14 h-14 rounded-2xl bg-dark-900 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED]">
              <Square className="w-7 h-7" />
            </div>
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-3 font-heading">{tr('feat3Title', 'Vector Shapes')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat3Desc', 'Draw geometric shapes, arrows, and borders with precision.')}</p>
            </div>
          </div>

          {/* Medium Feature */}
          <div className="md:col-span-8 glass-panel p-10 sm:p-12 rounded-[2.5rem] border-dark-600/30 hover:border-[#12DA91]/40 transition-colors flex flex-col justify-end relative overflow-hidden group">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#12DA91]/20 to-transparent  rounded-full transform translate-x-1/3 translate-y-1/3 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10 w-3/4">
              <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] mb-8">
                <Layers className="w-8 h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 font-heading">{tr('feat4Title', 'Layer Management')}</h3>
              <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat4Desc', 'Organize complex designs effortlessly. Stack, group, hide, and lock multiple layers to create intricate compositions without losing control.')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B5CF6] bg-[#8B5CF6]/10 px-3 py-1.5 rounded-full border border-[#8B5CF6]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'WORKFLOW')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
            {tr('stepsTitle', 'Create in 3 Steps')}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-16">
          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#8B5CF6]/50 transition-colors">
              <Wand2 className="w-8 h-8 text-slate-400 group-hover:text-[#8B5CF6] transition-colors" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s1Title', 'Start Canvas')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Open a blank canvas or import a photo.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#EC4899]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(236,72,153,0.2)]">
              <Palette className="w-8 h-8 text-[#EC4899]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s2Title', 'Design')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Add text, graphics, and apply filters.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#05DAED]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
              <Download className="w-8 h-8 text-[#05DAED]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s3Title', 'Export')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Download the final masterpiece.')}</p>
          </div>
        </div>
      </section>

    
      <SystemArchitecture variant="list" />
    </div>
  );
};
