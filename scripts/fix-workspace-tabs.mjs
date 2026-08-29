import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = path.join(__dirname, '..', 'src', 'components', 'workspace', 'ToolWorkspace.tsx');

let c = fs.readFileSync(p, 'utf8');

// Update the function signature
c = c.replace(
  /export function ToolWorkspace\(\{ initialTab = 'remove' \}: \{ initialTab\?: TabType \}\) \{/g,
  `export function ToolWorkspace({ initialTab: rawInitialTab = 'remove' }: { initialTab?: TabType | string }) {
  const resolveBaseTab = (tab: string): TabType => {
    switch(tab) {
      case 'colorwhite': return 'color';
      case 'watermarkbulk': return 'watermark';
      case 'removeperson': return 'brush';
      case 'removelogo': return 'brush';
      case 'convertwebp': return 'convert';
      case 'blurplate': return 'blurface';
      case 'resizeig': return 'resize';
      case 'resizepassport': return 'resize';
      case 'compress50kb': return 'compress';
      case 'compress100kb': return 'compress';
      case 'compress200kb': return 'compress';
      default: return tab as TabType;
    }
  };
  const initialTab = resolveBaseTab(rawInitialTab);
`
);

// We should also handle the TabType if it's strictly used, but redefining initialTab inside the function body shadows the prop perfectly.

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed ToolWorkspace.tsx tabs!');
