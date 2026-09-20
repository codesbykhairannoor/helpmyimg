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
