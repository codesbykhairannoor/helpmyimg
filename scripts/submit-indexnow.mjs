import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOST = 'helpmyimg.com'; // Change this if the domain is different
const KEY = 'c8e54926d5744902bc6e85fb2c85e0f2';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Read the sitemap index to find all shard sitemaps
const publicDir = path.join(__dirname, '../public');
const sitemapsDir = path.join(publicDir, 'sitemaps');

async function run() {
  console.log('Gathering URLs from sitemaps...');
  
  let allUrls = [];
  
  // Also read the core sitemap directly
  const sitemapFiles = fs.readdirSync(sitemapsDir).filter(f => f.endsWith('.xml'));
  
  for (const file of sitemapFiles) {
    const filePath = path.join(sitemapsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract <loc> tags using regex (simple and effective for our sitemaps)
    const regex = /<loc>(.*?)<\/loc>/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      allUrls.push(match[1]);
    }
  }

  // Deduplicate just in case
  allUrls = [...new Set(allUrls)];
  
  console.log(`Found ${allUrls.length} unique URLs to submit to IndexNow.`);
  
  if (allUrls.length === 0) {
    console.log('No URLs found. Exiting.');
    return;
  }

  // IndexNow allows up to 10,000 URLs per request.
  // We'll submit them all in one batch since we have ~1300 URLs.
  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: allUrls
  };

  console.log(`\nSubmitting ${allUrls.length} URLs to IndexNow...`);
  
  try {
    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log('✅ Success! Search engines have been notified instantly.');
    } else {
      console.log(`❌ Failed with HTTP code ${response.status}: ${response.statusText}`);
      const text = await response.text();
      console.log(text);
    }
  } catch (error) {
    console.error('Error submitting to IndexNow:', error);
  }
}

run();
