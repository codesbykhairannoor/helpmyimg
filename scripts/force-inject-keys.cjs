const fs = require('fs');
const langs = ['ar','bg','cs','da','de','el','en','es','fi','fr','he','hi','hu','id','it','ja','ko','ms','nl','no','pl','pt','ro','ru','sv','th','tl','tr','uk','vi','zh'];
const keys = {
  'nav.blurface': 'Blur Face',
  'grid.blurfaceDesc': 'Automatically detect and blur faces or apply custom censorship boxes.',
  'nav.design': 'Design Editor',
  'grid.designDesc': 'Full-featured image studio: filters, draw, stickers, frames, and shapes.',
  'landing.default.title.blurface': 'Free AI Face Blur',
  'landing.default.title.design': 'Free AI Photo Editor',
  'landing.default.desc.blurface': 'Blur faces and sensitive information in 0ms instantly and for free without downloading heavy AI models. 100% private.',
  'landing.default.desc.design': 'Edit photos, add text, draw, and apply filters in 0ms instantly and for free. 100% private.'
};

for(const lang of langs) {
  const p = `public/locales/${lang}/translation.json`;
  if(fs.existsSync(p)) {
    const json = JSON.parse(fs.readFileSync(p, 'utf8'));
    for(const k in keys) {
      json[k] = keys[k];
    }
    fs.writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
    console.log(`Injected keys for ${lang}`);
  }
}
