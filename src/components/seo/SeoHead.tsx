import React, { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import type { Graph, Thing } from 'schema-dts';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { getLocalizedSlug, type InternalTool } from '../../utils/urlMapper';
import { getLocalizedInfoSlug, type InfoPageType } from '../../utils/infoUrlMapper';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  lang?: string;
  faqs?: { question: string; answer: string }[];
  internalTool?: string;
  infoPage?: InfoPageType;
}

const SUPPORTED_LANGS = SUPPORTED_LANGUAGES.map((l) => l.code);
const DOMAIN = 'https://helpmyimg.com';

const OG_LOCALE_MAP: Record<string, string> = {
  en: 'en_US', id: 'id_ID', es: 'es_ES', fr: 'fr_FR', de: 'de_DE',
  ja: 'ja_JP', ar: 'ar_SA', ru: 'ru_RU', pt: 'pt_BR', zh: 'zh_CN',
  ko: 'ko_KR', it: 'it_IT', tr: 'tr_TR', vi: 'vi_VN', th: 'th_TH',
  hi: 'hi_IN', nl: 'nl_NL', pl: 'pl_PL', sv: 'sv_SE', no: 'nb_NO',
  da: 'da_DK', fi: 'fi_FI', el: 'el_GR', he: 'he_IL', cs: 'cs_CZ',
  hu: 'hu_HU', ro: 'ro_RO', uk: 'uk_UA', ms: 'ms_MY', tl: 'tl_PH',
};

const VALUE_PROP_MAP: Record<string, string> = {
  en: ' 100% private, runs locally via WebAssembly with zero server uploads.',
  id: ' 100% privat, berjalan lokal di browser via WebAssembly tanpa upload ke server.',
  zh: ' 纯前端 WebAssembly 驱动，100% 本地浏览器安全运行，零服务器上传。',
  ja: ' WebAssembly 駆動で 100% ブラウザ内ローカル処理、サーバー送信なし。',
  ko: ' WebAssembly 기반 100% 브라우저 로컬 처리, 서버 파일 업로드 없음.',
  ar: ' معالجة محلية 100% في المتصفح عبر WebAssembly مع خصوصية تامة وبدون خوادم سحابية.',
  es: ' 100% privado, se ejecuta localmente mediante WebAssembly sin subir archivos al servidor.',
  fr: ' 100% privé, s’exécute localement via WebAssembly sans envoi vers un serveur.',
  de: ' 100% privat, läuft lokal im Browser über WebAssembly ohne Server-Uploads.',
  it: ' 100% privato, eseguito localmente nel browser tramite WebAssembly senza upload sul server.',
  pt: ' 100% privado, executado localmente no navegador via WebAssembly sem envio ao servidor.',
  ru: ' 100% приватно: локальная обработка в браузере через WebAssembly без загрузки на сервер.',
  uk: ' 100% приватно: локальна обробка в браузері через WebAssembly без завантаження на сервер.',
  tr: ' %100 gizli, sunucuya yükleme olmadan tarayıcıda WebAssembly ile yerel olarak çalışır.',
  vi: ' Riêng tư 100%, chạy cục bộ trên trình duyệt qua WebAssembly, không tải lên máy chủ.',
  th: ' เป็นส่วนตัว 100% ประมวลผลในเบราว์เซอร์ผ่าน WebAssembly โดยไม่อัปโหลดไปยังเซิร์ฟเวอร์',
  hi: ' 100% निजी, बिना सर्वर अपलोड के WebAssembly द्वारा सीधे ब्राउज़र में चलता है।',
  nl: ' 100% privé, draait lokaal in uw browser via WebAssembly zonder server-uploads.',
  pl: ' 100% prywatności, działa lokalnie w przeglądarce przez WebAssembly bez wysyłania na serwer.',
  sv: ' 100% privat, körs lokalt i webbläsaren via WebAssembly utan serveruppladdningar.',
  no: ' 100% privat, kjører lokalt i nettleseren via WebAssembly uten serveropplastinger.',
  da: ' 100% privat, kører lokalt i browseren via WebAssembly uden serveruploads.',
  fi: ' 100% yksityinen, toimii paikallisesti selaimessa WebAssemblyn avulla ilman palvelinlatauksia.',
  el: ' 100% ιδιωτικό, εκτελείται τοπικά στον browser μέσω WebAssembly χωρίς μεταφορτώσεις.',
  he: ' פרטי ב-100%, פועל מקומית בדפדפן באמצעות WebAssembly ללא העלאה לשרת.',
  cs: ' 100% soukromé, běží lokálně v prohlížeči přes WebAssembly bez nahrávání na server.',
  hu: ' 100% privát, helyben fut a böngészőben WebAssembly segítségével, szerverfeltöltés nélkül.',
  ro: ' 100% privat, rulează local în browser prin WebAssembly fără încărcări pe server.',
  ms: ' 100% peribadi, berjalan secara tempatan dalam pelayar melalui WebAssembly tanpa muat naik pelayan.',
  tl: ' 100% pribado, lokal na gumagana sa browser gamit ang WebAssembly nang walang server upload.',
};

