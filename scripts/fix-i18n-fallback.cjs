const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'src', 'components', 'seo');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

let totalReplaced = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex matches: t('key') || 'Fallback string'
  // Handles single or double quotes for both the key and the fallback.
  // Uses non-greedy match for fallback string to handle escaped quotes if any, up to the unescaped closing quote.
  const regex = /t\((['"])([^'"]+)\1\)\s*\|\|\s*(['"])(.*?)(?<!\\)\3/g;
  
  let matchCount = 0;
  const newContent = content.replace(regex, (match, p1, key, p3, fallback) => {
    matchCount++;
    return `t('${key}', { defaultValue: ${p3}${fallback}${p3} })`;
  });
  
  if (matchCount > 0) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${file} (${matchCount} replacements)`);
    totalReplaced += matchCount;
  }
}

console.log(`Total replacements: ${totalReplaced}`);
