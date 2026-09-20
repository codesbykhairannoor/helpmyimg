// scripts/sync-adaptive-keys.mjs
import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';

const localesDir = path.resolve('public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const newKeys = {
  'remove.modeTitle': 'Cutout Engine',
  'remove.modeAutoActive': 'Adaptive Auto',
  'remove.modeLogoActive': 'Vector Mode',
  'remove.modeAiActive': 'AI Neural Mode',
  'remove.modeAuto': '✨ Auto',
  'remove.modeAutoDesc': 'Adaptive',
  'remove.modeAi': 'Photo AI',
  'remove.modeAiDesc': 'Human/Pet',
  'remove.modeLogo': 'Logo',
  'remove.modeLogoDesc': 'Vector 0ms',
  'remove.detectedType': 'Auto Detection:',
  'remove.detectedLogo': '🏷️ Logo / Vector Graphic (0ms)',
  'remove.detectedPhoto': '📷 Natural Photo / Portrait (AI)',
};

const idTranslations = {
  'remove.modeTitle': 'Mesin Cutout',
  'remove.modeAutoActive': 'Otomatis Adaptif',
  'remove.modeLogoActive': 'Mode Vektor',
  'remove.modeAiActive': 'Mode AI Neural',
  'remove.modeAuto': '✨ Auto',
  'remove.modeAutoDesc': 'Adaptif',
  'remove.modeAi': 'Foto AI',
  'remove.modeAiDesc': 'Manusia/Hewan',
  'remove.modeLogo': 'Logo',
  'remove.modeLogoDesc': 'Vektor 0ms',
  'remove.detectedType': 'Deteksi Otomatis:',
  'remove.detectedLogo': '🏷️ Logo / Grafis Vektor (0ms)',
  'remove.detectedPhoto': '📷 Foto / Potret Natural (AI)',
};

const langMap = {
  'zh': 'zh-CN',
  'he': 'iw',
};

async function main() {
  console.log(`Syncing adaptive keys across ${languages.length} locales...`);
  
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
  
  console.log('✅ Adaptive translation sync complete!');
}

main().catch(console.error);
