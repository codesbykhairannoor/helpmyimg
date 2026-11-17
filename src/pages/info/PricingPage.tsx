// src/pages/info/PricingPage.tsx
// Halaman Pilihan Harga Resmi HelpMyIMG: 3 Pilihan Bersih (Free Plan, Monthly/Annual Plan, Founder Lifetime Pass)
// Sesuai Layout Referensi Resmi Multi-Platform Suite

import React, { useState } from 'react';
import { useTranslation } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { SeoHead } from '../../components/seo/SeoHead';
import { getLocalizedInfoSlug } from '../../utils/infoUrlMapper';
import { useRouter } from '../../context/RouterContext';
import {
  Check,
  Sparkles,
  Crown,
  Zap,
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  Shield,
  Layers,
  Cpu,
  Clock,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PricingPage: React.FC = () => {
  const { t, lang } = useTranslation();
  const { user, isPro, openAuthModal } = useAuth();
  const { navigatePath } = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const isYearly = billingCycle === 'yearly';

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const localizedSlug = getLocalizedInfoSlug('pricing', lang);

  const handleFreeAction = () => {
    if (!user) {
      openAuthModal();
    } else {
      navigatePath(lang === 'en' ? '/' : `/${lang}/`);
    }
  };

  const handleSubscribeAction = (plan: 'monthly' | 'yearly' | 'lifetime') => {
    if (!user) {
      openAuthModal();
      return;
    }
    if (isPro) {
      navigatePath(lang === 'en' ? '/' : `/${lang}/`);
      return;
    }

    // Arahkan langsung ke Checkout Lemon Squeezy resmi
    const checkoutBase = 'https://thismyown.lemonsqueezy.com/checkout/buy/bd84d992-e4ed-4d88-a5ff-f1ab944f5815';
    const checkoutUrl = new URL(checkoutBase);
    if (user.email) {
      checkoutUrl.searchParams.set('checkout[email]', user.email);
    }
    if (user.displayName) {
      checkoutUrl.searchParams.set('checkout[name]', user.displayName);
    }
    checkoutUrl.searchParams.set('checkout[custom][user_id]', user.uid);
    checkoutUrl.searchParams.set('checkout[custom][plan]', plan);
    window.location.href = checkoutUrl.toString();
  };

  const suiteApps = [
    {
      icon: '🖼️',
      name: 'HelpMyIMG',
      role: t('pricing.suite.img', { defaultValue: 'Studio AI Foto & 4K Cutout' }),
      desc: t('pricing.suite.imgDesc', { defaultValue: 'Hapus background instan, 4K upscaling, kompresi lossless, & EXIF cleaner.' }),
    },
    {
      icon: '📄',
      name: 'HandleMyFile',
      role: t('pricing.suite.file', { defaultValue: 'Dokumen & PDF Suite' }),
      desc: t('pricing.suite.fileDesc', { defaultValue: 'Gabung PDF, kompres dokumen, konversi multi-format, & proteksi lokal.' }),
    },
    {
      icon: '🎬',
      name: 'SolveMyMedia',
      role: t('pricing.suite.media', { defaultValue: 'Video & Audio Trimmer' }),
      desc: t('pricing.suite.mediaDesc', { defaultValue: 'Pemangkasan video on-device, ekstraksi audio MP3, & konversi privat.' }),
    },
    {
      icon: '🏁',
      name: 'CreateMy-QR',
      role: t('pricing.suite.qr', { defaultValue: 'Vector & Dynamic QR' }),
      desc: t('pricing.suite.qrDesc', { defaultValue: 'Generator QR code resolusi tinggi, kustomisasi logo vektor SVG, & tanpa batas.' }),
    },
  ];

  const matrixRows = [
    {
      name: t('pricing.matrix.row1.name', { defaultValue: 'Batas Pemrosesan Batch' }),
      free: t('pricing.matrix.row1.free', { defaultValue: 'Hingga 10 foto / batch' }),
      pro: t('pricing.matrix.row1.pro', { defaultValue: 'Tanpa Batas foto / batch' }),
    },
    {
      name: t('pricing.matrix.row2.name', { defaultValue: 'Resolusi Ekspor' }),
      free: t('pricing.matrix.row2.free', { defaultValue: 'High-Definition Standar' }),
      pro: t('pricing.matrix.row2.pro', { defaultValue: 'Ultra-HD 4K & Lossless Asli' }),
    },
    {
      name: t('pricing.matrix.row3.name', { defaultValue: 'Model Pemrosesan AI' }),
      free: t('pricing.matrix.row3.free', { defaultValue: 'Model Standar Seimbang' }),
      pro: t('pricing.matrix.row3.pro', { defaultValue: 'Segmentasi Rambut Ultra-Presisi' }),
    },
    {
      name: t('pricing.matrix.row4.name', { defaultValue: 'Prioritas CPU Worker' }),
      free: t('pricing.matrix.row4.free', { defaultValue: 'Prioritas Standar' }),
      pro: t('pricing.matrix.row4.pro', { defaultValue: 'Akselerasi Paralel Multi-Core' }),
    },
    {
      name: t('pricing.matrix.row5.name', { defaultValue: 'Privasi Tanpa Upload Server' }),
      free: t('pricing.matrix.row5.free', { defaultValue: '100% Terlindungi' }),
      pro: t('pricing.matrix.row5.pro', { defaultValue: '100% Terlindungi' }),
    },
    {
      name: t('pricing.matrix.row6.name', { defaultValue: 'Watermark Hasil Ekspor' }),
      free: t('pricing.matrix.row6.free', { defaultValue: 'Bebas Watermark' }),
      pro: t('pricing.matrix.row6.pro', { defaultValue: 'Bebas Watermark' }),
    },
    {
      name: t('pricing.matrix.row7.name', { defaultValue: 'Lingkungan Ruang Kerja' }),
      free: t('pricing.matrix.row7.free', { defaultValue: 'Studio Standar' }),
      pro: t('pricing.matrix.row7.pro', { defaultValue: '100% Bebas Iklan Fokus Studio' }),
    },
    {
      name: t('pricing.matrix.row8.name', { defaultValue: 'Sinkronisasi Profil Akun' }),
      free: t('pricing.matrix.row8.free', { defaultValue: 'Profil Cloud Dasar' }),
      pro: t('pricing.matrix.row8.pro', { defaultValue: 'Sinkronisasi Cloud Penuh & Support Prioritas' }),
    },
    {
      name: t('pricing.matrix.row9.name', { defaultValue: 'Skema Biaya & Tagihan' }),
      free: t('pricing.matrix.row9.free', { defaultValue: 'Gratis Selamanya' }),
      pro: t('pricing.matrix.row9.pro', { defaultValue: 'Bulanan, Tahunan, atau Sekali Bayar Selamanya' }),
    },
    {
      name: t('pricing.matrix.row10.name', { defaultValue: 'Preset Marketplace & Export ZIP' }),
      free: t('pricing.matrix.row10.free', { defaultValue: 'Download 1-per-1 manual' }),
      pro: t('pricing.matrix.row10.pro', { defaultValue: '1-Click Bulk ZIP & Preset Resmi' }),
    },
  ];

  const faqs = [
    {
      q: t('pricing.faq1.q', { defaultValue: 'Apa perbedaan utama antara Paket Gratis dan Paket PRO?' }),
      a: t('pricing.faq1.a', {
        defaultValue:
          'Paket Gratis memberikan akses ke semua 14 alat AI dengan batas batch 10 foto dan resolusi HD. Paket PRO menghapus batas batch, membuka ekspor Ultra-HD 4K tanpa kompresi, mengaktifkan AI ultra-presisi untuk rambut, dan memberikan ruang kerja bebas iklan.',
      }),
    },
    {
      q: t('pricing.faq6.q', { defaultValue: 'Apa itu Founder Lifetime Pass dan bagaimana cara kerjanya?' }),
      a: t('pricing.faq6.a', {
        defaultValue:
          'Founder Lifetime Pass adalah penawaran khusus early-bird di mana Anda hanya perlu membayar 1 kali ($129) untuk mendapatkan seluruh kapabilitas PRO selamanya di seluruh ekosistem (4 Web Apps, Windows App, dan APK Mobile). Tidak ada biaya langganan bulanan atau tahunan, dan akun Anda otomatis mendapatkan semua alat baru yang kami rilis di masa depan.',
      }),
    },
    {
      q: t('pricing.faq7.q', { defaultValue: 'Mengapa HelpMyIMG bisa menawarkan Lifetime Deal tanpa membebani biaya server?' }),
      a: t('pricing.faq7.a', {
        defaultValue:
          'Tidak seperti layanan cloud AI lain yang membakar biaya server per gambar, arsitektur HelpMyIMG berjalan 100% lokal di browser Anda menggunakan WebAssembly dan Web Workers. Karena beban komputasi terjadi di perangkat Anda, biaya marginal server kami adalah $0.00, memungkinkan kami memberikan penawaran sekali bayar yang berkelanjutan.',
      }),
    },
    {
      q: t('pricing.faq2.q', { defaultValue: 'Apakah saya bisa membatalkan langganan PRO kapan saja?' }),
      a: t('pricing.faq2.a', {
        defaultValue:
          'Ya, tentu saja. Anda dapat membatalkan langganan bulanan atau tahunan kapan saja lewat menu akun Anda. Akun Anda akan tetap berstatus PRO sampai akhir periode tagihan berjalan.',
      }),
    },
    {
      q: t('pricing.faq3.q', { defaultValue: 'Apakah foto saya di-upload ke server jika menggunakan akun PRO?' }),
      a: t('pricing.faq3.a', {
        defaultValue:
          'Sama sekali tidak. Bahkan pada akun PRO, seluruh pemrosesan gambar tetap berjalan 100% lokal di perangkat Anda menggunakan Web Workers dan ONNX Runtime. Foto Anda tidak pernah menyentuh server mana pun.',
      }),
    },
    {
      q: t('pricing.faq4.q', { defaultValue: 'Metode pembayaran apa saja yang diterima?' }),
      a: t('pricing.faq4.a', {
        defaultValue:
          'Kami menerima kartu kredit/debit (Visa, Mastercard), QRIS, transfer bank lokal, GoPay, OVO, ShopeePay, Apple Pay, dan Google Pay via Lemon Squeezy resmi.',
      }),
    },
    {
      q: t('pricing.faq5.q', { defaultValue: 'Apakah akun PRO bisa digunakan di perangkat berbeda?' }),
      a: t('pricing.faq5.a', {
        defaultValue:
          'Bisa. Anda cukup login menggunakan Akun Google yang sama di laptop, komputer kantor, atau perangkat lain, status PRO Anda akan langsung aktif.',
      }),
    },
  ];

  return (
    <>
      <SeoHead
        title={`${t('pricing.title', { defaultValue: 'Pilihan Harga' })} - HelpMyIMG`}
        description={t('pricing.subtitle', {
          defaultValue: 'Mulai gratis dengan alat AI lokal lengkap atau upgrade ke PRO untuk produktivitas studio tanpa batas.',
        })}
        canonicalPath={lang === 'en' ? `/${localizedSlug}/` : `/${lang}/${localizedSlug}/`}
        lang={lang}
        infoPage="pricing"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-14 pb-20">

        {/* SECTION 1: HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8 relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-[#05DAED] text-xs font-mono font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            {t('pricing.badge', { defaultValue: 'PAKET JUJUR & TRANSPARAN' })}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-5 max-w-4xl mx-auto">
            {t('pricing.title', { defaultValue: 'Pilihan Harga Jelas & Transparan' })}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('pricing.subtitle', {
              defaultValue:
                'Mulai gratis dengan 14 alat AI lokal lengkap atau upgrade ke PRO untuk produktivitas studio tanpa batas.',
            })}
          </p>
        </motion.div>

        {/* SECTION 2: BILLING CYCLE PILL TOGGLE (Monthly Plan / Annual Plan SAVE 34%) */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="inline-flex items-center p-1.5 rounded-full bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-600 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${billingCycle === 'monthly'
                  ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              {t('pricing.billing.monthly', { defaultValue: 'Monthly Plan' })}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('yearly')}
              className={`relative px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${billingCycle === 'yearly'
                  ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
            >
              <span>{t('pricing.billing.yearly', { defaultValue: 'Annual Plan' })}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider">
                SAVE 34%
              </span>
            </button>
          </div>

          <div className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium text-center">
            {isYearly
              ? (lang === 'id' ? 'Setara $6.58/bln • Hemat 34% ($79/tahun)' : 'Equivalent to $6.58/mo • Save 34% ($79/year)')
              : (lang === 'id' ? '$9.99/bulan • Ditagih bulanan • Batal kapan saja' : '$9.99/month • Billed monthly • Cancel anytime')}
          </div>
        </div>

        {/* SECTION 3: THE 3 CARDS PRICING GRID (Free Plan | Annual/Monthly Plan | Founder Lifetime Pass) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto items-stretch mb-24">

          {/* ── CARD 1: FREE PLAN ── */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-700 shadow-sm flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300">
                FREE FOREVER
              </span>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4 mb-2">
                {t('pricing.free.name', { defaultValue: 'Free Plan' })}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[44px] leading-relaxed">
                {lang === 'id'
                  ? 'Alat AI foto penting untuk kebutuhan harian dan pengeditan cepat.'
                  : 'Essential AI Photo & Image editing tools for personal projects and everyday editing.'}
              </p>

              <div className="my-6 pt-4 border-t border-slate-100 dark:border-dark-700">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-slate-900 dark:text-white font-heading">$0</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">100% Free • No Credit Card Required</p>
              </div>

              <div className="mb-8">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  INCLUDED FEATURES
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Terhubung ke semua 4 Web Apps (Free tier)' : 'Connected to all 4 Web Apps (Free tier)'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.free.f1', { defaultValue: 'Akses ke semua 14 alat foto AI lokal' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.free.f2', { defaultValue: 'Proses batch hingga 10 foto sekaligus' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.free.f4', { defaultValue: '100% Privasi di perangkat (0 server upload)' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.free.f3', { defaultValue: 'Ekspor gambar resolusi HD standar' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Unduhan format standar PNG & WebP' : 'Standard PNG & WebP format downloads'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Penyimpanan riwayat browser lokal (IndexedDB)' : 'Local browser history storage (IndexedDB)'}</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleFreeAction}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-800 dark:text-white border border-slate-200 dark:border-dark-600 transition-all cursor-pointer text-center"
            >
              {user && !isPro
                ? (lang === 'id' ? 'Paket Aktif Saat Ini' : 'Current Plan')
                : (lang === 'id' ? 'Mulai Gratis Sekarang' : 'Start Free Now')}
            </button>
          </div>

          {/* ── CARD 2: ANNUAL / MONTHLY PLAN (FEATURED CYAN BRAND CARD) ── */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white dark:bg-dark-800 border-2 border-cyan-500/80 dark:border-[#05DAED] shadow-xl shadow-cyan-500/10 relative flex flex-col justify-between">
            {/* Top floating badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs uppercase px-4 py-1 rounded-full shadow-md shadow-cyan-500/25 flex items-center gap-1.5 whitespace-nowrap tracking-wider">
              {isYearly ? (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'PALING POPULER' : 'MOST POPULAR'}</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5" />
                  <span>{lang === 'id' ? 'FLEKSIBEL' : 'FLEXIBLE'}</span>
                </>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-2">
                {isYearly ? (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 text-xs font-bold uppercase tracking-wider">
                    SAVE 34%
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-[#05DAED] border border-cyan-500/25 text-xs font-bold uppercase tracking-wider">
                    FLEXIBLE
                  </span>
                )}
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {isYearly
                    ? (lang === 'id' ? 'Setara $6.58 / bln' : 'Equivalent to $6.58 / mo')
                    : (lang === 'id' ? 'Batal Kapan Saja' : 'Cancel Anytime')}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2 mb-2">
                {isYearly
                  ? (lang === 'id' ? 'Paket Tahunan' : 'Annual Plan')
                  : (lang === 'id' ? 'Paket Bulanan' : 'Monthly Plan')}
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[44px] leading-relaxed">
                {isYearly
                  ? (lang === 'id' ? 'Ditagih tahunan (setara $6.58/bln). Pilihan terbaik untuk kreator & bisnis.' : 'Billed annually ($6.58/mo equivalent). Best value for creators & agencies.')
                  : (lang === 'id' ? 'Fleksibilitas penuh untuk desainer, profesional, dan kebutuhan aktif.' : 'Full flexibility for professionals, designers, and active businesses.')}
              </p>

              <div className="my-6 pt-4 border-t border-slate-100 dark:border-dark-700">
                <div className="flex items-baseline gap-2">
                  {isYearly && <span className="text-xl text-slate-400 line-through font-semibold">$119.88</span>}
                  <span className="text-5xl font-black text-cyan-600 dark:text-[#05DAED] font-heading">
                    {isYearly ? '$79' : '$9.99'}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">
                    {isYearly ? '/ year' : '/ month'}
                  </span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                  {isYearly
                    ? (lang === 'id' ? 'Hemat $40.88 tiap tahun • Diskon 34%' : 'Save $40.88 every year • 34% Discount')
                    : (lang === 'id' ? 'Ditagih bulanan • Bebas batalkan kapan saja' : 'Billed monthly • Cancel anytime')}
                </p>
              </div>

              <div className="mb-8">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  INCLUDED FEATURES
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    <div className="w-4 h-4 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-[#05DAED] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                    <span>{lang === 'id' ? 'Akses penuh terhubung ke semua 4 Web Apps' : 'Connected full access to all 4 Web Apps'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.pro.f3', { defaultValue: 'Ekspor resolusi Ultra-HD 4K & Lossless asli' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.pro.f2', { defaultValue: 'Batch processing tanpa batas (100+ foto sekaligus)' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.pro.f4', { defaultValue: 'Model AI Ultra-Presisi untuk helai rambut halus' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Lisensi komersial & penggunaan proyek klien' : 'Commercial & client project usage license'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{t('pricing.pro.f5', { defaultValue: 'Akselerasi paralel multi-core Web Worker prioritas' })}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{isYearly ? (lang === 'id' ? 'Hemat 34% dibanding tagihan bulanan reguler' : 'Save 34% compared to regular monthly billing') : (lang === 'id' ? 'Ruang kerja 100% bebas iklan & prioritas support' : '100% ad-free studio & fast customer support')}</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleSubscribeAction(isYearly ? 'yearly' : 'monthly')}
              className="w-full py-3.5 px-6 rounded-2xl font-black text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>
                {isYearly
                  ? (lang === 'id' ? 'Masuk untuk Paket Tahunan' : 'Sign In for Annual Plan')
                  : (lang === 'id' ? 'Masuk untuk Berlangganan' : 'Sign In to Subscribe')}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* ── CARD 3: FOUNDER LIFETIME PASS (AMBER / GOLD CARD) ── */}
          <div className="rounded-3xl p-7 sm:p-8 bg-white dark:bg-dark-800 border-2 border-amber-400/80 dark:border-amber-400/60 shadow-xl relative flex flex-col justify-between">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                VIP FOUNDER SPECIAL
              </span>

              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-4 mb-2">
                Founder Lifetime Pass
              </h3>

              <p className="text-sm text-slate-500 dark:text-slate-400 min-h-[44px] leading-relaxed">
                {lang === 'id'
                  ? 'Sekali bayar, miliki selamanya di seluruh platform, aplikasi web, dan aplikasi desktop.'
                  : 'Pay once, own forever across all platforms, web apps, and desktop tools.'}
              </p>

              <div className="my-6 pt-4 border-t border-slate-100 dark:border-dark-700">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl text-slate-400 line-through font-semibold">$169</span>
                  <span className="text-5xl font-black text-amber-600 dark:text-amber-400 font-heading">$129</span>
                  <span className="text-slate-500 dark:text-slate-400 font-medium text-sm">/ one-time</span>
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-1">
                  {lang === 'id' ? 'Hemat $40 • Pembayaran Sekali Saja' : 'Save $40 • One-Time Payment'}
                </p>
              </div>

              <div className="mb-8">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  INCLUDED FEATURES
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    <Crown className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Akses Seumur Hidup ke semua 4 Web Apps' : 'Lifetime access to all 4 Web Apps'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    <Monitor className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Aplikasi Windows Desktop khusus disertakan (Native offline)' : 'Dedicated Windows Desktop App included (Native offline)'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold">
                    <Smartphone className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Aplikasi Mobile (Android APK & iOS) disertakan' : 'Mobile App (Android APK & iOS) included'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Semua update, tools & fitur masa depan disertakan selamanya' : 'All future updates, tools & major features included forever'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Lencana VIP Founder eksklusif & akses komunitas' : 'VIP Founder badge & exclusive community access'}</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{lang === 'id' ? 'Kanal dukungan developer VIP langsung 1-on-1' : 'Direct 1-on-1 VIP developer support channel'}</span>
                  </li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => handleSubscribeAction('lifetime')}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {lang === 'id' ? 'Masuk untuk Akses Lifetime' : 'Sign In for Lifetime Access'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* SECTION 4: THE 4 WEB APPS SUITE SHOWCASE */}
        <div className="max-w-6xl mx-auto mb-24">
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-50 dark:bg-dark-800/60 border border-slate-200 dark:border-dark-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl font-heading font-black text-slate-900 dark:text-white flex items-center gap-2.5">
                  <Layers className="w-5 h-5 text-cyan-600 dark:text-neon-cyan" />
                  <span>{t('pricing.suite.title', { defaultValue: '1 Akun Membuka Seluruh 4-in-1 Privacy Suite' })}</span>
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {lang === 'id' ? 'Akses penuh ke seluruh produk privasi tanpa batas.' : 'Full access across all privacy web applications.'}
                </p>
              </div>
              <span className="self-start sm:self-auto text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-[#05DAED] font-bold">
                ALL-ACCESS SUITE
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {suiteApps.map((app, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-dark-750 border border-slate-200 dark:border-dark-700 hover:border-cyan-500/40 transition-all flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-dark-700 inline-block mb-3 leading-none">
                      {app.icon}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                      <span>{app.name}</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    </h4>
                    <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold mb-1.5">{app.role}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{app.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 5: TABEL MATRIKS PERBANDINGAN FITUR (FEATURE MATRIX) */}
        <div className="mb-24 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-3">
              {t('pricing.matrix.title', { defaultValue: 'Tabel Perbandingan Fitur Rinci' })}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t('pricing.matrix.subtitle', {
                defaultValue:
                  'Bandingkan setiap kemampuan teknis antara Paket Gratis dan Paket PRO Studio secara transparan.',
              })}
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200 dark:border-dark-600 bg-white dark:bg-dark-800 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-dark-600 bg-slate-50 dark:bg-dark-900/60">
                  <th className="py-4 px-6 text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t('pricing.matrix.colFeature', { defaultValue: 'Fitur & Kapabilitas' })}
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-slate-600 dark:text-slate-400 text-center w-1/4">
                    {t('pricing.matrix.colFree', { defaultValue: 'Paket Gratis' })}
                  </th>
                  <th className="py-4 px-6 text-sm font-bold text-cyan-600 dark:text-[#05DAED] text-center w-1/4 bg-cyan-500/5">
                    {t('pricing.matrix.colPro', { defaultValue: 'Paket PRO Studio' })}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-dark-700/60 text-sm">
                {matrixRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-dark-700/30 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-800 dark:text-slate-200">
                      {row.name}
                    </td>
                    <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-400">
                      {row.free}
                    </td>
                    <td className="py-4 px-6 text-center font-bold text-slate-900 dark:text-white bg-cyan-500/5">
                      {row.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 6: VALUE PROPOSITION & COST SAVINGS */}
        <div className="grid md:grid-cols-3 gap-6 mb-24 max-w-6xl mx-auto">
          <div className="p-8 rounded-3xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-[#05DAED] flex items-center justify-center mb-5">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'id' ? 'Komputasi Lokal di Browser' : 'Local In-Browser Compute'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {lang === 'id'
                ? 'Karena AI berjalan langsung di memori perangkat Anda via WebAssembly, tidak ada tagihan server GPU mahal yang kami bebankan kepada Anda.'
                : 'Because AI runs directly on your hardware via WebAssembly, we do not burden you with inflated cloud GPU server bills.'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-5">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'id' ? '100% Privasi & Tanpa Risiko' : '100% Privacy Guarantee'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {lang === 'id'
                ? 'Foto keluarga, berkas identitas paspor, maupun portofolio klien Anda tidak pernah di-upload ke server cloud manapun.'
                : 'Family portraits, official passport scans, and sensitive client work never upload to any remote cloud database.'}
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              {lang === 'id' ? 'Batal Kapan Saja & Bebas Risiko' : 'Cancel Anytime & Zero Risk'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              {lang === 'id'
                ? 'Tanpa kontrak mengikat. Anda dapat membatalkan langganan PRO sewaktu-waktu dengan 1 klik mudah di pengaturan akun Anda.'
                : 'No lock-in contracts. Cancel your monthly subscription with 1 simple click anytime from your account settings.'}
            </p>
          </div>
        </div>

        {/* SECTION 7: PRICING FAQ ACCORDION */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-slate-900 dark:text-white mb-2">
              {t('pricing.faq.title', { defaultValue: 'Pertanyaan Umum Seputar Harga' })}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {t('pricing.faq.subtitle', {
                defaultValue: 'Semua jawaban yang Anda butuhkan seputar Paket Gratis dan PRO di HelpMyIMG.',
              })}
            </p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-dark-800 border border-slate-200 dark:border-dark-600 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left focus:outline-none cursor-pointer"
                >
                  <span className="text-base font-bold text-slate-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  <div
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${openFaq === idx
                        ? 'rotate-180 bg-cyan-500/20 text-[#05DAED]'
                        : 'text-slate-400 bg-slate-100 dark:bg-dark-700'
                      }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-dark-700/50 pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 8: GUARANTEE BANNER */}
        <div className="max-w-4xl mx-auto p-8 rounded-3xl bg-slate-100 dark:bg-dark-800/80 border border-slate-200 dark:border-dark-600 text-center">
          <ShieldCheck className="w-10 h-10 text-cyan-500 dark:text-[#05DAED] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
            {t('pricing.guarantee.title', { defaultValue: 'Jaminan Langganan 100% Bebas Risiko' })}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            {t('pricing.guarantee.desc', {
              defaultValue:
                'Batalkan langganan kapan saja cukup dengan 1 klik dari profil akun Anda. Tanpa komitmen jangka panjang, tanpa biaya tersembunyi, dan akses langsung ke seluruh fasilitas PRO.',
            })}
          </p>
        </div>
      </div>
    </>
  );
};
