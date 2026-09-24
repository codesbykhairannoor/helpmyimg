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
  return page;
};

// Tool identifiers (All 23 tools)
const TOOLS = [
  'remove', 'color', 'watermark', 'compress', 'convert', 'resize', 'crop', 'rotate', 
  'picker', 'blurface', 'design', 'brush', 'compress100kb', 'compress50kb', 'resizeig', 
  'removelogo', 'colorwhite', 'compress200kb', 'resizepassport', 'removeperson', 
  'convertwebp', 'watermarkbulk', 'blurplate'
];

// Tool base mapping for shared feature/FAQ/step translation lookup
const TOOL_BASE_MAP = {
  remove: 'remove',
  color: 'color',
  watermark: 'watermark',
  compress: 'compress',
  convert: 'convert',
  resize: 'resize',
  crop: 'crop',
  rotate: 'rotate',
  picker: 'picker',
  blurface: 'blurface',
  design: 'design',
  brush: 'remove',
  compress100kb: 'compress',
  compress50kb: 'compress',
  compress200kb: 'compress',
  resizeig: 'resize',
  resizepassport: 'resize',
  removelogo: 'remove',
  removeperson: 'remove',
  colorwhite: 'color',
  convertwebp: 'convert',
  watermarkbulk: 'watermark',
  blurplate: 'blurface'
};

// Info page identifiers (All 8 info pages)
const INFO_PAGES = ['about', 'privacy', 'terms', 'faq', 'security', 'pricing', 'compare', 'languages'];

