import fs from 'fs';
import path from 'path';
import { PSEO_KEYWORD_MATRIX } from '../src/data/pseoKeywords';

function main() {
  const outputPath = path.resolve('public/matrix.json');
  fs.writeFileSync(outputPath, JSON.stringify(PSEO_KEYWORD_MATRIX, null, 2), 'utf8');
  console.log('Matrix dumped to public/matrix.json successfully.');
}

main();
