import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const newKeys = {
  // COLOR
  "landing.color.redesign.heroBadge": "INSTANT COLOR STUDIO",
  "landing.color.redesign.heroTitle": "Transform Background Colors in Real-Time",
  "landing.color.redesign.heroDesc": "Apply solid colors, smooth gradients, or custom hex codes instantly. Perfect for product photography and profile pictures, powered entirely on your browser.",
  "landing.color.redesign.feat1Title": "Infinite Color Canvas",
  "landing.color.redesign.feat1Desc": "Choose from our curated palette of conversion-optimized colors, or enter any HEX/RGB code to perfectly match your brand identity.",
  "landing.color.redesign.feat2Title": "Edge Smoothing",
  "landing.color.redesign.feat2Desc": "Colors naturally blend with your subject edges, avoiding harsh pixelated halos.",
  "landing.color.redesign.feat3Title": "Live Preview",
  "landing.color.redesign.feat3Desc": "See color changes instantly without waiting for reloads or server processing.",
  "landing.color.redesign.feat4Title": "100% Private Sandbox",
  "landing.color.redesign.feat4Desc": "The color manipulation is rendered directly on your local device's Canvas API. Zero network requests mean zero privacy risks.",
  "landing.color.redesign.whoTag": "PROFESSIONAL USES",
  "landing.color.redesign.whoTitle": "Built for Visual Creators",
  "landing.color.redesign.who1Title": "E-Commerce Catalogs",
  "landing.color.redesign.who1Desc": "Standardize product backgrounds with pure white or brand-specific hex codes for consistent store listings.",
  "landing.color.redesign.who2Title": "Profile Portraits",
  "landing.color.redesign.who2Desc": "Instantly add vibrant, eye-catching backgrounds to LinkedIn, Twitter, or corporate headshots.",
  "landing.color.redesign.who3Title": "Marketing Materials",
  "landing.color.redesign.who3Desc": "Prepare transparent assets by applying solid chroma key greens or matching ad campaign palettes.",
  "landing.color.redesign.stepsTitle": "Colorize in 3 Steps",
  "landing.color.redesign.s1Title": "Upload Image",
  "landing.color.redesign.s1Desc": "Ensure your image has a transparent background first.",
  "landing.color.redesign.s2Title": "Pick a Color",
  "landing.color.redesign.s2Desc": "Use the color picker or enter your custom HEX code.",
  "landing.color.redesign.s3Title": "Export",
  "landing.color.redesign.s3Desc": "Download your newly colored image in full resolution.",

  // RESIZE
  "landing.resize.redesign.heroBadge": "PIXEL-PERFECT SCALING",
  "landing.resize.redesign.heroTitle": "Resize Images with Absolute Precision",
  "landing.resize.redesign.heroDesc": "Scale your photos by exact pixel dimensions or percentages. Perfect for social media, websites, and printing without compromising quality.",
  "landing.resize.redesign.feat1Title": "Exact Pixel Dimensions",
  "landing.resize.redesign.feat1Desc": "Take full control over your image size. Input specific width and height values in pixels to meet strict platform requirements.",
  "landing.resize.redesign.feat1Li1": "Lock aspect ratio",
  "landing.resize.redesign.feat1Li2": "Custom width & height",
  "landing.resize.redesign.feat2Title": "Percentage Scaling",
  "landing.resize.redesign.feat2Desc": "Need it twice as large or half the size? Use the percentage slider to quickly scale images up or down proportionally.",
  "landing.resize.redesign.feat2Li1": "Quick 50% / 200% buttons",
  "landing.resize.redesign.feat2Li2": "Maintains visual quality",
  "landing.resize.redesign.socialTitle": "Perfect for Every Platform",
  "landing.resize.redesign.socialDesc": "Meet strict upload requirements for social media without hassle.",
  "landing.resize.redesign.stepsTag": "HOW IT WORKS",
  "landing.resize.redesign.stepsTitle": "Resize in 3 Steps",
  "landing.resize.redesign.s1Title": "Upload Images",
  "landing.resize.redesign.s1Desc": "Drop up to 10 photos into the tool.",
  "landing.resize.redesign.s2Title": "Set Dimensions",
  "landing.resize.redesign.s2Desc": "Input your target width and height.",
  "landing.resize.redesign.s3Title": "Save",
  "landing.resize.redesign.s3Desc": "Download the resized photos instantly.",

  // CROP
  "landing.crop.redesign.heroBadge": "SMART COMPOSITION",
  "landing.crop.redesign.heroTitle": "Crop Out the Noise.",
  "landing.crop.redesign.heroTitle2": "Focus on What Matters.",
  "landing.crop.redesign.heroDesc": "Frame your photos perfectly with freeform or fixed-ratio cropping. Cut out unwanted elements and improve image composition in seconds.",
  "landing.crop.redesign.feat1Title": "Freeform Selection",
  "landing.crop.redesign.feat1Desc": "Drag the crop box edges freely to frame your subject exactly the way you want without any dimension restrictions.",
  "landing.crop.redesign.feat2Title": "Fixed Aspect Ratios",
  "landing.crop.redesign.feat2Desc": "Need a perfect square? Or a 16:9 thumbnail? Lock the crop aspect ratio to maintain exact proportions effortlessly.",
  "landing.crop.redesign.feat3Title": "Lossless Extraction",
  "landing.crop.redesign.feat3Desc": "When you crop an image, we extract the pixels natively ensuring there is absolutely zero compression or quality loss in the process.",
  "landing.crop.redesign.stepsTag": "HOW TO CROP",
  "landing.crop.redesign.stepsTitle": "Perfect Framing in Seconds",
  "landing.crop.redesign.s1Title": "Upload Photo",
  "landing.crop.redesign.s1Desc": "Drag and drop your image into the workspace.",
  "landing.crop.redesign.s2Title": "Drag the Box",
  "landing.crop.redesign.s2Desc": "Use the corner handles to adjust the crop area.",
  "landing.crop.redesign.s3Title": "Apply & Save",
  "landing.crop.redesign.s3Desc": "Hit crop and download your extracted image."
};

