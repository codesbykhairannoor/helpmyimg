// scripts/translate-new-sections.cjs
const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');

// English base keys
const ENGLISH_KEYS = {
  // Metadata Redesign
  'landing.metadata.redesign.heroBadge': '100% PRIVATE METADATA SCRUBBER',
  'landing.metadata.redesign.heroTitle': 'Protect Your Privacy: Strip Hidden GPS & EXIF Data Instantly',
  'landing.metadata.redesign.heroDesc': 'Digital cameras and smartphones embed exact physical GPS locations, camera serial numbers, and personal creator data inside every photo. HelpMyIMG losslessly strips these sensitive headers in your browser before you share photos online.',
  'landing.metadata.redesign.feat1Badge': 'GEOLOCATION SAFETY',
  'landing.metadata.redesign.feat1Title': 'Scrub GPS Geotags',
  'landing.metadata.redesign.feat1Desc': 'Permanently remove latitude, longitude, and altitude coordinates to prevent physical location tracking and keep your home address confidential.',
  'landing.metadata.redesign.feat2Badge': 'DEVICE FINGERPRINT',
  'landing.metadata.redesign.feat2Title': 'Wipe Hardware EXIF',
  'landing.metadata.redesign.feat2Desc': 'Clear camera serial numbers, lens identifiers, shutter actuations, and internal hardware tags that could uniquely identify your personal equipment.',
  'landing.metadata.redesign.feat3Badge': '100% IN-BROWSER',
  'landing.metadata.redesign.feat3Title': 'Zero Server Uploads',
  'landing.metadata.redesign.feat3Desc': 'All byte manipulation executes locally in your device memory. Your private portraits and sensitive photos never leave your device or touch a remote server.',
  'landing.metadata.redesign.whoTag': 'WHO IS IT FOR',
  'landing.metadata.redesign.whoTitle': 'Built for Safe & Responsible Photo Sharing',
  'landing.metadata.redesign.whoDesc': 'Whether posting family moments, selling items online, or delivering professional assets, protect your digital footprint easily.',
  'landing.metadata.redesign.who1Title': 'Individuals & Families',
  'landing.metadata.redesign.who1Desc': 'Remove home and school GPS coordinates from family photos before posting on Instagram, forums, or online marketplaces.',
  'landing.metadata.redesign.who1Tags': 'FAMILY PRIVACY',
  'landing.metadata.redesign.who2Title': 'Photographers & Designers',
  'landing.metadata.redesign.who2Desc': 'Clean private camera metadata and proprietary software history from client deliverables while maintaining 100% original image quality.',
  'landing.metadata.redesign.who2Tags': 'STUDIO WORKFLOW',
  'landing.metadata.redesign.stepsTag': 'HOW IT WORKS',
  'landing.metadata.redesign.stepsTitle': '3 Steps to Clean Your Photos',
  'landing.metadata.redesign.s1Title': 'Upload Photos',
  'landing.metadata.redesign.s1Desc': 'Drag and drop your images into the secure local workspace.',
  'landing.metadata.redesign.s2Title': 'Audit & Clean',
  'landing.metadata.redesign.s2Desc': 'Inspect detected GPS and hardware tags, then click to scrub all sensitive metadata losslessly.',
  'landing.metadata.redesign.s3Title': 'Download Safely',
  'landing.metadata.redesign.s3Desc': 'Export your sanitized photos with zero tracking headers and complete peace of mind.',

  // Edit EXIF Redesign
  'landing.editexif.redesign.heroBadge': 'PROFESSIONAL EXIF & METADATA EDITOR',
  'landing.editexif.redesign.heroTitle': 'Edit Photography Metadata & Fix Timestamps in Seconds',
  'landing.editexif.redesign.heroDesc': 'Organize your photography portfolio, synchronize capture timestamps across time zones, and embed official copyright credits directly in your browser with zero image recompression.',
  'landing.editexif.redesign.feat1Badge': 'TIME SYNCHRONIZATION',
  'landing.editexif.redesign.feat1Title': 'Fix Capture Dates',
  'landing.editexif.redesign.feat1Desc': 'Synchronize out-of-sync camera clocks after battery drain or international travel across multiple time zones in seconds.',
  'landing.editexif.redesign.feat2Badge': 'CREATOR CREDENTIALS',
  'landing.editexif.redesign.feat2Title': 'Embed Artist & Copyright',
  'landing.editexif.redesign.feat2Desc': 'Standardize copyright notices and artist credits across your photo catalog to protect intellectual property and creator attribution.',
  'landing.editexif.redesign.feat3Badge': 'LOSSLESS EXIF',
  'landing.editexif.redesign.feat3Title': 'Zero Recompression',
  'landing.editexif.redesign.feat3Desc': 'Injects and updates EXIF segments directly without re-encoding image pixels, guaranteeing that your high-resolution textures remain 100% sharp.',
  'landing.editexif.redesign.whoTag': 'WHO IS IT FOR',
  'landing.editexif.redesign.whoTitle': 'Built for Photographers & Digital Creatives',
  'landing.editexif.redesign.whoDesc': 'From professional photography studios to print designers, manage and standardize image metadata seamlessly.',
  'landing.editexif.redesign.who1Title': 'Photographers & Studios',
  'landing.editexif.redesign.who1Desc': 'Ensure every photo in your catalog includes official copyright notices, photographer credits, and synchronized capture timestamps.',
  'landing.editexif.redesign.who1Tags': 'PHOTOGRAPHY CATALOG',
  'landing.editexif.redesign.who2Title': 'Designers & Print Specialists',
  'landing.editexif.redesign.who2Desc': 'Embed 300 DPI print markers and clean software tags to ensure assets are properly prepared for high-end printing production.',
  'landing.editexif.redesign.who2Tags': 'PRINT PRODUCTION',
  'landing.editexif.redesign.stepsTag': 'HOW IT WORKS',
  'landing.editexif.redesign.stepsTitle': '3 Steps to Edit Photo Metadata',
  'landing.editexif.redesign.s1Title': 'Upload Photos',
  'landing.editexif.redesign.s1Desc': 'Drag and drop your images into the local EXIF editor workspace.',
  'landing.editexif.redesign.s2Title': 'Customize Parameters',
  'landing.editexif.redesign.s2Desc': 'Adjust capture dates, input creator credentials, set DPI resolution, or edit camera tags.',
  'landing.editexif.redesign.s3Title': 'Export Losslessly',
  'landing.editexif.redesign.s3Desc': 'Download your organized photos with updated EXIF tags and 100% untouched visual quality.'
};

