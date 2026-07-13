const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const DELIMITER = '\n\n===XXX===\n\n';

async function translateChunk(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    // data[0] contains array of parts
    if (data && data[0]) {
      return data[0].map(x => x[0]).join('');
    }
    return '';
  } catch (err) {
    console.error(`Fetch error for ${targetLang}:`, err.message);
    return '';
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
        // If it's an exact match with English (and not empty)
        if (data[key] === enData[key] && enData[key].trim() !== '') {
          keysToTranslate.push(key);
        }
      }
    }

    if (keysToTranslate.length === 0) {
      console.log(`[${lang}] All good. No English fallbacks.`);
      continue;
    }

    console.log(`[${lang}] Translating ${keysToTranslate.length} fallback keys...`);
    
    // Chunking to avoid URL too long
    let currentChunkKeys = [];
    let currentChunkText = "";
    const MAX_CHUNK_LENGTH = 1500;
    
    let updated = false;

    for (let i = 0; i < keysToTranslate.length; i++) {
      const key = keysToTranslate[i];
      const val = enData[key];
      
      if (currentChunkText.length + val.length + DELIMITER.length > MAX_CHUNK_LENGTH) {
        // Process current chunk
        const translatedStr = await translateChunk(currentChunkText, lang);
        const translatedParts = translatedStr.split('===XXX===').map(s => s.trim());
        
        if (translatedParts.length === currentChunkKeys.length) {
          for (let j = 0; j < currentChunkKeys.length; j++) {
            data[currentChunkKeys[j]] = translatedParts[j];
          }
          updated = true;
        } else {
          console.error(`[${lang}] Mismatch chunk split: expected ${currentChunkKeys.length}, got ${translatedParts.length}`);
        }
        
        // Reset chunk
        currentChunkKeys = [];
        currentChunkText = "";
        await new Promise(r => setTimeout(r, 500)); // Delay between chunks
      }
      
      currentChunkKeys.push(key);
      currentChunkText += (currentChunkText.length === 0 ? '' : DELIMITER) + val;
    }
    
    // Process final chunk
    if (currentChunkKeys.length > 0) {
      const translatedStr = await translateChunk(currentChunkText, lang);
      const translatedParts = translatedStr.split('===XXX===').map(s => s.trim());
      
      if (translatedParts.length === currentChunkKeys.length) {
        for (let j = 0; j < currentChunkKeys.length; j++) {
          data[currentChunkKeys[j]] = translatedParts[j];
        }
        updated = true;
      } else {
        console.error(`[${lang}] Mismatch final chunk split: expected ${currentChunkKeys.length}, got ${translatedParts.length}`);
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`[${lang}] Successfully saved translation.json`);
    }
  }
}

run().catch(console.error);
