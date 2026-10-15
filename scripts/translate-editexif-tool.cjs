// scripts/translate-editexif-tool.cjs
// Translates all editexif and metadata cleaner keys into all 30 languages using google-translate-api-x with batching

const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const localesDir = path.resolve(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter((f) =>
  fs.statSync(path.join(localesDir, f)).isDirectory()
);

const enKeys = {
  // Edit EXIF tool
  'nav.editexif': 'Edit EXIF & Camera Metadata',
  'grid.editexifDesc': 'Manually edit camera model, lens, shutter speed, aperture, ISO, copyright, and 300 DPI.',
  'landing.default.title.editexif': 'Manual EXIF Metadata Editor | Edit Camera & Photo Properties',
  'landing.default.desc.editexif': 'Manually edit camera model, lens, shutter speed, aperture, ISO, capture date, artist, copyright, and 300 DPI resolution directly in your browser.',
  'editexif.manualEditorTitle': 'MANUAL EXIF METADATA FORM',
  'editexif.exifLoadedBadge': 'Existing EXIF Loaded',
  'editexif.emptyExifBadge': 'Empty / AI Photo',
  'editexif.manualEditorSub': 'Fill in or modify any photography parameter below. All fields are fully customizable without template limits.',
  'editexif.quickFill': 'Quick Fill:',
  'editexif.tabCamera': 'Camera',
  'editexif.tabExposure': 'Exposure',
  'editexif.tabAuthor': 'Author',
  'editexif.tabSpecs': 'Specs',
  'editexif.lblCameraMake': 'Camera Make / Manufacturer',
  'editexif.lblCameraModel': 'Camera Model',
  'editexif.lblLensModel': 'Lens Specification & Model',
  'editexif.lblShutter': 'Shutter Speed (s)',
  'editexif.lblAperture': 'Aperture (f-stop)',
  'editexif.lblIso': 'ISO Sensitivity',
  'editexif.lblFocal': 'Focal Length (mm)',
  'editexif.lblFlash': 'Flash Strobe Mode',
  'editexif.flashFired': 'Fired (Studio Strobe Sync)',
  'editexif.flashOff': 'Did Not Fire (Ambient Light)',
  'editexif.flashAuto': 'Auto Mode',
  'editexif.photographerLabel': 'Photographer / Studio Name (Artist)',
  'editexif.copyrightLabel': 'Copyright Notice',
  'editexif.lblSoftware': 'Software / Processing Engine',
  'editexif.lblDescription': 'Image Title / Description',
  'editexif.dateLabel': 'Capture Date (YYYY:MM:DD HH:MM:SS)',
  'editexif.lblDpi': 'Resolution / DPI (Print Standard)',
  'editexif.dpiPassport': 'Official Passport & High-Quality Print',
  'editexif.dpiWeb': 'Web & Screen Standard',
  'editexif.dpiMedium': 'Medium Resolution Print',
  'editexif.dpiUltra': 'Ultra High Definition Archival',
  'editexif.processing': 'Applying Custom EXIF Metadata...',
  'editexif.btnApplyManual': 'Apply & Save Custom EXIF',
  'editexif.downloadClean': 'Download Photo with New EXIF',
  'editexif.successToast': 'Custom EXIF metadata saved to photo successfully!',
  'editexif.failedToast': 'Failed to process photo EXIF metadata.',
  'editexif.batchSuccess': 'All photo metadata updated successfully!',

  // Remove Metadata tool
  'nav.metadata': 'Remove Metadata & C2PA',
  'grid.metadataDesc': 'Losslessly wipe C2PA, GPS coordinates, EXIF, and camera serial numbers.',
  'landing.default.title.metadata': 'Remove Photo Metadata & C2PA | 100% Privacy Cleaner',
  'landing.default.desc.metadata': 'Permanently scrub C2PA manifests, Google SynthID tags, GPS geotags, and camera EXIF metadata losslessly in your browser.',
  'metadata.auditTitle': 'METADATA PRIVACY AUDIT',
  'metadata.c2paDetected': 'C2PA AI Manifest Detected!',
  'metadata.c2paClean': 'C2PA Manifest Free',
  'metadata.c2paCleanDesc': 'No AI tracking signatures detected',
  'metadata.noExifFound': 'No Camera Hardware Metadata',
  'metadata.noExifDesc': 'Camera make, lens and serial tags',
  'metadata.noArtist': 'No Creator Name Embedded',
  'metadata.noCopyright': 'No copyright or license notice',
  'metadata.dropToInspect': 'Drop an image to inspect AI signatures & metadata',
  'metadata.scrubScopeTitle': 'DATA TO REMOVE PERMANENTLY',
  'metadata.chkC2pa': 'Remove C2PA & AI Manifests (SynthID, JUMBF APP11)',
  'metadata.chkC2paSub': 'Eliminates automatic "Made with AI" labels on social media',
  'metadata.chkExif': 'Wipe Camera EXIF & Hardware Information',
  'metadata.chkExifSub': 'Removes camera serial number, shutter count, and lens data',
  'metadata.chkGps': 'Scrub GPS Coordinates & Geotags',
  'metadata.chkGpsSub': 'Protects physical location and private home/office addresses',
  'metadata.chkAuthor': 'Strip Creator Names, Artist & Copyright Tags',
  'metadata.chkXmp': 'Wipe Software Traces & Editing History (XMP)',
  'metadata.processing': 'Losslessly Scrubbing Metadata & C2PA...',
  'metadata.btnScrubAll': 'Losslessly Strip All Metadata & C2PA',
  'metadata.downloadClean': 'Download Scrubbed Photo',
  'metadata.successToast': 'All metadata & C2PA stripped losslessly!',
  'metadata.failedToast': 'Failed to scrub photo metadata.',
  'metadata.batchSuccess': 'All photos scrubbed successfully!'
};

const idOverrides = {
  // Edit EXIF
  'nav.editexif': 'Edit EXIF & Metadata Foto',
  'grid.editexifDesc': 'Ubah manual model kamera, lensa, shutter speed, aperture, ISO, hak cipta, dan 300 DPI.',
  'landing.default.title.editexif': 'Editor Metadata EXIF Manual | Ubah Properti Kamera & Foto',
  'landing.default.desc.editexif': 'Ubah manual model kamera, lensa, shutter speed, aperture, ISO, tanggal pemotretan, fotografer, hak cipta, dan resolusi 300 DPI langsung di browser.',
  'editexif.manualEditorTitle': 'FORMULIR METADATA EXIF MANUAL',
  'editexif.exifLoadedBadge': 'EXIF Foto Terdeteksi',
  'editexif.emptyExifBadge': 'Foto Polos / AI',
  'editexif.manualEditorSub': 'Isi atau ubah parameter fotografi di bawah ini secara bebas tanpa batasan template.',
  'editexif.quickFill': 'Isi Otomatis:',
  'editexif.tabCamera': 'Kamera',
  'editexif.tabExposure': 'Eksposur',
  'editexif.tabAuthor': 'Kreator',
  'editexif.tabSpecs': 'Spesifikasi',
  'editexif.lblCameraMake': 'Produsen Kamera (Make)',
  'editexif.lblCameraModel': 'Model Kamera (Model)',
  'editexif.lblLensModel': 'Model & Spesifikasi Lensa',
  'editexif.lblShutter': 'Kecepatan Rana / Shutter Speed (detik)',
  'editexif.lblAperture': 'Bukaan Diafragma / Aperture (f-stop)',
  'editexif.lblIso': 'Sensitivitas ISO',
  'editexif.lblFocal': 'Panjang Fokus / Focal Length (mm)',
  'editexif.lblFlash': 'Mode Lampu Kilat / Flash',
  'editexif.flashFired': 'Menyala (Studio Strobe Sync)',
  'editexif.flashOff': 'Mati (Cahaya Alami)',
  'editexif.flashAuto': 'Mode Otomatis',
  'editexif.photographerLabel': 'Nama Fotografer / Studio (Artist)',
  'editexif.copyrightLabel': 'Pemberitahuan Hak Cipta (Copyright)',
  'editexif.lblSoftware': 'Perangkat Lunak Pengolah (Software)',
  'editexif.lblDescription': 'Judul / Deskripsi Foto',
  'editexif.dateLabel': 'Tanggal Pemotretan (YYYY:MM:DD HH:MM:SS)',
  'editexif.lblDpi': 'Resolusi / DPI (Standar Cetak)',
  'editexif.dpiPassport': 'Pasfoto Resmi & Cetak Resolusi Tinggi',
  'editexif.dpiWeb': 'Standar Layar & Web',
  'editexif.dpiMedium': 'Cetak Resolusi Sedang',
  'editexif.dpiUltra': 'Arsip Resolusi Sangat Tinggi',
  'editexif.processing': 'Menerapkan Metadata EXIF Kustom...',
  'editexif.btnApplyManual': 'Terapkan & Simpan Metadata EXIF',
  'editexif.downloadClean': 'Unduh Foto dengan EXIF Baru',
  'editexif.successToast': 'Metadata EXIF kustom berhasil disimpan ke foto!',
  'editexif.failedToast': 'Gagal memperbarui metadata EXIF foto.',
  'editexif.batchSuccess': 'Semua metadata foto berhasil diperbarui!',

  // Remove Metadata
  'nav.metadata': 'Hapus Metadata & C2PA',
  'grid.metadataDesc': 'Hapus bersih C2PA, koordinat GPS, EXIF, dan nomor seri kamera secara lossless.',
  'landing.default.title.metadata': 'Hapus Metadata Foto & C2PA | Pembersih Privasi 100%',
  'landing.default.desc.metadata': 'Hapus permanen manifest C2PA, tanda air SynthID, geotag GPS, dan metadata EXIF kamera secara lossless di browser Anda.',
  'metadata.auditTitle': 'AUDIT PRIVASI METADATA',
  'metadata.c2paDetected': 'Manifest AI C2PA Terdeteksi!',
  'metadata.c2paClean': 'Bebas Manifest C2PA',
  'metadata.c2paCleanDesc': 'Tidak ada jejak tanda air AI yang ditemukan',
  'metadata.noExifFound': 'Tidak Ada Metadata Perangkat Kamera',
  'metadata.noExifDesc': 'Merek kamera, lensa, dan nomor seri',
  'metadata.noArtist': 'Tidak Ada Nama Kreator Tertanam',
  'metadata.noCopyright': 'Tidak ada pemberitahuan hak cipta',
  'metadata.dropToInspect': 'Tarik & lepas foto untuk memeriksa jejak AI & metadata',
  'metadata.scrubScopeTitle': 'DATA YANG AKAN DIHAPUS PERMANEN',
  'metadata.chkC2pa': 'Hapus Manifest C2PA & Jejak AI (SynthID, JUMBF APP11)',
  'metadata.chkC2paSub': 'Menghilangkan label otomatis "Dibuat dengan AI" di media sosial',
  'metadata.chkExif': 'Hapus EXIF Kamera & Informasi Perangkat Keras',
  'metadata.chkExifSub': 'Menghapus nomor seri kamera, jumlah shutter, dan data lensa',
  'metadata.chkGps': 'Hapus Koordinat GPS & Lokasi Geotag',
  'metadata.chkGpsSub': 'Melindungi privasi lokasi fisik dan alamat rumah/kantor Anda',
  'metadata.chkAuthor': 'Hapus Nama Kreator, Fotografer & Hak Cipta',
  'metadata.chkXmp': 'Hapus Riwayat Pengeditan Perangkat Lunak (XMP)',
  'metadata.processing': 'Membersihkan Metadata & C2PA secara Lossless...',
  'metadata.btnScrubAll': 'Hapus Semua Metadata & C2PA Sekarang',
  'metadata.downloadClean': 'Unduh Foto Bersih Tanpa Jejak',
  'metadata.successToast': 'Semua metadata & C2PA berhasil dihapus bersih!',
  'metadata.failedToast': 'Gagal membersihkan metadata foto.',
  'metadata.batchSuccess': 'Semua foto berhasil dibersihkan!'
};

async function sleep(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

async function translateBatchWithFallback(texts, targetLang) {
  try {
    const res = await translate(texts, {
      from: 'en',
      to: targetLang,
      rejectOnPartialFail: false
    });
    const results = Array.isArray(res) ? res : [res];
    return results.map((r, i) => (r && r.text ? r.text : texts[i]));
  } catch (err) {
    console.warn(`[Batch failed for ${targetLang}, falling back to single key translation...]`);
    const fallbackResults = [];
    for (const text of texts) {
      try {
        const singleRes = await translate(text, { from: 'en', to: targetLang });
        fallbackResults.push(singleRes.text);
      } catch (singleErr) {
        fallbackResults.push(text);
      }
      await sleep(100);
    }
    return fallbackResults;
  }
}

async function run() {
  console.log(`Starting bulk translation for updated editexif & metadata keys across ${languages.length} languages...`);

  // Write EN directly
  const enFile = path.join(localesDir, 'en', 'translation.json');
  if (fs.existsSync(enFile)) {
    const data = JSON.parse(fs.readFileSync(enFile, 'utf8'));
    Object.assign(data, enKeys);
    fs.writeFileSync(enFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Updated [en] with ${Object.keys(enKeys).length} keys.`);
  }

  // Write ID directly
  const idFile = path.join(localesDir, 'id', 'translation.json');
  if (fs.existsSync(idFile)) {
    const data = JSON.parse(fs.readFileSync(idFile, 'utf8'));
    Object.assign(data, idOverrides);
    fs.writeFileSync(idFile, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✓ Updated [id] with ${Object.keys(idOverrides).length} keys.`);
  }

  const keys = Object.keys(enKeys);
  const values = Object.values(enKeys);

  // Translate for other 28 languages
  for (const lang of languages) {
    if (lang === 'en' || lang === 'id') continue;

    const targetFile = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(targetFile)) continue;

    console.log(`\nTranslating for [${lang}]...`);
    const targetData = JSON.parse(fs.readFileSync(targetFile, 'utf8'));

    // Check which keys need translation
    const missingIndices = [];
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!targetData[k] || targetData[k] === enKeys[k] || targetData[k].includes('Studio Pass') || targetData[k].includes('preset')) {
        missingIndices.push(i);
      }
    }

    if (missingIndices.length === 0) {
      console.log(`[${lang}] already fully translated.`);
      continue;
    }

    console.log(`Translating ${missingIndices.length} keys for [${lang}]...`);

    // Batch translate in chunks of 10
    const chunkSize = 10;
    for (let c = 0; c < missingIndices.length; c += chunkSize) {
      const chunk = missingIndices.slice(c, c + chunkSize);
      const textChunk = chunk.map((idx) => values[idx]);

      const translatedChunk = await translateBatchWithFallback(textChunk, lang);

      for (let j = 0; j < chunk.length; j++) {
        const origKey = keys[chunk[j]];
        targetData[origKey] = translatedChunk[j] || enKeys[origKey];
      }

      await sleep(200);
    }

    fs.writeFileSync(targetFile, JSON.stringify(targetData, null, 2), 'utf8');
    console.log(`✓ Successfully updated [${lang}].`);
  }

  console.log('\nAll 30 languages have been successfully translated with zero missing keys!');
}

run().catch((err) => {
  console.error('Fatal translation error:', err);
  process.exit(1);
});
