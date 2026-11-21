// src/components/landing/LandingSections.tsx
// Lazy-loaded tool landing sections so the homepage and unrelated routes stay tiny and fast

import React, { Suspense, lazy } from 'react';

interface LandingSectionsProps {
  tool: 'remove' | 'color' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker' | 'design' | 'blurface' | 'brush' | 'metadata' | 'editexif';
}

const LAZY_SECTION_REGISTRY: Record<string, React.LazyExoticComponent<React.FC>> = {
  'remove': lazy(() => import('./tools/RemoveBgSections').then(m => ({ default: m.RemoveBgSections }))),
  'compress': lazy(() => import('./tools/CompressSections').then(m => ({ default: m.CompressSections }))),
  'color': lazy(() => import('./tools/ColorBgSections').then(m => ({ default: m.ColorBgSections }))),
  'resize': lazy(() => import('./tools/ResizeSections').then(m => ({ default: m.ResizeSections }))),
  'crop': lazy(() => import('./tools/CropSections').then(m => ({ default: m.CropSections }))),
  'design': lazy(() => import('./tools/DesignSections').then(m => ({ default: m.DesignSections }))),
  'rotate': lazy(() => import('./tools/RotateSections').then(m => ({ default: m.RotateSections }))),
  'picker': lazy(() => import('./tools/PickerSections').then(m => ({ default: m.PickerSections }))),
  'watermark': lazy(() => import('./tools/WatermarkSections').then(m => ({ default: m.WatermarkSections }))),
  'blurface': lazy(() => import('./tools/BlurFaceSections').then(m => ({ default: m.BlurFaceSections }))),
  'convert': lazy(() => import('./tools/ConvertSections').then(m => ({ default: m.ConvertSections }))),
  'brush': lazy(() => import('./tools/BrushSections').then(m => ({ default: m.BrushSections }))),
  'metadata': lazy(() => import('./tools/MetadataSections').then(m => ({ default: m.MetadataSections }))),
  'editexif': lazy(() => import('./tools/EditExifSections').then(m => ({ default: m.EditExifSections }))),
};

export const LandingSections: React.FC<LandingSectionsProps> = ({ tool }) => {
  const Component = LAZY_SECTION_REGISTRY[tool];

  if (Component) {
    return (
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    );
  }

  return null;
};
