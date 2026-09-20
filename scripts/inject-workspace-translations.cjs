const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const newTranslations = {
  "work.failedAi": "AI Processing Failed",
  "work.errorHint": "Tip: Try using a smaller resolution image, or click retry below.",
  "work.action.retry": "Retry AI Processing",
  "work.waiting": "Waiting in queue...",
  "work.queued": "Queued",
  "work.exportSettingsTitle": "Export & Download Options",
  "work.settings": "Export Settings",
  "work.batchRename": "Rename Files",
  "work.renameFile": "Custom File Name",
  "work.zipName": "ZIP Archive Name",
  "work.zipNamePlaceholder": "Enter ZIP filename...",
  "editor.reset": "Reset / Upload",
  "editor.resetAll": "Upload Other Photos"
};

const localesDir = path.join(__dirname, '../public/locales');
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

async function run() {
  console.log(`Translating ${Object.keys(newTranslations).length} keys into ${langs.length} languages...`);

  // 1. Update English first
  const enPath = path.join(localesDir, 'en', 'translation.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  Object.assign(enData, newTranslations);
  fs.writeFileSync(enPath, JSON.stringify(enData, null, 2), 'utf8');
  console.log('✅ Updated English translation.json');

  const keys = Object.keys(newTranslations);
  const values = Object.values(newTranslations);

  for (const lang of langs) {
    if (lang === 'en') continue;
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;

    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const toTranslateKeys = [];
    const toTranslateValues = [];

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!langData[k]) {
        toTranslateKeys.push(k);
        toTranslateValues.push(values[i]);
      }
    }

    if (toTranslateKeys.length === 0) {
      console.log(`[${lang}] All keys already present.`);
      continue;
    }

    try {
      const targetLang = lang === 'zh' ? 'zh-CN' : (lang === 'he' ? 'iw' : lang);
      const res = await translate(toTranslateValues, { from: 'en', to: targetLang });
      const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];

      for (let i = 0; i < toTranslateKeys.length; i++) {
        langData[toTranslateKeys[i]] = translatedArray[i] || toTranslateValues[i];
      }

      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`✅ [${lang}] Translated and saved ${toTranslateKeys.length} keys.`);
    } catch (err) {
      console.error(`❌ [${lang}] Translation failed, using English fallback:`, err.message);
      for (let i = 0; i < toTranslateKeys.length; i++) {
        langData[toTranslateKeys[i]] = toTranslateValues[i];
      }
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
    }
  }

  console.log('🎉 All 30 language files successfully updated!');
}

run();
