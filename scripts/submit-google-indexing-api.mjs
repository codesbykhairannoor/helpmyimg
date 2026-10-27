/**
 * Google Indexing API — Priority URL Submission
 * ============================================================
 * What it does:
 *   Notifies Google directly of new/updated pages using the
 *   official Web Search Indexing API (v3). This is the FASTEST
 *   way to get pages indexed — used by major SaaS platforms
 *   to get new content indexed within hours, not days.
 *
 * Rate limit: 200 URLs/day per service account (free).
 * For more: https://developers.google.com/search/apis/indexing-api/v3/quickstart
 *
 * ============================================================
 * SETUP (one-time, takes ~5 minutes):
 * ============================================================
 * 1. Go to: https://console.cloud.google.com/
 * 2. Create a new project (or use existing)
 * 3. APIs & Services → Library → search "Web Search Indexing API" → Enable
 * 4. IAM & Admin → Service Accounts → Create Service Account
 *    - Name: "helpmyimg-indexing"
 *    - Skip role assignment
 * 5. Click the new service account → Keys tab → Add Key → JSON
 *    - Save the downloaded file as: google-service-account.json in this project root
 * 6. Go to: https://search.google.com/search-console/
 *    - Settings → Users and permissions → Add user
 *    - Email: (paste client_email from the JSON file)
 *    - Permission: OWNER (required! API returns 403 without Owner level)
 * 7. Run: node scripts/submit-google-indexing-api.mjs
 * ============================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createSign } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://helpmyimg.com';
const INDEXING_API_ENDPOINT = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

function loadServiceAccount() {
  // 1. Check if provided via Environment Variable (GitHub Actions CI/CD)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    } catch (e) {
      console.error(`❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY environment variable: ${e.message}`);
      process.exit(1);
    }
  }

  // 2. Otherwise search for local key file
  const defaultPath = path.join(__dirname, '../google-service-account.json');
  if (fs.existsSync(defaultPath)) {
    return JSON.parse(fs.readFileSync(defaultPath, 'utf8'));
  }

  const rootDir = path.join(__dirname, '..');
  const files = fs.readdirSync(rootDir);
  const candidate = files.find(f => (f.startsWith('helpmyimg-') || f.includes('serviceaccount') || f.includes('gserviceaccount')) && f.endsWith('.json'));
  if (candidate) {
    return JSON.parse(fs.readFileSync(path.join(rootDir, candidate), 'utf8'));
  }

  console.error(`
❌ SETUP REQUIRED: google-service-account.json (or helpmyimg-*.json or GOOGLE_SERVICE_ACCOUNT_KEY secret) not found.

To use the Google Indexing API:
1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Save it in the project root OR add as GitHub Secret: GOOGLE_SERVICE_ACCOUNT_KEY
4. Add the service account email as OWNER in Google Search Console

See script header for full instructions.
`);
  process.exit(1);
}

const serviceAccount = loadServiceAccount();

/**
 * Generate a JWT access token using the service account private key
 * (No external dependencies needed — uses Node.js built-in crypto)
 */
async function getAccessToken() {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  })).toString('base64url');

  const signingInput = `${header}.${payload}`;
  const sign = createSign('RSA-SHA256');
  sign.update(signingInput);
  const signature = sign.sign(serviceAccount.private_key).toString('base64url');
  const jwt = `${signingInput}.${signature}`;

  // Exchange JWT for OAuth2 access token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OAuth token error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Submit a single URL to Google Indexing API
 */
async function submitUrl(accessToken, url, type = 'URL_UPDATED') {
  const res = await fetch(INDEXING_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, type })
  });

  const data = await res.json();
  if (res.ok) {
    return { url, success: true, status: res.status };
  } else {
    return { url, success: false, status: res.status, error: data.error?.message || JSON.stringify(data) };
  }
}

/**
 * Submit URLs in batches with rate limiting
 * Google allows 200 URLs/day but processes them immediately.
 * We submit the highest priority URLs first.
 */
