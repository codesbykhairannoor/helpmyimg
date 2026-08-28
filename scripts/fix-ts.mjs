import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const toolsDir = path.join(__dirname, '..', 'src', 'components', 'landing', 'tools');
const files = fs.readdirSync(toolsDir);

for (const f of files) {
  if (!f.endsWith('.tsx')) continue;
  let p = path.join(toolsDir, f);
  let c = fs.readFileSync(p, 'utf8');

  // Fix `const { lang } = useRouter();`
  c = c.replace(/const \{ lang \} = useRouter\(\);/g, 'const { route } = useRouter();\n  const lang = route.lang;');

  // Fix `config.extraSectionItems` -> `(config.extraSectionItems || [])`
  c = c.replace(/config\.extraSectionItems/g, '(config.extraSectionItems || [])');
  c = c.replace(/config\.extraSection2Items/g, '(config.extraSection2Items || [])');

  // Specific unused imports to remove
  c = c.replace(/import React from 'react';\n/g, '');

  // RemovePersonSections.tsx
  if (f === 'RemovePersonSections.tsx') {
     c = c.replace(/import \{ motion \} from 'framer-motion';\n/g, '');
  }
  
  // ResizeIgSections.tsx
  if (f === 'ResizeIgSections.tsx') {
     c = c.replace(/Layout, /, '');
     c = c.replace(/ArrowRight, /, '');
  }

  // ResizePassportSections.tsx
  if (f === 'ResizePassportSections.tsx') {
     c = c.replace(/Briefcase, /, '');
  }

  // WatermarkBulkSections.tsx
  if (f === 'WatermarkBulkSections.tsx') {
     c = c.replace(/Copy, /, '');
  }

  // ColorWhiteSections.tsx
  if (f === 'ColorWhiteSections.tsx') {
     c = c.replace(/import \{ motion \} from 'framer-motion';\n/g, '');
  }

  // Compress200kbSections.tsx
  if (f === 'Compress200kbSections.tsx') {
     c = c.replace(/FileDown, /, '');
     c = c.replace(/Gauge, /, '');
     c = c.replace(/Cpu, /, '');
  }
  
  // RemoveLogoSections.tsx
  if (f === 'RemoveLogoSections.tsx') {
     c = c.replace(/Sparkles, /, '');
     c = c.replace(/, ArrowRight/, '');
  }
  
  fs.writeFileSync(p, c, 'utf8');
}
console.log('Fixed TS errors specifically');
