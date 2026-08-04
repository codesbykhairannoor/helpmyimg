import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const flatKeysToFix = [
  "home.steps.tag",
  "home.steps.title",
  "home.steps.desc",
  "home.steps.s1.t",
  "home.steps.s1.d",
  "home.steps.s2.t",
  "home.steps.s2.d",
  "home.steps.s3.t",
  "home.steps.s3.d",
  "landing.global.faq.tag",
  "landing.global.faq.title",
  "landing.global.faq.desc",
  "home.geo.quote.title",
  "home.geo.quote.text",
  "home.geo.quote.author",
  "home.geo.quote.role",
  "home.geo.fact1",
  "home.geo.fact1_suffix",
  "home.geo.fact2",
  "home.geo.fact2_suffix",
  "home.redesign.ctaTag",
  "home.redesign.ctaTitle",
  "home.redesign.ctaDesc",
  "home.redesign.ctaBtn",
  "landing.remove.faq5.q",
  "landing.remove.faq5.a",
  "landing.remove.faq6.q",
  "landing.remove.faq6.a"
];

function getNestedValue(obj, pathStr) {
  const keys = pathStr.split('.');
  let current = obj;
  for (let i = 0; i < keys.length; i++) {
    if (current === undefined || current === null) return undefined;
    current = current[keys[i]];
  }
  return current;
}

async function run() {
  for (const lang of languages) {
    const langPath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langPath)) continue;
    
    let langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    let updated = false;

    for (const flatKey of flatKeysToFix) {
      // If the flat key doesn't exist or is an object, but a nested value exists
      const nestedVal = getNestedValue(langData, flatKey);
      
      if (typeof nestedVal === 'string') {
        langData[flatKey] = nestedVal;
        updated = true;
      }
    }
    
    // Now delete the top-level nested objects that we accidentally created
    if (langData.home && typeof langData.home === 'object') { delete langData.home; updated = true; }
    if (langData.landing && typeof langData.landing === 'object') { delete langData.landing; updated = true; }

    if (updated) {
      fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
      console.log(`[${lang}] Fixed flat keys.`);
    }
  }
}

run();
