import sharp from 'sharp';
import fs from 'fs';

const inputPath = 'C:\\Users\\Axioo\\.gemini\\antigravity-ide\\brain\\39a72feb-1f0c-4823-b927-5a7323975f13\\helpmyimg_logo_1783924192598.png';
const outputPath = 'd:\\aboutbg-img\\public\\favicon.png';
const tempPath = 'd:\\aboutbg-img\\public\\temp_logo.png';

async function processImage() {
  try {
    // We will use sharp to remove the white background.
    // A simple way is to use the alpha channel based on lightness, but that makes it translucent.
    // Better: extract the alpha channel where rgb is close to white.
    
    // Actually, sharp can do this using a threshold.
    // Let's create an alpha mask from the image, invert it (so black becomes white and white becomes black),
    // and apply it. Wait, the logo is colored, so we can't just invert lightness.
    
    // An alternative is using flood fill or simply rendering it as is, or we can use the app's own smart crop / background removal if we want.
    // But since this is a clean generated image, we can use sharp's trim or just simple thresholding.
    // Even easier, let's just make the white background transparent using raw pixel manipulation.

    const { data, info } = await sharp(inputPath)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // If it's very close to white, make it transparent
      if (r > 240 && g > 240 && b > 240) {
        data[i + 3] = 0; // Alpha to 0
      } else if (r > 220 && g > 220 && b > 220) {
        // Semi-transparent for anti-aliasing edges
        data[i + 3] = 128;
      }
    }

    await sharp(data, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4,
      },
    })
      .resize(256, 256, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toFile(outputPath);
      
    console.log('Successfully created transparent favicon.png');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
