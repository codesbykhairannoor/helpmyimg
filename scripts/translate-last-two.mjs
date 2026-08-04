import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const missingKeys = {
  "hero.subtitle.short": "Combine, split, compress, convert, and process photos directly in your browser. 100% offline via WebAssembly. Free, unlimited, and highly secure.",
  "hero.search.placeholder": "Search tools (Remove BG, Compress, Edit)..."
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
  for (const lang of languages) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    
    let langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    let updated = false;

    // Set for English without translating
    if (lang === 'en') {
      for (const key of keysList) {
        langData[key] = missingKeys[key];
      }
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[EN] Updated English base.`);
      continue;
    }
    
    // Check if we already translated it
    if (langData[keysList[0]] && langData[keysList[0]] !== missingKeys[keysList[0]]) {
      console.log(`[${lang}] Already translated. Skipping...`);
      continue;
    }
    
    console.log(`\n[${lang}] Translating via GTX...`);
    
    for (let i = 0; i < keysList.length; i++) {
      const key = keysList[i];
      const text = missingKeys[key];
      
      try {
        await new Promise(r => setTimeout(r, 100)); // Delay between requests
        const resText = await translateGTX(text, lang);
        langData[key] = resText; // Flat key assignment directly!
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
