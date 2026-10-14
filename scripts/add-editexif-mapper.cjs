const fs = require('fs');
let code = fs.readFileSync('src/utils/urlMapper.ts', 'utf8');

// 1. Update InternalTool type
code = code.replace(
  "| 'metadata';",
  "| 'metadata' | 'editexif';"
);

// 2. Update FALLBACK_SLUGS
code = code.replace(
  "metadata: 'ai-metadata-cleaner'",
  "metadata: 'ai-metadata-cleaner',\n  editexif: 'edit-exif'"
);

// 3. Slugs for editexif
const editExifSlugs = {
  ar: 'tadil-bayanat-exif',
  bg: 'redaktirane-na-exif',
  cs: 'upravit-exif',
  da: 'rediger-exif',
  de: 'exif-daten-bearbeiten',
  el: 'epexergasia-exif',
  en: 'edit-exif',
  es: 'editar-exif-foto',
  fi: 'muokkaa-exif',
  fr: 'modifier-exif-photo',
  he: 'arichat-exif',
  hi: 'exif-sampadan',
  hu: 'exif-szerkesztes',
  id: 'edit-exif-foto',
  it: 'modifica-exif-foto',
  ja: 'exif-hensyuu',
  ko: 'exif-pyeonjib',
  ms: 'edit-exif-foto',
  nl: 'exif-bewerken',
  no: 'rediger-exif',
  pl: 'edytuj-exif',
  pt: 'editar-exif-foto',
  ro: 'editare-exif',
  ru: 'redaktirovat-exif-foto',
  sv: 'redigera-exif',
  th: 'kae-khai-exif',
  tl: 'baguhin-ang-exif',
  tr: 'exif-duzenle',
  uk: 'redahuvaty-exif',
  vi: 'chinh-sua-exif',
  zh: 'bianji-exif-yuanshuju'
};

for (const [lang, slug] of Object.entries(editExifSlugs)) {
  const targetRegex = new RegExp('(\\b' + lang + ':\\s*\\{[^\\}]+)(\\})');
  code = code.replace(targetRegex, (m, p1, p2) => {
    if (p1.includes('editexif:')) return m;
    return p1.trim() + `, editexif: '${slug}' ` + p2;
  });
}

// 4. Update getToolFromSlug
if (!code.includes("slug === 'edit-exif'")) {
  code = code.replace(
    "if (slug === 'ai-metadata-cleaner' || slug === 'c2pa-remover' || slug === 'metadata-cleaner') return 'metadata';",
    "if (slug === 'ai-metadata-cleaner' || slug === 'c2pa-remover' || slug === 'metadata-cleaner') return 'metadata';\n  if (slug === 'edit-exif' || slug === 'edit-exif-foto' || slug === 'camera-metadata') return 'editexif';"
  );
}

fs.writeFileSync('src/utils/urlMapper.ts', code, 'utf8');
console.log('Successfully added editexif to src/utils/urlMapper.ts!');
