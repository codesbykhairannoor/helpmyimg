import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const langs = [
  'en', 'id', 'es', 'fr', 'de', 'ja', 'pt', 'ru', 'zh-CN', 'ar',
  'hi', 'it', 'ko', 'nl', 'tr', 'pl', 'vi', 'th', 'sv', 'cs',
  'da', 'el', 'fi', 'he', 'hu', 'no', 'ro', 'sk', 'uk', 'ms'
];

const keyword = "compress-image-to-100kb";

const baseData = {
  title: "Compress Image to 100KB Online Free - Fast & Private",
  h1: "Compress Any Image to 100KB Instantly",
  description: "Easily compress your JPG, PNG, and WEBP images to exactly 100KB or less without losing quality. 100% private, processed in your browser.",
  sections: [
    {
      title: "Shrink Image Size Without Losing Clarity",
      content: "Struggling with upload limits on government portals, job sites, or university forms? Our advanced client-side compressor reduces your image size precisely under 100KB while keeping text and faces crystal clear.",
      badgeText: "Target 100KB"
    },
    {
      title: "100% Private & Secure Processing",
      content: "Unlike other online tools, we never upload your sensitive ID cards, passports, or personal photos to external servers. Everything runs entirely offline inside your browser.",
      badgeText: "Zero Uploads"
    },
    {
      title: "How to Compress Your Image to 100KB",
      content: "1. Upload your image. \n2. Choose 'Strong' compression. \n3. Download your optimized 100KB file instantly.",
      badgeText: "Quick Guide"
    }
  ],
  faqs: [
    {
      q: "How can I compress an image to exactly 100KB?",
      a: "Our tool automatically adjusts the quality slider and strips unnecessary metadata to push the file size below 100KB while preserving visual fidelity."
    },
    {
      q: "Is it safe to compress my passport photo here?",
      a: "Yes, it is 100% safe. Your images are never transmitted over the internet. Processing happens locally in your device's memory."
    }
  ],
  faqTitle: "Frequently Asked Questions",
  supportCenter: "Support Center",
  buttonText: "Compress to 100KB Now"
};

// Layout variations for dynamic rendering
const layoutConfigs = [
  ["hero_split", "privacy_shield", "how_to_steps"],
  ["hero_center", "how_to_grid", "privacy_alert"],
  ["hero_split_reverse", "privacy_shield_dark", "how_to_steps"]
];

async function generate() {
  const targetDir = path.join(__dirname, '..', 'src', 'locales', 'pseo', keyword);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    console.log(`Translating to ${lang}...`);
    
    // Fallbacks for language codes
    const translateLang = lang === 'zh' ? 'zh-CN' : lang;

    try {
      let translated = { ...baseData };
      
      if (lang !== 'en') {
        translated.title = (await translate(baseData.title, { to: translateLang })).text;
        translated.h1 = (await translate(baseData.h1, { to: translateLang })).text;
        translated.description = (await translate(baseData.description, { to: translateLang })).text;
        
        translated.sections = await Promise.all(baseData.sections.map(async (sec) => ({
          title: (await translate(sec.title, { to: translateLang })).text,
          content: (await translate(sec.content, { to: translateLang })).text,
          badgeText: (await translate(sec.badgeText, { to: translateLang })).text,
        })));
        
        translated.faqs = await Promise.all(baseData.faqs.map(async (faq) => ({
          q: (await translate(faq.q, { to: translateLang })).text,
          a: (await translate(faq.a, { to: translateLang })).text,
        })));
        
        translated.faqTitle = (await translate(baseData.faqTitle, { to: translateLang })).text;
        translated.supportCenter = (await translate(baseData.supportCenter, { to: translateLang })).text;
        translated.buttonText = (await translate(baseData.buttonText, { to: translateLang })).text;
      }

      // Assign random layout based on language index
      const layoutChoice = layoutConfigs[i % layoutConfigs.length];
      translated.sections = translated.sections.map((sec, idx) => ({
        ...sec,
        type: layoutChoice[idx]
      }));

      fs.writeFileSync(path.join(targetDir, `${lang === 'zh-CN' ? 'zh' : lang}.json`), JSON.stringify(translated, null, 2), 'utf8');
      console.log(`✅ Saved ${lang}.json`);
      
      // Delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 800));
    } catch (err) {
      console.error(`❌ Failed for ${lang}:`, err.message);
    }
  }
}

generate();
