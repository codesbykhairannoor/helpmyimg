// src/components/workspace/tools/brush/brushEngine.ts
// Engine dedicated to Brush Mask Restoration and Manual Erasing

export interface BrushDrawOptions {
  ctx: CanvasRenderingContext2D;
  originalImg: HTMLImageElement | HTMLCanvasElement;
  x: number;
  y: number;
  radius: number;
  mode: 'restore' | 'erase';
}

export class BrushEngine {
  /**
   * Apply a single brush stroke (restore original pixels or erase to transparent)
   */
  public static applyStroke(options: BrushDrawOptions): void {
    const { ctx, originalImg, x, y, radius, mode } = options;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    if (mode === 'erase') {
      ctx.clearRect(x - radius, y - radius, radius * 2, radius * 2);
    } else {
      ctx.drawImage(originalImg, 0, 0);
    }

    ctx.restore();
  }
}
