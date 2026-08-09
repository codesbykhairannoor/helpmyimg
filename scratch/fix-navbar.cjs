const fs = require('fs');
const path = require('path');

const navbarPath = path.join(__dirname, '../src/components/Navbar.tsx');
let content = fs.readFileSync(navbarPath, 'utf8');

// 1. Add useNavigate and Link to imports
content = content.replace(
  "import { useLocation } from 'react-router-dom';",
  "import { useLocation, useNavigate, Link } from 'react-router-dom';"
);

// 2. Add navigate = useNavigate()
content = content.replace(
  "const location = useLocation();",
  "const location = useLocation();\n  const navigate = useNavigate();"
);

// 3. Replace window.location.href with navigate()
content = content.replace(/window\.location\.href = '\/' \+ newPathParts\.join\('\/'\);/g, "navigate('/' + newPathParts.join('/'));");
content = content.replace(/window\.location\.href = newLang === 'en' \? '\/' : `\/\$\{newLang\}`;/g, "navigate(newLang === 'en' ? '/' : `/${newLang}`);");

// 4. Replace <a href=... with <Link to=...
// The logo
content = content.replace(/<a href=\{lang === 'en' \? '\/' : `\/\$\{lang\}`\} className="flex items-center gap-2\.5 group">/g, "<Link to={lang === 'en' ? '/' : `/${lang}`} className=\"flex items-center gap-2.5 group\">");
content = content.replace(/<\/span>\s*<\/div>\s*<\/a>/g, "</span>\n            </div>\n          </Link>");

// Desktop main links
content = content.replace(/<a href=\{([^}]+)\} onClick=\{([^}]+)\} className="([^"]+)">\s*([^<]+)\s*<\/a>/g, "<Link to={$1} onClick={$2} className=\"$3\">\n              $4\n            </Link>");

// Mega menu links
content = content.replace(/<a \s*key=\{tool\.id\} \s*href=\{([^}]+)\} \s*onClick=\{([^}]+)\}\s*className="flex items-center/g, "<Link \n                                key={tool.id} \n                                to={$1} \n                                onClick={$2}\n                                className=\"flex items-center");
// Close mega menu a tags
content = content.replace(/<\/span>\s*<\/a>/g, "</span>\n                              </Link>");

// Language dropdown links (leave as a, because they have preventDefault and onClick handleLangChange)

// Mobile menu links
content = content.replace(/<a\s*key=\{tool\.id\}\s*href=\{([^}]+)\}\s*onClick=\{([^}]+)\}\s*className="flex items-center gap-2\.5 p-2 rounded-xl/g, "<Link\n                            key={tool.id}\n                            to={$1}\n                            onClick={$2}\n                            className=\"flex items-center gap-2.5 p-2 rounded-xl");
// Close mobile menu a tags (they have similar structure to mega menu so the above regex might have already caught them, but let's be safe. The previous </a> regex replaced all </a> that follow a </span>. Mobile menu has </span>\n                            </div>\n                          </a>)
content = content.replace(/<\/span>\s*<\/div>\s*<\/a>/g, "</span>\n                            </div>\n                          </Link>"); // this overlaps with the logo one, so I'll just use a general replace for </a> inside the mapping

fs.writeFileSync(navbarPath, content, 'utf8');
console.log('Navbar updated successfully!');
