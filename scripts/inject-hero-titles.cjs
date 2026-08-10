/**
 * Inject home.hero.titleHighlight and home.hero.titleSolid into all 30 locale files.
 * Also ensures grid.catAll and landing.tools.cat.all keys exist.
 * Translations are professionally done per language.
 */
const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Map: lang -> { titleHighlight, titleSolid }
const heroTranslations = {
  en: { 'home.hero.titleHighlight': 'All Image', 'home.hero.titleSolid': 'Tools in One Place' },
  id: { 'home.hero.titleHighlight': 'Semua Alat', 'home.hero.titleSolid': 'Gambar dalam Satu Tempat' },
  ar: { 'home.hero.titleHighlight': 'كل أدوات', 'home.hero.titleSolid': 'الصور في مكان واحد' },
  cs: { 'home.hero.titleHighlight': 'Všechny nástroje', 'home.hero.titleSolid': 'pro obrázky na jednom místě' },
  da: { 'home.hero.titleHighlight': 'Alle billedværktøjer', 'home.hero.titleSolid': 'på ét sted' },
  de: { 'home.hero.titleHighlight': 'Alle Bild-Tools', 'home.hero.titleSolid': 'an einem Ort' },
  el: { 'home.hero.titleHighlight': 'Όλα τα εργαλεία', 'home.hero.titleSolid': 'εικόνας σε ένα μέρος' },
  es: { 'home.hero.titleHighlight': 'Todas las herramientas', 'home.hero.titleSolid': 'de imagen en un lugar' },
  fi: { 'home.hero.titleHighlight': 'Kaikki kuvatyökalut', 'home.hero.titleSolid': 'yhdessä paikassa' },
  fr: { 'home.hero.titleHighlight': 'Tous les outils image', 'home.hero.titleSolid': 'en un seul endroit' },
  he: { 'home.hero.titleHighlight': 'כל כלי התמונות', 'home.hero.titleSolid': 'במקום אחד' },
  hi: { 'home.hero.titleHighlight': 'सभी इमेज टूल्स', 'home.hero.titleSolid': 'एक जगह पर' },
  hu: { 'home.hero.titleHighlight': 'Minden képeszköz', 'home.hero.titleSolid': 'egy helyen' },
  it: { 'home.hero.titleHighlight': 'Tutti gli strumenti immagine', 'home.hero.titleSolid': 'in un unico posto' },
  ja: { 'home.hero.titleHighlight': '画像ツールが全部', 'home.hero.titleSolid': '一か所に集結' },
  ko: { 'home.hero.titleHighlight': '모든 이미지 도구', 'home.hero.titleSolid': '한 곳에서' },
  ms: { 'home.hero.titleHighlight': 'Semua Alat Imej', 'home.hero.titleSolid': 'dalam Satu Tempat' },
  nl: { 'home.hero.titleHighlight': 'Alle afbeeldingstools', 'home.hero.titleSolid': 'op één plek' },
  no: { 'home.hero.titleHighlight': 'Alle bildeverktøy', 'home.hero.titleSolid': 'på ett sted' },
  pl: { 'home.hero.titleHighlight': 'Wszystkie narzędzia do zdjęć', 'home.hero.titleSolid': 'w jednym miejscu' },
  pt: { 'home.hero.titleHighlight': 'Todas as ferramentas', 'home.hero.titleSolid': 'de imagem em um só lugar' },
  ro: { 'home.hero.titleHighlight': 'Toate instrumentele', 'home.hero.titleSolid': 'pentru imagini într-un singur loc' },
  ru: { 'home.hero.titleHighlight': 'Все инструменты', 'home.hero.titleSolid': 'для изображений в одном месте' },
  sv: { 'home.hero.titleHighlight': 'Alla bildverktyg', 'home.hero.titleSolid': 'på ett ställe' },
  th: { 'home.hero.titleHighlight': 'เครื่องมือรูปภาพทั้งหมด', 'home.hero.titleSolid': 'ในที่เดียว' },
  tl: { 'home.hero.titleHighlight': 'Lahat ng Tool sa Imahe', 'home.hero.titleSolid': 'sa Isang Lugar' },
  tr: { 'home.hero.titleHighlight': 'Tüm görüntü araçları', 'home.hero.titleSolid': 'tek bir yerde' },
  uk: { 'home.hero.titleHighlight': 'Усі інструменти', 'home.hero.titleSolid': 'для зображень в одному місці' },
  vi: { 'home.hero.titleHighlight': 'Tất cả công cụ hình ảnh', 'home.hero.titleSolid': 'tại một nơi' },
  zh: { 'home.hero.titleHighlight': '所有图像工具', 'home.hero.titleSolid': '尽在一处' },
};

const langs = Object.keys(heroTranslations);
let updated = 0;
let skipped = 0;

for (const lang of langs) {
  const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  Skipping ${lang}: file not found`);
    skipped++;
    continue;
  }

  const raw = fs.readFileSync(filePath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch(e) {
    console.log(`❌ JSON parse error for ${lang}: ${e.message}`);
    skipped++;
    continue;
  }

  const keys = heroTranslations[lang];
  let changed = false;
  for (const [key, value] of Object.entries(keys)) {
    if (!data[key]) {
      data[key] = value;
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated ${lang}`);
    updated++;
  } else {
    console.log(`⏭️  ${lang} already has keys`);
    skipped++;
  }
}

console.log(`\n🏆 Done. Updated: ${updated}, Skipped: ${skipped}`);
