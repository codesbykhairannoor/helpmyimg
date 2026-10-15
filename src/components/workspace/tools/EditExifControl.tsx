import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  Camera, 
  Sparkles, 
  RotateCcw, 
  Upload, 
  Download,
  Loader2,
  Calendar,
  User,
  Sliders,
  CheckCircle2,
  Eye,
  Info,
  Clock,
  Layers,
  Zap,
  Tag,
  Shield,
  FileText,
  Trash2
} from 'lucide-react';
import { 
  analyzeImageMetadata, 
  type MetadataAnalysis, 
  type ManualExifData 
} from '../../../utils/metadataEngine';
import type { BatchItem } from '../types';

interface EditExifControlProps {
  currentItem: BatchItem | null;
  onApplyExif: (exifData: ManualExifData) => Promise<void>;
  onProcessBatch?: (exifData: ManualExifData) => Promise<void>;
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
  const tr = (key: string, def: string) => t(`editexif.${key}`, { defaultValue: def });

  const [analysis, setAnalysis] = useState<MetadataAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'exposure' | 'rights' | 'specs'>('camera');

  // Form State
  const [cameraMake, setCameraMake] = useState('Canon');
  const [cameraModel, setCameraModel] = useState('Canon EOS 5D Mark IV');
  const [lensModel, setLensModel] = useState('EF85mm f/1.4L IS USM');
  const [shutterSpeed, setShutterSpeed] = useState('1/160');
  const [aperture, setAperture] = useState('5.6');
  const [iso, setIso] = useState('100');
  const [focalLength, setFocalLength] = useState('85');
  const [flash, setFlash] = useState('fired');
  const [artist, setArtist] = useState('Photo Studio Professional');
  const [copyright, setCopyright] = useState('All Rights Reserved');
  const [software, setSoftware] = useState('Adobe Photoshop 2024');
  const [imageDescription, setImageDescription] = useState('Studio Portrait Photography');
  const [dateTaken, setDateTaken] = useState('');
  const [dpi, setDpi] = useState<number>(300);

