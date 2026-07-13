const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const translations = {
  ar: { 'nav.removeBg': 'إزالة الخلفية', 'nav.blurBg': 'تمويه الاستوديو', 'nav.colorBg': 'صورة جواز السفر', 'nav.watermark': 'علامة مائية', 'nav.compress': 'ضغط الصورة', 'nav.convert': 'تحويل الصورة', 'nav.resize': 'تغيير أبعاد الصورة' },
  bg: { 'nav.removeBg': 'Премахване на фон', 'nav.blurBg': 'Студийно размазване', 'nav.colorBg': 'Паспортна снимка', 'nav.watermark': 'Воден знак', 'nav.compress': 'Компресиране', 'nav.convert': 'Конвертиране', 'nav.resize': 'Преоразмеряване' },
  cs: { 'nav.removeBg': 'Odstranit pozadí', 'nav.blurBg': 'Studiové rozostření', 'nav.colorBg': 'Pasová fotografie', 'nav.watermark': 'Vodoznak', 'nav.compress': 'Komprimovat obrázek', 'nav.convert': 'Převést obrázek', 'nav.resize': 'Změnit velikost' },
  da: { 'nav.removeBg': 'Fjern baggrund', 'nav.blurBg': 'Studie sløring', 'nav.colorBg': 'Pasfoto', 'nav.watermark': 'Vandmærke', 'nav.compress': 'Komprimer billede', 'nav.convert': 'Konverter billede', 'nav.resize': 'Skift størrelse' },
  de: { 'nav.removeBg': 'Hintergrund entfernen', 'nav.blurBg': 'Studio-Unschärfe', 'nav.colorBg': 'Passfoto', 'nav.watermark': 'Wasserzeichen', 'nav.compress': 'Bild komprimieren', 'nav.convert': 'Bild konvertieren', 'nav.resize': 'Größe ändern' },
  el: { 'nav.removeBg': 'Αφαίρεση φόντου', 'nav.blurBg': 'Θόλωμα Studio', 'nav.colorBg': 'Φωτογραφία διαβατηρίου', 'nav.watermark': 'Υδατογράφημα', 'nav.compress': 'Συμπίεση εικόνας', 'nav.convert': 'Μετατροπή εικόνας', 'nav.resize': 'Αλλαγή μεγέθους' },
  en: { 'nav.removeBg': 'Remove Background', 'nav.blurBg': 'Studio Blur', 'nav.colorBg': 'Passport Photo', 'nav.watermark': 'Watermark Image', 'nav.compress': 'Compress Image', 'nav.convert': 'Convert Image', 'nav.resize': 'Resize Dimensions' },
  es: { 'nav.removeBg': 'Quitar Fondo', 'nav.blurBg': 'Desenfoque de Estudio', 'nav.colorBg': 'Foto de Pasaporte', 'nav.watermark': 'Marca de Agua', 'nav.compress': 'Comprimir Imagen', 'nav.convert': 'Convertir Imagen', 'nav.resize': 'Redimensionar Imagen' },
  fi: { 'nav.removeBg': 'Poista tausta', 'nav.blurBg': 'Studion sumennus', 'nav.colorBg': 'Passikuva', 'nav.watermark': 'Vesileima', 'nav.compress': 'Pakkaa kuva', 'nav.convert': 'Muunna kuva', 'nav.resize': 'Muuta kokoa' },
  fr: { 'nav.removeBg': 'Supprimer le Fond', 'nav.blurBg': 'Flou de Studio', 'nav.colorBg': 'Photo de Passeport', 'nav.watermark': 'Filigrane', 'nav.compress': 'Compresser l\'Image', 'nav.convert': 'Convertir l\'Image', 'nav.resize': 'Redimensionner' },
  he: { 'nav.removeBg': 'הסר רקע', 'nav.blurBg': 'טשטוש סטודיו', 'nav.colorBg': 'תמונת דרכון', 'nav.watermark': 'סימן מים', 'nav.compress': 'דחוס תמונה', 'nav.convert': 'המר תמונה', 'nav.resize': 'שנה מידות' },
  hi: { 'nav.removeBg': 'बैकग्राउंड हटाएँ', 'nav.blurBg': 'स्टूडियो ब्लर', 'nav.colorBg': 'पासपोर्ट फोटो', 'nav.watermark': 'वॉटरमार्क', 'nav.compress': 'इमेज कंप्रेस', 'nav.convert': 'इमेज कनवर्ट', 'nav.resize': 'आकार बदलें' },
  hu: { 'nav.removeBg': 'Háttér eltávolítása', 'nav.blurBg': 'Stúdió elmosódás', 'nav.colorBg': 'Útlevélkép', 'nav.watermark': 'Vízjel', 'nav.compress': 'Kép tömörítése', 'nav.convert': 'Kép konvertálása', 'nav.resize': 'Átméretezés' },
  id: { 'nav.removeBg': 'Hapus Latar', 'nav.blurBg': 'Blur Studio', 'nav.colorBg': 'Pas Foto', 'nav.watermark': 'Watermark Gambar', 'nav.compress': 'Kompres Gambar', 'nav.convert': 'Konversi Gambar', 'nav.resize': 'Ubah Ukuran' },
  it: { 'nav.removeBg': 'Rimuovi Sfondo', 'nav.blurBg': 'Sfocatura Studio', 'nav.colorBg': 'Foto Passaporto', 'nav.watermark': 'Filigrana', 'nav.compress': 'Comprimi Immagine', 'nav.convert': 'Converti Immagine', 'nav.resize': 'Ridimensiona' },
  ja: { 'nav.removeBg': '背景を削除', 'nav.blurBg': 'スタジオぼかし', 'nav.colorBg': '証明写真', 'nav.watermark': '透かし', 'nav.compress': '画像を圧縮', 'nav.convert': '画像変換', 'nav.resize': 'サイズ変更' },
  ko: { 'nav.removeBg': '배경 제거', 'nav.blurBg': '스튜디오 블러', 'nav.colorBg': '여권 사진', 'nav.watermark': '워터마크', 'nav.compress': '이미지 압축', 'nav.convert': '이미지 변환', 'nav.resize': '이미지 크기 조절' },
  ms: { 'nav.removeBg': 'Buang Latar Belakang', 'nav.blurBg': 'Kekaburan Studio', 'nav.colorBg': 'Gambar Pasport', 'nav.watermark': 'Tanda Air', 'nav.compress': 'Mampat Imej', 'nav.convert': 'Tukar Imej', 'nav.resize': 'Ubah Saiz' },
  nl: { 'nav.removeBg': 'Achtergrond verwijderen', 'nav.blurBg': 'Studio-vervaging', 'nav.colorBg': 'Pasfoto', 'nav.watermark': 'Watermerk', 'nav.compress': 'Afbeelding comprimeren', 'nav.convert': 'Afbeelding converteren', 'nav.resize': 'Formaat wijzigen' },
  no: { 'nav.removeBg': 'Fjern bakgrunn', 'nav.blurBg': 'Studio-uskarphet', 'nav.colorBg': 'Passfoto', 'nav.watermark': 'Vannmerke', 'nav.compress': 'Komprimer bilde', 'nav.convert': 'Konverter bilde', 'nav.resize': 'Endre størrelse' },
  pl: { 'nav.removeBg': 'Usuń tło', 'nav.blurBg': 'Rozmycie studyjne', 'nav.colorBg': 'Zdjęcie paszportowe', 'nav.watermark': 'Znak wodny', 'nav.compress': 'Kompresuj obraz', 'nav.convert': 'Konwertuj obraz', 'nav.resize': 'Zmień rozmiar' },
  pt: { 'nav.removeBg': 'Remover Fundo', 'nav.blurBg': 'Desfoque de Estúdio', 'nav.colorBg': 'Foto de Passaporte', 'nav.watermark': 'Marca d\'água', 'nav.compress': 'Comprimir Imagem', 'nav.convert': 'Converter Imagem', 'nav.resize': 'Redimensionar' },
  ro: { 'nav.removeBg': 'Eliminare Fundal', 'nav.blurBg': 'Estompare Studio', 'nav.colorBg': 'Fotografie Pașaport', 'nav.watermark': 'Filigran', 'nav.compress': 'Comprimare Imagine', 'nav.convert': 'Convertire Imagine', 'nav.resize': 'Redimensionare' },
  ru: { 'nav.removeBg': 'Удалить фон', 'nav.blurBg': 'Студийное размытие', 'nav.colorBg': 'Фото на паспорт', 'nav.watermark': 'Водяной знак', 'nav.compress': 'Сжать изображение', 'nav.convert': 'Конвертировать', 'nav.resize': 'Изменить размер' },
  sv: { 'nav.removeBg': 'Ta bort bakgrund', 'nav.blurBg': 'Studio-oskärpa', 'nav.colorBg': 'Passfoto', 'nav.watermark': 'Vattenstämpel', 'nav.compress': 'Komprimera bild', 'nav.convert': 'Konvertera bild', 'nav.resize': 'Ändra storlek' },
  th: { 'nav.removeBg': 'ลบพื้นหลัง', 'nav.blurBg': 'เบลอสตูดิโอ', 'nav.colorBg': 'รูปถ่ายหนังสือเดินทาง', 'nav.watermark': 'ลายน้ำ', 'nav.compress': 'บีบอัดรูปภาพ', 'nav.convert': 'แปลงรูปภาพ', 'nav.resize': 'ปรับขนาดรูปภาพ' },
  tl: { 'nav.removeBg': 'Alisin ang Background', 'nav.blurBg': 'Studio Blur', 'nav.colorBg': 'Passport Photo', 'nav.watermark': 'Watermark', 'nav.compress': 'I-compress ang Larawan', 'nav.convert': 'I-convert ang Larawan', 'nav.resize': 'I-resize ang Larawan' },
  tr: { 'nav.removeBg': 'Arka Planı Kaldır', 'nav.blurBg': 'Stüdyo Bulanıklığı', 'nav.colorBg': 'Vesikalık Fotoğraf', 'nav.watermark': 'Filigran', 'nav.compress': 'Resmi Sıkıştır', 'nav.convert': 'Resmi Dönüştür', 'nav.resize': 'Boyutlandır' },
  uk: { 'nav.removeBg': 'Видалити фон', 'nav.blurBg': 'Студійне розмиття', 'nav.colorBg': 'Фото на паспорт', 'nav.watermark': 'Водяний знак', 'nav.compress': 'Стиснути зображення', 'nav.convert': 'Конвертувати зображення', 'nav.resize': 'Змінити розмір' },
  vi: { 'nav.removeBg': 'Xóa Nền', 'nav.blurBg': 'Làm mờ Studio', 'nav.colorBg': 'Ảnh hộ chiếu', 'nav.watermark': 'Đóng dấu', 'nav.compress': 'Nén Ảnh', 'nav.convert': 'Chuyển Đổi Ảnh', 'nav.resize': 'Đổi kích thước' },
  zh: { 'nav.removeBg': '去除背景', 'nav.blurBg': '工作室虚化', 'nav.colorBg': '证件照制作', 'nav.watermark': '添加水印', 'nav.compress': '压缩图片', 'nav.convert': '转换格式', 'nav.resize': '修改尺寸' }
};

const fallback = translations['en'];

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (!fs.existsSync(filePath)) return;
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const langTranslations = translations[lang] || fallback;
  
  Object.entries(langTranslations).forEach(([key, val]) => {
    data[key] = val;
  });
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`Updated Tool Titles for: ${lang}`);
});
