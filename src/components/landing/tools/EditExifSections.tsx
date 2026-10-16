// src/components/landing/tools/EditExifSections.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  Camera, 
  Calendar, 
  User, 
  Sliders, 
  Clock, 
  Printer, 
  Zap, 
  Tag, 
  CheckCircle2, 
  Layers,
  Sparkles,
  Award,
  Globe,
  SlidersHorizontal,
  Focus
} from 'lucide-react';

export const EditExifSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`landing.editexif.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-20 lg:space-y-32 py-16 text-slate-100 overflow-hidden bg-dark-900">
      
      {/* =========================================================================
          SECTION 1: HERO / STUDIO DSLR VIEWFINDER & TECHNICAL CONTROL DECK
         ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '40px' }}>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#05DAED]/10 rounded-full blur-[140px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#12DA91]/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2.5s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
          
          {/* Left Text Column */}
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-800 border border-[#05DAED]/30 shadow-xl shadow-[#05DAED]/5 group hover:border-[#05DAED]/60 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#05DAED]/20 text-[#05DAED]">
                <Camera className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-[#05DAED] uppercase">
                {tr('heroBadge', 'PROFESSIONAL EXIF & METADATA EDITOR')}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-white tracking-tight leading-tight" style={{ fontSize: 'clamp(1.4rem, 4.2vw, 2.75rem)', fontWeight: 800 }}>
              <span>{tr('heroTitle', 'Edit Photography Metadata & Fix Timestamps in Seconds')}</span>
            </h2>

            <p className="text-slate-400 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Organize your photography portfolio, synchronize capture timestamps across time zones, and embed official copyright credits directly in your browser with zero image recompression.')}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-dark-600 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#05DAED]" />
                <span>Fix Capture Timestamps</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-dark-600 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#05DAED]" />
                <span>Embed Artist & Copyright</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-dark-600 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#05DAED]" />
                <span>Calibrated 300 DPI Print</span>
              </div>
            </div>
          </div>

          {/* Right Column: DSLR Viewfinder & Technical HUD Mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
            <div className="relative bg-dark-950 rounded-[2.5rem] p-6 sm:p-8 border-2 border-dark-700 shadow-2xl overflow-hidden group">
              {/* Rule of Thirds Viewfinder Grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:33.33%_33.33%] pointer-events-none" />
              
              {/* Corner Viewfinder Brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#05DAED]/60" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#05DAED]/60" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#05DAED]/60" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#05DAED]/60" />

              {/* Viewfinder Status Bar */}
              <div className="relative z-10 flex items-center justify-between pb-3 border-b border-dark-800 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-white">
                  <Focus className="w-3.5 h-3.5 text-[#05DAED]" />
                  <span>MANUAL EXIF DECK</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-[#12DA91]/20 text-[#12DA91] font-bold">
                  300 DPI PRINT CALIBRATED
                </span>
              </div>

              {/* Live Technical Parameters Display */}
              <div className="relative z-10 grid grid-cols-3 gap-2.5 my-5 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-700">
                  <div className="text-[10px] text-slate-500 uppercase">Shutter</div>
                  <div className="text-sm font-bold text-white">1/250s</div>
                </div>
                <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-700">
                  <div className="text-[10px] text-slate-500 uppercase">Aperture</div>
                  <div className="text-sm font-bold text-white">f/2.8</div>
                </div>
                <div className="p-2.5 rounded-xl bg-dark-900 border border-dark-700">
                  <div className="text-[10px] text-slate-500 uppercase">Sensitivity</div>
                  <div className="text-sm font-bold text-white">ISO 100</div>
                </div>
              </div>

              {/* Exposure Compensation Scale */}
              <div className="relative z-10 flex items-center justify-between px-3 py-1.5 rounded-lg bg-dark-900/60 border border-dark-800 font-mono text-[10px] text-slate-400 mb-5">
                <span>-2</span>
                <span>-1</span>
                <span className="text-[#05DAED] font-bold text-xs">▲ 0 (BALANCED)</span>
                <span>+1</span>
                <span>+2</span>
              </div>

              {/* Photographer & Hardware Metadata Bar */}
              <div className="relative z-10 space-y-2 bg-dark-900 rounded-2xl p-4 border border-dark-700 font-mono text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#05DAED]" />
                    <span>Camera Hardware</span>
                  </span>
                  <span className="text-white font-semibold">Canon EOS 5D Mark IV</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#12DA91]" />
                    <span>Creator / Copyright</span>
                  </span>
                  <span className="text-[#12DA91] font-semibold">Studio Pro Photography</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#05DAED]" />
                    <span>Capture Date</span>
                  </span>
                  <span className="text-white font-semibold">2026:10:15 14:30:00</span>
                </div>
              </div>

              {/* Footer */}
              <div className="relative z-10 pt-3 mt-4 border-t border-dark-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Lossless APP1 Segment Patching</span>
                <span className="text-[#12DA91] font-bold">100% Crisp Pixels</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: 4-PILLAR PHOTOGRAPHY ARCHITECTURE (DIFFERENT 4-GRID LAYOUT)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '40px 24px 80px', marginBottom: '40px' }}>
        <div className="text-center max-w-3xl mx-auto mb-14 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3.5 py-1.5 rounded-full border border-[#05DAED]/30 inline-block mb-4">
            CORE PHOTOGRAPHY CAPABILITIES
          </span>
          <h2 className="font-heading font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(1.35rem, 3.8vw, 2.5rem)', fontWeight: 800 }}>
            Everything You Need to Manage Photo Metadata
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Time Sync */}
          <div className="bg-dark-800 border border-dark-600 rounded-[2rem] p-7 space-y-4 hover:border-[#05DAED]/50 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#05DAED]/10 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-2.5 py-1 rounded-full border border-[#05DAED]/30 inline-block">
                {tr('feat1Badge', 'TIME SYNCHRONIZATION')}
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                {tr('feat1Title', 'Fix Capture Dates')}
              </h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">
                {tr('feat1Desc', 'Synchronize out-of-sync camera clocks after battery drain or international travel across multiple time zones in seconds.')}
              </p>
            </div>
            <div className="pt-4 border-t border-dark-700/80 text-xs font-mono text-[#05DAED]">
              <span>DateTimeOriginal & ModifyDate</span>
            </div>
          </div>

          {/* Pillar 2: Creator Credentials */}
          <div className="bg-dark-800 border border-dark-600 rounded-[2rem] p-7 space-y-4 hover:border-[#12DA91]/50 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#12DA91]/10 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-2.5 py-1 rounded-full border border-[#12DA91]/30 inline-block">
                {tr('feat2Badge', 'CREATOR CREDENTIALS')}
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                {tr('feat2Title', 'Embed Artist & Copyright')}
              </h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">
                {tr('feat2Desc', 'Standardize copyright notices and artist credits across your photo catalog to protect intellectual property and creator attribution.')}
              </p>
            </div>
            <div className="pt-4 border-t border-dark-700/80 text-xs font-mono text-[#12DA91]">
              <span>Official IP Protection</span>
            </div>
          </div>

          {/* Pillar 3: 300 DPI Print Resolution */}
          <div className="bg-dark-800 border border-dark-600 rounded-[2rem] p-7 space-y-4 hover:border-[#05DAED]/50 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#05DAED]/10 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED] group-hover:scale-110 transition-transform">
                <Printer className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-2.5 py-1 rounded-full border border-[#05DAED]/30 inline-block">
                PRINT RESOLUTION
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                Set 300 DPI Headers
              </h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">
                Ensure your exported images contain official 300 x 300 DPI resolution headers for gallery printing and commercial print production workflows.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-700/80 text-xs font-mono text-[#05DAED]">
              <span>XResolution & YResolution 300</span>
            </div>
          </div>

          {/* Pillar 4: Lossless Binary Slicing */}
          <div className="bg-dark-800 border border-dark-600 rounded-[2rem] p-7 space-y-4 hover:border-[#12DA91]/50 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#12DA91]/10 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91] group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-2.5 py-1 rounded-full border border-[#12DA91]/30 inline-block">
                {tr('feat3Badge', 'LOSSLESS EXIF')}
              </span>
              <h3 className="text-xl font-bold font-heading text-white">
                {tr('feat3Title', 'Zero Recompression')}
              </h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">
                {tr('feat3Desc', 'Injects and updates EXIF segments directly without re-encoding image pixels, guaranteeing that your high-resolution textures remain 100% sharp.')}
              </p>
            </div>
            <div className="pt-4 border-t border-dark-700/80 text-xs font-mono text-[#12DA91]">
              <span>Untouched Pixel Quality</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: REAL-WORLD SCENARIO CARDS (3 WIDE TILES)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '40px 24px 80px', marginBottom: '40px' }}>
        <div className="text-center max-w-3xl mx-auto mb-14 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3.5 py-1.5 rounded-full border border-[#12DA91]/30 inline-block mb-4">
            {tr('whoTag', 'WHO IS IT FOR')}
          </span>
          <h2 className="font-heading font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(1.35rem, 3.8vw, 2.5rem)', fontWeight: 800 }}>
            {tr('whoTitle', 'Built for Photographers & Digital Creatives')}
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-body mt-4 text-sm sm:text-base">
            {tr('whoDesc', 'From professional photography studios to print designers, manage and standardize image metadata seamlessly.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Scenario 1 */}
          <div className="bg-dark-800 p-8 rounded-[2.5rem] border border-dark-600 flex flex-col justify-between space-y-6 hover:border-[#05DAED]/50 transition-colors">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#05DAED]/10 text-[#05DAED] flex items-center justify-center">
                <Camera className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">{tr('who1Title', 'Photographers & Studios')}</h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">{tr('who1Desc', 'Ensure every photo in your catalog includes official copyright notices, photographer credits, and synchronized capture timestamps.')}</p>
            </div>
            <div className="pt-4 border-t border-dark-700">
              <span className="inline-block px-3 py-1 bg-[#05DAED]/10 text-[#05DAED] text-xs font-mono rounded-lg">
                {tr('who1Tags', 'PHOTOGRAPHY CATALOG')}
              </span>
            </div>
          </div>

          {/* Scenario 2 */}
          <div className="bg-dark-800 p-8 rounded-[2.5rem] border border-dark-600 flex flex-col justify-between space-y-6 hover:border-[#12DA91]/50 transition-colors">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#12DA91]/10 text-[#12DA91] flex items-center justify-center">
                <Printer className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">{tr('who2Title', 'Designers & Print Specialists')}</h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">{tr('who2Desc', 'Embed 300 DPI print markers and clean software tags to ensure assets are properly prepared for high-end printing production.')}</p>
            </div>
            <div className="pt-4 border-t border-dark-700">
              <span className="inline-block px-3 py-1 bg-[#12DA91]/10 text-[#12DA91] text-xs font-mono rounded-lg">
                {tr('who2Tags', 'PRINT PRODUCTION')}
              </span>
            </div>
          </div>

          {/* Scenario 3 */}
          <div className="bg-dark-800 p-8 rounded-[2.5rem] border border-dark-600 flex flex-col justify-between space-y-6 hover:border-[#05DAED]/50 transition-colors">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#05DAED]/10 text-[#05DAED] flex items-center justify-center">
                <Layers className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white">Digital Archivists</h3>
              <p className="font-body text-slate-400 text-sm leading-relaxed">
                Standardize legacy photo collections, repair missing EXIF headers, and maintain structured date-taken metadata across extensive visual archives.
              </p>
            </div>
            <div className="pt-4 border-t border-dark-700">
              <span className="inline-block px-3 py-1 bg-[#05DAED]/10 text-[#05DAED] text-xs font-mono rounded-lg">
                ARCHIVE STANDARDIZATION
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: DARKROOM 3-STEP WORKFLOW
         ========================================================================= */}
      <section className="max-w-5xl mx-auto w-full relative" style={{ padding: '40px 24px 80px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-14 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3.5 py-1.5 rounded-full border border-[#12DA91]/30 inline-block mb-4">
            {tr('stepsTag', 'HOW IT WORKS')}
          </span>
          <h2 className="font-heading font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(1.35rem, 3.8vw, 2.5rem)', fontWeight: 800 }}>
            {tr('stepsTitle', '3 Steps to Edit Photo Metadata')}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-6 bg-dark-800 p-6 sm:p-8 rounded-[2rem] border border-dark-600 group hover:border-[#05DAED]/40 transition-colors">
            <div className="w-16 h-16 shrink-0 bg-dark-900 rounded-2xl flex items-center justify-center text-xl font-heading font-bold text-[#05DAED] border border-dark-700 shadow-inner">
              01
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s1Title', 'Upload Photos')}</h3>
              <p className="font-body text-slate-400 text-sm">{tr('s1Desc', 'Drag and drop your images into the local EXIF editor workspace.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800 p-6 sm:p-8 rounded-[2rem] border border-dark-600 group hover:border-[#12DA91]/40 transition-colors">
            <div className="w-16 h-16 shrink-0 bg-dark-900 rounded-2xl flex items-center justify-center text-xl font-heading font-bold text-[#12DA91] border border-dark-700 shadow-inner">
              02
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s2Title', 'Customize Parameters')}</h3>
              <p className="font-body text-slate-400 text-sm">{tr('s2Desc', 'Adjust capture dates, input creator credentials, set DPI resolution, or edit camera tags.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800 p-6 sm:p-8 rounded-[2rem] border border-dark-600 group hover:border-[#05DAED]/40 transition-colors">
            <div className="w-16 h-16 shrink-0 bg-dark-900 rounded-2xl flex items-center justify-center text-xl font-heading font-bold text-[#05DAED] border border-dark-700 shadow-inner">
              03
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s3Title', 'Export Losslessly')}</h3>
              <p className="font-body text-slate-400 text-sm">{tr('s3Desc', 'Download your organized photos with updated EXIF tags and 100% untouched visual quality.')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
