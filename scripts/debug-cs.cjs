const fs = require('fs');
const content = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');
const regex = /\{\s*"slug":\s*"[^"]*",\s*"tool":\s*"compress50kb",\s*"lang":\s*"cs"[\s\S]*?\}/g;
const match = regex.exec(content);
console.log(match ? match[0] : 'Not found');
