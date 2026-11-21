// src/pages/info/TermsPage.tsx
// Halaman Syarat & Ketentuan Resmi HelpMyIMG (Terms of Service & Founder Lifetime License)
// Disusun secara komprehensif mencakup arsitektur privasi lokal WASM, definisi operasional Lifetime,
// klausul Force Majeure / End-of-Life, lisensi komersial, dan interoperabilitas All-In-One Privacy Suite.

import React from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { SeoHead } from '../../components/seo/SeoHead';
import { getLocalizedInfoSlug } from '../../utils/infoUrlMapper';
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Scale,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Mail,
  Zap,
  Lock,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TermsPage: React.FC = () => {
  const { t, lang } = useTranslation();

  const rawTitle = t('terms.title', { defaultValue: 'Terms of Service & Founder License' });
  const titleWords = rawTitle.split(' ');
  const splitIndex = Math.min(2, Math.max(1, Math.floor(titleWords.length * 0.4)));
  const gradientPart = titleWords.slice(0, splitIndex).join(' ');
  const solidPart = titleWords.slice(splitIndex).join(' ');

  const localizedSlug = getLocalizedInfoSlug('terms', lang);

  const sections = [
    { id: 1, icon: Scale, title: t('terms.s1.title', { defaultValue: '1. Acceptance of Terms & Service Scope' }) },
    { id: 2, icon: ShieldCheck, title: t('terms.s2.title', { defaultValue: '2. Zero-Upload Architecture & Data Privacy Guarantee' }) },
    { id: 3, icon: Zap, title: t('terms.s3.title', { defaultValue: '3. Licensing Tiers: Free Starter & PRO Founder Pass' }) },
    { id: 4, icon: Sparkles, title: t('terms.s4.title', { defaultValue: '4. Definition & Scope of Lifetime Access' }) },
    { id: 5, icon: Cpu, title: t('terms.s5.title', { defaultValue: '5. Service Continuity, Force Majeure & Offline PWA Assurance' }) },
    { id: 6, icon: Layers, title: t('terms.s6.title', { defaultValue: '6. All-In-One Privacy Suite Multi-Domain Access' }) },
    { id: 7, icon: Lock, title: t('terms.s7.title', { defaultValue: '7. Intellectual Property Ownership & Commercial Rights' }) },
    { id: 8, icon: AlertTriangle, title: t('terms.s8.title', { defaultValue: '8. Acceptable Use Policy & Content Responsibility' }) },
    { id: 9, icon: HelpCircle, title: t('terms.s9.title', { defaultValue: '9. Warranty Disclaimer (As-Is and As-Available)' }) },
    { id: 10, icon: Scale, title: t('terms.s10.title', { defaultValue: '10. Strict Limitation of Liability' }) },
    { id: 11, icon: Zap, title: t('terms.s11.title', { defaultValue: '11. Billing, Payments & 14-Day Refund Policy' }) },
    { id: 12, icon: Mail, title: t('terms.s12.title', { defaultValue: '12. Governing Law, Dispute Resolution & Legal Notice' }) },
  ];

  const pageLabel = t('footer.terms', { defaultValue: 'Terms of Service' });
  const seoTitle = rawTitle && rawTitle.toLowerCase() !== pageLabel.toLowerCase()
    ? (pageLabel.length + rawTitle.length <= 45
        ? `${pageLabel} — ${rawTitle} - HelpMyIMG`
        : (rawTitle.length <= 48 && rawTitle.length >= 16 ? `${rawTitle} - HelpMyIMG` : `${pageLabel} - HelpMyIMG`))
    : `${pageLabel} - HelpMyIMG`;

  return (
    <>
      <SeoHead
        title={seoTitle}
        description={t('terms.intro', {
          defaultValue:
            'HelpMyIMG terms of service, founder lifetime licensing conditions, client-side zero-upload guarantees, and privacy-first digital usage agreements.',
        })}
        canonicalPath={lang === 'en' ? `/${localizedSlug}/` : `/${lang}/${localizedSlug}/`}
        lang={lang}
        infoPage="terms"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-24">
        {/* HEADER SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 dark:text-[#05DAED] text-sm font-mono font-bold mb-6">
            <FileText className="w-4 h-4" />
            {t('terms.badge', { defaultValue: 'TERMS OF SERVICE & LEGAL AGREEMENT' })}
          </div>

          <h1
            className="font-heading font-black mb-6"
            style={{
              fontSize: 'clamp(2.2rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            <span className="bg-gradient-to-r from-cyan-500 via-teal-400 to-blue-600 bg-clip-text text-transparent drop-shadow-sm">
              {gradientPart}
            </span>{' '}
            <span className="text-slate-800 dark:text-white">
              {solidPart}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 font-mono tracking-wider uppercase mb-8">
            {t('terms.lastUpdated', { defaultValue: 'Effective Date: November 16, 2026 • Version 2.4' })}
          </p>

          <div className="text-lg md:text-xl text-slate-700 dark:text-slate-200 max-w-4xl mx-auto leading-relaxed border-l-4 border-cyan-500 pl-6 py-4 bg-slate-50 dark:bg-dark-800/40 rounded-r-2xl text-left mb-6 shadow-sm">
            {t('terms.intro', {
              defaultValue:
                'Welcome to HelpMyIMG and the ThisMyOwn software ecosystem. These Terms of Service constitute a legally binding agreement governing your access to and use of our client-side software, tools, and digital services. By accessing or using any tool across our network, you explicitly agree to be bound by these terms.',
            })}
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-sm md:text-base font-semibold max-w-3xl mx-auto text-center">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>
              {t('terms.notice', {
                defaultValue:
                  'Privacy Guarantee: HelpMyIMG executes 100% of data processing locally in your browser via WebAssembly. We never upload, inspect, or retain your files on remote servers.',
              })}
            </span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* QUICK LINKS SIDEBAR (STICKY NAVIGATION) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:col-span-4 sticky top-28 bg-white dark:bg-dark-800/70 border border-slate-200 dark:border-dark-600 rounded-3xl p-6 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200 dark:border-dark-600">
              <Scale className="w-4 h-4 text-cyan-500" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest font-mono">
                {t('terms.sidebarTitle', { defaultValue: 'Table of Contents' })}
              </h2>
            </div>
            <nav className="space-y-2 text-xs">
              {sections.map((sec) => {
                const IconComponent = sec.icon;
                return (
                  <a
                    key={sec.id}
                    href={`#section-${sec.id}`}
                    className="text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#05DAED] transition-colors flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-700/60 group"
                  >
                    <IconComponent className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-cyan-500 transition-colors" />
                    <span className="truncate group-hover:translate-x-0.5 transition-transform">
                      {sec.title}
                    </span>
                  </a>
                );
              })}
            </nav>
          </motion.div>

          {/* MAIN LEGAL CONTENT */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-8 space-y-14"
          >
            {/* SECTION 1 */}
            <section id="section-1" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s1.title', { defaultValue: '1. Acceptance of Terms & Service Scope' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s1.desc1', { defaultValue: 'By accessing or using HelpMyIMG (helpmyimg.com), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, our Privacy Policy, and all applicable international laws and regulations. If you do not agree with any part of these terms, you must immediately discontinue use of the platform.' })}</p>
                <p>{t('terms.s1.desc2', { defaultValue: 'These terms apply universally to all visitors, registered account holders, and commercial users across HelpMyIMG and related digital applications operated under the ThisMyOwn software network.' })}</p>
              </div>
            </section>

            {/* SECTION 2 */}
            <section id="section-2" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s2.title', { defaultValue: '2. Zero-Upload Architecture & Data Privacy Guarantee' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s2.desc1', { defaultValue: 'HelpMyIMG is engineered with a strict Zero-Knowledge, client-side execution model. All artificial intelligence models, image segmentation algorithms, background removal operations, and file transformations execute strictly within your local web browser memory using WebAssembly (WASM), Web Workers, and hardware-accelerated local APIs.' })}</p>
                <p>{t('terms.s2.desc2', { defaultValue: 'Under no circumstances are your uploaded photographs, documents, or processed creative assets transmitted to, processed on, or cached by our servers. Because your data never leaves your physical device, HelpMyIMG is natively compliant with GDPR, CCPA, and international data privacy frameworks. You retain absolute control over your confidential assets at all times.' })}</p>
              </div>
            </section>

            {/* SECTION 3 */}
            <section id="section-3" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s3.title', { defaultValue: '3. Licensing Tiers: Free Starter & PRO Founder Pass' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s3.desc1', { defaultValue: 'HelpMyIMG offers two distinct service tiers designed for creators, professionals, and enterprise workflows:' })}</p>
                <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-200">
                  <li><strong>{t('terms.s3.bullet1', { defaultValue: 'Free Starter Tier: Grants non-exclusive, revocable, personal, and commercial access to all 14 core tools with reasonable standard processing limits (such as batch sizes up to 10 photos simultaneously and standard high-definition output).' })}</strong></li>
                  <li><strong>{t('terms.s3.bullet2', { defaultValue: 'PRO Founder Lifetime License: Granted upon payment of an upfront, one-time fee. Unlocks unrestricted batch capacity (100+ files), Ultra-HD 4K lossless rendering, priority multi-threaded CPU acceleration, and full commercial monetization rights without recurring monthly charges.' })}</strong></li>
                </ul>
                <p>{t('terms.s3.desc2', { defaultValue: 'Both tiers include full commercial licensing rights for all output files generated through the software.' })}</p>
              </div>
            </section>

            {/* SECTION 4: DEFINITION OF LIFETIME */}
            <section id="section-4" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border-2 border-cyan-500/40 dark:border-cyan-500/30 p-8 shadow-md relative overflow-hidden">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 font-mono font-bold flex items-center justify-center shrink-0">
                  4
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s4.title', { defaultValue: '4. Definition & Scope of Lifetime Access' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p className="font-semibold text-slate-800 dark:text-white">
                  {t('terms.s4.desc1', { defaultValue: 'In accordance with standard global software industry practices, Lifetime Access refers explicitly to the operational lifespan of the software product and its commercial availability, and not to the biological lifespan of the buyer or developer, nor an indefinite commitment until perpetuity.' })}
                </p>
                <p>{t('terms.s4.desc2', { defaultValue: 'A Lifetime License guarantees that you will never be subjected to mandatory recurring monthly or annual subscription fees for the features, tools, and versions covered by your purchase. You are entitled to all minor updates, stability patches, and core model enhancements deployed throughout the active commercial life of the platform.' })}</p>
              </div>
            </section>

            {/* SECTION 5: SERVICE CONTINUITY & FORCE MAJEURE */}
            <section id="section-5" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  5
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s5.title', { defaultValue: '5. Service Continuity, Force Majeure & Offline PWA Assurance' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s5.desc1', { defaultValue: 'While the development team intends to maintain and expand the service indefinitely, unforeseen technical, legal, economic, or personal events (including medical emergencies, incapacity, or natural disasters categorized as Force Majeure) may impact future online hosting.' })}</p>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-dark-700/50 border border-slate-200 dark:border-dark-600 text-slate-700 dark:text-slate-200 text-sm">
                  <p className="m-0 font-medium">
                    {t('terms.s5.desc2', { defaultValue: 'Because HelpMyIMG does not rely on proprietary remote server backends for processing, our client-side WebAssembly architecture provides an extraordinary safeguard: users may install the web application as a Progressive Web App (PWA) to run independently and offline on their personal computers even if remote hosting is interrupted.' })}
                  </p>
                </div>
                <p>{t('terms.s5.desc3', { defaultValue: 'In the event of a planned permanent retirement of the domain or service, HelpMyIMG will undertake reasonable commercial efforts to provide advance notice and offer standalone offline distributions or open-access archives for verified PRO members.' })}</p>
              </div>
            </section>

            {/* SECTION 6: ALL-IN-ONE PRIVACY SUITE */}
            <section id="section-6" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  6
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s6.title', { defaultValue: '6. All-In-One Privacy Suite Multi-Domain Access' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s6.desc1', { defaultValue: 'The PRO Founder Lifetime Pass includes multi-application interoperability across our integrated family of privacy-first web utilities, which includes: (a) HelpMyIMG (AI Image Studio), (b) HandleMyFile (Document & PDF Suite), (c) SolveMyMedia (Audio & Video Compression), and (d) CreateMy-QR (Vector QR Generation).' })}</p>
                <p>{t('terms.s6.desc2', { defaultValue: 'Your single authenticated account credentials permit synchronized PRO privileges across all authorized domains within the ThisMyOwn ecosystem without requiring duplicate subscription fees.' })}</p>
              </div>
            </section>

            {/* SECTION 7: INTELLECTUAL PROPERTY */}
            <section id="section-7" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  7
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s7.title', { defaultValue: '7. Intellectual Property Ownership & Commercial Rights' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s7.desc1', { defaultValue: 'You retain 100% unconditional ownership and copyright over all source images, media assets, and resulting transformed outputs generated using HelpMyIMG.' })}</p>
                <p className="border-l-2 border-cyan-500 pl-4 text-slate-700 dark:text-slate-300 font-medium">
                  {t('terms.s7.desc2', { defaultValue: 'HelpMyIMG asserts zero ownership, claims, or royalties over your creative work. All processed assets may be freely utilized for commercial client deliverables, merchandise, print-on-demand products, digital marketing, and publication.' })}
                </p>
              </div>
            </section>

            {/* SECTION 8: ACCEPTABLE USE */}
            <section id="section-8" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-500 font-mono font-bold flex items-center justify-center shrink-0">
                  8
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s8.title', { defaultValue: '8. Acceptable Use Policy & Content Responsibility' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s8.desc1', { defaultValue: 'Because our processing operates entirely on your physical machine, HelpMyIMG does not actively monitor or inspect user content. Consequently, you assume sole legal responsibility for all materials you process.' })}</p>
                <p>{t('terms.s8.desc2', { defaultValue: 'You agree not to use HelpMyIMG to process, create, or distribute child sexual abuse material (CSAM), non-consensual deepfakes, defamatory or libelous content, or any material that infringes upon third-party intellectual property rights.' })}</p>
                <p>{t('terms.s8.desc3', { defaultValue: 'You agree not to reverse engineer, decompile, or attempt to extract proprietary source weights for unauthorized commercial resale or malicious distribution.' })}</p>
              </div>
            </section>

            {/* SECTION 9: WARRANTY DISCLAIMER */}
            <section id="section-9" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  9
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s9.title', { defaultValue: '9. Warranty Disclaimer (As-Is and As-Available)' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s9.desc1', { defaultValue: 'HelpMyIMG and its tools are provided on an as is and as available basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.' })}</p>
                <p>{t('terms.s9.desc2', { defaultValue: 'While we utilize state-of-the-art neural networks, we do not warrant that background cutouts, file compressions, or format conversions will achieve 100% mathematical perfection for every conceivable lighting condition or camera lens artifact.' })}</p>
              </div>
            </section>

            {/* SECTION 10: LIMITATION OF LIABILITY */}
            <section id="section-10" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  10
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s10.title', { defaultValue: '10. Strict Limitation of Liability' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s10.desc1', { defaultValue: 'To the maximum extent permitted by applicable law, in no event shall HelpMyIMG, its founders, affiliates, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, business interruption, or device hardware degradation resulting from local browser execution.' })}</p>
                <p>{t('terms.s10.desc2', { defaultValue: 'In all circumstances, our cumulative legal liability to you for any claim arising from these terms or your use of the service shall not exceed the actual amount paid by you to HelpMyIMG during the twelve (12) months preceding the claim.' })}</p>
              </div>
            </section>

            {/* SECTION 11: BILLING & REFUNDS */}
            <section id="section-11" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  11
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s11.title', { defaultValue: '11. Billing, Payments & 14-Day Refund Policy' })}
                </h2>
              </div>
              <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s11.desc1', { defaultValue: 'All digital software purchases are processed securely through authorized Merchant of Record partners (Lemon Squeezy) and licensed regional payment gateways (Duitku). Your payment information is encrypted and handled in compliance with PCI-DSS standards.' })}</p>
                <p>{t('terms.s11.desc2', { defaultValue: 'We offer a 14-day customer satisfaction guarantee. If the PRO features fail to perform on your supported hardware or you encounter technical incompatibility that cannot be resolved, you may request a full refund within 14 days of your initial purchase date.' })}</p>
              </div>
            </section>

            {/* SECTION 12: DISPUTE & CONTACT */}
            <section id="section-12" className="scroll-mt-28 bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 shadow-sm">
              <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-slate-100 dark:border-dark-700">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] font-mono font-bold flex items-center justify-center shrink-0">
                  12
                </div>
                <h2 className="text-xl sm:text-2xl font-heading font-black text-slate-900 dark:text-white m-0">
                  {t('terms.s12.title', { defaultValue: '12. Governing Law, Dispute Resolution & Legal Notice' })}
                </h2>
              </div>
              <div className="space-y-6 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                <p>{t('terms.s12.desc1', { defaultValue: 'These Terms of Service and any dispute arising out of or related to your use of the software shall be governed by and construed in accordance with applicable governing laws, without regard to principles of conflicts of law.' })}</p>
                <p>{t('terms.s12.desc2', { defaultValue: 'For legal notices, copyright claims, DMCA notices, or partnership inquiries, please contact our legal department at legal@helpmyimg.com. We respond to all formal communications within forty-eight (48) business hours.' })}</p>

                <div className="bg-slate-50 dark:bg-dark-900/60 border border-slate-200 dark:border-dark-700 p-6 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div>
                    <h3 className="text-slate-900 dark:text-white font-bold font-heading mb-1 text-sm sm:text-base">
                      {t('terms.contactTitle', { defaultValue: 'Legal & Compliance Inquiries' })}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm m-0">
                      {t('terms.contactSubtitle', { defaultValue: 'Official response time within 48 business hours.' })}
                    </p>
                  </div>
                  <a
                    href="mailto:legal@helpmyimg.com"
                    className="px-6 py-3 rounded-xl bg-slate-900 dark:bg-dark-700 hover:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold text-xs sm:text-sm transition-all whitespace-nowrap shadow-sm"
                  >
                    legal@helpmyimg.com
                  </a>
                </div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};
