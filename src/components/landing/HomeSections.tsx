// src/components/landing/HomeSections.tsx
// Bagian Khusus Beranda (Homepage / Root Language Landing) untuk Dominasi SEO & GEO di 30 Bahasa
// Dirancang Khusus untuk Memperkuat Brand HelpMyIMG (100% Gratis, Privasi Mutlak, Kecepatan Lokal, Tanpa Biaya Cloud/AI yang Mahal)

import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
  Zap,
  ShieldCheck,
  DollarSign,
  Cpu,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getLocalizedSlug } from '../../utils/urlMapper';

export const HomeSections: React.FC = () => {
  const { t, lang } = useTranslation();

  return (
    <div className="space-y-24 py-16 text-slate-100 relative z-10">
      
      {/* 1. WHY HELPMYIMG - KEUNGGULAN MUTLAK vs KOMPETITOR CLOUD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-neon-cyan bg-neon-cyan/10 px-3.5 py-1.5 rounded-full border border-neon-cyan/30">
            {t('home.why.tag', { defaultValue: 'WHY HELPMYIMG' })}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-4 tracking-tight leading-tight">
            {t('home.why.title', { defaultValue: 'Why HelpMyIMG is the Smartest Choice for Creators & Businesses' })}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 font-body leading-relaxed">
            {t('home.why.desc', { defaultValue: 'Designed from the ground up for maximum privacy, blazing speed, and zero cost. Here is why thousands trust HelpMyIMG every day.' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-cyan/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center text-dark-900 mb-6 shadow-glow-cyan">
              <Zap className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {t('home.why.c1.t', { defaultValue: 'Instant Local Speed' })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('home.why.c1.d', { defaultValue: 'Your photos are processed directly inside your device memory with zero latency. No slow file uploads or cloud queues.' })}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-cyan font-bold">
              <span>{t('home.why.c1.b', { defaultValue: '0ms Server Delay' })}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-emerald/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-emerald to-teal-600 flex items-center justify-center text-dark-900 mb-6 shadow-glow-emerald">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {t('home.why.c2.t', { defaultValue: '100% Absolute Privacy' })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('home.why.c2.d', { defaultValue: 'Your personal portraits, confidential documents, and product shots never leave your computer or phone. Total peace of mind.' })}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-emerald font-bold">
              <span>{t('home.why.c2.b', { defaultValue: 'Zero Cloud Storage' })}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-indigo/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-indigo to-purple-600 flex items-center justify-center text-white mb-6 shadow-glow-indigo">
              <DollarSign className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {t('home.why.c3.t', { defaultValue: 'Forever Free & Unlimited' })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('home.why.c3.d', { defaultValue: 'No subscriptions, no watermarks, no credit packs, and no hidden fees. High-definition photo editing made accessible for all.' })}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-indigo font-bold">
              <span>{t('home.why.c3.b', { defaultValue: '$0 / Lifetime' })}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-pink/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-pink to-rose-600 flex items-center justify-center text-white mb-6 shadow-glow-purple">
              <Cpu className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {t('home.why.c4.t', { defaultValue: 'Batch Power up to 10' })}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t('home.why.c4.d', { defaultValue: 'Drag and drop up to 10 photos simultaneously. Process, optimize, and export your entire photoshoot as a neat ZIP archive in seconds.' })}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-pink font-bold">
              <span>{t('home.why.c4.b', { defaultValue: '10x Workflow Speed' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS IN 3 STEPS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 sm:p-14 rounded-3xl border-dark-500/60 relative overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="text-center max-w-2xl mx-auto mb-14 relative z-10">
            <h2 className="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              {t('home.steps.title', { defaultValue: 'How HelpMyIMG Works in 3 Simple Steps' })}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
              {t('home.steps.desc', { defaultValue: 'No software installation required. Get professional results directly from your web browser.' })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-800/60 border border-dark-600/40">
              <div className="w-12 h-12 rounded-full bg-neon-cyan/20 border border-neon-cyan/50 text-neon-cyan font-bold font-mono flex items-center justify-center text-lg mb-4 shadow-glow-cyan/20">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t('home.steps.s1.t', { defaultValue: '1. Select or Drop Photos' })}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('home.steps.s1.d', { defaultValue: 'Upload single pictures or batches up to 10 files in PNG, JPG, or WEBP format. Everything loads instantly into your browser workspace.' })}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-800/60 border border-dark-600/40">
              <div className="w-12 h-12 rounded-full bg-neon-emerald/20 border border-neon-emerald/50 text-neon-emerald font-bold font-mono flex items-center justify-center text-lg mb-4 shadow-glow-emerald/20">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t('home.steps.s2.t', { defaultValue: '2. Customize & Preview' })}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('home.steps.s2.d', { defaultValue: 'Choose your desired tool—whether stripping backgrounds, applying official passport colors, adding watermarks, or resizing dimensions.' })}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-800/60 border border-dark-600/40">
              <div className="w-12 h-12 rounded-full bg-neon-indigo/20 border border-neon-indigo/50 text-neon-indigo font-bold font-mono flex items-center justify-center text-lg mb-4 shadow-glow-indigo/20">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {t('home.steps.s3.t', { defaultValue: '3. Export HD Results' })}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {t('home.steps.s3.d', { defaultValue: 'Download your polished high-definition photos individually or grab all batch results instantly packed in a convenient ZIP file.' })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. GEO & ANSWER ENGINE OPTIMIZATION FAQ FOR HELPMYIMG STUDIO */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight flex items-center justify-center gap-2.5">
            <HelpCircle className="w-7 h-7 text-neon-cyan" />
            <span>{t('home.faq.title', { defaultValue: 'Frequently Asked Questions About HelpMyIMG Studio' })}</span>
          </h2>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="glass-panel p-6 sm:p-7 rounded-2xl border-dark-500/40 hover:border-dark-500/80 transition-colors">
              <h3 className="text-base sm:text-lg font-bold text-white flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-neon-cyan shrink-0 mt-0.5" />
                <span>{t(`home.faq.fq${num}.q` as any)}</span>
              </h3>
              <p className="text-slate-300 text-sm sm:text-base mt-3 pl-8 leading-relaxed font-body">
                {t(`home.faq.fq${num}.a` as any)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-dark-800 via-dark-800 to-dark-700 border border-neon-cyan/40 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-neon-cyan/10 rounded-full blur-3xl pointer-events-none" />
          
          <h3 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-4 tracking-tight">
            Ready to Supercharge Your Photo Workflow with HelpMyIMG?
          </h3>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 leading-relaxed">
            Join thousands of e-commerce sellers, creators, and professionals who trust HelpMyIMG for instant, private, high-definition photo editing.
          </p>
          <Link
            to={`/${lang}/${getLocalizedSlug('remove', lang)}`}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold shadow-glow-cyan hover:opacity-95 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-5 h-5 fill-dark-900" />
            <span>Open HelpMyIMG Studio Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};
