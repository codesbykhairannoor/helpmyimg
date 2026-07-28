import fs from 'fs';
import path from 'path';
import translate from 'translate-google';

const publicDir = path.join(process.cwd(), 'public');
const localesDir = path.join(publicDir, 'locales');

const langs = fs.readdirSync(localesDir).filter(l => fs.statSync(path.join(localesDir, l)).isDirectory());

const langMap = {
  'zh': 'zh-cn',
  'he': 'iw'
};

async function fixApply() {
  for (const lang of langs) {
    try {
      const jsonPath = path.join(localesDir, lang, 'translation.json');
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      
      if (!data.work) data.work = {};
      if (!data.work.action) data.work.action = {};

      if (lang === 'en') {
        data.work.action.apply = 'Apply';
      } else {
        const targetLang = langMap[lang] || lang;
        const res = await translate('Apply', { to: targetLang });
        data.work.action.apply = res;
      }
      
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`✅ Added Apply for ${lang}`);
      
      if (lang !== 'en') await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`❌ Error in ${lang}:`, err.message);
    }
  }
}
fixApply();
