const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src', 'components', 'landing', 'tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Sections.tsx'));

const containerRegex = /<div className="flex flex-col md:flex-row (items-center )?justify-center gap-8( md:gap-4)?( relative mt-16)?"/g;
const itemRegex1 = /className="flex-1 text-center group"/g;
const itemRegex2 = /className="flex-1 text-center relative z-10"/g;
const itemRegex3 = /className="flex-1 text-center"/g; // Catch-all

const replacementItem = 'className="flex-1 text-center group relative z-10 w-full max-w-sm mx-auto md:max-w-none md:w-auto bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl border border-dark-600/30 md:border-transparent"';

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Let's manually replace the item classes if they aren't already updated
  if (!content.includes('bg-dark-800/40 md:bg-transparent p-8 md:p-0 rounded-3xl')) {
    
    // First, find the "HOW IT WORKS" section
    const howItWorksIndex = content.indexOf('HOW IT WORKS');
    if (howItWorksIndex !== -1) {
      // Only replace items AFTER "HOW IT WORKS" to avoid replacing other sections
      const before = content.substring(0, howItWorksIndex);
      let after = content.substring(howItWorksIndex);

      after = after.replace(/className="flex-1 text-center group"/g, replacementItem);
      after = after.replace(/className="flex-1 text-center relative z-10"/g, replacementItem);
      
      // Some might just be flex-1 text-center (like ColorBgSections.tsx maybe?)
      after = after.replace(/<div className="flex-1 text-center">/g, `<div ${replacementItem}>`);

      content = before + after;
      
      // Fix the flex container gap for better mobile spacing
      // We want `gap-8 md:gap-8` and `items-center md:items-start`
      content = content.replace(
        /<div className="flex flex-col md:flex-row gap-8 justify-center items-start">/g, 
        '<div className="flex flex-col md:flex-row gap-8 md:gap-8 justify-center items-center md:items-start mt-8 md:mt-16">'
      );
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
}
console.log('Done!');
