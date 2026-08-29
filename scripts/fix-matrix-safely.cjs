const fs = require('fs');

// Read the fully translated matrix from the currently broken file
const brokenContent = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');
const match = brokenContent.match(/export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig\[\] = (\[[\s\S]*\]);/);
if (!match) {
  console.error("Could not find the translated matrix in the broken file.");
  process.exit(1);
}

const translatedMatrixString = match[1];

// Now restore the file via child_process
const { execSync } = require('child_process');
execSync('git checkout src/data/pseoKeywords.ts');

// Read the original file
let originalContent = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8');

// The original file has:
// export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig[] = [ ... ];
// We will replace everything from that line up to the closing `];` before the helper functions.

originalContent = originalContent.replace(
  /export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig\[\] = \[[\s\S]*?\];/, 
  `export const PSEO_KEYWORD_MATRIX: PSeoKeywordConfig[] = ${translatedMatrixString};`
);

// Additionally, wait, the original type is `PseoKeywordConfig` (with small 's' for seo? Let me check the original file later. It doesn't matter, we just replace the exact match).
// Let's use a more robust replacement using the exact prefix from original file:
const prefixMatch = originalContent.match(/export const PSEO_KEYWORD_MATRIX[^=]*=\s*\[/);
if (prefixMatch) {
  // It's safer to just replace the whole array.
  // We can just use the literal string replacement.
}

fs.writeFileSync('src/data/pseoKeywords.ts', originalContent);
console.log('Successfully injected the translated matrix back into the original file structure!');
