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

function findServiceAccountKey() {
  const defaultPath = path.join(__dirname, '../google-service-account.json');
  if (fs.existsSync(defaultPath)) return defaultPath;

  const rootDir = path.join(__dirname, '..');
  const files = fs.readdirSync(rootDir);
  const candidate = files.find(f => (f.startsWith('helpmyimg-') || f.includes('serviceaccount') || f.includes('gserviceaccount')) && f.endsWith('.json'));
  if (candidate) return path.join(rootDir, candidate);
  return null;
}

const SERVICE_ACCOUNT_PATH = findServiceAccountKey();

// Check for service account file
if (!SERVICE_ACCOUNT_PATH || !fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`
❌ SETUP REQUIRED: google-service-account.json (or helpmyimg-*.json) not found.

To use the Google Indexing API:
1. Create a Service Account in Google Cloud Console
2. Download the JSON key file
3. Save it in the project root
4. Add the service account email as OWNER in Google Search Console

See script header for full instructions.
`);
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

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
  const DELAY_MS = 500; // 500ms between each to avoid rate limiting

  const toSubmit = urls.slice(0, DAILY_LIMIT);
  console.log(`\nSubmitting ${toSubmit.length} URLs to Google Indexing API...`);
  console.log(`(Daily limit: ${DAILY_LIMIT}. Remaining: ${Math.max(0, urls.length - DAILY_LIMIT)} URLs need re-run)\n`);

  let success = 0;
  let failed = 0;

  for (const url of toSubmit) {
    const result = await submitUrl(accessToken, url);
    if (result.success) {
      success++;
      process.stdout.write(`✅ ${url}\n`);
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
    }
    // Throttle to avoid hitting API rate limits
    await new Promise(r => setTimeout(r, DELAY_MS));
  }

  return { success, failed, total: toSubmit.length };
}

// ============================================================================
// MAIN — Define priority URLs to submit
// Priority order: English homepage → English tool pages → Other lang homepages
// → Other lang tool pages → Info pages
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

  // Priority URL list — submit highest-value pages first
  const priorityUrls = [
    // English homepage and main tools (highest value)
    `${DOMAIN}/en/`,
    `${DOMAIN}/en/remove-background/`,
    `${DOMAIN}/en/compress-image/`,
    `${DOMAIN}/en/convert-image/`,
    `${DOMAIN}/en/resize-image/`,
    `${DOMAIN}/en/change-background/`,
    `${DOMAIN}/en/crop-image/`,
    `${DOMAIN}/en/rotate-image/`,
    `${DOMAIN}/en/watermark-image/`,
    `${DOMAIN}/en/blur-face/`,
    `${DOMAIN}/en/image-color-picker/`,
    `${DOMAIN}/en/advanced-editor/`,
    // Long-tail English tools
    `${DOMAIN}/en/compress-image-to-100kb/`,
    `${DOMAIN}/en/compress-image-to-50kb/`,
    `${DOMAIN}/en/compress-image-to-200kb/`,
    `${DOMAIN}/en/resize-image-for-instagram/`,
    `${DOMAIN}/en/passport-photo/`,
    `${DOMAIN}/en/remove-logo/`,
    `${DOMAIN}/en/remove-person/`,
    `${DOMAIN}/en/convert-to-webp/`,
    `${DOMAIN}/en/bulk-watermark/`,
    `${DOMAIN}/en/blur-license-plate/`,
    `${DOMAIN}/en/change-background-to-white/`,
    `${DOMAIN}/en/magic-brush/`,
    // English info pages
    `${DOMAIN}/en/about/`,
    `${DOMAIN}/en/faq/`,
    `${DOMAIN}/en/pricing/`,
  ];

  // Read sitemaps to get all remaining URLs
  const sitemapsDir = path.join(__dirname, '../public/sitemaps');
  const allSitemapUrls = new Set(priorityUrls);

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

  // Build final list: priority URLs first, then remaining
  const finalUrls = [
    ...priorityUrls,
    ...[...allSitemapUrls].filter(u => !priorityUrls.includes(u))
  ];

  console.log(`Total unique URLs found: ${finalUrls.length}`);

  const result = await submitBatch(finalUrls, accessToken);

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Success: ${result.success}/${result.total}`);
  console.log(`   ❌ Failed:  ${result.failed}/${result.total}`);

  if (finalUrls.length > 200) {
    console.log(`\n⚠️  You have ${finalUrls.length} URLs but the daily limit is 200.`);
    console.log(`   Run this script again tomorrow to submit the remaining ${finalUrls.length - 200} URLs.`);
    console.log(`   Or request increased quota: https://console.cloud.google.com/apis/api/indexing.googleapis.com/quotas`);
  }

  console.log(`\n🎯 Google will crawl submitted URLs within 24–48 hours.`);
  console.log(`   Monitor in Search Console: https://search.google.com/search-console/`);
}

main().catch(console.error);