const keys = Object.keys(newKeys);
const originalStrings = keys.map(k => newKeys[k]);

// Newline is reliable enough if we clean it up
const SEPARATOR = '\n';
const combinedText = originalStrings.join(SEPARATOR);

async function translateText(text, targetLang) {
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json[0].map(item => item[0]).join('');
  } catch (err) {
    throw new Error(`GTX failed: ${err.message}`);
  }
}

async function run() {
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (lang === 'en') {
      for (const [key, value] of Object.entries(newKeys)) {
        data[key] = value;
      }
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[EN] Injected English defaults.`);
      continue;
    }
    
    if (data['landing.color.redesign.heroTitle'] && data['landing.color.redesign.heroTitle'] !== newKeys['landing.color.redesign.heroTitle']) {
      console.log(`[${lang}] Already translated, skipping.`);
      continue;
    }

    console.log(`\nTranslating for ${lang}...`);
    try {
      // Very long delay to prevent 429 rate limit
      await new Promise(r => setTimeout(r, 6000));
      
      let resText = await translateText(combinedText, lang);
      
      const translatedStrings = resText.split('\n').map(s => s.trim());
      
      if (translatedStrings.length !== originalStrings.length) {
        console.error(`[${lang}] ERROR: Length mismatch! Expected ${originalStrings.length}, got ${translatedStrings.length}`);
        // If mismatch, just fallback to English
        for (let i = 0; i < keys.length; i++) {
          data[keys[i]] = originalStrings[i];
        }
      } else {
        for (let i = 0; i < keys.length; i++) {
          data[keys[i]] = translatedStrings[i] || originalStrings[i];
        }
      }
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`[${lang}] Successfully translated and injected.`);
    } catch (e) {
      console.error(`[${lang}] ERROR:`, e.message);
    }
  }
}

run();
