import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'lingva-scraper';
const { lingva } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const keysToTranslate = {
  // WATERMARK REDESIGN
  "landing.watermark.redesign.heroBadge": "BRAND PROTECTION",
  "landing.watermark.redesign.heroTitle": "Protect Your Work.",
  "landing.watermark.redesign.heroTitle2": "Build Your Identity.",
  "landing.watermark.redesign.heroDesc": "Apply highly customizable watermarks to protect your intellectual property. Add text or logo overlays with precise control over opacity, positioning, and blending modes.",
  "landing.watermark.redesign.feat1Title": "Non-Destructive Layering",
  "landing.watermark.redesign.feat1Desc": "Add multiple watermark layers without altering your original image data. Easy to position, scale, and rotate.",
  "landing.watermark.redesign.feat2Title": "Opacity & Blending Control",
  "landing.watermark.redesign.feat2Desc": "Fine-tune the transparency of your text or logo. Choose advanced blending modes to make your watermark subtle yet impossible to remove.",
  "landing.watermark.redesign.feat3Title": "Tiled Pattern Mode",
  "landing.watermark.redesign.feat3Desc": "Automatically repeat your watermark across the entire image in a grid pattern. Ultimate protection against unauthorized cropping.",
  "landing.watermark.redesign.stepsTag": "WORKFLOW",
  "landing.watermark.redesign.stepsTitle": "Protect in 3 Steps",
  "landing.watermark.redesign.s1Title": "Upload",
  "landing.watermark.redesign.s1Desc": "Load your original photos securely into the browser.",
  "landing.watermark.redesign.s2Title": "Stamp",
  "landing.watermark.redesign.s2Desc": "Apply your custom text or logo watermark with styling.",
  "landing.watermark.redesign.s3Title": "Export",
  "landing.watermark.redesign.s3Desc": "Save the protected images instantly to your device.",
  
  // BLURFACE REDESIGN
  "landing.blurface.redesign.heroBadge": "ULTIMATE PRIVACY",
  "landing.blurface.redesign.heroTitle": "Censor with AI.",
  "landing.blurface.redesign.heroTitle2": "Protect Identities.",
  "landing.blurface.redesign.heroDesc": "Automatically detect and blur faces, license plates, or sensitive information in seconds. 100% private, running entirely within your browser.",
  "landing.blurface.redesign.feat1Title": "Face Detection",
  "landing.blurface.redesign.feat1Desc": "Our local AI model automatically finds and highlights faces in your photos with incredible accuracy.",
  "landing.blurface.redesign.feat2Title": "Smart Blurring",
  "landing.blurface.redesign.feat2Desc": "Apply beautiful gaussian blurs, pixelation, or solid color blocks to obscure sensitive regions permanently.",
  "landing.blurface.redesign.feat3Title": "Manual Override",
  "landing.blurface.redesign.feat3Desc": "Need to hide a license plate or a document? Use our manual selection tools to blur any specific area.",
  "landing.blurface.redesign.stepsTag": "HOW IT WORKS",
  "landing.blurface.redesign.stepsTitle": "Anonymize in 3 Steps",
  "landing.blurface.redesign.s1Title": "Upload",
  "landing.blurface.redesign.s1Desc": "Drop photos safely into the browser.",
  "landing.blurface.redesign.s2Title": "Detect",
  "landing.blurface.redesign.s2Desc": "Let AI find and select faces automatically.",
  "landing.blurface.redesign.s3Title": "Save",
  "landing.blurface.redesign.s3Desc": "Download the anonymized photos.",

  // CONVERT REDESIGN
  "landing.convert.redesign.heroBadge": "UNIVERSAL COMPATIBILITY",
  "landing.convert.redesign.heroTitle": "Format Transformer.",
  "landing.convert.redesign.heroTitle2": "Zero Quality Loss.",
  "landing.convert.redesign.heroDesc": "Seamlessly convert between WebP, PNG, JPG, and AVIF. Extremely fast bulk processing running entirely on your local machine.",
  "landing.convert.redesign.feat1Title": "Lightning Fast",
  "landing.convert.redesign.feat1Desc": "Transform huge WebP files into universal JPGs instantly, utilizing the full processing power of your device.",
  "landing.convert.redesign.feat2Title": "Bulk Processing",
  "landing.convert.redesign.feat2Desc": "Need to convert 500 images? Just drag and drop the entire folder. We handle unlimited batch conversions effortlessly.",
  "landing.convert.redesign.feat3Title": "Broad Support",
  "landing.convert.redesign.feat3Desc": "Full support for next-gen formats like WebP alongside classic formats like JPG, PNG, and BMP.",
  "landing.convert.redesign.stepsTag": "WORKFLOW",
  "landing.convert.redesign.stepsTitle": "Convert in 3 Steps",
  "landing.convert.redesign.s1Title": "Upload",
  "landing.convert.redesign.s1Desc": "Drag and drop your images or folders into the workspace.",
  "landing.convert.redesign.s2Title": "Format",
  "landing.convert.redesign.s2Desc": "Select your desired output format from the dropdown menu.",
  "landing.convert.redesign.s3Title": "Export",
  "landing.convert.redesign.s3Desc": "Click export and get your newly formatted files instantly.",

  // WATERMARK FAQS
  "landing.watermark.faq1.q": "Can I watermark multiple photos?",
  "landing.watermark.faq1.a": "Yes! Our batch processing makes it fast and easy to watermark hundreds of photos at once.",
  "landing.watermark.faq2.q": "Are my original photos safe?",
  "landing.watermark.faq2.a": "Yes, the process is 100% private and local. We never store or upload your images to our servers.",
  "landing.watermark.faq3.q": "Can I use my own logo?",
  "landing.watermark.faq3.a": "Absolutely. You can upload custom PNG logos or use text watermarks with custom fonts.",
  "landing.watermark.faq4.q": "Is there a limit to how many photos I can process?",
  "landing.watermark.faq4.a": "No limits! Since it runs on your device, you can process as many photos as you want for free.",

  // BLURFACE FAQS
  "landing.blurface.faq1.q": "Does it detect multiple faces?",
  "landing.blurface.faq1.a": "Yes, our local AI model can detect and blur multiple faces in a single photo very fast.",
  "landing.blurface.faq2.q": "Is the face detection private?",
  "landing.blurface.faq2.a": "100% private. The AI model runs directly in your browser. No photos of faces are ever uploaded to any server.",
  "landing.blurface.faq3.q": "Do I have to pay to use the AI?",
  "landing.blurface.faq3.a": "No, our AI blur tool is completely free. We don't charge for AI processing because it uses your device's power.",
  "landing.blurface.faq4.q": "Is it easy to adjust the blur intensity?",
  "landing.blurface.faq4.a": "Yes, you have full control over the blur radius and can easily toggle which faces to blur or unblur.",

  // CONVERT FAQS
  "landing.convert.faq1.q": "What formats are supported?",
  "landing.convert.faq1.a": "We support converting between WebP, PNG, JPEG, and more. It's easy to switch formats instantly.",
  "landing.convert.faq2.q": "Is the conversion fast?",
  "landing.convert.faq2.a": "Extremely fast. By using WebAssembly locally, conversions happen in milliseconds without waiting for server uploads.",
  "landing.convert.faq3.q": "Is this tool free for bulk conversion?",
  "landing.convert.faq3.a": "Yes! You can bulk convert hundreds of images for free without any restrictions.",
  "landing.convert.faq4.q": "Are my converted files private?",
  "landing.convert.faq4.a": "Completely private. Everything happens directly inside your own browser window."
};

