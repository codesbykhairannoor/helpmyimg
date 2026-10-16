// src/components/landing/tools/MetadataSections.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  ShieldCheck, 
  MapPin, 
  Lock, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle,
  EyeOff, 
  Layers, 
  Zap, 
  Camera, 
  Crosshair,
  Smartphone,
  Cpu,
  FileSpreadsheet,
  ArrowRight,
  Fingerprint
} from 'lucide-react';

export const MetadataSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`landing.metadata.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-20 lg:space-y-32 py-16 text-slate-100 overflow-hidden bg-dark-900">
      
      {/* =========================================================================
          SECTION 1: HERO / PRIVACY VAULT & FORENSIC AUDIT STATION
         ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '40px' }}>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#12DA91]/10 rounded-full blur-[140px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#05DAED]/10 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2.5s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-16">
          
          {/* Left Text Column */}
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-dark-800 border border-[#12DA91]/30 shadow-xl shadow-[#12DA91]/5 group hover:border-[#12DA91]/60 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#12DA91]/20 text-[#12DA91]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-[#12DA91] uppercase">
                {tr('heroBadge', '100% PRIVATE METADATA SCRUBBER')}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-white tracking-tight leading-tight" style={{ fontSize: 'clamp(1.4rem, 4.2vw, 2.75rem)', fontWeight: 800 }}>
              <span>{tr('heroTitle', 'Protect Your Privacy: Strip Hidden GPS & EXIF Data Instantly')}</span>
            </h2>

            <p className="text-slate-400 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Digital cameras and smartphones embed exact physical GPS locations, camera serial numbers, and personal creator data inside every photo. HelpMyIMG losslessly strips these sensitive headers in your browser before you share photos online.')}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-dark-600 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#12DA91]" />
                <span>Zero Server Uploads</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-dark-600 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#12DA91]" />
                <span>Lossless Byte Slicing</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-dark-600 text-xs font-mono text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#12DA91]" />
                <span>Full Geotag Removal</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Privacy Audit Station Graphic */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
            <div className="relative bg-dark-800/90 rounded-[2.5rem] p-6 sm:p-8 border border-dark-600 shadow-2xl backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#12DA91]/10 rounded-full blur-3xl pointer-events-none" />

              {/* Station Header */}
              <div className="flex items-center justify-between pb-4 border-b border-dark-600 text-xs font-mono">
                <div className="flex items-center gap-2 text-slate-300">
                  <Fingerprint className="w-4 h-4 text-[#05DAED]" />
                  <span>METADATA AUDIT INSPECTOR</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-[#12DA91]/20 text-[#12DA91] font-bold text-[11px]">
                  ACTIVE SCAN
                </span>
              </div>

              {/* 3 Live Telemetry Items */}
              <div className="space-y-3.5 my-6">
                {/* GPS Item */}
                <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">GPS Coordinates</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-300 line-through decoration-rose-500">
                        37.7749° N, 122.4194° W
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    STRIPPED (0 KB)
                  </span>
                </div>

                {/* Hardware Item */}
                <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#05DAED]/20 text-[#05DAED] flex items-center justify-center shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Device Hardware Serial</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-300 line-through decoration-rose-500">
                        Apple iPhone 15 Pro #F2L99281
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    REMOVED
                  </span>
                </div>

                {/* Software / Creator Item */}
                <div className="p-3.5 rounded-2xl bg-dark-900 border border-dark-600 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#12DA91]/20 text-[#12DA91] flex items-center justify-center shrink-0">
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-mono">Software History & Author</div>
                      <div className="text-xs sm:text-sm font-bold text-slate-300 line-through decoration-rose-500">
                        Adobe Photoshop • Private User
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                    SANITIZED
                  </span>
                </div>
              </div>

              {/* Status Footer */}
              <div className="pt-3 border-t border-dark-600 flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-[#12DA91]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Client-Side RAM Processing</span>
                </span>
                <span className="text-slate-500">0 KB Server Upload</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ASYMMETRIC BENTO GRID CAPABILITIES (DISTINCT FROM OTHER PAGES)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '40px 24px 80px', marginBottom: '40px' }}>
        <div className="text-center max-w-3xl mx-auto mb-14 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3.5 py-1.5 rounded-full border border-[#05DAED]/30 inline-block mb-4">
            FORENSIC DEFENSE ARCHITECTURE
          </span>
          <h2 className="font-heading font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(1.35rem, 3.8vw, 2.5rem)', fontWeight: 800 }}>
            Precision Privacy Controls at Every Layer
          </h2>
        </div>

        {/* Asymmetric Bento: 8-col & 4-col layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card 1 (Span 7): GPS Geotag Radar */}
          <div className="md:col-span-7 bg-dark-800 border border-dark-600 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-[#05DAED]/50 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#05DAED]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#05DAED]/10 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED]">
                <MapPin className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 rounded-full border border-[#05DAED]/30 inline-block">
                {tr('feat1Badge', 'GEOLOCATION SAFETY')}
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                {tr('feat1Title', 'Scrub GPS Geotags')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed text-sm sm:text-base">
                {tr('feat1Desc', 'Permanently remove latitude, longitude, and altitude coordinates to prevent physical location tracking and keep your home address confidential.')}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-700/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Wipes EXIF GPS IFD & XMP Coordinates</span>
              <span className="text-[#05DAED] font-bold">100% Anti-Doxxing</span>
            </div>
          </div>

          {/* Card 2 (Span 5): Hardware Fingerprint Eraser */}
          <div className="md:col-span-5 bg-dark-800 border border-dark-600 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-[#12DA91]/50 transition-all duration-300">
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#12DA91]/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700 pointer-events-none" />
            
            <div className="relative z-10 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#12DA91]/10 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91]">
                <Camera className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1 rounded-full border border-[#12DA91]/30 inline-block">
                {tr('feat2Badge', 'DEVICE FINGERPRINT')}
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                {tr('feat2Title', 'Wipe Hardware EXIF')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed text-sm sm:text-base">
                {tr('feat2Desc', 'Clear camera serial numbers, lens identifiers, shutter actuations, and internal hardware tags that could uniquely identify your personal equipment.')}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-700/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Serial Tag Nullification</span>
              <span className="text-[#12DA91] font-bold">Zero Traces</span>
            </div>
          </div>

          {/* Card 3 (Span 5): 100% In-Browser Memory Sandbox */}
          <div className="md:col-span-5 bg-dark-800 border border-dark-600 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-[#05DAED]/50 transition-all duration-300">
            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#05DAED]/10 border border-[#05DAED]/30 flex items-center justify-center text-[#05DAED]">
                <Lock className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 rounded-full border border-[#05DAED]/30 inline-block">
                {tr('feat3Badge', '100% IN-BROWSER')}
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                {tr('feat3Title', 'Zero Server Uploads')}
              </h3>
              <p className="font-body text-slate-400 leading-relaxed text-sm sm:text-base">
                {tr('feat3Desc', 'All byte manipulation executes locally in your device memory. Your private portraits and sensitive photos never leave your device or touch a remote server.')}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-700/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Air-Gapped Local WASM</span>
              <span className="text-[#05DAED] font-bold">Safe & Offline</span>
            </div>
          </div>

          {/* Card 4 (Span 7): Lossless High-Speed Batch Slicing */}
          <div className="md:col-span-7 bg-dark-800 border border-dark-600 rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden flex flex-col justify-between group hover:border-[#12DA91]/50 transition-all duration-300">
            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#12DA91]/10 border border-[#12DA91]/30 flex items-center justify-center text-[#12DA91]">
                <Layers className="w-7 h-7" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1 rounded-full border border-[#12DA91]/30 inline-block">
                BATCH PARALLEL PROCESSING
              </span>
              <h3 className="text-2xl font-bold font-heading text-white">
                Bulk Sanitize Up to 10 Images Concurrently
              </h3>
              <p className="font-body text-slate-400 leading-relaxed text-sm sm:text-base">
                Need to clean an entire album before posting to a forum or cloud archive? Drop multiple files at once. Every image is sanitized independently in browser threads and packaged into a neat ZIP archive.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-dark-700/80 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Instant Parallel Execution</span>
              <span className="text-[#12DA91] font-bold">1-Click ZIP Download</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PRIVACY THREAT MODEL VS PROTECTED STATE (COMPARATIVE CARDS)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '40px 24px 80px', marginBottom: '40px' }}>
        <div className="text-center max-w-3xl mx-auto mb-14 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3.5 py-1.5 rounded-full border border-[#12DA91]/30 inline-block mb-4">
            PRIVACY COMPARISON
          </span>
          <h2 className="font-heading font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(1.35rem, 3.8vw, 2.5rem)', fontWeight: 800 }}>
            Raw Unprotected Photo vs Sanitized Export
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card Left: Raw Photo Risks */}
          <div className="bg-dark-950/80 border border-rose-500/30 rounded-[2.5rem] p-8 sm:p-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold">
                RAW UNPROTECTED PHOTO
              </span>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>

            <h3 className="text-xl font-bold font-heading text-white">What You Inadvertently Reveal</h3>
            <ul className="space-y-3.5 text-sm text-slate-300 font-body">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span><strong>Home & School Geotags:</strong> Accurate coordinates embedded by iOS/Android camera sensors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span><strong>Hardware Serial Numbers:</strong> Unique camera and lens serial numbers linkable to receipts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span><strong>Creator & Editing History:</strong> Software license names, creator usernames, and modification timestamps.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold font-mono">✕</span>
                <span><strong>Bloated File Payload:</strong> Megabytes of unused thumbnails and tracking chunks that slow down page loads.</span>
              </li>
            </ul>
          </div>

          {/* Card Right: Sanitized Photo Protection */}
          <div className="bg-dark-800/90 border border-[#12DA91]/40 rounded-[2.5rem] p-8 sm:p-10 space-y-6 shadow-xl shadow-[#12DA91]/5">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#12DA91]/20 text-[#12DA91] border border-[#12DA91]/40 text-xs font-mono font-bold">
                HELPMYIMG SANITIZED PHOTO
              </span>
              <ShieldCheck className="w-5 h-5 text-[#12DA91]" />
            </div>

            <h3 className="text-xl font-bold font-heading text-white">Guaranteed Privacy & Integrity</h3>
            <ul className="space-y-3.5 text-sm text-slate-300 font-body">
              <li className="flex items-start gap-2.5">
                <span className="text-[#12DA91] font-bold font-mono">✓</span>
                <span><strong>100% Geotag-Free:</strong> All GPS IFD tags wiped clean down to 0 bytes of location metadata.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#12DA91] font-bold font-mono">✓</span>
                <span><strong>Hardware Anonymity:</strong> Device serials and unique IDs removed to protect physical equipment.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#12DA91] font-bold font-mono">✓</span>
                <span><strong>Lossless Pixel Preservation:</strong> Only metadata segments are removed; image pixels are never recompressed.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-[#12DA91] font-bold font-mono">✓</span>
                <span><strong>Safe for Social Sharing:</strong> Publish online, in forums, or marketplaces with complete confidence.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: HORIZONTAL PIPELINE WORKFLOW (3 CONNECTED STEPS)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '40px 24px 80px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-14 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3.5 py-1.5 rounded-full border border-[#05DAED]/30 inline-block mb-4">
            {tr('stepsTag', 'HOW IT WORKS')}
          </span>
          <h2 className="font-heading font-extrabold text-white tracking-tight" style={{ fontSize: 'clamp(1.35rem, 3.8vw, 2.5rem)', fontWeight: 800 }}>
            {tr('stepsTitle', '3 Steps to Clean Your Photos')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-dark-800 border border-dark-600 rounded-[2rem] p-8 space-y-4 relative group hover:border-[#05DAED]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-lg font-heading font-bold text-[#05DAED]">
              01
            </div>
            <h3 className="text-xl font-bold font-heading text-white">{tr('s1Title', 'Upload Photos')}</h3>
            <p className="font-body text-slate-400 text-sm leading-relaxed">
              {tr('s1Desc', 'Drag and drop your images into the secure local workspace.')}
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-dark-800 border border-dark-600 rounded-[2rem] p-8 space-y-4 relative group hover:border-[#12DA91]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-lg font-heading font-bold text-[#12DA91]">
              02
            </div>
            <h3 className="text-xl font-bold font-heading text-white">{tr('s2Title', 'Audit & Clean')}</h3>
            <p className="font-body text-slate-400 text-sm leading-relaxed">
              {tr('s2Desc', 'Inspect detected GPS and hardware tags, then click to scrub all sensitive metadata losslessly.')}
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-dark-800 border border-dark-600 rounded-[2rem] p-8 space-y-4 relative group hover:border-[#05DAED]/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-lg font-heading font-bold text-[#05DAED]">
              03
            </div>
            <h3 className="text-xl font-bold font-heading text-white">{tr('s3Title', 'Download Safely')}</h3>
            <p className="font-body text-slate-400 text-sm leading-relaxed">
              {tr('s3Desc', 'Export your sanitized photos with zero tracking headers and complete peace of mind.')}
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
