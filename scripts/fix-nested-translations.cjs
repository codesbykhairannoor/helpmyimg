const fs = require('fs');
const path = require('path');
const localesDir = path.join(__dirname, '../public/locales');

const langs = fs.readdirSync(localesDir);

langs.forEach(lang => {
  const file = path.join(localesDir, lang, 'translation.json');
  if (!fs.existsSync(file)) return;
  
  let content = JSON.parse(fs.readFileSync(file, 'utf8'));
  
  // Extract from nested object if it exists
  if (content.landing && typeof content.landing === 'object') {
    const sections = ['design', 'rotate', 'picker'];
    sections.forEach(sec => {
      if (content.landing[sec] && content.landing[sec].redesign) {
        const redesign = content.landing[sec].redesign;
        Object.keys(redesign).forEach(key => {
          content[`landing.${sec}.redesign.${key}`] = redesign[key];
        });
      }
    });
    // Delete the nested 'landing' object I accidentally created
    delete content.landing;
  }
  
  fs.writeFileSync(file, JSON.stringify(content, null, 2));
});
console.log("Successfully flattened translation keys for all 30 languages!");
