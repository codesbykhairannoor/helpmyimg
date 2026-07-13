import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// Robust batched translation using Google Translate Extension (GTX) endpoint
async function translateBatched(textsArray, targetLang) {
  // We use a delimiter that won't be translated or messed up easily
  const delimiter = ' \n\n ### \n\n ';
  const combinedText = textsArray.join(delimiter);
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(combinedText)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      const fullTranslatedStr = data[0].map(x => x[0]).join('');
      // Split by delimiter (handling full-width Asian characters from translator)
      const translatedArray = fullTranslatedStr.split(/\s*(?:###|＃＃＃)\s*/);
      return translatedArray;
    }
    return textsArray; // fallback to english array
  } catch (err) {
    console.error(`Fetch error for ${targetLang}:`, err.message);
    throw err;
  }
}

const englishContent = JSON.parse(fs.readFileSync(path.join(localesDir, 'en', 'translation.json'), 'utf8'));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processTranslations() {
  let totalKeys = Object.keys(englishContent).length;
  console.log(`Starting BATCHED massive translation for ${totalKeys} keys across ${languages.length} languages...`);
  
  for (const lang of languages) {
    if (lang === 'en') continue; // Skip EN as it's the source of truth

    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updated = false;

    // Collect keys to translate
    let keysToTranslate = [];
    let textsToTranslate = [];
    for (const [key, text] of Object.entries(englishContent)) {
      if (!data[key] || data[key] === text) {
        keysToTranslate.push(key);
        textsToTranslate.push(text);
      }
    }

    if (keysToTranslate.length === 0) continue;

    console.log(`\n--- [${lang}] Batch translating ${keysToTranslate.length} missing/fallback keys ---`);
    
    // Chunk array into pieces of 25 (approx 1000-1500 chars) to be extra safe with URL length
    const chunkSize = 25;
    for (let i = 0; i < keysToTranslate.length; i += chunkSize) {
      const keysChunk = keysToTranslate.slice(i, i + chunkSize);
      const textsChunk = textsToTranslate.slice(i, i + chunkSize);
      
      console.log(`[${lang}] Processing chunk ${Math.floor(i/chunkSize)+1}...`);
      
      try {
        const translatedArray = await translateBatched(textsChunk, lang);
        
        // Match up keys with translated texts
        for(let j=0; j < keysChunk.length; j++) {
            const key = keysChunk[j];
            const originalText = textsChunk[j];
            // If the translation array length matches, assign it, else fallback to english
            const translatedText = translatedArray.length === keysChunk.length ? translatedArray[j].trim() : originalText;
            
            data[key] = translatedText;
            updated = true;
        }
      } catch (e) {
          console.error(`[${lang}] Error translating chunk. Falling back to english. Error: ${e.message}`);
          for(let j=0; j < keysChunk.length; j++) {
            data[keysChunk[j]] = textsChunk[j];
            updated = true;
          }
      }
      
      // Delay 1.5 seconds between chunks to avoid rate limiting
      await delay(1500);
    }
    
    if (updated) {
       fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
       console.log(`[${lang}] Saved translation.json successfully!`);
    }
  }
}

processTranslations().then(() => console.log('\n✅ All massive batched translations generated successfully!'));
