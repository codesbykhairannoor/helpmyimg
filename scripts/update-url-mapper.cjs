const fs = require('fs');
let code = fs.readFileSync('src/utils/urlMapper.ts', 'utf8');

const metadataSlugs = {
  ar: 'tandhif-bayanat-wasf-ai',
  bg: 'izchistvane-na-ai-metadanni',
  cs: 'vycistit-ai-metadata',
  da: 'fjern-ai-metadata',
  de: 'ki-metadaten-bereinigen',
  el: 'katharismos-metadedomenon-ai',
  en: 'ai-metadata-cleaner',
  es: 'limpiador-metadatos-ia',
  fi: 'poista-tekoaly-metadata',
  fr: 'nettoyeur-metadonnees-ia',
  he: 'nikui-metadata-ai',
  hi: 'ai-metadata-safai',
  hu: 'ai-metaadat-eltavolitas',
  id: 'pembersih-metadata-ai',
  it: 'pulitore-metadati-ia',
  ja: 'ai-metadeta-sakujo',
  ko: 'ai-metadeiteo-jegeo',
  ms: 'pembersih-metadata-ai',
  nl: 'ai-metadata-verwijderen',
  no: 'fjern-ai-metadata',
  pl: 'czyszczenie-metadanych-ai',
  pt: 'limpador-metadados-ia',
  ro: 'curatare-metadate-ai',
  ru: 'ochistka-metadannykh-ii',
  sv: 'rensa-ai-metadata',
  th: 'lop-khomun-metadeta-ai',
  tl: 'tagalinis-metadata-ng-ai',
  tr: 'yapay-zeka-metaveri-temizleyici',
  uk: 'ochyshchennya-metadanykh-shi',
  vi: 'xoa-metadata-ai',
  zh: 'ai-yuanshuju-qingli'
};

for (const [lang, slug] of Object.entries(metadataSlugs)) {
  const targetRegex = new RegExp('(\\b' + lang + ':\\s*\\{[^\\}]+)(\\})');
  code = code.replace(targetRegex, (m, p1, p2) => {
    if (p1.includes('metadata:')) return m;
    return p1.trim() + `, metadata: '${slug}' ` + p2;
  });
}

// Add fallback to getToolFromSlug
if (!code.includes("slug === 'ai-metadata-cleaner'")) {
  code = code.replace(
    "if (slug === 'advanced-editor') return 'design';",
    "if (slug === 'advanced-editor') return 'design';\n  if (slug === 'ai-metadata-cleaner' || slug === 'c2pa-remover' || slug === 'metadata-cleaner') return 'metadata';"
  );
}

fs.writeFileSync('src/utils/urlMapper.ts', code, 'utf8');
console.log('Successfully updated src/utils/urlMapper.ts with metadata slugs!');
