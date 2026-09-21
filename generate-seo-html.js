import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOMAIN = 'https://helpmyimg.com';

// Setup directories
const publicDir = path.join(__dirname, 'public');
const localesDir = path.join(publicDir, 'locales');
const distDir = path.join(__dirname, 'dist');

// Make sure build happened
if (!fs.existsSync(distDir)) {
  console.error('dist/ directory not found. Please run vite build first.');
  process.exit(1);
}

// 1. Get supported languages
let LANGS = ['en'];
try {
  LANGS = fs.readdirSync(localesDir).filter(dir => {
    return fs.statSync(path.join(localesDir, dir)).isDirectory();
  });
} catch (error) {
  console.warn('Warning: Could not read public/locales. Using default languages.');
}

// 2. Parse URL Mapper to get localized tool slugs
let slugMap = {};
try {
  const urlMapperContent = fs.readFileSync(path.join(__dirname, 'src', 'utils', 'urlMapper.ts'), 'utf8');
  const slugMapRegex = /export const SLUG_MAP[\s\S]*?=\s*({[\s\S]*?});/;
  const match = slugMapRegex.exec(urlMapperContent);
  if (match) {
    slugMap = eval('(' + match[1] + ')');
  }
} catch (error) {
  console.warn('Warning: Could not parse urlMapper.ts', error);
}

const getLocalizedSlug = (tool, lang) => {
  if (tool === 'brush') return 'magic-brush';
  if (slugMap[lang] && slugMap[lang][tool]) return slugMap[lang][tool];
  const fallbacks = { 
    remove: 'remove-background', 
    color: 'change-background', 
    watermark: 'watermark-image',
    compress: 'compress-image',
    convert: 'convert-image',
    resize: 'resize-image',
    crop: 'crop-image',
    rotate: 'rotate-image',
    picker: 'image-color-picker',
    blurface: 'blur-face',
    design: 'advanced-editor'
  };
  return fallbacks[tool] || tool;
};

// 3. Load Matrix JSON
let matrixData = [];
try {
  matrixData = JSON.parse(fs.readFileSync(path.join(publicDir, 'matrix.json'), 'utf8'));
} catch (e) {
  console.warn('Warning: Could not read public/matrix.json. Long-tail FAQs may be missing.');
}

// 4. Parse Info URL Mapper
let infoSlugMap = {};
try {
  const infoUrlMapperContent = fs.readFileSync(path.join(__dirname, 'src', 'utils', 'infoUrlMapper.ts'), 'utf8');
  const infoSlugMapRegex = /export const INFO_SLUG_MAP[\s\S]*?=\s*({[\s\S]*?});/;
  const match = infoSlugMapRegex.exec(infoUrlMapperContent);
  if (match) {
    infoSlugMap = eval('(' + match[1] + ')');
  }
} catch (error) {
  console.warn('Warning: Could not parse infoUrlMapper.ts', error);
}

const getLocalizedInfoSlug = (page, lang) => {
  if (infoSlugMap[lang] && infoSlugMap[lang][page]) return infoSlugMap[lang][page];
  return page; // EN fallback is the same as the page id
};

// Tool identifiers (All 23 tools)
const TOOLS = [
  'remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 
  'picker', 'blurface', 'design', 'brush', 'compress100kb', 'compress50kb', 'resizeig', 
  'removelogo', 'colorwhite', 'compress200kb', 'resizepassport', 'removeperson', 
  'convertwebp', 'watermarkbulk', 'blurplate'
];

// Info page identifiers (All 8 info pages)
const INFO_PAGES = ['about', 'privacy', 'terms', 'faq', 'security', 'pricing', 'compare', 'languages'];

