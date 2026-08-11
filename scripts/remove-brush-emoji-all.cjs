const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

let count = 0;
for (const lang of languages) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Remove "🖌️ " or just "🖌️" from the beginning of the translation value for "tab.brush"
    // Example: "tab.brush": "🖌️ Manual Brush" -> "tab.brush": "Manual Brush"
    const newContent = content.replace(/"tab\.brush":\s*"🖌️\s*/g, '"tab.brush": "');
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      count++;
    }
  }
}

console.log(`Successfully removed brush emoji from ${count} language JSONs.`);

// Also fix staticCatalog
const staticPath = path.join(__dirname, '..', 'src', 'i18n', 'staticCatalog.ts');
if (fs.existsSync(staticPath)) {
  let content = fs.readFileSync(staticPath, 'utf8');
  const newContent = content.replace(/"tab\.brush":\s*"🖌️\s*/g, '"tab.brush": "');
  if (newContent !== content) {
    fs.writeFileSync(staticPath, newContent, 'utf8');
    console.log(`Successfully removed brush emoji from staticCatalog.ts`);
  }
}
