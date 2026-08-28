const translate = require('google-translate-api-x');
const fs = require('fs');

const languages = ['id', 'ar', 'bg', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hi', 'hu', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tl', 'tr', 'uk', 'vi', 'zh'];

const baseline = {
  title: "Compress Image to 100KB Online Free (AI Quality)",
  h1: "Compress Photo to 100KB Instantly for Documents",
  description: "Reduce image file size to exactly 100KB or 200KB without losing visible quality. 100% private, works offline in your browser. Perfect for official forms.",
  citationFirst: "Need to compress an image to exactly 100KB for an official government form or application? Our client-side WebGPU tool shrinks your photos to the required size limit instantly without uploading your sensitive ID or passport to any servers. 100% free and private.",
  quantitativeProof: "By processing locally, you save 100% of bandwidth and reduce file sizes by up to 95% in just 0.5 seconds per image.",
  beforeImageLabel: "Original 5MB Photo",
  afterImageLabel: "Compressed 98KB Result",
  faq1Q: "Is it safe to compress my ID card or passport here?",
  faq1A: "Yes, 100% safe. This tool works entirely offline inside your browser after it loads. Your sensitive documents are never uploaded to our servers.",
  faq2Q: "Will my photo lose quality if compressed to 100KB?",
  faq2A: "Our AI algorithm finds the perfect balance between compression and quality, ensuring your face and text remain perfectly readable for official requirements."
};

const slugMap = {
  en: 'compress-image-to-100kb',
  ar: 'daght-sura-100kb',
  bg: 'kompresirane-100kb',
  cs: 'komprese-na-100kb',
  da: 'komprimer-til-100kb',
  de: 'bild-auf-100kb-komprimieren',
  el: 'sympiesi-se-100kb',
  es: 'comprimir-imagen-a-100kb',
  fi: 'pakkaa-100kb',
  fr: 'compresser-image-100ko',
  he: 'dchisat-tmuna-100kb',
  hi: 'image-compress-100kb',
  hu: 'kep-tomorites-100kb',
  id: 'kompres-foto-100kb',
  it: 'comprimi-immagine-100kb',
  ja: 'gazo-asshuku-100kb',
  ko: 'imiji-abchuk-100kb',
  ms: 'mampat-imej-100kb',
  nl: 'afbeelding-comprimeren-100kb',
  no: 'komprimer-til-100kb',
  pl: 'kompresja-obrazu-100kb',
  pt: 'comprimir-imagem-100kb',
  ro: 'comprimare-imagine-100kb',
  ru: 'szhat-izobrazhenie-100kb',
  sv: 'komprimera-bild-100kb',
  th: 'bip-ad-rup-phap-100kb',
  tl: 'i-compress-larawan-100kb',
  tr: 'resim-sikistir-100kb',
  uk: 'stysnuty-do-100kb',
  vi: 'nen-anh-100kb',
  zh: 'yasuo-tupian-100kb'
};

async function generate() {
  const results = [];
  
  // Add EN baseline manually
  results.push({
    slug: slugMap['en'],
    tool: 'compress100kb', // using compress100kb as requested
    lang: 'en',
    title: baseline.title,
    h1: baseline.h1,
    description: baseline.description,
    citationFirst: baseline.citationFirst,
    quantitativeProof: baseline.quantitativeProof,
    beforeImageLabel: baseline.beforeImageLabel,
    afterImageLabel: baseline.afterImageLabel,
    faqs: [
      { question: baseline.faq1Q, answer: baseline.faq1A },
      { question: baseline.faq2Q, answer: baseline.faq2A }
    ]
  });

  for (const lang of languages) {
    if (lang === 'en') continue;
    try {
      console.log(`Translating to ${lang}...`);
      const res = await translate([
        baseline.title,
        baseline.h1,
        baseline.description,
        baseline.citationFirst,
        baseline.quantitativeProof,
        baseline.beforeImageLabel,
        baseline.afterImageLabel,
        baseline.faq1Q,
        baseline.faq1A,
        baseline.faq2Q,
        baseline.faq2A
      ], { to: lang === 'zh' ? 'zh-CN' : lang, forceBatch: false });

      results.push({
        slug: slugMap[lang],
        tool: 'compress100kb',
        lang: lang,
        title: res[0].text,
        h1: res[1].text,
        description: res[2].text,
        citationFirst: res[3].text,
        quantitativeProof: res[4].text,
        beforeImageLabel: res[5].text,
        afterImageLabel: res[6].text,
        faqs: [
          { question: res[7].text, answer: res[8].text },
          { question: res[9].text, answer: res[10].text }
        ]
      });
      // sleep to avoid rate limits
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(`Error translating ${lang}:`, e.message);
    }
  }

  fs.writeFileSync('translated_seo.json', JSON.stringify(results, null, 2));
  console.log("Done!");
}

generate();
