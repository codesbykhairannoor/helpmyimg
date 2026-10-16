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
  Info,
  Clock,
  Layers,
  Zap,
  Tag,
  Shield,
  FileText
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
  onUploadOther,
  onReset,
  isProcessing,
  batchCount = 1,
}) => {
  const { t } = useTranslation();
  const tr = (key: string, def: string) => t(`editexif.${key}`, { defaultValue: def });

  const [, setAnalysis] = useState<MetadataAnalysis | null>(null);
  const [, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<'camera' | 'exposure' | 'rights' | 'specs'>('camera');

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

  const getNowFormatted = () => {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}:${pad(now.getMonth() + 1)}:${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
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
      {/* Modern Segmented Control */}
      <div className="grid grid-cols-4 p-1 bg-slate-100/90 dark:bg-dark-950/80 rounded-xl border border-slate-200/80 dark:border-dark-700/60 text-xs font-semibold shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('camera')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
            activeTab === 'camera'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {tr('tabCamera', 'Camera')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('exposure')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
            activeTab === 'exposure'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {tr('tabExposure', 'Exposure')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('rights')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
            activeTab === 'rights'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {tr('tabAuthor', 'Creator')}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('specs')}
          className={`py-2 px-1 text-center rounded-lg transition-all cursor-pointer ${
            activeTab === 'specs'
              ? 'bg-white dark:bg-dark-800 text-slate-900 dark:text-white font-bold shadow-sm border border-slate-200/70 dark:border-dark-600'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {tr('tabSpecs', 'Date & DPI')}
        </button>
      </div>

      {/* FORM INPUTS ACCORDING TO ACTIVE TAB */}
      <div className="p-4 rounded-2xl bg-slate-50/70 dark:bg-dark-900/60 border border-slate-200/80 dark:border-dark-700/60 space-y-4 shadow-2xs">
        {/* TAB 1: CAMERA & HARDWARE */}
        {activeTab === 'camera' && (
          <div className="space-y-3.5">
            <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/25 text-[11px] text-cyan-900 dark:text-cyan-200 flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-cyan-600 dark:text-neon-cyan shrink-0 mt-0.5" />
              <span>{tr('cameraHint', 'Opsional: Isi untuk foto kamera (DSLR/HP). Biarkan kosong jika file merupakan desain grafis (Photoshop/Canva).')}</span>
            </div>

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
            <div className="p-3 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/25 text-[11px] text-cyan-900 dark:text-cyan-200 flex items-start gap-2.5 leading-relaxed">
              <Info className="w-4 h-4 text-cyan-600 dark:text-neon-cyan shrink-0 mt-0.5" />
              <span>{tr('exposureHint', 'Opsional: Parameter ISO, shutter, dan aperture kamera. Kosongkan jika mengedit file gambar desain.')}</span>
            </div>

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

        {/* TAB 4: DATE & SPECS */}
        {activeTab === 'specs' && (
          <div className="space-y-4">
            {/* Creation / Original Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  <span>{tr('dateLabel', 'Creation Date & Time (Tanggal Dibuat)')}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDateTaken(getNowFormatted())}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-neon-cyan hover:bg-cyan-500/20 transition-colors cursor-pointer"
                  >
                    {tr('setNow', 'Set to Now')}
                  </button>
                  {dateTaken && (
                    <button
                      type="button"
                      onClick={() => setDateTaken('')}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      {tr('clearDate', 'Clear')}
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={dateTaken}
                onChange={(e) => setDateTaken(e.target.value)}
                placeholder="YYYY:MM:DD HH:MM:SS (contoh: 2026:10:15 14:35:00)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                {tr('creationDateSub', 'Tanggal pengambilan foto kamera atau waktu desain dibuat')}
              </span>
            </div>

            {/* Export / Modification Date */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-600 dark:text-neon-cyan" />
                  <span>{tr('exportDateLabel', 'Export / Modification Date (Tanggal Ekspor)')}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setModifyDate(getNowFormatted())}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-700 dark:text-neon-cyan hover:bg-cyan-500/20 transition-colors cursor-pointer"
                  >
                    {tr('setNow', 'Set to Now')}
                  </button>
                  {modifyDate && (
                    <button
                      type="button"
                      onClick={() => setModifyDate('')}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      {tr('clearDate', 'Clear')}
                    </button>
                  )}
                </div>
              </div>
              <input
                type="text"
                value={modifyDate}
                onChange={(e) => setModifyDate(e.target.value)}
                placeholder="YYYY:MM:DD HH:MM:SS (Kosongkan jika sama dengan tanggal dibuat)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-dark-950/90 border border-slate-200 dark:border-dark-700 text-slate-900 dark:text-slate-100 text-xs font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#05DAED] focus:ring-2 focus:ring-[#05DAED]/20 transition-all shadow-2xs"
              />
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                {tr('exportDateSub', 'Waktu ekspor dari Photoshop/Canva/Figma atau penyimpanan file')}
              </span>
            </div>

            {/* DPI Resolution */}
            <div>
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
