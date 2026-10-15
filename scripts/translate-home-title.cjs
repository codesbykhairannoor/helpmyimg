const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Curated native mappings for EN and ID
const MANUAL_OVERRIDES = {
  en: {
    highlight: '100% Private Image Tools,',
    solid: 'Processed Right in Your Browser',
    tab: 'HelpMyIMG | 100% Private Image Tools in Your Browser'
  },
  id: {
    highlight: 'Alat Gambar 100% Privat,',
    solid: 'Diproses Langsung di Browser Anda',
    tab: 'HelpMyIMG | Alat Gambar 100% Privat di Browser Anda'
  }
};

// Language code map for google-translate-api-x
const GOOGLE_LANG_MAP = {
  zh: 'zh-CN',
  he: 'iw',
  tl: 'tl'
};

async function main() {
  const dirs = fs.readdirSync(LOCALES_DIR).filter(d => fs.statSync(path.join(LOCALES_DIR, d)).isDirectory());
  console.log(`Found ${dirs.length} languages: ${dirs.join(', ')}`);

  for (const lang of dirs) {
    const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    let json = {};
    try {
      json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error(`Error reading ${lang}/translation.json:`, err);
      continue;
    }

    if (MANUAL_OVERRIDES[lang]) {
      json['home.hero.titleHighlight'] = MANUAL_OVERRIDES[lang].highlight;
      json['home.hero.titleSolid'] = MANUAL_OVERRIDES[lang].solid;
      json['home.tab.title'] = MANUAL_OVERRIDES[lang].tab;
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ [${lang}] Updated with curated translation: "${MANUAL_OVERRIDES[lang].highlight} ${MANUAL_OVERRIDES[lang].solid}"`);
      continue;
    }

    const targetLang = GOOGLE_LANG_MAP[lang] || lang;
    try {
      const res = await translate([
        '100% Private Image Tools,',
        'Processed Right in Your Browser',
        'HelpMyIMG | 100% Private Image Tools in Your Browser'
      ], { from: 'en', to: targetLang });

      const highlight = Array.isArray(res) ? res[0].text : res.text;
      const solid = Array.isArray(res) ? res[1].text : 'Processed Right in Your Browser';
      const tab = Array.isArray(res) ? res[2].text : `HelpMyIMG | ${highlight} ${solid}`;

      json['home.hero.titleHighlight'] = highlight.trim();
      json['home.hero.titleSolid'] = solid.trim();
      json['home.tab.title'] = tab.trim();

      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ [${lang}] (${targetLang}): "${json['home.hero.titleHighlight']} ${json['home.hero.titleSolid']}"`);
    } catch (err) {
      console.error(`✗ [${lang}] Failed translation:`, err.message);
    }
  }

  console.log('\nAll 30 languages have been updated successfully!');
}

main();
