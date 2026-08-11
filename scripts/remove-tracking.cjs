const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '../src/components/Navbar.tsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// Remove all tracking- related tailwind classes
content = content.replace(/\btracking-(widest|wider|tight|normal)\b/g, '');

// Clean up any double spaces caused by the removal
content = content.replace(/  +/g, ' ');

fs.writeFileSync(navbarPath, content);
console.log('Removed all tracking classes from Navbar.tsx');
