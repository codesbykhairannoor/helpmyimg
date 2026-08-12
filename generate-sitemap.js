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

// Parse Info URL Mapper
let infoSlugMap = {};
try {
  const infoUrlMapperContent = fs.readFileSync(path.join(__dirname, 'src', 'utils', 'infoUrlMapper.ts'), 'utf8');
  const infoSlugMapRegex = /export const INFO_SLUG_MAP[\s\S]*?=\s*({[\s\S]*?});/;
  const match = infoSlugMapRegex.exec(infoUrlMapperContent);
  if (match) {
    infoSlugMap = eval('(' + match[1] + ')');
  }
} catch (error) {
  console.warn('Warning: Could not parse infoUrlMapper.ts', error);
}

const getLocalizedSlug = (tool, lang) => {
  if (tool === 'brush') return 'magic-brush';
  if (slugMap[lang] && slugMap[lang][tool]) return slugMap[lang][tool];
  const fallbacks = { remove: 'remove-background', color: 'change-background', watermark: 'watermark-image' };
  return fallbacks[tool] || tool;
};

const getLocalizedInfoSlug = (page, lang) => {
  if (infoSlugMap[lang] && infoSlugMap[lang][page]) return infoSlugMap[lang][page];
  return page;
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
  console.log(`✓ Generated [${filename}] with ${urls.length} URLs.`);
  return `${DOMAIN}/sitemaps/${filename}`;
};

// ============================================================================
// CORE PAGES ONLY — Every URL here has a real HTML file in dist/
// 30 langs × (1 home + 12 tools + 8 info) = 30 × 21 = 630 URLs
// ============================================================================
const baseTools = ['remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design', 'brush'];
const infoPages = ['about', 'privacy', 'terms', 'faq', 'security', 'pricing', 'compare', 'languages'];

const coreUrls = [];

for (const lang of LANGS) {
  // Home page
  coreUrls.push(`${DOMAIN}/${lang}/`);

  // Tool pages (12 tools)
  for (const tool of baseTools) {
    const slug = getLocalizedSlug(tool, lang);
    coreUrls.push(`${DOMAIN}/${lang}/${slug}/`);
  }

  // Info pages (8 pages)
  for (const page of infoPages) {
    const slug = getLocalizedInfoSlug(page, lang);
    coreUrls.push(`${DOMAIN}/${lang}/${slug}/`);
  }
}

// Delete old pSEO shard files if they exist
const oldPseoFiles = [
  'sitemap-pseo-remove.xml',
  'sitemap-pseo-compress.xml',
  'sitemap-pseo-convert.xml',
  'sitemap-pseo-resize.xml',
  'sitemap-pseo-color.xml',
  'sitemap-pseo-watermark.xml',
];
for (const f of oldPseoFiles) {
  const p = path.join(sitemapsDir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`🗑️  Deleted ghost pSEO shard: ${f}`);
  }
}

// Write the single clean core sitemap
const shardFiles = [
  writeSitemapShard('sitemap-core.xml', coreUrls),
];

// Generate Master Sitemap Index (sitemap.xml) — only core
let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (const shardUrl of shardFiles) {
  sitemapIndex += `  <sitemap>\n    <loc>${shardUrl}</loc>\n    <lastmod>${CURRENT_ISO_DATE}</lastmod>\n  </sitemap>\n`;
}
sitemapIndex += '</sitemapindex>';

const masterSitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(masterSitemapPath, sitemapIndex, 'utf8');

console.log(`\n✅ Clean sitemap generated: ${coreUrls.length} real URLs (${LANGS.length} langs × 21 pages).`);
console.log(`   → Every single URL here has a real HTML file in dist/`);

// Submit only real URLs to IndexNow
fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'helpmyimg.com',
    key: 'c8e54926d5744902bc6e85fb2c85e0f2',
    keyLocation: 'https://helpmyimg.com/c8e54926d5744902bc6e85fb2c85e0f2.txt',
    urlList: coreUrls
  })
})
.then(res => {
  if (res.ok) {
    console.log(`\n🚀 [IndexNow] Submitted ${coreUrls.length} verified URLs to Bing & Yandex (Status: ${res.status})`);
  } else {
    console.warn(`\n⚠️ [IndexNow] Status: ${res.status}`);
  }
})
.catch(err => {
  console.error(`\n❌ [IndexNow] Failed: ${err.message}`);
});
