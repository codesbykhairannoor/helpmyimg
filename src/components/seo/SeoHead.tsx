import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SUPPORTED_LANGUAGES } from '../../i18n/translations';
import { getLocalizedSlug, type InternalTool } from '../../utils/urlMapper';

interface SeoHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  lang?: string;
  faqs?: { question: string; answer: string }[];
  citationFirst?: string;
  quantitativeProof?: string;
  internalTool?: string;
  keywordSlug?: string;
}

const SUPPORTED_LANGS = SUPPORTED_LANGUAGES.map((l) => l.code);

export const SeoHead: React.FC<SeoHeadProps> = ({
  title,
  description,
  canonicalPath = '',
  faqs = [],
  citationFirst = '',
  quantitativeProof = '',
  internalTool,
  keywordSlug
}) => {
  const fullUrl = `https://helpmyimg.com${canonicalPath}`;
  const defaultUrl = `https://helpmyimg.com/${getLocalizedSlug((internalTool as InternalTool) || 'remove', 'en')}${keywordSlug ? `/${keywordSlug}` : ''}`.replace('//', '/');

  const schemas: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "HelpMyIMG WebGPU AI Editor",
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
        "100% Client-Side WebGPU AI Processing (0ms Latency)",
        "Zero Server Upload - Absolute Data Privacy",
        "Unlimited File Size - No Server Restrictions",
        "Free Batch Processing up to 10 photos simultaneously",
        "DSLR Bokeh Portrait Blur Simulation",
        "Official Biometric Passport Colors (#DB1514 Red CPNS, #00529C Blue KTP)",
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
          "url": "https://helpmyimg.com/logobaru.png"
        }
      },
      "mainEntityOfPage": fullUrl
    });
  }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      
      {/* Canonical Link */}
      <link rel="canonical" href={fullUrl} />

      {/* hrefLang Alternate Links untuk 30 Bahasa */}
      {SUPPORTED_LANGS.map((l) => {
        const pathSlug = getLocalizedSlug((internalTool as InternalTool) || 'remove', l);
        const lPath = l === 'en' ? `/${pathSlug}` : `/${l}/${pathSlug}`;
        return (
          <link key={l} rel="alternate" hrefLang={l} href={`https://helpmyimg.com${lPath}${keywordSlug ? `/${keywordSlug}` : ''}`.replace('//', '/')} />
        );
      })}
      {/* x-default untuk Googlebot */}
      <link rel="alternate" hrefLang="x-default" href={defaultUrl} />

      {/* Dynamic JSON-LD Injection */}
      <script type="application/ld+json">
        {JSON.stringify(schemas)}
      </script>
    </Helmet>
  );
};
