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

  // Remove `import React from 'react';`
  c = c.replace(/import React from 'react';\r?\n/g, '');
  
  // Remove `motion` from framer-motion
  c = c.replace(/import \{ motion \} from 'framer-motion';\r?\n/g, '');

  if (f === 'ResizeIgSections.tsx') {
     c = c.replace(/ArrowRight, /g, '');
     c = c.replace(/, ArrowRight/g, '');
  }

  fs.writeFileSync(p, c, 'utf8');
}
console.log('Fixed final TS errors specifically');
