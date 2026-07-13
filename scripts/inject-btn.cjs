const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const translations = {
  ar: { download: "تحميل", reset: "إعادة ضبط", processing: "جاري المعالجة..." },
  bg: { download: "Изтегляне", reset: "Нулиране", processing: "Обработка..." },
  ca: { download: "Descarregar", reset: "Restablir", processing: "Processant..." },
  "zh-cn": { download: "下载", reset: "重置", processing: "处理中..." },
  "zh-tw": { download: "下載", reset: "重置", processing: "處理中..." },
  hr: { download: "Preuzmi", reset: "Poništi", processing: "Obrada..." },
  cs: { download: "Stáhnout", reset: "Obnovit", processing: "Zpracování..." },
  da: { download: "Hent", reset: "Nulstil", processing: "Behandler..." },
  nl: { download: "Downloaden", reset: "Resetten", processing: "Verwerken..." },
  en: { download: "Download", reset: "Reset", processing: "Processing..." },
  fi: { download: "Ladata", reset: "Palauta", processing: "Käsitellään..." },
  fr: { download: "Télécharger", reset: "Réinitialiser", processing: "Traitement..." },
  de: { download: "Herunterladen", reset: "Zurücksetzen", processing: "Verarbeitung..." },
  el: { download: "Λήψη", reset: "Επαναφορά", processing: "Επεξεργασία..." },
  hi: { download: "डाउनलोड", reset: "रीसेट", processing: "प्रसंस्करण..." },
  id: { download: "Unduh", reset: "Ulangi", processing: "Memproses..." },
  it: { download: "Scarica", reset: "Ripristina", processing: "Elaborazione..." },
  ja: { download: "ダウンロード", reset: "リセット", processing: "処理中..." },
  ko: { download: "다운로드", reset: "초기화", processing: "처리 중..." },
  ms: { download: "Muat Turun", reset: "Semula", processing: "Memproses..." },
  no: { download: "nedlasting", reset: "Nullstille", processing: "Behandler..." },
  pl: { download: "Pobierz", reset: "Reset", processing: "Przetwarzanie..." },
  pt: { download: "Baixar", reset: "Redefinir", processing: "Processando..." },
  ro: { download: "Descarcare", reset: "Reset", processing: "Prelucrare..." },
  ru: { download: "Скачать", reset: "Сброс", processing: "Обработка..." },
  es: { download: "Descargar", reset: "Reiniciar", processing: "Procesando..." },
  sv: { download: "Ladda ner", reset: "Återställa", processing: "Bearbetar..." },
  th: { download: "ดาวน์โหลด", reset: "รีเซ็ต", processing: "กำลังประมวลผล..." },
  tr: { download: "İndir", reset: "Sıfırla", processing: "İşleniyor..." },
  vi: { download: "Tải xuống", reset: "Làm lại", processing: "Đang xử lý..." },
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Add keys
    const tr = translations[lang] || translations.en;
    data['btn.download'] = tr.download;
    data['btn.reset'] = tr.reset;
    data['btn.processing'] = tr.processing;
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}`);
  }
});
