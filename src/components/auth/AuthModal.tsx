// src/components/auth/AuthModal.tsx
// Modal masuk & daftar akun (Email & Password + Google OAuth) dengan dukungan multi-bahasa

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertCircle, ShieldCheck, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { isFirebaseConfigured } from '../../config/firebase';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();
  const { t } = useTranslation();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setErrorMsg(null);
  };

  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrorMsg(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      setErrorMsg(
        t('auth.notConfigured', {
          defaultValue: 'Firebase belum dikonfigurasi. Harap atur VITE_FIREBASE_* di file .env.local.',
        })
      );
      return;
    }

    if (!email.trim() || !password) {
      setErrorMsg(t('auth.fillAllFields', { defaultValue: 'Harap isi semua kolom.' }));
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t('auth.weakPassword', { defaultValue: 'Kata sandi minimal 6 karakter.' }));
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      resetForm();
      closeAuthModal();
    } catch (err: any) {
      const code = err?.code;
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-email'
      ) {
        setErrorMsg(t('auth.invalidCredentials', { defaultValue: 'Email atau kata sandi tidak valid.' }));
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg(t('auth.emailInUse', { defaultValue: 'Email ini sudah terdaftar. Silakan masuk.' }));
      } else if (code === 'auth/weak-password') {
        setErrorMsg(t('auth.weakPassword', { defaultValue: 'Kata sandi minimal 6 karakter.' }));
      } else {
        setErrorMsg(err?.message || 'Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setErrorMsg(
        t('auth.notConfigured', {
          defaultValue: 'Firebase belum dikonfigurasi. Harap atur VITE_FIREBASE_* di file .env.local.',
        })
      );
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      resetForm();
      closeAuthModal();
    } catch (err: any) {
      setErrorMsg(err?.message || 'Gagal masuk dengan Google. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            resetForm();
            closeAuthModal();
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-6 md:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              resetForm();
              closeAuthModal();
            }}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-[#05DAED] mb-3 border border-cyan-100 dark:border-cyan-800/40">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === 'signin'
                ? t('auth.signInTitle', { defaultValue: 'Masuk ke HelpMyIMG' })
                : t('auth.signUpTitle', { defaultValue: 'Buat Akun Baru' })}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'signin'
                ? t('auth.signInSubtitle', {
                    defaultValue: 'Akses akun Anda, simpan preferensi, dan nikmati fitur eksklusif PRO.',
                  })
                : t('auth.signUpSubtitle', {
                    defaultValue: 'Daftar dan nikmati pemrosesan gambar tanpa batas langsung di browser.',
                  })}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3.5 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('auth.emailLabel', { defaultValue: 'Alamat Email' })}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder', { defaultValue: 'nama@email.com' })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('auth.passwordLabel', { defaultValue: 'Kata Sandi' })}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder', { defaultValue: '••••••••' })}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 font-bold text-sm rounded-xl shadow-md hover:brightness-105 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-dark-900" />
                  <span>
                    {mode === 'signin'
                      ? t('auth.signingIn', { defaultValue: 'Menghubungkan...' })
                      : t('auth.creatingAccount', { defaultValue: 'Mendaftarkan...' })}
                  </span>
                </>
              ) : (
                <span>
                  {mode === 'signin'
                    ? t('auth.submitSignIn', { defaultValue: 'Masuk' })
                    : t('auth.submitSignUp', { defaultValue: 'Daftar' })}
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
            <span className="bg-white dark:bg-dark-800 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
              {t('auth.orDivider', { defaultValue: 'atau' })}
            </span>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-white hover:bg-slate-50 dark:bg-dark-900 dark:hover:bg-dark-700/80 text-slate-700 dark:text-slate-200 font-medium text-sm rounded-xl border border-slate-300 dark:border-slate-600 shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
              <span>{t('auth.googleBtn', { defaultValue: 'Lanjutkan dengan Google' })}</span>
            </button>

            {/* Mode switch */}
            <div className="text-center text-xs text-slate-500 dark:text-slate-400">
              {mode === 'signin' ? (
                <>
                  <span>{t('auth.noAccount', { defaultValue: 'Belum punya akun?' })}{' '}</span>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className="font-semibold text-cyan-600 dark:text-[#05DAED] hover:underline cursor-pointer"
                  >
                    {t('auth.switchToSignUp', { defaultValue: 'Daftar sekarang' })}
                  </button>
                </>
              ) : (
                <>
                  <span>{t('auth.hasAccount', { defaultValue: 'Sudah punya akun?' })}{' '}</span>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="font-semibold text-cyan-600 dark:text-[#05DAED] hover:underline cursor-pointer"
                  >
                    {t('auth.switchToSignIn', { defaultValue: 'Masuk' })}
                  </button>
                </>
              )}
            </div>

            {/* Note on security */}
            <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed px-2 pt-1 border-t border-slate-100 dark:border-slate-800">
              {t('auth.privacyNote', {
                defaultValue: 'Dengan melanjutkan, Anda menyetujui Ketentuan Layanan & Kebijakan Privasi HelpMyIMG.',
              })}
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
