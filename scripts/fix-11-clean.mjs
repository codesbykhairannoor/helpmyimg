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

  // 1. Fix the top-level div background. 
  // It usually looks like <div className="w-full flex flex-col items-center gap-24 py-12 overflow-hidden bg-slate-900">
  // We want to just remove the bg-slate-900 or bg-[#0a0a0a] or bg-slate-50
  c = c.replace(/className="([^"]*?)\s*(bg-slate-900|bg-\[\#0a0a0a\]|bg-\[\#0B1120\]|bg-slate-50\s*dark:bg-\[\#0a0a0a\]|bg-slate-50\s*dark:bg-slate-900|bg-white)\s*([^"]*?)"/, 'className="$1 $3"');
  // cleanup multiple spaces
  c = c.replace(/className="([^"]*?)\s{2,}([^"]*?)"/g, 'className="$1 $2"');

  // 2. Avoid duplicating Hero h1 and description. 
  // If the first section uses {config.h1}, change it to {config.extraSectionTitle || config.h1}
  c = c.replace(/\{config\.h1\}/g, '{config.extraSectionTitle || config.h1}');
  c = c.replace(/\{config\.description\}/g, '{config.extraSectionDesc || config.description}');

  // 3. Specifically fix ColorWhiteSections hardcoded string
  c = c.replace(/Amazon Ready in <span className="text-orange-500">Seconds<\/span>/g, '{config.extraSectionTitle || "Amazon Ready"}');
  c = c.replace(/\{config\.citationFirst\}/g, '{config.extraSectionDesc || config.description}');

  // 4. Specifically fix WatermarkBulkSections hardcoded strings and text colors
  c = c.replace(/>\s*Watermark Hundreds of Photos at Once\s*</g, '>{config.extraSectionTitle || "Watermark Photos"}<');
  c = c.replace(/>\s*Add your logo or text watermark to multiple images simultaneously. Protect your photography portfolio in seconds.\s*</g, '>{config.extraSectionDesc || "Protect your portfolio"}<');
  // Fix text colors in WatermarkBulkSections that were forced white
  c = c.replace(/text-white mb-6 leading-tight/g, 'text-slate-900 dark:text-white mb-6 leading-tight');
  c = c.replace(/text-slate-300 max-w-3xl/g, 'text-slate-600 dark:text-slate-300 max-w-3xl');

  // 5. Check if any text is still unreadable in light mode. 
  // In WatermarkBulkSections: `bg-slate-800` is used for cards, which is okay if it's explicitly styled as dark cards, but maybe better to make it responsive
  c = c.replace(/bg-slate-800 rounded-xl/g, 'bg-white dark:bg-slate-800 shadow-md dark:shadow-none rounded-xl');
  
  fs.writeFileSync(p, c, 'utf8');
}
console.log('Cleaned up 11 components!');
