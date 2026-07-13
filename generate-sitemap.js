import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://helpmyimg.com';
const PSEO_ROUTES = [
  '/', 
  '/remove-background', 
  '/blur-background', 
  '/change-background',
  '/watermark-image'
]; 

// Read the public/locales directory to get the list of supported languages
const localesDir = path.join(__dirname, 'public', 'locales');
let LANGS = ['en', 'id'];

try {
  LANGS = fs.readdirSync(localesDir).filter(dir => {
    return fs.statSync(path.join(localesDir, dir)).isDirectory();
  });
} catch (error) {
  console.warn('Warning: Could not read public/locales. Using default languages.');
}

// Parse URL Mapper to get localized tool slugs
let slugMap = {};
try {
  const urlMapperContent = fs.readFileSync(path.join(__dirname, 'src', 'utils', 'urlMapper.ts'), 'utf8');
  // Match the SLUG_MAP object
  const slugMapRegex = /export const SLUG_MAP[\s\S]*?=\s*({[\s\S]*?});/;
  const match = slugMapRegex.exec(urlMapperContent);
  if (match) {
    // Basic evaluation since it's just a JSON-like object
    slugMap = eval('(' + match[1] + ')');
  }
} catch (error) {
  console.warn('Warning: Could not parse urlMapper.ts', error);
}

const getLocalizedSlug = (tool, lang) => {
  if (tool === 'brush') return 'magic-brush';
  if (slugMap[lang] && slugMap[lang][tool]) return slugMap[lang][tool];
  const fallbacks = { remove: 'remove-background', color: 'change-background', watermark: 'watermark-image' };
  return fallbacks[tool] || fallbacks['remove'];
};

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n';

let totalUrls = 0;

const baseTools = ['remove', 'brush', 'color', 'watermark', 'compress', 'convert', 'resize'];

for (const tool of baseTools) {
  for (const lang of LANGS) {
    const slug = getLocalizedSlug(tool, lang);
    const url = `${DOMAIN}/${lang}/${slug}`;
    sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
    totalUrls++;
  }
}

// Add root language urls
for (const lang of LANGS) {
  sitemap += `  <url>\n    <loc>${DOMAIN}/${lang}</loc>\n  </url>\n`;
  totalUrls++;
}

// Extract pSEO slugs from src/data/pseoKeywords.ts
try {
  const pseoContent = fs.readFileSync(path.join(__dirname, 'src', 'data', 'pseoKeywords.ts'), 'utf8');
  
  // Find all objects in the array
  const objectRegex = /{[^{}]*slug:\s*['"]([^'"]+)['"][^{}]*tool:\s*['"]([^'"]+)['"][^{}]*lang:\s*['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = objectRegex.exec(pseoContent)) !== null) {
    const slug = match[1];
    const tool = match[2];
    const lang = match[3];
    
    // Get localized route
    const route = getLocalizedSlug(tool, lang);

    const url = `${DOMAIN}/${lang}/${route}/${slug}`;
    sitemap += `  <url>\n    <loc>${url}</loc>\n  </url>\n`;
    totalUrls++;
  }
} catch (error) {
  console.warn('Could not read pseoKeywords.ts', error);
}

// ---------------------------------------------------------
// MASSIVE DYNAMIC PSEO GENERATOR (100+ Keywords per Language)
// ---------------------------------------------------------
const actions = ['remove-background', 'transparent-bg', 'erase-bg', 'delete-background'];
const objects = ['image', 'photo', 'logo', 'car', 'product', 'person', 'signature', 'portrait', 'animal', 'graphics'];
const contexts = ['online', 'free', 'hd', 'fast', 'no-watermark', 'for-ecommerce', 'bulk'];

for (const lang of LANGS) {
  let count = 0;
  
  // 1. Remove BG Generator
  for (const action of ['remove-background', 'transparent-bg', 'erase-bg']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break; 
        const slug = getLocalizedSlug('remove', lang);
        sitemap += `  <url>\n    <loc>${DOMAIN}/${lang}/${slug}/${action}-from-${obj}-${ctx}</loc>\n  </url>\n`;
        totalUrls++; count++;
      }
    }
  }

  // 2. Compress Generator
  count = 0;
  for (const action of ['compress-image', 'reduce-size', 'make-200kb']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('compress', lang);
        sitemap += `  <url>\n    <loc>${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}</loc>\n  </url>\n`;
        totalUrls++; count++;
      }
    }
  }

  // 3. Convert Generator
  count = 0;
  for (const action of ['convert-format', 'change-to-jpg', 'png-to-webp']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('convert', lang);
        sitemap += `  <url>\n    <loc>${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}</loc>\n  </url>\n`;
        totalUrls++; count++;
      }
    }
  }

  // 4. Resize Generator
  count = 0;
  for (const action of ['resize-dimensions', 'make-4x6', 'scale-1080p']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('resize', lang);
        sitemap += `  <url>\n    <loc>${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}</loc>\n  </url>\n`;
        totalUrls++; count++;
      }
    }
  }

  // 5. Color (Change BG) Generator
  count = 0;
  for (const action of ['change-background-color', 'red-background-cpns', 'blue-background-ktp']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('color', lang);
        sitemap += `  <url>\n    <loc>${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}</loc>\n  </url>\n`;
        totalUrls++; count++;
      }
    }
  }

  // 6. Watermark Generator
  count = 0;
  for (const action of ['add-watermark', 'watermark-image', 'protect-copyright']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('watermark', lang);
        sitemap += `  <url>\n    <loc>${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}</loc>\n  </url>\n`;
        totalUrls++; count++;
      }
    }
  }
}

sitemap += '</urlset>';

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap, 'utf8');
console.log(`Successfully generated sitemap.xml with ${totalUrls} URLs.`);
