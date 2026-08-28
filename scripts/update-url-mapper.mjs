import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urlMapperPath = path.join(__dirname, '..', 'src', 'utils', 'urlMapper.ts');
let content = fs.readFileSync(urlMapperPath, 'utf8');

// 1. Add FALLBACK_SLUGS
if (!content.includes('compress50kb:')) {
  content = content.replace(
    /compress100kb: 'compress-image-to-100kb',/g,
    "compress100kb: 'compress-image-to-100kb',\n  compress50kb: 'compress-image-to-50kb',\n  resizeig: 'resize-image-for-instagram',"
  );
}

// 2. Add to getToolFromSlug
if (!content.includes("if (slug === 'compress-image-to-50kb') return 'compress50kb';")) {
  content = content.replace(
    /if \(slug === 'compress-image-to-100kb'\) return 'compress100kb';/g,
    "if (slug === 'compress-image-to-100kb') return 'compress100kb';\n  if (slug === 'compress-image-to-50kb') return 'compress50kb';\n  if (slug === 'resize-image-for-instagram') return 'resizeig';"
  );
}

// 3. Add to SLUG_MAP
const localizedSlugs = {
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

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('compress100kb:') && !lines[i].includes('compress50kb:')) {
    const langMatch = lines[i].match(/^\s*([a-zA-Z-]+):/);
    if (langMatch) {
      const lang = langMatch[1];
      const c50 = localizedSlugs.compress50kb[lang] || localizedSlugs.compress50kb['en'];
      const rig = localizedSlugs.resizeig[lang] || localizedSlugs.resizeig['en'];
      lines[i] = lines[i].replace(' }', `, compress50kb: '${c50}', resizeig: '${rig}' }`);
      lines[i] = lines[i].replace(' },', `, compress50kb: '${c50}', resizeig: '${rig}' },`);
    }
  }
}

fs.writeFileSync(urlMapperPath, lines.join('\n'), 'utf8');
console.log("urlMapper.ts updated");
