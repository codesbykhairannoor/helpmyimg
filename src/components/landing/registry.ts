// src/components/landing/registry.ts
// STRICT COMPONENT REGISTRY
// Memetakan setiap alat ke komponen pendaratan spesifiknya.

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
import { BrushSections } from './tools/BrushSections';
import { Compress100kbSections } from './tools/Compress100kbSections';
import { Compress50kbSections } from './tools/Compress50kbSections';
import { ResizeIgSections } from './tools/ResizeIgSections';
import { RemoveLogoSections } from './tools/RemoveLogoSections';
import { ColorWhiteSections } from './tools/ColorWhiteSections';
import { Compress200kbSections } from './tools/Compress200kbSections';
import { ResizePassportSections } from './tools/ResizePassportSections';

import { RemovePersonSections } from './tools/RemovePersonSections';
import { ConvertWebpSections } from './tools/ConvertWebpSections';
import { WatermarkBulkSections } from './tools/WatermarkBulkSections';
import { BlurPlateSections } from './tools/BlurPlateSections';

export const SECTION_REGISTRY: Record<string, React.FC> = {
  'remove': RemoveBgSections,
  'compress': CompressSections,
  'color': ColorBgSections,
  'resize': ResizeSections,
  'crop': CropSections,
  'design': DesignSections,
  'rotate': RotateSections,
  'picker': PickerSections,
  'watermark': WatermarkSections,
  'blurface': BlurFaceSections,
  'convert': ConvertSections,
  'brush': BrushSections,
  'compress100kb': Compress100kbSections,
  'compress50kb': Compress50kbSections,
  'resizeig': ResizeIgSections,
  'removelogo': RemoveLogoSections,
  'colorwhite': ColorWhiteSections,
  'compress200kb': Compress200kbSections,
  'resizepassport': ResizePassportSections,
  'removeperson': RemovePersonSections,
  'convertwebp': ConvertWebpSections,
  'watermarkbulk': WatermarkBulkSections,
  'blurplate': BlurPlateSections,
};
