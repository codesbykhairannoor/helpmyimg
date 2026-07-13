const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Inject English fallback translations for grid if they don't exist
    if (!data['grid.compressDesc']) {
      data['grid.compressDesc'] = "Compress JPG, PNG, SVG, and GIFs while saving space and maintaining quality.";
      data['grid.resizeDesc'] = "Define your dimensions, by percent or pixel, and resize your JPG, PNG, SVG, and GIF images.";
      data['grid.removeDesc'] = "Quickly remove image backgrounds with high accuracy. Instantly detect objects and cut out backgrounds with ease.";
      data['grid.convertDesc'] = "Turn PNG, GIF, TIF, PSD, SVG, WEBP, HEIC, or RAW format images to JPG in bulk with ease.";
      data['grid.watermarkDesc'] = "Stamp an image or text over your images in seconds. Choose the typography, transparency and position.";
      
      data['grid.catAll'] = "All";
      data['grid.catOptimize'] = "Optimize";
      data['grid.catModify'] = "Modify";
      data['grid.catConvert'] = "Convert";
      data['grid.catSecurity'] = "Security";
      
      data['nav.convert'] = "Convert Image";
      data['nav.watermark'] = "Watermark Image";

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Updated ${lang}`);
    }
  }
});
