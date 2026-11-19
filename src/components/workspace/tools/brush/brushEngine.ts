// src/components/workspace/tools/brush/brushEngine.ts
// Engine dedicated to Brush Mask Restoration, Manual Erasing, and Smart Radial Inpaint Healing

export type BrushMode = 'restore' | 'erase' | 'inpaint';

export interface BrushDrawOptions {
  ctx: CanvasRenderingContext2D;
  originalImg: HTMLImageElement | HTMLCanvasElement | null;
  x: number;
  y: number;
  radius: number;
  mode: BrushMode;
}

const SAMPLE_ANGLES = 12;
const COS_TABLE = Array.from({ length: SAMPLE_ANGLES }, (_, i) => Math.cos((i * Math.PI * 2) / SAMPLE_ANGLES));
const SIN_TABLE = Array.from({ length: SAMPLE_ANGLES }, (_, i) => Math.sin((i * Math.PI * 2) / SAMPLE_ANGLES));

export class BrushEngine {
  /**
   * Apply a single brush stroke (restore original pixels, erase to transparent, or smart inpaint heal)
   */
  public static applyStroke(options: BrushDrawOptions): void {
    const { ctx, originalImg, x, y, radius, mode } = options;

    if (mode === 'inpaint') {
      this.inpaintCircle(ctx, x, y, radius);
      return;
    }

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.closePath();

    if (mode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
      ctx.fill();
    } else if (originalImg) {
      ctx.clip();
      ctx.drawImage(originalImg, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    ctx.restore();
  }

  /**
   * Smart Radial Inpaint Heal: synthesizes seamless fill texture inside a brushed circle
   * by interpolating surrounding multi-ring boundary pixels via inverse-distance weighting & soft edge feathering.
   */
  public static inpaintCircle(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number): void {
    const canvasW = ctx.canvas.width;
    const canvasH = ctx.canvas.height;
    const r = Math.max(2, radius);
    const pad = Math.max(4, Math.ceil(r * 0.45));

    const x0 = Math.max(0, Math.floor(cx - r - pad));
    const y0 = Math.max(0, Math.floor(cy - r - pad));
    const x1 = Math.min(canvasW, Math.ceil(cx + r + pad));
    const y1 = Math.min(canvasH, Math.ceil(cy + r + pad));
    const boxW = x1 - x0;
    const boxH = y1 - y0;
    if (boxW <= 2 || boxH <= 2) return;

    const imgData = ctx.getImageData(x0, y0, boxW, boxH);
    const data = imgData.data;
    const snapshot = new Uint8ClampedArray(data);

    const localCx = cx - x0;
    const localCy = cy - y0;
    const rSq = r * r;

    // Pre-collect perimeter samples from two concentric rings outside the brush radius
    const samples: { sx: number; sy: number; r: number; g: number; b: number; a: number }[] = [];
    const ringRadii = [r + 2, r + Math.max(4, pad * 0.65)];

    for (const ringR of ringRadii) {
      for (let k = 0; k < SAMPLE_ANGLES; k++) {
        const sx = Math.round(localCx + ringR * COS_TABLE[k]);
        const sy = Math.round(localCy + ringR * SIN_TABLE[k]);
        if (sx >= 0 && sx < boxW && sy >= 0 && sy < boxH) {
          const sIdx = (sy * boxW + sx) * 4;
          const a = snapshot[sIdx + 3];
          if (a > 10) {
            samples.push({
              sx,
              sy,
              r: snapshot[sIdx],
              g: snapshot[sIdx + 1],
              b: snapshot[sIdx + 2],
              a,
            });
          }
        }
      }
    }

    if (samples.length === 0) return;

    const pyStart = Math.max(0, Math.floor(localCy - r));
    const pyEnd = Math.min(boxH - 1, Math.ceil(localCy + r));
    const pxStart = Math.max(0, Math.floor(localCx - r));
    const pxEnd = Math.min(boxW - 1, Math.ceil(localCx + r));

    for (let py = pyStart; py <= pyEnd; py++) {
      const dy = py - localCy;
      for (let px = pxStart; px <= pxEnd; px++) {
        const dx = px - localCx;
        const distSq = dx * dx + dy * dy;
        if (distSq > rSq) continue;

        let sumW = 0;
        let accR = 0;
        let accG = 0;
        let accB = 0;
        let accA = 0;

        for (let k = 0; k < samples.length; k++) {
          const s = samples[k];
          const sdx = px - s.sx;
          const sdy = py - s.sy;
          const w = 1 / (sdx * sdx + sdy * sdy + 4);
          sumW += w;
          accR += s.r * w;
          accG += s.g * w;
          accB += s.b * w;
          accA += s.a * w;
        }

        if (sumW <= 0) continue;

        const outIdx = (py * boxW + px) * 4;
        const dist = Math.sqrt(distSq);
        // Smooth radial feather on outer 25% of radius for invisible transition
        const blend = dist > r * 0.75 ? Math.max(0, 1 - (dist - r * 0.75) / (r * 0.25)) : 1;
        const invBlend = 1 - blend;

        data[outIdx] = Math.round((accR / sumW) * blend + snapshot[outIdx] * invBlend);
        data[outIdx + 1] = Math.round((accG / sumW) * blend + snapshot[outIdx + 1] * invBlend);
        data[outIdx + 2] = Math.round((accB / sumW) * blend + snapshot[outIdx + 2] * invBlend);
        data[outIdx + 3] = Math.round((accA / sumW) * blend + snapshot[outIdx + 3] * invBlend);
      }
    }

    ctx.putImageData(imgData, x0, y0);
  }
}
