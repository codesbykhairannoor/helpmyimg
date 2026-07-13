const fs = require('fs');
const path = require('path');
const { translate } = require('lingva-scraper');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const englishStrings = {
  "editor.settings": "Tool Settings",
  "work.badge.watermark": "Watermark",
  "work.badge.crop": "Crop",
  "work.badge.rotate": "Rotate",
  "work.badge.picker": "Color Picker",
  "work.badge.remove": "Remove BG",
  "work.badge.color": "Bg Color",
  "work.badge.brush": "Magic Brush",
  "work.badge.compress": "Compress",
  "work.badge.convert": "Convert",
  "work.badge.resize": "Resize",

  "watermark.textLabel": "Watermark Text",
  "watermark.color": "Text Color",
  "watermark.opacity": "Opacity",
  "watermark.scale": "Scale",
  "watermark.rotation": "Rotation",
  "watermark.position": "Position",
  "watermark.type.text": "Text",
  "watermark.type.image": "Logo / Image",
  "watermark.uploadLabel": "Upload Logo (PNG)",
  "watermark.selectLogo": "Select Logo File",
  "watermark.changeLogo": "Change Logo",
  "watermark.pos.center": "Center",
  "watermark.pos.br": "Bottom Right",
  "watermark.pos.bl": "Bottom Left",
  "watermark.pos.tr": "Top Right",
  "watermark.pos.tl": "Top Left",
  "watermark.pos.tiled": "Tiled (Repeat)"
};

async function processTranslations() {
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updated = false;
    
    // We only translate missing ones
    for (const [key, text] of Object.entries(englishStrings)) {
      if (!data[key]) {
        if (lang === 'en') {
          data[key] = text;
          updated = true;
        } else {
          try {
             const res = await translate(text, 'en', lang);
             data[key] = res.text;
             updated = true;
             console.log(`[${lang}] Translated ${key}: ${res.text}`);
          } catch (e) {
             console.log(`[${lang}] Error translating ${key}`);
             data[key] = text; // fallback
             updated = true;
          }
        }
      }
    }
    
    if (updated) {
       fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    }
  }
}

processTranslations().then(() => console.log('Done'));
