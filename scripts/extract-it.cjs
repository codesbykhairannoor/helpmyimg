const fs = require('fs');
let lines = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8').split('\n');
let inIt = false;
let inC100 = false;
for (let l of lines) {
  if (l.includes('"tool": "compress100kb"')) inC100 = true;
  if (l.includes('"lang": "it"')) inIt = true;
  
  if (l.includes('{') && l.trim() === '{') {
    inIt = false;
    inC100 = false;
  }
  
  if (inIt && inC100) {
    console.log(l);
  }
}
