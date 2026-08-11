const fs = require('fs');
const path = require('path');

// 1. Hero.tsx
const heroPath = path.join(__dirname, '../src/components/Hero.tsx');
if (fs.existsSync(heroPath)) {
  let heroContent = fs.readFileSync(heroPath, 'utf8');
  heroContent = heroContent.replace(/clamp\(1\.8rem,\s*4\.5vw,\s*4\.5rem\)/g, 'clamp(2.5rem, 6vw, 4.5rem)');
  fs.writeFileSync(heroPath, heroContent);
  console.log('Updated Hero.tsx');
}

// 2. All files in landing/, seo/, pages/
function replaceInDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const fullPath = path.join(dir, f);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (f.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const newContent = content.replace(/clamp\(1\.8rem,\s*4vw,\s*2\.5rem\)/g, 'clamp(1.5rem, 4vw, 2.5rem)');
      if (newContent !== content) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated typography in ${f}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, '../src/components/landing'));
replaceInDir(path.join(__dirname, '../src/components/seo'));
replaceInDir(path.join(__dirname, '../src/pages'));
