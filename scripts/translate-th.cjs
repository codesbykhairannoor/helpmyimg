const fs = require('fs');
const path = require('path');

const filePath = path.resolve('src/data/pseoKeywords.ts');
let content = fs.readFileSync(filePath, 'utf-8');

const thTranslations = {
  compress100kb: {
    h1: "บีบอัดรูปภาพให้เหลือ 100KB ในพริบตา",
    description: "บีบอัดรูปภาพ JPG, PNG และ WEBP ของคุณให้มีขนาด 100KB หรือน้อยกว่าได้อย่างง่ายดายโดยไม่สูญเสียคุณภาพ ปลอดภัย 100% ประมวลผลในเบราว์เซอร์ของคุณ",
    extraSectionTitle: "บีบอัดรูปภาพให้เหลือ 100KB ในพริบตา",
    extraSectionDesc: "บีบอัดรูปภาพ JPG, PNG และ WEBP ของคุณให้มีขนาด 100KB หรือน้อยกว่าได้อย่างง่ายดายโดยไม่สูญเสียคุณภาพ ปลอดภัย 100% ประมวลผลในเบราว์เซอร์ของคุณ",
    beforeImageLabel: "ต้นฉบับ 5MB",
    afterImageLabel: "ผลลัพธ์ 98KB"
  },
  compress50kb: {
    h1: "บีบอัดรูปภาพให้เหลือ 50KB ในพริบตา",
    description: "ลดขนาดรูปภาพของคุณให้เหลือต่ำกว่า 50KB อย่างปลอดภัยสำหรับการอัปโหลดเว็บ รูปแบบการประมวลผลขั้นสูงเพื่อรักษาความคมชัด",
    extraSectionTitle: "ลดขนาดรูปภาพให้ต่ำกว่า 50KB",
    extraSectionDesc: "ลดขนาดรูปภาพของคุณให้เหลือต่ำกว่า 50KB อย่างปลอดภัยสำหรับการอัปโหลดเว็บ รูปแบบการประมวลผลขั้นสูงเพื่อรักษาความคมชัด",
    beforeImageLabel: "ต้นฉบับ 3MB",
    afterImageLabel: "ผลลัพธ์ 48KB"
  },
  compress200kb: {
    h1: "บีบอัดรูปภาพให้เหลือ 200KB อย่างรวดเร็ว",
    description: "ปรับให้เหมาะสมสำหรับการอัปโหลดเอกสาร บีบอัดให้ต่ำกว่า 200KB ในขณะที่ยังอ่านง่ายอยู่ ใช้งานออฟไลน์ได้ 100%",
    extraSectionTitle: "บีบอัดต่ำกว่า 200KB สำหรับแบบฟอร์ม",
    extraSectionDesc: "ปรับให้เหมาะสมสำหรับการอัปโหลดเอกสาร บีบอัดให้ต่ำกว่า 200KB ในขณะที่ยังอ่านง่ายอยู่ ใช้งานออฟไลน์ได้ 100%",
    beforeImageLabel: "ต้นฉบับ 8MB",
    afterImageLabel: "ผลลัพธ์ 195KB"
  },
  resizeig: {
    h1: "ปรับขนาดรูปภาพสำหรับ Instagram ทันที",
    description: "ปรับรูปภาพของคุณให้เข้ากับอัตราส่วนของ Instagram (1:1, 4:5, 16:9) ได้อย่างสมบูรณ์แบบโดยไม่ต้องตัดส่วนสำคัญ",
    extraSectionTitle: "ปรับขนาดสำหรับ Instagram ทันที",
    extraSectionDesc: "ปรับรูปภาพของคุณให้เข้ากับอัตราส่วนของ Instagram (1:1, 4:5, 16:9) ได้อย่างสมบูรณ์แบบโดยไม่ต้องตัดส่วนสำคัญ",
    beforeImageLabel: "ขนาดไม่พอดี",
    afterImageLabel: "ขนาด 4:5 สมบูรณ์แบบ"
  },
  removelogo: {
    h1: "ลบโลโก้และลายน้ำออกจากรูปภาพฟรี",
    description: "ลบโลโก้ ข้อความ หรือลายน้ำที่ไม่ต้องการออกจากรูปภาพอย่างชาญฉลาดโดยใช้ AI เฉพาะเบราว์เซอร์ ลบออกในไม่กี่วินาที",
    extraSectionTitle: "ลบโลโก้และลายน้ำอย่างง่ายดาย",
    extraSectionDesc: "ลบโลโก้ ข้อความ หรือลายน้ำที่ไม่ต้องการออกจากรูปภาพอย่างชาญฉลาดโดยใช้ AI เฉพาะเบราว์เซอร์ ลบออกในไม่กี่วินาที",
    beforeImageLabel: "มีโลโก้",
    afterImageLabel: "ลบโลโก้แล้ว"
  }
  // more tools...
};

let lines = content.split('\n');
let currentLang = '';
let currentTool = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  const toolMatch = line.match(/"tool":\s*"([^"]+)"/);
  if (toolMatch) currentTool = toolMatch[1];
  
  const langMatch = line.match(/"lang":\s*"([^"]+)"/);
  if (langMatch) currentLang = langMatch[1];
  
  if (currentLang === 'th' && thTranslations[currentTool]) {
    const t = thTranslations[currentTool];
    
    if (line.includes('"h1":') && t.h1) {
      lines[i] = line.replace(/"h1":\s*"[^"]+"/, `"h1": "${t.h1}"`);
    }
    if (line.includes('"description":') && t.description) {
      lines[i] = line.replace(/"description":\s*"[^"]+"/, `"description": "${t.description}"`);
    }
    if (line.includes('"extraSectionTitle":') && t.extraSectionTitle) {
      lines[i] = line.replace(/"extraSectionTitle":\s*"[^"]+"/, `"extraSectionTitle": "${t.extraSectionTitle}"`);
    }
    if (line.includes('"extraSectionDesc":') && t.extraSectionDesc) {
      lines[i] = line.replace(/"extraSectionDesc":\s*"[^"]+"/, `"extraSectionDesc": "${t.extraSectionDesc}"`);
    }
    if (line.includes('"beforeImageLabel":') && t.beforeImageLabel) {
      lines[i] = line.replace(/"beforeImageLabel":\s*"[^"]+"/, `"beforeImageLabel": "${t.beforeImageLabel}"`);
    }
    if (line.includes('"afterImageLabel":') && t.afterImageLabel) {
      lines[i] = line.replace(/"afterImageLabel":\s*"[^"]+"/, `"afterImageLabel": "${t.afterImageLabel}"`);
    }
  }
}

fs.writeFileSync(filePath, lines.join('\n'));
console.log('Thai translations successfully injected into pseoKeywords.ts!');
