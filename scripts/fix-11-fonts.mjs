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

  // Regex to match <h2, <h3, <h4, <h5 and add font-heading to their className if it's missing
  const addFontHeading = (htmlStr) => {
    return htmlStr.replace(/(<h[2-5][^>]*className=")([^"]*)(")/g, (match, prefix, classes, suffix) => {
      // Check if it already has font-heading
      if (classes.includes('font-heading')) {
        return match;
      }
      return `${prefix}font-heading ${classes}${suffix}`;
    });
  };

  c = addFontHeading(c);
  
  fs.writeFileSync(p, c, 'utf8');
}
console.log('Fixed fonts in 11 components!');
