const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '../src/components/Navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

navbarContent = navbarContent.replace(/location\.pathname/g, 'window.location.pathname');

fs.writeFileSync(navbarPath, navbarContent, 'utf8');

console.log('Fixed location in Navbar');
