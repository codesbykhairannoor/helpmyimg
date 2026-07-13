const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const enBase = {
  picker: {
    'why.tag': "Why Color Picker?",
    'why.title': "Extract Perfect Colors from Any Image",
    'why.desc': "A professional-grade color extraction tool directly in your browser. Get exact HEX, RGB, HSL, and CMYK values instantly without uploading your images to the cloud.",
    'why.card1.title': "Instant Extraction", 'why.card1.desc': "Click anywhere to grab the exact color code.", 'why.card1.badge': "0ms Latency",
    'why.card2.title': "100% Private", 'why.card2.desc': "Your images never leave your browser. Zero cloud uploads.", 'why.card2.badge': "Secure",
    'why.card3.title': "Multiple Formats", 'why.card3.desc': "Get color codes in HEX, RGB, HSL, and CMYK.", 'why.card3.badge': "Versatile",
    'why.card4.title': "History & Palette", 'why.card4.desc': "Automatically generates a dominant color palette.", 'why.card4.badge': "Smart",
    'who.tag': "Who is it for?",
    'who.title': "Perfect for Creatives & Developers",
    'who.desc': "Essential for anyone working with digital media, web design, or branding.",
    'who.c1.title': "Web Developers", 'who.c1.badge': "UI/UX", 'who.c1.desc': "Extract exact colors from design mockups to build pixel-perfect user interfaces.", 'who.c1.l1': "CSS ready HEX/RGB", 'who.c1.l2': "Match brand colors",
    'who.c2.title': "Graphic Designers", 'who.c2.badge': "Branding", 'who.c2.desc': "Build consistent brand guidelines by extracting the exact palette.", 'who.c2.l1': "Discover dominant colors", 'who.c2.l2': "Create mood boards",
    'who.c3.title': "Digital Artists", 'who.c3.badge': "Illustration", 'who.c3.desc': "Sample colors from real-life reference photos.", 'who.c3.l1': "Color accuracy", 'who.c3.l2': "Palette generation",
    'who.c4.title': "Marketers", 'who.c4.badge': "Content", 'who.c4.desc': "Ensure your social media graphics perfectly match product colors.", 'who.c4.l1': "Consistent styling", 'who.c4.l2': "Brand alignment",
    'work.tag': "How it Works",
    'work.title': "Extract Colors in 3 Steps",
    'work.desc': "No software installation needed. Get your color codes right in the browser.",
    'work.s1.title': "Upload Image", 'work.s1.desc': "Drag and drop your image or paste from clipboard.",
    'work.s2.title': "Pick a Color", 'work.s2.desc': "Click anywhere on the image to sample the pixel color.",
    'work.s3.title': "Copy Code", 'work.s3.desc': "Click to copy the HEX code to your clipboard.",
    'proof.tag': "Testimonials",
    'proof.title': "Loved by Designers Worldwide",
    'proof.desc': "See what creative professionals are saying about our privacy-first color picker.",
    'proof.t1.role': "UI/UX Designer", 'proof.t2.role': "Frontend Developer", 'proof.t3.role': "Brand Strategist",
    'proof.q1': "Finally, a color picker that doesn't upload my confidential unreleased product photos to a server!",
    'proof.q2': "The instant HEX copy feature saves me time when translating mockups to CSS.",
    'proof.q3': "I use this daily to extract brand palettes for my marketing campaigns. Flawless.",
    'faqTitle': "Color Picker FAQs",
    'faq1.q': "Do you save the images I upload?", 'faq1.a': "No. Everything runs inside your browser securely.",
    'faq2.q': "What color formats are supported?", 'faq2.a': "We support HEX, RGB, HSL, and CMYK."
  },
  crop: {
    'why.tag': "Why Image Cropper?",
    'why.title': "Precise Image Cropping Without Losing Quality",
    'why.desc': "Crop your photos perfectly for social media, passports, or web design using our secure client-side cropping engine.",
    'why.card1.title': "Pixel Perfect", 'why.card1.desc': "Define your crop area using exact pixel dimensions.", 'why.card1.badge': "Precise",
    'why.card2.title': "100% Private", 'why.card2.desc': "Your images are cropped locally in your browser. No server uploads.", 'why.card2.badge': "Secure",
    'why.card3.title': "Smart Presets", 'why.card3.desc': "Instantly crop to 1:1, 16:9, 4:3 or standard passport sizes.", 'why.card3.badge': "Fast",
    'why.card4.title': "Zero Compression", 'why.card4.desc': "Maintains your original image quality after cropping.", 'why.card4.badge': "High Quality",
    'who.tag': "Who is it for?",
    'who.title': "The Essential Tool for Everyone",
    'who.desc': "From social media managers to regular users needing a passport photo.",
    'who.c1.title': "Social Media Managers", 'who.c1.badge': "Content", 'who.c1.desc': "Crop images perfectly for Instagram squares or YouTube thumbnails.", 'who.c1.l1': "Standard ratio presets", 'who.c1.l2': "No quality loss",
    'who.c2.title': "Photographers", 'who.c2.badge': "Editing", 'who.c2.desc': "Adjust image framing without opening heavy desktop software.", 'who.c2.l1': "Rule of thirds", 'who.c2.l2': "Custom dimensions",
    'who.c3.title': "Job Seekers", 'who.c3.badge': "Documents", 'who.c3.desc': "Crop your headshots to official 3x4 or 4x6 sizes for CVs.", 'who.c3.l1': "Passport sizing", 'who.c3.l2': "Professional look",
    'who.c4.title': "Web Masters", 'who.c4.badge': "Performance", 'who.c4.desc': "Crop hero images and banners to exact dimensions.", 'who.c4.l1': "Exact pixel control", 'who.c4.l2': "Fast processing",
    'work.tag': "How it Works",
    'work.title': "Crop Images in 3 Steps",
    'work.desc': "The fastest way to crop photos privately.",
    'work.s1.title': "Upload Photo", 'work.s1.desc': "Select the image you want to crop from your device.",
    'work.s2.title': "Select Area", 'work.s2.desc': "Drag the crop box or select a preset aspect ratio.",
    'work.s3.title': "Save Image", 'work.s3.desc': "Click apply and download your perfectly cropped image.",
    'proof.tag': "Testimonials",
    'proof.title': "Trusted for Daily Use",
    'proof.desc': "Join thousands of users who rely on our secure cropping tool.",
    'proof.t1.role': "Social Media Manager", 'proof.t2.role': "Web Designer", 'proof.t3.role': "Photographer",
    'proof.q1': "I need to crop dozens of images a day for Instagram. The 1:1 preset makes this my go-to.",
    'proof.q2': "Being able to specify exact pixel dimensions saves me from opening Photoshop.",
    'proof.q3': "It maintains the original color profile and resolution, which is critical.",
    'faqTitle': "Cropping FAQs",
    'faq1.q': "Is the cropping tool free?", 'faq1.a': "Yes, completely free with no limits.",
    'faq2.q': "Does it reduce image quality?", 'faq2.a': "No, we maintain the original pixel quality."
  },
  rotate: {
    'why.tag': "Why Image Rotator?",
    'why.title': "Rotate & Flip Images Instantly",
    'why.desc': "Fix sideways photos, mirror images, or apply custom angle rotations directly in your browser.",
    'why.card1.title': "Custom Angles", 'why.card1.desc': "Rotate by 90 degrees or use the slider for precise angles.", 'why.card1.badge': "Flexible",
    'why.card2.title': "100% Private", 'why.card2.desc': "Process your private photos securely without uploading them.", 'why.card2.badge': "Secure",
    'why.card3.title': "Flip & Mirror", 'why.card3.desc': "Easily flip your images horizontally or vertically.", 'why.card3.badge': "Versatile",
    'why.card4.title': "Batch Processing", 'why.card4.desc': "Rotate multiple images at once to save time.", 'why.card4.badge': "Efficient",
    'who.tag': "Who is it for?",
    'who.title': "Perfect for Fixing Orientation",
    'who.desc': "The ultimate tool for correcting photos taken sideways or upside down.",
    'who.c1.title': "Phone Photographers", 'who.c1.badge': "Fix Photos", 'who.c1.desc': "Quickly fix photos taken in the wrong orientation.", 'who.c1.l1': "Instant 90° rotation", 'who.c1.l2': "Fix upside-down photos",
    'who.c2.title': "Selfie Lovers", 'who.c2.badge': "Mirroring", 'who.c2.desc': "Flip your selfies horizontally so texts on your shirt are readable.", 'who.c2.l1': "Horizontal flip", 'who.c2.l2': "Read un-mirrored text",
    'who.c3.title': "Graphic Designers", 'who.c3.badge': "Layouts", 'who.c3.desc': "Rotate design assets to specific custom angles for complex layouts.", 'who.c3.l1': "Precise custom angles", 'who.c3.l2': "No quality degradation",
    'who.c4.title': "Archivists", 'who.c4.badge': "Scanning", 'who.c4.desc': "Correct the orientation of scanned documents efficiently.", 'who.c4.l1': "Document orientation", 'who.c4.l2': "Clear results",
    'work.tag': "How it Works",
    'work.title': "Rotate Images in 3 Steps",
    'work.desc': "Correct your image orientation in seconds.",
    'work.s1.title': "Select Image", 'work.s1.desc': "Choose the photo you need to rotate or flip.",
    'work.s2.title': "Adjust Orientation", 'work.s2.desc': "Click the rotate/flip buttons or drag the angle slider.",
    'work.s3.title': "Download Result", 'work.s3.desc': "Save your corrected image immediately to your device.",
    'proof.tag': "Testimonials",
    'proof.title': "Loved for its Simplicity",
    'proof.desc': "Read why users prefer our rotation tool over native gallery apps.",
    'proof.t1.role': "Content Creator", 'proof.t2.role': "Student", 'proof.t3.role': "Office Worker",
    'proof.q1': "My phone always saves selfies backwards. The horizontal flip feature is a lifesaver!",
    'proof.q2': "I scan a lot of documents that end up upside down. This tool fixes them instantly.",
    'proof.q3': "The custom angle rotation lets me straighten horizon lines perfectly.",
    'faqTitle': "Rotating FAQs",
    'faq1.q': "Can I rotate by exact degrees?", 'faq1.a': "Yes, you can use the slider to set any custom degree.",
    'faq2.q': "Does flipping lose quality?", 'faq2.a': "No, we use lossless transformation for flips."
  }
};