const keys = Object.keys(keysToTranslate);
const originalStrings = keys.map(k => keysToTranslate[k]);
const SEPARATOR = ' ||| ';

const delay = ms => new Promise(res => setTimeout(res, ms));

async function run() {
  console.log('Starting Lingva translation for WBC tools...');
  for (const lang of languages) {
    if (lang === 'en') {
      const filePath = path.join(localesDir, lang, 'translation.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      Object.assign(data, keysToTranslate);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log('Updated [en] directly.');
      continue;
    }
    
    // We already have translations in data-wbc-1.js for th, vi, tr, nl, it, pl.
    // Let's use Lingva for everything just to be consistent, since it supports up to ~5000 chars and our combined is less.
    const chunks = [];
    const chunkSize = 20;
    for (let i = 0; i < originalStrings.length; i += chunkSize) {
      chunks.push(originalStrings.slice(i, i + chunkSize));
    }
    
    let allTranslatedStrings = [];
    let success = true;
    
    console.log(`Translating [${lang}] in ${chunks.length} chunks...`);
    for (const chunk of chunks) {
      const combinedText = chunk.join(SEPARATOR);
      try {
        const res = await lingva(combinedText, 'en', lang);
        // split back
        const translatedArray = res.text.split(SEPARATOR).map(s => s.trim());
        if (translatedArray.length === chunk.length) {
            allTranslatedStrings = allTranslatedStrings.concat(translatedArray);
        } else {
            console.error(`  [${lang}] chunk split length mismatch! Expected ${chunk.length}, got ${translatedArray.length}`);
            // Fallback for this chunk
            allTranslatedStrings = allTranslatedStrings.concat(chunk); // Just keep english
        }
      } catch (err) {
        console.error(`  [${lang}] chunk translation failed: ${err.message}`);
        allTranslatedStrings = allTranslatedStrings.concat(chunk); // Keep english on failure
        success = false;
      }
      
      await delay(1500); // Wait between chunks
    }
    
    if (allTranslatedStrings.length === keys.length) {
      const filePath = path.join(localesDir, lang, 'translation.json');
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = allTranslatedStrings[i];
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Saved translations for [${lang}]`);
    } else {
      console.log(`Failed to properly map translations for [${lang}]`);
    }
  }
}

run().catch(console.error);
