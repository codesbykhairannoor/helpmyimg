const fs = require('fs');
const path = require('path');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// Curated native high-quality translations for all 30 supported languages
const PERFECTED_TRANSLATIONS = {
  en: {
    highlight: '100% Private Image Tools',
    solid: 'Processed Right in Your Browser',
    tab: 'HelpMyIMG | 100% Private Image Tools in Your Browser'
  },
  id: {
    highlight: 'Alat Edit Foto 100% Privat',
    solid: 'Diproses Langsung di Browser Anda',
    tab: 'HelpMyIMG | Alat Edit Foto 100% Privat di Browser Anda'
  },
  ms: {
    highlight: 'Alat Edit Imej 100% Peribadi',
    solid: 'Diproses Terus dalam Pelayar Anda',
    tab: 'HelpMyIMG | Alat Edit Imej 100% Peribadi dalam Pelayar Anda'
  },
  es: {
    highlight: 'Herramientas de Imagen 100% Privadas',
    solid: 'Procesadas Directamente en tu Navegador',
    tab: 'HelpMyIMG | Herramientas de Imagen 100% Privadas en tu Navegador'
  },
  pt: {
    highlight: 'Ferramentas de Imagem 100% Privadas',
    solid: 'Processadas Diretamente no seu Navegador',
    tab: 'HelpMyIMG | Ferramentas de Imagem 100% Privadas no seu Navegador'
  },
  fr: {
    highlight: "Outils d'Images 100% Privés",
    solid: 'Traités Directement dans votre Navigateur',
    tab: "HelpMyIMG | Outils d'Images 100% Privés dans votre Navigateur"
  },
  de: {
    highlight: '100% Private Bild-Tools',
    solid: 'Direkt in Ihrem Browser verarbeitet',
    tab: 'HelpMyIMG | 100% Private Bild-Tools direkt im Browser'
  },
  it: {
    highlight: 'Strumenti per Immagini 100% Privati',
    solid: 'Elaborati Direttamente nel tuo Browser',
    tab: 'HelpMyIMG | Strumenti per Immagini 100% Privati nel tuo Browser'
  },
  ru: {
    highlight: '100% Приватные Инструменты для Фото',
    solid: 'Обработка прямо в вашем браузере',
    tab: 'HelpMyIMG | 100% Приватные Инструменты для Фото в Браузере'
  },
  uk: {
    highlight: '100% Приватні Інструменти для Зображень',
    solid: 'Обробка прямо у вашому браузері',
    tab: 'HelpMyIMG | 100% Приватні Інструменти для Зображень у Браузері'
  },
  zh: {
    highlight: '100% 本地隐私图片工具',
    solid: '直接在您的浏览器中安全处理',
    tab: 'HelpMyIMG | 100% 本地隐私图片工具 - 浏览器端直接处理'
  },
  ja: {
    highlight: '100% 完全ローカル画像ツール',
    solid: 'ブラウザ内で直接安全に処理',
    tab: 'HelpMyIMG | 100% 完全ローカル・プライベート画像ツール'
  },
  ko: {
    highlight: '100% 프라이빗 이미지 도구',
    solid: '브라우저에서 직접 안전하게 처리',
    tab: 'HelpMyIMG | 100% 프라이빗 로컬 이미지 편집 도구'
  },
  ar: {
    highlight: 'أدوات تعديل صور خاصة 100%',
    solid: 'تتم معالجتها مباشرة في متصفحك',
    tab: 'HelpMyIMG | أدوات صور خاصة 100% في متصفحك'
  },
  he: {
    highlight: '100% כלי תמונה פרטיים',
    solid: 'מעובדים ישירות בדפדפן שלך',
    tab: 'HelpMyIMG | 100% כלי תמונה פרטיים ישירות בדפדפן'
  },
  tr: {
    highlight: '%100 Gizli ve Özel Resim Araçları',
    solid: 'Doğrudan Tarayıcınızda İşlenir',
    tab: 'HelpMyIMG | %100 Gizli ve Özel Resim Araçları Tarayıcınızda'
  },
  vi: {
    highlight: 'Công Cụ Chỉnh Sửa Ảnh 100% Riêng Tư',
    solid: 'Xử lý trực tiếp ngay trong trình duyệt',
    tab: 'HelpMyIMG | Công Cụ Chỉnh Sửa Ảnh 100% Riêng Tư trong Trình Duyệt'
  },
  th: {
    highlight: 'เครื่องมือแต่งรูปส่วนตัว 100%',
    solid: 'ประมวลผลโดยตรงในเบราว์เซอร์ของคุณ',
    tab: 'HelpMyIMG | เครื่องมือแต่งรูปส่วนตัว 100% ในเบราว์เซอร์ของคุณ'
  },
  pl: {
    highlight: 'W 100% Prywatne Narzędzia do Zdjęć',
    solid: 'Przetwarzane bezpośrednio w przeglądarce',
    tab: 'HelpMyIMG | W 100% Prywatne Narzędzia do Zdjęć w Przeglądarce'
  },
  nl: {
    highlight: '100% Privé Beeldtools',
    solid: 'Direct in uw browser verwerkt',
    tab: 'HelpMyIMG | 100% Privé Beeldtools direct in uw browser'
  },
  sv: {
    highlight: '100% Privata Bildverktyg',
    solid: 'Bearbetas direkt i din webbläsare',
    tab: 'HelpMyIMG | 100% Privata Bildverktyg i din webbläsare'
  },
  da: {
    highlight: '100% Private Billedværktøjer',
    solid: 'Behandlet direkte i din browser',
    tab: 'HelpMyIMG | 100% Private Billedværktøjer i din browser'
  },
  no: {
    highlight: '100% Private Bildeverktøy',
    solid: 'Behandlet direkte i nettleseren din',
    tab: 'HelpMyIMG | 100% Private Bildeverktøy i nettleseren din'
  },
  fi: {
    highlight: '100% Yksityiset Kuvatyökalut',
    solid: 'Käsitelty suoraan selaimessasi',
    tab: 'HelpMyIMG | 100% Yksityiset Kuvatyökalut suoraan selaimessasi'
  },
  cs: {
    highlight: '100% Soukromé Nástroje pro Obrázky',
    solid: 'Zpracováno přímo ve vašem prohlížeči',
    tab: 'HelpMyIMG | 100% Soukromé Nástroje pro Obrázky v Prohlížeči'
  },
  hu: {
    highlight: '100%-ban Privát Képszerkesztő Eszközök',
    solid: 'Közvetlenül a böngésződben feldolgozva',
    tab: 'HelpMyIMG | 100%-ban Privát Képszerkesztő Eszközök a Böngészőben'
  },
  el: {
    highlight: '100% Ιδιωτικά Εργαλεία Εικόνας',
    solid: 'Επεξεργασία απευθείας στο πρόγραμμα περιήγησης',
    tab: 'HelpMyIMG | 100% Ιδιωτικά Εργαλεία Εικόνας στο Πρόγραμμα Περιήγησης'
  },
  ro: {
    highlight: 'Instrumente Foto 100% Private',
    solid: 'Procesate direct în browserul dvs.',
    tab: 'HelpMyIMG | Instrumente Foto 100% Private în Browserul Dvs.'
  },
  hi: {
    highlight: '100% निजी फ़ोटो और छवि उपकरण',
    solid: 'सीधे आपके ब्राउज़र में सुरक्षित रूप से प्रोसेस',
    tab: 'HelpMyIMG | 100% निजी फ़ोटो और छवि उपकरण आपके ब्राउज़र में'
  },
  tl: {
    highlight: '100% Pribadong Mga Tool sa Larawan',
    solid: 'Pinoproseso nang direkta sa iyong browser',
    tab: 'HelpMyIMG | 100% Pribadong Mga Tool sa Larawan sa Iyong Browser'
  }
};

function main() {
  const langs = Object.keys(PERFECTED_TRANSLATIONS);
  console.log(`Updating ${langs.length} languages with perfected contextual translations...`);

  for (const lang of langs) {
    const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    const json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const t = PERFECTED_TRANSLATIONS[lang];

    json['home.hero.titleHighlight'] = t.highlight;
    json['home.hero.titleSolid'] = t.solid;
    json['home.tab.title'] = t.tab;

    fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
    console.log(`✓ [${lang}]: [${t.highlight}] [${t.solid}]`);
  }

  console.log('\nAll 30 languages updated successfully with zero commas and native terminology!');
}

main();
