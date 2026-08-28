import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const mapperPath = path.join(__dirname, '..', 'src', 'utils', 'urlMapper.ts');
const newMappingsNonKbPath = path.join(__dirname, '..', 'src', 'data', 'urlmap_4_nonkb_pages.json');

// Read the base urlMapper.ts
let mapperContent = fs.readFileSync(mapperPath, 'utf8');
const newMappings = JSON.parse(fs.readFileSync(newMappingsNonKbPath, 'utf8'));
const tools = Object.keys(newMappings); // ['removeperson', 'convertwebp', 'watermarkbulk', 'blurplate']

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh-CN', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

// Add the 4 new tools to each lang object
for (const lang of langs) {
  // It looks like `lang: {`
  const targetObjStart = mapperContent.indexOf(`\n  ${lang}: {`);
  if (targetObjStart === -1) {
    console.warn(`Language ${lang} not found`);
    continue;
  }
  
  const targetObjEnd = mapperContent.indexOf('}', targetObjStart);
  if (targetObjEnd === -1) continue;
  
  let newPairs = [];
  for (const tool of tools) {
     if (newMappings[tool][lang]) {
        // If not already in there
        if (!mapperContent.substring(targetObjStart, targetObjEnd).includes(` ${tool}:`)) {
          newPairs.push(`${tool}: '${newMappings[tool][lang]}'`);
        }
     }
  }
  
  if (newPairs.length > 0) {
     const insertStr = `, ${newPairs.join(', ')} `;
     mapperContent = mapperContent.substring(0, targetObjEnd) + insertStr + mapperContent.substring(targetObjEnd);
  }
}

// 2. Update InternalTool type
const internalToolRegex = /export type InternalTool = (.*?);/;
let currentTools = mapperContent.match(internalToolRegex)[1].split(' | ').map(t => t.replace(/'/g, ''));
for (const t of ['removelogo', 'colorwhite', 'compress200kb', 'resizepassport', ...tools]) {
  if (!currentTools.includes(t)) currentTools.push(t);
}
mapperContent = mapperContent.replace(internalToolRegex, `export type InternalTool = '${currentTools.join("' | '")}';`);

// 3. Update FALLBACK_SLUGS
const fallbackSlugsRegex = /export const FALLBACK_SLUGS: Record<InternalTool, string> = {([\s\S]*?)};/;
let fallbackMatch = mapperContent.match(fallbackSlugsRegex);
if (fallbackMatch) {
  let fallbackContent = fallbackMatch[1];
  for (const t of ['removelogo', 'colorwhite', 'compress200kb', 'resizepassport', ...tools]) {
     if (!fallbackContent.includes(`${t}:`)) {
       // Just put the english slug or something
       let engSlug = t;
       if (t === 'removeperson') engSlug = 'remove-person-from-photo';
       if (t === 'convertwebp') engSlug = 'convert-webp-to-jpg';
       if (t === 'watermarkbulk') engSlug = 'batch-watermark-photos';
       if (t === 'blurplate') engSlug = 'blur-license-plate';
       
       if (t === 'removelogo') engSlug = 'remove-logo';
       if (t === 'colorwhite') engSlug = 'change-background-white';
       if (t === 'compress200kb') engSlug = 'compress-200kb';
       if (t === 'resizepassport') engSlug = 'resize-passport';

       fallbackContent = fallbackContent.trim().replace(/,$/, '') + `,\n  ${t}: '${engSlug}'\n`;
     }
  }
  mapperContent = mapperContent.replace(fallbackSlugsRegex, `export const FALLBACK_SLUGS: Record<InternalTool, string> = {\n  ${fallbackContent}};`);
}

// 4. Update getToolFromSlug
const getToolFromSlugRegex = /return 'remove'; \/\/ Default fallback/;
let additionalChecks = '';
for (const t of ['removelogo', 'colorwhite', 'compress200kb', 'resizepassport', ...tools]) {
  if (!mapperContent.includes(`return '${t}';`)) {
     // I don't strictly need to add it here if REVERSE_LOOKUP works, but let's add it
     let engSlug = t;
     if (t === 'removeperson') engSlug = 'remove-person-from-photo';
     if (t === 'convertwebp') engSlug = 'convert-webp-to-jpg';
     if (t === 'watermarkbulk') engSlug = 'batch-watermark-photos';
     if (t === 'blurplate') engSlug = 'blur-license-plate';
     
     if (t === 'removelogo') engSlug = 'remove-logo';
     if (t === 'colorwhite') engSlug = 'change-background-white';
     if (t === 'compress200kb') engSlug = 'compress-200kb';
     if (t === 'resizepassport') engSlug = 'resize-passport';

     additionalChecks += `  if (slug === '${engSlug}') return '${t}';\n`;
  }
}
mapperContent = mapperContent.replace(getToolFromSlugRegex, `${additionalChecks}\n  return 'remove'; // Default fallback`);


fs.writeFileSync(mapperPath, mapperContent, 'utf8');
console.log('Fully and properly updated urlMapper.ts!');
