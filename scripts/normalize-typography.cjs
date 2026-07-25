const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/components/landing/tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('Sections.tsx'));

files.forEach(f => {
  const filePath = path.join(dir, f);
  let content = fs.readFileSync(filePath, 'utf8');

  // Normalize h2
  content = content.replace(/<h2\s+className="([^"]+)"/g, (match, className) => {
    // Remove existing text sizing
    let newClass = className.replace(/text-\S+\s+/g, '').replace(/sm:text-\S+\s+/g, '').replace(/lg:text-\S+\s+/g, '');
    
    // Add appropriate sizing back
    if (className.includes('bg-clip-text')) {
      // Hero
      return `<h2 className="text-4xl sm:text-5xl lg:text-6xl ${newClass.trim()}"`;
    } else {
      // Regular section header (e.g. "Reorient in 3 Steps")
      // Remove leading-tight or other weird stuff if necessary, but keep it mostly intact
      return `<h2 className="text-3xl sm:text-4xl lg:text-5xl ${newClass.trim()}"`;
    }
  });

  // Normalize h3
  content = content.replace(/<h3\s+className="([^"]+)"/g, (match, className) => {
    // If it's already text-xl and no other text sizes, it might be the small bottom flex block
    if (className.includes('text-xl') && !className.includes('sm:text-') && !className.includes('lg:text-') && !className.includes('text-2xl') && !className.includes('text-3xl') && !className.includes('text-4xl')) {
      return match;
    }

    // Remove existing text sizing
    let newClass = className.replace(/text-\S+\s+/g, '').replace(/sm:text-\S+\s+/g, '').replace(/lg:text-\S+\s+/g, '');
    
    // Some classes have multiple fonts like font-heading font-black, or font-bold font-heading.
    // Let's just strip 'font-black' and 'font-bold' and 'font-heading' and manually add them so it's consistent.
    newClass = newClass.replace(/font-\S+\s+/g, '').trim();
    
    return `<h3 className="text-xl sm:text-2xl font-bold font-heading ${newClass}"`;
  });

  fs.writeFileSync(filePath, content);
  console.log(`Normalized typography in ${f}`);
});
