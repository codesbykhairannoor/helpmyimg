import fs from 'fs';
import path from 'path';
import { translate } from '@vitalets/google-translate-api';
import { PSEO_KEYWORD_MATRIX } from '../src/data/pseoKeywords';

async function main() {
  const filePath = path.resolve('src/data/pseoKeywords.ts');
  let content = fs.readFileSync(filePath, 'utf-8');

  const toolsToTranslate = [
    'compress100kb', 'compress50kb', 'compress200kb', 'resizeig',
    'resizepassport', 'removelogo', 'colorwhite', 'removeperson',
    'convertwebp', 'watermarkbulk', 'blurplate'
  ];

  // We only translate title, h1, description, extraSectionTitle, extraSectionDesc
  // To avoid breaking the TS file, we will find the specific english text and replace it with translated text.
  // Wait, the text is the same across all languages for a given tool right now.
  
  // Let's gather the english texts for each tool
  const enConfigs = {};
  for (const config of PSEO_KEYWORD_MATRIX) {
    if (config.lang === 'en' && toolsToTranslate.includes(config.tool)) {
      enConfigs[config.tool] = {
        title: config.title,
        h1: config.h1,
        description: config.description
      };
    }
  }

  // Find all languages in the matrix
  const langs = [...new Set(PSEO_KEYWORD_MATRIX.map(c => c.lang))].filter(l => l !== 'en' && l !== 'id');

  console.log('Langs to translate:', langs.length);

  // We will do a regex replace for each tool and each language block.
  // A block in TS looks like:
  // {
  //    "slug": "...",
  //    "tool": "compress50kb",
  //    "lang": "cs",
  //    "title": "Compress Image to 50KB - Smart WebGPU Compression",
  // ...
  
  // Actually, replacing by exact string matching the whole config is safest.
  // Let's rebuild the configs string for those tools and replace them.
  // But wait, the easiest way is to just do search & replace on the file content.

  for (const lang of langs) {
    let targetLang = lang;
    if (targetLang === 'zh') targetLang = 'zh-CN';
    if (targetLang === 'tl') targetLang = 'tl';

    for (const tool of toolsToTranslate) {
      const en = enConfigs[tool];
      if (!en) continue;

      // Check if this lang/tool combo exists and has the exact english text
      const config = PSEO_KEYWORD_MATRIX.find(c => c.lang === lang && c.tool === tool);
      if (!config) continue;

      if (config.title === en.title) {
        try {
          console.log(`Translating ${tool} for ${lang}...`);
          const [tTitle, tH1, tDesc] = await Promise.all([
            translate(en.title, { to: targetLang }).then(r => r.text),
            translate(en.h1, { to: targetLang }).then(r => r.text),
            translate(en.description, { to: targetLang }).then(r => r.text),
          ]);

          // Replace in file content
          // We must only replace inside the block for this language and tool.
          // Since the title is unique per tool (mostly), but we must be careful.
          // Let's use a regex to match the block:
          const blockRegex = new RegExp(`(\\"tool\\"\\s*:\\s*\\"${tool}\\"\\s*,\\s*\\"lang\\"\\s*:\\s*\\"${lang}\\"[\\s\\S]*?\\})`, 'g');
          
          content = content.replace(blockRegex, (match) => {
            let newMatch = match;
            newMatch = newMatch.replace(JSON.stringify(en.title), JSON.stringify(tTitle));
            newMatch = newMatch.replace(JSON.stringify(en.h1), JSON.stringify(tH1));
            newMatch = newMatch.replace(JSON.stringify(en.description), JSON.stringify(tDesc));
            return newMatch;
          });

        } catch (e) {
          console.error(`Failed ${lang} ${tool}:`, e.message);
        }
      }
    }
    
    // Save periodically
    fs.writeFileSync(filePath, content);
  }

  console.log('Matrix translation complete!');
}

main();
