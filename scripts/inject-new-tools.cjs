// scripts/inject-new-tools.js
const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const newStrings = {
  compress: {
    "nav.compress": "Compress Image",
    "landing.default.title.compress": "Compress Image to WebP/JPEG Online",
    "landing.default.desc.compress": "Reduce image file size instantly up to 90% while keeping high quality. 100% Free, Private, and Client-Side.",
    "landing.compress.faqTitle": "Image Compression FAQ",
    "landing.compress.faq1.q": "Is my image uploaded to your server?",
    "landing.compress.faq1.a": "No, all compression is done locally in your browser using HTML5 Canvas. Your files never leave your device.",
    "landing.compress.faq2.q": "What formats are supported?",
    "landing.compress.faq2.a": "You can compress PNG, JPEG, and WEBP images. The output will be highly optimized.",
    "work.badge.compress": "COMPRESSOR",
    "compress.quality": "Compression Quality",
    "compress.hint": "Lower quality means smaller file size but less clarity."
  },
  convert: {
    "nav.convert": "Convert Image",
    "landing.default.title.convert": "Convert Image Format Online (PNG/JPG/WEBP)",
    "landing.default.desc.convert": "Change image formats in your browser with zero latency. 100% free and secure without server uploads.",
    "landing.convert.faqTitle": "Format Converter FAQ",
    "landing.convert.faq1.q": "Is it safe to convert sensitive images?",
    "landing.convert.faq1.a": "Yes! We use local client-side technology. Your images are never uploaded or stored anywhere.",
    "landing.convert.faq2.q": "Is there a file size limit?",
    "landing.convert.faq2.a": "No strict limits since it runs in your browser, but extremely large images might slow down your device.",
    "work.badge.convert": "CONVERTER",
    "convert.format": "Target Format"
  },
  resize: {
    "nav.resize": "Resize Image",
    "landing.default.title.resize": "Resize Image Dimensions Online",
    "landing.default.desc.resize": "Change image width and height easily. Maintain aspect ratio and scale images instantly in your browser.",
    "landing.resize.faqTitle": "Image Resizer FAQ",
    "landing.resize.faq1.q": "Will resizing lose image quality?",
    "landing.resize.faq1.a": "Downscaling generally keeps good quality. Upscaling might cause some pixelation, but we use high-quality canvas rendering.",
    "landing.resize.faq2.q": "Can I lock the aspect ratio?",
    "landing.resize.faq2.a": "Yes, just click the link icon to lock or unlock the aspect ratio while resizing.",
    "work.badge.resize": "RESIZER",
    "resize.dimensions": "Image Dimensions",
    "resize.lock": "Lock Aspect Ratio",
    "resize.unlock": "Unlock Aspect Ratio"
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Inject if not exists
    let updated = false;
    for (const [tool, strings] of Object.entries(newStrings)) {
      for (const [key, value] of Object.entries(strings)) {
        if (!data[key]) {
          data[key] = value; // Fallback to English, assuming AI will translate later if needed, but for now we need the keys to exist so it doesn't crash.
          updated = true;
        }
      }
    }
    
    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated ${lang}`);
    }
  }
});
