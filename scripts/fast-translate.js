import fs from 'fs';
import path from 'path';

const localesDir = path.join(process.cwd(), 'public', 'locales');
const langs = fs.readdirSync(localesDir).filter(l => fs.statSync(path.join(localesDir, l)).isDirectory());

const dict = {
  ar: { apply: 'تطبيق', radius: 'نصف قطر الزاوية' },
  cs: { apply: 'Aplikovat', radius: 'Poloměr rohu' },
  da: { apply: 'Anvend', radius: 'Hjørneradius' },
  de: { apply: 'Anwenden', radius: 'Eckenradius' },
  el: { apply: 'Εφαρμογή', radius: 'Ακτίνα γωνίας' },
  en: { apply: 'Apply', radius: 'Corner Radius' },
  es: { apply: 'Aplicar', radius: 'Radio de esquina' },
  fi: { apply: 'Käytä', radius: 'Kulman säde' },
  fr: { apply: "Appliquer", radius: "Rayon d'angle" },
  he: { apply: 'החל', radius: 'רדיוס הפינה' },
  hi: { apply: 'लागू करें', radius: 'कोने की त्रिज्या' },
  hu: { apply: 'Alkalmaz', radius: 'Sarok sugara' },
  id: { apply: 'Terapkan', radius: 'Lengkungan' },
  it: { apply: 'Applica', radius: 'Raggio angolo' },
  ja: { apply: '適用する', radius: '角丸の半径' },
  ko: { apply: '적용하다', radius: '모서리 반경' },
  ms: { apply: 'Gunakan', radius: 'Jejari sudut' },
  nl: { apply: 'Toepassen', radius: 'Hoekradius' },
  no: { apply: 'Bruk', radius: 'Hjørneradius' },
  pl: { apply: 'Zastosuj', radius: 'Promień narożnika' },
  pt: { apply: 'Aplicar', radius: 'Raio do canto' },
  ro: { apply: 'Aplică', radius: 'Raza colțului' },
  ru: { apply: 'Применить', radius: 'Радиус угла' },
  sv: { apply: 'Tillämpa', radius: 'Hörnradie' },
  th: { apply: 'นำไปใช้', radius: 'รัศมีมุม' },
  tl: { apply: 'Ilapat', radius: 'Radius ng sulok' },
  tr: { apply: 'Uygula', radius: 'Köşe yarıçapı' },
  uk: { apply: 'Застосувати', radius: 'Радіус кута' },
  vi: { apply: 'Áp dụng', radius: 'Bán kính góc' },
  zh: { apply: '应用', radius: '圆角半径' },
};

function fixTranslations() {
  for (const lang of langs) {
    const jsonPath = path.join(localesDir, lang, 'translation.json');
    let data = {};
    try {
      data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    } catch(e) {}
    
    // Clean up incorrect nested object if it exists
    if (data.work && typeof data.work === 'object') {
      delete data.work;
    }

    const translations = dict[lang] || dict['en'];
    data['work.action.apply'] = translations.apply;
    data['crop.radius'] = translations.radius;

    fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}`);
  }
}

fixTranslations();
