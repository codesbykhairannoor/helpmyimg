const fs = require('fs');
const path = require('path');
const langs = ['ar','bg','cs','da','de','el','en','es','fi','fr','he','hi','hu','id','it','ja','ko','ms','nl','no','pl','pt','ro','ru','sv','th','tl','tr','uk','vi','zh'];
const keys = {
  'blur.options': 'Blur Face Options',
  'blur.desc': 'Protect privacy by blurring faces.',
  'blur.auto': 'Automatic',
  'blur.manual': 'Customised',
  'blur.manualDesc': 'Click and drag on the image to draw custom blur areas.',
  'blur.aiDesc': 'AI will automatically detect faces.',
  'blur.detecting': 'Detecting...',
  'blur.detectBtn': 'Detect Faces Now',
  'blur.intensity': 'Blur Intensity',
  'design.settings': 'Design Editor',
  'design.desc': 'Full-featured image studio.',
  'design.info1': 'Design your image using the advanced tools in the preview area.',
  'design.saveBtn': 'Save Design',
  'design.info2': 'Supports layers, image merging, drawing, text, filters, and custom watermarks.'
};

for(const lang of langs) {
  const p = path.join(__dirname, '..', 'public', 'locales', lang, 'translation.json');
  if(fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    for(const k in keys) {
      json[k] = keys[k];
    }
    fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
    console.log(`Injected setting keys for ${lang}`);
  }
}
