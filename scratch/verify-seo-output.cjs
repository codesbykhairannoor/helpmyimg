const fs = require('fs');

// Check sitemap.xml structure
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
const shards = (sitemap.match(/<loc>/g) || []).length;
console.log('=== sitemap.xml ===');
console.log('Shard count:', shards);

// Check one sitemap shard
const enSitemap = fs.readFileSync('public/sitemaps/sitemap-en.xml', 'utf8');
const urls = (enSitemap.match(/<loc>.*?<\/loc>/g) || []).length;
const hasPriority = enSitemap.includes('<priority>');
const hasChangefreq = enSitemap.includes('<changefreq>');
console.log('\n=== sitemap-en.xml ===');
console.log('URL count:', urls);
console.log('Has priority:', hasPriority);
console.log('Has changefreq:', hasChangefreq);

const sample = (enSitemap.match(/<loc>(.*?)<\/loc>/g) || []).slice(0, 5);
console.log('Sample URLs:', sample);

// Check JSON-LD in generated HTML
const html = fs.readFileSync('dist/en/index.html', 'utf8');
const ldJsonMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (ldJsonMatch) {
  const parsed = JSON.parse(ldJsonMatch[1]);
  const types = (parsed['@graph'] || []).map(e => Array.isArray(e['@type']) ? e['@type'].join('+') : e['@type']);
  console.log('\n=== JSON-LD in dist/en/index.html ===');
  console.log('Entity types:', JSON.stringify(types));
} else {
  console.log('ERROR: No JSON-LD found!');
}

// Check JSON-LD in a tool page
const toolHtml = fs.readFileSync('dist/en/remove-background/index.html', 'utf8');
const toolLdMatch = toolHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
if (toolLdMatch) {
  const parsed = JSON.parse(toolLdMatch[1]);
  const types = (parsed['@graph'] || []).map(e => Array.isArray(e['@type']) ? e['@type'].join('+') : e['@type']);
  console.log('\n=== JSON-LD in dist/en/remove-background/index.html ===');
  console.log('Entity types:', JSON.stringify(types));
  const bc = (parsed['@graph'] || []).find(e => e['@type'] === 'BreadcrumbList');
  if (bc) console.log('Breadcrumb:', JSON.stringify((bc.itemListElement || []).map(i => i.name)));
}
