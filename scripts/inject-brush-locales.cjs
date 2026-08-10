const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'i18n', 'staticCatalog.ts');
let content = fs.readFileSync(filePath, 'utf8');

const keysToInject = {
  "landing.brush.redesign.heroBadge": "PIXEL-PERFECT CONTROL",
  "landing.brush.redesign.heroTitle": "Master Your Edges with the Magic Refinement Brush",
  "landing.brush.redesign.heroDesc": "AI gets it right 99% of the time. For that remaining 1%, use our manual Erase and Restore brushes to craft flawless cutouts directly in your browser.",
  "landing.brush.redesign.feat1Badge": "ERASE TOOL",
  "landing.brush.redesign.feat1Title": "Clean Up Stubborn Artifacts",
  "landing.brush.redesign.feat1Desc": "Notice a speck of background that the AI missed? Simply paint over it to permanently erase it from your composition.",
  "landing.brush.redesign.feat2Badge": "RESTORE TOOL",
  "landing.brush.redesign.feat2Title": "Bring Back Missing Details",
  "landing.brush.redesign.feat2Desc": "Did the AI accidentally remove a piece of clothing or hair? Use the restore brush to magically bring those pixels back from the original image.",
  "landing.brush.redesign.feat3Badge": "ADJUSTABLE",
  "landing.brush.redesign.feat3Title": "Dynamic Brush Sizing",
  "landing.brush.redesign.feat3Desc": "Scale your brush size from a massive block for large area cleanups down to a tiny point for pixel-perfect edge refinement.",
  "landing.brush.redesign.whoTag": "PROFESSIONAL TOUCH",
  "landing.brush.redesign.whoTitle": "When AI Needs a Human Touch",
  "landing.brush.redesign.whoDesc": "Complex product shots and fine hair details sometimes require a manual override.",
  "landing.brush.redesign.case1Title": "E-commerce Products",
  "landing.brush.redesign.case1Desc": "Product photos often have shadows or reflections that AI might confuse. Use the magic brush to ensure your product edges are exceptionally clean before publishing to your store.",
  "landing.brush.redesign.case2Title": "Complex Hair & Fur",
  "landing.brush.redesign.case2Desc": "While our AI is trained on millions of hair patterns, extremely chaotic backgrounds can trick it. The restore brush lets you paint back fine strands of hair perfectly.",
  "faq.brush.q1": "What is the Magic Brush used for?",
  "faq.brush.a1": "The Magic Brush is a manual refinement tool that allows you to erase leftover background artifacts or restore accidentally removed parts of your image after the AI background removal process.",
  "faq.brush.q2": "Does the brush work offline?",
  "faq.brush.a2": "Yes, absolutely! Just like our background removal AI, the manual brush tools run 100% locally in your browser. No data is sent to external servers.",
  "faq.brush.q3": "Can I change the size of the brush?",
  "faq.brush.a3": "Yes, you can adjust the brush size using the slider in the tool panel. A smaller brush is perfect for fine details like hair, while a larger brush is great for quickly erasing big chunks of background.",
  "faq.brush.q4": "Is the Magic Brush completely free?",
  "faq.brush.a4": "Yes! All features on HelpMyIMG, including the AI background remover and the manual Magic Brush refinement tools, are completely free with no usage limits."
};

// We will inject these keys into every language object in staticCatalog.ts
const regex = /("[a-z]{2}(-[A-Z]{2})?":\s*{[\s\S]*?)(?=},?\s*"[a-z]{2}(-[A-Z]{2})?":|}];?)/g;

content = content.replace(regex, (match) => {
  // Check if we already injected them
  if (match.includes("landing.brush.redesign.heroBadge")) {
    return match;
  }
  
  // Format the new keys
  let injection = '';
  for (const [key, value] of Object.entries(keysToInject)) {
    injection += `\n    "${key}": "${value.replace(/"/g, '\\"')}",`;
  }
  
  // Remove trailing comma from injection
  injection = injection.replace(/,$/, '');
  
  // Insert right before the end of the object
  return match + ',' + injection;
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully injected brush translations into staticCatalog.ts');
