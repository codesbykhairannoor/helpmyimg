// src/components/landing/tools/BrushSections.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Brush, Eraser, Undo2, Focus, Palette, Target, MousePointer2, Layers } from 'lucide-react';

export const BrushSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.brush.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-24 lg:space-y-32 py-16 text-slate-100 overflow-hidden">
      
      {/* 1. CINEMATIC CENTERED HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pt-12 pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        
        <div className="text-center max-w-4xl mx-auto space-y-8 z-10 relative">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 font-mono text-sm font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(217,70,239,0.2)]">
            <Target className="w-5 h-5" />
            {tr('heroBadge', 'PIXEL-PERFECT CONTROL')}
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-fuchsia-100 to-fuchsia-400">
            {tr('heroTitle', 'Master Your Edges with the Magic Refinement Brush')}
          </h2>
          
          <p className="text-xl text-slate-400 leading-relaxed max-w-3xl mx-auto font-light">
            {tr('heroDesc', 'AI gets it right 99% of the time. For that remaining 1%, use our manual Erase and Restore brushes to craft flawless cutouts directly in your browser.')}
          </p>

          {/* Interactive Hero Visual */}
          <div className="mt-16 relative w-full aspect-[21/9] rounded-[3rem] overflow-hidden border border-dark-600 shadow-2xl bg-dark-900 group">
            <div className="absolute inset-0 checkerboard-bg opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent z-10" />
            
            {/* Mockup UI Interface inside the Hero */}
            <div className="absolute inset-x-8 bottom-8 top-8 bg-dark-800/80 backdrop-blur-xl rounded-3xl border border-dark-600 shadow-2xl overflow-hidden flex flex-col z-20 transition-transform duration-700 group-hover:scale-[1.02]">
              {/* Toolbar */}
              <div className="h-16 border-b border-dark-600 bg-dark-900/50 flex items-center px-6 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="mx-auto flex gap-4 bg-dark-950 p-1.5 rounded-xl border border-dark-700">
                  <div className="px-4 py-2 bg-fuchsia-500/20 text-fuchsia-400 rounded-lg flex items-center gap-2 font-medium">
                    <Eraser className="w-4 h-4" /> ERASE
                  </div>
                  <div className="px-4 py-2 text-slate-400 hover:bg-dark-700 rounded-lg flex items-center gap-2 font-medium">
                    <Undo2 className="w-4 h-4" /> RESTORE
                  </div>
                </div>
              </div>
              {/* Canvas Area */}
              <div className="flex-1 relative flex items-center justify-center">
                <div className="absolute inset-0 checkerboard-bg opacity-50" />
                <MousePointer2 className="absolute top-1/3 left-1/3 w-12 h-12 text-white fill-fuchsia-500 -rotate-12 z-30 drop-shadow-2xl animate-bounce" />
                <div className="w-64 h-64 bg-fuchsia-500/20 rounded-full blur-xl absolute top-1/4 left-1/4" />
                <div className="z-10 text-center space-y-4">
                   <div className="w-32 h-32 mx-auto bg-dark-900 border-4 border-dashed border-fuchsia-500/50 rounded-full flex items-center justify-center">
                      <Brush className="w-12 h-12 text-fuchsia-400" />
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BENTO BOX FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h3 className="text-3xl font-bold font-heading mb-4 text-white">Precision at your Fingertips</h3>
            <p className="text-slate-400">Everything you need to manually perfect your images.</p>
         </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Main Wide Bento Item */}
          <div className="lg:col-span-2 glass-panel p-10 rounded-[2.5rem] border-dark-600/30 hover:border-red-500/50 transition-all duration-500 group relative overflow-hidden flex flex-col justify-end">
            <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
               <Eraser className="w-48 h-48 text-red-500 -rotate-12" />
            </div>
            <div className="relative z-10 w-2/3">
               <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 block w-max mb-6 rounded-full border border-red-500/30">{tr('feat1Badge', 'ERASE TOOL')}</span>
               <h3 className="text-3xl font-bold font-heading mb-4">{tr('feat1Title', 'Clean Up Stubborn Artifacts')}</h3>
               <p className="text-slate-400 leading-relaxed text-lg">{tr('feat1Desc', 'Notice a speck of background that the AI missed? Simply paint over it to permanently erase it from your composition.')}</p>
            </div>
          </div>

          {/* Tall Bento Item */}
          <div className="lg:row-span-2 glass-panel p-10 rounded-[2.5rem] border-dark-600/30 hover:border-fuchsia-500/50 transition-all duration-500 group flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 to-transparent z-0" />
            <div className="relative z-10 space-y-6">
               <div className="w-24 h-24 mx-auto rounded-[2rem] bg-dark-800 border-2 border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-6 shadow-[0_0_30px_rgba(217,70,239,0.2)] group-hover:scale-110 transition-transform">
               <Focus className="w-12 h-12" />
               </div>
               <span className="text-xs font-mono font-bold uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 block w-max mx-auto rounded-full border border-fuchsia-500/30">{tr('feat3Badge', 'ADJUSTABLE')}</span>
               <h3 className="text-2xl font-bold font-heading">{tr('feat3Title', 'Dynamic Brush Sizing')}</h3>
               <p className="text-slate-400 leading-relaxed">{tr('feat3Desc', 'Scale your brush size from a massive block for large area cleanups down to a tiny point for pixel-perfect edge refinement.')}</p>
            </div>
          </div>

          {/* Standard Bento Item */}
          <div className="lg:col-span-2 glass-panel p-10 rounded-[2.5rem] border-dark-600/30 hover:border-green-500/50 transition-all duration-500 group flex items-center gap-8 relative overflow-hidden">
            <div className="flex-1 z-10">
               <span className="text-xs font-mono font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1 block w-max mb-4 rounded-full border border-green-500/30">{tr('feat2Badge', 'RESTORE TOOL')}</span>
               <h3 className="text-2xl font-bold font-heading mb-4">{tr('feat2Title', 'Bring Back Missing Details')}</h3>
               <p className="text-slate-400 leading-relaxed">{tr('feat2Desc', 'Did the AI accidentally remove a piece of clothing or hair? Use the restore brush to magically bring those pixels back from the original image.')}</p>
            </div>
            <div className="hidden sm:flex w-32 h-32 rounded-full bg-green-500/10 border border-green-500/30 items-center justify-center text-green-400 relative z-10 group-hover:rotate-180 transition-transform duration-700">
               <Undo2 className="w-16 h-16" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. ZIG-ZAG ALTERNATING USE CASES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
         
         {/* Row 1 */}
         <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
            <div className="flex-1 w-full relative">
               <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-dark-800 to-dark-900 border border-dark-700 shadow-2xl flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 checkerboard-bg opacity-20" />
                  <Palette className="w-32 h-32 text-fuchsia-500 opacity-50 group-hover:scale-125 transition-transform duration-700" />
               </div>
            </div>
            <div className="flex-1 space-y-6">
               <span className="text-xs font-mono font-bold uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1.5 rounded-full border border-fuchsia-500/30 block w-max">
                  {tr('whoTag', 'PROFESSIONAL TOUCH')}
               </span>
               <h3 className="text-4xl font-extrabold leading-tight font-heading">{tr('case1Title', 'E-commerce Products')}</h3>
               <p className="text-xl text-slate-400 leading-relaxed">
                  {tr('case1Desc', 'Product photos often have shadows or reflections that AI might confuse. Use the magic brush to ensure your product edges are exceptionally clean before publishing to your store.')}
               </p>
            </div>
         </div>

         {/* Row 2 */}
         <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
            <div className="flex-1 w-full relative">
               <div className="aspect-square rounded-[3rem] bg-gradient-to-bl from-dark-800 to-dark-900 border border-dark-700 shadow-2xl flex items-center justify-center overflow-hidden group">
                  <div className="absolute inset-0 checkerboard-bg opacity-20" />
                  <Layers className="w-32 h-32 text-purple-500 opacity-50 group-hover:scale-125 transition-transform duration-700" />
               </div>
            </div>
            <div className="flex-1 space-y-6">
               <span className="text-xs font-mono font-bold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/30 block w-max">
                  {tr('whoTag', 'PROFESSIONAL TOUCH')}
               </span>
               <h3 className="text-4xl font-extrabold leading-tight font-heading">{tr('case2Title', 'Complex Hair & Fur')}</h3>
               <p className="text-xl text-slate-400 leading-relaxed">
                  {tr('case2Desc', 'While our AI is trained on millions of hair patterns, extremely chaotic backgrounds can trick it. The restore brush lets you paint back fine strands of hair perfectly.')}
               </p>
            </div>
         </div>

      </section>

          </div>
  );
};
