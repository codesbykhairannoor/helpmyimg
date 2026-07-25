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
  // Revert all h3s that are way too big back to normal size
  content = content.replace(/<h3 className="text-4xl sm:text-5xl lg:text-6xl/g, '<h3 className="text-2xl sm:text-3xl lg:text-4xl');
  // And there are some h2s that are NOT hero sections but steps headers, like "Reorient in 3 Steps"
  // Let's manually replace those ones for each file to text-3xl sm:text-4xl
  
  // Specifically the workflow section titles:
  content = content.replace(/<h2 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-white/g, '<h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black text-white');
  
  fs.writeFileSync(f, content);
});
console.log("Fixed typography on all 6 pages");
