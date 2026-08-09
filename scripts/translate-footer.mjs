import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const missingKeys = {
  "footer.about": "About Us",
  "footer.privacy": "Privacy Policy",
  "footer.terms": "Terms of Service",
  "nav.faq": "FAQ",
  "footer.resources": "Resources",
  "footer.security": "Security & Trust",
  "footer.pricing": "Pricing",
  "footer.compare": "Compare",
  "footer.languages": "Supported Languages"
};

const keysList = Object.keys(missingKeys);

function setNestedValue(obj, pathStr, value) {
  const keys = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

async function translateGTX(text, targetLang) {
  let tLang = targetLang;
  if (tLang === 'zh') tLang = 'zh-CN';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map(item => item[0]).join('');
}

async function run() {
  console.log(`Starting rapid translation for ${keysList.length} footer keys across 30 languages...`);
  
  for (const lang of languages) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    let updated = false;

    if (lang === 'en') {
      for (const key of keysList) {
        setNestedValue(langData, key, missingKeys[key]);
        updated = true;
      }
    } else {
      console.log(`[${lang}] Rapid translating...`);
      // Translate all keys concurrently for speed
      const promises = keysList.map(async (key) => {
        try {
          const resText = await translateGTX(missingKeys[key], lang);
          setNestedValue(langData, key, resText);
          updated = true;
        } catch (e) {
          console.error(`  [${lang}] Failed: ${key} -> ${e.message}`);
        }
      });
      await Promise.all(promises);
      // add a small 500ms delay between languages to respect rate limits somewhat
      await new Promise(r => setTimeout(r, 500));
    }
    
    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[${lang}] Saved successfully.`);
    }
  }
  console.log('DONE!');
}

run();