function sanitizeSeoTitle(rawInput: string, lang: string): string {
  const raw = (rawInput || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!raw) return 'HelpMyIMG - Free Local AI Image Editor';
  const trimWordBoundary = (str: string, maxLen: number) => {
    if (str.length <= maxLen) return str;
    if (['zh', 'ja', 'ko', 'th'].includes(lang)) {
      return str.substring(0, maxLen).replace(/[,、， -]+$/, '').trim();
    }
    const slice = str.substring(0, maxLen);
    const lastSpace = Math.max(slice.lastIndexOf(' '), slice.lastIndexOf('—'), slice.lastIndexOf('-'), slice.lastIndexOf(','));
    if (lastSpace > Math.floor(maxLen * 0.55)) {
      return slice.substring(0, lastSpace).replace(/[, —–-]+$/, '').trim();
    }
    return slice.replace(/[, —–-]+$/, '').trim();
  };
  if (/HelpMyIMG/i.test(raw)) {
    return trimWordBoundary(raw, 60);
  }
  const suffix = ' - HelpMyIMG';
  return `${trimWordBoundary(raw, 60 - suffix.length)}${suffix}`;
}

function sanitizeSeoDescription(rawInput: string, lang: string): string {
  let text = (rawInput || '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  if (!text) {
    text = 'Free local AI photo editor. Remove background, compress, convert, and resize images directly in your browser with 100% privacy.';
  }
  if (text.length < 110) {
    text = `${text}${VALUE_PROP_MAP[lang] || VALUE_PROP_MAP.en}`;
  }
  if (text.length > 155) {
    let trimmed = text.substring(0, 152);
    const lastSpace = Math.max(trimmed.lastIndexOf(' '), trimmed.lastIndexOf('.'), trimmed.lastIndexOf('，'), trimmed.lastIndexOf('。'), trimmed.lastIndexOf('،'));
    if (lastSpace > 105) trimmed = trimmed.substring(0, lastSpace);
    text = trimmed.replace(/[,; -]+$/, '') + '...';
  }
  return text;
}

