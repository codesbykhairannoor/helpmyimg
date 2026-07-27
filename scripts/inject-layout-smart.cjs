const fs = require('fs');
const path = require('path');
const map = {
  'LandingSections.tsx': 'grid',
  'DesignSections.tsx': 'bento',
  'CropSections.tsx': 'split',
  'ResizeSections.tsx': 'list',
  'RotateSections.tsx': 'cards',
  'WatermarkSections.tsx': 'minimal',
  'ConvertSections.tsx': 'bento',
  'PickerSections.tsx': 'split',
  'BlurFaceSections.tsx': 'list',
  'ColorBgSections.tsx': 'cards',
  'CompressSections.tsx': 'minimal',
  'RemoveBgSections.tsx': 'grid'
};

for (const [file, variant] of Object.entries(map)) {
  const isTool = file !== 'LandingSections.tsx';
  const filepath = isTool ? 'src/components/landing/tools/' + file : 'src/components/landing/' + file;
  let c = fs.readFileSync(filepath, 'utf8');

  // Strip existing SYSTEM ARCHITECTURE block
  c = c.replace(/\s*\{\/\*\s*(?:[0-9]+\.\s*)?SYSTEM ARCHITECTURE[\s\S]*?<\/section>/g, '');
  
  const importStr = isTool ? "import { SystemArchitecture } from '../SystemArchitecture';\n" : "import { SystemArchitecture } from './SystemArchitecture';\n";
  
  if (!c.includes('<SystemArchitecture')) {
    // Inject import after first import
    c = c.replace(/(import .*;\n)/, '$1' + importStr);
    
    const tag = `\n      {/* SYSTEM ARCHITECTURE - Variant: ${variant} */}\n      <SystemArchitecture variant="${variant}" />\n`;
    
    if (c.includes('<HowItWorks')) {
      c = c.replace(/<HowItWorks/, tag + '      <HowItWorks');
    } else {
      c = c.replace(/<\/div>\n\s*\);\n};/, tag + '    </div>\n  );\n};');
    }
  }

  // Smart remove unused icons
  const iconsToCheck = ['Lock', 'Zap', 'Sparkles', 'Shield'];
  
  c = c.replace(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g, (match, p1) => {
    let icons = p1.split(',').map(s => s.trim()).filter(Boolean);
    let keptIcons = [];
    
    for (const icon of icons) {
      if (iconsToCheck.includes(icon)) {
        // Check if this icon is used anywhere else in the file (besides the import statement itself)
        // A simple check: match `<IconName`
        const usageRegex = new RegExp('<' + icon + '[\\s>]', 'g');
        if (usageRegex.test(c)) {
          keptIcons.push(icon); // Keep it, it's used!
        }
      } else {
        keptIcons.push(icon);
      }
    }
    
    if (keptIcons.length === 0) return '';
    return `import { ${keptIcons.join(', ')} } from 'lucide-react'`;
  });
  
  fs.writeFileSync(filepath, c);
  console.log('Processed', file);
}
