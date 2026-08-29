// src/components/landing/tools/RemoveBgSections.tsx
import { useTranslation } from '../../../context/LanguageContext';
import { Wand2, Image as ImageIcon, Sparkles, Scissors, Lock, Focus, ShoppingBag, Palette, Download } from 'lucide-react';

export const RemoveBgSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.remove.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / WHY SECTION - MAGIC THEME */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#05DAED]/10 rounded-full  -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#12DA91]/10 rounded-full  -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12DA91]/10 border border-[#12DA91]/30 text-[#12DA91] font-mono text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              {tr('heroBadge', 'AI POWERED CUTOUT')}
            </div>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('heroTitle', 'Remove Background in 1 Second with Flawless Precision')}
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Powered by advanced WebAssembly AI, get perfect hair cutouts and smooth edges without ever uploading your photos to a server.')}
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-md lg:max-w-none relative z-10">
            {/* Visual Representation of Before/After */}
            <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-dark-600/50 shadow-2xl group">
              <div className="absolute inset-0 bg-dark-800 checkerboard-bg" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg relative transform group-hover:scale-110 transition-transform duration-700">
                  <span className="text-6xl sm:text-8xl">👩‍🎤</span>
                  {/* Magic Wand Animation */}
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-dark-900 rounded-full flex items-center justify-center border-2 border-[#05DAED] text-[#05DAED] shadow-[0_0_15px_rgba(5,218,237,0.5)] animate-bounce">
                    <Wand2 className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - GRID LIST */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-10 rounded-[2rem] border-dark-600/30 hover:border-[#05DAED]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(5,218,237,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] mb-6">
              <Scissors className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">{tr('feat1Badge', '99.8% ACCURACY')}</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 font-heading">{tr('feat1Title', 'Flawless Hair & Edge Detection')}</h3>
            <p className="font-body text-slate-400 leading-relaxed">{tr('feat1Desc', 'Our neural network easily handles complex details like human hair, animal fur, and semi-transparent objects.')}</p>
          </div>

          <div className="glass-panel p-10 rounded-[2rem] border-dark-600/30 hover:border-[#12DA91]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(18,218,145,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] mb-6">
              <Lock className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#12DA91]/30">{tr('feat2Badge', '100% SECURE')}</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 font-heading">{tr('feat2Title', 'Complete Offline Privacy')}</h3>
            <p className="font-body text-slate-400 leading-relaxed">{tr('feat2Desc', 'The AI model loads directly into your browser. Your images never leave your computer, ensuring total data security.')}</p>
          </div>

          <div className="glass-panel p-10 rounded-[2rem] border-dark-600/30 hover:border-[#05DAED]/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(5,218,237,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] mb-6">
              <Focus className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">{tr('feat3Badge', 'BATCH MODE')}</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 font-heading">{tr('feat3Title', 'Bulk Processing Ready')}</h3>
            <p className="font-body text-slate-400 leading-relaxed">{tr('feat3Desc', 'Drag and drop up to 10 photos at once. Process them simultaneously and download everything in a neat ZIP file.')}</p>
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR - SPLIT CARDS */}
      <section className="max-w-7xl mx-auto w-full bg-dark-900/50 rounded-[3rem] border border-dark-700/50 relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
            {tr('whoTag', 'WHO IS IT FOR')}
          </span>
          <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            {tr('whoTitle', 'Perfect for Every Creative Needs')}
          </h2>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
            {tr('whoDesc', 'Whether you are selling cars, designing posters, or creating official documents.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-8">
          <div className="bg-dark-800/80 rounded-[2.5rem] p-8 sm:p-12 border border-dark-600 flex flex-col justify-between group hover:bg-dark-800 transition-colors">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-[#12DA91]/80 to-[#05DAED]/80 rounded-3xl flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('who1Title', 'E-Commerce Sellers')}</h3>
              <p className="font-body text-slate-400 text-lg leading-relaxed mb-8">{tr('who1Desc', 'Create clean white backgrounds for product listings.')}</p>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-dark-900 border border-[#12DA91]/30 text-sm text-[#12DA91] font-mono self-start">
              {tr('who1Tags', 'PRODUCT LISTING')}
            </div>
          </div>

          <div className="bg-dark-800/80 rounded-[2.5rem] p-8 sm:p-12 border border-dark-600 flex flex-col justify-between group hover:bg-dark-800 transition-colors">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-[#05DAED]/80 to-[#12DA91]/80 rounded-3xl flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <Palette className="w-10 h-10" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('who2Title', 'Graphic Designers')}</h3>
              <p className="font-body text-slate-400 text-lg leading-relaxed mb-8">{tr('who2Desc', 'Extract logos, signatures, and assets instantly.')}</p>
            </div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-dark-900 border border-[#05DAED]/30 text-sm text-[#05DAED] font-mono self-start">
              {tr('who2Tags', 'DESIGN ASSETS')}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - HORIZONTAL TIMELINE */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'HOW IT WORKS')}
          </span>
          <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            {tr('stepsTitle', '3 Steps to Transparent Backgrounds')}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative mt-8 md:mt-16">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-transparent via-dark-500 to-transparent z-0" />
          
          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-24 h-24 mx-auto bg-dark-800 rounded-full border-4 border-dark-700 flex items-center justify-center mb-6 shadow-xl hover:border-[#05DAED]/50 transition-colors">
              <ImageIcon className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-2">{tr('s1Title', 'Upload Image')}</h3>
            <p className="font-body text-slate-400">{tr('s1Desc', 'Drag & drop your photo. PNG, JPG, or WEBP.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-24 h-24 mx-auto bg-dark-800 rounded-full border-4 border-[#05DAED] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(5,218,237,0.4)]">
              <Wand2 className="w-10 h-10 text-[#05DAED]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-2">{tr('s2Title', 'AI Processing')}</h3>
            <p className="font-body text-slate-400">{tr('s2Desc', 'The local WASM AI detects the main subject in 1 second.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-24 h-24 mx-auto bg-dark-800 rounded-full border-4 border-[#12DA91] flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(18,218,145,0.4)]">
              <Download className="w-10 h-10 text-[#12DA91]" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-2">{tr('s3Title', 'Download HD')}</h3>
            <p className="font-body text-slate-400">{tr('s3Desc', 'Export your cut-out photo with a transparent background.')}</p>
          </div>
        </div>
      </section>

    
          </div>
  );
};