// Curated Indonesian Translations
const ID_OVERRIDE = {
  // Metadata Redesign
  'landing.metadata.redesign.heroBadge': 'PEMBERSIH METADATA 100% PRIVAT',
  'landing.metadata.redesign.heroTitle': 'Lindungi Privasi: Hapus GPS & Data EXIF Tersembunyi Seketika',
  'landing.metadata.redesign.heroDesc': 'Kamera digital dan ponsel pintar otomatis menyematkan koordinat GPS lokasi rumah, nomor seri perangkat, dan data pembuat di dalam foto. HelpMyIMG membersihkan data sensitif ini langsung di browser Anda sebelum Anda membagikan foto ke publik.',
  'landing.metadata.redesign.feat1Badge': 'KEAMANAN LOKASI',
  'landing.metadata.redesign.feat1Title': 'Hapus Geotag GPS',
  'landing.metadata.redesign.feat1Desc': 'Hapus koordinat garis lintang dan bujur secara permanen untuk mencegah pelacakan lokasi fisik dan menjaga kerahasiaan alamat rumah Anda.',
  'landing.metadata.redesign.feat2Badge': 'SIDIK JARI PERANGKAT',
  'landing.metadata.redesign.feat2Title': 'Bersihkan EXIF Perangkat',
  'landing.metadata.redesign.feat2Desc': 'Hapus nomor seri kamera, seri lensa, jumlah shutter, dan identitas perangkat keras yang dapat mengidentifikasi kamera pribadi Anda.',
  'landing.metadata.redesign.feat3Badge': '100% DI BROWSER',
  'landing.metadata.redesign.feat3Title': 'Nol Unggah ke Server',
  'landing.metadata.redesign.feat3Desc': 'Semua pemrosesan byte berlangsung lokal di memori perangkat Anda. Foto pribadi keluarga dan dokumen sensitif Anda tidak pernah dikirim ke server mana pun.',
  'landing.metadata.redesign.whoTag': 'UNTUK SIAPA ALAT INI',
  'landing.metadata.redesign.whoTitle': 'Dibuat untuk Berbagi Foto Secara Aman & Bertanggung Jawab',
  'landing.metadata.redesign.whoDesc': 'Baik untuk mengunggah foto keluarga, menjual barang di marketplace, atau menyerahkan berkas ke klien, lindungi privasi digital Anda dengan mudah.',
  'landing.metadata.redesign.who1Title': 'Individu & Keluarga',
  'landing.metadata.redesign.who1Desc': 'Hapus koordinat GPS rumah dan sekolah dari foto keluarga sebelum mengunggahnya ke media sosial atau forum online.',
  'landing.metadata.redesign.who1Tags': 'PRIVASI KELUARGA',
  'landing.metadata.redesign.who2Title': 'Fotografer & Desainer',
  'landing.metadata.redesign.who2Desc': 'Bersihkan metadata kamera pribadi dan riwayat software sebelum menyerahkan foto jadi kepada klien tanpa mengurangi ketajaman piksel.',
  'landing.metadata.redesign.who2Tags': 'ALUR KERJA STUDIO',
  'landing.metadata.redesign.stepsTag': 'CARA KERJA',
  'landing.metadata.redesign.stepsTitle': '3 Langkah Bersihkan Metadata Foto',
  'landing.metadata.redesign.s1Title': 'Pilih Foto',
  'landing.metadata.redesign.s1Desc': 'Tarik dan lepas foto Anda ke ruang kerja lokal yang aman.',
  'landing.metadata.redesign.s2Title': 'Periksa & Bersihkan',
  'landing.metadata.redesign.s2Desc': 'Lihat tag GPS dan informasi kamera yang terdeteksi, lalu klik bersihkan semua metadata tanpa kompresi ulang.',
  'landing.metadata.redesign.s3Title': 'Unduh dengan Aman',
  'landing.metadata.redesign.s3Desc': 'Ekspor foto Anda yang sudah 100% bersih dari pelacak dan bagikan dengan rasa tenang.',

  // Edit EXIF Redesign
  'landing.editexif.redesign.heroBadge': 'EDITOR EXIF & METADATA PROFESIONAL',
  'landing.editexif.redesign.heroTitle': 'Edit Metadata Foto & Perbaiki Tanggal Pengambilan',
  'landing.editexif.redesign.heroDesc': 'Rapikan katalog fotografi Anda, sinkronkan waktu pengambilan foto lintas zona waktu, dan sematkan hak cipta pembuat resmi langsung di browser Anda tanpa re-encoding gambar.',
  'landing.editexif.redesign.feat1Badge': 'SINKRONISASI WAKTU',
  'landing.editexif.redesign.feat1Title': 'Perbaiki Tanggal Pengambilan',
  'landing.editexif.redesign.feat1Desc': 'Perbaiki jam kamera yang salah setel akibat baterai habis atau perjalanan lintas zona waktu internasional dalam hitungan detik.',
  'landing.editexif.redesign.feat2Badge': 'KREDIT PEMBUAT',
  'landing.editexif.redesign.feat2Title': 'Sematkan Hak Cipta & Artis',
  'landing.editexif.redesign.feat2Desc': 'Standarisasi nama fotografer dan pemberitahuan hak cipta resmi pada portofolio Anda untuk melindungi kepemilikan karya visual.',
  'landing.editexif.redesign.feat3Badge': 'EXIF LOSSLESS',
  'landing.editexif.redesign.feat3Title': 'Tanpa Kompresi Ulang',
  'landing.editexif.redesign.feat3Desc': 'Memperbarui segmen EXIF langsung pada biner file tanpa memproses ulang piksel foto, memastikan kualitas foto tetap 100% tajam dan jernih.',
  'landing.editexif.redesign.whoTag': 'UNTUK SIAPA ALAT INI',
  'landing.editexif.redesign.whoTitle': 'Dirancang untuk Fotografer & Kreator Visual',
  'landing.editexif.redesign.whoDesc': 'Dari studio foto profesional hingga desainer grafis cetak, kelola dan rapikan metadata gambar dengan mudah dan rapi.',
  'landing.editexif.redesign.who1Title': 'Fotografer & Studio',
  'landing.editexif.redesign.who1Desc': 'Pastikan setiap foto dalam arsip Anda menyertakan nama pemotret, lisensi hak cipta, dan timestamp pengambilan yang sinkron.',
  'landing.editexif.redesign.who1Tags': 'KATALOG FOTOGRAFI',
  'landing.editexif.redesign.who2Title': 'Desainer & Spesialis Cetak',
  'landing.editexif.redesign.who2Desc': 'Sematkan penanda resolusi 300 DPI dan rapikan tag software agar berkas siap diproses oleh mesin cetak profesional.',
  'landing.editexif.redesign.who2Tags': 'PRODUKSI CETAK',
  'landing.editexif.redesign.stepsTag': 'CARA KERJA',
  'landing.editexif.redesign.stepsTitle': '3 Langkah Edit Metadata Foto',
  'landing.editexif.redesign.s1Title': 'Pilih Foto',
  'landing.editexif.redesign.s1Desc': 'Tarik dan letakkan foto Anda ke dalam ruang kerja editor EXIF lokal.',
  'landing.editexif.redesign.s2Title': 'Sesuaikan Parameter',
  'landing.editexif.redesign.s2Desc': 'Ketik tanggal pengambilan yang benar, nama pembuat, resolusi DPI, atau parameter teknis kamera.',
  'landing.editexif.redesign.s3Title': 'Ekspor Seketika',
  'landing.editexif.redesign.s3Desc': 'Unduh foto Anda yang sudah rapi dengan metadata terbaru dan kualitas visual asli yang 100% terjaga.'
};

