const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

const heroCopy = {
  en: {
    "hero.badge": "⚡ 100% Local Web Engine — Zero Cloud Latency & Total Privacy",
    "hero.title": "Help Your Image Shine: Professional All-in-One AI Photo Studio",
    "hero.subtitle": "The ultimate local AI photo editing powerhouse. Remove backgrounds with hair-edge precision, generate official passport photos with custom colors, apply studio bokeh blur, compress, convert, and resize up to 10 images in seconds. 100% free, private, and powered directly by your browser—no uploads required.",
    "landing.default.title.home": "Help Your Image Shine: Professional All-in-One AI Photo Studio",
    "landing.default.desc.home": "The ultimate local AI photo editing powerhouse. Remove backgrounds with hair-edge precision, generate official passport photos with custom colors, apply studio bokeh blur, compress, convert, and resize up to 10 images in seconds. 100% free, private, and powered directly by your browser—no uploads required."
  },
  id: {
    "hero.badge": "⚡ Mesin Web Lokal 100% — Jeda Cloud 0ms & Privasi Total",
    "hero.title": "Help Your Image Shine: Studio Foto AI & Pengeditan Massal Profesional",
    "hero.subtitle": "Pusat pengeditan foto AI berteknologi lokal tercanggih. Hapus latar belakang dengan presisi helai rambut, buat pas foto resmi dengan warna kustom, aplikasikan efek bokeh studio, kompres, konversi, dan ubah ukuran hingga 10 foto sekaligus langsung di dalam browser Anda. 100% gratis, privat, dan tanpa unggah ke server cloud.",
    "landing.default.title.home": "Help Your Image Shine: Studio Foto AI & Pengeditan Massal Profesional",
    "landing.default.desc.home": "Pusat pengeditan foto AI berteknologi lokal tercanggih. Hapus latar belakang dengan presisi helai rambut, buat pas foto resmi dengan warna kustom, aplikasikan efek bokeh studio, kompres, konversi, dan ubah ukuran hingga 10 foto sekaligus langsung di dalam browser Anda. 100% gratis, privat, dan tanpa unggah ke server cloud."
  },
  ja: {
    "hero.badge": "⚡ 100% ローカルWebエンジン — クラウド遅延ゼロ＆完全プライバシー保護",
    "hero.title": "Help Your Image Shine：プロ仕様のオールインワンAI写真スタジオ",
    "hero.subtitle": "最新のローカルAI技術を搭載した究極の写真編集ツールキット。髪の毛のディテールまで正確に背景を切り抜き、証明写真の背景色変更、スタジオ品質のボケ効果、最大10枚のバッチ圧縮・変換・リサイズをブラウザ内で完結。100%完全無料＆プライバシー保護、サーバーへのアップロードは一切不要です。",
    "landing.default.title.home": "Help Your Image Shine：プロ仕様のオールインワンAI写真スタジオ",
    "landing.default.desc.home": "最新のローカルAI技術を搭載した究極の写真編集ツールキット。髪の毛のディテールまで正確に背景を切り抜き、証明写真の背景色変更、スタジオ品質のボケ効果、最大10枚のバッチ圧縮・変換・リサイズをブラウザ内で完結。100%完全無料＆プライバシー保護、サーバーへのアップロードは一切不要です。"
  },
  es: {
    "hero.badge": "⚡ Motor Web Local 100% — Cero Latencia en Nube y Privacidad Total",
    "hero.title": "Help Your Image Shine: Estudio Fotográfico AI Profesional Todo en Uno",
    "hero.subtitle": "La plataforma definitiva de edición fotográfica con inteligencia artificial local. Elimina fondos con precisión de cabello, crea fotos de pasaporte oficiales con colores personalizados, aplica desenfoque bokeh de estudio, comprime, convierte y cambia el tamaño de hasta 10 fotos a la vez directamente en tu navegador. 100% gratis, privado y sin subidas a la nube.",
    "landing.default.title.home": "Help Your Image Shine: Estudio Fotográfico AI Profesional Todo en Uno",
    "landing.default.desc.home": "La plataforma definitiva de edición fotográfica con inteligencia artificial local. Elimina fondos con precisión de cabello, crea fotos de pasaporte oficiales con colores personalizados, aplica desenfoque bokeh de estudio, comprime, convierte y cambia el tamaño de hasta 10 fotos a la vez directamente en tu navegador. 100% gratis, privado y sin subidas a la nube."
  },
  zh: {
    "hero.badge": "⚡ 100% 本地 Web 计算引擎 — 零云端延迟与绝对隐私保护",
    "hero.title": "Help Your Image Shine：专业级一站式 AI 批量图像处理与摄影工作室",
    "hero.subtitle": "基于本地 AI 计算引擎的顶尖修图工作流工具箱。精准发丝级智能抠图、官方证件照背景色定制、摄影棚级单反虚化、多达 10 张图片批量压缩、格式转换与尺寸调整，全在浏览器内超高速运行。100% 永久免费且绝对私密，无需上传任何云端服务器。",
    "landing.default.title.home": "Help Your Image Shine：专业级一站式 AI 批量图像处理与摄影工作室",
    "landing.default.desc.home": "基于本地 AI 计算引擎的顶尖修图工作流工具箱。精准发丝级智能抠图、官方证件照背景色定制、摄影棚级单反虚化、多达 10 张图片批量压缩、格式转换与尺寸调整，全在浏览器内超高速运行。100% 永久免费且绝对私密，无需上传任何云端服务器。"
  },
  hi: {
    "hero.badge": "⚡ 100% लोकल वेब इंजन — शून्य क्लाउड देरी और पूर्ण गोपनीयता",
    "hero.title": "Help Your Image Shine: पेशेवर ऑल-इन-वन AI फ़ोटो स्टूडियो और बल्क एडिटर",
    "hero.subtitle": "स्थानीय AI तकनीक से संचालित सर्वोत्तम फ़ोटो एडिटिंग पावरहाउस। बालों की सटीक कटिंग के साथ बैकग्राउंड हटाएँ, कस्टम रंगों के साथ आधिकारिक पासपोर्ट फ़ोटो बनाएँ, स्टूडियो बोकेह ब्लर लागू करें, और एक साथ 10 फ़ोटो तक कंप्रेस, कन्वर्ट और रीसाइज़ करें—सीधे अपने ब्राउज़र के अंदर। 100% मुफ़्त, निजी और किसी क्लाउड अपलोड की आवश्यकता नहीं।",
    "landing.default.title.home": "Help Your Image Shine: पेशेवर ऑल-इन-वन AI फ़ोटो स्टूडियो और बल्क एडिटर",
    "landing.default.desc.home": "स्थानीय AI तकनीक से संचालित सर्वोत्तम फ़ोटो एडिटिंग पावरहाउस। बालों की सटीक कटिंग के साथ बैकग्राउंड हटाएँ, कस्टम रंगों के साथ आधिकारिक पासपोर्ट फ़ोटो बनाएँ, स्टूडियो बोकेह ब्लर लागू करें, और एक साथ 10 फ़ोटो तक कंप्रेस, कन्वर्ट और रीसाइज़ करें—सीधे अपने ब्राउज़र के अंदर। 100% मुफ़्त, निजी और किसी क्लाउड अपलोड की आवश्यकता नहीं।"
  },
  ar: {
    "hero.badge": "⚡ محرك ويب محلي 100% — بدون تأخير سحابي وخصوصية تامة",
    "hero.title": "Help Your Image Shine: استوديو الذكاء الاصطناعي الاحترافي الشامل لتحرير الصور",
    "hero.subtitle": "أقوى منصة لتحرير الصور بالذكاء الاصطناعي المحلي. قم بإزالة الخلفية بدقة متناهية تصل لتفاصيل الشعر، وإنشاء صور جواز سفر رسمية بألوان مخصصة، وتطبيق تمويه بوكيه احترافي، وضغط وتحويل وتغيير أبعاد ما يصل إلى 10 صور في وقت واحد مباشرة داخل متصفحك. مجاني 100%، وسري تماماً، وبدون رفع أي ملفات للسحابة.",
    "landing.default.title.home": "Help Your Image Shine: استوديو الذكاء الاصطناعي الاحترافي الشامل لتحرير الصور",
    "landing.default.desc.home": "أقوى منصة لتحرير الصور بالذكاء الاصطناعي المحلي. قم بإزالة الخلفية بدقة متناهية تصل لتفاصيل الشعر، وإنشاء صور جواز سفر رسمية بألوان مخصصة، وتطبيق تمويه بوكيه احترافي، وضغط وتحويل وتغيير أبعاد ما يصل إلى 10 صور في وقت واحد مباشرة داخل متصفحك. مجاني 100%، وسري تماماً، وبدون رفع أي ملفات للسحابة."
  },
  fr: {
    "hero.badge": "⚡ Moteur Web Local 100% — Zéro Latence Cloud & Confidentialité Totale",
    "hero.title": "Help Your Image Shine : Studio Photo IA Professionnel Tout-en-Un",
    "hero.subtitle": "La plateforme ultime d'édition photo par intelligence artificielle locale. Supprimez les arrière-plans avec une précision au cheveu près, créez des photos d'identité officielles aux couleurs personnalisées, appliquez un flou bokeh de studio, compressez, convertissez et redimensionnez jusqu'à 10 photos simultanément dans votre navigateur. 100% gratuit, privé et sans téléchargement cloud.",
    "landing.default.title.home": "Help Your Image Shine : Studio Photo IA Professionnel Tout-en-Un",
    "landing.default.desc.home": "La plateforme ultime d'édition photo par intelligence artificielle locale. Supprimez les arrière-plans avec une précision au cheveu près, créez des photos d'identité officielles aux couleurs personnalisées, appliquez un flou bokeh de studio, compressez, convertissez et redimensionnez jusqu'à 10 photos simultanément dans votre navigateur. 100% gratuit, privé et sans téléchargement cloud."
  },
  de: {
    "hero.badge": "⚡ 100% Lokale Web-Engine — Null Cloud-Verzögerung & Absoluter Datenschutz",
    "hero.title": "Help Your Image Shine: Professionelles All-in-One KI-Fotostudio",
    "hero.subtitle": "Das ultimative Kraftpaket für lokale KI-Fotobearbeitung. Entfernen Sie Hintergründe mit haarpräziser Genauigkeit, erstellen Sie offizielle Passfotos mit benutzerdefinierten Farben, wenden Sie Studio-Bokeh-Unschärfe an, komprimieren, konvertieren und ändern Sie die Größe von bis zu 10 Bildern gleichzeitig direkt in Ihrem Browser. 100% kostenlos, privat und ohne Cloud-Uploads.",
    "landing.default.title.home": "Help Your Image Shine: Professionelles All-in-One KI-Fotostudio",
    "landing.default.desc.home": "Das ultimative Kraftpaket für lokale KI-Fotobearbeitung. Entfernen Sie Hintergründe mit haarpräziser Genauigkeit, erstellen Sie offizielle Passfotos mit benutzerdefinierten Farben, wenden Sie Studio-Bokeh-Unschärfe an, komprimieren, konvertieren und ändern Sie die Größe von bis zu 10 Bildern gleichzeitig direkt in Ihrem Browser. 100% kostenlos, privat und ohne Cloud-Uploads."
  },
  pt: {
    "hero.badge": "⚡ Motor Web Local 100% — Zero Latência na Nuvem & Privacidade Total",
    "hero.title": "Help Your Image Shine: Estúdio Fotográfico AI Profissional Tudo-em-Um",
    "hero.subtitle": "A central definitiva de edição de fotos com inteligência artificial local. Remova fundos com precisão de fios de cabelo, crie fotos de passaporte oficiais com cores personalizadas, aplique desfoque bokeh de estúdio, comprima, converta e redimensione até 10 fotos simultaneamente no seu navegador. 100% grátis, privado e sem uploads para a nuvem.",
    "landing.default.title.home": "Help Your Image Shine: Estúdio Fotográfico AI Profissional Tudo-em-Um",
    "landing.default.desc.home": "A central definitiva de edição de fotos com inteligência artificial local. Remova fundos com precisão de fios de cabelo, crie fotos de passaporte oficiais com cores personalizadas, aplique desfoque bokeh de estúdio, comprima, converta e redimensione até 10 fotos simultaneamente no seu navegador. 100% grátis, privado e sem uploads para a nuvem."
  },
  ru: {
    "hero.badge": "⚡ 100% Локальный веб-движок — Ноль задержек в облаке и полная приватность",
    "hero.title": "Help Your Image Shine: Профессиональная AI-фотостудия «Все в одном»",
    "hero.subtitle": "Мощная платформа для локальной обработки фотографий с помощью ИИ. Удаляйте фон с точностью до волоска, создавайте официальные фото на документы с нужным цветом фона, применяйте студийное размытие боке, сжимайте, конвертируйте и изменяйте размер до 10 фото одновременно прямо в браузере. 100% бесплатно, конфиденциально и без загрузки на сервер.",
    "landing.default.title.home": "Help Your Image Shine: Профессиональная AI-фотостудия «Все в одном»",
    "landing.default.desc.home": "Мощная платформа для локальной обработки фотографий с помощью ИИ. Удаляйте фон с точностью до волоска, создавайте официальные фото на документы с нужным цветом фона, применяйте студийное размытие боке, сжимайте, конвертируйте и изменяйте размер до 10 фото одновременно прямо в браузере. 100% бесплатно, конфиденциально и без загрузки на сервер."
  },
  ko: {
    "hero.badge": "⚡ 100% 로컬 웹 엔진 — 클라우드 지연 제로 & 완벽한 프라이버시",
    "hero.title": "Help Your Image Shine: 전문가용 올인원 AI 포토 스튜디오 & 대량 편집기",
    "hero.subtitle": "최첨단 로컬 AI 기술을 탑재한 강력한 사진 편집 툴킷. 머리카락 한 올까지 정밀하게 배경을 제거하고, 공식 여권 사진 배경색 변경, 스튜디오 수준의 보케 블러 적용, 최대 10장의 일괄 압축·변환·크기 조정을 브라우저 내에서 즉시 처리합니다. 100% 무료, 완벽한 보안, 서버 업로드가 전혀 필요 없습니다.",
    "landing.default.title.home": "Help Your Image Shine: 전문가용 올인원 AI 포토 스튜디오 & 대량 편집기",
    "landing.default.desc.home": "최첨단 로컬 AI 기술을 탑재한 강력한 사진 편집 툴킷. 머리카락 한 올까지 정밀하게 배경을 제거하고, 공식 여권 사진 배경색 변경, 스튜디오 수준의 보케 블러 적용, 최대 10장의 일괄 압축·변환·크기 조정을 브라우저 내에서 즉시 처리합니다. 100% 무료, 완벽한 보안, 서버 업로드가 전혀 필요 없습니다."
  }
};

const dirs = fs.readdirSync(localesDir);
let count = 0;

for (const langDir of dirs) {
  const filePath = path.join(localesDir, langDir, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const trans = heroCopy[langDir] || heroCopy.en;
      
      let modified = false;
      for (const [k, v] of Object.entries(trans)) {
        if (data[k] !== v) {
          data[k] = v;
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
        count++;
        console.log(`✓ Updated hero copywriting for [${langDir}]`);
      }
    } catch (e) {
      console.error(`Error processing ${langDir}:`, e);
    }
  }
}

console.log(`\n🎉 Successfully injected inspiring, professional Hero copywriting across ${count} language files!`);
