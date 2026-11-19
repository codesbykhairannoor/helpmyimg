// src/components/auth/DeleteAccountModal.tsx
// Modal konfirmasi penghapusan akun permanen berstandar global (GDPR/CCPA) dengan peringatan 4 website

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X, Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../context/LanguageContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({ isOpen, onClose }) => {
  const { user, deleteAccount } = useAuth();
  const { t } = useTranslation();

  const [confirmInput, setConfirmInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !user) return null;

  const isConfirmed =
    confirmInput.trim().toUpperCase() === 'DELETE' ||
    confirmInput.trim().toUpperCase() === 'HAPUS';

  const handleDelete = async () => {
    if (!isConfirmed) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      await deleteAccount();
      onClose();
    } catch (err: any) {
      if (err?.message === 'REQUIRES_RECENT_LOGIN') {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative w-full max-w-md bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-rose-300 dark:border-rose-900/60 p-6 md:p-8 z-10 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={() => {
              if (!loading) onClose();
            }}
            disabled={loading}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Icon */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-3 border border-rose-200 dark:border-rose-800/60">
              <Trash2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('auth.deleteModalTitle', { defaultValue: 'Permanently Delete Account' })}
            </h3>
            <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-1">
              {t('auth.deleteModalSubtitle', { defaultValue: 'This action is permanent and cannot be undone.' })}
            </p>
          </div>

          {/* Important 4-Websites Warning Box */}
          <div className="mb-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800/80 space-y-2">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>
                {t('auth.deleteWarning4WebsTitle', {
                  defaultValue: 'Important Warning: Login for 4 Connected Websites Will Be Erased',
                })}
              </span>
            </div>
            <p className="text-xs text-rose-800 dark:text-rose-200/90 leading-relaxed">
              {t('auth.deleteWarning4WebsDesc', {
                defaultValue:
                  'Your account credentials are unified across 4 websites in our network. Deleting this account will permanently erase your login credentials on HelpMyIMG and all 3 other connected companion websites.',
              })}
            </p>
            <p className="text-[11px] text-rose-700 dark:text-rose-300/80 pt-1 border-t border-rose-200 dark:border-rose-900/60">
              • {t('auth.deleteConsequences', {
                defaultValue:
                  'All saved preferences, active PRO subscriptions, and account data will be wiped immediately.',
              })}
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Confirmation Input Field */}
          <div className="space-y-3 mb-5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('auth.deleteConfirmTypeLabel', { defaultValue: 'Type DELETE to confirm:' })}
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-rose-300 dark:border-rose-700/80 bg-rose-50/40 dark:bg-dark-900/80 text-rose-900 dark:text-rose-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/50 uppercase tracking-widest font-mono font-bold"
            />
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-dark-700 dark:hover:bg-dark-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-300 dark:border-dark-600 transition-all cursor-pointer disabled:opacity-50"
            >
              {t('auth.deleteCancelBtn', { defaultValue: 'Cancel' })}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={!isConfirmed || loading}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5 text-white" />
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
