// src/components/workspace/tools/removeBg/removeBgEngine.ts
// Engine dedicated to Background Removal: AI Neural Worker + Precision Vector Color-Key

import { aiService } from '../../../../services/aiService';
import { detectImageType, type ClassificationResult } from '../../../../utils/imageClassifier';
import type { CutoutMode } from '../../types';

export interface RemoveBgOptions {
  mode?: CutoutMode;
  colorTolerance?: number;
  onProgress?: (step: string, progress: number) => void;
}

export interface ProcessResult {
  blob: Blob;
  url: string;
  detectedType: 'photo' | 'logo';
}

export class RemoveBgEngine {
  /**
   * Pre-classify an image file instantly (<3ms)
   */
  public static async classifyImage(file: File | Blob): Promise<ClassificationResult> {
    return detectImageType(file);
  }

  /**
   * Remove background using either Neural AI or Vector Color-Key depending on mode
   */
  public static async process(
    file: File | Blob,
    options: RemoveBgOptions = {}
  ): Promise<ProcessResult> {
    const { mode = 'auto', colorTolerance = 45, onProgress } = options;

    let detectedType: 'photo' | 'logo' = 'photo';
    if (mode === 'auto') {
      const classification = await this.classifyImage(file);
      detectedType = classification.type;
    } else {
      detectedType = mode;
    }

    const blob = await aiService.removeBackgroundAsync(
      file,
      'rmbg',
      80,
      onProgress,
      mode,
      colorTolerance
    );

    const url = URL.createObjectURL(blob);
    return { blob, url, detectedType };
  }
}
