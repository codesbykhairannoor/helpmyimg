import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// We only need to translate the new "Flexing" section and the redesigned FAQ globally.
const englishData = {
  // Global Flexing Section
  "landing.flex.tag": "SYSTEM ARCHITECTURE",
  "landing.flex.title": "Engineered for Extreme Privacy & Millisecond Performance",
  "landing.flex.desc": "We don't rely on slow cloud servers. HelpMyIMG utilizes next-generation WebAssembly to run complex AI algorithms directly inside your browser memory.",
  
  "landing.flex.c1.title": "Local AI Processing",
  "landing.flex.c1.desc": "Your sensitive files never touch our servers. All AI operations (like background removal) are executed locally on your device for 100% privacy.",
  
  "landing.flex.c2.title": "0ms Network Latency",
  "landing.flex.c2.desc": "Skip the upload and download wait times. Processing begins the exact millisecond you drag and drop your photos.",
  
  "landing.flex.c3.title": "WebAssembly Powered",
  "landing.flex.c3.desc": "Leveraging ultra-fast WASM binaries, HelpMyIMG matches the performance of native desktop applications inside the web browser.",
  
  // Global FAQ Design
  "landing.global.faq.title": "Frequently Asked Questions",
  "landing.global.faq.desc": "Everything you need to know about our local processing engine.",
  
  // Remove BG FAQ
  "landing.remove.faq1.q": "Is the background removal really processed offline?",
  "landing.remove.faq1.a": "Yes. Our AI model is loaded into your browser's memory, so the entire background detection happens on your CPU/GPU, ensuring complete privacy.",
  "landing.remove.faq2.q": "Will the image resolution be reduced?",
  "landing.remove.faq2.a": "No, we preserve your original image resolution. The cutout is generated and merged with your original high-definition pixels.",
  "landing.remove.faq3.q": "Does it work well with complex hair edges?",
  "landing.remove.faq3.a": "Absolutely. The WebAssembly AI model is specifically trained to matting out fine details like hair, fur, and semi-transparent objects.",
  "landing.remove.faq4.q": "Is there a limit on how many images I can process?",
  "landing.remove.faq4.a": "Since everything runs on your own device, there are zero server costs for us. Therefore, you can process unlimited images completely for free.",
  
  // Compress Image FAQ
  "landing.compress.faq1.q": "How does offline compression work?",
  "landing.compress.faq1.a": "We use local Canvas rendering and WebAssembly compression algorithms to shrink the file size directly on your browser without any network uploads.",
  "landing.compress.faq2.q": "Can I compress batches of photos?",
  "landing.compress.faq2.a": "Yes, you can drop up to 10 photos simultaneously. The local engine will compress them all at once and export them as a single ZIP file.",
  "landing.compress.faq3.q": "Will the quality be visibly degraded?",
  "landing.compress.faq3.a": "Our algorithms use perceptually lossless compression, meaning the file size shrinks by up to 90% while the visual quality remains identical to the human eye.",
  "landing.compress.faq4.q": "Is this safe for confidential ID photos?",
  "landing.compress.faq4.a": "100% safe. Your ID and passport photos never leave your device. The compression happens entirely inside the secure sandbox of your web browser."
};

async function translateObject(obj, targetLang) {
  if (targetLang === 'en') return obj;
  const translated = {};
  for (const [key, text] of Object.entries(obj)) {
    try {
      // Small delay to prevent rate limits
      await new Promise(r => setTimeout(r, 300));
      const res = await translate(text, { to: targetLang });
      translated[key] = res.text;
      console.log(`[${targetLang}] ${key}: ${res.text}`);
    } catch (e) {
      console.error(`Error translating ${key} to ${targetLang}:`, e.message);
      translated[key] = text; // fallback to english
    }
  }
  return translated;
}

async function run() {
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    console.log(`\nTranslating for ${lang}...`);
    const translatedData = await translateObject(englishData, lang);
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Inject the translated data
    for (const [key, value] of Object.entries(translatedData)) {
      data[key] = value;
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully injected flexing & faq translations for ${lang}`);
  }
}

run();
