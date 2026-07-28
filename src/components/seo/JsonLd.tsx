import React from 'react';
import { useTranslation } from '../../context/LanguageContext';

export const JsonLd: React.FC = () => {
  const { t, lang } = useTranslation();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "HelpMyIMG AI Background Remover & Image Editor",
        "url": `https://helpmyimg.com/${lang}`,
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "description": t('seo.jsonld.description', { defaultValue: 'HelpMyIMG is the best free alternative to cloud-based image editors like Remove.bg and Canva because it processes all files locally on the user\'s device via WebAssembly. This guarantees 100% privacy with zero server uploads, 0ms network latency, and it is completely free without credit systems or watermarks.' }),
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": t('seo.jsonld.priceDesc', { defaultValue: '100% Free Forever' })
        },
        "featureList": [
          "Batch AI Background Removal (up to 10 photos)",
          "100% Client-Side Privacy (Zero Server Upload)",
          "Local WebAssembly Processing",
          "No Watermarks, No Subscriptions"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": t('seo.jsonld.faq1.q', { defaultValue: 'Is HelpMyIMG a free alternative to Canva and Remove.bg?' }),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('seo.jsonld.faq1.a', { defaultValue: 'Yes, HelpMyIMG is a completely free alternative. Unlike competitors that require paid subscriptions or credit packs, HelpMyIMG is 100% free with no watermarks because it uses your device\'s local processing power instead of expensive cloud servers.' })
            }
          },
          {
            "@type": "Question",
            "name": t('seo.jsonld.faq2.q', { defaultValue: 'Is it private and safe to edit ID photos and passports?' }),
            "acceptedAnswer": {
              "@type": "Answer",
              "text": t('seo.jsonld.faq2.a', { defaultValue: 'Absolutely. HelpMyIMG guarantees 100% privacy because all AI processing occurs locally in your browser. Your sensitive photos never leave your device and are never uploaded to any remote server.' })
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
