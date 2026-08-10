import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const staticCatalogPath = path.join(__dirname, '..', 'src', 'i18n', 'staticCatalog.ts');
let fileContent = fs.readFileSync(staticCatalogPath, 'utf8');

const languages = [
  { code: 'ar', name: 'Arabic' },
  { code: 'bn', name: 'Bengali' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'he', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'id', name: 'Indonesian' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ms', name: 'Malay' },
  { code: 'nl', name: 'Dutch' },
  { code: 'no', name: 'Norwegian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'zh', name: 'Chinese' }
];

const faqs = [
  {
    keyQ: "landing.faq1.q",
    keyA: "landing.faq1.a",
    enQ: "What makes HelpMyIMG different from other online photo editors?",
    enA: "HelpMyIMG processes everything locally in your browser using WebAssembly. Your photos never leave your device, ensuring 100% privacy and zero upload wait times."
  },
  {
    keyQ: "landing.faq2.q",
    keyA: "landing.faq2.a",
    enQ: "Can I use HelpMyIMG entirely offline?",
    enA: "Yes! Once the website loads, all tools—from background removal to image compression—work completely offline without requiring an active internet connection."
  },
  {
    keyQ: "landing.faq3.q",
    keyA: "landing.faq3.a",
    enQ: "Is there a limit to how many images I can edit?",
    enA: "Absolutely not. Since we use your device's computing power instead of costly cloud servers, you can edit unlimited photos for free without any hidden restrictions or watermarks."
  },
  {
    keyQ: "landing.faq4.q",
    keyA: "landing.faq4.a",
    enQ: "Do you store or see any of my uploaded photos?",
    enA: "No. We have no access to your files. The AI models and processing algorithms execute directly on your local machine, meaning no data is ever transmitted to our servers."
  },
  {
    keyQ: "landing.faq5.q",
    keyA: "landing.faq5.a",
    enQ: "What devices and browsers are supported?",
    enA: "HelpMyIMG works on any modern web browser (Chrome, Safari, Firefox, Edge) across desktop, tablet, and mobile devices that support WebAssembly."
  }
];

async function translateText(text, targetLang) {
  if (targetLang === 'en') return text;
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed[0].map(item => item[0]).join(''));
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

function escapeString(str) {
  return str.replace(/"/g, '\\"').replace(/\n/g, ' ');
}

async function processTranslations() {
  for (const lang of languages) {
    console.log(`Processing ${lang.code}...`);
    for (const faq of faqs) {
      const transQ = await translateText(faq.enQ, lang.code);
      const transA = await translateText(faq.enA, lang.code);
      
      const qRegex = new RegExp(`(  ${lang.code}: {[\\s\\S]*?)(    "${faq.keyQ}":\\s*")[^"]+(",)`, 'g');
      if (fileContent.match(qRegex)) {
        fileContent = fileContent.replace(qRegex, `$1$2${escapeString(transQ)}$3`);
      }
      
      const aRegex = new RegExp(`(  ${lang.code}: {[\\s\\S]*?)(    "${faq.keyA}":\\s*")[^"]+(",)`, 'g');
      if (fileContent.match(aRegex)) {
        fileContent = fileContent.replace(aRegex, `$1$2${escapeString(transA)}$3`);
      }
    }
  }
  
  fs.writeFileSync(staticCatalogPath, fileContent, 'utf8');
  console.log('✅ Done updating staticCatalog.ts with new Home FAQs');
}

processTranslations();
