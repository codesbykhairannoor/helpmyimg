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

  // Fix inner cards
  c = c.replace(/className="\s+dark:bg-slate-800/g, 'className="bg-white dark:bg-slate-800');
  c = c.replace(/className="\s+\/80 backdrop-blur-md/g, 'className="bg-slate-900/80 backdrop-blur-md');

  // Fix top level divs
  c = c.replace(/className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden "/g, 'className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden"');
  c = c.replace(/className="w-full flex flex-col items-center gap-16 py-12 bg-\[\#f8fafc\] dark:\s+"/g, 'className="w-full flex flex-col items-center gap-16 py-12"');
  c = c.replace(/className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden \/20"/g, 'className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden"');
  c = c.replace(/className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden dark:bg-\[\#0B1121\]"/g, 'className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden"');

  // Also remove ColorWhiteSections custom background so it aligns with others
  c = c.replace(/className="w-full flex flex-col items-center gap-24 py-16 bg-slate-50 dark:bg-\[\#0a0a0a\]"/g, 'className="w-full flex flex-col items-center gap-24 py-16"');

  fs.writeFileSync(p, c, 'utf8');
}
console.log('Fixed broken classes!');
