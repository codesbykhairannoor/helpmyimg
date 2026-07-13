// src/components/landing/LandingSections.tsx
// Bagian-bagian lengkap di bawah Tool Workspace untuk dominasi SEO, GEO, & 30 Bahasa Dunia
// Dirancang dengan estetika modern Apple-style, glassmorphism, dan informasi keunggulan mutlak
// 100% Terintegrasi dengan sistem i18n 30 Bahasa (Tanpa teks statis)

import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import {
  ShieldCheck,
  Zap,
  DollarSign,
  Globe,
  ShoppingBag,
  Camera,
  FileText,
  Code2,
  CheckCircle2,
  Star
} from 'lucide-react';

interface LandingSectionsProps {
  tool: 'remove' | 'color' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker';
}

export const LandingSections: React.FC<LandingSectionsProps> = ({ tool }) => {
  const { t } = useTranslation();
  // Tool-prefixed translation: landing.remove.why.tag, landing.color.why.tag, etc.
  const tp = (key: string) => t(`landing.${tool}.${key}`);

  return (
    <div className="space-y-24 py-16 text-slate-100">
      
      {/* 1. WHY CHOOSE US - KEUNGGULAN MUTLAK VS KOMPETITOR CLOUD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan bg-neon-cyan/10 px-3 py-1.5 rounded-full border border-neon-cyan/30">
            {tp('why.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mt-4 tracking-tight">
            {tp('why.title')}
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mt-4 font-body leading-relaxed">
            {tp('why.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-cyan/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-cyan to-blue-600 flex items-center justify-center text-dark-900 mb-6 shadow-glow-cyan">
              <Zap className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card1.title')}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {tp('why.card1.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-cyan font-bold">
              <span>{tp('why.card1.badge')}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-emerald/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-emerald to-teal-600 flex items-center justify-center text-dark-900 mb-6 shadow-glow-emerald">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card2.title')}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {tp('why.card2.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-emerald font-bold">
              <span>{tp('why.card2.badge')}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-indigo/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-indigo to-purple-600 flex items-center justify-center text-white mb-6 shadow-glow-indigo">
              <DollarSign className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card3.title')}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {tp('why.card3.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-indigo font-bold">
              <span>{tp('why.card3.badge')}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-neon-purple/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-neon-purple to-pink-600 flex items-center justify-center text-white mb-6 shadow-glow-purple">
              <Globe className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card4.title')}
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {tp('why.card4.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-neon-purple font-bold">
              <span>{tp('why.card4.badge')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO IS IT MADE FOR - SOLUSI SPESIFIK PER PROFESI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-emerald bg-neon-emerald/10 px-3 py-1.5 rounded-full border border-neon-emerald/30">
            {tp('who.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-4">
            {tp('who.title')}
          </h2>
          <p className="text-slate-300 text-base mt-3">
            {tp('who.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center shrink-0 text-neon-cyan">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c1.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan font-mono">{tp('who.c1.badge')}</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {tp('who.c1.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  <span>{tp('who.c1.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
                  <span>{tp('who.c1.l2')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center shrink-0 text-neon-emerald">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c2.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neon-emerald/20 text-neon-emerald font-mono">{tp('who.c2.badge')}</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {tp('who.c2.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
                  <span>{tp('who.c2.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-emerald shrink-0" />
                  <span>{tp('who.c2.l2')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center shrink-0 text-neon-indigo">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c3.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neon-indigo/20 text-neon-indigo font-mono">{tp('who.c3.badge')}</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {tp('who.c3.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-indigo shrink-0" />
                  <span>{tp('who.c3.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-indigo shrink-0" />
                  <span>{tp('who.c3.l2')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-600 flex items-center justify-center shrink-0 text-neon-purple">
              <Code2 className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c4.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-neon-purple/20 text-neon-purple font-mono">{tp('who.c4.badge')}</span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {tp('who.c4.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-purple shrink-0" />
                  <span>{tp('who.c4.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-neon-purple shrink-0" />
                  <span>{tp('who.c4.l2')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS IN 3 SECONDS - ALUR KERJA CEPAT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-10 sm:p-14 rounded-3xl border-dark-500/60 relative overflow-hidden bg-gradient-to-b from-dark-900/90 to-dark-800/90">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-cyan">
              {tp('work.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-3">
              {tp('work.title')}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              {tp('work.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 border-2 border-neon-cyan/50 text-neon-cyan font-heading font-extrabold text-2xl flex items-center justify-center mx-auto shadow-glow-cyan">
                1
              </div>
              <h3 className="font-heading font-bold text-white text-lg">
                {tp('work.s1.title')}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed px-4">
                {tp('work.s1.desc')}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 border-2 border-neon-emerald/50 text-neon-emerald font-heading font-extrabold text-2xl flex items-center justify-center mx-auto shadow-glow-emerald">
                2
              </div>
              <h3 className="font-heading font-bold text-white text-lg">
                {tp('work.s2.title')}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed px-4">
                {tp('work.s2.desc')}
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-dark-800 border-2 border-neon-indigo/50 text-neon-indigo font-heading font-extrabold text-2xl flex items-center justify-center mx-auto shadow-glow-indigo">
                3
              </div>
              <h3 className="font-heading font-bold text-white text-lg">
                {tp('work.s3.title')}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed px-4">
                {tp('work.s3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-neon-purple">
            {tp('proof.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white mt-3">
            {tp('proof.title')}
          </h2>
          <p className="text-slate-300 text-base mt-2">
            {tp('proof.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic font-body">
                {tp('proof.q1')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-dark-600/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-cyan to-blue-600 flex items-center justify-center text-dark-900 font-bold font-heading">
                PG
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Powell Gao</h4>
                <p className="text-xs text-slate-400">{tp('proof.t1.role')}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic font-body">
                {tp('proof.q2')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-dark-600/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-emerald to-teal-600 flex items-center justify-center text-dark-900 font-bold font-heading">
                AM
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Andrea Mangano</h4>
                <p className="text-xs text-slate-400">{tp('proof.t2.role')}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400" />)}
              </div>
              <p className="text-slate-300 text-sm leading-relaxed italic font-body">
                {tp('proof.q3')}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-dark-600/50">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-indigo to-purple-600 flex items-center justify-center text-white font-bold font-heading">
                OH
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Omar Hamza</h4>
                <p className="text-xs text-slate-400">{tp('proof.t3.role')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>



    </div>
  );
};
