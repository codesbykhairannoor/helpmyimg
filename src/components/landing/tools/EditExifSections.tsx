// src/components/landing/tools/EditExifSections.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  Camera, 
  Calendar, 
  User, 
  Sliders, 
  ShieldCheck, 
  Clock, 
  FileCheck, 
  Printer, 
  Layers, 
  Zap, 
  Tag, 
  CheckCircle2 
} from 'lucide-react';

export const EditExifSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`landing.editexif.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden bg-dark-900">
      
      {/* SECTION 1: HERO / WHY SECTION - PHOTOGRAPHY ORGANIZATION */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          {/* Visual Showcase Card */}
          <div className="flex-1 w-full relative z-10">
            <div className="relative bg-dark-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-dark-600/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#05DAED]/5 to-transparent pointer-events-none" />
              
              <div className="flex flex-col gap-5 relative z-10">
                {/* Header info */}
                <div className="flex items-center justify-between pb-3 border-b border-dark-600/80 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#05DAED]" />
                    <span>EXIF METADATA MANAGER</span>
                  </span>
                  <span className="text-[#12DA91] font-bold">LOSSLESS 300 DPI</span>
                </div>

                {/* Technical Parameters Display */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#05DAED]" />
                      <span>Date Taken</span>
                    </div>
                    <div className="font-bold text-white font-mono">2026:10:15 14:30:00</div>
                    <div className="text-[10px] text-[#12DA91]">Timestamp Synced</div>
                  </div>

                  <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <Printer className="w-3 h-3 text-[#05DAED]" />
                      <span>Resolution</span>
                    </div>
                    <div className="font-bold text-white font-mono">300 x 300 DPI</div>
                    <div className="text-[10px] text-[#12DA91]">Print Production Ready</div>
                  </div>

                  <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <User className="w-3 h-3 text-[#05DAED]" />
                      <span>Creator Credit</span>
                    </div>
                    <div className="font-bold text-white truncate">Studio Pro Photo</div>
                    <div className="text-[10px] text-slate-400">Artist Tag Embedded</div>
                  </div>

                  <div className="bg-dark-900 rounded-xl p-3 border border-dark-700">
                    <div className="text-[10px] font-mono text-slate-400 uppercase mb-1 flex items-center gap-1">
                      <FileCheck className="w-3 h-3 text-[#05DAED]" />
                      <span>Copyright Notice</span>
                    </div>
                    <div className="font-bold text-white font-mono text-[11px]">All Rights Reserved</div>
                    <div className="text-[10px] text-slate-400">IP Protected</div>
                  </div>
                </div>

                <div className="bg-dark-900/60 rounded-xl p-3 border border-dark-700 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Pixel Integrity:</span>
                  <span className="text-[#12DA91] font-bold">100% Uncompressed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#05DAED]/10 border border-[#05DAED]/30 text-[#05DAED] font-mono text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-4 h-4" />
              {tr('heroBadge', 'PROFESSIONAL EXIF & METADATA EDITOR')}
            </div>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('heroTitle', 'Edit Photography Metadata & Fix Timestamps in Seconds')}
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Organize your photography portfolio, synchronize capture timestamps across time zones, and embed official copyright credits directly in your browser with zero image recompression.')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3 KEY CAPABILITIES */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="bg-dark-800 border border-dark-600 rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark-600">
            
            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <Calendar className="w-10 h-10 text-[#05DAED] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">
                {tr('feat1Badge', 'TIME SYNCHRONIZATION')}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 text-white">
                {tr('feat1Title', 'Fix Capture Dates')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed">
                {tr('feat1Desc', 'Synchronize out-of-sync camera clocks after battery drain or international travel across multiple time zones in seconds.')}
              </p>
            </div>

            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <User className="w-10 h-10 text-[#12DA91] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#12DA91]/30">
                {tr('feat2Badge', 'CREATOR CREDENTIALS')}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 text-white">
                {tr('feat2Title', 'Embed Artist & Copyright')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed">
                {tr('feat2Desc', 'Standardize copyright notices and artist credits across your photo catalog to protect intellectual property and creator attribution.')}
              </p>
            </div>

            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <Zap className="w-10 h-10 text-[#05DAED] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">
                {tr('feat3Badge', 'LOSSLESS EXIF')}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 text-white">
                {tr('feat3Title', 'Zero Recompression')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed">
                {tr('feat3Desc', 'Injects and updates EXIF segments directly without re-encoding image pixels, guaranteeing that your high-resolution textures remain 100% sharp.')}
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: WHO IS IT FOR */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mb-4">
              {tr('whoTag', 'WHO IS IT FOR')}
            </span>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('whoTitle', 'Built for Photographers & Digital Creatives')}
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('whoDesc', 'From professional photography studios to print designers, manage and standardize image metadata seamlessly.')}
            </p>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600 border-l-4 border-l-[#05DAED] shadow-lg group hover:bg-dark-800/80 transition-colors">
              <h3 className="font-heading text-xl font-bold text-white mb-2">{tr('who1Title', 'Photographers & Studios')}</h3>
              <p className="font-body text-slate-400 mb-4">{tr('who1Desc', 'Ensure every photo in your catalog includes official copyright notices, photographer credits, and synchronized capture timestamps.')}</p>
              <div className="inline-block px-3 py-1 bg-[#05DAED]/10 text-[#05DAED] text-xs font-mono rounded">
                {tr('who1Tags', 'PHOTOGRAPHY CATALOG')}
              </div>
            </div>

            <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600 border-l-4 border-l-[#12DA91] shadow-lg group hover:bg-dark-800/80 transition-colors">
              <h3 className="font-heading text-xl font-bold text-white mb-2">{tr('who2Title', 'Designers & Print Specialists')}</h3>
              <p className="font-body text-slate-400 mb-4">{tr('who2Desc', 'Embed 300 DPI print markers and clean software tags to ensure assets are properly prepared for high-end printing production.')}</p>
              <div className="inline-block px-3 py-1 bg-[#12DA91]/10 text-[#12DA91] text-xs font-mono rounded">
                {tr('who2Tags', 'PRINT PRODUCTION')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS - 3 SIMPLE STEPS */}
      <section className="max-w-5xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'HOW IT WORKS')}
          </span>
          <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            {tr('stepsTitle', '3 Steps to Edit Photo Metadata')}
          </h2>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              1
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s1Title', 'Upload Photos')}</h3>
              <p className="font-body text-slate-400">{tr('s1Desc', 'Drag and drop your images into the local EXIF editor workspace.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              2
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s2Title', 'Customize Parameters')}</h3>
              <p className="font-body text-slate-400">{tr('s2Desc', 'Adjust capture dates, input creator credentials, set DPI resolution, or edit camera tags.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              3
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s3Title', 'Export Losslessly')}</h3>
              <p className="font-body text-slate-400">{tr('s3Desc', 'Download your organized photos with updated EXIF tags and 100% untouched visual quality.')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
