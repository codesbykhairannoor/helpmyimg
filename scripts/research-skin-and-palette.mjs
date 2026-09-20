// scripts/research-skin-and-palette.mjs
import sharp from 'sharp';

function isSkinPixel(r, g, b) {
  // YCbCr skin chrominance test
  const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
  const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;
  return cb >= 77 && cb <= 127 && cr >= 133 && cr <= 173;
}

export async function analyzeImageDeep(imagePathOrBuffer) {
  const image = sharp(imagePathOrBuffer);
  const { data, info } = await image
    .resize(160, 160, { fit: 'fill' })
    .raw()
    .toBuffer({ resolveWithObject: true });
    
  const w = info.width;
  const h = info.height;
  const channels = info.channels;
  const totalPixels = w * h;
  
  let skinPixels = 0;
  const colorBins = new Map();
  
  for (let i = 0; i < totalPixels; i++) {
    const idx = i * channels;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    
    if (isSkinPixel(r, g, b)) {
      skinPixels++;
    }
    
    // 5-bit color bin (32 levels per channel = 32768 bins)
    const bin = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
    colorBins.set(bin, (colorBins.get(bin) || 0) + 1);
  }
  
  const skinRatio = skinPixels / totalPixels;
  const uniqueBins5Bit = colorBins.size;
  
  // Analyze borders
  const borderPixels = [];
  for (let x = 0; x < w; x++) {
    let idx = (0 * w + x) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
    idx = ((h - 1) * w + x) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
  }
  for (let y = 1; y < h - 1; y++) {
    let idx = (y * w + 0) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
    idx = ((y * w + (w - 1))) * channels;
    borderPixels.push([data[idx], data[idx + 1], data[idx + 2]]);
  }
  
  let sumR = 0, sumG = 0, sumB = 0;
  for (const [r, g, b] of borderPixels) { sumR += r; sumG += g; sumB += b; }
  const meanR = sumR / borderPixels.length;
  const meanG = sumG / borderPixels.length;
  const meanB = sumB / borderPixels.length;
  
  let varSum = 0;
  for (const [r, g, b] of borderPixels) {
    const dr = r - meanR, dg = g - meanG, db = b - meanB;
    varSum += (dr * dr + dg * dg + db * db) / 3;
  }
  const borderStdDev = Math.sqrt(varSum / borderPixels.length);
  
  // Sorted color frequency
  const counts = Array.from(colorBins.values()).sort((a, b) => b - a);
  const dominantBgShare = (counts[0] || 0) / totalPixels;
  
  // Classification rule:
  // 1. If skin is detected (>1.5% of pixels) -> DEFINITELY A PERSON / PHOTO!
  // 2. If color bins > 400 (continuous natural gradations) -> PHOTO!
  // 3. ONLY if NO skin AND very low color count (<180 bins) AND high solid background -> LOGO!
  const hasHumanSkin = skinRatio > 0.015;
  const isContinuousTone = uniqueBins5Bit > 350;
  const isPureFlatGraphic = !hasHumanSkin && !isContinuousTone && borderStdDev < 12;
  
  const classification = isPureFlatGraphic ? 'logo' : 'photo';
  
  return {
    classification,
    skinRatio: (skinRatio * 100).toFixed(2) + '%',
    uniqueBins5Bit,
    borderStdDev: borderStdDev.toFixed(2),
    dominantBgShare: (dominantBgShare * 100).toFixed(1) + '%',
    hasHumanSkin,
    isContinuousTone,
  };
}

async function run() {
  console.log('--- Logo images.png ---', await analyzeImageDeep('public/images.png'));
  console.log('--- Logo logobaru.png ---', await analyzeImageDeep('public/logobaru.png'));
  console.log('--- Logo oneformind logo.jpg ---', await analyzeImageDeep('public/oneformind logo.jpg'));
}
run();
