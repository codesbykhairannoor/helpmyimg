import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// The flat structure for the target titles (like in HelpMyFile)
const missingKeys = {
  "landing.default.title.remove": "Free AI Background Remover - Remove Background from Image Locally | Zero Upload",
  "landing.default.title.blur": "Free Studio Bokeh Blur - Blur Image Background Locally | Zero Upload",
  "landing.default.title.color": "Free Passport Photo Maker - Change Background Color Locally | Zero Upload",
  "landing.default.title.watermark": "Free Watermark Maker - Add Watermark to Image Locally | Zero Upload",
  "landing.default.title.compress": "Free Image Compressor - Compress Image Size Locally | Zero Upload",
  "landing.default.title.convert": "Free Image Converter - Convert PNG/JPG/WEBP Locally | Zero Upload",
  "landing.default.title.resize": "Free Image Resizer - Resize Photo Dimensions Locally | Zero Upload",
  "landing.default.title.crop": "Free Image Cropper - Crop Image Online Locally | Zero Upload",
  "landing.default.title.rotate": "Free Image Rotator - Rotate Image Online Locally | Zero Upload",
  "landing.default.title.picker": "Free Image Color Picker - Extract Color from Image Locally | Zero Upload",
  "landing.default.title.blurface": "Free AI Face Blur - Blur Faces in Image Locally | Zero Upload",
  "landing.default.title.design": "Free AI Photo Editor - Edit Photos Online Locally | Zero Upload",
  "landing.default.title.home": "Free Bulk AI Photo Editor - Edit Images Locally | Zero Upload"
};

const keysList = Object.keys(missingKeys);

async function translateGTX(text, targetLang) {
  let tLang = targetLang;
  if (tLang === 'zh') tLang = 'zh-CN';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map(item => item[0]).join('');
}

async function run() {
  // Always update English first
  const enPath = path.join(localesDir, 'en', 'translation.json');
  if (fs.existsSync(enPath)) {
    const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    for (const key of keysList) {
      enData[key] = missingKeys[key];
    }
    fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
    console.log('[en] Updated successfully.');
  }

  for (const lang of languages) {
    if (lang === 'en') continue;
    
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    let updated = false;

    console.log(`\n[${lang}] Translating via GTX...`);
    
    for (let i = 0; i < keysList.length; i++) {
      const key = keysList[i];
      const text = missingKeys[key];
      
      try {
        await new Promise(r => setTimeout(r, 100)); // Delay between requests
        const resText = await translateGTX(text, lang);
        langData[key] = resText; // The translation files use flat keys for these!
        updated = true;
      } catch (e) {
        console.error(`  [${lang}] Failed single: ${key} -> ${e.message}`);
      }
    }
    
    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[${lang}] Saved successfully.`);
    }
  }
}

run();
