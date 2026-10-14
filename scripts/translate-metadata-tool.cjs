// scripts/translate-metadata-tool.cjs
// Translates all metadata tool keys into all 30 languages using google-translate-api-x with batching

const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const localesDir = path.resolve(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter((f) =>
  fs.statSync(path.join(localesDir, f)).isDirectory()
);

const enKeys = {
  // Nav & Grid
  'nav.metadata': 'AI Metadata & C2PA Cleaner',
  'grid.metadataDesc': 'Losslessly strip C2PA / AI watermarks or inject authentic studio DSLR camera EXIF.',
  
  // Landing SEO
  'landing.default.title.metadata': 'AI Metadata & C2PA Cleaner | Studio Camera EXIF Injector',
  'landing.default.desc.metadata': 'Detect and losslessly strip C2PA manifests, Google SynthID AI tags, and inject authentic Canon 5D Mark IV studio camera EXIF metadata in your browser.',

  // Workspace
  'metadata.inspectorTitle': 'METADATA & C2PA INSPECTOR',
  'metadata.c2paDetected': 'C2PA Manifest Detected!',
  'metadata.c2paClean': 'C2PA Manifest Free',
  'metadata.c2paCleanDesc': 'Zero AI watermark manifests found',
  'metadata.noExif': 'No Camera EXIF (Stripped / AI)',
  'metadata.noExifDesc': 'Missing aperture, shutter speed & lens tags',
  'metadata.dropToInspect': 'Drop an image to inspect AI signatures & metadata',
  'metadata.choosePreset': 'Choose Studio Camera Preset',
  'metadata.recommendedBadge': 'Studio Pass Photo',
  'metadata.stealthBadge': 'Scrub All',
  'metadata.customDetailsTitle': 'Custom Photographer & Studio Details (Optional)',
  'metadata.hide': 'Hide',
  'metadata.customize': 'Customize',
  'metadata.photographerLabel': 'Photographer / Studio Name',
  'metadata.dateLabel': 'Date Taken (YYYY:MM:DD HH:MM:SS)',
  'metadata.copyrightLabel': 'Copyright Notice',
  'metadata.processing': 'Applying Studio EXIF & Stripping C2PA...',
  'metadata.btnStealth': 'Losslessly Strip All Metadata & C2PA',
  'metadata.btnApply': 'Inject Studio DSLR EXIF & Strip C2PA',
  'metadata.downloadClean': 'Download Studio Verified Image',
  'metadata.successToast': 'Studio EXIF & Metadata applied successfully!',
  'metadata.failedToast': 'Failed to process photo metadata.',
  'metadata.batchSuccess': 'All photos processed successfully!',

  // Landing Sections
  'landing.metadata.badge': '100% CLIENT-SIDE METADATA PRIVACY',
  'landing.metadata.heroTitle1': 'Remove AI Provenance.',
  'landing.metadata.heroTitle2': 'Inject Authentic Studio Camera EXIF.',
  'landing.metadata.heroDesc': 'Social platforms like Instagram, TikTok, and LinkedIn automatically brand AI-generated portraits with "Made with AI" labels by parsing hidden C2PA manifests. HelpMyIMG losslessly strips these digital tracking headers in your browser and injects authentic Canon 5D Mark IV studio camera metadata.',
  'landing.metadata.pillLossless': 'Lossless Byte-Slicing',
  'landing.metadata.pillZeroUpload': 'Zero Server Uploads',
  'landing.metadata.pillPresets': '5 Professional Presets',
  'landing.metadata.capabilitiesTag': 'ADVANCED FORENSIC TOOLS',
  'landing.metadata.capabilitiesTitle': 'Designed for Creators, Pass Photos & Absolute Privacy',
  'landing.metadata.capabilitiesDesc': 'Whether preparing formal visa portraits or publishing creative headshots on social networks, HelpMyIMG gives you complete control over your photo metadata.',
  'landing.metadata.feat1Title': 'C2PA Manifest Scrubber',
  'landing.metadata.feat1Desc': 'Detects and slices away JPEG APP11 (JUMBF) and PNG caBX provenance manifests inserted by Google Gemini, Imagen, DALL-E, and Photoshop Content Credentials.',
  'landing.metadata.feat2Title': 'Studio DSLR Presets',
  'landing.metadata.feat2Desc': 'Inject authentic EXIF 2.31 tags from professional studio setups like Canon 5D Mark IV, Sony A7 IV, Fujifilm X-T5, and iPhone 16 Pro with calibrated strobe flash values.',
  'landing.metadata.feat3Title': '100% In-Browser Privacy',
  'landing.metadata.feat3Desc': 'Never upload your personal facial photos, passport scans, or confidential headshots to remote servers. All binary manipulation executes locally in your browser memory.',
  'landing.metadata.feat4Title': 'Batch Processing',
  'landing.metadata.feat4Desc': 'Process dozens of images at once. Clean AI manifests across an entire batch and download them simultaneously in a single, high-speed Zip archive.',
  'landing.metadata.tableTag': 'COMPETITIVE BENCHMARK',
  'landing.metadata.tableTitle': 'How HelpMyIMG Compares to Other Solutions',
  'landing.metadata.colFeature': 'Feature / Capability',
  'landing.metadata.colCloud': 'Cloud EXIF Websites',
  'landing.metadata.colDesktop': 'Desktop ExifTool CLI',
  'landing.metadata.colEditors': 'Standard Photo Editors',
  'landing.metadata.rowPrivacy': '100% In-Browser (Zero Cloud Upload)',
  'landing.metadata.rowC2pa': 'Lossless C2PA & JUMBF Stripping',
  'landing.metadata.rowStudio': '1-Click Studio Camera Presets',
  'landing.metadata.rowMobile': 'Mobile & Tablet Browser Friendly',
  'landing.metadata.rowPrice': 'Pricing & Subscription',
  'landing.metadata.specTag': 'TECHNICAL WHITE PAPER',
  'landing.metadata.specTitle': 'Understanding C2PA Manifests vs SynthID Watermarks',
  'landing.metadata.specDesc': 'AI-generated images from models such as Google Gemini, Imagen, and DALL-E 3 carry multiple forensic signatures. It is critical to understand how each layer functions.',
  'landing.metadata.c2paLayerTitle': '1. The Container Layer (C2PA / JUMBF)',
  'landing.metadata.c2paLayerDesc': 'C2PA stores cryptographic certificates inside standard container chunks: APP11 (0xFFEB) in JPEGs and the caBX chunk in PNGs. Automated bots on Instagram and LinkedIn read this specific header to slap on the "AI-generated" badge. HelpMyIMG removes this segment with bitwise byte-slicing without touching image pixels.',
  'landing.metadata.exifLayerTitle': '2. The EXIF Photography Layer',
  'landing.metadata.exifLayerDesc': 'Real cameras record exposure metadata: shutter speed (e.g. 1/160s), lens focal length (85mm), ISO speed ratings, and flash strobe fire states. AI generators output empty EXIF headers. By injecting realistic DSLR parameters, your photo regains standard photographic properties accepted by passport systems and portrait galleries.',
  'landing.metadata.howTag': 'HOW IT WORKS',
  'landing.metadata.howTitle': 'Three Simple Steps to Verified Studio Photos',
  'landing.metadata.step1Title': 'Drop or Upload Photo',
  'landing.metadata.step1Desc': 'Drag and drop your AI-generated portrait, pass photo, or headshot into the workspace. The live inspector instantly scans for C2PA manifests and missing camera tags.',
  'landing.metadata.step2Title': 'Select Studio Preset',
  'landing.metadata.step2Desc': 'Choose from Canon EOS 5D Mark IV, Sony Alpha 7 IV, Fujifilm X-T5, or iPhone 16 Pro. Optionally customize the studio name and timestamp.',
  'landing.metadata.step3Title': 'Instant Lossless Download',
  'landing.metadata.step3Desc': 'Click Apply to strip the C2PA header and inject professional EXIF. Download your clean photo instantly with zero server uploads.',

  // FAQs
  'landing.metadata.faq1.q': 'Does removing C2PA metadata degrade image quality?',
  'landing.metadata.faq1.a': 'Not at all. HelpMyIMG uses lossless byte-slicing directly on binary JPEG/PNG containers. It slices out the APP11 manifest chunk without decoding or recompressing DCT pixel coefficients, keeping 100% of the original visual quality.',
  'landing.metadata.faq2.q': 'Why does Instagram or LinkedIn label my photo as "Made with AI"?',
  'landing.metadata.faq2.a': 'Social platforms inspect Content Credentials (C2PA) cryptographic headers embedded by tools like Google Gemini, Adobe Photoshop, and Midjourney. When their crawlers detect this manifest, an automated "AI-generated" label is applied. Removing the C2PA manifest eliminates this trigger.',
  'landing.metadata.faq3.q': 'What are Studio Camera Presets?',
  'landing.metadata.faq3.a': 'AI generators output images with zero EXIF camera data. Our presets inject authentic metadata from real studio cameras like the Canon EOS 5D Mark IV with calibrated portrait lenses (EF 85mm f/1.4L), manual sync shutter (1/160s), and studio flash triggers, ensuring your photo looks completely authentic in file properties.',
  'landing.metadata.faq4.q': 'Is my photo uploaded to your servers?',
  'landing.metadata.faq4.a': 'No. HelpMyIMG operates 100% locally in your web browser using JavaScript and client-side binary manipulation. Your photos never leave your device.'
};

const idKeys = {
  // Nav & Grid
  'nav.metadata': 'Pembersih Metadata AI & C2PA',
  'grid.metadataDesc': 'Hapus watermark C2PA / AI tanpa merusak kualitas dan suntikkan EXIF kamera DSLR studio asli.',
  
  // Landing SEO
  'landing.default.title.metadata': 'Pembersih Metadata AI & C2PA | Injektor EXIF Kamera Studio',
  'landing.default.desc.metadata': 'Deteksi dan hapus manifest C2PA, tag AI SynthID Google secara lossless, serta suntikkan metadata EXIF kamera studio Canon 5D Mark IV langsung di browser Anda.',

  // Workspace
  'metadata.inspectorTitle': 'INSPEKTOR METADATA & C2PA',
  'metadata.c2paDetected': 'Manifest C2PA Terdeteksi!',
  'metadata.c2paClean': 'Bebas Manifest C2PA',
  'metadata.c2paCleanDesc': 'Tidak ditemukan manifest tanda air digital AI',
  'metadata.noExif': 'Tanpa EXIF Kamera (Pola AI / Dihapus)',
  'metadata.noExifDesc': 'Data aperture, shutter speed & lensa tidak tersedia',
  'metadata.dropToInspect': 'Tarik & lepas foto untuk memindai tanda digital AI & metadata',
  'metadata.choosePreset': 'Pilih Preset Kamera Studio',
  'metadata.recommendedBadge': 'Pas Foto Studio',
  'metadata.stealthBadge': 'Hapus Semua',
  'metadata.customDetailsTitle': 'Detail Kustom Fotografer & Studio (Opsional)',
  'metadata.hide': 'Sembunyikan',
  'metadata.customize': 'Kustomisasi',
  'metadata.photographerLabel': 'Nama Fotografer / Studio',
  'metadata.dateLabel': 'Waktu Pengambilan (YYYY:MM:DD HH:MM:SS)',
  'metadata.copyrightLabel': 'Catatan Hak Cipta',
  'metadata.processing': 'Menerapkan EXIF Studio & Menghapus C2PA...',
  'metadata.btnStealth': 'Hapus Bersih Semua Metadata & C2PA',
  'metadata.btnApply': 'Suntikkan EXIF DSLR Studio & Hapus C2PA',
  'metadata.downloadClean': 'Unduh Foto Terverifikasi Studio',
  'metadata.successToast': 'EXIF Studio & Metadata berhasil diterapkan!',
  'metadata.failedToast': 'Gagal memperbarui metadata foto.',
  'metadata.batchSuccess': 'Semua foto berhasil diproses!',

  // Landing Sections
  'landing.metadata.badge': '100% PRIVASI METADATA DI BROWSER LOKAL',
  'landing.metadata.heroTitle1': 'Hapus Jejak AI.',
  'landing.metadata.heroTitle2': 'Suntikkan EXIF Kamera Studio Asli.',
  'landing.metadata.heroDesc': 'Platform media sosial seperti Instagram, TikTok, dan LinkedIn secara otomatis melabeli potret buatan AI dengan badge "Made with AI" melalui pemindaian manifest C2PA tersembunyi. HelpMyIMG menghapus header pelacakan digital ini secara lossless langsung di browser dan menyuntikkan metadata kamera studio Canon 5D Mark IV asli.',
  'landing.metadata.pillLossless': 'Pemotongan Byte Lossless',
  'landing.metadata.pillZeroUpload': 'Nol Upload Server',
  'landing.metadata.pillPresets': '5 Preset Kamera Profesional',
  'landing.metadata.capabilitiesTag': 'ALAT FORENSIK DIGITAL CANGGIH',
  'landing.metadata.capabilitiesTitle': 'Dirancang untuk Kreator, Pas Foto & Privasi Mutlak',
  'landing.metadata.capabilitiesDesc': 'Baik untuk menyiapkan pas foto visa resmi maupun mempublikasikan headshot profesional di jejaring sosial, HelpMyIMG memberi kendali penuh atas metadata foto Anda.',
  'landing.metadata.feat1Title': 'Pembersih Manifest C2PA',
  'landing.metadata.feat1Desc': 'Mendeteksi dan memotong segmen JPEG APP11 (JUMBF) dan chunk PNG caBX yang disematkan oleh Google Gemini, Imagen, DALL-E, dan Content Credentials Photoshop.',
  'landing.metadata.feat2Title': 'Preset Kamera DSLR Studio',
  'landing.metadata.feat2Desc': 'Menyuntikkan tag EXIF 2.31 otentik dari kamera studio nyata seperti Canon 5D Mark IV, Sony A7 IV, Fujifilm X-T5, dan iPhone 16 Pro dengan kalibrasi lampu kilat studio.',
  'landing.metadata.feat3Title': '100% Privasi di Browser',
  'landing.metadata.feat3Desc': 'Jangan pernah mengunggah pas foto wajah pribadi atau dokumen penting Anda ke server luar. Semua manipulasi byte biner berjalan 100% di memori browser Anda.',
  'landing.metadata.feat4Title': 'Pemrosesan Sekaligus (Batch)',
  'landing.metadata.feat4Desc': 'Proses puluhan foto sekaligus. Bersihkan manifest AI pada seluruh folder foto dan unduh semuanya secara bersamaan dalam format Zip super cepat.',
  'landing.metadata.tableTag': 'PERBANDINGAN KEUNGGULAN',
  'landing.metadata.tableTitle': 'Perbandingan HelpMyIMG dengan Solusi Lainnya',
  'landing.metadata.colFeature': 'Fitur / Kapabilitas',
  'landing.metadata.colCloud': 'Web EXIF Cloud',
  'landing.metadata.colDesktop': 'Desktop ExifTool CLI',
  'landing.metadata.colEditors': 'Aplikasi Editor Biasa',
  'landing.metadata.rowPrivacy': '100% di Browser (Nol Upload Cloud)',
  'landing.metadata.rowC2pa': 'Pembersihan C2PA Lossless',
  'landing.metadata.rowStudio': 'Preset Kamera Studio 1-Klik',
  'landing.metadata.rowMobile': 'Ramah Browser HP & Tablet',
  'landing.metadata.rowPrice': 'Harga & Biaya Langganan',
  'landing.metadata.specTag': 'DOKUMEN TEKNIS',
  'landing.metadata.specTitle': 'Memahami Manifest C2PA vs Tanda Air SynthID',
  'landing.metadata.specDesc': 'Gambar hasil AI dari model Google Gemini, Imagen, dan DALL-E membawa berbagai lapisan forensik digital. Sangat penting memahami cara kerja tiap layernya.',
  'landing.metadata.c2paLayerTitle': '1. Lapisan Kontainer Header (C2PA / JUMBF)',
  'landing.metadata.c2paLayerDesc': 'C2PA menyimpan sertifikat kriptografi di dalam chunk kontainer standar: APP11 (0xFFEB) pada JPEG dan chunk caBX pada PNG. Bot otomatis Instagram dan LinkedIn membaca header ini untuk menempelkan label "Dibuat dengan AI". HelpMyIMG memotong segmen ini secara lossless tanpa menyentuh piksel gambar.',
  'landing.metadata.exifLayerTitle': '2. Lapisan Fotografi EXIF',
  'landing.metadata.exifLayerDesc': 'Kamera sungguhan merekam metadata eksposur: kecepatan rana (1/160 detik), panjang fokus (85mm), ISO, dan pemicu lampu studio. AI generator selalu menghasilkan header EXIF kosong. Dengan menyuntikkan parameter DSLR realistis, foto Anda kembali memiliki properti fotografi standar yang diterima sistem paspor dan visa.',
  'landing.metadata.howTag': 'CARA KERJA',
  'landing.metadata.howTitle': 'Tiga Langkah Mudah Menuju Foto Studio Terverifikasi',
  'landing.metadata.step1Title': 'Tarik & Lepas Foto',
  'landing.metadata.step1Desc': 'Tarik dan lepas pas foto atau potret AI Anda ke area kerja. Inspektor langsung memindai keberadaan manifest C2PA dan ketiadaan tag kamera.',
  'landing.metadata.step2Title': 'Pilih Preset Studio',
  'landing.metadata.step2Desc': 'Pilih antara Canon EOS 5D Mark IV, Sony Alpha 7 IV, Fujifilm X-T5, atau iPhone 16 Pro. Kustomisasi nama studio dan tanggal jika diinginkan.',
  'landing.metadata.step3Title': 'Unduh Instan Kualitas Asli',
  'landing.metadata.step3Desc': 'Klik Terapkan untuk memotong C2PA dan menyuntikkan EXIF profesional. Unduh foto Anda seketika tanpa upload ke server.',

  // FAQs
  'landing.metadata.faq1.q': 'Apakah menghapus metadata C2PA merusak kualitas gambar?',
  'landing.metadata.faq1.a': 'Sama sekali tidak. HelpMyIMG menggunakan teknik pemotongan byte biner langsung pada kontainer JPEG/PNG. Pemotongan segmen manifest APP11 dilakukan tanpa proses dekompresi ulang piksel DCT, sehingga ketajaman visual asli terjaga 100%.',
  'landing.metadata.faq2.q': 'Mengapa Instagram atau LinkedIn mencap foto saya "Made with AI"?',
  'landing.metadata.faq2.a': 'Platform media sosial memeriksa header kriptografi Content Credentials (C2PA) yang disematkan oleh alat seperti Google Gemini, Adobe Photoshop, atau Midjourney. Ketika crawler mendeteksi header ini, label "Dibuat dengan AI" langsung dipasang secara otomatis.',
  'landing.metadata.faq3.q': 'Apa fungsi Preset Kamera Studio?',
  'landing.metadata.faq3.a': 'Generator AI menghasilkan gambar tanpa data kamera EXIF. Preset kami menyuntikkan metadata otentik dari kamera studio asli seperti Canon EOS 5D Mark IV dengan lensa potret 85mm f/1.4L, shutter sync 1/160s, dan trigger lampu studio, sehingga foto Anda terbaca sebagai jepretan studio asli.',
  'landing.metadata.faq4.q': 'Apakah foto saya diunggah ke server Anda?',
  'landing.metadata.faq4.a': 'Tidak sama sekali. HelpMyIMG berjalan 100% secara lokal di browser web Anda menggunakan JavaScript dan manipulasi memori biner. Foto Anda tidak pernah meninggalkan perangkat Anda.'
};

const langMap = {
  zh: 'zh-CN',
  he: 'iw',
};

async function main() {
  console.log(`Translating metadata tool keys for ${languages.length} languages...`);

  const keys = Object.keys(enKeys);
  const values = Object.values(enKeys);

  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    if (lang === 'en') {
      for (const [k, v] of Object.entries(enKeys)) {
        content[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
      console.log(`[OK] Updated en locale.`);
      continue;
    }

    if (lang === 'id') {
      for (const [k, v] of Object.entries(idKeys)) {
        content[k] = v;
      }
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
      console.log(`[OK] Updated id locale.`);
      continue;
    }

    // Check which keys are missing
    const missingKeys = [];
    const missingValues = [];

    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      if (!content[k] || content[k] === enKeys[k]) {
        missingKeys.push(k);
        missingValues.push(values[i]);
      }
    }

    if (missingKeys.length === 0) {
      console.log(`[SKIP] ${lang} already complete.`);
      continue;
    }

    const targetLang = langMap[lang] || lang;
    console.log(`[TRANSLATING] ${lang} (${missingKeys.length} keys) via google-translate-api-x...`);

    try {
      // Chunk into batches of 25 to avoid URL length issues
      const batchSize = 25;
      for (let i = 0; i < missingKeys.length; i += batchSize) {
        const batchKeys = missingKeys.slice(i, i + batchSize);
        const batchValues = missingValues.slice(i, i + batchSize);

        const res = await translate(batchValues, { from: 'en', to: targetLang });
        const translations = Array.isArray(res) ? res.map((r) => r.text) : [res.text];

        for (let j = 0; j < batchKeys.length; j++) {
          content[batchKeys[j]] = translations[j] || batchValues[j];
        }
        await new Promise((r) => setTimeout(r, 200));
      }

      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
      console.log(`[SUCCESS] ${lang} updated.`);
    } catch (err) {
      console.error(`[ERROR] Failed to translate ${lang}:`, err.message);
      // Fallback to idKeys or enKeys
      for (let i = 0; i < missingKeys.length; i++) {
        content[missingKeys[i]] = idKeys[missingKeys[i]] || missingValues[i];
      }
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf-8');
    }
  }

  console.log('\n[ALL DONE] All 30 language locale files synchronized successfully!');
}

main();
