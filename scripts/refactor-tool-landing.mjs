import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = path.join(__dirname, '..', 'src', 'pages', 'ToolLandingPage.tsx');

let c = fs.readFileSync(p, 'utf8');

// 1. Add `isPseoTool` check
const pseoCheck = `
  const isPseoTool = ['compress100kb', 'compress50kb', 'compress200kb', 'resizeig', 'resizepassport', 'removelogo', 'colorwhite', 'removeperson', 'convertwebp', 'watermarkbulk', 'blurplate'].includes(internalTool);
`;
c = c.replace(/const internalTool = tool \|\| 'remove';/g, `const internalTool = tool || 'remove';\n${pseoCheck}`);

// 2. Simplify the `if (!config ...)`
c = c.replace(/if \(!config && \([^)]*\)\) \{/g, `if (!config && isPseoTool) {`);

// 3. Simplify `defaultTitle`
c = c.replace(
  /const defaultTitle =[\s\S]*?(?=\n\n  const defaultH1)/g,
  `const defaultTitle = isPseoTool && config ? config.title : (!tool 
    ? t('home.tab.title', { defaultValue: "HelpMyIMG | All Image Tools in One Place" })
    : internalTool === 'color' 
    ? t('landing.default.title.color') 
    : internalTool === 'watermark'
    ? t('landing.default.title.watermark')
    : internalTool === 'compress'
    ? t('landing.default.title.compress')
    : internalTool === 'convert'
    ? t('landing.default.title.convert')
    : internalTool === 'resize'
    ? t('landing.default.title.resize')
    : internalTool === 'crop'
    ? t('landing.default.title.crop')
    : internalTool === 'rotate'
    ? t('landing.default.title.rotate')
    : internalTool === 'picker'
    ? t('landing.default.title.picker')
    : internalTool === 'blurface'
    ? t('landing.default.title.blurface')
    : internalTool === 'design'
    ? t('landing.default.title.design')
    : internalTool === 'brush'
    ? t('brush.title')
    : t('landing.default.title.remove'));`
);

// 4. Simplify `defaultH1`
c = c.replace(
  /const defaultH1 =[\s\S]*?(?=\n\n  const defaultDesc)/g,
  `const defaultH1 = isPseoTool && config ? config.h1 : (!tool
    ? t('landing.default.title.home', { defaultValue: "Every AI tool you need to edit images in bulk" })
    : internalTool === 'color' 
    ? t('landing.default.title.color') 
    : internalTool === 'watermark'
    ? t('landing.default.title.watermark')
    : internalTool === 'compress'
    ? t('landing.default.title.compress')
    : internalTool === 'convert'
    ? t('landing.default.title.convert')
    : internalTool === 'resize'
    ? t('landing.default.title.resize')
    : internalTool === 'crop'
    ? t('landing.default.title.crop')
    : internalTool === 'rotate'
    ? t('landing.default.title.rotate')
    : internalTool === 'picker'
    ? t('landing.default.title.picker')
    : internalTool === 'blurface'
    ? t('landing.default.title.blurface')
    : internalTool === 'design'
    ? t('landing.default.title.design')
    : internalTool === 'brush'
    ? t('brush.title')
    : t('landing.default.title.remove'));`
);

// 5. Simplify `defaultDesc`
c = c.replace(
  /const defaultDesc =[\s\S]*?(?=\n\n  return)/g,
  `const defaultDesc = isPseoTool && config ? (config.desc || config.description || '') : (!tool
    ? t('landing.default.desc.home', { defaultValue: "Your local AI photo editor is here and forever free! 100% private, runs directly in your browser." })
    : internalTool === 'color' 
    ? t('landing.default.desc.color') 
    : internalTool === 'watermark'
    ? t('landing.default.desc.watermark')
    : internalTool === 'compress'
    ? t('landing.default.desc.compress')
    : internalTool === 'convert'
    ? t('landing.default.desc.convert')
    : internalTool === 'resize'
    ? t('landing.default.desc.resize')
    : internalTool === 'crop'
    ? t('landing.default.desc.crop')
    : internalTool === 'rotate'
    ? t('landing.default.desc.rotate')
    : internalTool === 'picker'
    ? t('landing.default.desc.picker')
    : internalTool === 'blurface'
    ? t('landing.default.desc.blurface')
    : internalTool === 'design'
    ? t('landing.default.desc.design')
    : internalTool === 'brush'
    ? t('brush.desc')
    : t('landing.default.desc.remove'));`
);

// 6. Simplify `ToolFaqSection` rendering condition
c = c.replace(
  /\{\(internalTool === 'compress100kb'[\s\S]*?&& \(\n            <div className="w-full relative z-10 -mt-16 md:-mt-24 mb-16 px-4">\n              <ToolFaqSection \/>\n            <\/div>\n          \)\}/g,
  `{isPseoTool && (
            <div className="w-full relative z-10 -mt-16 md:-mt-24 mb-16 px-4">
              <ToolFaqSection />
            </div>
          )}`
);

fs.writeFileSync(p, c, 'utf8');
console.log('Refactored ToolLandingPage.tsx!');
