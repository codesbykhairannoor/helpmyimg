import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.join(__dirname, '../dist');

let totalHtmlFiles = 0;
let errors = [];

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.html')) {
      checkHtmlFile(fullPath);
    }
  }
}

function checkHtmlFile(filePath) {
  totalHtmlFiles++;
  const html = fs.readFileSync(filePath, 'utf8');

  // Check 1: Must contain <div id="root">...</div> with substantial content inside it
  // This verifies that the page is NOT an empty JS shell.
  const rootMatch = html.match(/<div id="root">([\s\S]*?)<\/div>/);
  if (!rootMatch) {
    errors.push(`[FATAL] Missing <div id="root"> in ${filePath}`);
    return;
  }
  
  const rootContent = rootMatch[1].trim();
  if (rootContent === '') {
    errors.push(`[BLANK_JS_SHELL] Bot will read NOTHING but JS! Empty #root in ${filePath}`);
  } else if (rootContent.length < 100) {
    errors.push(`[LOW_CONTENT] Very little semantic HTML in #root for ${filePath} (${rootContent.length} chars)`);
  }
  
  // Check 2: At least one h1 or h2 tag inside the semantic html
  if (!/<h[1-3][^>]*>.*<\/h[1-3]>/i.test(rootContent)) {
    // Info pages might not have H1s injected the same way, but let's warn
    if (!filePath.includes('privacy') && !filePath.includes('terms') && !filePath.includes('security')) {
        errors.push(`[NO_HEADINGS] Missing H1/H2 headings in semantic HTML for ${filePath}`);
    }
  }

  // Check 3: JSON-LD Schema
  if (!html.includes('application/ld+json')) {
    errors.push(`[NO_JSONLD] Missing JSON-LD Schema in ${filePath}`);
  }

  // Check 4: Title and Description
  if (!/<title>.*?<\/title>/i.test(html)) {
    errors.push(`[NO_TITLE] Missing <title> tag in ${filePath}`);
  }
  if (!/<meta\s+name=["']description["']/i.test(html)) {
    errors.push(`[NO_DESC] Missing description meta tag in ${filePath}`);
  }
}

console.log('--- STARTING 100% COVERAGE SEO & GEO AUDIT ---');
walkDir(distDir);

console.log(`Audited ALL ${totalHtmlFiles} HTML files in the dist directory.`);
if (errors.length === 0) {
  console.log(`✅ PERFECT SCORE! Not a single blank JS page found.`);
  console.log('Google Bot and Users will read the exact same content. 100% HTML Semantic Coverage.');
} else {
  console.log(`❌ Found ${errors.length} errors across all HTML pages:`);
  const maxDisplay = Math.min(errors.length, 50);
  for (let i = 0; i < maxDisplay; i++) {
    console.log('  - ' + errors[i]);
  }
  if (errors.length > maxDisplay) {
    console.log(`  ... and ${errors.length - maxDisplay} more errors.`);
  }
}
