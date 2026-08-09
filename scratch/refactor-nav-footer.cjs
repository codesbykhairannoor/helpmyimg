const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '../src/components/Navbar.tsx');
let navbarContent = fs.readFileSync(navbarPath, 'utf8');

// Replace imports
navbarContent = navbarContent.replace(/import \{ Link, useNavigate \} from 'react-router-dom';/, "import { useRouter } from '../context/RouterContext';");

// Replace useNavigate hook with useRouter
navbarContent = navbarContent.replace(/const navigate = useNavigate\(\);/, "const { navigate } = useRouter();");

// Replace <Link to=... with <a href=... onClick={(e) => { e.preventDefault(); router.navigatePath(href); }}
navbarContent = navbarContent.replace(/<Link/g, '<a');
navbarContent = navbarContent.replace(/<\/Link>/g, '</a>');
navbarContent = navbarContent.replace(/to=\{([^}]+)\}/g, 'href={$1} onClick={(e) => { e.preventDefault(); const target = $1; if (typeof target === "string") { const newLang = target.split("/").filter(Boolean)[0] || "en"; const newTool = target.split("/").filter(Boolean)[1]; navigate(newLang, newTool); } }}');


const footerPath = path.join(__dirname, '../src/components/Footer.tsx');
let footerContent = fs.readFileSync(footerPath, 'utf8');

footerContent = footerContent.replace(/import \{ Link \} from 'react-router-dom';/, "import { useRouter } from '../context/RouterContext';");

// Insert useRouter into Footer
footerContent = footerContent.replace(/export const Footer: React.FC = \(\) => \{/, "export const Footer: React.FC = () => {\n  const { navigatePath } = useRouter();");

footerContent = footerContent.replace(/<Link/g, '<a');
footerContent = footerContent.replace(/<\/Link>/g, '</a>');
footerContent = footerContent.replace(/to=\{([^}]+)\}/g, 'href={$1} onClick={(e) => { e.preventDefault(); navigatePath($1); }}');

fs.writeFileSync(navbarPath, navbarContent, 'utf8');
fs.writeFileSync(footerPath, footerContent, 'utf8');

console.log('Navbar and Footer updated to use State Routing');
