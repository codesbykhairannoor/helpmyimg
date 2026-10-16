import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../../context/LanguageContext';
import { 
  Camera, 
  Sparkles, 
  RotateCcw, 
  Upload, 
  Loader2,
  Calendar, 
  User, 
  Sliders, 
  Eye, 
  Clock, 
  Layers, 
  Zap, 
  Tag, 
  Shield, 
  FileText,
  Trash2,
  Check
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

const pad = (n: number) => String(n).padStart(2, '0');

const getDatePart = (exifStr: string) => {
  if (!exifStr) return '';
  const parts = exifStr.trim().split(' ');
  return parts[0] || '';
};

const getTimePart = (exifStr: string) => {
  if (!exifStr) return '';
  const parts = exifStr.trim().split(' ');
  return parts[1] || '';
};

const combineDateTime = (datePart: string, timePart: string) => {
  const d = datePart.trim();
  const t = timePart.trim();
  if (!d && !t) return '';
  if (d && !t) return `${d} 12:00:00`;
  if (!d && t) {
    const now = new Date();
    const today = `${now.getFullYear()}:${pad(now.getMonth() + 1)}:${pad(now.getDate())}`;
    return `${today} ${t}`;
  }
  return `${d} ${t}`;
};

const formatLocalizedDate = (exifStr: string, currentLang: string): string => {
  if (!exifStr || !exifStr.trim()) return '';
  const parts = exifStr.trim().split(' ');
  if (parts.length < 2) return '';
  const dp = parts[0].split(':').map(Number);
  const tp = parts[1].split(':').map(Number);
  if (dp.length !== 3 || tp.length < 2) return '';
  try {
    const d = new Date(dp[0], dp[1] - 1, dp[2], tp[0], tp[1], tp[2] || 0);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleString(currentLang || 'en', {
      dateStyle: 'full',
      timeStyle: 'medium',
    });
  } catch {
    return '';
  }
};

export const EditExifControl: React.FC<EditExifControlProps> = ({
  currentItem,
  onApplyExif,
  onProcessBatch,
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t, lang } = useTranslation();
  const tr = (key: string, def: string) => t(`editexif.${key}`, { defaultValue: def });

  const [analysis, setAnalysis] = useState<MetadataAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'inspect' | 'camera' | 'exposure' | 'rights' | 'specs'>('inspect');

  // Form State - start clean so design files are not polluted with fake camera info
  const [cameraMake, setCameraMake] = useState('');
  const [cameraModel, setCameraModel] = useState('');
  const [lensModel, setLensModel] = useState('');
  const [shutterSpeed, setShutterSpeed] = useState('');
  const [aperture, setAperture] = useState('');
  const [iso, setIso] = useState('');
  const [focalLength, setFocalLength] = useState('');
  const [flash, setFlash] = useState('off');
  const [artist, setArtist] = useState('');
  const [copyright, setCopyright] = useState('');
  const [software, setSoftware] = useState('');
  const [imageDescription, setImageDescription] = useState('');
  const [dateTaken, setDateTaken] = useState('');
  const [modifyDate, setModifyDate] = useState('');
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
            if (res.dateTaken) {
              setDateTaken(res.dateTaken);
              setModifyDate(res.dateTaken);
            }
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

  const handlePopulateFromAnalysis = () => {
    if (analysis) {
      if (analysis.cameraMake) setCameraMake(analysis.cameraMake);
      if (analysis.cameraModel) setCameraModel(analysis.cameraModel);
      if (analysis.lensModel) setLensModel(analysis.lensModel);
      if (analysis.shutterSpeed) setShutterSpeed(analysis.shutterSpeed.replace('s', ''));
      if (analysis.aperture) setAperture(analysis.aperture.replace(/^f\//i, ''));
      if (analysis.iso) setIso(String(analysis.iso));
      if (analysis.focalLength) setFocalLength(analysis.focalLength.replace(/mm/i, '').trim());
      if (analysis.artist) setArtist(analysis.artist);
      if (analysis.copyright) setCopyright(analysis.copyright);
      if (analysis.software) setSoftware(analysis.software);
      if (analysis.dateTaken) {
        setDateTaken(analysis.dateTaken);
        setModifyDate(analysis.dateTaken);
      }
    }
    setActiveTab('camera');
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
      modifyDate,
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
        modifyDate,
        dpi,
      };
      onProcessBatch(data);
    }
  };

  return (
    <div className="space-y-4 overflow-y-visible">
      {/* Modern 5-Segment Control (Includes Inspect / Viewer Tab) */}
      <div className="grid grid-cols-5 p-1 bg-slate-100/90 dark:bg-dark-950/80 rounded-xl border border-slate-200/80 dark:border-dark-700/60 text-[11px] font-semibold shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('inspect')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'inspect'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={tr('tabInspect', 'Lihat Info')}
        >
          <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
          <span className="truncate">{tr('tabInspect', 'Info')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('camera')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'camera'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={tr('tabCamera', 'Kamera')}
        >
          <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
          <span className="truncate">{tr('tabCamera', 'Camera')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('exposure')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'exposure'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={tr('tabExposure', 'Eksposur')}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
          <span className="truncate">{tr('tabExposure', 'Exposure')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rights')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'rights'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={tr('tabAuthor', 'Kreator')}
        >
          <User className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
          <span className="truncate">{tr('tabAuthor', 'Creator')}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
            activeTab === 'specs'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={tr('tabSpecs', 'Waktu & DPI')}
        >
          <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
          <span className="truncate">{tr('tabSpecs', 'Date & DPI')}</span>
        </button>
      </div>

      {/* FORM & INSPECTOR CONTAINER */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/80 dark:border-dark-700/60 space-y-4 shadow-2xs">
        
        {/* TAB 0: ORIGINAL METADATA INSPECTOR */}
        {activeTab === 'inspect' && (
          <div className="space-y-3.5">
            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                <Loader2 className="w-6 h-6 text-neon-cyan animate-spin" />
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {tr('scanning', 'Scanning image headers & EXIF...')}
                </span>
              </div>
            ) : analysis ? (
              <div className="space-y-3 text-xs">
                {/* Header Summary */}
                <div className="p-3 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/80 dark:border-dark-700/60 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-dark-700/70 pb-2">
                    <span className="font-mono font-bold tracking-wider text-[11px] uppercase text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                      <span>{tr('inspectTitle', 'ORIGINAL IMAGE METADATA')}</span>
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-neon-cyan border border-cyan-500/20 uppercase">
                      {analysis.format}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {tr('inspectSubtitle', 'Informasi EXIF & C2PA yang terdeteksi pada file gambar ini')}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                      analysis.hasC2PA
                        ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {analysis.hasC2PA ? 'C2PA Manifest Detected' : 'C2PA Free'}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold uppercase ${
                      analysis.hasExif
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        : 'bg-slate-200/70 dark:bg-dark-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {analysis.hasExif ? 'EXIF Active' : 'No EXIF'}
                    </span>
                    {currentItem?.file && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-dark-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-dark-600">
                        {(currentItem.file.size / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </div>
                </div>

                {/* Data Fields */}
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/80 dark:border-dark-700/60 shadow-2xs space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Camera className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                      <span>{tr('fieldCamera', 'Kamera & Lensa')}</span>
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {analysis.cameraModel || analysis.cameraMake
                        ? `${analysis.cameraMake || ''} ${analysis.cameraModel || ''}`.trim()
                        : '-'}
                    </div>
                    {analysis.lensModel && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {analysis.lensModel}
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/80 dark:border-dark-700/60 shadow-2xs space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                      <span>{tr('fieldExposure', 'Parameter Eksposur')}</span>
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200 flex flex-wrap gap-x-3 gap-y-1">
                      <span>{analysis.shutterSpeed || 'Shutter: -'}</span>
                      <span>{analysis.aperture || 'Aperture: -'}</span>
                      <span>{analysis.iso ? `ISO ${analysis.iso}` : 'ISO: -'}</span>
                      <span>{analysis.focalLength || 'Focal: -'}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/80 dark:border-dark-700/60 shadow-2xs space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <User className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                      <span>{tr('fieldAuthor', 'Kreator & Hak Cipta')}</span>
                    </div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">
                      {analysis.artist || '-'}
                    </div>
                    {analysis.copyright && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {analysis.copyright}
                      </div>
                    )}
                    {analysis.software && (
                      <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                        Software: {analysis.software}
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-dark-800/80 border border-slate-200/80 dark:border-dark-700/60 shadow-2xs space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                      <span>{tr('fieldDateCreated', 'Waktu Pengambilan')}</span>
                    </div>
                    <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {analysis.dateTaken || '-'}
                    </div>
                    {analysis.dateTaken && (
                      <div className="text-[10px] text-cyan-700 dark:text-neon-cyan">
                        {formatLocalizedDate(analysis.dateTaken, lang)}
                      </div>
                    )}
                  </div>
                </div>


              </div>
            ) : (
              <div className="text-center py-6 text-xs text-slate-500 dark:text-slate-400 font-medium space-y-2">
                <p>{tr('noExifInImage', 'Tidak ada metadata EXIF kamera yang tertanam di foto ini.')}</p>
                <button
                  type="button"
                  onClick={() => setActiveTab('camera')}
                  className="text-cyan-600 dark:text-neon-cyan hover:underline font-bold"
                >
                  {tr('startEditingHint', 'Mulai Mengisi Metadata')}
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: CAMERA & HARDWARE */}
        {activeTab === 'camera' && (
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('lblCameraMake', 'Camera Make / Manufacturer')}</span>
              </label>
              <input
                type="text"
                value={cameraMake}
                onChange={(e) => setCameraMake(e.target.value)}
                placeholder="e.g. Canon, Sony, Nikon, Apple (kosongkan jika desain)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('lblCameraModel', 'Camera Model')}</span>
              </label>
              <input
                type="text"
                value={cameraModel}
                onChange={(e) => setCameraModel(e.target.value)}
                placeholder="e.g. Canon EOS 5D Mark IV, iPhone 16 Pro (kosongkan jika desain)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('lblLensModel', 'Lens Specification & Model')}</span>
              </label>
              <input
                type="text"
                value={lensModel}
                onChange={(e) => setLensModel(e.target.value)}
                placeholder="e.g. EF85mm f/1.4L, FE 50mm F1.2 (kosongkan jika desain)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* TAB 2: EXPOSURE & OPTICS */}
        {activeTab === 'exposure' && (
          <div className="space-y-3.5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  <span>{tr('lblShutter', 'Shutter Speed (s)')}</span>
                </label>
                <input
                  type="text"
                  value={shutterSpeed}
                  onChange={(e) => setShutterSpeed(e.target.value)}
                  placeholder="e.g. 1/160, 1/200, 1/50"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  <span>{tr('lblAperture', 'Aperture (f-stop)')}</span>
                </label>
                <input
                  type="text"
                  value={aperture}
                  onChange={(e) => setAperture(e.target.value)}
                  placeholder="e.g. 2.8, 5.6, 1.4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  <span>{tr('lblIso', 'ISO Sensitivity')}</span>
                </label>
                <input
                  type="text"
                  value={iso}
                  onChange={(e) => setIso(e.target.value)}
                  placeholder="e.g. 100, 200, 400, 800"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  <span>{tr('lblFocal', 'Focal Length (mm)')}</span>
                </label>
                <input
                  type="text"
                  value={focalLength}
                  onChange={(e) => setFocalLength(e.target.value)}
                  placeholder="e.g. 85, 50, 35, 24"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('lblFlash', 'Flash Strobe Mode')}</span>
              </label>
              <select
                value={flash}
                onChange={(e) => setFlash(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs cursor-pointer"
              >
                <option value="fired">{tr('flashFired', 'Fired (Studio Strobe Sync)')}</option>
                <option value="off">{tr('flashOff', 'Did Not Fire (Ambient Light)')}</option>
                <option value="auto">{tr('flashAuto', 'Auto Mode')}</option>
              </select>
            </div>
          </div>
        )}

        {/* TAB 3: AUTHOR & RIGHTS / SOFTWARE */}
        {activeTab === 'rights' && (
          <div className="space-y-3.5">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('photographerLabel', 'Creator / Designer / Photographer (Artist)')}</span>
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="e.g. John Doe, Graphic Designer, Creative Studio"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('lblSoftware', 'Software / Design Application / Engine')}</span>
              </label>
              <input
                type="text"
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                placeholder="e.g. Adobe Photoshop 2026, Figma, Canva, Illustrator, Lightroom"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('lblDescription', 'Title / Description / Project Name')}</span>
              </label>
              <input
                type="text"
                value={imageDescription}
                onChange={(e) => setImageDescription(e.target.value)}
                placeholder="e.g. Poster Kampanye, Mockup Desain, Portrait Photo"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('copyrightLabel', 'Copyright Notice')}</span>
              </label>
              <input
                type="text"
                value={copyright}
                onChange={(e) => setCopyright(e.target.value)}
                placeholder="e.g. Copyright (c) 2026. All Rights Reserved."
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
            </div>
          </div>
        )}

        {/* TAB 4: DATE & SPECS (MODERN CALENDAR & TIME PICKER) */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            {/* Creation / Original Date */}
            {/* Creation / Original Date */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('dateLabel', 'Creation Date & Time (Tanggal Dibuat)')}</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                    <span>{tr('lblDate', 'Tanggal (YYYY:MM:DD)')}</span>
                  </div>
                  <input
                    type="text"
                    value={getDatePart(dateTaken)}
                    onChange={(e) => setDateTaken(combineDateTime(e.target.value, getTimePart(dateTaken)))}
                    placeholder="2026:10:16"
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                    <span>{tr('lblTime', 'Jam (HH:MM:SS)')}</span>
                  </div>
                  <input
                    type="text"
                    value={getTimePart(dateTaken)}
                    onChange={(e) => setDateTaken(combineDateTime(getDatePart(dateTaken), e.target.value))}
                    placeholder="12:00:00"
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {/* Localized Human-Readable Date Display */}
              {dateTaken && formatLocalizedDate(dateTaken, lang) && (
                <div className="p-2 rounded-lg bg-cyan-500/5 dark:bg-neon-cyan/5 border border-cyan-500/15 text-[11px] text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5 font-medium">
                  <Check className="w-3 h-3 text-cyan-600 dark:text-neon-cyan shrink-0" />
                  <span className="truncate">{formatLocalizedDate(dateTaken, lang)}</span>
                </div>
              )}
            </div>

            {/* Export / Modification Date */}
            <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-dark-700/60">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('exportDateLabel', 'Export / Modification Date (Tanggal Ekspor)')}</span>
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                    <span>{tr('lblDate', 'Tanggal (YYYY:MM:DD)')}</span>
                  </div>
                  <input
                    type="text"
                    value={getDatePart(modifyDate)}
                    onChange={(e) => setModifyDate(combineDateTime(e.target.value, getTimePart(modifyDate)))}
                    placeholder="YYYY:MM:DD (Opsional)"
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-600 dark:text-neon-cyan" />
                    <span>{tr('lblTime', 'Jam (HH:MM:SS)')}</span>
                  </div>
                  <input
                    type="text"
                    value={getTimePart(modifyDate)}
                    onChange={(e) => setModifyDate(combineDateTime(getDatePart(modifyDate), e.target.value))}
                    placeholder="HH:MM:SS (Opsional)"
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              {modifyDate && formatLocalizedDate(modifyDate, lang) && (
                <div className="p-2 rounded-lg bg-cyan-500/5 dark:bg-neon-cyan/5 border border-cyan-500/15 text-[11px] text-cyan-800 dark:text-cyan-300 flex items-center gap-1.5 font-medium">
                  <Check className="w-3 h-3 text-cyan-600 dark:text-neon-cyan shrink-0" />
                  <span className="truncate">{formatLocalizedDate(modifyDate, lang)}</span>
                </div>
              )}
            </div>

            {/* DPI Resolution */}
            <div className="pt-2 border-t border-slate-200/60 dark:border-dark-700/60">
              <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                <span>{tr('lblDpi', 'Resolution / DPI (Print Standard)')}</span>
              </label>
              <select
                value={dpi}
                onChange={(e) => setDpi(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs font-mono cursor-pointer"
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
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo hover:opacity-95 text-dark-900 font-extrabold shadow-glow-cyan transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 text-sm tracking-wide cursor-pointer disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin shrink-0" />
              <span>{tr('processing', 'Applying Custom EXIF Metadata...')}</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4 shrink-0" />
              <span>{tr('btnApplyManual', 'Apply & Save Custom EXIF')}</span>
            </>
          )}
        </button>

        {batchCount > 1 && onProcessBatch && (
          <button
            type="button"
            onClick={handleApplyBatch}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-xl bg-white dark:bg-dark-800 hover:bg-slate-100 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-dark-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan shrink-0" />
            <span>
              {t('work.processBatchCount', {
                count: batchCount,
                defaultValue: `Apply to All ${batchCount} Photos`,
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
