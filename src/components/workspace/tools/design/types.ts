// src/components/workspace/tools/design/types.ts
// TypeScript interfaces untuk Advanced Studio Image Editor

export type StudioTab = 'adjust' | 'presets' | 'enhance' | 'transform' | 'text' | 'brush';

export type StudioPresetId =
  | 'normal'
  | 'vivid'
  | 'warm'
  | 'cool'
  | 'noir'
  | 'vintage'
  | 'cyberpunk'
  | 'dramatic'
  | 'fade'
  | 'sunset'
  | 'emerald'
  | 'mono';

export interface StudioAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  exposure: number; // -100 to 100
  saturation: number; // -100 to 100
  vibrance: number; // -100 to 100
  temperature: number; // -100 to 100 (warm / cool)
  tint: number; // -100 to 100 (green / magenta)
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  sharpen: number; // 0 to 100
  vignette: number; // 0 to 100
  blur: number; // 0 to 100
  preset: StudioPresetId;
}

export interface StudioTransform {
  rotation: number; // 0, 90, 180, 270
  flipH: boolean;
  flipV: boolean;
  cropAspect: 'free' | '1:1' | '4:5' | '16:9' | '9:16' | '4:3' | '3:2';
  cropRect: { x: number; y: number; width: number; height: number } | null;
}

export interface StudioTextLayer {
  id: string;
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  fontSize: number; // px at original scale
  fontFamily: string;
  color: string;
  bgColor: string | 'transparent';
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
}

export interface StudioBrushStroke {
  color: string;
  size: number;
  opacity: number;
  points: { x: number; y: number }[]; // coordinates relative to image width/height (0-1)
}

export interface StudioHistoryEntry {
  adjustments: StudioAdjustments;
  transform: StudioTransform;
  textLayers: StudioTextLayer[];
  brushStrokes: StudioBrushStroke[];
}

export interface StudioPresetConfig {
  id: StudioPresetId;
  titleKey: string;
  defaultTitle: string;
  descriptionKey: string;
  defaultDesc: string;
  badge?: string;
  colorPreview: string; // CSS gradient for preview icon
  adjustments: Partial<StudioAdjustments>;
}

export const DEFAULT_ADJUSTMENTS: StudioAdjustments = {
  brightness: 0,
  contrast: 0,
  exposure: 0,
  saturation: 0,
  vibrance: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  sharpen: 0,
  vignette: 0,
  blur: 0,
  preset: 'normal',
};

export const DEFAULT_TRANSFORM: StudioTransform = {
  rotation: 0,
  flipH: false,
  flipV: false,
  cropAspect: 'free',
  cropRect: null,
};
