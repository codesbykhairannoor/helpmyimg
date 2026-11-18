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
import { useProGate } from '../../../context/ProGateContext';
import { getExportUrl, getImageDimensions } from '../../../utils/resolutionHelper';
import { exportTo4k } from '../../../utils/upscaleHelper';
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
  const { user, isPro } = useAuth();
  const { openProGate, quotaState, consume4k } = useProGate();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [customZipName, setCustomZipName] = useState('');
  const [isExportingSingle, setIsExportingSingle] = useState(false);
  const [isExporting4k, setIsExporting4k] = useState(false);

  if (batchItems.length === 0 || initialTab === 'picker') return null;

  const handleToggleExportOptions = () => {
    if (!isPro) {
      openProGate({ feature: 'rename-zip' });
      return;
    }
    setShowExportOptions(!showExportOptions);
  };

  // Unduh versi Standar HD (100% Gratis & Bebas Kuota)
  const handleSingleDownloadStandard = async () => {
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
      trackEvent('file_downloaded', { count: 1, type: 'single-hd', tool: initialTab });

      const { url: finalUrl, revoked } = await getExportUrl(sourceUrl, false);

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

  // Unduh versi Real Ultra-HD 4K (Upscaled murni ke 3840px / Asli Lossless)
  const handleSingleDownload4k = async () => {
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

    const execute4k = async () => {
      try {
        setIsExporting4k(true);
        trackEvent('file_downloaded', { count: 1, type: 'single-4k', tool: initialTab });

        const { url: finalUrl, width, height, revoked } = await exportTo4k(sourceUrl, 3840);

        const a = document.createElement('a');
        a.href = finalUrl;
        const nameParts = item.name.split('.');
        const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '.png';
        const base = nameParts.join('.');
        a.download = `${base}_4K_UltraHD${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        if (revoked) {
          setTimeout(() => URL.revokeObjectURL(finalUrl), 5000);
        }
      } catch (err) {
        console.error('4K Export Error:', err);
        showToast(t('editor.downloadError', { defaultValue: 'Gagal mengunduh gambar 4K.' }));
      } finally {
        setIsExporting4k(false);
      }
    };

    if (isPro) {
      await execute4k();
      return;
    }

    if (user) {
      if (quotaState.remaining4k > 0) {
        consume4k();
        showToast(
          t('gate.quotaSuccessToast', {
            remaining: quotaState.remaining4k - 1,
            defaultValue: `Ekspor 4K Asli Berhasil! (Sisa kuota 4K hari ini: ${quotaState.remaining4k - 1})`,
          })
        );
        await execute4k();
      } else {
        openProGate({
          feature: 'export-4k',
          onProceedFallback: () => handleSingleDownloadStandard(),
        });
      }
    } else {
      // Guest
      openProGate({
        feature: 'export-4k',
        onProceedFallback: () => handleSingleDownloadStandard(),
        onSuccess: () => {
          consume4k();
          execute4k();
        },
      });
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
          ) : user ? (
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <span className="text-slate-300 font-medium">
            {isPro
              ? t('work.resPro', { defaultValue: 'Kualitas: Ultra-HD 4K (Original Lossless)' })
              : user
                ? t('gate.quotaPill', {
                  remaining: quotaState.remaining4k,
                  max: quotaState.max4k,
                  defaultValue: `Kuota 4K: ${quotaState.remaining4k}/${quotaState.max4k} tersisa hari ini`,
                })
                : t('work.resFree', { defaultValue: 'Kualitas: Standar HD (Maks. 1920px)' })}
          </span>
        </div>
        {!isPro ? (
          <button
            type="button"
            onClick={() => openProGate({ feature: 'export-4k' })}
            className={`text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${user ? 'text-cyan-400 hover:text-cyan-300' : 'text-amber-400 hover:text-amber-300'
              }`}
          >
            {user ? <Crown className="w-3 h-3 text-amber-400" /> : <Sparkles className="w-3 h-3" />}
            <span>
              {user
                ? t('work.unlockUnlimited', { defaultValue: 'Unlimited PRO' })
                : t('gate.claimFree4k', { defaultValue: 'Klaim 3x 4K Gratis' })}
            </span>
          </button>
        ) : (
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
            PRO UNLOCKED
          </span>
        )}
      </div>

      {/* Main Download Buttons: Dual Resolution Controls (HD Standard vs 4K Ultra-HD) */}
      <div className="flex flex-col gap-2.5">
        {batchItems.length > 1 ? (
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Batch ZIP: Standard HD */}
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
                trackEvent('file_downloaded', { count: batchItems.length, type: 'zip-hd', tool: initialTab });
                onZipDownload(customZipName);
              }}
              disabled={isZipping || batchItems.some((i) => i.status !== 'done')}
              className="flex-1 px-4 py-3 bg-dark-800/80 hover:bg-dark-750 text-slate-200 border border-dark-600/80 hover:border-dark-500 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isZipping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Archive className="w-4 h-4 text-slate-400" />}
              <span>{t('work.downloadZip', { defaultValue: 'Download ZIP (HD Standar)' })}</span>
            </button>

            {/* Batch ZIP: Ultra-HD 4K */}
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
                if (!isPro && (!user || quotaState.remaining4k <= 0)) {
                  openProGate({ feature: 'export-4k', onProceedFallback: () => onZipDownload(customZipName) });
                  return;
                }
                if (!isPro && user && quotaState.remaining4k > 0) {
                  consume4k();
                  showToast(
                    t('gate.quotaSuccessToast', {
                      remaining: quotaState.remaining4k - 1,
                      defaultValue: `Ekspor 4K Asli Berhasil! (Sisa kuota 4K hari ini: ${quotaState.remaining4k - 1})`,
                    })
                  );
                }
                trackEvent('file_downloaded', { count: batchItems.length, type: 'zip-4k', tool: initialTab });
                onZipDownload(customZipName);
              }}
              disabled={isZipping || batchItems.some((i) => i.status !== 'done')}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              <span>{t('work.downloadZipPro', { defaultValue: '⚡ Download ZIP (4K Ultra-HD)' })}</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2.5">
            {/* Button 1: Download HD (100% Free Forever) */}
            <button
              type="button"
              onClick={handleSingleDownloadStandard}
              disabled={isExportingSingle || isExporting4k || batchItems[0]?.status !== 'done'}
              className="flex-1 px-4 py-3 bg-dark-800/80 hover:bg-dark-750 text-slate-200 border border-dark-600/80 hover:border-dark-500 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isExportingSingle ? (
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              ) : (
                <Download className="w-4 h-4 text-slate-400" />
              )}
              <span>
                {initialTab === 'convert' && batchItems[0]?.status !== 'done'
                  ? t('convert.convertFirst', { defaultValue: 'Konversi Dahulu' })
                  : t('editor.download', { defaultValue: 'Download HD (Gratis)' })}
              </span>
            </button>

            {/* Button 2: Real 4K Ultra-HD (3840px Upscale & Lossless) */}
            <button
              type="button"
              onClick={handleSingleDownload4k}
              disabled={isExportingSingle || isExporting4k || batchItems[0]?.status !== 'done'}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
            >
              {isExporting4k ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              )}
              <span>
                {initialTab === 'convert' && batchItems[0]?.status !== 'done'
                  ? t('convert.convertFirst', { defaultValue: 'Konversi Dahulu' })
                  : t('editor.downloadPro', { defaultValue: '⚡ Download 4K Ultra-HD' })}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
