const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const dict = {
  ar: { free: 'مجاني', fast: 'سريع', private: 'خاص', easy: 'سهل' },
  bg: { free: 'Безплатно', fast: 'Бързо', private: 'Частен', easy: 'Лесно' },
  cs: { free: 'Zdarma', fast: 'Rychlý', private: 'Soukromé', easy: 'Snadné' },
  da: { free: 'Gratis', fast: 'Hurtig', private: 'Privat', easy: 'Nemt' },
  de: { free: 'Kostenlos', fast: 'Schnell', private: 'Privat', easy: 'Einfach' },
  el: { free: 'Δωρεάν', fast: 'Γρήγορα', private: 'Ιδιωτικό', easy: 'Εύκολο' },
  en: { free: 'Free', fast: 'Fast', private: 'Private', easy: 'Easy' },
  es: { free: 'Gratis', fast: 'Rápido', private: 'Privado', easy: 'Fácil' },
  fi: { free: 'Ilmainen', fast: 'Nopea', private: 'Yksityinen', easy: 'Helppo' },
  fr: { free: 'Gratuit', fast: 'Rapide', private: 'Privé', easy: 'Facile' },
  he: { free: 'חינם', fast: 'מהיר', private: 'פרטי', easy: 'קל' },
  hi: { free: 'मुफ़्त', fast: 'तेज़', private: 'निजी', easy: 'आसान' },
  hu: { free: 'Ingyenes', fast: 'Gyors', private: 'Privát', easy: 'Könnyű' },
  id: { free: 'Gratis', fast: 'Cepat', private: 'Privasi Terjamin', easy: 'Mudah' },
  it: { free: 'Gratis', fast: 'Veloce', private: 'Privato', easy: 'Facile' },
  ja: { free: '無料', fast: '高速', private: 'プライベート', easy: '簡単' },
  ko: { free: '무료', fast: '빠른', private: '은밀한', easy: '쉬운' },
  ms: { free: 'Percuma', fast: 'Pantas', private: 'Peribadi', easy: 'Mudah' },
  nl: { free: 'Gratis', fast: 'Snel', private: 'Privaat', easy: 'Eenvoudig' },
  no: { free: 'Gratis', fast: 'Rask', private: 'Privat', easy: 'Lett' },
  pl: { free: 'Za darmo', fast: 'Szybki', private: 'Prywatne', easy: 'Łatwe' },
  pt: { free: 'Grátis', fast: 'Rápido', private: 'Privado', easy: 'Fácil' },
  ro: { free: 'Gratuit', fast: 'Rapid', private: 'Privat', easy: 'Ușor' },
  ru: { free: 'Бесплатно', fast: 'Быстро', private: 'Частный', easy: 'Легко' },
  sv: { free: 'Gratis', fast: 'Snabb', private: 'Privat', easy: 'Lätt' },
  th: { free: 'ฟรี', fast: 'เร็ว', private: 'ส่วนตัว', easy: 'ง่าย' },
  tl: { free: 'Libre', fast: 'Mabilis', private: 'Pribado', easy: 'Madali' },
  tr: { free: 'Ücretsiz', fast: 'Hızlı', private: 'Özel', easy: 'Kolay' },
  uk: { free: 'Безкоштовно', fast: 'Швидко', private: 'Приватний', easy: 'Легко' },
  vi: { free: 'Miễn phí', fast: 'Nhanh', private: 'Riêng tư', easy: 'Dễ dàng' },
  zh: { free: '免费', fast: '快速', private: '私人的', easy: '容易' }
};

