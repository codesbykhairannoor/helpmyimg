import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  RotateCcw, 
  Upload, 
  Loader2,
  Trash2,
  Camera,
  User,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  analyzeImageMetadata, 
  type MetadataAnalysis 
} from '../../../utils/metadataEngine';
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

  const [analysis, setAnalysis] = useState<MetadataAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Checkbox scopes
  const [stripC2PA, setStripC2PA] = useState(true);
  const [stripExif, setStripExif] = useState(true);
  const [stripGps, setStripGps] = useState(true);
  const [stripAuthor, setStripAuthor] = useState(true);
  const [stripSoftware, setStripSoftware] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    if (currentItem?.file) {
      setIsAnalyzing(true);
      analyzeImageMetadata(currentItem.file)
        .then((res) => {
          if (!isCancelled) {
            setAnalysis(res);
            setIsAnalyzing(false);
          }
        })
        .catch(() => {
          if (!isCancelled) setIsAnalyzing(false);
        });
    } else {
      setAnalysis(null);
    }
    return () => {
      isCancelled = true;
    };
  }, [currentItem]);

  const activeScopeCount = [stripC2PA, stripExif, stripGps, stripAuthor, stripSoftware].filter(Boolean).length;

  return (
    <div className="space-y-4 overflow-y-visible">
      {/* Privacy Audit Card */}
      <div className="rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/80 dark:border-dark-700/60 p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-dark-700/70 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
              {tr('auditTitle', 'METADATA PRIVACY AUDIT')}
            </span>
          </div>
          {isAnalyzing ? (
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-600 dark:text-neon-cyan font-mono font-medium">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Scanning headers...</span>
            </div>
          ) : (
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-dark-800 text-slate-600 dark:text-slate-400">
              {analysis ? 'Audit Ready' : 'Idle'}
            </span>
          )}
        </div>

        {analysis ? (
          <div className="space-y-2 text-xs">
            {/* C2PA / AI Provenance Item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  analysis.hasC2PA ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                }`}>
                  {analysis.hasC2PA ? (
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {analysis.hasC2PA
                      ? tr('c2paDetected', 'C2PA Manifest Detected!')
                      : tr('c2paClean', 'C2PA Manifest Free')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {analysis.hasC2PA
                      ? analysis.c2paIssuer || 'Cryptographic provenance manifest'
                      : tr('c2paCleanDesc', 'No digital tracking signatures detected')}
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ml-2 ${
                  analysis.hasC2PA
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-300 border border-rose-500/30'
                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {analysis.hasC2PA ? 'Flagged' : 'Clean'}
              </span>
            </div>

            {/* Camera EXIF Item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-neon-cyan flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {analysis.cameraModel
                      ? (analysis.cameraMake && !analysis.cameraModel.toLowerCase().includes(analysis.cameraMake.toLowerCase())
                          ? `${analysis.cameraMake} ${analysis.cameraModel}`
                          : analysis.cameraModel)
                      : tr('noExifFound', 'No Camera Hardware Metadata')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {analysis.lensModel
                      ? `${analysis.lensModel} • ${analysis.shutterSpeed || ''}`
                      : tr('noExifDesc', 'Camera make, lens and serial tags')}
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ml-2 ${
                  analysis.hasExif
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-dark-600'
                }`}
              >
                {analysis.hasExif ? 'Exposed' : 'None'}
              </span>
            </div>

            {/* Author / Artist Item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 shrink-0" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {analysis.artist || tr('noArtist', 'No Creator Name Embedded')}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {analysis.copyright || tr('noCopyright', 'No copyright or license notice')}
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase shrink-0 ml-2 ${
                  analysis.artist
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : 'bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400 border border-slate-200/80 dark:border-dark-600'
                }`}
              >
                {analysis.artist ? 'Exposed' : 'None'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
            {tr('dropToInspect', 'Drop an image to inspect headers & metadata')}
          </div>
        )}
      </div>

      {/* Scrub Scope Checklist */}
      <div className="rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/80 dark:border-dark-700/60 p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-200/70 dark:border-dark-700/70 pb-2.5">
          <label className="text-xs font-mono font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase flex items-center gap-2">
            <Trash2 className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>{tr('scrubScopeTitle', 'DATA TO REMOVE PERMANENTLY')}</span>
          </label>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            {activeScopeCount}/5 Active
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
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
