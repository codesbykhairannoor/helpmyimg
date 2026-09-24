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
  citationFirst?: string;
  quantitativeProof?: string;
  internalTool?: string;
  infoPage?: InfoPageType;
  keywordSlug?: string;
}

const SUPPORTED_LANGS = SUPPORTED_LANGUAGES.map((l) => l.code);
const DOMAIN = 'https://helpmyimg.com';

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  lang = 'en',
  faqs = [],
  citationFirst = '',
  quantitativeProof = '',
  internalTool,
  infoPage,
  keywordSlug
}) => {
  const fullUrl = `${DOMAIN}${canonicalPath.startsWith('/') ? canonicalPath : '/' + canonicalPath}`;
  
  let defaultUrl = `${DOMAIN}/`;
  if (infoPage) {
    defaultUrl = `${DOMAIN}/${getLocalizedInfoSlug(infoPage, 'en')}/`;
  } else if (internalTool) {
    defaultUrl = `${DOMAIN}/${getLocalizedSlug(internalTool as InternalTool, 'en')}/${keywordSlug ? `${keywordSlug}/` : ''}`;
  }

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": title,
      "operatingSystem": "Web Browser (Windows, macOS, Android, iOS)",
      "applicationCategory": "UtilitiesApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": description,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.98",
        "ratingCount": "142850"
      },
      "featureList": [
        "100% Client-Side WebGPU & WebAssembly AI Processing",
        "Zero Server Upload - Absolute Data Privacy",
        "Unlimited File Size - No Server Restrictions",
        "Free Batch Processing up to 30 photos simultaneously",
        "Official Biometric Passport Colors & Formats",
        "Faster and safer than cloud alternatives like iloveimg or remove.bg"
      ]
    }
  ];

  if (faqs && faqs.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
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

  if (citationFirst || quantitativeProof) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": citationFirst || description,
      "author": {
        "@type": "Organization",
        "name": "HelpMyIMG AI Engineering Team"
      },
      "publisher": {
        "@type": "Organization",
        "name": "HelpMyIMG",
        "logo": {
          "@type": "ImageObject",
          "url": `${DOMAIN}/logobaru.png`
        }
      },
      "mainEntityOfPage": fullUrl
    });
  }

  return (
    <Helmet>
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
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="HelpMyIMG" />
      <meta property="og:locale" content={lang} />

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
          lPath = l === 'en' ? `/${pathSlug}/${keywordSlug ? `${keywordSlug}/` : ''}` : `/${l}/${pathSlug}/${keywordSlug ? `${keywordSlug}/` : ''}`;
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

      {/* Dynamic JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>
    </Helmet>
  );
};
