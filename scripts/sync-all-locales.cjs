// scripts/sync-all-locales.cjs
// Script to translate and sync workspace & tool keys across all 30 languages using google-translate-api-x

const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LANG_MAP = {
  en: 'en',
  id: 'id',
  zh: 'zh-CN',
  hi: 'hi',
  es: 'es',
  ja: 'ja',
  pt: 'pt',
  ru: 'ru',
  ar: 'ar',
  fr: 'fr',
  de: 'de',
  ko: 'ko',
  it: 'it',
  tr: 'tr',
  vi: 'vi',
  th: 'th',
  pl: 'pl',
  nl: 'nl',
  sv: 'sv',
  ms: 'ms',
  tl: 'tl',
  uk: 'uk',
  ro: 'ro',
  el: 'el',
  cs: 'cs',
  hu: 'hu',
  da: 'da',
  fi: 'fi',
  no: 'no',
  he: 'iw',
};

const KEYS_TO_SYNC = {
  // Brush Tool
  'brush.mode': 'Brush Mode',
  'brush.restore': '🟢 Restore',
  'brush.erase': '🔴 Erase',
  'brush.size': 'Brush Size',
  'brush.resetMask': 'Reset Brush Strokes',
  'brush.resetSuccess': 'Brush strokes reset successfully!',
  'brush.title': 'Manual Retouch Brush',
  'brush.desc': 'Manually restore or erase parts of your image for pixel-perfect edges.',

  // Resize Tool
  'resize.modeStandard': 'Standard (Squish)',
  'resize.modeSmart': 'Smart Auto',
  'resize.width': 'Width',
  'resize.height': 'Height',
  'resize.lock': 'Lock aspect ratio',
  'resize.unlock': 'Unlock aspect ratio',
  'resize.dimensions': 'Dimensions',

  // Crop Tool
  'crop.title': 'Crop Photo',
  'crop.presets': 'Crop Presets',
  'crop.offset': 'Position',
  'crop.width': 'Width',
  'crop.height': 'Height',
  'crop.radius': 'Corner Radius',

  // Rotate Tool
  'rotate.title': 'Rotate & Flip',
  'rotate.quickRotate': 'Quick Rotation',
  'rotate.customAngle': 'Custom Angle',
  'rotate.flip': 'Flip Orientation',
  'rotate.flipH': 'Flip Horizontal',
  'rotate.flipV': 'Flip Vertical',
  'rotate.angle': 'Rotation Angle',

  // Convert Tool
  'convert.format': 'Select Target Format',
  'convert.processAll': 'Convert All ({{count}})',

  // Compress Tool
  'compress.quality': 'Compression Quality',
  'compress.process': 'Compress Now',
  'compress.processAll': 'Compress All ({{count}})',
  'compress.maxCompress': 'Max Compress',
  'compress.balanced': 'Balanced',
  'compress.highQuality': 'High Quality',

  // Color Background Tool
  'color.off.red': 'Passport Red',
  'color.off.blue': 'Passport Blue',
  'color.off.white': 'Pure White',
  'color.off.black': 'Studio Dark',
  'color.off.gray': 'Soft Gray',
  'color.off.pink': 'Pastel Pink',
  'color.off.green': 'Mint Green',
  'color.off.sky': 'Sky Blue',
  'color.custom': 'Custom Color',
  'color.official': 'Select Official Color',
  'color.gradientTitle': 'Modern Studio Gradients',
  'color.applyNow': '⚡ Change Background Now',
  'color.bgBlur': 'Background Blur (DSLR Effect)',

  // Blur Face & License Plate Tool
  'blur.options': 'Blur Face & Privacy Areas',
  'blur.desc': 'Draw a box directly over the photo or use the quick preset buttons below.',
  'blur.typeBlur': 'Blur (Smooth)',
  'blur.typePixelate': 'Pixelate (Mosaic)',
  'blur.quickAdd': 'Quick Add Box',
  'blur.presetDefault': 'New Box',
  'blur.presetFace': 'Blur Face',
  'blur.presetPlate': 'License Plate',
  'blur.intensity': 'Blur Intensity',
  'blur.activeAreas': 'Active Areas',
  'blur.clearAll': 'Clear All',
  'blur.applyNow': 'Apply Permanent Blur',
  'blur.appliedSuccess': 'Privacy blur applied successfully!',

  // Watermark Tool
  'watermark.pos.center': 'Center',
  'watermark.pos.tl': 'Top Left',
  'watermark.pos.tr': 'Top Right',
  'watermark.pos.bl': 'Bottom Left',
  'watermark.pos.br': 'Bottom Right',
  'watermark.pos.tiled': 'Tiled Pattern',
  'watermark.type.text': 'Text',
  'watermark.type.image': 'Image / Logo',
  'watermark.textLabel': 'Watermark Text',
  'watermark.uploadLabel': 'Upload Logo Watermark',
  'watermark.changeLogo': 'Change Logo',
  'watermark.selectLogo': 'Select PNG Logo',
  'watermark.color': 'Text Color',
  'watermark.opacity': 'Opacity',
  'watermark.scale': 'Scale',
  'watermark.rotation': 'Rotation',
  'watermark.position': 'Watermark Position',
  'watermark.processAll': 'Watermark All ({{count}})',

  // Color Picker Tool
  'picker.title': 'Color Picker & Extractor',
  'picker.instruction': 'Click anywhere on the image to inspect and extract color codes.',
  'picker.clickedColor': 'Selected Color Code',
  'picker.noColor': 'Click on the photo above to pick a color',
  'picker.palette': 'Dominant Color Palette',

  // Action Buttons & Badges
  'editor.resetOriginal': 'Reset to Original',
  'editor.resetDesc': 'Restore this photo to original unedited state',
  'editor.replacePhoto': 'Replace Photo',
  'editor.replacePhotoDesc': 'Replace this photo with a new photo from your device',
  'editor.uploadOther': 'Replace Photo',
  'editor.uploadOtherDesc': 'Replace this photo with a new photo from your device',
  'editor.resetSuccess': 'Image restored to initial state.',
  'editor.download': 'Download HD (Free)',
  'editor.downloadBatch': '📦 Download All (ZIP)',
  'editor.settings': 'Tool Settings',
  'editor.exportSettings': 'Export Settings',
  'editor.exportOptions': 'Export & Download Options',

  'work.badge.remove': 'Remove Background',
  'work.badge.color': 'Change Background',
  'work.badge.brush': 'Magic Brush',
  'work.badge.watermark': 'Watermark',
  'work.badge.compress': 'Compress Photo',
  'work.badge.convert': 'Convert Format',
  'work.badge.resize': 'Resize Image',
  'work.badge.crop': 'Crop Photo',
  'work.badge.rotate': 'Rotate & Flip',
  'work.badge.picker': 'Color Picker',
  'work.badge.blurface': 'Blur Face',
  'work.badge.design': 'Design Editor',
  'work.badge.blur': 'Blur Background',
  'work.exportSettingsTitle': 'Export & Download Options',
  'work.settings': 'Export Settings',
  'work.batchRename': 'Rename Files',
  'work.renameFile': 'Rename File',
  'work.zipPlaceholder': 'Custom ZIP Name',
  'work.singleDownload': 'Download HD (Free)',
  'work.batchDownload': 'Download All (ZIP)',
  'nav.resize': 'Resize Image',

  'convert.convertNow': 'Convert Now',
  'convert.convertFirst': 'Convert First to Download',
  'convert.success': 'Image converted successfully!',
  'crop.preset.full': 'Full',

  // Clean & Concise Landing Titles (No Keyword Stuffing / No "Zero Upload" / No "Carga Cero")
  'landing.default.title.remove': 'Free AI Background Remover Online',
  'landing.default.title.blur': 'Free Studio Bokeh Blur Online',
  'landing.default.title.color': 'Free Passport Photo Background Color',
  'landing.default.title.watermark': 'Free Watermark Maker Online',
  'landing.default.title.compress': 'Free Image Compressor Online',
  'landing.default.title.convert': 'Free Image Format Converter',
  'landing.default.title.resize': 'Free Image Resizer Online',
  'landing.default.title.crop': 'Free Image Cropper Online',
  'landing.default.title.rotate': 'Free Image Rotator & Flip',
  'landing.default.title.picker': 'Free Image Color Picker',
  'landing.default.title.blurface': 'Free Face & License Plate Blur',
  'landing.default.title.design': 'Free Online Photo Editor',
  'landing.default.title.home': 'Free Bulk AI Photo Editor Online',

  // Clean & Concise Landing Descriptions
  'landing.default.desc.remove': 'Remove image backgrounds instantly in your browser. 100% private, fast, and completely free.',
  'landing.default.desc.blur': 'Create DSLR studio bokeh blur effects instantly on any photo background.',
  'landing.default.desc.color': 'Change passport photo background colors to official standards or modern gradients.',
  'landing.default.desc.watermark': 'Add custom text and logo watermarks to your images in bulk to protect your copyright.',
  'landing.default.desc.compress': 'Compress image file sizes precisely while maintaining high visual quality.',
  'landing.default.desc.convert': 'Convert images between PNG, JPG, and WEBP formats instantly in your browser.',
  'landing.default.desc.resize': 'Resize photo dimensions precisely with custom width, height, and aspect ratio.',
  'landing.default.desc.crop': 'Crop photos to exact proportions, circular avatars, or custom dimensions.',
  'landing.default.desc.rotate': 'Rotate and flip photos horizontally or vertically with instant real-time preview.',
  'landing.default.desc.picker': 'Extract color palettes and pinpoint exact hex codes from any image.',
  'landing.default.desc.blurface': 'Protect privacy by blurring or pixelating faces and vehicle license plates.',
  'landing.default.desc.design': 'Edit photos online with advanced filters, annotations, and graphic design tools.',
  'landing.default.desc.home': 'Your local AI photo editor: bulk background removal, resize, compress, and edit photos directly in your browser.',
};

