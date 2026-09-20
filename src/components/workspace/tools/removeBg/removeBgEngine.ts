// src/components/workspace/tools/removeBg/removeBgEngine.ts
// Engine dedicated to Background Removal: AI Neural Worker + Precision Vector Color-Key

import { aiService } from '../../../../services/aiService';
import type { CutoutMode } from '../../types';

export interface RemoveBgOptions {
  mode?: CutoutMode;
  colorTolerance?: number;
  onProgress?: (step: string, progress: number) => void;
}

export interface ProcessResult {
  blob: Blob;
  url: string;
}

export class RemoveBgEngine {
  /**
   * Remove background using either Neural AI (Photo mode) or Vector Color-Key (Logo mode)
   */
  public static async process(
    file: File | Blob,
    options: RemoveBgOptions = {}
  ): Promise<ProcessResult> {
    const { mode = 'photo', colorTolerance = 45, onProgress } = options;

    const blob = await aiService.removeBackgroundAsync(
      file,
      'rmbg',
      80,
      onProgress,
      mode,
      colorTolerance
    );

    const url = URL.createObjectURL(blob);
    return { blob, url };
  }
}
