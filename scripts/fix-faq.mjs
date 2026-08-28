import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = path.join(__dirname, '..', 'src', 'pages', 'ToolLandingPage.tsx');

let c = fs.readFileSync(p, 'utf8');

c = c.replace(
  /\|\| internalTool === 'resizepassport'\)\) \{\n            <div className="w-full relative/g,
  "|| internalTool === 'resizepassport' || internalTool === 'removeperson' || internalTool === 'convertwebp' || internalTool === 'watermarkbulk' || internalTool === 'blurplate')) {\n            <div className=\"w-full relative"
);

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed ToolLandingPage.tsx FAQ logic');
