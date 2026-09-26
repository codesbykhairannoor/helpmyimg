const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

async function generateOgImage() {
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // 1. Background: Deep rich dark mesh gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#090D16');
  bgGrad.addColorStop(0.5, '#0B132B');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Ambient glows for depth
  // Top-left cyan/teal glow
  const glow1 = ctx.createRadialGradient(250, 150, 0, 250, 150, 400);
  glow1.addColorStop(0, 'rgba(0, 242, 254, 0.18)');
  glow1.addColorStop(1, 'rgba(0, 242, 254, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  // Bottom-right purple/indigo glow
  const glow2 = ctx.createRadialGradient(950, 480, 0, 950, 480, 450);
  glow2.addColorStop(0, 'rgba(114, 9, 183, 0.22)');
  glow2.addColorStop(1, 'rgba(114, 9, 183, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Subtle border / card contour
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, width - 2, height - 2);

  // 3. Load Logo
  const logoPath = path.join(__dirname, '..', 'public', 'logobaru.png');
  const logoImg = await loadImage(logoPath);

  // Draw logo with glow
  const logoSize = 180;
  const logoX = 100;
  const logoY = 160;

  // Logo drop shadow
  ctx.save();
  ctx.shadowColor = 'rgba(0, 242, 254, 0.4)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;
  ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
  ctx.restore();

  // 4. Texts
  // Brand title
  ctx.font = 'bold 68px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('HelpMyIMG', 320, 230);

  // Badge next to title: "100% FREE"
  const badgeX = 740;
  const badgeY = 175;
  const badgeW = 160;
  const badgeH = 44;
  ctx.fillStyle = 'rgba(0, 242, 254, 0.15)';
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 22);
  ctx.fill();
  ctx.stroke();

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#00F2FE';
  ctx.fillText('100% PRIVATE', badgeX + 16, badgeY + 29);

  // Subtitle / Tagline
  ctx.font = 'bold 36px sans-serif';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText('Free In-Browser AI Photo Editor', 320, 290);

  // Secondary description
  ctx.font = '24px sans-serif';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText('AI Background Removal • Watermark • Compress • Convert', 320, 335);

  // 5. Feature highlight boxes along bottom
  const features = [
    { icon: '🔒', title: 'Zero Server Uploads', desc: '100% processed in browser' },
    { icon: '⚡', title: 'Instant AI Cutout', desc: 'Local WebAssembly / GPU' },
    { icon: '🛡️', title: 'No Signup Required', desc: 'Free & unlimited forever' },
  ];

  const cardY = 430;
  const cardH = 130;
  const cardW = 310;
  const cardGap = 35;
  const startX = 100;

  features.forEach((feat, i) => {
    const x = startX + i * (cardW + cardGap);
    
    // Card background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, cardY, cardW, cardH, 16);
    ctx.fill();
    ctx.stroke();

    // Icon & title
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#F8FAFC';
    ctx.fillText(`${feat.icon}  ${feat.title}`, x + 24, cardY + 48);

    // Card desc
    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.fillText(feat.desc, x + 24, cardY + 85);
  });

  // Export to public/images.png and public/og-image.png
  const buffer = canvas.toBuffer('image/png');
  const target1 = path.join(__dirname, '..', 'public', 'images.png');
  const target2 = path.join(__dirname, '..', 'public', 'og-image.png');
  fs.writeFileSync(target1, buffer);
  fs.writeFileSync(target2, buffer);

  console.log(`Generated professional 1200x630 OG Image at: ${target1}`);
}

generateOgImage().catch(console.error);
