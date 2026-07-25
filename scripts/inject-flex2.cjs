const fs = require('fs');
const path = require('path');

const translations = {
  th: {
    "landing.flex.tag": "สถาปัตยกรรมระบบ",
    "landing.flex.title": "ออกแบบมาเพื่อความเป็นส่วนตัวสูงสุดและประสิทธิภาพระดับมิลลิวินาที",
    "landing.flex.desc": "เราไม่พึ่งพาเซิร์ฟเวอร์คลาวด์ที่ช้า HelpMyIMG ใช้ WebAssembly รุ่นต่อไปเพื่อรันอัลกอริธึม AI ที่ซับซ้อนโดยตรงในหน่วยความจำเบราว์เซอร์ของคุณ",
    "landing.flex.c1.title": "การประมวลผล AI ในพื้นที่",
    "landing.flex.c1.desc": "ไฟล์ที่ละเอียดอ่อนของคุณไม่เคยสัมผัสเซิร์ฟเวอร์ของเรา การทำงานของ AI ทั้งหมดจะดำเนินการแบบออฟไลน์บนอุปกรณ์ของคุณเพื่อความเป็นส่วนตัว 100%",
    "landing.flex.c2.title": "ความหน่วงเครือข่าย 0ms",
    "landing.flex.c2.desc": "ข้ามเวลารออัปโหลดและดาวน์โหลด การประมวลผลจะเริ่มขึ้นในเสี้ยววินาทีที่คุณลากและวางรูปภาพของคุณ",
    "landing.flex.c3.title": "ขับเคลื่อนโดย WebAssembly",
    "landing.flex.c3.desc": "การใช้ประโยชน์จากไบนารี WASM ที่รวดเร็วเป็นพิเศษ ทำให้ HelpMyIMG มีประสิทธิภาพเทียบเท่ากับแอปพลิเคชันเดสก์ท็อปดั้งเดิมภายในเว็บเบราว์เซอร์"
  },
  pl: {
    "landing.flex.tag": "ARCHITEKTURA SYSTEMU",
    "landing.flex.title": "Zaprojektowany z myślą o ekstremalnej prywatności i wydajności rzędu milisekund",
    "landing.flex.desc": "Nie polegamy na powolnych serwerach w chmurze. HelpMyIMG wykorzystuje WebAssembly nowej generacji do uruchamiania złożonych algorytmów sztucznej inteligencji bezpośrednio w pamięci przeglądarki.",
    "landing.flex.c1.title": "Lokalne przetwarzanie AI",
    "landing.flex.c1.desc": "Twoje poufne pliki nigdy nie dotykają naszych serwerów. Wszystkie operacje AI są wykonywane lokalnie na Twoim urządzeniu, zapewniając 100% prywatności.",
    "landing.flex.c2.title": "Opóźnienie sieci 0 ms",
    "landing.flex.c2.desc": "Pomiń czas oczekiwania na przesyłanie i pobieranie. Przetwarzanie rozpoczyna się dokładnie w tej samej milisekundzie, w której upuszczasz zdjęcia.",
    "landing.flex.c3.title": "Oparte na WebAssembly",
    "landing.flex.c3.desc": "Wykorzystując ultraszybkie pliki binarne WASM, HelpMyIMG dorównuje wydajnością natywnym aplikacjom komputerowym w przeglądarce internetowej."
  },
  nl: {
    "landing.flex.tag": "SYSTEEMARCHITECTUUR",
    "landing.flex.title": "Ontworpen voor extreme privacy en milliseconde-prestaties",
    "landing.flex.desc": "Wij vertrouwen niet op trage cloudservers. HelpMyIMG maakt gebruik van next-generation WebAssembly om complexe AI-algoritmen rechtstreeks in het geheugen van uw browser uit te voeren.",
    "landing.flex.c1.title": "Lokale AI-verwerking",
    "landing.flex.c1.desc": "Uw gevoelige bestanden raken nooit onze servers aan. Alle AI-bewerkingen worden lokaal op uw apparaat uitgevoerd voor 100% privacy.",
    "landing.flex.c2.title": "0ms netwerklatentie",
    "landing.flex.c2.desc": "Sla de wachttijden voor uploaden en downloaden over. De verwerking begint precies op de milliseconde dat u uw foto's sleept en neerzet.",
    "landing.flex.c3.title": "Aangedreven door WebAssembly",
    "landing.flex.c3.desc": "Door gebruik te maken van ultrasnelle WASM-binaries evenaart HelpMyIMG de prestaties van native desktopapplicaties in de webbrowser."
  },
  sv: {
    "landing.flex.tag": "SYSTEMARKITEKTUR",
    "landing.flex.title": "Konstruerad för extrem integritet och millisekundprestanda",
    "landing.flex.desc": "Vi litar inte på långsamma molnservrar. HelpMyIMG använder nästa generations WebAssembly för att köra komplexa AI-algoritmer direkt i din webbläsares minne.",
    "landing.flex.c1.title": "Lokal AI-bearbetning",
    "landing.flex.c1.desc": "Dina känsliga filer rör aldrig våra servrar. Alla AI-operationer utförs lokalt på din enhet för 100 % integritet.",
    "landing.flex.c2.title": "0 ms nätverksfördröjning",
    "landing.flex.c2.desc": "Hoppa över väntetiderna för uppladdning och nedladdning. Bearbetningen börjar exakt den millisekund du drar och släpper dina foton.",
    "landing.flex.c3.title": "Drivs av WebAssembly",
    "landing.flex.c3.desc": "Genom att utnyttja ultrasnabba WASM-binärer matchar HelpMyIMG prestandan hos inbyggda skrivbordsprogram inuti webbläsaren."
  },
  ms: {
    "landing.flex.tag": "SENI BINA SISTEM",
    "landing.flex.title": "Direka untuk Privasi Ekstrem & Prestasi Milisaat",
    "landing.flex.desc": "Kami tidak bergantung pada pelayan awan yang perlahan. HelpMyIMG menggunakan WebAssembly generasi seterusnya untuk menjalankan algoritma AI kompleks secara langsung di dalam memori pelayar anda.",
    "landing.flex.c1.title": "Pemprosesan AI Tempatan",
    "landing.flex.c1.desc": "Fail sensitif anda tidak pernah menyentuh pelayan kami. Semua operasi AI dilaksanakan secara tempatan pada peranti anda untuk privasi 100%.",
    "landing.flex.c2.title": "Kependaman Rangkaian 0ms",
    "landing.flex.c2.desc": "Langkau masa menunggu muat naik dan muat turun. Pemprosesan bermula tepat pada milisaat anda menyeret dan melepaskan foto anda.",
    "landing.flex.c3.title": "Dikuasakan oleh WebAssembly",
    "landing.flex.c3.desc": "Memanfaatkan binari WASM ultra-pantas, HelpMyIMG menyamai prestasi aplikasi desktop asli di dalam pelayar web."
  },
  tl: {
    "landing.flex.tag": "ARKITEKTURA NG SISTEMA",
    "landing.flex.title": "Idinisenyo para sa Matinding Pagkapribado at Millisecond na Pagganap",
    "landing.flex.desc": "Hindi kami umaasa sa mabagal na cloud server. Ginagamit ng HelpMyIMG ang susunod na henerasyong WebAssembly para magpatakbo ng mga kumplikadong algorithm ng AI nang direkta sa memory ng iyong browser.",
    "landing.flex.c1.title": "Lokal na Pagproseso ng AI",
    "landing.flex.c1.desc": "Ang iyong mga sensitibong file ay hindi kailanman nahahawakan ang aming mga server. Ang lahat ng pagpapatakbo ng AI ay isinasagawa nang lokal sa iyong device para sa 100% na pagkapribado.",
    "landing.flex.c2.title": "0ms Network Latency",
    "landing.flex.c2.desc": "Laktawan ang mga oras ng paghihintay sa pag-upload at pag-download. Nagsisimula ang pagproseso sa eksaktong millisecond na i-drag at i-drop mo ang iyong mga larawan.",
    "landing.flex.c3.title": "Pinapagana ng WebAssembly",
    "landing.flex.c3.desc": "Sa paggamit ng mga ultra-fast na WASM na binary, tinutumbasan ng HelpMyIMG ang pagganap ng mga native na application sa desktop sa loob ng web browser."
  },
  uk: {
    "landing.flex.tag": "АРХІТЕКТУРА СИСТЕМИ",
    "landing.flex.title": "Розроблено для екстремальної конфіденційності та продуктивності мілісекунд",
    "landing.flex.desc": "Ми не покладаємося на повільні хмарні сервери. HelpMyIMG використовує WebAssembly наступного покоління для запуску складних алгоритмів штучного інтелекту безпосередньо в пам'яті вашого браузера.",
    "landing.flex.c1.title": "Локальна обробка ШІ",
    "landing.flex.c1.desc": "Ваші конфіденційні файли ніколи не торкаються наших серверів. Усі операції штучного інтелекту виконуються локально на вашому пристрої для 100% конфіденційності.",
    "landing.flex.c2.title": "Затримка мережі 0 мс",
    "landing.flex.c2.desc": "Пропустіть час очікування завантаження та завантаження. Обробка починається точно в ту мілісекунду, коли ви перетягуєте свої фотографії.",
    "landing.flex.c3.title": "На базі WebAssembly",
    "landing.flex.c3.desc": "Використовуючи надшвидкісні двійкові файли WASM, HelpMyIMG відповідає продуктивності власних настільних програм у веб-браузері."
  },
  ro: {
    "landing.flex.tag": "ARHITECTURA SISTEMULUI",
    "landing.flex.title": "Proiectat pentru confidențialitate extremă și performanță de milisecunde",
    "landing.flex.desc": "Nu ne bazăm pe servere cloud lente. HelpMyIMG utilizează WebAssembly de generație următoare pentru a rula algoritmi AI complecși direct în memoria browserului dvs.",
    "landing.flex.c1.title": "Procesare AI locală",
    "landing.flex.c1.desc": "Fișierele dvs. sensibile nu ne ating niciodată serverele. Toate operațiunile AI sunt executate local pe dispozitivul dvs. pentru confidențialitate 100%.",
    "landing.flex.c2.title": "Latență de rețea 0 ms",
    "landing.flex.c2.desc": "Treceți peste timpii de așteptare pentru încărcare și descărcare. Procesarea începe exact în milisecunda în care glisați și plasați fotografiile.",
    "landing.flex.c3.title": "Alimentat de WebAssembly",
    "landing.flex.c3.desc": "Folosind fișiere binare WASM ultra-rapide, HelpMyIMG se potrivește cu performanța aplicațiilor desktop native din interiorul browserului web."
  },
  el: {
    "landing.flex.tag": "ΑΡΧΙΤΕΚΤΟΝΙΚΗ ΣΥΣΤΗΜΑΤΟΣ",
    "landing.flex.title": "Σχεδιασμένο για ακραία ιδιωτικότητα και απόδοση χιλιοστού του δευτερολέπτου",
    "landing.flex.desc": "Δεν βασιζόμαστε σε αργούς διακομιστές cloud. Το HelpMyIMG χρησιμοποιεί WebAssembly επόμενης γενιάς για να εκτελεί πολύπλοκους αλγόριθμους τεχνητής νοημοσύνης απευθείας στη μνήμη του προγράμματος περιήγησής σας.",
    "landing.flex.c1.title": "Τοπική Επεξεργασία AI",
    "landing.flex.c1.desc": "Τα ευαίσθητα αρχεία σας δεν αγγίζουν ποτέ τους διακομιστές μας. Όλες οι λειτουργίες τεχνητής νοημοσύνης εκτελούνται τοπικά στη συσκευή σας για 100% ιδιωτικότητα.",
    "landing.flex.c2.title": "Καθυστέρηση δικτύου 0ms",
    "landing.flex.c2.desc": "Παραλείψτε τους χρόνους αναμονής μεταφόρτωσης και λήψης. Η επεξεργασία ξεκινά το ακριβές χιλιοστό του δευτερολέπτου που σύρετε και αποθέτετε τις φωτογραφίες σας.",
    "landing.flex.c3.title": "Υποστηρίζεται από το WebAssembly",
    "landing.flex.c3.desc": "Αξιοποιώντας τα εξαιρετικά γρήγορα δυαδικά αρχεία WASM, το HelpMyIMG ταιριάζει με την απόδοση των εγγενών εφαρμογών επιφάνειας εργασίας στο πρόγραμμα περιήγησης ιστού."
  },
  cs: {
    "landing.flex.tag": "ARCHITEKTURA SYSTÉMU",
    "landing.flex.title": "Navrženo pro extrémní soukromí a výkon v milisekundách",
    "landing.flex.desc": "Nespoléháme se na pomalé cloudové servery. HelpMyIMG využívá WebAssembly nové generace ke spouštění složitých algoritmů AI přímo v paměti vašeho prohlížeče.",
    "landing.flex.c1.title": "Místní zpracování AI",
    "landing.flex.c1.desc": "Vaše citlivé soubory se nikdy nedotknou našich serverů. Všechny operace AI jsou prováděny lokálně na vašem zařízení pro 100% soukromí.",
    "landing.flex.c2.title": "Zpoždění sítě 0 ms",
    "landing.flex.c2.desc": "Přeskočte čekací doby na nahrání a stažení. Zpracování začne přesně v tu milisekundu, kdy fotky přetáhnete a pustíte.",
    "landing.flex.c3.title": "Poháněno WebAssembly",
    "landing.flex.c3.desc": "Díky využití ultrarychlých binárních souborů WASM odpovídá HelpMyIMG výkonu nativních desktopových aplikací ve webovém prohlížeči."
  },
  hu: {
    "landing.flex.tag": "RENDSZERARCHITEKTÚRA",
    "landing.flex.title": "Extrém adatvédelemre és ezredmásodperces teljesítményre tervezve",
    "landing.flex.desc": "Nem támaszkodunk lassú felhőszerverekre. A HelpMyIMG a következő generációs WebAssembly-t használja összetett AI-algoritmusok futtatásához közvetlenül a böngésző memóriájában.",
    "landing.flex.c1.title": "Helyi AI feldolgozás",
    "landing.flex.c1.desc": "Érzékeny fájljai soha nem érintik szervereinket. Az összes AI-műveletet helyileg a saját eszközén hajtják végre a 100%-os adatvédelem érdekében.",
    "landing.flex.c2.title": "0 ms hálózati késés",
    "landing.flex.c2.desc": "Hagyja ki a feltöltési és letöltési várakozási időket. A feldolgozás pontosan abban a milliszekundumban kezdődik, amikor áthúzza és bedobja a fényképeit.",
    "landing.flex.c3.title": "WebAssembly hajtja",
    "landing.flex.c3.desc": "Az ultragyors WASM binárisok kihasználásával a HelpMyIMG megegyezik a natív asztali alkalmazások teljesítményével a webböngészőben."
  },
  da: {
    "landing.flex.tag": "SYSTEMARKITEKTUR",
    "landing.flex.title": "Konstrueret til ekstrem privatliv og millisekund ydeevne",
    "landing.flex.desc": "Vi stoler ikke på langsomme cloud-servere. HelpMyIMG bruger næste generations WebAssembly til at køre komplekse AI-algoritmer direkte i din browsers hukommelse.",
    "landing.flex.c1.title": "Lokal AI-behandling",
    "landing.flex.c1.desc": "Dine følsomme filer rører aldrig vores servere. Alle AI-operationer udføres lokalt på din enhed for 100 % privatliv.",
    "landing.flex.c2.title": "0ms netværksforsinkelse",
    "landing.flex.c2.desc": "Spring over ventetiderne for upload og download. Behandlingen begynder præcis i det millisekund, du trækker og slipper dine billeder.",
    "landing.flex.c3.title": "Drevet af WebAssembly",
    "landing.flex.c3.desc": "Ved at udnytte ultrahurtige WASM-binære filer matcher HelpMyIMG ydeevnen af native desktop-applikationer i webbrowseren."
  },
  fi: {
    "landing.flex.tag": "JÄRJESTELMÄARKKITEHTUURI",
    "landing.flex.title": "Suunniteltu äärimmäistä yksityisyyttä ja millisekunnin suorituskykyä varten",
    "landing.flex.desc": "Emme luota hitaisiin pilvipalvelimiin. HelpMyIMG hyödyntää seuraavan sukupolven WebAssemblya monimutkaisten tekoälyalgoritmien suorittamiseen suoraan selaimesi muistissa.",
    "landing.flex.c1.title": "Paikallinen tekoälyn käsittely",
    "landing.flex.c1.desc": "Arkaluontoiset tiedostosi eivät koskaan kosketa palvelimiamme. Kaikki tekoälytoiminnot suoritetaan paikallisesti laitteellasi 100 %:n yksityisyyden takaamiseksi.",
    "landing.flex.c2.title": "0 ms verkon viive",
    "landing.flex.c2.desc": "Ohita lataus- ja latausodotusajat. Käsittely alkaa juuri sillä millisekunnilla, kun vedät ja pudotat valokuvasi.",
    "landing.flex.c3.title": "Toimii WebAssemblyllä",
    "landing.flex.c3.desc": "Hyödyntämällä erittäin nopeita WASM-binaareja HelpMyIMG vastaa alkuperäisten työpöytäsovellusten suorituskykyä verkkoselaimessa."
  },
  no: {
    "landing.flex.tag": "SYSTEMARKITEKTUR",
    "landing.flex.title": "Konstruert for ekstremt personvern og millisekund ytelse",
    "landing.flex.desc": "Vi stoler ikke på trege skyservere. HelpMyIMG bruker neste generasjons WebAssembly til å kjøre komplekse AI-algoritmer direkte i nettleserens minne.",
    "landing.flex.c1.title": "Lokal AI-behandling",
    "landing.flex.c1.desc": "Dine sensitive filer berører aldri serverne våre. Alle AI-operasjoner utføres lokalt på enheten din for 100 % personvern.",
    "landing.flex.c2.title": "0ms nettverksforsinkelse",
    "landing.flex.c2.desc": "Hopp over ventetidene for opplasting og nedlasting. Behandlingen starter akkurat i det millisekundet du drar og slipper bildene dine.",
    "landing.flex.c3.title": "Drevet av WebAssembly",
    "landing.flex.c3.desc": "Ved å utnytte ultraraske WASM-binære filer, matcher HelpMyIMG ytelsen til native skrivebordsapplikasjoner inne i nettleseren."
  },
  he: {
    "landing.flex.tag": "ארכיטקטורת מערכת",
    "landing.flex.title": "תוכנן לפרטיות קיצונית וביצועים של מילישניות",
    "landing.flex.desc": "אנחנו לא מסתמכים על שרתי ענן איטיים. HelpMyIMG מנצל את ה-WebAssembly של הדור הבא כדי להפעיל אלגוריתמי AI מורכבים ישירות בתוך זיכרון הדפדפן שלך.",
    "landing.flex.c1.title": "עיבוד AI מקומי",
    "landing.flex.c1.desc": "הקבצים הרגישים שלך לעולם לא נוגעים בשרתים שלנו. כל פעולות ה-AI מבוצעות באופן מקומי במכשיר שלך לפרטיות של 100%.",
    "landing.flex.c2.title": "השהיית רשת של 0ms",
    "landing.flex.c2.desc": "דלג על זמני ההמתנה להעלאה ולהורדה. העיבוד מתחיל בדיוק באלפית השנייה שאתה גורר ומשחרר את התמונות שלך.",
    "landing.flex.c3.title": "מופעל על ידי WebAssembly",
    "landing.flex.c3.desc": "על ידי מינוף קבצים בינאריים מהירים במיוחד של WASM, HelpMyIMG משתווה לביצועים של יישומי שולחן עבודה מקוריים בתוך דפדפן האינטרנט."
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
    console.log(`[${lang}] Injected flex translations chunk 2`);
  }
}
