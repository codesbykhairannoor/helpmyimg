import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.join(__dirname, '..', 'src', 'components', 'landing', 'tools');

const files = [
  'Compress50kbSections.tsx',
  'Compress100kbSections.tsx',
  'Compress200kbSections.tsx',
  'ResizeIgSections.tsx',
  'ResizePassportSections.tsx',
  'RemoveLogoSections.tsx',
  'ColorWhiteSections.tsx',
  'RemovePersonSections.tsx',
  'ConvertWebpSections.tsx',
  'WatermarkBulkSections.tsx',
  'BlurPlateSections.tsx'
];

for (const f of files) {
  const p = path.join(toolsDir, f);
  if (!fs.existsSync(p)) continue;
  
  let c = fs.readFileSync(p, 'utf8');

  // Replace text-white unless it's inside a specific component that needs it (like a colored button or badge)
  // Let's do a safe replace: 'text-white ' -> 'text-slate-900 dark:text-white '
  // We avoid replacing it if it's already dark:text-white
  // But wait, there are buttons with bg-blue-600 text-white. We don't want to break those!
  // Instead of a global replace, I'll just target `text-white` that is NOT preceded by `dark:` or followed by something that implies a button (like inside a rounded-full pill).
  // Actually, the simplest way is to manually replace it in WatermarkBulkSections since that was the one explicitly designed as "Dark Mode Pro".
  
  if (f === 'WatermarkBulkSections.tsx') {
    c = c.replace(/text-white/g, 'text-slate-900 dark:text-white');
    c = c.replace(/text-slate-300/g, 'text-slate-600 dark:text-slate-300');
    // Fix any double dark:text-white
    c = c.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
  }
  
  if (f === 'RemovePersonSections.tsx') {
    // RemovePerson is also a bit dark-mode heavy in some parts.
    c = c.replace(/text-white/g, 'text-slate-900 dark:text-white');
    c = c.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
    // wait, button text? bg-purple-600/90 text-slate-900 dark:text-white -> this makes button text black in light mode. Not ideal but readable.
    // Better to manually fix the button back to text-white.
    c = c.replace(/bg-purple-600\/90 backdrop-blur-md text-slate-900 dark:text-white/g, 'bg-purple-600/90 backdrop-blur-md text-white');
  }

  // Same for BlurPlateSections
  if (f === 'BlurPlateSections.tsx') {
    c = c.replace(/text-white/g, 'text-slate-900 dark:text-white');
    c = c.replace(/text-slate-900 dark:text-slate-900 dark:text-white/g, 'text-slate-900 dark:text-white');
    c = c.replace(/text-slate-300/g, 'text-slate-600 dark:text-slate-300');
    // restore badge text
    c = c.replace(/bg-red-500 text-slate-900 dark:text-white/g, 'bg-red-500 text-white');
  }

  fs.writeFileSync(p, c, 'utf8');
}
console.log('Fixed text colors in dark-themed sections!');
