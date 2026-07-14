const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const DELIMITER = ' | ';

// Keys that need translation
const keysToTranslate = [
  "nav.blurface",
  "nav.design",
  "grid.blurfaceDesc",
  "grid.designDesc",
  "landing.default.title.blurface",
  "landing.default.title.design",
  "landing.default.desc.blurface",
  "landing.default.desc.design",
  "blur.options",
  "blur.desc",
  "blur.auto",
  "blur.manual",
  "blur.manualDesc",
  "blur.aiDesc",
  "blur.detecting",
  "blur.detectBtn",
  "blur.intensity",
  "design.settings",
  "design.desc",
  "design.info1",
  "design.saveBtn",
  "design.info2",
  "landing.blurface.why.tag",
  "landing.blurface.why.title",
  "landing.blurface.why.desc",
  "landing.blurface.why.card1.title",
  "landing.blurface.why.card1.desc",
  "landing.blurface.why.card1.badge",
  "landing.blurface.why.card2.title",
  "landing.blurface.why.card2.desc",
  "landing.blurface.why.card2.badge",
  "landing.blurface.why.card3.title",
  "landing.blurface.why.card3.desc",
  "landing.blurface.why.card3.badge",
  "landing.blurface.why.card4.title",
  "landing.blurface.why.card4.desc",
  "landing.blurface.why.card4.badge",
  "landing.blurface.who.tag",
  "landing.blurface.who.title",
  "landing.blurface.who.desc",
  "landing.blurface.who.c1.title",
  "landing.blurface.who.c1.badge",
  "landing.blurface.who.c1.desc",
  "landing.blurface.who.c1.l1",
  "landing.blurface.who.c1.l2",
  "landing.blurface.who.c2.title",
  "landing.blurface.who.c2.badge",
  "landing.blurface.who.c2.desc",
  "landing.blurface.who.c2.l1",
  "landing.blurface.who.c2.l2",
  "landing.blurface.who.c3.title",
  "landing.blurface.who.c3.badge",
  "landing.blurface.who.c3.desc",
  "landing.blurface.who.c3.l1",
  "landing.blurface.who.c3.l2",
  "landing.blurface.who.c4.title",
  "landing.blurface.who.c4.badge",
  "landing.blurface.who.c4.desc",
  "landing.blurface.who.c4.l1",
  "landing.blurface.who.c4.l2",
  "landing.blurface.work.tag",
  "landing.blurface.work.title",
  "landing.blurface.work.desc",
  "landing.blurface.work.s1.title",
  "landing.blurface.work.s1.desc",
  "landing.blurface.work.s2.title",
  "landing.blurface.work.s2.desc",
  "landing.blurface.work.s3.title",
  "landing.blurface.work.s3.desc",
  "landing.blurface.proof.tag",
  "landing.blurface.proof.title",
  "landing.blurface.proof.desc",
  "landing.blurface.proof.q1",
  "landing.blurface.proof.t1.role",
  "landing.blurface.proof.q2",
  "landing.blurface.proof.t2.role",
  "landing.blurface.proof.q3",
  "landing.blurface.proof.t3.role",
  "landing.design.why.tag",
  "landing.design.why.title",
  "landing.design.why.desc",
  "landing.design.why.card1.title",
  "landing.design.why.card1.desc",
  "landing.design.why.card1.badge",
  "landing.design.why.card2.title",
  "landing.design.why.card2.desc",
  "landing.design.why.card2.badge",
  "landing.design.why.card3.title",
  "landing.design.why.card3.desc",
  "landing.design.why.card3.badge",
  "landing.design.why.card4.title",
  "landing.design.why.card4.desc",
  "landing.design.why.card4.badge",
  "landing.design.who.tag",
  "landing.design.who.title",
  "landing.design.who.desc",
  "landing.design.who.c1.title",
  "landing.design.who.c1.badge",
  "landing.design.who.c1.desc",
  "landing.design.who.c1.l1",
  "landing.design.who.c1.l2",
  "landing.design.who.c2.title",
  "landing.design.who.c2.badge",
  "landing.design.who.c2.desc",
  "landing.design.who.c2.l1",
  "landing.design.who.c2.l2",
  "landing.design.who.c3.title",
  "landing.design.who.c3.badge",
  "landing.design.who.c3.desc",
  "landing.design.who.c3.l1",
  "landing.design.who.c3.l2",
  "landing.design.who.c4.title",
  "landing.design.who.c4.badge",
  "landing.design.who.c4.desc",
  "landing.design.who.c4.l1",
  "landing.design.who.c4.l2",
  "landing.design.work.tag",
  "landing.design.work.title",
  "landing.design.work.desc",
  "landing.design.work.s1.title",
  "landing.design.work.s1.desc",
  "landing.design.work.s2.title",
  "landing.design.work.s2.desc",
  "landing.design.work.s3.title",
  "landing.design.work.s3.desc",
  "landing.design.proof.tag",
  "landing.design.proof.title",
  "landing.design.proof.desc",
  "landing.design.proof.q1",
  "landing.design.proof.t1.role",
  "landing.design.proof.q2",
  "landing.design.proof.t2.role",
  "landing.design.proof.q3",
  "landing.design.proof.t3.role"
];

