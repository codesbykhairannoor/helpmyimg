import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh-CN', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const bases = [
  {
    tool: 'removelogo',
    slugEn: 'remove-background-from-logo',
    title: "Remove Background from Logo Free - Transparent PNG Maker",
    h1: "Make Any Logo Transparent Instantly",
    description: "Extract your logo from solid backgrounds perfectly. Create transparent PNG logos for your website, videos, and presentations in 1 click.",
    citationFirst: "Tired of ugly white boxes around your logo? Our specialized AI is trained specifically on graphic design and typography to cut out logos with perfect edge precision, even on intricate text.",
    quantitativeProof: "Trusted by 50,000+ businesses to clean up their branding assets.",
    beforeImageLabel: "Logo with White BG",
    afterImageLabel: "Transparent PNG Logo",
    extraSectionTitle: "Why You Need a Transparent Logo",
    extraSectionDesc: "A logo with a solid background looks unprofessional when placed on colored websites or videos.",
    extraSectionItems: [
      "Watermarking Videos & Photos",
      "Professional Website Headers",
      "Company Pitch Decks & Presentations"
    ],
    extraSection2Title: "Step-by-step Guide to Transparent Logos",
    extraSection2Desc: "You don't need Photoshop anymore. Just follow these quick steps.",
    extraSection2Items: [
      "Upload your JPG/PNG logo with a solid background.",
      "Our AI automatically detects the logo mark and typography.",
      "Download the transparent PNG instantly."
    ],
    faqs: [
      { q: "Can it handle complex logo text?", a: "Yes, our algorithm excels at preserving sharp edges around typography and intricate brand marks." },
      { q: "What format will my logo be saved in?", a: "Your transparent logo will be exported as a high-quality PNG file, which supports alpha channels (transparency)." },
      { q: "Is it free for commercial use?", a: "Absolutely. You retain all rights to your processed images, and we don't store your logos." }
    ]
  },
  {
    tool: 'colorwhite',
    slugEn: 'change-photo-background-to-white',
    title: "Change Photo Background to White - Amazon & E-commerce Ready",
    h1: "Pure White Backgrounds in Seconds",
    description: "Automatically remove messy backgrounds and replace them with pure #FFFFFF white. Perfect for Amazon, Shopee, and product photography.",
    citationFirst: "E-commerce platforms like Amazon and eBay strictly require pure white backgrounds for product listings. Our tool automates the cutout and applies the exact #FFFFFF hex code instantly.",
    quantitativeProof: "Sellers using white backgrounds see a 45% increase in conversion rates.",
    beforeImageLabel: "Living Room Photo",
    afterImageLabel: "Pure White #FFFFFF",
    extraSectionTitle: "Boost Your E-Commerce Sales",
    extraSectionDesc: "Consistent, distraction-free product photos build trust and drive sales.",
    extraSectionItems: [
      "Amazon & Shopify Compliance",
      "Professional Catalog Consistency",
      "Higher CTR on Shopping Ads"
    ],
    extraSection2Title: "Why Pure #FFFFFF Matters",
    extraSection2Desc: "Marketplaces reject non-compliant images. Here's what we guarantee:",
    extraSection2Items: [
      "No grey borders or off-white tints.",
      "Perfectly preserved natural shadows.",
      "Zero pixelation on product edges."
    ],
    faqs: [
      { q: "Is the background pure white or just light grey?", a: "It is exactly pure white (Hex code #FFFFFF), meeting the strict requirements of major online marketplaces." },
      { q: "Does it work well with shadows?", a: "Yes! While we replace the background with white, the AI intelligently retains or reconstructs natural product shadows." },
      { q: "Can I do batch processing?", a: "Yes, you can drop up to 10 photos at once and our local AI will process all of them into white backgrounds." }
    ]
  },
  {
    tool: 'compress200kb',
    slugEn: 'compress-image-to-200kb',
    title: "Compress Image to 200KB - High Quality Reducer",
    h1: "Shrink Photos to 200KB Without Losing Detail",
    description: "Compress heavy 10MB images down to 200KB. Ideal for online applications, forums, and fast-loading web pages.",
    citationFirst: "200KB is the sweet spot between tiny file sizes and high visual fidelity. Unlike 50KB limits, 200KB allows you to retain crisp textures and high-resolution details while still saving massive bandwidth.",
    quantitativeProof: "A 200KB image loads 8x faster on 3G connections than a standard 2MB photo.",
    beforeImageLabel: "Raw Photo 8MB",
    afterImageLabel: "Optimized 195KB",
    extraSectionTitle: "200KB vs 50KB: Which do you need?",
    extraSectionDesc: "Understanding compression targets helps you balance quality and rules.",
    extraSectionItems: [
      "200KB: Best for Blogs, Portfolios, and Forums (Retains great detail).",
      "100KB: Standard limit for general application forms.",
      "50KB: Strict limit for government IDs and signatures."
    ],
    extraSection2Title: "How We Retain Quality at 200KB",
    extraSection2Desc: "Our smart compressor balances bitrate and dimensions intelligently.",
    extraSection2Items: [
      "WebGPU accelerated processing for faster speeds.",
      "Smart chroma subsampling to reduce size, not sharpness.",
      "Automatic EXIF metadata removal."
    ],
    faqs: [
      { q: "How is 200KB compression different from others?", a: "Since 200KB gives the algorithm more breathing room, we preserve 4x more color data and sharper edges compared to our 50KB tool." },
      { q: "Will my image dimensions shrink?", a: "Only if necessary. We prioritize lowering the JPEG/WEBP bitrate first. If it's a massive 4K image, we dynamically downscale it to fit the 200KB footprint." },
      { q: "Is my privacy protected?", a: "Yes, 100%. The compression happens right in your web browser via WebAssembly. Nothing is uploaded to our servers." }
    ]
  },
  {
    tool: 'resizepassport',
    slugEn: 'resize-photo-to-passport-size',
    title: "Resize Photo to Passport Size - Visa & ID Maker",
    h1: "Make Passport Size Photos Instantly",
    description: "Crop and resize your photo to standard 2x2 inch or 35x45mm passport sizes for visas, IDs, and official documents.",
    citationFirst: "Getting rejected for incorrect photo dimensions is frustrating. Our tool accurately crops your photo to international passport standards (like 2x2 inch for US or 35x45mm for UK/EU) with perfect head positioning.",
    quantitativeProof: "Guaranteed compliance with over 50+ country passport specifications.",
    beforeImageLabel: "Selfie Image",
    afterImageLabel: "2x2 Passport Format",
    extraSectionTitle: "Global Passport Size Standards",
    extraSectionDesc: "Different countries have different dimension rules. Our tool helps you meet them easily.",
    extraSectionItems: [
      "United States & India: 2 x 2 inches (51 x 51 mm)",
      "UK, Europe, Australia, Schengen: 35 x 45 mm",
      "Japan Visas: 35 x 45 mm or 2 x 2 inches depending on type"
    ],
    extraSection2Title: "Checklist for a Perfect Passport Photo",
    extraSection2Desc: "Ensure your photo won't get rejected by following these strict guidelines:",
    extraSection2Items: [
      "Keep a neutral facial expression with both eyes open.",
      "Ensure uniform lighting without harsh shadows.",
      "Do not wear glasses, hats, or head coverings (unless religious)."
    ],
    faqs: [
      { q: "Does this tool automatically detect my face?", a: "Yes, you can manually adjust the crop box to ensure your head meets the 70-80% frame coverage required by most countries." },
      { q: "Can it change my background to white or blue?", a: "Absolutely! Since this is an all-in-one suite, you can use the 'Change Background' tool right after resizing to get a perfect white or blue backdrop." },
      { q: "What resolution does it export?", a: "We export at a high 300 DPI resolution, which is required for printing passport photos at pharmacies or print shops." }
    ]
  }
];

