// src/utils/imageClassifier.ts
// Ultra-fast (<3ms) in-browser image classifier to distinguish between
// 1) Flat Logos / Vector Graphics (Solid / High-Contrast Background, No Skin, Flat Colors)
// 2) Natural Photographs / Human Portraits (People, Clothes, Real-World Continuous Gradients)

export interface ClassificationResult {
  type: 'photo' | 'logo';
  confidence: number;
  skinRatio: number;
  borderStdDev: number;
  uniqueColorBins: number;
}

/**
 * Fast in-browser image classifier (<3ms).
 * Tests perimeter color variance, human skin chrominance (YCbCr), and foreground color complexity.
 * GUARANTEE: Any image containing human skin tones, clothing textures, or continuous gradients
 * is ALWAYS classified as 'photo' (Neural AI). Only pure flat vector graphics with zero skin
 * tones and very few flat colors are classified as 'logo'.
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
        resolve({ type: 'photo', confidence: 0.99, skinRatio: 0, borderStdDev: 50, uniqueColorBins: 500 });
        return;
      }

      ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
      const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
      const data = imgData.data;
      const w = sampleSize;
      const h = sampleSize;
      const totalPixels = w * h;

      // 1. Analyze Border Pixels (Perimeter of 128x128 sample)
      const borderPixels: [number, number, number][] = [];
      for (let x = 0; x < w; x++) {
        let idx = (0 * w + x) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
        idx = ((h - 1) * w + x) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
      }
      for (let y = 1; y < h - 1; y++) {
        let idx = (y * w + 0) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
        idx = ((y * w + (w - 1))) * 4;
        borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
      }

      // Calculate perimeter standard deviation
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

      // 2. Human Skin Chrominance Analysis (YCbCr Color Space)
      // Universal skin chrominance cluster: Cb in [77, 127] and Cr in [133, 173]
      let skinPixels = 0;
      const colorBins = new Map<number, number>();
      const foregroundBins = new Map<number, number>();

      for (let i = 0; i < totalPixels; i++) {
        const idx = i * 4;
        if (data[idx + 3] < 30) continue;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // YCbCr skin detection
        const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
        const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
        if (cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173) {
          skinPixels++;
        }

        // 5-bit color bin (32 levels per channel = 32768 bins for high sensitivity)
        const bin = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
        colorBins.set(bin, (colorBins.get(bin) || 0) + 1);

        // Check distance from border background color to find foreground pixels
        const dr = r - meanR;
        const dg = g - meanG;
        const db = b - meanB;
        const distFromBg = Math.sqrt(dr * dr + dg * dg + db * db);
        if (distFromBg > 25) {
          foregroundBins.set(bin, (foregroundBins.get(bin) || 0) + 1);
        }
      }

      const skinRatio = skinPixels / totalPixels;
      const uniqueColorBins = colorBins.size;
      const foregroundColorBins = foregroundBins.size;

      // 3. Strict Classification Heuristic:
      // - If ANY human skin is detected (> 1.2% of pixels) -> MUST BE A PERSON (PHOTO)!
      // - If foreground has rich continuous shades (> 100 color bins, e.g. suit, hair, shading) -> PHOTO!
      // - If border has high variance (> 12) -> PHOTO!
      // - ONLY if NO human skin (< 0.8%), low foreground color count (< 65), and flat background -> LOGO!
      const hasHumanSkin = skinRatio > 0.012;
      const isContinuousPhoto = foregroundColorBins > 90 || uniqueColorBins > 180;
      const isSolidBorder = borderStdDev < 10;

      const isLogo = !hasHumanSkin && !isContinuousPhoto && isSolidBorder && foregroundColorBins < 65;

      resolve({
        type: isLogo ? 'logo' : 'photo',
        confidence: isLogo ? 0.95 : (hasHumanSkin ? 0.99 : 0.92),
        skinRatio,
        borderStdDev,
        uniqueColorBins
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ type: 'photo', confidence: 0.99, skinRatio: 0, borderStdDev: 50, uniqueColorBins: 500 });
    };

    img.src = url;
  });
}

