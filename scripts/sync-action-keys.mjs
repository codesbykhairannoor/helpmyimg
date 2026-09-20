// scripts/sync-action-keys.mjs
import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const localesDir = path.resolve('public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const newKeys = {
  'work.reprocessAi': '⚡ Re-run AI Cutout',
  'work.action.batch': '✨ Process All',
  'work.action.photos': 'Photos',
  'color.applyNow': '⚡ Change Background Now',
};

const langMap = {
  'zh': 'zh-CN',
  'he': 'iw',
};

async function main() {
  console.log(`Syncing keys across ${languages.length} locales...`);
  
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let hasChanges = false;
    const missingKeys = [];
    const missingValues = [];
    
    for (const [key, val] of Object.entries(newKeys)) {
      if (!content[key]) {
        missingKeys.push(key);
        missingValues.push(val);
      }
    }
    
    if (missingKeys.length > 0) {
      if (lang === 'en') {
        missingKeys.forEach((k, idx) => {
          content[k] = missingValues[idx];
        });
        hasChanges = true;
      } else if (lang === 'id') {
        content['work.reprocessAi'] = '⚡ Proses Ulang AI Cutout';
        content['work.action.batch'] = '✨ Proses Semua';
        content['work.action.photos'] = 'Foto';
        content['color.applyNow'] = '⚡ Ganti Background Sekarang';
        hasChanges = true;
      } else {
        try {
          const targetLang = langMap[lang] || lang;
          const res = await translate(missingValues, { to: targetLang });
          const translatedArr = Array.isArray(res) ? res.map(r => r.text) : [res.text];
          
          missingKeys.forEach((k, idx) => {
            content[k] = translatedArr[idx] || missingValues[idx];
          });
          hasChanges = true;
          console.log(`✓ Translated ${missingKeys.length} keys for [${lang}]`);
        } catch (e) {
          console.error(`Error translating for ${lang}:`, e.message);
          missingKeys.forEach((k, idx) => {
            content[k] = missingValues[idx];
          });
          hasChanges = true;
        }
      }
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    }
  }
  
  console.log('✅ Translation sync complete!');
}

main().catch(console.error);
