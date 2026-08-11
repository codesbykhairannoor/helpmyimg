// src/components/landing/tools/CompressSections.tsx
import React from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { Zap, FileArchive, Activity, ShieldCheck, Gauge, Image as ImageIcon } from 'lucide-react';

export const CompressSections: React.FC = () => {
  const { t } = useTranslation();
  const tr = (key: string, def: string = '') => t(`landing.compress.redesign.${key}`, { defaultValue: def });

  return (
    <div className="space-y-16 lg:space-y-24 py-16 text-slate-100 overflow-hidden bg-dark-900">
      
      {/* HERO / WHY SECTION - SPEED & SIZE REDUCTION THEME */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          
          <div className="flex-1 w-full relative z-10">
            {/* Visual Representation of Compression */}
            <div className="relative bg-dark-800 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8 border border-dark-600/50 shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#12DA91]/5 to-transparent pointer-events-none" />
              
              <div className="flex flex-col gap-6 relative z-10">
                <div className="bg-dark-900 rounded-2xl p-4 sm:p-6 border border-dark-700 flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                    <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center shrink-0">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-300 truncate max-w-[120px] sm:max-w-xs text-sm sm:text-base">original_photo.jpg</div>
                      <div className="text-xs text-rose-400 font-mono">5.2 MB</div>
                    </div>
                  </div>
                  <div className="w-16 h-16 border-4 border-rose-500 rounded-full border-l-transparent animate-spin" style={{ animationDuration: '3s' }} />
                </div>

                <div className="flex justify-center -my-2 z-20">
                  <div className="bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 p-2 rounded-full shadow-[0_0_15px_rgba(18,218,145,0.4)]">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-dark-900 rounded-2xl p-4 sm:p-6 border border-[#12DA91]/30 shadow-[0_0_15px_rgba(18,218,145,0.1)] flex items-center justify-between">
                  <div className="flex items-center gap-3 sm:gap-4 overflow-hidden pr-2">
                    <div className="w-12 h-12 bg-[#12DA91]/20 text-[#12DA91] rounded-xl flex items-center justify-center shrink-0">
                      <FileArchive className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white truncate max-w-[110px] sm:max-w-xs text-sm sm:text-base">compressed_photo.jpg</div>
                      <div className="text-xs text-[#12DA91] font-mono tracking-wider">185 KB</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Saved</div>
                    <div className="text-lg font-bold text-[#12DA91]">-96%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12DA91]/10 border border-[#12DA91]/30 text-[#12DA91] font-mono text-xs font-bold uppercase tracking-wider">
              <Gauge className="w-4 h-4" />
              {tr('heroBadge', 'SMART COMPRESSION')}
            </div>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('heroTitle', 'Shrink Image File Size up to 90% Instantly')}
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl mx-auto lg:mx-0 font-body" style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
              {tr('heroDesc', 'Reduce the size of your photos without losing visual quality. Perfect for websites, emails, and strict upload limits.')}
            </p>
          </div>
        </div>
      </section>

      {/* COMPRESSION SPECS - LIST LAYOUT */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="bg-dark-800 border border-dark-600 rounded-[2rem] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dark-600">
            
            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <Activity className="w-10 h-10 text-[#05DAED] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">{tr('feat1Badge', 'NO QUALITY LOSS')}</div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat1Title', 'Smart Optimization')}</h3>
              <p className="text-slate-400">{tr('feat1Desc', 'Automatically finds the perfect balance between minimal file size and maximum image quality.')}</p>
            </div>

            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <ShieldCheck className="w-10 h-10 text-[#12DA91] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#12DA91]/30">{tr('feat2Badge', '100% PRIVATE')}</div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat2Title', 'Zero Uploads')}</h3>
              <p className="text-slate-400">{tr('feat2Desc', 'Like all our tools, compression happens right in your web browser. Nothing goes to any server.')}</p>
            </div>

            <div className="p-8 sm:p-12 group hover:bg-dark-800/80 transition-colors">
              <FileArchive className="w-10 h-10 text-[#05DAED] mb-6 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1 block w-max mb-4 rounded-full border border-[#05DAED]/30">{tr('feat3Badge', 'ANY FORMAT')}</div>
              <h3 className="text-xl sm:text-2xl font-bold font-heading mb-4">{tr('feat3Title', 'Broad Support')}</h3>
              <p className="text-slate-400">{tr('feat3Desc', 'Works with standard JPG and PNG formats, as well as modern ultra-efficient WEBP formats.')}</p>
            </div>

          </div>
        </div>
      </section>

      {/* WHO IS IT FOR - INFO BLOCKS */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mb-4">
              {tr('whoTag', 'WHO IS IT FOR')}
            </span>
            <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
              {tr('whoTitle', 'Built for Web & Media')}
            </h2>
            <p className="text-slate-400 mt-4 max-w-2xl font-body" style={{ fontSize: '1.15rem', lineHeight: 1.8 }}>
              {tr('whoDesc', 'Perfect for developers, designers, and social media managers who need highly optimized images.')}
            </p>
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600 border-l-4 border-l-[#05DAED] shadow-lg group hover:bg-dark-800/80 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">{tr('who1Title', 'Web Developers')}</h3>
              <p className="text-slate-400 mb-4">{tr('who1Desc', 'Improve PageSpeed scores and decrease load times without sacrificing image quality.')}</p>
              <div className="inline-block px-3 py-1 bg-[#05DAED]/10 text-[#05DAED] text-xs font-mono rounded">
                {tr('who1Tags', 'SEO OPTIMIZATION')}
              </div>
            </div>

            <div className="bg-dark-800 p-8 rounded-3xl border border-dark-600 border-l-4 border-l-[#12DA91] shadow-lg group hover:bg-dark-800/80 transition-colors">
              <h3 className="text-xl font-bold text-white mb-2">{tr('who2Title', 'Content Creators')}</h3>
              <p className="text-slate-400 mb-4">{tr('who2Desc', 'Meet strict upload size limits for platforms like Discord, Twitter, or email attachments.')}</p>
              <div className="inline-block px-3 py-1 bg-[#12DA91]/10 text-[#12DA91] text-xs font-mono rounded">
                {tr('who2Tags', 'SOCIAL MEDIA')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - VERTICAL STEPS (Different from Remove BG) */}
      <section className="max-w-5xl mx-auto w-full relative" style={{ padding: '80px 24px', marginBottom: '80px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {tr('stepsTag', 'HOW IT WORKS')}
          </span>
          <h2 className="font-heading font-extrabold text-white mt-4 sm:mt-6 tracking-tight" style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 800, lineHeight: 1.2 }}>
            {tr('stepsTitle', '3 Steps to Optimize')}
          </h2>
        </div>
        
        <div className="space-y-8">
          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              1
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{tr('s1Title', 'Upload Images')}</h3>
              <p className="text-slate-400">{tr('s1Desc', 'Drag and drop your photos into the compression workspace.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              2
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{tr('s2Title', 'Set Compression Level')}</h3>
              <p className="text-slate-400">{tr('s2Desc', 'Adjust the quality slider to find the right balance between visual quality and file size.')}</p>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-dark-800/50 p-6 sm:p-8 rounded-[2rem] border border-dark-600">
            <div className="w-16 h-16 shrink-0 bg-dark-700 rounded-full flex items-center justify-center text-2xl font-heading font-bold text-white border border-dark-500 shadow-inner">
              3
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{tr('s3Title', 'Save Storage')}</h3>
              <p className="text-slate-400">{tr('s3Desc', 'Download your optimized images and enjoy reduced file sizes.')}</p>
            </div>
          </div>
        </div>
      </section>

    
          </div>
  );
};
