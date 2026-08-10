/**
 * Inject a new i18n key 'home.tab.title' for the browser tab title of the home page.
 * Format: "HelpMyIMG | [All Image Tools in One Place translated]"
 * Then regenerate the static catalog.
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

const tabTitles = {
  en: "HelpMyIMG | All Image Tools in One Place",
  id: "HelpMyIMG | Semua Alat Gambar dalam Satu Tempat",
  ar: "HelpMyIMG | كل أدوات الصور في مكان واحد",
  cs: "HelpMyIMG | Všechny nástroje pro obrázky na jednom místě",
  da: "HelpMyIMG | Alle billedværktøjer på ét sted",
  de: "HelpMyIMG | Alle Bild-Tools an einem Ort",
  el: "HelpMyIMG | Όλα τα εργαλεία εικόνας σε ένα μέρος",
  es: "HelpMyIMG | Todas las herramientas de imagen en un lugar",
  fi: "HelpMyIMG | Kaikki kuvatyökalut yhdessä paikassa",
  fr: "HelpMyIMG | Tous les outils image en un seul endroit",
  he: "HelpMyIMG | כל כלי התמונות במקום אחד",
  hi: "HelpMyIMG | सभी इमेज टूल्स एक जगह पर",
  hu: "HelpMyIMG | Minden képeszköz egy helyen",
  it: "HelpMyIMG | Tutti gli strumenti immagine in un unico posto",
  ja: "HelpMyIMG | 画像ツールが全部一か所に",
  ko: "HelpMyIMG | 모든 이미지 도구 한 곳에서",
  ms: "HelpMyIMG | Semua Alat Imej dalam Satu Tempat",
  nl: "HelpMyIMG | Alle afbeeldingstools op één plek",
  no: "HelpMyIMG | Alle bildeverktøy på ett sted",
  pl: "HelpMyIMG | Wszystkie narzędzia do zdjęć w jednym miejscu",
  pt: "HelpMyIMG | Todas as ferramentas de imagem em um só lugar",
  ro: "HelpMyIMG | Toate instrumentele pentru imagini într-un singur loc",
  ru: "HelpMyIMG | Все инструменты для изображений в одном месте",
  sv: "HelpMyIMG | Alla bildverktyg på ett ställe",
  th: "HelpMyIMG | เครื่องมือรูปภาพทั้งหมดในที่เดียว",
  tl: "HelpMyIMG | Lahat ng Tool sa Imahe sa Isang Lugar",
  tr: "HelpMyIMG | Tüm görüntü araçları tek bir yerde",
  uk: "HelpMyIMG | Усі інструменти для зображень в одному місці",
  vi: "HelpMyIMG | Tất cả công cụ hình ảnh tại một nơi",
  zh: "HelpMyIMG | 所有图像工具尽在一处",
};

const langs = Object.keys(tabTitles);
let updated = 0;

for (const lang of langs) {
  const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${lang}: file not found`);
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch(e) {
    console.log(`❌ JSON parse error for ${lang}: ${e.message}`);
    continue;
  }

  data['home.tab.title'] = tabTitles[lang];
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Updated ${lang}: ${tabTitles[lang]}`);
  updated++;
}

console.log(`\n🏆 Done. Updated: ${updated} locale files.`);