// Title Sanitizer: Enforce max 60 chars while preventing ultra-short CJK titles
function sanitizeTitle(title, lang = 'en') {
  if (!title) return 'HelpMyIMG - Free Local AI Image Editor';
  let clean = title.trim();
  
  // Strip robotic keyword-stuffing slogans and suffixes
  clean = clean
    .replace(/\s*[-|–—]\s*(Kein Upload|Carga cero|Zero Upload|Zero Server Upload|100% Client-Side|100% DSGVO-Konform|Offline).*$/i, '')
    .replace(/\s*[-|–—]\s*(Bildgröße lokal komprimieren|comprime el tamaño de la imagen localmente|elimine el fondo de la imagen localmente).*$/i, '')
    .replace(/\s*[-|–—]\s*HelpMyIMG.*$/i, '')
    .trim();
  
  // For CJK languages, expand if too short (< 6 chars)
  if (['zh', 'ja', 'ko'].includes(lang) && clean.length < 6) {
    if (lang === 'zh') clean = `${clean} | 免费本地 AI 图像编辑`;
    else if (lang === 'ja') clean = `${clean} | 完全無料ローカルAI画像編集`;
    else if (lang === 'ko') clean = `${clean} | 완전 무료 로컬 AI 이미지 편집`;
  }
  
  const suffix = ' - HelpMyIMG';
  const maxCleanLen = 60 - suffix.length; // 48 chars
  
  if (clean.length > maxCleanLen) {
    clean = clean.substring(0, maxCleanLen).replace(/[, -]+$/, '').trim();
  }
  
  return `${clean}${suffix}`;
}

