import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const faqKeys = {
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

const keys = Object.keys(faqKeys);
const originalStrings = keys.map(k => faqKeys[k]);

// We use a robust separator that Google Translate usually preserves
const SEPARATOR = ' ||| ';
const combinedText = originalStrings.join(SEPARATOR);

async function translateText(text, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
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

    if (lang === 'en') {
      for (const [key, value] of Object.entries(faqKeys)) {
        data[key] = value;
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[EN] Injected English defaults.`);
      continue;
    }
    
    console.log(`\nTranslating FAQ for ${lang}...`);
    try {
      // Small delay to be polite to the free API
      await new Promise(r => setTimeout(r, 1000));
      
      let resText = await translateText(combinedText, lang);
      
      // Split by separator (Google translate might add spaces around it)
      // Regex allows flexible spacing around the separator
      const translatedStrings = resText.split(/\s*\|\|\|\s*/).map(s => s.trim());
      
      if (translatedStrings.length !== originalStrings.length) {
        console.error(`[${lang}] ERROR: Length mismatch! Expected ${originalStrings.length}, got ${translatedStrings.length}`);
        // Fallback to individual translations if batch fails
        console.log(`[${lang}] Falling back to one-by-one translation...`);
        for (let i = 0; i < keys.length; i++) {
          await new Promise(r => setTimeout(r, 300));
          try {
            const indRes = await translateText(originalStrings[i], lang);
            data[keys[i]] = indRes.trim() || originalStrings[i];
          } catch(e) {
            data[keys[i]] = originalStrings[i];
          }
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
