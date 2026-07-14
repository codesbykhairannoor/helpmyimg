const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

const translations = {
  id: {
    "nav.selectLang": "Pilih Bahasa / Language (30)",
    "nav.searchLang": "🔍 Cari bahasa (mis., Korea, RU, 🇮🇩)...",
    "nav.noLang": "Bahasa tidak ditemukan",
    "landing.default.title.home": "Semua Alat AI untuk Edit Gambar Massal",
    "landing.default.desc.home": "Editor foto AI lokal 100% gratis selamanya! Privasi penuh, dijalankan langsung di browser Anda tanpa server cloud."
  },
  en: {
    "nav.selectLang": "Select Language / Locale (30)",
    "nav.searchLang": "🔍 Search locale (e.g., Korea, ES, RU)...",
    "nav.noLang": "No locale found",
    "landing.default.title.home": "Every AI tool you need to edit images in bulk",
    "landing.default.desc.home": "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser."
  },
  es: {
    "nav.selectLang": "Seleccionar idioma / región (30)",
    "nav.searchLang": "🔍 Buscar idioma (ej., Corea, ES, RU)...",
    "nav.noLang": "No se encontró el idioma",
    "landing.default.title.home": "Todas las herramientas IA para editar imágenes en masa",
    "landing.default.desc.home": "¡Tu editor de fotos IA local es gratis para siempre! 100% privado, funciona directamente en tu navegador."
  },
  fr: {
    "nav.selectLang": "Sélectionner la langue / région (30)",
    "nav.searchLang": "🔍 Rechercher une langue (ex., Corée, ES, RU)...",
    "nav.noLang": "Aucune langue trouvée",
    "landing.default.title.home": "Tous les outils IA pour éditer des images en lot",
    "landing.default.desc.home": "Votre éditeur de photos IA local est gratuit à vie ! 100 % privé, s'exécute directement dans votre navigateur."
  },
  de: {
    "nav.selectLang": "Sprache / Region auswählen (30)",
    "nav.searchLang": "🔍 Sprache suchen (z.B. Korea, ES, RU)...",
    "nav.noLang": "Keine Sprache gefunden",
    "landing.default.title.home": "Alle KI-Tools für die Massen-Bildbearbeitung",
    "landing.default.desc.home": "Ihr lokaler KI-Fotoeditor ist für immer kostenlos! 100% privat, läuft direkt in Ihrem Browser."
  },
  ja: {
    "nav.selectLang": "言語/地域を選択 (30)",
    "nav.searchLang": "🔍 言語を検索 (例: 韓国, ES, RU)...",
    "nav.noLang": "言語が見つかりません",
    "landing.default.title.home": "画像の一括編集に必要なすべてのAIツール",
    "landing.default.desc.home": "ローカルAIフォトエディターは永久に無料です！100％プライベートで、ブラウザ上で直接実行されます。"
  },
  ko: {
    "nav.selectLang": "언어 / 지역 선택 (30)",
    "nav.searchLang": "🔍 언어 검색 (예: 한국, ES, RU)...",
    "nav.noLang": "언어를 찾을 수 없습니다",
    "landing.default.title.home": "대량 이미지 편집을 위한 모든 AI 도구",
    "landing.default.desc.home": "로컬 AI 사진 편집기를 영구 무료로 사용하세요! 100% 개인정보 보호, 브라우저에서 직접 실행됩니다."
  },
  zh: {
    "nav.selectLang": "选择语言 / 地区 (30)",
    "nav.searchLang": "🔍 搜索语言 (例如: 韩国, ES, RU)...",
    "nav.noLang": "未找到语言",
    "landing.default.title.home": "批量处理所需的所有 AI 图像工具",
    "landing.default.desc.home": "您的本地 AI 照片编辑器永久免费！100% 隐私安全，直接在浏览器中运行。"
  },
  ru: {
    "nav.selectLang": "Выберите язык / регион (30)",
    "nav.searchLang": "🔍 Поиск языка (например, Корея, ES, RU)...",
    "nav.noLang": "Язык не найден",
    "landing.default.title.home": "Все ИИ-инструменты для массовой обработки изображений",
    "landing.default.desc.home": "Ваш локальный ИИ-редактор фотографий навсегда бесплатен! 100% конфиденциально, работает прямо в браузере."
  },
  pt: {
    "nav.selectLang": "Selecionar idioma / localidade (30)",
    "nav.searchLang": "🔍 Buscar idioma (ex., Coreia, ES, RU)...",
    "nav.noLang": "Nenhum idioma encontrado",
    "landing.default.title.home": "Todas as ferramentas de IA para editar imagens em massa",
    "landing.default.desc.home": "Seu editor de fotos IA local é gratuito para sempre! 100% privado, roda diretamente no seu navegador."
  },
  ar: {
    "nav.selectLang": "اختر اللغة / المنطقة (30)",
    "nav.searchLang": "🔍 ابحث عن اللغة (مثل كوريا، ES، RU)...",
    "nav.noLang": "لم يتم العثور على لغة",
    "landing.default.title.home": "كل أدوات الذكاء الاصطناعي التي تحتاجها لتحرير الصور دفعة واحدة",
    "landing.default.desc.home": "محرر الصور المحلي بالذكاء الاصطناعي مجاني للأبد! خصوصية 100%، يعمل مباشرة في متصفحك."
  },
  hi: {
    "nav.selectLang": "भाषा / क्षेत्र चुनें (30)",
    "nav.searchLang": "🔍 भाषा खोजें (जैसे, कोरिया, ES, RU)...",
    "nav.noLang": "कोई भाषा नहीं मिली",
    "landing.default.title.home": "बल्क में इमेज एडिट करने के लिए सभी AI टूल्स",
    "landing.default.desc.home": "आपका लोकल AI फोटो एडिटर हमेशा के लिए मुफ्त है! 100% प्राइवेट, सीधे आपके ब्राउज़र में चलता है।"
  },
  vi: {
    "nav.selectLang": "Chọn ngôn ngữ / khu vực (30)",
    "nav.searchLang": "🔍 Tìm kiếm ngôn ngữ (ví dụ: Hàn Quốc, ES, RU)...",
    "nav.noLang": "Không tìm thấy ngôn ngữ",
    "landing.default.title.home": "Tất cả công cụ AI cần thiết để chỉnh sửa ảnh hàng loạt",
    "landing.default.desc.home": "Trình chỉnh sửa ảnh AI cục bộ của bạn hoàn toàn miễn phí mãi mãi! 100% riêng tư, chạy trực tiếp trong trình duyệt."
  },
  th: {
    "nav.selectLang": "เลือกภาษา / ภูมิภาค (30)",
    "nav.searchLang": "🔍 ค้นหาภาษา (เช่น เกาหลี, ES, RU)...",
    "nav.noLang": "ไม่พบภาษา",
    "landing.default.title.home": "เครื่องมือ AI ทั้งหมดที่คุณต้องการสำหรับการแก้ไขรูปภาพเป็นชุด",
    "landing.default.desc.home": "โปรแกรมแก้ไขรูปภาพ AI ในเครื่องของคุณใช้ฟรีตลอดไป! เป็นส่วนตัว 100% ทำงานโดยตรงบนเบราว์เซอร์ของคุณ"
  },
  it: {
    "nav.selectLang": "Seleziona lingua / regione (30)",
    "nav.searchLang": "🔍 Cerca lingua (es. Corea, ES, RU)...",
    "nav.noLang": "Nessuna lingua trovata",
    "landing.default.title.home": "Tutti gli strumenti IA per modificare immagini in blocco",
    "landing.default.desc.home": "Il tuo editor di foto IA locale è gratis per sempre! 100% privato, funziona direttamente nel tuo browser."
  },
  tr: {
    "nav.selectLang": "Dil / Bölge Seçin (30)",
    "nav.searchLang": "🔍 Dil ara (örn., Kore, ES, RU)...",
    "nav.noLang": "Dil bulunamadı",
    "landing.default.title.home": "Toplu fotoğraf düzenlemek için ihtiyacınız olan tüm yapay zeka araçları",
    "landing.default.desc.home": "Yerel yapay zeka fotoğraf editörünüz sonsuza kadar ücretsiz! %100 gizli, doğrudan tarayıcınızda çalışır."
  },
  nl: {
    "nav.selectLang": "Selecteer taal / regio (30)",
    "nav.searchLang": "🔍 Zoek taal (bijv. Korea, ES, RU)...",
    "nav.noLang": "Geen taal gevonden",
    "landing.default.title.home": "Alle AI-tools die u nodig heeft voor bulk-afbeeldingbewerking",
    "landing.default.desc.home": "Uw lokale AI-foto-editor is altijd gratis! 100% privé, draait rechtstreeks in uw browser."
  },
  pl: {
    "nav.selectLang": "Wybierz język / region (30)",
    "nav.searchLang": "🔍 Szukaj języka (np. Korea, ES, RU)...",
    "nav.noLang": "Nie znaleziono języka",
    "landing.default.title.home": "Wszystkie narzędzia AI do masowej edycji zdjęć",
    "landing.default.desc.home": "Twój lokalny edytor zdjęć AI jest darmowy na zawsze! 100% prywatności, działa bezpośrednio w Twojej przeglądarce."
  },
  uk: {
    "nav.selectLang": "Оберіть мову / регіон (30)",
    "nav.searchLang": "🔍 Пошук мови (наприклад, Корея, ES, RU)...",
    "nav.noLang": "Мову не знайдено",
    "landing.default.title.home": "Усі ШІ-інструменти для масової обробки зображень",
    "landing.default.desc.home": "Ваш локальний ШІ-редактор фотографій назавжди безкоштовний! 100% конфіденційно, працює прямо у вашому браузері."
  },
  tl: {
    "nav.selectLang": "Pumili ng Wika / Locale (30)",
    "nav.searchLang": "🔍 Maghanap ng wika (hal., Korea, ES, RU)...",
    "nav.noLang": "Walang nahanap na wika",
    "landing.default.title.home": "Lahat ng AI tool para sa maramihang pag-edit ng larawan",
    "landing.default.desc.home": "Ang iyong lokal na AI photo editor ay libre magpakailanman! 100% pribado, gumagana nang direkta sa iyong browser."
  },
  ms: {
    "nav.selectLang": "Pilih Bahasa / Lokasi (30)",
    "nav.searchLang": "🔍 Cari bahasa (cth., Korea, ES, RU)...",
    "nav.noLang": "Bahasa tidak dijumpai",
    "landing.default.title.home": "Semua alat AI yang anda perlukan untuk mengedit gambar secara pukal",
    "landing.default.desc.home": "Penyunting foto AI tempatan anda percuma selamanya! 100% peribadi, berjalan terus di dalam pelayar anda."
  }
};

const dirs = fs.readdirSync(localesDir);
let count = 0;

for (const dir of dirs) {
  const filePath = path.join(localesDir, dir, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const trans = translations[dir] || translations.en;
      let modified = false;
      for (const [k, v] of Object.entries(trans)) {
        if (!content[k] || content[k] === k) {
          content[k] = v;
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2), 'utf8');
        count++;
      }
    } catch (err) {
      console.error(`Error processing ${dir}:`, err);
    }
  }
}

console.log(`Updated missing translations for ${count} language files.`);
