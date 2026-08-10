import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const infoDir = path.join(__dirname, '../src/pages/info');

const files = {
  'AboutPage.tsx': 'footer.about',
  'SecurityPage.tsx': 'footer.security',
  'PricingPage.tsx': 'footer.pricing',
  'ComparePage.tsx': 'footer.compare',
  'LanguagesPage.tsx': 'footer.languages',
  'PrivacyPage.tsx': 'footer.privacy',
  'TermsPage.tsx': 'footer.terms',
  'FaqPage.tsx': 'nav.faq'
};

for (const [file, key] of Object.entries(files)) {
  const filePath = path.join(infoDir, file);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace <title>{t('some.key')} | HelpMyIMG</title>
  content = content.replace(/<title>\{t\([^)]+\)\}( \| HelpMyIMG)?<\/title>/g, `<title>{t('${key}')} | HelpMyIMG</title>`);
  
  // Replace <title>{t('some.key') || 'Fallback'} | HelpMyIMG</title>
  content = content.replace(/<title>\{t\('[^']+'\)\s*\|\|\s*'[^']+'\}( \| HelpMyIMG)?<\/title>/g, `<title>{t('${key}')} | HelpMyIMG</title>`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file} to use key ${key}`);
}