async function run() {
  for (const lang of languages) {
    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    let updated = false;

    // We'll process all missing keys for this language in a single batch API call
    let batchKeys = [];
    let batchValues = [];

    for (const tool of ['picker', 'crop', 'rotate']) {
      if (data[`landing.${tool}.why.title`]) {
        continue;
      }
      
      const base = enBase[tool];
      for (const [key, value] of Object.entries(base)) {
        const fullKey = `landing.${tool}.${key}`;
        if (lang === 'en') {
          data[fullKey] = value;
          updated = true;
        } else {
          batchKeys.push(fullKey);
          batchValues.push(value);
        }
      }
    }

    if (lang !== 'en' && batchKeys.length > 0) {
      console.log(`[${lang}] Translating ${batchKeys.length} keys...`);
      
      // Delimiter for joining
      const delimiter = ' ||| ';
      const joinedString = batchValues.join(delimiter);
      
      try {
        const res = await translate(joinedString, { to: lang });
        const translatedValues = res.text.split(delimiter).map(s => s.trim());
        
        if (translatedValues.length === batchValues.length) {
          batchKeys.forEach((key, idx) => {
            data[key] = translatedValues[idx];
          });
          updated = true;
        } else {
          console.error(`[${lang}] Mismatch in split! Expected ${batchValues.length}, got ${translatedValues.length}`);
          // Fallback to English if split fails
          batchKeys.forEach((key, idx) => {
            data[key] = batchValues[idx];
          });
          updated = true;
        }
      } catch (err) {
        console.error(`[${lang}] Translation failed:`, err.message);
        batchKeys.forEach((key, idx) => {
          data[key] = batchValues[idx];
        });
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`[${lang}] Successfully saved translation.json`);
    }
  }
}

run().catch(console.error);
