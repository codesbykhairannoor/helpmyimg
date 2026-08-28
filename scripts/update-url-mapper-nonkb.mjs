import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputPath = path.join(__dirname, '..', 'src', 'data', 'urlmap_4_nonkb_pages.json');
const mapperPath = path.join(__dirname, '..', 'src', 'utils', 'urlMapper.ts');

const newMappings = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
let mapperContent = fs.readFileSync(mapperPath, 'utf8');

const tools = Object.keys(newMappings);

// The format of SLUG_MAP is:
// export const SLUG_MAP: Record<string, Record<string, string>> = {
//   'id': { 'remove': 'hapus-latar-belakang', ... },
//   'en': { 'remove': 'remove-background', ... }
// }

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh-CN', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

for (const lang of langs) {
  const targetObjStart = mapperContent.indexOf(`'${lang}': {`);
  if (targetObjStart === -1) continue;
  
  const targetObjEnd = mapperContent.indexOf('},', targetObjStart);
  if (targetObjEnd === -1) continue;
  
  let newPairs = [];
  for (const tool of tools) {
     if (newMappings[tool][lang]) {
        newPairs.push(`'${tool}': '${newMappings[tool][lang]}'`);
     }
  }
  
  if (newPairs.length > 0) {
     const insertStr = `, ${newPairs.join(', ')}`;
     mapperContent = mapperContent.substring(0, targetObjEnd) + insertStr + mapperContent.substring(targetObjEnd);
  }
}

fs.writeFileSync(mapperPath, mapperContent, 'utf8');
console.log('Updated urlMapper.ts with 4 new tools!');
