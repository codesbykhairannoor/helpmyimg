const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

const colorKeys = {
  en: {
    "color.officialTitle": "Official Passport Colors",
    "color.customTitle": "Custom Background Color"
  },
  id: {
    "color.officialTitle": "Warna Resmi Pas Foto & Dokumen",
    "color.customTitle": "Pilih Warna Kustom"
  },
  ja: {
    "color.officialTitle": "証明写真・公式規定カラー",
    "color.customTitle": "カスタム背景色を選択"
  },
  es: {
    "color.officialTitle": "Colores Oficiales de Pasaporte",
    "color.customTitle": "Color de Fondo Personalizado"
  },
  zh: {
    "color.officialTitle": "官方标准证件照背景色",
    "color.customTitle": "自定义背景颜色"
  },
  hi: {
    "color.officialTitle": "आधिकारिक पासपोर्ट रंग",
    "color.customTitle": "कस्टम बैकग्राउंड रंग"
  },
  ar: {
    "color.officialTitle": "الألوان الرسمية لصور جواز السفر",
    "color.customTitle": "لون خلفية مخصص"
  },
  fr: {
    "color.officialTitle": "Couleurs Officielles Passeport",
    "color.customTitle": "Couleur de Fond Personnalisée"
  },
  de: {
    "color.officialTitle": "Offizielle Passfoto-Farben",
    "color.customTitle": "Benutzerdefinierte Hintergrundfarbe"
  },
  pt: {
    "color.officialTitle": "Cores Oficiais para Passaporte",
    "color.customTitle": "Cor de Fundo Personalizada"
  },
  ru: {
    "color.officialTitle": "Официальные цвета для фото на документы",
    "color.customTitle": "Пользовательский цвет фона"
  },
  ko: {
    "color.officialTitle": "공식 여권 및 규격 사진 배경색",
    "color.customTitle": "사용자 지정 배경색 선택"
  }
};

const dirs = fs.readdirSync(localesDir);
let count = 0;

for (const langDir of dirs) {
  const filePath = path.join(localesDir, langDir, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const trans = colorKeys[langDir] || colorKeys.en;
      
      let modified = false;
      for (const [k, v] of Object.entries(trans)) {
        if (data[k] !== v) {
          data[k] = v;
          modified = true;
        }
      }

      // Clean up any remaining CPNS or KTP strings from any key
      for (const [key, val] of Object.entries(data)) {
        if (typeof val === 'string' && (val.includes('CPNS') || val.includes('KTP'))) {
          data[key] = val.replace(/\s*CPNS[\s&/]*KTP\s*/gi, ' & Dokumen ').replace(/CPNS|KTP/gi, '').replace(/\s+/g, ' ').trim();
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
        count++;
        console.log(`✓ Updated color.officialTitle/customTitle & removed CPNS/KTP for [${langDir}]`);
      }
    } catch (e) {
      console.error(`Error processing ${langDir}:`, e);
    }
  }
}

console.log(`\n🎉 Successfully updated official and custom color keys across ${count} language files!`);
