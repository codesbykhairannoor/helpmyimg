const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/components/landing/tools');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const f of files) {
  const p = path.join(dir, f);
  let text = fs.readFileSync(p, 'utf8');
  if (text.includes('const { t } = useTranslation();')) {
    // count occurrences of `t(`
    const matches = text.match(/t\(/g);
    // If it only matches 1 time, it's just the declaration (well, wait, the declaration is `const { t } = ...`, not `t(`).
    // Let's just check if there is any `t(` or `t (` usage besides the import.
    if (!text.includes("t('") && !text.includes('t("') && !text.includes('t(`')) {
      text = text.replace('const { t } = useTranslation();', '');
      text = text.replace("import { useTranslation } from '../../../context/LanguageContext';", '');
      fs.writeFileSync(p, text);
    }
  }
}
console.log('Cleaned unused t declarations');