// Indonesian translations override for high quality terminology
const ID_OVERRIDES = {
  'brush.mode': 'Mode Kuas Manual',
  'brush.restore': '🟢 Pulihkan',
  'brush.erase': '🔴 Hapus',
  'brush.size': 'Ukuran Kuas',
  'brush.resetMask': 'Reset Goresan Kuas',
  'brush.resetSuccess': 'Goresan kuas berhasil di-reset!',
  'brush.title': 'Kuas Retouch Manual',
  'brush.desc': 'Pulihkan atau hapus bagian foto secara manual untuk tepian yang rapi.',

  'resize.modeStandard': 'Standar (Regang)',
  'resize.modeSmart': 'Otomatis Pintar',
  'resize.width': 'Lebar',
  'resize.height': 'Tinggi',
  'resize.lock': 'Kunci rasio aspek',
  'resize.unlock': 'Buka kunci rasio aspek',
  'resize.dimensions': 'Dimensi',

  'crop.title': 'Potong Foto',
  'crop.presets': 'Preset Potong',
  'crop.preset.full': 'Penuh',
  'crop.offset': 'Posisi',
  'crop.width': 'Lebar',
  'crop.height': 'Tinggi',
  'crop.radius': 'Lengkungan Sudut',

  'rotate.title': 'Putar & Balik',
  'rotate.quickRotate': 'Rotasi Cepat',
  'rotate.customAngle': 'Sudut Kustom',
  'rotate.flip': 'Balik Orientasi',
  'rotate.flipH': 'Balik Horizontal',
  'rotate.flipV': 'Balik Vertikal',
  'rotate.angle': 'Sudut Rotasi',

  'convert.format': 'Pilih Format Tujuan',
  'convert.convertNow': 'Konversi Sekarang',
  'convert.convertFirst': 'Konversi Dahulu untuk Download',
  'convert.success': 'Foto berhasil dikonversi!',
  'convert.processAll': 'Konversi Semua ({{count}})',

  'compress.quality': 'Kualitas Kompresi',
  'compress.process': 'Kompres Sekarang',
  'compress.processAll': 'Kompres Semua ({{count}})',
  'compress.maxCompress': 'Kompres Maksimal',
  'compress.balanced': 'Seimbang',
  'compress.highQuality': 'Kualitas Tinggi',

  'color.off.red': 'Merah Paspor',
  'color.off.blue': 'Biru Paspor',
  'color.off.white': 'Putih Bersih',
  'color.off.black': 'Hitam Studio',
  'color.off.gray': 'Abu Soft',
  'color.off.pink': 'Pastel Pink',
  'color.off.green': 'Mint Green',
  'color.off.sky': 'Sky Blue',
  'color.custom': 'Warna Kustom',
  'color.official': 'Pilih Warna Resmi',
  'color.gradientTitle': 'Gradasi Studio Modern',
  'color.applyNow': '⚡ Ganti Background Sekarang',
  'color.bgBlur': 'Blur Latar Belakang (Efek DSLR)',

  'blur.options': 'Sensor Wajah & Area Privat',
  'blur.desc': 'Tarik kotak langsung di atas foto atau gunakan tombol preset di bawah.',
  'blur.typeBlur': 'Blur (Halus)',
  'blur.typePixelate': 'Pixelate (Mosaik)',
  'blur.quickAdd': 'Tambah Cepat Kotak',
  'blur.presetDefault': 'Kotak Baru',
  'blur.presetFace': 'Sensor Wajah',
  'blur.presetPlate': 'Plat Nomor',
  'blur.intensity': 'Kekuatan Sensor',
  'blur.activeAreas': 'Area Aktif',
  'blur.clearAll': 'Hapus Semua',
  'blur.applyNow': 'Terapkan Sensor Permanen',
  'blur.appliedSuccess': 'Sensor area berhasil diterapkan!',

  'watermark.pos.center': 'Tengah',
  'watermark.pos.tl': 'Kiri Atas',
  'watermark.pos.tr': 'Kanan Atas',
  'watermark.pos.bl': 'Kiri Bawah',
  'watermark.pos.br': 'Kanan Bawah',
  'watermark.pos.tiled': 'Pola Berulang',
  'watermark.type.text': 'Teks',
  'watermark.type.image': 'Gambar / Logo',
  'watermark.textLabel': 'Teks Watermark',
  'watermark.uploadLabel': 'Unggah Logo Watermark',
  'watermark.changeLogo': 'Ganti Logo',
  'watermark.selectLogo': 'Pilih Logo PNG',
  'watermark.color': 'Warna Teks',
  'watermark.opacity': 'Transparansi',
  'watermark.scale': 'Ukuran',
  'watermark.rotation': 'Rotasi',
  'watermark.position': 'Posisi Watermark',
  'watermark.processAll': 'Beri Watermark Semua ({{count}})',

  'picker.title': 'Pengambil Warna & Palet',
  'picker.instruction': 'Klik bagian mana saja pada foto untuk mengambil kode warna.',
  'picker.clickedColor': 'Kode Warna Terpilih',
  'picker.noColor': 'Klik foto di atas untuk mengambil warna',
  'picker.palette': 'Palet Warna Dominan',

  'editor.resetOriginal': 'Reset ke Asli',
  'editor.resetDesc': 'Kembalikan foto ini ke kondisi asli tanpa perubahan',
  'editor.replacePhoto': 'Ganti Foto',
  'editor.replacePhotoDesc': 'Ganti foto ini dengan foto baru dari perangkat',
  'editor.uploadOther': 'Ganti Foto',
  'editor.uploadOtherDesc': 'Ganti foto ini dengan foto baru dari perangkat',
  'editor.resetSuccess': 'Gambar dikembalikan ke kondisi awal.',
  'editor.download': 'Download HD (Gratis)',
  'editor.downloadBatch': '📦 Download Semua (ZIP)',
  'editor.settings': 'Pengaturan Alat',
  'editor.exportSettings': 'Pengaturan Ekspor',
  'editor.exportOptions': 'Opsi Ekspor & Unduhan',

  'work.badge.remove': 'Hapus Background',
  'work.badge.color': 'Ganti Background',
  'work.badge.brush': 'Kuas Ajaib',
  'work.badge.watermark': 'Watermark',
  'work.badge.compress': 'Kompres Foto',
  'work.badge.convert': 'Ubah Format',
  'work.badge.resize': 'Ubah Ukuran',
  'work.badge.crop': 'Potong Foto',
  'work.badge.rotate': 'Putar & Balik',
  'work.badge.picker': 'Ambil Warna',
  'work.badge.blurface': 'Sensor Wajah',
  'work.badge.design': 'Editor Desain',
  'work.badge.blur': 'Blur Background',
  'work.exportSettingsTitle': 'Opsi Ekspor & Unduhan',
  'work.settings': 'Pengaturan Ekspor',
  'work.batchRename': 'Ganti Nama File',
  'work.renameFile': 'Ganti Nama File',
  'work.zipPlaceholder': 'Nama File ZIP Kustom',
  'work.singleDownload': 'Download HD (Gratis)',
  'work.batchDownload': 'Download Semua (ZIP)',
  'nav.resize': 'Ubah Ukuran',

  'landing.default.title.remove': 'Hapus Background Foto Online Gratis',
  'landing.default.title.blur': 'Blur Background Foto Bokeh Gratis',
  'landing.default.title.color': 'Ganti Warna Background Pas Foto',
  'landing.default.title.watermark': 'Buat Watermark Foto Online Gratis',
  'landing.default.title.compress': 'Kompres Gambar Online Gratis',
  'landing.default.title.convert': 'Ubah Format Gambar Online Gratis',
  'landing.default.title.resize': 'Ubah Ukuran Gambar Online Gratis',
  'landing.default.title.crop': 'Potong Foto Online Gratis',
  'landing.default.title.rotate': 'Putar & Balik Foto Online Gratis',
  'landing.default.title.picker': 'Ambil Warna Gambar Online Gratis',
  'landing.default.title.blurface': 'Sensor Wajah & Plat Nomor Online Gratis',
  'landing.default.title.design': 'Editor Desain Foto Online Gratis',
  'landing.default.title.home': 'Studio Edit Foto AI Online Gratis',

  'landing.default.desc.remove': 'Hapus latar belakang gambar secara instan langsung di browser. 100% privat, cepat, dan gratis.',
  'landing.default.desc.blur': 'Terapkan efek blur bokeh studio DSLR pada background foto dalam hitungan detik.',
  'landing.default.desc.color': 'Ubah warna latar belakang foto ke standar paspor resmi atau gradien studio modern.',
  'landing.default.desc.watermark': 'Tambahkan teks kustom dan logo watermark ke foto secara massal untuk melindungi hak cipta.',
  'landing.default.desc.compress': 'Kompres ukuran file gambar secara presisi dengan tetap menjaga kualitas visual terbaik.',
  'landing.default.desc.convert': 'Konversi gambar antara format PNG, JPG, dan WEBP secara instan di browser Anda.',
  'landing.default.desc.resize': 'Ubah ukuran dimensi foto secara presisi dengan lebar, tinggi, dan rasio aspek kustom.',
  'landing.default.desc.crop': 'Potong foto ke proporsi pas, avatar lingkaran, atau rasio media sosial.',
  'landing.default.desc.rotate': 'Putar dan balik foto secara horizontal atau vertikal dengan pratinjau instan.',
  'landing.default.desc.picker': 'Ambil palet warna dominan dan kode hex presisi dari foto apa pun.',
  'landing.default.desc.blurface': 'Lindungi privasi dengan memburamkan atau menyensor wajah dan plat nomor kendaraan.',
  'landing.default.desc.design': 'Perindah foto dengan filter canggih, teks, anotasi, dan alat grafis lengkap.',
  'landing.default.desc.home': 'Studio edit foto AI massal: hapus background, ubah ukuran, kompres, dan edit foto secara lokal.',
};

