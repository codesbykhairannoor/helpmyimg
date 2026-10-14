import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  Camera, 
  Sparkles, 
  RotateCcw, 
  Upload, 
  Check, 
  Sliders, 
  Download,
  Loader2,
  Calendar,
  User,
  Info,
  Clock,
  Layers,
  Zap
} from 'lucide-react';
import { 
  analyzeImageMetadata, 
  STUDIO_PRESETS, 
  type MetadataAnalysis, 
  type StudioPresetKey, 
  type CustomMetadataOptions 
} from '../../../utils/metadataEngine';
import type { BatchItem } from '../types';

interface EditExifControlProps {
  currentItem: BatchItem | null;
  onApplyExif: (presetKey: StudioPresetKey, customOptions?: CustomMetadataOptions) => Promise<void>;
  onProcessBatch?: (presetKey: StudioPresetKey, customOptions?: CustomMetadataOptions) => Promise<void>;
  onDownload?: () => void;
  onUploadOther?: () => void;
  onReset: () => void;
  isProcessing: boolean;
  batchCount?: number;
}

export const EditExifControl: React.FC<EditExifControlProps> = ({
  currentItem,
  onApplyExif,
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
  const [showManualForm, setShowManualForm] = useState(false);

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

    onApplyExif(selectedPreset, customOpts);
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

  const tr = (key: string, def: string) => t(`editexif.${key}`, { defaultValue: def });

  // Camera presets excluding 'stealth' which belongs to pure clean
  const cameraPresets = STUDIO_PRESETS.filter((p) => p.id !== 'stealth');

  return (
    <div className="space-y-6 overflow-y-visible">
      {/* Current Camera EXIF Readout Card */}
      <div className="rounded-2xl bg-dark-900 border border-slate-800 p-4 space-y-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
              {tr('inspectorTitle', 'CURRENT CAMERA EXIF DATA')}
            </span>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
              <Loader2 className="w-3 h-3 animate-spin text-neon-cyan" />
              <span>Reading...</span>
            </div>
          )}
        </div>

        {analysis ? (
          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-dark-950/70 border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">{tr('lblCamera', 'Camera Model')}:</span>
                <span className="font-semibold text-white">
                  {analysis.cameraModel ? `${analysis.cameraMake || ''} ${analysis.cameraModel}` : 'None (No EXIF)'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-mono text-[11px]">{tr('lblLens', 'Lens')}:</span>
                <span className="font-semibold text-slate-200">
                  {analysis.lensModel || 'Unrecorded / Synthetic'}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
                <span>{analysis.shutterSpeed || '1/--s'} • {analysis.aperture || 'f/--'}</span>
                <span>ISO {analysis.iso || '--'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-3 text-xs text-slate-400 font-mono">
            {tr('dropToInspect', 'Drop a photo to view & edit EXIF properties')}
          </div>
        )}
      </div>

      {/* Preset Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neon-cyan" />
            <span>{tr('choosePreset', 'Choose Studio Camera Setup')}</span>
          </label>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {cameraPresets.map((preset) => {
            const isSelected = selectedPreset === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPreset(preset.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 flex items-start justify-between group ${
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
                        {tr('passPhotoBadge', 'Studio Pass Photo')}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 font-body">{preset.subtitle}</p>
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

      {/* Manual Details Customization Accordion */}
      <div className="rounded-2xl border border-slate-800 bg-dark-900/60 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowManualForm(!showManualForm)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
            <span>{tr('customDetailsTitle', 'Custom Photographer, Studio & Date')}</span>
          </div>
          <span className="text-[10px] font-mono text-neon-cyan uppercase">
            {showManualForm ? tr('hide', 'Hide') : tr('customize', 'Customize')}
          </span>
        </button>

        {showManualForm && (
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
              <span>{tr('processing', 'Injecting Studio DSLR EXIF Metadata...')}</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>{tr('btnApply', 'Inject Studio DSLR EXIF Metadata')}</span>
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
