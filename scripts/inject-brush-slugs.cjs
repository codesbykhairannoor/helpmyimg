const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'utils', 'urlMapper.ts');
let content = fs.readFileSync(filePath, 'utf8');

const brushSlugs = {
  ar: 'furshat-sihriya',
  bg: 'magicheska-chetka',
  cs: 'kouzelny-stetec',
  da: 'magisk-pensel',
  de: 'magischer-pinsel',
  el: 'magiko-pinelo',
  en: 'magic-brush',
  es: 'pincel-magico',
  fi: 'taikasivellin',
  fr: 'pinceau-magique',
  he: 'mivreshet-kesem',
  hi: 'magic-brush',
  hu: 'varazsecset',
  id: 'kuas-ajaib',
  it: 'pennello-magico',
  ja: 'majikku-burashi',
  ko: 'maejik-beureosi',
  ms: 'berus-ajaib',
  nl: 'magisch-penseel',
  no: 'magisk-pensel',
  pl: 'magiczny-pedzel',
  pt: 'pincel-magico',
  ro: 'pensula-magica',
  ru: 'volshebnaya-kist',
  sv: 'magisk-pensel',
  th: 'paeng-wises',
  tl: 'magic-brush',
  tr: 'sihirli-firca',
  uk: 'charivnyy-penzel',
  vi: 'co-ma-thuat',
  zh: 'moshu-huabi'
};

content = content.replace(/([a-z]{2}):\s*{([^}]+)}/g, (match, lang, toolsStr) => {
  if (toolsStr.includes('brush:')) {
    return match; // already injected
  }
  const slug = brushSlugs[lang];
  if (slug) {
    return `${lang}: { ${toolsStr.trim()}, brush: '${slug}' }`;
  }
  return match;
});

// Also remove the "if (slug === 'magic-brush') return 'brush';" lines and "currently unlocalized" comments
content = content.replace(/if\s*\(\s*slug\s*===\s*'magic-brush'\s*\)\s*return\s*'brush';\s*\n?/g, '');
content = content.replace(/if\s*\(\s*tool\s*===\s*'brush'\s*\)\s*return\s*'magic-brush';\s*\/\/\s*currently unlocalized\s*\n?/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected brush URL slugs into urlMapper.ts');
