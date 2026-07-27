// src/components/landing/LandingSections.tsx
// Bagian-bagian lengkap di bawah Tool Workspace untuk dominasi SEO, GEO, & 30 Bahasa Dunia
// Dirancang dengan estetika modern Apple-style, glassmorphism, dan informasi keunggulan mutlak
// 100% Terintegrasi dengan sistem i18n 30 Bahasa (Tanpa teks statis)

import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { RemoveBgSections } from './tools/RemoveBgSections';
import { CompressSections } from './tools/CompressSections';
import { ColorBgSections } from './tools/ColorBgSections';
import { ResizeSections } from './tools/ResizeSections';
import { CropSections } from './tools/CropSections';
import { DesignSections } from './tools/DesignSections';
import { RotateSections } from './tools/RotateSections';
import { PickerSections } from './tools/PickerSections';
import { WatermarkSections } from './tools/WatermarkSections';
import { BlurFaceSections } from './tools/BlurFaceSections';
import { ConvertSections } from './tools/ConvertSections';
import { ShieldCheck, Zap, DollarSign, Globe, ShoppingBag, Camera, FileText, Code2, CheckCircle2 } from 'lucide-react';

interface LandingSectionsProps {
  tool: 'remove' | 'color' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker' | 'design' | 'blurface';
}

export const LandingSections: React.FC<LandingSectionsProps> = ({ tool }) => {
  const { t } = useTranslation();
  // Tool-prefixed translation: landing.remove.why.tag, landing.color.why.tag, etc.
  const tp = (key: string) => t(`landing.${tool}.${key}`);

  if (tool === 'remove') {
    return <RemoveBgSections />;
  }
  if (tool === 'compress') {
    return <CompressSections />;
  }
  if (tool === 'color') {
    return <ColorBgSections />;
  }
  if (tool === 'resize') {
    return <ResizeSections />;
  }
  if (tool === 'crop') {
    return <CropSections />;
  }
  if (tool === 'design') {
    return <DesignSections />;
  }
  if (tool === 'rotate') {
    return <RotateSections />;
  }
  if (tool === 'picker') {
    return <PickerSections />;
  }
  if (tool === 'watermark') {
    return <WatermarkSections />;
  }
  if (tool === 'blurface') {
    return <BlurFaceSections />;
  }
  if (tool === 'convert') {
    return <ConvertSections />;
  }

  return (
    <div className="space-y-24 py-16 text-slate-100">
      
      {/* 1. WHY CHOOSE US - KEUNGGULAN MUTLAK VS KOMPETITOR CLOUD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 block w-max mx-auto mb-4">
            {tp('why.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
            {tp('why.title')}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mt-6 max-w-2xl mx-auto">
            {tp('why.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#05DAED]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#05DAED]/10 flex items-center justify-center text-[#05DAED] mb-6 border border-[#05DAED]/30">
              <Zap className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card1.title')}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {tp('why.card1.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#05DAED] font-bold">
              <span>{tp('why.card1.badge')}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#12DA91]/10 flex items-center justify-center text-[#12DA91] mb-6 border border-[#12DA91]/30">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card2.title')}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {tp('why.card2.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#12DA91] font-bold">
              <span>{tp('why.card2.badge')}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#05DAED]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#05DAED]/10 flex items-center justify-center text-[#05DAED] mb-6 border border-[#05DAED]/30">
              <DollarSign className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card3.title')}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {tp('why.card3.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#05DAED] font-bold">
              <span>{tp('why.card3.badge')}</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-14 h-14 rounded-2xl bg-[#12DA91]/10 flex items-center justify-center text-[#12DA91] mb-6 border border-[#12DA91]/30">
              <Globe className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-xl font-heading font-bold text-white mb-3">
              {tp('why.card4.title')}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              {tp('why.card4.desc')}
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#12DA91] font-bold">
              <span>{tp('why.card4.badge')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. WHO IS IT MADE FOR - SOLUSI SPESIFIK PER PROFESI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
            {tp('who.tag')}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
            {tp('who.title')}
          </h2>
          <p className="text-lg text-slate-400 leading-relaxed mt-6 max-w-2xl mx-auto">
            {tp('who.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start hover:border-[#05DAED]/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#05DAED]/10 border border-[#05DAED]/30 flex items-center justify-center shrink-0 text-[#05DAED]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c1.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#05DAED]/20 text-[#05DAED] font-mono border border-[#05DAED]/30">{tp('who.c1.badge')}</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tp('who.c1.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05DAED] shrink-0" />
                  <span>{tp('who.c1.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05DAED] shrink-0" />
                  <span>{tp('who.c1.l2')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start hover:border-[#12DA91]/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#12DA91]/10 border border-[#12DA91]/30 flex items-center justify-center shrink-0 text-[#12DA91]">
              <Camera className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c2.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#12DA91]/20 text-[#12DA91] font-mono border border-[#12DA91]/30">{tp('who.c2.badge')}</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tp('who.c2.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#12DA91] shrink-0" />
                  <span>{tp('who.c2.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#12DA91] shrink-0" />
                  <span>{tp('who.c2.l2')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start hover:border-[#05DAED]/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#05DAED]/10 border border-[#05DAED]/30 flex items-center justify-center shrink-0 text-[#05DAED]">
              <FileText className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c3.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#05DAED]/20 text-[#05DAED] font-mono border border-[#05DAED]/30">{tp('who.c3.badge')}</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tp('who.c3.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05DAED] shrink-0" />
                  <span>{tp('who.c3.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#05DAED] shrink-0" />
                  <span>{tp('who.c3.l2')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-dark-500/60 flex flex-col sm:flex-row gap-6 items-start hover:border-[#12DA91]/30 transition-colors">
            <div className="w-16 h-16 rounded-2xl bg-[#12DA91]/10 border border-[#12DA91]/30 flex items-center justify-center shrink-0 text-[#12DA91]">
              <Code2 className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                <span>{tp('who.c4.title')}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#12DA91]/20 text-[#12DA91] font-mono border border-[#12DA91]/30">{tp('who.c4.badge')}</span>
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {tp('who.c4.desc')}
              </p>
              <ul className="text-xs text-slate-400 space-y-1 pt-1 font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#12DA91] shrink-0" />
                  <span>{tp('who.c4.l1')}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#12DA91] shrink-0" />
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
          <div className="text-center max-w-3xl mx-auto mb-16 px-4 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 block w-max mx-auto mb-4">
              {tp('work.tag')}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white leading-tight">
              {tp('work.title')}
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed mt-6 max-w-2xl mx-auto">
              {tp('work.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-800/60 border border-dark-600/40">
              <div className="w-12 h-12 rounded-full bg-[#05DAED]/20 border border-[#05DAED]/50 text-[#05DAED] font-bold font-mono flex items-center justify-center text-lg mb-4 shadow-glow-cyan/20">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {tp('work.s1.title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tp('work.s1.desc')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-800/60 border border-dark-600/40">
              <div className="w-12 h-12 rounded-full bg-[#12DA91]/20 border border-[#12DA91]/50 text-[#12DA91] font-bold font-mono flex items-center justify-center text-lg mb-4 shadow-glow-emerald/20">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {tp('work.s2.title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tp('work.s2.desc')}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-800/60 border border-dark-600/40">
              <div className="w-12 h-12 rounded-full bg-[#05DAED]/20 border border-[#05DAED]/50 text-[#05DAED] font-bold font-mono flex items-center justify-center text-lg mb-4 shadow-glow-cyan/20">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {tp('work.s3.title')}
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                {tp('work.s3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
