import fs from 'fs';
import path from 'path';
import pkg from 'lingva-scraper';
const { lingva } = pkg;

const filePath = path.resolve('src/data/pseoKeywords.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const toolsToTranslate = [
  'compress100kb', 'compress50kb', 'compress200kb', 'resizeig',
  'resizepassport', 'removelogo', 'colorwhite', 'removeperson',
  'convertwebp', 'watermarkbulk', 'blurplate'
];

async function translateText(text, targetLang) {
  if (!text) return text;
  // map languages to Google Translate codes
  let lang = targetLang;
  if (lang === 'zh') lang = 'zh-CN';
  if (lang === 'he') lang = 'iw'; // Google translate uses iw for hebrew
  
  try {
    const res = await lingva('en', lang, text);
    return res.text;
  } catch(e) {
    console.error(`Error translating to ${lang}: ${e.message}`);
    return text;
  }
}

// Instead of parsing TS with AST, we'll use a regex that matches the whole object block
// But PSEO_KEYWORD_MATRIX is large.
// The easiest way is to import it, modify the JS object, and then re-serialize to string?
// No, it has TS types and `export const PSEO_KEYWORD_MATRIX = [...]`.
// We can just use string replacement on specific fields!

// Let's create a regex to match each object in the array
// We need to match { tool: '...', lang: '...', title: '...', ... }

async function main() {
  console.log('Starting translation using Lingva Scraper...');
  
  // We'll iterate through all tools and all languages
  // Since modifying the 790KB file via regex is tricky, we can do it line by line
  let lines = content.split('\n');
  
  let currentLang = '';
  let currentTool = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    const toolMatch = line.match(/"tool":\s*"([^"]+)"/);
    if (toolMatch) currentTool = toolMatch[1];
    
    const langMatch = line.match(/"lang":\s*"([^"]+)"/);
    if (langMatch) currentLang = langMatch[1];
    
    if (currentLang && currentLang !== 'en' && currentLang !== 'id' && toolsToTranslate.includes(currentTool)) {
      
      // We found a line to translate
      if (line.includes('"h1":')) {
        const textMatch = line.match(/"h1":\s*"([^"]+)"/);
        if (textMatch) {
          const translated = await translateText(textMatch[1], currentLang);
          lines[i] = line.replace(`"${textMatch[1]}"`, `"${translated.replace(/"/g, '\\"')}"`);
          console.log(`[${currentLang}] ${currentTool} h1 -> ${translated}`);
        }
      }
      
      if (line.includes('"description":')) {
        const textMatch = line.match(/"description":\s*"([^"]+)"/);
        if (textMatch) {
          const translated = await translateText(textMatch[1], currentLang);
          lines[i] = line.replace(`"${textMatch[1]}"`, `"${translated.replace(/"/g, '\\"')}"`);
        }
      }
      
      if (line.includes('"extraSectionTitle":')) {
        const textMatch = line.match(/"extraSectionTitle":\s*"([^"]+)"/);
        if (textMatch) {
          const translated = await translateText(textMatch[1], currentLang);
          lines[i] = line.replace(`"${textMatch[1]}"`, `"${translated.replace(/"/g, '\\"')}"`);
        }
      }
      
      if (line.includes('"extraSectionDesc":')) {
        const textMatch = line.match(/"extraSectionDesc":\s*"([^"]+)"/);
        if (textMatch) {
          const translated = await translateText(textMatch[1], currentLang);
          lines[i] = line.replace(`"${textMatch[1]}"`, `"${translated.replace(/"/g, '\\"')}"`);
        }
      }
      
      if (line.includes('"beforeImageLabel":')) {
        const textMatch = line.match(/"beforeImageLabel":\s*"([^"]+)"/);
        if (textMatch) {
          const translated = await translateText(textMatch[1], currentLang);
          lines[i] = line.replace(`"${textMatch[1]}"`, `"${translated.replace(/"/g, '\\"')}"`);
        }
      }
      
      if (line.includes('"afterImageLabel":')) {
        const textMatch = line.match(/"afterImageLabel":\s*"([^"]+)"/);
        if (textMatch) {
          const translated = await translateText(textMatch[1], currentLang);
          lines[i] = line.replace(`"${textMatch[1]}"`, `"${translated.replace(/"/g, '\\"')}"`);
        }
      }
      
    }
  }
  
  fs.writeFileSync(filePath, lines.join('\n'));
  console.log('Finished translating pseoKeywords.ts!');
}

main();
