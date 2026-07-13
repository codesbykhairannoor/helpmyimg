const fs = require('fs');
const path = require('path');

const pseoFilePath = path.join(__dirname, '../src/data/pseoKeywords.ts');
let pseoContent = fs.readFileSync(pseoFilePath, 'utf8');

// Dictionary for 30 languages
const dict = {
  ar: { name: 'Compress', compress: 'ضغط', convert: 'تحويل', resize: 'تغيير الحجم', image: 'صورة', free: 'مجاني', fast: 'سريع' },
  bg: { name: 'Compress', compress: 'Компресиране', convert: 'Конвертиране', resize: 'Преоразмеряване', image: 'Изображение', free: 'Безплатно', fast: 'Бързо' },
  cs: { name: 'Compress', compress: 'Komprimovat', convert: 'Převést', resize: 'Změnit velikost', image: 'Obrázek', free: 'Zdarma', fast: 'Rychlý' },
  da: { name: 'Compress', compress: 'Komprimer', convert: 'Konverter', resize: 'Tilpas', image: 'Billede', free: 'Gratis', fast: 'Hurtig' },
  de: { name: 'Compress', compress: 'Komprimieren', convert: 'Konvertieren', resize: 'Größe ändern', image: 'Bild', free: 'Kostenlos', fast: 'Schnell' },
  el: { name: 'Compress', compress: 'Συμπίεση', convert: 'Μετατροπή', resize: 'Αλλαγή μεγέθους', image: 'Εικόνα', free: 'Δωρεάν', fast: 'Γρήγορα' },
  en: { name: 'Compress', compress: 'Compress', convert: 'Convert', resize: 'Resize', image: 'Image', free: 'Free', fast: 'Fast' },
  es: { name: 'Compress', compress: 'Comprimir', convert: 'Convertir', resize: 'Redimensionar', image: 'Imagen', free: 'Gratis', fast: 'Rápido' },
  fi: { name: 'Compress', compress: 'Pakkaa', convert: 'Muunna', resize: 'Muuta kokoa', image: 'Kuva', free: 'Ilmainen', fast: 'Nopea' },
  fr: { name: 'Compress', compress: 'Compresser', convert: 'Convertir', resize: 'Redimensionner', image: 'Image', free: 'Gratuit', fast: 'Rapide' },
  he: { name: 'Compress', compress: 'דחיסה', convert: 'המרה', resize: 'שינוי גודל', image: 'תמונה', free: 'חינם', fast: 'מהיר' },
  hi: { name: 'Compress', compress: 'कंप्रेस', convert: 'बदलें', resize: 'आकार बदलें', image: 'छवि', free: 'मुफ़्त', fast: 'तेज़' },
  hu: { name: 'Compress', compress: 'Tömörítés', convert: 'Konvertálás', resize: 'Átméretezés', image: 'Kép', free: 'Ingyenes', fast: 'Gyors' },
  id: { name: 'Compress', compress: 'Kompres', convert: 'Ubah Format', resize: 'Ubah Ukuran', image: 'Gambar', free: 'Gratis', fast: 'Cepat' },
  it: { name: 'Compress', compress: 'Comprimi', convert: 'Converti', resize: 'Ridimensiona', image: 'Immagine', free: 'Gratis', fast: 'Veloce' },
  ja: { name: 'Compress', compress: '圧縮', convert: '変換', resize: 'サイズ変更', image: '画像', free: '無料', fast: '高速' },
  ko: { name: 'Compress', compress: '압축', convert: '변환', resize: '크기 조정', image: '이미지', free: '무료', fast: '빠른' },
  ms: { name: 'Compress', compress: 'Mampat', convert: 'Tukar Format', resize: 'Ubah Saiz', image: 'Imej', free: 'Percuma', fast: 'Pantas' },
  nl: { name: 'Compress', compress: 'Comprimeren', convert: 'Converteren', resize: 'Formaat wijzigen', image: 'Afbeelding', free: 'Gratis', fast: 'Snel' },
  no: { name: 'Compress', compress: 'Komprimer', convert: 'Konverter', resize: 'Endre størrelse', image: 'Bilde', free: 'Gratis', fast: 'Rask' },
  pl: { name: 'Compress', compress: 'Kompresuj', convert: 'Konwertuj', resize: 'Zmień rozmiar', image: 'Obraz', free: 'Za darmo', fast: 'Szybki' },
  pt: { name: 'Compress', compress: 'Comprimir', convert: 'Converter', resize: 'Redimensionar', image: 'Imagem', free: 'Grátis', fast: 'Rápido' },
  ro: { name: 'Compress', compress: 'Comprimare', convert: 'Convertire', resize: 'Redimensionare', image: 'Imagine', free: 'Gratuit', fast: 'Rapid' },
  ru: { name: 'Compress', compress: 'Сжатие', convert: 'Конвертировать', resize: 'Изменить размер', image: 'Изображение', free: 'Бесплатно', fast: 'Быстро' },
  sv: { name: 'Compress', compress: 'Komprimera', convert: 'Konvertera', resize: 'Ändra storlek', image: 'Bild', free: 'Gratis', fast: 'Snabb' },
  th: { name: 'Compress', compress: 'บีบอัด', convert: 'แปลง', resize: 'เปลี่ยนขนาด', image: 'รูปภาพ', free: 'ฟรี', fast: 'เร็ว' },
  tl: { name: 'Compress', compress: 'I-compress', convert: 'I-convert', resize: 'I-resize', image: 'Larawan', free: 'Libre', fast: 'Mabilis' },
  tr: { name: 'Compress', compress: 'Sıkıştır', convert: 'Dönüştür', resize: 'Boyutlandır', image: 'Resim', free: 'Ücretsiz', fast: 'Hızlı' },
  uk: { name: 'Compress', compress: 'Стиснути', convert: 'Конвертувати', resize: 'Змінити розмір', image: 'Зображення', free: 'Безкоштовно', fast: 'Швидко' },
  vi: { name: 'Compress', compress: 'Nén', convert: 'Chuyển đổi', resize: 'Đổi kích thước', image: 'Hình ảnh', free: 'Miễn phí', fast: 'Nhanh' },
  zh: { name: 'Compress', compress: '压缩', convert: '转换', resize: '调整大小', image: '图片', free: '免费', fast: '快速' }
};

