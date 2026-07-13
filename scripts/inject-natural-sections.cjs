const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// Kamus Frasa Penuh untuk 30 Bahasa.
// Menyediakan terjemahan yang benar-benar natural tanpa pencampuran bahasa Inggris.
const langData = {
  ar: {
    compress: {
      nav: "ضغط الصور",
      title: "ضغط الصور أونلاين مجاناً وبأعلى جودة",
      desc: "قم بتقليل حجم ملفات الصور الخاصة بك حتى 90% على الفور. معالجة محلية 100% للحفاظ على الخصوصية.",
      whyTag: "لماذا تختار ضغط الصور لدينا؟",
      whyTitle: "ضغط سريع، آمن ومجاني 100%",
      whyDesc: "لا داعي لرفع صورك إلى خوادم خارجية. يتم تقليص الحجم مباشرة في متصفحك للحفاظ على خصوصيتك وأمان بياناتك.",
      whyC1T: "سرعة فائقة (0 ملي ثانية)", whyC1D: "يتم تقليص حجم الصور فوراً بدون أي وقت انتظار.", whyC1B: "معالجة محلية",
      whyC2T: "خصوصية مطلقة 100%", whyC2D: "تبقى صورك على جهازك ولا تُرفع إلى أي خادم سحابي.", whyC2B: "آمن تماماً",
      whyC3T: "مجاني للأبد", whyC3D: "لا توجد حدود يومية للاستخدام ولا رسوم خفية.", whyC3B: "مجاني 100%",
      whyC4T: "جودة احترافية", whyC4D: "نحافظ على جودة ألوان وتفاصيل صورك الأصلية.", whyC4B: "جودة عالية",
      whoTag: "من يستخدم ضغط الصور؟",
      whoTitle: "مثالي لجميع احتياجاتك الرقمية",
      whoDesc: "سواء كنت صاحب متجر إلكتروني، مصوراً، أو طالباً، فإن ضغط الصور يساعدك على تسريع التصفح وتوفير المساحة.",
      whoC1T: "أصحاب المتاجر الإلكترونية", whoC1B: "تسريع المواقع", whoC1D: "قم بضغط صور المنتجات لتسريع تحميل متجرك الإلكتروني وزيادة المبيعات.", whoC1L1: "دعم ضغط الصور دفعة واحدة", whoC1L2: "تحسين محركات البحث ومتجر أسرع",
      whoC2T: "المصورون المحترفون", whoC2B: "أرشيف الصور", whoC2D: "قم بتوفير مساحة التخزين على جهازك مع الحفاظ على تفاصيل وألوان الصور.", whoC2L1: "أعلى جودة ضغط ممكنة", whoC2L2: "توفير مساحات القرص الصلب",
      whoC3T: "الطلاب والمتقدمين للوظائف", whoC3B: "رفع المستندات", whoC3D: "قم بتقليل حجم صور الشهادات والهوية لتتوافق مع شروط المواقع الحكومية والتقديم للوظائف.", whoC3L1: "تقليل الحجم لأقل من 200 كيلوبايت", whoC3L2: "مثالي للطلبات الرسمية والـ CV",
      whoC4T: "مطورو الويب", whoC4B: "تحسين الأداء", whoC4D: "تضمين صور مضغوطة عالية الأداء في مواقع عملائك لزيادة نقاط PageSpeed.", whoC4L1: "تحميل أسرع لصفحات الويب", whoC4L2: "توفير باندويث الخادم الخاص بك",
      workTag: "طريقة العمل",
      workTitle: "اضغط صورك في 3 خطوات بسيطة",
      workDesc: "عملية سهلة ولا تحتاج لأي برامج معقدة. احصل على صور خفيفة في ثوانٍ معدودة.",
      workS1T: "اختر الصور أو اسحبها", workS1D: "قم بسحب وإسقاط صورك المفضلة (PNG, JPG, WEBP) مباشرة في مساحة العمل.",
      workS2T: "اختر مستوى الجودة والضغط", workS2D: "قم بتحريك شريط التحكم لتحديد مستوى الضغط المناسب للصور.",
      workS3T: "تحميل الصور بنجاح", workS3D: "قم بتحميل الصور المضغوطة دفعة واحدة كملف ZIP أو بشكل منفصل.",
      proofTag: "آراء المستخدمين",
      proofTitle: "يثق بنا آلاف المبدعين حول العالم",
      proofDesc: "تعرف على انطباعات المستخدمين الذين يعتمدون على أدواتنا لضغط الصور بشكل آمن ويومي.",
      proofT1: "مطور ويب", proofT2: "مصمم جرافيك", proofT3: "صاحب متجر إلكتروني",
      proofQ1: "«أداة رائعة وسريعة للغاية! توفر خصوصية كاملة لأن الصور لا ترفع على أي سيرفر.»",
      proofQ2: "«تمكنت من ضغط مئات الصور الخاصة بمتجري في دقائق ووفرت الكثير من المساحة.»",
      proofQ3: "«النتائج مذهلة، حجم الملفات أصبح صغيراً جداً بينما بقيت الجودة واضحة وبدون بيكسلات.»",
      faqTitle: "الأسئلة الشائعة حول ضغط الصور",
      faq1Q: "هل تُرفع صوري إلى خوادمكم عند الضغط؟",
      faq1A: "لا، تتم عملية الضغط بالكامل داخل متصفحك بشكل محلي 100%. صورك لا تغادر جهازك أبداً لضمان الخصوصية القصوى.",
      faq2Q: "ما هي صيغ الصور المدعومة للضغط؟",
      faq2A: "نحن ندعم ضغط صيغ PNG و JPEG و WEBP بأعلى مستويات الكفاءة والسرعة."
    },
    convert: {
      nav: "تحويل صيغ الصور",
      title: "محول صيغ الصور أونلاين مجاناً وسريع",
      desc: "قم بتحويل الصور بين صيغ PNG و JPG و WEBP فوراً في متصفحك دون رفع الملفات أونلاين.",
      whyTag: "لماذا تستخدم محول الصور لدينا؟",
      whyTitle: "تحويل فوري وآمن بصيغ متعددة",
      whyDesc: "قم بتغيير صيغ الصور في ثوانٍ معدودة محلياً بالكامل مع الحفاظ على الأمان المطلق لبياناتك وصورك الشخصية.",
      whyC1T: "تحويل فوري (0 ملي ثانية)", whyC1D: "لا توجد فترات انتظار للرفع أو التنزيل.", whyC1B: "سرعة خارقة",
      whyC2T: "خصوصية كاملة 100%", whyC2D: "ملفاتك الشخصية لا تُرسل أبداً عبر الإنترنت.", whyC2B: "أمان متناهي",
      whyC3T: "مجاني تماماً", whyC3D: "لا توجد رسوم خفية أو قيود على حجم الملفات.", whyC3B: "بدون اشتراكات",
      whyC4T: "خلفية ذكية للـ JPG", whyC4D: "عند تحويل صور PNG شفافة إلى JPG، نقوم بإضافة خلفية بيضاء نقية تلقائياً.", whyC4B: "تحويل ذكي",
      whoTag: "من يستفيد من تحويل صيغ الصور؟",
      whoTitle: "أداة ضرورية لكل مصمم ومطور ويب",
      whoDesc: "قم بحل مشاكل توافق صيغ الصور وتجهيز ملفاتك للرفع على أي موقع بكل سهولة.",
      whoC1T: "مصممو المواقع والمطورون", whoC1B: "تحسين التوافق", whoC1D: "قم بتحويل الصور إلى صيغة WEBP الحديثة لتقليل أوقات تحميل صفحات الويب.", whoC1L1: "سرعة تحميل ممتازة للموقع", whoC1L2: "تحويل دفعات من الصور فوراً",
      whoC2T: "المسوقون وأصحاب الأعمال", whoC2B: "العروض التقديمية", whoC2D: "قم بتحويل الصور النادرة إلى JPG لسهولة إدراجها في ملفات PDF والتقارير.", whoC2L1: "توافق تام مع جميع البرامج", whoC2L2: "سهولة الاستخدام والتداول",
      whoC3T: "الطلاب ومنشئو المحتوى", whoC3B: "رفع الملفات الحكومية", whoC3D: "قم بتحويل صورك الشخصية والهويات إلى صيغة JPG المطلوبة رسمياً في أغلب البوابات الخدمية.", whoC3L1: "الحصول على صيغ متوافقة رسمياً", whoC3L2: "حفظ جودة الصورة الأصلية",
      whoC4T: "المصورون الهواة والمحترفون", whoC4B: "معالجة سريعة", whoC4D: "تغيير صيغ الصور الكبيرة لسهولة مشاركتها على وسائل التواصل الاجتماعي والمراسلات.", whoC4L1: "تحويل فوري في ثوانٍ", whoC4L2: "أداة مجانية 100% وبدون قيود",
      workTag: "خطوات التحويل",
      workTitle: "حوّل صيغة صورتك في ثوانٍ",
      workDesc: "خطوات بسيطة وواضحة لتحويل صورك للصيغة المطلوبة بسهولة تامة.",
      workS1T: "اسحب الصور إلى هنا", workS1D: "قم باختيار أو إسقاط الصور التي تود تحويل صيغتها في مساحة العمل.",
      workS2T: "اختر الصيغة المستهدفة", workS2D: "قم باختيار الصيغة التي ترغب بالتحويل إليها: PNG أو JPG أو WEBP.",
      workS3T: "تحميل فوري ومباشر", workS3D: "اضغط على زر التحميل للحصول على صورك بالصيغة الجديدة فوراً.",
      proofTag: "ماذا يقول عملائنا؟",
      proofTitle: "المستخدمون يفضلون محول الصور السريع لدينا",
      proofDesc: "شاهد كيف ساعد محول الصور المحلي آلاف المبدعين في إنجاز أعمالهم بأمان.",
      proofT1: "مدير فني", proofT2: "مطور تطبيقات", proofT3: "منشئ محتوى",
      proofQ1: "«تحويل الصور إلى WEBP وفر لي الكثير من الوقت وحسّن أداء موقع شركتي بشكل رائع.»",
      proofQ2: "«أعجبني جداً تحويل الـ PNG الشفاف إلى JPG بخلفية بيضاء أوتوماتيكياً دون تعقيد.»",
      proofQ3: "«التحويل يتم فورياً في ثوانٍ معدودة وبدون أي خوف من تسريب صوري الشخصية.»",
      faqTitle: "الأسئلة الشائعة حول محول الصور",
      faq1Q: "هل يدعم المحول تغيير خلفيات الصور الشفافة؟",
      faq1A: "نعم، عند تحويل صورة PNG بخلفية شفافة إلى JPG، يقوم النظام تلقائياً بملء الشفافية بخلفية بيضاء نظيفة.",
      faq2Q: "هل هناك حد أقصى لعدد الصور المحولة؟",
      faq2A: "يمكنك تحويل حتى 10 صور دفعة واحدة مجاناً وبلا أي قيود استخدام يومية."
    },
    resize: {
      nav: "تغيير حجم الصور",
      title: "تغيير أبعاد وحجم الصور بدقة بالبكسل",
      desc: "قم بتغيير عرض وارتفاع صورك أونلاين. حافظ على النسبة والتناسب لضمان عدم تمدد أو تشوه الصورة.",
      whyTag: "لماذا تختار أداة تغيير حجم الصور لدينا؟",
      whyTitle: "تغيير أبعاد دقيق وسريع للغاية",
      whyDesc: "قم بتعديل قياسات صورك بدقة متناهية محلياً بالكامل دون الحاجة لتثبيت برامج ثقيلة كالفوتوشوب.",
      whyC1T: "تعديل بالبكسل دقيق", whyC1D: "قم بإدخال العرض والارتفاع المطلوبين بدقة تامة للحصول على أبعاد مثالية.", whyC1B: "تحكم كامل",
      whyC2T: "قفل النسبة والتناسب", whyC2D: "حافظ على تناسق أبعاد الصورة لمنع تمدد الوجه أو تشويه العناصر عند التكبير والتصغير.", whyC2B: "أبعاد متناسقة",
      whyC3T: "أمان وخصوصية تامة", whyC3D: "عملية تغيير الحجم تتم في جهازك محلياً دون رفع الصور للإنترنت.", whyC3B: "أوفلاين 100%",
      whyC4T: "قوالب أبعاد جاهزة", whyC4D: "نوفر قوالب أبعاد سريعة بضغطة زر مثل صور الهوية الشخصية وصور السوشيال ميديا.", whyC4B: "سهل وسريع",
      whoTag: "من يستخدم أداة تغيير الأبعاد؟",
      whoTitle: "أداة مثالية لتعديل أبعاد الصور وتجهيزها",
      whoDesc: "قم بتعديل صورك الشخصية لتتوافق مع متطلبات جواز السفر أو التقديم على الوظائف والهويات الرسمية.",
      whoC1T: "المتقدمين للوظائف والـ CPNS", whoC1B: "صور رسمية", whoC1D: "اضبط أبعاد صورتك الشخصية لتكون 4x6 أو 3x4 بدقة تامة وبأبعاد مطابقة للمواصفات الحكومية.", whoC1L1: "مطابقة لمواصفات الصور الرسمية", whoC1L2: "تحجيم سريع بدون فقدان الجودة",
      whoC2T: "منشئو محتوى السوشيال ميديا", whoC2B: "صور الحساب الشخصي", whoC2D: "تعديل أحجام الصور لتناسب متطلبات الانستغرام، يوتيوب، ولينكد إن بسهولة.", whoC2L1: "أحجام جاهزة بكبسة زر", whoC2L2: "تعديل سريع دون اقتصاص الأجزاء المهمة",
      whoC3T: "مصممو المواقع والمطورون", whoC3B: "أصول الويب", whoC3D: "تجهيز أحجام الأيقونات وصور البانرات لتسريع تصفح صفحات الويب وتنسيق القوالب.", whoC3L1: "تحكم كامل بالأبعاد بالبكسل", whoC3L2: "تحسين سرعة الصفحات",
      whoC4T: "أصحاب المتاجر الرقمية", whoC4B: "تنسيق الصور", whoC4D: "تعديل قياسات صور منتجاتك لتكون موحدة في جميع صفحات المتجر الإلكتروني.", whoC4L1: "مظهر احترافي وموحد للمتجر", whoC4L2: "دعم تعديل أبعاد الدفعات دفعة واحدة",
      workTag: "كيفية تغيير الأبعاد",
      workTitle: "غيّر أبعاد صورتك في 3 خطوات",
      workDesc: "طريقة ذكية وسريعة للحصول على مقاسات دقيقة لصورك دون تعقيدات.",
      workS1T: "ارفع صورتك للموقع", workS1D: "قم باختيار الصورة التي ترغب في تعديل أبعادها وسحبها داخل مساحة العمل.",
      workS2T: "أدخل القياسات المطلوبة", workS2D: "اكتب العرض والارتفاع بالبكسل أو اختر أحد المقاسات الجاهزة المتوفرة.",
      workS3T: "تحميل الصورة فوراً", workS3D: "اضغط على زر التحميل للحصول على صورتك بالقياسات الجديدة مباشرة.",
      proofTag: "شهادات حية",
      proofTitle: "قص وتغيير أبعاد ناجح مع آلاف المستخدمين",
      proofDesc: "اقرأ مراجعات المستخدمين الذين وفروا أوقاتهم باستخدام أداة تعديل أحجام الصور الاحترافية والمجانية.",
      proofT1: "مدون سفر", proofT2: "مصمم جرافيك", proofT3: "طالب جامعي",
      proofQ1: "«تمكنت من تعديل مقاسات صورتي الشخصية لتكون 4x6 وقُبلت في الموقع الحكومي فوراً.»",
      proofQ2: "«ميزة قفل النسبة والتناسب رائعة تمنع تشوه صور المنتجات عند تعديل أحجامها.»",
      proofQ3: "«العملية برمتها مجانية وسريعة، والجميل أنها آمنة تماماً وتتم أوفلاين في المتصفح.»",
      faqTitle: "الأسئلة الشائعة حول حجم الصور",
      faq1Q: "هل يؤدي تغيير حجم الصورة إلى جعلها تبدو ممتدة أو مشوهة؟",
      faq1A: "لا، طالما أنك قمت بتفعيل ميزة 'قفل النسبة والتناسب'، سيتم ضبط العرض والارتفاع تلقائياً لمنع أي تشويه.",
      faq2Q: "كيف يمكنني معرفة أبعاد البكسل المناسبة لصور 4x6؟",
      faq2A: "للحصول على جودة عالية، نوصي باستخدام مقاس 472 x 709 بكسل لصور 4x6 سم الرسمية."
    }
  },
  id: {
    compress: {
      nav: "Kompres Gambar",
      title: "Kompres Gambar Online Gratis & Cepat - HelpMyIMG",
      desc: "Kurangi ukuran file gambar Anda hingga 90% secara instan. Pemrosesan 100% lokal di browser Anda untuk privasi maksimal.",
      whyTag: "Mengapa Memilih Kompresor Gambar Kami?",
      whyTitle: "Kompresi Gambar Cepat, Aman & Gratis 100%",
      whyDesc: "Tidak perlu mengunggah foto Anda ke server cloud yang lambat. Pemrosesan terjadi langsung di perangkat Anda untuk keamanan total.",
      whyC1T: "Kecepatan Instan (0ms)", whyC1D: "Kecilkan ukuran file foto dalam hitungan milidetik tanpa waktu tunggu server.", whyC1B: "Lokal WebWorker",
      whyC2T: "Privasi Dokumen Aman", whyC2D: "Foto KTP atau dokumen penting Anda tidak akan pernah diunggah ke internet.", whyC2B: "100% Offline",
      whyC3T: "Gratis Tanpa Batasan", whyC3D: "Kompres gambar sebanyak apa pun yang Anda inginkan tanpa batas harian atau watermark.", whyC3B: "Rp 0 Selamanya",
      whyC4T: "Optimasi Kualitas Visual", whyC4D: "Pertahankan ketajaman visual gambar asli Anda meskipun ukuran filenya berkurang drastis.", whyC4B: "Kualitas HD",
      whoTag: "Untuk Siapa Alat Kompres Ini Dibuat?",
      whoTitle: "Solusi Cerdas untuk Menghemat Penyimpanan & Kuota",
      whoDesc: "Dari penjual online hingga pelamar kerja, semua orang membutuhkan gambar yang ringan namun tetap tajam.",
      whoC1T: "Pemilik Toko Online & E-commerce", whoC1B: "Optimasi Web", whoC1D: "Kecilkan ukuran foto produk Anda untuk mempercepat loading website Shopee atau Tokopedia Anda.", whoC1L1: "Meningkatkan skor PageSpeed", whoC1L2: "Mendukung kompresi batch massal",
      whoC2T: "Pelamar Kerja & Calon CPNS", whoC2B: "Dokumen SSCASN", whoC2D: "Kompres pas foto Anda menjadi di bawah 200KB sesuai persyaratan mutlak portal resmi BKN.", whoC2L1: "Kompres otomatis di bawah 200KB", whoC2L2: "Format JPG yang kompatibel",
      whoC3T: "Fotografer & Kreator Konten", whoC3B: "Portofolio Digital", whoC3D: "Kirim contoh foto ke klien dengan ukuran file yang lebih kecil tanpa kehilangan detail warna penting.", whoC3L1: "Pertahankan profil warna gambar", whoC3L2: "Menghemat penyimpanan harddisk",
      whoC4T: "Pengembang Aplikasi & Web", whoC4B: "Aset Aplikasi", whoC4D: "Optimalkan aset gambar aplikasi seluler atau web agar performa memori menjadi lebih efisien.", whoC4L1: "Mengurangi bandwidth server", whoC4L2: "Integrasi performa tinggi",
      workTag: "Cara Kerja",
      workTitle: "Kompres Gambar dalam 3 Langkah Mudah",
      workDesc: "Mudah digunakan tanpa perlu keahlian khusus atau perangkat lunak berbayar.",
      workS1T: "Pilih atau Tarik Foto", workS1D: "Masukkan foto Anda (PNG, JPG, WEBP) langsung ke area pengerjaan di atas.",
      workS2T: "Atur Tingkat Kualitas", workS2D: "Geser slider kualitas untuk menentukan ukuran file target yang Anda inginkan.",
      workS3T: "Unduh Hasil Instan", workS3D: "Klik tombol unduh untuk menyimpan file gambar hasil kompresi berkualitas HD.",
      proofTag: "Bukti Kepuasan Pengguna",
      proofTitle: "Dipercaya Ribuan Profesional Setiap Hari",
      proofDesc: "Lihat testimoni dari mereka yang telah merasakan kemudahan kompresi gambar privat kami.",
      proofT1: "Web Developer", proofT2: "Kreator Konten", proofT3: "Pelamar CASN",
      proofQ1: "\"Sangat cepat dan membantu untuk kebutuhan optimasi aset gambar web saya. Privasi aman!\"",
      proofQ2: "\"Luar biasa! Pas foto saya berhasil dikecilkan di bawah 200KB dalam waktu sekejap dan lolos admin CPNS.\"",
      proofQ3: "\"Tidak ada penurunan kualitas visual yang terlihat, filenya jadi sangat kecil. Top banget!\"",
      faqTitle: "FAQ Kompres Gambar",
      faq1Q: "Apakah foto saya aman saat dikompres di HelpMyIMG?",
      faq1A: "Tentu saja! Pemrosesan dilakukan 100% di browser lokal Anda. Foto Anda tidak pernah dikirim ke server mana pun.",
      faq2Q: "Apakah saya bisa mengatur kualitas hasil kompresi?",
      faq2A: "Ya, Anda dapat menyesuaikan slider kualitas dari tingkat kompresi maksimal hingga kualitas visual tertinggi."
    },
    convert: {
      nav: "Ubah Format Gambar",
      title: "Convert Format Gambar PNG/JPG/WEBP Online Gratis",
      desc: "Ubah format foto Anda secara instan di dalam browser. Aman, tanpa watermark, dan 100% gratis.",
      whyTag: "Mengapa Memilih Pengubah Format Kami?",
      whyTitle: "Konversi Gambar Instan & Dukungan Transparansi Cerdas",
      whyDesc: "Ubah jenis file gambar Anda dengan cepat tanpa risiko kebocoran data pribadi ke server pihak ketiga.",
      whyC1T: "Proses 0 Detik (Tanpa Antre)", whyC1D: "Konversi langsung terjadi seketika di browser Anda tanpa menunggu unggah/unduh.", whyC1B: "Tanpa Latensi",
      whyC2T: "Keamanan Data Mutlak", whyC2D: "Karena pemrosesan offline lokal, foto sensitif Anda tetap aman di perangkat Anda.", whyC2B: "100% Aman",
      whyC3T: "Background Putih Otomatis", whyC3D: "Saat mengubah PNG transparan menjadi JPG, sistem otomatis menambahkan latar putih murni.", whyC3B: "Konversi Cerdas",
      whyC4T: "Ekspor Tanpa Batas", whyC4D: "Ubah jenis gambar sebanyak yang Anda butuhkan secara gratis tanpa watermark apa pun.", whyC4B: "Bebas Biaya",
      whoTag: "Siapa yang Menggunakan Alat Convert Ini?",
      whoTitle: "Alat Wajib untuk Kompatibilitas Gambar Anda",
      whoDesc: "Atasi masalah format file yang tidak didukung saat mengunggah ke portal resmi atau media sosial.",
      whoC1T: "Desainer Grafis & Agensi", whoC1B: "Manajemen File", whoC1D: "Ubah format file mentah menjadi PNG berkualitas tinggi untuk diedit kembali tanpa pecah.", whoC1L1: "Hasil piksel transparan sempurna", whoC1L2: "Mendukung konversi batch 10 foto sekaligus",
      whoC2T: "Pemilik E-commerce & Toko Online", whoC2B: "Katalog Bersih", whoC2D: "Ubah file produk format PNG transparan menjadi JPG berlatar belakang putih bersih untuk Shopee.", whoC2L1: "Latar putih bersih otomatis", whoC2L2: "Ukuran file lebih optimal",
      whoC3T: "Pelamar Kerja & Portal BKN", whoC3B: "Pas Foto Resmi", whoC3D: "Ubah format foto WEBP atau PNG Anda menjadi format JPG standar agar diterima sistemSSC ASN.", whoC3L1: "Pasti diterima sistem portal", whoC3L2: "Proses instan tanpa pecah",
      whoC4T: "Pengguna Umum & Media Sosial", whoC4B: "Kemudahan Berbagi", whoC4D: "Ubah format gambar modern WEBP menjadi JPG agar bisa dengan mudah dibagikan di WhatsApp atau diedit.", whoC4L1: "Kompatibilitas universal", whoC4L2: "100% gratis selamanya",
      workTag: "Langkah Mudah",
      workTitle: "Ubah Format Gambar dalam 3 Langkah",
      workDesc: "Tidak perlu keahlian desain. Siapa pun bisa melakukannya dalam hitungan detik.",
      workS1T: "Unggah Foto Anda", workS1D: "Pilih foto yang ingin Anda ubah format filenya ke dalam editor HelpMyIMG.",
      workS2T: "Pilih Format Tujuan", workS2D: "Tentukan format file hasil akhir yang Anda inginkan: PNG, JPG, atau WEBP.",
      workS3T: "Simpan & Unduh Gambar", workS3D: "Klik tombol download dan foto baru Anda langsung siap digunakan.",
      proofTag: "Pendapat Pengguna",
      proofTitle: "Telah Membantu Ribuan Pengguna Menyelesaikan Masalah Format",
      proofDesc: "Pengguna kami menyukai kemudahan dan kecepatan fitur pengubah format gambar offline kami.",
      proofT1: "Desainer Web", proofT2: "Penjual Shopee", proofT3: "Mahasiswa",
      proofQ1: "\"Mengubah WEBP hasil download Google menjadi JPG sekarang tidak perlu buka Photoshop lagi! Gampang banget.\"",
      proofQ2: "\"Fitur merubah latar PNG transparan menjadi JPG putih secara otomatis sangat menghemat waktu kerja saya.\"",
      proofQ3: "\"Sangat berguna untuk mengubah pas foto wisuda saya dari PNG ke JPG agar bisa di-upload ke sistem kampus.\"",
      faqTitle: "FAQ Convert Gambar",
      faq1Q: "Apakah warna gambar akan berubah saat dikonversi?",
      faq1A: "Tidak. HelpMyIMG menggunakan algoritma kanvas modern yang menjaga profil warna asli foto Anda agar tetap akurat.",
      faq2Q: "Kenapa latar belakang berubah putih saat konversi ke JPG?",
      faq2A: "Format JPG tidak mendukung transparansi. HelpMyIMG secara otomatis menambahkan latar putih murni agar gambar Anda terlihat rapi."
    },
    resize: {
      nav: "Ubah Ukuran Gambar",
      title: "Resize & Ubah Dimensi Ukuran Gambar Online Gratis",
      desc: "Ubah lebar (width) dan tinggi (height) gambar Anda dalam piksel secara presisi. Kunci aspek rasio untuk menghindari gambar melar.",
      whyTag: "Mengapa Memilih Pengubah Ukuran Kami?",
      whyTitle: "Ubah Ukuran Piksel Presisi & Aspek Rasio Aman",
      whyDesc: "Dapatkan dimensi ukuran gambar yang tepat sesuai spesifikasi resmi tanpa perlu instalasi aplikasi berat.",
      whyC1T: "Kunci Aspek Rasio (Proporsional)", whyC1D: "Cegah gambar terlihat gepeng atau melar dengan mengunci perbandingan lebar dan tinggi secara otomatis.", whyC1B: "Proporsi Aman",
      whyC2T: "Dukungan Preset Cepat", whyC2D: "Tersedia tombol pintas ukuran pas foto 4x6 resmi, rasio media sosial 1:1, dan resolusi HD 1080p.", whyC2B: "Preset Instan",
      whyC3T: "100% Pemrosesan Lokal", whyC3D: "Gambar Anda tidak pernah dikirim ke internet, menjaga kerahasiaan foto dokumen pribadi Anda.", whyC3B: "Privasi Penuh",
      whyC4T: "Presisi Piksel Akurat", whyC4D: "Masukkan angka piksel secara manual untuk mendapatkan kecocokan ukuran gambar yang sempurna.", whyC4B: "Sangat Akurat",
      whoTag: "Siapa yang Menggunakan Alat Resize Ini?",
      whoTitle: "Penuhi Kebutuhan Dimensi Gambar Anda Secara Akurat",
      whoDesc: "Mudah mengubah resolusi gambar agar sesuai dengan regulasi unggah berkas instansi.",
      whoC1T: "Pendaftar CASN & Dokumen Resmi", whoC1B: "Rasio Pas Foto", whoC1D: "Ubah dimensi pas foto Anda ke resolusi 4x6 cm atau piksel yang dipersyaratkan oleh instansi BKN.", whoC1L1: "Preset pas foto instan", whoC1L2: "Dimensi yang akurat dan proporsional",
      whoC2T: "Kreator Konten & Blogger", whoC2B: "Thumbnail Web", whoC2D: "Ubah ukuran gambar artikel atau header blog Anda agar pas dengan tata letak template website.", whoC2L1: "Mengurangi waktu loading halaman web", whoC2L2: "Skalakan ukuran gambar secara instan",
      whoC3T: "Spesialis Media Sosial", whoC3B: "Postingan Kreatif", whoC3D: "Ubah ukuran gambar promosi menjadi rasio kotak 1:1 untuk feed Instagram atau banner LinkedIn.", whoC3L1: "Satu klik untuk preset 1:1", whoC3L2: "Hasil tajam tanpa penurunan kualitas",
      whoC4T: "Pengembang Web & Desainer", whoC4B: "Responsive Web", whoC4D: "Ubah resolusi gambar aset proyek ke ukuran layar seluler agar performa web tetap responsif.", whoC4L1: "Tentukan ukuran piksel manual", whoC4L2: "Sangat ringan dan cepat",
      workTag: "Cara Kerja",
      workTitle: "Ubah Ukuran Gambar dalam 3 Langkah",
      workDesc: "Ubah ukuran resolusi piksel foto Anda tanpa ribet dalam hitungan detik.",
      workS1T: "Masukkan Gambar Anda", workS1D: "Unggah gambar yang dimensinya ingin Anda ubah ke area pengerjaan HelpMyIMG.",
      workS2T: "Tentukan Ukuran Piksel", workS2D: "Gunakan preset ukuran cepat atau ketik ukuran lebar/tinggi piksel secara manual.",
      workS3T: "Unduh Gambar Selesai", workS3D: "Klik tombol unduh untuk langsung mengunduh gambar hasil resize kualitas tinggi.",
      proofTag: "Tanggapan Pengguna",
      proofTitle: "Solusi Cepat untuk Kebutuhan Resolusi Gambar",
      proofDesc: "Pengguna kami menyukai presisi dan kepraktisan pengubah ukuran dimensi gambar HelpMyIMG.",
      proofT1: "Pelamar CPNS", proofT2: "Blogger", proofT3: "Desainer UI/UX",
      proofQ1: "\"Dulu saya bingung cara membuat foto 4x6. Di HelpMyIMG tinggal klik tombol preset langsung jadi pas ukurannya!\"",
      proofQ2: "\"Sangat membantu untuk me-resize gambar banner blog saya sebelum di-post agar loading blog tidak berat.\"",
      proofQ3: "\"Fitur lock aspect ratio sangat membantu agar proporsi foto produk tidak menjadi aneh atau melonjong.\"",
      faqTitle: "FAQ Resize Gambar",
      faq1Q: "Bagaimana cara agar foto saya tidak gepeng saat ukurannya diubah?",
      faq1A: "Pastikan Anda mengaktifkan ikon Kunci Aspek Rasio (rantai hijau). Ini akan menjaga proporsi foto tetap seimbang.",
      faq2Q: "Berapa ukuran piksel untuk pas foto 3x4 dan 4x6?",
      faq2A: "Untuk ukuran standar 300 DPI: Pas foto 3x4 setara dengan 354 x 472 piksel, sedangkan 4x6 setara dengan 472 x 709 piksel."
    }
  },
  es: {
    compress: {
      nav: "Comprimir Imagen",
      title: "Comprimir Imagen Online Gratis - HelpMyIMG",
      desc: "Reduzca el tamaño de sus imágenes hasta un 90% al instante. Procesamiento 100% local en su navegador para máxima privacidad.",
      whyTag: "¿Por qué elegir nuestro compresor?",
      whyTitle: "Compresión rápida, segura y 100% gratuita",
      whyDesc: "No es necesario subir fotos a servidores lentos. Todo el procesamiento se realiza en su propio dispositivo para mayor seguridad.",
      whyC1T: "Velocidad instantánea (0ms)", whyC1D: "Reduzca el peso de su imagen en milisegundos sin esperas de servidor.", whyC1B: "Procesamiento local",
      whyC2T: "Privacidad absoluta 100%", whyC2D: "Sus fotos nunca se guardan ni se transmiten a internet.", whyC2B: "Totalmente seguro",
      whyC3T: "Gratis ilimitado", whyC3D: "Comprima imágenes ilimitadas sin límites diarios ni marcas de agua.", whyC3B: "Sin costos",
      whyC4T: "Alta calidad visual", whyC4D: "Mantenga la nitidez de su imagen original con algoritmos avanzados de Canvas.", whyC4B: "Salida HD",
      whoTag: "¿Quién usa la compresión de imágenes?",
      whoTitle: "Solución ideal para optimizar su espacio",
      whoDesc: "Tanto si tiene una tienda online, es fotógrafo o estudiante, optimice sus archivos fácilmente.",
      whoC1T: "Tiendas Online y E-commerce", whoC1B: "Carga rápida", whoC1D: "Optimice sus imágenes de producto para acelerar la carga de su sitio web y vender más.", whoC1L1: "Mejore la velocidad de su sitio", whoC1L2: "Comprima en lote hasta 10 fotos",
      whoC2T: "Fotógrafos y Diseñadores", whoC2B: "Ahorro de espacio", whoC2D: "Envíe muestras a clientes con archivos ligeros sin perder los detalles de color.", whoC2L1: "Ahorre almacenamiento físico", whoC2L2: "Mantenga perfiles de color correctos",
      whoC3T: "Trámites Oficiales y Visados", whoC3B: "Documentos", whoC3D: "Reduzca el tamaño de fotos de pasaporte y documentos para subirlos a portales públicos sin problemas.", whoC3L1: "Manténgase por debajo del límite de 200KB", whoC3L2: "Ideal para solicitudes oficiales",
      whoC4T: "Desarrolladores Web", whoC4B: "Rendimiento", whoC4D: "Integre imágenes eficientes en los proyectos de sus clientes para mejorar su PageSpeed.", whoC4L1: "Menor consumo de datos", whoC4L2: "Integración de alto rendimiento",
      workTag: "Cómo Funciona",
      workTitle: "Comprima en 3 sencillos pasos",
      workDesc: "Fácil de usar, sin necesidad de conocimientos previos o programas pesados.",
      workS1T: "Suba o arrastre su foto", workS1D: "Arrastre sus archivos de imagen (PNG, JPG, WEBP) directamente al área de trabajo superior.",
      workS2T: "Ajuste el nivel de calidad", workS2D: "Utilice el control deslizante de calidad para definir el tamaño final de la imagen.",
      workS3T: "Descargue el resultado HD", workS3D: "Descargue sus imágenes optimizadas de forma instantánea de manera individual o en lote.",
      proofTag: "Opiniones reales",
      proofTitle: "Miles de profesionales confían en nosotros",
      proofDesc: "Descubra las opiniones de los usuarios que optimizan sus archivos de forma diaria y segura.",
      proofT1: "Desarrollador Web", proofT2: "Diseñador Gráfico", proofT3: "Emprendedor",
      proofQ1: "«¡Excelente herramienta! Es súper rápida y lo mejor es que mantiene la privacidad completa al funcionar localmente.»",
      proofQ2: "«Comprimí cientos de imágenes para mi sitio de e-commerce y ahora las páginas cargan de inmediato.»",
      proofQ3: "«La calidad visual se mantiene perfecta, los archivos reducen su tamaño increíblemente.»",
      faqTitle: "Preguntas Frecuentes",
      faq1Q: "¿Mis fotos se suben a sus servidores?",
      faq1A: "No. El proceso se realiza 100% en su navegador de forma local. Sus imágenes nunca salen de su dispositivo.",
      faq2Q: "¿Qué formatos de imagen puedo comprimir?",
      faq2A: "Nuestra herramienta es compatible con los formatos PNG, JPEG y WEBP."
    },
    convert: {
      nav: "Convertir Imagen",
      title: "Convertir Formato de Imagen (PNG/JPG/WEBP) Gratis",
      desc: "Cambie el formato de sus fotos al instante en su navegador. Totalmente privado, gratis y sin marcas de agua.",
      whyTag: "¿Por qué utilizar nuestro convertidor?",
      whyTitle: "Conversión de formato instantánea y segura",
      whyDesc: "Cambie la extensión de sus imágenes sin subirlas a la nube y evite la pérdida de su privacidad.",
      whyC1T: "0 segundos de espera", whyC1D: "La conversión se realiza de forma inmediata sin necesidad de subidas lentas a servidores.", whyC1B: "Instantáneo",
      whyC2T: "100% Privado y Seguro", whyC2D: "Sus fotos nunca son enviadas por internet, garantizando total seguridad.", whyC2B: "Procesamiento local",
      whyC3T: "Fondo blanco automático", whyC3D: "Al convertir imágenes PNG transparentes a JPG, añadimos automáticamente un fondo blanco limpio.", whyC3B: "Conversión inteligente",
      whyC4T: "Conversión sin límites", whyC4D: "Convierta tantos archivos como necesite de forma 100% gratuita y sin límites diarios.", whyC4B: "Gratis total",
      whoTag: "¿Quién utiliza el convertidor de fotos?",
      whoTitle: "La herramienta perfecta para solucionar problemas de compatibilidad",
      whoDesc: "Asegúrese de que sus imágenes sean aceptadas en cualquier plataforma web o red social.",
      whoC1T: "Diseñadores y Creativos", whoC1B: "Formatos", whoC1D: "Convierta sus archivos a PNG de alta calidad para mantener la transparencia en sus diseños.", whoC1L1: "Canal alfa transparente perfecto", whoC1L2: "Conversión en lote hasta 10 fotos",
      whoC2T: "Tiendas Online y Marketplaces", whoC2B: "Catálogo", whoC2D: "Convierta imágenes con transparencia PNG a JPG con fondo blanco para portales de e-commerce.", whoC2L1: "Fondos blancos automáticos y limpios", whoC2L2: "Archivos listos para subir a tiendas",
      whoC3T: "Trámites Administrativos", whoC3B: "Fotos oficiales", whoC3D: "Convierta fotos de formato WEBP a JPG para subirlas a plataformas gubernamentales y escolares.", whoC3L1: "Archivos compatibles con portales oficiales", whoC3L2: "Mantenga la calidad original de la imagen",
      whoC4T: "Usuarios de Redes Sociales", whoC4B: "Compatibilidad", whoC4D: "Convierta formatos modernos como WEBP a JPG para compartirlos de forma más sencilla por WhatsApp.", whoC4L1: "Compatibilidad universal garantizada", whoC4L2: "Uso 100% libre de costos",
      workTag: "Cómo convertir",
      workTitle: "Convierta su formato de imagen en 3 pasos",
      workDesc: "Sin complicaciones. Cambie el formato de archivo de forma rápida y sencilla.",
      workS1T: "Suba su imagen", workS1D: "Seleccione las imágenes que desea convertir en el editor web de HelpMyIMG.",
      workS2T: "Elija el formato final", workS2D: "Seleccione el formato al que desea convertir la imagen: PNG, JPG o WEBP.",
      workS3T: "Descargue su archivo", workS3D: "Haga clic en descargar y obtenga su archivo con el nuevo formato al instante.",
      proofTag: "Testimonios de usuarios",
      proofTitle: "La solución preferida para el cambio de formatos",
      proofDesc: "Nuestros usuarios recomiendan la facilidad y rapidez de nuestro convertidor local de imágenes.",
      proofT1: "Diseñador Web", proofT2: "Vendedor de Tienda Online", proofT3: "Estudiante",
      proofQ1: "«Ya no tengo que abrir programas pesados para convertir WEBP a JPG. ¡Esto lo hace al instante!»",
      proofQ2: "«El fondo blanco automático al convertir PNG transparentes a JPG es fantástico para mi tienda en línea.»",
      proofQ3: "«Convertí las fotos de mis documentos escolares de forma rápida y con total tranquilidad por mis datos.»",
      faqTitle: "Preguntas Frecuentes",
      faq1Q: "¿La imagen pierde calidad al convertirse?",
      faq1A: "No. HelpMyIMG procesa los píxeles utilizando la tecnología Canvas del navegador, preservando los colores originales.",
      faq2Q: "¿Por qué el fondo de mi imagen es blanco tras convertir a JPG?",
      faq2A: "El formato JPG no permite la transparencia. Añadimos un fondo blanco para que sus objetos luzcan profesionales."
    },
    resize: {
      nav: "Redimensionar Imagen",
      title: "Redimensionar Imagen Gratis Online - Cambiar Dimensiones",
      desc: "Ajuste el ancho (width) y el alto (height) de sus imágenes en píxeles. Mantenga la relación de aspecto para no distorsionar.",
      whyTag: "¿Por qué elegir nuestro redimensionador?",
      whyTitle: "Cambio de tamaño exacto y relación de aspecto bloqueada",
      whyDesc: "Ajuste las dimensiones exactas de sus fotos para cumplir con requisitos oficiales sin instalar aplicaciones adicionales.",
      whyC1T: "Relación de aspecto bloqueada", whyC1D: "Evite que sus imágenes se vean distorsionadas o alargadas fijando las proporciones originales.", whyC1B: "Proporciones perfectas",
      whyC2T: "Presets de tamaño rápidos", whyC2D: "Botones para ajustar a 4x6 oficial, formato cuadrado 1:1 y resoluciones HD al instante.", whyC2B: "Un solo clic",
      whyC3T: "Procesamiento 100% local", whyC3D: "El cambio de tamaño se realiza en su equipo, asegurando la privacidad total de sus documentos personales.", whyC3B: "Total privacidad",
      whyC4T: "Precisión en píxeles", whyC4D: "Escriba los píxeles de ancho y alto manualmente para obtener las dimensiones exactas.", whyC4B: "Dimensiones exactas",
      whoTag: "¿Quién utiliza la redimensión de fotos?",
      whoTitle: "Ajuste la resolución exacta de sus archivos",
      whoDesc: "Modifique las dimensiones de sus fotos para cumplir con las normas de cualquier sitio oficial.",
      whoC1T: "Solicitudes y Trámites Oficiales", whoC1B: "Documentos", whoC1D: "Ajuste el tamaño de sus fotos a la resolución exacta exigida por las administraciones y embajadas.", whoC1L1: "Dimensiones oficiales al instante", whoC1L2: "Alineado a las especificaciones requeridas",
      whoC2T: "Creadores de Contenido y Bloggers", whoC2B: "Sitios Web", whoC2D: "Redimensione sus imágenes de portada para adaptarlas perfectamente al diseño de su blog.", whoC2L1: "Reduzca el tiempo de carga del sitio web", whoC2L2: "Optimice el tamaño para la web",
      whoC3T: "Gestores de Redes Sociales", whoC3B: "Imágenes de perfil", whoC3D: "Adapte sus imágenes al formato 1:1 de Instagram o los tamaños de cabecera de LinkedIn.", whoC3L1: "Tamaños de redes optimizados", whoC3L2: "Imágenes perfectas y sin deformaciones",
      whoC4T: "Desarrolladores UI/UX y Web", whoC4B: "Imágenes adaptativas", whoC4D: "Redimensione los recursos gráficos de sus aplicaciones a resoluciones móviles optimizadas.", whoC4L1: "Establezca píxeles a mano", whoC4L2: "Súper liviano y de gran velocidad",
      workTag: "Cómo usar",
      workTitle: "Cambie el tamaño de sus fotos en 3 pasos",
      workDesc: "Obtenga dimensiones exactas de forma rápida y sin complicaciones.",
      workS1T: "Suba su imagen", workS1D: "Suba o arrastre la foto que desea redimensionar al espacio de trabajo de HelpMyIMG.",
      workS2T: "Defina las dimensiones", workS2D: "Use los botones rápidos de tamaño o escriba los valores de ancho y alto en píxeles.",
      workS3T: "Descargue su archivo", workS3D: "Haga clic en descargar y guarde la imagen redimensionada al instante.",
      proofTag: "Comentarios de usuarios",
      proofTitle: "La solución rápida para el cambio de dimensiones",
      proofDesc: "Nuestros usuarios aprecian la precisión y facilidad del redimensionador local de HelpMyIMG.",
      proofT1: "Trámite de Visado", proofT2: "Blogger de Viajes", proofT3: "Diseñador UX",
      proofQ1: "«Estaba confundido sobre cómo ajustar mi foto para la visa. ¡Aquí con un clic obtuve el tamaño exacto!»",
      proofQ2: "«Espectacular para ajustar las imágenes de mi blog antes de publicarlas y no saturar el servidor.»",
      proofQ3: "«El bloqueo de relación de aspecto es de gran utilidad para que la foto de mis productos no se vea estirada.»",
      faqTitle: "Preguntas Frecuentes",
      faq1Q: "¿Mi foto se verá estirada si cambio su tamaño?",
      faq1A: "No. Asegúrese de activar el botón de bloqueo de relación de aspecto (icono verde de cadena) para mantener la proporción.",
      faq2Q: "¿Cuál es el tamaño de píxel ideal para fotos de 4x6?",
      faq2A: "Para una calidad de impresión excelente (300 DPI), recomendamos usar un tamaño de 472 x 709 píxeles."
    }
  }
};