// Spanish translations override for natural, professional European & Latin American Spanish
const ES_OVERRIDES = {
  'brush.mode': 'Modo Pincel',
  'brush.restore': '🟢 Restaurar',
  'brush.erase': '🔴 Borrar',
  'brush.size': 'Tamaño del Pincel',
  'brush.resetMask': 'Restablecer Trazos de Pincel',
  'brush.resetSuccess': '¡Trazos de pincel restablecidos con éxito!',
  'brush.title': 'Pincel de Retoque Manual',
  'brush.desc': 'Restaure o borre manualmente partes de su imagen para bordes perfectos.',

  'resize.modeStandard': 'Estándar (Ajuste libre)',
  'resize.modeSmart': 'Automático Inteligente',
  'resize.width': 'Ancho',
  'resize.height': 'Alto',
  'resize.lock': 'Bloquear proporción',
  'resize.unlock': 'Desbloquear proporción',
  'resize.dimensions': 'Dimensiones',

  'crop.title': 'Recortar Foto',
  'crop.presets': 'Ajustes Predefinidos',
  'crop.preset.full': 'Completo',
  'crop.offset': 'Posición',
  'crop.width': 'Ancho',
  'crop.height': 'Alto',
  'crop.radius': 'Radio de Esquinas',

  'rotate.title': 'Girar y Voltear',
  'rotate.quickRotate': 'Rotación Rápida',
  'rotate.customAngle': 'Ángulo Personalizado',
  'rotate.flip': 'Voltear Orientación',
  'rotate.flipH': 'Voltear Horizontal',
  'rotate.flipV': 'Voltear Vertical',
  'rotate.angle': 'Ángulo de Rotación',

  'convert.format': 'Seleccionar Formato de Destino',
  'convert.convertNow': 'Convertir ahora',
  'convert.convertFirst': 'Convierte primero para descargar',
  'convert.success': '¡Imagen convertida con éxito!',
  'convert.processAll': 'Convertir Todo ({{count}})',

  'compress.quality': 'Calidad de Compresión',
  'compress.process': 'Comprimir Ahora',
  'compress.processAll': 'Comprimir Todo ({{count}})',
  'compress.maxCompress': 'Máxima Compresión',
  'compress.balanced': 'Equilibrado',
  'compress.highQuality': 'Alta Calidad',

  'color.off.red': 'Rojo Pasaporte',
  'color.off.blue': 'Azul Pasaporte',
  'color.off.white': 'Blanco Puro',
  'color.off.black': 'Negro Estudio',
  'color.off.gray': 'Gris Suave',
  'color.off.pink': 'Rosa Pastel',
  'color.off.green': 'Verde Menta',
  'color.off.sky': 'Azul Cielo',
  'color.custom': 'Color Personalizado',
  'color.official': 'Seleccionar Color Oficial',
  'color.gradientTitle': 'Degradados de Estudio Modernos',
  'color.applyNow': '⚡ Cambiar Fondo Ahora',
  'color.bgBlur': 'Desenfoque de Fondo (Efecto DSLR)',

  'blur.options': 'Desenfocar Rostros y Privacidad',
  'blur.desc': 'Dibuja un recuadro directamente sobre la foto o usa los botones rápidos.',
  'blur.typeBlur': 'Desenfoque (Suave)',
  'blur.typePixelate': 'Pixelar (Mosaico)',
  'blur.quickAdd': 'Agregar Recuadro Rápido',
  'blur.presetDefault': 'Nuevo Recuadro',
  'blur.presetFace': 'Desenfocar Rostro',
  'blur.presetPlate': 'Matrícula',
  'blur.intensity': 'Intensidad de Desenfoque',
  'blur.activeAreas': 'Áreas Activas',
  'blur.clearAll': 'Borrar Todo',
  'blur.applyNow': 'Aplicar Desenfoque Permanente',
  'blur.appliedSuccess': '¡Desenfoque de privacidad aplicado con éxito!',

  'watermark.pos.center': 'Centro',
  'watermark.pos.tl': 'Superior Izquierda',
  'watermark.pos.tr': 'Superior Derecha',
  'watermark.pos.bl': 'Inferior Izquierda',
  'watermark.pos.br': 'Inferior Derecha',
  'watermark.pos.tiled': 'Patrón Repetido',
  'watermark.type.text': 'Texto',
  'watermark.type.image': 'Imagen / Logo',
  'watermark.textLabel': 'Texto de Marca de Agua',
  'watermark.uploadLabel': 'Subir Logo de Marca de Agua',
  'watermark.changeLogo': 'Cambiar Logo',
  'watermark.selectLogo': 'Seleccionar Logo PNG',
  'watermark.color': 'Color del Texto',
  'watermark.opacity': 'Opacidad',
  'watermark.scale': 'Escala',
  'watermark.rotation': 'Rotación',
  'watermark.position': 'Posición de Marca de Agua',
  'watermark.processAll': 'Aplicar a Todo ({{count}})',

  'picker.title': 'Selector y Extractor de Color',
  'picker.instruction': 'Haz clic en cualquier parte de la imagen para extraer códigos de color.',
  'picker.clickedColor': 'Código de Color Seleccionado',
  'picker.noColor': 'Haz clic en la foto para seleccionar un color',
  'picker.palette': 'Paleta de Colores Dominantes',

  'editor.resetOriginal': 'Restablecer al Original',
  'editor.resetDesc': 'Restaurar esta foto a su estado original sin cambios',
  'editor.replacePhoto': 'Cambiar Foto',
  'editor.replacePhotoDesc': 'Reemplazar esta foto por una nueva desde tu dispositivo',
  'editor.uploadOther': 'Cambiar Foto',
  'editor.uploadOtherDesc': 'Reemplazar esta foto por una nueva desde tu dispositivo',
  'editor.resetSuccess': 'Imagen restaurada al estado inicial.',
  'editor.download': 'Descargar HD (Gratis)',
  'editor.downloadBatch': '📦 Descargar Todo (ZIP)',
  'editor.settings': 'Ajustes de Herramienta',
  'editor.exportSettings': 'Configuración de Exportación',
  'editor.exportOptions': 'Opciones de Exportación y Descarga',

  'work.badge.remove': 'Quitar Fondo',
  'work.badge.color': 'Cambiar Fondo',
  'work.badge.brush': 'Pincel Mágico',
  'work.badge.watermark': 'Marca de Agua',
  'work.badge.compress': 'Comprimir Foto',
  'work.badge.convert': 'Convertir Formato',
  'work.badge.resize': 'Redimensionar Foto',
  'work.badge.crop': 'Recortar Foto',
  'work.badge.rotate': 'Girar y Voltear',
  'work.badge.picker': 'Selector de Color',
  'work.badge.blurface': 'Desenfocar Rostro',
  'work.badge.design': 'Editor de Diseño',
  'work.badge.blur': 'Fondo Borroso',
  'work.exportSettingsTitle': 'Opciones de Exportación y Descarga',
  'work.settings': 'Configuración de Exportación',
  'work.batchRename': 'Renombrar Archivos',
  'work.renameFile': 'Renombrar Archivo',
  'work.zipPlaceholder': 'Nombre de Archivo ZIP',
  'work.singleDownload': 'Descargar HD (Gratis)',
  'work.batchDownload': 'Descargar Todo (ZIP)',
  'nav.resize': 'Redimensionar',

  'landing.default.title.remove': 'Eliminar Fondo de Fotos con IA Gratis',
  'landing.default.title.blur': 'Desenfoque Bokeh de Fotos Gratis',
  'landing.default.title.color': 'Cambiar Fondo de Foto de Pasaporte Gratis',
  'landing.default.title.watermark': 'Crear Marcas de Agua Online Gratis',
  'landing.default.title.compress': 'Comprimir Imágenes Online Gratis',
  'landing.default.title.convert': 'Convertir Formato de Imágenes Gratis',
  'landing.default.title.resize': 'Redimensionar Imágenes Online Gratis',
  'landing.default.title.crop': 'Recortar Fotos Online Gratis',
  'landing.default.title.rotate': 'Girar y Voltear Fotos Online Gratis',
  'landing.default.title.picker': 'Selector de Color de Imágenes Gratis',
  'landing.default.title.blurface': 'Desenfocar Rostros y Matrículas Online Gratis',
  'landing.default.title.design': 'Editor de Fotos Online Gratis',
  'landing.default.title.home': 'Editor de Fotos con IA por Lotes Gratis',

  'landing.default.desc.remove': 'Elimina fondos de imágenes al instante en tu navegador. 100% privado, rápido y gratis.',
  'landing.default.desc.blur': 'Crea efectos de desenfoque bokeh de estudio DSLR al instante en cualquier fondo.',
  'landing.default.desc.color': 'Cambia los colores de fondo a estándares oficiales de pasaporte o degradados modernos.',
  'landing.default.desc.watermark': 'Añade marcas de agua de texto y logotipo a tus fotos por lotes para proteger tus derechos de autor.',
  'landing.default.desc.compress': 'Comprime el tamaño de archivo de las imágenes manteniendo la máxima calidad visual.',
  'landing.default.desc.convert': 'Convierte imágenes entre formatos PNG, JPG y WEBP al instante en tu navegador.',
  'landing.default.desc.resize': 'Redimensiona las medidas de tus fotos con ancho, alto y proporción personalizados.',
  'landing.default.desc.crop': 'Recorta fotos a proporciones exactas, avatares circulares o tamaños personalizados.',
  'landing.default.desc.rotate': 'Gira y voltea fotos horizontal o verticalmente con vista previa en tiempo real.',
  'landing.default.desc.picker': 'Extrae paletas de colores y códigos hexadecimales exactos de cualquier imagen.',
  'landing.default.desc.blurface': 'Protege la privacidad desenfocando o pixelando rostros y matrículas de vehículos.',
  'landing.default.desc.design': 'Edita fotos online con filtros avanzados, anotaciones y herramientas gráficas.',
  'landing.default.desc.home': 'Tu editor de fotos con IA local: quita fondos, redimensiona, comprime y edita fotos por lotes.',
};

