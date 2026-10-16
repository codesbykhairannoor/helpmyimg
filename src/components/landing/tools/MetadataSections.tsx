// src/components/landing/tools/MetadataSections.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Trash2, 
  CheckCircle2, 
  Shield, 
  EyeOff, 
  FileCheck, 
  Layers, 
  Zap, 
  Camera, 
  Globe 
} from 'lucide-react';

export const MetadataSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`landing.metadata.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden bg-dark-900">
      
      {/* SECTION 1: HERO / WHY SECTION - PRIVACY & LOCATION PROTECTION */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          {/* Visual Showcase Card */}
          <div className="flex-1 w-full relative z-10">
            <div className="relative bg-dark-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-dark-600/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#12DA91]/5 to-transparent pointer-events-none" />
              
              <div className="flex flex-col gap-6 relative z-10">
                {/* Before: Exposed Metadata */}
                <div className="bg-dark-900 rounded-2xl p-4 sm:p-6 border border-rose-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                    <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-200 text-sm sm:text-base">vacation_photo.jpg</div>
                      <div className="text-xs text-rose-400 font-mono">GPS: 37.7749° N, 122.4194° W (Exposed)</div>
                      <div className="text-[11px] text-slate-400 font-mono">Serial: #8841-A • Author: John Doe</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                    Exposed
                  </span>
                </div>

                {/* Scrubber Arrow */}
                <div className="flex justify-center -my-2 z-20">
                  <div className="bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 p-2.5 rounded-full shadow-[0_0_15px_rgba(18,218,145,0.4)]">
                    <Trash2 className="w-5 h-5" />
                  </div>
                </div>

                {/* After: 100% Sanitized */}
                <div className="bg-dark-900 rounded-2xl p-4 sm:p-6 border border-[#12DA91]/30 shadow-[0_0_15px_rgba(18,218,145,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                    <div className="w-12 h-12 bg-[#12DA91]/20 text-[#12DA91] rounded-xl flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-sm sm:text-base">sanitized_photo.jpg</div>
                      <div className="text-xs text-[#12DA91] font-mono tracking-wider">100% Clean • 0 Privacy Leaks</div>
                      <div className="text-[11px] text-slate-400 font-mono">Lossless Byte-Slicing • Original Quality Intact</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    Protected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12DA91]/10 border border-[#12DA91]/30 text-[#12DA91] font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              {tr('heroBadge', '100% PRIVATE METADATA SCRUBBER')}
            </div>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('heroTitle', 'Protect Your Privacy: Strip Hidden GPS & EXIF Data Instantly')}
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Digital cameras and smartphones embed exact physical GPS locations, camera serial numbers, and personal creator data inside every photo. HelpMyIMG losslessly strips these sensitive headers in your browser before you share photos online.')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: 3 KEY CAPABILITIES */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="bg-dark-800 border border-dark-600 rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark-600">
            
            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <MapPin className="w-10 h-10 text-[#05DAED] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">
                {tr('feat1Badge', 'GEOLOCATION SAFETY')}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 text-white">
                {tr('feat1Title', 'Scrub GPS Geotags')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed">
                {tr('feat1Desc', 'Permanently remove latitude, longitude, and altitude coordinates to prevent physical location tracking and keep your home address confidential.')}
              </p>
            </div>

            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <Camera className="w-10 h-10 text-[#12DA91] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#12DA91]/30">
                {tr('feat2Badge', 'DEVICE FINGERPRINT')}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 text-white">
                {tr('feat2Title', 'Wipe Hardware EXIF')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed">
                {tr('feat2Desc', 'Clear camera serial numbers, lens identifiers, shutter actuations, and internal hardware tags that could uniquely identify your personal equipment.')}
              </p>
            </div>

            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <Lock className="w-10 h-10 text-[#05DAED] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">
                {tr('feat3Badge', '100% IN-BROWSER')}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4 text-white">
                {tr('feat3Title', 'Zero Server Uploads')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed">
                {tr('feat3Desc', 'All byte manipulation executes locally in your device memory. Your private portraits and sensitive photos never leave your device or touch a remote server.')}
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
              {tr('whoTitle', 'Built for Safe & Responsible Photo Sharing')}
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('whoDesc', 'Whether posting family moments, selling items online, or delivering professional assets, protect your digital footprint easily.')}
            </p>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600 border-l-4 border-l-[#05DAED] shadow-lg group hover:bg-dark-800/80 transition-colors">
              <h3 className="font-heading text-xl font-bold text-white mb-2">{tr('who1Title', 'Individuals & Families')}</h3>
              <p className="font-body text-slate-400 mb-4">{tr('who1Desc', 'Remove home and school GPS coordinates from family photos before posting on Instagram, forums, or online marketplaces.')}</p>
              <div className="inline-block px-3 py-1 bg-[#05DAED]/10 text-[#05DAED] text-xs font-mono rounded">
                {tr('who1Tags', 'FAMILY PRIVACY')}
              </div>
            </div>

            <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600 border-l-4 border-l-[#12DA91] shadow-lg group hover:bg-dark-800/80 transition-colors">
              <h3 className="font-heading text-xl font-bold text-white mb-2">{tr('who2Title', 'Photographers & Designers')}</h3>
              <p className="font-body text-slate-400 mb-4">{tr('who2Desc', 'Clean private camera metadata and proprietary software history from client deliverables while maintaining 100% original image quality.')}</p>
              <div className="inline-block px-3 py-1 bg-[#12DA91]/10 text-[#12DA91] text-xs font-mono rounded">
                {tr('who2Tags', 'STUDIO WORKFLOW')}
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
            {tr('stepsTitle', '3 Steps to Clean Your Photos')}
          </h2>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              1
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s1Title', 'Upload Photos')}</h3>
              <p className="font-body text-slate-400">{tr('s1Desc', 'Drag and drop your images into the secure local workspace.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              2
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s2Title', 'Audit & Clean')}</h3>
              <p className="font-body text-slate-400">{tr('s2Desc', 'Inspect detected GPS and hardware tags, then click to scrub all sensitive metadata losslessly.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              3
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">{tr('s3Title', 'Download Safely')}</h3>
              <p className="font-body text-slate-400">{tr('s3Desc', 'Export your sanitized photos with zero tracking headers and complete peace of mind.')}</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
