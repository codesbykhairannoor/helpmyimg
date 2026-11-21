// src/components/landing/LandingSections.tsx
// Lazy-loaded tool landing sections so the homepage and unrelated routes stay tiny and fast

import React, { Suspense, lazy } from 'react';

interface LandingSectionsProps {
  tool: 'remove' | 'color' | 'watermark' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker' | 'design' | 'blurface' | 'brush' | 'metadata' | 'editexif' | 'compress100kb' | 'compress50kb' | 'resizeig' | 'removelogo' | 'colorwhite' | 'compress200kb' | 'resizepassport' | 'removeperson' | 'convertwebp' | 'watermarkbulk' | 'blurplate';
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
  'compress100kb': lazy(() => import('./tools/Compress100kbSections').then(m => ({ default: m.Compress100kbSections }))),
  'compress50kb': lazy(() => import('./tools/Compress50kbSections').then(m => ({ default: m.Compress50kbSections }))),
  'resizeig': lazy(() => import('./tools/ResizeIgSections').then(m => ({ default: m.ResizeIgSections }))),
  'removelogo': lazy(() => import('./tools/RemoveLogoSections').then(m => ({ default: m.RemoveLogoSections }))),
  'colorwhite': lazy(() => import('./tools/ColorWhiteSections').then(m => ({ default: m.ColorWhiteSections }))),
  'compress200kb': lazy(() => import('./tools/Compress200kbSections').then(m => ({ default: m.Compress200kbSections }))),
  'resizepassport': lazy(() => import('./tools/ResizePassportSections').then(m => ({ default: m.ResizePassportSections }))),
  'removeperson': lazy(() => import('./tools/RemovePersonSections').then(m => ({ default: m.RemovePersonSections }))),
  'convertwebp': lazy(() => import('./tools/ConvertWebpSections').then(m => ({ default: m.ConvertWebpSections }))),
  'watermarkbulk': lazy(() => import('./tools/WatermarkBulkSections').then(m => ({ default: m.WatermarkBulkSections }))),
  'blurplate': lazy(() => import('./tools/BlurPlateSections').then(m => ({ default: m.BlurPlateSections }))),
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
