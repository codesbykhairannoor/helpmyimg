const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (f.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // 1. Hero Title: clamp(2.5rem, 6vw, 4.5rem) -> clamp(2.2rem, 6vw, 4.5rem)
      content = content.replace(/clamp\(2\.5rem,\s*6vw,\s*4\.5rem\)/g, 'clamp(2.2rem, 6vw, 4.5rem)');
      
      // 2. Hero Description: clamp(1.05rem, 2vw, 1.25rem) -> clamp(0.9rem, 2vw, 1.25rem)
      content = content.replace(/clamp\(1\.05rem,\s*2vw,\s*1\.25rem\)/g, 'clamp(0.9rem, 2vw, 1.25rem)');

      // 3. Section Titles: clamp(1.5rem, 4vw, 2.5rem) -> clamp(1.35rem, 4vw, 2.5rem)
      content = content.replace(/clamp\(1\.5rem,\s*4vw,\s*2\.5rem\)/g, 'clamp(1.35rem, 4vw, 2.5rem)');
      
      // 4. Section Descriptions (hardcoded '1.15rem' or '1.1rem'):
      // Replace fontSize: '1.15rem' with fontSize: 'clamp(0.95rem, 3vw, 1.15rem)'
      content = content.replace(/fontSize:\s*'1\.15rem'/g, "fontSize: 'clamp(0.95rem, 3vw, 1.15rem)'");
      content = content.replace(/fontSize:\s*'1\.1rem'/g, "fontSize: 'clamp(0.95rem, 3vw, 1.1rem)'");
      
      // Also some descriptions might be using class="text-lg" or similar, but the user explicitly mentioned inline styles. Let's rely on the replacements above.

      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(path.join(__dirname, '../src/components'));
replaceInDir(path.join(__dirname, '../src/pages'));
console.log('Typography updated successfully.');
