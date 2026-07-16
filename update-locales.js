import fs from 'fs';
import path from 'path';

const translations = {
  ar: "لا يمكن أن يكون اسم الملف فارغًا!",
  cs: "Název souboru nesmí být prázdný!",
  da: "Filnavnet kan ikke være tomt!",
  de: "Dateiname darf nicht leer sein!",
  el: "Το όνομα αρχείου δεν μπορεί να είναι κενό!",
  en: "File name cannot be empty!",
  es: "¡El nombre del archivo no puede estar vacío!",
  fi: "Tiedoston nimi ei voi olla tyhjä!",
  fr: "Le nom du fichier ne peut pas être vide !",
  he: "שם הקובץ לא יכול להיות ריק!",
  hi: "फ़ाइल का नाम खाली नहीं हो सकता!",
  hu: "A fájlnév nem lehet üres!",
  id: "Nama file tidak boleh kosong!",
  it: "Il nome del file non può essere vuoto!",
  ja: "ファイル名を空にはできません！",
  ko: "파일 이름은 비워둘 수 없습니다!",
  ms: "Nama fail tidak boleh kosong!",
  nl: "Bestandsnaam mag niet leeg zijn!",
  no: "Filnavn kan ikke være tomt!",
  pl: "Nazwa pliku nie może być pusta!",
  pt: "O nome do arquivo não pode estar vazio!",
  ro: "Numele fișierului nu poate fi gol!",
  ru: "Имя файла не может быть пустым!",
  sv: "Filnamnet kan inte vara tomt!",
  th: "ชื่อไฟล์ต้องไม่เว้นว่าง!",
  tl: "Hindi maaaring walang laman ang pangalan ng file!",
  tr: "Dosya adı boş olamaz!",
  uk: "Ім'я файлу не може бути порожнім!",
  vi: "Tên tệp không được để trống!",
  zh: "文件名不能为空！"
};

const localesDir = path.join(process.cwd(), 'public', 'locales');
const langs = fs.readdirSync(localesDir);

for (const lang of langs) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!data.work) {
      data.work = {};
    }
    
    data.work.emptyFileNameAlert = translations[lang] || translations['en'];
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Updated ${lang}`);
  }
}
