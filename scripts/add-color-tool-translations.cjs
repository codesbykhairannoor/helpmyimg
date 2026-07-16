const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');

const toolTranslations = {
  en: {
    "nav.color": "Change Background Color",
    "grid.colorDesc": "Change passport photo background color to official red/blue or apply studio gradients locally and instantly.",
    "nav.removeBg": "Remove Background"
  },
  id: {
    "nav.color": "Ganti Warna Latar",
    "grid.colorDesc": "Ganti warna latar pas foto menjadi merah/biru resmi atau aplikasikan gradien studio secara lokal dan instan.",
    "nav.removeBg": "Hapus Latar Belakang"
  },
  ja: {
    "nav.color": "背景色変更",
    "grid.colorDesc": "証明写真の背景色を公式の赤や青に変更したり、スタジオグラデーションをブラウザ内で瞬時に適用します。",
    "nav.removeBg": "背景を削除"
  },
  es: {
    "nav.color": "Cambiar Color de Fondo",
    "grid.colorDesc": "Cambia el color de fondo de fotos de pasaporte al rojo/azul oficial o aplica degradados de estudio al instante.",
    "nav.removeBg": "Eliminar Fondo"
  },
  zh: {
    "nav.color": "更换背景色",
    "grid.colorDesc": "将证件照背景色一键更改为官方红/蓝背景，或即时应用摄影棚级渐变效果，全本地安全处理。",
    "nav.removeBg": "去除背景"
  },
  hi: {
    "nav.color": "बैकग्राउंड रंग बदलें",
    "grid.colorDesc": "पासपोर्ट फ़ोटो का बैकग्राउंड रंग तुरंत आधिकारिक लाल/नीले में बदलें या स्टूडियो ग्रेडिएंट लागू करें।",
    "nav.removeBg": "बैकग्राउंड हटाएँ"
  },
  ar: {
    "nav.color": "تغيير لون الخلفية",
    "grid.colorDesc": "قم بتغيير لون خلفية صورة جواز السفر إلى الأحمر/الأزرق الرسمي أو تطبيق تدرجات استوديو احترافية فوراً.",
    "nav.removeBg": "إزالة الخلفية"
  },
  fr: {
    "nav.color": "Changer Couleur Fond",
    "grid.colorDesc": "Changez instantanément la couleur de fond des photos d'identité en rouge/bleu officiel ou appliquez des dégradés.",
    "nav.removeBg": "Supprimer Fond"
  },
  de: {
    "nav.color": "Hintergrundfarbe ändern",
    "grid.colorDesc": "Ändern Sie die Hintergrundfarbe von Passfotos in offizielles Rot/Blau oder wenden Sie Studio-Verläufe an.",
    "nav.removeBg": "Hintergrund entfernen"
  },
  pt: {
    "nav.color": "Mudar Cor do Fundo",
    "grid.colorDesc": "Altere a cor de fundo da foto do passaporte para o vermelho/azul oficial ou aplique gradientes de estúdio.",
    "nav.removeBg": "Remover Fundo"
  },
  ru: {
    "nav.color": "Изменить цвет фона",
    "grid.colorDesc": "Мгновенно меняйте цвет фона фото на документы на официальный красный/синий или применяйте градиенты.",
    "nav.removeBg": "Удалить фон"
  },
  ko: {
    "nav.color": "배경색 변경",
    "grid.colorDesc": "여권 사진 배경색을 공식 빨강/파랑으로 변경하거나 스튜디오 그라데이션을 로컬에서 즉시 적용하세요.",
    "nav.removeBg": "배경 제거"
  }
};

const dirs = fs.readdirSync(localesDir);
let count = 0;

for (const langDir of dirs) {
  const filePath = path.join(localesDir, langDir, 'translation.json');
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const trans = toolTranslations[langDir] || toolTranslations.en;
      
      let modified = false;
      for (const [k, v] of Object.entries(trans)) {
        if (data[k] !== v) {
          data[k] = v;
          modified = true;
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
        count++;
        console.log(`✓ Added color tool keys for [${langDir}]`);
      }
    } catch (e) {
      console.error(`Error processing ${langDir}:`, e);
    }
  }
}

console.log(`\n🎉 Successfully added color tool keys across ${count} language files!`);
