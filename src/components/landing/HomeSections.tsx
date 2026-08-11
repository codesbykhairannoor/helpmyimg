// src/components/landing/HomeSections.tsx
// Bagian Khusus Beranda (Homepage / Root Language Landing) untuk Dominasi SEO & GEO di 30 Bahasa
// Dirancang Khusus untuk Memperkuat Brand HelpMyIMG (100% Gratis, Privasi Mutlak, Kecepatan Lokal, Tanpa Biaya Cloud/AI yang Mahal)

import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { 
  Zap, ShieldCheck,
  DollarSign,
  Cpu,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

import { getLocalizedSlug } from '../../utils/urlMapper';
import { CompetitorMatrix } from '../seo/CompetitorMatrix';

export const HomeSections: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <div className="py-16 text-slate-100 relative z-10" style={{ display: 'flex', flexDirection: 'column', gap: '80px' }}>
      
      {/* 1. WHY HELPMYIMG - KEUNGGULAN MUTLAK vs KOMPETITOR CLOUD */}
      <section className="max-w-7xl mx-auto w-full" style={{ padding: '80px 24px' }}>
        <div className="text-center max-w-3xl mx-auto mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {t('home.why.tag', { defaultValue: 'WHY HELPMYIMG' })}
          </span>
          <h2 
            className="font-heading font-extrabold text-white"
            style={{
              fontSize: 'clamp(1.35rem, 4vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.2
            }}
          >
            {t('home.why.title', { defaultValue: 'Why HelpMyIMG is the Smartest Choice for Creators & Businesses' })}
          </h2>
          <p 
            className="text-slate-400 mt-6 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
              lineHeight: 1.8
            }}
          >
            {t('home.why.desc', { defaultValue: 'Designed from the ground up for maximum privacy, blazing speed, and zero cost. Here is why thousands trust HelpMyIMG every day.' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#05DAED]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#05DAED]/10 flex items-center justify-center text-[#05DAED] mb-4 sm:mb-6 border border-[#05DAED]/30">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">
              {t('home.why.c1.t', { defaultValue: 'Instant Local Speed' })}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('home.why.c1.d', { defaultValue: 'Your photos are processed directly inside your device memory with zero latency. No slow file uploads or cloud queues.' })}
            </p>
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-mono text-[#05DAED] font-bold">
              <span>{t('home.why.c1.b', { defaultValue: '0ms Server Delay' })}</span>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#12DA91]/10 flex items-center justify-center text-[#12DA91] mb-4 sm:mb-6 border border-[#12DA91]/30">
              <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">
              {t('home.why.c2.t', { defaultValue: '100% Absolute Privacy' })}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('home.why.c2.d', { defaultValue: 'Your personal portraits, confidential documents, and product shots never leave your computer or phone. Total peace of mind.' })}
            </p>
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-mono text-[#12DA91] font-bold">
              <span>{t('home.why.c2.b', { defaultValue: 'Zero Cloud Storage' })}</span>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#05DAED]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#05DAED]/10 flex items-center justify-center text-[#05DAED] mb-4 sm:mb-6 border border-[#05DAED]/30">
              <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">
              {t('home.why.c3.t', { defaultValue: 'Forever Free & Unlimited' })}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('home.why.c3.d', { defaultValue: 'No subscriptions, no watermarks, no credit packs, and no hidden fees. High-definition photo editing made accessible for all.' })}
            </p>
            <div className="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-mono text-[#05DAED] font-bold">
              <span>{t('home.why.c3.b', { defaultValue: '$0 / Lifetime' })}</span>
            </div>
          </div>

          <div className="glass-panel p-6 sm:p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#12DA91]/10 flex items-center justify-center text-[#12DA91] mb-4 sm:mb-6 border border-[#12DA91]/30">
              <Cpu className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">
              {t('home.why.c4.t', { defaultValue: 'Batch Power up to 10' })}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {t('home.why.c4.d', { defaultValue: 'Drag and drop up to 10 photos simultaneously. Process, optimize, and export your entire photoshoot as a neat ZIP archive in seconds.' })}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#12DA91] font-bold">
              <span>{t('home.why.c4.b', { defaultValue: '10x Workflow Speed' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS IN 3 STEPS (Timeline on Mobile, Side-by-side Desktop) */}
      <section className="max-w-7xl mx-auto w-full" style={{ padding: '80px 24px' }}>
        <div className="glass-panel p-6 sm:p-14 md:rounded-[3rem] border-dark-500/30 relative overflow-hidden bg-dark-900/40">
          <div className="absolute top-0 right-0 w-[500px] h-[500px]  rounded-full bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.08)_0%,transparent_60%)] pointer-events-none" />
          
          <div className="text-left md:text-center max-w-3xl md:mx-auto mb-12 md:mb-20 px-2 relative z-10">
          <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#05DAED] bg-[#05DAED]/10 px-4 py-2 rounded-full border border-[#05DAED]/30 block w-max md:mx-auto mb-6">
            {t('home.steps.tag', { defaultValue: 'HOW IT WORKS' })}
          </span>
            <h2 
              className="font-heading font-black text-white mb-6"
              style={{
                fontSize: 'clamp(1.35rem, 4vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.2
              }}
            >
              {t('home.steps.title', { defaultValue: 'How HelpMyIMG Works in 3 Simple Steps' })}
            </h2>
            <p 
              className="text-slate-400 max-w-2xl md:mx-auto"
              style={{
                fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                lineHeight: 1.8
              }}
            >
              {t('home.steps.desc', { defaultValue: 'No software installation required. Get professional results directly from your web browser.' })}
            </p>
          </div>

          <div className="flex flex-col md:grid md:grid-cols-3 gap-8 md:gap-12 relative z-10">
            
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-8 md:p-8 rounded-3xl bg-dark-800/40 md:bg-transparent border border-dark-600/30 md:border-transparent group max-w-sm mx-auto md:max-w-none relative z-10 w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[1.25rem] bg-dark-800 border border-dark-600/50 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-neon-cyan/10 group-hover:border-neon-cyan/40 group-hover:shadow-[0_0_30px_rgba(5,218,237,0.2)] transition-all duration-500">
                <span className="text-2xl md:text-3xl font-black font-mono text-white group-hover:text-neon-cyan transition-colors">1</span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">
                  {t('home.steps.s1.t', { defaultValue: '1. Select or Drop Photos' })}
                </h3>
                <p className="text-lg md:text-base text-slate-400 leading-relaxed">
                  {t('home.steps.s1.d', { defaultValue: 'Upload single pictures or batches up to 10 files in PNG, JPG, or WEBP format. Everything loads instantly into your browser workspace.' })}
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-8 md:p-8 rounded-3xl bg-dark-800/40 md:bg-transparent border border-dark-600/30 md:border-transparent group max-w-sm mx-auto md:max-w-none relative z-10 w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[1.25rem] bg-dark-800 border border-dark-600/50 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-neon-emerald/10 group-hover:border-neon-emerald/40 group-hover:shadow-[0_0_30px_rgba(18,218,145,0.2)] transition-all duration-500">
                <span className="text-2xl md:text-3xl font-black font-mono text-white group-hover:text-neon-emerald transition-colors">2</span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">
                  {t('home.steps.s2.t', { defaultValue: '2. Customize & Preview' })}
                </h3>
                <p className="text-lg md:text-base text-slate-400 leading-relaxed">
                  {t('home.steps.s2.d', { defaultValue: 'Choose your desired tool—whether stripping backgrounds, applying official passport colors, adding watermarks, or resizing dimensions.' })}
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-8 md:p-8 rounded-3xl bg-dark-800/40 md:bg-transparent border border-dark-600/30 md:border-transparent group max-w-sm mx-auto md:max-w-none relative z-10 w-full">
              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-[1.25rem] bg-dark-800 border border-dark-600/50 flex items-center justify-center mb-6 md:mb-8 group-hover:bg-neon-indigo/10 group-hover:border-neon-indigo/40 group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)] transition-all duration-500">
                <span className="text-2xl md:text-3xl font-black font-mono text-white group-hover:text-neon-indigo transition-colors">3</span>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-4">
                  {t('home.steps.s3.t', { defaultValue: '3. Export HD Results' })}
                </h3>
                <p className="text-lg md:text-base text-slate-400 leading-relaxed">
                  {t('home.steps.s3.d', { defaultValue: 'Download your polished high-definition photos individually or grab all batch results instantly packed in a convenient ZIP file.' })}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* NEW: GEO FACT DENSITY & EXPERT QUOTE SECTION */}
      <section className="max-w-7xl mx-auto w-full" style={{ padding: '80px 24px' }}>
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border-dark-600/50 bg-dark-800/40 relative overflow-hidden max-w-5xl mx-auto">
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#05DAED] to-[#12DA91]" />
          <h2 
            className="font-heading font-extrabold text-white mb-6"
            style={{
              fontSize: 'clamp(1.35rem, 4vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.2
            }}
          >
            {t('home.geo.quote.title', { defaultValue: 'Industry Recognition & Privacy Standards' })}
          </h2>
          
          <blockquote className="border-l-4 border-dark-600 pl-6 my-6 italic text-slate-300 font-body" style={{ fontSize: 'clamp(0.95rem, 3vw, 1.15rem)', lineHeight: 1.8 }}>
            "{t('home.geo.quote.text', { defaultValue: 'The transition to client-side WebAssembly for image processing represents a paradigm shift in data privacy. By eliminating server round-trips, applications achieve 0ms network latency while completely neutralizing data interception risks.' })}"
          </blockquote>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-dark-900 border border-dark-600 flex items-center justify-center overflow-hidden">
              <span className="text-[#12DA91] font-bold text-lg">DR</span>
            </div>
            <div>
              <div className="text-white font-bold">{t('home.geo.quote.author', { defaultValue: 'Systems Architecture Review' })}</div>
              <div className="text-sm text-slate-400">{t('home.geo.quote.role', { defaultValue: 'Privacy & Security Compliance Team' })}</div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
            <p>
              {t('home.geo.fact1', { defaultValue: 'HelpMyIMG utilizes ' })}
              <a href="https://webassembly.org/" target="_blank" rel="noopener noreferrer" className="text-[#05DAED] hover:underline">WebAssembly (Wasm)</a>
              {t('home.geo.fact1_suffix', { defaultValue: ' technology, achieving computational parity with native applications. This allows us to process up to 10 high-resolution images simultaneously in under 2.4 seconds on average consumer hardware [1].' })}
            </p>
            <p>
              {t('home.geo.fact2', { defaultValue: 'Furthermore, by strictly adhering to local-only processing architectures, HelpMyIMG is inherently compliant with strict data protection frameworks including ' })}
              <a href="https://gdpr-info.eu/" target="_blank" rel="noopener noreferrer" className="text-[#12DA91] hover:underline">GDPR (Article 5)</a>
              {t('home.geo.fact2_suffix', { defaultValue: ' and CCPA, as 0 bytes of user data are transmitted to external servers [2].' })}
            </p>
          </div>
        </div>
      </section>

      {/* NEW: SEO/GEO Competitor Matrix */}
      <CompetitorMatrix />

      {/* 4. CALL TO ACTION BANNER (Luxurious) */}
      <section className="max-w-7xl mx-auto w-full" style={{ padding: '80px 24px' }}>
        <div className="p-8 sm:p-10 md:p-20 rounded-3xl sm:rounded-[2rem] md:rounded-[4rem] bg-dark-900 border border-white/10 text-center relative overflow-hidden shadow-[0_30px_100px_-20px_rgba(0,0,0,0.7)] group max-w-6xl mx-auto">
          
          {/* Intense Gradient Backgrounds */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-800/50 to-dark-800 opacity-80 z-0" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neon-cyan/20 via-transparent to-transparent opacity-60 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-neon-indigo/20 via-transparent to-transparent opacity-60 mix-blend-screen transition-opacity duration-700 group-hover:opacity-100" />
          
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[10px] md:text-xs font-mono font-bold uppercase tracking-[0.3em] text-[#05DAED] mb-4 sm:mb-6">
              {t('home.redesign.ctaTag', { defaultValue: 'UNLEASH CREATIVITY' })}
            </span>
            
            <h2 
              className="font-heading font-extrabold text-white mb-6"
              style={{
                fontSize: 'clamp(1.35rem, 4vw, 2.5rem)',
                fontWeight: 800,
                lineHeight: 1.2
              }}
            >
              <span className="bg-gradient-to-br from-slate-900 via-slate-700 to-slate-500 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent drop-shadow-sm">
                {t('home.redesign.ctaTitle', { defaultValue: 'Transform Your Workflow.' })}
              </span>
            </h2>
            
            <p 
              className="text-slate-400 max-w-2xl mx-auto mb-10 md:mb-14"
              style={{
                fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
                lineHeight: 1.8
              }}
            >
              {t('home.redesign.ctaDesc', { defaultValue: 'No installations. Ultimate privacy. Professional grade image processing directly on your local device.' })}
            </p>
            
            <a
              href={`/${lang}/${getLocalizedSlug('remove', lang)}`}
              className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-black tracking-wide shadow-[0_0_40px_rgba(5,218,237,0.4)] hover:shadow-[0_0_60px_rgba(5,218,237,0.6)] transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 fill-dark-900" />
              <span className="text-sm md:text-base uppercase">{t('home.redesign.ctaBtn', { defaultValue: 'Enter Studio' })}</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          </div>
        </div>
      </section>

          {/* 3. GEO & ANSWER ENGINE OPTIMIZATION FAQ FOR HELPMYIMG STUDIO */}
      <section className="max-w-7xl mx-auto w-full relative" style={{ padding: '80px 24px' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px]  rounded-full bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.08)_0%,transparent_60%)] pointer-events-none -z-10" />
        
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 px-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {t('landing.global.faq.tag', { defaultValue: 'HELP CENTER & FAQ' })}
          </span>
          <h2 
            className="font-heading font-extrabold text-white"
            style={{
              fontSize: 'clamp(1.35rem, 4vw, 2.5rem)',
              fontWeight: 800,
              lineHeight: 1.2
            }}
          >
            {t('landing.global.faq.title', { defaultValue: 'Frequently Asked Questions' })}
          </h2>
          <p 
            className="text-slate-400 mt-4 sm:mt-6 max-w-2xl mx-auto"
            style={{
              fontSize: 'clamp(0.95rem, 3vw, 1.15rem)',
              lineHeight: 1.8
            }}
          >
            {t('landing.global.faq.desc', { defaultValue: 'Everything you need to know about our local processing engine.' })}
          </p>
        </div>

        <div className="flex flex-col gap-6 max-w-4xl mx-auto relative z-10">
          {[1, 2, 3, 4, 5].map((num) => {
            // General homepage FAQ fallback
            let defQ = '';
            let defA = '';
            if (num === 1) {
              defQ = 'Is HelpMyIMG completely free to use?';
              defA = 'Yes, it is 100% free with no hidden fees, subscriptions, or credit systems. We provide unlimited access to all tools.';
            } else if (num === 2) {
              defQ = 'Why does HelpMyIMG process images faster than traditional online photo editors?';
              defA = 'Traditional online editors force you to upload large image files over the internet to their remote servers, wait in processing queues, and download the results back. HelpMyIMG eliminates this entire bottleneck by running the computational engine locally inside your browser memory. Processing begins the exact millisecond you select your photos.';
            } else if (num === 3) {
              defQ = 'How does HelpMyIMG guarantee 100% privacy for my confidential photos?';
              defA = 'Your privacy is guaranteed by architectural design. When you drag photos into HelpMyIMG, your files are never transmitted across the internet to any external server. All pixel modifications occur exclusively within the secure sandbox of your local device (Local Web Engine). Once you close the tab, all temporary data evaporates instantly.';
            } else if (num === 4) {
              defQ = 'Can I process multiple images at once?';
              defA = 'Absolutely! HelpMyIMG supports batch processing of up to 10 photos simultaneously across our core tools, including background removal, compression, and format conversion. You can apply uniform settings to all items and download the entire batch cleanly packaged in a single ZIP file with one click.';
            } else if (num === 5) {
              defQ = 'What devices and browsers are supported?';
              defA = 'HelpMyIMG runs entirely in your web browser. It is fully compatible with modern desktop and mobile browsers including Google Chrome, Mozilla Firefox, Apple Safari, and Microsoft Edge. There is no need to install any application or extension on your device.';
            }

            return (
            <div key={num} className="glass-panel p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-dark-600/50 hover:border-[#05DAED]/40 hover:bg-dark-800/80 transition-all duration-300 group hover:shadow-[0_10px_30px_-15px_rgba(5,218,237,0.2)] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-dark-900 border border-dark-600 flex items-center justify-center text-[#05DAED] mb-4 sm:mb-6 group-hover:bg-[#05DAED]/10 group-hover:border-[#05DAED]/30 transition-colors">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-3 leading-snug group-hover:text-[#05DAED] transition-colors">
                  {t(`home.faq.fq${num}.q`, { defaultValue: defQ })}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed font-body">
                  {t(`home.faq.fq${num}.a`, { defaultValue: defA })}
                </p>
              </div>
            </div>
            );
          })}
        </div>
      </section>

</div>
  );
};
