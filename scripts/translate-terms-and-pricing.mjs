import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { translate } = require('google-translate-api-x');

const TARGET_LANGS = [
  'ar', 'cs', 'da', 'de', 'el', 'es', 'fi', 'fr', 'he', 'hi',
  'hu', 'id', 'it', 'ja', 'ko', 'ms', 'nl', 'no', 'pl', 'pt',
  'ro', 'ru', 'sv', 'th', 'tl', 'tr', 'uk', 'vi', 'zh'
];

const SOURCE_KEYS = {
  // Terms of Service Keys
  "terms.badge": "TERMS OF SERVICE & LEGAL AGREEMENT",
  "terms.title": "Terms of Service & Founder License",
  "terms.lastUpdated": "Effective Date: November 16, 2026 • Version 2.4",
  "terms.intro": "Welcome to HelpMyIMG and the ThisMyOwn software ecosystem. These Terms of Service constitute a legally binding agreement governing your access to and use of our client-side software, tools, and digital services. By accessing or using any tool across our network, you explicitly agree to be bound by these terms.",
  "terms.notice": "Privacy Guarantee: HelpMyIMG executes 100% of data processing locally in your browser via WebAssembly. We never upload, inspect, or retain your files on remote servers.",
  "terms.sidebarTitle": "Table of Contents",

  "terms.s1.title": "1. Acceptance of Terms & Service Scope",
  "terms.s1.desc1": "By accessing or using HelpMyIMG (helpmyimg.com), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service, our Privacy Policy, and all applicable international laws and regulations. If you do not agree with any part of these terms, you must immediately discontinue use of the platform.",
  "terms.s1.desc2": "These terms apply universally to all visitors, registered account holders, and commercial users across HelpMyIMG and related digital applications operated under the ThisMyOwn software network.",

  "terms.s2.title": "2. Zero-Upload Architecture & Data Privacy Guarantee",
  "terms.s2.desc1": "HelpMyIMG is engineered with a strict Zero-Knowledge, client-side execution model. All artificial intelligence models, image segmentation algorithms, background removal operations, and file transformations execute strictly within your local web browser memory using WebAssembly (WASM), Web Workers, and hardware-accelerated local APIs.",
  "terms.s2.desc2": "Under no circumstances are your uploaded photographs, documents, or processed creative assets transmitted to, processed on, or cached by our servers. Because your data never leaves your physical device, HelpMyIMG is natively compliant with GDPR, CCPA, and international data privacy frameworks. You retain absolute control over your confidential assets at all times.",

  "terms.s3.title": "3. Licensing Tiers: Free Starter & PRO Founder Pass",
  "terms.s3.desc1": "HelpMyIMG offers two distinct service tiers designed for creators, professionals, and enterprise workflows:",
  "terms.s3.bullet1": "Free Starter Tier: Grants non-exclusive, revocable, personal, and commercial access to all 14 core tools with reasonable standard processing limits (such as batch sizes up to 10 photos simultaneously and standard high-definition output).",
  "terms.s3.bullet2": "PRO Founder Lifetime License: Granted upon payment of an upfront, one-time fee. Unlocks unrestricted batch capacity (100+ files), Ultra-HD 4K lossless rendering, priority multi-threaded CPU acceleration, and full commercial monetization rights without recurring monthly charges.",
  "terms.s3.desc2": "Both tiers include full commercial licensing rights for all output files generated through the software.",

  "terms.s4.title": "4. Definition & Scope of Lifetime Access",
  "terms.s4.desc1": "In accordance with standard global software industry practices, Lifetime Access refers explicitly to the operational lifespan of the software product and its commercial availability, and not to the biological lifespan of the buyer or developer, nor an indefinite commitment until perpetuity.",
  "terms.s4.desc2": "A Lifetime License guarantees that you will never be subjected to mandatory recurring monthly or annual subscription fees for the features, tools, and versions covered by your purchase. You are entitled to all minor updates, stability patches, and core model enhancements deployed throughout the active commercial life of the platform.",

  "terms.s5.title": "5. Service Continuity, Force Majeure & Offline PWA Assurance",
  "terms.s5.desc1": "While the development team intends to maintain and expand the service indefinitely, unforeseen technical, legal, economic, or personal events (including medical emergencies, incapacity, or natural disasters categorized as Force Majeure) may impact future online hosting.",
  "terms.s5.desc2": "Because HelpMyIMG does not rely on proprietary remote server backends for processing, our client-side WebAssembly architecture provides an extraordinary safeguard: users may install the web application as a Progressive Web App (PWA) to run independently and offline on their personal computers even if remote hosting is interrupted.",
  "terms.s5.desc3": "In the event of a planned permanent retirement of the domain or service, HelpMyIMG will undertake reasonable commercial efforts to provide advance notice and offer standalone offline distributions or open-access archives for verified PRO members.",

  "terms.s6.title": "6. All-In-One Privacy Suite Multi-Domain Access",
  "terms.s6.desc1": "The PRO Founder Lifetime Pass includes multi-application interoperability across our integrated family of privacy-first web utilities, which includes: (a) HelpMyIMG (AI Image Studio), (b) HandleMyFile (Document & PDF Suite), (c) SolveMyMedia (Audio & Video Compression), and (d) CreateMy-QR (Vector QR Generation).",
  "terms.s6.desc2": "Your single authenticated account credentials permit synchronized PRO privileges across all authorized domains within the ThisMyOwn ecosystem without requiring duplicate subscription fees.",

  "terms.s7.title": "7. Intellectual Property Ownership & Commercial Rights",
  "terms.s7.desc1": "You retain 100% unconditional ownership and copyright over all source images, media assets, and resulting transformed outputs generated using HelpMyIMG.",
  "terms.s7.desc2": "HelpMyIMG asserts zero ownership, claims, or royalties over your creative work. All processed assets may be freely utilized for commercial client deliverables, merchandise, print-on-demand products, digital marketing, and publication.",

  "terms.s8.title": "8. Acceptable Use Policy & Content Responsibility",
  "terms.s8.desc1": "Because our processing operates entirely on your physical machine, HelpMyIMG does not actively monitor or inspect user content. Consequently, you assume sole legal responsibility for all materials you process.",
  "terms.s8.desc2": "You agree not to use HelpMyIMG to process, create, or distribute child sexual abuse material (CSAM), non-consensual deepfakes, defamatory or libelous content, or any material that infringes upon third-party intellectual property rights.",
  "terms.s8.desc3": "You agree not to reverse engineer, decompile, or attempt to extract proprietary source weights for unauthorized commercial resale or malicious distribution.",

  "terms.s9.title": "9. Warranty Disclaimer (As-Is and As-Available)",
  "terms.s9.desc1": "HelpMyIMG and its tools are provided on an as is and as available basis without warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.",
  "terms.s9.desc2": "While we utilize state-of-the-art neural networks, we do not warrant that background cutouts, file compressions, or format conversions will achieve 100% mathematical perfection for every conceivable lighting condition or camera lens artifact.",

  "terms.s10.title": "10. Strict Limitation of Liability",
  "terms.s10.desc1": "To the maximum extent permitted by applicable law, in no event shall HelpMyIMG, its founders, affiliates, or licensors be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, business interruption, or device hardware degradation resulting from local browser execution.",
  "terms.s10.desc2": "In all circumstances, our cumulative legal liability to you for any claim arising from these terms or your use of the service shall not exceed the actual amount paid by you to HelpMyIMG during the twelve (12) months preceding the claim.",

  "terms.s11.title": "11. Billing, Payments & 14-Day Refund Policy",
  "terms.s11.desc1": "All digital software purchases are processed securely through authorized Merchant of Record partners (Lemon Squeezy) and licensed regional payment gateways (Duitku). Your payment information is encrypted and handled in compliance with PCI-DSS standards.",
  "terms.s11.desc2": "We offer a 14-day customer satisfaction guarantee. If the PRO features fail to perform on your supported hardware or you encounter technical incompatibility that cannot be resolved, you may request a full refund within 14 days of your initial purchase date.",

  "terms.s12.title": "12. Governing Law, Dispute Resolution & Legal Notice",
  "terms.s12.desc1": "These Terms of Service and any dispute arising out of or related to your use of the software shall be governed by and construed in accordance with applicable governing laws, without regard to principles of conflicts of law.",
  "terms.s12.desc2": "For legal notices, copyright claims, DMCA notices, or partnership inquiries, please contact our legal department at legal@helpmyimg.com. We respond to all formal communications within forty-eight (48) business hours.",
  "terms.contactTitle": "Legal & Compliance Inquiries",
  "terms.contactSubtitle": "Official response time within 48 business hours.",

  // Pricing Updates
  "pricing.billing.monthly": "Monthly Subscription",
  "pricing.billing.lifetime": "Founder Lifetime Pass (4-in-1 Suite)",
  "pricing.billing.saveBadge": "PAY ONCE • SAVE 80%",
  "pricing.billing.slotsLeft": "Limited Founder Pass Available",
  "pricing.lifetime.name": "All-In-One Privacy Suite Pass",
  "pricing.lifetime.badge": "FOUNDER PASS • ONE-TIME PAYMENT",
  "pricing.lifetime.period": "Pay once, access indefinitely",
  "pricing.lifetime.desc": "Single one-time payment for perpetual access to our entire 4-app privacy suite: HelpMyIMG, HandleMyFile, SolveMyMedia, and CreateMy-QR. Zero monthly subscriptions and free updates.",
  "pricing.lifetime.btn": "Claim Founder Lifetime Pass",
  "pricing.lifetime.f0": "✨ 4-in-1 Suite: Pro access across HelpMyIMG + HandleMyFile + SolveMyMedia + CreateMy-QR",
  "pricing.lifetime.f1": "Lifetime product license with zero recurring monthly charges",
  "pricing.lifetime.f2": "Unlimited batch processing forever (100+ files at once)",
  "pricing.lifetime.f3": "Original Ultra-HD 4K & uncompressed lossless exports",
  "pricing.lifetime.f4": "100% Client-side privacy (0 server uploads, GDPR & HIPAA compliant)",
  "pricing.lifetime.f5": "Offline PWA execution capability & multi-device sync",
  "pricing.lifetime.f6": "Official Founder Member account badge on profile",
  "pricing.lifetime.f7": "Full commercial license & lifetime updates for all future AI models",
  "pricing.lifetime.f8": "Sustainable $0 cloud cost architecture — guaranteed no surprise fees",
  "pricing.faq6.q": "What does 'Founder Lifetime Pass' mean and what is included?",
  "pricing.faq6.a": "The Founder Lifetime Pass is a single one-time payment that gives you perpetual access to Pro features across our entire 4-tool ecosystem (HelpMyIMG, HandleMyFile, SolveMyMedia, and CreateMy-QR). It means no monthly or yearly subscription fees for the operational lifetime of the service.",
  "pricing.faq7.q": "How is a Lifetime Deal sustainable without server shutdown risks?",
  "pricing.faq7.a": "Unlike traditional cloud SaaS companies that pay massive monthly GPU server bills for every user upload, all our tools run 100% locally in your browser using WebAssembly and Web Workers. Because computing happens directly on your device, our marginal server cost is virtually zero, making this one-time license economically permanent and sustainable.",
  "pricing.faq8.q": "What happens if the website is ever updated or goes offline?",
  "pricing.faq8.a": "Because our software runs entirely in your browser without backend processing dependencies, you can install our apps as Progressive Web Apps (PWA) to run offline locally on your computer even without an active internet connection. All lifetime members receive perpetual access to all current and future versions."
};

