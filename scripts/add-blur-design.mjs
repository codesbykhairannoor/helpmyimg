import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPPORTED_LANGUAGES = [
  'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tl', 'tr', 'uk', 'vi', 'zh'
];

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  
  // Mapping code exceptions for google-translate-api
  let gLang = targetLang;
  if (targetLang === 'zh') gLang = 'zh-CN';
  if (targetLang === 'he') gLang = 'iw'; // some versions use iw for Hebrew
  
  try {
    const res = await translate(text, { to: gLang });
    return res.text;
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error.message);
    return text; // fallback to English
  }
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function main() {
  const urlMapperPath = path.resolve(__dirname, '../src/utils/urlMapper.ts');
  let urlMapperContent = fs.readFileSync(urlMapperPath, 'utf8');

  for (const lang of SUPPORTED_LANGUAGES) {
    console.log(`Processing ${lang}...`);
    
    // 1. Translate Slugs
    const blurSlugStr = await translateText('blur face', lang);
    const designSlugStr = await translateText('advanced editor', lang);
    
    const blurSlug = slugify(blurSlugStr) || 'blur-face';
    const designSlug = slugify(designSlugStr) || 'advanced-editor';
    
    // Inject into SLUG_MAP
    const langRegex = new RegExp(`${lang}: \\{([\\s\\S]*?)\\}`, 'm');
    const match = urlMapperContent.match(langRegex);
    if (match) {
      if (!match[0].includes('blurface:')) {
        const replacement = match[0].replace(' }', `, blurface: '${blurSlug}', design: '${designSlug}' }`);
        urlMapperContent = urlMapperContent.replace(match[0], replacement);
      }
    }

    // 2. Translate Translation Keys
    const localesPath = path.resolve(__dirname, `../public/locales/${lang}/translation.json`);
    if (fs.existsSync(localesPath)) {
      const json = JSON.parse(fs.readFileSync(localesPath, 'utf8'));
      
      if (!json['nav.blurface']) {
        json['nav.blurface'] = await translateText('Blur Face', lang);
        json['grid.blurfaceDesc'] = await translateText('Automatically detect and blur faces or apply custom censorship boxes.', lang);
        
        json['nav.design'] = await translateText('Design Editor', lang);
        json['grid.designDesc'] = await translateText('Full-featured image studio: filters, draw, stickers, frames, and shapes.', lang);
        
        // Write back
        fs.writeFileSync(localesPath, JSON.stringify(json, null, 2) + '\n');
      }
    }
    
    // Wait slightly to avoid API rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
  
  // Also update urlMapper getToolFromSlug
  if (!urlMapperContent.includes("if (slug === 'blur-face') return 'blurface';")) {
    urlMapperContent = urlMapperContent.replace(
      /if \(slug === 'image-color-picker'\) return 'picker';/,
      `if (slug === 'image-color-picker') return 'picker';\n  if (slug === 'blur-face') return 'blurface';\n  if (slug === 'advanced-editor') return 'design';`
    );
  }
  
  fs.writeFileSync(urlMapperPath, urlMapperContent);
  console.log('Done!');
}

main().catch(console.error);
