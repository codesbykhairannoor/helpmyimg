// src/components/workspace/export/ExportPanel.tsx
// Export & Download Options Panel (Single & Batch ZIP)
// Enforces PRO Perks: Smart Renaming, Custom ZIP Naming, and Ultra-HD 4K Resolution

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Archive,
  Loader2,
  Settings2,
  ChevronDown,
  Crown,
  Lock,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { getExportUrl } from '../../../utils/resolutionHelper';
import { trackEvent } from '../../../utils/analytics';
import type { BatchItem } from '../types';

interface ExportPanelProps {
  batchItems: BatchItem[];
  setBatchItems: React.Dispatch<React.SetStateAction<BatchItem[]>>;
  initialTab: string;
  isZipping: boolean;
  onZipDownload: (customZipName?: string) => void;
  showToast: (msg: string) => void;
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  batchItems,
  setBatchItems,
  initialTab,
  isZipping,
  onZipDownload,
  showToast,
}) => {
  const { t } = useTranslation();
  const { isPro, openAuthModal } = useAuth();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [customZipName, setCustomZipName] = useState('');
  const [isExportingSingle, setIsExportingSingle] = useState(false);

  if (batchItems.length === 0 || initialTab === 'picker') return null;

  const handleToggleExportOptions = () => {
    if (!isPro) {
      showToast(
        t('work.renameProNotice', {
          defaultValue:
            'Fitur Ganti Nama (Smart Rename) & Custom ZIP adalah fitur eksklusif PRO. Upgrade sekarang!',
        })
      );
      openAuthModal();
      return;
    }
    setShowExportOptions(!showExportOptions);
  };

  const handleSingleDownload = async () => {
    const item = batchItems[0];
    if (!item || !item.name.trim() || item.name.startsWith('.')) {
      showToast(
        t('work.emptyFileNameAlert', {
          defaultValue: 'Nama file tidak boleh kosong! / File name cannot be empty!',
        })
      );
      return;
    }

    const sourceUrl = item.processedUrl || item.transparentUrl || item.originalUrl;
    if (!sourceUrl) return;

    try {
      setIsExportingSingle(true);
      trackEvent('file_downloaded', { count: 1, type: 'single', tool: initialTab });

      const { url: finalUrl, revoked, wasDownscaled } = await getExportUrl(sourceUrl, isPro);

      if (wasDownscaled && !isPro) {
        showToast(
          t('work.downscaleNotice', {
            defaultValue:
              'Foto diekspor dalam resolusi Standar HD (1080p). Buka PRO untuk resolusi asli 4K!',
          })
        );
      }

      const a = document.createElement('a');
      a.href = finalUrl;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      if (revoked) {
        setTimeout(() => URL.revokeObjectURL(finalUrl), 5000);
      }
    } catch (err) {
      console.error('Download error:', err);
      showToast(t('editor.downloadError', { defaultValue: 'Gagal mengunduh gambar.' }));
    } finally {
      setIsExportingSingle(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-dark-600/60 shrink-0 flex flex-col gap-4">
      {/* Header bar: Settings Trigger */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {t('work.exportSettingsTitle', { defaultValue: 'Export & Download Options' })}
        </div>
        <button
          type="button"
          onClick={handleToggleExportOptions}
          className="text-xs flex items-center gap-1.5 text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors cursor-pointer group"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{t('work.settings', { defaultValue: 'Export Settings' })}</span>
          {!isPro ? (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Lock className="w-2.5 h-2.5" />
              PRO
            </span>
          ) : (
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform ${showExportOptions ? 'rotate-180' : ''}`}
            />
          )}
        </button>
      </div>

      {/* Export Options Accordion (PRO Only) */}
      {showExportOptions && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="flex flex-col gap-5 overflow-hidden"
        >
          {!isPro ? (
            <div className="p-3.5 rounded-xl bg-dark-900/60 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  {t('work.renameLocked', {
                    defaultValue: 'Ganti nama file & custom ZIP adalah fitur eksklusif PRO.',
                  })}
                </span>
              </div>
              <button
                type="button"
                onClick={openAuthModal}
                className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] shrink-0 cursor-pointer"
              >
                Upgrade PRO
              </button>
            </div>
          ) : (
            <>
              {/* Batch Rename UI */}
              {batchItems.length > 1 ? (
                <div className="flex flex-col gap-2.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('work.batchRename', { defaultValue: 'Rename Files (PRO)' })}
                  </div>
                  <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                    {batchItems.map((item, idx) => {
                      const nameParts = item.name.split('.');
                      const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
                      const base = nameParts.length > 0 ? nameParts.join('.') : item.name;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-dark-800/50 p-1.5 rounded-lg border border-dark-600/50 focus-within:border-neon-cyan/50 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded shrink-0 overflow-hidden bg-dark-900 border border-dark-600 flex items-center justify-center">
                            <img src={item.originalUrl} alt="" className="max-w-full max-h-full object-cover" />
                          </div>
                          <input
                            type="text"
                            value={base}
                            onChange={(e) => {
                              const newBase = e.target.value;
                              setBatchItems((prev) =>
                                prev.map((img, i) => (i === idx ? { ...img, name: `${newBase}${ext}` } : img))
                              );
                            }}
                            className="flex-1 bg-transparent text-xs text-white outline-none w-full min-w-0"
                            placeholder="Name"
                          />
                          <span className="text-[10px] text-slate-500 font-mono pr-1 shrink-0">{ext}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('work.renameFile', { defaultValue: 'Rename File (PRO)' })}
                  </div>
                  {(() => {
                    const nameParts = batchItems[0].name.split('.');
                    const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
                    const base = nameParts.length > 0 ? nameParts.join('.') : batchItems[0].name;
                    return (
                      <div className="flex items-center gap-2 bg-dark-800/50 p-2 rounded-lg border border-dark-600/50 focus-within:border-neon-cyan/50 transition-colors">
                        <input
                          type="text"
                          value={base}
                          onChange={(e) => {
                            const newBase = e.target.value;
                            setBatchItems((prev) =>
                              prev.map((img, i) => (i === 0 ? { ...img, name: `${newBase}${ext}` } : img))
                            );
                          }}
                          className="flex-1 bg-transparent text-xs text-white outline-none px-1 w-full min-w-0"
                          placeholder="File name"
                        />
                        {ext && (
                          <span className="text-xs font-mono text-neon-cyan font-bold pr-2 shrink-0">
                            {ext}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ZIP Download Custom Name (PRO Only) */}
              {batchItems.length > 1 && (
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    {t('work.zipName', { defaultValue: 'Custom ZIP Filename (PRO)' })}
                  </div>
                  <input
                    type="text"
                    value={customZipName}
                    onChange={(e) => setCustomZipName(e.target.value)}
                    placeholder={t('work.zipNamePlaceholder', {
                      defaultValue: 'Custom ZIP Name (e.g. Products_Catalog)',
                    })}
                    className="w-full bg-dark-800/50 border border-dark-600/50 focus:border-neon-cyan text-white px-3 py-2.5 rounded-lg text-xs outline-none transition-all"
                  />
                </div>
              )}
            </>
          )}
        </motion.div>
      )}

      {/* Resolution Indicator Pill (HD 1080p vs 4K Ultra-HD) */}
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-dark-800/60 border border-dark-600/50 text-xs">
        <div className="flex items-center gap-2">
          {isPro ? (
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          )}
          <span className="text-slate-300 font-medium">
            {isPro
              ? t('work.resPro', { defaultValue: 'Kualitas: Ultra-HD 4K (Original Lossless)' })
              : t('work.resFree', { defaultValue: 'Kualitas: Standar HD (Maks. 1920px)' })}
          </span>
        </div>
        {!isPro ? (
          <button
            type="button"
            onClick={openAuthModal}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Crown className="w-3 h-3" />
            <span>{t('work.unlock4k', { defaultValue: 'Buka 4K' })}</span>
          </button>
        ) : (
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
            PRO UNLOCKED
          </span>
        )}
      </div>

      {/* Main Download Buttons */}
      <div className="flex gap-2">
        {batchItems.length > 1 ? (
          <button
            type="button"
            onClick={() => {
              if (batchItems.some((i) => !i.name.trim() || i.name.startsWith('.'))) {
                showToast(
                  t('work.emptyFileNameAlert', {
                    defaultValue: 'Nama file tidak boleh kosong! / File name cannot be empty!',
                  })
                );
                return;
              }
              trackEvent('file_downloaded', { count: batchItems.length, type: 'zip', tool: initialTab });
              onZipDownload(customZipName);
            }}
            disabled={isZipping || batchItems.some((i) => i.status !== 'done')}
            className="flex-1 px-4 py-3.5 bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:opacity-95 cursor-pointer"
          >
            {isZipping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
            <span>
              {isPro
                ? t('work.downloadZipPro', { defaultValue: 'Download All ZIP (4K Ultra-HD)' })
                : t('work.downloadZip', { defaultValue: 'Download All (ZIP)' })}
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSingleDownload}
            disabled={isExportingSingle || batchItems[0]?.status !== 'done'}
            className="flex-1 px-4 py-3.5 bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:opacity-95 cursor-pointer"
          >
            {isExportingSingle ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            <span>
              {initialTab === 'convert' && batchItems[0]?.status !== 'done'
                ? t('convert.convertFirst', { defaultValue: 'Konversi Dahulu untuk Download' })
                : isPro
                ? t('editor.downloadPro', { defaultValue: 'Download Ultra-HD (4K Asli)' })
                : t('editor.download', { defaultValue: 'Download HD (Standar)' })}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
