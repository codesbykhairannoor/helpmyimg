const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, '..', 'src', 'components', 'landing', 'tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Sections.tsx'));

files.forEach(file => {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remove import
  content = content.replace(/import\s*{\s*SystemArchitecture\s*}\s*from\s*'\.\.\/SystemArchitecture';?\r?\n?/g, '');
  
  // Remove component usage
  content = content.replace(/<SystemArchitecture[^>]*\/>\r?\n?/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Removed SystemArchitecture from ${file}`);
});
