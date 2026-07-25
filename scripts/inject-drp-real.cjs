const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const dict = {
  ar: { name: 'Compress', design: 'تصميم', rotate: 'تدوير', picker: 'منتقي الألوان', image: 'صورة', free: 'مجاني', fast: 'سريع' },
  bg: { name: 'Compress', design: 'Дизайн', rotate: 'Завъртане', picker: 'Избор на цвят', image: 'Изображение', free: 'Безплатно', fast: 'Бързо' },
  cs: { name: 'Compress', design: 'Design', rotate: 'Otočit', picker: 'Výběr barvy', image: 'Obrázek', free: 'Zdarma', fast: 'Rychlý' },
  da: { name: 'Compress', design: 'Design', rotate: 'Roter', picker: 'Farvevælger', image: 'Billede', free: 'Gratis', fast: 'Hurtig' },
  de: { name: 'Compress', design: 'Design', rotate: 'Drehen', picker: 'Farbwähler', image: 'Bild', free: 'Kostenlos', fast: 'Schnell' },
  el: { name: 'Compress', design: 'Σχέδιο', rotate: 'Περιστροφή', picker: 'Επιλογέας χρώματος', image: 'Εικόνα', free: 'Δωρεάν', fast: 'Γρήγορα' },
  en: { name: 'Compress', design: 'Design', rotate: 'Rotate', picker: 'Color Picker', image: 'Image', free: 'Free', fast: 'Fast' },
  es: { name: 'Compress', design: 'Diseño', rotate: 'Rotar', picker: 'Selector de color', image: 'Imagen', free: 'Gratis', fast: 'Rápido' },
  fi: { name: 'Compress', design: 'Suunnittelu', rotate: 'Kierrä', picker: 'Värinvalitsin', image: 'Kuva', free: 'Ilmainen', fast: 'Nopea' },
  fr: { name: 'Compress', design: 'Conception', rotate: 'Tourner', picker: 'Sélecteur de couleurs', image: 'Image', free: 'Gratuit', fast: 'Rapide' },
  he: { name: 'Compress', design: 'עיצוב', rotate: 'סובב', picker: 'בוחר צבעים', image: 'תמונה', free: 'חינם', fast: 'מהיר' },
  hi: { name: 'Compress', design: 'डिज़ाइन', rotate: 'घुमाएँ', picker: 'रंग बीनने वाला', image: 'छवि', free: 'मुफ़्त', fast: 'तेज़' },
  hu: { name: 'Compress', design: 'Tervezés', rotate: 'Forgatás', picker: 'Színválasztó', image: 'Kép', free: 'Ingyenes', fast: 'Gyors' },
  id: { name: 'Compress', design: 'Desain', rotate: 'Putar', picker: 'Pemetik Warna', image: 'Gambar', free: 'Gratis', fast: 'Cepat' },
  it: { name: 'Compress', design: 'Design', rotate: 'Ruota', picker: 'Selettore colori', image: 'Immagine', free: 'Gratis', fast: 'Veloce' },
  ja: { name: 'Compress', design: 'デザイン', rotate: '回転する', picker: 'カラーピッカー', image: '画像', free: '無料', fast: '高速' },
  ko: { name: 'Compress', design: '디자인', rotate: '회전', picker: '색상 선택기', image: '이미지', free: '무료', fast: '빠른' },
  ms: { name: 'Compress', design: 'Reka Bentuk', rotate: 'Putar', picker: 'Pemilih Warna', image: 'Imej', free: 'Percuma', fast: 'Pantas' },
  nl: { name: 'Compress', design: 'Ontwerp', rotate: 'Draaien', picker: 'Kleurkiezer', image: 'Afbeelding', free: 'Gratis', fast: 'Snel' },
  no: { name: 'Compress', design: 'Design', rotate: 'Roter', picker: 'Fargevelger', image: 'Bilde', free: 'Gratis', fast: 'Rask' },
  pl: { name: 'Compress', design: 'Projekt', rotate: 'Obróć', picker: 'Próbnik kolorów', image: 'Obraz', free: 'Za darmo', fast: 'Szybki' },
  pt: { name: 'Compress', design: 'Design', rotate: 'Girar', picker: 'Seletor de cores', image: 'Imagem', free: 'Grátis', fast: 'Rápido' },
  ro: { name: 'Compress', design: 'Design', rotate: 'Rotiți', picker: 'Selector de culori', image: 'Imagine', free: 'Gratuit', fast: 'Rapid' },
  ru: { name: 'Compress', design: 'Дизайн', rotate: 'Вращать', picker: 'Выбор цвета', image: 'Изображение', free: 'Бесплатно', fast: 'Быстро' },
  sv: { name: 'Compress', design: 'Design', rotate: 'Rotera', picker: 'Färgväljare', image: 'Bild', free: 'Gratis', fast: 'Snabb' },
  th: { name: 'Compress', design: 'ออกแบบ', rotate: 'หมุน', picker: 'ตัวเลือกสี', image: 'รูปภาพ', free: 'ฟรี', fast: 'เร็ว' },
  tl: { name: 'Compress', design: 'Disenyo', rotate: 'Paikutin', picker: 'Tagapili ng kulay', image: 'Larawan', free: 'Libre', fast: 'Mabilis' },
  tr: { name: 'Compress', design: 'Tasarım', rotate: 'Döndür', picker: 'Renk Seçici', image: 'Resim', free: 'Ücretsiz', fast: 'Hızlı' },
  uk: { name: 'Compress', design: 'Дизайн', rotate: 'Обернути', picker: 'Вибір кольору', image: 'Зображення', free: 'Безкоштовно', fast: 'Швидко' },
  vi: { name: 'Compress', design: 'Thiết kế', rotate: 'Xoay', picker: 'Bảng chọn màu', image: 'Hình ảnh', free: 'Miễn phí', fast: 'Nhanh' },
  zh: { name: 'Compress', design: '设计', rotate: '旋转', picker: '颜色选择器', image: '图片', free: '免费', fast: '快速' }
};

