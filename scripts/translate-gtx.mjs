import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const keysList = Object.keys(missingKeys);

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

async function translateGTX(text, targetLang) {
  let tLang = targetLang;
  if (tLang === 'zh') tLang = 'zh-CN';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map(item => item[0]).join('');
}

async function run() {
  for (const lang of languages) {
    if (lang === 'en') continue;
    
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    let updated = false;

    // Check if we need to translate for this language by checking the first key
    const firstVal = getNestedValue(langData, keysList[0]);
    if (firstVal && firstVal !== missingKeys[keysList[0]]) {
      console.log(`[${lang}] Already translated. Skipping...`);
      continue;
    }
    
    console.log(`\n[${lang}] Translating via GTX...`);
    
    for (let i = 0; i < keysList.length; i++) {
      const key = keysList[i];
      const text = missingKeys[key];
      
      try {
        await new Promise(r => setTimeout(r, 100)); // Delay between requests
        const resText = await translateGTX(text, lang);
        setNestedValue(langData, key, resText);
        updated = true;
      } catch (e) {
        console.error(`  [${lang}] Failed single: ${key} -> ${e.message}`);
      }
    }
    
    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[${lang}] Saved successfully.`);
    }
  }
}

run();
