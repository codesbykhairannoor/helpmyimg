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
    tool: 'removeperson',
    slugEn: 'remove-person-from-photo',
    title: "Remove Person from Photo - Free Photobomb Eraser",
    h1: "Erase People & Photobombers Instantly",
    description: "Remove exes, strangers, and photobombers from your pictures using AI. The background is magically reconstructed seamlessly.",
    citationFirst: "Unlike traditional clone stamp tools, our AI inpainting model understands the context of the background (like brick walls, beaches, or grass) and flawlessly reconstructs what was behind the person.",
    quantitativeProof: "Save 30+ minutes of manual Photoshop work per image.",
    beforeImageLabel: "With Photobomber",
    afterImageLabel: "Person Removed",
    extraSectionTitle: "Why AI Inpainting is Better",
    extraSectionDesc: "Old tools just smudge pixels. AI actually draws missing details.",
    extraSectionItems: [
      "Context-Aware Reconstruction",
      "No Blurry Smudges",
      "Works on Complex Textures"
    ],
    extraSection2Title: "Perfect for Every Situation",
    extraSection2Desc: "Who do you need to remove today?",
    extraSection2Items: [
      "Erase Ex-Partners from Memories",
      "Remove Tourists from Landmarks",
      "Clean Up Real Estate Photos"
    ],
    faqs: [
      { question: "Will it leave a blurry spot where the person was?", answer: "No, our generative AI intelligently fills in the gap by analyzing the surrounding textures to make it look like they were never there." },
      { question: "Can I remove multiple people at once?", answer: "Yes, you can brush over as many people as you want before hitting 'Remove'." },
      { question: "Is my photo uploaded to the cloud?", answer: "We prioritize your privacy. The heavy lifting is done locally or instantly discarded from our temporary processing nodes." }
    ]
  },
  {
    tool: 'convertwebp',
    slugEn: 'convert-webp-to-jpg',
    title: "Convert WEBP to JPG Free - Image Converter",
    h1: "Fastest WEBP to JPG Converter",
    description: "Batch convert WEBP images to universally compatible JPG format. Drag and drop, no limits, and 100% free.",
    citationFirst: "WEBP is great for web speed, but many legacy software, older smartphones, and email clients still don't support it. Converting to JPG ensures 100% compatibility everywhere.",
    quantitativeProof: "Convert up to 50 images in under 3 seconds using our WebAssembly local engine.",
    beforeImageLabel: "WEBP Format",
    afterImageLabel: "JPG Format",
    extraSectionTitle: "WEBP vs JPG: When to use which?",
    extraSectionDesc: "Understand the technical differences between these two formats.",
    extraSectionItems: [
      "WEBP: Best for Web Design & SEO (Smaller Size)",
      "JPG: Best for Printing & Sharing (Universal Compatibility)",
      "JPG: Required by some Government & Exam Portals"
    ],
    extraSection2Title: "Why Use Our Converter?",
    extraSection2Desc: "We don't just change the extension, we re-encode properly.",
    extraSection2Items: [
      "Preserves original color profiles",
      "Maintains EXIF metadata",
      "Zero server uploads (Local Processing)"
    ],
    faqs: [
      { question: "Does converting WEBP to JPG reduce quality?", answer: "Our converter defaults to 92% quality, which perfectly balances preserving visual fidelity while keeping file sizes small." },
      { question: "Is there a file size limit?", answer: "No limits! Since all conversion happens directly inside your web browser via JavaScript, you can convert huge files without uploading anything." },
      { question: "Can I convert back to WEBP?", answer: "Yes, our universal converter tool allows you to swap formats in any direction you need." }
    ]
  },
  {
    tool: 'watermarkbulk',
    slugEn: 'batch-watermark-photos',
    title: "Batch Watermark Photos - Bulk Logo Adder",
    h1: "Watermark Hundreds of Photos at Once",
    description: "Add your logo or text watermark to multiple images simultaneously. Protect your photography portfolio in seconds.",
    citationFirst: "Protecting your intellectual property shouldn't take hours. With our batch processing engine, you can position your logo once, set the opacity, and apply it to a whole folder of images instantly.",
    quantitativeProof: "Watermarking 100 photos takes only 1.2 seconds in-browser.",
    beforeImageLabel: "Unprotected Portfolio",
    afterImageLabel: "Branded & Protected",
    extraSectionTitle: "Professional Workflow Tools",
    extraSectionDesc: "Built for photographers and digital creators.",
    extraSectionItems: [
      "Smart Auto-Scaling for Different Resolutions",
      "Custom Opacity & Blending Modes",
      "Tiled Watermark Pattern for Maximum Security"
    ],
    extraSection2Title: "Why You Must Protect Your Images",
    extraSection2Desc: "Image theft is rampant online. Don't be a victim.",
    extraSection2Items: [
      "Prevents AI Models from scraping your work",
      "Deters unauthorized commercial use",
      "Builds brand recognition when shared"
    ],
    faqs: [
      { question: "Can I use my own custom logo as a watermark?", answer: "Absolutely. You can upload any PNG with transparency or create a simple text watermark directly in the tool." },
      { question: "Will the watermark size stay consistent across different image sizes?", answer: "Yes, our auto-scaling feature ensures your watermark occupies the same relative percentage of the frame, regardless of if the photo is 1080p or 4K." },
      { question: "Do you keep copies of my watermarked photos?", answer: "Never. The entire batch process happens client-side in your device's memory." }
    ]
  },
  {
    tool: 'blurplate',
    slugEn: 'blur-license-plate',
    title: "Blur License Plate Online - Auto Privacy Censor",
    h1: "Censor Car License Plates Quickly",
    description: "Hide and blur license plates before selling your car or posting on social media. Protect your privacy with a single click.",
    citationFirst: "Leaving your license plate visible online exposes your personal registration address and increases the risk of identity theft or vehicle cloning. Blurring it is the #1 rule of selling a car online.",
    quantitativeProof: "Over 75% of car marketplaces recommend obscuring plates before publishing.",
    beforeImageLabel: "Exposed Plate",
    afterImageLabel: "Blurred Privacy",
    extraSectionTitle: "Why 100% Offline Processing Matters",
    extraSectionDesc: "Don't send your sensitive photos to random servers.",
    extraSectionItems: [
      "Military-grade Privacy (Zero Uploads)",
      "Instant Processing Speed",
      "No Data Retention"
    ],
    extraSection2Title: "Types of Censors Available",
    extraSection2Desc: "Choose how you want to hide your information.",
    extraSection2Items: [
      "Gaussian Blur (Smooth & Professional)",
      "Pixelation / Mosaic (Classic Censor)",
      "Solid Black Box (Maximum Security)"
    ],
    faqs: [
      { question: "Can the blur be reversed or un-blurred by someone else?", answer: "No. Once you apply a Gaussian blur or Pixelation and download the image, the original pixels are destroyed. It is mathematically impossible to reverse." },
      { question: "Can I blur multiple cars in the same photo?", answer: "Yes, you can draw multiple blur boxes over different license plates or even faces in the background." },
      { question: "Does it work on mobile?", answer: "Yes, our touch-friendly interface allows you to pinch and zoom to blur plates right from your smartphone browser." }
    ]
  }
];

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function generate() {
  let allConfigs = [];
  let urlMapCode = {};
  bases.forEach(b => urlMapCode[b.tool] = {});
  
  for (const base of bases) {
    console.log(`\n--- Processing ${base.tool} ---`);
    for (const lang of langs) {
      console.log(` Translating ${base.tool} to ${lang}...`);
      if (lang === 'en') {
        urlMapCode[base.tool][lang] = base.slugEn;
        allConfigs.push({ ...base, lang: 'en', slug: base.slugEn });
        continue;
      }

      const translateLang = lang === 'zh' ? 'zh-CN' : lang;
      
      const textArray = [
        base.slugEn.replace(/-/g, ' '),
        base.title,
        base.h1,
        base.description,
        base.citationFirst,
        base.quantitativeProof,
        base.beforeImageLabel,
        base.afterImageLabel,
        base.extraSectionTitle,
        base.extraSectionDesc,
        ...base.extraSectionItems,
        base.extraSection2Title,
        base.extraSection2Desc,
        ...base.extraSection2Items,
        ...base.faqs.flatMap(f => [f.question, f.answer])
      ];

      try {
        const resArray = await translate(textArray, { to: translateLang, rejectOnPartialFail: false, forceBatch: false });
        const texts = resArray.map((res, i) => res ? res.text : textArray[i]);

        let slug = texts[0].toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-');
        if (!slug) slug = base.slugEn;

        urlMapCode[base.tool][lang] = slug;

        let index = 1;
        const config = {
          slug,
          tool: base.tool,
          lang,
          title: texts[index++],
          h1: texts[index++],
          description: texts[index++],
          citationFirst: texts[index++],
          quantitativeProof: texts[index++],
          beforeImageLabel: texts[index++],
          afterImageLabel: texts[index++],
          extraSectionTitle: texts[index++],
          extraSectionDesc: texts[index++],
          extraSectionItems: [texts[index++], texts[index++], texts[index++]],
          extraSection2Title: texts[index++],
          extraSection2Desc: texts[index++],
          extraSection2Items: [texts[index++], texts[index++], texts[index++]],
          faqs: base.faqs.map(() => ({
             question: texts[index++],
             answer: texts[index++]
          }))
        };

        allConfigs.push(config);
      } catch (err) {
        console.error(`Error translating to ${lang}:`, err.message);
      }

      await delay(500);
    }
  }

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'translated_4_nonkb_pages.json');
  fs.writeFileSync(outputPath, JSON.stringify(allConfigs, null, 2), 'utf8');
  console.log(`\n✅ Saved ${allConfigs.length} items to ${outputPath}`);

  const mapPath = path.join(__dirname, '..', 'src', 'data', 'urlmap_4_nonkb_pages.json');
  fs.writeFileSync(mapPath, JSON.stringify(urlMapCode, null, 2), 'utf8');
  console.log(`\n✅ Saved URL Mappings to ${mapPath}`);
}

generate();
