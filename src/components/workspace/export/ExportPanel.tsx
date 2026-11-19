// src/components/workspace/export/ExportPanel.tsx
// Export & Download Options Panel (Single & Batch ZIP)
// Enforces User's Directives:
// 1. Single Photo Rename: UNLOCKED for all logged-in users (Free & Pro)! Guests prompted to Sign In (Free).
// 2. Batch Photo Rename (one-by-one) & Custom ZIP: Exclusive PRO features.
// 3. Opsi B for Compress: CompressControl owns the single morphing action button; ExportPanel avoids rendering duplicate download button on single compress.
// 4. Clean Labels: Normal tools say "Download Photo" (NEVER "Download HD (Free)").

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
  LogIn,
} from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import { useAuth } from '../../../context/AuthContext';
import { useProGate } from '../../../context/ProGateContext';
import { getExportUrl } from '../../../utils/resolutionHelper';
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

const formatSize = (bytes?: number): string => {
  if (!bytes || bytes <= 0) return '';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const ExportPanel: React.FC<ExportPanelProps> = ({
  batchItems,
  setBatchItems,
  initialTab,
  isZipping,
  onZipDownload,
  showToast,
}) => {
  const { t } = useTranslation();
  const { user, isPro, openAuthModal } = useAuth();
  const { openProGate, quotaState, consume4k } = useProGate();
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [customZipName, setCustomZipName] = useState('');
  const [isExportingSingle, setIsExportingSingle] = useState(false);
  const [isExporting4k, setIsExporting4k] = useState(false);

  if (batchItems.length === 0 || initialTab === 'picker') return null;

  // Tool Classification
  const isCompressTool = ['compress', 'compress50kb', 'compress100kb', 'compress200kb'].includes(initialTab || '');
  const isConvertTool = ['convert', 'convertwebp'].includes(initialTab || '');
  const isUpscaleTool = ['remove', 'removeperson', 'removelogo', 'color', 'colorwhite', 'design', 'brush'].includes(initialTab || '');

  // Readiness State Evaluation
  const singleItem = batchItems[0];
  const isSingleConvertReady = isConvertTool && singleItem?.status === 'done';
  const isSingleStandardReady = !isCompressTool && !isConvertTool && (singleItem?.status === 'done' || !!singleItem?.processedUrl);
  const isSingleReady = isConvertTool ? isSingleConvertReady : isSingleStandardReady;

  const areAllCompressReady = isCompressTool && batchItems.every((i) => !!i.compressBlob && i.status === 'done');
  const areAllConvertReady = isConvertTool && batchItems.every((i) => i.status === 'done');
  const areAllStandardReady = !isCompressTool && !isConvertTool && batchItems.every((i) => i.status === 'done');
  const areAllReady = isCompressTool ? areAllCompressReady : isConvertTool ? areAllConvertReady : areAllStandardReady;

  // Unduh versi Standar
  const handleSingleDownloadStandard = async () => {
    const item = batchItems[0];
    if (!item || !item.name.trim() || item.name.startsWith('.')) {
      showToast(
        t('work.emptyFileNameAlert', {
          defaultValue: 'File name cannot be empty!',
        })
      );
      return;
    }

    // 1. TOOL KOMPRESI: Unduh Blob hasil kompresi ASLI langsung
    if (isCompressTool || item.compressBlob) {
      const downloadUrl = item.compressUrl || item.processedUrl || item.originalUrl;
      if (!downloadUrl) return;

      try {
        setIsExportingSingle(true);
        trackEvent('file_downloaded', { count: 1, type: 'single-compress', tool: initialTab });

        let baseName = item.name || `HelpMyIMG_${Date.now()}`;
        if (baseName.includes('.')) baseName = baseName.substring(0, baseName.lastIndexOf('.'));
        const ext = item.compressBlob
          ? (item.compressBlob.type === 'image/png' ? 'png' : item.compressBlob.type === 'image/webp' ? 'webp' : 'jpg')
          : (item.name.split('.').pop() || 'jpg');

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `${baseName}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error('Download error:', err);
        showToast(t('editor.downloadError', { defaultValue: 'Failed to download image.' }));
      } finally {
        setIsExportingSingle(false);
      }
      return;
    }

    // 2. TOOL NON-UPSCALE (Convert, Resize, Crop, Rotate, Watermark, Blur, EXIF)
    if (!isUpscaleTool) {
      const downloadUrl = item.processedUrl || item.originalUrl;
      if (!downloadUrl) return;

      try {
        setIsExportingSingle(true);
        trackEvent('file_downloaded', { count: 1, type: 'single-tool', tool: initialTab });

        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = item.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } catch (err) {
        console.error('Download error:', err);
        showToast(t('editor.downloadError', { defaultValue: 'Failed to download image.' }));
      } finally {
        setIsExportingSingle(false);
      }
      return;
    }

    // 3. TOOL UPSCALE / AI CUTOUT: HD 1080p limit untuk tier gratis/guest
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
      showToast(t('editor.downloadError', { defaultValue: 'Failed to download image.' }));
    } finally {
      setIsExportingSingle(false);
    }
  };

  // Unduh versi Real Ultra-HD 4K (Khusus Upscale / AI Cutout)
  const handleSingleDownload4k = async () => {
    const item = batchItems[0];
    if (!item || !item.name.trim() || item.name.startsWith('.')) {
      showToast(
        t('work.emptyFileNameAlert', {
          defaultValue: 'File name cannot be empty!',
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

        const { url: finalUrl, revoked } = await exportTo4k(sourceUrl, 3840, { useAiSr: isPro });

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
        showToast(t('editor.downloadError', { defaultValue: 'Failed to download 4K image.' }));
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
            defaultValue: `Real 4K Export Success! (${quotaState.remaining4k - 1} daily 4K quota left)`,
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
    <div className="mt-4 pt-4 border-t border-dark-600/60 shrink-0 flex flex-col gap-3">
      {/* Header bar: Settings Trigger */}
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {t('work.exportSettingsTitle', { defaultValue: 'Export Options' })}
        </div>
        <button
          type="button"
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="text-xs flex items-center gap-1.5 text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors cursor-pointer group"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>{t('work.settings', { defaultValue: 'Export Settings' })}</span>
          {batchItems.length > 1 && !isPro && (
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Crown className="w-2.5 h-2.5" />
              PRO
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${showExportOptions ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Export Options Accordion: Single Rename (Logged-in) vs Batch Rename (PRO) */}
      {showExportOptions && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="flex flex-col gap-3 overflow-hidden pt-1"
        >
          {batchItems.length === 1 ? (
            // ==================== SINGLE PHOTO RENAME ====================
            user ? (
              // User Logged In (Free or Pro): Bebas ganti nama 1 foto!
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {t('work.renameFile', { defaultValue: 'Rename File' })}
                </div>
                {(() => {
                  const nameParts = batchItems[0].name.split('.');
                  const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
                  const base = nameParts.length > 0 ? nameParts.join('.') : batchItems[0].name;
                  return (
                    <div className="flex items-center gap-2 bg-dark-800/60 p-2 rounded-lg border border-dark-600/60 focus-within:border-neon-cyan/60 transition-colors">
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
                        placeholder={t('work.fileNamePlaceholder', { defaultValue: 'File name' })}
                      />
                      {ext && (
                        <span className="text-xs font-mono text-neon-cyan font-bold pr-1 shrink-0">
                          {ext}
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : (
              // Guest (Not Logged In): Ajak login gratis untuk rename
              <div className="p-3 rounded-xl bg-dark-900/60 border border-cyan-500/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>
                    {t('work.loginToRename', { defaultValue: 'Sign in (Free) to rename file' })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="px-2.5 py-1 rounded-lg bg-neon-cyan/20 hover:bg-neon-cyan/30 text-neon-cyan border border-neon-cyan/40 font-bold text-[11px] shrink-0 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <LogIn className="w-3 h-3" />
                  <span>{t('nav.login', { defaultValue: 'Sign In' })}</span>
                </button>
              </div>
            )
          ) : (
            // ==================== BATCH PHOTOS RENAME (PRO ONLY) ====================
            !isPro ? (
              // Batch Rename PRO Lock
              <div className="p-3.5 rounded-xl bg-dark-900/60 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {t('work.batchRenameLocked', {
                      defaultValue: 'Batch renaming multiple files is an exclusive PRO feature.',
                    })}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openProGate({ feature: 'rename-zip' })}
                  className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] shrink-0 cursor-pointer"
                >
                  Upgrade PRO
                </button>
              </div>
            ) : (
              // Batch Rename Unlocked for PRO
              <>
                <div className="flex flex-col gap-2.5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {t('work.batchRename', { defaultValue: 'Batch Rename (PRO)' })}
                  </div>
                  <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1">
                    {batchItems.map((item, idx) => {
                      const nameParts = item.name.split('.');
                      const ext = nameParts.length > 1 ? `.${nameParts.pop()}` : '';
                      const base = nameParts.length > 0 ? nameParts.join('.') : item.name;
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-dark-800/50 p-1.5 rounded-lg border border-dark-600/50 focus-within:border-neon-cyan/50 transition-colors group"
                        >
                          <div className="w-7 h-7 rounded shrink-0 overflow-hidden bg-dark-900 border border-dark-600 flex items-center justify-center">
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

                {/* Custom ZIP Filename (PRO) */}
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    {t('work.zipName', { defaultValue: 'Custom ZIP Filename (PRO)' })}
                  </div>
                  <input
                    type="text"
                    value={customZipName}
                    onChange={(e) => setCustomZipName(e.target.value)}
                    placeholder={t('work.zipNamePlaceholder', {
                      defaultValue: 'Custom ZIP Name (e.g. Photos_Export)',
                    })}
                    className="w-full bg-dark-800/50 border border-dark-600/50 focus:border-neon-cyan text-white px-3 py-2 rounded-lg text-xs outline-none transition-all"
                  />
                </div>
              </>
            )
          )}
        </motion.div>
      )}

      {/* Resolution Indicator Pill: ONLY rendered for AI upscale / cutout tools */}
      {isUpscaleTool && (
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
                ? t('work.resPro', { defaultValue: 'Quality: Ultra-HD 4K (Original Lossless)' })
                : user
                  ? t('gate.quotaPill', {
                    remaining: quotaState.remaining4k,
                    max: quotaState.max4k,
                    defaultValue: `4K Quota: ${quotaState.remaining4k}/${quotaState.max4k} left today`,
                  })
                  : t('work.resFree', { defaultValue: 'Quality: Standard HD (Max. 1920px)' })}
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
                  : t('gate.claimFree4k', { defaultValue: 'Claim 3x Free 4K' })}
              </span>
            </button>
          ) : (
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">
              PRO UNLOCKED
            </span>
          )}
        </div>
      )}

      {/* Main Download Buttons */}
      <div className="flex flex-col gap-2.5">
        {batchItems.length > 1 ? (
          // ==================== BATCH DOWNLOAD (ZIP) ====================
          !isUpscaleTool ? (
            // Non-upscale tools: 1 Single Clean Batch ZIP button
            !areAllReady ? (
              <button
                type="button"
                disabled={true}
                className="w-full px-5 py-3.5 bg-dark-800/60 text-slate-500 border border-dark-700/60 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 cursor-not-allowed select-none transition-all"
              >
                <Archive className="w-4 h-4 text-slate-600" />
                <span>
                  {batchItems.some((i) => i.status === 'processing')
                    ? t('work.processingAll', { defaultValue: 'Processing All Photos...' })
                    : isCompressTool
                      ? t('compress.processAllFirst', { defaultValue: 'Compress All Photos First' })
                      : isConvertTool
                        ? t('convert.convertAllFirst', { defaultValue: 'Convert All Photos First' })
                        : t('work.processAllFirst', { defaultValue: 'Process All Photos First' })}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (batchItems.some((i) => !i.name.trim() || i.name.startsWith('.'))) {
                    showToast(
                      t('work.emptyFileNameAlert', {
                        defaultValue: 'File name cannot be empty!',
                      })
                    );
                    return;
                  }
                  trackEvent('file_downloaded', { count: batchItems.length, type: 'zip-direct', tool: initialTab });
                  onZipDownload(customZipName);
                }}
                disabled={isZipping}
                className="w-full px-5 py-3.5 bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                {isZipping ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Archive className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                )}
                <span>
                  {t('work.downloadZipAll', {
                    count: String(batchItems.length),
                    defaultValue: `Download All Photos (${batchItems.length}) [ZIP]`,
                  })}
                </span>
              </button>
            )
          ) : (
            // Upscale tools: Dual ZIP buttons (HD vs 4K)
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (batchItems.some((i) => !i.name.trim() || i.name.startsWith('.'))) {
                    showToast(
                      t('work.emptyFileNameAlert', {
                        defaultValue: 'File name cannot be empty!',
                      })
                    );
                    return;
                  }
                  trackEvent('file_downloaded', { count: batchItems.length, type: 'zip-hd', tool: initialTab });
                  onZipDownload(customZipName);
                }}
                disabled={isZipping || !areAllReady}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${isPro
                    ? 'bg-dark-800/80 hover:bg-dark-750 text-slate-200 border border-dark-600/80 hover:border-dark-500'
                    : 'bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-glow-cyan transform hover:-translate-y-0.5'
                  }`}
              >
                {isZipping ? (
                  <Loader2 className={`w-4 h-4 animate-spin ${isPro ? 'text-cyan-400' : 'text-slate-950'}`} />
                ) : (
                  <Archive className={`w-4 h-4 ${isPro ? 'text-slate-400' : 'text-slate-950 stroke-[2.5]'}`} />
                )}
                <span>{t('work.downloadZip', { defaultValue: 'Download ZIP' })}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (batchItems.some((i) => !i.name.trim() || i.name.startsWith('.'))) {
                    showToast(
                      t('work.emptyFileNameAlert', {
                        defaultValue: 'File name cannot be empty!',
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
                        defaultValue: `Real 4K Export Success! (${quotaState.remaining4k - 1} daily 4K quota left)`,
                      })
                    );
                  }
                  trackEvent('file_downloaded', { count: batchItems.length, type: 'zip-4k', tool: initialTab });
                  onZipDownload(customZipName);
                }}
                disabled={isZipping || !areAllReady}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 group ${isPro
                    ? 'bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black shadow-glow-cyan transform hover:-translate-y-0.5'
                    : user && quotaState.remaining4k > 0
                      ? 'bg-dark-800 hover:bg-dark-750 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_15px_rgba(5,218,237,0.15)]'
                      : 'bg-dark-800/80 hover:bg-dark-750 text-slate-400 hover:text-slate-200 border border-amber-500/30 hover:border-amber-400/60'
                  }`}
              >
                {isZipping ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                ) : isPro ? (
                  <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                ) : user && quotaState.remaining4k > 0 ? (
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                )}
                <span>{t('work.downloadZipPro', { defaultValue: 'Download ZIP 4K' })}</span>
                {isPro ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950/30 text-slate-950 border border-slate-950/20">
                    PRO
                  </span>
                ) : user && quotaState.remaining4k > 0 ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    {quotaState.remaining4k} Kuota
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" />
                    PRO
                  </span>
                )}
              </button>
            </div>
          )
        ) : (
          // ==================== SINGLE DOWNLOAD ====================
          // PENTING: Untuk tool kompresi, tombol download SUDAH ditangani langsung oleh Opsi B di CompressControl!
          // Jadi pada tool kompresi dengan 1 foto, ExportPanel TIDAK me-render tombol download duplikat!
          isCompressTool ? null : !isUpscaleTool ? (
            // Non-upscale tools (Crop, Resize, Rotate, Convert): 1 Clean Standard Button
            !isSingleReady ? (
              <button
                type="button"
                disabled={true}
                className="w-full px-5 py-3.5 bg-dark-800/60 text-slate-500 border border-dark-700/60 font-bold rounded-xl text-sm flex items-center justify-center gap-2.5 cursor-not-allowed select-none transition-all"
              >
                {singleItem?.status === 'processing' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                ) : (
                  <Download className="w-4 h-4 text-slate-600" />
                )}
                <span>
                  {singleItem?.status === 'processing'
                    ? t('work.processingBtn', { defaultValue: 'Processing Photo...' })
                    : isConvertTool
                      ? t('convert.convertFirst', { defaultValue: 'Convert Photo First' })
                      : t('work.processFirst', { defaultValue: 'Process Photo First' })}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSingleDownloadStandard}
                disabled={isExportingSingle}
                className="w-full px-5 py-3.5 bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2.5 shadow-glow-cyan transition-all transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
              >
                {isExportingSingle ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Download className="w-4 h-4 text-slate-950 stroke-[2.5]" />
                )}
                <span>
                  {t('editor.downloadPhoto', { defaultValue: 'Download Photo' })}
                </span>
              </button>
            )
          ) : (
            // Upscale tools: Dual resolution buttons (HD Free vs 4K Ultra-HD)
            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Button 1: Download HD (100% Free Forever) */}
              <button
                type="button"
                onClick={handleSingleDownloadStandard}
                disabled={isExportingSingle || isExporting4k || !isSingleReady}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${isPro
                    ? 'bg-dark-800/80 hover:bg-dark-750 text-slate-200 border border-dark-600/80 hover:border-dark-500'
                    : 'bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-glow-cyan transform hover:-translate-y-0.5'
                  }`}
              >
                {isExportingSingle ? (
                  <Loader2 className={`w-4 h-4 animate-spin ${isPro ? 'text-cyan-400' : 'text-slate-950'}`} />
                ) : (
                  <Download className={`w-4 h-4 ${isPro ? 'text-slate-400' : 'text-slate-950 stroke-[2.5]'}`} />
                )}
                <span>{t('editor.downloadPhoto', { defaultValue: 'Download Photo' })}</span>
              </button>

              {/* Button 2: Ultra-HD 4K (Real PRO Badging & Sleek Locked State) */}
              <button
                type="button"
                onClick={handleSingleDownload4k}
                disabled={isExportingSingle || isExporting4k || !isSingleReady}
                className={`flex-1 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 group ${isPro
                    ? 'bg-gradient-to-r from-[#05DAED] via-cyan-400 to-[#12DA91] hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black shadow-glow-cyan transform hover:-translate-y-0.5'
                    : user && quotaState.remaining4k > 0
                      ? 'bg-dark-800 hover:bg-dark-750 text-cyan-300 border border-cyan-500/50 hover:border-cyan-400 shadow-[0_0_15px_rgba(5,218,237,0.15)]'
                      : 'bg-dark-800/80 hover:bg-dark-750 text-slate-400 hover:text-slate-200 border border-amber-500/30 hover:border-amber-400/60'
                  }`}
              >
                {isExporting4k ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                ) : isPro ? (
                  <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                ) : user && quotaState.remaining4k > 0 ? (
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                )}
                <span>{t('editor.downloadPro', { defaultValue: 'Download 4K Ultra-HD' })}</span>
                {isPro ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-950/30 text-slate-950 border border-slate-950/20">
                    PRO
                  </span>
                ) : user && quotaState.remaining4k > 0 ? (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    {quotaState.remaining4k} Kuota
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-0.5">
                    <Crown className="w-2.5 h-2.5" />
                    PRO
                  </span>
                )}
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};
