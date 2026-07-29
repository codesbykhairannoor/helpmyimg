const fs = require('fs');
const path = require('path');

const log = (msg) => console.log(`[AI-FRIENDLY QA] ${msg}`);
const success = (msg) => console.log(`  ✅ PASS: ${msg}`);
const fail = (msg) => console.error(`  ❌ FAIL: ${msg}`);
const warn = (msg) => console.log(`  ⚠️ WARN: ${msg}`);

let totalTests = 0;
let passedTests = 0;

function assert(condition, successMsg, failMsg, isWarning = false) {
  totalTests++;
  if (condition) {
    success(successMsg);
    passedTests++;
  } else {
    if (isWarning) {
      warn(failMsg);
      passedTests++; // Warnings don't fail the suite
    } else {
      fail(failMsg);
    }
  }
}

log('Mulai Evaluasi Standar Konten Ramah AI (llms.txt & llms-full.txt)...');

try {
  const llmsPath = path.join(__dirname, 'public', 'llms.txt');
  const llmsFull = path.join(__dirname, 'public', 'llms-full.txt');
  
  if (!fs.existsSync(llmsPath)) {
    throw new Error('llms.txt tidak ditemukan');
  }

  const llmsContent = fs.readFileSync(llmsPath, 'utf8');
  
  // 1. Cek H1 utama
  const hasH1 = /^#\s+.+/m.test(llmsContent);
  assert(hasH1, 'llms.txt diawali dengan tag H1 (#) sebagai judul utama proyek', 'llms.txt tidak memiliki H1 utama yang valid');
  
  // 2. Cek Blockquote ringkasan
  const hasBlockquote = /^>\s+.+/m.test(llmsContent);
  assert(hasBlockquote, 'llms.txt memiliki Blockquote (>) untuk ringkasan ruang lingkup situs', 'llms.txt tidak memiliki blockquote ringkasan');

  // 3. Cek struktur H2
  const hasH2 = /^##\s+.+/m.test(llmsContent);
  assert(hasH2, 'llms.txt memiliki sub-bagian H2 (##) untuk memisahkan konteks', 'llms.txt tidak memiliki struktur H2 yang terorganisir');

  // 4. Cek struktur Link Markdown [Nama](/url)
  const hasMarkdownLinks = /\[.+?\]\(.+?\)/.test(llmsContent);
  assert(hasMarkdownLinks, 'llms.txt menggunakan format tautan Markdown murni [Nama](/url)', 'Tidak ditemukan format tautan Markdown yang valid di llms.txt');

  // 5. Cek llms-full.txt tidak berisi sampah HTML/Script
  if (fs.existsSync(llmsFull)) {
    const fullContent = fs.readFileSync(llmsFull, 'utf8');
    const hasHtmlTags = /<\/?div|<\/?script|<\/?style|<\/?html/i.test(fullContent);
    assert(!hasHtmlTags, 'llms-full.txt murni Markdown dan bebas dari tag HTML kotor (div, script, style)', 'llms-full.txt mengandung tag HTML (tidak AI-friendly)');
    
    // Cek ukuran llms-full.txt (tidak boleh terlalu kosong, minimal 1000 karakter)
    assert(fullContent.length > 1000, `llms-full.txt memiliki densitas teks yang cukup padat (${fullContent.length} chars)`, 'llms-full.txt terlalu pendek atau kosong');
  } else {
    fail('llms-full.txt tidak ditemukan');
  }

} catch (e) {
  fail(`Terjadi kesalahan saat evaluasi: ${e.message}`);
}

console.log('\n--- RINGKASAN HASIL EVALUASI AI-FRIENDLY ---');
console.log(`Total Pengujian: ${totalTests}`);
console.log(`Berhasil: ${passedTests}`);
console.log(`Gagal: ${totalTests - passedTests}`);
if (totalTests === passedTests) {
  console.log('STATUS: 🤖 AI-FRIENDLY CONTENT APPROVED (Sangat mudah dicerna LLM) 🤖');
} else {
  console.log('STATUS: ⚠️ STRUKTUR MARKDOWN LLM PERLU DIPERBAIKI ⚠️');
}
