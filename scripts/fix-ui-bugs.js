import fs from 'fs';
import path from 'path';

const toolsDir = path.join(process.cwd(), 'src/components/landing/tools');
const sysArchFile = path.join(process.cwd(), 'src/components/landing/SystemArchitecture.tsx');
const faqFile = path.join(process.cwd(), 'src/components/landing/FaqPage.tsx');
const faqSectionFile = path.join(process.cwd(), 'src/components/landing/FaqSections.tsx'); // if exists

// 1. Fix space-y-32 in all tool landing sections
function fixSpacing() {
  const files = fs.readdirSync(toolsDir).filter(f => f.endsWith('Sections.tsx'));
  for (const f of files) {
    const filePath = path.join(toolsDir, f);
    let code = fs.readFileSync(filePath, 'utf8');
    
    // Replace space-y-32 with space-y-16 lg:space-y-24
    code = code.replace(/className="space-y-32([^"]*)"/g, 'className="space-y-16 lg:space-y-24$1"');
    
    fs.writeFileSync(filePath, code, 'utf8');
  }
  console.log('Fixed space-y in tools');
}

// 2. Fix CompressSections original_photo overflow on mobile
function fixCompress() {
  const filePath = path.join(toolsDir, 'CompressSections.tsx');
  let code = fs.readFileSync(filePath, 'utf8');
  
  // Make the outer card responsive padding
  code = code.replace(/bg-dark-800 rounded-\[2\.5rem\] p-8/g, 'bg-dark-800 rounded-[2rem] sm:rounded-[2.5rem] p-4 sm:p-8');
  
  // Make inner cards responsive padding
  code = code.replace(/bg-dark-900 rounded-2xl p-6/g, 'bg-dark-900 rounded-2xl p-4 sm:p-6');
  
  // Truncate original_photo.jpg
  code = code.replace(
    /font-bold text-slate-300">original_photo\.jpg/g,
    'font-bold text-slate-300 truncate max-w-[120px] sm:max-w-xs text-sm sm:text-base">original_photo.jpg'
  );
  
  // Truncate compressed_photo.jpg
  code = code.replace(
    /font-bold text-white">compressed_photo\.jpg/g,
    'font-bold text-white truncate max-w-[110px] sm:max-w-xs text-sm sm:text-base">compressed_photo.jpg'
  );
  
  // Fix the Gap and icon sizes
  code = code.replace(/flex items-center gap-4/g, 'flex items-center gap-3 sm:gap-4 overflow-hidden pr-2');
  code = code.replace(/bg-rose-500\/20 text-rose-500 rounded-xl flex items-center justify-center/g, 'bg-rose-500/20 text-rose-500 rounded-xl flex items-center justify-center shrink-0');
  code = code.replace(/bg-\[#12DA91\]\/20 text-\[#12DA91\] rounded-xl flex items-center justify-center/g, 'bg-[#12DA91]/20 text-[#12DA91] rounded-xl flex items-center justify-center shrink-0');
  
  fs.writeFileSync(filePath, code, 'utf8');
  console.log('Fixed CompressSections');
}

// 3. Fix SystemArchitecture Centering on Mobile
function fixSysArch() {
  let code = fs.readFileSync(sysArchFile, 'utf8');
  // Add text-center sm:text-left to split variant container
  code = code.replace(/<div className="flex-1 space-y-6 sm:space-y-8 z-10">/g, '<div className="flex-1 space-y-6 sm:space-y-8 z-10 text-center sm:text-left">');
  // Add mx-auto sm:mx-0 to HeaderTextLeft badge
  code = code.replace(/w-max mb-4/g, 'w-max mx-auto sm:mx-0 mb-4');
  
  // Fix grid and list variants too
  code = code.replace(/text-left max-w-xl/g, 'text-center sm:text-left max-w-xl');
  code = code.replace(/block w-max mb-4/g, 'block w-max mx-auto sm:mx-0 mb-4');
  
  fs.writeFileSync(sysArchFile, code, 'utf8');
  console.log('Fixed SystemArchitecture');
}

// 4. Fix FAQ Centering on mobile
function fixFaq() {
  try {
    let code = fs.readFileSync(faqFile, 'utf8');
    // Find the header section of FaqPage and ensure it has text-center sm:text-left
    code = code.replace(/className="mb-12 sm:mb-20"/g, 'className="mb-12 sm:mb-20 text-center sm:text-left"');
    // Check if the badge is centered
    code = code.replace(/className="inline-flex(.*?)mb-6/g, 'className="inline-flex mx-auto sm:mx-0$1mb-6');
    fs.writeFileSync(faqFile, code, 'utf8');
    console.log('Fixed FaqPage');
  } catch(e) {
    console.log('FaqPage missing or different', e.message);
  }
}

fixSpacing();
fixCompress();
fixSysArch();
fixFaq();
