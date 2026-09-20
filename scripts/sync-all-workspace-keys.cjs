// scripts/sync-all-workspace-keys.cjs
const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const localesDir = path.resolve(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const enKeys = {
  'work.processing': 'Processing image with AI...',
  'work.step.init': 'Initializing AI pipeline & model...',
  'work.step.downloading': 'Downloading AI Model ({{pct}})...',
  'work.step.vector': 'Processing vector logo precision...',
  'editor.resetOriginal': 'Reset to Original',
  'editor.resetDesc': 'Restore this photo to original state without changes',
  'editor.uploadOther': 'Upload Other',
  'editor.uploadOtherDesc': 'Pick and upload a new photo from device',
  'editor.resetSuccess': 'Image restored to original state.',
};

const idKeys = {
  'work.processing': 'Memproses gambar dengan AI...',
  'work.step.init': 'Inisialisasi AI & model...',
  'work.step.downloading': 'Mengunduh Memori AI ({{pct}})...',
  'work.step.vector': 'Memproses presisi vektor logo...',
  'editor.resetOriginal': 'Reset ke Asli',
  'editor.resetDesc': 'Kembalikan foto ini ke kondisi asli tanpa perubahan',
  'editor.uploadOther': 'Upload Lain',
  'editor.uploadOtherDesc': 'Pilih dan unggah foto baru dari perangkat',
  'editor.resetSuccess': 'Gambar dikembalikan ke kondisi awal.',
};

const langMap = {
  'zh': 'zh-CN',
  'he': 'iw',
};

async function main() {
  console.log(`Checking and syncing workspace i18n keys for ${languages.length} languages...`);

  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let changed = false;

    if (lang === 'en') {
      for (const [k, v] of Object.entries(enKeys)) {
        content[k] = v;
        changed = true;
      }
    } else if (lang === 'id') {
      for (const [k, v] of Object.entries(idKeys)) {
        content[k] = v;
        changed = true;
      }
    } else {
      const missingKeys = [];
      const englishTemplates = [];

      for (const [k, v] of Object.entries(enKeys)) {
        // If missing or same as english or corrupted
        if (!content[k] || content[k] === v) {
          missingKeys.push(k);
          // Protect placeholder {{pct}}
          englishTemplates.push(v.replace('{{pct}}', '__PCT__'));
        }
      }

      if (missingKeys.length > 0) {
        try {
          const targetLang = langMap[lang] || lang;
          const res = await translate(englishTemplates, { from: 'en', to: targetLang });
          const resArr = Array.isArray(res) ? res.map(r => r.text) : [res.text];

          missingKeys.forEach((key, idx) => {
            let translated = resArr[idx] || enKeys[key];
            translated = translated.replace(/__PCT__|__ PCT __|_PCT_/gi, '{{pct}}');
            content[key] = translated;
          });
          changed = true;
          console.log(`✓ Translated ${missingKeys.length} keys for [${lang}]`);
        } catch (err) {
          console.warn(`[${lang}] Translation warning:`, err.message);
          missingKeys.forEach((key) => {
            content[key] = enKeys[key];
          });
          changed = true;
        }
      }
    }

    if (changed) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    }
  }

  console.log('✅ Workspace i18n sync finished for all 30 languages!');
}

main().catch(console.error);
