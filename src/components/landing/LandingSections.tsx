// src/components/landing/LandingSections.tsx
// Bagian-bagian lengkap di bawah Tool Workspace untuk dominasi SEO, GEO, & 30 Bahasa Dunia
// Dirancang dengan estetika modern Apple-style, glassmorphism, dan informasi keunggulan mutlak
// 100% Terintegrasi dengan sistem i18n 30 Bahasa (Tanpa teks statis)

import React from 'react';
import { RemoveBgSections } from './tools/RemoveBgSections';
import { CompressSections } from './tools/CompressSections';
import { ColorBgSections } from './tools/ColorBgSections';
import { ResizeSections } from './tools/ResizeSections';
import { CropSections } from './tools/CropSections';
import { DesignSections } from './tools/DesignSections';
import { RotateSections } from './tools/RotateSections';
import { PickerSections } from './tools/PickerSections';
import { WatermarkSections } from './tools/WatermarkSections';
import { BlurFaceSections } from './tools/BlurFaceSections';
import { ConvertSections } from './tools/ConvertSections';

interface LandingSectionsProps {
  tool: 'remove' | 'color' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker' | 'design' | 'blurface';
}

export const LandingSections: React.FC<LandingSectionsProps> = ({ tool }) => {

  if (tool === 'remove') {
    return <RemoveBgSections />;
  }
  if (tool === 'compress') {
    return <CompressSections />;
  }
  if (tool === 'color') {
    return <ColorBgSections />;
  }
  if (tool === 'resize') {
    return <ResizeSections />;
  }
  if (tool === 'crop') {
    return <CropSections />;
  }
  if (tool === 'design') {
    return <DesignSections />;
  }
  if (tool === 'rotate') {
    return <RotateSections />;
  }
  if (tool === 'picker') {
    return <PickerSections />;
  }
  if (tool === 'watermark') {
    return <WatermarkSections />;
  }
  if (tool === 'blurface') {
    return <BlurFaceSections />;
  }
  if (tool === 'convert') {
    return <ConvertSections />;
  }

  // STRICT REGISTRY: Jika tidak ada desain unik untuk alat tersebut, 
  // jangan muat templat generik. Paksa ketiadaan layout agar terdeteksi.
  console.warn(`[LandingSections] Komponen layout khusus untuk tool "${tool}" belum dibuat.`);
  return null;
};
