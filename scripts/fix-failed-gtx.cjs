const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

async function translateSingle(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map(x => x[0]).join('');
    }
    return text;
  } catch (err) {
    console.error(`Fetch error for ${targetLang}:`, err.message);
    return text;
  }
}

async function run() {
  const enPath = path.join(localesDir, 'en', 'translation.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  for (const lang of languages) {
    if (lang === 'en') continue;

    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let keysToTranslate = [];

    for (const key of Object.keys(enData)) {
      if (key.startsWith('landing.')) {
        if (data[key] === enData[key] && enData[key].trim() !== '') {
          keysToTranslate.push(key);
        }
      }
    }

    if (keysToTranslate.length === 0) continue;

    console.log(`[${lang}] Translating ${keysToTranslate.length} fallback keys LINE BY LINE...`);
    
    let updated = false;

    for (let i = 0; i < keysToTranslate.length; i++) {
      const key = keysToTranslate[i];
      const val = enData[key];
      const translated = await translateSingle(val, lang);
      if (translated !== val) {
        data[key] = translated;
        updated = true;
      }
      await new Promise(r => setTimeout(r, 100)); // 100ms delay per key
      if (i % 20 === 0) console.log(`[${lang}] ${i}/${keysToTranslate.length} done`);
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`[${lang}] Successfully saved translation.json`);
    }
  }
}

run().catch(console.error);
