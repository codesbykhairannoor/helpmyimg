const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'i18n', 'staticCatalog.ts');
let content = fs.readFileSync(filePath, 'utf8');

// The emoji might be 🖌️ or 🖌️ 
content = content.replace(/"tab\.brush":\s*"🖌️\s*/g, '"tab.brush": "');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully removed brush emoji from all translations');