// 100% Native Multilingual Dictionary for Universal Section Titles across 30 languages
const SECTION_I18N = {
  en: {
    features: 'Key Features & Capabilities',
    howTo: 'Step-by-Step How-To Guide',
    who: 'Who Is This Tool For?',
    tech: 'Technical Architecture & Local Privacy',
    faq: 'Frequently Asked Questions (FAQ)',
    navTools: 'Free Online Image Tools',
    navCompany: 'Resources & Information',
    dropzoneTitle: 'Upload Your Photo to Begin',
    dropzonePrompt: 'Drag and drop your photos here, or click to browse',
    dropzoneBtn: 'Choose Image File',
    privacyBadge: '100% Client-Side Privacy',
    clientSideBadge: 'Zero Server Uploads',
    step1Badge: 'Step 1: Upload',
    step2Badge: 'Step 2: Process',
    step3Badge: 'Step 3: Download HD',
    rightsReserved: 'All rights reserved. 100% Client-Side WebAssembly & WebGPU Processing.'
  },
  id: {
    features: 'Fitur Unggulan & Kemampuan',
    howTo: 'Panduan Langkah Demi Langkah',
    who: 'Untuk Siapa Alat Ini Dibuat?',
    tech: 'Arsitektur Teknis & Privasi Lokal',
    faq: 'Pertanyaan yang Sering Diajukan (FAQ)',
    navTools: 'Alat Edit Gambar Online Gratis',
    navCompany: 'Sumber Daya & Informasi Legal',
    dropzoneTitle: 'Unggah Foto Anda untuk Memulai',
    dropzonePrompt: 'Seret dan lepas foto Anda ke sini, atau klik untuk memilih file',
    dropzoneBtn: 'Pilih File Gambar',
    privacyBadge: '100% Privasi Sisi Klien',
    clientSideBadge: 'Nol Unggahan ke Server',
    step1Badge: 'Langkah 1: Unggah',
    step2Badge: 'Langkah 2: Proses',
    step3Badge: 'Langkah 3: Unduh HD',
    rightsReserved: 'Hak cipta dilindungi. Pemrosesan WebAssembly & WebGPU 100% Sisi Klien.'
  },
  es: {
    features: 'Características Principales y Capacidades',
    howTo: 'Guía Paso a Paso de Uso',
    who: '¿Para Quién es Esta Herramienta?',
    tech: 'Arquitectura Técnica y Privacidad Local',
    faq: 'Preguntas Frecuentes (FAQ)',
    navTools: 'Herramientas de Imagen Online Gratis',
    navCompany: 'Recursos e Información Legal',
    dropzoneTitle: 'Sube tu Foto para Comenzar',
    dropzonePrompt: 'Arrastra y suelta tus fotos aquí, o haz clic para explorar',
    dropzoneBtn: 'Seleccionar Imagen',
    privacyBadge: '100% Privacidad del Lado del Cliente',
    clientSideBadge: 'Cero Subidas al Servidor',
    step1Badge: 'Paso 1: Subir',
    step2Badge: 'Paso 2: Procesar',
    step3Badge: 'Paso 3: Descargar HD',
    rightsReserved: 'Todos los derechos reservados. Procesamiento 100% local WebAssembly.'
  },
  fr: {
    features: 'Fonctionnalités Clés et Capacités',
    howTo: 'Guide d\'Utilisation Étape par Étape',
    who: 'À Qui s\'Adresse cet Outil ?',
    tech: 'Architecture Technique et Confidentialité Locale',
    faq: 'Foire Aux Questions (FAQ)',
    navTools: 'Outils d\'Image en Ligne Gratuits',
    navCompany: 'Ressources et Informations Légales',
    dropzoneTitle: 'Téléchargez votre Photo pour Commencer',
    dropzonePrompt: 'Glissez-déposez vos photos ici, ou cliquez pour parcourir',
    dropzoneBtn: 'Choisir une Image',
    privacyBadge: '100% Confidentialité Côté Client',
    clientSideBadge: 'Zéro Téléversement Serveur',
    step1Badge: 'Étape 1: Importer',
    step2Badge: 'Étape 2: Traiter',
    step3Badge: 'Étape 3: Télécharger HD',
    rightsReserved: 'Tous droits réservés. Traitement local WebAssembly 100% sécurisé.'
  },
  de: {
    features: 'Hauptfunktionen & Leistungsmerkmale',
    howTo: 'Schritt-für-Schritt-Anleitung',
    who: 'Für Wen ist dieses Tool Gedacht?',
    tech: 'Technische Architektur & Lokale Privatsphäre',
    faq: 'Häufig Gestellte Fragen (FAQ)',
    navTools: 'Kostenlose Online-Bildbearbeitungstools',
    navCompany: 'Ressourcen & Rechtliche Informationen',
    dropzoneTitle: 'Laden Sie Ihr Foto hoch, um zu beginnen',
    dropzonePrompt: 'Ziehen Sie Ihre Fotos hierher oder klicken Sie zum Auswählen',
    dropzoneBtn: 'Bilddatei auswählen',
    privacyBadge: '100% Client-Seitige Privatsphäre',
    clientSideBadge: 'Kein Server-Upload',
    step1Badge: 'Schritt 1: Hochladen',
    step2Badge: 'Schritt 2: Verarbeiten',
    step3Badge: 'Schritt 3: HD Herunterladen',
    rightsReserved: 'Alle Rechte vorbehalten. Lokale WebAssembly-Verarbeitung.'
  },
  ja: {
    features: '主な機能と性能',
    howTo: 'ステップバイステップの使い方ガイド',
    who: 'このツールは誰向けですか？',
    tech: '技術アーキテクチャとローカルプライバシー',
    faq: 'よくある質問 (FAQ)',
    navTools: '無料オンライン画像編集ツール',
    navCompany: 'リソースと法的情報',
    dropzoneTitle: '写真のアップロードから始めましょう',
    dropzonePrompt: 'ここに写真をドラッグ＆ドロップ、またはクリックして選択',
    dropzoneBtn: '画像を選択',
    privacyBadge: '100% クライアント側プライバシー',
    clientSideBadge: 'サーバーへのアップロードなし',
    step1Badge: 'ステップ 1: アップロード',
    step2Badge: 'ステップ 2: AI処理',
    step3Badge: 'ステップ 3: HDダウンロード',
    rightsReserved: '全著作権所有。完全ローカルWebAssembly画像処理エンジン。'
  },
  zh: {
    features: '核心功能与技术优势',
    howTo: '分步使用指南',
    who: '适用人群与商业场景',
    tech: '技术架构与本地隐私保障',
    faq: '常见问题解答 (FAQ)',
    navTools: '免费在线图片处理工具',
    navCompany: '资源与法律条款',
    dropzoneTitle: '上传图片即刻开始',
    dropzonePrompt: '拖放照片至此处，或点击浏览上传',
    dropzoneBtn: '选择本地图片',
    privacyBadge: '100% 浏览器客户端隐私保护',
    clientSideBadge: '零服务器文件上传',
    step1Badge: '第 1 步: 上传图片',
    step2Badge: '第 2 步: AI智能处理',
    step3Badge: '第 3 步: 高清导出下载',
    rightsReserved: '版权所有。采用纯客户端 WebAssembly 与 WebGPU 隐私架构。'
  },
  ar: {
    features: 'الميزات الرئيسية والإمكانيات',
    howTo: 'دليل الاستخدام خطوة بخطوة',
    who: 'من المستفيد من هذه الأداة؟',
    tech: 'الهندسة التقنية والخصوصية المحلية',
    faq: 'الأسئلة الشائعة (FAQ)',
    navTools: 'أدوات تحرير الصور المجانية عبر الإنترنت',
    navCompany: 'الموارد والمعلومات القانونية',
    dropzoneTitle: 'قم بتحميل صورتك للبدء',
    dropzonePrompt: 'اسحب وأفلت صورك هنا، أو انقر للاختيار',
    dropzoneBtn: 'اختر ملف الصورة',
    privacyBadge: 'خصوصية تامة 100% من جانب العميل',
    clientSideBadge: 'بدون أي رفع إلى الخوادم السحابية',
    step1Badge: 'الخطوة 1: الرفع',
    step2Badge: 'الخطوة 2: المعالجة',
    step3Badge: 'الخطوة 3: التحميل بدقة عالية',
    rightsReserved: 'جميع الحقوق محفوظة. معالجة محلية بالكامل عبر WebAssembly.'
  },
  ru: {
    features: 'Ключевые особенности и возможности',
    howTo: 'Пошаговое руководство пользователя',
    who: 'Для кого предназначен этот инструмент?',
    tech: 'Техническая архитектура и локальная конфиденциальность',
    faq: 'Часто задаваемые вопросы (FAQ)',
    navTools: 'Бесплатные онлайн-инструменты для изображений',
    navCompany: 'Ресурсы и юридическая информация',
    dropzoneTitle: 'Загрузите фото для начала',
    dropzonePrompt: 'Перетащите ваши фото сюда или нажмите для выбора',
    dropzoneBtn: 'Выбрать изображение',
    privacyBadge: '100% Конфиденциальность на стороне клиента',
    clientSideBadge: 'Без загрузки на сервер',
    step1Badge: 'Шаг 1: Загрузить',
    step2Badge: 'Шаг 2: Обработать',
    step3Badge: 'Шаг 3: Скачать HD',
    rightsReserved: 'Все права защищены. Локальная обработка WebAssembly.'
  },
  pt: {
    features: 'Principais Recursos e Capacidades',
    howTo: 'Guia de Uso Passo a Passo',
    who: 'Para Quem é Esta Ferramenta?',
    tech: 'Arquitetura Técnica e Privacidade Local',
    faq: 'Perguntas Frequentes (FAQ)',
    navTools: 'Ferramentas de Imagem Online Gratuitas',
    navCompany: 'Recursos e Informações Legais',
    dropzoneTitle: 'Carregue sua Foto para Começar',
    dropzonePrompt: 'Arraste e solte suas fotos aqui ou clique para selecionar',
    dropzoneBtn: 'Selecionar Imagem',
    privacyBadge: '100% Privacidade no Lado do Cliente',
    clientSideBadge: 'Zero Uploads para o Servidor',
    step1Badge: 'Passo 1: Carregar',
    step2Badge: 'Passo 2: Processar',
    step3Badge: 'Passo 3: Baixar HD',
    rightsReserved: 'Todos os direitos reservados. Processamento local WebAssembly.'
  },
  it: {
    features: 'Funzionalità Principali e Prestazioni',
    howTo: 'Guida Passo Passo all\'Uso',
    who: 'A Chi è Rivolto Questo Strumento?',
    tech: 'Architettura Tecnica e Privacy Locale',
    faq: 'Domande Frequenti (FAQ)',
    navTools: 'Strumenti di Immagine Online Gratuiti',
    navCompany: 'Risorse e Informazioni Legali',
    dropzoneTitle: 'Carica la tua Foto per Iniziare',
    dropzonePrompt: 'Trascina e rilascia le tue foto qui o clicca per sfogliare',
    dropzoneBtn: 'Scegli File Immagine',
    privacyBadge: '100% Privacy Lato Client',
    clientSideBadge: 'Nessun Caricamento su Server',
    step1Badge: 'Passo 1: Carica',
    step2Badge: 'Passo 2: Elabora',
    step3Badge: 'Passo 3: Scarica HD',
    rightsReserved: 'Tutti i diritti riservati. Elaborazione locale WebAssembly.'
  },
  ko: {
    features: '주요 기능 및 성능',
    howTo: '단계별 사용 가이드',
    who: '이 도구는 누구를 위한 것인가요?',
    tech: '기술 아키텍처 및 로컬 개인정보 보호',
    faq: '자주 묻는 질문 (FAQ)',
    navTools: '무료 온라인 이미지 도구',
    navCompany: '리소스 및 법적 정보',
    dropzoneTitle: '사진을 업로드하여 시작하세요',
    dropzonePrompt: '사진을 여기에 끌어다 놓거나 클릭하여 찾아보세요',
    dropzoneBtn: '이미지 파일 선택',
    privacyBadge: '100% 클라이언트 측 개인정보 보호',
    clientSideBadge: '서버 업로드 없음',
    step1Badge: '1단계: 업로드',
    step2Badge: '2단계: AI 처리',
    step3Badge: '3단계: HD 다운로드',
    rightsReserved: '모든 권리 보유. 100% 로컬 WebAssembly 이미지 처리.'
  },
  nl: {
    features: 'Belangrijkste Functies & Mogelijkheden',
    howTo: 'Stap-voor-Stap Handleiding',
    who: 'Voor Wie is deze Tool Bedoeld?',
    tech: 'Technische Architectuur & Lokale Privacy',
    faq: 'Veelgestelde Vragen (FAQ)',
    navTools: 'Gratis Online Afbeeldingstools',
    navCompany: 'Bronnen en Juridische Informatie',
    dropzoneTitle: 'Upload uw foto om te beginnen',
    dropzonePrompt: 'Sleep uw foto\'s hierheen of klik om te bladeren',
    dropzoneBtn: 'Afbeeldingsbestand Kiezen',
    privacyBadge: '100% Client-Side Privacy',
    clientSideBadge: 'Geen Server-Uploads',
    step1Badge: 'Stap 1: Uploaden',
    step2Badge: 'Stap 2: Verwerken',
    step3Badge: 'Stap 3: HD Downloaden',
    rightsReserved: 'Alle rechten voorbehouden. Lokale WebAssembly-verwerking.'
  },
  pl: {
    features: 'Kluczowe Funkcje i Możliwości',
    howTo: 'Przewodnik Krok po Kroku',
    who: 'Dla Kogo Przeznaczone Jest To Narzędzie?',
    tech: 'Architektura Techniczna i Lokalna Prywatność',
    faq: 'Najczęściej Zadawane Pytania (FAQ)',
    navTools: 'Darmowe Narzędzia Graficzne Online',
    navCompany: 'Zasoby i Informacje Prawne',
    dropzoneTitle: 'Prześlij zdjęcie, aby rozpocząć',
    dropzonePrompt: 'Przeciągnij i upuść swoje zdjęcia tutaj lub kliknij, aby przeglądać',
    dropzoneBtn: 'Wybierz Obraz',
    privacyBadge: '100% Prywatności Po Stronie Klienta',
    clientSideBadge: 'Brak Przesyłania na Serwer',
    step1Badge: 'Krok 1: Prześlij',
    step2Badge: 'Krok 2: Przetwórz',
    step3Badge: 'Krok 3: Pobierz HD',
    rightsReserved: 'Wszelkie prawa zastrzeżone. Przetwarzanie lokalne WebAssembly.'
  },
  tr: {
    features: 'Temel Özellikler ve Yetenekler',
    howTo: 'Adım Adım Kullanım Kılavuzu',
    who: 'Bu Araç Kimler İçin?',
    tech: 'Teknik Mimari ve Yerel Gizlilik',
    faq: 'Sıkça Sorulan Sorular (SSS)',
    navTools: 'Ücretsiz Çevrimiçi Resim Araçları',
    navCompany: 'Kaynaklar ve Yasal Bilgiler',
    dropzoneTitle: 'Başlamak için Fotoğrafınızı Yükleyin',
    dropzonePrompt: 'Fotoğraflarınızı buraya sürükleyip bırakın veya seçmek için tıklayın',
    dropzoneBtn: 'Resim Dosyası Seç',
    privacyBadge: '%100 İstemci Tarafı Gizlilik',
    clientSideBadge: 'Sunucuya Yükleme Yok',
    step1Badge: '1. Adım: Yükle',
    step2Badge: '2. Adım: İşle',
    step3Badge: '3. Adım: HD İndir',
    rightsReserved: 'Tüm hakları saklıdır. Yerel WebAssembly işleme mimarisi.'
  },
  vi: {
    features: 'Tính Năng Nổi Bật & Khả Năng',
    howTo: 'Hướng Dẫn Từng Bước Cách Sử Dụng',
    who: 'Công Cụ Này Dành Cho Ai?',
    tech: 'Kiến Trúc Kỹ Thuật & Quyền Riêng Tư Cục Bộ',
    faq: 'Câu Hỏi Thường Gặp (FAQ)',
    navTools: 'Công Cụ Chỉnh Sửa Ảnh Trực Tuyến Miễn Phí',
    navCompany: 'Tài Nguyên & Thông Tin Pháp Lý',
    dropzoneTitle: 'Tải ảnh của bạn lên để bắt đầu',
    dropzonePrompt: 'Kéo và thả ảnh của bạn vào đây hoặc nhấp để duyệt',
    dropzoneBtn: 'Chọn Tệp Ảnh',
    privacyBadge: 'Bảo Mật 100% Phía Máy Khách',
    clientSideBadge: 'Không Tải Lên Máy Chủ',
    step1Badge: 'Bước 1: Tải lên',
    step2Badge: 'Bước 2: Xử lý AI',
    step3Badge: 'Bước 3: Tải về HD',
    rightsReserved: 'Đã đăng ký bản quyền. Xử lý cục bộ 100% qua WebAssembly.'
  },
  th: {
    features: 'คุณสมบัติหลักและความสามารถ',
    howTo: 'คู่มือการใช้งานทีละขั้นตอน',
    who: 'เครื่องมือนี้เหมาะสำหรับใคร?',
    tech: 'สถาปัตยกรรมทางเทคนิคและความเป็นส่วนตัวในเครื่อง',
    faq: 'คำถามที่พบบ่อย (FAQ)',
    navTools: 'เครื่องมือแก้ไขภาพออนไลน์ฟรี',
    navCompany: 'แหล่งข้อมูลและข้อมูลทางกฎหมาย',
    dropzoneTitle: 'อัปโหลดรูปภาพของคุณเพื่อเริ่มต้น',
    dropzonePrompt: 'ลากและวางรูปภาพของคุณที่นี่ หรือคลิกเพื่อเรียกดู',
    dropzoneBtn: 'เลือกไฟล์รูปภาพ',
    privacyBadge: 'ความเป็นส่วนตัวฝั่งไคลเอนต์ 100%',
    clientSideBadge: 'ไม่มีการอัปโหลดไปยังเซิร์ฟเวอร์',
    step1Badge: 'ขั้นตอนที่ 1: อัปโหลด',
    step2Badge: 'ขั้นตอนที่ 2: ประมวลผล',
    step3Badge: 'ขั้นตอนที่ 3: ดาวน์โหลด HD',
    rightsReserved: 'สงวนลิขสิทธิ์ทั้งหมด ประมวลผลภายในเครื่องด้วย WebAssembly.'
  },
  hi: {
    features: 'मुख्य विशेषताएं और क्षमताएं',
    howTo: 'चरण-दर-चरण उपयोग गाइड',
    who: 'यह उपकरण किसके लिए है?',
    tech: 'तकनीकी वास्तुकला और स्थानीय गोपनीयता',
    faq: 'अक्सर पूछे जाने वाले प्रश्न (FAQ)',
    navTools: 'मुफ्त ऑनलाइन छवि उपकरण',
    navCompany: 'संसाधन और कानूनी जानकारी',
    dropzoneTitle: 'शुरू करने के लिए अपनी तस्वीर अपलोड करें',
    dropzonePrompt: 'अपनी तस्वीरें यहां खींचें और छोड़ें, या चुनने के लिए क्लिक करें',
    dropzoneBtn: 'छवि फ़ाइल चुनें',
    privacyBadge: '100% क्लाइंट-साइड गोपनीयता',
    clientSideBadge: 'कोई सर्वर अपलोड नहीं',
    step1Badge: 'चरण 1: अपलोड करें',
    step2Badge: 'चरण 2: प्रोसेस करें',
    step3Badge: 'चरण 3: एचडी डाउनलोड करें',
    rightsReserved: 'सर्वाधिकार सुरक्षित। 100% स्थानीय WebAssembly प्रोसेसिंग।'
  },
  ro: {
    features: 'Caracteristici Cheie și Capacități',
    howTo: 'Ghid Pas cu Pas de Utilizare',
    who: 'Pentru Cine Este Acest Instrument?',
    tech: 'Arhitectură Tehnică și Confidențialitate Locală',
    faq: 'Întrebări Frecvente (FAQ)',
    navTools: 'Instrumente Gratuite de Editare Foto Online',
    navCompany: 'Resurse și Informații Legale',
    dropzoneTitle: 'Încărcați fotografia pentru a începe',
    dropzonePrompt: 'Trageți și plasați fotografiile aici sau faceți clic pentru a selecta',
    dropzoneBtn: 'Alegeți Fișierul Imagine',
    privacyBadge: '100% Confidențialitate pe Partea Clientului',
    clientSideBadge: 'Fără Încărcare pe Server',
    step1Badge: 'Pasul 1: Încărcați',
    step2Badge: 'Pasul 2: Procesați',
    step3Badge: 'Pasul 3: Descărcați HD',
    rightsReserved: 'Toate drepturile rezervate. Procesare locală WebAssembly.'
  },
  hu: {
    features: 'Főbb Jellemzők és Képességek',
    howTo: 'Lépésről Lépésre Útmutató',
    who: 'Kiknek Készült Ez az Eszköz?',
    tech: 'Műszaki Architektúra és Helyi Adatvédelem',
    faq: 'Gyakran Ismételt Kérdések (GYIK)',
    navTools: 'Ingyenes Online Képszerkesztő Eszközök',
    navCompany: 'Források és Jogi Információk',
    dropzoneTitle: 'Töltse fel fotóját a kezdéshez',
    dropzonePrompt: 'Húzza ide a fotóit, vagy kattintson a tallózáshoz',
    dropzoneBtn: 'Kép Kiválasztása',
    privacyBadge: '100% Kliensoldali Adatvédelem',
    clientSideBadge: 'Nincs Szerverre Töltés',
    step1Badge: '1. Lépés: Feltöltés',
    step2Badge: '2. Lépés: Feldolgozás',
    step3Badge: '3. Lépés: HD Letöltés',
    rightsReserved: 'Minden jog fenntartva. Helyi WebAssembly feldolgozás.'
  },
  cs: {
    features: 'Klíčové Funkce a Schopnosti',
    howTo: 'Návod Krok za Krokem',
    who: 'Pro Koho Je Tento Nástroj Určen?',
    tech: 'Technická Architektura a Místní Soukromí',
    faq: 'Často Kladené Otázky (FAQ)',
    navTools: 'Bezplatné Online Nástroje pro Úpravu Obrázků',
    navCompany: 'Zdroje a Právní Informace',
    dropzoneTitle: 'Nahrajte svou fotografii a začněte',
    dropzonePrompt: 'Přetáhněte sem své fotografie nebo klikněte pro procházení',
    dropzoneBtn: 'Vybrat Soubor Obrázku',
    privacyBadge: '100% Soukromí na Straně Klienta',
    clientSideBadge: 'Žádné Nahrávání na Server',
    step1Badge: 'Krok 1: Nahrát',
    step2Badge: 'Krok 2: Zpracovat',
    step3Badge: 'Krok 3: Stáhnout HD',
    rightsReserved: 'Všechna práva vyhrazena. Lokální zpracování WebAssembly.'
  },
  el: {
    features: 'Βασικά Χαρακτηριστικά & Δυνατότητες',
    howTo: 'Οδηγός Βήμα προς Βήμα',
    who: 'Για Ποιον Είναι Αυτό το Εργαλείο;',
    tech: 'Τεχνική Αρχιτεκτονική & Τοπικό Απόρρητο',
    faq: 'Συχνές Ερωτήσεις (FAQ)',
    navTools: 'Δωρεάν Online Εργαλεία Επεξεργασίας Εικόνας',
    navCompany: 'Πηγές & Νομικές Πληροφορίες',
    dropzoneTitle: 'Ανεβάστε τη φωτογραφία σας για να ξεκινήσετε',
    dropzonePrompt: 'Σύρετε και αποθέστε τις φωτογραφίες σας εδώ ή κάντε κλικ για περιήγηση',
    dropzoneBtn: 'Επιλέξτε Εικόνα',
    privacyBadge: '100% Απόρρητο από την Πλευρά του Πελάτη',
    clientSideBadge: 'Μηδενικές Μεταφορτώσεις σε Διακομιστή',
    step1Badge: 'Βήμα 1: Μεταφόρτωση',
    step2Badge: 'Βήμα 2: Επεξεργασία',
    step3Badge: 'Βήμα 3: Λήψη HD',
    rightsReserved: 'Όλα τα δικαιώματα διατηρούνται. Τοπική επεξεργασία WebAssembly.'
  },
  sv: {
    features: 'Nyckelfunktioner och Kapacitet',
    howTo: 'Steg-för-steg Bruksanvisning',
    who: 'Vem är detta verktyg för?',
    tech: 'Teknisk Arkitektur och Lokal Integritet',
    faq: 'Vanliga Frågor (FAQ)',
    navTools: 'Gratis Bildverktyg Online',
    navCompany: 'Resurser och Juridisk Information',
    dropzoneTitle: 'Ladda upp ditt foto för att börja',
    dropzonePrompt: 'Dra och släpp dina bilder här, eller klicka för att bläddra',
    dropzoneBtn: 'Välj Bildfil',
    privacyBadge: '100% Integritet på Klientsidan',
    clientSideBadge: 'Noll Uppladdningar till Server',
    step1Badge: 'Steg 1: Ladda upp',
    step2Badge: 'Steg 2: Bearbeta',
    step3Badge: 'Steg 3: Ladda ner HD',
    rightsReserved: 'Alla rättigheter förbehållna. Lokal WebAssembly-behandling.'
  },
  da: {
    features: 'Nøglefunktioner og Kapaciteter',
    howTo: 'Trin-for-trin Vejledning',
    who: 'Hvem er dette værktøj til?',
    tech: 'Teknisk Arkitektur og Lokalt Privatliv',
    faq: 'Ofte Stillede Spørgsmål (FAQ)',
    navTools: 'Gratis Billedværktøjer Online',
    navCompany: 'Ressourcer og Juridisk Information',
    dropzoneTitle: 'Upload dit foto for at starte',
    dropzonePrompt: 'Træk og slip dine fotos her, eller klik for at vælge',
    dropzoneBtn: 'Vælg Billedfil',
    privacyBadge: '100% Privatliv på Klientsiden',
    clientSideBadge: 'Ingen Server-Uploads',
    step1Badge: 'Trin 1: Upload',
    step2Badge: 'Trin 2: Behandl',
    step3Badge: 'Trin 3: Hent HD',
    rightsReserved: 'Alle rettigheder forbeholdes. Lokal WebAssembly-behandling.'
  },
  fi: {
    features: 'Keskeiset Ominaisuudet ja Suorituskyky',
    howTo: 'Käyttöohje Askel Askeleelta',
    who: 'Kenelle tämä työkalu on tarkoitettu?',
    tech: 'Tekninen Arkkitehtuuri ja Paikallinen Yksityisyys',
    faq: 'Usein Kysytyt Kysymykset (UKK)',
    navTools: 'Ilmaiset Kuvatyökalut Verkossa',
    navCompany: 'Resurssit ja Oikeudelliset Tiedot',
    dropzoneTitle: 'Lataa valokuvasi aloittaaksesi',
    dropzonePrompt: 'Vedä ja pudota kuvat tähän tai napsauta selataksesi',
    dropzoneBtn: 'Valitse Kuvatiedosto',
    privacyBadge: '100% Asiakaspuolen Yksityisyys',
    clientSideBadge: 'Ei Palvelinlähetyksiä',
    step1Badge: 'Vaihe 1: Lataa',
    step2Badge: 'Vaihe 2: Käsittele',
    step3Badge: 'Vaihe 3: Lataa HD',
    rightsReserved: 'Kaikki oikeudet pidätetään. Paikallinen WebAssembly-käsittely.'
  },
  no: {
    features: 'Nøkkelfunksjoner og Egenskaper',
    howTo: 'Trinn-for-Trinn Veiledning',
    who: 'Hvem er dette verktøyet for?',
    tech: 'Teknisk Arkitektur og Lokalt Personvern',
    faq: 'Ofte Stilte Spørsmål (FAQ)',
    navTools: 'Gratis Bildeverktøy på Nett',
    navCompany: 'Ressurser og Juridisk Informasjon',
    dropzoneTitle: 'Last opp bildet ditt for å starte',
    dropzonePrompt: 'Dra og slipp bildene dine her, eller klikk for å bla gjennom',
    dropzoneBtn: 'Velg Bildefil',
    privacyBadge: '100% Personvern på Klientsiden',
    clientSideBadge: 'Ingen Serveropplastinger',
    step1Badge: 'Trinn 1: Last opp',
    step2Badge: 'Trinn 2: Prosesser',
    step3Badge: 'Trinn 3: Last ned HD',
    rightsReserved: 'Alle rettigheter reservert. Lokal WebAssembly-behandling.'
  },
  uk: {
    features: 'Ключові особливості та можливості',
    howTo: 'Покрокова інструкція користувача',
    who: 'Для кого призначений цей інструмент?',
    tech: 'Технічна архітектура та локальна конфіденційність',
    faq: 'Поширені запитання (FAQ)',
    navTools: 'Безкоштовні онлайн-інструменти для фото',
    navCompany: 'Ресурси та юридична інформація',
    dropzoneTitle: 'Завантажте фото, щоб почати',
    dropzonePrompt: 'Перетягніть ваші фотографії сюди або натисніть для вибору',
    dropzoneBtn: 'Вибрати Зображення',
    privacyBadge: '100% Конфіденційність на стороні клієнта',
    clientSideBadge: 'Без завантаження на сервер',
    step1Badge: 'Крок 1: Завантажити',
    step2Badge: 'Крок 2: Обробити',
    step3Badge: 'Крок 3: Завантажити HD',
    rightsReserved: 'Всі права захищені. Локальна обробка WebAssembly.'
  },
  he: {
    features: 'תכונות עיקריות ויכולות',
    howTo: 'מדריך שימוש שלב אחר שלב',
    who: 'למי מיועד כלי זה?',
    tech: 'ארכיטקטורה טכנית ופרטיות מקומית',
    faq: 'שאלות נפוצות (FAQ)',
    navTools: 'כלים מקוונים חינמיים לעריכת תמונות',
    navCompany: 'משאבים ומידע משפטי',
    dropzoneTitle: 'העלה את התמונה שלך כדי להתחיל',
    dropzonePrompt: 'גרור ושחרר את התמונות שלך לכאן, או לחץ לעיון',
    dropzoneBtn: 'בחר קובץ תמונה',
    privacyBadge: '100% פרטיות בצד הלקוח',
    clientSideBadge: 'אפס העלאות לשרת',
    step1Badge: 'שלב 1: העלאה',
    step2Badge: 'שלב 2: עיבוד AI',
    step3Badge: 'שלב 3: הורדת HD',
    rightsReserved: 'כל הזכויות שמורות. עיבוד מקומי מלא ב-WebAssembly.'
  },
  tl: {
    features: 'Pangunahing Tampok at Kakayahan',
    howTo: 'Hakbang-hakbang na Gabay sa Paggamit',
    who: 'Para Kanino ang Tool na Ito?',
    tech: 'Teknikal na Arkitektura at Lokal na Pagkapribado',
    faq: 'Mga Madalas Itanong (FAQ)',
    navTools: 'Libreng Online Tools sa Pag-edit ng Larawan',
    navCompany: 'Mga Mapagkukunan at Legal na Impormasyon',
    dropzoneTitle: 'I-upload ang Iyong Larawan upang Magsimula',
    dropzonePrompt: 'I-drag at i-drop ang iyong mga larawan dito, o mag-click upang mag-browse',
    dropzoneBtn: 'Pumili ng Larawan',
    privacyBadge: '100% Pagkapribado sa Client-Side',
    clientSideBadge: 'Walang Server Uploads',
    step1Badge: 'Hakbang 1: Mag-upload',
    step2Badge: 'Hakbang 2: Magproseso',
    step3Badge: 'Hakbang 3: I-download ang HD',
    rightsReserved: 'Lahat ng karapatan ay nakalaan. 100% lokal na WebAssembly processing.'
  },
  ms: {
    features: 'Ciri-ciri Utama & Keupayaan',
    howTo: 'Panduan Langkah demi Langkah',
    who: 'Untuk Siapa Alat Ini?',
    tech: 'Seni Bina Teknikal & Privasi Tempatan',
    faq: 'Soalan Lazim (FAQ)',
    navTools: 'Alat Suntingan Imej Dalam Talian Percuma',
    navCompany: 'Sumber & Maklumat Undang-undang',
    dropzoneTitle: 'Muat Naik Foto Anda untuk Bermula',
    dropzonePrompt: 'Seret dan lepaskan foto anda ke sini, atau klik untuk memilih',
    dropzoneBtn: 'Pilih Fail Imej',
    privacyBadge: '100% Privasi Pihak Klien',
    clientSideBadge: 'Sifar Muat Naik ke Pelayan',
    step1Badge: 'Langkah 1: Muat Naik',
    step2Badge: 'Langkah 2: Proses AI',
    step3Badge: 'Langkah 3: Muat Turun HD',
    rightsReserved: 'Hak cipta terpelihara. Pemprosesan WebAssembly & WebGPU tempatan 100%.'
  }
};

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
  .replace(/<!-- Dynamic Localized Hreflang Tags for 30 Languages -->\n?\s*/g, '')
  .replace(/<!-- Open Graph \/ Facebook Meta Tags -->\n?\s*/gi, '')
  .replace(/<meta property="og:[^"]+" content="[^"]*" \/>\n?\s*/gi, '')
  .replace(/<!-- Twitter \(X\) Meta Tags -->\n?\s*/gi, '')
  .replace(/<meta name="twitter:[^"]+" content="[^"]*" \/>\n?\s*/gi, '')
  .replace(/<link rel="canonical" href="[^"]*" \/>\n?\s*/gi, '')
  .replace(/<title>[\s\S]*?<\/title>\n?\s*/gi, '')
  .replace(/<meta name="description"[^>]*>\n?\s*/gi, '')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\n?\s*/gi, '')
  .replace(/<body>[\s\S]*?<\/body>/i, '<body>\n    <div id="root"></div>\n  </body>');


