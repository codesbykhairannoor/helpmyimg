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

  // Action Buttons
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

  // Work Badges & Titles
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
  'work.exportSettingsTitle': 'Export & Download Options',
  'work.settings': 'Export Settings',
  'work.batchRename': 'Rename Files',
  'work.renameFile': 'Rename File',
  'work.zipPlaceholder': 'Custom ZIP Name',
  'work.singleDownload': 'Download HD (Free)',
  'work.batchDownload': 'Download All (ZIP)',

  // Blur Face & License Plate Tool
  'blur.options': 'Blur Face & Privacy Areas',
  'blur.desc': 'Draw a box directly over the photo or use the quick preset buttons below.',
  'blur.typeBlur': 'Blur (Smooth)',
  'blur.typePixelate': 'Pixelate (Mosaic)',
  'blur.quickAdd': 'Quick Add Sensor Area',
  'blur.presetDefault': 'New Box',
  'blur.presetFace': 'Blur Face',
  'blur.presetPlate': 'License Plate',
  'blur.intensity': 'Sensor Intensity',
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

  // Clean & Concise Landing Titles (No Keyword Stuffing / No "Zero Upload" / No "Carga Cero")
  'landing.default.title.remove': 'Free AI Background Remover',
  'landing.default.title.blur': 'Free Studio Bokeh Blur',
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
  'landing.default.title.home': 'Free Bulk AI Photo Editor',

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
  'work.exportSettingsTitle': 'Opsi Ekspor & Unduhan',
  'work.settings': 'Pengaturan Ekspor',
  'work.batchRename': 'Ganti Nama File',
  'work.renameFile': 'Ganti Nama File',
  'work.zipPlaceholder': 'Nama File ZIP Kustom',
  'work.singleDownload': 'Download HD (Gratis)',
  'work.batchDownload': 'Download Semua (ZIP)',
  'blur.options': 'Sensor Wajah & Area Privat',
  'blur.desc': 'Tarik kotak langsung di atas foto atau gunakan tombol preset di bawah.',
  'blur.typeBlur': 'Blur (Halus)',
  'blur.typePixelate': 'Pixelate (Mosaik)',
  'blur.quickAdd': 'Tambah Cepat Area Sensor',
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

async function syncAllLocales() {
  const localesDir = path.resolve(__dirname, '../public/locales');
  const languages = Object.keys(LANG_MAP);

  const keys = Object.keys(KEYS_TO_SYNC);
  const englishValues = keys.map((k) => KEYS_TO_SYNC[k]);

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
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized en (English)`);
      continue;
    }

    if (lang === 'id') {
      for (const key of keys) {
        json[key] = ID_OVERRIDES[key] || KEYS_TO_SYNC[key];
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized id (Indonesian)`);
      continue;
    }

    const targetCode = LANG_MAP[lang];
    try {
      // Clean texts without emojis for translation
      const cleanValues = englishValues.map((v) =>
        v.replace(/^🟢\s*/, '').replace(/^🔴\s*/, '').replace(/^📦\s*/, '')
      );

      const res = await translate(cleanValues, { from: 'en', to: targetCode });
      const translated = res.map((r) => r.text);

      keys.forEach((key, idx) => {
        let text = translated[idx] || KEYS_TO_SYNC[key];
        // Restore emoji prefixes if present in source
        if (KEYS_TO_SYNC[key].startsWith('🟢')) text = `🟢 ${text}`;
        if (KEYS_TO_SYNC[key].startsWith('🔴')) text = `🔴 ${text}`;
        if (KEYS_TO_SYNC[key].startsWith('📦')) text = `📦 ${text}`;

        // Clean up any remaining English fallbacks like (Restore) or (Erase)
        text = text.replace(/\s*\((Restore|Erase)\)/gi, '');

        json[key] = text;
      });

      // Specific cleanup in json for common dirty keys
      if (json['brush.restore']) json['brush.restore'] = json['brush.restore'].replace(/\s*\(Restore\)/gi, '');
      if (json['brush.erase']) json['brush.erase'] = json['brush.erase'].replace(/\s*\(Erase\)/gi, '');
      if (json['work.badge.brush'] && lang === 'es') json['work.badge.brush'] = 'Pincel Mágico';

      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ Synchronized ${lang} (${targetCode})`);
    } catch (err) {
      console.error(`Error translating ${lang}:`, err.message);
    }
  }

  console.log('✅ All 30 language translation files have been synchronized successfully!');
}

syncAllLocales();