async function translateChunk(text, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map(x => x[0]).join('');
    }
    return '';
  } catch (err) {
    console.error(`Fetch error for ${targetLang}:`, err.message);
    return '';
  }
}

async function run() {
  const enPath = path.join(localesDir, 'en', 'translation.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

  for (const lang of languages) {
    if (lang === 'en') continue;

    const filePath = path.join(localesDir, lang, 'translation.json');
    if (!fs.existsSync(filePath)) continue;
    
    let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Find which keys still need translation (they match English)
    let keysForThisLang = keysToTranslate.filter(k => data[k] && data[k] === enData[k] && data[k].trim() !== '');

    if (keysForThisLang.length === 0) {
      console.log(`[${lang}] All good.`);
      continue;
    }

    console.log(`[${lang}] Translating ${keysForThisLang.length} keys...`);
    
    let currentChunkKeys = [];
    let currentChunkText = "";
    let updated = false;

    for (let i = 0; i < keysForThisLang.length; i++) {
      const key = keysForThisLang[i];
      const text = enData[key];
      
      const newText = currentChunkText ? currentChunkText + DELIMITER + text : text;
      
      if (newText.length > 1500) {
        let res = await translateChunk(currentChunkText, lang);
        let splitRes = res.split(DELIMITER.trim()).map(s => s.trim());
        
        if (splitRes.length === currentChunkKeys.length) {
            for (let j = 0; j < currentChunkKeys.length; j++) {
                data[currentChunkKeys[j]] = splitRes[j];
                updated = true;
            }
        } else {
            // Fallback 1 by 1
            for (const k of currentChunkKeys) {
                let individualRes = await translateChunk(enData[k], lang);
                if (individualRes) {
                    data[k] = individualRes;
                    updated = true;
                }
            }
        }

        currentChunkKeys = [key];
        currentChunkText = text;
      } else {
        currentChunkKeys.push(key);
        currentChunkText = newText;
      }
    }

    if (currentChunkKeys.length > 0) {
        let res = await translateChunk(currentChunkText, lang);
        let splitRes = res.split(DELIMITER.trim()).map(s => s.trim());
        
        if (splitRes.length === currentChunkKeys.length) {
            for (let j = 0; j < currentChunkKeys.length; j++) {
                data[currentChunkKeys[j]] = splitRes[j];
                updated = true;
            }
        } else {
            for (const k of currentChunkKeys) {
                let individualRes = await translateChunk(enData[k], lang);
                if (individualRes) {
                    data[k] = individualRes;
                    updated = true;
                }
            }
        }
    }

    if (updated) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
      console.log(`[${lang}] Saved.`);
    }
  }
}

run().catch(console.error);
