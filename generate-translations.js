import fs from 'fs';
import path from 'path';
import translate from 'translate-google';

const localesDir = path.join(process.cwd(), 'public', 'locales');
const enFile = path.join(localesDir, 'en', 'translation.json');
const en = JSON.parse(fs.readFileSync(enFile, 'utf8'));

const TARGET_KEYS = [];

function extractMissingEnObj() {
  const res = {};
  const traverse = (obj, prefix = '') => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'string') {
        if (k.startsWith('landing.geo.matrix.') || k.startsWith('seo.jsonld.')) {
          res[k] = v;
        }
      } else if (typeof v === 'object') {
        traverse(v, prefix + k + '.');
      }
    }
  };
  traverse(en);
  return res;
}

const missingEn = extractMissingEnObj();
const langs = fs.readdirSync(localesDir).filter(l => l !== 'en' && fs.statSync(path.join(localesDir, l)).isDirectory());

const langMap = {
  // Mapping standard ISO codes to what google-translate-api expects if needed. Usually it matches.
  'zh': 'zh-cn'
};

async function processTranslations() {
  console.log(`Starting translation for ${langs.length} languages...`);
  for (const lang of langs) {
    try {
      console.log(`Translating to ${lang}...`);
      const targetLang = langMap[lang] || lang;
      
      // We pass the object directly, translate-google translates all string values in it!
      const translatedObj = await translate(missingEn, {to: targetLang});
      
      const filePath = path.join(localesDir, lang, 'translation.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      // Apply translated keys flatly
      for (const [k, v] of Object.entries(translatedObj)) {
        data[k] = v;
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Updated ${lang}`);
      
      // Delay to avoid rate limit
      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ Failed to translate to ${lang}:`, err.message);
    }
  }
  console.log('All translations finished!');
}

processTranslations();