  // Auto pre-fill from uploaded photo if EXIF exists
  useEffect(() => {
    let isCancelled = false;
    if (currentItem?.file) {
      setIsAnalyzing(true);
      analyzeImageMetadata(currentItem.file)
        .then((res) => {
          if (!isCancelled) {
            setAnalysis(res);
            setIsAnalyzing(false);

            // Pre-fill existing metadata if available
            if (res.cameraMake) setCameraMake(res.cameraMake);
            if (res.cameraModel) setCameraModel(res.cameraModel);
            if (res.lensModel) setLensModel(res.lensModel);
            if (res.shutterSpeed) setShutterSpeed(res.shutterSpeed.replace('s', ''));
            if (res.aperture) setAperture(res.aperture.replace(/^f\//i, ''));
            if (res.iso) setIso(String(res.iso));
            if (res.focalLength) setFocalLength(res.focalLength.replace(/mm/i, '').trim());
            if (res.artist) setArtist(res.artist);
            if (res.copyright) setCopyright(res.copyright);
            if (res.software) setSoftware(res.software);
            if (res.dateTaken) setDateTaken(res.dateTaken);
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

  // Convert EXIF "YYYY:MM:DD HH:MM:SS" to datetime-local format "YYYY-MM-DDTHH:mm"
  const exifToDatetimeLocal = (exifStr: string) => {
    if (!exifStr) return '';
    const parts = exifStr.trim().split(' ');
    if (parts.length >= 1) {
      const datePart = parts[0].replace(/:/g, '-');
      const timePart = parts[1] ? parts[1].slice(0, 5) : '12:00';
      return `${datePart}T${timePart}`;
    }
    return '';
  };

  // Convert datetime-local format "YYYY-MM-DDTHH:mm" to EXIF standard "YYYY:MM:DD HH:MM:SS"
  const datetimeLocalToExif = (dtStr: string) => {
    if (!dtStr) return '';
    const [d, t] = dtStr.split('T');
    const dateFormatted = d.replace(/-/g, ':');
    const timeFormatted = t ? (t.length === 5 ? `${t}:00` : t) : '12:00:00';
    return `${dateFormatted} ${timeFormatted}`;
  };

  const handleApply = () => {
    const data: ManualExifData = {
      cameraMake,
      cameraModel,
      lensModel,
      shutterSpeed,
      aperture,
      iso,
      focalLength,
      flash,
      artist,
      copyright,
      software,
      imageDescription,
      dateTaken,
      dpi,
    };
    onApplyExif(data);
  };

  const handleApplyBatch = () => {
    if (onProcessBatch) {
      const data: ManualExifData = {
        cameraMake,
        cameraModel,
        lensModel,
        shutterSpeed,
        aperture,
        iso,
        focalLength,
        flash,
        artist,
        copyright,
        software,
        imageDescription,
        dateTaken,
        dpi,
      };
      onProcessBatch(data);
    }
  };

  return (
    <div className="space-y-4 overflow-y-visible">
      {/* Section Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-dark-950 rounded-xl border border-slate-800 text-xs font-medium">
        <button
          type="button"
          onClick={() => setActiveTab('camera')}
          className={`py-2 px-1 text-center rounded-lg transition-all ${
            activeTab === 'camera'
              ? 'bg-neon-cyan/20 text-neon-cyan font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tr('tabCamera', 'Camera')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('exposure')}
          className={`py-2 px-1 text-center rounded-lg transition-all ${
            activeTab === 'exposure'
              ? 'bg-neon-cyan/20 text-neon-cyan font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tr('tabExposure', 'Exposure')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rights')}
          className={`py-2 px-1 text-center rounded-lg transition-all ${
            activeTab === 'rights'
              ? 'bg-neon-cyan/20 text-neon-cyan font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tr('tabAuthor', 'Author')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`py-2 px-1 text-center rounded-lg transition-all ${
            activeTab === 'specs'
              ? 'bg-neon-cyan/20 text-neon-cyan font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {tr('tabSpecs', 'Specs')}
        </button>
      </div>

      {/* FORM INPUTS ACCORDING TO ACTIVE TAB */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-slate-800 space-y-4 shadow-xl">
        {/* TAB 1: CAMERA & HARDWARE */}
        {activeTab === 'camera' && (
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('lblCameraMake', 'Camera Make / Manufacturer')}</span>
              </label>
              <input
                type="text"
                value={cameraMake}
                onChange={(e) => setCameraMake(e.target.value)}
                placeholder="e.g. Canon, Sony, Nikon, Apple, FUJIFILM"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('lblCameraModel', 'Camera Model')}</span>
              </label>
              <input
                type="text"
                value={cameraModel}
                onChange={(e) => setCameraModel(e.target.value)}
                placeholder="e.g. Canon EOS 5D Mark IV, ILCE-7M4, iPhone 16 Pro"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('lblLensModel', 'Lens Specification & Model')}</span>
              </label>
              <input
                type="text"
                value={lensModel}
                onChange={(e) => setLensModel(e.target.value)}
                placeholder="e.g. EF85mm f/1.4L IS USM, FE 50mm F1.2 GM"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>
          </div>
        )}

        {/* TAB 2: EXPOSURE & OPTICS */}
        {activeTab === 'exposure' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{tr('lblShutter', 'Shutter Speed (s)')}</span>
                </label>
                <input
                  type="text"
                  value={shutterSpeed}
                  onChange={(e) => setShutterSpeed(e.target.value)}
                  placeholder="e.g. 1/160, 1/200, 1/50"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{tr('lblAperture', 'Aperture (f-stop)')}</span>
                </label>
                <input
                  type="text"
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  placeholder="e.g. 2.8, 5.6, 1.4"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{tr('lblIso', 'ISO Sensitivity')}</span>
                </label>
                <input
                  type="text"
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                  placeholder="e.g. 100, 200, 400, 800"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{tr('lblFocal', 'Focal Length (mm)')}</span>
                </label>
                <input
                  type="text"
                  value={focalLength}
                  onChange={(e) => setFocalLength(e.target.value)}
                  placeholder="e.g. 85, 50, 35, 24"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('lblFlash', 'Flash Strobe Mode')}</span>
              </label>
              <select
                value={flash}
                onChange={(e) => setFlash(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-neon-cyan"
              >
                <option value="fired">{tr('flashFired', 'Fired (Studio Strobe Sync)')}</option>
                <option value="off">{tr('flashOff', 'Did Not Fire (Ambient Light)')}</option>
                <option value="auto">{tr('flashAuto', 'Auto Mode')}</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 3: AUTHOR & RIGHTS */}
        {activeTab === 'rights' && (
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('photographerLabel', 'Photographer / Studio Name (Artist)')}</span>
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. John Doe Studio, Corporate Photography"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('copyrightLabel', 'Copyright Notice')}</span>
              </label>
              <input
                type="text"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                placeholder="e.g. Copyright (c) 2024. All Rights Reserved."
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('lblSoftware', 'Software / Processing Engine')}</span>
              </label>
              <input
                type="text"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                placeholder="e.g. Adobe Photoshop 2024, Lightroom Classic"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('lblDescription', 'Image Title / Description')}</span>
              </label>
              <input
                type="text"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="e.g. Official Passport Photo, Studio Portrait"
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs placeholder-slate-600 focus:outline-none focus:border-neon-cyan"
              />
            </div>
          </div>
        )}

        {/* TAB 4: DATE & SPECS */}
        {activeTab === 'specs' && (
          <div className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>{tr('dateLabel', 'Capture Date & Time')}</span>
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const now = new Date();
                      const pad = (n: number) => String(n).padStart(2, '0');
                      setDateTaken(`${now.getFullYear()}:${pad(now.getMonth() + 1)}:${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
                    }}
                    className="text-[10px] text-neon-cyan hover:underline cursor-pointer"
                  >
                    {tr('setNow', 'Set to Now')}
                  </button>
                  {dateTaken && (
                    <button
                      type="button"
                      onClick={() => setDateTaken('')}
                      className="text-[10px] text-rose-400 hover:underline cursor-pointer"
                    >
                      {tr('clearDate', 'Clear')}
                    </button>
                  )}
                </div>
              </div>
              <input
                type="datetime-local"
                value={exifToDatetimeLocal(dateTaken)}
                onChange={(e) => setDateTaken(datetimeLocalToExif(e.target.value))}
                onClick={(e) => {
                  try {
                    (e.target as any).showPicker?.();
                  } catch {
                    // Fallback
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-neon-cyan font-mono cursor-pointer [color-scheme:dark]"
              />
              {dateTaken && (
                <div className="text-[10px] text-slate-400 font-mono mt-1 flex items-center justify-between">
                  <span>EXIF Tag:</span>
                  <span className="text-neon-cyan font-bold">{dateTaken}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-300 mb-1 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-neon-cyan" />
                <span>{tr('lblDpi', 'Resolution / DPI (Print Standard)')}</span>
              </label>
              <select
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-neon-cyan font-mono"
              >
                <option value={300}>300 DPI ({tr('dpiPassport', 'Official Passport & High-Quality Print')})</option>
                <option value={72}>72 DPI ({tr('dpiWeb', 'Web & Screen Standard')})</option>
                <option value={150}>150 DPI ({tr('dpiMedium', 'Medium Resolution Print')})</option>
                <option value={600}>600 DPI ({tr('dpiUltra', 'Ultra High Definition Archival')})</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Primary Actions */}
      <div className="space-y-3 pt-1">
        <button
          type="button"
          onClick={handleApply}
          disabled={isProcessing || !currentItem}
          className="w-full py-3.5 px-4 rounded-xl bg-neon-cyan hover:bg-neon-cyan/90 text-dark-950 font-bold text-sm tracking-wide shadow-lg shadow-neon-cyan/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{tr('processing', 'Applying Custom EXIF Metadata...')}</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>{tr('btnApplyManual', 'Apply & Save Custom EXIF')}</span>
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
            <span>{tr('downloadClean', 'Download Photo with New EXIF')}</span>
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
