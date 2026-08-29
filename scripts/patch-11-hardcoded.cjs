const fs = require('fs');
const path = require('path');

const toolsDir = path.resolve('src/components/landing/tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Sections.tsx'));

const enJsonPath = path.resolve('public/locales/en/translation.json');
const enTranslations = require(enJsonPath);

for (const file of files) {
  let content = fs.readFileSync(path.join(toolsDir, file), 'utf8');
  const toolNameMatch = file.match(/^(.*?)Sections\.tsx$/);
  if (!toolNameMatch) continue;
  
  const toolNameRaw = toolNameMatch[1];
  // convert PascalCase to lowercase tool key
  const toolName = toolNameRaw.toLowerCase();
  
  // Find feature blocks:
  // title: "Some Title",
  // desc: "Some Description"
  // We can use a replacer function
  
  let featCounter = 1;
  const regex = /title:\s*"([^"]+)",\s*desc:\s*"([^"]+)"/g;
  
  content = content.replace(regex, (match, title, desc) => {
    const tKeyTitle = `longtail.${toolName}.feat${featCounter}.title`;
    const tKeyDesc = `longtail.${toolName}.feat${featCounter}.desc`;
    
    enTranslations[tKeyTitle] = title;
    enTranslations[tKeyDesc] = desc;
    
    const replacement = `title: t('${tKeyTitle}', { defaultValue: "${title}" }),\n              desc: t('${tKeyDesc}', { defaultValue: "${desc}" })`;
    
    featCounter++;
    return replacement;
  });
  
  fs.writeFileSync(path.join(toolsDir, file), content);
}

fs.writeFileSync(enJsonPath, JSON.stringify(enTranslations, null, 2));
console.log("Patched 11 components and updated EN translations!");
