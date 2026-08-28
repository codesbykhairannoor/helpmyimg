import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const p = path.join(__dirname, '..', 'src', 'pages', 'ToolLandingPage.tsx');

let c = fs.readFileSync(p, 'utf8');

const missingDeclarations = `

  const toolMapName = internalTool;
  const displayConfig = {
    title: defaultTitle,
    description: defaultDesc,
    h1: defaultH1,
    tool: internalTool,
    citationFirst: false,
    quantitativeProof: false
  };

  return (
`;

c = c.replace(/\n\n  return \(/g, missingDeclarations);

fs.writeFileSync(p, c, 'utf8');
console.log('Restored missing declarations in ToolLandingPage.tsx!');
