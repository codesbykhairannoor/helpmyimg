const fs = require('fs');
const files = [
  'src/components/landing/tools/ColorBgSections.tsx',
  'src/components/landing/tools/ResizeSections.tsx',
  'src/components/landing/tools/CropSections.tsx',
  'src/components/landing/tools/DesignSections.tsx',
  'src/components/landing/tools/RotateSections.tsx',
  'src/components/landing/tools/PickerSections.tsx'
];
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let matches = content.match(/<h[234] className=\"[^\"]+\"/g) || [];
  console.log('--- ' + f + ' ---');
  matches.forEach(m => console.log(m));
});
