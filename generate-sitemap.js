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
    // Set changefreq and priority based on URL depth
    const isHome = url.endsWith(`/${url.split('/').filter(Boolean)[0]}/`);
    const priority = isHome ? '1.0' : '0.8';
    const changefreq = isHome ? 'weekly' : 'monthly';
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${CURRENT_ISO_DATE}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }
  xml += '</urlset>';
  const filePath = path.join(sitemapsDir, filename);
  fs.writeFileSync(filePath, xml, 'utf8');
  console.log(`✓ Generated [${filename}] with ${urls.length} URLs.`);
  return `${DOMAIN}/sitemaps/${filename}`;
};

// ============================================================================
// CORE PAGES — Per-language sitemaps for optimal crawl budget management
// Each language gets its own sitemap shard.
// This follows the Google recommendation for multilingual sites:
// https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites
// ============================================================================
const baseTools = ['remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design', 'brush', 'compress100kb', 'compress50kb', 'resizeig', 'removelogo', 'colorwhite', 'compress200kb', 'resizepassport', 'removeperson', 'convertwebp', 'watermarkbulk', 'blurplate'];
const infoPages = ['about', 'privacy', 'terms', 'faq', 'security', 'pricing', 'compare', 'languages'];

// Delete old pSEO shard files if they exist
const oldPseoFiles = [
  'sitemap-pseo-remove.xml',
  'sitemap-pseo-compress.xml',
  'sitemap-pseo-convert.xml',
  'sitemap-pseo-resize.xml',
  'sitemap-pseo-color.xml',
  'sitemap-pseo-watermark.xml',
  'sitemap-core.xml',  // Also remove the old monolithic file
];
for (const f of oldPseoFiles) {
  const p = path.join(sitemapsDir, f);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`🗑️  Deleted old shard: ${f}`);
  }
}

const allUrls = [];
const shardFiles = [];

// Generate one sitemap per language (better crawl budget management)
for (const lang of LANGS) {
  const langUrls = [];

  // Home page
  if (lang === 'en') {
    langUrls.push(`${DOMAIN}/`);
  } else {
    langUrls.push(`${DOMAIN}/${lang}/`);
  }

  // Tool pages
  for (const tool of baseTools) {
    const slug = getLocalizedSlug(tool, lang);
    if (lang === 'en') {
      langUrls.push(`${DOMAIN}/${slug}/`);
    } else {
      langUrls.push(`${DOMAIN}/${lang}/${slug}/`);
    }
  }

  // Info pages
  for (const page of infoPages) {
    const slug = getLocalizedInfoSlug(page, lang);
    if (lang === 'en') {
      langUrls.push(`${DOMAIN}/${slug}/`);
    } else {
      langUrls.push(`${DOMAIN}/${lang}/${slug}/`);
    }
  }

  allUrls.push(...langUrls);
  const shardUrl = writeSitemapShard(`sitemap-${lang}.xml`, langUrls);
  shardFiles.push(shardUrl);
}

// Generate Master Sitemap Index (sitemap.xml) — per-language shards
let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (const shardUrl of shardFiles) {
  sitemapIndex += `  <sitemap>\n    <loc>${shardUrl}</loc>\n    <lastmod>${CURRENT_ISO_DATE}</lastmod>\n  </sitemap>\n`;
}
sitemapIndex += '</sitemapindex>';

const masterSitemapPath = path.join(publicDir, 'sitemap.xml');
fs.writeFileSync(masterSitemapPath, sitemapIndex, 'utf8');

// Generate Valid RSS 2.0 Feed (feed.xml & rss.xml) for search engines and RSS aggregators
let rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n`;
rssXml += `    <title>HelpMyIMG — In-Browser AI Photo Editor Suite</title>\n`;
rssXml += `    <link>${DOMAIN}/</link>\n`;
rssXml += `    <description>100% Free, Private, In-Browser AI Image Editing Suite via WebAssembly. Remove backgrounds, compress, resize, and convert images.</description>\n`;
rssXml += `    <language>en</language>\n`;
rssXml += `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>\n`;
rssXml += `    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />\n`;

for (const tool of baseTools) {
  const slug = getLocalizedSlug(tool, 'en');
  const toolUrl = `${DOMAIN}/${slug}/`;
  const cleanTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  rssXml += `    <item>\n`;
  rssXml += `      <title>${cleanTitle} - Free Online Tool</title>\n`;
  rssXml += `      <link>${toolUrl}</link>\n`;
  rssXml += `      <guid isPermaLink="true">${toolUrl}</guid>\n`;
  rssXml += `      <description>Free ${cleanTitle} tool running 100% client-side with zero server uploads.</description>\n`;
  rssXml += `      <pubDate>${new Date().toUTCString()}</pubDate>\n`;
  rssXml += `    </item>\n`;
}

rssXml += `  </channel>\n</rss>`;
fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf8');
console.log(`✓ Generated [feed.xml] and [rss.xml] with ${baseTools.length} tool feeds.`);

console.log(`\n✅ Clean sitemap generated: ${allUrls.length} real URLs across ${LANGS.length} per-language shards.`);
console.log(`   → sitemap.xml points to ${shardFiles.length} language-specific sitemaps`);
console.log(`   → Every URL has a real HTML file in dist/`);

// ===========================
// NOTE: Google deprecated the sitemap ping endpoint in June 2023
// (https://www.google.com/ping?sitemap=...) - it no longer works.
//
// To notify Google of sitemap updates, use one of these instead:
// 1. Google Search Console > Sitemaps > Re-submit (manual, instant)
// 2. Google Indexing API — run: npm run google-index (requires service account)
//    See: scripts/submit-google-indexing-api.mjs for setup instructions
// ===========================
console.log(`\n📡 [Google] Sitemap at ${DOMAIN}/sitemap.xml`);
console.log(`   → Auto-notification NOT available (Google deprecated sitemap ping in 2023)`);
console.log(`   → To notify Google: run 'npm run google-index' OR re-submit in Search Console`);

// Submit only real URLs to IndexNow (Bing + Yandex)
fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: 'helpmyimg.com',
    key: 'c8e54926d5744902bc6e85fb2c85e0f2',
    keyLocation: 'https://helpmyimg.com/c8e54926d5744902bc6e85fb2c85e0f2.txt',
    urlList: allUrls
  })
})
.then(res => {
  if (res.ok) {
    console.log(`🚀 [IndexNow] Submitted ${allUrls.length} URLs to Bing & Yandex (Status: ${res.status})`);
  } else {
    console.warn(`⚠️ [IndexNow] Status: ${res.status}`);
  }
})
.catch(err => {
  console.error(`❌ [IndexNow] Failed: ${err.message}`);
});
