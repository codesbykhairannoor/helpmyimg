import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  Camera, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  Upload, 
  Check, 
  Sliders, 
  Download,
  Loader2,
  Calendar,
  User,
  Info
} from 'lucide-react';
import { 
  analyzeImageMetadata, 
  STUDIO_PRESETS, 
  type MetadataAnalysis, 
  type StudioPresetKey, 
  type CustomMetadataOptions 
} from '../../../utils/metadataEngine';
import type { BatchItem } from '../types';

interface MetadataControlProps {
  currentItem: BatchItem | null;
  onApplyPreset: (presetKey: StudioPresetKey, customOptions?: CustomMetadataOptions) => Promise<void>;
  onProcessBatch?: (presetKey: StudioPresetKey, customOptions?: CustomMetadataOptions) => Promise<void>;
  onDownload?: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const MetadataControl: React.FC<MetadataControlProps> = ({
  currentItem,
  onApplyPreset,
  onProcessBatch,
  onDownload,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();
  const [selectedPreset, setSelectedPreset] = useState<StudioPresetKey>('canon5d');
  const [analysis, setAnalysis] = useState<MetadataAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Custom metadata fields
  const [photographer, setPhotographer] = useState('Khairan Noor Studio');
  const [customDate, setCustomDate] = useState('');
  const [copyright, setCopyright] = useState('');

  // Analyze metadata whenever the currentItem changes
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

  const handleApply = () => {
    const customOpts: CustomMetadataOptions = {};
    if (photographer.trim()) customOpts.artist = photographer.trim();
    if (customDate.trim()) customOpts.dateTaken = customDate.trim();
    if (copyright.trim()) customOpts.copyright = copyright.trim();

    onApplyPreset(selectedPreset, customOpts);
  };

  const handleApplyBatch = () => {
    if (onProcessBatch) {
      const customOpts: CustomMetadataOptions = {};
      if (photographer.trim()) customOpts.artist = photographer.trim();
      if (customDate.trim()) customOpts.dateTaken = customDate.trim();
      if (copyright.trim()) customOpts.copyright = copyright.trim();

      onProcessBatch(selectedPreset, customOpts);
    }
  };

  const tr = (key: string, def: string) => t(`metadata.${key}`, { defaultValue: def });

  return (
    <div className="space-y-6 overflow-y-visible">
      {/* Live AI & Metadata Inspector Card */}
      <div className="rounded-2xl bg-dark-900 border border-slate-800 p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              {tr('inspectorTitle', 'METADATA & C2PA INSPECTOR')}
            </span>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Loader2 className="w-3 h-3 animate-spin text-neon-cyan" />
              <span>Scanning...</span>
            </div>
          )}
        </div>

        {analysis ? (
          <div className="space-y-2.5 text-xs">
            {/* C2PA Provenance Status */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/70 border border-slate-800">
              <div className="flex items-center gap-2">
                {analysis.hasC2PA ? (
                  <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <div>
                  <div className="font-semibold text-slate-200">
                    {analysis.hasC2PA
                      ? tr('c2paDetected', 'C2PA Manifest Detected!')
                      : tr('c2paClean', 'C2PA Manifest Free')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {analysis.hasC2PA
                      ? analysis.c2paIssuer || 'Signed Provenance Header'
                      : tr('c2paCleanDesc', 'Zero AI watermark manifests found')}
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
                {analysis.hasC2PA ? 'AI Tagged' : 'Clean'}
              </span>
            </div>

            {/* Current Camera EXIF */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-dark-950/70 border border-slate-800">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-neon-cyan shrink-0" />
                <div>
                  <div className="font-semibold text-slate-200">
                    {analysis.cameraModel
                      ? `${analysis.cameraMake || ''} ${analysis.cameraModel}`
                      : tr('noExif', 'No Camera EXIF (Stripped / AI)')}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {analysis.lensModel
                      ? `${analysis.lensModel} ${analysis.shutterSpeed ? `• ${analysis.shutterSpeed}` : ''} ${analysis.aperture ? `• ${analysis.aperture}` : ''}`
                      : tr('noExifDesc', 'Missing aperture, shutter speed & lens tags')}
                  </div>
                </div>
              </div>
              {analysis.iso && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-dark-800 text-neon-cyan border border-neon-cyan/30">
                  ISO {analysis.iso}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-3 text-xs text-slate-400 font-mono">
            {tr('dropToInspect', 'Drop an image to inspect AI signatures & metadata')}
          </div>
        )}
      </div>

      {/* Preset Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span>{tr('choosePreset', 'Choose Studio Camera Preset')}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {STUDIO_PRESETS.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset.id)}
                className={`w-full text-left p-3 rounded-2xl border transition-all duration-200 flex items-start justify-between group ${
                  isSelected
                    ? 'bg-neon-cyan/10 border-neon-cyan shadow-md shadow-neon-cyan/5'
                    : 'bg-dark-900 border-slate-800 hover:border-slate-700 hover:bg-dark-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-neon-cyan transition-colors">
                      {preset.name}
                    </span>
                    {preset.id === 'canon5d' && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {tr('recommendedBadge', 'Studio Pass Photo')}
                      </span>
                    )}
                    {preset.id === 'stealth' && (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {tr('stealthBadge', 'Scrub All')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-body">{preset.subtitle}</p>
                  {preset.id !== 'stealth' && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-950 text-slate-300 border border-slate-800">
                        {preset.shutter}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-950 text-slate-300 border border-slate-800">
                        {preset.aperture}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-950 text-slate-300 border border-slate-800">
                        ISO {preset.iso}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-dark-950 text-neon-cyan border border-neon-cyan/20">
                        {preset.flash}
                      </span>
                    </div>
                  )}
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isSelected
                      ? 'border-neon-cyan bg-neon-cyan text-dark-950'
                      : 'border-slate-700 bg-dark-950'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Studio Customization Accordion */}
      {selectedPreset !== 'stealth' && (
        <div className="rounded-2xl border border-slate-800 bg-dark-900/60 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
              <span>{tr('customDetailsTitle', 'Custom Photographer & Studio Details (Optional)')}</span>
            </div>
            <span className="text-[10px] font-mono text-neon-cyan uppercase">
              {showAdvanced ? tr('hide', 'Hide') : tr('customize', 'Customize')}
            </span>
          </button>

          {showAdvanced && (
            <div className="p-4 pt-1 space-y-3 border-t border-slate-800/60 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                  <User className="w-3 h-3 text-neon-cyan" />
                  <span>{tr('photographerLabel', 'Photographer / Studio Name')}</span>
                </label>
                <input
                  type="text"
                  value={photographer}
                  onChange={(e) => setPhotographer(e.target.value)}
                  placeholder="e.g. Khairan Noor Studio"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-neon-cyan" />
                  <span>{tr('dateLabel', 'Date Taken (YYYY:MM:DD HH:MM:SS)')}</span>
                </label>
                <input
                  type="text"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  placeholder="Leave blank for current studio timestamp"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-400 mb-1">
                  {tr('copyrightLabel', 'Copyright Notice')}
                </label>
                <input
                  type="text"
                  value={copyright}
                  onChange={(e) => setCopyright(e.target.value)}
                  placeholder="Leave blank for auto-generated copyright"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Primary Actions */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={handleApply}
          disabled={isProcessing || !currentItem}
          className="w-full py-3.5 px-4 rounded-xl bg-neon-cyan hover:bg-neon-cyan/90 text-dark-950 font-bold text-sm tracking-wide shadow-lg shadow-neon-cyan/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{tr('processing', 'Applying Studio EXIF & Stripping C2PA...')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>
                {selectedPreset === 'stealth'
                  ? tr('btnStealth', 'Losslessly Strip All Metadata & C2PA')
                  : tr('btnApply', 'Inject Studio DSLR EXIF & Strip C2PA')}
              </span>
            </>
          )}
        </button>

        {batchCount > 1 && onProcessBatch && (
          <button
            type="button"
            onClick={handleApplyBatch}
            disabled={isProcessing}
            className="w-full py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan" />
            <span>
              {t('work.processBatchCount', {
                count: batchCount,
                defaultValue: `Apply to All ${batchCount} Photos`,
              })}
            </span>
          </button>
        )}

        {currentItem?.processedUrl && (
          <button
            type="button"
            onClick={onDownload}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{tr('downloadClean', 'Download Studio Verified Image')}</span>
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
