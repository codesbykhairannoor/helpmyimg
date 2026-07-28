import fs from 'fs';
import path from 'path';

const toolFaq = path.join(process.cwd(), 'src/components/landing/ToolFaqSection.tsx');
const faqPage = path.join(process.cwd(), 'src/pages/info/FaqPage.tsx');

function fixFaqs() {
  try {
    let code1 = fs.readFileSync(toolFaq, 'utf8');
    code1 = code1.replace(/className="mb-12 sm:mb-20"/g, 'className="mb-12 sm:mb-20 text-center sm:text-left"');
    code1 = code1.replace(/className="inline-flex(.*?)mb-6/g, 'className="inline-flex mx-auto sm:mx-0$1mb-6');
    code1 = code1.replace(/text-center max-w-3xl/g, 'text-center sm:text-left max-w-3xl');
    code1 = code1.replace(/text-center mb-16/g, 'text-center sm:text-left mb-16');
    code1 = code1.replace(/mx-auto mb-4/g, 'mx-auto sm:mx-0 mb-4');
    fs.writeFileSync(toolFaq, code1, 'utf8');
  } catch(e) {}

  try {
    let code2 = fs.readFileSync(faqPage, 'utf8');
    code2 = code2.replace(/text-center max-w-3xl/g, 'text-center sm:text-left max-w-3xl');
    code2 = code2.replace(/mx-auto mb-4/g, 'mx-auto sm:mx-0 mb-4');
    fs.writeFileSync(faqPage, code2, 'utf8');
  } catch(e) {}
}

fixFaqs();
