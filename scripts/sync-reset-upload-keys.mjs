// scripts/sync-reset-upload-keys.mjs
import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const localesDir = path.resolve('public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const newKeys = {
  'editor.resetOriginal': 'Reset to Original',
  'editor.resetDesc': 'Restore this photo to original uncut state',
  'editor.uploadOther': 'Upload Other Image',
  'editor.uploadOtherDesc': 'Pick and upload a new photo from device',
};

const idTranslations = {
  'editor.resetOriginal': 'Reset ke Asli',
  'editor.resetDesc': 'Kembalikan foto ini ke kondisi asli tanpa potongan',
  'editor.uploadOther': 'Upload Gambar Lain',
  'editor.uploadOtherDesc': 'Pilih dan unggah foto baru dari perangkat',
};

const langMap = {
  'zh': 'zh-CN',
  'he': 'iw',
};

async function main() {
  console.log(`Syncing reset/upload keys across ${languages.length} locales...`);
  
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
        missingKeys.forEach((k) => {
          content[k] = idTranslations[k] || newKeys[k];
        });
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
  
  console.log('✅ Reset/Upload translation sync complete!');
}

main().catch(console.error);
