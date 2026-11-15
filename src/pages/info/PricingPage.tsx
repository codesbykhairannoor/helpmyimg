// src/pages/info/PricingPage.tsx
// Halaman Pilihan Harga Resmi HelpMyIMG: 2 Pilihan Sederhana (Paket Gratis & Paket Berbayar PRO)
// Dilengkapi Billing Cycle Switcher: Langganan Bulanan & Founder Lifetime Pass (Early-Bird)

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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PricingPage: React.FC = () => {
  const { t, lang } = useTranslation();
  const { user, isPro, openAuthModal } = useAuth();
  const { navigatePath } = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'lifetime'>('lifetime');

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

  const handleProAction = () => {
    if (!user) {
      openAuthModal();
    } else if (isPro) {
      navigatePath(lang === 'en' ? '/' : `/${lang}/`);
    } else {
      alert(
        lang === 'id'
          ? 'Fitur gateway pembayaran sedang dihubungkan. Akun Anda telah siap untuk aktivasi PRO.'
          : 'Payment gateway integration is ready. Your account is primed for PRO activation.'
      );
    }
  };

  const isLifetime = billingCycle === 'lifetime';

  const proPrice = isLifetime
    ? (lang === 'id' ? 'Rp 249.000' : '$24.99')
    : (lang === 'id' ? 'Rp 49.000' : '$4.99');

  const proPeriod = isLifetime
    ? t('pricing.lifetime.period', { defaultValue: 'Sekali bayar, akses selamanya' })
    : t('pricing.pro.period', { defaultValue: '/ bulan' });

  const freeFeatures = [
    t('pricing.free.f1', { defaultValue: 'Akses ke semua 14 alat foto AI lokal' }),
    t('pricing.free.f2', { defaultValue: 'Proses batch hingga 10 foto sekaligus' }),
    t('pricing.free.f3', { defaultValue: 'Ekspor gambar resolusi HD standar' }),
    t('pricing.free.f4', { defaultValue: '100% Privasi di perangkat (0 upload server)' }),
    t('pricing.free.f5', { defaultValue: 'Tanpa watermark pada hasil unduhan' }),
    t('pricing.free.f6', { defaultValue: 'Dukungan antarmuka 30 bahasa dunia' }),
  ];

  const proFeatures = isLifetime
    ? [
        t('pricing.lifetime.f1', { defaultValue: 'Akses seumur hidup ke semua 14+ alat AI lokal' }),
        t('pricing.lifetime.f2', { defaultValue: 'Batch processing tanpa batas (100+ foto sekaligus)' }),
        t('pricing.lifetime.f3', { defaultValue: 'Ekspor Ultra-HD 4K & resolusi asli lossless' }),
        t('pricing.lifetime.f4', { defaultValue: 'Akses gratis ke semua fitur & model AI baru di masa depan' }),
        t('pricing.lifetime.f5', { defaultValue: '1-Click Export ZIP & Preset Kanvas Marketplace' }),
        t('pricing.lifetime.f6', { defaultValue: 'Lencana eksklusif Founder Member di profil akun' }),
        t('pricing.lifetime.f7', { defaultValue: 'Zero Server Uploads & Lisensi Komersial Lengkap' }),
        t('pricing.lifetime.f8', { defaultValue: 'Sekali bayar, tanpa tagihan tersembunyi' }),
      ]
    : [
        t('pricing.pro.f1', { defaultValue: 'Semua fitur yang ada di Paket Gratis' }),
        t('pricing.pro.f2', { defaultValue: 'Batch processing tanpa batas (50+ foto sekaligus)' }),
        t('pricing.pro.f3', { defaultValue: 'Ekspor Ultra-HD & resolusi asli 4K lossless' }),
        t('pricing.pro.f4', { defaultValue: 'Mode AI Ultra-Presisi untuk helai rambut halus' }),
        t('pricing.pro.f5', { defaultValue: 'Akselerasi multi-core Web Worker prioritas' }),
        t('pricing.pro.f6', { defaultValue: 'Lencana akun PRO resmi & sinkronisasi cloud' }),
        t('pricing.pro.f7', { defaultValue: 'Ruang kerja studio 100% bebas iklan' }),
        t('pricing.pro.f8', { defaultValue: 'Dukungan pelanggan prioritas & akses fitur baru lebih awal' }),
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
      pro: t('pricing.matrix.row9.pro', { defaultValue: 'Bulanan atau Sekali Bayar Selamanya' }),
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
          'Founder Lifetime Pass adalah penawaran khusus early-bird di mana Anda hanya perlu membayar 1 kali (Rp 249.000 / $24.99) untuk mendapatkan seluruh kapabilitas PRO selamanya. Tidak ada biaya langganan bulanan atau tahunan, dan akun Anda otomatis mendapatkan semua alat baru yang kami rilis di masa depan.',
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
          'Ya, tentu saja. Anda dapat membatalkan langganan bulanan kapan saja lewat menu akun Anda. Akun Anda akan tetap berstatus PRO sampai akhir periode tagihan berjalan.',
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
          'Kami menerima kartu kredit/debit (Visa, Mastercard), QRIS, transfer bank lokal, GoPay, OVO, ShopeePay, Apple Pay, dan Google Pay.',
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
          className="text-center mb-10 relative"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-[#05DAED] text-xs font-mono font-bold uppercase tracking-wider mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            {t('pricing.badge', { defaultValue: 'PAKET JUJUR & TRANSPARAN' })}
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
            {t('pricing.title', { defaultValue: 'Pilihan Harga Jelas & Transparan' })}
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('pricing.subtitle', {
              defaultValue:
                'Mulai gratis dengan 14 alat AI lokal lengkap atau upgrade ke PRO untuk produktivitas studio tanpa batas.',
            })}
          </p>
        </motion.div>

        {/* BILLING CYCLE SWITCHER */}
        <div className="flex flex-col items-center justify-center mb-12">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-600 shadow-inner">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white dark:bg-dark-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {t('pricing.billing.monthly', { defaultValue: 'Langganan Bulanan' })}
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('lifetime')}
              className={`relative px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
                billingCycle === 'lifetime'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-300" />
              <span>{t('pricing.billing.lifetime', { defaultValue: 'Founder Lifetime Pass' })}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                {t('pricing.billing.saveBadge', { defaultValue: 'HEMAT 80%' })}
              </span>
            </button>
          </div>
          {isLifetime && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-xs font-mono font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('pricing.billing.slotsLeft', { defaultValue: 'Sisa 47 dari 200 Kuota Early Bird' })}</span>
            </motion.div>
          )}
        </div>

        {/* SECTION 2: DUA PAKET HARGA (FREE & PRO) */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-24 items-stretch">
          {/* TIER 1: PAKET GRATIS (FREE) */}
          <div className="flex flex-col justify-between bg-white dark:bg-dark-800 rounded-3xl border border-slate-200 dark:border-dark-600 p-8 sm:p-10 shadow-sm hover:shadow-md transition-shadow relative">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('pricing.free.name', { defaultValue: 'Paket Gratis (Free)' })}
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-300">
                  {t('pricing.free.period', { defaultValue: 'Gratis Selamanya' })}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-heading">
                  {lang === 'id' ? 'Rp 0' : '$0'}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t('pricing.free.period', { defaultValue: 'Gratis Selamanya' })}
                </span>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                {t('pricing.free.desc', {
                  defaultValue:
                    'Alat AI lokal esensial untuk kreator individu, pelajar, dan kebutuhan editing foto harian.',
                })}
              </p>

              <div className="space-y-3.5 mb-8">
                {freeFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={handleFreeAction}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-800 dark:text-white border border-slate-300 dark:border-dark-500/80 transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {user && !isPro
                    ? t('pricing.free.btnActive', { defaultValue: 'Paket Aktif Saat Ini' })
                    : t('pricing.free.btn', { defaultValue: 'Mulai Gratis Sekarang' })}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* TIER 2: PAKET BERBAYAR PRO (PRO STUDIO / FOUNDER LIFETIME) */}
          <div className="flex flex-col justify-between bg-gradient-to-b from-dark-800 to-dark-900 rounded-3xl border-2 border-cyan-500 dark:border-[#05DAED] p-8 sm:p-10 shadow-xl shadow-cyan-500/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 font-black text-[11px] uppercase tracking-wider py-1.5 px-4 rounded-bl-xl shadow-sm">
              {isLifetime
                ? t('pricing.lifetime.badge', { defaultValue: 'FOUNDER PASS (SLOT TERBATAS)' })
                : t('pricing.pro.badge', { defaultValue: 'PALING DIMINATI' })}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <Crown className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-bold uppercase tracking-wider text-cyan-400 font-mono">
                  {isLifetime
                    ? t('pricing.lifetime.name', { defaultValue: 'Paket PRO Founder Lifetime' })
                    : t('pricing.pro.name', { defaultValue: 'Paket PRO Studio' })}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl sm:text-5xl font-black text-white font-heading tracking-tight">
                  {proPrice}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  {proPeriod}
                </span>
              </div>

              <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                {isLifetime
                  ? t('pricing.lifetime.desc', {
                      defaultValue:
                        'Akses penuh tanpa batas seumur hidup ke seluruh ekosistem HelpMyIMG. Tanpa tagihan berulang, tanpa biaya bulanan, dan jaminan gratis selamanya untuk pembaruan fitur baru.',
                    })
                  : t('pricing.pro.desc', {
                      defaultValue:
                        'Kekuatan batch tak terbatas, ekspor Ultra-HD 4K tanpa kompresi, dan kecepatan prioritas multi-core.',
                    })}
              </p>

              <div className="space-y-3.5 mb-8">
                {proFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-100">
                    <div className="w-5 h-5 rounded-full bg-cyan-400/20 text-[#05DAED] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <span className={idx === 1 || idx === 2 ? 'font-bold text-[#05DAED]' : ''}>
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                onClick={handleProAction}
                className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-300" />
                <span>
                  {isPro
                    ? t('pricing.pro.btnActive', { defaultValue: 'Member PRO Aktif' })
                    : isLifetime
                    ? t('pricing.lifetime.btn', { defaultValue: 'Klaim Founder Lifetime Pass' })
                    : t('pricing.pro.btn', { defaultValue: 'Berlangganan PRO Sekarang' })}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 3: TABEL MATRIKS PERBANDINGAN FITUR (FEATURE MATRIX) */}
        <div className="mb-24">
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

        {/* SECTION 4: VALUE PROPOSITION & COST SAVINGS */}
        <div className="grid md:grid-cols-3 gap-6 mb-24">
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

        {/* SECTION 5: PRICING FAQ ACCORDION */}
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
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 ${
                      openFaq === idx
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

        {/* SECTION 6: GUARANTEE BANNER */}
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