// Meta Description Sanitizer: Target 110 - 155 chars
function sanitizeDescription(desc, lang = 'en') {
  let text = (desc || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  
  if (!text) {
    text = 'Free local AI photo editor. Remove background, compress, convert, and resize images directly in your browser with 100% privacy and zero server uploads.';
  }
  
  // Expand short descriptions (< 95 chars) across all languages
  if (text.length < 95) {
    const valuePropMap = {
      en: ' 100% private, runs directly in your browser via WebAssembly with zero server uploads.',
      id: ' 100% gratis, berjalan langsung di browser via WebAssembly tanpa upload ke server.',
      zh: ' 纯前端 WebAssembly 驱动，100% 本地浏览器安全运行，零服务器上传，保护隐私，无文件大小限制，支持批量快速转换与高清免费下载。',
      ja: ' 純粋な WebAssembly 駆動により 100% ブラウザ内ローカル処理で完全プライベート。サーバー送信なし、個人情報を完全保護、無制限高品質ダウンロード。',
      ko: ' WebAssembly 기반 100% 브라우저 로컬 처리로 완벽한 개인정보 보호. 서버 파일 업로드 없음, 무제한 배치 처리 및 고화질 무료 다운로드.',
      ar: ' معالجة محلية 100% في المتصفح عبر WebAssembly مع خصوصية تامة وبدون خوادم سحابية.',
      es: ' 100% privado, se ejecuta directamente en su navegador mediante WebAssembly sin servidor.',
      fr: ' 100% privé, fonctionne directement dans votre navigateur via WebAssembly sans serveur.',
      de: ' 100% privat, läuft direkt im Browser über WebAssembly ohne Server-Uploads.',
      it: ' 100% privato, funziona direttamente nel browser tramite WebAssembly senza upload.'
    };
    const prop = valuePropMap[lang] || valuePropMap['en'];
    text = `${text}${prop}`;
  }
  
  // Trim if exceeds 155 chars
  if (text.length > 155) {
    let trimmed = text.substring(0, 152);
    const lastSpace = Math.max(
      trimmed.lastIndexOf(' '), 
      trimmed.lastIndexOf('.'), 
      trimmed.lastIndexOf('，'), 
      trimmed.lastIndexOf('。'),
      trimmed.lastIndexOf('،')
    );
    if (lastSpace > 105) {
      trimmed = trimmed.substring(0, lastSpace);
    }
    text = trimmed.replace(/[,; -]+$/, '') + '...';
  }
  
  return text;
}

// Read the original index.html built by Vite
const indexHtmlContent = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Strip hardcoded meta tags, hreflangs, and existing SEO tags to ensure a fresh clean injection
let baseHtmlContent = indexHtmlContent
  .replace(/<link rel="alternate" hreflang="[^"]+" href="[^"]+" \/>\n?\s*/g, '')
  .replace(/<!-- Static Hreflang Tags for 30 Languages -->\n?\s*/g, '')
  .replace(/<meta property="og:[^"]+" content="[^"]*" \/>\n?\s*/gi, '')
  .replace(/<meta name="twitter:[^"]+" content="[^"]*" \/>\n?\s*/gi, '')
  .replace(/<link rel="canonical" href="[^"]*" \/>\n?\s*/gi, '');

// Function to generate rich semantic HTML for high word count (> 300 words) & full internal linking
function generateSemanticHtml(lang, urlPath, title, desc, tool, infoPage, translations) {
  const containerStyle = 'position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border-width: 0;';
  
  // 1. Heading & Overview
  const h1 = title.replace(/\s*[-|]\s*HelpMyIMG.*$/i, '');
  const overviewText = desc;
  
  // 2. Features
  let featuresHtml = '';
  if (tool) {
    for (let i = 1; i <= 4; i++) {
      const featTitle = translations[`longtail.${tool.toLowerCase()}.feat${i}.title`] || translations[`features.f${i}.title`] || `Feature ${i}`;
      const featDesc = translations[`longtail.${tool.toLowerCase()}.feat${i}.desc`] || translations[`features.f${i}.desc`] || `High performance client-side WebAssembly processing with zero latency.`;
      featuresHtml += `<div><h3>${featTitle}</h3><p>${featDesc}</p></div>`;
    }
  } else if (infoPage) {
    featuresHtml += `
      <div><h3>100% Client-Side Privacy</h3><p>Your photos are processed directly on your device GPU/CPU via WebAssembly and Web Workers. No files are ever uploaded to cloud servers.</p></div>
      <div><h3>Zero-Latency Architecture</h3><p>Instantaneous execution without waiting in cloud queues or uploading large multi-megabyte image files.</p></div>
      <div><h3>Unlimited Batch Processing</h3><p>Edit, convert, crop, compress, and watermark dozens of images at once for free without artificial restrictions or credits.</p></div>
      <div><h3>Global Accessibility</h3><p>Fully translated into 30 languages with native RTL support for Arabic and Hebrew.</p></div>
    `;
  } else {
    for (let i = 1; i <= 4; i++) {
      const featTitle = translations[`features.f${i}.title`] || `Core Capability ${i}`;
      const featDesc = translations[`features.f${i}.desc`] || `Browser-native high speed image transformation and AI segmentation.`;
      featuresHtml += `<div><h3>${featTitle}</h3><p>${featDesc}</p></div>`;
    }
  }

  // 3. How to Use / Step-by-Step Guide
  const howToHtml = `
    <section>
      <h2>Step-by-Step How To Guide</h2>
      <ol>
        <li><strong>Step 1: Upload or Drag & Drop</strong> - Select your image files from your computer, tablet, or smartphone. Multiple files are supported for batch processing.</li>
        <li><strong>Step 2: Configure Settings</strong> - Choose your desired tool, adjustment sliders, background colors, compression thresholds, or watermark parameters.</li>
        <li><strong>Step 3: Instant Processing & Download</strong> - Preview results in real-time with our interactive before/after slider and download your crystal-clear image in full resolution.</li>
      </ol>
    </section>
  `;

  // 4. Technical Specs
  const techSpecsHtml = `
    <section>
      <h2>Architecture & Technical Specifications</h2>
      <p>HelpMyIMG utilizes modern browser APIs including WebAssembly (WASM), WebGPU, OffscreenCanvas, and dedicated Web Workers. Machine learning models such as Bria RMBG-1.4 and MediaPipe vision tasks execute in an isolated background thread, ensuring your main UI thread remains smooth and 100% responsive at 60 FPS.</p>
      <ul>
        <li>Client-Side Neural Network Inference: ONNX Runtime WASM via @huggingface/transformers.</li>
        <li>Lossless & Lossy Compression Engine: Browser-native Canvas 2D with smart chroma subsampling.</li>
        <li>Data Privacy Guarantee: Strict GDPR and CCPA compliance by never sending image payload bytes across the internet.</li>
      </ul>
    </section>
  `;

  // 4b. Scientific Foundations & Research Bibliography
  const researchTitle = translations['home.research.title'] || 'Algorithmic Principles & Peer-Reviewed Foundations';
  const researchDesc = translations['home.research.desc'] || 'HelpMyIMG is engineered upon open, peer-reviewed computer vision and distributed systems research.';
  const noticeText = translations['home.research.notice'] || 'Academic Attribution Notice: Citations and institutional references are provided solely for scholarly transparency and attribution of open algorithmic foundations.';

  const scientificResearchHtml = `
    <section>
      <h2>${researchTitle}</h2>
      <p>${researchDesc}</p>
      <ul>
        <li><strong>Neural Matting & Saliency:</strong> Ke et al., "MODNet: Real-Time Trimap-Free Portrait Matting via Objective Decomposition", AAAI 2022 / Qin et al., "Highly Accurate Dichotomous Image Segmentation (IS-Net / DIS)", ECCV 2022.</li>
        <li><strong>Perceptual Quality & SSIM:</strong> Wang et al., "Image Quality Assessment: From Error Visibility to Structural Similarity (SSIM)", IEEE Transactions on Image Processing (IEEE TIP), 2004.</li>
        <li><strong>In-Browser WebAssembly Acceleration:</strong> Haas et al., "Bringing the Web up to Speed with WebAssembly", ACM SIGPLAN PLDI 2017.</li>
        <li><strong>Local-First Privacy Architecture:</strong> Kleppmann et al., "Local-First Software: You Own Your Data, in Spite of the Cloud", ACM SIGPLAN Onward! 2019.</li>
        <li><strong>Ultra-Fast Neural Face Detection:</strong> Bazarevsky et al., "BlazeFace: Sub-millisecond Neural Face Detection on Mobile GPUs", Google Research, CVPR Workshop 2019.</li>
      </ul>
      <p><small>${noticeText}</small></p>
    </section>
  `;

  // 5. FAQ section
  let faqsHtml = '';
  const matrixItem = tool ? matrixData.find(m => m.tool === tool && (m.lang === lang || m.lang === (lang === 'zh-CN' ? 'zh' : lang))) : null;
  if (matrixItem && matrixItem.faqs && matrixItem.faqs.length > 0) {
    for (const faq of matrixItem.faqs) {
      faqsHtml += `<div><h3>${faq.question}</h3><p>${faq.answer}</p></div>`;
    }
  } else {
    for (let i = 1; i <= 4; i++) {
      const q = translations[`landing.${tool || 'home'}.faq${i}.q`] || translations[`faq${i}.q`] || `Frequently Asked Question ${i}`;
      const a = translations[`landing.${tool || 'home'}.faq${i}.a`] || translations[`faq${i}.a`] || `HelpMyIMG runs 100% locally in your browser. It is completely free, secure, and preserves your privacy.`;
      faqsHtml += `<div><h3>${q}</h3><p>${a}</p></div>`;
    }
  }

  // 6. Navigation Hub: All 23 Tools + 8 Info Pages (Guarantees > 30 internal outlinks & 0 orphan pages)
  let toolsNavLinks = '';
  for (const t of TOOLS) {
    const slug = getLocalizedSlug(t, lang);
    const linkPath = `/${lang}/${slug}/`;
    const label = translations[`tab.${t}`] || translations[`nav.${t}`] || translations[`seo.jsonld.name.${t}`] || t;
    toolsNavLinks += `<li><a href="${linkPath}">${label}</a></li>`;
  }

  let infoNavLinks = '';
  for (const p of INFO_PAGES) {
    const slug = getLocalizedInfoSlug(p, lang);
    const linkPath = `/${lang}/${slug}/`;
    const label = translations[`footer.${p}`] || translations[`nav.${p}`] || p;
    infoNavLinks += `<li><a href="${linkPath}">${label}</a></li>`;
  }

  const navHubHtml = `
    <nav aria-label="Tools Navigation">
      <h2>Free Online Image Tools</h2>
      <ul>
        <li><a href="/${lang}/">HelpMyIMG Home (${lang.toUpperCase()})</a></li>
        ${toolsNavLinks}
      </ul>
    </nav>
    <nav aria-label="Company Resources and Legal">
      <h2>Resources and Information</h2>
      <ul>
        ${infoNavLinks}
      </ul>
    </nav>
  `;

  return `
    <div style="${containerStyle}">
      <header>
        <h1>${h1}</h1>
        <p>${overviewText}</p>
      </header>
      <section>
        <h2>Key Features & Capabilities</h2>
        ${featuresHtml}
      </section>
      ${howToHtml}
      ${techSpecsHtml}
      ${scientificResearchHtml}
      <section>
        <h2>Frequently Asked Questions</h2>
        ${faqsHtml}
      </section>
      ${navHubHtml}
    </div>
  `;
}

// Function to generate the modified HTML
const generateHtml = (lang, urlPath, rawTitle, rawDesc, tool = null, translations = {}, infoPage = null) => {
  let html = baseHtmlContent;

  const seoTitle = sanitizeTitle(rawTitle, lang);
  const seoDesc = sanitizeDescription(rawDesc, lang);
  const canonicalUrl = `${DOMAIN}${urlPath}`;

  // 0. Remove any existing meta descriptions & titles to avoid duplicates
  html = html.replace(/<meta name="description"[^>]*>\n?\s*/gi, '');
  html = html.replace(/<title>.*?<\/title>/i, '');

  // 1. Replace <html lang="en">
  html = html.replace(/<html lang="[^"]+">/i, `<html lang="${lang}">`);

  // 2. Generate and inject dynamic hreflangs for THIS specific route
  let dynamicHreflangs = `<!-- Dynamic Localized Hreflang Tags for 30 Languages -->\n`;
  for (const l of LANGS) {
    let targetPath = `/${l}/`;
    if (tool) {
      targetPath = `/${l}/${getLocalizedSlug(tool, l)}/`;
    } else if (infoPage) {
      targetPath = `/${l}/${getLocalizedInfoSlug(infoPage, l)}/`;
    }
    dynamicHreflangs += `    <link rel="alternate" hreflang="${l}" href="${DOMAIN}${targetPath}" />\n`;
  }
  
  let xDefaultPath = `/en/`;
  if (tool) {
    xDefaultPath = `/en/${getLocalizedSlug(tool, 'en')}/`;
  } else if (infoPage) {
    xDefaultPath = `/en/${getLocalizedInfoSlug(infoPage, 'en')}/`;
  }
  dynamicHreflangs += `    <link rel="alternate" hreflang="x-default" href="${DOMAIN}${xDefaultPath}" />\n`;

  // 3. Complete Open Graph & Twitter Meta Tags
  const metaTags = `    <title>${seoTitle}</title>
    <meta name="description" content="${seoDesc}" />
    <link rel="canonical" href="${canonicalUrl}" />
    
    <!-- Open Graph / Facebook Meta Tags -->
    <meta property="og:title" content="${seoTitle}" />
    <meta property="og:description" content="${seoDesc}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${DOMAIN}/images.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="HelpMyIMG" />
    <meta property="og:locale" content="${lang}" />

    <!-- Twitter (X) Meta Tags -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seoTitle}" />
    <meta name="twitter:description" content="${seoDesc}" />
    <meta name="twitter:image" content="${DOMAIN}/images.png" />
    <meta name="twitter:site" content="@HelpMyIMG" />
`;

  // 4. Inject JSON-LD Structured Data for True GEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": seoTitle,
        "url": canonicalUrl,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires WebAssembly support. Chrome 89+, Safari 15+, Firefox 79+",
        "description": seoDesc,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      }
    ]
  };

  const faqEntities = [];
  if (tool) {
    const matrixItem = matrixData.find(m => m.tool === tool && (m.lang === lang || m.lang === (lang === 'zh-CN' ? 'zh' : lang)));
    if (matrixItem && matrixItem.faqs) {
      for (const faq of matrixItem.faqs) {
        faqEntities.push({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        });
      }
    } else {
      for (let i = 1; i <= 5; i++) {
        const q = translations[`landing.${tool}.faq${i}.q`];
        const a = translations[`landing.${tool}.faq${i}.a`];
        if (q && a) {
          faqEntities.push({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": { "@type": "Answer", "text": a }
          });
        }
      }
    }
  } else {
    for (let i = 1; i <= 4; i++) {
      const q = translations[`faq${i}.q`];
      const a = translations[`faq${i}.a`];
      if (q && a) {
        faqEntities.push({
          "@type": "Question",
          "name": q,
          "acceptedAnswer": { "@type": "Answer", "text": a }
        });
      }
    }
  }

  if (faqEntities.length > 0) {
    jsonLd["@graph"].push({
      "@type": "FAQPage",
      "mainEntity": faqEntities
    });
  }

  const jsonLdScript = `    <script type="application/ld+json">\n${JSON.stringify(jsonLd)}\n    </script>\n`;

  html = html.replace(/(<\/head>)/i, `${metaTags}${dynamicHreflangs}${jsonLdScript}  $1`);

  // 5. Inject Rich Semantic HTML into <div id="root">
  const semanticHtml = generateSemanticHtml(lang, urlPath, seoTitle, seoDesc, tool, infoPage, translations);
  html = html.replace(/<div id="root"><\/div>/, `<div id="root">${semanticHtml}</div>`);

  return html;
};