const GOOGLE_LANG_MAP = {
  zh: 'zh-CN',
  he: 'iw',
  tl: 'tl'
};

async function main() {
  const dirs = fs.readdirSync(LOCALES_DIR).filter(d => fs.statSync(path.join(LOCALES_DIR, d)).isDirectory());
  console.log(`Synchronizing clean, privacy-focused translations across ${dirs.length} languages...`);

  const keys = Object.keys(ENGLISH_KEYS);
  const englishTexts = keys.map(k => ENGLISH_KEYS[k]);

  for (const lang of dirs) {
    const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    let json = {};
    try {
      json = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (err) {
      console.error(`Error reading ${lang}/translation.json:`, err);
      continue;
    }

    if (lang === 'en') {
      for (const [k, v] of Object.entries(ENGLISH_KEYS)) {
        json[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ [en] Injected English base keys (${keys.length} keys)`);
      continue;
    }

    if (lang === 'id') {
      for (const [k, v] of Object.entries(ID_OVERRIDE)) {
        json[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ [id] Injected curated native Indonesian keys (${keys.length} keys)`);
      continue;
    }

    // For other languages, translate batch using google-translate-api-x
    const targetLang = GOOGLE_LANG_MAP[lang] || lang;
    try {
      const res = await translate(englishTexts, { from: 'en', to: targetLang });
      const translatedArr = Array.isArray(res) ? res.map(r => r.text) : [res.text];

      for (let i = 0; i < keys.length; i++) {
        json[keys[i]] = translatedArr[i] || englishTexts[i];
      }

      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
      console.log(`✓ [${lang}] Translated and injected ${keys.length} keys`);
    } catch (err) {
      console.error(`✗ [${lang}] Error translating:`, err.message);
      // Fallback to English if network issue occurs
      for (let i = 0; i < keys.length; i++) {
        if (!json[keys[i]]) json[keys[i]] = englishTexts[i];
      }
      fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
    }
  }

  console.log('\nAll 30 languages have been updated with clean, privacy-focused translations!');
}

main();
