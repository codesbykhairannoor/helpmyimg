import fs from 'fs';
let content = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');
content = content.replace(/\s*"slugEn":\s*"[^"]*",\n/g, '\n');
fs.writeFileSync('src/data/pseoKeywords.ts', content);
console.log('Fixed slugEn');
