import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, '..', 'src', 'data', 'translated_4_pages.json');
const tsPath = path.join(__dirname, '..', 'src', 'data', 'pseoKeywords.ts');

const newPages = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
let tsContent = fs.readFileSync(tsPath, 'utf8');

// The file ends with "];"
// We want to insert our new objects right before the closing bracket.
const closingBracketIndex = tsContent.lastIndexOf('];');

if (closingBracketIndex !== -1) {
  let injection = "";
  
  for (const page of newPages) {
    injection += `,\n  {\n`;
    injection += `    slug: '${page.slug}',\n`;
    injection += `    tool: '${page.tool}',\n`;
    injection += `    lang: '${page.lang}',\n`;
    injection += `    title: \`${page.title.replace(/`/g, "\\`")}\`,\n`;
    injection += `    h1: \`${page.h1.replace(/`/g, "\\`")}\`,\n`;
    injection += `    description: \`${page.description.replace(/`/g, "\\`")}\`,\n`;
    injection += `    citationFirst: \`${page.citationFirst.replace(/`/g, "\\`")}\`,\n`;
    injection += `    quantitativeProof: \`${page.quantitativeProof.replace(/`/g, "\\`")}\`,\n`;
    injection += `    beforeImageLabel: \`${page.beforeImageLabel.replace(/`/g, "\\`")}\`,\n`;
    injection += `    afterImageLabel: \`${page.afterImageLabel.replace(/`/g, "\\`")}\`,\n`;
    
    if (page.extraSectionTitle) {
      injection += `    extraSectionTitle: \`${page.extraSectionTitle.replace(/`/g, "\\`")}\`,\n`;
      injection += `    extraSectionDesc: \`${page.extraSectionDesc.replace(/`/g, "\\`")}\`,\n`;
      injection += `    extraSectionItems: ${JSON.stringify(page.extraSectionItems)},\n`;
    }
    
    if (page.extraSection2Title) {
      injection += `    extraSection2Title: \`${page.extraSection2Title.replace(/`/g, "\\`")}\`,\n`;
      injection += `    extraSection2Desc: \`${page.extraSection2Desc.replace(/`/g, "\\`")}\`,\n`;
      injection += `    extraSection2Items: ${JSON.stringify(page.extraSection2Items)},\n`;
    }

    injection += `    faqs: ${JSON.stringify(page.faqs)}\n`;
    injection += `  }`;
  }

  const newTsContent = tsContent.slice(0, closingBracketIndex) + injection + '\n' + tsContent.slice(closingBracketIndex);
  fs.writeFileSync(tsPath, newTsContent, 'utf8');
  console.log(`✅ Injected ${newPages.length} objects into pseoKeywords.ts`);
} else {
  console.error("Could not find closing '];' in pseoKeywords.ts");
}
