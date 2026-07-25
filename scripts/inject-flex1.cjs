const fs = require('fs');
const path = require('path');

const translations = {
  en: {
    "landing.flex.tag": "SYSTEM ARCHITECTURE",
    "landing.flex.title": "Engineered for Extreme Privacy & Millisecond Performance",
    "landing.flex.desc": "We don't rely on slow cloud servers. HelpMyIMG utilizes next-generation WebAssembly to run complex AI algorithms directly inside your browser memory.",
    "landing.flex.c1.title": "Local AI Processing",
    "landing.flex.c1.desc": "Your sensitive files never touch our servers. All AI operations are executed locally on your device for 100% privacy.",
    "landing.flex.c2.title": "0ms Network Latency",
    "landing.flex.c2.desc": "Skip the upload and download wait times. Processing begins the exact millisecond you drag and drop your photos.",
    "landing.flex.c3.title": "WebAssembly Powered",
    "landing.flex.c3.desc": "Leveraging ultra-fast WASM binaries, HelpMyIMG matches the performance of native desktop applications inside the web browser."
  },
  id: {
    "landing.flex.tag": "ARSITEKTUR SISTEM",
    "landing.flex.title": "Dirancang untuk Privasi Ekstrem & Performa Milidetik",
    "landing.flex.desc": "Kami tidak mengandalkan server cloud yang lambat. HelpMyIMG menggunakan WebAssembly generasi terbaru untuk menjalankan algoritma AI kompleks langsung di dalam memori browser Anda.",
    "landing.flex.c1.title": "Pemrosesan AI Lokal",
    "landing.flex.c1.desc": "File sensitif Anda tidak pernah menyentuh server kami. Semua operasi AI dieksekusi secara lokal di perangkat Anda untuk privasi 100%.",
    "landing.flex.c2.title": "Latensi Jaringan 0ms",
    "landing.flex.c2.desc": "Lewati waktu tunggu unggah dan unduh. Pemrosesan dimulai tepat pada milidetik Anda menarik dan melepas foto Anda.",
    "landing.flex.c3.title": "Ditenagai WebAssembly",
    "landing.flex.c3.desc": "Memanfaatkan biner WASM ultra-cepat, HelpMyIMG menyamai kinerja aplikasi desktop asli di dalam browser web."
  },
  zh: {
    "landing.flex.tag": "系统架构",
    "landing.flex.title": "专为极致隐私和毫秒级性能而设计",
    "landing.flex.desc": "我们不依赖缓慢的云服务器。HelpMyIMG 利用下一代 WebAssembly 直接在您的浏览器内存中运行复杂的 AI 算法。",
    "landing.flex.c1.title": "本地 AI 处理",
    "landing.flex.c1.desc": "您的敏感文件永远不会接触我们的服务器。所有 AI 操作都在您的设备上本地执行，以实现 100% 的隐私。",
    "landing.flex.c2.title": "0毫秒 网络延迟",
    "landing.flex.c2.desc": "跳过上传和下载的等待时间。处理在您拖放照片的同一毫秒开始。",
    "landing.flex.c3.title": "WebAssembly 提供支持",
    "landing.flex.c3.desc": "利用超快速的 WASM 二进制文件，HelpMyIMG 在网络浏览器中实现了原生桌面应用程序的性能。"
  },
  hi: {
    "landing.flex.tag": "सिस्टम आर्किटेक्चर",
    "landing.flex.title": "अत्यधिक गोपनीयता और मिलीसेकंड प्रदर्शन के लिए इंजीनियर",
    "landing.flex.desc": "हम धीमे क्लाउड सर्वर पर निर्भर नहीं हैं। HelpMyIMG जटिल AI एल्गोरिदम को सीधे आपके ब्राउज़र मेमोरी के अंदर चलाने के लिए अगली पीढ़ी के WebAssembly का उपयोग करता है।",
    "landing.flex.c1.title": "स्थानीय एआई प्रसंस्करण",
    "landing.flex.c1.desc": "आपकी संवेदनशील फाइलें कभी भी हमारे सर्वर को नहीं छूती हैं। 100% गोपनीयता के लिए सभी AI संचालन आपके डिवाइस पर स्थानीय रूप से निष्पादित किए जाते हैं।",
    "landing.flex.c2.title": "0ms नेटवर्क विलंबता",
    "landing.flex.c2.desc": "अपलोड और डाउनलोड प्रतीक्षा समय छोड़ें। आपके द्वारा अपनी तस्वीरें खींचने और छोड़ने के सटीक मिलीसेकंड पर प्रसंस्करण शुरू होता है।",
    "landing.flex.c3.title": "WebAssembly संचालित",
    "landing.flex.c3.desc": "अल्ट्रा-फास्ट WASM बायनेरिज़ का लाभ उठाते हुए, HelpMyIMG वेब ब्राउज़र के अंदर देशी डेस्कटॉप अनुप्रयोगों के प्रदर्शन से मेल खाता है।"
  },
  es: {
    "landing.flex.tag": "ARQUITECTURA DEL SISTEMA",
    "landing.flex.title": "Diseñado para Privacidad Extrema y Rendimiento de Milisegundos",
    "landing.flex.desc": "No dependemos de servidores lentos en la nube. HelpMyIMG utiliza WebAssembly de próxima generación para ejecutar algoritmos complejos de IA directamente en la memoria de su navegador.",
    "landing.flex.c1.title": "Procesamiento Local de IA",
    "landing.flex.c1.desc": "Sus archivos confidenciales nunca tocan nuestros servidores. Todas las operaciones de IA se ejecutan localmente en su dispositivo para un 100% de privacidad.",
    "landing.flex.c2.title": "Latencia de Red de 0ms",
    "landing.flex.c2.desc": "Omita los tiempos de espera de carga y descarga. El procesamiento comienza exactamente el milisegundo en que arrastra y suelta sus fotos.",
    "landing.flex.c3.title": "Impulsado por WebAssembly",
    "landing.flex.c3.desc": "Aprovechando los binarios ultrarrápidos de WASM, HelpMyIMG iguala el rendimiento de las aplicaciones de escritorio nativas dentro del navegador web."
  },
  ja: {
    "landing.flex.tag": "システム アーキテクチャ",
    "landing.flex.title": "究極のプライバシーとミリ秒のパフォーマンスのために設計",
    "landing.flex.desc": "私たちは遅いクラウド サーバーに依存しません。HelpMyIMG は次世代の WebAssembly を利用して、複雑な AI アルゴリズムをブラウザーのメモリ内で直接実行します。",
    "landing.flex.c1.title": "ローカル AI 処理",
    "landing.flex.c1.desc": "あなたの機密ファイルが当社のサーバーに触れることはありません。すべての AI 操作は 100% のプライバシーのためにデバイス上でローカルに実行されます。",
    "landing.flex.c2.title": "0ミリ秒のネットワーク遅延",
    "landing.flex.c2.desc": "アップロードとダウンロードの待ち時間をスキップします。写真をドラッグ アンド ドロップした瞬間に処理が始まります。",
    "landing.flex.c3.title": "WebAssembly 搭載",
    "landing.flex.c3.desc": "超高速の WASM バイナリを活用することで、HelpMyIMG は Web ブラウザー内でネイティブ デスクトップ アプリケーションのパフォーマンスに匹敵します。"
  },
  pt: {
    "landing.flex.tag": "ARQUITETURA DO SISTEMA",
    "landing.flex.title": "Projetado para Privacidade Extrema e Desempenho de Milissegundos",
    "landing.flex.desc": "Não dependemos de servidores em nuvem lentos. O HelpMyIMG utiliza o WebAssembly de última geração para executar algoritmos complexos de IA diretamente na memória do seu navegador.",
    "landing.flex.c1.title": "Processamento Local de IA",
    "landing.flex.c1.desc": "Seus arquivos confidenciais nunca tocam nossos servidores. Todas as operações de IA são executadas localmente no seu dispositivo para 100% de privacidade.",
    "landing.flex.c2.title": "Latência de Rede de 0ms",
    "landing.flex.c2.desc": "Pule os tempos de espera de upload e download. O processamento começa no exato milissegundo em que você arrasta e solta suas fotos.",
    "landing.flex.c3.title": "Alimentado por WebAssembly",
    "landing.flex.c3.desc": "Aproveitando binários WASM ultrarrápidos, o HelpMyIMG iguala o desempenho de aplicativos de desktop nativos dentro do navegador da web."
  },
  ru: {
    "landing.flex.tag": "АРХИТЕКТУРА СИСТЕМЫ",
    "landing.flex.title": "Разработано для максимальной конфиденциальности и производительности за миллисекунды",
    "landing.flex.desc": "Мы не полагаемся на медленные облачные серверы. HelpMyIMG использует WebAssembly следующего поколения для запуска сложных алгоритмов ИИ прямо в памяти вашего браузера.",
    "landing.flex.c1.title": "Локальная обработка ИИ",
    "landing.flex.c1.desc": "Ваши конфиденциальные файлы никогда не касаются наших серверов. Все операции ИИ выполняются локально на вашем устройстве для 100% конфиденциальности.",
    "landing.flex.c2.title": "Сетевая задержка 0 мс",
    "landing.flex.c2.desc": "Забудьте о времени ожидания загрузки и скачивания. Обработка начинается ровно в ту же миллисекунду, когда вы перетаскиваете свои фотографии.",
    "landing.flex.c3.title": "На базе WebAssembly",
    "landing.flex.c3.desc": "Используя сверхбыстрые двоичные файлы WASM, HelpMyIMG соответствует производительности нативных настольных приложений внутри веб-браузера."
  },
  ar: {
    "landing.flex.tag": "بنية النظام",
    "landing.flex.title": "مصمم لتحقيق الخصوصية القصوى وأداء الميلي ثانية",
    "landing.flex.desc": "نحن لا نعتمد على الخوادم السحابية البطيئة. يستخدم HelpMyIMG الجيل القادم من WebAssembly لتشغيل خوارزميات الذكاء الاصطناعي المعقدة مباشرة داخل ذاكرة متصفحك.",
    "landing.flex.c1.title": "معالجة الذكاء الاصطناعي المحلية",
    "landing.flex.c1.desc": "ملفاتك الحساسة لا تلمس خوادمنا أبدًا. يتم تنفيذ جميع عمليات الذكاء الاصطناعي محليًا على جهازك لخصوصية 100٪.",
    "landing.flex.c2.title": "زمن انتقال الشبكة 0ms",
    "landing.flex.c2.desc": "تخطى أوقات انتظار التحميل والتنزيل. تبدأ المعالجة في نفس الميلي ثانية التي تقوم فيها بسحب وإفلات صورك.",
    "landing.flex.c3.title": "مدعوم من WebAssembly",
    "landing.flex.c3.desc": "من خلال الاستفادة من ثنائيات WASM فائقة السرعة ، يتطابق HelpMyIMG مع أداء تطبيقات سطح المكتب الأصلية داخل متصفح الويب."
  },
  fr: {
    "landing.flex.tag": "ARCHITECTURE DU SYSTÈME",
    "landing.flex.title": "Conçu pour une confidentialité extrême et des performances en millisecondes",
    "landing.flex.desc": "Nous ne comptons pas sur des serveurs cloud lents. HelpMyIMG utilise WebAssembly de nouvelle génération pour exécuter des algorithmes d'IA complexes directement dans la mémoire de votre navigateur.",
    "landing.flex.c1.title": "Traitement IA local",
    "landing.flex.c1.desc": "Vos fichiers sensibles ne touchent jamais nos serveurs. Toutes les opérations d'IA sont exécutées localement sur votre appareil pour une confidentialité à 100 %.",
    "landing.flex.c2.title": "Latence réseau 0 ms",
    "landing.flex.c2.desc": "Évitez les temps d'attente de téléchargement. Le traitement commence à la milliseconde exacte où vous glissez et déposez vos photos.",
    "landing.flex.c3.title": "Propulsé par WebAssembly",
    "landing.flex.c3.desc": "Tirant parti des binaires WASM ultra-rapides, HelpMyIMG égale les performances des applications de bureau natives dans le navigateur Web."
  },
  de: {
    "landing.flex.tag": "SYSTEMARCHITEKTUR",
    "landing.flex.title": "Entwickelt für extreme Privatsphäre und Millisekunden-Leistung",
    "landing.flex.desc": "Wir verlassen uns nicht auf langsame Cloud-Server. HelpMyIMG verwendet WebAssembly der nächsten Generation, um komplexe KI-Algorithmen direkt im Speicher Ihres Browsers auszuführen.",
    "landing.flex.c1.title": "Lokale KI-Verarbeitung",
    "landing.flex.c1.desc": "Ihre sensiblen Dateien berühren niemals unsere Server. Alle KI-Operationen werden lokal auf Ihrem Gerät für 100 % Privatsphäre ausgeführt.",
    "landing.flex.c2.title": "0ms Netzwerklatenz",
    "landing.flex.c2.desc": "Überspringen Sie die Upload- und Download-Wartezeiten. Die Verarbeitung beginnt genau in der Millisekunde, in der Sie Ihre Fotos ablegen.",
    "landing.flex.c3.title": "WebAssembly-gestützt",
    "landing.flex.c3.desc": "Durch die Nutzung ultraschneller WASM-Binärdateien erreicht HelpMyIMG die Leistung nativer Desktop-Anwendungen im Webbrowser."
  },
  ko: {
    "landing.flex.tag": "시스템 아키텍처",
    "landing.flex.title": "극도의 개인 정보 보호 및 밀리초 성능을 위한 설계",
    "landing.flex.desc": "느린 클라우드 서버에 의존하지 않습니다. HelpMyIMG는 차세대 WebAssembly를 활용하여 복잡한 AI 알고리즘을 브라우저 메모리 내에서 직접 실행합니다.",
    "landing.flex.c1.title": "로컬 AI 처리",
    "landing.flex.c1.desc": "민감한 파일은 서버에 절대 닿지 않습니다. 모든 AI 작업은 100% 개인 정보 보호를 위해 기기에서 로컬로 실행됩니다.",
    "landing.flex.c2.title": "0ms 네트워크 지연 시간",
    "landing.flex.c2.desc": "업로드 및 다운로드 대기 시간을 건너뛰세요. 사진을 끌어다 놓는 정확한 밀리초에 처리가 시작됩니다.",
    "landing.flex.c3.title": "WebAssembly 구동",
    "landing.flex.c3.desc": "초고속 WASM 바이너리를 활용하는 HelpMyIMG는 웹 브라우저 내에서 기본 데스크톱 응용 프로그램의 성능과 일치합니다."
  },
  it: {
    "landing.flex.tag": "ARCHITETTURA DI SISTEMA",
    "landing.flex.title": "Progettato per una privacy estrema e prestazioni in millisecondi",
    "landing.flex.desc": "Non ci affidiamo a lenti server cloud. HelpMyIMG utilizza WebAssembly di nuova generazione per eseguire complessi algoritmi di intelligenza artificiale direttamente nella memoria del tuo browser.",
    "landing.flex.c1.title": "Elaborazione IA locale",
    "landing.flex.c1.desc": "I tuoi file sensibili non toccano mai i nostri server. Tutte le operazioni di intelligenza artificiale vengono eseguite localmente sul tuo dispositivo per una privacy al 100%.",
    "landing.flex.c2.title": "Latenza di rete 0 ms",
    "landing.flex.c2.desc": "Salta i tempi di attesa per l'upload e il download. L'elaborazione inizia nell'esatto millisecondo in cui trascini e rilasci le tue foto.",
    "landing.flex.c3.title": "Basato su WebAssembly",
    "landing.flex.c3.desc": "Sfruttando binari WASM ultraveloci, HelpMyIMG eguaglia le prestazioni delle applicazioni desktop native all'interno del browser web."
  },
  tr: {
    "landing.flex.tag": "SİSTEM MİMARİSİ",
    "landing.flex.title": "Aşırı Gizlilik ve Milisaniye Performansı İçin Tasarlandı",
    "landing.flex.desc": "Yavaş bulut sunucularına güvenmiyoruz. HelpMyIMG, karmaşık yapay zeka algoritmalarını doğrudan tarayıcı belleğinizin içinde çalıştırmak için yeni nesil WebAssembly'yi kullanır.",
    "landing.flex.c1.title": "Yerel Yapay Zeka İşleme",
    "landing.flex.c1.desc": "Hassas dosyalarınız sunucularımıza asla dokunmaz. %100 gizlilik için tüm yapay zeka işlemleri yerel olarak cihazınızda gerçekleştirilir.",
    "landing.flex.c2.title": "0ms Ağ Gecikmesi",
    "landing.flex.c2.desc": "Yükleme ve indirme bekleme sürelerini atlayın. İşlem, fotoğraflarınızı sürükleyip bıraktığınız milisaniyede başlar.",
    "landing.flex.c3.title": "WebAssembly Destekli",
    "landing.flex.c3.desc": "Ultra hızlı WASM ikili dosyalarından yararlanan HelpMyIMG, web tarayıcısının içinde yerel masaüstü uygulamalarının performansıyla eşleşir."
  },
  vi: {
    "landing.flex.tag": "KIẾN TRÚC HỆ THỐNG",
    "landing.flex.title": "Được thiết kế để bảo mật tuyệt đối và hiệu suất mili giây",
    "landing.flex.desc": "Chúng tôi không dựa vào các máy chủ đám mây chậm chạp. HelpMyIMG sử dụng WebAssembly thế hệ tiếp theo để chạy các thuật toán AI phức tạp trực tiếp bên trong bộ nhớ trình duyệt của bạn.",
    "landing.flex.c1.title": "Xử lý AI cục bộ",
    "landing.flex.c1.desc": "Các tệp nhạy cảm của bạn không bao giờ chạm vào máy chủ của chúng tôi. Tất cả các hoạt động AI đều được thực thi cục bộ trên thiết bị của bạn để bảo mật 100%.",
    "landing.flex.c2.title": "Độ trễ mạng 0ms",
    "landing.flex.c2.desc": "Bỏ qua thời gian chờ tải lên và tải xuống. Quá trình xử lý bắt đầu vào chính phần nghìn giây bạn kéo và thả ảnh của mình.",
    "landing.flex.c3.title": "Được hỗ trợ bởi WebAssembly",
    "landing.flex.c3.desc": "Tận dụng các tệp nhị phân WASM cực nhanh, HelpMyIMG phù hợp với hiệu suất của các ứng dụng máy tính để bàn gốc bên trong trình duyệt web."
  }
};

const scriptDir = __dirname;
const localesDir = path.join(scriptDir, '../public/locales');

for (const [lang, kv] of Object.entries(translations)) {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    for (const [key, val] of Object.entries(kv)) {
      data[key] = val;
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`[${lang}] Injected flex translations chunk 1`);
  }
}
