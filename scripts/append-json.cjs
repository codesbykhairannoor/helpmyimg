const fs = require('fs');

let tsFile = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');
const newItems = require('../translated_seo.json');

// Convert newItems to a formatted string
let newItemsStr = JSON.stringify(newItems, null, 2);
// Remove the surrounding [ ] brackets and trim
newItemsStr = newItemsStr.trim();
newItemsStr = newItemsStr.substring(1, newItemsStr.length - 1).trim();

// Find the last index of `];`
const closingBracketIndex = tsFile.lastIndexOf('];');
if (closingBracketIndex !== -1) {
  // Check if we need a comma
  const beforeBracket = tsFile.substring(0, closingBracketIndex).trimEnd();
  const needsComma = !beforeBracket.endsWith(',');
  
  const insertion = (needsComma ? ',\n  ' : '\n  ') + newItemsStr + '\n';
  const updatedTsFile = tsFile.substring(0, closingBracketIndex) + insertion + tsFile.substring(closingBracketIndex);
  
  fs.writeFileSync('src/data/pseoKeywords.ts', updatedTsFile);
  console.log('Successfully appended SEO data to pseoKeywords.ts');
} else {
  console.error('Could not find closing bracket ]; in pseoKeywords.ts');
}
