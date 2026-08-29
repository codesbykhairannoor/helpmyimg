import fs from 'fs';
import path from 'path';
import translate from 'google-translate-api-x';
import { PSEO_KEYWORD_MATRIX } from '../src/data/pseoKeywords';

const toolsToTranslate = [
  'compress100kb', 'compress50kb', 'compress200kb', 'resizeig',
  'resizepassport', 'removelogo', 'colorwhite', 'removeperson',
  'convertwebp', 'watermarkbulk', 'blurplate'
];

async function main() {
  console.log('Starting translation using google-translate-api-x...');

  const langs = [...new Set(PSEO_KEYWORD_MATRIX.map(c => c.lang))].filter(l => l !== 'en' && l !== 'id' && l !== 'th');
  console.log(`Translating for ${langs.length} languages...`);

  // We need to translate all string fields for the 10 tools that are currently just copied from English
  for (let config of PSEO_KEYWORD_MATRIX) {
    if (toolsToTranslate.includes(config.tool) && langs.includes(config.lang)) {
      
      let targetLang = config.lang;
      if (targetLang === 'zh') targetLang = 'zh-CN';
      
      // Fields to translate
      const fields = ['title', 'h1', 'description', 'extraSectionTitle', 'extraSectionDesc', 'beforeImageLabel', 'afterImageLabel', 'quantitativeProof'];
      
      const textsToTranslate = [];
      const fieldMapping = [];
      
      for (const field of fields) {
        if (config[field]) {
          textsToTranslate.push(config[field]);
          fieldMapping.push(field);
        }
      }
      
      if (textsToTranslate.length > 0) {
        try {
          const res = await translate(textsToTranslate, { to: targetLang });
          const translatedArray = Array.isArray(res) ? res.map(r => r.text) : [res.text];
          
          for (let i = 0; i < fieldMapping.length; i++) {
            config[fieldMapping[i]] = translatedArray[i];
          }
          console.log(`[${targetLang}] Translated ${config.tool}`);
        } catch (e) {
          console.error(`[${targetLang}] Failed to translate ${config.tool}: ${e.message}`);
        }
      }
    }
  }

  // Re-serialize the file
  const fileHeader = `// Matriks Programmatic SEO (pSEO) & Generative Engine Optimization (GEO) untuk 10 Bahasa
// Menggabungkan variabel [Action] x [Object] x [Context] x [Color/Style] untuk mendominasi Google & AI Overviews

export interface PSeoKeywordConfig {
  slug: string;
  tool: 'remove' | 'color' | 'brush' | 'watermark' | 'compress' | 'compress100kb' | 'compress50kb' | 'convert' | 'resize' | 'resizeig' | 'removelogo' | 'colorwhite' | 'compress200kb' | 'resizepassport' | 'removeperson' | 'convertwebp' | 'watermarkbulk' | 'blurplate';
  lang: string;
  title: string;
  h1: string;
  description: string;
  citationFirst: string;
  quantitativeProof: string;
  defaultColor?: string;
  defaultBlur?: number;
  defaultAspect?: string;
  extraSectionTitle?: string;
  extraSectionDesc?: string;
  beforeImageLabel?: string;
  afterImageLabel?: string;
  extraSectionItems?: string[];
  faqs?: Array<{ question: string; answer: string; }>;
}

export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig[] = `;

  const jsonString = JSON.stringify(PSEO_KEYWORD_MATRIX, null, 2);
  fs.writeFileSync(path.resolve('src/data/pseoKeywords.ts'), fileHeader + jsonString + ';\n');
  
  console.log('Successfully updated pseoKeywords.ts');
}

main();
