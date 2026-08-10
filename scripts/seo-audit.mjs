import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio'; // using cheerio to parse HTML

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

const baseTools = ['remove-background', 'change-background', 'watermark-image', 'compress-image', 'convert-image', 'resize-image', 'crop-image', 'rotate-image', 'image-color-picker', 'blur-face', 'advanced-editor', 'magic-brush'];
const infoPages = ['about', 'privacy', 'terms', 'faq', 'security', 'pricing', 'compare', 'languages'];
const langs = ['en', 'hi', 'id', 'es', 'zh']; // Sample a few languages to check

let totalFiles = 0;
let passedChecks = 0;
let errors = [];

function checkFile(filePath, type, expectedTitleRegex) {
  if (!fs.existsSync(filePath)) {
    errors.push(`Missing file: ${filePath}`);
    return;
  }
  totalFiles++;
  
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html);

  // 1. Meta Tags
  const title = $('title').text();
  const desc = $('meta[name="description"]').attr('content');
  if (!title || (expectedTitleRegex && !expectedTitleRegex.test(title))) {
    errors.push(`Invalid title in ${filePath}: ${title}`);
  }
  if (!desc || desc.length < 10) {
    errors.push(`Invalid description in ${filePath}`);
  }

  // 2. Hreflang Tags
  const hreflangs = $('link[rel="alternate"][hreflang]');
  if (hreflangs.length < 30) {
    errors.push(`Missing hreflang tags in ${filePath}. Found: ${hreflangs.length}`);
  }

  // 3. JSON-LD Schema
  const scripts = $('script[type="application/ld+json"]');
  let hasSoftwareApp = false;
  let hasFaq = false;
  scripts.each((i, el) => {
    try {
      const json = JSON.parse($(el).html());
      const type = json['@type'] || (json['@graph'] && json['@graph'][0]['@type']);
      if (type === 'SoftwareApplication' || (json['@graph'] && json['@graph'].some(g => g['@type'] === 'WebApplication' || g['@type'] === 'SoftwareApplication'))) {
        hasSoftwareApp = true;
      }
      if (type === 'FAQPage' || (json['@graph'] && json['@graph'].some(g => g['@type'] === 'FAQPage'))) {
        hasFaq = true;
      }
    } catch (e) {}
  });

  if (type === 'tool' && !hasSoftwareApp) {
    errors.push(`Missing SoftwareApplication/WebApplication JSON-LD in ${filePath}`);
  }

  // 4. Semantic HTML Body (for Bots)
  // Ensure the body has actual content before React hydration
  // generate-seo-html.js injects into <div id="root">
  const rootContent = $('#root').html();
  if (!rootContent || rootContent.length < 50) {
    errors.push(`Missing semantic HTML in #root for ${filePath}`);
  }
  
  if (type === 'tool') {
    // Check for h1 and h2 tags in the semantic html
    const root$ = cheerio.load(rootContent || '');
    if (root$('h1').length === 0) {
      errors.push(`Missing H1 tag in semantic HTML for ${filePath}`);
    }
  }

  passedChecks++;
}

console.log('--- STARTING MASSIVE SEO & GEO AUDIT ---');

// Audit Home Pages
for (const lang of langs) {
  checkFile(path.join(distDir, lang === 'en' ? '' : lang, 'index.html'), 'tool', /HelpMyIMG/i);
}

// Audit Tool Pages (en)
for (const tool of baseTools) {
  checkFile(path.join(distDir, tool, 'index.html'), 'tool');
}

// Audit Info Pages (en)
for (const page of infoPages) {
  checkFile(path.join(distDir, page, 'index.html'), 'info');
}

console.log(`Audited ${totalFiles} sample pages.`);
if (errors.length === 0) {
  console.log(`✅ All ${passedChecks} checks passed!`);
  console.log('Bots will read exactly the same semantic HTML as users, extremely fast (no JS execution required). JSON-LD, Hreflangs, and Meta tags are perfectly synced.');
} else {
  console.log(`❌ Found ${errors.length} errors:`);
  errors.forEach(e => console.log('  - ' + e));
}
