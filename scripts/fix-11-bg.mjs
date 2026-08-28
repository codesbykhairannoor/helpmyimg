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
  if (!fs.existsSync(p)) {
    console.log(`Missing: ${f}`);
    continue;
  }
  let c = fs.readFileSync(p, 'utf8');

  // Fix backgrounds on the main wrapper
  c = c.replace(/className="(.*?)(bg-slate-900|bg-\[\#0a0a0a\]|bg-\[\#0B1120\]|bg-slate-50 dark:bg-\[\#0a0a0a\]|bg-slate-50 dark:bg-slate-900)(.*?)"/, 'className="$1w-full flex flex-col items-center gap-16 py-8 overflow-hidden$3"');

  // Fix hardcoded H1 and Descriptions in the "Hero" parts if they exist
  // We don't want to show config.h1 and config.description again since ToolLandingPage already shows it!
  // We'll replace config.h1 with config.extraSectionTitle and config.description with config.extraSectionDesc for the first section.
  c = c.replace(/\{config\.h1\}/g, '{config.extraSectionTitle || config.h1}');
  c = c.replace(/\{config\.description\}/g, '{config.extraSectionDesc || config.description}');

  // In ColorWhiteSections:
  c = c.replace(
    /Amazon Ready in <span className="text-orange-500">Seconds<\/span>/g,
    '{config.extraSectionTitle || "Amazon Ready"}'
  );
  
  // In WatermarkBulkSections:
  c = c.replace(
    />\s*Watermark Hundreds of Photos at Once\s*</g,
    '>{config.extraSectionTitle || "Watermark Photos"}<'
  );
  c = c.replace(
    />\s*Add your logo or text watermark to multiple images simultaneously. Protect your photography portfolio in seconds.\s*</g,
    '>{config.extraSectionDesc || "Protect your portfolio"}<'
  );

  fs.writeFileSync(p, c, 'utf8');
}
console.log('Fixed backgrounds and titles in 11 files!');
