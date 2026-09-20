// scripts/inject-color-bg-translations.cjs
const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

const NEW_KEYS_EN = {
  "color.tab.solid": "Solid Color",
  "color.tab.gradient": "Gradients",
  "color.tab.upload": "Upload BG",
  "color.tab.scenes": "Studio Scenes",
  "color.officialTitle": "Official Passport & ID Colors",
  "color.customTitle": "Custom Hex Color Picker",
  "color.gradientTitle": "Modern Studio Gradients",
  "color.uploadTitle": "Upload Custom Background Image",
  "color.changeBgImage": "Change Background Photo",
  "color.dropCustomBg": "Click to Upload Custom Background",
  "color.bgBlur": "Background Blur (DSLR Effect)",
  "color.presetTitle": "Preset Studio & Scenic Backdrops",
  "color.off.red": "Passport Red",
  "color.off.blue": "Passport Blue",
  "color.off.white": "Pure White",
  "color.off.black": "Studio Dark",
  "color.off.gray": "Soft Gray",
  "color.off.pink": "Pastel Pink",
  "color.off.green": "Mint Green",
  "color.off.sky": "Sky Blue"
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
      data["color.tab.solid"] = "Warna Solid";
      data["color.tab.gradient"] = "Gradasi";
      data["color.tab.upload"] = "Upload BG";
      data["color.tab.scenes"] = "Studio Scene";
      data["color.officialTitle"] = "Warna Resmi Pas Foto & Dokumen";
      data["color.customTitle"] = "Pilih Warna Custom (HEX)";
      data["color.gradientTitle"] = "Gradasi Studio Modern";
      data["color.uploadTitle"] = "Upload Foto Background Sendiri";
      data["color.changeBgImage"] = "Ganti Foto Background";
      data["color.dropCustomBg"] = "Klik untuk Upload Background Sendiri";
      data["color.bgBlur"] = "Blur Background (Efek DSLR)";
      data["color.presetTitle"] = "Preset Studio & Background Estetik";
      data["color.off.red"] = "Merah Paspor";
      data["color.off.blue"] = "Biru Paspor";
      data["color.off.white"] = "Putih Bersih";
      data["color.off.black"] = "Hitam Studio";
      data["color.off.gray"] = "Abu Soft";
      data["color.off.pink"] = "Pastel Pink";
      data["color.off.green"] = "Mint Green";
      data["color.off.sky"] = "Sky Blue";
    } else {
      try {
        console.log(`Translating for ${dir} (${targetLang})...`);
        const res = await translate(values, { to: targetLang });
        const transArr = Array.isArray(res) ? res.map(r => r.text) : [res.text];
        keys.forEach((k, idx) => {
          data[k] = transArr[idx] || NEW_KEYS_EN[k];
        });
      } catch (err) {
        console.error(`Error translating for ${dir}:`, err.message);
        // Fallback to EN if translation failed
        for (const [k, v] of Object.entries(NEW_KEYS_EN)) {
          if (!data[k]) data[k] = v;
        }
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Updated ${dir}/translation.json`);
  }

  console.log('🎉 All 30 language translation files updated successfully!');
}

main().catch(console.error);
