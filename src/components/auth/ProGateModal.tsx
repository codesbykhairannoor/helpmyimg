// src/components/auth/ProGateModal.tsx
// Modal Alert Gate Eksklusif HelpMyIMG: Free Trial Sign-In vs PRO Upgrade
// Desain modern, bersih, glassmorphism dengan pendaran neon cyan/emerald khas HelpMyIMG

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Crown, Loader2, ArrowRight, Mail, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useProGate } from '../../context/ProGateContext';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { useRouter } from '../../context/RouterContext';
import { getLocalizedInfoSlug } from '../../utils/infoUrlMapper';

export const ProGateModal: React.FC = () => {
  const { isOpen, gateOptions, closeProGate, quotaState } = useProGate();
  const { user, isPro, signInWithGoogle, openAuthModal } = useAuth();
  const { t, lang } = useTranslation();
  const { navigatePath } = useRouter();

  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  if (!isOpen) return null;

  const feature = gateOptions?.feature || 'export-4k';
  const isTrial = !user; // Belum login -> tawarkan free trial / sign in

  const handleGoogleSignIn = async () => {
    try {
      setLoadingGoogle(true);
      setGoogleError(null);
      await signInWithGoogle();
      closeProGate();
      // Jalankan callback onSuccess bila ada
      if (gateOptions.onSuccess) {
        gateOptions.onSuccess();
      }
    } catch (err: any) {
      console.error('Google Sign-In failed inside ProGateModal:', err);
      setGoogleError(err?.message || 'Gagal masuk dengan Google. Silakan coba lagi.');
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleOpenEmailAuth = () => {
    closeProGate();
    openAuthModal();
  };

  const handleGoToPricing = () => {
    closeProGate();
    const pricingSlug = getLocalizedInfoSlug('pricing', lang);
    const targetUrl = lang === 'en' ? `/${pricingSlug}` : `/${lang}/${pricingSlug}`;
    navigatePath(targetUrl);
  };

  const handleDismiss = () => {
    closeProGate();
    if (gateOptions.onProceedFallback) {
      gateOptions.onProceedFallback();
    }
  };

  // Konfigurasi konten dinamis berdasarkan fitur & status login
  let badgeText = '';
  let titleText = '';
  let descText = '';

  if (isTrial) {
    if (feature === 'batch-limit') {
      badgeText = t('gate.badgeTrialBatch', { defaultValue: '✨ 10 FOTO / BATCH GRATIS' });
      titleText = t('gate.titleTrialBatch', { defaultValue: 'Buka Batch 10 Foto Gratis' });
      descText = t('gate.descTrialBatch', {
        defaultValue: 'Masuk dengan Google atau Email untuk memproses hingga 10 foto sekaligus langsung di browser Anda.',
      });
    } else if (feature === 'rename-zip') {
      badgeText = t('gate.badgeTrialGeneral', { defaultValue: '✨ FITUR ANGGOTA GRATIS' });
      titleText = t('gate.titleTrialGeneral', { defaultValue: 'Masuk untuk Membuka Fitur' });
      descText = t('gate.descTrialGeneral', {
        defaultValue: 'Masuk dengan Google atau Email untuk membuka kustomisasi nama file dan riwayat lokal tanpa batas.',
      });
    } else {
      // Default: export-4k
      badgeText = t('gate.badgeTrial4k', { defaultValue: '✨ 3X EKSPOR 4K GRATIS / HARI' });
      titleText = t('gate.titleTrial4k', { defaultValue: 'Coba Ekspor Resolusi 4K Asli' });
      descText = t('gate.descTrial4k', {
        defaultValue: 'Masuk dengan Google atau Email untuk membuka 3x ekspor resolusi asli 4K & lossless setiap hari tanpa kompresi.',
      });
    }
  } else {
    // User sudah login tapi kuota harian habis / fitur eksklusif PRO
    if (feature === 'batch-limit') {
      badgeText = t('gate.badgeProBatch', { defaultValue: '👑 FITUR PRO' });
      titleText = t('gate.titleProBatch', { defaultValue: 'Buka Batch 100+ Foto Sekaligus' });
      descText = t('gate.descProBatch', {
        defaultValue: 'Akun gratis dibatasi 10 foto per batch. Tingkatkan ke PRO untuk memproses hingga 100 foto sekaligus dengan akselerasi multi-core.',
      });
    } else if (feature === 'rename-zip') {
      badgeText = t('gate.badgeProRename', { defaultValue: '👑 FITUR PRO' });
      titleText = t('gate.titleProRename', { defaultValue: 'Buka Smart Rename & Custom ZIP' });
      descText = t('gate.descProRename', {
        defaultValue: 'Ganti nama massal dan custom file ZIP adalah fitur eksklusif PRO. Tingkatkan ke PRO untuk alur kerja lebih cepat.',
      });
    } else {
      // Default: export-4k
      badgeText = t('gate.badgePro4k', { defaultValue: '👑 FITUR PRO' });
      titleText = t('gate.titlePro4k', { defaultValue: 'Buka Ekspor 4K Tanpa Batas' });
      descText = t('gate.descPro4k', {
        defaultValue: 'Anda telah menggunakan kuota 3x ekspor 4K gratis hari ini. Tingkatkan ke PRO untuk ekspor 4K tanpa batas & tanpa kompresi.',
      });
    }
  }

  const dismissLabel =
    feature === 'export-4k'
      ? t('gate.dismissHd', { defaultValue: 'Mungkin nanti (Unduh Standar HD)' })
      : t('gate.dismissLater', { defaultValue: 'Mungkin nanti' });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleDismiss}
          className="fixed inset-0 bg-slate-950/65 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 12 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[420px] rounded-3xl bg-white dark:bg-dark-850 border border-slate-200/90 dark:border-dark-700/80 shadow-2xl p-6 sm:p-8 z-10 flex flex-col items-center text-center overflow-hidden"
        >
          {/* Subtle Ambient Top Glow */}
          <div
            className={`absolute -top-24 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full blur-3xl pointer-events-none -z-10 ${
              isTrial ? 'bg-cyan-500/20' : 'bg-blue-600/20'
            }`}
          />

          {/* Close button (X) */}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-dark-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Glowing Icon Box */}
          <div className="relative mb-3.5">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg relative ${
                isTrial
                  ? 'bg-gradient-to-tr from-[#05DAED] to-[#12DA91] text-slate-950 shadow-cyan-500/30'
                  : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
              }`}
            >
              {isTrial ? (
                <Sparkles className="w-7 h-7 stroke-[2.2]" />
              ) : (
                <Crown className="w-7 h-7 stroke-[2.2]" />
              )}
            </div>
            {/* Soft Radial Under-Glow */}
            <div
              className={`absolute -inset-1.5 rounded-2xl blur-md opacity-60 -z-10 ${
                isTrial ? 'bg-cyan-400' : 'bg-indigo-500'
              }`}
            />
          </div>

          {/* Badge Pill */}
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2.5 ${
              isTrial
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-neon-cyan border border-cyan-500/25'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
            }`}
          >
            {badgeText}
          </span>

          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight mb-2">
            {titleText}
          </h3>

          {/* Description */}
          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-xs">
            {descText}
          </p>

          {/* Error Message if Google Sign-In Fails */}
          {googleError && (
            <div className="w-full mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-left">
              {googleError}
            </div>
          )}

          {/* Action Buttons Section */}
          <div className="w-full flex flex-col gap-2.5">
            {isTrial ? (
              <>
                {/* 1-Click Google Sign-In */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loadingGoogle}
                  className="w-full py-3.5 px-5 rounded-2xl border-2 border-slate-200 dark:border-dark-700 hover:border-slate-300 dark:hover:border-dark-600 bg-white dark:bg-dark-800 text-slate-800 dark:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer group disabled:opacity-50"
                >
                  {loadingGoogle ? (
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                  ) : (
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  )}
                  <span>{t('gate.btnGoogle', { defaultValue: 'Continue with Google (1-Click)' })}</span>
                </button>

                {/* Email / Password Secondary Button */}
                <button
                  type="button"
                  onClick={handleOpenEmailAuth}
                  className="w-full py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-dark-750 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{t('gate.btnEmail', { defaultValue: 'Or continue with Email / Password' })}</span>
                </button>
              </>
            ) : (
              /* PRO Upgrade Primary Button */
              <button
                type="button"
                onClick={handleGoToPricing}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>{t('gate.btnUpgrade', { defaultValue: 'Upgrade to PRO — From $6.58/mo' })}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {/* Maybe Later Link */}
            <button
              type="button"
              onClick={handleDismiss}
              className="mt-1 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              {dismissLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
