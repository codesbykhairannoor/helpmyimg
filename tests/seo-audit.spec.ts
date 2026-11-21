import { test, expect } from '@playwright/test';

interface SeoRouteCase {
  path: string;
  expectedLang: string;
  expectedDir?: 'rtl' | 'ltr';
  expectFaqSchema?: boolean;
}

const ROUTES: SeoRouteCase[] = [
  { path: '/', expectedLang: 'en', expectFaqSchema: true },
  { path: '/remove-background/', expectedLang: 'en' },
  { path: '/compress-image/', expectedLang: 'en', expectFaqSchema: true },
  { path: '/ai-metadata-cleaner/', expectedLang: 'en' },
  { path: '/faq/', expectedLang: 'en', expectFaqSchema: true },
  { path: '/pricing/', expectedLang: 'en' },
  { path: '/about/', expectedLang: 'en' },
  { path: '/id/', expectedLang: 'id', expectFaqSchema: true },
  { path: '/id/kompres-gambar/', expectedLang: 'id', expectFaqSchema: true },
  { path: '/ja/', expectedLang: 'ja', expectFaqSchema: true },
  { path: '/ja/haikei-sakuzyo/', expectedLang: 'ja' },
  { path: '/ar/', expectedLang: 'ar', expectedDir: 'rtl', expectFaqSchema: true },
  { path: '/ar/asilah-shaeia/', expectedLang: 'ar', expectedDir: 'rtl', expectFaqSchema: true },
  { path: '/de/bild-komprimieren/', expectedLang: 'de' },
];

for (const route of ROUTES) {
  test(`Live Chrome SEO, Hydration & CWV check: ${route.path}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const badResponses: string[] = [];
    const failedLocalRequests: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const txt = msg.text();
        if (!txt.includes('ERR_CERT_AUTHORITY_INVALID')) {
          consoleErrors.push(txt);
        }
      }
    });
    page.on('pageerror', (err) => pageErrors.push(err.message));
    page.on('requestfailed', (req) => {
      if (req.url().startsWith('http://127.0.0.1:4173')) {
        failedLocalRequests.push(`${req.failure()?.errorText || 'FAILED'} ${req.url()}`);
      }
    });
    page.on('response', (res) => {
      const url = res.url();
      if (res.status() >= 400 && url.startsWith('http://127.0.0.1:4173')) {
        badResponses.push(`${res.status()} ${url}`);
      }
    });

    // Collect CLS via PerformanceObserver before load settles
    await page.addInitScript(() => {
      (window as any).__clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            (window as any).__clsValue += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    await page.goto(route.path, { waitUntil: 'networkidle' });
    // Wait briefly for Helmet & lazy sections hydration
    await page.waitForSelector('h1', { timeout: 10000 });
    await page.waitForTimeout(400);

    // 1. Check zero broken local assets & JS errors
    expect(failedLocalRequests, `Failed local requests on ${route.path}`).toEqual([]);
    expect(badResponses, `HTTP >=400 local assets on ${route.path}`).toEqual([]);
    expect(pageErrors, `Uncaught pageerrors on ${route.path}`).toEqual([]);
    expect(consoleErrors, `Console errors on ${route.path}`).toEqual([]);

    // 2. HTML lang attribute & RTL handling
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe(route.expectedLang);
    if (route.expectedDir === 'rtl') {
      const hasRtl = await page.locator('[dir="rtl"]').count();
      expect(hasRtl).toBeGreaterThan(0);
    }

    // 3. Post-hydration <head> uniqueness (zero duplicates from Helmet vs static HTML)
    const headCounts = await page.evaluate(() => ({
      title: document.querySelectorAll('head > title').length,
      description: document.querySelectorAll('head > meta[name="description"]').length,
      canonical: document.querySelectorAll('head > link[rel="canonical"]').length,
      ogDescription: document.querySelectorAll('head > meta[property="og:description"]').length,
      twitterDescription: document.querySelectorAll('head > meta[name="twitter:description"]').length,
      jsonLd: document.querySelectorAll('head > script[type="application/ld+json"]').length,
      hreflangs: document.querySelectorAll('head > link[rel="alternate"][hreflang]').length,
      xDefault: document.querySelectorAll('head > link[rel="alternate"][hreflang="x-default"]').length,
    }));

    expect(headCounts.title).toBe(1);
    expect(headCounts.description).toBe(1);
    expect(headCounts.canonical).toBe(1);
    expect(headCounts.ogDescription).toBe(1);
    expect(headCounts.twitterDescription).toBe(1);
    expect(headCounts.jsonLd).toBe(1);
    expect(headCounts.hreflangs).toBe(31); // 30 languages + x-default
    expect(headCounts.xDefault).toBe(1);

    // 4. Title, Description & Canonical quality
    const title = await page.title();
    const minTitleLen = ['ja', 'zh', 'ko'].includes(route.expectedLang) ? 16 : 20;
    expect(title.length).toBeGreaterThanOrEqual(minTitleLen);
    expect(title.length).toBeLessThanOrEqual(62);
    expect((title.match(/HelpMyIMG/gi) || []).length).toBeLessThanOrEqual(1);

    const canonical = await page.locator('head > link[rel="canonical"]').getAttribute('href');
    expect(canonical).toBe(`http://127.0.0.1:4173${route.path}`.replace('http://127.0.0.1:4173', 'https://helpmyimg.com'));

    const metaDesc = await page.locator('head > meta[name="description"]').getAttribute('content');
    const minDescLen = ['ja', 'zh', 'ko'].includes(route.expectedLang) ? 65 : 100;
    expect(metaDesc && metaDesc.length).toBeGreaterThanOrEqual(minDescLen);
    if (route.path === '/ar/asilah-shaeia/') {
      expect(metaDesc).not.toContain('Everything you need to know');
    }

    // 5. No /bg/ or /en/ in hreflang URLs
    const hreflangUrls = await page.evaluate(() =>
      Array.from(document.querySelectorAll('head > link[rel="alternate"][hreflang]')).map((el) => ({
        lang: el.getAttribute('hreflang'),
        href: el.getAttribute('href'),
      }))
    );
    expect(hreflangUrls.some((h) => h.lang === 'bg')).toBe(false);
    expect(hreflangUrls.some((h) => h.href?.includes('/en/'))).toBe(false);

    // 6. Validate JSON-LD @graph post-hydration
    const jsonLdRaw = await page.locator('head > script[type="application/ld+json"]').textContent();
    expect(jsonLdRaw).toBeTruthy();
    const jsonLd = JSON.parse(jsonLdRaw!);
    expect(jsonLd['@context']).toBe('https://schema.org');
    const types = (jsonLd['@graph'] || []).flatMap((node: any) =>
      Array.isArray(node['@type']) ? node['@type'] : [node['@type']]
    );
    expect(types).toContain('Organization');
    expect(types).toContain('WebSite');
    expect(types).toContain('WebPage');
    expect(types).toContain('SoftwareApplication');
    expect(jsonLdRaw).not.toContain('aggregateRating');
    if (route.expectFaqSchema) {
      expect(types).toContain('FAQPage');
    }

    // 7. Visible H1 present and CLS low
    const h1Text = await page.locator('h1').first().textContent();
    expect((h1Text || '').trim().length).toBeGreaterThan(5);
    const cls = await page.evaluate(() => (window as any).__clsValue || 0);
    expect(cls).toBeLessThan(0.1);
  });
}
