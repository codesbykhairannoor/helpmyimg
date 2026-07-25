const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

const redesignData = {
  ar: {
    remove: {
      heroBadge: "أدق تقنية إزالة خلفية ✨",
      heroTitle: "أزل خلفية الصور كالسحر في ثانية واحدة",
      heroDesc: "احصل على صور بخلفية شفافة (PNG) بدقة متناهية بدون تشوهات في حواف الشعر أو الملابس. معالجة محلية 100% مجاناً للأبد.",
      feat1Title: "دقة استثنائية للحواف", feat1Desc: "خوارزميات ذكية تتعرف بدقة على أدق التفاصيل كخصلات الشعر وحواف الملابس المعقدة لقص مثالي.", feat1Badge: "قص مثالي",
      feat2Title: "ذكاء اصطناعي محلي", feat2Desc: "تعمل خوارزميات الذكاء الاصطناعي مباشرة داخل متصفحك للحفاظ على سرية صورك، لا تُرفع أي صورة للإنترنت.", feat2Badge: "أمان 100%",
      feat3Title: "بدون فقدان الجودة", feat3Desc: "احصل على صورتك المفرغة بنفس الدقة والأبعاد الأصلية دون بيكسلات أو تصغير إجباري.", feat3Badge: "جودة أصلية",
      whoTitle: "من يستفيد من التفريغ السحري؟",
      whoDesc: "أداة لا غنى عنها لكل محترف يسعى للحصول على صور نقية وجاهزة للتصميم.",
      who1Title: "متاجر التجارة الإلكترونية", who1Desc: "فرّغ خلفيات المنتجات واستبدلها بخلفية بيضاء احترافية لزيادة المبيعات على أمازون وشوبيفاي.", who1Tags: "منتجات احترافية • كتالوجات جذابة",
      who2Title: "المصورون واستوديوهات التصميم", who2Desc: "اعزل الأشخاص عن الخلفية المعقدة بسهولة لتصميم بوسترات وإعلانات ساحرة دون إضاعة ساعات على الفوتوشوب.", who2Tags: "عزل الأشخاص • دقة في الحواف",
      stepsTitle: "كيف تفرّغ الخلفية؟",
      s1Title: "اسحب الصورة المحددة", s1Desc: "قم بإسقاط صورة الشخص أو المنتج.",
      s2Title: "السحر يعمل", s2Desc: "في ثانية واحدة سيتم فصل الخلفية بدقة عالية.",
      s3Title: "حفظ بصيغة PNG", s3Desc: "حمّل صورتك الشفافة فوراً.",
      proofTitle: "أكثر من 10 مليون صورة مفرغة بنجاح",
      q1: "«جودة القص حول حواف الشعر لا تصدق! أفضل من العديد من البرامج المدفوعة.»",
      q2: "«كون الأداة تعمل محلياً أعطاني ثقة كاملة في تفريغ صور عملائي الخاصة.»",
      q3: "«تفريغ خلفية منتجات متجري أصبح أسرع بكثير ونتائج أكثر دقة.»",
    },
    compress: {
      heroBadge: "أسرع ضاغط صور ⚡",
      heroTitle: "قلّص حجم صورك بنسبة 90% دون فقدان الجودة",
      heroDesc: "تخلص من رسالة 'حجم الملف كبير جداً'. اضغط صورك للتقديم على الوظائف أو لتسريع موقعك بثوانٍ معدودة.",
      feat1Title: "ضغط فوري (0 ملي ثانية)", feat1Desc: "لا توجد طوابير انتظار أو رفع للملفات. يتم ضغط الصورة لحظة اختيارك لها.", feat1Badge: "سرعة خارقة",
      feat2Title: "ضغط للوصول لحجم معين", feat2Desc: "تحكم بحجم الصورة لتصل لأقل من 200 كيلوبايت المطلوبة في البوابات الحكومية.", feat2Badge: "تحكم دقيق",
      feat3Title: "معالجة متعددة (Batch)", feat3Desc: "اسحب ما يصل إلى 10 صور دفعة واحدة واضغطها كلها بضغطة زر واحدة.", feat3Badge: "10 صور معاً",
      whoTitle: "لصناع المحتوى والمحترفين",
      whoDesc: "وفر المساحة وسرّع أعمالك باستخدام أدق ضاغط صور محلي.",
      who1Title: "المتقدمون للوظائف والدوائر الرسمية", who1Desc: "قم بتصغير حجم صور الهوية وجواز السفر إلى أقل من 200 كيلوبايت لتُقبل فوراً في استمارات التقديم.", who1Tags: "ملفات أقل من 200KB • صور رسمية",
      who2Title: "مطوروا المواقع ومدونو السفر", who2Desc: "سرّع تحميل صفحات موقعك عبر استخدام صور خفيفة الوزن تدعم تحسين محركات البحث (SEO).", who2Tags: "سرعة المواقع • تحسين SEO",
      stepsTitle: "كيف تضغط صورك؟",
      s1Title: "اختر الصور", s1Desc: "اسحب الصور الكبيرة لساحة العمل.",
      s2Title: "حدد نسبة الجودة", s2Desc: "حرك الشريط لاختيار الجودة المطلوبة وحجم الملف الناتج.",
      s3Title: "حمّل ملفك الخفيف", s3Desc: "احصل على الصور المضغوطة دفعة واحدة كملف ZIP.",
      proofTitle: "السرعة والجودة التي يعتمد عليها الجميع",
      q1: "«استطعت تقليل حجم صورتي الرسمية إلى 150 كيلوبايت دون أن تبدو مشوشة.»",
      q2: "«سرعة الموقع زادت بشكل ملحوظ بعد ضغط جميع أصول الموقع هنا.»",
      q3: "«القدرة على ضغط 10 صور معاً بصيغة ZIP يوفر علي الكثير من الوقت.»",
    }
  },
  id: {
    remove: {
      heroBadge: "PENGHAPUS BG PALING AKURAT ✨",
      heroTitle: "Hapus Background Foto Sehebat Sihir dalam 1 Detik",
      heroDesc: "Dapatkan foto dengan latar belakang transparan (PNG) berakurasi tinggi tanpa potongan kasar di bagian rambut atau baju. 100% diproses di perangkat Anda (Aman & Gratis).",
      feat1Title: "Pemotongan Rambut Super Detail", feat1Desc: "Algoritma kami dapat mendeteksi helaian rambut yang paling rumit dan tepi pakaian dengan presisi tingkat piksel.", feat1Badge: "Akurasi Pixel",
      feat2Title: "Mesin AI Lokal", feat2Desc: "Seluruh proses deteksi AI bekerja langsung di dalam RAM browser Anda. Tidak ada satu pun foto yang diunggah ke internet.", feat2Badge: "100% Aman",
      feat3Title: "Kualitas Resolusi Asli", feat3Desc: "Tidak seperti situs lain, kami tidak mengecilkan resolusi foto Anda setelah background dihapus.", feat3Badge: "Resolusi Penuh",
      whoTitle: "Siapa yang Butuh Penghapus Background?",
      whoDesc: "Senjata wajib bagi para profesional yang ingin menghasilkan desain visual sempurna dalam hitungan detik.",
      who1Title: "Pemilik Toko Online & E-Commerce", who1Desc: "Hapus latar belakang produk Anda yang berantakan, ganti dengan warna putih bersih untuk meningkatkan daya tarik dan penjualan di Shopee atau Tokopedia.", who1Tags: "Produk Menarik • CTR Tinggi",
      who2Title: "Desainer Grafis & Fotografer", who2Desc: "Isolasi model atau objek dari latar belakang kompleks tanpa perlu menghabiskan berjam-jam menggunakan Pen Tool di Photoshop.", who2Tags: "Desain Bebas • Efisiensi Waktu",
      stepsTitle: "Cara Menghapus Background",
      s1Title: "Masukkan Foto", s1Desc: "Tarik atau unggah foto produk/orang.",
      s2Title: "Proses Ajaib", s2Desc: "Tunggu 1 detik, background lenyap seketika.",
      s3Title: "Simpan PNG", s3Desc: "Unduh hasil transparan resolusi tinggi.",
      proofTitle: "Telah Dipercaya Memotong Lebih dari 10 Juta Foto",
      q1: "«Kualitas potongan di bagian rambutnya benar-benar gila! Jauh lebih rapi dari website berbayar lainnya.»",
      q2: "«Fakta bahwa prosesnya dilakukan secara lokal membuat saya tenang mengunggah foto klien yang rahasia.»",
      q3: "«Sangat membantu saya mengedit foto ratusan produk katalog e-commerce dengan sangat cepat!»",
    },
    compress: {
      heroBadge: "KOMPRESOR TERCEPAT ⚡",
      heroTitle: "Kecilkan Ukuran Foto hingga 90% Tanpa Pecah",
      heroDesc: "Selamat tinggal notifikasi 'Ukuran File Terlalu Besar'. Kompres foto pendaftaran CPNS, Visa, atau aset web Anda menjadi sangat kecil dalam hitungan milidetik.",
      feat1Title: "Kecepatan 0 Milidetik", feat1Desc: "Tidak ada antrean server atau proses unggah/unduh. Kompresi terjadi seketika di perangkat Anda sendiri.", feat1Badge: "Secepat Kilat",
      feat2Title: "Bebas Atur Ukuran File", feat2Desc: "Geser slider untuk menentukan apakah Anda butuh file di bawah 100KB, 200KB, atau sekadar mengurangi resolusi.", feat2Badge: "Fleksibel",
      feat3Title: "Borongan hingga 10 Foto", feat3Desc: "Tarik hingga 10 foto sekaligus, kompres semuanya secara bersamaan, dan unduh bersih dalam 1 file ZIP.", feat3Badge: "Batch Mode",
      whoTitle: "Siapa yang Sering Mengompres Gambar?",
      whoDesc: "Hemat ruang, hemat kuota, dan pastikan file Anda selalu memenuhi syarat unggahan resmi.",
      who1Title: "Pelamar Kerja & Peserta CPNS", who1Desc: "Kecilkan ukuran foto KTP, Ijazah, dan Pas Foto menjadi di bawah 200KB agar sukses diunggah ke portal resmi tanpa gagal.", who1Tags: "Lolos 200KB • Unggah Lancar",
      who2Title: "Blogger & Web Developer", who2Desc: "Kurangi beban server dan tingkatkan skor PageSpeed Insights website Anda dengan menghidangkan gambar yang ringan (WEBP/JPG).", who2Tags: "Loading Web Cepat • SEO Naik",
      stepsTitle: "Cara Mengompres Foto",
      s1Title: "Pilih File Anda", s1Desc: "Pilih satu atau hingga 10 foto sekaligus.",
      s2Title: "Tentukan Kualitas", s2Desc: "Pantau perkiraan ukuran file di layar secara live.",
      s3Title: "Unduh ZIP/Single", s3Desc: "Simpan gambar ringan yang siap pakai.",
      proofTitle: "Solusi File Besar yang Selalu Diandalkan",
      q1: "«Akhirnya saya bisa mengecilkan pas foto CPNS saya menjadi 150KB tanpa merusak wajah sama sekali!»",
      q2: "«Saya mengompres semua aset gambar landing page saya di sini, loading web sekarang terasa instan.»",
      q3: "«Fitur batch compress ZIP-nya sangat menghemat waktu. Dulu saya harus mengompres satu-satu.»",
    }
  },
  en: {
    remove: {
      heroBadge: "MOST ACCURATE BG REMOVER ✨",
      heroTitle: "Remove Image Backgrounds Like Magic in 1 Second",
      heroDesc: "Get pixel-perfect transparent (PNG) images without harsh edges around hair or clothing. 100% client-side local processing, completely free forever.",
      feat1Title: "Extreme Hair-level Precision", feat1Desc: "Our AI algorithms can isolate the most intricate hair strands and complex product edges flawlessly.", feat1Badge: "Pixel Perfect",
      feat2Title: "Local AI Engine", feat2Desc: "The entire AI detection runs directly inside your browser RAM. Your photos are never uploaded to the internet.", feat2Badge: "100% Private",
      feat3Title: "Original HD Resolution", feat3Desc: "Unlike other sites, we never compress or downgrade your photo's resolution after removing the background.", feat3Badge: "Full Quality",
      whoTitle: "Who Needs a Background Remover?",
      whoDesc: "The ultimate weapon for professionals looking to create stunning visual assets in seconds.",
      who1Title: "E-Commerce & Online Store Owners", who1Desc: "Remove cluttered product backgrounds and replace them with solid white to boost Amazon or Shopify conversion rates.", who1Tags: "Clean Listings • High CTR",
      who2Title: "Graphic Designers & Photographers", who2Desc: "Isolate portraits or complex objects seamlessly without wasting hours tracing paths in Photoshop.", who2Tags: "Fast Edits • Creative Freedom",
      stepsTitle: "How to Remove Background",
      s1Title: "Drop Image", s1Desc: "Upload your product or portrait photo.",
      s2Title: "Magic Process", s2Desc: "Wait 1 second, the background vanishes.",
      s3Title: "Save as PNG", s3Desc: "Download your high-resolution cutout.",
      proofTitle: "Trusted to Cut Out Over 10 Million Photos",
      q1: "\"The cutout quality on frizzy hair is insane! Way cleaner than the paid subscriptions I used to have.\"",
      q2: "\"Knowing it processes locally gives me the confidence to upload my clients' confidential portrait shoots.\"",
      q3: "\"Helped me process my entire e-commerce product catalog in a fraction of the time!\"",
    },
    compress: {
      heroBadge: "FASTEST COMPRESSOR ⚡",
      heroTitle: "Reduce Image Size by 90% Without Losing Quality",
      heroDesc: "Say goodbye to 'File too large' errors. Compress your official application photos or web assets to under 200KB in milliseconds.",
      feat1Title: "0 Millisecond Latency", feat1Desc: "No server queues, no upload times, no waiting. Compression happens instantly on your own device.", feat1Badge: "Lightning Fast",
      feat2Title: "Target Exact File Sizes", feat2Desc: "Adjust the quality slider to easily hit strict file size limits like 100KB or 200KB for official portals.", feat2Badge: "Flexible Control",
      feat3Title: "Batch Process up to 10", feat3Desc: "Drop up to 10 photos, compress them simultaneously, and download everything neatly in a single ZIP file.", feat3Badge: "Batch Mode",
      whoTitle: "Who Compresses Images Frequently?",
      whoDesc: "Save storage space, conserve bandwidth, and ensure your files meet strict upload criteria.",
      who1Title: "Job Seekers & Official Applicants", who1Desc: "Shrink your ID, passport photos, and certificates to under 200KB to guarantee successful portal uploads.", who1Tags: "Under 200KB • Portal Ready",
      who2Title: "Web Developers & Bloggers", who2Desc: "Reduce server load and boost your PageSpeed Insights score by serving lightweight, optimized image assets.", who2Tags: "Fast Loading • SEO Boost",
      stepsTitle: "How to Compress Images",
      s1Title: "Select Files", s1Desc: "Choose up to 10 photos simultaneously.",
      s2Title: "Adjust Quality", s2Desc: "Monitor the estimated output file size live.",
      s3Title: "Download ZIP", s3Desc: "Save your lightweight, optimized images.",
      proofTitle: "The Reliable Solution for Large Files",
      q1: "\"Finally got my passport photo down to 150KB without making my face look like a blurry mess!\"",
      q2: "\"I compress all my landing page assets here. The website loads almost instantly now.\"",
      q3: "\"The batch ZIP feature is a lifesaver. It used to take me forever to compress product shots one by one.\"",
    }
  }
};

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    const langDict = redesignData[lang] || redesignData.en;
    
    ['remove', 'compress'].forEach(tool => {
      const td = langDict[tool];
      if (!td) return;
      
      data[`landing.${tool}.redesign.heroBadge`] = td.heroBadge;
      data[`landing.${tool}.redesign.heroTitle`] = td.heroTitle;
      data[`landing.${tool}.redesign.heroDesc`] = td.heroDesc;
      
      data[`landing.${tool}.redesign.feat1Title`] = td.feat1Title;
      data[`landing.${tool}.redesign.feat1Desc`] = td.feat1Desc;
      data[`landing.${tool}.redesign.feat1Badge`] = td.feat1Badge;
      
      data[`landing.${tool}.redesign.feat2Title`] = td.feat2Title;
      data[`landing.${tool}.redesign.feat2Desc`] = td.feat2Desc;
      data[`landing.${tool}.redesign.feat2Badge`] = td.feat2Badge;
      
      data[`landing.${tool}.redesign.feat3Title`] = td.feat3Title;
      data[`landing.${tool}.redesign.feat3Desc`] = td.feat3Desc;
      data[`landing.${tool}.redesign.feat3Badge`] = td.feat3Badge;
      
      data[`landing.${tool}.redesign.whoTitle`] = td.whoTitle;
      data[`landing.${tool}.redesign.whoDesc`] = td.whoDesc;
      
      data[`landing.${tool}.redesign.who1Title`] = td.who1Title;
      data[`landing.${tool}.redesign.who1Desc`] = td.who1Desc;
      data[`landing.${tool}.redesign.who1Tags`] = td.who1Tags;
      
      data[`landing.${tool}.redesign.who2Title`] = td.who2Title;
      data[`landing.${tool}.redesign.who2Desc`] = td.who2Desc;
      data[`landing.${tool}.redesign.who2Tags`] = td.who2Tags;
      
      data[`landing.${tool}.redesign.stepsTitle`] = td.stepsTitle;
      data[`landing.${tool}.redesign.s1Title`] = td.s1Title;
      data[`landing.${tool}.redesign.s1Desc`] = td.s1Desc;
      data[`landing.${tool}.redesign.s2Title`] = td.s2Title;
      data[`landing.${tool}.redesign.s2Desc`] = td.s2Desc;
      data[`landing.${tool}.redesign.s3Title`] = td.s3Title;
      data[`landing.${tool}.redesign.s3Desc`] = td.s3Desc;
      
      data[`landing.${tool}.redesign.proofTitle`] = td.proofTitle;
      data[`landing.${tool}.redesign.q1`] = td.q1;
      data[`landing.${tool}.redesign.q2`] = td.q2;
      data[`landing.${tool}.redesign.q3`] = td.q3;
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Injected redesign sections for ${lang}`);
  }
});
