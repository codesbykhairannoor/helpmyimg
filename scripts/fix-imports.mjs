import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const addImport = (f, i) => { 
  let p = path.join(__dirname, '..', 'src', 'components', 'landing', 'tools', f); 
  let c = fs.readFileSync(p, 'utf8'); 
  if (!c.includes('framer-motion')) {
    fs.writeFileSync(p, i + '\n' + c); 
  }
}; 

addImport('RemoveLogoSections.tsx', "import { motion } from 'framer-motion';"); 
addImport('ResizeIgSections.tsx', "import { motion, AnimatePresence } from 'framer-motion';"); 

console.log('Added motion imports back');
