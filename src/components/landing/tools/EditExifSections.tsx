import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  Camera, 
  Sparkles, 
  Cpu, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Clock, 
  User, 
  Calendar, 
  Award,
  Globe,
  Smartphone,
  Eye,
  FileCheck
} from 'lucide-react';

export const EditExifSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`landing.editexif.${key}`, { defaultValue: def });

  return (
    <div className="space-y-24 lg:space-y-36 py-16 text-slate-100 overflow-hidden">
      
      {/* SECTION 1: HERO SHOWCASE & STUDIO CAMERA INJECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-neon-cyan/15 to-neon-indigo/15 rounded-full blur-[140px] -z-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-neon-cyan/30 shadow-lg shadow-neon-cyan/5">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-neon-cyan/20 text-neon-cyan">
                <Camera className="w-3.5 h-3.5" />
              </span>
              <span className="text-xs font-mono font-bold tracking-wider text-neon-cyan uppercase">
                {tr('badge', 'PROFESSIONAL STUDIO DSLR EXIF INJECTOR')}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              {tr('heroTitle1', 'Edit Photo EXIF Metadata.')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-teal-300 to-neon-indigo">
                {tr('heroTitle2', 'Inject Authentic Studio DSLR Presets.')}
              </span>
            </h2>

            <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-body">
              {tr('heroDesc', 'AI-generated images and web downloads typically carry stripped, empty, or synthetic metadata headers that raise flags on official portals and social networks. HelpMyIMG allows you to easily inject authentic Canon 5D Mark IV, Sony Alpha 7 IV, Fujifilm X-T5, or iPhone 16 Pro camera metadata with calibrated 300 DPI, strobe flash, and studio focal lengths directly in your browser.')}
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tr('pillPresets', 'Authentic DSLR Camera Presets')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tr('pillZeroLoss', 'True 300 DPI Studio Output')}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-dark-900 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{tr('pillPrivacy', '100% In-Browser Memory (Zero Uploads)')}</span>
              </div>
            </div>
          </div>

          {/* Interactive EXIF Data Card Mockup */}
          <div className="flex-1 w-full max-w-lg">
            <div className="relative rounded-3xl bg-dark-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-neon-cyan" />
                  <span>EXIF 2.31 BINARY PARSER</span>
                </span>
                <span className="text-emerald-400">STATUS: VERIFIED</span>
              </div>

              {/* Injected Camera Specifications Box */}
              <div className="p-4 rounded-2xl bg-dark-950/80 border border-neon-cyan/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-neon-cyan">
                  <span className="flex items-center gap-1.5">
                    <Camera className="w-4 h-4" />
                    <span>CANON EOS 5D MARK IV (STUDIO PASS)</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-neon-cyan/20 text-[10px] font-mono text-neon-cyan">
                    CALIBRATED
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                  <div className="p-2 rounded-lg bg-dark-900 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">LENS</span>
                    <span className="font-semibold text-white">EF 85mm f/1.4L IS USM</span>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-900 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">SHUTTER / APERTURE</span>
                    <span className="font-semibold text-white">1/160s • f/8.0</span>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-900 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">ISO SPEED</span>
                    <span className="font-semibold text-white">ISO 100 (Manual)</span>
                  </div>
                  <div className="p-2 rounded-lg bg-dark-900 border border-slate-800/80">
                    <span className="text-slate-500 block text-[10px]">STROBE FLASH</span>
                    <span className="font-semibold text-emerald-400">Fired (Return Detected)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>DPI: 300 x 300 (Print Ready)</span>
                  <span>COLOR: sRGB IEC61966-2.1</span>
                </div>
              </div>

              {/* Live Tagging Features */}
              <div className="p-3.5 rounded-xl bg-dark-800/50 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">Custom Artist & Copyright:</span>
                <span className="font-mono text-neon-cyan font-bold">Injectable & Editable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: 4 PROFESSIONAL CAMERA PRESETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3.5 py-1.5 rounded-full border border-neon-cyan/30 inline-block">
            {tr('presetBadge', 'CURATED PHOTOGRAPHY HARDWARE')}
          </span>
          <h2 className="font-heading font-extrabold text-white text-3xl sm:text-4xl tracking-tight">
            {tr('presetTitle', 'Four Authentic Camera Setups Tailored for Every Scenario')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-body">
            {tr('presetSubtitle', 'Every preset includes mathematically accurate focal lengths, optical lens designations, flash firing modes, and official manufacturer serial metadata.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Preset 1: Canon 5D */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-neon-cyan/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center text-neon-cyan group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                {tr('passPhotoPill', 'Formal Pass Photo & Visa')}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                {tr('presetCanonTitle', 'Canon EOS 5D Mark IV')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-body leading-relaxed">
              {tr('presetCanonDesc', 'The legendary industry standard for passport, visa, and corporate portraiture. Injects EF 85mm f/1.4L lens tags with 1/160s strobe sync and 300 DPI print metadata.')}
            </p>
            <div className="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
              <div>• Lens: EF 85mm f/1.4L IS USM</div>
              <div>• Exposure: 1/160s, f/8.0, ISO 100</div>
              <div>• Flash: Studio Strobe Fired</div>
            </div>
          </div>

          {/* Preset 2: Sony A7 IV */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-neon-cyan/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold tracking-wider">
                {tr('commercialPill', 'Commercial & Editorial')}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                {tr('presetSonyTitle', 'Sony Alpha 7 IV')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-body leading-relaxed">
              {tr('presetSonyDesc', 'Modern high-resolution mirrorless benchmark. Injects premium Sony FE 50mm f/1.2 GM prime lens data with creamy bokeh parameters and ultra-low noise ISO values.')}
            </p>
            <div className="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
              <div>• Lens: FE 50mm f/1.2 GM</div>
              <div>• Exposure: 1/200s, f/2.8, ISO 100</div>
              <div>• Flash: Off / Natural Light</div>
            </div>
          </div>

          {/* Preset 3: Fujifilm X-T5 */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-neon-cyan/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase font-bold tracking-wider">
                {tr('analogPill', 'Cinematic Portrait')}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                {tr('presetFujiTitle', 'Fujifilm X-T5')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-body leading-relaxed">
              {tr('presetFujiDesc', 'Prized for analog color rendition and natural skin tones. Injects XF 56mm f/1.2 R WR portrait optics metadata with authentic film simulation camera tags.')}
            </p>
            <div className="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
              <div>• Lens: XF 56mm f/1.2 R WR</div>
              <div>• Exposure: 1/250s, f/2.0, ISO 125</div>
              <div>• White Balance: Manual Studio Daylight</div>
            </div>
          </div>

          {/* Preset 4: iPhone 16 Pro */}
          <div className="p-6 rounded-3xl bg-dark-900 border border-slate-800 hover:border-neon-cyan/50 transition-all duration-300 space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
                {tr('mobilePill', 'Social & Influencer')}
              </span>
              <h3 className="text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                {tr('presetIphoneTitle', 'Apple iPhone 16 Pro')}
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-body leading-relaxed">
              {tr('presetIphoneDesc', 'Native smartphone computational camera metadata. Simulates the 24mm f/1.78 main sensor with iOS software tags, perfect for organic social media sharing.')}
            </p>
            <div className="pt-2 border-t border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
              <div>• Lens: iPhone 16 Pro Back Camera 6.76mm</div>
              <div>• Exposure: 1/120s, f/1.78, ISO 64</div>
              <div>• Software: iOS 18.1 Camera Engine</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: KEY ADVANTAGES & CAPABILITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-400/30 inline-block">
            {tr('capabilitiesTag', 'ADVANCED EXIF CAPABILITIES')}
          </span>
          <h2 className="font-heading font-extrabold text-white text-3xl sm:text-4xl tracking-tight">
            {tr('featTitle', 'Full Control Over Every Byte of Photography Metadata')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-body">
            {tr('featSubtitle', 'Unlike standard converters that wipe all EXIF or reduce image quality, HelpMyIMG performs surgical binary injection directly on your original image stream.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan">
              <Sliders className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {tr('feat1Title', 'Custom Photographer, Studio & Copyright Tags')}
            </h3>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              {tr('feat1Desc', 'Brand your images professionally. Customize the EXIF Artist tag, legal copyright notice, and custom date taken timestamp. Ensure every exported photo reflects your official studio credentials.')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {tr('feat2Title', 'Zero Recompression & Pixel Preservation')}
            </h3>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              {tr('feat2Desc', 'HelpMyIMG uses lossless binary buffer replacement to inject EXIF bytes into APP1 (0xFFE1) segments without re-encoding DCT coefficients. Your photo retains 100% of its sharp textures and color fidelity.')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-neon-indigo/10 border border-neon-indigo/20 flex items-center justify-center text-neon-indigo">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {tr('feat3Title', 'Pass Photo & Visa Portal Compliance')}
            </h3>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              {tr('feat3Desc', 'Strict consular and official document upload systems reject images that lack camera metadata or exhibit 72 DPI screen resolutions. Our Canon 5D studio preset automatically encodes 300 DPI print markers for guaranteed portal acceptance.')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 hover:border-slate-700 transition-colors space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">
              {tr('feat4Title', '100% Private Client-Side Memory Processing')}
            </h3>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              {tr('feat4Desc', 'Your private portraits, family albums, and business headshots never touch a cloud server. All binary manipulation executes locally in your device RAM via high-performance JavaScript and WebAssembly.')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: HOW IT WORKS STEP-BY-STEP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3.5 py-1.5 rounded-full border border-neon-cyan/30 inline-block">
            {tr('howTag', 'STEP-BY-STEP WORKFLOW')}
          </span>
          <h2 className="font-heading font-extrabold text-white text-3xl sm:text-4xl tracking-tight">
            {tr('howTitle', 'Three Simple Steps to Inject Studio DSLR EXIF')}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-body">
            {tr('howSubtitle', 'Transform synthetic or metadata-stripped photos into authentic studio-grade files in seconds.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 relative group space-y-4">
            <span className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-mono font-bold flex items-center justify-center text-sm">
              01
            </span>
            <h3 className="text-lg font-bold text-white">{tr('step1Title', 'Upload or Drop Photo')}</h3>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              {tr('step1Desc', 'Drag and drop any JPG, PNG, or WEBP photo into the workspace. The live inspector automatically reads and displays existing camera model, lens, shutter, and aperture values.')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 relative group space-y-4">
            <span className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-mono font-bold flex items-center justify-center text-sm">
              02
            </span>
            <h3 className="text-lg font-bold text-white">{tr('step2Title', 'Select Studio Preset')}</h3>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              {tr('step2Desc', 'Choose your target camera hardware preset (Canon 5D, Sony A7, Fujifilm, or iPhone). Expand the custom menu to specify your photographer name, studio title, or shooting date.')}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-dark-900 border border-slate-800 relative group space-y-4">
            <span className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan font-mono font-bold flex items-center justify-center text-sm">
              03
            </span>
            <h3 className="text-lg font-bold text-white">{tr('step3Title', 'Inject & Download Instantly')}</h3>
            <p className="text-slate-400 text-sm font-body leading-relaxed">
              {tr('step3Desc', 'Click Inject Studio DSLR EXIF. Your updated image is ready for download in under 5 milliseconds with calibrated 300 DPI headers and zero loss in pixel fidelity.')}
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: COMPARISON BENCHMARK TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3.5 py-1.5 rounded-full border border-neon-cyan/30 inline-block">
            {tr('tableTag', 'EXIF TOOLS BENCHMARK')}
          </span>
          <h2 className="font-heading font-extrabold text-white text-3xl sm:text-4xl tracking-tight">
            {tr('tableTitle', 'How HelpMyIMG Compares to Alternative EXIF Tools')}
          </h2>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-dark-900/60 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-dark-950/80 text-xs font-mono text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th scope="col" className="px-6 py-4">{tr('colFeature', 'Feature / Capability')}</th>
                <th scope="col" className="px-6 py-4 text-neon-cyan font-bold">HelpMyIMG</th>
                <th scope="col" className="px-6 py-4">{tr('colCloud', 'Online Cloud Converters')}</th>
                <th scope="col" className="px-6 py-4">{tr('colDesktop', 'Desktop ExifTool CLI')}</th>
                <th scope="col" className="px-6 py-4">{tr('colEditors', 'Desktop Photoshop')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-body">
              <tr className="hover:bg-dark-800/30">
                <td className="px-6 py-4 font-medium text-white">{tr('rowPrivacy', '100% In-Browser (Zero Cloud Upload)')}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold font-mono">100% Client-Side</td>
                <td className="px-6 py-4 text-rose-400 font-mono">Server Upload Required</td>
                <td className="px-6 py-4 text-slate-400 font-mono">Local Only</td>
                <td className="px-6 py-4 text-slate-400 font-mono">Local Only</td>
              </tr>
              <tr className="hover:bg-dark-800/30">
                <td className="px-6 py-4 font-medium text-white">{tr('rowStudio', '1-Click Studio Camera Presets')}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold font-mono">Yes (5 DSLR Presets)</td>
                <td className="px-6 py-4 text-rose-400 font-mono">None (Raw Inputs Only)</td>
                <td className="px-6 py-4 text-amber-400 font-mono">Complex Terminal Flags</td>
                <td className="px-6 py-4 text-rose-400 font-mono">Manual Property Typing</td>
              </tr>
              <tr className="hover:bg-dark-800/30">
                <td className="px-6 py-4 font-medium text-white">{tr('rowDpi', 'Calibrated 300 DPI Print Resolution')}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold font-mono">Automatic</td>
                <td className="px-6 py-4 text-rose-400 font-mono">Defaults to 72 DPI</td>
                <td className="px-6 py-4 text-amber-400 font-mono">Manual Tag Entry</td>
                <td className="px-6 py-4 text-emerald-400 font-mono">Yes (Requires Save As)</td>
              </tr>
              <tr className="hover:bg-dark-800/30">
                <td className="px-6 py-4 font-medium text-white">{tr('rowMobile', 'Mobile & Tablet Browser Friendly')}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold font-mono">Full Support</td>
                <td className="px-6 py-4 text-amber-400 font-mono">Ad-Heavy & Cluttered</td>
                <td className="px-6 py-4 text-rose-400 font-mono">Not Supported</td>
                <td className="px-6 py-4 text-rose-400 font-mono">Desktop License Only</td>
              </tr>
              <tr className="hover:bg-dark-800/30">
                <td className="px-6 py-4 font-medium text-white">{tr('rowPrice', 'Pricing & Subscription')}</td>
                <td className="px-6 py-4 text-emerald-400 font-bold font-mono">100% Free Forever</td>
                <td className="px-6 py-4 text-amber-400 font-mono">Daily File Limits / Paid</td>
                <td className="px-6 py-4 text-slate-400 font-mono">Free Open Source</td>
                <td className="px-6 py-4 text-rose-400 font-mono">$22.99 / Month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
};