// German translations override for clean, natural German terminology (No bloated keyword strings)
const DE_OVERRIDES = {
  'landing.default.title.remove': 'Kostenloser KI-Hintergrundentferner',
  'landing.default.title.blur': 'Kostenloser Bokeh-Unschärfe-Effekt',
  'landing.default.title.color': 'Passfoto-Hintergrundfarbe ändern',
  'landing.default.title.watermark': 'Kostenloser Wasserzeichen-Ersteller',
  'landing.default.title.compress': 'Kostenloser Bildkompressor online',
  'landing.default.title.convert': 'Kostenloser Bildformat-Konverter',
  'landing.default.title.resize': 'Kostenlose Bildgrößenänderung',
  'landing.default.title.crop': 'Kostenloses Foto-Zuschneidetool',
  'landing.default.title.rotate': 'Foto drehen & spiegeln online',
  'landing.default.title.picker': 'Kostenloser Bild-Farbwähler',
  'landing.default.title.blurface': 'Gesichter & Kennzeichen zensieren',
  'landing.default.title.design': 'Kostenloser Online-Fotoeditor',
  'landing.default.title.home': 'Kostenloser KI-Fotoeditor online',

  'landing.default.desc.remove': 'Hintergrund von Bildern direkt im Browser entfernen. 100% privat, schnell und kostenlos.',
  'landing.default.desc.blur': 'DSLR-Bokeh-Unschärfeeffekt in Sekundenschnelle auf jeden Hintergrund anwenden.',
  'landing.default.desc.color': 'Passfoto-Hintergrundfarben nach offiziellen Standards oder mit modernen Farbverläufen anpassen.',
  'landing.default.desc.watermark': 'Eigene Wasserzeichen und Logos stapelweise hinzufügen, um das Urheberrecht zu schützen.',
  'landing.default.desc.compress': 'Dateigröße von Bildern präzise verringern bei gleichzeitig hoher visueller Bildqualität.',
  'landing.default.desc.convert': 'Bilder blitzschnell zwischen PNG, JPG und WEBP direkt im Browser konvertieren.',
  'landing.default.desc.resize': 'Bildabmessungen präzise mit individueller Breite, Höhe und Seitenverhältnis anpassen.',
  'landing.default.desc.crop': 'Fotos auf exakte Proportionen, Kreis-Avatare oder Social-Media-Maße zuschneiden.',
  'landing.default.desc.rotate': 'Fotos horizontal oder vertikal drehen und spiegeln mit sofortiger Live-Vorschau.',
  'landing.default.desc.picker': 'Farbpaletten und exakte Hex-Codes aus beliebigen Fotos auslesen.',
  'landing.default.desc.blurface': 'Privatsphäre schützen durch Verpixeln oder Verwischen von Gesichtern und Kennzeichen.',
  'landing.default.desc.design': 'Fotos online mit Filtern, Texten, Anmerkungen und Designtools bearbeiten.',
  'landing.default.desc.home': 'Ihr lokaler KI-Fotoeditor: Hintergründe entfernen, skalieren, komprimieren und bearbeiten.',

  'brush.mode': 'Manueller Pinselmodus',
  'brush.restore': '🟢 Wiederherstellen',
  'brush.erase': '🔴 Löschen',
  'brush.size': 'Pinselgröße',
  'brush.resetMask': 'Pinselstriche zurücksetzen',
  'brush.resetSuccess': 'Pinselstriche erfolgreich zurückgesetzt!',
  'brush.title': 'Manueller Retusche-Pinsel',
  'brush.desc': 'Bildbereiche für saubere Kanten manuell wiederherstellen oder löschen.',

  'resize.modeStandard': 'Standard (Strecken)',
  'resize.modeSmart': 'Smart Auto (Zentriert)',
  'resize.width': 'Breite',
  'resize.height': 'Höhe',
  'resize.lock': 'Seitenverhältnis sperren',
  'resize.unlock': 'Seitenverhältnis entsperren',
  'resize.dimensions': 'Abmessungen',

  'crop.title': 'Foto zuschneiden',
  'crop.presets': 'Zuschnitt-Vorlagen',
  'crop.preset.full': 'Vollbild',
  'crop.offset': 'Position',
  'crop.width': 'Breite',
  'crop.height': 'Höhe',
  'crop.radius': 'Eckenrundung',

  'rotate.title': 'Drehen & Spiegeln',
  'rotate.quickRotate': 'Schnelldrehung',
  'rotate.customAngle': 'Freier Winkel',
  'rotate.flip': 'Ausrichtung spiegeln',
  'rotate.flipH': 'Horizontal spiegeln',
  'rotate.flipV': 'Vertikal spiegeln',
  'rotate.angle': 'Drehwinkel',

  'convert.format': 'Zielformat auswählen',
  'convert.convertNow': 'Jetzt konvertieren',
  'convert.convertFirst': 'Zuerst konvertieren zum Herunterladen',
  'convert.success': 'Bild erfolgreich konvertiert!',
  'convert.processAll': 'Alle konvertieren ({{count}})',

  'compress.quality': 'Komprimierungsqualität',
  'compress.process': 'Jetzt komprimieren',
  'compress.processAll': 'Alle komprimieren ({{count}})',
  'compress.maxCompress': 'Maximale Komprimierung',
  'compress.balanced': 'Ausgewogen',
  'compress.highQuality': 'Hohe Qualität',

  'color.off.red': 'Pass-Rot',
  'color.off.blue': 'Pass-Blau',
  'color.off.white': 'Reines Weiß',
  'color.off.black': 'Studio-Schwarz',
  'color.off.gray': 'Sanftes Grau',
  'color.off.pink': 'Pastellrosa',
  'color.off.green': 'Mintgrün',
  'color.off.sky': 'Himmelblau',
  'color.custom': 'Eigene Farbe',
  'color.official': 'Offizielle Farbe wählen',
  'color.gradientTitle': 'Moderne Studio-Farbverläufe',
  'color.applyNow': '⚡ Hintergrund jetzt ändern',
  'color.bgBlur': 'Hintergrund-Unschärfe (DSLR-Effekt)',

  'blur.options': 'Gesicht & Kennzeichen zensieren',
  'blur.desc': 'Kasten direkt auf das Foto ziehen oder Vorlagen nutzen.',
  'blur.intensity': 'Zensur-Stärke',
  'blur.activeAreas': 'Aktive Bereiche',
  'blur.clearAll': 'Alle entfernen',
  'blur.applyNow': 'Dauerhaft zensieren',
  'blur.appliedSuccess': 'Zensur erfolgreich angewendet!',

  'editor.resetOriginal': 'Auf Original zurücksetzen',
  'editor.resetDesc': 'Foto unverändert in den Originalzustand zurücksetzen',
  'editor.replacePhoto': 'Foto ersetzen',
  'editor.replacePhotoDesc': 'Dieses Foto durch ein neues Bild vom Gerät ersetzen',
  'editor.uploadOther': 'Foto ersetzen',
  'editor.uploadOtherDesc': 'Dieses Foto durch ein neues Bild vom Gerät ersetzen',
  'editor.resetSuccess': 'Bild wurde auf den Ausgangszustand zurückgesetzt.',
  'editor.download': 'HD herunterladen (Kostenlos)',
  'editor.downloadBatch': '📦 Alles herunterladen (ZIP)',
  'editor.settings': 'Werkzeugeinstellungen',
  'editor.exportSettings': 'Exporteinstellungen',
  'editor.exportOptions': 'Export- & Download-Optionen',

  'work.badge.remove': 'Hintergrund entfernen',
  'work.badge.color': 'Hintergrund ändern',
  'work.badge.brush': 'Magischer Pinsel',
  'work.badge.watermark': 'Wasserzeichen',
  'work.badge.compress': 'Bild komprimieren',
  'work.badge.convert': 'Format ändern',
  'work.badge.resize': 'Größe ändern',
  'work.badge.crop': 'Foto zuschneiden',
  'work.badge.rotate': 'Drehen & Spiegeln',
  'work.badge.picker': 'Farbe pipettieren',
  'work.badge.blurface': 'Gesicht zensieren',
  'work.badge.design': 'Design-Editor',
  'work.badge.blur': 'Hintergrund weichzeichnen',
  'work.exportSettingsTitle': 'Export- & Download-Optionen',
  'work.settings': 'Exporteinstellungen',
  'work.batchRename': 'Dateien umbenennen',
  'work.renameFile': 'Datei umbenennen',
  'work.zipPlaceholder': 'Eigener ZIP-Name',
  'work.singleDownload': 'HD herunterladen (Kostenlos)',
  'work.batchDownload': 'Alles herunterladen (ZIP)',
  'nav.resize': 'Größe ändern',
};

