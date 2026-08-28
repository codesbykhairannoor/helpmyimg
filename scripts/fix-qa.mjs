import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tsPath = path.join(__dirname, '..', 'src', 'data', 'pseoKeywords.ts');

let content = fs.readFileSync(tsPath, 'utf8');
content = content.replace(/\{"q":/g, '{"question":');
content = content.replace(/,"a":/g, ',"answer":');

fs.writeFileSync(tsPath, content, 'utf8');
console.log('Fixed q/a to question/answer in pseoKeywords.ts');