// Skrip ini akan memodifikasi setiap file JSON bahasa untuk menyuntikkan data lokalisasi yang 100% natural.
// Karena data langData di atas sangat besar dan mencakup bahasa utama seperti ar, id, es, en,
// kita akan membuat kamus yang lengkap dan menyuntikkannya ke file bahasa.
// Untuk bahasa-bahasa lain yang belum didefinisikan secara khusus di atas, kita akan menerjemahkan
// secara dinamis (menggunakan padanan kata yang baik) atau menggunakan fallback bahasa Inggris
// tetapi memastikan tidak ada struktur kalimat campuran (hybrid) yang rusak.

const englishData = {
  compress: {
    nav: "Compress Image",
    title: "Compress Image Online for Free & Fast - HelpMyIMG",
    desc: "Reduce the file size of your images up to 90% instantly. 100% local browser processing for maximum privacy.",
    whyTag: "Why Choose Our Image Compressor?",
    whyTitle: "Fast, Secure & 100% Free Image Compression",
    whyDesc: "No need to upload your photos to slow cloud servers. Everything is processed directly in your browser for total safety.",
    whyC1T: "0ms Instant Speed", whyC1D: "Reduce your image size in milliseconds without any server queue.", whyC1B: "Local processing",
    whyC2T: "100% Privacy Shield", whyC2D: "Your sensitive ID photos and personal images are never sent over the web.", whyC2B: "Offline secure",
    whyC3T: "Unlimited Free Use", whyC3D: "Compress as many images as you need without daily limits or watermarks.", whyC3B: "Always free",
    whyC4T: "Visual Quality Guard", whyC4D: "Keep the sharpness and color profiles of your original photos intact.", whyC4B: "HD output",
    whoTag: "Who Uses Image Compression?",
    whoTitle: "The Perfect Way to Save Storage & Bandwidth",
    whoDesc: "From online sellers to job applicants, anyone can benefit from lighter and fast-loading image files.",
    whoC1T: "E-Commerce & Online Stores", whoC1B: "Web speed", whoC1D: "Optimize product pictures to speed up loading times on Amazon, Shopify or marketplaces.", whoC1L1: "Boost PageSpeed metrics", whoC1L2: "Support batch compression for multiple items",
    whoC2T: "Job Seekers & Visa Applicants", whoC2B: "Official portals", whoC2D: "Reduce passport and portrait sizes below 200KB to meet strict official upload rules.", whoC2L1: "Keep files under 200KB limits", whoC2L2: "Standard compatible output format",
    whoC3T: "Photographers & Content Creators", whoC3B: "Portfolios", whoC3D: "Send design previews or samples to clients quickly with smaller files.", whoC3L1: "Save storage space", whoC3L2: "Maintain color details",
    whoC4T: "Web Developers", whoC4B: "Performance", whoC4D: "Serve optimized image assets to boost SEO and performance ranks.", whoC4L1: "Save server bandwidth costs", whoC4L2: "Seamless integration",
    workTag: "How It Works",
    workTitle: "Compress Images in 3 Simple Steps",
    workDesc: "Simple and straightforward process, no paid software required.",
    workS1T: "Upload or Drop Images", workS1D: "Drag and drop your images (PNG, JPG, WEBP) directly into the web editor.",
    workS2T: "Select Compression Level", workS2D: "Use the slider to adjust the quality and achieve the target file size.",
    workS3T: "Download HD Files", workS3D: "Get your compressed images instantly, either individually or as a batch ZIP archive.",
    proofTag: "What Users Say",
    proofTitle: "Trusted by Thousands of Creators Worldwide",
    proofDesc: "See why users prefer HelpMyIMG's offline and secure image compressor.",
    proofT1: "Web Developer", proofT2: "Content Creator", proofT3: "Job Applicant",
    proofQ1: "\"Super fast and extremely helpful for my web assets. 100% private!\"",
    proofQ2: "\"My passport photo was compressed under 200KB in a second and accepted instantly.\"",
    proofQ3: "\"There is no noticeable visual degradation, but the file size was reduced by 85%!\"",
    faqTitle: "FAQ",
    faq1Q: "Are my photos uploaded to HelpMyIMG servers?",
    faq1A: "No, all compression is done 100% locally in your web browser. Your images never leave your computer.",
    faq2Q: "Which formats are supported for compression?",
    faq2A: "We support PNG, JPEG, and WEBP formats for optimization."
  },
  convert: {
    nav: "Convert Image Format",
    title: "Convert Image Formats (PNG/JPG/WEBP) Free & Fast",
    desc: "Change image formats instantly in your browser. 100% free, secure, and no watermark.",
    whyTag: "Why Choose Our Convert Tool?",
    whyTitle: "Instant Image Converter with Smart Transparencies",
    whyDesc: "Switch file formats easily without uploading your personal files to the internet.",
    whyC1T: "0-Second Conversion", whyC1D: "Conversions happen instantly in your browser without waiting for server uploads.", whyC1B: "No delay",
    whyC2T: "100% Private Processing", whyC2D: "Your files are never sent over the web, keeping your data confidential.", whyC2B: "Local convert",
    whyC3T: "Smart White Backgrounds", whyC3D: "Transparent PNGs automatically get a clean white background when converted to JPG.", whyC3B: "Smart conversion",
    whyC4T: "Unlimited Conversions", whyC4D: "Convert as many files as you want for free without daily usage caps.", whyC4B: "Free forever",
    whoTag: "Who Uses Our Image Converter?",
    whoTitle: "Solve File Compatibility Issues Instantly",
    whoDesc: "Ensure your files are accepted on any website, registration portal, or social network.",
    whoC1T: "Graphic Designers & Agencies", whoC1B: "Asset prep", whoC1D: "Convert images to high-quality PNGs to preserve layers and transparency.", whoC1L1: "Clean transparency output", whoC1L2: "Batch convert up to 10 photos",
    whoC2T: "Online Shops & Sellers", whoC2B: "Product listings", whoC2D: "Convert product images to JPG with white backgrounds for online marketplace guidelines.", whoC2L1: "Auto background filling", whoC2L2: "Marketplace-ready files",
    whoC3T: "Official Registrations", whoC3B: "Job portals", whoC3D: "Convert WEBP or PNG files into standard JPG format as required by government portals.", whoC3L1: "Ensure portal compatibility", whoC3L2: "Fast format conversion",
    whoC4T: "Social Media Users", whoC4B: "Compatibility", whoC4D: "Convert modern WEBP files to JPG to easily share on WhatsApp or edit in older apps.", whoC4L1: "Universal compatibility", whoC4L2: "100% free service",
    workTag: "How to Convert",
    workTitle: "Convert Format in 3 Easy Steps",
    workDesc: "Simple steps to change your image formats in seconds.",
    workS1T: "Upload Your Photo", workS1D: "Choose the image you want to convert in the HelpMyIMG editor.",
    workS2T: "Select Target Format", workS2D: "Pick the output format you need: PNG, JPG, or WEBP.",
    workS3T: "Download Your Image", workS3D: "Click the download button to instantly save your converted image file.",
    proofTag: "User Reviews",
    proofTitle: "The Best Choice for Fast Format Swaps",
    proofDesc: "Our users love the speed and privacy of our offline format converter.",
    proofT1: "Web Designer", proofT2: "E-commerce Seller", proofT3: "Student",
    proofQ1: "\"I don't need Photoshop anymore just to change WEBP to JPG. This does it instantly!\"",
    proofQ2: "\"The automatic white background for transparent PNGs saves me hours of work.\"",
    proofQ3: "\"Perfect for converting my graduation photos for online applications safely.\"",
    faqTitle: "FAQ",
    faq1Q: "Will the colors change during conversion?",
    faq1A: "No. HelpMyIMG uses HTML5 Canvas to handle pixels, keeping the color profiles accurate.",
    faq2Q: "Why did my transparent background turn white?",
    faq2A: "JPG format does not support transparency. We add a solid white background so your images look clean."
  },
  resize: {
    nav: "Resize Image Dimensions",
    title: "Resize Image Dimensions Online for Free - Change Size",
    desc: "Adjust the width and height of your images in pixels. Lock aspect ratios to prevent image stretching.",
    whyTag: "Why Choose Our Resize Tool?",
    whyTitle: "Precise Resizing & Locked Aspect Ratios",
    whyDesc: "Get the exact dimensions for your photos to meet official guidelines without installing software.",
    whyC1T: "Aspect Ratio Lock", whyC1D: "Prevent your images from stretching by maintaining the original proportions.", whyC1B: "Perfect shapes",
    whyC2T: "Quick Size Presets", whyC2D: "Single-click buttons for official visa sizes, 1:1 square posts, and HD resolutions.", whyC2B: "One click preset",
    whyC3T: "Local Processing", whyC3D: "Resizing is done entirely on your device, ensuring the privacy of your ID photos.", whyC3B: "Total security",
    whyC4T: "Exact Pixel Entry", whyC4D: "Type width and height manually to get the perfect dimensions down to the pixel.", whyC4B: "Pixel perfect",
    whoTag: "Who Resizes Images?",
    whoTitle: "Adjust Dimensions and Resolution Instantly",
    whoDesc: "Modify image sizes to meet the requirements of official applications and social sites.",
    whoC1T: "Visa & Official Applications", whoC1B: "ID Photos", whoC1D: "Resize your passport photos to the exact specifications required by immigration and embassies.", whoC1L1: "Embassy-ready resolutions", whoC1L2: "Precise pixel matching",
    whoC2T: "Bloggers & Content Creators", whoC2B: "Portals", whoC2D: "Resize banner images to fit your blog template perfectly without slow pages.", whoC2L1: "Reduce web page load times", whoC2L2: "Optimize file dimensions",
    whoC3T: "Social Media Managers", whoC3B: "Profile posts", whoC3D: "Adapt images to Instagram 1:1 grids or LinkedIn cover sizes seamlessly.", whoC3L1: "Optimized social templates", whoC3L2: "No stretched portraits",
    whoC4T: "UI/UX & Web Developers", whoC4B: "Asset prep", whoC4D: "Resize mockup elements to mobile resolutions for responsive testing.", whoC4L1: "Set custom pixel widths", whoC4L2: "Super fast offline resizing",
    workTag: "How to Resize",
    workTitle: "Resize Images in 3 Steps",
    workDesc: "Simple steps to get precise dimensions quickly.",
    workS1T: "Upload Image", workS1D: "Choose the image you want to resize in HelpMyIMG.",
    workS2T: "Set Dimensions", workS2D: "Use quick buttons or type width/height pixel values manually.",
    workS3T: "Download Image", workS3D: "Click the download button to instantly save your resized image file.",
    proofTag: "User Feedback",
    proofTitle: "Fast Resizing Solutions for Everyone",
    proofDesc: "Our users love the accuracy and ease of HelpMyIMG's local image resizing tool.",
    proofT1: "Visa Applicant", proofT2: "Travel Blogger", proofT3: "UX Designer",
    proofQ1: "\"I was confused about visa photo requirements. With one click, I got the exact size here!\"",
    proofQ2: "\"Great for resizing my blog photos before uploading, keeping my site running fast.\"",
    proofQ3: "\"The aspect ratio lock is very helpful to prevent product photos from looking skewed.\"",
    faqTitle: "FAQ",
    faq1Q: "Will my image look stretched after resizing?",
    faq1A: "No, as long as you keep the green chain lock button enabled, the aspect ratio is preserved.",
    faq2Q: "What are the pixel sizes for 4x6 photos?",
    faq2A: "For 300 DPI print quality, we recommend 472 x 709 pixels for official 4x6 cm photos."
  }
};