async function syncAllLocales() {
  const localesDir = path.resolve(__dirname, '../public/locales');
  const languages = Object.keys(LANG_MAP);

  const keys = Object.keys(KEYS_TO_SYNC);
  const englishValues = keys.map((k) => KEYS_TO_SYNC[k]);

  const CORE_TOOLS = ['remove', 'blur', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design', 'home'];

  console.log(`Starting translation sync for ${languages.length} languages and ${keys.length} keys...`);

  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) {
      console.warn(`File not found: ${filePath}`);
      continue;
    }

    let json = {};
    try {
      json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err);
      continue;
    }

    if (lang === 'en') {
      for (const key of keys) {
        json[key] = KEYS_TO_SYNC[key];
      }
      for (const tool of CORE_TOOLS) {
        if (json[`landing.default.title.${tool}`]) {
          json[`seo.title.${tool}`] = json[`landing.default.title.${tool}`];
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized en (English)`);
      continue;
    }

    if (lang === 'id') {
      for (const key of keys) {
        json[key] = ID_OVERRIDES[key] || KEYS_TO_SYNC[key];
      }
      for (const tool of CORE_TOOLS) {
        if (json[`landing.default.title.${tool}`]) {
          json[`seo.title.${tool}`] = json[`landing.default.title.${tool}`];
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized id (Indonesian)`);
      continue;
    }

    if (lang === 'es') {
      for (const key of keys) {
        json[key] = ES_OVERRIDES[key] || KEYS_TO_SYNC[key];
      }
      if (json['brush.title']) json['brush.title'] = 'Pincel de Retoque Manual';
      if (json['work.badge.brush']) json['work.badge.brush'] = 'Pincel Mágico';
      if (json['work.badge.watermark']) json['work.badge.watermark'] = 'Marca de Agua';
      if (json['work.badge.blurface']) json['work.badge.blurface'] = 'Desenfocar Rostro';
      if (json['work.badge.resize']) json['work.badge.resize'] = 'Redimensionar Foto';

      for (const tool of CORE_TOOLS) {
        if (json[`landing.default.title.${tool}`]) {
          json[`seo.title.${tool}`] = json[`landing.default.title.${tool}`];
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized es (Spanish - Native Overrides)`);
      continue;
    }

    if (lang === 'de') {
      for (const key of keys) {
        json[key] = DE_OVERRIDES[key] || KEYS_TO_SYNC[key];
      }
      for (const tool of CORE_TOOLS) {
        if (json[`landing.default.title.${tool}`]) {
          json[`seo.title.${tool}`] = json[`landing.default.title.${tool}`];
        }
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized de (German - Native Overrides)`);
      continue;
    }

    const targetCode = LANG_MAP[lang];
    try {
      // Clean texts without emojis for translation
      const cleanValues = englishValues.map((v) =>
        v.replace(/^🟢\s*/, '').replace(/^🔴\s*/, '').replace(/^📦\s*/, '').replace(/^⚡\s*/, '')
      );

      const res = await translate(cleanValues, { from: 'en', to: targetCode });
      const translated = res.map((r) => r.text);

      keys.forEach((key, idx) => {
        let text = translated[idx] || KEYS_TO_SYNC[key];
        // Restore emoji prefixes if present in source
        if (KEYS_TO_SYNC[key].startsWith('🟢')) text = `🟢 ${text}`;
        if (KEYS_TO_SYNC[key].startsWith('🔴')) text = `🔴 ${text}`;
        if (KEYS_TO_SYNC[key].startsWith('📦')) text = `📦 ${text}`;
        if (KEYS_TO_SYNC[key].startsWith('⚡')) text = `⚡ ${text}`;

        // Clean up any remaining English fallbacks like (Restore) or (Erase)
        text = text.replace(/\s*\((Restore|Erase)\)/gi, '');

        json[key] = text;
      });

      // Specific cleanup in json for common dirty keys
      if (json['brush.restore']) json['brush.restore'] = json['brush.restore'].replace(/\s*\(Restore\)/gi, '');
      if (json['brush.erase']) json['brush.erase'] = json['brush.erase'].replace(/\s*\(Erase\)/gi, '');

      for (const tool of CORE_TOOLS) {
        if (json[`landing.default.title.${tool}`]) {
          json[`seo.title.${tool}`] = json[`landing.default.title.${tool}`];
        }
      }

      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized ${lang} (${targetCode})`);
    } catch (err) {
      console.error(`Error translating ${lang}:`, err.message);
    }
  }

  console.log('✅ All 30 language translation files have been synchronized successfully!');
}

syncAllLocales();
