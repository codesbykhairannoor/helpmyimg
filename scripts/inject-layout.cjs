const fs = require('fs');
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

  if (c.includes('<SystemArchitecture')) {
    console.log('Skipping (already injected):', file);
    continue;
  }
  
  const importStr = isTool ? "import { SystemArchitecture } from '../SystemArchitecture';\n" : "import { SystemArchitecture } from './SystemArchitecture';\n";
  
  // Inject import after first import
  c = c.replace(/(import .*;\n)/, '$1' + importStr);
  
  // Safely remove Lock, Zap, Sparkles from lucide-react import
  c = c.replace(/import\s+\{([^}]+)\}\s+from\s+['"]lucide-react['"]/g, (match, p1) => {
    let icons = p1.split(',').map(s => s.trim()).filter(s => s && !['Lock', 'Zap', 'Sparkles', 'Shield'].includes(s));
    if (icons.length === 0) return '';
    return `import { ${icons.join(', ')} } from 'lucide-react'`;
  });

  const tag = `\n      {/* SYSTEM ARCHITECTURE - Variant: ${variant} */}\n      <SystemArchitecture variant="${variant}" />\n`;
  
  if (c.includes('<HowItWorks')) {
    c = c.replace(/<HowItWorks/, tag + '      <HowItWorks');
  } else {
    c = c.replace(/<\/div>\n\s*\);\n};/, tag + '    </div>\n  );\n};');
  }
  
  fs.writeFileSync(filepath, c);
  console.log('Injected', file, 'with variant:', variant);
}
