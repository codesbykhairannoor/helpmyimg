import sharp from 'sharp';

async function getColors() {
  try {
    const imgPath = 'public/logobaru.png';
    // Get dominant color using sharp stats
    const stats = await sharp(imgPath).stats();
    console.log("Dominant Color (RGB):", stats.dominant);
    
    // Also sample a few pixels to find key palette colors
    const { data, info } = await sharp(imgPath)
      .resize(10, 10, { fit: 'cover' })
      .raw()
      .toBuffer({ resolveWithObject: true });
      
    const colors = new Set();
    const pixelCount = info.width * info.height;
    
    for (let i = 0; i < pixelCount; i++) {
      const idx = i * info.channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = info.channels === 4 ? data[idx + 3] : 255;
      
      // ignore mostly transparent or white/black background pixels if any
      if (a < 50) continue;
      
      const hex = `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
      colors.add(hex);
    }
    
    console.log("Sampled Colors (Hex):", Array.from(colors).slice(0, 10).join(', '));
    
  } catch (err) {
    console.error("Error analyzing image:", err);
  }
}

getColors();
