import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  RotateCcw, 
  Upload, 
  Loader2,
  Trash2,
  Camera,
  User,
  Sliders,
  Calendar,
  Shield,
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
  const [activeView, setActiveView] = useState<'info' | 'scope'>('info');

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
    <div className="space-y-3.5 overflow-y-visible">
      {/* Top Segmented Control (Kertas Bolak-Balik Switcher) */}
      <div className="grid grid-cols-2 p-1 bg-slate-100/90 dark:bg-dark-950/80 rounded-xl border border-slate-200/80 dark:border-dark-700/60 text-xs font-semibold shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveView('info')}
          className={`py-2 px-2 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeView === 'info'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Info className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
          <span>{tr('tabInfo', 'Keterangan Metadata')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('scope')}
          className={`py-2 px-2 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeView === 'scope'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>{tr('tabScope', 'Opsi Hapus')}</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold border border-rose-500/20">
            {activeScopeCount}
          </span>
        </button>
      </div>

      {/* 3D Flip Card Container (Kertas Bolak-Balik) */}
      <div className="perspective-1000 w-full">
        <div
          className={`w-full transition-transform duration-500 transform-style-3d grid grid-cols-1 ${
            activeView === 'scope' ? 'rotate-y-180' : ''
          }`}
        >
          {/* SISI DEPAN: Keterangan Metadata (Langsung Tampil Semua Tanpa Opsi Sembunyi/Hide) */}
          <div className="col-start-1 row-start-1 w-full rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/80 dark:border-dark-700/60 p-3.5 space-y-2.5 shadow-2xs backface-hidden">
            {isAnalyzing ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-cyan-600 dark:text-neon-cyan font-mono font-medium">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{tr('scanning', 'Memindai metadata...')}</span>
              </div>
            ) : analysis ? (
              <div className="space-y-2 text-xs">
                {/* Kamera & Lensa */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                    <Camera className="w-3 h-3 text-cyan-600 dark:text-neon-cyan shrink-0" />
                    <span>{tr('fieldCamera', 'Kamera & Lensa')}</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {analysis.cameraModel || analysis.cameraMake
                      ? `${analysis.cameraMake || ''} ${analysis.cameraModel || ''}`.trim()
                      : '-'}
                  </div>
                  {analysis.lensModel && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {analysis.lensModel}
                    </div>
                  )}
                </div>

                {/* Parameter Eksposur */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                    <Sliders className="w-3 h-3 text-cyan-600 dark:text-neon-cyan shrink-0" />
                    <span>{tr('fieldExposure', 'Parameter Eksposur')}</span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 flex flex-wrap gap-x-2.5 gap-y-1">
                    <span>{analysis.shutterSpeed ? `Shutter: ${analysis.shutterSpeed}` : 'Shutter: -'}</span>
                    <span>{analysis.aperture ? `Aperture: ${analysis.aperture}` : 'Aperture: -'}</span>
                    <span>{analysis.iso ? `ISO ${analysis.iso}` : 'ISO: -'}</span>
                    <span>{analysis.focalLength ? `Focal: ${analysis.focalLength}` : 'Focal: -'}</span>
                  </div>
                </div>

                {/* Kreator & Hak Cipta */}
                <div className="p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                    <User className="w-3 h-3 text-cyan-600 dark:text-neon-cyan shrink-0" />
                    <span>{tr('fieldAuthor', 'Kreator & Hak Cipta')}</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    {analysis.artist || '-'}
                  </div>
                  {analysis.copyright && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {analysis.copyright}
                    </div>
                  )}
                  {analysis.software && (
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Software: {analysis.software}
                    </div>
                  )}
                </div>

                {/* Waktu Pengambilan & C2PA */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3 h-3 text-cyan-600 dark:text-neon-cyan shrink-0" />
                      <span>{tr('fieldDate', 'Waktu')}</span>
                    </div>
                    <div className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {analysis.dateTaken || '-'}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/70 dark:border-dark-700/50 shadow-2xs">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
                      <Shield className="w-3 h-3 text-cyan-600 dark:text-neon-cyan shrink-0" />
                      <span>C2PA / AI</span>
                    </div>
                    <div className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {analysis.hasC2PA ? (analysis.c2paIssuer || 'Terdeteksi') : 'Bebas C2PA'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {tr('dropToInspect', 'Drop foto untuk memeriksa metadata')}
              </div>
            )}
          </div>

          {/* SISI BELAKANG: Opsi Hapus (5 Checkbox Bersih Satu Baris) */}
          <div className="col-start-1 row-start-1 w-full rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/80 dark:border-dark-700/60 p-3.5 space-y-2 shadow-2xs backface-hidden rotate-y-180">
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
