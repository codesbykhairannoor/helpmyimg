import fs from 'fs';
import translate from 'google-translate-api-x';
import { PSEO_KEYWORD_MATRIX } from '../src/data/pseoKeywords';

const toolsToTranslate = [
  'compress100kb', 'compress50kb', 'compress200kb', 'resizeig',
  'resizepassport', 'removelogo', 'colorwhite', 'removeperson',
  'convertwebp', 'watermarkbulk', 'blurplate'
];

async function main() {
  console.log('Starting translation of FAQs and citations...');

  const langs = [...new Set(PSEO_KEYWORD_MATRIX.map(c => c.lang))].filter(l => l !== 'en' && l !== 'id' && l !== 'th');
  
  for (let config of PSEO_KEYWORD_MATRIX) {
    if (toolsToTranslate.includes(config.tool) && langs.includes(config.lang)) {
      
      let targetLang = config.lang;
      if (targetLang === 'zh') targetLang = 'zh-CN';
      
      const textsToTranslate = [];
      
      if (config.citationFirst) textsToTranslate.push(config.citationFirst);
      
      if (config.faqs) {
        for (const faq of config.faqs) {
          textsToTranslate.push(faq.question);
          textsToTranslate.push(faq.answer);
        }
      }
      
      if (textsToTranslate.length > 0) {
        try {
          const res = await translate(textsToTranslate, { to: targetLang });
          const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];
          
          let idx = 0;
          if (config.citationFirst) {
            config.citationFirst = translatedArray[idx++];
          }
          if (config.faqs) {
            for (const faq of config.faqs) {
              faq.question = translatedArray[idx++];
              faq.answer = translatedArray[idx++];
            }
          }
        } catch (e) {
          console.error(`Failed to translate FAQs for ${config.lang} / ${config.tool}`, e.message);
        }
      }
    }
  }

  const jsonStr = JSON.stringify(PSEO_KEYWORD_MATRIX, null, 2);
  
  let originalContent = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');
  const replacedContent = originalContent.replace(
    /export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig\[\] = \[[\s\S]*?\];/, 
    `export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig[] = ${jsonStr};`
  );
  
  fs.writeFileSync('src/data/pseoKeywords.ts', replacedContent, 'utf8');
  console.log('Successfully updated pseoKeywords.ts with translated FAQs and citations');
}

main();
