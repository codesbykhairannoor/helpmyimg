import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticCatalogPath = path.join(__dirname, '..', 'src', 'i18n', 'staticCatalog.ts');
let fileContent = fs.readFileSync(staticCatalogPath, 'utf8');

const languages = [
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ms', name: 'Malay' },
  { code: 'nl', name: 'Dutch' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' }
];

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[0].map(item => item[0]).join(''));
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

function escapeString(str) {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

async function processTranslations() {
  for (const lang of languages) {
    console.log(`Processing ${lang.code}...`);
    const highlight = await translateText("All Image", lang.code);
    const solid = await translateText("Tools in One Place", lang.code);
    
    // We will inject "home.hero.titleHighlight" and "home.hero.titleSolid" right before "hero.subtitle"
    const insertRegex = new RegExp(`(  ${lang.code}: {[\\s\\S]*?)(    "hero\\.subtitle":\\s*")`, 'g');
    if (fileContent.match(insertRegex)) {
      fileContent = fileContent.replace(
        insertRegex, 
        `$1    "home.hero.titleHighlight": "${escapeString(highlight)}",\n    "home.hero.titleSolid": "${escapeString(solid)}",\n$2`
      );
    }
  }

  // Now, process the English section to replace 'photo' with 'image'
  // But we want to avoid replacing 'Passport Photo' if possible, or maybe it's fine. 
  // Let's be safe and replace "photo" with "image" except when preceded by "Passport".
  
  // Extract English section
  const enMatch = fileContent.match(/  "en": {([\s\S]*?)},\n  "es": {/);
  if (enMatch) {
    let enBlock = enMatch[1];
    
    enBlock = enBlock.replace(/(?<!Passport )\bphoto\b/g, 'image');
    enBlock = enBlock.replace(/(?<!Passport )\bphotos\b/g, 'images');
    enBlock = enBlock.replace(/(?<!Passport )\bPhoto\b/g, 'Image');
    enBlock = enBlock.replace(/(?<!Passport )\bPhotos\b/g, 'Images');
    
    // Also "Photo Studio" -> "Image Studio"? Well, "Photo Studio" is a common term, but okay.
    
    fileContent = fileContent.replace(enMatch[1], enBlock);
  }

  fs.writeFileSync(staticCatalogPath, fileContent, 'utf8');
  console.log('✅ Done updating staticCatalog.ts with new home.hero keys and photo->image replacement in English');
}

processTranslations();
