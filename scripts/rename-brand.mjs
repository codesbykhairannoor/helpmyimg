import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const searchTerms = [
  { regex: /HelpMyIMG/g, replacement: 'HelpMyIMG' },
  { regex: /helpmyimg\.com/g, replacement: 'helpmyimg.com' },
  { regex: /helpmyimg/g, replacement: 'helpmyimg' },
  { regex: /HELPMYIMG/g, replacement: 'HELPMYIMG' },
  { regex: /Helpmyimg/g, replacement: 'Helpmyimg' }
];

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.git' || file === 'dist' || file === '.vercel' || file === '.vscode' || file === '.agents') continue;
    
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      // Only process text files (skip images, etc)
      if (['.tsx', '.ts', '.html', '.json', '.md', '.cjs', '.mjs', '.js', '.css', '.env', '.txt'].includes(path.extname(fullPath)) || file === 'LICENSE') {
        let content = fs.readFileSync(fullPath, 'utf8');
        let modified = false;
        
        for (const { regex, replacement } of searchTerms) {
          if (content.match(regex)) {
            content = content.replace(regex, replacement);
            modified = true;
          }
        }
        
        if (modified) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

processDirectory(process.cwd());
console.log('Replacement complete!');
