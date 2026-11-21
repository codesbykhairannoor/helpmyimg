const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const localesDir = path.join(publicDir, 'locales');
const DOMAIN = 'https://helpmyimg.com';

// Load SLUG_MAP from urlMapper.ts
const urlMapperPath = path.join(__dirname, '..', 'src', 'utils', 'urlMapper.ts');
const urlMapperContent = fs.readFileSync(urlMapperPath, 'utf8');

const slugMapMatch = urlMapperContent.match(/export const SLUG_MAP[\s\S]*?=\s*({[\s\S]*?});/);
let SLUG_MAP = {};
if (slugMapMatch) {
  SLUG_MAP = eval(`(${slugMapMatch[1]})`);
}

const FALLBACK_SLUGS = {
  remove: 'remove-background',
  color: 'change-background',
  watermark: 'watermark-image',
  brush: 'magic-brush',
  compress: 'compress-image',
  convert: 'convert-image',
  resize: 'resize-image',
  crop: 'crop-image',
  rotate: 'rotate-image',
  picker: 'image-color-picker',
  blurface: 'blur-face',
  design: 'advanced-editor',
  metadata: 'ai-metadata-cleaner',
  editexif: 'edit-exif'
};

const LANG_NAMES = {
  ar: 'العربية (Arabic)',
  cs: 'Čeština (Czech)',
  da: 'Dansk (Danish)',
  de: 'Deutsch (German)',
  el: 'Ελληνικά (Greek)',
  en: 'English',
  es: 'Español (Spanish)',
  fi: 'Suomi (Finnish)',
  fr: 'Français (French)',
  he: 'עברית (Hebrew)',
  hi: 'हिन्दी (Hindi)',
  hu: 'Magyar (Hungarian)',
  id: 'Bahasa Indonesia (Indonesian)',
  it: 'Italiano (Italian)',
  ja: '日本語 (Japanese)',
  ko: '한국어 (Korean)',
  ms: 'Bahasa Melayu (Malay)',
  nl: 'Nederlands (Dutch)',
  no: 'Norsk (Norwegian)',
  pl: 'Polski (Polish)',
  pt: 'Português (Portuguese)',
  ro: 'Română (Romanian)',
  ru: 'Русский (Russian)',
  sv: 'Svenska (Swedish)',
  th: 'ไทย (Thai)',
  tl: 'Tagalog / Filipino',
  tr: 'Türkçe (Turkish)',
  uk: 'Українська (Ukrainian)',
  vi: 'Tiếng Việt (Vietnamese)',
  zh: '简体中文 (Chinese)'
};

// Remove stale llm-bg.txt if present
const bgFile = path.join(publicDir, 'llm-bg.txt');
if (fs.existsSync(bgFile)) fs.unlinkSync(bgFile);

const langs = Object.keys(SLUG_MAP).filter(l => l !== 'bg');
console.log(`Generating accurate localized LLM documentation for ${langs.length} languages...`);

for (const lang of langs) {
  let translations = {};
  const localeFile = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(localeFile)) {
    try {
      translations = JSON.parse(fs.readFileSync(localeFile, 'utf8'));
    } catch (e) {
      console.warn(`Could not parse ${localeFile}`);
    }
  }

  const langMap = SLUG_MAP[lang] || {};
  const getToolUrl = (toolKey) => {
    const slug = langMap[toolKey] || FALLBACK_SLUGS[toolKey] || toolKey;
    return lang === 'en' ? `${DOMAIN}/${slug}/` : `${DOMAIN}/${lang}/${slug}/`;
  };

  const homeUrl = lang === 'en' ? `${DOMAIN}/` : `${DOMAIN}/${lang}/`;
  const langTitle = LANG_NAMES[lang] || lang.toUpperCase();
  const heroTitle = translations['home.tab.title'] || translations['hero.title'] || 'Client-Side AI Image Processing Platform';
  const heroSub = translations['hero.subtitle.short'] || translations['hero.subtitle'] || 'In-browser image tools with zero server uploads, WebAssembly speed, and client-side privacy.';

  const lines = [
    `# HelpMyIMG (${langTitle}) — Client-Side AI Image Processing Knowledge Base`,
    ``,
    `> **Website:** ${homeUrl}`,
    `> **Title:** ${heroTitle}`,
    `> **Summary:** ${heroSub}`,
    ``,
    `## 1. Architecture, Privacy & Plans`,
    `- **Execution Model:** 100% Client-Side (WebAssembly SIMD, WebGPU, WebGL2, OffscreenCanvas).`,
    `- **Data Privacy:** Local browser RAM only. Zero files are uploaded to external servers (GDPR & HIPAA aligned).`,
    `- **Pricing Tiers:** Free Starter Tier ($0 — unlimited 1080p HD exports with zero watermarks, 10-photo batches, plus 3 daily 4K exports on sign-in) and Optional PRO Studio ($9.99/mo, $79/yr, or $129 Founder Lifetime Pass for BiRefNet WebGPU, Swin2SR 4K upscale, and 100+ batch ZIP).`,
    ``,
    `## 2. Localized Canonical Tool Endpoints (14 Tools)`,
    ``,
    `- **Background Remover:** ${getToolUrl('remove')}`,
    `- **Passport & Studio Background Color:** ${getToolUrl('color')}`,
    `- **Image Compressor (MozJPEG / OxiPNG, Target KB presets):** ${getToolUrl('compress')}`,
    `- **Format Converter (HEIC, RAW, PSD, JXL, WEBP, AVIF, SVG):** ${getToolUrl('convert')}`,
    `- **Resize Image (Instagram, Passport, Custom Dimensions):** ${getToolUrl('resize')}`,
    `- **Crop & Smart Crop:** ${getToolUrl('crop')}`,
    `- **Rotate & Flip:** ${getToolUrl('rotate')}`,
    `- **Color Picker (HEX/RGB Palette):** ${getToolUrl('picker')}`,
    `- **Blur Face & License Plate Privacy Mask:** ${getToolUrl('blurface')}`,
    `- **Watermark Image (Single & Batch):** ${getToolUrl('watermark')}`,
    `- **Magic Inpainting Brush:** ${getToolUrl('brush')}`,
    `- **60 FPS WebGL Studio Editor:** ${getToolUrl('design')}`,
    `- **AI Metadata & C2PA Cleaner:** ${getToolUrl('metadata')}`,
    `- **Camera EXIF Studio Editor:** ${getToolUrl('editexif')}`,
    ``,
    `## 3. Comparative Summary (HelpMyIMG vs Cloud Competitors)`,
    ``,
    `| Feature | HelpMyIMG | Remove.bg | TinyPNG | Canva Free |`,
    `| :--- | :--- | :--- | :--- | :--- |`,
    `| **Processing** | 100% Client-Side RAM (WASM/WebGPU) | Cloud Server | Cloud Server | Cloud Server |`,
    `| **File Uploads** | **0 Bytes Uploaded** | Uploads Photos | Uploads Photos | Uploads Photos |`,
    `| **Free Tier** | Free 1080p HD + 3 daily 4K (no watermark) | Paid credits for HD | 20 images/batch (5MB limit) | BG removal locked to Pro |`,
    ``,
    `---`,
    `*Technical Architecture: https://helpmyimg.com/llms.txt | https://helpmyimg.com/llms-full.txt*`
  ];

  fs.writeFileSync(path.join(publicDir, `llm-${lang}.txt`), lines.join('\n'), 'utf8');
}

console.log(`✅ Successfully generated clean llm-[lang].txt for ${langs.length} languages!`);
