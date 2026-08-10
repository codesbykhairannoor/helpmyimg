import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, '../public/locales');
let languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const remainingLangs = ['nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tl', 'tr', 'uk', 'vi', 'zh'];
languages = languages.filter(l => remainingLangs.includes(l));

const missingKeys = {
  "security.s2.bullet1": "GDPR Article 5",
  "security.s2.bullet2": "CCPA",
  "security.s2.bullet3": "HIPAA",
  "security.s2.graphic": "BLOCKED",
  "security.s3.b1.title": "Local RAM Processing",
  "security.s3.b1.desc": "Images are decoded and processed entirely within your device's volatile memory. We never write to disk.",
  "security.s3.b2.title": "No Backend Servers",
  "security.s3.b2.desc": "The AI logic is completely detached from the cloud. You are using the software, not renting a service.",
  "security.s3.b3.title": "Transparent Logic",
  "security.s3.b3.desc": "Inspect our network tab. You'll see 0 outbound image requests. What happens on your device, stays on your device.",

  "pricing.f1": "Unlimited AI Background Removal",
  "pricing.f2": "Unlimited Batch Processing",
  "pricing.f3": "Unlimited Image Compressions",
  "pricing.f4": "Zero Server Uploads (100% Private)",
  "pricing.f5": "Full High-Definition Exports",
  "pricing.f6": "No Watermarks on Results",
  "pricing.s3.c1.name": "Generic Cloud APIs",
  "pricing.s3.c2.name": "Subscription Apps",
  "pricing.s3.c3.name": "Enterprise Software",

  "compare.row1.label": "Latency / Speed",
  "compare.row1.ours": "0ms (Instant)",
  "compare.row1.t1": "500ms+",
  "compare.row1.t2": "800ms+",
  "compare.row2.label": "Privacy",
  "compare.row2.ours": "100% Local (Zero-Trust)",
  "compare.row2.t1": "Data Uploaded",
  "compare.row2.t2": "Data Stored",
  "compare.row3.label": "Offline Mode",
  "compare.row3.ours": "Fully Supported",
  "compare.row3.t1": "Fails completely",
  "compare.row3.t2": "Fails completely",
  "compare.row4.label": "Pricing",
  "compare.row4.ours": "0 IDR / Forever Free",
  "compare.row4.t1": "Pay per API call",
  "compare.row4.t2": "Monthly Subs",
  "compare.row5.label": "Batch Processing",
  "compare.row5.ours": "Up to 10 parallel",
  "compare.row5.t1": "Queue based",
  "compare.row5.t2": "1 by 1 limit",

  "languages.s3.l1": "Localized URLs for better SEO",
  "languages.s3.l2": "Right-to-Left (RTL) support (coming soon)",
  "languages.s3.l3": "Culturally adapted idioms and examples"
};

const keysList = Object.keys(missingKeys);

function setNestedValue(obj, pathStr, value) {
  const keys = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
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
  console.log(`Starting rapid translation for ${keysList.length} array keys across 30 languages...`);
  
  for (const lang of languages) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    let updated = false;

    if (lang === 'en') {
      for (const key of keysList) {
        setNestedValue(langData, key, missingKeys[key]);
        updated = true;
      }
    } else {
      console.log(`[${lang}] Rapid translating...`);
      // Run sequentially because doing 42 parallel might trigger 429
      for (const key of keysList) {
        try {
          const resText = await translateGTX(missingKeys[key], lang);
          langData[key] = resText;
          updated = true;
          // small delay to prevent 429
          await new Promise(r => setTimeout(r, 50));
        } catch (e) {
          console.error(`  [${lang}] Failed: ${key} -> ${e.message}`);
        }
      }
    }
    
    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[${lang}] Saved successfully.`);
    }
  }
  console.log('DONE!');
}

run();
