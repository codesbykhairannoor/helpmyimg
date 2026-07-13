const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, '../public/locales');
const languages = fs.readdirSync(localesDir).filter(f => fs.statSync(path.join(localesDir, f)).isDirectory());

// Color Picker translations for all 30 languages
const translations = {
  ar: {
    'nav.picker': 'منتقي الألوان',
    'landing.default.title.picker': 'منتقي ألوان الصور عبر الإنترنت مجانًا',
    'landing.default.desc.picker': 'ابحث عن رموز ألوان HEX وRGB وHSL وCMYK من صورك باستخدام أداة القطارة المجانية عبر الإنترنت.',
    'picker.title': 'منتقي ألوان الصورة',
    'picker.instruction': 'انقر في أي مكان على الصورة أعلاه للحصول على الرمز الدقيق للألوان ومعلومات اللون التفصيلية.',
    'picker.clickedColor': 'اللون الذي تم النقر عليه',
    'picker.noColor': 'لم يتم اختيار لون بعد. انقر على الصورة أعلاه لاستخراج لون.',
    'picker.palette': 'لوحة الألوان المهيمنة',
    'picker.history': 'سجل الألوان',
    'work.badge.picker': 'المنتقي',
    'grid.pickerDesc': 'استخرج رموز الألوان ولوحة الألوان من أي صورة باستخدام أداة القطارة.'
  },
  cs: {
    'nav.picker': 'Kapátko barev',
    'landing.default.title.picker': 'Online kapátko na barvy z obrázku zdarma',
    'landing.default.desc.picker': 'Najděte HEX, RGB, HSL a CMYK barevné kódy ze svých obrázků s naším online kapátkem zdarma.',
    'picker.title': 'Výběr barev z obrázku',
    'picker.instruction': 'Klikněte kamkoli na obrázek výše, abyste získali přesný kód barvy a podrobné informace.',
    'picker.clickedColor': 'Vybraná barva',
    'picker.noColor': 'Zatím nebyla vybrána žádná barva. Kliknutím na obrázek výše ji vyberete.',
    'picker.palette': 'Dominantní paleta',
    'picker.history': 'Historie barev',
    'work.badge.picker': 'Kapátko',
    'grid.pickerDesc': 'Získejte barevné kódy a paletu z jakéhokoli obrázku pomocí kapátka.'
  },
  da: {
    'nav.picker': 'Farvevælger',
    'landing.default.title.picker': 'Online farvevælger fra billede gratis',
    'landing.default.desc.picker': 'Find HEX, RGB, HSL og CMYK farvekoder fra dine billeder med vores gratis online pipetteværktøj.',
    'picker.title': 'Farvevælger fra billede',
    'picker.instruction': 'Klik et vilkårligt sted på billedet ovenfor for at hente den præcise farvekode og detaljer.',
    'picker.clickedColor': 'Valgt farve',
    'picker.noColor': 'Ingen farve valgt endnu. Klik på billedet ovenfor for at vælge en farve.',
    'picker.palette': 'Dominerende palet',
    'picker.history': 'Farvehistorik',
    'work.badge.picker': 'Farvevælger',
    'grid.pickerDesc': 'Udpak farvekoder og farvepalet fra ethvert billede med pipetten.'
  },
  de: {
    'nav.picker': 'Farbwähler',
    'landing.default.title.picker': 'Online Farbwähler aus Bild kostenlos',
    'landing.default.desc.picker': 'Finden Sie HEX-, RGB-, HSL- und CMYK-Farbcodes aus Ihren Bildern mit unserer kostenlosen Online-Pipette.',
    'picker.title': 'Bild-Farbauswahl',
    'picker.instruction': 'Klicken Sie auf das Bild oben, um den genauen Farbcode und Details zu extrahieren.',
    'picker.clickedColor': 'Ausgewählte Farbe',
    'picker.noColor': 'Noch keine Farbe ausgewählt. Klicken Sie auf das Bild oben, um eine zu wählen.',
    'picker.palette': 'Dominante Farbpalette',
    'picker.history': 'Farbverlauf',
    'work.badge.picker': 'Farbauswahl',
    'grid.pickerDesc': 'Extrahieren Sie Farbcodes und Paletten aus jedem Bild mit der Pipette.'
  },
  el: {
    'nav.picker': 'Επιλογέας Χρώματος',
    'landing.default.title.picker': 'Δωρεάν online επιλογέας χρώματος από εικόνα',
    'landing.default.desc.picker': 'Βρείτε κωδικούς χρωμάτων HEX, RGB, HSL και CMYK από τις εικόνες σας με το δωρεάν online σταγονόμετρο.',
    'picker.title': 'Επιλογέας χρώματος εικόνας',
    'picker.instruction': 'Κάντε κλικ οπουδήποτε στην παραπάνω εικόνα για να λάβετε τον ακριβή κωδικό και λεπτομέρειες.',
    'picker.clickedColor': 'Επιλεγμένο χρώμα',
    'picker.noColor': 'Δεν έχει επιλεγεί χρώμα ακόμα. Κάντε κλικ στην εικόνα για να επιλέξετε.',
    'picker.palette': 'Κυρίαρχη παλέτα',
    'picker.history': 'Ιστορικό χρωμάτων',
    'work.badge.picker': 'Επιλογέας',
    'grid.pickerDesc': 'Εξάγετε χρωματικούς κώδικες και παλέτες από οποιαδήποτε εικόνα.'
  },
  en: {
    'nav.picker': 'Color Picker',
    'landing.default.title.picker': 'Free Online Image Color Picker',
    'landing.default.desc.picker': 'Find HEX, RGB, HSL, and CMYK color codes from your images with our free online eyedropper tool.',
    'picker.title': 'Image Color Picker',
    'picker.instruction': 'Click anywhere on the image above to get the precise color code and detailed color information.',
    'picker.clickedColor': 'Clicked Color',
    'picker.noColor': 'No color picked yet. Click on the image above to extract a color.',
    'picker.palette': 'Dominant Palette',
    'picker.history': 'Color History',
    'work.badge.picker': 'Picker',
    'grid.pickerDesc': 'Extract color codes and color palettes from any image with the eyedropper tool.'
  },
  es: {
    'nav.picker': 'Selector de Color',
    'landing.default.title.picker': 'Selector de color de imagen online gratis',
    'landing.default.desc.picker': 'Encuentra códigos de color HEX, RGB, HSL y CMYK de tus imágenes con nuestro cuentagotas online gratis.',
    'picker.title': 'Selector de color de imagen',
    'picker.instruction': 'Haz clic en cualquier parte de la imagen de arriba para obtener el código de color exacto y los detalles.',
    'picker.clickedColor': 'Color seleccionado',
    'picker.noColor': 'Aún no se ha seleccionado color. Haz clic en la imagen de arriba para extraer uno.',
    'picker.palette': 'Paleta dominante',
    'picker.history': 'Historial de colores',
    'work.badge.picker': 'Selector',
    'grid.pickerDesc': 'Extrae códigos de color y paletas de colores de cualquier imagen con la pipeta.'
  },
  fi: {
    'nav.picker': 'Värivalitsin',
    'landing.default.title.picker': 'Ilmainen värivalitsin kuvasta netissä',
    'landing.default.desc.picker': 'Etsi HEX, RGB, HSL ja CMYK värikoodit kuvistasi ilmaisella online pipettityökalullamme.',
    'picker.title': 'Kuvan värivalitsin',
    'picker.instruction': 'Klikkaa mitä tahansa kohtaa kuvassa saadaksesi tarkan värikoodin ja tiedot.',
    'picker.clickedColor': 'Valittu väri',
    'picker.noColor': 'Väriä ei ole vielä valittu. Klikkaa kuvaa valitaksesi värin.',
    'picker.palette': 'Hallitseva paletti',
    'picker.history': 'Värihistoria',
    'work.badge.picker': 'Valitsin',
    'grid.pickerDesc': 'Poimi värikoodit ja väripaletti mistä tahansa kuvasta pipettityökalulla.'
  },
  fr: {
    'nav.picker': 'Pipette Couleur',
    'landing.default.title.picker': 'Pipette à couleur image en ligne gratuite',
    'landing.default.desc.picker': 'Trouvez les codes couleur HEX, RGB, HSL et CMYK de vos images avec notre pipette en ligne gratuite.',
    'picker.title': 'Pipette de couleur image',
    'picker.instruction': 'Cliquez n\'importe où sur l\'image ci-dessus pour obtenir le code couleur exact et ses détails.',
    'picker.clickedColor': 'Couleur sélectionnée',
    'picker.noColor': 'Aucune couleur sélectionnée. Cliquez sur l\'image ci-dessus pour en extraire une.',
    'picker.palette': 'Palette dominante',
    'picker.history': 'Historique des couleurs',
    'work.badge.picker': 'Pipette',
    'grid.pickerDesc': 'Extrayez des codes couleur et des palettes de n\'importe quelle image avec la pipette.'
  },
  he: {
    'nav.picker': 'בוחר צבעים',
    'landing.default.title.picker': 'דוגם צבעים מתמונה אונליין בחינם',
    'landing.default.desc.picker': 'מצא קודי צבע HEX, RGB, HSL ו-CMYK מהתמונות שלך עם כלי הטפטפת המקוון החינמי שלנו.',
    'picker.title': 'דוגם צבעים מתמונה',
    'picker.instruction': 'לחץ במקום כלשהו בתמונה למעלה כדי לקבל את קוד הצבע המדויק ופרטים מלאים.',
    'picker.clickedColor': 'הצבע שנבחר',
    'picker.noColor': 'טרם נבחר צבע. לחץ על התמונה למעله כדי לדגום צבע.',
    'picker.palette': 'פלטת צבעים שולטת',
    'picker.history': 'היסטוריית צבעים',
    'work.badge.picker': 'דוגם',
    'grid.pickerDesc': 'חלץ קודי צבע ופלטות צבעים מכל תמונה באמצעות כלי הטפטפת.'
  },
  hi: {
    'nav.picker': 'कलर पिकर',
    'landing.default.title.picker': 'मुफ्त ऑनलाइन इमेज कलर पिकर',
    'landing.default.desc.picker': 'हमारे मुफ्त ऑनलाइन आईड्रॉपर टूल के साथ अपनी छवियों से HEX, RGB, HSL और CMYK रंग कोड खोजें।',
    'picker.title': 'इमेज कलर पिकर',
    'picker.instruction': 'सटीक रंग कोड और विस्तृत रंग जानकारी प्राप्त करने के लिए ऊपर की छवि पर कहीं भी क्लिक करें।',
    'picker.clickedColor': 'चुना गया रंग',
    'picker.noColor': 'अभी तक कोई रंग नहीं चुना गया। रंग निकालने के लिए ऊपर की छवि पर क्लिक करें।',
    'picker.palette': 'मुख्य रंग पैलेट',
    'picker.history': 'रंगों का इतिहास',
    'work.badge.picker': 'पिकर',
    'grid.pickerDesc': 'आईड्रॉपर टूल से किसी भी छवि से रंग कोड और रंग पैलेट निकालें।'
  },
  hu: {
    'nav.picker': 'Színválasztó',
    'landing.default.title.picker': 'Ingyenes online színválasztó képből',
    'landing.default.desc.picker': 'Keresse meg a HEX, RGB, HSL és CMYK színkódokat a képeiből az ingyenes online pipetta eszközünkkel.',
    'picker.title': 'Kép színválasztó',
    'picker.instruction': 'Kattintson bárhová a fenti képen a pontos színkód és a részletek lekéréséhez.',
    'picker.clickedColor': 'Kiválasztott szín',
    'picker.noColor': 'Még nincs szín kiválasztva. Kattintson a fenti képre a szín kinyeréséhez.',
    'picker.palette': 'Domináns paletta',
    'picker.history': 'Szín előzmények',
    'work.badge.picker': 'Választó',
    'grid.pickerDesc': 'Színkódok és színpaletták kinyerése bármilyen képből a pipetta segítségével.'
  },
  id: {
    'nav.picker': 'Ambil Warna Gambar',
    'landing.default.title.picker': 'Pengambil Warna Gambar Online Gratis',
    'landing.default.desc.picker': 'Temukan kode warna HEX, RGB, HSL, dan CMYK dari gambar Anda dengan alat pipet (eyedropper) online kami yang gratis.',
    'picker.title': 'Pengambil Warna Gambar',
    'picker.instruction': 'Klik di bagian mana saja pada gambar di atas untuk mendapatkan kode warna yang presisi beserta informasi detail warnanya.',
    'picker.clickedColor': 'Warna yang Diklik',
    'picker.noColor': 'Belum ada warna yang dipilih. Klik pada gambar di atas untuk mengekstrak warna.',
    'picker.palette': 'Palet Warna Dominan',
    'picker.history': 'Riwayat Warna',
    'work.badge.picker': 'Pipet',
    'grid.pickerDesc': 'Ekstrak kode warna dan palet warna dari gambar apa saja menggunakan alat pipet eyedropper.'
  },
  it: {
    'nav.picker': 'Selettore Colore',
    'landing.default.title.picker': 'Selettore colore da immagine online gratis',
    'landing.default.desc.picker': 'Trova i codici colore HEX, RGB, HSL e CMYK dalle tue immagini con il nostro contagocce online gratuito.',
    'picker.title': 'Selettore colore immagine',
    'picker.instruction': 'Fai clic su qualsiasi punto dell\'immagine sopra per ottenere il codice colore esatto e i dettagli.',
    'picker.clickedColor': 'Colore selezionato',
    'picker.noColor': 'Nessun colore selezionato. Fai clic sull\'immagine sopra per estrarne uno.',
    'picker.palette': 'Tavolozza dominante',
    'picker.history': 'Cronologia colori',
    'work.badge.picker': 'Selettore',
    'grid.pickerDesc': 'Estrai codici colore e tavolozze da qualsiasi immagine con lo strumento contagocce.'
  },
  ja: {
    'nav.picker': 'カラーピッカー',
    'landing.default.title.picker': '無料オンライン画像カラーピッカー',
    'landing.default.desc.picker': '無料のオンラインスポイトツールを使用して、画像からHEX、RGB、HSL、およびCMYKカラーコードを見つけます。',
    'picker.title': '画像カラーピッカー',
    'picker.instruction': '上の画像の任意の場所をクリックして、正確なカラーコードと詳細情報を取得します。',
    'picker.clickedColor': 'クリックした色',
    'picker.noColor': '色がまだ選択されていません。上の画像をクリックして色を抽出します。',
    'picker.palette': '主要なパレット',
    'picker.history': 'カラー履歴',
    'work.badge.picker': 'ピッカー',
    'grid.pickerDesc': 'スポイトツールを使用して、画像からカラーコードとパレットを抽出します。'
  },
  ko: {
    'nav.picker': '컬러 피커',
    'landing.default.title.picker': '무료 온라인 이미지 색상 추출기',
    'landing.default.desc.picker': '무료 온라인 스포이트 도구를 사용하여 이미지에서 HEX, RGB, HSL 및 CMYK 색상 코드를 찾으십시오.',
    'picker.title': '이미지 색상 추출기',
    'picker.instruction': '정확한 색상 코드와 상세 정보를 얻으려면 위 이미지의 아무 곳이나 클릭하십시오.',
    'picker.clickedColor': '선택한 색상',
    'picker.noColor': '선택한 색상이 없습니다. 위 이미지를 클릭하여 색상을 추출하세요.',
    'picker.palette': '지배적인 팔레트',
    'picker.history': '색상 기록',
    'work.badge.picker': '피커',
    'grid.pickerDesc': '스포이트 도구를 사용하여 모든 이미지에서 색상 코드와 팔레트를 추출합니다.'
  },
  ms: {
    'nav.picker': 'Pemilih Warna',
    'landing.default.title.picker': 'Pemilih warna imej online percuma',
    'landing.default.desc.picker': 'Cari kod warna HEX, RGB, HSL dan CMYK daripada gambar anda menggunakan alat penitik (eyedropper) online percuma kami.',
    'picker.title': 'Pemilih Warna Imej',
    'picker.instruction': 'Klik di mana-mana bahagian pada imej di atas untuk mendapatkan kod warna yang tepat dan maklumat terperinci.',
    'picker.clickedColor': 'Warna yang Diklik',
    'picker.noColor': 'Belum ada warna yang dipilih. Klik pada imej di atas untuk mendapatkan warna.',
    'picker.palette': 'Palet Warna Dominan',
    'picker.history': 'Sejarah Warna',
    'work.badge.picker': 'Pemilih',
    'grid.pickerDesc': 'Ekstrak kod warna dan palet warna daripada mana-mana imej dengan alat penitik.'
  },
  nl: {
    'nav.picker': 'Kleurkiezer',
    'landing.default.title.picker': 'Gratis online kleurkiezer uit afbeelding',
    'landing.default.desc.picker': 'Vind HEX, RGB, HSL en CMYK kleurcodes uit uw afbeeldingen met onze gratis online pipettool.',
    'picker.title': 'Afbeelding kleurkiezer',
    'picker.instruction': 'Klik ergens op de afbeelding hierboven om de exacte kleurcode en details te extraheren.',
    'picker.clickedColor': 'Geselecteerde kleur',
    'picker.noColor': 'Nog geen kleur geselecteerd. Klik op de afbeelding hierboven om er een te kiezen.',
    'picker.palette': 'Dominant palet',
    'picker.history': 'Kleurgeschiedenis',
    'work.badge.picker': 'Kleurkiezer',
    'grid.pickerDesc': 'Extraheer kleurcodes en kleurenpaletten uit elke afbeelding met de pipet.'
  },
  no: {
    'nav.picker': 'Fargevelger',
    'landing.default.title.picker': 'Gratis online fargevelger fra bilde',
    'landing.default.desc.picker': 'Finn HEX, RGB, HSL og CMYK fargekoder fra bildene dine med vårt gratis online pipetteverktøy.',
    'picker.title': 'Fargevelger fra bilde',
    'picker.instruction': 'Klikk hvor som helst på bildet over for å hente den presise fargekoden.',
    'picker.clickedColor': 'Valgt farge',
    'picker.noColor': 'Ingen farge valgt ennå. Klikk på bildet over for å velge farge.',
    'picker.palette': 'Dominerende palett',
    'picker.history': 'Fargehistorikk',
    'work.badge.picker': 'Fargevelger',
    'grid.pickerDesc': 'Hent fargekoder og fargepalett fra ethvert bilde med pipetten.'
  },
  pl: {
    'nav.picker': 'Kapátko barev',
    'landing.default.title.picker': 'Darmowe kapátko online do pobierania kolorów ze zdjęcia',
    'landing.default.desc.picker': 'Znajdź kody kolorów HEX, RGB, HSL i CMYK ze swoich zdjęć za pomocą darmowego kapátka online.',
    'picker.title': 'Próbnik kolorów ze zdjęcia',
    'picker.instruction': 'Kliknij w dowolnym miejscu na powyższym zdjęciu, aby pobrać dokładny kod koloru i szczegóły.',
    'picker.clickedColor': 'Wybrany kolor',
    'picker.noColor': 'Nie wybrano jeszcze koloru. Kliknij na zdjęcie powyżej, aby pobrać kolor.',
    'picker.palette': 'Dominująca paleta',
    'picker.history': 'Historia kolorów',
    'work.badge.picker': 'Próbnik',
    'grid.pickerDesc': 'Pobieraj kody kolorów i palety z dowolnego zdjęcia za pomocą próbnik.'
  },
  pt: {
    'nav.picker': 'Seletor de Cores',
    'landing.default.title.picker': 'Seletor de cores de imagem online grátis',
    'landing.default.desc.picker': 'Encontre códigos de cores HEX, RGB, HSL e CMYK de suas imagens com nossa ferramenta conta-gotas online grátis.',
    'picker.title': 'Seletor de cores de imagem',
    'picker.instruction': 'Clique em qualquer lugar na imagem acima untuk obter o código exato da cor e detalhes.',
    'picker.clickedColor': 'Cor selecionada',
    'picker.noColor': 'Nenhuma cor selecionada ainda. Clique na imagem acima para extrair uma cor.',
    'picker.palette': 'Paleta dominante',
    'picker.history': 'Histórico de cores',
    'work.badge.picker': 'Seletor',
    'grid.pickerDesc': 'Extraia códigos de cores e paletas de cores de qualquer imagem com o conta-gotas.'
  },
  ro: {
    'nav.picker': 'Selector Culori',
    'landing.default.title.picker': 'Selector de culori din imagine online gratis',
    'landing.default.desc.picker': 'Găsiți coduri de culoare HEX, RGB, HSL și CMYK din imaginile dvs. cu instrumentul nostru online gratuit.',
    'picker.title': 'Selector de culori imagine',
    'picker.instruction': 'Faceți clic oriunde pe imaginea de mai sus pentru a obține codul exact de culoare și detalii.',
    'picker.clickedColor': 'Culoare selectată',
    'picker.noColor': 'Nicio culoare selectată încă. Faceți clic pe imaginea de mai sus pentru a selecta una.',
    'picker.palette': 'Paletă dominantă',
    'picker.history': 'Istoric culori',
    'work.badge.picker': 'Selector',
    'grid.pickerDesc': 'Extrageți coduri de culoare și palete din orice imagine cu pipeta.'
  },
  ru: {
    'nav.picker': 'Пипетка Цвета',
    'landing.default.title.picker': 'Бесплатная онлайн пипетка для выбора цвета с картинки',
    'landing.default.desc.picker': 'Узнайте коды цветов HEX, RGB, HSL и CMYK с ваших изображений с помощью бесплатного онлайн-инструмента пипетки.',
    'picker.title': 'Пипетка для выбора цвета',
    'picker.instruction': 'Нажмите на любое место на изображении выше, чтобы получить точный код цвета и подробную информацию.',
    'picker.clickedColor': 'Выбранный цвет',
    'picker.noColor': 'Цвет еще не выбран. Нажмите на изображение выше, чтобы выбрать цвет.',
    'picker.palette': 'Доминирующая палитра',
    'picker.history': 'История цветов',
    'work.badge.picker': 'Пипетка',
    'grid.pickerDesc': 'Извлекайте коды цветов и палитры с любого изображения с помощью пипетки.'
  },
  sv: {
    'nav.picker': 'Färgpipett',
    'landing.default.title.picker': 'Gratis färgväljare från bild online',
    'landing.default.desc.picker': 'Hitta färgkoder som HEX, RGB, HSL och CMYK från dina bilder med vår gratis online färgpipett.',
    'picker.title': 'Färgpipett för bilder',
    'picker.instruction': 'Klicka var som helst på bilden ovan för att hämta den exakta färgkoden.',
    'picker.clickedColor': 'Vald färg',
    'picker.noColor': 'Ingen färg har valts än. Klicka på bilden ovan för att välja en färg.',
    'picker.palette': 'Dominerande palett',
    'picker.history': 'Färghistorik',
    'work.badge.picker': 'Pipett',
    'grid.pickerDesc': 'Hämta färgkoder och färgpaletter från alla bilder med pipetten.'
  },
  th: {
    'nav.picker': 'ดูดสีจากภาพ',
    'landing.default.title.picker': 'เครื่องมือดูดสีจากภาพออนไลน์ฟรี',
    'landing.default.desc.picker': 'ค้นหารหัสสี HEX, RGB, HSL และ CMYK จากภาพของคุณด้วยเครื่องมือดูดสีออนไลน์ฟรีของเรา',
    'picker.title': 'เครื่องมือดูดสีจากภาพ',
    'picker.instruction': 'คลิกที่ใดก็ได้บนรูปภาพด้านบนเพื่อรับรหัสสีที่แม่นยำและข้อมูลสีโดยละเอียด',
    'picker.clickedColor': 'สีที่เลือก',
    'picker.noColor': 'ยังไม่มีการเลือกสี คลิกที่รูปภาพด้านบนเพื่อดูดสี',
    'picker.palette': 'จานสีหลัก',
    'picker.history': 'ประวัติการดูดสี',
    'work.badge.picker': 'ดูดสี',
    'grid.pickerDesc': 'ดึงรหัสสีและจานสีจากรูปภาพใดๆ ด้วยเครื่องมือดูดสี'
  },
  tl: {
    'nav.picker': 'Pumili ng Kulay',
    'landing.default.title.picker': 'Libreng image color picker online',
    'landing.default.desc.picker': 'Hanapin ang HEX, RGB, HSL at CMYK color codes mula sa iyong mga larawan gamit ang libreng online eyedropper tool.',
    'picker.title': 'Image Color Picker',
    'picker.instruction': 'I-click ang kahit saan sa larawan sa itaas para makuha ang eksaktong code ng kulay at detalye nito.',
    'picker.clickedColor': 'Napiling Kulay',
    'picker.noColor': 'Wala pang napipiling kulay. I-click ang larawan sa itaas para kumuha ng kulay.',
    'picker.palette': 'Dominanteng Paleta',
    'picker.history': 'Kasaysayan ng Kulay',
    'work.badge.picker': 'Picker',
    'grid.pickerDesc': 'Kumuha ng mga kulay at paleta ng kulay mula sa anumang larawan gamit ang pipeta.'
  },
  tr: {
    'nav.picker': 'Renk Seçici',
    'landing.default.title.picker': 'Resimden renk seçme aracı çevrimiçi ücretsiz',
    'landing.default.desc.picker': 'Ücretsiz çevrimiçi damlalık aracımızla resimlerinizden HEX, RGB, HSL ve CMYK renk kodlarını bulun.',
    'picker.title': 'Resim Renk Seçici',
    'picker.instruction': 'Hassas renk kodunu ve ayrıntılı renk bilgilerini almak için yukarıdaki resimde herhangi bir yere tıklayın.',
    'picker.clickedColor': 'Seçilen Renk',
    'picker.noColor': 'Henüz renk seçilmedi. Renk almak için yukarıdaki resme tıklayın.',
    'picker.palette': 'Baskın Renk Paleti',
    'picker.history': 'Renk Geçmişi',
    'work.badge.picker': 'Seçici',
    'grid.pickerDesc': 'Damlalık aracıyla herhangi bir resimden renk kodlarını ve renk paletlerini çıkarın.'
  },
  uk: {
    'nav.picker': 'Піпетка Кольору',
    'landing.default.title.picker': 'Безкоштовна онлайн піпетка кольору з картинки',
    'landing.default.desc.picker': 'Дізнайтеся коди кольорів HEX, RGB, HSL та CMYK з ваших зображень за допомогою безкоштовного онлайн-інструменту піпетки.',
    'picker.title': 'Піпетка вибору кольору',
    'picker.instruction': 'Клацніть у будь-якому місці на зображенні вище, щоб отримати точний код кольору.',
    'picker.clickedColor': 'Вибраний колір',
    'picker.noColor': 'Колір ще не вибрано. Клацніть на зображення вище, щоб вибрати коліr.',
    'picker.palette': 'Домінуюча палітра',
    'picker.history': 'Історія кольорів',
    'work.badge.picker': 'Піпетка',
    'grid.pickerDesc': 'Витягуйте коди кольорів та палітри з будь-якого зображення за допомогою піпетки.'
  },
  vi: {
    'nav.picker': 'Chọn Màu Ảnh',
    'landing.default.title.picker': 'Công cụ chọn màu từ ảnh online miễn phí',
    'landing.default.desc.picker': 'Tìm mã màu HEX, RGB, HSL và CMYK từ hình ảnh của bạn bằng công cụ lấy màu (pipette) trực tuyến miễn phí của chúng tôi.',
    'picker.title': 'Công cụ lấy màu từ ảnh',
    'picker.instruction': 'Nhấp vào bất kỳ đâu trên ảnh phía trên để lấy mã màu chính xác và thông tin chi tiết.',
    'picker.clickedColor': 'Màu đã chọn',
    'picker.noColor': 'Chưa chọn màu nào. Nhấp vào ảnh phía trên để lấy màu.',
    'picker.palette': 'Bảng màu chủ đạo',
    'picker.history': 'Lịch sử chọn màu',
    'work.badge.picker': 'Lấy màu',
    'grid.pickerDesc': 'Trích xuất mã màu và bảng màu từ bất kỳ ảnh nào bằng công cụ chấm màu.'
  },
  zh: {
    'nav.picker': '图片颜色提取',
    'landing.default.title.picker': '免费在线图片取色器',
    'landing.default.desc.picker': '使用我们免费的在线吸管工具，从您的图片中获取HEX、RGB、HSL和CMYK颜色代码。',
    'picker.title': '图片颜色提取器',
    'picker.instruction': '点击上方图片任意位置，即可提取精确的颜色代码和详细颜色信息。',
    'picker.clickedColor': '提取的颜色',
    'picker.noColor': '尚未提取颜色。点击上方图片提取颜色。',
    'picker.palette': '主色调调色板',
    'picker.history': '提取历史',
    'work.badge.picker': '取色',
    'grid.pickerDesc': '使用吸管工具从任意图片中提取颜色代码和色板。'
  }
};

// For languages not explicitly listed, use English as fallback
const fallback = translations['en'];

languages.forEach(lang => {
  const filePath = path.join(localesDir, lang, 'translation.json');
  if (!fs.existsSync(filePath)) return;
  
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const langTranslations = translations[lang] || fallback;
  
  // Only inject if not already present
  if (!data['nav.picker']) {
    Object.entries(langTranslations).forEach(([key, val]) => {
      data[key] = val;
    });
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Updated ${lang}`);
  } else {
    console.log(`Skipped ${lang} (already has picker)`);
  }
});
