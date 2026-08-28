import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh-CN', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

// Existing tool translations from URL map
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

const bases = [
  {
    tool: 'compress100kb',
    title: "Compress Image to 100KB Online Free - Fast & Private",
    h1: "Compress Any Image to 100KB Instantly",
    description: "Easily compress your JPG, PNG, and WEBP images to exactly 100KB or less without losing quality. 100% private, processed in your browser.",
    citationFirst: "Struggling with upload limits on government portals, job sites, or university forms? Our advanced client-side compressor reduces your image size precisely under 100KB while keeping text and faces crystal clear.",
    quantitativeProof: "Join 2M+ users who bypass 100KB form limits without pixelation.",
    beforeImageLabel: "Original 5MB",
    afterImageLabel: "Result 98KB",
    faqs: [
      { q: "How can I compress an image to exactly 100KB?", a: "Our tool automatically adjusts the quality slider and strips unnecessary metadata to push the file size below 100KB while preserving visual fidelity." },
      { q: "Is it safe to compress my passport photo here?", a: "Yes, it is 100% safe. Your images are never transmitted over the internet. Processing happens locally in your device's memory." },
      { q: "Will my image lose quality and become blurry?", a: "We use advanced algorithmic downsizing and smart compression. While file size drops drastically, we prioritize keeping critical details like text and faces highly readable." }
    ]
  },
  {
    tool: 'compress50kb',
    title: "Compress Image to 50KB - Smart WebGPU Compression",
    h1: "Shrink Photos to 50KB with AI Precision",
    description: "Hit the strictest 50KB limits for government and visa portals effortlessly. Compress images heavily without destroying the visual quality.",
    citationFirst: "When a portal demands a file under 50KB, traditional compressors often turn your photo into a blurry mess. We leverage WebGPU to selectively preserve edge fidelity, guaranteeing strict 50KB compliance without sacrificing readability.",
    quantitativeProof: "Compressing images to 50KB is 3x faster with local processing.",
    beforeImageLabel: "File 2.5MB",
    afterImageLabel: "Optimized 48KB",
    faqs: [
      { q: "Why is 50KB so hard to achieve with good quality?", a: "50KB leaves very little room for image data. Most tools just lower resolution bluntly. We optimize color quantization and metadata stripping to save space for actual pixels." },
      { q: "Which formats can be compressed to 50KB?", a: "You can upload JPG, JPEG, PNG, or WEBP. We generally output as a highly compressed WebP or JPG depending on which yields a better 50KB result." },
      { q: "Can I do this entirely offline?", a: "Yes! Once this page loads, you can turn off your internet. The 50KB compression algorithm runs 100% in your browser." }
    ]
  },
  {
    tool: 'resizeig',
    title: "Resize Image for Instagram Online - No Cropping Required",
    h1: "Perfect Instagram Sizes in 1 Click",
    description: "Instantly resize your photos for Instagram Posts, Stories, and Reels. Add beautiful blur borders to prevent awkward cropping.",
    citationFirst: "Don't let Instagram ruin your landscape photos with forced crops. Our tool automatically pads your image into the perfect 1:1, 4:5, or 9:16 aspect ratios using stunning blurred backgrounds.",
    quantitativeProof: "99% of top influencers use blur-padded borders for non-square photos.",
    beforeImageLabel: "Original Landscape",
    afterImageLabel: "Ready for Insta 4:5",
    faqs: [
      { q: "What is the best aspect ratio for Instagram?", a: "For posts, 4:5 (Portrait) is recommended as it occupies the most screen real estate. For Stories and Reels, use 9:16." },
      { q: "How do you prevent my photo from being cropped?", a: "Instead of cropping, we scale your photo to fit the canvas and fill the remaining empty space with a beautiful, seamless blurred version of your image." },
      { q: "Do you compress the image before uploading to IG?", a: "We export at the highest quality possible so Instagram's own aggressive compression algorithm has the best source data to work with." }
    ]
  }
];

async function generate() {
  let allConfigs = [];
  
  for (const base of bases) {
    console.log(`\n--- Processing ${base.tool} ---`);
    for (const lang of langs) {
      console.log(` Translating ${base.tool} to ${lang}...`);
      const translateLang = lang === 'zh' ? 'zh-CN' : lang;
      
      try {
        let config = {
          slug: localizedSlugs[base.tool][lang] || localizedSlugs[base.tool]['en'],
          tool: base.tool,
          lang: lang,
          title: base.title,
          h1: base.h1,
          description: base.description,
          citationFirst: base.citationFirst,
          quantitativeProof: base.quantitativeProof,
          beforeImageLabel: base.beforeImageLabel,
          afterImageLabel: base.afterImageLabel,
          faqs: base.faqs
        };

        if (lang !== 'en') {
          config.title = (await translate(base.title, { to: translateLang })).text;
          config.h1 = (await translate(base.h1, { to: translateLang })).text;
          config.description = (await translate(base.description, { to: translateLang })).text;
          config.citationFirst = (await translate(base.citationFirst, { to: translateLang })).text;
          config.quantitativeProof = (await translate(base.quantitativeProof, { to: translateLang })).text;
          config.beforeImageLabel = (await translate(base.beforeImageLabel, { to: translateLang })).text;
          config.afterImageLabel = (await translate(base.afterImageLabel, { to: translateLang })).text;
          
          config.faqs = await Promise.all(base.faqs.map(async (faq) => ({
            question: (await translate(faq.q, { to: translateLang })).text,
            answer: (await translate(faq.a, { to: translateLang })).text,
          })));
        } else {
          // Normalize FAQ key
          config.faqs = base.faqs.map(faq => ({ question: faq.q, answer: faq.a }));
        }

        allConfigs.push(config);
        
        // Delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 800));
      } catch (err) {
        console.error(`❌ Failed for ${lang}:`, err.message);
      }
    }
  }

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'translated_new_pages.json');
  fs.writeFileSync(outputPath, JSON.stringify(allConfigs, null, 2), 'utf8');
  console.log(`\n✅ Saved ${allConfigs.length} items to ${outputPath}`);
}

generate();
