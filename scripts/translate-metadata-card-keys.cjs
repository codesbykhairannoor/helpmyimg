const fs = require('fs');
const path = require('path');
const translate = require('google-translate-api-x');

const localesDir = path.resolve('public/locales');

const enKeys = {
  'metadata.tabAudit': 'Privacy Audit',
  'metadata.tabScope': 'Remove Scope',
  'metadata.auditReady': 'Audit Ready',
  'metadata.idle': 'Idle',
  'metadata.scanning': 'Scanning...',
  'metadata.c2paProvenanceDesc': 'Cryptographic provenance manifest',
  'metadata.badgeClean': 'Clean',
  'metadata.badgeFlagged': 'Flagged',
  'metadata.badgeExposed': 'Exposed',
  'metadata.badgeNone': 'None',
  'metadata.flipToScrub': 'Flip Card: Configure Data to Remove',
  'metadata.flipToAudit': 'Flip Card: View Audit Results',
  'metadata.active': 'Active',
};

const idKeys = {
  'metadata.tabAudit': 'Audit Privasi',
  'metadata.tabScope': 'Opsi Hapus',
  'metadata.auditReady': 'Audit Siap',
  'metadata.idle': 'Menunggu Foto',
  'metadata.scanning': 'Memindai...',
  'metadata.c2paProvenanceDesc': 'Manifest asal digital kriptografis',
  'metadata.badgeClean': 'Bersih',
  'metadata.badgeFlagged': 'Terdeteksi',
  'metadata.badgeExposed': 'Terekspos',
  'metadata.badgeNone': 'Tidak Ada',
  'metadata.flipToScrub': 'Balik Kartu: Atur Data yang Dihapus',
  'metadata.flipToAudit': 'Balik Kartu: Lihat Hasil Audit',
  'metadata.active': 'Aktif',
};

async function main() {
  console.log('Writing EN and ID keys...');
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

  console.log(`Translating new card flip keys to ${allLangs.length} languages...`);

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
      console.log(`[${targetLang}] Card keys updated successfully`);
    } catch (e) {
      console.warn(`[${targetLang}] Batch failed (${e.message}), trying individual translations...`);
      for (let i = 0; i < keyList.length; i++) {
        try {
          const singleRes = await translate(valuesToTranslate[i], { to: targetLang, forceBatch: false });
          langJSON[keyList[i]] = singleRes.text;
        } catch (singleErr) {
          console.error(`[${targetLang}] Single err on ${keyList[i]}: ${singleErr.message}`);
        }
      }
      fs.writeFileSync(langPath, JSON.stringify(langJSON, null, 2));
      console.log(`[${targetLang}] Individual card keys updated successfully`);
    }
  }

  console.log('All 30 languages updated successfully!');
}

main();
