import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://helpmyimg.com';
const CURRENT_ISO_DATE = new Date().toISOString();

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
  const slugMapRegex = /export const SLUG_MAP[\s\S]*?=\s*({[\s\S]*?});/;
  const match = slugMapRegex.exec(urlMapperContent);
  if (match) {
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

// Ensure public and sitemaps directories exist
const publicDir = path.join(__dirname, 'public');
const sitemapsDir = path.join(publicDir, 'sitemaps');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(sitemapsDir)) fs.mkdirSync(sitemapsDir, { recursive: true });

// Helper to write XML sitemap shard
const writeSitemapShard = (filename, urls) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const url of urls) {
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${CURRENT_ISO_DATE}</lastmod>\n  </url>\n`;
  }
  xml += '</urlset>';
  const filePath = path.join(sitemapsDir, filename);
  fs.writeFileSync(filePath, xml, 'utf8');
  console.log(`✓ Generated shard [${filename}] with ${urls.length} URLs.`);
  return `${DOMAIN}/sitemaps/${filename}`;
};

const coreUrls = [];
const removeUrls = [];
const compressUrls = [];
const convertUrls = [];
const resizeUrls = [];
const colorUrls = [];
const watermarkUrls = [];

const baseTools = ['remove', 'brush', 'color', 'watermark', 'compress', 'convert', 'resize'];
const infoPages = ['about', 'privacy', 'terms', 'faq'];

// 1. Core Hub URLs & Info Pages
for (const lang of LANGS) {
  coreUrls.push(`${DOMAIN}/${lang}`);
  for (const info of infoPages) {
    coreUrls.push(`${DOMAIN}/${lang}/${info}`);
  }
  for (const tool of baseTools) {
    const slug = getLocalizedSlug(tool, lang);
    coreUrls.push(`${DOMAIN}/${lang}/${slug}`);
  }
}

// 2. Extract Static pSEO Slugs from src/data/pseoKeywords.ts
try {
  const pseoContent = fs.readFileSync(path.join(__dirname, 'src', 'data', 'pseoKeywords.ts'), 'utf8');
  const objectRegex = /{[^{}]*slug:\s*['"]([^'"]+)['"][^{}]*tool:\s*['"]([^'"]+)['"][^{}]*lang:\s*['"]([^'"]+)['"]/g;
  let match;
  while ((match = objectRegex.exec(pseoContent)) !== null) {
    const slug = match[1];
    const tool = match[2];
    const lang = match[3];
    const route = getLocalizedSlug(tool, lang);
    const url = `${DOMAIN}/${lang}/${route}/${slug}`;
    if (tool === 'remove' || tool === 'brush') removeUrls.push(url);
    else if (tool === 'compress') compressUrls.push(url);
    else if (tool === 'convert') convertUrls.push(url);
    else if (tool === 'resize' || tool === 'crop') resizeUrls.push(url);
    else if (tool === 'color') colorUrls.push(url);
    else if (tool === 'watermark') watermarkUrls.push(url);
    else coreUrls.push(url);
  }
} catch (error) {
  console.warn('Could not read pseoKeywords.ts', error);
}

// 3. Dynamic pSEO Generators across 30 Languages
const objects = ['image', 'photo', 'logo', 'car', 'product', 'person', 'signature', 'portrait', 'animal', 'graphics'];
const contexts = ['online', 'free', 'hd', 'fast', 'no-watermark', 'for-ecommerce', 'bulk'];

for (const lang of LANGS) {
  // Remove BG
  let count = 0;
  for (const action of ['remove-background', 'transparent-bg', 'erase-bg']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('remove', lang);
        removeUrls.push(`${DOMAIN}/${lang}/${slug}/${action}-from-${obj}-${ctx}`);
        count++;
      }
    }
  }

  // Compress
  count = 0;
  const compressActions = [
    'kompres-foto-100kb', 'kompres-foto-200kb', 'kompres-foto-50kb', 'compress-image-to-100kb', 'comprimir-foto-a-100kb',
    'kompres-20-foto-sekaligus', 'kompres-50-foto-batch', 'compress-20-photos-batch', 'compress-50-photos-at-once',
    'kompres-pas-foto-cpns-100kb', 'reduce-photo-size-under-100kb', 'bulk-compress-30-images'
  ];
  const compressTargets = ['online-gratis', 'free-no-watermark', 'tanpa-pecah', 'hd-quality', 'fast-zip-download', 'ecommerce-catalog', 'untuk-ktp-ijazah'];
  for (const action of compressActions) {
    for (const tgt of compressTargets) {
      if (count >= 200) break;
      const slug = getLocalizedSlug('compress', lang);
      compressUrls.push(`${DOMAIN}/${lang}/${slug}/${action}-${tgt}`);
      count++;
    }
  }

  // Convert
  count = 0;
  const convertActions = [
    'convert-30-photos-to-webp', 'konversi-20-foto-ke-jpg', 'png-to-webp-batch-50-photos', 'convert-format-in-bulk',
    'change-png-to-jpg-20-files', 'konversi-massal-foto-produk', 'webp-converter-for-shopify', 'convert-image-format-free'
  ];
  const convertTargets = ['online-free', 'gratis-tanpa-kuota', 'download-zip-instan', 'high-definition', 'batch-processing'];
  for (const action of convertActions) {
    for (const tgt of convertTargets) {
      if (count >= 200) break;
      const slug = getLocalizedSlug('convert', lang);
      convertUrls.push(`${DOMAIN}/${lang}/${slug}/${action}-${tgt}`);
      count++;
    }
  }

  // Resize
  count = 0;
  for (const action of ['resize-dimensions', 'make-4x6', 'scale-1080p']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('resize', lang);
        resizeUrls.push(`${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}`);
        count++;
      }
    }
  }

  // Color (Change BG)
  count = 0;
  for (const action of ['change-background-color', 'red-background-cpns', 'blue-background-ktp']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('color', lang);
        colorUrls.push(`${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}`);
        count++;
      }
    }
  }

  // Watermark
  count = 0;
  for (const action of ['add-watermark', 'watermark-image', 'protect-copyright']) {
    for (const obj of objects) {
      for (const ctx of contexts) {
        if (count >= 100) break;
        const slug = getLocalizedSlug('watermark', lang);
        watermarkUrls.push(`${DOMAIN}/${lang}/${slug}/${action}-for-${obj}-${ctx}`);
        count++;
      }
    }
  }
}

// Generate all shards
const shardFiles = [
  writeSitemapShard('sitemap-core.xml', coreUrls),
  writeSitemapShard('sitemap-pseo-remove.xml', removeUrls),
  writeSitemapShard('sitemap-pseo-compress.xml', compressUrls),
  writeSitemapShard('sitemap-pseo-convert.xml', convertUrls),
  writeSitemapShard('sitemap-pseo-resize.xml', resizeUrls),
  writeSitemapShard('sitemap-pseo-color.xml', colorUrls),
  writeSitemapShard('sitemap-pseo-watermark.xml', watermarkUrls)
];

// Generate Master Sitemap Index (sitemap.xml) inside public/
let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (const shardUrl of shardFiles) {
  sitemapIndex += `  <sitemap>\n    <loc>${shardUrl}</loc>\n    <lastmod>${CURRENT_ISO_DATE}</lastmod>\n  </sitemap>\n`;
}
sitemapIndex += '</sitemapindex>';

const masterSitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(masterSitemapPath, sitemapIndex, 'utf8');

const totalUrls = coreUrls.length + removeUrls.length + compressUrls.length + convertUrls.length + resizeUrls.length + colorUrls.length + watermarkUrls.length;
console.log(`\n🚀 Successfully generated Master Sitemap Index [sitemap.xml] pointing to 7 shards featuring ${totalUrls} URLs with ISO 8601 lastmod!`);
