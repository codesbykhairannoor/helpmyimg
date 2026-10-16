const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const localesDir = path.resolve('public/locales');

const enKeys = {
  'metadata.chkC2pa': 'Strip Provenance & Tracking Manifests (C2PA, JUMBF)',
  'metadata.chkC2paSub': 'Removes digital tracking headers, provenance manifests, and file origin fingerprints',
  'metadata.chkExif': 'Wipe Camera EXIF & Hardware Information',
  'metadata.chkExifSub': 'Removes camera serial number, shutter count, and lens data',
  'metadata.chkGps': 'Scrub GPS Coordinates & Geotags',
  'metadata.chkGpsSub': 'Protects physical location and private home/office addresses',
  'metadata.chkAuthor': 'Strip Creator Names, Artist & Copyright Tags',
  'metadata.chkAuthorSub': 'Clears photographer, designer names, and legal copyright notices',
  'metadata.chkXmp': 'Wipe Software Traces & Editing History (XMP)',
  'metadata.chkXmpSub': 'Removes Photoshop, Canva, Lightroom, and generative editing logs',
  'landing.metadata.heroDesc': 'Digital cameras and smartphones embed GPS home coordinates, serial numbers, and creator signatures inside photos. HelpMyIMG losslessly cleans sensitive metadata and digital tracking headers directly in your browser.',
  'landing.metadata.faq2.q': 'What digital tracking data does HelpMyIMG remove?',
  'landing.metadata.faq2.a': 'HelpMyIMG losslessly removes embedded C2PA/JUMBF provenance manifests, GPS geotags, camera hardware serials, and XMP application editing logs directly inside your web browser without uploading files to any server.',
  'landing.metadata.c2paLayerDesc': 'C2PA manifests embed digital provenance chains inside JPEG APP11 and PNG caBX segments. HelpMyIMG losslessly carves out these tracking headers without decompressing or modifying image pixels.',
  'landing.metadata.exifLayerDesc': 'EXIF headers store camera hardware model, exposure parameters, shutter count, and device serial numbers. HelpMyIMG enables you to inspect, sanitize, or replace these tags for complete privacy.'
};

const idKeys = {
  'metadata.chkC2pa': 'Hapus Manifest C2PA & Header Pelacak Digital (JUMBF)',
  'metadata.chkC2paSub': 'Menghapus header pelacakan digital, manifest provenance, dan jejak asal file',
  'metadata.chkExif': 'Hapus EXIF Kamera & Informasi Perangkat Keras',
  'metadata.chkExifSub': 'Menghapus nomor seri kamera, jumlah shutter, dan data lensa',
  'metadata.chkGps': 'Hapus Koordinat GPS & Lokasi Geotag',
  'metadata.chkGpsSub': 'Melindungi privasi lokasi fisik dan alamat rumah/kantor Anda',
  'metadata.chkAuthor': 'Hapus Nama Kreator, Fotografer & Hak Cipta',
  'metadata.chkAuthorSub': 'Menghapus nama fotografer, desainer, dan informasi hak cipta',
  'metadata.chkXmp': 'Hapus Riwayat Pengeditan Perangkat Lunak (XMP)',
  'metadata.chkXmpSub': 'Menghapus riwayat aplikasi editing (Photoshop, Canva, Lightroom)',
  'landing.metadata.heroDesc': 'Kamera digital dan ponsel pintar otomatis menyematkan koordinat GPS lokasi rumah, nomor seri perangkat, dan data pembuat di dalam foto. HelpMyIMG membersihkan data sensitif ini langsung di browser Anda sebelum Anda membagikan foto ke publik.',
  'landing.metadata.faq2.q': 'Data pelacakan digital apa saja yang dihapus oleh HelpMyIMG?',
  'landing.metadata.faq2.a': 'HelpMyIMG menghapus manifest provenance C2PA/JUMBF, geotag GPS, nomor seri kamera, dan riwayat editing XMP secara lossless langsung di browser tanpa upload ke server.',
  'landing.metadata.c2paLayerDesc': 'Manifest C2PA menyimpan rantai asal digital di segmen JPEG APP11 dan chunk PNG caBX. HelpMyIMG memotong header pelacak ini secara lossless tanpa menyentuh piksel gambar.',
  'landing.metadata.exifLayerDesc': 'Header EXIF menyimpan model kamera, parameter eksposur, jumlah jepretan shutter, dan nomor seri perangkat. HelpMyIMG memungkinkan Anda memeriksa, membersihkan, atau mengubah tag ini demi privasi penuh.'
};

async function run() {
  console.log('Writing clean keys to EN and ID...');
  const enPath = path.join(localesDir, 'en', 'translation.json');
  const enJSON = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  Object.assign(enJSON, enKeys);
  fs.writeFileSync(enPath, JSON.stringify(enJSON, null, 2));

  const idPath = path.join(localesDir, 'id', 'translation.json');
  const idJSON = JSON.parse(fs.readFileSync(idPath, 'utf8'));
  Object.assign(idJSON, idKeys);
  fs.writeFileSync(idPath, JSON.stringify(idJSON, null, 2));

  const keyList = Object.keys(enKeys);
  const valuesToTranslate = keyList.map(k => enKeys[k]);

  const allLangs = fs.readdirSync(localesDir).filter(f => 
    f !== 'en' && f !== 'id' && fs.statSync(path.join(localesDir, f)).isDirectory()
  );

  console.log(`Translating clean metadata keys to ${allLangs.length} other languages...`);

  for (const lang of allLangs) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    let langJSON = JSON.parse(fs.readFileSync(langPath, 'utf8'));

    let targetLang = lang;
    if (targetLang === 'zh') targetLang = 'zh-CN';

    try {
      const res = await translate(valuesToTranslate, { to: targetLang });
      const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];

      for (let i = 0; i < keyList.length; i++) {
        langJSON[keyList[i]] = translatedArray[i];
      }

      fs.writeFileSync(langPath, JSON.stringify(langJSON, null, 2));
      console.log(`[${targetLang}] Updated successfully`);
    } catch (e) {
      console.error(`[${targetLang}] Failed: ${e.message}`);
    }
  }

  console.log('Done cleaning and translating metadata keys!');
}

run();
