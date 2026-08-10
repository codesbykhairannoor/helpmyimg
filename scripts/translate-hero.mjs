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
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[0].map(item => item[0]).join(''));
        } catch (e) {
          resolve(text); // Fallback to English on error
        }
      });
    }).on('error', reject);
  });
}

async function processTranslations() {
  for (const lang of languages) {
    const highlight = await translateText("All Image", lang.code);
    const solid = await translateText("Tools in One Place", lang.code);
    
    const highlightClean = highlight.replace(/"/g, '\\"');
    const solidClean = solid.replace(/"/g, '\\"');
    const combinedClean = `${highlightClean} ${solidClean}`;
    
    console.log(`[${lang.code}] ${highlightClean} | ${solidClean}`);
    
    // Replace "hero.title"
    const titleRegex = new RegExp(`(  ${lang.code}: {[\\s\\S]*?)(    "hero\\.title":\\s*")[^"]+(",)`, 'g');
    if (fileContent.match(titleRegex)) {
      fileContent = fileContent.replace(titleRegex, `$1    "hero.title": "${combinedClean}",\n    "hero.titleHighlight": "${highlightClean}",\n    "hero.titleSolid": "${solidClean}"$3`);
    } else {
        // if not found, we might need a broader regex or just replace the title line
        const exactTitleRegex = new RegExp(`(  ${lang.code}: {[\\s\\S]*?)(    "hero\\.title":\\s*")[^"]+(",)`, 'g');
        fileContent = fileContent.replace(exactTitleRegex, `$1    "hero.title": "${combinedClean}",\n    "hero.titleHighlight": "${highlightClean}",\n    "hero.titleSolid": "${solidClean}"$3`);
    }
  }
  
  fs.writeFileSync(staticCatalogPath, fileContent, 'utf8');
  console.log('✅ Done updating staticCatalog.ts with new hero title');
}

processTranslations();
