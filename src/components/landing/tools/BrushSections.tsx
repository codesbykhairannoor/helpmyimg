// src/components/landing/tools/BrushSections.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Brush, Sparkles, Eraser, Undo2, Focus, Palette, Target } from 'lucide-react';
import { SystemArchitecture } from '../SystemArchitecture';

export const BrushSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.brush.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / WHY SECTION - PRECISION THEME */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-fuchsia-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Target className="w-4 h-4" />
              {tr('heroBadge', 'PIXEL-PERFECT CONTROL')}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl sm:lg:font-heading font-extrabold leading-tight">
              {tr('heroTitle', 'Master Your Edges with the Magic Refinement Brush')}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mt-6 max-w-2xl mx-auto lg:mx-0">
              {tr('heroDesc', 'AI gets it right 99% of the time. For that remaining 1%, use our manual Erase and Restore brushes to craft flawless cutouts directly in your browser.')}
            </p>
          </div>
          
          <div className="flex-1 w-full max-w-md lg:max-w-none relative z-10">
            <div className="relative aspect-square sm:aspect-video lg:aspect-square rounded-3xl overflow-hidden border border-dark-600/50 shadow-2xl group bg-dark-800">
              <div className="absolute inset-0 checkerboard-bg opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center p-8">
                {/* Visual Representation of Brushing */}
                <div className="relative w-full h-full max-w-xs mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500 to-purple-600 rounded-2xl opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-700" />
                  <div className="relative h-full bg-dark-900 rounded-2xl border border-dark-700 p-6 flex flex-col shadow-2xl">
                    <div className="flex gap-4 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                        <Eraser className="w-6 h-6" />
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center justify-center text-green-400">
                        <Undo2 className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="flex-1 rounded-xl bg-dark-800 overflow-hidden relative border border-dark-700">
                      <div className="absolute inset-0 checkerboard-bg" />
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-fuchsia-500/20 rounded-full blur-md" />
                      <Brush className="absolute top-1/2 left-1/2 w-8 h-8 text-fuchsia-400 -translate-y-4 shadow-xl" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES - GRID LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-10 rounded-[2rem] border-dark-600/30 hover:border-red-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-red-500/30 flex items-center justify-center text-red-400 mb-6">
              <Eraser className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-red-400 bg-red-500/10 px-3 py-1 block w-max mb-4 rounded-full border border-red-500/30">{tr('feat1Badge', 'ERASE TOOL')}</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat1Title', 'Clean Up Stubborn Artifacts')}</h3>
            <p className="text-slate-400 leading-relaxed">{tr('feat1Desc', 'Notice a speck of background that the AI missed? Simply paint over it to permanently erase it from your composition.')}</p>
          </div>

          <div className="glass-panel p-10 rounded-[2rem] border-dark-600/30 hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-green-500/30 flex items-center justify-center text-green-400 mb-6">
              <Undo2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-green-400 bg-green-500/10 px-3 py-1 block w-max mb-4 rounded-full border border-green-500/30">{tr('feat2Badge', 'RESTORE TOOL')}</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat2Title', 'Bring Back Missing Details')}</h3>
            <p className="text-slate-400 leading-relaxed">{tr('feat2Desc', 'Did the AI accidentally remove a piece of clothing or hair? Use the restore brush to magically bring those pixels back from the original image.')}</p>
          </div>

          <div className="glass-panel p-10 rounded-[2rem] border-dark-600/30 hover:border-fuchsia-500/50 transition-all duration-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.15)]">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 mb-6">
              <Focus className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1 block w-max mb-4 rounded-full border border-fuchsia-500/30">{tr('feat3Badge', 'ADJUSTABLE')}</span>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat3Title', 'Dynamic Brush Sizing')}</h3>
            <p className="text-slate-400 leading-relaxed">{tr('feat3Desc', 'Scale your brush size from a massive block for large area cleanups down to a tiny point for pixel-perfect edge refinement.')}</p>
          </div>
        </div>
      </section>

      {/* USE CASES - SPLIT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-dark-900/50 py-24 rounded-[3rem] border border-dark-700/50 relative">
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-fuchsia-400 bg-fuchsia-500/10 px-3 py-1.5 rounded-full border border-fuchsia-500/30 block w-max mx-auto mb-4">
            {tr('whoTag', 'PROFESSIONAL TOUCH')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
            {tr('whoTitle', 'When AI Needs a Human Touch')}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mt-6 max-w-2xl mx-auto">
            {tr('whoDesc', 'Complex product shots and fine hair details sometimes require a manual override.')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-8">
          <div className="bg-dark-800/80 rounded-[2.5rem] p-8 sm:p-12 border border-dark-600 flex flex-col justify-between group hover:bg-dark-800 transition-colors">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-fuchsia-500/80 to-purple-500/80 rounded-3xl flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <Palette className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{tr('case1Title', 'E-commerce Products')}</h3>
              <p className="text-slate-400 leading-relaxed">
                {tr('case1Desc', 'Product photos often have shadows or reflections that AI might confuse. Use the magic brush to ensure your product edges are exceptionally clean before publishing to your store.')}
              </p>
            </div>
          </div>

          <div className="bg-dark-800/80 rounded-[2.5rem] p-8 sm:p-12 border border-dark-600 flex flex-col justify-between group hover:bg-dark-800 transition-colors">
            <div>
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500/80 to-rose-500/80 rounded-3xl flex items-center justify-center text-white shadow-lg mb-8 group-hover:scale-110 transition-transform">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{tr('case2Title', 'Complex Hair & Fur')}</h3>
              <p className="text-slate-400 leading-relaxed">
                {tr('case2Desc', 'While our AI is trained on millions of hair patterns, extremely chaotic backgrounds can trick it. The restore brush lets you paint back fine strands of hair perfectly.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      <SystemArchitecture />
    </div>
  );
};
