const fs = require('fs');
const path = require('path');

const footerPath = path.join(__dirname, '../src/components/Footer.tsx');
let content = fs.readFileSync(footerPath, 'utf8');

if (!content.includes('import { Link } from \'react-router-dom\'')) {
    content = content.replace(
        "import React from 'react';",
        "import React from 'react';\nimport { Link } from 'react-router-dom';"
    );
}

// Replace all <a href=... with <Link to=...
content = content.replace(/<a href=\{([^}]+)\} className="([^"]+)">([^<]+)<\/a>/g, "<Link to={$1} className=\"$2\">$3</Link>");

fs.writeFileSync(footerPath, content, 'utf8');
console.log('Footer updated successfully!');
