<p align="center">
  <a href="https://helpmyimg.com">
    <img src="public/images.png" alt="HelpMyIMG - Free Local AI Photo Editor" width="800" style="max-width: 100%; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />
  </a>
</p>

<h1 align="center">HelpMyIMG</h1>

<p align="center">
  <strong>100% Free, Private, In-Browser AI Image Editing & Conversion Suite</strong><br>
  <em>Powered by WebAssembly, WebGPU, and HTML5 Canvas — Zero Server Uploads.</em>
</p>

<p align="center">
  <a href="https://helpmyimg.com"><img src="https://img.shields.io/badge/Live%20App-helpmyimg.com-00F2FE?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Live App"></a>
  <a href="https://github.com/codesbykhairannoor/helpmyimg"><img src="https://img.shields.io/badge/License-MIT-4FACFE?style=for-the-badge" alt="License"></a>
  <img src="https://img.shields.io/badge/Privacy-100%25%20Client--Side-10B981?style=for-the-badge&logo=shield" alt="Privacy">
  <img src="https://img.shields.io/badge/Languages-30%20Locales-8B5CF6?style=for-the-badge" alt="i18n">
  <img src="https://img.shields.io/badge/Pricing-Forever%20Free-EC4899?style=for-the-badge" alt="Free">
</p>

---

## 🌟 Overview

**[HelpMyIMG](https://helpmyimg.com)** is an open-source, privacy-first web application designed to replace commercial, predatory photo-editing SaaS tools. Unlike traditional online photo tools that upload your personal files to cloud servers and charge monthly subscription fees, HelpMyIMG executes **100% of its operations locally on your device** using client-side WebAssembly, machine learning models, and high-performance Canvas pipelines.

> 🔒 **Privacy Guarantee:** Your photos never leave your device's RAM. You can disconnect your internet after loading the page, and all tools continue to function at full speed.

---

## 🚀 Live Tools & Direct Links

Explore the full suite of free browser-based tools:

| Tool | Description | Direct Link |
| :--- | :--- | :--- |
| **AI Background Removal** | One-click neural cutout with pixel-perfect edge segmentation. | [Launch Tool](https://helpmyimg.com/remove-background/) |
| **Change Background Color** | Replace backgrounds with formal passport colors (Red, Blue, White) or custom palettes. | [Launch Tool](https://helpmyimg.com/change-background/) |
| **Image Format Converter** | Convert between PNG, JPG, WEBP, AVIF, SVG, ICO, BMP, and GIF with full vector preservation. | [Launch Tool](https://helpmyimg.com/convert-image/) |
| **Lossless Image Compressor** | Shrink file sizes to target sizes (50KB, 100KB, 200KB) without visual degradation. | [Launch Tool](https://helpmyimg.com/compress-image/) |
| **Image Resizer & Scaler** | Resize by dimensions, percentage, or social media presets (Instagram, Passport, etc.). | [Launch Tool](https://helpmyimg.com/resize-image/) |
| **Photo Crop & Rotate** | Freeform and aspect-ratio cropping with arbitrary rotation and flipping. | [Launch Tool](https://helpmyimg.com/crop-image/) |
| **Custom Watermark Generator** | Apply branded stamps, text copyrights, or tiled watermarks with opacity controls. | [Launch Tool](https://helpmyimg.com/watermark-image/) |
| **Face & License Plate Blur** | Anonymize sensitive biometric details and vehicle plates locally. | [Launch Tool](https://helpmyimg.com/blur-face/) |

---

## ⚡ Core Technical Features

- **Local Machine Learning**: In-browser ONNX Runtime / MediaPipe neural models running directly via WebAssembly and WebGPU hardware acceleration.
- **Robust Vector Support**: Full SVG parsing, `viewBox` normalization, and super-sampled rasterization into high-res PNG/JPG/WebP.
- **Multilingual Architecture**: Fully localized across **30 languages** with native fallback resolution, automated sitemaps, and strict `hreflang` compliance.
- **Zero Account Walls**: No logins, no emails, no credit cards, no "credits" limits, and no artificial export throttling.
- **Lossless & Uncapped**: Full original resolution exports without paid "HD" paywalls.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Build**: [Vite 8](https://vitejs.dev/) with Rolldown optimization
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + Custom Glassmorphism UI
- **In-Browser ML**: `@huggingface/transformers`, `@mediapipe/tasks-vision`, `canvas`
- **Internationalization**: `i18next` with 30 production locale dictionaries
- **Deployment**: [Vercel](https://vercel.com/) (Edge Network CDN)

---

## 💻 Local Development Setup

Clone the repository and run the development server locally:

```bash
# Clone the repository
git clone https://github.com/codesbykhairannoor/helpmyimg.git

# Navigate to project directory
cd helpmyimg

# Install dependencies
npm install

# Start Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🏗️ Production Build

```bash
# Generate localized shells, sitemaps, and production bundles
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

This project is open-source under the **[MIT License](LICENSE)**.

---

<p align="center">
  Built with ❤️ for privacy and the open web by <a href="https://github.com/codesbykhairannoor">Khairan Noor</a>.<br>
  <strong>Website:</strong> <a href="https://helpmyimg.com">https://helpmyimg.com</a>
</p>