function generateTranslations(langCode) {
  const t = dict[langCode] || dict['en'];
  
  return {
    // DESIGN
    "landing.design.redesign.heroBadge": `STUDIO ${t.design.toUpperCase()}`,
    "landing.design.redesign.heroTitle": `Professional ${t.design}`,
    "landing.design.redesign.heroTitle2": ` Editor`,
    "landing.design.redesign.heroDesc": `Advanced ${t.design} tools directly in your browser. 100% ${t.free} and private.`,
    "landing.design.redesign.feat1Title": `${t.design} Assets`,
    "landing.design.redesign.feat1Desc": `Create stunning visuals.`,
    "landing.design.redesign.feat2Title": `Layer Management`,
    "landing.design.redesign.feat2Desc": `Organize elements perfectly.`,
    "landing.design.redesign.feat3Title": `Vectors & Shapes`,
    "landing.design.redesign.feat3Desc": `High quality elements.`,
    "landing.design.redesign.feat4Title": `Cloud Sync`,
    "landing.design.redesign.feat4Desc": `Save your work anywhere.`,
    "landing.design.redesign.stepsTag": `How it works`,
    "landing.design.redesign.stepsTitle": `Simple Workflow`,
    "landing.design.redesign.s1Title": `Open ${t.image}`,
    "landing.design.redesign.s1Desc": `Load your base canvas.`,
    "landing.design.redesign.s2Title": `Edit & ${t.design}`,
    "landing.design.redesign.s2Desc": `Add text and shapes.`,
    "landing.design.redesign.s3Title": `Export`,
    "landing.design.redesign.s3Desc": `Download your masterpiece.`,
    
    // ROTATE
    "landing.rotate.redesign.heroBadge": `${t.rotate.toUpperCase()} ${t.image.toUpperCase()}`,
    "landing.rotate.redesign.heroTitle": `Quickly ${t.rotate} `,
    "landing.rotate.redesign.heroTitle2": ` Your ${t.image}`,
    "landing.rotate.redesign.heroDesc": `${t.rotate} any ${t.image} accurately. 100% ${t.free}, secure, and ${t.fast}.`,
    "landing.rotate.redesign.feat1Title": `360° ${t.rotate}`,
    "landing.rotate.redesign.feat1Desc": `Full freedom of rotation.`,
    "landing.rotate.redesign.feat2Title": `Lossless Quality`,
    "landing.rotate.redesign.feat2Desc": `Keep original pixels intact.`,
    "landing.rotate.redesign.feat3Title": `Bulk ${t.rotate}`,
    "landing.rotate.redesign.feat3Desc": `Process multiple images.`,
    "landing.rotate.redesign.stepsTag": `Workflow`,
    "landing.rotate.redesign.stepsTitle": `Reorient in 3 Steps`,
    "landing.rotate.redesign.s1Title": `Select`,
    "landing.rotate.redesign.s1Desc": `Upload your file.`,
    "landing.rotate.redesign.s2Title": `Adjust`,
    "landing.rotate.redesign.s2Desc": `Set the correct angle.`,
    "landing.rotate.redesign.s3Title": `Save`,
    "landing.rotate.redesign.s3Desc": `Download instantly.`,

    // PICKER
    "landing.picker.redesign.heroBadge": `${t.picker.toUpperCase()}`,
    "landing.picker.redesign.heroTitle": `Smart ${t.picker}`,
    "landing.picker.redesign.heroTitle2": ` Tool`,
    "landing.picker.redesign.heroDesc": `Extract exact colors from any ${t.image}.`,
    "landing.picker.redesign.feat1Title": `HEX & RGB`,
    "landing.picker.redesign.feat1Desc": `Get exact color codes.`,
    "landing.picker.redesign.feat2Title": `Palette Gen`,
    "landing.picker.redesign.feat2Desc": `Auto-generate palettes.`,
    "landing.picker.redesign.feat3Title": `Eyedropper`,
    "landing.picker.redesign.feat3Desc": `Precision pixel selection.`,
    "landing.picker.redesign.stepsTag": `Extract`,
    "landing.picker.redesign.stepsTitle": `Get Colors Instantly`,
    "landing.picker.redesign.s1Title": `Upload`,
    "landing.picker.redesign.s1Desc": `Drop an ${t.image}.`,
    "landing.picker.redesign.s2Title": `Pick`,
    "landing.picker.redesign.s2Desc": `Click any pixel.`,
    "landing.picker.redesign.s3Title": `Copy`,
    "landing.picker.redesign.s3Desc": `Copy to clipboard.`
  };
}

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const newTrans = generateTranslations(lang);
      
      // Merge
      Object.assign(data, newTrans);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated translations for ${lang}`);
    } catch (e) {
      console.error(`Error processing ${lang}:`, e);
    }
  }
});
console.log("All DRP (Design, Rotate, Picker) translations injected successfully!");
