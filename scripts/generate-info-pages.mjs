import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// Robust single translation using Google Translate Extension (GTX) endpoint
// This endpoint is generally more permissive for small bursts of translation.
async function translateSingle(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map(x => x[0]).join('');
    }
    return text;
  } catch (err) {
    console.error(`Fetch error for ${targetLang}:`, err.message);
    throw err;
  }
}

const englishContent = {
  // --- WATERMARK FIXES ---
  "editor.settings": "Tool Settings",
  "work.badge.watermark": "Watermark",
  "work.badge.crop": "Crop",
  "work.badge.rotate": "Rotate",
  "work.badge.picker": "Color Picker",
  "watermark.textLabel": "Watermark Text",
  "watermark.color": "Text Color",
  "watermark.opacity": "Opacity",
  "watermark.scale": "Scale",
  "watermark.rotation": "Rotation",
  "watermark.position": "Position",
  "watermark.type.text": "Text",
  "watermark.type.image": "Logo / Image",
  "watermark.uploadLabel": "Upload Logo (PNG)",
  "watermark.selectLogo": "Select Logo File",
  "watermark.changeLogo": "Change Logo",
  "watermark.pos.center": "Center",
  "watermark.pos.br": "Bottom Right",
  "watermark.pos.bl": "Bottom Left",
  "watermark.pos.tr": "Top Right",
  "watermark.pos.tl": "Top Left",
  "watermark.pos.tiled": "Tiled (Repeat)",

  // --- ABOUT US MASSIVE ---
  "about.badge": "ABOUT US: THE HELPMYIMG STORY",
  "about.title": "Democratizing AI Image Editing. For Everyone. Forever.",
  "about.subtitle": "We believe powerful AI should not be locked behind expensive paywalls or privacy-invasive cloud servers. HelpMyIMG is the world's fastest, 100% offline, privacy-first AI image editor that runs entirely inside your browser.",
  "about.sec1.title": "Our Journey & Philosophy",
  "about.sec1.desc1": "The digital landscape is currently dominated by massive corporations demanding high monthly subscriptions for basic AI tools. Even worse, they require you to upload your personal, sensitive, or proprietary images to their servers—exposing your data to unknown privacy risks.",
  "about.sec1.desc2": "We envisioned a different future. A future where you don't have to choose between advanced AI capabilities and your personal privacy. A future where technology adapts to you, not the other way around.",
  "about.sec1.desc3": "HelpMyIMG was born out of this necessity. By leveraging cutting-edge WebAssembly (Wasm) and WebGL/WebGPU technologies, we successfully ported complex Machine Learning models directly into the web browser.",
  "about.sec1.bullet1": "No mandatory accounts or registrations.",
  "about.sec1.bullet2": "No sneaky hidden costs or credits.",
  "about.sec1.bullet3": "Absolute zero data harvesting.",
  "about.feature.local": "Local Execution",
  "about.feature.local.desc": "Your CPU/GPU does the heavy lifting. No cloud bottleneck.",
  "about.feature.privacy": "Zero Tracking",
  "about.feature.privacy.desc": "Your photos never leave your hard drive.",
  "about.feature.fast": "Lightning Fast",
  "about.feature.fast.desc": "0ms network latency after initial model load.",
  "about.feature.free": "Always Free",
  "about.feature.free.desc": "We have zero server costs, so it's free for you.",
  "about.tech.title": "The Technology Behind the Magic",
  "about.tech.subtitle": "How do we run advanced background removal and image manipulation locally?",
  "about.tech.b1.title": "WebAssembly (Wasm)",
  "about.tech.b1.desc": "We compile heavy machine learning frameworks like ONNX Runtime directly into Wasm, allowing them to run at near-native speeds right inside your browser engine.",
  "about.tech.b2.title": "Hardware Acceleration",
  "about.tech.b2.desc": "Using WebGL and the upcoming WebGPU standard, HelpMyIMG taps directly into your device's Graphics Processing Unit (GPU) for massively parallel AI calculations.",
  "about.tech.b3.title": "Optimized ONNX Models",
  "about.tech.b3.desc": "We use ultra-optimized, quantized AI models (like RMBG-1.4) that are small enough to download instantly, yet powerful enough to deliver pixel-perfect cutouts.",
  "about.green.badge": "ENVIRONMENTAL IMPACT",
  "about.green.title": "Zero Server Architecture = Green Technology",
  "about.green.desc1": "Traditional cloud AI editors consume massive amounts of electricity maintaining server farms and transmitting heavy image files back and forth across the globe.",
  "about.green.desc2": "Because HelpMyIMG operates completely locally on your device, we bypass the cloud entirely. This eliminates the carbon footprint associated with server-side AI processing and data transmission.",
  "about.green.stat1": "Server Processing Energy",
  "about.green.stat2": "Local Efficiency",
  "about.mission.title": "Privacy by Design",
  "about.mission.quote": "Your creativity belongs to you. We don't store your images, we don't train on your data, and we don't track your activity.",
  "about.madeWithLove": "Made with passion for the open web",

  // --- PRIVACY POLICY MASSIVE ---
  "privacy.badge": "PRIVACY POLICY",
  "privacy.title": "Absolute Privacy Policy",
  "privacy.lastUpdated": "Effective Date: July 11, 2026",
  "privacy.highlight.title": "TL;DR: Your Data Stays Yours",
  "privacy.highlight.desc": "Unlike 99% of AI tools on the market, HelpMyIMG processes your images LOCALLY. We do NOT upload, store, view, or train our AI models on your photos. Your data never leaves your computer.",
  "privacy.tag.noUploads": "Zero Uploads",
  "privacy.tag.noTracking": "No Tracking",
  "privacy.tag.offline": "Works Offline",
  "privacy.intro": "At HelpMyIMG, we consider privacy to be a fundamental human right. This Privacy Policy is uniquely short regarding data collection because we deliberately collect almost nothing. Below is a detailed breakdown of how our architecture protects you.",
  "privacy.s1.title": "Local Processing (In-Browser Execution)",
  "privacy.s1.desc1": "When you use tools like Remove Background, Convert, or Watermark, the entire processing pipeline is executed inside a secure 'sandbox' within your web browser (Chrome, Safari, Edge, etc.).",
  "privacy.s1.desc2": "Instead of uploading your 5MB photo to a remote server, your browser downloads a small 15MB AI model ONCE. From then on, your computer's CPU/GPU processes the image. Your image data never traverses the internet.",
  "privacy.s2.title": "Data Collection & Analytics",
  "privacy.s2.desc1": "We DO NOT collect, harvest, or transmit any image files, metadata (EXIF), or personal identification information.",
  "privacy.s2.desc2": "To maintain our service, we use highly anonymized web analytics (such as Vercel Web Analytics or Cloudflare Web Analytics). This collects strictly non-personal telemetry:",
  "privacy.s2.bullet1": "Total page views per day.",
  "privacy.s2.bullet2": "General geographic region (e.g., 'United States' or 'Indonesia') to route traffic.",
  "privacy.s2.bullet3": "Browser type (to optimize our WebAssembly models for specific engines).",
  "privacy.s3.title": "Cookies and Local Storage",
  "privacy.s3.desc1": "We do not use invasive third-party tracking cookies, advertising pixels, or cross-site tracking scripts.",
  "privacy.s3.desc2": "We use your browser's Local Storage API exclusively to save your UI preferences (such as your chosen language, Dark/Light mode preference, and your last used Watermark settings). This data remains on your hard drive.",
  "privacy.s4.title": "Third-Party Services & AI Training",
  "privacy.s4.desc1": "Because our application runs locally, no third-party APIs have access to your images. We do not use OpenAI, Replicate, or HuggingFace cloud APIs to process your photos.",
  "privacy.s4.desc2": "Consequently, your personal images are NEVER used to train, fine-tune, or improve our AI models or any third-party AI models.",
  "privacy.s5.title": "Children's Privacy (COPPA)",
  "privacy.s5.desc1": "Our services are safe for all ages. Because we do not collect personal data, we are inherently compliant with the Children's Online Privacy Protection Act (COPPA).",
  "privacy.s5.desc2": "We do not knowingly collect personal information from children under 13.",
  "privacy.s6.title": "Contact Our Privacy Team",
  "privacy.s6.desc": "If you have any questions, concerns, or require further clarification regarding our technical privacy measures or GDPR/CCPA compliance, our Data Protection Officer is ready to assist.",

  // --- TERMS OF SERVICE MASSIVE ---
  "terms.badge": "TERMS OF SERVICE",
  "terms.title": "Terms of Service",
  "terms.lastUpdated": "Effective Date: July 11, 2026",
  "terms.intro": "Welcome to HelpMyIMG. By accessing or using our website, tools, and services, you agree to be bound by these Terms of Service. Please read them carefully as they govern your legal rights and obligations.",
  "terms.s1.title": "Acceptance of Terms",
  "terms.s1.desc1": "By accessing this website, you agree to be bound by these Terms and Conditions of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.",
  "terms.s1.desc2": "If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.",
  "terms.s2.title": "Use License & Restrictions",
  "terms.s2.desc1": "Permission is granted to temporarily download one copy of the web application codebase into your browser's memory for personal or commercial transitory viewing and execution only. This is the grant of a license, not a transfer of title.",
  "terms.s2.bullet1": "You may not modify, decompile, reverse engineer, or extract the proprietary AI models provided within the service.",
  "terms.s2.bullet2": "You may not use the service to systematically scrape, DDoS, or attempt to compromise our delivery networks.",
  "terms.s2.bullet3": "You may use the processed outputs (images) for any commercial or non-commercial purpose.",
  "terms.s3.title": "Fair Use and Acceptable Content",
  "terms.s3.desc1": "While HelpMyIMG processes images locally on your device, you are solely responsible for the content you process. You agree not to use our tools to generate, alter, or facilitate illegal, harmful, or explicitly offensive content.",
  "terms.s3.desc2": "We do not monitor your content (as we cannot see it), but you assume all legal liability for copyright infringement or illegal material generated using our software.",
  "terms.s4.title": "Intellectual Property Rights",
  "terms.s4.desc1": "You retain 100% ownership and all intellectual property rights to the original images you process using HelpMyIMG, as well as the resulting generated outputs.",
  "terms.s4.desc2": "HelpMyIMG claims absolutely zero copyright, usage rights, or ownership over your creative works.",
  "terms.s5.title": "Service Availability & Modifications",
  "terms.s5.desc1": "We strive for 100% uptime by hosting our static assets on a global CDN. However, our service is provided 'as is'. We do not guarantee uninterrupted access.",
  "terms.s5.desc2": "HelpMyIMG reserves the right to modify, suspend, or discontinue any tool, feature, or service without prior notice or liability.",
  "terms.s6.title": "Limitation of Liability",
  "terms.s6.desc1": "In no event shall HelpMyIMG, its developers, or its suppliers be liable for any damages (including, without limitation, damages for loss of data, loss of profit, or business interruption) arising out of the use or inability to use the tools on HelpMyIMG, even if notified orally or in writing of the possibility of such damage.",
  "terms.s7.title": "Dispute Resolution & Contact",
  "terms.s7.desc1": "Any claims relating to HelpMyIMG's website shall be governed by the laws of the jurisdiction in which the core development team operates, without regard to its conflict of law provisions.",

  // --- FAQ MASSIVE ---
  "faq.badge": "HELP CENTER & FAQ",
  "faq.title": "Frequently Asked Questions",
  "faq.subtitle": "Everything you need to know about our privacy-first AI tools, limits, formats, and how they work directly in your browser.",
  "faq.cat.general": "General",
  "faq.cat.privacy": "Privacy & Security",
  "faq.cat.tech": "Technology",
  "faq.cat.usage": "Usage & Limits",
  "faq.q1": "How is HelpMyIMG completely free?",
  "faq.a1": "Traditional AI editors charge you because they have to pay for expensive cloud GPUs to process your images. We use groundbreaking WebAssembly technology to run the AI models directly on YOUR device's CPU/GPU. Since you provide the computing power, we have zero server costs, allowing us to offer the service entirely for free without ads or paywalls.",
  "faq.q2": "Do I need to create an account?",
  "faq.a2": "No. HelpMyIMG is designed to be frictionless. There are no sign-ups, no logins, and no email collections required. Just open the tool and start editing immediately.",
  "faq.q3": "Can I use HelpMyIMG on my smartphone?",
  "faq.a3": "Yes! HelpMyIMG is fully responsive and works on modern iOS and Android browsers (Safari, Chrome). However, because the AI processing happens on your device, older or budget smartphones may take slightly longer to process complex images compared to a desktop computer.",
  "faq.q4": "Are my images uploaded to the cloud?",
  "faq.a4": "No! This is our biggest advantage. 100% of the image processing happens locally within your web browser. Your images never leave your device, ensuring absolute privacy, security, and confidentiality.",
  "faq.q5": "Do you use my photos to train AI?",
  "faq.a5": "Absolutely not. Because your photos never leave your device, it is technically impossible for us to use them for AI training, machine learning, or any other data harvesting purposes.",
  "faq.q6": "Is HelpMyIMG GDPR and CCPA compliant?",
  "faq.a6": "Yes. Because we do not collect, process, or store any personal data or user files on our servers, HelpMyIMG is inherently compliant with strict global privacy frameworks like GDPR (Europe) and CCPA (California).",
  "faq.q7": "Why is the first time I use a tool slightly slower?",
  "faq.a7": "When you use an AI tool for the first time, your browser securely downloads the AI model (usually 10-30MB) into your browser's local cache. Subsequent uses will be lightning fast because the model is already stored locally on your device.",
  "faq.q8": "Can I use HelpMyIMG completely offline?",
  "faq.a8": "Yes! Once you have visited the site and the AI models are cached in your browser, you can disconnect your Wi-Fi or turn on Airplane mode, and the background removal tools will continue to work flawlessly completely offline.",
  "faq.q9": "What is WebAssembly (Wasm)?",
  "faq.a9": "WebAssembly is a modern web standard that allows code written in languages like C++ and Rust to run on the web at near-native speeds. It's the magic that allows our heavy AI models to run inside your browser without crashing.",
  "faq.q10": "Is there a limit to how many images I can process?",
  "faq.a10": "No limits! Because the processing happens on your device, you can process 10, 100, or 1000 images. We do not impose any artificial caps, credits, or paywalls. Process as much as your computer can handle.",
  "faq.q11": "What image formats are supported?",
  "faq.a11": "We currently support JPG, PNG, WEBP, and BMP for uploads. For downloads, we offer HD PNGs (preserving transparency) or optimized JPGs depending on the tool you use.",
  "faq.q12": "Is there a maximum image resolution?",
  "faq.a12": "While there is no hard limit imposed by our software, very large images (e.g., above 8K resolution) might crash your browser tab if your device runs out of RAM during processing. For best performance, we recommend images under 25 Megapixels.",
  "faq.more.title": "Still have questions?",
  "faq.more.desc": "We're here to help. Reach out to our support team and we'll get back to you as soon as possible."
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function processTranslations() {
  let totalKeys = Object.keys(englishContent).length;
  console.log(`Starting massive translation for ${totalKeys} keys across ${languages.length} languages...`);
  
  for (const lang of languages) {
    if (lang === 'en') {
        const filePath = path.join(localesDir, 'en', 'translation.json');
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        Object.assign(data, englishContent);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        continue;
    }

    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;

    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updated = false;

    // Collect keys to translate
    let keysToTranslate = [];
    for (const [key, text] of Object.entries(englishContent)) {
      if (!data[key] || data[key] === text) {
        keysToTranslate.push(key);
      }
    }

    if (keysToTranslate.length === 0) continue;

    console.log(`\n--- [${lang}] Translating ${keysToTranslate.length} missing/fallback keys line-by-line ---`);
    
    for (let i = 0; i < keysToTranslate.length; i++) {
        const key = keysToTranslate[i];
        const text = englishContent[key];
        
        try {
            const translatedText = await translateSingle(text, lang);
            if (translatedText && translatedText !== text) {
                data[key] = translatedText;
                updated = true;
                // console.log(`[${lang}] Success: ${key}`);
            } else {
                // If the GTX API surprisingly returns english back, set english
                if (!data[key]) {
                    data[key] = text;
                    updated = true;
                }
            }
        } catch (e) {
            console.error(`[${lang}] Error on ${key}. Sticking to fallback.`);
            if (!data[key]) {
                data[key] = text;
                updated = true;
            }
        }
        
        // Critical: Delay to respect rate limits of Google's public endpoint
        await delay(150); 
    }
    
    if (updated) {
       fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
       console.log(`[${lang}] Saved translation.json successfully!`);
    }
  }
}

processTranslations().then(() => console.log('\n✅ All massive translations generated successfully!'));
