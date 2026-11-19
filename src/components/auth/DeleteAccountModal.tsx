// src/components/auth/DeleteAccountModal.tsx
// Modal konfirmasi penghapusan akun permanen berstandar global (GDPR/CCPA) dengan HelpMyIMG brand styling & mobile responsive

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Trash2, X, Loader2, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { user, deleteAccount } = useAuth();
  const { t } = useTranslation();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setConfirmInput('');
      setErrorMsg(null);
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const isPasswordUser = user.providerData?.some((p: any) => p.providerId === 'password');

  const isDeleteTyped =
    confirmInput.trim().toUpperCase() === 'DELETE' ||
    confirmInput.trim().toUpperCase() === 'HAPUS';

  const isConfirmed = isDeleteTyped && (!isPasswordUser || password.length > 0);

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      await deleteAccount(isPasswordUser ? password : undefined);
      onClose();
    } catch (err: any) {
      if (err?.message === 'WRONG_PASSWORD') {
        setErrorMsg(t('auth.wrongPassword', { defaultValue: 'Incorrect password. Please try again.' }));
      } else if (err?.message === 'REQUIRES_RECENT_LOGIN') {
        setErrorMsg(
          t('auth.deleteReauthRequired', {
            defaultValue:
              'For security reasons, your login session has expired. Please sign out and sign back in before deleting your account.',
          })
        );
      } else {
        setErrorMsg(err?.message || 'Failed to delete account. Please try again.');
      }
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
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
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

          {/* Header Brand Icon */}
          <div className="text-center mb-4 pt-1">
            <div className="inline-flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-[#05DAED] mb-3 border border-cyan-200/80 dark:border-cyan-800/40 shadow-sm">
              <Trash2 className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600 dark:text-[#05DAED]" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {t('auth.deleteModalTitle', { defaultValue: 'Permanently Delete Account' })}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
              {t('auth.deleteModalSubtitle', { defaultValue: 'This action is permanent and cannot be undone.' })}
            </p>
          </div>

          {/* Important 4-Websites Warning Box in HelpMyIMG Brand Styling */}
          <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-slate-50 dark:bg-dark-900/70 border border-slate-200 dark:border-dark-600/90 space-y-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-xs sm:text-sm">
              <ShieldAlert className="w-4 h-4 shrink-0 text-[#05DAED]" />
              <span>
                {t('auth.deleteWarning4WebsTitle', {
                  defaultValue: 'Important Warning: Login for 4 Connected Websites Will Be Erased',
                })}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('auth.deleteWarning4WebsDesc', {
                defaultValue:
                  'Your account credentials are unified across 4 websites in our network. Deleting this account will permanently erase your login credentials on HelpMyIMG and all 3 other connected companion websites.',
              })}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1.5 border-t border-slate-200 dark:border-dark-700">
              • {t('auth.deleteConsequences', {
                defaultValue:
                  'All saved preferences, active PRO subscriptions, and account data will be wiped immediately.',
              })}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Password Input (for Email/Password accounts) */}
          {isPasswordUser && (
            <div className="space-y-1.5 mb-3.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t('auth.deletePasswordLabel', { defaultValue: 'Enter your password to confirm:' })}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Input Field */}
          <div className="space-y-1.5 mb-5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('auth.deleteConfirmTypeLabel', { defaultValue: 'Type DELETE to confirm:' })}
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-dark-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#05DAED]/50 focus:border-[#05DAED] uppercase tracking-widest font-mono font-bold"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-dark-600 transition-all cursor-pointer disabled:opacity-50 text-center"
            >
              {t('auth.deleteCancelBtn', { defaultValue: 'Cancel' })}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={!isConfirmed || loading}
              className="w-full py-2.5 sm:py-3 px-3 bg-gradient-to-r from-neon-cyan via-cyan-400 to-neon-emerald hover:opacity-95 text-dark-900 font-black text-xs sm:text-sm rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed text-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-dark-900" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 text-dark-900 stroke-[2.5]" />
                  <span>{t('auth.deleteConfirmBtn', { defaultValue: 'Delete Account' })}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
