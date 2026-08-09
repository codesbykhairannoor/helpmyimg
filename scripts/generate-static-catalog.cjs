const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const outputFile = path.join(__dirname, '../src/i18n/staticCatalog.ts');

if (!fs.existsSync(localesDir)) {
  console.error(`Locales directory not found at ${localesDir}`);
  process.exit(1);
}

const languages = fs.readdirSync(localesDir).filter(dir => {
  return fs.statSync(path.join(localesDir, dir)).isDirectory();
});

const catalog = {};

languages.forEach(lang => {
  const jsonPath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(jsonPath)) {
    const rawData = fs.readFileSync(jsonPath, 'utf8');
    try {
      catalog[lang] = JSON.parse(rawData);
    } catch (e) {
      console.error(`Error parsing JSON for language ${lang}:`, e);
    }
  }
});

const tsContent = `// AUTO-GENERATED STATIC TRANSLATION CATALOG
// Do not edit manually. Run scripts/generate-static-catalog.js to update.

export const staticCatalog: Record<string, any> = ${JSON.stringify(catalog, null, 2)};
`;

fs.writeFileSync(outputFile, tsContent, 'utf8');
console.log(`Successfully generated static catalog at ${outputFile} for ${languages.length} languages.`);
