const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// Helper delay
const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  const enPath = path.join(localesDir, 'en', 'translation.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  // Keys we know are landing sections for picker, crop, rotate
  const toolsToCheck = ['picker', 'crop', 'rotate', 'compress', 'convert', 'resize', 'color', 'watermark', 'remove', 'brush'];
  
  for (const lang of languages) {
    if (lang === 'en') continue;

    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updated = false;

    let keysToTranslate = [];

    // Find keys that exactly match English, which means they failed to translate or were skipped
    for (const key of Object.keys(enData)) {
      if (key.startsWith('landing.')) {
        // If the localized value is identical to English (and we're not English), it needs translation
        if (data[key] === enData[key] && enData[key].trim() !== '') {
          keysToTranslate.push(key);
        }
      }
    }

    if (keysToTranslate.length > 0) {
      console.log(`[${lang}] Found ${keysToTranslate.length} English fallbacks. Translating safely...`);
      
      // We will translate them sequentially but safely
      for (let i = 0; i < keysToTranslate.length; i++) {
        const key = keysToTranslate[i];
        const textToTranslate = enData[key];
        
        try {
          const res = await translate(textToTranslate, { to: lang });
          data[key] = res.text;
          updated = true;
          
          if (i % 10 === 0) {
             process.stdout.write('.');
          }
          await delay(200); // 200ms delay to avoid aggressive rate limiting
        } catch (err) {
          console.error(`\n[${lang}] Error translating key ${key}: ${err.message}`);
          await delay(2000); // Wait longer on error
        }
      }
      console.log(`\n[${lang}] Finished translating.`);
    } else {
      console.log(`[${lang}] All good. No English fallbacks found.`);
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`[${lang}] Successfully saved translation.json`);
    }
  }
}

run().catch(console.error);
