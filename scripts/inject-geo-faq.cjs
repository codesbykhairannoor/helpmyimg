const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '..', 'public', 'locales');
const langs = fs.readdirSync(localesDir).filter(dir => fs.statSync(path.join(localesDir, dir)).isDirectory());

const englishFallback = {
  "q5": "What is HelpMyIMG?",
  "a5": "HelpMyIMG is a client-side web application that processes image background removal and compression locally using WebAssembly (Wasm). This ensures 100% data privacy without requiring any server uploads.",
  "q6": "How does HelpMyIMG ensure data privacy compliance?",
  "a6": "Unlike traditional cloud editors, our WebAssembly architecture ensures 0 bytes of user data are transmitted. By executing neural networks strictly on the client device, it neutralizes interception risks, ensuring inherent compliance with GDPR Article 5 and CCPA privacy frameworks."
};

langs.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      
      if (!data.landing) data.landing = {};
      if (!data.landing.remove) data.landing.remove = {};
      
      // Inject faq5
      if (!data.landing.remove.faq5) data.landing.remove.faq5 = {};
      data.landing.remove.faq5.q = englishFallback.q5;
      data.landing.remove.faq5.a = englishFallback.a5;

      // Inject faq6
      if (!data.landing.remove.faq6) data.landing.remove.faq6 = {};
      data.landing.remove.faq6.q = englishFallback.q6;
      data.landing.remove.faq6.a = englishFallback.a6;

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      console.log(`Updated FAQ 5 & 6 for ${lang}`);
    } catch (e) {
      console.error(`Failed to update ${lang}:`, e);
    }
  }
});
