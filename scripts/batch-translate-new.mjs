import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const keysToTranslate = {
  // COMPRESS SECTIONS
  "landing.compress.redesign.heroBadge": "SMART COMPRESSION",
  "landing.compress.redesign.heroTitle": "Shrink Image File Size up to 90% Instantly",
  "landing.compress.redesign.heroDesc": "Reduce the size of your photos without losing visual quality. Perfect for websites, emails, and strict upload limits.",
  "landing.compress.redesign.feat1Badge": "NO QUALITY LOSS",
  "landing.compress.redesign.feat1Title": "Smart Optimization",
  "landing.compress.redesign.feat1Desc": "Automatically finds the perfect balance between minimal file size and maximum image quality.",
  "landing.compress.redesign.feat2Badge": "100% PRIVATE",
  "landing.compress.redesign.feat2Title": "Zero Uploads",
  "landing.compress.redesign.feat2Desc": "Like all our tools, compression happens right in your web browser. Nothing goes to any server.",
  "landing.compress.redesign.feat3Badge": "ANY FORMAT",
  "landing.compress.redesign.feat3Title": "Broad Support",
  "landing.compress.redesign.feat3Desc": "Works with standard JPG and PNG formats, as well as modern ultra-efficient WEBP formats.",
  "landing.compress.redesign.whoTag": "WHO IS IT FOR",
  "landing.compress.redesign.whoTitle": "Built for Web & Media",
  "landing.compress.redesign.whoDesc": "Perfect for developers, designers, and social media managers who need highly optimized images.",
  "landing.compress.redesign.who1Title": "Web Developers",
  "landing.compress.redesign.who1Desc": "Improve PageSpeed scores and decrease load times without sacrificing image quality.",
  "landing.compress.redesign.who1Tags": "SEO OPTIMIZATION",
  "landing.compress.redesign.who2Title": "Content Creators",
  "landing.compress.redesign.who2Desc": "Meet strict upload size limits for platforms like Discord, Twitter, or email attachments.",
  "landing.compress.redesign.who2Tags": "SOCIAL MEDIA",
  "landing.compress.redesign.stepsTag": "HOW IT WORKS",
  "landing.compress.redesign.stepsTitle": "3 Steps to Optimize",
  "landing.compress.redesign.s1Title": "Upload Images",
  "landing.compress.redesign.s1Desc": "Drag and drop your photos into the compression workspace.",
  "landing.compress.redesign.s2Title": "Set Compression Level",
  "landing.compress.redesign.s2Desc": "Adjust the quality slider to find the right balance between visual quality and file size.",
  "landing.compress.redesign.s3Title": "Save Storage",
  "landing.compress.redesign.s3Desc": "Download your optimized images and enjoy reduced file sizes.",

  // REMOVE BG SECTIONS
  "landing.remove.redesign.heroBadge": "AI POWERED CUTOUT",
  "landing.remove.redesign.heroTitle": "Remove Background in 1 Second with Flawless Precision",
  "landing.remove.redesign.heroDesc": "Powered by advanced WebAssembly AI, get perfect hair cutouts and smooth edges without ever uploading your photos to a server.",
  "landing.remove.redesign.feat1Badge": "99.8% ACCURACY",
  "landing.remove.redesign.feat1Title": "Flawless Hair & Edge Detection",
  "landing.remove.redesign.feat1Desc": "Our neural network easily handles complex details like human hair, animal fur, and semi-transparent objects.",
  "landing.remove.redesign.feat2Badge": "100% SECURE",
  "landing.remove.redesign.feat2Title": "Complete Offline Privacy",
  "landing.remove.redesign.feat2Desc": "The AI model loads directly into your browser. Your images never leave your computer, ensuring total data security.",
  "landing.remove.redesign.feat3Badge": "BATCH MODE",
  "landing.remove.redesign.feat3Title": "Bulk Processing Ready",
  "landing.remove.redesign.feat3Desc": "Drag and drop up to 10 photos at once. Process them simultaneously and download everything in a neat ZIP file.",
  "landing.remove.redesign.whoTag": "WHO IS IT FOR",
  "landing.remove.redesign.whoTitle": "Perfect for Every Creative Needs",
  "landing.remove.redesign.whoDesc": "Whether you are selling cars, designing posters, or creating official documents.",
  "landing.remove.redesign.who1Title": "E-Commerce Sellers",
  "landing.remove.redesign.who1Desc": "Create clean white backgrounds for product listings.",
  "landing.remove.redesign.who1Tags": "PRODUCT LISTING",
  "landing.remove.redesign.who2Title": "Graphic Designers",
  "landing.remove.redesign.who2Desc": "Extract logos, signatures, and assets instantly.",
  "landing.remove.redesign.who2Tags": "DESIGN ASSETS",
  "landing.remove.redesign.stepsTag": "HOW IT WORKS",
  "landing.remove.redesign.stepsTitle": "3 Steps to Transparent Backgrounds",
  "landing.remove.redesign.s1Title": "Upload Image",
  "landing.remove.redesign.s1Desc": "Drag & drop your photo. PNG, JPG, or WEBP.",
  "landing.remove.redesign.s2Title": "AI Processing",
  "landing.remove.redesign.s2Desc": "The local WASM AI detects the main subject in 1 second.",
  "landing.remove.redesign.s3Title": "Download HD",
  "landing.remove.redesign.s3Desc": "Export your cut-out photo with a transparent background.",

  // HOMEPAGE SECTIONS
  "home.why.tag": "WHY HELPMYIMG",
  "home.why.title": "Why HelpMyIMG is the Smartest Choice for Creators & Businesses",
  "home.why.desc": "Designed from the ground up for maximum privacy, blazing speed, and zero cost. Here is why thousands trust HelpMyIMG every day.",
  "home.why.c1.t": "Instant Local Speed",
  "home.why.c1.d": "Your photos are processed directly inside your device memory with zero latency. No slow file uploads or cloud queues.",
  "home.why.c1.b": "0ms Server Delay",
  "home.why.c2.t": "100% Absolute Privacy",
  "home.why.c2.d": "Your personal portraits, confidential documents, and product shots never leave your computer or phone. Total peace of mind.",
  "home.why.c2.b": "Zero Cloud Storage",
  "home.why.c3.t": "Forever Free & Unlimited",
  "home.why.c3.d": "No subscriptions, no watermarks, no credit packs, and no hidden fees. High-definition photo editing made accessible for all.",
  "home.why.c3.b": "$0 / Lifetime",
  "home.why.c4.t": "Batch Power up to 10",
  "home.why.c4.d": "Drag and drop up to 10 photos simultaneously. Process, optimize, and export your entire photoshoot as a neat ZIP archive in seconds.",
  "home.why.c4.b": "10x Workflow Speed",
  "home.steps.tag": "HOW IT WORKS",
  "home.steps.title": "How HelpMyIMG Works in 3 Simple Steps",
  "home.steps.desc": "No software installation required. Get professional results directly from your web browser.",
  
  // EXTRA MISSING FALLBACKS FROM PREVIOUS SCRIPTS
  "landing.global.faq.tag": "HELP CENTER & FAQ",
  "landing.global.faq.title": "Frequently Asked Questions",
  "landing.global.faq.desc": "Everything you need to know about our local processing engine.",
  "landing.flex.tag": "SYSTEM ARCHITECTURE",
  "landing.flex.title": "Engineered for Extreme Privacy & Millisecond Performance",
  "landing.flex.desc": "We don't rely on slow cloud servers. HelpMyIMG utilizes next-generation WebAssembly to run complex AI algorithms directly inside your browser memory.",
  "landing.flex.c1.title": "Local AI Processing",
  "landing.flex.c1.desc": "Your sensitive files never touch our servers. All AI operations are executed locally on your device for 100% privacy.",
  "landing.flex.c2.title": "0ms Network Latency",
  "landing.flex.c2.desc": "Skip the upload and download wait times. Processing begins the exact millisecond you drag and drop your photos.",
  "landing.flex.c3.title": "WebAssembly Powered",
  "landing.flex.c3.desc": "Leveraging ultra-fast WASM binaries, HelpMyIMG matches the performance of native desktop applications inside the web browser.",
  "landing.remove.faq1.q": "Is HelpMyIMG completely free to use?",
  "landing.remove.faq1.a": "Yes, it is 100% free with no hidden fees, subscriptions, or credit systems. We provide unlimited access to all tools.",
  "landing.remove.faq2.q": "Do you save or upload my photos?",
  "landing.remove.faq2.a": "Absolutely not. All processing happens locally on your device via WebAssembly. Your files never touch our servers.",
  "landing.remove.faq3.q": "Can I process multiple images at once?",
  "landing.remove.faq3.a": "Yes, you can select up to 10 photos simultaneously for batch processing and download them as a convenient ZIP file.",
  "landing.remove.faq4.q": "Does it work offline?",
  "landing.remove.faq4.a": "Once the web application loads in your browser, the AI engine can function entirely offline without an active internet connection."
};

