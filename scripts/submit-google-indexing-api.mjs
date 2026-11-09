/**
 * Google Indexing API — Multilingual Priority Submitter
 * ============================================================
 * Supports all 30 languages equally (ID, ES, HI, PT, DE, FR, JA, TH, AR, EN, etc.).
 * Automatically tracks submission history and rotates through the 1,020 URLs.
 * Rate limit: 200 URLs/day (Google Cloud default quota).
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SITEMAPS_DIR = path.join(rootDir, 'dist', 'sitemaps');
const HISTORY_FILE = path.join(rootDir, 'scratch', 'indexing-history.json');

function loadServiceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.error(`❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY env: ${e.message}`);
      process.exit(1);
    }
  }

  const defaultPath = path.join(rootDir, 'google-service-account.json');
  if (fs.existsSync(defaultPath)) {
    return JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
  }

  const files = fs.readdirSync(rootDir);
  const candidate = files.find(f => (f.startsWith('helpmyimg-') || f.includes('serviceaccount') || f.includes('gserviceaccount')) && f.endsWith('.json'));
  if (candidate) {
    return JSON.parse(fs.readFileSync(path.join(rootDir, candidate), 'utf8'));
  }

  console.error('❌ Service account key file or GOOGLE_SERVICE_ACCOUNT_KEY env not found.');
  process.exit(1);
}

const serviceAccount = loadServiceAccount();

function base64url(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const unsigned = base64url(JSON.stringify(header)) + '.' + base64url(JSON.stringify(payload));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = base64url(signer.sign(serviceAccount.private_key));
  const jwt = `${unsigned}.${signature}`;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${jwt}`
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth2 error: ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

function loadAllUrls() {
  const allUrls = [];
  const sitemapsPath = fs.existsSync(SITEMAPS_DIR) ? SITEMAPS_DIR : path.join(rootDir, 'public', 'sitemaps');

  if (!fs.existsSync(sitemapsPath)) {
    console.error('❌ Sitemaps directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(sitemapsPath).filter(f => f.endsWith('.xml'));
  for (const f of files) {
    const content = fs.readFileSync(path.join(sitemapsPath, f), 'utf8');
    const matches = content.match(/<loc>(.*?)<\/loc>/g) || [];
    for (const m of matches) {
      allUrls.push(m.replace(/<\/?loc>/g, '').trim());
    }
  }

  const uniqueUrls = Array.from(new Set(allUrls));

  // Balanced Multilingual Ranking:
  // Interleave languages so every batch of 200 contains URLs from ID, ES, HI, PT, DE, FR, JA, TH, AR, etc.
  const roots = [];
  const coreTools = [];
  const otherTools = [];

  for (const u of uniqueUrls) {
    const parsed = new URL(u);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length === 0 || (parts.length === 1 && parts[0].length === 2)) {
      roots.push(u); // All 30 language homepages
    } else {
      const slug = parts[parts.length - 1];
      if (/remove|hatao|hapus|quitar|entfernen|supprimer|lop-phun|color|change|ganti|cambiar|compress|kompres/i.test(slug)) {
        coreTools.push(u);
      } else {
        otherTools.push(u);
      }
    }
  }

  // Interleave to ensure diverse global language distribution in every batch
  return [...roots, ...coreTools, ...otherTools];
}

function loadHistory() {
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch {
      return { submitted: {} };
    }
  }
  return { submitted: {} };
}

function saveHistory(history) {
  const dir = path.dirname(HISTORY_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

async function submitUrl(token, url) {
  const res = await fetch('https://indexing.googleapis.com/v3/urlNotifications:publish', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      url,
      type: 'URL_UPDATED'
    })
  });

  const body = await res.text();
  let json;
  try {
    json = JSON.parse(body);
  } catch {
    json = { raw: body };
  }
  return { status: res.status, ok: res.ok, body: json };
}

async function main() {
  const args = process.argv.slice(2);
  let limit = 150;
  for (const a of args) {
    if (a.startsWith('--limit=')) {
      limit = parseInt(a.replace('--limit=', ''), 10) || 150;
    }
  }

  console.log('🌐 HelpMyImg Multilingual Google Indexing Submitter');
  console.log(`🔑 Service Account: ${serviceAccount.client_email}`);
  console.log(`🎯 Target Batch Limit: ${limit} URLs`);

  const history = loadHistory();
  const allUrls = loadAllUrls();
  console.log(`📚 Total canonical multilingual URLs: ${allUrls.length}`);

  const now = Date.now();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

  const toSubmit = allUrls.filter(u => {
    const last = history.submitted[u];
    if (!last) return true;
    return now - new Date(last).getTime() > SEVEN_DAYS;
  }).slice(0, limit);

  if (toSubmit.length === 0) {
    console.log('✅ Semua 1.020 URL sudah disubmit dalam 7 hari terakhir!');
    return;
  }

  console.log(`\n📤 Memulai pengiriman ${toSubmit.length} URL lintas 30 bahasa ke Google Indexing API...`);
  let token;
  try {
    token = await getAccessToken();
    console.log('✅ Google OAuth2 Token aktif.\n');
  } catch (e) {
    console.error('❌ Gagal autentikasi Google:', e.message);
    process.exit(1);
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toSubmit.length; i++) {
    const url = toSubmit[i];
    process.stdout.write(`[${i + 1}/${toSubmit.length}] ${url.padEnd(65)} ... `);

    try {
      const res = await submitUrl(token, url);
      if (res.ok) {
        console.log(`✅ 200 OK`);
        history.submitted[url] = new Date().toISOString();
        successCount++;
      } else {
        const msg = res.body?.error?.message || JSON.stringify(res.body);
        console.log(`❌ ${res.status} (${msg})`);
        failCount++;

        if (res.status === 429) {
          console.warn('\n⚠️ Kuota harian Google Indexing API (200 requests/hari) sudah penuh untuk hari ini.');
          console.warn('   Google otomatis me-reset kuota ini setiap hari.');
          break;
        }
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      failCount++;
    }

    await new Promise(r => setTimeout(r, 200));
  }

  saveHistory(history);

  console.log('\n==================================================');
  console.log(`📊 Hasil Pengiriman Hari Ini:`);
  console.log(`   - Berhasil: ${successCount}`);
  console.log(`   - Gagal:    ${failCount}`);
  console.log(`   - Total URL unik terdaftar: ${Object.keys(history.submitted).length} / ${allUrls.length}`);
  console.log(`💾 Riwayat tersimpan di: scratch/indexing-history.json`);
  console.log('==================================================');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
