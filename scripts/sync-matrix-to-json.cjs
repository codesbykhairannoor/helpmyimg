const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');
const match = content.match(/export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not parse matrix");
  process.exit(1);
}

const matrix = eval(match[1]); // It's pure JS object literal now

const localesDir = path.resolve('public/locales');
const langs = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

for (const lang of langs) {
  const jsonPath = path.join(localesDir, lang, 'translation.json');
  if (!fs.existsSync(jsonPath)) continue;
  
  const translations = require(jsonPath);
  
  // Find all configs for this language
  const configs = matrix.filter(c => c.lang === lang || (lang === 'zh' && c.lang === 'zh-CN'));
  
  for (const config of configs) {
    if (config.title) {
      translations[`seo.title.${config.tool}`] = config.title;
    }
  }
  
  fs.writeFileSync(jsonPath, JSON.stringify(translations, null, 2));
}

console.log("Successfully synced matrix titles to translation.json!");
