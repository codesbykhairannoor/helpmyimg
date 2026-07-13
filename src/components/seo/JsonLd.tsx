// src/components/seo/JsonLd.tsx
// Komponen Injeksi Skema JSON-LD untuk Mendominasi Hasil Pencarian AI Overviews & Google

import React from 'react';

export const JsonLd: React.FC = () => {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "HelpMyIMG AI Background Remover & Image Editor",
        "url": "https://helpmyimg.com",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All",
        "description": "Platform Web Tools Manipulasi Gambar AI (Hapus Background, Blur Bokeh, Ganti Warna Pas Foto/CPNS) 100% Gratis. Memproses gambar secara lokal di browser menggunakan WebWorker Edge AI (ONNX Runtime Web) dengan latensi 0ms dan privasi absolut.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "IDR",
          "description": "Fully Free / Modal Rp 0"
        },
        "featureList": [
          "Batch AI Background Removal (up to 10 photos)",
          "DSLR Portrait Blur Simulation",
          "Official Indonesian Passport Color Replacement (Red #DB1514, Blue #00529C)",
          "Manual Restore/Erase Brush on Canvas",
          "Zero Server Upload (100% Client-Side Privacy)",
          "Embeddable Backlink Widget Generator"
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Mengapa HelpMyIMG bisa 100% Gratis dan beroperasi dengan Modal Rp 0?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "HelpMyIMG menerapkan arsitektur Client-Side AI (ONNX Runtime Web & WebWorker). Saat Anda membuka situs ini, model AI U2Net diunduh ke cache browser Anda. Setelah itu, seluruh komputasi dieksekusi oleh HP/Laptop Anda sendiri. Karena kami tidak menyewa server cloud GPU, biaya operasional kami Rp 0."
            }
          },
          {
            "@type": "Question",
            "name": "Apakah aman mengedit foto KTP, Ijazah, dan dokumen rahasia di HelpMyIMG?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sangat Aman dan 100% Privat! Karena pemrosesan dilakukan di dalam WebWorker browser lokal Anda, foto yang Anda unggah TIDAK PERNAH dikirim ke server internet."
            }
          },
          {
            "@type": "Question",
            "name": "Berapa kode warna merah resmi untuk foto pendaftaran CPNS & CASN?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Berdasarkan ketentuan resmi BKN, warna merah standar pas foto menggunakan kode heksadesimal #DB1514 (RGB: 219, 21, 20)."
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