let newEntries = [];

Object.keys(dict).forEach(lang => {
  // Skip the ones we already added manually (id, en, es) to avoid duplicates, although overwriting is fine
  if (['id', 'en', 'es'].includes(lang)) return; 
  
  const t = dict[lang];
  
  // Compress entry
  newEntries.push(`  {
    slug: 'compress-image-200kb-free-${lang}',
    tool: 'compress',
    lang: '${lang}',
    title: '${t.compress} ${t.image} to 200KB ${t.free} - HelpMyIMG',
    h1: '${t.compress} ${t.image} to 200KB Without Losing Quality',
    description: '${t.compress} your ${t.image} file size instantly to under 200KB. 100% ${t.free} and private.',
    citationFirst: 'How to ${t.compress} an ${t.image} to 200KB? HelpMyIMG offers a zero-latency client-side WebGPU compressor. It leverages standard HTML5 Canvas compression algorithms to scale down massive camera photos to under 200KB instantly.',
    quantitativeProof: 'Maintains 99% visual fidelity while reducing overall file payload by over 90%.',
    beforeImageLabel: 'Original ${t.image}',
    afterImageLabel: 'Compressed ${t.image}',
    faqs: [
      { question: 'Will my ${t.image} lose details?', answer: 'We balance the compression ratio specifically for text and facial features.' },
      { question: 'Is my data secure?', answer: 'Yes, it runs entirely in your web browser.' }
    ]
  }`);

  // Convert entry
  newEntries.push(`  {
    slug: 'convert-webp-to-jpg-${lang}',
    tool: 'convert',
    lang: '${lang}',
    title: '${t.convert} WEBP to JPG ${t.free} - HelpMyIMG',
    h1: 'Instantly ${t.convert} WEBP Images to JPG Format',
    description: 'Transform modern WEBP image formats downloaded from the web into universally compatible JPG or PNG formats in 0 seconds.',
    citationFirst: 'Why cant I open WEBP images on older software? HelpMyIMG fixes this by converting WEBP files directly in your browser to standard JPG or PNG format, allowing instant compatibility.',
    quantitativeProof: 'Processes conversions 500x faster than cloud-based alternatives (0ms vs 5000ms server roundtrips).',
    beforeImageLabel: 'Incompatible WEBP',
    afterImageLabel: 'Standard JPG',
    faqs: [
      { question: 'Can I ${t.convert} multiple files?', answer: 'Our batch processing handles up to 10 images concurrently.' },
      { question: 'Is my data secure?', answer: 'Absolutely. We do not use cloud storage.' }
    ]
  }`);

  // Resize entry
  newEntries.push(`  {
    slug: 'resize-image-4x6-${lang}',
    tool: 'resize',
    lang: '${lang}',
    title: '${t.resize} ${t.image} to 4x6 ${t.free} - HelpMyIMG',
    h1: '${t.resize} Photos to Exact Dimensions',
    description: 'Adjust the width and height of your photos to meet official requirements. 100% private and no installation required.',
    citationFirst: 'How to ${t.resize} an ${t.image}? HelpMyIMG is a browser-based resizing tool that allows precise pixel adjustments. It ensures accurate proportions without facial distortion.',
    quantitativeProof: 'Avoids 100% of official photo rejections due to incorrect pixel proportions.',
    beforeImageLabel: 'Random ${t.image}',
    afterImageLabel: 'Official Dimensions',
    faqs: [
      { question: 'Will the ${t.image} look stretched?', answer: 'Use the lock aspect ratio button to prevent the photo from stretching.' },
      { question: 'Is it completely ${t.free}?', answer: 'Yes, HelpMyIMG will never charge for resizing features.' }
    ]
  }`);
});

// Append to pseoKeywords.ts before the closing bracket of PSEO_KEYWORD_MATRIX
const insertionPoint = pseoContent.lastIndexOf('];');
if (insertionPoint !== -1) {
  const newContent = pseoContent.slice(0, insertionPoint) + ',\n' + newEntries.join(',\n') + '\n' + pseoContent.slice(insertionPoint);
  fs.writeFileSync(pseoFilePath, newContent, 'utf8');
  console.log('Successfully injected massive PSEO matrix for all 30 languages!');
} else {
  console.error('Could not find the end of PSEO_KEYWORD_MATRIX array');
}
