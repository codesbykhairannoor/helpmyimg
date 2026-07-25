import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

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

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  console.log('Starting full translation for WBC and FAQs...');
  for (const lang of languages) {
    if (lang === 'en') {
      const translationFilePath = path.join(localesDir, lang, 'translation.json');
      const content = fs.readFileSync(translationFilePath, 'utf8');
      const json = JSON.parse(content);
      Object.assign(json, keysToTranslate);
      fs.writeFileSync(translationFilePath, JSON.stringify(json, null, 2));
      console.log(`Updated [en] directly.`);
      continue;
    }

    console.log(`\nProcessing language: [${lang}]...`);
    const translationFilePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(translationFilePath)) continue;
    
    const content = fs.readFileSync(translationFilePath, 'utf8');
    const json = JSON.parse(content);

    let modifications = 0;

    for (const [key, text] of Object.entries(keysToTranslate)) {
      // Check if it exists or is fallback
      // Sometimes it exists but was partially translated (e.g. contains English words from inject-6tools-faqs)
      // So we will just re-translate all of these 3 pages and FAQs fully for 30 langs to be sure.
      
      try {
        const result = await translate(text, { to: lang });
        json[key] = result.text;
        modifications++;
        console.log(`  Translated: ${key} -> ${result.text}`);
      } catch (err) {
        console.error(`  Error translating ${key} to ${lang}:`, err.message);
      }
      
      // Delay to avoid hitting rate limits too fast
      await delay(200);
    }

    if (modifications > 0) {
      fs.writeFileSync(translationFilePath, JSON.stringify(json, null, 2));
      console.log(`Saved ${modifications} translations to ${lang}`);
    } else {
      console.log(`No translations were needed for ${lang}`);
    }
  }
  
  console.log('\nAll done!');
}

main().catch(console.error);