export const SeoHead: React.FC<SeoHeadProps> = ({
  title: rawTitle,
  description: rawDescription,
  canonicalPath = '',
  lang = 'en',
  faqs = [],
  internalTool,
  infoPage,
}) => {
  const title = sanitizeSeoTitle(rawTitle, lang);
  const description = sanitizeSeoDescription(rawDescription, lang);
  const dir = ['ar', 'he'].includes(lang) ? 'rtl' : 'ltr';
  const rawPath = canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath;
  const cleanPath = rawPath === '/' ? '/' : (rawPath.endsWith('/') ? rawPath : `${rawPath}/`);
  const fullUrl = `${DOMAIN}${cleanPath}`;
  const ogLocale = OG_LOCALE_MAP[lang] || lang;

  let defaultUrl = `${DOMAIN}/`;
  if (infoPage) {
    defaultUrl = `${DOMAIN}/${getLocalizedInfoSlug(infoPage, 'en')}/`;
  } else if (internalTool) {
    defaultUrl = `${DOMAIN}/${getLocalizedSlug(internalTool as InternalTool, 'en')}/`;
  }

  const graph: Thing[] = [
    {
      "@type": "Organization",
      "@id": `${DOMAIN}/#organization`,
      "name": "HelpMyIMG",
      "url": DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/logo.webp`,
        "width": "180",
        "height": "60"
      },
      "sameAs": [
        "https://handlemyfile.com",
        "https://solvemymedia.com",
        "https://createmy-qr.com",
        "https://discord.gg/NcWY6bcVdN"
      ],
      "description": description
    },
    {
      "@type": "WebSite",
      "@id": `${DOMAIN}/#website`,
      "url": DOMAIN,
      "name": "HelpMyIMG",
      "inLanguage": lang,
      "publisher": { "@id": `${DOMAIN}/#organization` }
    },
    {
      "@type": "WebPage",
      "@id": `${fullUrl}#webpage`,
      "url": fullUrl,
      "name": title,
      "description": description,
      "isPartOf": { "@id": `${DOMAIN}/#website` },
      "publisher": { "@id": `${DOMAIN}/#organization` },
      "inLanguage": lang
    },
    {
      "@type": ["WebApplication", "SoftwareApplication"],
      "name": title,
      "url": fullUrl,
      "applicationCategory": "MultimediaApplication",
      "applicationSubCategory": "Photo Editing",
      "operatingSystem": "Web Browser (Windows, macOS, Linux, Android, iOS)",
      "browserRequirements": "Requires WebAssembly support. Chrome 89+, Safari 15+, Firefox 79+",
      "inLanguage": lang,
      "isPartOf": { "@id": `${DOMAIN}/#website` },
      "description": description,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock",
        "description": "Free Starter Tier (1080p unlimited, zero watermarks, 3 daily 4K exports on login) & optional PRO / Founder Pass"
      },
      "featureList": [
        "100% Client-Side WebGPU & WebAssembly AI Processing",
        "Zero Server Upload - Local Browser RAM Execution",
        "Batch AI Background Removal, Compression & Format Conversion",
        "Official Biometric Passport & ID Photo Presets",
        "C2PA / AI Metadata Cleaner & Lossless EXIF Studio",
        "HEIC, RAW, PSD, JXL, AVIF, WebP Client-Side Decoder"
      ],
      "screenshot": `${DOMAIN}/images.png`
    }
  ];

  if (faqs && faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "mainEntity": faqs.map((f) => ({
        "@type": "Question",
        "name": f.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.answer
        }
      }))
    });
  }

  const schemaGraph: Graph = {
    "@context": "https://schema.org",
    "@graph": graph
  };
  const schemaJson = JSON.stringify(schemaGraph);

  // React 19 native hoisting via react-helmet-async v3 does not clear static pre-rendered data-rh="true" nodes,
  // and does not hoist inline JSON-LD <script> elements into <head>. Sync both deterministically here.
  useLayoutEffect(() => {
    document.head.querySelectorAll('[data-rh="true"]').forEach((el) => el.remove());

    let ldScript = document.getElementById('helpmyimg-jsonld') as HTMLScriptElement | null;
    if (!ldScript) {
      ldScript = document.createElement('script');
      ldScript.id = 'helpmyimg-jsonld';
      ldScript.type = 'application/ld+json';
      document.head.appendChild(ldScript);
    }
    if (ldScript.textContent !== schemaJson) {
      ldScript.textContent = schemaJson;
    }
  }, [schemaJson]);

  return (
    <Helmet htmlAttributes={{ lang, dir }}>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Canonical Link */}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={`${DOMAIN}/images.png`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/images.png`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="HelpMyIMG" />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter (X) Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${DOMAIN}/images.png`} />
      <meta name="twitter:site" content="@HelpMyIMG" />

      {/* Hreflang Alternate Links for 30 Languages */}
      {SUPPORTED_LANGS.map((l) => {
        let lPath = l === 'en' ? '/' : `/${l}/`;
        if (infoPage) {
          lPath = l === 'en' ? `/${getLocalizedInfoSlug(infoPage, 'en')}/` : `/${l}/${getLocalizedInfoSlug(infoPage, l)}/`;
        } else if (internalTool) {
          const pathSlug = getLocalizedSlug(internalTool as InternalTool, l);
          lPath = l === 'en' ? `/${pathSlug}/` : `/${l}/${pathSlug}/`;
        }
        return (
          <link
            key={l}
            rel="alternate"
            hrefLang={l}
            href={`${DOMAIN}${lPath}`}
          />
        );
      })}

      {/* x-default for Global Crawlers */}
      <link rel="alternate" hrefLang="x-default" href={defaultUrl} />
    </Helmet>
  );
};