async function submitBatch(urls, accessToken) {
  const DAILY_LIMIT = 200;

  const toSubmit = urls.slice(0, DAILY_LIMIT);
  console.log(`\nSubmitting ${toSubmit.length} URLs to Google Indexing API...`);
  console.log(`(Daily limit: ${DAILY_LIMIT}. Remaining in catalog: ${Math.max(0, urls.length - DAILY_LIMIT)} URLs)\n`);

  let success = 0;
  let failed = 0;

  for (const item of toSubmit) {
    const url = typeof item === 'string' ? item : item.url;
    const type = (typeof item === 'object' && item.type) ? item.type : 'URL_UPDATED';

    const result = await submitUrl(accessToken, url, type);
    if (result.success) {
      success++;
      process.stdout.write(`✅ [${type}] ${url}\n`);
    } else {
      failed++;
      process.stderr.write(`❌ ${url} — ${result.error}\n`);
      if (result.error && result.error.includes('Failed to verify the URL ownership')) {
        console.error(`
🛑 STOPPED: Service Account belum terdaftar sebagai OWNER di Google Search Console!

Cara Mengatasi (Cuma 1 Menit):
1. Buka Google Search Console: https://search.google.com/search-console/
2. Pilih properti helpmyimg.com
3. Klik menu "Settings" (Setelan) di kiri bawah -> "Users and permissions" (Pengguna dan izin)
4. Klik tombol "Add user" (Tambahkan pengguna)
5. Masukkan Email: ${serviceAccount.client_email}
6. Pilih Izin: OWNER (Pemilik)  <-- WAJIB Owner, bukan Full/Restricted!
7. Klik Add. Lalu jalankan lagi 'npm run google-index'.
`);
        break;
      }
      if (result.error && result.error.includes('Quota exceeded')) {
        console.warn(`
⚠️ Kuota Google Indexing API harian (200 URLs/hari) untuk hari ini sudah terpakai penuh.
Google otomatis me-reset kuota ini setiap hari (sekitar pukul 14:00-15:00 WIB / 00:00 Pacific).
Pengiriman dihentikan sementara dan akan otomatis dilanjutkan pada jadwal berikutnya!
`);
        break;
      }
    }
    // Random jitter (400ms - 800ms) to avoid rate limits and simulate natural requests
    const jitter = Math.floor(Math.random() * 400) + 400;
    await new Promise(r => setTimeout(r, jitter));
  }

  return { success, failed, total: toSubmit.length };
}

