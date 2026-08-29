import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const localesDir = path.resolve('public/locales');
const enTranslations = JSON.parse(fs.readFileSync(path.join(localesDir, 'en', 'translation.json'), 'utf-8'));

// Get all languages except 'en'
const langs = fs.readdirSync(localesDir).filter(f => f !== 'en' && fs.statSync(path.join(localesDir, f)).isDirectory());

async function main() {
  console.log('Starting missing translations fill using google-translate-api-x...');

  for (const lang of langs) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    let langJSON = {};
    if (fs.existsSync(langPath)) {
      langJSON = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    }

    let targetLang = lang;
    if (targetLang === 'zh') targetLang = 'zh-CN';

    // Find keys that are in EN but missing in this lang
    const missingKeys = [];
    const textsToTranslate = [];

    for (const key of Object.keys(enTranslations)) {
      if (!langJSON[key]) {
        missingKeys.push(key);
        textsToTranslate.push(enTranslations[key]);
      }
    }

    if (missingKeys.length === 0) {
      console.log(`[${targetLang}] No missing keys.`);
      continue;
    }

    console.log(`[${targetLang}] Translating ${missingKeys.length} missing keys...`);

    try {
      // Translate in batches of 50 to avoid any limits/errors
      const batchSize = 50;
      for (let i = 0; i < textsToTranslate.length; i += batchSize) {
        const batchTexts = textsToTranslate.slice(i, i + batchSize);
        const batchKeys = missingKeys.slice(i, i + batchSize);
        
        const res = await translate(batchTexts, { to: targetLang });
        const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];
        
        for (let j = 0; j < batchKeys.length; j++) {
          langJSON[batchKeys[j]] = translatedArray[j];
        }
      }
      
      fs.writeFileSync(langPath, JSON.stringify(langJSON, null, 2));
      console.log(`[${targetLang}] Missing keys translated successfully`);
    } catch (e) {
      console.error(`[${targetLang}] Translation failed: ${e.message}`);
    }
  }

  console.log('Finished filling all missing translations!');
}

main();
