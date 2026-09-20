// src/components/workspace/export/ExportPanel.tsx
// Export & Download Options Panel (Single & Batch ZIP)

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Archive, Loader2, Settings2, ChevronDown } from 'lucide-react';
import { useTranslation } from '../../../context/LanguageContext';
import { trackEvent } from '../../../utils/analytics';
import type { BatchItem } from '../types';

interface ExportPanelProps {
  batchItems: BatchItem[];
  setBatchItems: React.Dispatch<React.SetStateAction<BatchItem[]>>;
  initialTab: string;
  isZipping: boolean;
  onZipDownload: () => void;
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
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [customZipName, setCustomZipName] = useState('');

  if (batchItems.length === 0 || initialTab === 'picker') return null;

  return (
    <div className="mt-6 pt-6 border-t border-dark-600/60 shrink-0 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {t('work.exportSettingsTitle', { defaultValue: 'Export & Download Options' })}
        </div>
        <button
          type="button"
          onClick={() => setShowExportOptions(!showExportOptions)}
          className="text-xs flex items-center gap-1 text-neon-cyan hover:text-neon-cyan/80 font-medium transition-colors cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          {t('work.settings', { defaultValue: 'Export Settings' })}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showExportOptions ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {showExportOptions && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="flex flex-col gap-5 overflow-hidden"
        >
          {/* Batch Rename UI */}
          {batchItems.length > 1 ? (
            <div className="flex flex-col gap-2.5">
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {t('work.batchRename', { defaultValue: 'Rename Files' })}
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
                {t('work.renameFile', { defaultValue: 'Rename File' })}
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

          {/* ZIP Download Custom Name */}
          {batchItems.length > 1 && (
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                {t('work.zipName', { defaultValue: 'ZIP Filename' })}
              </div>
              <input
                type="text"
                value={customZipName}
                onChange={(e) => setCustomZipName(e.target.value)}
                placeholder={t('work.zipNamePlaceholder', { defaultValue: 'Custom ZIP Name (Optional)' })}
                className="w-full bg-dark-800/50 border border-dark-600/50 focus:border-neon-cyan text-white px-3 py-2.5 rounded-lg text-xs outline-none transition-all"
              />
            </div>
          )}
        </motion.div>
      )}

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
              onZipDownload();
            }}
            disabled={isZipping || batchItems.some((i) => i.status !== 'done')}
            className="flex-1 px-4 py-3.5 bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:opacity-95 cursor-pointer"
          >
            {isZipping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Archive className="w-5 h-5" />}
            <span>{t('work.downloadZip', { defaultValue: 'Download All (ZIP)' })}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const item = batchItems[0];
              if (!item || !item.name.trim() || item.name.startsWith('.')) {
                showToast(
                  t('work.emptyFileNameAlert', {
                    defaultValue: 'Nama file tidak boleh kosong! / File name cannot be empty!',
                  })
                );
                return;
              }
              trackEvent('file_downloaded', { count: 1, type: 'single', tool: initialTab });

              if (item && item.processedUrl) {
                const a = document.createElement('a');
                a.href = item.processedUrl;
                a.download = item.name;
                a.click();
              }
            }}
            disabled={batchItems[0]?.status !== 'done'}
            className="flex-1 px-4 py-3.5 bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold rounded-xl text-sm flex items-center justify-center gap-2 shadow-glow-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 hover:opacity-95 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{t('editor.download', { defaultValue: 'Download Image' })}</span>
          </button>
        )}
      </div>
    </div>
  );
};