// ============================================================================
// MAIN — Multi-Tier Rolling Queue Algorithm
// Tier 1: 25 Core English Tools & Homepage (submitted every single run)
// Tier 2: 175 Multilingual URLs cycled sequentially (1,027 total URLs covered in 6 days)
// ============================================================================
async function main() {
  console.log('🔑 Authenticating with Google Indexing API...');
  let accessToken;
  try {
    accessToken = await getAccessToken();
    console.log('✅ Authentication successful.\n');
  } catch (err) {
    console.error(`❌ Authentication failed: ${err.message}`);
    process.exit(1);
  }

  // Tier 1: Highest-value Core English pages (always submitted in every run)
  const tier1PriorityUrls = [
    `${DOMAIN}/`,
    `${DOMAIN}/remove-background/`,
    `${DOMAIN}/compress-image/`,
    `${DOMAIN}/convert-image/`,
    `${DOMAIN}/resize-image/`,
    `${DOMAIN}/change-background/`,
    `${DOMAIN}/crop-image/`,
    `${DOMAIN}/rotate-image/`,
    `${DOMAIN}/watermark-image/`,
    `${DOMAIN}/blur-face/`,
    `${DOMAIN}/image-color-picker/`,
    `${DOMAIN}/advanced-editor/`,
    `${DOMAIN}/compress-image-to-100kb/`,
    `${DOMAIN}/compress-image-to-50kb/`,
    `${DOMAIN}/compress-image-to-200kb/`,
    `${DOMAIN}/resize-image-for-instagram/`,
    `${DOMAIN}/passport-photo/`,
    `${DOMAIN}/remove-logo/`,
    `${DOMAIN}/remove-person/`,
    `${DOMAIN}/convert-to-webp/`,
    `${DOMAIN}/bulk-watermark/`,
    `${DOMAIN}/blur-license-plate/`,
    `${DOMAIN}/change-background-to-white/`,
    `${DOMAIN}/magic-brush/`,
    `${DOMAIN}/about/`
  ];

  // Read all remaining URLs from all 30 sitemap shards
  const sitemapsDir = path.join(__dirname, '../public/sitemaps');
  const allSitemapUrls = new Set();

  try {
    const sitemapFiles = fs.readdirSync(sitemapsDir).filter(f => f.endsWith('.xml'));
    for (const file of sitemapFiles) {
      const content = fs.readFileSync(path.join(sitemapsDir, file), 'utf8');
      const matches = content.matchAll(/<loc>(.*?)<\/loc>/g);
      for (const match of matches) {
        allSitemapUrls.add(match[1]);
      }
    }
  } catch (err) {
    console.warn('Could not read sitemaps, using priority list only.');
  }

  // Tier 2: Remaining URLs (multilingual and secondary pages)
  const tier2RemainingUrls = [...allSitemapUrls].filter(u => !tier1PriorityUrls.includes(u));
  const totalCatalogUrls = tier1PriorityUrls.length + tier2RemainingUrls.length;
  console.log(`📋 Total URLs in Catalog: ${totalCatalogUrls} (Tier 1: ${tier1PriorityUrls.length}, Tier 2: ${tier2RemainingUrls.length})`);

  const TIER2_BATCH_SIZE = 200 - tier1PriorityUrls.length; // 175 URLs
  const totalBatches = Math.ceil(tier2RemainingUrls.length / TIER2_BATCH_SIZE);

  // Calculate deterministic day-based batch rotation (works statelessly in GitHub Actions without cache)
  const daysSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  
  // Support CLI override: node scripts/submit-google-indexing-api.mjs --batch 2
  const batchArgIndex = process.argv.indexOf('--batch');
  const activeBatchIndex = batchArgIndex !== -1 && process.argv[batchArgIndex + 1]
    ? parseInt(process.argv[batchArgIndex + 1], 10) % totalBatches
    : daysSinceEpoch % totalBatches;

  const currentOffset = activeBatchIndex * TIER2_BATCH_SIZE;

  // Slice rolling Tier 2 batch
  let rollingTier2Batch = tier2RemainingUrls.slice(currentOffset, currentOffset + TIER2_BATCH_SIZE);
  // Wrap around if reached the end of the catalog
  if (rollingTier2Batch.length < TIER2_BATCH_SIZE && tier2RemainingUrls.length > 0) {
    const wrappedCount = TIER2_BATCH_SIZE - rollingTier2Batch.length;
    rollingTier2Batch = [...rollingTier2Batch, ...tier2RemainingUrls.slice(0, wrappedCount)];
  }

  const nextBatchIndex = (activeBatchIndex + 1) % totalBatches;
  console.log(`🔄 Daily Rotation: Day #${daysSinceEpoch} → Batch ${activeBatchIndex + 1} of ${totalBatches}`);
  console.log(`   - Tier 1: 25 core English tools & homepage (submitted every run)`);
  console.log(`   - Tier 2: ${rollingTier2Batch.length} localized URLs (indexes ${currentOffset} to ${currentOffset + rollingTier2Batch.length})`);
  console.log(`⏱️ Complete 1,027-URL coverage cycle: ~${Math.round(((activeBatchIndex + 1) / totalBatches) * 100)}% complete`);

  // Combine: 25 Tier 1 + 175 Tier 2 = 200 URLs
  const urlsToSubmit = [...tier1PriorityUrls, ...rollingTier2Batch];

  // Execute submission
  const result = await submitBatch(urlsToSubmit, accessToken);

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Success: ${result.success}/${result.total}`);
  console.log(`   ❌ Failed:  ${result.failed}/${result.total}`);
  console.log(`\n🗓️ Tomorrow at 09:00 WIB, GitHub Actions will automatically submit Batch ${nextBatchIndex + 1} of ${totalBatches} (URLs ${nextBatchIndex * TIER2_BATCH_SIZE} to ${(nextBatchIndex + 1) * TIER2_BATCH_SIZE}).`);
  console.log(`🎯 Googlebot will crawl submitted URLs within 1–24 hours.`);
}

main().catch(console.error);
