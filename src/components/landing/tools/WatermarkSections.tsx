import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { ShieldAlert, Layers, SlidersHorizontal, Grid, Fingerprint, Upload, Save } from 'lucide-react';

export const WatermarkSections: React.FC = () => {
  const { t } = useTranslation();
  // Using direct flat keys that we will inject
  const tr = (key: string, def: string = '') => t(`landing.watermark.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-32 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / ASYMMETRIC LAYOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#EC4899]/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-dark-600 shadow-xl shadow-dark-900/50 group hover:border-[#8B5CF6]/50 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] text-white">
                <Fingerprint className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold tracking-wide bg-gradient-to-r from-slate-200 to-slate-400 bg-clip-text text-transparent uppercase font-mono">
                {tr('heroBadge', 'BRAND PROTECTION')}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black leading-[1.1]">
              <span className="block">{tr('heroTitle', 'Protect Your Work.')}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F43F5E] block mt-2">
                {tr('heroTitle2', 'Build Your Identity.')}
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {tr('heroDesc', 'Apply highly customizable watermarks to protect your intellectual property. Add text or logo overlays with precise control over opacity, positioning, and blending modes.')}
            </p>
          </div>

          <div className="flex-1 w-full relative z-10">
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-dark-800/50 border border-dark-600 backdrop-blur-xl p-4 shadow-2xl flex items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-[#EC4899]/5" />
              
              {/* Abstract Representation of Watermarking */}
              <div className="relative w-full h-full bg-dark-900 rounded-3xl overflow-hidden border border-dark-700">
                {/* Background "Photo" */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#05DAED]/20 rounded-full blur-3xl" />
                
                {/* Watermark Layer interacting with hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-80 transition-opacity duration-700 transform group-hover:scale-110">
                   <div className="text-4xl md:text-6xl font-black text-white transform -rotate-45 tracking-widest opacity-50 select-none">
                     CONFIDENTIAL
                   </div>
                </div>
                
                {/* Tiled Watermark Grid Effect */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-8 p-8 opacity-0 group-hover:opacity-20 transition-opacity duration-1000 delay-300">
                   {[...Array(9)].map((_, i) => (
                     <div key={i} className="flex items-center justify-center text-white/50 text-xl font-bold transform -rotate-15">
                       LOGO
                     </div>
                   ))}
                </div>
              </div>

              {/* Floating UI Badges */}
              <div className="absolute top-8 -right-4 glass-panel px-6 py-4 rounded-2xl border border-[#8B5CF6]/30 shadow-lg shadow-[#8B5CF6]/20 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
                    <SlidersHorizontal className="w-5 h-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Opacity: 45%</div>
                    <div className="text-xs text-slate-400">Soft Blend</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAYERED GLASS CARDS FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent -z-10 hidden md:block transform -translate-y-1/2" />
          
          <div className="glass-panel p-8 md:p-10 rounded-[2rem] border-dark-600/50 hover:border-[#8B5CF6]/50 transition-colors transform hover:-translate-y-2 duration-300 bg-dark-900/80">
            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6] mb-8 border border-[#8B5CF6]/20">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-4">{tr('feat1Title', 'Non-Destructive Layering')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat1Desc', 'Add multiple watermark layers without altering your original image data. Easy to position, scale, and rotate.')}</p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-[2rem] border-dark-600/50 hover:border-[#EC4899]/50 transition-colors transform md:translate-y-8 hover:translate-y-6 duration-300 bg-dark-900/80 shadow-[0_0_40px_rgba(236,72,153,0.1)] relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899] mb-8 border border-[#EC4899]/20">
              <SlidersHorizontal className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-4">{tr('feat2Title', 'Opacity & Blending')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat2Desc', 'Fine-tune the transparency of your text or logo. Choose advanced blending modes to make your watermark subtle yet impossible to remove.')}</p>
          </div>

          <div className="glass-panel p-8 md:p-10 rounded-[2rem] border-dark-600/50 hover:border-[#F43F5E]/50 transition-colors transform hover:-translate-y-2 duration-300 bg-dark-900/80">
            <div className="w-14 h-14 rounded-2xl bg-[#F43F5E]/10 flex items-center justify-center text-[#F43F5E] mb-8 border border-[#F43F5E]/20">
              <Grid className="w-7 h-7" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-4">{tr('feat3Title', 'Tiled Pattern Mode')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat3Desc', 'Automatically repeat your watermark across the entire image in a grid pattern. Ultimate protection against unauthorized cropping.')}</p>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-[3rem] p-10 md:p-16 border-[#8B5CF6]/20 bg-gradient-to-br from-dark-900/90 to-dark-800/90 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#EC4899]/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
          
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#8B5CF6] bg-[#8B5CF6]/10 px-3 py-1.5 rounded-full border border-[#8B5CF6]/30 block w-max mx-auto mb-4">
              {tr('stepsTag', 'WORKFLOW')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-black text-white">
              {tr('stepsTitle', 'Protect in 3 Steps')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="text-center group">
              <div className="w-24 h-24 mx-auto bg-dark-950 rounded-full border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#8B5CF6]/50 group-hover:scale-110 transition-all duration-300 shadow-xl">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-3">{tr('s1Title', 'Upload')}</h3>
              <p className="text-lg text-slate-400">{tr('s1Desc', 'Load your original photos securely into the browser.')}</p>
            </div>

            <div className="text-center group relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 -left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-[#8B5CF6]/30 to-transparent -z-10" />
              
              <div className="w-24 h-24 mx-auto bg-dark-950 rounded-full border border-[#EC4899]/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 shadow-[0_0_30px_rgba(236,72,153,0.2)]">
                <ShieldAlert className="w-10 h-10 text-[#EC4899]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-3">{tr('s2Title', 'Stamp')}</h3>
              <p className="text-lg text-slate-400">{tr('s2Desc', 'Apply your custom text or logo watermark with styling.')}</p>
            </div>

            <div className="text-center group relative">
              {/* Connecting line */}
              <div className="hidden md:block absolute top-12 -left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-[#EC4899]/30 to-transparent -z-10" />
              
              <div className="w-24 h-24 mx-auto bg-dark-950 rounded-full border border-[#F43F5E]/30 flex items-center justify-center mb-6 group-hover:border-[#F43F5E]/60 group-hover:scale-110 transition-all duration-300 shadow-xl">
                <Save className="w-10 h-10 text-[#F43F5E]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-3">{tr('s3Title', 'Export')}</h3>
              <p className="text-lg text-slate-400">{tr('s3Desc', 'Save the protected images instantly to your device.')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
