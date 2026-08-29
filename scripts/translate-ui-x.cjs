const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const localesDir = path.resolve('public/locales');
const enTranslations = require(path.join(localesDir, 'en', 'translation.json'));

const langs = fs.readdirSync(localesDir).filter(f => f !== 'en' && f !== 'id' && f !== 'th' && fs.statSync(path.join(localesDir, f)).isDirectory());

// Get all keys starting with longtail.
const keysToTranslate = Object.keys(enTranslations).filter(k => k.startsWith('longtail.'));
const englishTexts = keysToTranslate.map(k => enTranslations[k]);

async function main() {
  console.log('Starting UI translation using google-translate-api-x...');
  
  for (const lang of langs) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    let langJSON = {};
    if (fs.existsSync(langPath)) {
      langJSON = require(langPath);
    }
    
    let targetLang = lang;
    if (targetLang === 'zh') targetLang = 'zh-CN';
    
    try {
      const res = await translate(englishTexts, { to: targetLang });
      const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];
      
      for (let i = 0; i < keysToTranslate.length; i++) {
        langJSON[keysToTranslate[i]] = translatedArray[i];
      }
      
      fs.writeFileSync(langPath, JSON.stringify(langJSON, null, 2));
      console.log(`[${targetLang}] UI Translated successfully`);
    } catch (e) {
      console.error(`[${targetLang}] UI Translation failed: ${e.message}`);
    }
  }
  
  console.log('Finished translating UI strings!');
}

main();
