// scripts/research-classifier.mjs
import sharp from 'sharp';
import path from 'path';

async function analyzeImage(imagePath) {
  const image = sharp(imagePath);
  const metadata = await image.metadata();
  
  // Resize to 128x128 thumbnail for instant 1ms analysis
  const { data, info } = await image
    .resize(128, 128, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const w = info.width;
  const h = info.height;
  const channels = info.channels;
  
  // 1. Analyze Border Pixels
  const borderPixels = [];
  for (let x = 0; x < w; x++) {
    // Top border
    let idx = (0 * w + x) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
    // Bottom border
    idx = ((h - 1) * w + x) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
  }
  for (let y = 1; y < h - 1; y++) {
    // Left border
    let idx = (y * w + 0) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
    // Right border
    idx = ((y * w + (w - 1))) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
  }
  
  // Calculate border variance (mean and standard deviation)
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
  
  // 2. Analyze Color Histogram / Palette Entropy (quantized to 4-bit per channel = 4096 bins)
  const colorBins = new Map();
  const totalPixels = w * h;
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * channels;
    const r = data[idx] >> 4;
    const g = data[idx + 1] >> 4;
    const b = data[idx + 2] >> 4;
    const key = (r << 8) | (g << 4) | b;
    colorBins.set(key, (colorBins.get(key) || 0) + 1);
  }
  
  // Calculate top 3 colors percentage
  const counts = Array.from(colorBins.values()).sort((a, b) => b - a);
  const top3Share = ((counts[0] || 0) + (counts[1] || 0) + (counts[2] || 0)) / totalPixels;
  const uniqueColorCount = colorBins.size;
  
  // Classification Heuristic
  const isSolidBorder = borderStdDev < 15;
  const isLowPalette = uniqueColorCount < 120 || top3Share > 0.85;
  const isLogoOrGraphic = isSolidBorder && (isLowPalette || borderStdDev < 8);
  
  console.log(`\n--- Analysis: ${path.basename(imagePath)} ---`);
  console.log(`Dimensions: ${metadata.width}x${metadata.height}`);
  console.log(`Border StdDev: ${borderStdDev.toFixed(2)} (Solid < 15: ${isSolidBorder})`);
  console.log(`Unique Color Bins (4-bit): ${uniqueColorCount}`);
  console.log(`Top 3 Colors Share: ${(top3Share * 100).toFixed(1)}%`);
  console.log(`-> CLASSIFICATION: ${isLogoOrGraphic ? '🏷️ LOGO / FLAT GRAPHIC' : '📷 NATURAL PHOTO / COMPLEX SCENE'}`);
}

async function run() {
  await analyzeImage('public/images.png');
  await analyzeImage('public/logobaru.png');
}

run().catch(console.error);
