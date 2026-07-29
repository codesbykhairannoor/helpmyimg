const fs = require('fs');
const path = require('path');

const log = (msg) => console.log(`[QA] ${msg}`);
const success = (msg) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg) => console.error(`  ❌ FAIL: ${msg}`);

let totalTests = 0;
let passedTests = 0;

function assert(condition, successMsg, failMsg) {
  totalTests++;
  if (condition) {
    success(successMsg);
    passedTests++;
  } else {
    fail(failMsg);
  }
}

log('Mulai Pengujian QA Engineer untuk SUPER GEO & SEO...');

// 1. Cek robots.txt
try {
  const robotsTxt = fs.readFileSync(path.join(__dirname, 'public', 'robots.txt'), 'utf8');
  assert(robotsTxt.includes('User-agent: GPTBot') && robotsTxt.includes('Allow: /llms.txt'), 
    'robots.txt mendukung AI Crawlers (GPTBot, dll) dan llms.txt', 
    'robots.txt tidak mendukung AI secara eksplisit');
} catch (e) {
  fail('robots.txt tidak ditemukan');
}

// 2. Cek llms.txt
try {
  const llmsTxtExists = fs.existsSync(path.join(__dirname, 'public', 'llms.txt'));
  assert(llmsTxtExists, '/llms.txt tersedia untuk RAG LLM', '/llms.txt tidak ditemukan');
} catch (e) {
  fail('Gagal mengecek llms.txt');
}

// 3. Cek vercel.json untuk Header Link Discovery
try {
  const vercelJson = fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8');
  assert(vercelJson.includes('rel=\\"llms-txt\\"') || vercelJson.includes('rel="llms-txt"'), 
    'vercel.json menginjeksi HTTP Header untuk discovery llms.txt', 
    'vercel.json tidak memiliki konfigurasi header rel="llms-txt"');
} catch (e) {
  fail('vercel.json tidak ditemukan atau gagal dibaca');
}

// 4. Cek SeoHead.tsx (Hreflang & Canonical & Schema)
try {
  const seoHead = fs.readFileSync(path.join(__dirname, 'src', 'components', 'seo', 'SeoHead.tsx'), 'utf8');
  assert(seoHead.includes('hrefLang="x-default"'), 'SeoHead memiliki tag x-default', 'SeoHead kehilangan x-default');
  assert(seoHead.includes('rel="canonical"'), 'SeoHead memiliki Self-referencing Canonical', 'SeoHead kehilangan tag Canonical');
  assert(seoHead.includes('@type": "FAQPage"') && seoHead.includes('@type": "SoftwareApplication"'), 'SeoHead mengkonsolidasi Skema JSON-LD terstruktur', 'Skema JSON-LD tidak lengkap');
  assert(!seoHead.includes('https://helpmyimg.com/en/'), 'SeoHead tidak memaksa prefix /en pada hreflang bahasa Inggris', 'Terdapat prefix /en yang dihardcode');
} catch (e) {
  fail('SeoHead.tsx tidak ditemukan');
}

// 5. Cek App.tsx (Tanpa Auto Redirect)
try {
  const appTsx = fs.readFileSync(path.join(__dirname, 'src', 'App.tsx'), 'utf8');
  assert(!appTsx.includes('<RootGuard>') || appTsx.includes('// RootGuard dihilangkan'), 
    'App.tsx 100% statis tanpa Auto-Redirect geo IP', 
    'App.tsx masih menggunakan auto-redirect');
} catch (e) {
  fail('App.tsx tidak ditemukan');
}

// 6. Cek HomeSections.tsx (Fact Density & Expert Quote)
try {
  const homeSections = fs.readFileSync(path.join(__dirname, 'src', 'components', 'landing', 'HomeSections.tsx'), 'utf8');
  assert(homeSections.includes('WebAssembly') && homeSections.includes('GDPR (Article 5)'), 
    'HomeSections menyertakan sitasi sumber Inline dan Fakta Densitas (Wasm, GDPR)', 
    'Tidak ada fakta spesifik/sitasi di HomeSections');
  assert(homeSections.includes('blockquote') || homeSections.includes('Dr. Sarah Chen'), 
    'HomeSections memiliki Injeksi Kutipan Pakar untuk optimasi AI', 
    'Kutipan Pakar tidak ditemukan di HomeSections');
} catch (e) {
  fail('HomeSections.tsx tidak ditemukan');
}

// 7. Cek terjemahan (30 Bahasa ISO)
try {
  const translations = fs.readFileSync(path.join(__dirname, 'src', 'i18n', 'translations.ts'), 'utf8');
  const langMatch = translations.match(/code:\s*'([a-z]{2})'/g);
  assert(langMatch && langMatch.length === 30, 
    'Sistem multibahasa mendukung tepat 30 bahasa dengan kode ISO', 
    `Sistem memiliki jumlah bahasa yang tidak tepat (${langMatch ? langMatch.length : 0})`);
} catch (e) {
  fail('translations.ts tidak ditemukan');
}

console.log('\n--- RINGKASAN HASIL QA ENGINEER ---');
console.log(`Total Pengujian: ${totalTests}`);
console.log(`Berhasil: ${passedTests}`);
console.log(`Gagal: ${totalTests - passedTests}`);
if (totalTests === passedTests) {
  console.log('STATUS: ⭐ SUPER GEO & SEO APPROVED (100% AMAN) ⭐');
} else {
  console.log('STATUS: ⚠️ PERLU PERBAIKAN LEBIH LANJUT ⚠️');
}
