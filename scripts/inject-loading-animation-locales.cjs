// scripts/inject-loading-animation-locales.cjs
const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

const NEW_KEYS_EN = {
  "work.step.init": "Initializing ONNX AI pipeline & tensors...",
  "work.step.segment": "Segmenting foreground subject & alpha mask...",
  "work.step.refine": "Refining ultra-crisp hair & edge transparency...",
  "work.reprocessAi": "⚡ Re-run AI Cutout",
  "work.processing": "Processing AI Cutout...",
  "editor.applying": "Applying Effect..."
};

const LANG_MAP = {
  ar: 'ar', cs: 'cs', da: 'da', de: 'de', el: 'el', en: 'en', es: 'es',
  fi: 'fi', fr: 'fr', he: 'iw', hi: 'hi', hu: 'hu', id: 'id', it: 'it',
  ja: 'ja', ko: 'ko', ms: 'ms', nl: 'nl', no: 'no', pl: 'pl', pt: 'pt',
  ro: 'ro', ru: 'ru', sv: 'sv', th: 'th', tr: 'tr', uk: 'uk', vi: 'vi',
  zh: 'zh-CN', 'zh-TW': 'zh-TW'
};

async function main() {
  const dirs = fs.readdirSync(LOCALES_DIR).filter(d => fs.statSync(path.join(LOCALES_DIR, d)).isDirectory());
  console.log(`Found ${dirs.length} locale directories.`);

  const keys = Object.keys(NEW_KEYS_EN);
  const values = Object.values(NEW_KEYS_EN);

  for (const dir of dirs) {
    const filePath = path.join(LOCALES_DIR, dir, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const targetLang = LANG_MAP[dir] || dir;

    if (dir === 'en') {
      for (const [k, v] of Object.entries(NEW_KEYS_EN)) {
        data[k] = v;
      }
    } else if (dir === 'id') {
      data["work.step.init"] = "Menginisialisasi pipeline AI ONNX...";
      data["work.step.segment"] = "Menganalisis subjek & topeng alfa...";
      data["work.step.refine"] = "Menyempurnakan detail rambut & tepi...";
      data["work.reprocessAi"] = "⚡ Proses Ulang AI";
      data["work.processing"] = "Memproses Potongan AI...";
      data["editor.applying"] = "Menerapkan Efek...";
    } else {
      try {
        console.log(`Translating for ${dir} (${targetLang})...`);
        const res = await translate(values, { from: 'en', to: targetLang });
        const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];

        keys.forEach((k, idx) => {
          data[k] = translatedArray[idx] || NEW_KEYS_EN[k];
        });
      } catch (err) {
        console.error(`Failed translation for ${dir}:`, err.message);
        for (const [k, v] of Object.entries(NEW_KEYS_EN)) {
          if (!data[k]) data[k] = v;
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${dir}/translation.json`);
  }

  console.log('All locale files successfully updated!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