function generateFaqs(langCode) {
  const t = dict[langCode] || dict['en'];
  
  return {
    // DESIGN
    "landing.design.faq1.q": `Is this design tool really ${t.free}?`,
    "landing.design.faq1.a": `Yes! Our design studio is 100% ${t.free}. You can use all features without any hidden costs or subscriptions.`,
    "landing.design.faq2.q": `Are my files ${t.private}?`,
    "landing.design.faq2.a": `Absolutely. We use local processing, meaning your images never leave your device. It is completely ${t.private} and secure.`,
    "landing.design.faq3.q": `How ${t.fast} is the rendering?`,
    "landing.design.faq3.a": `Because it runs locally in your browser using WebAssembly, the performance is extremely ${t.fast}, with 0ms network latency.`,
    "landing.design.faq4.q": `Is it ${t.easy} to use for beginners?`,
    "landing.design.faq4.a": `Yes! The interface is highly intuitive. It's very ${t.easy} to add text, shapes, and layers even if you have no design experience.`,

    // ROTATE
    "landing.rotate.faq1.q": `Can I rotate multiple images at once?`,
    "landing.rotate.faq1.a": `Yes, our tool supports bulk processing. It is very ${t.fast} and ${t.easy} to rotate dozens of photos simultaneously.`,
    "landing.rotate.faq2.q": `Is the rotation process ${t.private}?`,
    "landing.rotate.faq2.a": `100% ${t.private}. Your files are rotated directly on your device, ensuring maximum security and privacy.`,
    "landing.rotate.faq3.q": `Will I lose image quality?`,
    "landing.rotate.faq3.a": `No, the rotation is lossless. Your images retain their original quality and resolution.`,
    "landing.rotate.faq4.q": `Is there any cost to use this?`,
    "landing.rotate.faq4.a": `No, our rotate tool is completely ${t.free} for everyone, forever.`,

    // PICKER
    "landing.picker.faq1.q": `How accurate is the color picker?`,
    "landing.picker.faq1.a": `It provides pixel-perfect accuracy. It's very ${t.easy} to extract exact HEX and RGB codes from any part of your image.`,
    "landing.picker.faq2.q": `Does this tool upload my images?`,
    "landing.picker.faq2.a": `Never. Your images are processed locally in your browser. The extraction is completely ${t.private} and secure.`,
    "landing.picker.faq3.q": `Can I generate palettes automatically?`,
    "landing.picker.faq3.a": `Yes! The tool can automatically generate a beautiful color palette from your uploaded image very ${t.fast}.`,
    "landing.picker.faq4.q": `Is the palette generator ${t.free}?`,
    "landing.picker.faq4.a": `Yes, every feature in the color picker, including palette generation, is 100% ${t.free}.`,

    // WATERMARK
    "landing.watermark.faq1.q": `Can I watermark multiple photos?`,
    "landing.watermark.faq1.a": `Yes! Our batch processing makes it ${t.fast} and ${t.easy} to watermark hundreds of photos at once.`,
    "landing.watermark.faq2.q": `Are my original photos safe?`,
    "landing.watermark.faq2.a": `Yes, the process is 100% ${t.private} and local. We never store or upload your images to our servers.`,
    "landing.watermark.faq3.q": `Can I use my own logo?`,
    "landing.watermark.faq3.a": `Absolutely. You can upload custom PNG logos or use text watermarks with custom fonts.`,
    "landing.watermark.faq4.q": `Is there a limit to how many photos I can process?`,
    "landing.watermark.faq4.a": `No limits! Since it runs on your device, you can process as many photos as you want for ${t.free}.`,

    // BLURFACE
    "landing.blurface.faq1.q": `Does it detect multiple faces?`,
    "landing.blurface.faq1.a": `Yes, our local AI model can detect and blur multiple faces in a single photo very ${t.fast}.`,
    "landing.blurface.faq2.q": `Is the face detection ${t.private}?`,
    "landing.blurface.faq2.a": `100% ${t.private}. The AI model runs directly in your browser. No photos of faces are ever uploaded to any server.`,
    "landing.blurface.faq3.q": `Do I have to pay to use the AI?`,
    "landing.blurface.faq3.a": `No, our AI blur tool is completely ${t.free}. We don't charge for AI processing because it uses your device's power.`,
    "landing.blurface.faq4.q": `Is it ${t.easy} to adjust the blur intensity?`,
    "landing.blurface.faq4.a": `Yes, you have full control over the blur radius and can easily toggle which faces to blur or unblur.`,

    // CONVERT
    "landing.convert.faq1.q": `What formats are supported?`,
    "landing.convert.faq1.a": `We support converting between WebP, PNG, JPEG, and more. It's ${t.easy} to switch formats instantly.`,
    "landing.convert.faq2.q": `Is the conversion ${t.fast}?`,
    "landing.convert.faq2.a": `Extremely ${t.fast}. By using WebAssembly locally, conversions happen in milliseconds without waiting for server uploads.`,
    "landing.convert.faq3.q": `Is this tool ${t.free} for bulk conversion?`,
    "landing.convert.faq3.a": `Yes! You can bulk convert hundreds of images for ${t.free} without any restrictions.`,
    "landing.convert.faq4.q": `Are my converted files ${t.private}?`,
    "landing.convert.faq4.a": `Completely ${t.private}. Everything happens directly inside your own browser window.`,
  };
}

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const newFaqs = generateFaqs(lang);
      
      // Inject new faqs
      Object.assign(data, newFaqs);
      
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Injected 4 FAQs for 6 tools into ${lang}`);
    } catch (err) {
      console.error(`Failed to process ${lang}:`, err);
    }
  }
});

console.log("All FAQs injected successfully!");
