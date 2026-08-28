import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urlMapperPath = path.join(__dirname, '..', 'src', 'utils', 'urlMapper.ts');
let content = fs.readFileSync(urlMapperPath, 'utf8');

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  // Regex to remove duplicates of compress50kb and resizeig at the end of the line
  lines[i] = lines[i].replace(/, compress50kb: '[^']+', resizeig: '[^']+', compress50kb: '[^']+', resizeig: '[^']+' }/g, function(match) {
    // just split it and keep the first half
    const firstHalf = match.split(', compress50kb')[1];
    return `, compress50kb${firstHalf} }`;
  });
  
  // Actually, a simpler way is to just replace the repeated occurrence
  lines[i] = lines[i].replace(/, compress50kb: '([^']+)', resizeig: '([^']+)', compress50kb: '([^']+)', resizeig: '([^']+)'/g, ", compress50kb: '$1', resizeig: '$2'");
}

fs.writeFileSync(urlMapperPath, lines.join('\n'), 'utf8');
console.log("urlMapper.ts duplicates fixed");
