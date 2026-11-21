import React from 'react';
import { Helmet } from 'react-helmet-async';
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

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  lang = 'en',
  faqs = [],
  internalTool,
  infoPage,
}) => {
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

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${DOMAIN}/#organization`,
      "name": "HelpMyIMG",
      "url": DOMAIN,
      "logo": {
        "@type": "ImageObject",
        "url": `${DOMAIN}/logo.webp`,
        "width": 180,
        "height": 60
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

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": graph
  };

  return (
    <Helmet htmlAttributes={{ lang }}>
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

      {/* Unified Dynamic JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaGraph)}
      </script>
    </Helmet>
  );
};
