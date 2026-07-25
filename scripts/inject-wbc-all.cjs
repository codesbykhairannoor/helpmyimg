const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const part1 = require('./data-wbc-1.cjs');
const part2 = require('./data-wbc-2.cjs');
const part3 = require('./data-wbc-3.cjs');
const part4 = require('./data-wbc-4.cjs');
const part5 = require('./data-wbc-5.cjs');

function inject() {
  console.log('Injecting generated translations into translation.json files...');
  let updated = 0;

  for (const lang of languages) {
    if (lang === 'en') continue;

    const translationFilePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(translationFilePath)) continue;

    const content = fs.readFileSync(translationFilePath, 'utf8');
    const json = JSON.parse(content);

    let modifications = 0;

    // Determine which part has the language
    const data = part1[lang] || part2[lang] || part3[lang] || part5[lang] || {};
    
    // Inject Redesign 
    if (data.watermark) {
      for (const [k, v] of Object.entries(data.watermark)) {
        json[`landing.watermark.redesign.${k}`] = v;
        modifications++;
      }
    }
    if (data.blurface) {
      for (const [k, v] of Object.entries(data.blurface)) {
        json[`landing.blurface.redesign.${k}`] = v;
        modifications++;
      }
    }
    if (data.convert) {
      for (const [k, v] of Object.entries(data.convert)) {
        json[`landing.convert.redesign.${k}`] = v;
        modifications++;
      }
    }
    
    // Inject FAQs (from part 1,2,3 or part 4)
    const faqs = data.faqs || part4[lang];
    if (faqs) {
      for (const [k, v] of Object.entries(faqs)) {
        json[k] = v;
        modifications++;
      }
    }

    if (modifications > 0) {
      fs.writeFileSync(translationFilePath, JSON.stringify(json, null, 2));
      console.log(`Saved ${modifications} keys to [${lang}]`);
      updated++;
    }
  }

  console.log(`\nAll done! Updated ${updated} languages.`);
}

inject();
