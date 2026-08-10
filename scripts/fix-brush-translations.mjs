import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/i18n/staticCatalog.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Rename faq.brush.qX to landing.brush.faqX.q
content = content.replace(/"faq\.brush\.q([1-4])"/g, '"landing.brush.faq$1.q"');
content = content.replace(/"faq\.brush\.a([1-4])"/g, '"landing.brush.faq$1.a"');

// 2. Define the keys we need to translate (English source)
const englishSource = {
  "landing.brush.redesign.heroBadge": "PIXEL-PERFECT CONTROL",
  "landing.brush.redesign.heroTitle": "Master Your Edges with the Magic Refinement Brush",
  "landing.brush.redesign.heroDesc": "AI gets it right 99% of the time. For that remaining 1%, use our manual Erase and Restore brushes to craft flawless cutouts directly in your browser.",
  "landing.brush.redesign.feat1Badge": "ERASE TOOL",
  "landing.brush.redesign.feat1Title": "Clean Up Stubborn Artifacts",
  "landing.brush.redesign.feat1Desc": "Notice a speck of background that the AI missed? Simply paint over it to permanently erase it from your composition.",
  "landing.brush.redesign.feat2Badge": "RESTORE TOOL",
  "landing.brush.redesign.feat2Title": "Bring Back Missing Details",
  "landing.brush.redesign.feat2Desc": "Did the AI accidentally remove a piece of clothing or hair? Use the restore brush to magically bring those pixels back from the original image.",
  "landing.brush.redesign.feat3Badge": "ADJUSTABLE",
  "landing.brush.redesign.feat3Title": "Dynamic Brush Sizing",
  "landing.brush.redesign.feat3Desc": "Scale your brush size from a massive block for large area cleanups down to a tiny point for pixel-perfect edge refinement.",
  "landing.brush.redesign.whoTag": "PROFESSIONAL TOUCH",
  "landing.brush.redesign.whoTitle": "When AI Needs a Human Touch",
  "landing.brush.redesign.whoDesc": "Complex product shots and fine hair details sometimes require a manual override.",
  "landing.brush.redesign.case1Title": "E-commerce Products",
  "landing.brush.redesign.case1Desc": "Product photos often have shadows or reflections that AI might confuse. Use the magic brush to ensure your product edges are exceptionally clean before publishing to your store.",
  "landing.brush.redesign.case2Title": "Complex Hair & Fur",
  "landing.brush.redesign.case2Desc": "While our AI is trained on millions of hair patterns, extremely chaotic backgrounds can trick it. The restore brush lets you paint back fine strands of hair perfectly.",
  "landing.brush.faq1.q": "What is the Magic Brush used for?",
  "landing.brush.faq1.a": "The Magic Brush is a manual refinement tool that allows you to erase leftover background artifacts or restore accidentally removed parts of your image after the AI background removal process.",
  "landing.brush.faq2.q": "Does the brush work offline?",
  "landing.brush.faq2.a": "Yes, absolutely! Just like our background removal AI, the manual brush tools run 100% locally in your browser. No data is sent to external servers.",
  "landing.brush.faq3.q": "Can I change the size of the brush?",
  "landing.brush.faq3.a": "Yes, you can adjust the brush size using the slider in the tool panel. A smaller brush is perfect for fine details like hair, while a larger brush is great for quickly erasing big chunks of background.",
  "landing.brush.faq4.q": "Is the Magic Brush completely free?",
  "landing.brush.faq4.a": "Yes! All features on HelpMyIMG, including the AI background remover and the manual Magic Brush refinement tools, are completely free with no usage limits."
};

async function translateGTX(text, targetLang) {
  let tLang = targetLang;
  if (tLang === 'zh') tLang = 'zh-CN';
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${tLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map(item => item[0]).join('');
}

async function run() {
  const languages = ['ar','bg','cs','da','de','el','es','fi','fr','he','hi','hu','id','it','ja','ko','ms','nl','no','pl','pt','ro','ru','sv','th','tl','tr','uk','vi','zh'];
  
  for (const lang of languages) {
    console.log(`Translating for ${lang}...`);
    // Find the block for this lang
    const regex = new RegExp(`("${lang}(-[A-Z]{2})?":\\s*{)([\\s\\S]*?)(?=},?\\s*"[a-z]{2}(-[A-Z]{2})?":|}];?)`, 'g');
    
    let blockMatch = regex.exec(content);
    if (!blockMatch) continue;
    
    let blockContent = blockMatch[3];
    let changed = false;

    // We need to translate only if the text is exactly the English source text.
    // That means it wasn't translated yet.
    for (const [key, enText] of Object.entries(englishSource)) {
      const keyRegex = new RegExp(`"${key}":\\s*"([^"]+)"`);
      const keyMatch = keyRegex.exec(blockContent);
      
      if (keyMatch && keyMatch[1] === enText) {
        // Translate and replace
        try {
          const translatedText = await translateGTX(enText, lang);
          // Escape quotes in translation
          const safeTrans = translatedText.replace(/"/g, '\\"');
          
          blockContent = blockContent.replace(keyRegex, `"${key}": "${safeTrans}"`);
          changed = true;
          await new Promise(r => setTimeout(r, 100)); // anti rate-limit
        } catch (e) {
          console.error(`Failed to translate ${key} for ${lang}`, e);
        }
      }
    }

    if (changed) {
      content = content.replace(blockMatch[0], blockMatch[1] + blockContent);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('All translations applied and staticCatalog.ts updated!');
}

run();
