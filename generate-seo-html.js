import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://helpmyimg.com';

// Setup directories
const publicDir = path.join(__dirname, 'public');
const localesDir = path.join(publicDir, 'locales');
const distDir = path.join(__dirname, 'dist');

// Make sure build happened
if (!fs.existsSync(distDir)) {
  console.error('dist/ directory not found. Please run vite build first.');
  process.exit(1);
}

// 1. Get supported languages
let LANGS = ['en'];
try {
  LANGS = fs.readdirSync(localesDir).filter(dir => {
    return fs.statSync(path.join(localesDir, dir)).isDirectory();
  });
} catch (error) {
  console.warn('Warning: Could not read public/locales. Using default languages.');
}

// 2. Parse URL Mapper to get localized tool slugs
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
  return fallbacks[tool] || tool;
};

// Tool identifiers
const TOOLS = ['remove', 'compress', 'convert', 'resize', 'color', 'watermark', 'crop', 'rotate', 'upscale', 'blurface'];

// Read the original index.html built by Vite
const indexHtmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Strip hardcoded hreflang tags from the base HTML
let baseHtmlContent = indexHtmlContent.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n?\s*/g, '');
baseHtmlContent = baseHtmlContent.replace(/<!-- Static Hreflang Tags for 30 Languages -->\n?\s*/g, '');

// Function to generate the modified HTML
const generateHtml = (lang, urlPath, seoTitle, seoDesc, tool = null) => {
  let html = baseHtmlContent;

  // 0. Remove any existing meta descriptions to avoid duplicates
  html = html.replace(/<meta name="description"[^>]*>\n?\s*/gi, '');

  // 1. Replace <html lang="en">
  html = html.replace(/<html lang="[^"]+">/i, `<html lang="${lang}">`);

  // 2. Replace <title>
  html = html.replace(/<title>.*?<\/title>/i, `<title>${seoTitle}</title>`);

  // 3. Inject <meta name="description"> right after <title>
  const metaDesc = `<meta name="description" content="${seoDesc}" />`;
  const canonical = `<link rel="canonical" href="${DOMAIN}${urlPath}" />`;
  const ogTitle = `<meta property="og:title" content="${seoTitle}" />`;
  const ogDesc = `<meta property="og:description" content="${seoDesc}" />`;
  
  html = html.replace(/(<\/title>)/i, `$1\n    ${metaDesc}\n    ${canonical}\n    ${ogTitle}\n    ${ogDesc}`);

  // 4. Generate and inject dynamic hreflangs for THIS specific route
  let dynamicHreflangs = `<!-- Dynamic Localized Hreflang Tags -->\n`;
  for (const l of LANGS) {
    let targetPath = `/${l}/`;
    if (tool) targetPath = `/${l}/${getLocalizedSlug(tool, l)}/`;
    dynamicHreflangs += `    <link rel="alternate" hreflang="${l}" href="${DOMAIN}${targetPath}" />\n`;
  }
  let xDefaultPath = `/en/`;
  if (tool) xDefaultPath = `/en/${getLocalizedSlug(tool, 'en')}/`;
  dynamicHreflangs += `    <link rel="alternate" hreflang="x-default" href="${DOMAIN}${xDefaultPath}" />\n`;

  html = html.replace(/(<\/head>)/i, `${dynamicHreflangs}  $1`);

  return html;
};

// Create directories and write files
let generatedCount = 0;

for (const lang of LANGS) {
  let translations = {};
  try {
    translations = JSON.parse(fs.readFileSync(path.join(localesDir, lang, 'translation.json'), 'utf8'));
  } catch (e) {
    console.error(`Missing or invalid translation.json for ${lang}`);
    continue;
  }

  // Generate Home Page (/lang/)
  const homeTitle = translations['hero.title'] ? `${translations['hero.title']} - HelpMyIMG` : 'HelpMyIMG - Free AI Image Editor';
  const homeDesc = translations['hero.subtitle'] || translations['seo.jsonld.description'] || 'Free local AI photo editor. Remove backgrounds, compress, resize.';
  
  const homeHtml = generateHtml(lang, `/${lang}/`, homeTitle, homeDesc);
  const homeDir = path.join(distDir, lang);
  if (!fs.existsSync(homeDir)) fs.mkdirSync(homeDir, { recursive: true });
  fs.writeFileSync(path.join(homeDir, 'index.html'), homeHtml, 'utf8');
  generatedCount++;

  // Generate Tool Pages (/lang/slug/)
  for (const tool of TOOLS) {
    const slug = getLocalizedSlug(tool, lang);
    const toolUrl = `/${lang}/${slug}/`;
    
    // Tools have specific SEO names if they exist, otherwise fallback to home
    let toolTitle = translations[`seo.jsonld.name.${tool}`] || translations[`tab.${tool}`] || translations[`tool.${tool}`] || translations['hero.title'];
    toolTitle = `${toolTitle} - HelpMyIMG`;
    
    let toolDesc = translations[`seo.jsonld.desc.${tool}`] || homeDesc;
    
    // Slight specific tweak based on known keys in translation.json
    if (tool === 'remove' && translations['tab.remove']) {
      toolTitle = `${translations['tab.remove']} - HelpMyIMG`;
    }

    const toolHtml = generateHtml(lang, toolUrl, toolTitle, toolDesc, tool);
    const toolDir = path.join(distDir, lang, slug);
    if (!fs.existsSync(toolDir)) fs.mkdirSync(toolDir, { recursive: true });
    fs.writeFileSync(path.join(toolDir, 'index.html'), toolHtml, 'utf8');
    generatedCount++;
  }
}

console.log(`✅ Successfully generated ${generatedCount} localized SEO HTML Shells in dist/`);
