import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Camera, 
  Sparkles, 
  Cpu, 
  Lock, 
  Sliders, 
  FileCheck, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  HelpCircle,
  EyeOff,
  Layers,
  ArrowRight
} from 'lucide-react';

export const MetadataSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`landing.metadata.${key}`, { defaultValue: def });

  return (
    <div className="space-y-24 lg:space-y-36 py-16 text-slate-100 overflow-hidden">
      
      {/* SECTION 1: HERO THREAT MODEL & C2PA ANALYSIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-neon-cyan/15 to-emerald-500/10 rounded-full blur-[140px] -z-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-neon-cyan/30 shadow-lg shadow-neon-cyan/5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan">
                <ShieldCheck className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-neon-cyan uppercase">
                {tr('badge', '100% CLIENT-SIDE METADATA PRIVACY')}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              {tr('heroTitle1', 'Remove AI Provenance.')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-emerald-400 to-teal-300">
                {tr('heroTitle2', 'Inject Authentic Studio Camera EXIF.')}
              </span>
            </h2>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-body">
              {tr('heroDesc', 'Social platforms like Instagram, TikTok, and LinkedIn automatically brand AI-generated portraits with "Made with AI" labels by parsing hidden C2PA manifests. HelpMyIMG losslessly strips these digital tracking headers in your browser and injects authentic Canon 5D Mark IV studio camera metadata.')}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tr('pillLossless', 'Lossless Byte-Slicing')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tr('pillZeroUpload', 'Zero Server Uploads')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tr('pillPresets', '5 Professional Presets')}</span>
              </div>
            </div>
          </div>

          {/* Visual Architecture Comparison Card */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative rounded-3xl bg-dark-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-neon-cyan" />
                  <span>HEADER INSPECTION ENGINE</span>
                </span>
                <span className="text-emerald-400">v2.4 LOCAL WASM/JS</span>
              </div>

              {/* Before State */}
              <div className="p-4 rounded-2xl bg-dark-950/80 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" />
                    <span>RAW AI GENERATED IMAGE</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-[10px] font-mono">FLAGGED</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400 space-y-1">
                  <div>[APP11 0xFFEB]: C2PA Manifest (Google LLC / SynthID)</div>
                  <div>[EXIF Camera]: Missing / Null (Empty AI Pattern)</div>
                  <div>[Social Status]: Auto-Labeled "Made with AI" on Meta/TikTok</div>
                </div>
              </div>

              {/* Arrow Indicator */}
              <div className="flex justify-center -my-1">
                <div className="w-8 h-8 rounded-full bg-dark-800 border border-slate-700 flex items-center justify-center text-neon-cyan shadow-md">
                  <Zap className="w-4 h-4" />
                </div>
              </div>

              {/* After State */}
              <div className="p-4 rounded-2xl bg-dark-950/80 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>HELPMYIMG STUDIO VERIFIED</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] font-mono">AUTHENTIC</span>
                </div>
                <div className="font-mono text-[11px] text-slate-400 space-y-1">
                  <div>[C2PA Header]: Stripped Losslessly (0 Bytes Recompressed)</div>
                  <div>[Camera]: Canon EOS 5D Mark IV • EF 85mm f/1.4L IS USM</div>
                  <div>[Lighting]: 1/160s • f/5.6 • ISO 100 • Strobe Flash Fired</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4 CORE CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h3 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase">
            {tr('capabilitiesTag', 'ADVANCED FORENSIC TOOLS')}
          </h3>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-white">
            {tr('capabilitiesTitle', 'Designed for Creators, Pass Photos & Absolute Privacy')}
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-body">
            {tr('capabilitiesDesc', 'Whether preparing formal visa portraits or publishing creative headshots on social networks, HelpMyIMG gives you complete control over your photo metadata.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
              <EyeOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              {tr('feat1Title', 'C2PA Manifest Scrubber')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {tr('feat1Desc', 'Detects and slices away JPEG APP11 (JUMBF) and PNG caBX provenance manifests inserted by Google Gemini, Imagen, DALL-E, and Photoshop Content Credentials.')}
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              {tr('feat2Title', 'Studio DSLR Presets')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {tr('feat2Desc', 'Inject authentic EXIF 2.31 tags from professional studio setups like Canon 5D Mark IV, Sony A7 IV, Fujifilm X-T5, and iPhone 16 Pro with calibrated strobe flash values.')}
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              {tr('feat3Title', '100% In-Browser Privacy')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {tr('feat3Desc', 'Never upload your personal facial photos, passport scans, or confidential headshots to remote servers. All binary manipulation executes locally in your browser memory.')}
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-heading font-bold text-white">
              {tr('feat4Title', 'Batch Processing')}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {tr('feat4Desc', 'Process dozens of images at once. Clean AI manifests across an entire batch and download them simultaneously in a single, high-speed Zip archive.')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3: DETAILED FEATURE COMPARISON TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h3 className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            {tr('tableTag', 'COMPETITIVE BENCHMARK')}
          </h3>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            {tr('tableTitle', 'How HelpMyIMG Compares to Other Solutions')}
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-dark-900 shadow-2xl">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-dark-950/60 font-mono text-[11px] text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">{tr('colFeature', 'Feature / Capability')}</th>
                <th className="py-4 px-6 text-neon-cyan font-bold bg-neon-cyan/5">HelpMyIMG</th>
                <th className="py-4 px-6">{tr('colCloud', 'Cloud EXIF Websites')}</th>
                <th className="py-4 px-6">{tr('colDesktop', 'Desktop ExifTool CLI')}</th>
                <th className="py-4 px-6">{tr('colEditors', 'Standard Photo Editors')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-body text-slate-300">
              <tr>
                <td className="py-4 px-6 font-semibold text-white">{tr('rowPrivacy', '100% In-Browser (Zero Cloud Upload)')}</td>
                <td className="py-4 px-6 text-emerald-400 font-bold bg-neon-cyan/5 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Yes (Local)</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> No (Uploaded to Cloud)</td>
                <td className="py-4 px-6 text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Yes (Local Terminal)</td>
                <td className="py-4 px-6 text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Yes (Desktop App)</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">{tr('rowC2pa', 'Lossless C2PA & JUMBF Stripping')}</td>
                <td className="py-4 px-6 text-emerald-400 font-bold bg-neon-cyan/5 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Yes (0ms Lossless)</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> Recompresses JPEG</td>
                <td className="py-4 px-6 text-emerald-400 font-bold flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Yes (via arguments)</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> Often Adds C2PA</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">{tr('rowStudio', '1-Click Studio Camera Presets')}</td>
                <td className="py-4 px-6 text-emerald-400 font-bold bg-neon-cyan/5 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Yes (Canon/Sony/Fuji)</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> Manual Field Input</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> Complex CLI Scripts</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> No Presets</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">{tr('rowMobile', 'Mobile & Tablet Browser Friendly')}</td>
                <td className="py-4 px-6 text-emerald-400 font-bold bg-neon-cyan/5 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 shrink-0" /> Full Touch UI</td>
                <td className="py-4 px-6 text-amber-400 flex items-center gap-1.5">⚠️ Cluttered with Ads</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> Desktop CLI Only</td>
                <td className="py-4 px-6 text-rose-400 flex items-center gap-1.5"><XCircle className="w-4 h-4 shrink-0" /> Paid Mobile Apps</td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-semibold text-white">{tr('rowPrice', 'Pricing & Subscription')}</td>
                <td className="py-4 px-6 text-neon-cyan font-bold bg-neon-cyan/5">100% Free Forever</td>
                <td className="py-4 px-6 text-slate-400">Freemium / Paywalls</td>
                <td className="py-4 px-6 text-slate-400">Free Open Source</td>
                <td className="py-4 px-6 text-slate-400">$20 - $50/month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION 4: TECHNICAL SPECIFICATION DEEP DIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-dark-900 border border-slate-800 p-8 lg:p-12 space-y-8">
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-neon-cyan uppercase tracking-widest">
              {tr('specTag', 'TECHNICAL WHITE PAPER')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
              {tr('specTitle', 'Understanding C2PA Manifests vs SynthID Watermarks')}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-body">
              {tr('specDesc', 'AI-generated images from models such as Google Gemini, Imagen, and DALL-E 3 carry multiple forensic signatures. It is critical to understand how each layer functions.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs sm:text-sm font-body">
            <div className="p-6 rounded-2xl bg-dark-950 border border-slate-800/80 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-neon-cyan" />
                <span>{tr('c2paLayerTitle', '1. The Container Layer (C2PA / JUMBF)')}</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {tr('c2paLayerDesc', 'C2PA stores cryptographic certificates inside standard container chunks: APP11 (0xFFEB) in JPEGs and the caBX chunk in PNGs. Automated bots on Instagram and LinkedIn read this specific header to slap on the "AI-generated" badge. HelpMyIMG removes this segment with bitwise byte-slicing without touching image pixels.')}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-dark-950 border border-slate-800/80 space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <span>{tr('exifLayerTitle', '2. The EXIF Photography Layer')}</span>
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {tr('exifLayerDesc', 'Real cameras record exposure metadata: shutter speed (e.g. 1/160s), lens focal length (85mm), ISO speed ratings, and flash strobe fire states. AI generators output empty EXIF headers. By injecting realistic DSLR parameters, your photo regains standard photographic properties accepted by passport systems and portrait galleries.')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: STEP-BY-STEP WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h3 className="text-xs font-mono font-bold tracking-widest text-neon-cyan uppercase">
            {tr('howTag', 'HOW IT WORKS')}
          </h3>
          <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
            {tr('howTitle', 'Three Simple Steps to Verified Studio Photos')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 relative">
            <span className="text-4xl font-heading font-black text-neon-cyan/20">01</span>
            <h3 className="text-lg font-bold text-white">{tr('step1Title', 'Drop or Upload Photo')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {tr('step1Desc', 'Drag and drop your AI-generated portrait, pass photo, or headshot into the workspace. The live inspector instantly scans for C2PA manifests and missing camera tags.')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 relative">
            <span className="text-4xl font-heading font-black text-emerald-500/20">02</span>
            <h3 className="text-lg font-bold text-white">{tr('step2Title', 'Select Studio Preset')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {tr('step2Desc', 'Choose from Canon EOS 5D Mark IV, Sony Alpha 7 IV, Fujifilm X-T5, or iPhone 16 Pro. Optionally customize the studio name and timestamp.')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 space-y-4 relative">
            <span className="text-4xl font-heading font-black text-indigo-500/20">03</span>
            <h3 className="text-lg font-bold text-white">{tr('step3Title', 'Instant Lossless Download')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-body">
              {tr('step3Desc', 'Click Apply to strip the C2PA header and inject professional EXIF. Download your clean photo instantly with zero server uploads.')}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};
