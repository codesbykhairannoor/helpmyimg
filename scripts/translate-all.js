import fs from 'fs';
import path from 'path';
import translate from 'translate-google';

const srcDir = path.join(process.cwd(), 'src');
const localesDir = path.join(process.cwd(), 'public', 'locales');

// Regex to find t('key', { defaultValue: 'value' })
// We'll use a simpler approach: finding all `defaultValue:` and the key before it
const regex = /t\(\s*['"]([^'"]+)['"]\s*,\s*\{\s*defaultValue:\s*['"]([^'"]+)['"]/g;

function extractMissingKeys(dir) {
  let missing = {};
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      Object.assign(missing, extractMissingKeys(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      let match;
      while ((match = regex.exec(content)) !== null) {
        // match[1] is key, match[2] is defaultValue
        missing[match[1]] = match[2];
      }
    }
  }
  return missing;
}

const allKeys = extractMissingKeys(srcDir);
// Let's add the ones we know for sure just in case they don't match the regex
allKeys['work.action.apply'] = 'Apply';
allKeys['crop.radius'] = 'Corner Radius';

const langs = fs.readdirSync(localesDir).filter(l => fs.statSync(path.join(localesDir, l)).isDirectory());
const langMap = { 'zh': 'zh-cn', 'he': 'iw' };

async function fixAll() {
  for (const lang of langs) {
    const jsonPath = path.join(localesDir, lang, 'translation.json');
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch(e) {}
    
    // Remove the nested work object if it exists to avoid conflicts
    if (data.work && typeof data.work === 'object') {
      delete data.work;
    }

    let changed = false;
    for (const key in allKeys) {
      if (!data[key]) {
        let textToTranslate = allKeys[key];
        
        if (lang === 'en') {
          // Hardcode English fallback for Indonesian original
          if (textToTranslate === 'Lengkungan') textToTranslate = 'Corner Radius';
          if (textToTranslate === 'Atur Ulang / Kembalikan') textToTranslate = 'Reset';
          if (textToTranslate === 'Memulai AI...') textToTranslate = 'Starting AI...';
          data[key] = textToTranslate;
        } else {
           const targetLang = langMap[lang] || lang;
           
           // Small heuristic: if text is Indonesian, translate from id
           let opts = { to: targetLang };
           if (textToTranslate === 'Lengkungan' || textToTranslate.includes('Kembalikan')) {
             opts.from = 'id';
           } else {
             opts.from = 'en';
             if (key === 'crop.radius') textToTranslate = 'Corner Radius';
           }
           
           try {
             const res = await translate(textToTranslate, opts);
             data[key] = res;
           } catch(e) {
             console.error('Translation error for', key, lang, e.message);
             data[key] = textToTranslate; // fallback
           }
        }
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated translations for ${lang}`);
    }
  }
}

fixAll().catch(console.error);