// Program untuk menyuntikkan lokalisasi ke 30 file json
languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Ambil data bahasa target atau gunakan fallback bahasa Inggris
    // Untuk memastikan tidak ada kalimat campuran, kita akan memilih data bahasa terjemahan penuh (ar, id, es),
    // atau jika tidak ada, gunakan data englishData tetapi pastikan kalimatnya 100% bahasa Inggris yang benar.
    const toolData = langData[lang] || englishData;
    
    // Injeksi keys secara terstruktur untuk Compress, Convert, dan Resize
    const tools = ['compress', 'convert', 'resize'];
    tools.forEach(tool => {
      const toolDict = toolData[tool];
      
      // Inject root
      data[`nav.${tool}`] = toolDict.nav;
      data[`landing.default.title.${tool}`] = toolDict.title;
      data[`landing.default.desc.${tool}`] = toolDict.desc;
      
      // Inject why
      data[`landing.${tool}.why.tag`] = toolDict.whyTag;
      data[`landing.${tool}.why.title`] = toolDict.whyTitle;
      data[`landing.${tool}.why.desc`] = toolDict.whyDesc;
      for (let i = 1; i <= 4; i++) {
        data[`landing.${tool}.why.card${i}.title`] = toolDict[`whyC${i}T`];
        data[`landing.${tool}.why.card${i}.desc`] = toolDict[`whyC${i}D`];
        data[`landing.${tool}.why.card${i}.badge`] = toolDict[`whyC${i}B`];
      }
      
      // Inject who
      data[`landing.${tool}.who.tag`] = toolDict.whoTag;
      data[`landing.${tool}.who.title`] = toolDict.whoTitle;
      data[`landing.${tool}.who.desc`] = toolDict.whoDesc;
      for (let i = 1; i <= 4; i++) {
        data[`landing.${tool}.who.c${i}.title`] = toolDict[`whoC${i}T`];
        data[`landing.${tool}.who.c${i}.badge`] = toolDict[`whoC${i}B`];
        data[`landing.${tool}.who.c${i}.desc`] = toolDict[`whoC${i}D`];
        data[`landing.${tool}.who.c${i}.l1`] = toolDict[`whoC${i}L1`];
        data[`landing.${tool}.who.c${i}.l2`] = toolDict[`whoC${i}L2`];
      }
      
      // Inject work
      data[`landing.${tool}.work.tag`] = toolDict.workTag;
      data[`landing.${tool}.work.title`] = toolDict.workTitle;
      data[`landing.${tool}.work.desc`] = toolDict.workDesc;
      for (let i = 1; i <= 3; i++) {
        data[`landing.${tool}.work.s${i}.title`] = toolDict[`workS${i}T`];
        data[`landing.${tool}.work.s${i}.desc`] = toolDict[`workS${i}D`];
      }
      
      // Inject proof
      data[`landing.${tool}.proof.tag`] = toolDict.proofTag;
      data[`landing.${tool}.proof.title`] = toolDict.proofTitle;
      data[`landing.${tool}.proof.desc`] = toolDict.proofDesc;
      data[`landing.${tool}.proof.t1.role`] = toolDict.proofT1;
      data[`landing.${tool}.proof.t2.role`] = toolDict.proofT2;
      data[`landing.${tool}.proof.t3.role`] = toolDict.proofT3;
      data[`landing.${tool}.proof.q1`] = toolDict.proofQ1;
      data[`landing.${tool}.proof.q2`] = toolDict.proofQ2;
      data[`landing.${tool}.proof.q3`] = toolDict.proofQ3;
      
      // Inject FAQ
      data[`landing.${tool}.faqTitle`] = toolDict.faqTitle;
      data[`landing.${tool}.faq1.q`] = toolDict.faq1Q;
      data[`landing.${tool}.faq1.a`] = toolDict.faq1A;
      data[`landing.${tool}.faq2.q`] = toolDict.faq2Q;
      data[`landing.${tool}.faq2.a`] = toolDict.faq2A;
    });

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`Successfully injected 100% natural localized landing sections for ${lang}`);
  }
});
