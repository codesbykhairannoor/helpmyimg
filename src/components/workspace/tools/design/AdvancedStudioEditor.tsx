// src/components/workspace/tools/design/AdvancedStudioEditor.tsx
// Studio Editor Gambar Tingkat Lanjut: WebGL GPU Shader, Canvas Layering, dan Desain Studio Profesional

import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { useStudioState } from './useStudioState';
import { StudioTopBar } from './components/StudioTopBar';
import { StudioSidebar } from './components/StudioSidebar';
import { StudioCanvas } from './components/StudioCanvas';
import { StudioExportModal } from './components/StudioExportModal';
import { ExportCompositor, type ExportOptions } from './exportCompositor';

interface AdvancedStudioEditorProps {
  imageUrl: string;
  fileName?: string;
  onClose: () => void;
  onSave?: (dataUrl: string) => void;
}

export const AdvancedStudioEditor: React.FC<AdvancedStudioEditorProps> = ({
  imageUrl,
  fileName = 'image.jpg',
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();

  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const state = useStudioState();

  // 1. Muat Elemen Gambar Asli
  useEffect(() => {
    if (!imageUrl) return;
    setIsLoadingImage(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setSourceImage(img);
      setImageDimensions({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
      setIsLoadingImage(false);
    };
    img.onerror = () => {
      setIsLoadingImage(false);
      console.error('[AdvancedStudioEditor] Gagal memuat gambar:', imageUrl);
    };
    img.src = imageUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  // 2. Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          state.redo();
        } else {
          state.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        state.redo();
      } else if (e.key === 'Escape') {
        if (isExportModalOpen) {
          setIsExportModalOpen(false);
        } else if (state.selectedTextId) {
          state.setSelectedTextId(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, isExportModalOpen]);

  // 3. Eksekusi Ekspor Resolusi Penuh
  const handleConfirmExport = async (options: ExportOptions) => {
    if (!sourceImage) return;
    try {
      setIsExporting(true);
      const result = await ExportCompositor.renderFullResolution(
        sourceImage,
        state.adjustments,
        state.transform,
        state.textLayers,
        state.brushStrokes,
        options
      );

      // Trigger download di browser
      const link = document.createElement('a');
      link.href = result.dataUrl;
      const baseName = fileName.replace(/\.[^/.]+$/, '') || 'HelpMyIMG_Edit';
      const ext = options.format === 'jpeg' ? 'jpg' : options.format;
      link.download = `${baseName}_studio.${ext}`;
      link.click();

      onSave?.(result.dataUrl);
      setIsExportModalOpen(false);
    } catch (err) {
      console.error('[AdvancedStudioEditor] Gagal mengekspor foto:', err);
      alert(t('studio.export.error', { defaultValue: 'Gagal mengekspor gambar. Silakan coba lagi.' }));
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoadingImage) {
    return (
      <div className="w-full h-[70vh] flex flex-col items-center justify-center gap-3 bg-[#090d16] rounded-2xl border border-slate-800">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        <span className="text-xs font-semibold text-slate-400">
          {t('studio.loading', { defaultValue: 'Mempersiapkan Studio WebGL 60 FPS...' })}
        </span>
      </div>
    );
  }

  return (
    <div className="w-full h-screen max-h-[92vh] sm:max-h-[94vh] flex flex-col bg-[#090d16] rounded-2xl border border-slate-800/90 shadow-2xl overflow-hidden relative">
      {/* 1. Header Toolbar */}
      <StudioTopBar
        fileName={fileName}
        imageDimensions={imageDimensions}
        zoom={state.zoom}
        onZoomIn={state.zoomIn}
        onZoomOut={state.zoomOut}
        onResetZoom={state.resetZoom}
        canUndo={state.canUndo}
        canRedo={state.canRedo}
        onUndo={state.undo}
        onRedo={state.redo}
        onResetAll={state.resetAll}
        isComparing={state.isComparing}
        onToggleCompare={() => state.setIsComparing(!state.isComparing)}
        onOpenExport={() => setIsExportModalOpen(true)}
        onClose={onClose}
      />

      {/* 2. Body: Viewport Kanvas Kiri/Tengah + Sidebar Inspector Kanan */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden relative">
        {/* Kanvas Interaktif */}
        <StudioCanvas
          sourceImage={sourceImage}
          adjustments={state.adjustments}
          transform={state.transform}
          activeTab={state.activeTab}
          textLayers={state.textLayers}
          selectedTextId={state.selectedTextId}
          onSelectTextId={state.setSelectedTextId}
          onUpdateTextLayer={state.updateTextLayer}
          brushStrokes={state.brushStrokes}
          onAddBrushStroke={state.addBrushStroke}
          brushColor={state.brushColor}
          brushSize={state.brushSize}
          brushOpacity={state.brushOpacity}
          zoom={state.zoom}
          pan={state.pan}
          onPanChange={state.setPan}
          isComparing={state.isComparing}
        />

        {/* Sidebar Inspector Alat */}
        <StudioSidebar
          activeTab={state.activeTab}
          onSelectTab={state.setActiveTab}
          adjustments={state.adjustments}
          onUpdateAdjustment={state.updateAdjustment}
          onApplyPreset={state.applyPreset}
          transform={state.transform}
          onRotateCW={state.rotateCW}
          onRotateCCW={state.rotateCCW}
          onToggleFlipH={state.toggleFlipH}
          onToggleFlipV={state.toggleFlipV}
          onSetCropAspect={state.setCropAspect}
          onResetCrop={state.resetCrop}
          textLayers={state.textLayers}
          selectedTextId={state.selectedTextId}
          onSelectTextId={state.setSelectedTextId}
          onAddTextLayer={state.addTextLayer}
          onUpdateTextLayer={state.updateTextLayer}
          onRemoveTextLayer={state.removeTextLayer}
          brushColor={state.brushColor}
          onSetBrushColor={state.setBrushColor}
          brushSize={state.brushSize}
          onSetBrushSize={state.setBrushSize}
          brushOpacity={state.brushOpacity}
          onSetBrushOpacity={state.setBrushOpacity}
          onClearBrushStrokes={state.clearBrushStrokes}
        />
      </div>

      {/* 3. Modal Ekspor Resolusi Tinggi */}
      <StudioExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        originalDimensions={imageDimensions}
        onConfirmExport={handleConfirmExport}
        isExporting={isExporting}
      />
    </div>
  );
};
