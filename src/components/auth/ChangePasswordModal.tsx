// src/components/auth/ChangePasswordModal.tsx
// Modal ganti / reset kata sandi berstandar global dengan opsi Update Langsung & Kirim Link Email

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, X, CheckCircle2, AlertCircle, Loader2, Send, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const { user, sendPasswordReset, updateUserPassword } = useAuth();
  const { t } = useTranslation();

  const [view, setView] = useState<'direct' | 'reset'>('direct');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Reset form state saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setView('direct');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg(null);
      setSuccessMsg(null);
      setShowCurrentPass(false);
      setShowNewPass(false);
      setShowConfirmPass(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const isGoogleUser = user.providerData?.some((p: any) => p.providerId === 'google.com');

  const handleDirectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword) {
      setErrorMsg(t('auth.enterCurrentPass', { defaultValue: 'Please enter your current password.' }));
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg(t('auth.weakPassword', { defaultValue: 'Password must be at least 6 characters.' }));
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg(t('auth.passwordMismatch', { defaultValue: 'New passwords do not match.' }));
      return;
    }

    setLoading(true);
    try {
      await updateUserPassword(currentPassword, newPassword);
      setSuccessMsg(t('auth.passwordUpdatedSuccess', { defaultValue: 'Password updated successfully!' }));
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      if (err?.message === 'WRONG_PASSWORD') {
        setErrorMsg(t('auth.incorrectCurrentPass', { defaultValue: 'Incorrect current password. Please try again.' }));
      } else if (err?.message === 'WEAK_PASSWORD') {
        setErrorMsg(t('auth.weakPassword', { defaultValue: 'Password must be at least 6 characters.' }));
      } else if (err?.message === 'REQUIRES_RECENT_LOGIN') {
        setErrorMsg(t('auth.deleteReauthRequired', { defaultValue: 'Your login session has expired. Please sign in again.' }));
      } else {
        setErrorMsg(err?.message || 'Failed to update password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = async () => {
    if (!user.email || cooldown > 0) return;
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      await sendPasswordReset(user.email);
      setCooldown(60);
      setSuccessMsg(
        t('auth.changePassEmailSent', {
          defaultValue: 'Password reset link sent to your email. Please check your inbox or spam folder.',
        })
      );
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to send password reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            if (!loading) onClose();
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            disabled={loading}
            className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-5 pr-8">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-[#05DAED] border border-cyan-100 dark:border-cyan-800/40 flex items-center justify-center shrink-0">
              <KeyRound className="w-5 h-5 text-[#05DAED]" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                {t('auth.changePassTitle', { defaultValue: 'Change Password' })}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                {user.email}
              </p>
            </div>
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

          {/* Google Authenticated User Notice */}
          {isGoogleUser ? (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-slate-50 dark:bg-dark-900/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl text-center">
                <ShieldCheck className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {t('auth.googlePassNote', {
                    defaultValue:
                      'Your account is linked with Google Sign-In. Password and authentication credentials are managed directly through your Google Account.',
                  })}
                </p>
              </div>

              <a
                href="https://myaccount.google.com/security"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl border border-slate-300 dark:border-dark-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{t('auth.manageGoogleSecurity', { defaultValue: 'Manage Google Account Security' })}</span>
              </a>
            </div>
          ) : view === 'direct' ? (
            /* VIEW A: Direct Password Update (ala Screenshot 2) */
            <form onSubmit={handleDirectUpdate} className="space-y-3.5">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('auth.currentPassword', { defaultValue: 'Current Password' })}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setView('reset');
                  }}
                  className="mt-1 text-xs text-cyan-600 dark:text-[#05DAED] hover:underline font-medium cursor-pointer"
                >
                  {t('auth.forgotCurrentPassLink', { defaultValue: 'Forgot current password? Send reset link to email' })}
                </button>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('auth.newPasswordLabel', { defaultValue: 'New Password' })}
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('auth.min6Chars', { defaultValue: 'Min. 6 characters' })}
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {t('auth.confirmNewPassword', { defaultValue: 'Confirm New Password' })}
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-dark-900" />
                ) : (
                  <Lock className="w-4 h-4 text-dark-900 stroke-[2.5]" />
                )}
                <span>{t('auth.updatePasswordBtn', { defaultValue: 'Update Password' })}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer"
                >
                  {t('auth.deleteCancelBtn', { defaultValue: 'Cancel' })}
                </button>
              </div>
            </form>
          ) : (
            /* VIEW B: Email Reset Link (ala Screenshot 3) */
            <div className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('auth.sendResetLinkDesc', {
                  defaultValue: 'Send a secure reset link to your email to create a new password.',
                })}
              </p>

              <div className="relative">
                <Mail className="w-4 h-4 text-[#05DAED] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  readOnly
                  value={user.email || ''}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-100/70 dark:bg-dark-900/80 text-slate-700 dark:text-slate-300 font-medium select-all"
                />
              </div>

              <button
                type="button"
                onClick={handleSendReset}
                disabled={loading || cooldown > 0}
                className="w-full py-3 px-4 bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-dark-900" />
                ) : (
                  <Send className="w-4 h-4 text-dark-900 stroke-[2.5]" />
                )}
                <span>
                  {cooldown > 0
                    ? `${t('auth.resendCooldown', { defaultValue: 'Resend in' })} ${cooldown}s`
                    : t('auth.sendPasswordResetLink', { defaultValue: 'Send Password Reset Link' })}
                </span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setView('direct');
                  }}
                  className="text-xs text-cyan-600 dark:text-[#05DAED] hover:underline font-medium cursor-pointer"
                >
                  {t('auth.knowCurrentPassLink', { defaultValue: 'Know your current password? Update directly' })}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