async function safeTranslate(text, lang) {
  if (lang === 'en') return text;
  
  // Special translation for URL slugs
  if (text.includes('-')) {
    try {
       const readableText = text.replace(/-/g, ' ');
       const res = await translate(readableText, { to: lang });
       let slug = res.text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
       if (!slug) slug = text; // fallback
       return slug;
    } catch(e) {
       return text;
    }
  }

  try {
    const res = await translate(text, { to: lang });
    return res.text;
  } catch (err) {
    console.error(`Error translating to ${lang}:`, err.message);
    return text; // fallback to original
  }
}

async function generate() {
  let allConfigs = [];
  let urlMapCode = {};
  bases.forEach(b => urlMapCode[b.tool] = {});
  
  for (const base of bases) {
    console.log(`\n--- Processing ${base.tool} ---`);
    for (const lang of langs) {
      console.log(` Translating ${base.tool} to ${lang}...`);
      const translateLang = lang === 'zh' ? 'zh-CN' : lang;
      
      const localizedSlug = await safeTranslate(base.slugEn, translateLang);
      urlMapCode[base.tool][lang] = localizedSlug;

      let config = {
        slug: localizedSlug,
        tool: base.tool,
        lang: lang,
        title: await safeTranslate(base.title, translateLang),
        h1: await safeTranslate(base.h1, translateLang),
        description: await safeTranslate(base.description, translateLang),
        citationFirst: await safeTranslate(base.citationFirst, translateLang),
        quantitativeProof: await safeTranslate(base.quantitativeProof, translateLang),
        beforeImageLabel: await safeTranslate(base.beforeImageLabel, translateLang),
        afterImageLabel: await safeTranslate(base.afterImageLabel, translateLang),
        extraSectionTitle: await safeTranslate(base.extraSectionTitle, translateLang),
        extraSectionDesc: await safeTranslate(base.extraSectionDesc, translateLang),
        extraSectionItems: await Promise.all(base.extraSectionItems.map(item => safeTranslate(item, translateLang))),
        extraSection2Title: await safeTranslate(base.extraSection2Title, translateLang),
        extraSection2Desc: await safeTranslate(base.extraSection2Desc, translateLang),
        extraSection2Items: await Promise.all(base.extraSection2Items.map(item => safeTranslate(item, translateLang))),
        faqs: await Promise.all(base.faqs.map(async faq => ({
          question: await safeTranslate(faq.q, translateLang),
          answer: await safeTranslate(faq.a, translateLang)
        })))
      };

      allConfigs.push(config);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'translated_4_pages.json');
  fs.writeFileSync(outputPath, JSON.stringify(allConfigs, null, 2), 'utf8');
  console.log(`\n✅ Saved ${allConfigs.length} items to ${outputPath}`);

  const mapPath = path.join(__dirname, '..', 'src', 'data', 'urlmap_4_pages.json');
  fs.writeFileSync(mapPath, JSON.stringify(urlMapCode, null, 2), 'utf8');
  console.log(`\n✅ Saved URL Mappings to ${mapPath}`);
}

generate();
