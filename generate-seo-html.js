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

const getLocalizedInfoSlug = (page, lang) => {
  if (infoSlugMap[lang] && infoSlugMap[lang][page]) return infoSlugMap[lang][page];
  return page; // EN fallback is the same as the page id
};

// Tool identifiers
const TOOLS = ['remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design', 'brush'];

// Info page identifiers
const INFO_PAGES = ['about', 'privacy', 'terms', 'faq', 'security', 'pricing', 'compare', 'languages'];

// Read the original index.html built by Vite
const indexHtmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Strip hardcoded hreflang tags from the base HTML
let baseHtmlContent = indexHtmlContent.replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n?\s*/g, '');
baseHtmlContent = baseHtmlContent.replace(/<!-- Static Hreflang Tags for 30 Languages -->\n?\s*/g, '');

// Function to generate the modified HTML
const generateHtml = (lang, urlPath, seoTitle, seoDesc, tool = null, translations = {}) => {
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

  // 4.5. Inject JSON-LD Structured Data for True GEO (Generative Engine Optimization)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": seoTitle,
        "url": `${DOMAIN}${urlPath}`,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires WebAssembly support. Chrome 89+, Safari 15+, Firefox 79+",
        "description": seoDesc,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  const faqEntities = [];
  const maxFaq = !tool ? 4 : 5;
  for (let i = 1; i <= maxFaq; i++) {
    const q = !tool ? translations[`faq${i}.q`] : translations[`landing.${tool}.faq${i}.q`];
    const a = !tool ? translations[`faq${i}.a`] : translations[`landing.${tool}.faq${i}.a`];
    if (q && a) {
      faqEntities.push({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a }
      });
    }
  }

  if (faqEntities.length > 0) {
    jsonLd["@graph"].push({
      "@type": "FAQPage",
      "mainEntity": faqEntities
    });
  }

  const jsonLdScript = `    <script type="application/ld+json">\n${JSON.stringify(jsonLd)}\n    </script>\n`;

  html = html.replace(/(<\/head>)/i, `${dynamicHreflangs}${jsonLdScript}  $1`);

  // 5. Inject Semantic HTML into <div id="root"> for True White-Hat SEO (Hydration Replacement)
  let semanticHtml = '';
  // Use standard Screen Reader Only (sr-only) CSS to hide the raw HTML from human eyes (preventing flash) 
  // while keeping it 100% accessible to Google Bot, LLM Crawlers, and Screen Readers.
  const containerStyle = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;';
  
  if (!tool) {
    const h1 = translations['hero.title'] || 'HelpMyIMG AI Platform';
    const p1 = translations['hero.subtitle'] || '';
    const h2Feat = translations['features.title'] || 'Features';
    const pFeat = translations['features.desc'] || '';
    const h2Faq = translations['faq.title'] || 'FAQ';
    
    let faqs = '';
    for (let i = 1; i <= 4; i++) {
      const q = translations[`faq${i}.q`];
      const a = translations[`faq${i}.a`];
      if (q) faqs += `<h3>${q}</h3><p>${a}</p>`;
    }

    semanticHtml = `
      <div style="${containerStyle}">
        <header>
          <h1>${h1}</h1>
          <p>${p1}</p>
        </header>
        <section>
          <h2>${h2Feat}</h2>
          <p>${pFeat}</p>
        </section>
        <section>
          <h2>${h2Faq}</h2>
          ${faqs}
        </section>
      </div>
    `;
  } else {
    const h1 = translations[`landing.${tool}.why.title`] || translations[`seo.jsonld.name.${tool}`] || tool;
    const p1 = translations[`landing.${tool}.why.desc`] || translations[`seo.jsonld.desc.${tool}`] || '';
    const h2Work = translations[`landing.${tool}.work.title`] || 'How it Works';
    const pWork = translations[`landing.${tool}.work.desc`] || '';
    const h2Who = translations[`landing.${tool}.who.title`] || 'Who is it for?';
    const pWho = translations[`landing.${tool}.who.desc`] || '';
    const h2Faq = translations[`landing.${tool}.faqTitle`] || 'FAQ';
    
    let faqs = '';
    for (let i = 1; i <= 5; i++) {
      const q = translations[`landing.${tool}.faq${i}.q`];
      const a = translations[`landing.${tool}.faq${i}.a`];
      if (q) faqs += `<h3>${q}</h3><p>${a}</p>`;
    }

    semanticHtml = `
      <div style="${containerStyle}">
        <header>
          <h1>${h1}</h1>
          <p>${p1}</p>
        </header>
        <section>
          <h2>${h2Work}</h2>
          <p>${pWork}</p>
        </section>
        <section>
          <h2>${h2Who}</h2>
          <p>${pWho}</p>
        </section>
        <section>
          <h2>${h2Faq}</h2>
          ${faqs}
        </section>
      </div>
    `;
  }

  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${semanticHtml}</div>`);

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
  // Use home.tab.title to EXACTLY match what the React app renders in the browser tab
  const homeTitle = translations['home.tab.title'] || (translations['hero.title'] ? `${translations['hero.title']} - HelpMyIMG` : 'HelpMyIMG | All Image Tools in One Place');
  const homeDesc = translations['hero.subtitle.short'] || translations['hero.subtitle'] || translations['seo.jsonld.description'] || 'Free local AI photo editor. Remove backgrounds, compress, resize.';
  
  const homeHtml = generateHtml(lang, `/${lang}/`, homeTitle, homeDesc, null, translations);
  const homeDir = path.join(distDir, lang);
  if (!fs.existsSync(homeDir)) fs.mkdirSync(homeDir, { recursive: true });
  fs.writeFileSync(path.join(homeDir, 'index.html'), homeHtml, 'utf8');
  generatedCount++;

  // For English, also overwrite the base root index.html for root domain SEO
  if (lang === 'en') {
    fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml, 'utf8');
    generatedCount++;
  }

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

    const toolHtml = generateHtml(lang, toolUrl, toolTitle, toolDesc, tool, translations);
    const toolDir = path.join(distDir, lang, slug);
    if (!fs.existsSync(toolDir)) fs.mkdirSync(toolDir, { recursive: true });
    fs.writeFileSync(path.join(toolDir, 'index.html'), toolHtml, 'utf8');
    generatedCount++;

    // For English, also duplicate to the root level for SEO
    if (lang === 'en') {
      const rootToolDir = path.join(distDir, slug);
      if (!fs.existsSync(rootToolDir)) fs.mkdirSync(rootToolDir, { recursive: true });
      fs.writeFileSync(path.join(rootToolDir, 'index.html'), toolHtml, 'utf8');
      generatedCount++;
    }
  }

  // Generate Info Pages (/lang/info-page/)
  for (const page of INFO_PAGES) {
    const slug = getLocalizedInfoSlug(page, lang);
    const pageUrl = `/${lang}/${slug}/`;
    
    // Info pages have localized titles in their respective namespaces (using footer/nav keys for conciseness)
    let pageTitleKey = `footer.${page}`;
    if (page === 'faq') pageTitleKey = 'nav.faq';
    
    let pageTitle = translations[pageTitleKey] || page;
    pageTitle = `${pageTitle} - HelpMyIMG`;
    
    let pageDesc = translations[`${page}.subtitle`] || translations[`${page}.intro`] || homeDesc;
    
    const pageHtml = generateHtml(lang, pageUrl, pageTitle, pageDesc, null, translations);
    const pageDir = path.join(distDir, lang, slug);
    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf8');
    generatedCount++;

    // For English info pages, also duplicate to the root level for SEO
    if (lang === 'en') {
      const rootPageDir = path.join(distDir, slug);
      if (!fs.existsSync(rootPageDir)) fs.mkdirSync(rootPageDir, { recursive: true });
      fs.writeFileSync(path.join(rootPageDir, 'index.html'), pageHtml, 'utf8');
      generatedCount++;
    }
  }
}

console.log(`✅ Successfully generated ${generatedCount} localized SEO HTML Shells in dist/`);
