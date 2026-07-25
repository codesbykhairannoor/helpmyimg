const fs = require('fs');
const path = require('path');
const data = require('./data-home-redesign.cjs');

const localesDir = path.join(__dirname, '../public/locales');
const supportedLocales = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

supportedLocales.forEach(locale => {
  const t = data[locale] || data.en;
  
  const translationFilePath = path.join(localesDir, locale, 'translation.json');
  if (fs.existsSync(translationFilePath)) {
    try {
      const content = fs.readFileSync(translationFilePath, 'utf8');
      const json = JSON.parse(content);
      
      json['home.redesign.badge'] = t.badge;
      json['home.redesign.explore'] = t.explore;
      json['home.redesign.ctaTag'] = t.ctaTag;
      json['home.redesign.ctaTitle'] = t.ctaTitle;
      json['home.redesign.ctaDesc'] = t.ctaDesc;
      json['home.redesign.ctaBtn'] = t.ctaBtn;

      fs.writeFileSync(translationFilePath, JSON.stringify(json, null, 2), 'utf8');
      console.log(`Updated translations for ${locale}`);
    } catch (e) {
      console.error(`Error updating ${locale}:`, e);
    }
  }
});
console.log('Home redesign translations injected successfully!');
