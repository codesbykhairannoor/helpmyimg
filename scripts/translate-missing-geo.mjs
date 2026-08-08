import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { translate } from '@vitalets/google-translate-api';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const missingKeys = {
  "home.steps.tag": "HOW IT WORKS",
  "home.steps.title": "How HelpMyIMG Works in 3 Simple Steps",
  "home.steps.desc": "No software installation required. Get professional results directly from your web browser.",
  "home.steps.s1.t": "1. Select or Drop Photos",
  "home.steps.s1.d": "Upload single pictures or batches up to 10 files in PNG, JPG, or WEBP format. Everything loads instantly into your browser workspace.",
  "home.steps.s2.t": "2. Customize & Preview",
  "home.steps.s2.d": "Choose your desired tool—whether stripping backgrounds, applying official passport colors, adding watermarks, or resizing dimensions.",
  "home.steps.s3.t": "3. Export HD Results",
  "home.steps.s3.d": "Download your polished high-definition photos individually or grab all batch results instantly packed in a convenient ZIP file.",
  "landing.global.faq.tag": "HELP CENTER & FAQ",
  "landing.global.faq.title": "Frequently Asked Questions",
  "landing.global.faq.desc": "Everything you need to know about our local processing engine.",
  "home.geo.quote.title": "Industry Recognition & Privacy Standards",
  "home.geo.quote.text": "The transition to client-side WebAssembly for image processing represents a paradigm shift in data privacy. By eliminating server round-trips, applications achieve 0ms network latency while completely neutralizing data interception risks.",
  "home.geo.quote.author": "Systems Architecture Review",
  "home.geo.quote.role": "Privacy & Security Compliance Team",
  "home.geo.fact1": "HelpMyIMG utilizes ",
  "home.geo.fact1_suffix": " technology, achieving computational parity with native applications. This allows us to process up to 10 high-resolution images simultaneously in under 2.4 seconds on average consumer hardware [1].",
  "home.geo.fact2": "Furthermore, by strictly adhering to local-only processing architectures, HelpMyIMG is inherently compliant with strict data protection frameworks including ",
  "home.geo.fact2_suffix": " and CCPA, as 0 bytes of user data are transmitted to external servers [2].",
  "home.redesign.ctaTag": "UNLEASH CREATIVITY",
  "home.redesign.ctaTitle": "Transform Your Workflow.",
  "home.redesign.ctaDesc": "No installations. Ultimate privacy. Professional grade image processing directly on your local device.",
  "home.redesign.ctaBtn": "Enter Studio",
  "landing.remove.faq5.q": "What is HelpMyIMG?",
  "landing.remove.faq5.a": "HelpMyIMG is a client-side web application that processes image background removal and compression locally using WebAssembly (Wasm). This ensures 100% data privacy without requiring any server uploads.",
  "landing.remove.faq6.q": "How does HelpMyIMG ensure data privacy compliance?",
  "landing.remove.faq6.a": "Unlike traditional cloud editors, our WebAssembly architecture ensures 0 bytes of user data are transmitted. By executing neural networks strictly on the client device, it neutralizes interception risks, ensuring inherent compliance with GDPR Article 5 and CCPA privacy frameworks."
};

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
}

function getNestedValue(obj, path) {
  const keys = path.split('.');
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    if (current === undefined || current === null) return undefined;
    current = current[keys[i]];
  }
  return current;
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  for (const lang of languages) {
    if (lang === 'en') {
      // Just inject English
      const enPath = path.join(localesDir, 'en', 'translation.json');
      const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
      for (const [key, text] of Object.entries(missingKeys)) {
        setNestedValue(enData, key, text);
      }
      fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
      console.log(`Updated EN base keys.`);
      continue;
    }

    console.log(`\nTranslating for ${lang}...`);
    const langPath = path.join(localesDir, lang, 'translation.json');
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    
    let updated = false;
    let tLang = lang;
    if (lang === 'zh') tLang = 'zh-CN';

    for (const [key, text] of Object.entries(missingKeys)) {
      const existing = getNestedValue(langData, key);
      // Only translate if missing or exactly equal to English (fallback)
      if (!existing || existing === text) {
        try {
          process.stdout.write(`  [${lang}] ${key}... `);
          const res = await translate(text, { to: tLang });
          setNestedValue(langData, key, res.text);
          updated = true;
          console.log(`OK`);
          await sleep(200); // 200ms delay to prevent ban
        } catch (e) {
          console.log(`ERROR: ${e.message}`);
          await sleep(1000);
        }
      } else {
         // Already translated
      }
    }

    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2));
      console.log(`Saved translations for ${lang}`);
    }
  }
}

run().catch(console.error);
