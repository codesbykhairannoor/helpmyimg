import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://helpmyimg.com';

// Read public/locales directory to get list of 30 supported languages
const localesDir = path.join(__dirname, 'public', 'locales');
let LANGS = ['en', 'id'];

try {
  LANGS = fs.readdirSync(localesDir).filter(dir => {
    return dir !== 'bg' && fs.statSync(path.join(localesDir, dir)).isDirectory();
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

const FALLBACK_SLUGS = {
  remove: 'remove-background',
  color: 'change-background',
  watermark: 'watermark-image',
  brush: 'magic-brush',
  compress: 'compress-image',
  compress100kb: 'compress-image-to-100kb',
  compress50kb: 'compress-image-to-50kb',
  resizeig: 'resize-image-for-instagram',
  convert: 'convert-image',
  resize: 'resize-image',
  crop: 'crop-image',
  rotate: 'rotate-image',
  picker: 'image-color-picker',
  blurface: 'blur-face',
  design: 'advanced-editor',
  removelogo: 'remove-logo',
  colorwhite: 'change-background-white',
  compress200kb: 'compress-image-to-200kb',
  resizepassport: 'resize-passport',
  removeperson: 'remove-person-from-photo',
  convertwebp: 'convert-webp-to-jpg',
  watermarkbulk: 'batch-watermark-photos',
  blurplate: 'blur-license-plate',
  metadata: 'ai-metadata-cleaner',
  editexif: 'edit-exif',
};

const getLocalizedSlug = (tool, lang) => {
  if (slugMap[lang] && slugMap[lang][tool]) return slugMap[lang][tool];
  return FALLBACK_SLUGS[tool] || tool;
};

const getLocalizedInfoSlug = (page, lang) => {
  if (infoSlugMap[lang] && infoSlugMap[lang][page]) return infoSlugMap[lang][page];
  return page;
};

// Accurate git-based lastmod per path (fallback to file mtime), avoiding fake timestamp churn
const getAccurateLastmod = (relPaths) => {
  try {
    const out = execSync(`git log -1 --format=%cI -- ${relPaths.join(' ')}`, { cwd: __dirname, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    if (out) return out;
  } catch {
    // ignore
  }
  try {
    const mtime = fs.statSync(path.join(__dirname, relPaths[0])).mtime;
    return mtime.toISOString();
  } catch {
    return '2026-11-20T00:00:00.000Z';
  }
};

// Ensure public and sitemaps directories exist
const publicDir = path.join(__dirname, 'public');
const sitemapsDir = path.join(publicDir, 'sitemaps');
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
if (!fs.existsSync(sitemapsDir)) fs.mkdirSync(sitemapsDir, { recursive: true });

const coreTools = new Set(['remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design', 'brush', 'metadata', 'editexif']);

// Helper to write XML sitemap shard
const writeSitemapShard = (filename, entries, lang) => {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  for (const { url, priority, changefreq, lastmod } of entries) {
    xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
  }
  xml += '</urlset>';
  const filePath = path.join(sitemapsDir, filename);
  fs.writeFileSync(filePath, xml, 'utf8');
  console.log(`✓ Generated [${filename}] with ${entries.length} URLs (lang: ${lang}).`);
  return `${DOMAIN}/sitemaps/${filename}`;
};

const baseTools = [
  'remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate',
  'picker', 'blurface', 'design', 'brush', 'compress100kb', 'compress50kb', 'resizeig',
  'removelogo', 'colorwhite', 'compress200kb', 'resizepassport', 'removeperson',
  'convertwebp', 'watermarkbulk', 'blurplate', 'metadata', 'editexif'
];
const infoPages = ['about', 'privacy', 'terms', 'faq', 'security', 'pricing', 'compare', 'languages'];

// Clean stale shard files if any
for (const oldFile of ['sitemap-bg.xml', 'sitemap-core.xml']) {
  const p = path.join(sitemapsDir, oldFile);
  if (fs.existsSync(p)) {
    fs.unlinkSync(p);
    console.log(`🗑️  Deleted stale shard: ${oldFile}`);
  }
}

const allUrls = [];
const shardMeta = [];
const matrixLastmod = getAccurateLastmod(['src/data/pseoKeywords.ts']);
const studioLastmod = getAccurateLastmod(['src/components/workspace/tools/design/AdvancedStudioEditor.tsx']);

for (const lang of LANGS) {
  const localeLastmod = getAccurateLastmod([`public/locales/${lang}/translation.json`]);
  const langEntries = [];

  // Home page
  const homeUrl = lang === 'en' ? `${DOMAIN}/` : `${DOMAIN}/${lang}/`;
  langEntries.push({ url: homeUrl, priority: '1.0', changefreq: 'weekly', lastmod: localeLastmod });

  // Tool pages
  for (const tool of baseTools) {
    const slug = getLocalizedSlug(tool, lang);
    const url = lang === 'en' ? `${DOMAIN}/${slug}/` : `${DOMAIN}/${lang}/${slug}/`;
    const isCore = coreTools.has(tool);
    const lastmod = tool === 'design' ? (studioLastmod > localeLastmod ? studioLastmod : localeLastmod)
      : (!isCore && matrixLastmod > localeLastmod ? matrixLastmod : localeLastmod);
    langEntries.push({
      url,
      priority: isCore ? '0.9' : '0.7',
      changefreq: isCore ? 'weekly' : 'monthly',
      lastmod
    });
  }

  // Info pages
  for (const page of infoPages) {
    const slug = getLocalizedInfoSlug(page, lang);
    const url = lang === 'en' ? `${DOMAIN}/${slug}/` : `${DOMAIN}/${lang}/${slug}/`;
    langEntries.push({
      url,
      priority: page === 'pricing' || page === 'about' || page === 'faq' ? '0.7' : '0.5',
      changefreq: 'monthly',
      lastmod: localeLastmod
    });
  }

  allUrls.push(...langEntries.map(e => e.url));
  const shardUrl = writeSitemapShard(`sitemap-${lang}.xml`, langEntries, lang);
  const shardMaxDate = langEntries.reduce((max, e) => (e.lastmod > max ? e.lastmod : max), localeLastmod);
  shardMeta.push({ shardUrl, lastmod: shardMaxDate });
}

// Generate Master Sitemap Index (sitemap.xml)
let sitemapIndex = '<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
for (const { shardUrl, lastmod } of shardMeta) {
  sitemapIndex += `  <sitemap>\n    <loc>${shardUrl}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>\n`;
}
sitemapIndex += '</sitemapindex>';

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapIndex, 'utf8');

// Generate Valid RSS 2.0 Feed (feed.xml & rss.xml)
const buildDateUtc = new Date(getAccurateLastmod(['public/locales/en/translation.json'])).toUTCString();
let rssXml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">\n  <channel>\n`;
rssXml += `    <title>HelpMyIMG — Client-Side AI Image Processing Platform</title>\n`;
rssXml += `    <link>${DOMAIN}/</link>\n`;
rssXml += `    <description>Privacy-first, in-browser AI image editing suite powered by WebAssembly and WebGPU. Remove backgrounds, clean C2PA/EXIF metadata, compress, resize, and convert images locally with zero server uploads.</description>\n`;
rssXml += `    <language>en</language>\n`;
rssXml += `    <lastBuildDate>${buildDateUtc}</lastBuildDate>\n`;
rssXml += `    <atom:link href="${DOMAIN}/feed.xml" rel="self" type="application/rss+xml" />\n`;

for (const tool of baseTools) {
  const slug = getLocalizedSlug(tool, 'en');
  const toolUrl = `${DOMAIN}/${slug}/`;
  const cleanTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  rssXml += `    <item>\n`;
  rssXml += `      <title>${cleanTitle} — Client-Side AI Tool</title>\n`;
  rssXml += `      <link>${toolUrl}</link>\n`;
  rssXml += `      <guid isPermaLink="true">${toolUrl}</guid>\n`;
  rssXml += `      <description>${cleanTitle} running 100% locally inside your browser via WebAssembly & WebGPU with zero server uploads.</description>\n`;
  rssXml += `      <pubDate>${buildDateUtc}</pubDate>\n`;
  rssXml += `    </item>\n`;
}

rssXml += `  </channel>\n</rss>`;
fs.writeFileSync(path.join(publicDir, 'feed.xml'), rssXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'rss.xml'), rssXml, 'utf8');
console.log(`✓ Generated [feed.xml] and [rss.xml] with ${baseTools.length} tool feeds.`);
console.log(`\n✅ Clean sitemap generated: ${allUrls.length} canonical URLs across ${LANGS.length} language shards with accurate git lastmod.`);