const localesDir = path.join(process.cwd(), 'public', 'locales');

async function run() {
  console.log('--- 1. Updating English Translation ---');
  const enFile = path.join(localesDir, 'en', 'translation.json');
  const enJson = JSON.parse(fs.readFileSync(enFile, 'utf8'));
  for (const [key, val] of Object.entries(SOURCE_KEYS)) {
    enJson[key] = val;
  }
  fs.writeFileSync(enFile, JSON.stringify(enJson, null, 2), 'utf8');
  console.log('✓ English updated with ' + Object.keys(SOURCE_KEYS).length + ' keys.');

  const keysList = Object.keys(SOURCE_KEYS);
  const valuesList = Object.values(SOURCE_KEYS);

  // Batch translate in chunks of 15 keys to avoid URL length issues
  const chunkSize = 15;

  for (let i = 0; i < TARGET_LANGS.length; i++) {
    const lang = TARGET_LANGS[i];
    console.log(`[${i + 1}/${TARGET_LANGS.length}] Translating to: ${lang}...`);
    const langFile = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(langFile)) {
      console.warn(`File missing for ${lang}, skipping.`);
      continue;
    }
    const targetJson = JSON.parse(fs.readFileSync(langFile, 'utf8'));

    const translatedMap = {};

    for (let c = 0; c < valuesList.length; c += chunkSize) {
      const chunkValues = valuesList.slice(c, c + chunkSize);
      const chunkKeys = keysList.slice(c, c + chunkSize);

      let attempts = 0;
      let success = false;
      while (attempts < 3 && !success) {
        try {
          const res = await translate(chunkValues, { to: lang });
          const texts = Array.isArray(res) ? res.map(r => r.text) : [res.text];
          for (let k = 0; k < chunkKeys.length; k++) {
            translatedMap[chunkKeys[k]] = texts[k] || chunkValues[k];
          }
          success = true;
        } catch (err) {
          attempts++;
          console.warn(`  Retry ${attempts} for ${lang} chunk ${c / chunkSize}...`);
          await new Promise(r => setTimeout(r, 1000 * attempts));
        }
      }
      if (!success) {
        console.error(`  Failed chunk ${c} for ${lang}, keeping fallback.`);
        for (let k = 0; k < chunkKeys.length; k++) {
          translatedMap[chunkKeys[k]] = chunkValues[k];
        }
      }
      // Small throttle
      await new Promise(r => setTimeout(r, 300));
    }

    for (const [k, v] of Object.entries(translatedMap)) {
      targetJson[k] = v;
    }

    fs.writeFileSync(langFile, JSON.stringify(targetJson, null, 2), 'utf8');
    console.log(`✓ Completed ${lang}`);
  }

  console.log('All 30 languages updated successfully!');
}

run().catch(console.error);