// Function to generate rich, 100% visible, fully semantic HTML for Googlebot and users
function generateSemanticHtml(lang, urlPath, title, desc, tool, infoPage, translations) {
  const sec = SECTION_I18N[lang] || SECTION_I18N['en'];
  const h1 = title.replace(/\s*[-|]\s*HelpMyIMG.*$/i, '').trim();
  const overviewText = desc;
  const isRtl = ['ar', 'he'].includes(lang);
  const dirAttr = isRtl ? 'dir="rtl"' : 'dir="ltr"';

  // Navigation Links generator
  let toolsNavLinks = '';
  for (const t of TOOLS) {
    const slug = getLocalizedSlug(t, lang);
    const linkPath = `/${lang}/${slug}/`;
    const label = translations[`tab.${t}`] || translations[`nav.${t}`] || translations[`seo.jsonld.name.${t}`] || t;
    toolsNavLinks += `<li><a href="${linkPath}" class="text-slate-400 hover:text-[#05DAED] transition-colors">${label}</a></li>\n`;
  }

  let infoNavLinks = '';
  for (const p of INFO_PAGES) {
    const slug = getLocalizedInfoSlug(p, lang);
    const linkPath = `/${lang}/${slug}/`;
    const label = translations[`footer.${p}`] || translations[`nav.${p}`] || p;
    infoNavLinks += `<li><a href="${linkPath}" class="text-slate-400 hover:text-[#05DAED] transition-colors">${label}</a></li>\n`;
  }

  // Pre-rendered Navbar
  const navbarHtml = `
    <header class="border-b border-slate-800 bg-[#0a0d14]/90 backdrop-blur sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/${lang}/" class="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <span class="text-[#05DAED]">HelpMy</span><span>IMG</span>
        </a>
        <nav aria-label="Quick Tools Navigation" class="hidden md:flex items-center gap-6 text-sm text-slate-300">
          <a href="/${lang}/${getLocalizedSlug('remove', lang)}/" class="hover:text-white transition-colors">${translations['tab.remove'] || 'Remove BG'}</a>
          <a href="/${lang}/${getLocalizedSlug('color', lang)}/" class="hover:text-white transition-colors">${translations['tab.color'] || 'Change BG'}</a>
          <a href="/${lang}/${getLocalizedSlug('compress', lang)}/" class="hover:text-white transition-colors">${translations['tab.compress'] || 'Compress'}</a>
          <a href="/${lang}/${getLocalizedSlug('watermark', lang)}/" class="hover:text-white transition-colors">${translations['tab.watermark'] || 'Watermark'}</a>
          <a href="/${lang}/${getLocalizedSlug('convert', lang)}/" class="hover:text-white transition-colors">${translations['tab.convert'] || 'Convert'}</a>
          <a href="/${lang}/${getLocalizedSlug('resize', lang)}/" class="hover:text-white transition-colors">${translations['tab.resize'] || 'Resize'}</a>
        </nav>
        <div class="flex items-center gap-3 text-xs">
          <span class="px-2.5 py-1 rounded-full bg-[#05DAED]/10 text-[#05DAED] border border-[#05DAED]/30 font-medium">${sec.privacyBadge}</span>
        </div>
      </div>
    </header>
  `;

  // Pre-rendered Footer
  const footerHtml = `
    <footer class="border-t border-slate-800 bg-[#07090e] mt-24 py-16 px-4">
      <div class="max-w-7xl mx-auto flex flex-col gap-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="flex flex-col gap-4">
            <a href="/${lang}/" class="text-2xl font-bold text-white tracking-tight">
              <span class="text-[#05DAED]">HelpMy</span><span>IMG</span>
            </a>
            <p class="text-sm text-slate-400 leading-relaxed max-w-sm">
              ${translations['hero.subtitle.short'] || 'Ultra-fast, 100% private in-browser AI photo editing suite powered by WebAssembly and WebGPU.'}
            </p>
            <div class="inline-flex items-center gap-2 text-xs text-[#05DAED]">
              <span class="w-2 h-2 rounded-full bg-[#05DAED] animate-pulse"></span>
              <span>${sec.clientSideBadge}</span>
            </div>
          </div>
          <nav aria-label="${sec.navTools}">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">${sec.navTools}</h3>
            <ul class="space-y-2 text-sm">
              ${toolsNavLinks}
            </ul>
          </nav>
          <nav aria-label="${sec.navCompany}">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">${sec.navCompany}</h3>
            <ul class="space-y-2 text-sm">
              ${infoNavLinks}
            </ul>
          </nav>
          <div class="flex flex-col gap-4">
            <h3 class="text-sm font-semibold text-white uppercase tracking-wider mb-4">${translations['languages.title'] || 'Global Languages'}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              HelpMyIMG is natively localized in 30 languages with zero external telemetry.
            </p>
            <a href="/${lang}/languages/" class="text-xs text-[#05DAED] hover:underline">${translations['languages.badge'] || 'View All 30 Languages →'}</a>
          </div>
        </div>
        <div class="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 HelpMyIMG. ${sec.rightsReserved}</p>
          <div class="flex gap-4">
            <a href="/${lang}/${getLocalizedInfoSlug('privacy', lang)}/" class="hover:underline">${translations['footer.privacy'] || 'Privacy'}</a>
            <a href="/${lang}/${getLocalizedInfoSlug('terms', lang)}/" class="hover:underline">${translations['footer.terms'] || 'Terms'}</a>
            <a href="/${lang}/${getLocalizedInfoSlug('security', lang)}/" class="hover:underline">${translations['footer.security'] || 'Security'}</a>
          </div>
        </div>
      </div>
    </footer>
  `;

  // Common Academic Research Section
  const researchTitle = translations['home.research.title'] || translations['about.research.title'] || 'Algorithmic Principles & Peer-Reviewed Foundations';
  const researchDesc = translations['home.research.desc'] || translations['about.research.subtitle'] || 'HelpMyIMG is engineered upon open, peer-reviewed computer vision and distributed systems research.';
  const noticeText = translations['home.research.notice'] || 'Academic Attribution Notice: Citations and institutional references are provided solely for scholarly transparency and attribution of open algorithmic foundations.';
  
  const scientificResearchHtml = `
    <section class="border-t border-slate-800/80 pt-12 flex flex-col gap-6">
      <div class="flex flex-col gap-2">
        <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${researchTitle}</h2>
        <p class="text-sm text-slate-400 leading-relaxed">${researchDesc}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div class="flex flex-col gap-1">
          <strong class="text-white text-sm">Neural Matting & Saliency:</strong>
          <span>Ke et al., "MODNet: Real-Time Trimap-Free Portrait Matting via Objective Decomposition", AAAI 2022.</span>
          <span class="text-slate-400">Qin et al., "Highly Accurate Dichotomous Image Segmentation (IS-Net / DIS)", ECCV 2022.</span>
        </div>
        <div class="flex flex-col gap-1">
          <strong class="text-white text-sm">Perceptual Quality & SSIM:</strong>
          <span>Wang et al., "Image Quality Assessment: From Error Visibility to Structural Similarity (SSIM)", IEEE TIP, 2004.</span>
          <span class="text-slate-400">Lossless chrominance and spatial fidelity preservation metrics.</span>
        </div>
        <div class="flex flex-col gap-1">
          <strong class="text-white text-sm">In-Browser WebAssembly Acceleration:</strong>
          <span>Haas et al., "Bringing the Web up to Speed with WebAssembly", ACM SIGPLAN PLDI 2017.</span>
          <span class="text-slate-400">SIMD vectorization and multi-threaded Web Workers pipeline execution.</span>
        </div>
        <div class="flex flex-col gap-1">
          <strong class="text-white text-sm">Local-First Privacy Architecture:</strong>
          <span>Kleppmann et al., "Local-First Software: You Own Your Data, in Spite of the Cloud", ACM Onward! 2019.</span>
          <span class="text-slate-400">Strict zero-server-upload data sovereignty model.</span>
        </div>
      </div>
      <p class="text-[11px] text-slate-500 italic">${noticeText}</p>
    </section>
  `;

  // =========================================================================
  // CASE A: INFO PAGES (About, Privacy, Terms, FAQ, Security, Pricing, Compare, Languages)
  // =========================================================================
  if (infoPage) {
    let infoContentHtml = '';

    if (infoPage === 'about') {
      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4">
            <span class="text-xs uppercase font-semibold text-[#05DAED] tracking-wider">${translations['about.badge'] || 'ABOUT HELPMYIMG'}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations['about.title'] || h1}</h1>
            <p class="text-lg text-slate-300 leading-relaxed">${translations['about.subtitle'] || overviewText}</p>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-lg font-bold text-white">${translations['about.feature.fast'] || 'Lightning Fast'}</h3>
              <p class="text-sm text-slate-400">${translations['about.feature.fast.desc'] || '0ms network latency after initial model load.'}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-lg font-bold text-white">${translations['about.feature.free'] || 'Always Free'}</h3>
              <p class="text-sm text-slate-400">${translations['about.feature.free.desc'] || 'No server bills means no subscription fees for you.'}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-lg font-bold text-white">${translations['about.feature.local'] || 'Local Execution'}</h3>
              <p class="text-sm text-slate-400">${translations['about.feature.local.desc'] || 'Your GPU/CPU does the work. No cloud queue bottlenecks.'}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-lg font-bold text-white">${translations['about.feature.privacy'] || 'Zero Tracking'}</h3>
              <p class="text-sm text-slate-400">${translations['about.feature.privacy.desc'] || 'Photos never leave your hard drive or browser memory.'}</p>
            </div>
          </section>

          <section class="flex flex-col gap-4 bg-slate-900/40 p-8 rounded-2xl border border-slate-800">
            <h2 class="text-2xl font-bold text-white">${translations['about.sec1.title'] || 'Our Journey & Philosophy'}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">${translations['about.sec1.desc1'] || ''}</p>
            <p class="text-sm text-slate-300 leading-relaxed">${translations['about.sec1.desc2'] || ''}</p>
            <p class="text-sm text-slate-300 leading-relaxed">${translations['about.sec1.desc3'] || ''}</p>
            <ul class="list-disc list-inside space-y-1 text-sm text-slate-300 mt-2">
              <li>${translations['about.sec1.bullet1'] || 'No mandatory account or registration.'}</li>
              <li>${translations['about.sec1.bullet2'] || 'No sneaky hidden fees or token restrictions.'}</li>
              <li>${translations['about.sec1.bullet3'] || 'Zero data harvesting or image scraping.'}</li>
            </ul>
          </section>

          <section class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <h2 class="text-2xl font-bold text-white">${translations['about.tech.title'] || 'Technology Behind the Engine'}</h2>
              <p class="text-sm text-slate-400">${translations['about.tech.subtitle'] || ''}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                <h3 class="text-base font-bold text-[#05DAED]">${translations['about.tech.b1.title'] || 'WebAssembly (WASM)'}</h3>
                <p class="text-xs text-slate-400 leading-relaxed">${translations['about.tech.b1.desc'] || ''}</p>
              </div>
              <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                <h3 class="text-base font-bold text-[#05DAED]">${translations['about.tech.b2.title'] || 'Hardware Acceleration'}</h3>
                <p class="text-xs text-slate-400 leading-relaxed">${translations['about.tech.b2.desc'] || ''}</p>
              </div>
              <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                <h3 class="text-base font-bold text-[#05DAED]">${translations['about.tech.b3.title'] || 'Optimized ONNX Models'}</h3>
                <p class="text-xs text-slate-400 leading-relaxed">${translations['about.tech.b3.desc'] || ''}</p>
              </div>
            </div>
          </section>

          ${scientificResearchHtml}
        </article>
      `;
    } else if (infoPage === 'privacy') {
      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4">
            <span class="text-xs uppercase font-semibold text-[#05DAED] tracking-wider">${translations['privacy.badge'] || 'PRIVACY POLICY'}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations['privacy.title'] || h1}</h1>
            <p class="text-sm text-[#05DAED]">${translations['privacy.lastUpdated'] || 'Effective: 2026'}</p>
            <p class="text-lg text-slate-300 leading-relaxed">${translations['privacy.intro'] || overviewText}</p>
          </section>

          <section class="p-6 rounded-2xl bg-[#05DAED]/10 border border-[#05DAED]/30 flex flex-col gap-2">
            <h2 class="text-xl font-bold text-white">${translations['privacy.highlight.title'] || 'TL;DR: Your Data Remains Exclusively Yours'}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.highlight.desc'] || ''}</p>
          </section>

          <section class="flex flex-col gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white">${translations['privacy.s1.title'] || '1. Local Client-Side Processing'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s1.desc1'] || ''}</p>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s1.desc2'] || ''}</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white">${translations['privacy.s2.title'] || '2. Data Collection & Analytics'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s2.desc1'] || ''}</p>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s2.desc2'] || ''}</p>
              <ul class="list-disc list-inside space-y-1 text-sm text-slate-300 mt-2">
                <li>${translations['privacy.s2.bullet1'] || 'Aggregated daily page views.'}</li>
                <li>${translations['privacy.s2.bullet2'] || 'General geographic region for CDN performance.'}</li>
                <li>${translations['privacy.s2.bullet3'] || 'Browser device capability metrics.'}</li>
              </ul>
            </div>

            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white">${translations['privacy.s3.title'] || '3. Cookies & Storage'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s3.desc1'] || ''}</p>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s3.desc2'] || ''}</p>
            </div>

            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white">${translations['privacy.s4.title'] || '4. No Third-Party AI Model Training'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s4.desc1'] || ''}</p>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['privacy.s4.desc2'] || ''}</p>
            </div>
          </section>
        </article>
      `;
    } else {
      // General Info Page Template (Terms, Security, Pricing, Compare, FAQ, Languages)
      let sectionsHtml = '';
      for (let i = 1; i <= 6; i++) {
        const secTitle = translations[`${infoPage}.s${i}.title`];
        const secDesc1 = translations[`${infoPage}.s${i}.desc1`] || translations[`${infoPage}.s${i}.desc`];
        const secDesc2 = translations[`${infoPage}.s${i}.desc2`];
        if (secTitle && secDesc1) {
          sectionsHtml += `
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white">${secTitle}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${secDesc1}</p>
              ${secDesc2 ? `<p class="text-sm text-slate-300 leading-relaxed">${secDesc2}</p>` : ''}
            </div>
          `;
        }
      }

      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4">
            <span class="text-xs uppercase font-semibold text-[#05DAED] tracking-wider">${translations[`${infoPage}.badge`] || infoPage.toUpperCase()}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations[`${infoPage}.title`] || h1}</h1>
            <p class="text-lg text-slate-300 leading-relaxed">${translations[`${infoPage}.subtitle`] || translations[`${infoPage}.intro`] || overviewText}</p>
          </section>

          <section class="flex flex-col gap-6">
            ${sectionsHtml}
          </section>
        </article>
      `;
    }

    return `
      <div class="min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-[#05DAED]/30 selection:text-[#05DAED]" ${dirAttr}>
        ${navbarHtml}
        <main class="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-12">
          ${infoContentHtml}
        </main>
        ${footerHtml}
      </div>
    `;
  }

  // =========================================================================
  // CASE B: HOMEPAGE (/${lang}/)
  // =========================================================================
  if (!tool) {
    const homeH1 = translations['hero.title'] ? `${translations['hero.title']} ${translations['hero.titleHighlight'] || ''}` : 'All-in-One Local AI Image Suite';
    const homeSubtitle = translations['hero.subtitle'] || overviewText;

    let toolCardsHtml = '';
    const coreGridTools = ['remove', 'color', 'compress', 'watermark', 'convert', 'resize', 'crop', 'rotate', 'picker', 'blurface', 'design', 'brush'];
    for (const t of coreGridTools) {
      const slug = getLocalizedSlug(t, lang);
      const tName = translations[`tab.${t}`] || translations[`nav.${t}`] || t;
      const tDesc = translations[`landing.default.desc.${t}`] || translations[`seo.jsonld.desc.${t}`] || 'High performance client-side image processing tool.';
      toolCardsHtml += `
        <a href="/${lang}/${slug}/" class="p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-[#05DAED]/50 transition-all flex flex-col gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-[#05DAED]/10 text-[#05DAED] flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform">
            ✦
          </div>
          <h3 class="text-lg font-bold text-white group-hover:text-[#05DAED] transition-colors">${tName}</h3>
          <p class="text-xs text-slate-400 leading-relaxed">${tDesc}</p>
        </a>
      `;
    }

    let faqItemsHtml = '';
    for (let i = 1; i <= 6; i++) {
      const q = translations[`landing.faq${i}.q`] || translations[`faq${i}.q`];
      const a = translations[`landing.faq${i}.a`] || translations[`faq${i}.a`];
      if (q && a) {
        faqItemsHtml += `
          <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
            <h3 class="text-base font-bold text-white">${q}</h3>
            <p class="text-sm text-slate-300 leading-relaxed">${a}</p>
          </div>
        `;
      }
    }

    return `
      <div class="min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-[#05DAED]/30 selection:text-[#05DAED]" ${dirAttr}>
        ${navbarHtml}
        <main class="max-w-6xl mx-auto px-4 py-12 flex flex-col gap-16">
          <section class="text-center flex flex-col items-center gap-6 max-w-4xl mx-auto">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#05DAED]/10 text-[#05DAED] border border-[#05DAED]/30">
              ${sec.privacyBadge} • ${sec.clientSideBadge}
            </div>
            <h1 class="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
              ${homeH1}
            </h1>
            <p class="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
              ${homeSubtitle}
            </p>
          </section>

          <section class="flex flex-col gap-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${sec.navTools}</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              ${toolCardsHtml}
            </div>
          </section>

          <section class="p-8 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-white">${translations['home.why.title'] || 'Why Choose HelpMyIMG'}</h2>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div class="flex flex-col gap-2">
                <h3 class="text-base font-bold text-[#05DAED]">${translations['home.why.f1.title'] || '100% Client-Side'}</h3>
                <p class="text-xs text-slate-400">${translations['home.why.f1.desc'] || 'All files are processed directly on your device GPU/CPU via WebAssembly.'}</p>
              </div>
              <div class="flex flex-col gap-2">
                <h3 class="text-base font-bold text-[#05DAED]">${translations['home.why.f2.title'] || 'Zero Network Latency'}</h3>
                <p class="text-xs text-slate-400">${translations['home.why.f2.desc'] || 'Instant processing without waiting for multi-megabyte file uploads to cloud servers.'}</p>
              </div>
              <div class="flex flex-col gap-2">
                <h3 class="text-base font-bold text-[#05DAED]">${translations['home.why.f3.title'] || 'Free Forever'}</h3>
                <p class="text-xs text-slate-400">${translations['home.why.f3.desc'] || 'No subscriptions, credits, signups, or artificial watermarks on your exports.'}</p>
              </div>
              <div class="flex flex-col gap-2">
                <h3 class="text-base font-bold text-[#05DAED]">${translations['home.why.f4.title'] || 'Unlimited Batch'}</h3>
                <p class="text-xs text-slate-400">${translations['home.why.f4.desc'] || 'Process multiple images simultaneously without queue delays or restrictions.'}</p>
              </div>
            </div>
          </section>

          ${scientificResearchHtml}

          <section class="flex flex-col gap-6">
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${sec.faq}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${faqItemsHtml}
            </div>
          </section>
        </main>
        ${footerHtml}
      </div>
    `;
  }

  // =========================================================================
  // CASE C: TOOL PAGES (/${lang}/${slug}/)
  // =========================================================================
  const baseTool = TOOL_BASE_MAP[tool] || 'remove';
  
  // 1. Tool Specific H1 & Hero
  const heroBadge = translations[`landing.${baseTool}.redesign.heroBadge`] || translations[`tab.${baseTool}`] || 'AI TOOL';
  const heroTitle = translations[`landing.${baseTool}.redesign.heroTitle`] || translations[`landing.default.title.${tool}`] || h1;
  const heroDesc = translations[`landing.${baseTool}.redesign.heroDesc`] || translations[`landing.default.desc.${tool}`] || overviewText;

  // 2. Features Cards (Up to 4)
  let featuresCardsHtml = '';
  for (let i = 1; i <= 4; i++) {
    const featTitle = translations[`landing.${baseTool}.redesign.feat${i}Title`] || translations[`landing.${baseTool}.feat${i}.title`];
    const featDesc = translations[`landing.${baseTool}.redesign.feat${i}Desc`] || translations[`landing.${baseTool}.feat${i}.desc`];
    if (!featTitle) continue;
    featuresCardsHtml += `
      <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-3">
        <div class="w-8 h-8 rounded-lg bg-[#05DAED]/10 text-[#05DAED] flex items-center justify-center font-bold text-sm">
          ${i}
        </div>
        <h3 class="text-lg font-bold text-white">${featTitle}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${featDesc || ''}</p>
      </div>
    `;
  }

  // Subtitles
  const featSub = translations['landing.features.subtitle'] || translations['features.subtitle'] || translations['home.why.desc'] || 'Client-side neural processing';
  const stepsSub = translations['landing.steps.subtitle'] || translations['steps.subtitle'] || translations['about.feature.fast.desc'] || 'Fast local workflow';
  const whoSub = translations['landing.who.subtitle'] || translations[`landing.${baseTool}.who.desc`] || translations['about.sec1.desc3'] || 'Professional workflow optimization';
  const faqSub = translations['faq.subtitle'] || translations['landing.faq.subtitle'] || translations['about.feature.privacy.desc'] || 'Common questions and answers';

  // 3. Step-by-Step Guide
  const stepsTitle = translations[`landing.${baseTool}.redesign.stepsTitle`] || sec.howTo;
  let stepsCardsHtml = '';
  for (let i = 1; i <= 3; i++) {
    const sTitle = translations[`landing.${baseTool}.redesign.s${i}Title`] || (i === 1 ? 'Upload Image' : i === 2 ? 'AI Processing' : 'Download Result');
    const sDesc = translations[`landing.${baseTool}.redesign.s${i}Desc`] || (i === 1 ? 'Select or drop your photo file in any format.' : i === 2 ? 'Local browser neural engine executes instant transformation.' : 'Export your high-resolution crystal-clear output.');
    const sBadge = i === 1 ? sec.step1Badge : i === 2 ? sec.step2Badge : sec.step3Badge;
    stepsCardsHtml += `
      <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col gap-3">
        <span class="text-xs font-semibold text-[#05DAED] uppercase tracking-wider">${sBadge}</span>
        <h3 class="text-lg font-bold text-white">${sTitle}</h3>
        <p class="text-sm text-slate-300 leading-relaxed">${sDesc}</p>
      </div>
    `;
  }

  // 4. Target Audience / Real-World Use Cases
  const whoTitle = translations[`landing.${baseTool}.redesign.whoTitle`] || translations[`landing.${baseTool}.who.title`] || sec.who;
  let whoCardsHtml = '';
  for (let i = 1; i <= 4; i++) {
    const wTitle = translations[`landing.${baseTool}.redesign.who${i}Title`] || translations[`landing.${baseTool}.who.c${i}.title`] || (i === 1 ? 'E-Commerce Sellers' : i === 2 ? 'Graphic Designers' : i === 3 ? 'Job Seekers & Students' : 'Web Agencies');
    const wDesc = translations[`landing.${baseTool}.redesign.who${i}Desc`] || translations[`landing.${baseTool}.who.c${i}.desc`] || 'Optimize workflows and speed up visual production without recurring SaaS subscription costs.';
    whoCardsHtml += `
      <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
        <h3 class="text-base font-bold text-white">${wTitle}</h3>
        <p class="text-xs text-slate-400 leading-relaxed">${wDesc}</p>
      </div>
    `;
  }

  // 5. Frequently Asked Questions (FAQ)
  const faqTitle = translations[`landing.${baseTool}.faqTitle`] || translations['landing.faqTitle'] || sec.faq;
  let faqListHtml = '';
  const matrixItem = matrixData.find(m => m.tool === tool && (m.lang === lang || m.lang === (lang === 'zh-CN' ? 'zh' : lang)));
  
  if (matrixItem && matrixItem.faqs && matrixItem.faqs.length > 0) {
    for (const item of matrixItem.faqs) {
      faqListHtml += `
        <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
          <h3 class="text-base font-bold text-white">${item.question}</h3>
          <p class="text-sm text-slate-300 leading-relaxed">${item.answer}</p>
        </div>
      `;
    }
  } else {
    for (let i = 1; i <= 6; i++) {
      const q = translations[`landing.${baseTool}.faq${i}.q`] || translations[`landing.remove.faq${i}.q`];
      const a = translations[`landing.${baseTool}.faq${i}.a`] || translations[`landing.remove.faq${i}.a`];
      if (q && a) {
        faqListHtml += `
          <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
            <h3 class="text-base font-bold text-white">${q}</h3>
            <p class="text-sm text-slate-300 leading-relaxed">${a}</p>
          </div>
        `;
      }
    }
  }

  return `
    <div class="min-h-screen bg-[#0a0d14] text-slate-100 font-sans selection:bg-[#05DAED]/30 selection:text-[#05DAED]" ${dirAttr}>
      ${navbarHtml}
      <main class="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-16">
        <!-- Hero Section -->
        <section class="text-center flex flex-col items-center gap-6 max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#05DAED]/10 text-[#05DAED] border border-[#05DAED]/30">
            ${heroBadge} • ${sec.privacyBadge}
          </div>
          <h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            ${heroTitle}
          </h1>
          <p class="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl">
            ${heroDesc}
          </p>
        </section>

        <!-- Interactive Workspace / Dropzone Representation -->
        <section class="border-2 border-dashed border-slate-700 hover:border-[#05DAED]/50 rounded-3xl p-8 md:p-14 text-center bg-slate-900/40 flex flex-col items-center justify-center gap-4 transition-colors">
          <div class="w-16 h-16 rounded-2xl bg-[#05DAED]/10 text-[#05DAED] flex items-center justify-center text-3xl font-bold">
            ↑
          </div>
          <div class="flex flex-col gap-1">
            <h3 class="text-lg md:text-xl font-bold text-white">${sec.dropzoneTitle}</h3>
            <p class="text-sm text-slate-400 max-w-md">${sec.dropzonePrompt}</p>
          </div>
          <button type="button" class="mt-2 px-6 py-3 rounded-xl bg-[#05DAED] hover:bg-[#05DAED]/90 text-slate-950 font-bold text-sm shadow-lg shadow-[#05DAED]/20 transition-all pointer-events-none">
            ${sec.dropzoneBtn}
          </button>
          <div class="flex flex-wrap gap-3 justify-center text-xs text-slate-500 mt-2">
            <span>PNG</span> • <span>JPG</span> • <span>WEBP</span> • <span>SVG</span> • <span class="text-[#05DAED]">${sec.clientSideBadge}</span>
          </div>
        </section>

        <!-- Key Features Section -->
        <section class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${sec.features}</h2>
            <p class="text-sm text-slate-400">${featSub}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${featuresCardsHtml}
          </div>
        </section>

        <!-- Step-by-Step How-To Guide -->
        <section class="flex flex-col gap-6 bg-slate-900/30 border border-slate-800/80 rounded-3xl p-6 md:p-10">
          <div class="flex flex-col gap-2">
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${stepsTitle}</h2>
            <p class="text-sm text-slate-400">${stepsSub}</p>
          </div>
          <ol class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${stepsCardsHtml}
          </ol>
        </section>

        <!-- Target Audience Section -->
        <section class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${whoTitle}</h2>
            <p class="text-sm text-slate-400">${whoSub}</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${whoCardsHtml}
          </div>
        </section>

        <!-- Technical Specifications & Privacy Architecture -->
        <section class="flex flex-col gap-6 border-t border-slate-800/80 pt-12">
          <div class="flex flex-col gap-2">
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${sec.tech}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">
              ${translations['about.sec1.desc3'] || translations['privacy.s1.desc1'] || 'HelpMyIMG operates on a 100% decentralized, client-side computing paradigm. Unlike traditional SaaS image editors that transmit your private photo bytes across third-party cloud servers, our architecture compiles production-grade computer vision models directly into WebAssembly (WASM) and leverages your devices native GPU via WebGPU and OffscreenCanvas.'}
            </p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
            <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <strong class="text-white text-base">${translations['about.tech.b1.title'] || 'WebAssembly (WASM)'}</strong>
              <p class="text-xs text-slate-400 leading-relaxed">${translations['about.tech.b1.desc'] || translations['about.feature.local.desc'] || 'Neural network inference runs locally on your device CPU/GPU in an isolated background thread.'}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <strong class="text-white text-base">${translations['about.feature.privacy'] || '100% Privacy Guarantee'}</strong>
              <p class="text-xs text-slate-400 leading-relaxed">${translations['privacy.highlight.desc'] || translations['about.feature.privacy.desc'] || 'Photos never leave your hard drive or browser memory. Zero server uploads.'}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <strong class="text-white text-base">${translations['about.feature.fast'] || 'Lossless Precision Output'}</strong>
              <p class="text-xs text-slate-400 leading-relaxed">${translations['about.feature.fast.desc'] || 'Native Canvas 2D color pipeline maintains pixel dimensions and color fidelity.'}</p>
            </div>
          </div>
        </section>

        <!-- Scientific Bibliography & Foundations -->
        ${scientificResearchHtml}

        <!-- Frequently Asked Questions (FAQ) -->
        <section class="flex flex-col gap-6 border-t border-slate-800/80 pt-12">
          <div class="flex flex-col gap-2">
            <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">${faqTitle}</h2>
            <p class="text-sm text-slate-400">${faqSub}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            ${faqListHtml}
          </div>
        </section>
      </main>
      ${footerHtml}
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

  // 4. Inject JSON-LD Structured Data
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
  const baseTool = tool ? (TOOL_BASE_MAP[tool] || 'remove') : null;

  if (tool) {
    const matrixItem = matrixData.find(m => m.tool === tool && (m.lang === lang || m.lang === (lang === 'zh-CN' ? 'zh' : lang)));
    if (matrixItem && matrixItem.faqs && matrixItem.faqs.length > 0) {
      for (const faq of matrixItem.faqs) {
        faqEntities.push({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        });
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        const q = translations[`landing.${baseTool}.faq${i}.q`] || translations[`landing.remove.faq${i}.q`];
        const a = translations[`landing.${baseTool}.faq${i}.a`] || translations[`landing.remove.faq${i}.a`];
        if (q && a) {
          faqEntities.push({
            "@type": "Question",
            "name": q,
            "acceptedAnswer": { "@type": "Answer", "text": a }
          });
        }
      }
    }
  } else if (!infoPage) {
    for (let i = 1; i <= 6; i++) {
      const q = translations[`landing.faq${i}.q`] || translations[`faq${i}.q`];
      const a = translations[`landing.faq${i}.a`] || translations[`faq${i}.a`];
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

  // 5. Inject Rich, 100% VISIBLE Semantic HTML into <div id="root">
  const semanticHtml = generateSemanticHtml(lang, urlPath, seoTitle, seoDesc, tool, infoPage, translations);
  html = html.replace(/<div id="root"><\/div>/i, `<div id="root">\n${semanticHtml}\n    </div>`);

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

console.log(`✅ Successfully generated ${generatedCount} localized, 100% visible SEO HTML Shells in dist/ with zero hidden-text clipping, deep semantic hierarchy, and native i18n.`);
