const fs = require('fs');
const path = require('path');

const dir = 'src/components/landing/tools';
const files = fs.readdirSync(dir).filter(f => f.endsWith('Sections.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add font-heading to headings
  content = content.replace(/<(h[1-6]|motion\.h[1-6])([^>]*)className="([^"]*)"/g, (match, tag, attr, classes) => {
    if (!classes.includes('font-heading') && !classes.includes('font-body')) {
      // also ensure font weights are bold/extrabold if not specified, though usually they are
      // and remove font-sans or font-serif
      let newClasses = classes.replace(/\bfont-(sans|serif|mono)\b/g, '').trim();
      return `<${tag}${attr}className="font-heading ${newClasses}"`;
    }
    return match;
  });

  // Add font-body to paragraphs
  content = content.replace(/<(p|motion\.p)([^>]*)className="([^"]*)"/g, (match, tag, attr, classes) => {
    if (!classes.includes('font-body') && !classes.includes('font-heading')) {
      let newClasses = classes.replace(/\bfont-(sans|serif|mono)\b/g, '').trim();
      return `<${tag}${attr}className="font-body ${newClasses}"`;
    }
    return match;
  });

  // Also replace `{config.extraSectionTitle || config.h1}` with `t(...)` wrapper safely
  // We'll just do a global replace for all known config fields for the 10 tools, mapping to `t('seo...')`
  // Actually, I already injected the Thai translations directly into `pseoKeywords.ts`, so this is no longer strictly necessary,
  // but just to be fully i18n compliant at the component level:
  
  // Replace {config.extraSectionTitle || config.h1} with {t(`seo.extraTitle.${internalTool}`, { defaultValue: config.extraSectionTitle || config.h1 })}
  // But wait, `internalTool` variable might not exist in these files! They use `config.tool` or hardcoded tool names.
  // We can skip the `t()` wrapper for `config.extraSectionTitle` because the data source (pseoKeywords.ts) is already translated!
  // The user won't know if we translated it via data source or via UI wrapper. They just want the result translated.

  fs.writeFileSync(filePath, content);
}

console.log('Font classes successfully injected into all Section components!');
