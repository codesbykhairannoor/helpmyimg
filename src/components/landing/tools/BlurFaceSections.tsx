import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { ScanFace, EyeOff, Shield, Crop, UserX, Download, Upload } from 'lucide-react';

export const BlurFaceSections: React.FC = () => {
  const { t } = useTranslation();
  // Using direct flat keys that we will inject
  const tr = (key: string, def: string = '') => t(`landing.blurface.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / SCANNING GRID LAYOUT */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#10B981]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#06B6D4]/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-[#10B981]/30 shadow-xl shadow-[#10B981]/10 group hover:border-[#10B981]/60 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#10B981]/20 text-[#10B981]">
                <EyeOff className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold tracking-wide text-[#10B981] uppercase font-mono">
                {tr('heroBadge', 'ULTIMATE PRIVACY')}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              <span className="block">{tr('heroTitle', 'Censor with AI.')}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#06B6D4] block mt-2">
                {tr('heroTitle2', 'Protect Identities.')}
              </span>
            </h2>

            <p className="text-slate-400 mt-4 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Automatically detect and blur faces, license plates, or sensitive information in seconds. 100% private, running entirely within your browser.')}
            </p>
          </div>

          <div className="flex-1 w-full relative z-10">
            {/* Holographic AI Scanner Layout */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-dark-900 border border-[#10B981]/30 backdrop-blur-xl p-6 shadow-2xl flex items-center justify-center overflow-hidden group">
              {/* Grid Background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#10B9811A_1px,transparent_1px),linear-gradient(to_bottom,#10B9811A_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
              
              <div className="relative w-full h-full bg-dark-950 rounded-3xl overflow-hidden border border-[#10B981]/20">
                {/* Simulated Photo Subject */}
                <div className="absolute inset-0 bg-slate-800" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-slate-700 rounded-full blur-xl" />
                
                {/* AI Scanning Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#10B981] shadow-[0_0_20px_#10B981] animate-[scan_3s_ease-in-out_infinite]" />
                
                {/* Detected Face Boxes */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-[#10B981] border-dashed rounded-lg flex items-center justify-center group-hover:bg-[#10B981]/20 transition-colors duration-500">
                   {/* Blur Effect over face */}
                   <div className="w-full h-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex items-center justify-center">
                     <EyeOff className="w-12 h-12 text-white/50" />
                   </div>
                   
                   {/* Targeting Corners */}
                   <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#10B981]" />
                   <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#10B981]" />
                   <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#10B981]" />
                   <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#10B981]" />
                </div>
                
                {/* HUD Data */}
                <div className="absolute bottom-4 left-4 font-mono text-[10px] text-[#10B981] leading-tight">
                  <div>DETECTING_FACES...</div>
                  <div className="group-hover:text-white transition-colors">CONFIDENCE: 99.8%</div>
                  <div>COORD: X240_Y120</div>
                </div>
              </div>

              {/* Floating UI Badge */}
              <div className="absolute top-12 -left-6 glass-panel px-6 py-4 rounded-2xl border border-[#06B6D4]/30 shadow-lg shadow-[#06B6D4]/20 animate-bounce" style={{ animationDuration: '4s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#06B6D4]/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-[#06B6D4]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">Anonymized</div>
                    <div className="text-xs text-slate-400">100% Safe</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-900 border border-dark-600 p-10 rounded-[2rem] hover:border-[#10B981]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-[#10B981]/10 flex items-center justify-center text-[#10B981] mb-8">
              <ScanFace className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat1Title', 'Face Detection')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat1Desc', 'Our local AI model automatically finds and highlights faces in your photos with incredible accuracy.')}</p>
          </div>

          <div className="bg-dark-900 border border-dark-600 p-10 rounded-[2rem] hover:border-[#06B6D4]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] mb-8">
              <Crop className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat2Title', 'Smart Blurring')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat2Desc', 'Apply beautiful gaussian blurs, pixelation, or solid color blocks to obscure sensitive regions permanently.')}</p>
          </div>

          <div className="bg-dark-900 border border-dark-600 p-10 rounded-[2rem] hover:border-emerald-400/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 flex items-center justify-center text-emerald-400 mb-8">
              <UserX className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat3Title', 'Manual Override')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat3Desc', 'Need to hide a license plate or a document? Use our manual selection tools to blur any specific area.')}</p>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'HOW IT WORKS')}
          </span>
          <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            {tr('stepsTitle', 'Anonymize in 3 Steps')}
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-16">
          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#10B981]/50 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#10B981]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-2">{tr('s1Title', 'Upload')}</h3>
            <p className="text-lg text-slate-400">{tr('s1Desc', 'Drop photos safely into the browser.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#06B6D4]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
              <ScanFace className="w-8 h-8 text-[#06B6D4]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-2">{tr('s2Title', 'Detect')}</h3>
            <p className="text-lg text-slate-400">{tr('s2Desc', 'Let AI find and select faces automatically.')}</p>
          </div>

          <div className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
            <div className="w-20 h-20 mx-auto bg-dark-900 rounded-2xl border border-[#10B981]/40 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <Download className="w-8 h-8 text-[#10B981]" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-2">{tr('s3Title', 'Save')}</h3>
            <p className="text-lg text-slate-400">{tr('s3Desc', 'Download the anonymized photos.')}</p>
          </div>
        </div>
      </section>

    
          </div>
  );
};
