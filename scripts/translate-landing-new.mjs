import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPPORTED_LANGUAGES = [
  'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he', 'hi', 'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sv', 'th', 'tl', 'tr', 'uk', 'vi', 'zh'
];

const englishTexts = {
  // BLUR FACE LANDING
  "landing.blurface.why.tag": "Instant Privacy",
  "landing.blurface.why.title": "Protect Identities in Seconds",
  "landing.blurface.why.desc": "Easily blur faces or sensitive information from your photos before sharing.",
  "landing.blurface.why.card1.title": "AI Face Detection",
  "landing.blurface.why.card1.desc": "Automatically finds and blurs multiple faces in your image.",
  "landing.blurface.why.card1.badge": "Smart AI",
  "landing.blurface.why.card2.title": "Custom Blur Areas",
  "landing.blurface.why.card2.desc": "Draw your own blur boxes anywhere on the image.",
  "landing.blurface.why.card2.badge": "Flexible",
  "landing.blurface.why.card3.title": "100% Private",
  "landing.blurface.why.card3.desc": "All blurring happens directly in your browser. No uploads.",
  "landing.blurface.why.card3.badge": "Secure",
  "landing.blurface.why.card4.title": "High Quality",
  "landing.blurface.why.card4.desc": "Maintains the original resolution and quality of your photo.",
  "landing.blurface.why.card4.badge": "Lossless",
  "landing.blurface.who.tag": "For Everyone",
  "landing.blurface.who.title": "Who uses Blur Face?",
  "landing.blurface.who.desc": "Essential for privacy-conscious users and professionals.",
  "landing.blurface.who.c1.title": "Parents",
  "landing.blurface.who.c1.badge": "Safety",
  "landing.blurface.who.c1.desc": "Protecting kids",
  "landing.blurface.who.c1.l1": "Hide children's faces",
  "landing.blurface.who.c1.l2": "Safe social media",
  "landing.blurface.who.c2.title": "Journalists",
  "landing.blurface.who.c2.badge": "Privacy",
  "landing.blurface.who.c2.desc": "Protecting sources",
  "landing.blurface.who.c2.l1": "Anonymize subjects",
  "landing.blurface.who.c2.l2": "Hide sensitive docs",
  "landing.blurface.who.c3.title": "Teachers",
  "landing.blurface.who.c3.badge": "Compliance",
  "landing.blurface.who.c3.desc": "Student privacy",
  "landing.blurface.who.c3.l1": "Blur student faces",
  "landing.blurface.who.c3.l2": "FERPA compliance",
  "landing.blurface.who.c4.title": "Everyone",
  "landing.blurface.who.c4.badge": "General",
  "landing.blurface.who.c4.desc": "Everyday use",
  "landing.blurface.who.c4.l1": "Hide license plates",
  "landing.blurface.who.c4.l2": "Blur photobombers",
  "landing.blurface.work.tag": "Simple Steps",
  "landing.blurface.work.title": "How it works",
  "landing.blurface.work.desc": "Three simple steps to protect privacy.",
  "landing.blurface.work.s1.title": "Upload Image",
  "landing.blurface.work.s1.desc": "Select the photo you want to anonymize.",
  "landing.blurface.work.s2.title": "Apply Blur",
  "landing.blurface.work.s2.desc": "Use AI detection or draw custom blur boxes.",
  "landing.blurface.work.s3.title": "Download",
  "landing.blurface.work.s3.desc": "Save the anonymized image instantly.",
  "landing.blurface.proof.tag": "Testimonials",
  "landing.blurface.proof.title": "What users say",
  "landing.blurface.proof.desc": "Trusted by thousands for privacy protection.",
  "landing.blurface.proof.q1": "Super fast and easy. I love that it doesn't upload my photos to any server.",
  "landing.blurface.proof.t1.role": "Parent",
  "landing.blurface.proof.q2": "Perfect for blurring out sensitive information in documents before sharing.",
  "landing.blurface.proof.t2.role": "Accountant",
  "landing.blurface.proof.q3": "The auto face detection is surprisingly accurate and saves me so much time.",
  "landing.blurface.proof.t3.role": "Photographer",

  // DESIGN EDITOR LANDING
  "landing.design.why.tag": "Creative Studio",
  "landing.design.why.title": "Full-Featured Image Editor",
  "landing.design.why.desc": "Everything you need to edit, annotate, and enhance your photos right in the browser.",
  "landing.design.why.card1.title": "Rich Annotations",
  "landing.design.why.card1.desc": "Add text, arrows, shapes, and freehand drawings to your images.",
  "landing.design.why.card1.badge": "Tools",
  "landing.design.why.card2.title": "Filters & Tuning",
  "landing.design.why.card2.desc": "Apply beautiful filters or fine-tune brightness, contrast, and saturation.",
  "landing.design.why.card2.badge": "Enhance",
  "landing.design.why.card3.title": "Watermarks",
  "landing.design.why.card3.desc": "Easily add image or text watermarks to protect your creative work.",
  "landing.design.why.card3.badge": "Protect",
  "landing.design.why.card4.title": "100% Private",
  "landing.design.why.card4.desc": "All editing is done locally. Your photos never leave your device.",
  "landing.design.why.card4.badge": "Secure",
  "landing.design.who.tag": "For Creators",
  "landing.design.who.title": "Who uses Design Editor?",
  "landing.design.who.desc": "Perfect for social media, marketing, and quick edits.",
  "landing.design.who.c1.title": "Marketers",
  "landing.design.who.c1.badge": "Social",
  "landing.design.who.c1.desc": "Social Media Posts",
  "landing.design.who.c1.l1": "Add engaging text",
  "landing.design.who.c1.l2": "Apply brand filters",
  "landing.design.who.c2.title": "Designers",
  "landing.design.who.c2.badge": "Creative",
  "landing.design.who.c2.desc": "Quick mockups",
  "landing.design.who.c2.l1": "Annotate feedback",
  "landing.design.who.c2.l2": "Crop & resize",
  "landing.design.who.c3.title": "Sellers",
  "landing.design.who.c3.badge": "E-commerce",
  "landing.design.who.c3.desc": "Product photos",
  "landing.design.who.c3.l1": "Add watermarks",
  "landing.design.who.c3.l2": "Enhance colors",
  "landing.design.who.c4.title": "Everyone",
  "landing.design.who.c4.badge": "Casual",
  "landing.design.who.c4.desc": "Everyday edits",
  "landing.design.who.c4.l1": "Meme creation",
  "landing.design.who.c4.l2": "Photo tuning",
  "landing.design.work.tag": "Easy Editing",
  "landing.design.work.title": "How it works",
  "landing.design.work.desc": "Three simple steps to stunning photos.",
  "landing.design.work.s1.title": "Upload Image",
  "landing.design.work.s1.desc": "Select a photo to start editing.",
  "landing.design.work.s2.title": "Edit & Enhance",
  "landing.design.work.s2.desc": "Add text, filters, shapes, and more.",
  "landing.design.work.s3.title": "Save Design",
  "landing.design.work.s3.desc": "Download your finished masterpiece.",
  "landing.design.proof.tag": "Testimonials",
  "landing.design.proof.title": "What users say",
  "landing.design.proof.desc": "Loved by creators everywhere.",
  "landing.design.proof.q1": "It has all the features I need to quickly edit photos for my blog without opening Photoshop.",
  "landing.design.proof.t1.role": "Blogger",
  "landing.design.proof.q2": "The watermarking tool is a lifesaver for protecting my artwork.",
  "landing.design.proof.t2.role": "Artist",
  "landing.design.proof.q3": "I love how fast it is. No waiting for uploads, just instant editing.",
  "landing.design.proof.t3.role": "Social Media Manager"
};

async function main() {
  for (const lang of SUPPORTED_LANGUAGES) {
    const localesPath = path.resolve(__dirname, `../public/locales/${lang}/translation.json`);
    
    if (fs.existsSync(localesPath)) {
      const json = JSON.parse(fs.readFileSync(localesPath, 'utf8'));
      let needsUpdate = false;
      
      for (const [key, text] of Object.entries(englishTexts)) {
        if (!json[key]) {
          json[key] = text; // Fallback to English
          needsUpdate = true;
        }
      }
      
      if (needsUpdate) {
        fs.writeFileSync(localesPath, JSON.stringify(json, null, 2) + '\n');
        console.log(`Updated translations for ${lang}`);
      }
    }
  }
  
  console.log('Done!');
}

main().catch(console.error);
