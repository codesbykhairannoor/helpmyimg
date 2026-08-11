import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const srcDirs = [
  path.join(__dirname, '../src/pages/info'),
  path.join(__dirname, '../src/components')
];

// Extract all t('key', { defaultValue: 'Fallback' })
const keysToTranslate = {};

for (const dir of srcDirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const regex = /t\((['"])([^'"]+)\1,\s*\{\s*defaultValue:\s*(['"])(.*?)(?<!\\)\3\s*\}\)/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      const key = match[2];
      const fallback = match[4];
      keysToTranslate[key] = fallback;
    }
  }
}

const keys = Object.keys(keysToTranslate);
console.log(`Found ${keys.length} keys to translate.`);

async function translateText(text, targetLang) {
  try {
    let tLang = targetLang;
    if (tLang === 'zh') tLang = 'zh-CN';
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();
    return json[0].map(item => item[0]).join('');
  } catch (err) {
    throw new Error(`GTX failed: ${err.message}`);
  }
}

async function run() {
  // Update EN first
  const enPath = path.join(localesDir, 'en', 'translation.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  for (const [key, value] of Object.entries(keysToTranslate)) {
    if (!enData[key]) {
      enData[key] = value;
    }
  }
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
  
  for (const lang of languages) {
    if (lang === 'en') continue;
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Ignore short standard terms that might legitimately match English like "FAQ" or proper names, but for these ones they are sentences.
    // We only translate if missing entirely, or if it matches EN EXACTLY for long sentences.
    const missingKeys = keys.filter(k => !data[k] || (data[k] === enData[k] && enData[k].length > 10));
    if (missingKeys.length === 0) {
      console.log(`[${lang}] All keys present.`);
      continue;
    }
    
    console.log(`\nTranslating ${missingKeys.length} keys for ${lang}...`);
    
    // Batch translate by joining with \n
    const originalStrings = missingKeys.map(k => enData[k] || keysToTranslate[k]);
    const combinedText = originalStrings.join('\n');
    
    try {
      await new Promise(r => setTimeout(r, 1500)); // 1.5s delay
      const resText = await translateText(combinedText, lang);
      const translatedStrings = resText.split('\n').map(s => s.trim());
      
      if (translatedStrings.length !== originalStrings.length) {
        console.error(`[${lang}] ERROR: Length mismatch! Expected ${originalStrings.length}, got ${translatedStrings.length}. Falling back to single translation...`);
        // Fallback to single translation
        for (const k of missingKeys) {
          try {
            await new Promise(r => setTimeout(r, 500));
            data[k] = await translateText(enData[k] || keysToTranslate[k], lang);
          } catch(e) {
            console.error(`Error on single key ${k}: ${e.message}`);
          }
        }
      } else {
        for (let i = 0; i < missingKeys.length; i++) {
          data[missingKeys[i]] = translatedStrings[i] || originalStrings[i];
        }
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[${lang}] Successfully translated and injected.`);
    } catch (e) {
      console.error(`[${lang}] ERROR:`, e.message);
    }
  }
}

run();
