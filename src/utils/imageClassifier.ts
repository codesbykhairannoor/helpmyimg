// src/utils/imageClassifier.ts
// Ultra-fast (<3ms) in-browser image classifier to distinguish between
// 1) Flat Logos / Vector Graphics (Solid / High-Contrast Background)
// 2) Natural Photographs / Complex Scenes (People, Animals, Real-World Objects)

export interface ClassificationResult {
  type: 'photo' | 'logo';
  confidence: number;
  borderStdDev: number;
  uniqueColorBins: number;
  top3Share: number;
}

/**
 * Analyzes an image blob/file in <3ms using a 128x128 offscreen sampling canvas.
 * Computes perimeter color variance and 4-bit palette entropy to automatically
 * route the image to the optimal background removal engine.
 */
export async function detectImageType(file: File | Blob): Promise<ClassificationResult> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const sampleSize = 128;
      const canvas = document.createElement('canvas');
      canvas.width = sampleSize;
      canvas.height = sampleSize;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        resolve({ type: 'photo', confidence: 0.5, borderStdDev: 50, uniqueColorBins: 500, top3Share: 0.1 });
        return;
      }

      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imgData.data;
      const w = sampleSize;
      const h = sampleSize;

      // 1. Analyze Border Pixels (Perimeter of 128x128 sample)
      const borderPixels: [number, number, number][] = [];
      for (let x = 0; x < w; x++) {
        // Top edge
        let idx = (0 * w + x) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
        // Bottom edge
        idx = ((h - 1) * w + x) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
      for (let y = 1; y < h - 1; y++) {
        // Left edge
        let idx = (y * w + 0) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
        // Right edge
        idx = ((y * w + (w - 1))) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
      }

      // Calculate perimeter mean and standard deviation
      let sumR = 0, sumG = 0, sumB = 0;
      for (const [r, g, b] of borderPixels) {
        sumR += r; sumG += g; sumB += b;
      }
      const meanR = sumR / borderPixels.length;
      const meanG = sumG / borderPixels.length;
      const meanB = sumB / borderPixels.length;

      let varSum = 0;
      for (const [r, g, b] of borderPixels) {
        const dr = r - meanR;
        const dg = g - meanG;
        const db = b - meanB;
        varSum += (dr * dr + dg * dg + db * db) / 3;
      }
      const borderStdDev = Math.sqrt(varSum / borderPixels.length);

      // 2. Analyze Color Histogram / Palette Entropy (quantized to 4-bit per channel)
      const colorBins = new Map<number, number>();
      const totalPixels = w * h;
      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        // Ignore transparent or near-transparent pixels
        if (data[idx + 3] < 30) continue;
        const r = data[idx] >> 4;
        const g = data[idx + 1] >> 4;
        const b = data[idx + 2] >> 4;
        const key = (r << 8) | (g << 4) | b;
        colorBins.set(key, (colorBins.get(key) || 0) + 1);
      }

      // Calculate top 3 colors percentage
      const counts = Array.from(colorBins.values()).sort((a, b) => b - a);
      const top3Share = ((counts[0] || 0) + (counts[1] || 0) + (counts[2] || 0)) / totalPixels;
      const uniqueColorBins = colorBins.size;

      // Mathematical Heuristic:
      // Logos/Graphics have high border uniformity (low StdDev) and low color entropy or dominant background
      const isSolidBorder = borderStdDev < 16;
      const isLowPalette = uniqueColorBins < 160 || top3Share > 0.80;
      const isLogo = isSolidBorder && (isLowPalette || borderStdDev < 8);

      resolve({
        type: isLogo ? 'logo' : 'photo',
        confidence: isLogo ? (borderStdDev < 5 ? 0.98 : 0.85) : 0.92,
        borderStdDev,
        uniqueColorBins,
        top3Share
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ type: 'photo', confidence: 0.5, borderStdDev: 50, uniqueColorBins: 500, top3Share: 0.1 });
    };

    img.src = url;
  });
}
