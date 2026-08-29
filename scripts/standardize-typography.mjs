import fs from 'fs';
import path from 'path';

const toolsDir = path.resolve('src/components/landing/tools');
const files = [
  'BlurPlateSections.tsx',
  'ColorWhiteSections.tsx',
  'Compress100kbSections.tsx',
  'Compress200kbSections.tsx',
  'Compress50kbSections.tsx',
  'ConvertWebpSections.tsx',
  'RemoveLogoSections.tsx',
  'RemovePersonSections.tsx',
  'ResizeIgSections.tsx',
  'ResizePassportSections.tsx',
  'WatermarkBulkSections.tsx'
];

for (const file of files) {
  const filePath = path.join(toolsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace all H2 tags with the standard typography
  // Some H2s might have style={} or other attributes. We will completely replace the opening tag.
  content = content.replace(/<h2[^>]*>/g, '<h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight tracking-tight text-center">');

  // Replace subtitles (P tags that immediately follow an H2, maybe with some whitespace)
  // Since JSX can have {t(...)} inside, we just match the opening <p ...> tag
  // We can't easily parse JSX with regex if there are intervening tags.
  // Actually, let's just standardize P tags based on their current classes.
  // Subtitles usually have text-lg, text-xl, or max-w-
  content = content.replace(/<p className="([^"]*)"/g, (match, classes) => {
    if (classes.includes('max-w-') || classes.includes('mx-auto') || classes.includes('text-lg') || classes.includes('text-xl')) {
      // It's likely a section subtitle
      // Check if it's already got text-center, if not, maybe it doesn't need it?
      // The user wants them balanced.
      return '<p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed text-center font-body"';
    } else {
      // It's likely a feature description or a smaller text
      // We will ensure it has slate-600 dark:slate-400
      return '<p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed"';
    }
  });

  // H3 tags are usually Feature titles or FAQ titles
  content = content.replace(/<h3[^>]*>/g, '<h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 font-heading">');

  fs.writeFileSync(filePath, content);
}
console.log('Typography standardized for 11 components!');
