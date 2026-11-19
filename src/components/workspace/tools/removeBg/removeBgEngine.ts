// src/components/workspace/tools/removeBg/removeBgEngine.ts
// Engine dedicated to Background Removal: AI Neural Worker (Standard RMBG-1.4 / PRO BiRefNet WebGPU) + Precision Vector Color-Key

import { aiService } from '../../../../services/aiService';
import type { AiModelTier } from '../../../../workers/aiWorker';
import type { CutoutMode } from '../../types';

export interface RemoveBgOptions {
  mode?: CutoutMode;
  modelTier?: AiModelTier;
  colorTolerance?: number;
  onProgress?: (step: string, progress: number) => void;
}

export interface ProcessResult {
  blob: Blob;
  url: string;
}

export class RemoveBgEngine {
  /**
   * Remove background using either Neural AI (Photo mode: RMBG-1.4 or BiRefNet WebGPU) or Vector Color-Key (Logo mode)
   */
  public static async process(
    file: File | Blob,
    options: RemoveBgOptions = {}
  ): Promise<ProcessResult> {
    const { mode = 'photo', modelTier = 'standard', colorTolerance = 45, onProgress } = options;

    const blob = await aiService.removeBackgroundAsync(
      file,
      'rmbg',
      80,
      onProgress,
      mode,
      colorTolerance,
      modelTier
    );

    const url = URL.createObjectURL(blob);
    return { blob, url };
  }
}
