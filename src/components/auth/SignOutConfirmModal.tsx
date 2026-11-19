// src/components/auth/SignOutConfirmModal.tsx
// Modal konfirmasi keluar akun (Sign Out) dengan brand styling HelpMyIMG & mobile responsive

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Loader2 } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';

interface SignOutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const SignOutConfirmModal: React.FC<SignOutConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

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
          className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-sm bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-5 sm:p-6 z-10 max-h-[90vh] overflow-y-auto"
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
              <LogOut className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-600 dark:text-[#05DAED]" />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {t('auth.signOutModalTitle', { defaultValue: 'Sign Out of HelpMyIMG' })}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1.5 leading-relaxed px-1">
              {t('auth.signOutModalDesc', {
                defaultValue:
                  'Are you sure you want to sign out? You can sign back in anytime to access your saved preferences and PRO features.',
              })}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-dark-600 transition-all cursor-pointer disabled:opacity-50 text-center"
            >
              {t('auth.signOutCancelBtn', { defaultValue: 'Cancel' })}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-3 bg-gradient-to-r from-neon-cyan via-cyan-400 to-neon-emerald hover:opacity-95 text-dark-900 font-black text-xs sm:text-sm rounded-xl shadow-glow-cyan transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 text-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-dark-900" />
                  <span>{t('auth.signingOut', { defaultValue: 'Signing Out...' })}</span>
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 text-dark-900 stroke-[2.5]" />
                  <span>{t('auth.signOutConfirmBtn', { defaultValue: 'Sign Out' })}</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
