import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const missingKeys = {
  "footer.about": "About Us",
  "info.freePromo": "100% Free, 0 Rupiah, No Subscriptions. No hidden fees or credit cards required."
};

const keysList = Object.keys(missingKeys);

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
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
        console.log(`\n[${lang}] Translating via GTX...`);
        for (let i = 0; i < keysList.length; i++) {
          const key = keysList[i];
          const text = missingKeys[key];
          
          try {
            await new Promise(r => setTimeout(r, 100)); // Delay between requests
            const resText = await translateGTX(text, lang);
            setNestedValue(langData, key, resText);
            updated = true;
          } catch (e) {
            console.error(`  [${lang}] Failed single: ${key} -> ${e.message}`);
          }
        }
    }
    
    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[${lang}] Saved successfully.`);
    }
  }
}

run();
