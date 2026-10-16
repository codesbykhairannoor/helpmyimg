import React, { useState } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  RotateCcw, 
  Upload, 
  Loader2,
  Trash2
} from 'lucide-react';
import type { BatchItem } from '../types';

interface MetadataControlProps {
  currentItem: BatchItem | null;
  onStripMetadata: () => Promise<void>;
  onProcessBatch?: () => Promise<void>;
  onDownload?: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const MetadataControl: React.FC<MetadataControlProps> = ({
  currentItem,
  onStripMetadata,
  onProcessBatch,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`metadata.${key}`, { defaultValue: def });

  // Checkbox scopes
  const [stripC2PA, setStripC2PA] = useState(true);
  const [stripExif, setStripExif] = useState(true);
  const [stripGps, setStripGps] = useState(true);
  const [stripAuthor, setStripAuthor] = useState(true);
  const [stripSoftware, setStripSoftware] = useState(true);

  return (
    <div className="space-y-3.5 overflow-y-visible">
      {/* Scope Checklist Box */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/80 dark:border-dark-700/60 space-y-2 shadow-2xs">
        {/* 1. C2PA / JUMBF */}
        <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-dark-800/70 border border-slate-200/70 dark:border-dark-700/50 hover:border-slate-300 dark:hover:border-dark-600 transition-all cursor-pointer shadow-2xs group">
          <input
            type="checkbox"
            checked={stripC2PA}
            onChange={(e) => setStripC2PA(e.target.checked)}
            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500/20 border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-900 cursor-pointer shrink-0 transition-all"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
            {tr('chkC2pa', 'Strip Provenance & Tracking Manifests (C2PA, JUMBF)')}
          </span>
        </label>

        {/* 2. EXIF & Hardware */}
        <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-dark-800/70 border border-slate-200/70 dark:border-dark-700/50 hover:border-slate-300 dark:hover:border-dark-600 transition-all cursor-pointer shadow-2xs group">
          <input
            type="checkbox"
            checked={stripExif}
            onChange={(e) => setStripExif(e.target.checked)}
            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500/20 border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-900 cursor-pointer shrink-0 transition-all"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
            {tr('chkExif', 'Wipe Camera EXIF & Hardware Information')}
          </span>
        </label>

        {/* 3. GPS & Geotags */}
        <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-dark-800/70 border border-slate-200/70 dark:border-dark-700/50 hover:border-slate-300 dark:hover:border-dark-600 transition-all cursor-pointer shadow-2xs group">
          <input
            type="checkbox"
            checked={stripGps}
            onChange={(e) => setStripGps(e.target.checked)}
            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500/20 border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-900 cursor-pointer shrink-0 transition-all"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
            {tr('chkGps', 'Scrub GPS Coordinates & Geotags')}
          </span>
        </label>

        {/* 4. Creator Names & Copyright */}
        <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-dark-800/70 border border-slate-200/70 dark:border-dark-700/50 hover:border-slate-300 dark:hover:border-dark-600 transition-all cursor-pointer shadow-2xs group">
          <input
            type="checkbox"
            checked={stripAuthor}
            onChange={(e) => setStripAuthor(e.target.checked)}
            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500/20 border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-900 cursor-pointer shrink-0 transition-all"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
            {tr('chkAuthor', 'Strip Creator Names, Artist & Copyright Tags')}
          </span>
        </label>

        {/* 5. Software & XMP History */}
        <label className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white dark:bg-dark-800/70 border border-slate-200/70 dark:border-dark-700/50 hover:border-slate-300 dark:hover:border-dark-600 transition-all cursor-pointer shadow-2xs group">
          <input
            type="checkbox"
            checked={stripSoftware}
            onChange={(e) => setStripSoftware(e.target.checked)}
            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500/20 border-slate-300 dark:border-dark-600 bg-white dark:bg-dark-900 cursor-pointer shrink-0 transition-all"
          />
          <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
            {tr('chkXmp', 'Wipe Software Traces & Editing History (XMP)')}
          </span>
        </label>
      </div>

      {/* Primary Scrub Actions */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={onStripMetadata}
          disabled={isProcessing || !currentItem}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-rose-700 hover:opacity-95 text-white font-extrabold shadow-lg shadow-rose-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide cursor-pointer disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{tr('processing', 'Losslessly Scrubbing Metadata & C2PA...')}</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>{tr('btnScrubAll', 'Losslessly Strip All Metadata & C2PA')}</span>
            </>
          )}
        </button>

        {batchCount > 1 && onProcessBatch && (
          <button
            type="button"
            onClick={onProcessBatch}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-dark-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span>
              {t('work.processBatchCount', {
                count: batchCount,
                defaultValue: `Scrub All ${batchCount} Photos`,
              })}
            </span>
          </button>
        )}

        {/* Standardized 2-Button Action Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-200/80 dark:border-dark-700/80 mt-2">
          <button
            type="button"
            onClick={onReset}
            disabled={isProcessing}
            title={t('editor.resetDesc', { defaultValue: 'Kembalikan foto ini ke kondisi asli tanpa perubahan' })}
            className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-all border border-slate-200 dark:border-dark-600 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
            <span className="truncate">{t('editor.resetOriginal', { defaultValue: 'Reset ke Asli' })}</span>
          </button>

          {onUploadOther && (
            <button
              type="button"
              onClick={onUploadOther}
              disabled={isProcessing}
              className="flex items-center justify-center gap-1.5 py-3 px-2.5 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-xs transition-all border border-slate-200 dark:border-dark-600 cursor-pointer disabled:opacity-50 shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5 text-neon-cyan shrink-0" />
              <span className="truncate">{t('editor.uploadOther', { defaultValue: 'Ganti Foto' })}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
