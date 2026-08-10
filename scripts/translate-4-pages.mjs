import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pagesDir = path.join(__dirname, '../src/pages/info');
const filesToScan = [
  path.join(pagesDir, 'SecurityPage.tsx'),
  path.join(pagesDir, 'PricingPage.tsx'),
  path.join(pagesDir, 'ComparePage.tsx'),
  path.join(pagesDir, 'LanguagesPage.tsx'),
  path.join(__dirname, '../src/components/Footer.tsx')
];

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const extractedKeys = {};

// Regex to find: t('key') || 'default text'
const regex = /t\('([^']+)'\)\s*\|\|\s*'([^']+)'/g;

for (const file of filesToScan) {
  if (!fs.existsSync(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  let match;
  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    const text = match[2];
    extractedKeys[key] = text;
  }
}

// Add any missing hardcoded ones that regex might have missed
extractedKeys['security.faq1.q'] = "Is HelpMyIMG really secure?";
extractedKeys['security.faq1.a'] = "Yes. By using WebAssembly, the AI processes images directly on your local device. We never receive your files on our servers.";
extractedKeys['security.faq2.q'] = "Do you store my processed images?";
extractedKeys['security.faq2.a'] = "No. Since nothing is uploaded, there is nothing for us to store. Everything happens in your browser's memory.";
extractedKeys['security.faq3.q'] = "Are you GDPR and CCPA compliant?";
extractedKeys['security.faq3.a'] = "Yes, inherently. Because we collect zero data from the image processing pipeline, we bypass most strict consent requirements entirely.";

extractedKeys['pricing.faq1.q'] = "Is there really no hidden cost?";
extractedKeys['pricing.faq1.a'] = "Absolutely zero. You get all enterprise features for free without ever entering a credit card.";
extractedKeys['pricing.faq2.q'] = "How do you make money if it's free?";
extractedKeys['pricing.faq2.a'] = "Our server costs are effectively zero since your device does the computing. We rely on ads and optional donations to keep the lights on.";
extractedKeys['pricing.faq3.q'] = "Will you ever start charging?";
extractedKeys['pricing.faq3.a'] = "The core local-processing features will remain free forever. We believe AI image processing should be a basic human right, not a luxury.";

extractedKeys['compare.faq1.q'] = "Why is HelpMyIMG faster than cloud APIs?";
extractedKeys['compare.faq1.a'] = "Cloud APIs suffer from network latency (uploading and downloading large images). We eliminate the network, running at native device speeds.";
extractedKeys['compare.faq2.q'] = "Does local processing drain my battery?";
extractedKeys['compare.faq2.a'] = "Our WebAssembly models are highly optimized. While it uses CPU, it's a split-second operation that uses less energy than watching a YouTube video.";
extractedKeys['compare.faq3.q'] = "How is offline mode possible?";
extractedKeys['compare.faq3.a'] = "Once the website's assets load, all the AI math logic runs within the browser engine itself, requiring zero internet connection.";

extractedKeys['languages.faq1.q'] = "Are the translations accurate?";
extractedKeys['languages.faq1.a'] = "We combine advanced neural machine translation with human oversight to ensure technical context and SEO structures are preserved.";
extractedKeys['languages.faq2.q'] = "How do I request a new language?";
extractedKeys['languages.faq2.a'] = "You can contact our support team or open an issue on our public repository. We aim to support as many dialects as possible.";
extractedKeys['languages.faq3.q'] = "Does changing language affect performance?";
extractedKeys['languages.faq3.a'] = "Not at all. Our React context engine swaps out the dictionary in 0ms without requiring a full page reload.";


const keysList = Object.keys(extractedKeys);

function setNestedValue(obj, path, value) {
  const keys = path.split('.');
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
  console.log(`Extracted ${keysList.length} keys to translate.`);
  for (const lang of languages) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    let updated = false;

    if (lang === 'en') {
        for (const key of keysList) {
            setNestedValue(langData, key, extractedKeys[key]);
            updated = true;
        }
    } else {
        // Skip if already translated (check first key)
        const firstKey = keysList[0];
        const firstKeysArr = firstKey.split('.');
        let val = langData;
        for(let k of firstKeysArr) {
            if(val) val = val[k];
        }
        if (val && val !== extractedKeys[firstKey]) {
            console.log(`[${lang}] Already translated. Skipping...`);
            continue;
        }

        console.log(`\n[${lang}] Translating via GTX...`);
        for (let i = 0; i < keysList.length; i++) {
          const key = keysList[i];
          const text = extractedKeys[key];
          
          try {
            await new Promise(r => setTimeout(r, 100)); // Delay between requests
            const resText = await translateGTX(text, lang);
            setNestedValue(langData, key, resText);
            updated = true;
          } catch (e) {
            console.error(`  [${lang}] Failed single: ${key} -> ${e.message}`);
          }
        }
    }
    
    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[${lang}] Saved successfully.`);
    }
  }
}

run();
