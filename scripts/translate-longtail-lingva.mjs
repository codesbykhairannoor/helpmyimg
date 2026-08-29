import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translate } from '@vitalets/google-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const keysToTranslate = {
  "longtail.faq": "Frequently Asked Questions",
  "longtail.c50.feat1Title": "High-Speed Processing",
  "longtail.c50.target": "Target Limit",
  "longtail.c50.feat2Title": "Smart Quality Retention",
  "longtail.c50.feat2Desc": "Our algorithm automatically adjusts compression curves to retain edge sharpness even at extremely low bitrates.",
  "longtail.c50.feat3Title": "Mobile Optimized",
  "longtail.c50.feat3Desc": "Works flawlessly on iOS and Android browsers without requiring any app installations or backend uploads.",
  "longtail.c50.heavy": "Heavy",
  "longtail.c50.ready": "Ready",
  "longtail.c100.clientSide": "Client-Side Architecture",
  "longtail.c100.secure": "100% Secure",
  "longtail.c100.webgpu": "WebGPU Powered",
  "longtail.c100.original": "Original 5MB",
  "longtail.c100.result": "Result 98KB",
  "longtail.c100.proven": "Proven Performance",
  "longtail.c100.privacy": "Absolute Privacy",
  "longtail.c100.privacyDesc": "By utilizing WebWorkers, images never leave your device. Serverless architecture prevents data leaks.",
  "longtail.c100.fast": "Lightning Fast",
  "longtail.c100.fastDesc": "Powered by browser-native APIs. Compressing a 5MB image to 100KB takes less than 0.5 seconds.",
  "longtail.c100.batch": "Batch Ready",
  "longtail.c100.batchDesc": "Drag and drop up to 50 images at once. They process concurrently without crashing your tab.",
  "longtail.c200.targetSize": "Target Size",
  "longtail.c200.bestUse": "Best Use Case",
  "longtail.c200.quality": "Quality Retention",
  "longtail.c200.excellent": "Excellent",
  "longtail.c200.good": "Good",
  "longtail.c200.acceptable": "Acceptable",
  "longtail.c200.serverLogs": "Server Logs"
};

const delay = ms => new Promise(res => setTimeout(res, ms));

async function main() {
  const sourceLang = 'en';

  for (const lang of languages) {
    if (lang === 'en') {
      // For english, just inject the keys directly
      const transPath = path.join(localesDir, lang, 'translation.json');
      const data = JSON.parse(fs.readFileSync(transPath, 'utf8'));
      let modified = false;
      for (const [key, text] of Object.entries(keysToTranslate)) {
        if (!data[key]) {
          data[key] = text;
          modified = true;
        }
      }
      if (modified) fs.writeFileSync(transPath, JSON.stringify(data, null, 2));
      continue;
    }

    const transPath = path.join(localesDir, lang, 'translation.json');
    const data = JSON.parse(fs.readFileSync(transPath, 'utf8'));
    let modified = false;

    console.log(`Processing ${lang}...`);
    
    // Convert target language code to what Lingva expects if necessary
    let targetLang = lang;
    if (targetLang === 'zh') targetLang = 'zh-CN';
    if (targetLang === 'tl') targetLang = 'tl'; // tl works in google usually

    for (const [key, text] of Object.entries(keysToTranslate)) {
      if (!data[key]) {
        try {
          const res = await translate(text, { to: targetLang });
          data[key] = res.text || text;
          console.log(`  [${lang}] ${key}: ${data[key]}`);
          modified = true;
        } catch (e) {
          console.log(`  [Error] ${lang} - ${key}:`, e.message);
          data[key] = text; // fallback to English
          modified = true;
          await delay(2000);
        }
      }
    }

    if (modified) {
      fs.writeFileSync(transPath, JSON.stringify(data, null, 2));
    }
  }

  console.log("Translation complete!");
}

main();
