const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const designDefaults = {
  heroBadge: "CREATIVE SUITE",
  heroTitle: "Design Beautiful Visuals.",
  heroTitle2: "Right in Your Browser.",
  heroDesc: "A full-featured image editor packed with professional filters, text tools, shapes, and drawing capabilities. No software installation required.",
  feat1Title: "Rich Typography",
  feat1Desc: "Add custom text layers, choose from hundreds of web fonts, and style them with strokes, shadows, and gradients for maximum impact.",
  feat2Title: "Pro Filters",
  feat2Desc: "Apply cinematic color grading and professional adjustments natively.",
  feat3Title: "Vector Shapes",
  feat3Desc: "Draw geometric shapes, arrows, and borders with precision.",
  feat4Title: "Layer Management",
  feat4Desc: "Organize complex designs effortlessly. Stack, group, hide, and lock multiple layers to create intricate compositions without losing control.",
  stepsTag: "WORKFLOW",
  stepsTitle: "Create in 3 Steps",
  s1Title: "Start Canvas",
  s1Desc: "Open a blank canvas or import a photo.",
  s2Title: "Design",
  s2Desc: "Add text, graphics, and apply filters.",
  s3Title: "Export",
  s3Desc: "Download the final masterpiece."
};

const rotateDefaults = {
  heroBadge: "SPATIAL CONTROL",
  heroTitle: "Rotate and Flip.",
  heroTitle2: "Perfect Orientation.",
  heroDesc: "Correct sideways photos, create mirror effects, and fine-tune image rotation by exact degrees. Fast, free, and done entirely in your browser.",
  feat1Title: "Quick 90° Turns",
  feat1Desc: "Fix photos taken in the wrong orientation instantly. Rotate left or right in precise 90-degree increments to snap images upright.",
  feat2Title: "Mirror Effects",
  feat2Desc: "Flip images horizontally to fix mirrored selfies, or vertically for creative reflection effects. The transformation is applied instantly without reloading.",
  feat3Title: "Fine-Tune Horizon",
  feat3Desc: "Got a crooked landscape photo? Use the precise rotation slider to level the horizon by exact degrees. Auto-crops boundaries seamlessly.",
  stepsTag: "WORKFLOW",
  stepsTitle: "Reorient in 3 Steps",
  s1Title: "Upload",
  s1Desc: "Add the images you want to fix.",
  s2Title: "Adjust",
  s2Desc: "Use the rotate and flip buttons.",
  s3Title: "Save",
  s3Desc: "Download the corrected images."
};

const pickerDefaults = {
  heroBadge: "PIXEL PRECISION",
  heroTitle: "Extract Perfect Colors.",
  heroTitle2: "Build Stunning Palettes.",
  heroDesc: "Upload an image and hover to pinpoint the exact HEX, RGB, and HSL codes of any pixel. Instantly generate harmonious color palettes for your next design project.",
  feat1Title: "Microscopic Detail",
  feat1Desc: "The built-in magnifying loupe lets you zoom down to individual pixels. No more guessing which shade of blue you are clicking on.",
  feat2Title: "Multiple Formats",
  feat2Desc: "Get your colors instantly converted into HEX, RGB, and HSL formats. Click once to copy to your clipboard and paste directly into your CSS.",
  feat3Title: "Auto-Generate Palettes",
  feat3Desc: "Don't just pick one color. Our AI algorithm analyzes your uploaded image and automatically generates a harmonious 5-color palette based on the most dominant and striking colors present.",
  stepsTag: "WORKFLOW",
  stepsTitle: "Extract in 3 Steps",
  s1Title: "Upload",
  s1Desc: "Load your reference image.",
  s2Title: "Pick",
  s2Desc: "Hover over any pixel and click to capture.",
  s3Title: "Copy",
  s3Desc: "Copy the HEX/RGB values instantly."
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!content.landing) content.landing = {};
    
    // Inject design
    if (!content.landing.design) content.landing.design = {};
    content.landing.design.redesign = { ...designDefaults };

    // Inject rotate
    if (!content.landing.rotate) content.landing.rotate = {};
    content.landing.rotate.redesign = { ...rotateDefaults };

    // Inject picker
    if (!content.landing.picker) content.landing.picker = {};
    content.landing.picker.redesign = { ...pickerDefaults };

    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`[${lang}] Successfully injected new landing redesigns`);
  }
});
