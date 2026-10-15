const fs = require('fs');
const path = require('path');
const { translate } = require('google-translate-api-x');

const LOCALES_DIR = path.join(__dirname, '..', 'public', 'locales');
const languages = fs.readdirSync(LOCALES_DIR).filter(f => fs.statSync(path.join(LOCALES_DIR, f)).isDirectory());

const enMetadataTitle = "Remove Photo Metadata Online";
const enEditExifTitle = "Edit Photo EXIF Online";

const idMetadataTitle = "Hapus Metadata Foto Online";
const idEditExifTitle = "Edit EXIF Foto Online";

async function run() {
  console.log(`Updating titles across ${languages.length} languages...`);

  for (const lang of languages) {
    const filePath = path.join(LOCALES_DIR, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (lang === 'en') {
      data['landing.default.title.metadata'] = enMetadataTitle;
      data['landing.default.title.editexif'] = enEditExifTitle;
    } else if (lang === 'id') {
      data['landing.default.title.metadata'] = idMetadataTitle;
      data['landing.default.title.editexif'] = idEditExifTitle;
    } else {
      try {
        const res = await translate([enMetadataTitle, enEditExifTitle], { from: 'en', to: lang });
        const translatedMeta = Array.isArray(res) ? res[0].text : res.text;
        const translatedExif = Array.isArray(res) ? res[1].text : res.text;

        data['landing.default.title.metadata'] = translatedMeta.replace(/\s*\|\s*/g, ' - ');
        data['landing.default.title.editexif'] = translatedExif.replace(/\s*\|\s*/g, ' - ');
        console.log(`[${lang}] Metadata: "${data['landing.default.title.metadata']}", EXIF: "${data['landing.default.title.editexif']}"`);
      } catch (err) {
        console.error(`Error translating to ${lang}:`, err.message);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  }

  console.log('Finished updating tool titles!');
}

run();
