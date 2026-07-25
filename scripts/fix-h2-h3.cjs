const fs = require('fs');
const files = [
  'src/components/landing/tools/ColorBgSections.tsx',
  'src/components/landing/tools/ResizeSections.tsx',
  'src/components/landing/tools/CropSections.tsx',
  'src/components/landing/tools/DesignSections.tsx',
  'src/components/landing/tools/RotateSections.tsx',
  'src/components/landing/tools/PickerSections.tsx',
  'src/components/landing/tools/WatermarkSections.tsx',
  'src/components/landing/tools/BlurFaceSections.tsx',
  'src/components/landing/tools/ConvertSections.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  
  // Make h2 slightly smaller (text-3xl sm:text-4xl lg:text-5xl -> text-2xl sm:text-3xl lg:text-4xl)
  content = content.replace(/className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white/g, 'className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-white');
  
  // Make h3 smaller (text-2xl sm:text-3xl -> text-xl sm:text-2xl)
  content = content.replace(/className="text-2xl sm:text-3xl/g, 'className="text-xl sm:text-2xl');
  
  // Revert any mistaken h3 replacements from previous fix script
  content = content.replace(/<h3 className="text-2xl sm:text-3xl lg:text-4xl/g, '<h3 className="text-xl sm:text-2xl lg:text-3xl');

  fs.writeFileSync(f, content);
});
console.log("Fixed typography sizes on all 9 pages.");
