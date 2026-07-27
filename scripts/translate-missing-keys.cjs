const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const missingKeys = [
  "hero.title",
  "hero.subtitle",
  "footer.badge.latency",
  "nav.removeBg",
  "footer.link.linkedin",
  "footer.link.wasm",
  "nav.studioBadge",
  "nav.megaMenu.latency",
  "nav.selectLang",
  "nav.searchLang",
  "nav.noLang",
  "nav.color",
  "grid.colorDesc",
  "nav.tools",
  "grid.catAll",
  "grid.catOptimize",
  "grid.catModify",
  "grid.catConvert",
  "grid.catSecurity",
  "grid.catEdit"
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const enPath = path.join(localesDir, 'en', 'translation.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  for (const lang of languages) {
    if (lang === 'en') continue;
    
    console.log(`Processing ${lang}...`);
    const langPath = path.join(localesDir, lang, 'translation.json');
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    
    let updated = false;
    for (const key of missingKeys) {
      if (enData[key] && langData[key] === enData[key]) {
        console.log(` Translating ${key} to ${lang}...`);
        try {
          // 'zh' is typically 'zh-CN' in google translate if it complains, but 'zh-CN' works
          let tLang = lang;
          if (lang === 'zh') tLang = 'zh-CN';
          
          const res = await translate(enData[key], { to: tLang });
          langData[key] = res.text;
          updated = true;
          await sleep(500); // rate limiting
        } catch (e) {
          console.error(`  Error translating ${key}: ${e.message}`);
        }
      } else if (!langData[key] && enData[key]) {
        // missing entirely
        console.log(` Translating missing ${key} to ${lang}...`);
        try {
          let tLang = lang;
          if (lang === 'zh') tLang = 'zh-CN';
          
          const res = await translate(enData[key], { to: tLang });
          langData[key] = res.text;
          updated = true;
          await sleep(500);
        } catch (e) {
          console.error(`  Error translating ${key}: ${e.message}`);
        }
      }
    }
    
    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2));
      console.log(`Saved ${lang}`);
    }
  }
}

run().catch(console.error);
