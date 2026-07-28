const fs = require('fs');
const path = require('path');
const dir = 'd:/aboutbg-img/src/components/landing/tools';
const variants = ['bento', 'split', 'grid', 'minimal', 'cards', 'list'];
let idx = 0;

fs.readdirSync(dir).filter(f => f.endsWith('Sections.tsx')).forEach(file => {
  let c = fs.readFileSync(path.join(dir, file), 'utf8');
  if (!c.includes('SystemArchitecture')) {
    const variant = variants[idx % variants.length];
    idx++;
    c = c.replace(/import React(.*?)from 'react';/, "import React$1from 'react';\nimport { SystemArchitecture } from '../SystemArchitecture';");
    
    // Inject at the very end right before the last </div>
    const beforeClose = c.lastIndexOf('</div>');
    if (beforeClose > -1) {
      c = c.substring(0, beforeClose) + `\n      <SystemArchitecture variant="${variant}" />\n    </div>\n`;
    }
    fs.writeFileSync(path.join(dir, file), c, 'utf8');
    console.log('Injected into', file, 'with variant', variant);
  }
});
