import { useTranslation } from '../../../context/LanguageContext';
import { Pipette, Search, Palette, Code2, Copy, Crosshair, Image as ImageIcon } from 'lucide-react';

export const PickerSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.picker.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / PIXEL EXTRACTION THEME */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.1)_0%,transparent_70%)] -z-10" />
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-600 shadow-xl shadow-dark-900/50 hover:border-[#05DAED]/50 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#05DAED] text-dark-900">
                <Pipette className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                {tr('heroBadge', 'PIXEL PRECISION')}
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('heroTitle', 'Extract Perfect Colors.')}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-[#05DAED]">{tr('heroTitle2', 'Build Stunning Palettes.')}</span>
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Upload an image and hover to pinpoint the exact HEX, RGB, and HSL codes of any pixel. Instantly generate harmonious color palettes for your next design project.')}
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
            {/* Visual Magnifier UI */}
            <div className="relative aspect-square sm:aspect-[4/3] bg-dark-900 rounded-[2rem] border border-dark-600 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" />
              
              {/* Fake Magnifying Glass Cursor */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-4 border-white/20 rounded-full shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-md">
                 <div className="absolute inset-0 rounded-full border border-white" />
                 <Crosshair className="w-8 h-8 text-white/50" />
                 <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-white text-dark-900 font-mono font-bold px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 whitespace-nowrap">
                   <div className="w-4 h-4 rounded-full bg-[#8B5CF6] border border-dark-900/20" />
                   #8B5CF6
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXTRACT & EXPORT GRID */}
      <section className="max-w-7xl mx-auto w-full relative space-y-6" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        
        {/* Top Split */}
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 bg-dark-800/80 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-dark-600 hover:border-[#05DAED]/50 transition-colors relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#05DAED]/10 to-transparent  rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
             <div className="relative z-10">
               <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] mb-8">
                 <Search className="w-8 h-8" />
               </div>
               <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat1Title', 'Microscopic Detail')}</h3>
               <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8">{tr('feat1Desc', 'The built-in magnifying loupe lets you zoom down to individual pixels. No more guessing which shade of blue you are clicking on.')}</p>
               <div className="flex gap-2">
                 <div className="w-8 h-8 rounded-md bg-[#05DAED]" />
                 <div className="w-8 h-8 rounded-md bg-[#05DAED]/80" />
                 <div className="w-8 h-8 rounded-md bg-[#05DAED]/60" />
                 <div className="w-8 h-8 rounded-md bg-[#05DAED]/40" />
               </div>
             </div>
          </div>

          <div className="flex-1 bg-dark-800/80 p-6 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-dark-600 hover:border-[#12DA91]/50 transition-colors relative overflow-hidden group">
             <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#12DA91]/10 to-transparent  rounded-full transform translate-x-1/2 translate-y-1/2 group-hover:scale-150 transition-transform duration-700" />
             <div className="relative z-10">
               <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] mb-8">
                 <Code2 className="w-8 h-8" />
               </div>
               <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat2Title', 'Multiple Formats')}</h3>
               <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-8">{tr('feat2Desc', 'Get your colors instantly converted into HEX, RGB, and HSL formats. Click once to copy to your clipboard and paste directly into your CSS.')}</p>
               
               <div className="space-y-3 font-mono text-xs sm:text-sm">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-dark-900 border border-dark-700 rounded-xl p-3 gap-2">
                   <span className="text-slate-500">HEX</span>
                   <span className="text-white flex items-center gap-2">#12DA91 <Copy className="w-4 h-4 text-slate-600" /></span>
                 </div>
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-dark-900 border border-dark-700 rounded-xl p-3 gap-2">
                   <span className="text-slate-500">RGB</span>
                   <span className="text-white flex items-center gap-2">rgb(18, 218, 145) <Copy className="w-4 h-4 text-slate-600" /></span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Bottom Wide Box */}
        <div className="bg-dark-800/80 p-6 sm:p-14 rounded-[2rem] sm:rounded-[3rem] border border-dark-600 hover:border-[#8B5CF6]/50 transition-colors relative overflow-hidden group">
           <div className="absolute top-1/2 left-1/2 w-full h-full bg-gradient-to-t from-[#8B5CF6]/10 to-transparent  transform -translate-x-1/2 -translate-y-1/2" />
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1">
                <div className="w-16 h-16 rounded-2xl bg-dark-900 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] mb-8">
                  <Palette className="w-8 h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat3Title', 'Auto-Generate Palettes')}</h3>
                <p className="text-lg sm:text-xl text-slate-400 leading-relaxed">{tr('feat3Desc', 'Don\'t just pick one color. Our AI algorithm analyzes your uploaded image and automatically generates a harmonious 5-color palette based on the most dominant and striking colors present.')}</p>
             </div>
             <div className="flex-1 w-full flex justify-center">
                <div className="flex w-full max-w-sm h-32 rounded-2xl overflow-hidden shadow-2xl transform-gpu rotate-2 group-hover:rotate-0 transition-transform">
                  <div className="flex-1 bg-[#05DAED] hover:flex-[1.5] transition-all duration-300 cursor-pointer" />
                  <div className="flex-1 bg-[#12DA91] hover:flex-[1.5] transition-all duration-300 cursor-pointer" />
                  <div className="flex-1 bg-[#8B5CF6] hover:flex-[1.5] transition-all duration-300 cursor-pointer" />
                  <div className="flex-1 bg-[#EC4899] hover:flex-[1.5] transition-all duration-300 cursor-pointer" />
                  <div className="flex-1 bg-[#F59E0B] hover:flex-[1.5] transition-all duration-300 cursor-pointer" />
                </div>
             </div>
           </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'WORKFLOW')}
          </span>
          <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            {tr('stepsTitle', 'Extract in 3 Steps')}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-16">
          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#05DAED]/50 transition-colors">
              <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-[#05DAED] transition-colors" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s1Title', 'Upload')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s1Desc', 'Load your reference image.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border-[#05DAED]/40 border flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(5,218,237,0.2)]">
              <Pipette className="w-8 h-8 text-[#05DAED]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s2Title', 'Pick')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s2Desc', 'Hover over any pixel and click to capture.')}</p>
          </div>

          <div className="hidden md:block w-16 h-[2px] mt-10 bg-gradient-to-r from-transparent via-dark-500 to-transparent" />

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#12DA91]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(18,218,145,0.2)]">
              <Copy className="w-8 h-8 text-[#12DA91]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-2">{tr('s3Title', 'Copy')}</h3>
            <p className="text-lg sm:text-xl text-slate-400">{tr('s3Desc', 'Copy the HEX/RGB values instantly.')}</p>
          </div>
        </div>
      </section>

    
          </div>
  );
};
