import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputPath = path.join(__dirname, '..', 'src', 'data', 'translated_4_nonkb_pages.json');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'pseoKeywords.ts');

const newConfigs = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

let currentContent = fs.readFileSync(outputPath, 'utf8');

const closingBracketIndex = currentContent.lastIndexOf('];');

if (closingBracketIndex !== -1) {
  const objectsString = newConfigs.map(c => `,\n  ${JSON.stringify(c, null, 2).replace(/\n/g, '\n  ')}`).join('');
  
  const newContent = currentContent.substring(0, closingBracketIndex) + objectsString + '\n' + currentContent.substring(closingBracketIndex);
  
  fs.writeFileSync(outputPath, newContent, 'utf8');
  console.log(`✅ Injected ${newConfigs.length} objects into pseoKeywords.ts`);
} else {
  console.error("Could not find ]; in pseoKeywords.ts");
}
