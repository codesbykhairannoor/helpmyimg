// src/components/landing/LandingSections.tsx
// Bagian-bagian lengkap di bawah Tool Workspace untuk dominasi SEO, GEO, & 30 Bahasa Dunia
// Dirancang dengan estetika modern Apple-style, glassmorphism, dan informasi keunggulan mutlak
// 100% Terintegrasi dengan sistem i18n 30 Bahasa (Tanpa teks statis)

import React from 'react';
import { SECTION_REGISTRY } from './registry';

interface LandingSectionsProps {
  tool: 'remove' | 'color' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker' | 'design' | 'blurface' | 'brush';
}

export const LandingSections: React.FC<LandingSectionsProps> = ({ tool }) => {
  const Component = SECTION_REGISTRY[tool];

  if (Component) {
    return <Component />;
  }

  // STRICT REGISTRY: Jika tidak ada desain unik untuk alat tersebut, 
  // jangan muat templat generik. Paksa ketiadaan layout agar terdeteksi.
  console.warn(`[LandingSections] Komponen layout khusus untuk tool "${tool}" belum dibuat.`);
  return null;
};
