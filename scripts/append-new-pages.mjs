import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh-CN', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const localizedSlugs = {
  compress100kb: {
    en: "compress-image-to-100kb", id: "kompres-foto-100kb", es: "comprimir-imagen-a-100kb", fr: "compresser-image-100ko", 
    de: "bild-auf-100kb-komprimieren", ja: "gazo-asshuku-100kb", pt: "comprimir-imagem-100kb", ru: "szhat-izobrazhenie-100kb", 
    'zh-CN': "yasuo-tupian-100kb", zh: "yasuo-tupian-100kb", ar: "daght-sura-100kb", hi: "image-compress-100kb", 
    it: "comprimi-immagine-100kb", ko: "imiji-abchuk-100kb", nl: "afbeelding-comprimeren-100kb", tr: "resim-sikistir-100kb", 
    pl: "kompresja-obrazu-100kb", vi: "nen-anh-100kb", th: "bip-ad-rup-phap-100kb", sv: "komprimera-bild-100kb", 
    cs: "komprese-na-100kb", da: "komprimer-til-100kb", el: "sympiesi-se-100kb", fi: "pakkaa-100kb", 
    he: "dchisat-tmuna-100kb", hu: "kep-tomorites-100kb", no: "komprimer-til-100kb", ro: "comprimare-imagine-100kb", 
    sk: "kompresia-na-100kb", uk: "stysnuty-do-100kb", ms: "mampat-imej-100kb"
  },
  compress50kb: {
    en: "compress-image-to-50kb", id: "kompres-foto-50kb", es: "comprimir-imagen-a-50kb", fr: "compresser-image-50ko", 
    de: "bild-auf-50kb-komprimieren", ja: "gazo-asshuku-50kb", pt: "comprimir-imagem-50kb", ru: "szhat-izobrazhenie-50kb", 
    'zh-CN': "yasuo-tupian-50kb", zh: "yasuo-tupian-50kb", ar: "daght-sura-50kb", hi: "image-compress-50kb", 
    it: "comprimi-immagine-50kb", ko: "imiji-abchuk-50kb", nl: "afbeelding-comprimeren-50kb", tr: "resim-sikistir-50kb", 
    pl: "kompresja-obrazu-50kb", vi: "nen-anh-50kb", th: "bip-ad-rup-phap-50kb", sv: "komprimera-bild-50kb", 
    cs: "komprese-na-50kb", da: "komprimer-til-50kb", el: "sympiesi-se-50kb", fi: "pakkaa-50kb", 
    he: "dchisat-tmuna-50kb", hu: "kep-tomorites-50kb", no: "komprimer-til-50kb", ro: "comprimare-imagine-50kb", 
    sk: "kompresia-na-50kb", uk: "stysnuty-do-50kb", ms: "mampat-imej-50kb"
  },
  resizeig: {
    en: "resize-image-for-instagram", id: "ubah-ukuran-instagram", es: "redimensionar-para-instagram", fr: "redimensionner-pour-instagram", 
    de: "bild-fuer-instagram-skalieren", ja: "insutaguramu-ri-saizu", pt: "redimensionar-para-instagram", ru: "izmenit-razmer-dlya-instagram", 
    'zh-CN': "tiaozheng-ins-chicun", zh: "tiaozheng-ins-chicun", ar: "taghyir-hajm-instagram", hi: "instagram-image-resize", 
    it: "ridimensiona-per-instagram", ko: "inseuta-imiji-keugi", nl: "verkleinen-voor-instagram", tr: "instagram-icin-boyutlandir", 
    pl: "zmiana-rozmiaru-instagram", vi: "doi-kich-thuoc-instagram", th: "plian-kha-nad-ig", sv: "andra-storlek-for-instagram", 
    cs: "zmena-velikosti-instagram", da: "tilpas-til-instagram", el: "allagi-megethous-instagram", fi: "muuta-kokoa-instagram", 
    he: "shinui-godel-instagram", hu: "instagram-atmeretezes", no: "endre-storrelse-instagram", ro: "redimensionare-instagram", 
    sk: "zmena-velkosti-instagram", uk: "zminyty-rozmir-instagram", ms: "ubah-saiz-instagram"
  }
};

const jsonPath = path.join(__dirname, '..', 'src', 'data', 'translated_new_pages.json');
const engData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const tsPath = path.join(__dirname, '..', 'src', 'data', 'pseoKeywords.ts');
let tsContent = fs.readFileSync(tsPath, 'utf8');

// We need to parse out the old array and replace it. 
// The safest way is to find `export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig[] = [\n`
// and `\n];\n\nexport function getPSeoConfigBySlug`
const startMarker = `export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig[] = [`;
const endMarker = `];\n\n// Helper`;

const startIndex = tsContent.indexOf(startMarker);
const endIndex = tsContent.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find array bounds in pseoKeywords.ts");
  process.exit(1);
}

// Extract old array content and parse it via eval (since it's a JS object)
const oldArrayString = tsContent.substring(startIndex + startMarker.length, endIndex);
let oldArray;
try {
  oldArray = eval(`[${oldArrayString}]`);
} catch (e) {
  console.error("Failed to parse old array", e);
  process.exit(1);
}

// Remove old compress100kb entries
const filteredArray = oldArray.filter(item => item.tool !== 'compress100kb' && item.tool !== 'compress50kb' && item.tool !== 'resizeig');

// Add new duplicated items
const newItems = [];
engData.forEach(baseConfig => {
  langs.forEach(lang => {
    newItems.push({
      ...baseConfig,
      slug: localizedSlugs[baseConfig.tool][lang] || localizedSlugs[baseConfig.tool]['en'],
      lang: lang
    });
  });
});

const finalArray = [...filteredArray, ...newItems];
const newArrayString = JSON.stringify(finalArray, null, 2);

const newTsContent = tsContent.substring(0, startIndex) + 
  startMarker + '\n' + 
  newArrayString.substring(1, newArrayString.length - 1) + 
  '\n' + tsContent.substring(endIndex);

fs.writeFileSync(tsPath, newTsContent, 'utf8');
console.log("Successfully appended new pages to pseoKeywords.ts");
