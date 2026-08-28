import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '..', 'src', 'data', 'urlmap_4_pages.json');
const tsPath = path.join(__dirname, '..', 'src', 'utils', 'urlMapper.ts');

const urlMap = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let content = fs.readFileSync(tsPath, 'utf8');

const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.match(/^\s*[a-z]{2}(-[A-Z]{2})?:\s*\{/)) {
    // Found a language block e.g., "  ar: { remove: '...', ... }"
    const match = line.match(/^\s*([a-z]{2}(?:-[A-Z]{2})?):\s*\{/);
    if (match) {
      let lang = match[1];
      if (lang === 'zh-CN') lang = 'zh'; // zh uses zh-CN translation in my generation script

      const rem = urlMap['removelogo'][lang];
      const col = urlMap['colorwhite'][lang];
      const comp = urlMap['compress200kb'][lang];
      const res = urlMap['resizepassport'][lang];

      if (rem && col && comp && res) {
         // Insert before the closing brace
         lines[i] = lines[i].replace(/ \}?,?$/, `, removelogo: '${rem}', colorwhite: '${col}', compress200kb: '${comp}', resizepassport: '${res}' },`);
      }
    }
  }
}

fs.writeFileSync(tsPath, lines.join('\n'), 'utf8');
console.log("Updated urlMapper.ts with 4 new tools!");