const keys = Object.keys(keysToTranslate);
const originalStrings = keys.map(k => keysToTranslate[k]);
// Join all strings with \n (newline is safest separator for Google Translate to preserve)
const combinedText = originalStrings.join('\n');

async function translateText(text, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const json = await res.json();
    return json[0].map(item => item[0]).join('');
  } catch (err) {
    throw new Error(`GTX failed: ${err.message}`);
  }
}

async function run() {
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Check if it's already translated. If it's English "WHY HELPMYIMG", it means it failed previously.
    const needsTranslation = data['home.why.tag'] === 'WHY HELPMYIMG' || data['landing.compress.redesign.heroTitle'] === keysToTranslate['landing.compress.redesign.heroTitle'] || data['landing.remove.redesign.heroBadge'] === keysToTranslate['landing.remove.redesign.heroBadge'];
    
    if (!needsTranslation && lang !== 'en') {
      console.log(`[${lang}] Already translated, skipping.`);
      continue;
    }

    if (lang === 'en') {
      for (const [key, value] of Object.entries(keysToTranslate)) {
        data[key] = value;
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[EN] Injected English defaults.`);
      continue;
    }
    
    console.log(`\nTranslating for ${lang}...`);
    try {
      await new Promise(r => setTimeout(r, 1500)); // 1.5s delay
      const resText = await translateText(combinedText, lang);
      
      const translatedStrings = resText.split('\n').map(s => s.trim());
      
      if (translatedStrings.length !== originalStrings.length) {
        console.error(`[${lang}] ERROR: Length mismatch! Expected ${originalStrings.length}, got ${translatedStrings.length}`);
        // Fallback to English
        for (let i = 0; i < keys.length; i++) {
          data[keys[i]] = originalStrings[i];
        }
      } else {
        for (let i = 0; i < keys.length; i++) {
          data[keys[i]] = translatedStrings[i] || originalStrings[i];
        }
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[${lang}] Successfully translated and injected.`);
    } catch (e) {
      console.error(`[${lang}] ERROR:`, e.message);
    }
  }
}

run();
