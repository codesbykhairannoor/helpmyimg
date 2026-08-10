const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'i18n', 'staticCatalog.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Regex to find each language object
const regex = /("[a-z]{2}(-[A-Z]{2})?":\s*{[\s\S]*?)(?=},?\s*"[a-z]{2}(-[A-Z]{2})?":|}];?)/g;

content = content.replace(regex, (match) => {
  // If it already has brush.resetMask, skip
  if (match.includes('"brush.resetMask"')) {
    return match;
  }
  
  // Inject the key at the end of the object
  const injection = `\n    "brush.resetMask": "Reset Edits"`;
  
  return match + ',' + injection;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected brush.resetMask translations into staticCatalog.ts');
