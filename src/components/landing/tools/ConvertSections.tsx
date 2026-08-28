import { useTranslation } from '../../../context/LanguageContext';
import { ArrowRightLeft, Image as ImageIcon, Zap, Upload, LayoutGrid, FileType2, Download } from 'lucide-react';

export const ConvertSections: React.FC = () => {
  const { t } = useTranslation();
  // Using direct flat keys that we will inject
  const tr = (key: string, def: string = '') => t(`landing.convert.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden">
      
      {/* HERO / PIPELINE LAYOUT */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#06B6D4]/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#EC4899]/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800 border border-[#06B6D4]/30 shadow-xl shadow-[#06B6D4]/10 group hover:border-[#06B6D4]/60 transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#06B6D4]/20 text-[#06B6D4]">
                <FileType2 className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold tracking-wide text-[#06B6D4] uppercase font-mono">
                {tr('heroBadge', 'UNIVERSAL COMPATIBILITY')}
              </span>
            </div>

            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              <span className="block">{tr('heroTitle', 'Format Transformer.')}</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#06B6D4] to-[#EC4899] block mt-2">
                {tr('heroTitle2', 'Zero Quality Loss.')}
              </span>
            </h2>

            <p className="text-slate-400 mt-4 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Seamlessly convert between WebP, PNG, JPG, and AVIF. Extremely fast bulk processing running entirely on your local machine.')}
            </p>
          </div>

          <div className="flex-1 w-full relative z-10">
            {/* Pipeline Visualization */}
            <div className="relative w-full aspect-square md:aspect-[4/3] rounded-[2.5rem] bg-dark-900 border border-[#06B6D4]/30 backdrop-blur-xl p-6 shadow-2xl flex flex-col items-center justify-center overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#06B6D4]/5 to-[#EC4899]/5" />
              
              <div className="flex items-center justify-between w-full max-w-sm relative z-10">
                {/* Input Node */}
                <div className="w-24 h-24 rounded-2xl bg-dark-800 border border-dark-600 shadow-xl flex flex-col items-center justify-center gap-2 relative group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="w-10 h-10 rounded-full bg-[#EC4899]/20 flex items-center justify-center text-[#EC4899]">
                     <FileType2 className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-bold text-slate-300">WEBP</span>
                   
                   {/* Data Packet */}
                   <div className="absolute top-1/2 -right-4 w-3 h-3 bg-[#EC4899] rounded-full shadow-[0_0_10px_#EC4899] opacity-0 group-hover:opacity-100 group-hover:animate-[flow_2s_ease-in-out_infinite]" />
                </div>
                
                {/* Processing Core */}
                <div className="w-20 h-20 rounded-full bg-dark-950 border-2 border-[#06B6D4]/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center relative z-20 group-hover:scale-110 transition-transform duration-700">
                  <ArrowRightLeft className="w-8 h-8 text-[#06B6D4] group-hover:animate-spin" />
                  
                  {/* Orbiting rings */}
                  <div className="absolute inset-[-10px] border border-[#06B6D4]/30 rounded-full border-t-[#06B6D4] animate-[spin_3s_linear_infinite]" />
                  <div className="absolute inset-[-20px] border border-[#EC4899]/30 rounded-full border-b-[#EC4899] animate-[spin_4s_linear_infinite_reverse]" />
                </div>
                
                {/* Output Node */}
                <div className="w-24 h-24 rounded-2xl bg-dark-800 border border-dark-600 shadow-xl flex flex-col items-center justify-center gap-2 relative group-hover:translate-y-2 transition-transform duration-500">
                   <div className="w-10 h-10 rounded-full bg-[#06B6D4]/20 flex items-center justify-center text-[#06B6D4]">
                     <ImageIcon className="w-5 h-5" />
                   </div>
                   <span className="text-xs font-bold text-slate-300">JPG</span>
                </div>
              </div>

              {/* Data Pipeline Track */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-1 bg-dark-700 rounded-full -z-10 overflow-hidden">
                <div className="w-1/2 h-full bg-gradient-to-r from-[#EC4899] to-[#06B6D4] opacity-0 group-hover:opacity-100 animate-[pulse_2s_ease-in-out_infinite]" />
              </div>

              {/* Floating UI Badges */}
              <div className="absolute bottom-8 glass-panel px-6 py-4 rounded-2xl border border-[#06B6D4]/30 shadow-lg shadow-[#06B6D4]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="flex items-center gap-4 text-sm font-mono text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    CONVERTING
                  </div>
                  <div className="text-slate-400">|</div>
                  <div className="text-[#06B6D4]">24 MB/s</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-900 border border-dark-600 p-10 rounded-[2rem] hover:border-[#06B6D4]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#06B6D4]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] mb-8">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat1Title', 'Lightning Fast')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat1Desc', 'Transform huge WebP files into universal JPGs instantly, utilizing the full processing power of your device.')}</p>
          </div>

          <div className="bg-dark-900 border border-dark-600 p-10 rounded-[2rem] hover:border-[#EC4899]/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EC4899]/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-[#EC4899]/10 flex items-center justify-center text-[#EC4899] mb-8">
              <LayoutGrid className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat2Title', 'Bulk Processing')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat2Desc', 'Need to convert 500 images? Just drag and drop the entire folder. We handle unlimited batch conversions effortlessly.')}</p>
          </div>

          <div className="bg-dark-900 border border-dark-600 p-10 rounded-[2rem] hover:border-indigo-400/50 transition-colors group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-400/5 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500" />
            <div className="w-16 h-16 rounded-2xl bg-indigo-400/10 flex items-center justify-center text-indigo-400 mb-8">
              <FileType2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat3Title', 'Broad Support')}</h3>
            <p className="text-slate-400 leading-relaxed text-lg">{tr('feat3Desc', 'Full support for next-gen formats like WebP alongside classic formats like JPG, PNG, and BMP.')}</p>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="glass-panel rounded-[3rem] p-10 md:p-16 border-[#06B6D4]/20 bg-dark-900/80 relative overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#06B6D4]/10 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#06B6D4] bg-[#06B6D4]/10 px-3 py-1.5 rounded-full border border-[#06B6D4]/30 block w-max mx-auto mb-4">
              {tr('stepsTag', 'WORKFLOW')}
            </span>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.35rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('stepsTitle', 'Convert in 3 Steps')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            <div className="text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
              <div className="w-24 h-24 mx-auto bg-dark-950 rounded-full border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#EC4899]/50 transition-all duration-300 shadow-xl">
                <Upload className="w-10 h-10 text-slate-400 group-hover:text-[#EC4899]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-3">{tr('s1Title', 'Upload')}</h3>
              <p className="text-lg text-slate-400">{tr('s1Desc', 'Drag and drop your images or folders into the workspace.')}</p>
            </div>

            <div className="text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
              <div className="hidden md:block absolute top-12 -left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent -z-10 group-hover:via-[#06B6D4] transition-colors duration-500" />
              
              <div className="w-24 h-24 mx-auto bg-dark-950 rounded-full border border-[#06B6D4]/50 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                <ArrowRightLeft className="w-10 h-10 text-[#06B6D4]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-3">{tr('s2Title', 'Format')}</h3>
              <p className="text-lg text-slate-400">{tr('s2Desc', 'Select your desired output format from the dropdown menu.')}</p>
            </div>

            <div className="text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent">
              <div className="hidden md:block absolute top-12 -left-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent -z-10" />
              
              <div className="w-24 h-24 mx-auto bg-dark-950 rounded-full border border-dark-600 flex items-center justify-center mb-6 group-hover:border-[#10B981]/50 transition-all duration-300 shadow-xl">
                <Download className="w-10 h-10 text-slate-400 group-hover:text-[#10B981]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading sm:mb-3">{tr('s3Title', 'Export')}</h3>
              <p className="text-lg text-slate-400">{tr('s3Desc', 'Click export and get your newly formatted files instantly.')}</p>
            </div>
          </div>
        </div>
      </section>

    
          </div>
  );
};
