// src/components/auth/AuthModal.tsx
// Modal masuk, daftar akun, verifikasi email, dan lupa kata sandi dengan perlindungan anti-abuse

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Lock,
  ArrowLeft,
  KeyRound,
  Send,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';
import { isFirebaseConfigured, auth } from '../../config/firebase';

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset' | 'verifyEmail';

export const AuthModal: React.FC = () => {
  const {
    user,
    isAuthModalOpen,
    authModalInitialMode,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendEmailVerificationLink,
    verifyEmailWithCode,
    reloadUser,
    deleteAccount,
    signOut,
    sendPasswordReset,
    confirmNewPassword,
  } = useAuth();
  const { t } = useTranslation();

  const [mode, setMode] = useState<AuthMode>('signin');
  const [resetCode, setResetCode] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer cooldown untuk pengiriman ulang email verifikasi
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Periksa apakah ada parameter reset password atau verify email dari URL email
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const urlMode = urlParams.get('mode');
    const oobCode = urlParams.get('oobCode');

    if (urlMode === 'resetPassword' && oobCode) {
      setResetCode(oobCode);
      setMode('reset');
      openAuthModal();
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if ((urlMode === 'verifyEmail' || urlMode === 'signIn') && oobCode) {
      setLoading(true);
      verifyEmailWithCode(oobCode)
        .then(() => {
          setSuccessMsg(
            t('auth.emailVerifiedSuccess', {
              defaultValue: 'Email successfully verified! Welcome to HelpMyIMG.',
            })
          );
          setMode('signin');
          openAuthModal();
        })
        .catch((err: any) => {
          setErrorMsg(err?.message || 'Failed to verify email. Link may have expired.');
          setMode('signin');
          openAuthModal();
        })
        .finally(() => {
          setLoading(false);
          window.history.replaceState({}, document.title, window.location.pathname);
        });
    }
  }, [openAuthModal, verifyEmailWithCode, t]);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
  }, []);

  // Set initial mode jika diminta via openAuthModal
  useEffect(() => {
    if (isAuthModalOpen) {
      const validModes: AuthMode[] = ['signin', 'signup', 'forgot', 'reset', 'verifyEmail'];
      if (typeof authModalInitialMode === 'string' && validModes.includes(authModalInitialMode as AuthMode)) {
        setMode(authModalInitialMode as AuthMode);
      } else {
        setMode('signin');
      }
    }
  }, [isAuthModalOpen, authModalInitialMode]);

  // Otomatis tutup modal jika user sudah login dan terverifikasi
  useEffect(() => {
    if (user && isAuthModalOpen && mode !== 'verifyEmail') {
      if (user.emailVerified) {
        resetForm();
        closeAuthModal();
      }
    }
  }, [user, isAuthModalOpen, closeAuthModal, resetForm, mode]);

  if (!isAuthModalOpen) return null;
  if (user && user.emailVerified && mode !== 'verifyEmail') return null;

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFirebaseConfigured) {
      setErrorMsg(
        t('auth.notConfigured', {
          defaultValue: 'Firebase is not configured. Please set VITE_FIREBASE_* in your environment.',
        })
      );
      return;
    }

    // In-app Reset Password confirmation flow
    if (mode === 'reset') {
      if (!resetCode) {
        setErrorMsg('Invalid or expired password reset link.');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMsg(t('auth.weakPassword', { defaultValue: 'Password must be at least 6 characters.' }));
        return;
      }

      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        await confirmNewPassword(resetCode, password);
        setSuccessMsg(
          t('auth.passwordResetSuccess', {
            defaultValue: 'Password has been successfully updated! Please sign in.',
          })
        );
        setTimeout(() => {
          setMode('signin');
          setPassword('');
          setErrorMsg(null);
        }, 1500);
      } catch (err: any) {
        setErrorMsg(err?.message || 'Failed to reset password. Link may have expired.');
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!email.trim()) {
      setErrorMsg(t('auth.fillEmail', { defaultValue: 'Please enter your email address.' }));
      return;
    }

    // Forgot password flow
    if (mode === 'forgot') {
      setLoading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      try {
        await sendPasswordReset(email);
        setSuccessMsg(
          t('auth.resetEmailSent', {
            defaultValue: 'Password reset link sent to your email. Please check your inbox or spam folder.',
          })
        );
      } catch (err: any) {
        const code = err?.code;
        if (code === 'auth/user-not-found' || code === 'auth/invalid-email') {
          setErrorMsg(t('auth.userNotFound', { defaultValue: 'No account found with this email address.' }));
        } else {
          setErrorMsg(err?.message || 'Error sending password reset email.');
        }
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg(t('auth.fillAllFields', { defaultValue: 'Please fill in all fields.' }));
      return;
    }

    if (password.length < 6) {
      setErrorMsg(t('auth.weakPassword', { defaultValue: 'Password must be at least 6 characters.' }));
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        // Periksa apakah email sudah diverifikasi
        if (auth?.currentUser && !auth.currentUser.emailVerified) {
          setMode('verifyEmail');
          setErrorMsg(
            t('auth.unverifiedNotice', {
              defaultValue: 'Please verify your email address before using your account.',
            })
          );
          setResendCooldown(60);
          return;
        }
        resetForm();
        closeAuthModal();
      } else {
        // Pendaftaran manual: Buat akun & kirim email verifikasi Firebase secara otomatis
        await signUpWithEmail(email, password);
        setMode('verifyEmail');
        setSuccessMsg(
          t('auth.verificationSent', {
            defaultValue: 'Verification email sent! Please check your inbox or spam folder.',
          })
        );
        setResendCooldown(60);
      }
    } catch (err: any) {
      const code = err?.code;
      if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-email'
      ) {
        setErrorMsg(t('auth.invalidCredentials', { defaultValue: 'Invalid email or password.' }));
      } else if (code === 'auth/email-already-in-use') {
        setErrorMsg(t('auth.emailInUse', { defaultValue: 'This email is already registered. Please sign in.' }));
      } else if (code === 'auth/weak-password') {
        setErrorMsg(t('auth.weakPassword', { defaultValue: 'Password must be at least 6 characters.' }));
      } else {
        setErrorMsg(err?.message || 'An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await sendEmailVerificationLink();
      setResendCooldown(60);
      setSuccessMsg(
        t('auth.verificationSent', {
          defaultValue: 'Verification email sent! Please check your inbox or spam folder.',
        })
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerified = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const isVerified = await reloadUser();
      if (isVerified) {
        setSuccessMsg(
          t('auth.emailVerifiedSuccess', {
            defaultValue: 'Email successfully verified! Welcome to HelpMyIMG.',
          })
        );
        setTimeout(() => {
          resetForm();
          closeAuthModal();
        }, 1200);
      } else {
        setErrorMsg(
          t('auth.notVerifiedYet', {
            defaultValue: 'Email is not verified yet. Please click the link in your email and try again.',
          })
        );
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Error checking verification status.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isFirebaseConfigured) {
      setErrorMsg(
        t('auth.notConfigured', {
          defaultValue: 'Firebase is not configured. Please set VITE_FIREBASE_* in your environment.',
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
      if (err?.code !== 'auth/popup-closed-by-user' && err?.code !== 'auth/popup-blocked') {
        setErrorMsg(err?.message || 'Failed to sign in with Google. Please try again.');
      }
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
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-[#05DAED] mb-3 border border-cyan-100 dark:border-cyan-800/40">
              {mode === 'forgot' || mode === 'reset' ? (
                <KeyRound className="w-6 h-6" />
              ) : mode === 'verifyEmail' ? (
                <Mail className="w-6 h-6" />
              ) : (
                <ShieldCheck className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === 'signup'
                ? t('auth.signUpTitle', { defaultValue: 'Create an Account' })
                : mode === 'forgot'
                ? t('auth.forgotPasswordTitle', { defaultValue: 'Reset Password' })
                : mode === 'reset'
                ? t('auth.resetNewPasswordTitle', { defaultValue: 'Set New Password' })
                : mode === 'verifyEmail'
                ? t('auth.verifyEmailTitle', { defaultValue: 'Verify Your Email' })
                : t('auth.signInTitle', { defaultValue: 'Sign in to HelpMyIMG' })}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {mode === 'signup'
                ? t('auth.signUpSubtitle', {
                    defaultValue: 'Sign up and enjoy unlimited local image processing directly in your browser.',
                  })
                : mode === 'forgot'
                ? t('auth.forgotPasswordSubtitle', {
                    defaultValue: 'Enter your email address to receive a secure password reset link.',
                  })
                : mode === 'reset'
                ? t('auth.resetNewPasswordSubtitle', {
                    defaultValue: 'Enter your new password below.',
                  })
                : mode === 'verifyEmail'
                ? t('auth.verifyEmailSubtitle', {
                    defaultValue: 'Please verify your email address to activate your account and prevent abuse.',
                  })
                : t('auth.signInSubtitle', {
                    defaultValue: 'Access your account, save preferences, and unlock exclusive PRO features.',
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

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Verification Screen Mode */}
          {mode === 'verifyEmail' ? (
            <div className="space-y-4 py-1">
              <div className="text-center p-4 bg-slate-50 dark:bg-dark-900/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                  {t('auth.sentToEmail', { defaultValue: 'Verification link sent to:' })}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-white break-all">
                  {email || user?.email}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {t('auth.verifyInstruction', {
                    defaultValue: 'Please check your inbox or spam folder, then click the link to activate your HelpMyIMG account.',
                  })}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCheckVerified}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 font-extrabold text-sm rounded-xl shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-dark-900" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-dark-900" />
                  )}
                  <span>{t('auth.checkVerifiedBtn', { defaultValue: 'I Have Verified My Email' })}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading || resendCooldown > 0}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-300 dark:border-dark-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  <span>
                    {resendCooldown > 0
                      ? `${t('auth.resendCooldown', { defaultValue: 'Resend in' })} ${resendCooldown}s`
                      : t('auth.resendVerification', { defaultValue: 'Resend Verification Email' })}
                  </span>
                </button>
              </div>

              <div className="text-center pt-2 space-y-2">
                <div>
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#05DAED] transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>{t('auth.backToSignIn', { defaultValue: 'Back to Sign In' })}</span>
                  </button>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={async () => {
                      setLoading(true);
                      try {
                        await deleteAccount();
                      } catch {
                        await signOut();
                      } finally {
                        resetForm();
                        setMode('signup');
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="text-[11px] text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 hover:underline cursor-pointer disabled:opacity-50"
                  >
                    {t('auth.wrongEmailCancel', { defaultValue: 'Wrong email address? Cancel and try again' })}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Email / Password Form */
            <form onSubmit={handleEmailAuth} className="space-y-3.5 mb-4">
              {mode !== 'reset' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t('auth.emailLabel', { defaultValue: 'Email Address' })}
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.emailPlaceholder', { defaultValue: 'name@example.com' })}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED] transition-all"
                    />
                  </div>
                </div>
              )}

              {mode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {mode === 'reset'
                        ? t('auth.newPasswordLabel', { defaultValue: 'New Password' })
                        : t('auth.passwordLabel', { defaultValue: 'Password' })}
                    </label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('forgot')}
                        className="text-xs text-cyan-600 dark:text-[#05DAED] hover:underline cursor-pointer font-medium"
                      >
                        {t('auth.forgotPasswordLink', { defaultValue: 'Forgot password?' })}
                      </button>
                    )}
                  </div>
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
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 font-bold text-sm rounded-xl shadow-md hover:brightness-105 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-dark-900" />
                    <span>
                      {mode === 'signup'
                        ? t('auth.creatingAccount', { defaultValue: 'Creating account...' })
                        : mode === 'forgot'
                        ? t('auth.sendingReset', { defaultValue: 'Sending link...' })
                        : mode === 'reset'
                        ? t('auth.savingPassword', { defaultValue: 'Saving password...' })
                        : t('auth.signingIn', { defaultValue: 'Signing in...' })}
                    </span>
                  </>
                ) : (
                  <span>
                    {mode === 'signup'
                      ? t('auth.submitSignUp', { defaultValue: 'Create Account' })
                      : mode === 'forgot'
                      ? t('auth.submitReset', { defaultValue: 'Send Reset Link' })
                      : mode === 'reset'
                      ? t('auth.submitNewPassword', { defaultValue: 'Save New Password' })
                      : t('auth.submitSignIn', { defaultValue: 'Sign In' })}
                  </span>
                )}
              </button>
            </form>
          )}

          {/* Forgot / Reset Password Mode: Back Button */}
          {(mode === 'forgot' || mode === 'reset') && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleSwitchMode('signin')}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#05DAED] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{t('auth.backToSignIn', { defaultValue: 'Back to Sign In' })}</span>
              </button>
            </div>
          )}

          {/* Social Sign In (Only for signin & signup modes) */}
          {mode !== 'forgot' && mode !== 'reset' && mode !== 'verifyEmail' && (
            <>
              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-slate-200 dark:border-slate-700/80 w-full" />
                <span className="bg-white dark:bg-dark-800 px-3 text-[11px] font-medium text-slate-400 uppercase tracking-wider shrink-0">
                  {t('auth.orDivider', { defaultValue: 'or' })}
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
                  <span>{t('auth.googleBtn', { defaultValue: 'Continue with Google' })}</span>
                </button>

                {/* Mode switch */}
                <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                  {mode === 'signin' ? (
                    <>
                      <span>{t('auth.noAccount', { defaultValue: "Don't have an account?" })}{' '}</span>
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('signup')}
                        className="font-semibold text-cyan-600 dark:text-[#05DAED] hover:underline cursor-pointer"
                      >
                        {t('auth.switchToSignUp', { defaultValue: 'Sign up' })}
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{t('auth.hasAccount', { defaultValue: 'Already have an account?' })}{' '}</span>
                      <button
                        type="button"
                        onClick={() => handleSwitchMode('signin')}
                        className="font-semibold text-cyan-600 dark:text-[#05DAED] hover:underline cursor-pointer"
                      >
                        {t('auth.switchToSignIn', { defaultValue: 'Sign in' })}
                      </button>
                    </>
                  )}
                </div>

                {/* Note on security */}
                <p className="text-center text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed px-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  {t('auth.privacyNote', {
                    defaultValue: "By continuing, you agree to HelpMyIMG's Terms of Service and Privacy Policy.",
                  })}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
