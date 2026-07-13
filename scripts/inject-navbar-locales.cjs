const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// Localization maps
const translations = {
  ar: {
    'nav.cat.modify': 'تعديل',
    'nav.cat.security': 'الأمان والهوية',
    'nav.cat.optimize': 'تحسين وتحويل',
    'nav.removeBgDesc': 'إزالة الخلفية تلقائيًا بالذكاء الاصطناعي',
    'nav.resizeDesc': 'تغيير أبعاد الصورة بالبكسل',
    'nav.cropDesc': 'قص واقتصاص صورك',
    'nav.rotateDesc': 'تدوير وقلب الصور',
    'nav.pickerDesc': 'استخراج الألوان ولوحات الصور',
    'nav.colorBgDesc': 'صور جواز السفر الرسمية',
    'nav.watermarkDesc': 'حماية حقوق الطبع والنشر للصور',
    'nav.compressDesc': 'تقليل حجم الملف بنسبة 90%',
    'nav.convertDesc': 'تحويل JPG، PNG، WEBP',
    'nav.megaMenu.secure': 'معالجة محلية آمنة 100%',
    'nav.megaMenu.latency': 'زمن انتقال 0 مللي ثانية',
  },
  de: {
    'nav.cat.modify': 'Bearbeiten',
    'nav.cat.security': 'Sicherheit & ID',
    'nav.cat.optimize': 'Optimieren & Konvertieren',
    'nav.removeBgDesc': 'Automatisches Entfernen des Hintergrunds mit KI',
    'nav.resizeDesc': 'Pixel-Dimensionen ändern',
    'nav.cropDesc': 'Fotos zuschneiden und trimmen',
    'nav.rotateDesc': 'Bilder drehen & spiegeln',
    'nav.pickerDesc': 'Bildfarben & Paletten extrahieren',
    'nav.colorBgDesc': 'Offizielle Passfotos',
    'nav.watermarkDesc': 'Urheberrecht von Bildern schützen',
    'nav.compressDesc': 'Dateigrößen um 90% reduzieren',
    'nav.convertDesc': 'JPG-, PNG-, WEBP-Konvertierung',
    'nav.megaMenu.secure': '100% sichere lokale Verarbeitung',
    'nav.megaMenu.latency': '0ms Latenz',
  },
  en: {
    'nav.cat.modify': 'Modify',
    'nav.cat.security': 'Security & ID',
    'nav.cat.optimize': 'Optimize & Convert',
    'nav.removeBgDesc': 'AI auto background removal',
    'nav.resizeDesc': 'Change pixel dimensions',
    'nav.cropDesc': 'Cut & trim your photos',
    'nav.rotateDesc': 'Rotate & flip images',
    'nav.pickerDesc': 'Extract image colors & palettes',
    'nav.colorBgDesc': 'Official passport photos',
    'nav.watermarkDesc': 'Protect image copyrights',
    'nav.compressDesc': 'Reduce file sizes by 90%',
    'nav.convertDesc': 'JPG, PNG, WEBP conversion',
    'nav.megaMenu.secure': '100% Secure Client-Side Processing',
    'nav.megaMenu.latency': '0ms Latency',
  },
  es: {
    'nav.cat.modify': 'Modificar',
    'nav.cat.security': 'Seguridad e ID',
    'nav.cat.optimize': 'Optimizar y Convertir',
    'nav.removeBgDesc': 'Eliminación automática de fondos por IA',
    'nav.resizeDesc': 'Cambiar dimensiones de píxeles',
    'nav.cropDesc': 'Cortar y recortar tus fotos',
    'nav.rotateDesc': 'Rotar y voltear imágenes',
    'nav.pickerDesc': 'Extraer colores y paletas de imágenes',
    'nav.colorBgDesc': 'Fotos de pasaporte oficiales',
    'nav.watermarkDesc': 'Proteger derechos de autor de imágenes',
    'nav.compressDesc': 'Reducir tamaño de archivos en 90%',
    'nav.convertDesc': 'Conversión de JPG, PNG, WEBP',
    'nav.megaMenu.secure': 'Procesamiento local 100% seguro',
    'nav.megaMenu.latency': '0ms de latencia',
  },
  fr: {
    'nav.cat.modify': 'Modifier',
    'nav.cat.security': 'Sécurité & ID',
    'nav.cat.optimize': 'Optimiser & Convertir',
    'nav.removeBgDesc': 'Suppression automatique du fond par IA',
    'nav.resizeDesc': 'Modifier les dimensions en pixels',
    'nav.cropDesc': 'Couper & rogner vos photos',
    'nav.rotateDesc': 'Pivoter & retourner les images',
    'nav.pickerDesc': 'Extraire couleurs & palettes d\'images',
    'nav.colorBgDesc': 'Photos de passeport officielles',
    'nav.watermarkDesc': 'Protéger les droits d\'auteur des images',
    'nav.compressDesc': 'Réduire la taille des fichiers de 90%',
    'nav.convertDesc': 'Conversion JPG, PNG, WEBP',
    'nav.megaMenu.secure': 'Traitement local 100% sécurisé',
    'nav.megaMenu.latency': '0ms de latence',
  },
  id: {
    'nav.cat.modify': 'Ubah',
    'nav.cat.security': 'Keamanan & ID',
    'nav.cat.optimize': 'Optimalkan & Konversi',
    'nav.removeBgDesc': 'Hapus latar belakang otomatis AI',
    'nav.resizeDesc': 'Ubah dimensi piksel gambar',
    'nav.cropDesc': 'Potong & pangkas foto Anda',
    'nav.rotateDesc': 'Putar & balikkan gambar',
    'nav.pickerDesc': 'Ekstrak warna & palet gambar',
    'nav.colorBgDesc': 'Pas foto resmi instan',
    'nav.watermarkDesc': 'Lindungi hak cipta gambar',
    'nav.compressDesc': 'Kurangi ukuran file hingga 90%',
    'nav.convertDesc': 'Konversi format JPG, PNG, WEBP',
    'nav.megaMenu.secure': 'Pemrosesan Client-Side 100% Aman',
    'nav.megaMenu.latency': 'Latensi 0ms',
  },
  ja: {
    'nav.cat.modify': '変更',
    'nav.cat.security': 'セキュリティとID',
    'nav.cat.optimize': '最適化と変換',
    'nav.removeBgDesc': 'AIによる背景の自動削除',
    'nav.resizeDesc': 'ピクセル寸法の変更',
    'nav.cropDesc': '写真の切り取りとトリミング',
    'nav.rotateDesc': '画像の回転と反転',
    'nav.pickerDesc': '画像の色とパレットの抽出',
    'nav.colorBgDesc': '公式パスポート写真',
    'nav.watermarkDesc': '画像の著作権保護',
    'nav.compressDesc': 'ファイルサイズを90%削減',
    'nav.convertDesc': 'JPG、PNG、WEBP変換',
    'nav.megaMenu.secure': '100%安全なローカル処理',
    'nav.megaMenu.latency': '遅延0ms',
  },
  ko: {
    'nav.cat.modify': '수정',
    'nav.cat.security': '보안 및 ID',
    'nav.cat.optimize': '최적화 및 변환',
    'nav.removeBgDesc': 'AI 자동 배경 제거',
    'nav.resizeDesc': '픽셀 크기 변경',
    'nav.cropDesc': '사진 자르기 및 트리밍',
    'nav.rotateDesc': '이미지 회전 및 뒤집기',
    'nav.pickerDesc': '이미지 색상 및 팔레트 추출',
    'nav.colorBgDesc': '공식 여권 사진',
    'nav.watermarkDesc': '이미지 저작권 보호',
    'nav.compressDesc': '파일 크기 90% 감소',
    'nav.convertDesc': 'JPG, PNG, WEBP 변환',
    'nav.megaMenu.secure': '100% 안전한 로컬 처리',
    'nav.megaMenu.latency': '0ms 대기 시간',
  },
  ru: {
    'nav.cat.modify': 'Изменить',
    'nav.cat.security': 'Безопасность и ID',
    'nav.cat.optimize': 'Оптимизация и Конвертация',
    'nav.removeBgDesc': 'Автоматическое удаление фона с ИИ',
    'nav.resizeDesc': 'Изменение размеров в пикселях',
    'nav.cropDesc': 'Обрезка и подгонка ваших фотографий',
    'nav.rotateDesc': 'Поворот и отражение изображений',
    'nav.pickerDesc': 'Извлечение цветов и палитр изображений',
    'nav.colorBgDesc': 'Официальные фотографии на паспорт',
    'nav.watermarkDesc': 'Защита авторских прав на изображения',
    'nav.compressDesc': 'Уменьшение размера файлов на 90%',
    'nav.convertDesc': 'Конвертация JPG, PNG, WEBP',
    'nav.megaMenu.secure': '100% безопасная локальная обработка',
    'nav.megaMenu.latency': 'Задержка 0 мс',
  },
  zh: {
    'nav.cat.modify': '修改',
    'nav.cat.security': '安全与证件',
    'nav.cat.optimize': '优化与转换',
    'nav.removeBgDesc': 'AI智能自动去除背景',
    'nav.resizeDesc': '修改图片像素尺寸',
    'nav.cropDesc': '剪裁与修剪您的照片',
    'nav.rotateDesc': '旋转与翻转图片',
    'nav.pickerDesc': '提取图片颜色和色板',
    'nav.colorBgDesc': '官方标准证件照',
    'nav.watermarkDesc': '保护图片版权水印',
    'nav.compressDesc': '减小文件大小达90%',
    'nav.convertDesc': 'JPG、PNG、WEBP格式转换',
    'nav.megaMenu.secure': '100%安全本地端处理',
    'nav.megaMenu.latency': '0ms极速响应',
  }
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
  console.log(`Updated Navbar keys for: ${lang}`);
});
