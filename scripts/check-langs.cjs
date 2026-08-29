const fs = require('fs');
const lines = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');
const langs = new Set([...lines.matchAll(/"lang":\s*"([^"]+)"/g)].map(m => m[1]));
console.log([...langs]);