// Create directories and write files
let generatedCount = 0;

for (const lang of LANGS) {
  let translations = {};
  try {
    translations = JSON.parse(fs.readFileSync(path.join(localesDir, lang, 'translation.json'), 'utf8'));
  } catch (e) {
    console.error(`Missing or invalid translation.json for ${lang}`);
    continue;
  }

  // 1. Generate Home Page (/lang/)
  const homeTitle = translations['home.tab.title'] || translations['hero.title'] || 'All Image Tools in One Place';
  const homeDesc = translations['hero.subtitle.short'] || translations['hero.subtitle'] || translations['seo.jsonld.description'] || 'Free local AI photo editor. Remove backgrounds, compress, resize, and convert images.';
  
  const homeHtml = generateHtml(lang, `/${lang}/`, homeTitle, homeDesc, null, translations, null);
  const homeDir = path.join(distDir, lang);
  if (!fs.existsSync(homeDir)) fs.mkdirSync(homeDir, { recursive: true });
  fs.writeFileSync(path.join(homeDir, 'index.html'), homeHtml, 'utf8');
  generatedCount++;

  // For English, also overwrite the base root index.html for root domain SEO
  if (lang === 'en') {
    fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml, 'utf8');
    generatedCount++;
  }

  // 2. Generate Tool Pages (/lang/slug/)
  for (const tool of TOOLS) {
    const slug = getLocalizedSlug(tool, lang);
    const toolUrl = `/${lang}/${slug}/`;
    
    let toolTitle = translations[`landing.default.title.${tool}`] || translations[`seo.title.${tool}`] || translations[`seo.jsonld.name.${tool}`] || translations[`tab.${tool}`] || translations[`tool.${tool}`] || translations['hero.title'] || tool;
    let toolDesc = translations[`landing.default.desc.${tool}`] || translations[`seo.jsonld.desc.${tool}`] || homeDesc;

    const toolHtml = generateHtml(lang, toolUrl, toolTitle, toolDesc, tool, translations, null);
    const toolDir = path.join(distDir, lang, slug);
    if (!fs.existsSync(toolDir)) fs.mkdirSync(toolDir, { recursive: true });
    fs.writeFileSync(path.join(toolDir, 'index.html'), toolHtml, 'utf8');
    generatedCount++;

    // For English, also duplicate to root level for SEO
    if (lang === 'en') {
      const rootToolDir = path.join(distDir, slug);
      if (!fs.existsSync(rootToolDir)) fs.mkdirSync(rootToolDir, { recursive: true });
      fs.writeFileSync(path.join(rootToolDir, 'index.html'), toolHtml, 'utf8');
      generatedCount++;
    }
  }

  // 3. Generate Info Pages (/lang/info-slug/)
  for (const page of INFO_PAGES) {
    const slug = getLocalizedInfoSlug(page, lang);
    const pageUrl = `/${lang}/${slug}/`;
    
    let pageTitleKey = `footer.${page}`;
    if (page === 'faq') pageTitleKey = 'nav.faq';
    
    let pageTitle = translations[pageTitleKey] || page;
    let pageDesc = translations[`${page}.subtitle`] || translations[`${page}.intro`] || homeDesc;
    
    const pageHtml = generateHtml(lang, pageUrl, pageTitle, pageDesc, null, translations, page);
    const pageDir = path.join(distDir, lang, slug);
    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });
    fs.writeFileSync(path.join(pageDir, 'index.html'), pageHtml, 'utf8');
    generatedCount++;

    // For English info pages, also duplicate to root level
    if (lang === 'en') {
      const rootPageDir = path.join(distDir, slug);
      if (!fs.existsSync(rootPageDir)) fs.mkdirSync(rootPageDir, { recursive: true });
      fs.writeFileSync(path.join(rootPageDir, 'index.html'), pageHtml, 'utf8');
      generatedCount++;
    }
  }
}

console.log(`✅ Successfully generated ${generatedCount} localized SEO HTML Shells in dist/ with full Open Graph, Twitter Cards, Hreflangs & Internal Links.`);
