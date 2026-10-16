import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  ShieldAlert, 
  ShieldCheck, 
  RotateCcw, 
  Upload, 
  Download,
  Loader2,
  Trash2,
  CheckCircle2,
  MapPin,
  Camera,
  User,
  Clock,
  Sparkles,
  Lock,
  Layers,
  FileX2
} from 'lucide-react';
import { 
  analyzeImageMetadata, 
  stripAllPhotoMetadata,
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
  onDownload,
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

  return (
    <div className="space-y-5 overflow-y-visible">
      {/* Privacy Audit Card */}
      <div className="rounded-2xl bg-dark-900 border border-slate-800 p-4 space-y-3.5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              {tr('auditTitle', 'METADATA PRIVACY AUDIT')}
            </span>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Loader2 className="w-3 h-3 animate-spin text-neon-cyan" />
              <span>Scanning headers...</span>
            </div>
          )}
        </div>

        {analysis ? (
          <div className="space-y-2 text-xs">
            {/* C2PA / AI Provenance Item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/70 border border-slate-800">
              <div className="flex items-center gap-2.5">
                {analysis.hasC2PA ? (
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-slate-200">
                    {analysis.hasC2PA
                      ? tr('c2paDetected', 'C2PA AI Manifest Detected!')
                      : tr('c2paClean', 'C2PA Manifest Free')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {analysis.hasC2PA
                      ? analysis.c2paIssuer || 'Cryptographic AI provenance manifest'
                      : tr('c2paCleanDesc', 'No AI tracking signatures detected')}
                  </div>
                </div>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                  analysis.hasC2PA
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {analysis.hasC2PA ? 'Flagged' : 'Clean'}
              </span>
            </div>

            {/* Camera EXIF Item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/70 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <Camera className="w-4 h-4 text-neon-cyan shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">
                    {analysis.cameraModel
                      ? (analysis.cameraMake && !analysis.cameraModel.toLowerCase().includes(analysis.cameraMake.toLowerCase())
                          ? `${analysis.cameraMake} ${analysis.cameraModel}`
                          : analysis.cameraModel)
                      : tr('noExifFound', 'No Camera Hardware Metadata')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {analysis.lensModel
                      ? `${analysis.lensModel} • ${analysis.shutterSpeed || ''}`
                      : tr('noExifDesc', 'Camera make, lens and serial tags')}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-slate-700">
                {analysis.hasExif ? 'Exposed' : 'None'}
              </span>
            </div>

            {/* Author / Artist Item */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/70 border border-slate-800">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">
                    {analysis.artist || tr('noArtist', 'No Creator Name Embedded')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {analysis.copyright || tr('noCopyright', 'No copyright or license notice')}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-800 text-slate-300 border border-slate-700">
                {analysis.artist ? 'Exposed' : 'None'}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 text-xs text-slate-400 font-mono">
            {tr('dropToInspect', 'Drop an image to inspect AI signatures & metadata')}
          </div>
        )}
      </div>

      {/* Scrub Scope Checklist */}
      <div className="rounded-2xl bg-dark-900 border border-slate-800 p-3.5 space-y-2.5">
        <label className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase flex items-center gap-2">
          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
          <span>{tr('scrubScopeTitle', 'DATA TO REMOVE PERMANENTLY')}</span>
        </label>

        <div className="space-y-1.5 text-xs">
          <label className="flex items-center gap-2.5 p-2 py-1.5 rounded-xl bg-dark-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={stripC2PA}
              onChange={(e) => setStripC2PA(e.target.checked)}
              className="w-4 h-4 rounded text-rose-500 bg-dark-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-200 block text-[12px]">
                {tr('chkC2pa', 'Strip Provenance & Tracking Manifests (C2PA, JUMBF)')}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {tr('chkC2paSub', 'Removes embedded digital tracking headers and origin metadata')}
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2 py-1.5 rounded-xl bg-dark-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={stripExif}
              onChange={(e) => setStripExif(e.target.checked)}
              className="w-4 h-4 rounded text-rose-500 bg-dark-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-200 block text-[12px]">
                {tr('chkExif', 'Wipe Camera EXIF & Hardware Information')}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {tr('chkExifSub', 'Removes camera serial number, shutter count, and lens data')}
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2 py-1.5 rounded-xl bg-dark-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={stripGps}
              onChange={(e) => setStripGps(e.target.checked)}
              className="w-4 h-4 rounded text-rose-500 bg-dark-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-200 block text-[12px]">
                {tr('chkGps', 'Scrub GPS Coordinates & Geotags')}
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                {tr('chkGpsSub', 'Protects physical location and private home/office addresses')}
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2 py-1.5 rounded-xl bg-dark-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={stripAuthor}
              onChange={(e) => setStripAuthor(e.target.checked)}
              className="w-4 h-4 rounded text-rose-500 bg-dark-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-200 block text-[12px]">
                {tr('chkAuthor', 'Strip Creator Names, Artist & Copyright Tags')}
              </span>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2 py-1.5 rounded-xl bg-dark-950/60 border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors">
            <input
              type="checkbox"
              checked={stripSoftware}
              onChange={(e) => setStripSoftware(e.target.checked)}
              className="w-4 h-4 rounded text-rose-500 bg-dark-900 border-slate-700 focus:ring-0 cursor-pointer"
            />
            <div className="flex-1">
              <span className="font-semibold text-slate-200 block text-[12px]">
                {tr('chkXmp', 'Wipe Software Traces & Editing History (XMP)')}
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Primary Scrub Actions */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={onStripMetadata}
          disabled={isProcessing || !currentItem}
          className="w-full py-3.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{tr('processing', 'Losslessly Scrubbing Metadata & C2PA...')}</span>
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>{tr('btnScrubAll', 'Losslessly Strip All Metadata & C2PA')}</span>
            </>
          )}
        </button>

        {batchCount > 1 && onProcessBatch && (
          <button
            type="button"
            onClick={onProcessBatch}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>
              {t('work.processBatchCount', {
                count: batchCount,
                defaultValue: `Scrub All ${batchCount} Photos`,
              })}
            </span>
          </button>
        )}


        <div className="flex gap-2 pt-1">
          {onUploadOther && (
            <button
              type="button"
              onClick={onUploadOther}
              className="flex-1 py-2 px-3 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 font-medium text-xs border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{t('editor.uploadOther', { defaultValue: 'Upload Other' })}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2 px-3 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 font-medium text-xs border border-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('editor.resetOriginal', { defaultValue: 'Reset to Original' })}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
