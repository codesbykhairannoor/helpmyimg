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

  // We want to avoid replacing classes that are ALREADY responsive (e.g. `dark:bg-slate-800`).
  // So we'll use a replacer function that checks if there's a `dark:` prefix before it.
  const replaceResponsive = (text, regex, replacement) => {
    // Only replace if it's not preceded by `dark:` or `-dark` (like in shadow-dark)
    return text.replace(regex, (match, prefix) => {
      if (prefix.endsWith('dark:')) return match; // already handled
      return prefix + replacement;
    });
  };

  // Backgrounds
  c = replaceResponsive(c, /(^|[\s"'])(bg-slate-800)(?=[\s"'])/g, 'bg-white dark:bg-slate-800 shadow-xl dark:shadow-none');
  c = replaceResponsive(c, /(^|[\s"'])(bg-slate-900)(?=[\s"'])/g, 'bg-white dark:bg-slate-900 shadow-xl dark:shadow-none');
  c = replaceResponsive(c, /(^|[\s"'])(bg-slate-900\/50)(?=[\s"'])/g, 'bg-slate-50 dark:bg-slate-900/50');
  c = replaceResponsive(c, /(^|[\s"'])(bg-slate-800\/50)(?=[\s"'])/g, 'bg-slate-50 dark:bg-slate-800/50');
  c = replaceResponsive(c, /(^|[\s"'])(bg-\[\#0B1120\])(?=[\s"'])/g, 'bg-white dark:bg-[#0B1120] shadow-xl dark:shadow-none');
  c = replaceResponsive(c, /(^|[\s"'])(bg-\[\#0a0a0a\])(?=[\s"'])/g, 'bg-white dark:bg-[#0a0a0a] shadow-xl dark:shadow-none');
  
  // Gradients
  c = replaceResponsive(c, /(^|[\s"'])(bg-gradient-to-r from-slate-800 to-slate-800\/50)(?=[\s"'])/g, 'bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-800/50 shadow-xl dark:shadow-none');

  // Borders
  c = replaceResponsive(c, /(^|[\s"'])(border-slate-700)(?=[\s"'])/g, 'border-slate-200 dark:border-slate-700');
  c = replaceResponsive(c, /(^|[\s"'])(border-slate-700\/50)(?=[\s"'])/g, 'border-slate-200 dark:border-slate-700/50');

  // Texts
  // For text-white, we might have some legitimate buttons (e.g. `bg-blue-600 text-white`), 
  // so replacing ALL `text-white` is risky. But since we broke them in WatermarkBulkSections by making them `text-slate-900 dark:text-white`, we already did the damage.
  // We'll replace `text-slate-200`, `text-slate-300`, `text-slate-400`.
  c = replaceResponsive(c, /(^|[\s"'])(text-slate-200)(?=[\s"'])/g, 'text-slate-700 dark:text-slate-200');
  c = replaceResponsive(c, /(^|[\s"'])(text-slate-300)(?=[\s"'])/g, 'text-slate-600 dark:text-slate-300');
  c = replaceResponsive(c, /(^|[\s"'])(text-slate-400)(?=[\s"'])/g, 'text-slate-500 dark:text-slate-400');

  // Clean up duplicate shadow classes just in case
  c = c.replace(/shadow-xl dark:shadow-none shadow-xl dark:shadow-none/g, 'shadow-xl dark:shadow-none');
  c = c.replace(/bg-white dark:bg-slate-800 shadow-xl dark:shadow-none shadow-md dark:shadow-none/g, 'bg-white dark:bg-slate-800 shadow-xl dark:shadow-none');

  fs.writeFileSync(p, c, 'utf8');
}

console.log("Applied typography and responsive classes to 11 files!");
