import fs from 'fs';
import path from 'path';

const toolsDir = path.resolve('src/components/landing/tools');
const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 1. Ensure useTranslation is imported
  if (!content.includes('useTranslation')) {
    content = content.replace(
      "import { useRouter } from '../../../context/RouterContext';",
      "import { useRouter } from '../../../context/RouterContext';\nimport { useTranslation } from '../../../context/LanguageContext';"
    );
  }

  // 2. Ensure const { t } = useTranslation(); is inside the component
  const componentName = file.replace('.tsx', '');
  const componentStart = `export const ${componentName}: React.FC = () => {`;
  const componentStart2 = `export function ${componentName}() {`;
  
  if (!content.includes('const { t } = useTranslation();')) {
    if (content.includes(componentStart)) {
      content = content.replace(
        componentStart,
        `${componentStart}\n  const { t } = useTranslation();`
      );
    } else if (content.includes(componentStart2)) {
      content = content.replace(
        componentStart2,
        `${componentStart2}\n  const { t } = useTranslation();`
      );
    }
  }

  // 3. Replace common hardcoded strings
  const replacements = [
    { from: />Frequently Asked Questions</g, to: ">{t('longtail.faq', { defaultValue: 'Frequently Asked Questions' })}<" },
    { from: /"Frequently Asked Questions"/g, to: "t('longtail.faq', { defaultValue: 'Frequently Asked Questions' })" },
    
    // Compress 50KB strings
    { from: />High-Speed Processing</g, to: ">{t('longtail.c50.feat1Title', { defaultValue: 'High-Speed Processing' })}<" },
    { from: />Target Limit</g, to: ">{t('longtail.c50.target', { defaultValue: 'Target Limit' })}<" },
    { from: />Smart Quality Retention</g, to: ">{t('longtail.c50.feat2Title', { defaultValue: 'Smart Quality Retention' })}<" },
    { from: />Our algorithm automatically adjusts compression curves to retain edge sharpness even at extremely low bitrates.</g, to: ">{t('longtail.c50.feat2Desc', { defaultValue: 'Our algorithm automatically adjusts compression curves to retain edge sharpness even at extremely low bitrates.' })}<" },
    { from: />Mobile Optimized</g, to: ">{t('longtail.c50.feat3Title', { defaultValue: 'Mobile Optimized' })}<" },
    { from: />Works flawlessly on iOS and Android browsers without requiring any app installations or backend uploads.</g, to: ">{t('longtail.c50.feat3Desc', { defaultValue: 'Works flawlessly on iOS and Android browsers without requiring any app installations or backend uploads.' })}<" },
    { from: />Heavy</g, to: ">{t('longtail.c50.heavy', { defaultValue: 'Heavy' })}<" },
    { from: />Ready</g, to: ">{t('longtail.c50.ready', { defaultValue: 'Ready' })}<" },
    
    // Compress 100KB strings
    { from: />Client-Side Architecture</g, to: ">{t('longtail.c100.clientSide', { defaultValue: 'Client-Side Architecture' })}<" },
    { from: />100% Secure</g, to: ">{t('longtail.c100.secure', { defaultValue: '100% Secure' })}<" },
    { from: />WebGPU Powered</g, to: ">{t('longtail.c100.webgpu', { defaultValue: 'WebGPU Powered' })}<" },
    { from: />Original 5MB</g, to: ">{t('longtail.c100.original', { defaultValue: 'Original 5MB' })}<" },
    { from: />Result 98KB</g, to: ">{t('longtail.c100.result', { defaultValue: 'Result 98KB' })}<" },
    { from: />Proven Performance</g, to: ">{t('longtail.c100.proven', { defaultValue: 'Proven Performance' })}<" },
    { from: />Absolute Privacy</g, to: ">{t('longtail.c100.privacy', { defaultValue: 'Absolute Privacy' })}<" },
    { from: />By utilizing WebWorkers, images never leave your device. Serverless architecture prevents data leaks.</g, to: ">{t('longtail.c100.privacyDesc', { defaultValue: 'By utilizing WebWorkers, images never leave your device. Serverless architecture prevents data leaks.' })}<" },
    { from: />Lightning Fast</g, to: ">{t('longtail.c100.fast', { defaultValue: 'Lightning Fast' })}<" },
    { from: />Powered by browser-native APIs. Compressing a 5MB image to 100KB takes less than 0.5 seconds.</g, to: ">{t('longtail.c100.fastDesc', { defaultValue: 'Powered by browser-native APIs. Compressing a 5MB image to 100KB takes less than 0.5 seconds.' })}<" },
    { from: />Batch Ready</g, to: ">{t('longtail.c100.batch', { defaultValue: 'Batch Ready' })}<" },
    { from: />Drag and drop up to 50 images at once. They process concurrently without crashing your tab.</g, to: ">{t('longtail.c100.batchDesc', { defaultValue: 'Drag and drop up to 50 images at once. They process concurrently without crashing your tab.' })}<" },
    
    // Compress 200KB strings
    { from: />Target Size</g, to: ">{t('longtail.c200.targetSize', { defaultValue: 'Target Size' })}<" },
    { from: />Best Use Case</g, to: ">{t('longtail.c200.bestUse', { defaultValue: 'Best Use Case' })}<" },
    { from: />Quality Retention</g, to: ">{t('longtail.c200.quality', { defaultValue: 'Quality Retention' })}<" },
    { from: />Excellent</g, to: ">{t('longtail.c200.excellent', { defaultValue: 'Excellent' })}<" },
    { from: />Good</g, to: ">{t('longtail.c200.good', { defaultValue: 'Good' })}<" },
    { from: />Acceptable</g, to: ">{t('longtail.c200.acceptable', { defaultValue: 'Acceptable' })}<" },
    { from: />Server Logs</g, to: ">{t('longtail.c200.serverLogs', { defaultValue: 'Server Logs' })}<" }
  ];

  for (const r of replacements) {
    content = content.replace(r.from, r.to);
  }

  fs.writeFileSync(filePath, content);
}
console.log('Patched Tool TSX files with useTranslation and t() hooks!');
