// src/components/workspace/types.ts
// Shared Types & Interfaces for HelpMyIMG Workspace

import type { ColorInfo } from '../../utils/colorUtils';
import type { WatermarkPosition } from './tools/WatermarkControl';
import type { BlurBox } from './tools/BlurFaceControl';
import type { BgMode, PresetScene, GradientOption } from './tools/ColorBgControl';

export type { ColorInfo, WatermarkPosition, BlurBox, BgMode, PresetScene, GradientOption };

export type TabType = 
  | 'remove' 
  | 'color' 
  | 'colorwhite' 
  | 'removelogo' 
  | 'removeperson' 
  | 'brush' 
  | 'watermark' 
  | 'watermarkbulk' 
  | 'compress' 
  | 'compress100kb' 
  | 'compress50kb' 
  | 'compress200kb' 
  | 'convert' 
  | 'convertwebp' 
  | 'resize' 
  | 'resizeig' 
  | 'resizepassport' 
  | 'crop' 
  | 'rotate' 
  | 'picker' 
  | 'blurface' 
  | 'blurplate' 
  | 'design';

export type CutoutMode = 'photo' | 'logo';

export interface BatchItem {
  id: string;
  name: string;
  file: Blob;
  originalUrl: string;
  transparentUrl: string | null;
  processedUrl: string | null;
  compressBlob?: Blob;
  compressUrl?: string;
  compressSourceSize?: number;
  modelType: 'rmbg' | 'isnet';
  status: 'idle' | 'queued' | 'processing' | 'done' | 'error';
  progress: number;
  progressStep: string;
  errorMessage?: string;
  rotateBaseUrl?: string;
  rotateBaseFile?: Blob;
  initialFile?: Blob;
  initialOriginalUrl?: string;
  initialDimensions?: { width: number; height: number };
}

export interface ToolWorkspaceProps {
  initialTab?: TabType | string;
}
