const fs = require('fs');

let c = fs.readFileSync('src/pages/ToolLandingPage.tsx', 'utf8');

c = c.replace(/<section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 mb-16 relative">[\s\S]*?<\/section>/, `{/* Tool Specific FAQ Section - Dynamic Variants */}
          <ToolFaqSection 
            toolMapName={toolMapName} 
            variant={
              toolMapName === 'remove' ? 'grid' :
              toolMapName === 'compress' ? 'cards' :
              toolMapName === 'color' ? 'accordion' :
              toolMapName === 'resize' ? 'split' :
              toolMapName === 'crop' ? 'cards' :
              toolMapName === 'rotate' ? 'accordion' :
              toolMapName === 'watermark' ? 'split' :
              toolMapName === 'design' ? 'grid' :
              toolMapName === 'picker' ? 'cards' :
              toolMapName === 'blurface' ? 'accordion' :
              toolMapName === 'convert' ? 'split' : 'grid'
            } 
          />`);

if (!c.includes('ToolFaqSection')) {
  console.log('Failed to replace FAQ section in ToolLandingPage.tsx');
} else {
  if (!c.includes('import { ToolFaqSection }')) {
    c = c.replace(/import \{ HomeSections \} from '\.\.\/components\/landing\/HomeSections';/, "import { HomeSections } from '../components/landing/HomeSections';\nimport { ToolFaqSection } from '../components/landing/ToolFaqSection';");
  }
  fs.writeFileSync('src/pages/ToolLandingPage.tsx', c);
  console.log('Successfully injected ToolFaqSection into ToolLandingPage.tsx');
}
