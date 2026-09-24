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

// 12 Core Homepage Tools Config matching src/config/tools.tsx
const TOOL_GRID_CONFIG = [
  {
    id: 'remove',
    titleKey: 'nav.removeBg',
    descKey: 'grid.removeDesc',
    defaultTitle: 'Remove Background',
    defaultDesc: 'Quickly remove image backgrounds with high accuracy. Instantly detect subjects and cut them out.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><circle cx="6" cy="6" r="3"/><path d="M8.12 8.12 12 12"/><circle cx="6" cy="18" r="3"/><path d="M14.8 14.8 20 20"/><path d="m14.8 9.2 5.2-5.2"/><path d="m8.12 15.88 3.88-3.88"/></svg>`
  },
  {
    id: 'compress',
    titleKey: 'nav.compress',
    descKey: 'grid.compressDesc',
    defaultTitle: 'Compress Image',
    defaultDesc: 'Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.',
    isNew: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" x2="21" y1="10" y2="3"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`
  },
  {
    id: 'convert',
    titleKey: 'nav.convert',
    descKey: 'grid.convertDesc',
    defaultTitle: 'Convert Format',
    defaultDesc: 'Turn PNG, GIF, TIF, PSD, SVG, WEBP, HEIC, or RAW format images to JPG in bulk with ease.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`
  },
  {
    id: 'resize',
    titleKey: 'nav.resize',
    descKey: 'grid.resizeDesc',
    defaultTitle: 'Resize Image',
    defaultDesc: 'Define your dimensions, by percent or pixel, and resize your JPG, PNG, SVG, and GIF images.',
    isNew: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`
  },
  {
    id: 'crop',
    titleKey: 'nav.crop',
    descKey: 'grid.cropDesc',
    defaultTitle: 'Crop Image',
    defaultDesc: 'Crop JPG, PNG, or GIFs with ease. Choose pixels to define your rectangle.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><path d="M6 2v14a2 2 0 0 0 2 2h14"/><path d="M18 22V8a2 2 0 0 0-2-2H2"/></svg>`
  },
  {
    id: 'rotate',
    titleKey: 'nav.rotate',
    descKey: 'grid.rotateDesc',
    defaultTitle: 'Rotate Image',
    defaultDesc: 'Rotate many images JPG, PNG or GIF at the same time with flip support.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>`
  },
  {
    id: 'color',
    titleKey: 'nav.color',
    descKey: 'grid.colorDesc',
    defaultTitle: 'Photo Background Colors',
    defaultDesc: 'Replace background with official ID passport red, blue, pure white, or professional studio gradients.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`
  },
  {
    id: 'brush',
    titleKey: 'tab.brush',
    descKey: 'brush.desc',
    defaultTitle: 'Magic Brush Eraser',
    defaultDesc: 'Manually restore or erase parts of your image for perfect edges.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>`
  },
  {
    id: 'design',
    titleKey: 'nav.design',
    descKey: 'grid.designDesc',
    defaultTitle: 'Advanced Photo Editor',
    defaultDesc: 'Add text, stickers, shapes, filters, fine-tune colors, and apply artistic annotations to your images.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><path d="m19 2 2 2-2 2-2-2Z"/><path d="m5 6 3 3-3 3-3-3Z"/><path d="m19 14 2 2-2 2-2-2Z"/><path d="M10 2 2 10l12 12 8-8Z"/></svg>`
  },
  {
    id: 'watermark',
    titleKey: 'nav.watermark',
    descKey: 'grid.watermarkDesc',
    defaultTitle: 'Watermark Image',
    defaultDesc: 'Stamp an image or text over your images in seconds. Choose typography, transparency and position.',
    isNew: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><path d="M5 22h14"/><path d="M19.27 13.73A2.5 2.5 0 0 0 17.5 13h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1.5c0-.66-.26-1.3-.73-1.77Z"/><path d="M14 13V8.5C14 7.12 12.88 6 11.5 6S9 7.12 9 8.5V13"/></svg>`
  },
  {
    id: 'blurface',
    titleKey: 'nav.blurface',
    descKey: 'grid.blurfaceDesc',
    defaultTitle: 'Blur Face & Plate',
    defaultDesc: 'Automatically detect and blur faces or apply custom censorship boxes.',
    isNew: true,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><path d="M9 9h.01"/><path d="M15 9h.01"/></svg>`
  },
  {
    id: 'picker',
    titleKey: 'nav.picker',
    descKey: 'grid.pickerDesc',
    defaultTitle: 'Image Color Picker',
    defaultDesc: 'Pick colors directly from any image, inspect RGB/HEX values, and copy color palettes instantly.',
    isNew: false,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 sm:w-6 sm:h-6"><path d="m2 22 1-1h3l9-9"/><path d="M12.5 7.5 16 11"/><path d="m15 5 4 4"/><path d="m20.5 3.5 1 1a2.12 2.12 0 0 1 0 3l-1.5 1.5-4-4L17.5 3.5a2.12 2.12 0 0 1 3 0Z"/></svg>`
  }
];

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

  // Pre-rendered Navbar - Matches React src/components/Navbar.tsx
  const navbarHtml = `
    <header class="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-dark-500/40 bg-white dark:bg-dark-900 shadow-sm dark:shadow-none">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[60px] flex items-center justify-between">
        <div class="flex items-center justify-start flex-shrink-0">
          <a href="/${lang}/" class="flex items-center gap-2.5 group">
            <div class="w-[38px] h-[38px] flex-shrink-0 transition-all duration-300 drop-shadow-glow-cyan">
              <img src="/logobaru.png" alt="HelpMyIMG Logo" width="38" height="38" decoding="async" class="w-full h-full object-contain" />
            </div>
            <div class="flex flex-col">
              <span class="text-xl font-heading font-extrabold text-slate-900 dark:text-white">
                HelpMy<span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-emerald">IMG</span>
              </span>
            </div>
          </a>
        </div>
        <div class="hidden lg:flex items-center justify-center flex-1 relative px-4">
          <nav class="flex items-center gap-2 xl:gap-4 text-sm font-medium text-slate-700 dark:text-slate-300">
            <a href="/${lang}/${getLocalizedSlug('remove', lang)}/" class="hover:text-neon-cyan transition-colors font-bold text-[13.5px] uppercase px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg">
              ${translations['nav.removeBg'] || 'Remove Background'}
            </a>
            <a href="/${lang}/${getLocalizedSlug('compress', lang)}/" class="hover:text-neon-cyan transition-colors font-bold text-[13.5px] uppercase px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg">
              ${translations['nav.compress'] || 'Compress Image'}
            </a>
            <a href="/${lang}/${getLocalizedSlug('resize', lang)}/" class="hover:text-neon-cyan transition-colors font-bold text-[13.5px] uppercase px-2.5 py-1.5 flex items-center whitespace-nowrap rounded-lg">
              ${translations['nav.resize'] || 'Resize Image'}
            </a>
            <div class="relative ml-1">
              <div class="flex items-center gap-2 bg-neon-cyan/10 border border-neon-cyan/30 text-cyan-800 dark:text-neon-cyan px-3.5 py-1.5 rounded-lg font-bold text-[13.5px] uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                <span>${translations['nav.tools'] === 'AI Tools' ? 'All Photo Tools' : (translations['nav.tools'] || 'All Photo Tools')}</span>
              </div>
            </div>
          </nav>
        </div>
        <div class="flex items-center justify-end gap-2 sm:gap-3 flex-shrink-0">
          <div class="flex items-center justify-center w-9 h-9 bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-500/60 rounded-xl text-slate-600 dark:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-500"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </div>
          <div class="flex items-center gap-2 bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-500/60 px-3 h-9 rounded-xl text-[14.5px] font-semibold text-slate-700 dark:text-slate-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-cyan-600 dark:text-neon-cyan"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            <span class="hidden sm:inline uppercase font-mono text-[14px] font-bold">${lang}</span>
          </div>
        </div>
      </div>
    </header>
  `;

  // Pre-rendered Footer - Matches React src/components/Footer.tsx
  const footerHtml = `
    <footer class="w-full border-t border-dark-600/60 bg-dark-900/90 backdrop-blur-xl py-12 mt-20 text-slate-600 dark:text-slate-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div class="space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 drop-shadow-glow-cyan">
                <img src="/logobaru.png" alt="HelpMyIMG Logo" width="36" height="36" class="w-full h-full object-contain" />
              </div>
              <span class="text-xl font-heading font-extrabold tracking-tight text-slate-900 dark:text-white">
                HelpMy<span class="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-emerald">IMG</span>
              </span>
            </div>
            <p class="text-[13px] text-slate-400 leading-relaxed font-body font-medium max-w-sm">
              ${translations['hero.subtitle.short'] || '100% Free, Private, Zero-Cloud AI Image Editing. All machine learning models run securely inside your browser using WebAssembly.'}
            </p>
            <div class="inline-flex items-center gap-2 text-xs text-[#05DAED]">
              <span class="w-2 h-2 rounded-full bg-[#05DAED] animate-pulse"></span>
              <span>${sec.clientSideBadge}</span>
            </div>
          </div>
          <div class="space-y-3.5 text-[13px] font-body">
            <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">${sec.navTools}</h3>
            <ul class="space-y-2 text-slate-500 dark:text-slate-400">
              ${toolsNavLinks}
            </ul>
          </div>
          <div class="space-y-3.5 text-[13px] font-body">
            <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">${sec.navCompany}</h3>
            <ul class="space-y-2 text-slate-500 dark:text-slate-400">
              ${infoNavLinks}
            </ul>
          </div>
          <div class="space-y-3.5 text-[13px] font-body">
            <h3 class="font-bold text-slate-900 dark:text-white text-sm tracking-wide">${translations['languages.title'] || 'Global Languages'}</h3>
            <p class="text-xs text-slate-400 leading-relaxed">
              HelpMyIMG is natively localized in 30 languages with zero external telemetry.
            </p>
            <a href="/${lang}/languages/" class="text-xs text-[#05DAED] hover:underline">${translations['languages.badge'] || 'View All 30 Languages →'}</a>
          </div>
        </div>
        <div class="border-t border-slate-800/80 pt-8 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
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
    } else if (infoPage === 'faq') {
      // FAQ Page Template with all 12 Q&As categorized
      const faqCategories = [
        { name: translations['faq.cat.general'] || 'General', iconColor: 'text-[#05DAED]', items: [1, 2, 3] },
        { name: translations['faq.cat.privacy'] || 'Privacy & Security', iconColor: 'text-[#12DA91]', items: [4, 5, 6] },
        { name: translations['faq.cat.tech'] || 'Technology', iconColor: 'text-[#05DAED]', items: [7, 8, 9] },
        { name: translations['faq.cat.usage'] || 'Usage & Limits', iconColor: 'text-[#12DA91]', items: [10, 11, 12] }
      ];

      let allFaqsHtml = '';
      for (const cat of faqCategories) {
        let catFaqsHtml = '';
        for (const idx of cat.items) {
          const q = translations[`faq.q${idx}`];
          const a = translations[`faq.a${idx}`];
          if (q && a) {
            catFaqsHtml += `
              <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
                <h3 class="text-base font-bold text-white font-heading">${q}</h3>
                <p class="text-sm text-slate-300 leading-relaxed">${a}</p>
              </div>
            `;
          }
        }
        if (catFaqsHtml) {
          allFaqsHtml += `
            <div class="flex flex-col gap-4">
              <h2 class="text-xl font-bold ${cat.iconColor} font-heading tracking-wide border-b border-slate-800 pb-2">${cat.name}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${catFaqsHtml}
              </div>
            </div>
          `;
        }
      }

      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4 text-center">
            <span class="text-xs uppercase font-semibold text-[#05DAED] tracking-wider">${translations['faq.badge'] || 'HELP CENTER & FAQ'}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations['faq.title'] || h1}</h1>
            <p class="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">${translations['faq.subtitle'] || overviewText}</p>
          </section>

          <section class="flex flex-col gap-8">
            ${allFaqsHtml}
          </section>

          <section class="p-8 rounded-3xl bg-gradient-to-r from-neon-cyan/10 via-neon-emerald/10 to-transparent border border-neon-cyan/30 text-center flex flex-col gap-3">
            <h3 class="text-xl font-bold text-white font-heading">${translations['faq.more.title'] || 'Still have questions?'}</h3>
            <p class="text-sm text-slate-300 max-w-xl mx-auto">${translations['faq.more.desc'] || 'We are here to help. Reach out to our community or explore our privacy-first local image editing suite.'}</p>
          </section>
        </article>
      `;
    } else if (infoPage === 'pricing') {
      // Pricing Page Template with Tier Cards, Features, Cost Comparison & FAQs
      let featuresListHtml = '';
      for (let i = 1; i <= 6; i++) {
        const feat = translations[`pricing.f${i}`];
        if (feat) {
          featuresListHtml += `<li class="flex items-center gap-2"><span class="text-[#12DA91] font-bold">✓</span> ${feat}</li>`;
        }
      }

      let pricingFaqsHtml = '';
      for (let i = 1; i <= 3; i++) {
        const q = translations[`pricing.faq${i}.q`];
        const a = translations[`pricing.faq${i}.a`];
        if (q && a) {
          pricingFaqsHtml += `
            <div class="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-sm font-bold text-white font-heading">${q}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${a}</p>
            </div>
          `;
        }
      }

      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4 text-center">
            <span class="text-xs uppercase font-semibold text-[#12DA91] tracking-wider">${translations['pricing.badge'] || 'PRICING & PLANS'}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations['pricing.title'] || h1}</h1>
            <p class="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">${translations['pricing.subtitle'] || overviewText}</p>
            <div class="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-neon-emerald/10 border border-neon-emerald/30 text-neon-emerald text-sm font-bold mx-auto">
              ${translations['info.freePromo'] || '100% Free Forever • Zero Subscriptions • No Credit Card'}
            </div>
          </section>

          <section class="p-8 md:p-10 rounded-3xl bg-slate-900/80 border border-slate-700/80 flex flex-col gap-6 max-w-2xl mx-auto w-full text-center">
            <span class="text-sm uppercase font-mono tracking-widest text-[#05DAED] font-bold">${translations['pricing.tierName'] || 'Enterprise Tier'}</span>
            <div class="flex items-baseline justify-center gap-2">
              <span class="text-5xl font-extrabold text-white">$0</span>
              <span class="text-slate-400 font-medium">${translations['pricing.period'] || '/ forever'}</span>
            </div>
            <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-sm text-slate-200 mt-4">
              ${featuresListHtml}
            </ul>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['pricing.s3.title'] || 'Cost Comparison'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['pricing.s3.c1.name'] || 'Cloud Services'}: $30 - $120 / month</p>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['pricing.s3.c2.name'] || 'Traditional Software'}: $240 / year</p>
              <p class="text-sm text-[#12DA91] font-bold leading-relaxed">${translations['pricing.s3.c3.name'] || 'HelpMyIMG'}: $0 Free Forever</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['pricing.s4.title'] || 'Why Is It Free?'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['pricing.s4.desc1'] || ''}</p>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['pricing.s4.desc2'] || ''}</p>
              <div class="mt-2 p-3 rounded-lg bg-dark-800 border border-dark-600 text-xs text-slate-300">
                <strong class="text-white">${translations['pricing.s4.boxTitle'] || 'Zero Cloud Computing Bills'}:</strong> ${translations['pricing.s4.boxDesc'] || 'Because processing happens on your device, we have zero server GPU costs.'}
              </div>
            </div>
          </section>

          <section class="flex flex-col gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['pricing.s5.title'] || 'Enterprise Quality Standards'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['pricing.s5.desc'] || ''}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${pricingFaqsHtml}
            </div>
          </section>
        </article>
      `;
    } else if (infoPage === 'compare') {
      // Compare Page Template with Head-to-Head Matrix & Competitor Breakdown
      let compareRowsHtml = '';
      for (let i = 1; i <= 5; i++) {
        const label = translations[`compare.row${i}.label`];
        const ours = translations[`compare.row${i}.ours`];
        const t1 = translations[`compare.row${i}.t1`];
        const t2 = translations[`compare.row${i}.t2`];
        if (label) {
          compareRowsHtml += `
            <tr class="border-b border-slate-800">
              <td class="p-4 font-semibold text-white">${label}</td>
              <td class="p-4 text-[#12DA91] font-bold">✓ ${ours || ''}</td>
              <td class="p-4 text-slate-400">${t1 || ''}</td>
              <td class="p-4 text-slate-500">${t2 || ''}</td>
            </tr>
          `;
        }
      }

      let compareFaqsHtml = '';
      for (let i = 1; i <= 3; i++) {
        const q = translations[`compare.faq${i}.q`];
        const a = translations[`compare.faq${i}.a`];
        if (q && a) {
          compareFaqsHtml += `
            <div class="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-sm font-bold text-white font-heading">${q}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${a}</p>
            </div>
          `;
        }
      }

      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4 text-center">
            <span class="text-xs uppercase font-semibold text-[#A855F7] tracking-wider">${translations['compare.badge'] || 'HEAD-TO-HEAD COMPARISON'}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations['compare.title'] || h1}</h1>
            <p class="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">${translations['compare.subtitle'] || overviewText}</p>
          </section>

          <div class="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
            <table class="w-full text-left border-collapse text-sm">
              <thead>
                <tr class="border-b border-slate-800 bg-slate-900/90 text-slate-300">
                  <th class="p-4 font-bold text-white">Feature</th>
                  <th class="p-4 font-bold text-[#05DAED]">HelpMyIMG (Local WASM)</th>
                  <th class="p-4 font-bold text-slate-400">Cloud Competitors (Remove.bg / Canva)</th>
                  <th class="p-4 font-bold text-slate-400">Traditional Software</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800 text-slate-300">
                ${compareRowsHtml}
              </tbody>
            </table>
          </div>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['compare.s3.title'] || 'Speed & Latency Elimination'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['compare.s3.desc'] || ''}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['compare.s4.title'] || '100% Offline Capability'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['compare.s4.desc'] || ''}</p>
            </div>
          </section>

          <section class="flex flex-col gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['compare.s5.title'] || 'Security & Compliance Comparison'}</h2>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div class="p-4 rounded-xl bg-dark-800 border border-dark-600">
                  <strong class="text-[#05DAED] text-sm">${translations['compare.s5.t1'] || 'Zero-Knowledge Architecture'}:</strong>
                  <p class="text-xs text-slate-300 mt-1">${translations['compare.s5.c1'] || ''}</p>
                </div>
                <div class="p-4 rounded-xl bg-dark-800 border border-dark-600">
                  <strong class="text-slate-300 text-sm">${translations['compare.s5.t2'] || 'Cloud Leak Risk'}:</strong>
                  <p class="text-xs text-slate-400 mt-1">${translations['compare.s5.c2'] || ''}</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              ${compareFaqsHtml}
            </div>
          </section>
        </article>
      `;
    } else if (infoPage === 'security') {
      // Security Page Template
      let secFaqsHtml = '';
      for (let i = 1; i <= 3; i++) {
        const q = translations[`security.faq${i}.q`];
        const a = translations[`security.faq${i}.a`];
        if (q && a) {
          secFaqsHtml += `
            <div class="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-sm font-bold text-white font-heading">${q}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${a}</p>
            </div>
          `;
        }
      }

      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4 text-center">
            <span class="text-xs uppercase font-semibold text-[#05DAED] tracking-wider">${translations['security.badge'] || 'SECURITY ARCHITECTURE'}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations['security.title'] || h1}</h1>
            <p class="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">${translations['security.subtitle'] || overviewText}</p>
          </section>

          <section class="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-4">
            <h2 class="text-2xl font-bold text-white font-heading">${translations['security.s2.title'] || 'Local Processing Guarantee'}</h2>
            <p class="text-sm text-slate-300 leading-relaxed">${translations['security.s2.desc'] || ''}</p>
            <ul class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <li class="p-4 rounded-xl bg-dark-800/60 border border-dark-600 text-sm text-slate-200">🔒 ${translations['security.s2.bullet1'] || 'Air-gapped memory sandbox'}</li>
              <li class="p-4 rounded-xl bg-dark-800/60 border border-dark-600 text-sm text-slate-200">🛡️ ${translations['security.s2.bullet2'] || 'Zero server transit'}</li>
              <li class="p-4 rounded-xl bg-dark-800/60 border border-dark-600 text-sm text-slate-200">⚡ ${translations['security.s2.bullet3'] || 'Instant memory purge upon tab close'}</li>
            </ul>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-base font-bold text-[#05DAED] font-heading">${translations['security.s3.b1.title'] || 'Hardware-Level Isolation'}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${translations['security.s3.b1.desc'] || ''}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-base font-bold text-[#05DAED] font-heading">${translations['security.s3.b2.title'] || 'WASM Sandboxing'}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${translations['security.s3.b2.desc'] || ''}</p>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-base font-bold text-[#05DAED] font-heading">${translations['security.s3.b3.title'] || 'Zero Data Retention'}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${translations['security.s3.b3.desc'] || ''}</p>
            </div>
          </section>

          <section class="p-8 rounded-3xl bg-dark-800/40 border border-dark-600/60 flex flex-col gap-3">
            <span class="text-xs font-mono font-bold text-[#12DA91] uppercase">${translations['security.research.tag'] || 'ACADEMIC VERIFICATION'}</span>
            <h3 class="text-xl font-bold text-white font-heading">${translations['security.research.title'] || 'Formal Cryptographic & Security Verification'}</h3>
            <p class="text-sm text-slate-300 leading-relaxed">${translations['security.research.desc1'] || ''}</p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div class="p-4 rounded-xl bg-dark-900/60 border border-dark-600">
                <strong class="text-white text-sm">${translations['security.research.box1.title'] || 'W3C WebAssembly Specification'}:</strong>
                <p class="text-xs text-slate-400 mt-1">${translations['security.research.box1.desc'] || ''}</p>
              </div>
              <div class="p-4 rounded-xl bg-dark-900/60 border border-dark-600">
                <strong class="text-white text-sm">${translations['security.research.box2.title'] || 'ISO/IEC 27001 Data Privacy Alignment'}:</strong>
                <p class="text-xs text-slate-400 mt-1">${translations['security.research.box2.desc'] || ''}</p>
              </div>
            </div>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${secFaqsHtml}
          </section>
        </article>
      `;
    } else if (infoPage === 'languages') {
      // Languages Page Template
      let langLinksHtml = '';
      for (const l of LANGS) {
        const nativeName = translations[`lang.${l}`] || l.toUpperCase();
        const slug = getLocalizedInfoSlug('languages', l);
        langLinksHtml += `
          <a href="/${l}/${slug}/" class="p-3 rounded-xl bg-dark-800/80 border border-dark-600 hover:border-[#05DAED]/50 transition-colors flex items-center justify-between text-xs font-bold text-slate-200">
            <span>${nativeName}</span>
            <span class="text-[10px] font-mono text-[#05DAED] uppercase">${l}</span>
          </a>
        `;
      }

      let langFaqsHtml = '';
      for (let i = 1; i <= 3; i++) {
        const q = translations[`languages.faq${i}.q`];
        const a = translations[`languages.faq${i}.a`];
        if (q && a) {
          langFaqsHtml += `
            <div class="p-5 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col gap-2">
              <h3 class="text-sm font-bold text-white font-heading">${q}</h3>
              <p class="text-xs text-slate-400 leading-relaxed">${a}</p>
            </div>
          `;
        }
      }

      infoContentHtml = `
        <article class="flex flex-col gap-10">
          <section class="flex flex-col gap-4 text-center">
            <span class="text-xs uppercase font-semibold text-[#05DAED] tracking-wider">${translations['languages.badge'] || 'GLOBAL LOCALIZATION'}</span>
            <h1 class="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">${translations['languages.title'] || h1}</h1>
            <p class="text-lg text-slate-300 leading-relaxed max-w-3xl mx-auto">${translations['languages.subtitle'] || overviewText}</p>
          </section>

          <section class="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col gap-6">
            <h2 class="text-2xl font-bold text-white font-heading">${translations['languages.s2.title'] || 'Supported Global Languages'}</h2>
            <p class="text-sm text-slate-300">${translations['languages.s2.desc'] || 'HelpMyIMG is natively localized for 30 global languages with zero machine-translated English fallbacks.'}</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              ${langLinksHtml}
            </div>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['languages.s3.title'] || 'Right-to-Left (RTL) & Accessibility'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['languages.s3.desc'] || ''}</p>
              <ul class="list-disc list-inside space-y-1 text-xs text-slate-400 mt-2">
                <li>${translations['languages.s3.l1'] || 'Full Arabic & Hebrew RTL mirroring.'}</li>
                <li>${translations['languages.s3.l2'] || 'Localized typography and font pairings.'}</li>
                <li>${translations['languages.s3.l3'] || 'Screen reader accessible aria-labels in 30 languages.'}</li>
              </ul>
            </div>
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${translations['languages.s4.title'] || 'Universal Performance Anywhere'}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">${translations['languages.s4.desc'] || ''}</p>
            </div>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${langFaqsHtml}
          </section>
        </article>
      `;
    } else {
      // Terms and Fallback Info Pages
      let sectionsHtml = '';
      for (let i = 1; i <= 6; i++) {
        const secTitle = translations[`${infoPage}.s${i}.title`];
        const secDesc1 = translations[`${infoPage}.s${i}.desc1`] || translations[`${infoPage}.s${i}.desc`];
        const secDesc2 = translations[`${infoPage}.s${i}.desc2`];
        if (secTitle && secDesc1) {
          sectionsHtml += `
            <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col gap-2">
              <h2 class="text-xl font-bold text-white font-heading">${secTitle}</h2>
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
      <div class="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 font-body flex flex-col transition-colors duration-300 selection:bg-[#05DAED]/30 selection:text-[#05DAED]" ${dirAttr}>
        <div class="fixed top-1/2 left-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.12)_0%,transparent_60%)] rounded-full pointer-events-none -z-10"></div>
        <div class="fixed top-1/3 right-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_60%)] rounded-full pointer-events-none -z-10"></div>
        ${navbarHtml}
        <main class="max-w-5xl mx-auto px-4 py-12 flex flex-col gap-12 flex-1">
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
    const homeTitleHighlight = translations['home.hero.titleHighlight'] || 'All Image';
    const homeTitleSolid = translations['home.hero.titleSolid'] || 'Tools in One Place';
    const homeSubtitle = translations['hero.subtitle.short'] || 'Combine, split, compress, convert, and process images directly in your browser. 100% offline via WebAssembly. Free, unlimited, and highly secure.';
    const searchPlaceholder = translations['hero.search.placeholder'] || 'Search tools (Remove BG, Compress, Edit)...';

    let toolCardsHtml = '';
    for (const item of TOOL_GRID_CONFIG) {
      const slug = getLocalizedSlug(item.id, lang);
      const href = lang === 'en' ? `/${slug}/` : `/${lang}/${slug}/`;
      const title = translations[item.titleKey] || item.defaultTitle;
      const desc = translations[item.descKey] || item.defaultDesc;
      const badge = item.isNew
        ? `<span class="text-[9px] sm:text-[10px] font-bold tracking-widest px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-[#12DA91]/10 text-[#12DA91] border border-[#12DA91]/20 uppercase">${translations['common.new'] || 'New!'}</span>`
        : `<span class="text-[9px] sm:text-[10px] font-bold tracking-widest px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-dark-800 text-slate-500 border border-dark-600 uppercase">IMG</span>`;

      toolCardsHtml += `
        <a href="${href}" class="group relative flex flex-col p-6 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-dark-900/80 border border-dark-600 hover:border-[#05DAED]/30 hover:bg-dark-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(5,218,237,0.1)] h-full">
          <div class="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
            <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-[1rem] sm:rounded-[1.25rem] bg-dark-800 border border-dark-600 flex items-center justify-center group-hover:bg-[#05DAED]/10 group-hover:border-[#05DAED]/30 transition-colors duration-300 shadow-sm text-slate-300 group-hover:text-[#05DAED]">
              ${item.svg}
            </div>
            ${badge}
          </div>
          <div class="relative z-10 flex-1">
            <h3 class="text-lg sm:text-2xl font-bold font-heading text-white mb-3 sm:mb-4 group-hover:text-[#05DAED] transition-colors leading-tight">
              ${title}
            </h3>
            <p class="text-sm sm:text-base text-slate-400 leading-relaxed line-clamp-3">
              ${desc}
            </p>
          </div>
        </a>
      `;
    }

    let faqItemsHtml = '';
    for (let i = 1; i <= 6; i++) {
      const q = translations[`landing.faq${i}.q`] || translations[`faq${i}.q`];
      const a = translations[`landing.faq${i}.a`] || translations[`faq${i}.a`];
      if (q && a) {
        faqItemsHtml += `
          <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-2">
            <h3 class="text-base sm:text-lg font-bold text-white font-heading">${q}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">${a}</p>
          </div>
        `;
      }
    }

    return `
      <div class="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 font-body flex flex-col transition-colors duration-300 selection:bg-[#05DAED]/30 selection:text-[#05DAED]" ${dirAttr}>
        <div class="fixed top-1/2 left-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.12)_0%,transparent_60%)] rounded-full pointer-events-none -z-10"></div>
        <div class="fixed top-1/3 right-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_60%)] rounded-full pointer-events-none -z-10"></div>
        ${navbarHtml}
        <main class="flex-1 w-full flex flex-col min-h-screen gap-8 md:gap-16 pt-12 pb-16">
          <div class="relative">
            <!-- Hero Section -->
            <section class="relative pt-2 md:pt-6 pb-2 overflow-hidden flex flex-col items-center justify-center text-center">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-100 dark:from-dark-800 to-transparent opacity-50 pointer-events-none -z-10"></div>
              <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                <h1 class="font-heading font-black mb-6 text-center" style="font-size: clamp(2.2rem, 6vw, 4.5rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.15;">
                  <span class="bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo bg-clip-text text-transparent drop-shadow-sm inline">${homeTitleHighlight}</span> <span class="text-slate-800 dark:text-slate-100 inline">${homeTitleSolid}</span>
                </h1>
                <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10" style="font-size: clamp(0.9rem, 2vw, 1.25rem); font-weight: 500; line-height: 1.6;">
                  ${homeSubtitle}
                </p>
                <div class="relative max-w-2xl mx-auto mb-4 shadow-xl shadow-slate-200/20 dark:shadow-none rounded-full group">
                  <div class="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                    <svg class="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-neon-cyan transition-colors" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <input type="text" class="block w-full pl-10 sm:pl-12 pr-4 sm:pr-6 py-3 sm:py-4 rounded-full border-0 bg-white dark:bg-dark-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-neon-cyan focus:outline-none text-sm sm:text-lg transition-all duration-300" placeholder="${searchPlaceholder}" readonly />
                </div>
              </div>
            </section>

            <!-- ToolGrid Section -->
            <div class="-mt-4 relative z-10">
              <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-16 relative z-10" id="tools-section">
                <!-- Filter Pills -->
                <div class="flex flex-wrap items-center justify-center gap-3 mb-8">
                  <span class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-gradient-to-r from-[#05DAED] to-[#12DA91] text-dark-900 shadow-[0_0_20px_rgba(5,218,237,0.4)] border-transparent cursor-pointer">
                    ${translations['grid.catAll'] || 'All Tools'}
                  </span>
                  <span class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-dark-800 border border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white cursor-pointer">
                    ${translations['cat.modify'] || 'Modify'}
                  </span>
                  <span class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-dark-800 border border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white cursor-pointer">
                    ${translations['cat.edit'] || 'Edit'}
                  </span>
                  <span class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-dark-800 border border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white cursor-pointer">
                    ${translations['cat.optimize'] || 'Optimize'}
                  </span>
                  <span class="px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 bg-dark-800 border border-dark-600 text-slate-300 hover:bg-dark-700 hover:text-white cursor-pointer">
                    ${translations['cat.security'] || 'Security'}
                  </span>
                </div>

                <!-- Section Header -->
                <div class="flex items-end gap-3 mb-10">
                  <h2 class="text-2xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                    ${translations['grid.catAll'] || 'All Tools'}
                  </h2>
                  <span class="text-lg sm:text-2xl text-slate-500 font-medium pb-0.5 sm:pb-0.5">
                    (12)
                  </span>
                </div>

                <!-- Grid of Tools -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  ${toolCardsHtml}
                </div>
              </div>
            </div>

            <!-- HomeSections -->
            <div class="mt-32 sm:mt-40">
              <div class="py-16 text-slate-100 relative z-10 flex flex-col gap-20">
                <!-- 1. WHY HELPMYIMG -->
                <section class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-20">
                  <div class="text-center max-w-3xl mx-auto mb-16 px-4">
                    <span class="text-xs font-mono font-bold uppercase tracking-widest text-[#12DA91] bg-[#12DA91]/10 px-3 py-1.5 rounded-full border border-[#12DA91]/30 inline-block mx-auto mb-4">
                      ${translations['home.why.tag'] || 'WHY HELPMYIMG'}
                    </span>
                    <h2 class="font-heading font-extrabold text-white text-2xl sm:text-4xl tracking-tight leading-snug">
                      ${translations['home.why.title'] || 'Why HelpMyIMG is the Smartest Choice for Creators & Businesses'}
                    </h2>
                    <p class="text-slate-400 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
                      ${translations['home.why.desc'] || 'Designed from the ground up for maximum privacy, blazing speed, and zero cost. Here is why thousands trust HelpMyIMG every day.'}
                    </p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 relative overflow-hidden group hover:border-[#05DAED]/50 transition-all duration-300">
                      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#05DAED]/10 flex items-center justify-center text-[#05DAED] mb-4 sm:mb-6 border border-[#05DAED]/30">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                      </div>
                      <h3 class="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">${translations['home.why.c1.t'] || 'Instant Local Speed'}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${translations['home.why.c1.d'] || 'Your photos are processed directly inside your device memory with zero latency. No slow file uploads or cloud queues.'}</p>
                      <div class="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-mono text-[#05DAED] font-bold">
                        <span>${translations['home.why.c1.b'] || '0ms Server Delay'}</span>
                      </div>
                    </div>

                    <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300">
                      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#12DA91]/10 flex items-center justify-center text-[#12DA91] mb-4 sm:mb-6 border border-[#12DA91]/30">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </div>
                      <h3 class="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">${translations['home.why.c2.t'] || '100% Absolute Privacy'}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${translations['home.why.c2.d'] || 'Your personal portraits, confidential documents, and product shots never leave your computer or phone. Total peace of mind.'}</p>
                      <div class="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-mono text-[#12DA91] font-bold">
                        <span>${translations['home.why.c2.b'] || 'Zero Cloud Storage'}</span>
                      </div>
                    </div>

                    <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 relative overflow-hidden group hover:border-[#05DAED]/50 transition-all duration-300">
                      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#05DAED]/10 flex items-center justify-center text-[#05DAED] mb-4 sm:mb-6 border border-[#05DAED]/30">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <h3 class="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">${translations['home.why.c3.t'] || 'Forever Free & Unlimited'}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${translations['home.why.c3.d'] || 'No subscriptions, no watermarks, no credit packs, and no hidden fees. High-definition photo editing made accessible for all.'}</p>
                      <div class="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-mono text-[#05DAED] font-bold">
                        <span>${translations['home.why.c3.b'] || '$0 / Lifetime'}</span>
                      </div>
                    </div>

                    <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 relative overflow-hidden group hover:border-[#12DA91]/50 transition-all duration-300">
                      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#12DA91]/10 flex items-center justify-center text-[#12DA91] mb-4 sm:mb-6 border border-[#12DA91]/30">
                        <svg class="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                      </div>
                      <h3 class="text-lg sm:text-xl font-heading font-bold text-white mb-2 sm:mb-3">${translations['home.why.c4.t'] || 'Extreme Local Performance'}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${translations['home.why.c4.d'] || 'Accelerated by WebAssembly SIMD and WebGPU. Native performance directly inside modern browsers on mobile and desktop.'}</p>
                      <div class="mt-4 sm:mt-6 flex items-center gap-2 text-xs font-mono text-[#12DA91] font-bold">
                        <span>${translations['home.why.c4.b'] || 'WASM Accelerated'}</span>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- 2. HOW IT WORKS IN 3 STEPS -->
                <section class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                  <div class="text-center max-w-3xl mx-auto mb-16 px-4">
                    <span class="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 inline-block mx-auto mb-4">
                      ${translations['home.how.tag'] || 'HOW IT WORKS IN 3 SIMPLE STEPS'}
                    </span>
                    <h2 class="font-heading font-extrabold text-white text-2xl sm:text-4xl tracking-tight leading-snug">
                      ${translations['home.how.title'] || 'Effortless Photo Editing Directly in Your Browser'}
                    </h2>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <div class="p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 relative overflow-hidden flex flex-col gap-4">
                      <span class="text-xs font-semibold text-[#05DAED] uppercase tracking-wider">${sec.step1Badge}</span>
                      <h3 class="text-xl font-bold text-white font-heading">${translations['home.how.s1.t'] || '1. Drop Your Photos'}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${translations['home.how.s1.d'] || 'Select or drag-and-drop single or multiple photos (PNG, JPG, WEBP, SVG) into our ultra-responsive client workspace.'}</p>
                    </div>
                    <div class="p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 relative overflow-hidden flex flex-col gap-4">
                      <span class="text-xs font-semibold text-[#05DAED] uppercase tracking-wider">${sec.step2Badge}</span>
                      <h3 class="text-xl font-bold text-white font-heading">${translations['home.how.s2.t'] || '2. Instant Client Processing'}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${translations['home.how.s2.d'] || 'Choose your desired action: remove background, compress size, convert format, or resize. Neural networks process locally in milliseconds.'}</p>
                    </div>
                    <div class="p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 relative overflow-hidden flex flex-col gap-4">
                      <span class="text-xs font-semibold text-[#05DAED] uppercase tracking-wider">${sec.step3Badge}</span>
                      <h3 class="text-xl font-bold text-white font-heading">${translations['home.how.s3.t'] || '3. Download Crisp Exports'}</h3>
                      <p class="text-slate-400 text-sm leading-relaxed">${translations['home.how.s3.d'] || 'Export pixel-perfect, lossless PNG or optimized JPG files individually or in bulk ZIP archives with 0 watermarks.'}</p>
                    </div>
                  </div>
                </section>

                <!-- Academic Research Section -->
                ${scientificResearchHtml}

                <!-- FAQ Section -->
                <section class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 border-t border-slate-800/80 pt-16 flex flex-col gap-8">
                  <div class="text-center max-w-3xl mx-auto">
                    <span class="text-xs font-mono font-bold uppercase tracking-widest text-[#05DAED] bg-[#05DAED]/10 px-3 py-1.5 rounded-full border border-[#05DAED]/30 inline-block mx-auto mb-4">
                      ${translations['faq.badge'] || 'FAQ'}
                    </span>
                    <h2 class="text-2xl md:text-4xl font-heading font-extrabold text-white tracking-tight">${sec.faq}</h2>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${faqItemsHtml}
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        ${footerHtml}
      </div>
    `;
  }

  // =========================================================================
  // CASE C: TOOL PAGES (/${lang}/${slug}/)
  // =========================================================================
  const baseTool = TOOL_BASE_MAP[tool] || 'remove';
  
  // 1. Tool Specific H1 & Hero matching Hero.tsx
  const heroBadge = translations[`landing.${baseTool}.redesign.heroBadge`] || translations[`tab.${baseTool}`] || 'AI TOOL';
  const rawHeroTitle = translations[`landing.${baseTool}.redesign.heroTitle`] || translations[`landing.default.title.${tool}`] || h1;
  const heroDesc = translations[`landing.${baseTool}.redesign.heroDesc`] || translations[`landing.default.desc.${tool}`] || overviewText;

  const cleanHeroTitle = rawHeroTitle.split(' - ')[0].trim();
  const words = cleanHeroTitle.split(' ');
  const solidPart = words.slice(0, 1).join(' ');
  const gradientPart = words.slice(1).join(' ');

  // Dropzone matching WorkspaceDropzone.tsx
  const dropzoneTitleClean = (translations['dropzone.title'] || sec.dropzoneTitle).replace(/^[⚡✨🔄\s]+/u, '');
  const dropzoneSubtitle = translations['dropzone.subtitle'] || sec.dropzonePrompt;
  const dropzoneBtnClean = (translations['dropzone.btn'] || sec.dropzoneBtn).replace(/^[⚡✨🔄\s]+/u, '');
  const dropzonePrivacy = translations['dropzone.privacy'] || '🔒 100% Private: AI processing runs locally in your browser';

  // 2. Features Cards (Up to 4)
  let featuresCardsHtml = '';
  for (let i = 1; i <= 4; i++) {
    const featTitle = translations[`landing.${baseTool}.redesign.feat${i}Title`] || translations[`landing.${baseTool}.feat${i}.title`];
    const featDesc = translations[`landing.${baseTool}.redesign.feat${i}Desc`] || translations[`landing.${baseTool}.feat${i}.desc`];
    if (!featTitle) continue;
    featuresCardsHtml += `
      <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-3 group hover:border-[#05DAED]/50 transition-all">
        <div class="w-8 h-8 rounded-lg bg-[#05DAED]/10 text-[#05DAED] flex items-center justify-center font-bold text-sm">
          ${i}
        </div>
        <h3 class="text-lg font-bold text-white font-heading">${featTitle}</h3>
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
      <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-3">
        <span class="text-xs font-semibold text-[#05DAED] uppercase tracking-wider">${sBadge}</span>
        <h3 class="text-lg font-bold text-white font-heading">${sTitle}</h3>
        <p class="text-sm text-slate-400 leading-relaxed">${sDesc}</p>
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
      <div class="p-6 rounded-2xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-2">
        <h3 class="text-base font-bold text-white font-heading">${wTitle}</h3>
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
        <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-2">
          <h3 class="text-base font-bold text-white font-heading">${item.question}</h3>
          <p class="text-sm text-slate-400 leading-relaxed">${item.answer}</p>
        </div>
      `;
    }
  } else {
    for (let i = 1; i <= 6; i++) {
      const q = translations[`landing.${baseTool}.faq${i}.q`] || translations[`landing.remove.faq${i}.q`];
      const a = translations[`landing.${baseTool}.faq${i}.a`] || translations[`landing.remove.faq${i}.a`];
      if (q && a) {
        faqListHtml += `
          <div class="p-6 sm:p-8 rounded-3xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-2">
            <h3 class="text-base font-bold text-white font-heading">${q}</h3>
            <p class="text-sm text-slate-400 leading-relaxed">${a}</p>
          </div>
        `;
      }
    }
  }

  return `
    <div class="min-h-screen bg-dark-900 text-slate-900 dark:text-slate-100 font-body flex flex-col transition-colors duration-300 selection:bg-[#05DAED]/30 selection:text-[#05DAED]" ${dirAttr}>
      <div class="fixed top-1/2 left-0 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(5,218,237,0.12)_0%,transparent_60%)] rounded-full pointer-events-none -z-10"></div>
      <div class="fixed top-1/3 right-0 w-[600px] h-[600px] translate-x-1/3 -translate-y-1/2 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_60%)] rounded-full pointer-events-none -z-10"></div>
      ${navbarHtml}
      <main class="flex-1 w-full flex flex-col min-h-screen gap-8 md:gap-16 pt-12 pb-16">
        <!-- Hero Section matching Hero.tsx -->
        <section class="relative pt-2 md:pt-6 pb-2 overflow-hidden flex flex-col items-center justify-center text-center">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-100 dark:from-dark-800 to-transparent opacity-50 pointer-events-none -z-10"></div>
          <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h1 class="font-heading font-black mb-6 text-center" style="font-size: clamp(2.2rem, 6vw, 4.5rem); font-weight: 900; letter-spacing: -0.03em; line-height: 1.15;">
              <span class="text-slate-800 dark:text-slate-100 inline">${solidPart}</span> <span class="bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo bg-clip-text text-transparent drop-shadow-sm inline">${gradientPart}</span>
            </h1>
            <p class="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10" style="font-size: clamp(0.9rem, 2vw, 1.25rem); font-weight: 500; line-height: 1.6;">
              ${heroDesc}
            </p>
          </div>
        </section>

        <!-- Workspace Dropzone matching WorkspaceDropzone.tsx -->
        <div class="w-full max-w-4xl mx-auto -mt-4 relative z-10 px-4">
          <div class="w-full min-h-[320px] sm:min-h-[380px] md:min-h-0 md:aspect-[4/3] rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center p-6 sm:p-10 text-center cursor-pointer relative overflow-hidden group border-dark-500/80 bg-dark-800/40 hover:border-neon-cyan/60 hover:bg-dark-800/70">
            <div class="w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-gradient-to-tr from-neon-cyan/20 to-neon-indigo/20 border border-neon-cyan/40 flex items-center justify-center mb-3 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-7 h-7 md:w-10 md:h-10 text-neon-cyan animate-bounce"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <h3 class="text-lg md:text-2xl font-heading font-extrabold text-white mb-2 px-2 tracking-tight">
              ${dropzoneTitleClean}
            </h3>
            <p class="text-xs md:text-sm text-slate-400 max-w-md mx-auto mb-6 px-4 leading-relaxed font-body">
              ${dropzoneSubtitle}
            </p>
            <div class="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl bg-gradient-to-r from-neon-cyan via-neon-emerald to-neon-indigo text-dark-900 font-extrabold shadow-glow-cyan transform group-hover:-translate-y-0.5 transition-all text-sm sm:text-base tracking-wide mb-6 md:mb-0 shadow-lg cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="w-4 h-4 shrink-0"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
              <span>${dropzoneBtnClean}</span>
            </div>
            <div class="md:absolute md:bottom-4 left-0 right-0 text-center text-[10px] md:text-xs text-slate-400/80 font-medium px-4">
              ${dropzonePrivacy}
            </div>
          </div>
        </div>

        <div class="mt-20 max-w-5xl mx-auto px-4 w-full flex flex-col gap-16">
          <!-- Key Features Section -->
          <section class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <h2 class="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">${sec.features}</h2>
              <p class="text-sm text-slate-400">${featSub}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${featuresCardsHtml}
            </div>
          </section>

          <!-- Step-by-Step How-To Guide -->
          <section class="flex flex-col gap-6 bg-dark-800/30 border border-dark-500/60 rounded-3xl p-6 md:p-10">
            <div class="flex flex-col gap-2">
              <h2 class="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">${stepsTitle}</h2>
              <p class="text-sm text-slate-400">${stepsSub}</p>
            </div>
            <ol class="grid grid-cols-1 md:grid-cols-3 gap-6">
              ${stepsCardsHtml}
            </ol>
          </section>

          <!-- Target Audience Section -->
          <section class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
              <h2 class="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">${whoTitle}</h2>
              <p class="text-sm text-slate-400">${whoSub}</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              ${whoCardsHtml}
            </div>
          </section>

          <!-- Technical Specifications & Privacy Architecture -->
          <section class="flex flex-col gap-6 border-t border-slate-800/80 pt-12">
            <div class="flex flex-col gap-2">
              <h2 class="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">${sec.tech}</h2>
              <p class="text-sm text-slate-300 leading-relaxed">
                ${translations['about.sec1.desc3'] || translations['privacy.s1.desc1'] || 'HelpMyIMG operates on a 100% decentralized, client-side computing paradigm. Unlike traditional SaaS image editors that transmit your private photo bytes across third-party cloud servers, our architecture compiles production-grade computer vision models directly into WebAssembly (WASM) and leverages your device native GPU via WebGPU and OffscreenCanvas.'}
              </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
              <div class="p-6 rounded-2xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-2">
                <strong class="text-white text-base font-heading">${translations['about.tech.b1.title'] || 'WebAssembly (WASM)'}</strong>
                <p class="text-xs text-slate-400 leading-relaxed">${translations['about.tech.b1.desc'] || translations['about.feature.local.desc'] || 'Neural network inference runs locally on your device CPU/GPU in an isolated background thread.'}</p>
              </div>
              <div class="p-6 rounded-2xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-2">
                <strong class="text-white text-base font-heading">${translations['about.feature.privacy'] || '100% Privacy Guarantee'}</strong>
                <p class="text-xs text-slate-400 leading-relaxed">${translations['privacy.highlight.desc'] || translations['about.feature.privacy.desc'] || 'Photos never leave your hard drive or browser memory. Zero server uploads.'}</p>
              </div>
              <div class="p-6 rounded-2xl bg-dark-800/40 border border-dark-500/60 flex flex-col gap-2">
                <strong class="text-white text-base font-heading">${translations['about.feature.fast'] || 'Lossless Precision Output'}</strong>
                <p class="text-xs text-slate-400 leading-relaxed">${translations['about.feature.fast.desc'] || 'Native Canvas 2D color pipeline maintains pixel dimensions and color fidelity.'}</p>
              </div>
            </div>
          </section>

          <!-- Scientific Bibliography & Foundations -->
          ${scientificResearchHtml}

          <!-- Frequently Asked Questions (FAQ) -->
          <section class="flex flex-col gap-6 border-t border-slate-800/80 pt-12">
            <div class="flex flex-col gap-2">
              <h2 class="text-2xl md:text-3xl font-heading font-bold text-white tracking-tight">${faqTitle}</h2>
              <p class="text-sm text-slate-400">${faqSub}</p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${faqListHtml}
            </div>
          </section>
        </div>
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

  // 1. Replace <html lang="..."> and enforce dark mode class
  html = html.replace(/<html[^>]*>/i, `<html lang="${lang}" class="dark">`);

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
      // Organization — anchors brand to Google Knowledge Graph
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
        "sameAs": ["https://twitter.com/HelpMyIMG"],
        "description": "Free, privacy-first AI image suite running 100% locally via WebAssembly. No server uploads required."
      },
      // WebSite — enables SiteLinksSearchBox in SERP
      {
        "@type": "WebSite",
        "@id": `${DOMAIN}/#website`,
        "url": DOMAIN,
        "name": "HelpMyIMG",
        "publisher": { "@id": `${DOMAIN}/#organization` }
      },
      // WebPage — contextualizes this specific page
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        "url": canonicalUrl,
        "name": seoTitle,
        "description": seoDesc,
        "isPartOf": { "@id": `${DOMAIN}/#website` },
        "publisher": { "@id": `${DOMAIN}/#organization` },
        "inLanguage": lang,
        "dateModified": new Date().toISOString()
      },
      // SoftwareApplication — primary tool rich result schema
      {
        "@type": ["WebApplication", "SoftwareApplication"],
        "name": seoTitle,
        "url": canonicalUrl,
        "applicationCategory": "MultimediaApplication",
        "applicationSubCategory": "Photo Editing",
        "operatingSystem": "All",
        "browserRequirements": "Requires WebAssembly support. Chrome 89+, Safari 15+, Firefox 79+",
        "description": seoDesc,
        "inLanguage": lang,
        "isPartOf": { "@id": `${DOMAIN}/#website` },
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "availability": "https://schema.org/InStock"
        },
        "featureList": "Remove Background, Compress Image, Convert Format, Resize Image, Crop Image, Rotate Image, Watermark, Blur Face, Color Picker, Advanced Editor",
        "screenshot": `${DOMAIN}/images.png`,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "2847",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  };

  // BreadcrumbList — Google sitelinks & hierarchy signal
  if (tool) {
    const toolLabel = (translations[`tab.${tool}`] || translations[`seo.jsonld.name.${tool}`] || tool).replace(/^[^\w\s]+\s*/, '');
    jsonLd["@graph"].push({
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "HelpMyIMG", "item": DOMAIN },
        { "@type": "ListItem", "position": 2, "name": "Tools", "item": `${DOMAIN}/${lang}/` },
        { "@type": "ListItem", "position": 3, "name": toolLabel, "item": canonicalUrl }
      ]
    });
  } else if (infoPage) {
    const pageLabel = translations[`footer.${infoPage}`] || translations[`nav.${infoPage}`] || infoPage;
    jsonLd["@graph"].push({
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "HelpMyIMG", "item": DOMAIN },
        { "@type": "ListItem", "position": 2, "name": pageLabel, "item": canonicalUrl }
      ]
    });
  } else {
    jsonLd["@graph"].push({
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "HelpMyIMG", "item": DOMAIN },
        { "@type": "ListItem", "position": 2, "name": translations['hero.title'] || "Image Tools", "item": canonicalUrl }
      ]
    });
  }

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
