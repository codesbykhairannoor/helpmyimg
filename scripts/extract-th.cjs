const fs = require('fs');
let lines = fs.readFileSync('src/data/pseoKeywords.ts', 'utf8').split('\n');
let inTh = false;
let inC100 = false;
for (let l of lines) {
  if (l.includes('"tool": "compress100kb"')) inC100 = true;
  if (l.includes('"lang": "th"')) inTh = true;
  
  // if we hit another object start and we are inTh, we exit
  if (l.includes('{') && l.trim() === '{') {
    inTh = false;
    inC100 = false;
  }
  
  if (inTh && inC100) {
    console.log(l);
  }
}
