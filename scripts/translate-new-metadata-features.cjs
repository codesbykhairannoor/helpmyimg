const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const localesDir = path.join(__dirname, '..', 'public', 'locales');

const newKeys = {
  "editexif.tabInspect": "View Info",
  "editexif.inspectTitle": "ORIGINAL IMAGE METADATA",
  "editexif.inspectSubtitle": "EXIF & C2PA headers detected in this image file",
  "editexif.noExifInImage": "No camera EXIF metadata embedded in this image.",
  "editexif.startEditingHint": "Start Filling Metadata",
  "editexif.btnPopulateFromImage": "Copy to Edit Form & Customize",
  "editexif.btnQuickPreset": "Use Standard Camera Preset",
  "editexif.calendarPick": "Open Calendar",
  "editexif.quickPresets": "Quick Presets:",
  "editexif.presetNow": "Now",
  "editexif.presetTodayMorning": "Morning 09:00",
  "editexif.presetTodayAfternoon": "Afternoon 15:00",
  "editexif.presetYesterday": "Yesterday",
  "editexif.presetPlusHour": "+1 Hour",
  "editexif.presetMinusHour": "-1 Hour",
  "editexif.presetClear": "Clear",
  "editexif.sameAsCreated": "Same as Creation Date",
  "editexif.switchToScrub": "Switch to Strip Metadata",
  "editexif.fieldCamera": "Camera & Lens",
  "editexif.fieldLens": "Camera Lens",
  "editexif.fieldExposure": "Exposure Parameters",
  "editexif.fieldAuthor": "Creator & Copyright",
  "editexif.fieldSoftware": "Software & Engine",
  "editexif.fieldDateCreated": "Capture Date & Time",
  "editexif.fieldDimensions": "Image Dimensions",
  "editexif.fieldFileSize": "File Size",
  "metadata.btnShowFullDetails": "Show Full Metadata Details",
  "metadata.btnHideFullDetails": "Hide Metadata Details",
  "metadata.btnEditExifInstead": "Edit This Photo's EXIF Metadata",
  "metadata.switchToEdit": "Switch to Edit EXIF Mode",
  "work.viewMetadataHud": "Metadata Info",
  "work.hideMetadataHud": "Close Info"
};

const indonesianOverrides = {
  "editexif.tabInspect": "Lihat Info",
  "editexif.inspectTitle": "METADATA GAMBAR ASLI",
  "editexif.inspectSubtitle": "Informasi EXIF & C2PA yang terdeteksi pada file gambar ini",
  "editexif.noExifInImage": "Tidak ada metadata EXIF kamera yang tertanam di foto ini.",
  "editexif.startEditingHint": "Mulai Mengisi Metadata",
  "editexif.btnPopulateFromImage": "Salin ke Form Edit & Kustomisasi",
  "editexif.btnQuickPreset": "Gunakan Preset Kamera Standar",
  "editexif.calendarPick": "Buka Kalender",
  "editexif.quickPresets": "Preset Cepat:",
  "editexif.presetNow": "Sekarang",
  "editexif.presetTodayMorning": "Pagi 09:00",
  "editexif.presetTodayAfternoon": "Sore 15:00",
  "editexif.presetYesterday": "Kemarin",
  "editexif.presetPlusHour": "+1 Jam",
  "editexif.presetMinusHour": "-1 Jam",
  "editexif.presetClear": "Hapus",
  "editexif.sameAsCreated": "Samakan dengan Tanggal Dibuat",
  "editexif.switchToScrub": "Beralih ke Hapus Metadata (Scrub)",
  "editexif.fieldCamera": "Kamera & Lensa",
  "editexif.fieldLens": "Lensa Kamera",
  "editexif.fieldExposure": "Parameter Eksposur",
  "editexif.fieldAuthor": "Kreator & Hak Cipta",
  "editexif.fieldSoftware": "Software Pengolah",
  "editexif.fieldDateCreated": "Waktu Pengambilan",
  "editexif.fieldDimensions": "Dimensi Gambar",
  "editexif.fieldFileSize": "Ukuran File",
  "metadata.btnShowFullDetails": "Tampilkan Rincian Metadata Lengkap",
  "metadata.btnHideFullDetails": "Tutup Rincian Metadata",
  "metadata.btnEditExifInstead": "Edit Metadata EXIF Foto Ini",
  "metadata.switchToEdit": "Beralih ke Mode Edit EXIF",
  "work.viewMetadataHud": "Info Metadata",
  "work.hideMetadataHud": "Tutup Info"
};

async function main() {
  const locales = fs.readdirSync(localesDir).filter(f => {
    return fs.statSync(path.join(localesDir, f)).isDirectory();
  });

  const keys = Object.keys(newKeys);
  const values = Object.values(newKeys);

  for (const loc of locales) {
    const filePath = path.join(localesDir, loc, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    console.log(`Processing [${loc}]...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (loc === 'en') {
      for (const [k, v] of Object.entries(newKeys)) {
        data[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`  ✓ Updated EN`);
      continue;
    }

    if (loc === 'id') {
      for (const [k, v] of Object.entries(indonesianOverrides)) {
        data[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`  ✓ Updated ID`);
      continue;
    }

    // Check which keys need translation
    const missingKeys = keys.filter(k => !data[k]);
    if (missingKeys.length === 0) {
      console.log(`  ✓ All keys already present in [${loc}]`);
      continue;
    }

    const missingValues = missingKeys.map(k => newKeys[k]);
    const targetLang = loc === 'zh' ? 'zh-CN' : loc;

    try {
      const res = await translate(missingValues, { to: targetLang, from: 'en' });
      const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];

      missingKeys.forEach((key, idx) => {
        data[key] = translatedArray[idx] || missingValues[idx];
      });

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`  ✓ Translated and wrote ${missingKeys.length} keys for [${loc}]`);
    } catch (err) {
      console.error(`  ✗ Error translating for [${loc}]:`, err.message);
      // Fallback to English if network fails for this locale
      missingKeys.forEach((key, idx) => {
        data[key] = missingValues[idx];
      });
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
    }
  }

  console.log('Done translating new metadata features!');
}

main().catch(console.error);
