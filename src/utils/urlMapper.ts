// src/utils/urlMapper.ts

// Defines internal tool types
export type InternalTool = 'remove' | 'color' | 'watermark' | 'brush' | 'compress' | 'compress100kb' | 'compress50kb' | 'convert' | 'resize' | 'resizeig' | 'crop' | 'rotate' | 'picker' | 'blurface' | 'design';

// Fallback mapped slugs for English
export const FALLBACK_SLUGS: Record<InternalTool, string> = {
  remove: 'remove-background',
  color: 'change-background',
  watermark: 'watermark-image',
  brush: 'magic-brush',
  compress: 'compress-image',
  compress100kb: 'compress-image-to-100kb',
  compress50kb: 'compress-image-to-50kb',
  resizeig: 'resize-image-for-instagram',
  convert: 'convert-image',
  resize: 'resize-image',
  crop: 'crop-image',
  rotate: 'rotate-image',
  picker: 'image-color-picker',
  blurface: 'blur-face',
  design: 'advanced-editor'
};

// // Tool Slugs mapping for 30 Languages
// Structure: SLUG_MAP[lang][tool] = localized-slug
export const SLUG_MAP: Record<string, Record<string, string>> = {
  ar: { remove: 'izalat-khalfia', color: 'taghyir-khalfia', watermark: 'alama-maiya', compress: 'daght-sura', compress100kb: 'daght-sura-100kb', convert: 'tahwil-sura', resize: 'taghyir-hajm', crop: 'qass-sura', rotate: 'tadwir-sura', picker: 'istikhraja-alwan', blurface: 'tamwih-al-wajh', design: 'muharrir-tasamim', brush: 'furshat-sihriya', compress50kb: 'daght-sura-50kb', resizeig: 'taghyir-hajm-instagram' },
  bg: { remove: 'premahvane-fon', color: 'smyana-fon', watermark: 'voden-znak', compress: 'kompresirane-izobrazhenie', compress100kb: 'kompresirane-100kb', convert: 'konvertirane-izobrazhenie', resize: 'orazmeryavane-izobrazhenie', crop: 'izryazvane-izobrazhenie', rotate: 'zavartane-izobrazhenie', picker: 'izvilichane-tsvetove', blurface: 'zamazvane-na-litse', design: 'redaktor-za-dizayn', brush: 'magicheska-chetka', compress50kb: 'compress-image-to-50kb', resizeig: 'resize-image-for-instagram' },
  cs: { remove: 'odstraneni-pozadi', color: 'zmena-pozadi', watermark: 'vodoznak', compress: 'komprese-obrazku', compress100kb: 'komprese-na-100kb', convert: 'prevod-obrazku', resize: 'zmena-velikosti', crop: 'oriznuti-obrazku', rotate: 'otoceni-obrazku', picker: 'vyber-barev', blurface: 'rozmazat-oblicej', design: 'pokrocily-editor', brush: 'kouzelny-stetec', compress50kb: 'komprese-na-50kb', resizeig: 'zmena-velikosti-instagram' },
  da: { remove: 'fjern-baggrund', color: 'skift-baggrund', watermark: 'vandmaerke', compress: 'komprimer-billede', compress100kb: 'komprimer-til-100kb', convert: 'konverter-billede', resize: 'tilpas-billede', crop: 'beskaer-billede', rotate: 'roter-billede', picker: 'farvevaelger', blurface: 'sloret-ansigt', design: 'avanceret-editor', brush: 'magisk-pensel', compress50kb: 'komprimer-til-50kb', resizeig: 'tilpas-til-instagram' },
  de: { remove: 'hintergrund-entfernen', color: 'hintergrund-aendern', watermark: 'wasserzeichen', compress: 'bild-komprimieren', compress100kb: 'bild-auf-100kb-komprimieren', convert: 'bild-konvertieren', resize: 'bild-skalieren', crop: 'bild-zuschneiden', rotate: 'bild-drehen', picker: 'farbauswahl', blurface: 'gesicht-verwischen', design: 'fortgeschrittener-editor', brush: 'magischer-pinsel', compress50kb: 'bild-auf-50kb-komprimieren', resizeig: 'bild-fuer-instagram-skalieren' },
  el: { remove: 'afairesi-fontou', color: 'allagi-fontou', watermark: 'ydatografima', compress: 'sympiesi-eikonas', compress100kb: 'sympiesi-se-100kb', convert: 'metatropi-eikonas', resize: 'allagi-megethous', crop: 'perikopi-eikonas', rotate: 'peristrafi-eikonas', picker: 'epilogi-chromatos', blurface: 'tholo-prosopo', design: 'programma-epexergasias', brush: 'magiko-pinelo', compress50kb: 'sympiesi-se-50kb', resizeig: 'allagi-megethous-instagram' },
  en: { remove: 'remove-background', color: 'change-background', watermark: 'watermark-image', compress: 'compress-image', compress100kb: 'compress-image-to-100kb',
  compress50kb: 'compress-image-to-50kb',
  resizeig: 'resize-image-for-instagram', convert: 'convert-image', resize: 'resize-image', crop: 'crop-image', rotate: 'rotate-image', picker: 'image-color-picker', blurface: 'blur-face', design: 'advanced-editor', brush: 'magic-brush' },
  es: { remove: 'quitar-fondo', color: 'cambiar-fondo', watermark: 'marca-de-agua', compress: 'comprimir-imagen', compress100kb: 'comprimir-imagen-a-100kb', convert: 'convertir-imagen', resize: 'redimensionar-imagen', crop: 'recortar-imagen', rotate: 'rotar-imagen', picker: 'selector-de-color', blurface: 'difuminar-rostro', design: 'editor-de-diseno', brush: 'pincel-magico', compress50kb: 'comprimir-imagen-a-50kb', resizeig: 'redimensionar-para-instagram' },
  fi: { remove: 'poista-tausta', color: 'vaihda-tausta', watermark: 'vesileima', compress: 'pakkaa-kuva', compress100kb: 'pakkaa-100kb', convert: 'muunna-kuva', resize: 'muuta-kokoa', crop: 'rajaa-kuva', rotate: 'kierita-kuva', picker: 'varipaletti', blurface: 'sumentaa-kasvot', design: 'kehittynyt-editori', brush: 'taikasivellin', compress50kb: 'pakkaa-50kb', resizeig: 'muuta-kokoa-instagram' },
  fr: { remove: 'supprimer-fond', color: 'changer-fond', watermark: 'filigrane', compress: 'compresser-image', compress100kb: 'compresser-image-100ko', convert: 'convertir-image', resize: 'redimensionner-image', crop: 'rogner-image', rotate: 'pivoter-image', picker: 'pipette-couleur', blurface: 'flouter-visage', design: 'editeur-avance', brush: 'pinceau-magique', compress50kb: 'compresser-image-50ko', resizeig: 'redimensionner-pour-instagram' },
  he: { remove: 'hasarat-reka', color: 'shinui-reka', watermark: 'siman-maim', compress: 'dchisat-tmuna', compress100kb: 'dchisat-tmuna-100kb', convert: 'hamarat-tmuna', resize: 'shinui-godel', crop: 'chitucha-tmuna', rotate: 'sivuv-tmuna', picker: 'bocher-tseva', blurface: 'tistush-panim', design: 'orech-itzuv', brush: 'mivreshet-kesem', compress50kb: 'dchisat-tmuna-50kb', resizeig: 'shinui-godel-instagram' },
  hi: { remove: 'background-hatao', color: 'background-badlo', watermark: 'watermark-lagao', compress: 'image-compress', compress100kb: 'image-compress-100kb', convert: 'image-convert', resize: 'image-resize', crop: 'image-crop', rotate: 'image-rotate', picker: 'rang-chunen', blurface: 'chehra-dhundhla-kare', design: 'design-editor', brush: 'magic-brush', compress50kb: 'image-compress-50kb', resizeig: 'instagram-image-resize' },
  hu: { remove: 'hatter-eltavolitas', color: 'hatter-modositas', watermark: 'vizjel', compress: 'kep-tomorites', compress100kb: 'kep-tomorites-100kb', convert: 'kep-konvertalas', resize: 'kep-atmeretezes', crop: 'kep-vagas', rotate: 'kep-forgatas', picker: 'szinvalaszto', blurface: 'arc-elmosasa', design: 'fejlett-szerkeszto', brush: 'varazsecset', compress50kb: 'kep-tomorites-50kb', resizeig: 'instagram-atmeretezes' },
  id: { remove: 'hapus-latar-belakang', color: 'ganti-background', watermark: 'buat-watermark', compress: 'kompres-gambar', compress100kb: 'kompres-foto-100kb', convert: 'ubah-format-gambar', resize: 'ubah-ukuran-gambar', crop: 'potong-gambar', rotate: 'putar-gambar', picker: 'ambil-warna-gambar', blurface: 'sensor-wajah', design: 'editor-desain', brush: 'kuas-ajaib', compress50kb: 'kompres-foto-50kb', resizeig: 'ubah-ukuran-instagram' },
  it: { remove: 'rimuovi-sfondo', color: 'cambia-sfondo', watermark: 'filigrana', compress: 'comprimi-immagine', compress100kb: 'comprimi-immagine-100kb', convert: 'converti-immagine', resize: 'ridimensiona-immagine', crop: 'ritaglia-immagine', rotate: 'ruota-immagine', picker: 'selettore-colore', blurface: 'sfoca-viso', design: 'editor-di-design', brush: 'pennello-magico', compress50kb: 'comprimi-immagine-50kb', resizeig: 'ridimensiona-per-instagram' },
  ja: { remove: 'haikei-sakuzyo', color: 'haikei-henko', watermark: 'sukashi', compress: 'gazo-asshuku', compress100kb: 'gazo-asshuku-100kb', convert: 'gazo-henkan', resize: 'gazo-ri-saizu', crop: 'gazo-torimingu', rotate: 'gazo-kaiten', picker: 'iro-supotto', blurface: 'kao-bokashi', design: 'dezain-edita', brush: 'majikku-burashi', compress50kb: 'gazo-asshuku-50kb', resizeig: 'insutaguramu-ri-saizu' },
  ko: { remove: 'baegyeong-jegeo', color: 'baegyeong-byeongyeong', watermark: 'woteomakeu', compress: 'imiji-abchuk', compress100kb: 'imiji-abchuk-100kb', convert: 'imiji-byeonhwan', resize: 'imiji-keugi-jojeong', crop: 'imiji-jareugi', rotate: 'imiji-hoejeon', picker: 'saek-chuchul', blurface: 'eolgul-beulleo', design: 'dijain-editeo', brush: 'maejik-beureosi', compress50kb: 'imiji-abchuk-50kb', resizeig: 'inseuta-imiji-keugi' },
  ms: { remove: 'buang-latar-belakang', color: 'tukar-latar-belakang', watermark: 'tanda-air', compress: 'mampat-imej', compress100kb: 'mampat-imej-100kb', convert: 'tukar-imej', resize: 'ubah-saiz-imej', crop: 'pangkas-imej', rotate: 'putar-imej', picker: 'pemilih-warna', blurface: 'kabur-wajah', design: 'editor-reka-bentuk', brush: 'berus-ajaib', compress50kb: 'mampat-imej-50kb', resizeig: 'ubah-saiz-instagram' },
  nl: { remove: 'achtergrond-verwijderen', color: 'achtergrond-wijzigen', watermark: 'watermerk', compress: 'afbeelding-comprimeren', compress100kb: 'afbeelding-comprimeren-100kb', convert: 'afbeelding-converteren', resize: 'afbeelding-verkleinen', crop: 'afbeelding-bijsnijden', rotate: 'afbeelding-draaien', picker: 'kleurkiezer', blurface: 'gezicht-vervagen', design: 'geavanceerde-editor', brush: 'magisch-penseel', compress50kb: 'afbeelding-comprimeren-50kb', resizeig: 'verkleinen-voor-instagram' },
  no: { remove: 'fjern-bakgrunn', color: 'endre-bakgrunn', watermark: 'vannmerke', compress: 'komprimer-bilde', compress100kb: 'komprimer-til-100kb', convert: 'konverter-bilde', resize: 'endre-bildestorrelse', crop: 'beskjaer-bilde', rotate: 'roter-bilde', picker: 'fargevelger', blurface: 'sladd-ansikt', design: 'avansert-editor', brush: 'magisk-pensel', compress50kb: 'komprimer-til-50kb', resizeig: 'endre-storrelse-instagram' },
  pl: { remove: 'usun-tlo', color: 'zmien-tlo', watermark: 'znak-wodny', compress: 'kompresja-obrazu', compress100kb: 'kompresja-obrazu-100kb', convert: 'konwersja-obrazu', resize: 'zmiana-rozmiaru', crop: 'przycinanie-obrazu', rotate: 'obroc-obraz', picker: 'wybieracz-kolorow', blurface: 'rozmycie-twarzy', design: 'zaawansowany-edytor', brush: 'magiczny-pedzel', compress50kb: 'kompresja-obrazu-50kb', resizeig: 'zmiana-rozmiaru-instagram' },
  pt: { remove: 'remover-fundo', color: 'mudar-fundo', watermark: 'marca-dagua', compress: 'comprimir-imagem', compress100kb: 'comprimir-imagem-100kb', convert: 'converter-imagem', resize: 'redimensionar-imagem', crop: 'cortar-imagem', rotate: 'girar-imagem', picker: 'seletor-de-cores', blurface: 'desfocar-rosto', design: 'editor-de-design', brush: 'pincel-magico', compress50kb: 'comprimir-imagem-50kb', resizeig: 'redimensionar-para-instagram' },
  ro: { remove: 'eliminare-fundal', color: 'schimbare-fundal', watermark: 'filigran', compress: 'comprimare-imagine', compress100kb: 'comprimare-imagine-100kb', convert: 'convertire-imagine', resize: 'redimensionare-imagine', crop: 'decupare-imagine', rotate: 'rotire-imagine', picker: 'selector-culori', blurface: 'estompare-fata', design: 'editor-avansat', brush: 'pensula-magica', compress50kb: 'comprimare-imagine-50kb', resizeig: 'redimensionare-instagram' },
  ru: { remove: 'udalit-fon', color: 'izmenit-fon', watermark: 'vodyanoy-znak', compress: 'szhat-izobrazhenie', compress100kb: 'szhat-izobrazhenie-100kb', convert: 'konvertirovat-izobrazhenie', resize: 'izmenit-razmer', crop: 'obrezat-izobrazhenie', rotate: 'povernut-izobrazhenie', picker: 'vybor-tsveta', blurface: 'razmyt-litso', design: 'rasshirennyy-redaktor', brush: 'volshebnaya-kist', compress50kb: 'szhat-izobrazhenie-50kb', resizeig: 'izmenit-razmer-dlya-instagram' },
  sv: { remove: 'ta-bort-bakgrund', color: 'andra-bakgrund', watermark: 'vattenstampel', compress: 'komprimera-bild', compress100kb: 'komprimera-bild-100kb', convert: 'konvertera-bild', resize: 'andra-storlek', crop: 'beskara-bild', rotate: 'rotera-bild', picker: 'fargvaljare', blurface: 'oskarpt-ansikte', design: 'avancerad-redigerare', brush: 'magisk-pensel', compress50kb: 'komprimera-bild-50kb', resizeig: 'andra-storlek-for-instagram' },
  th: { remove: 'lop-phun-lang', color: 'plian-phun-lang', watermark: 'lai-nam', compress: 'bip-ad-rup-phap', compress100kb: 'bip-ad-rup-phap-100kb', convert: 'plaeng-rup-phap', resize: 'plian-kha-nad-rup', crop: 'tat-rup-phap', rotate: 'mun-rup-phap', picker: 'luk-si', blurface: 'blae-na', design: 'khrueang-mue-ook-baeb', brush: 'paeng-wises', compress50kb: 'bip-ad-rup-phap-50kb', resizeig: 'plian-kha-nad-ig' },
  tl: { remove: 'alisin-background', color: 'palitan-background', watermark: 'watermark', compress: 'i-compress-larawan', compress100kb: 'i-compress-larawan-100kb', convert: 'i-convert-larawan', resize: 'baguhin-sukat', crop: 'i-crop-larawan', rotate: 'i-rotate-larawan', picker: 'tagapili-kulay', blurface: 'palabuin-ang-mukha', design: 'advanced-na-editor', brush: 'magic-brush', compress50kb: 'compress-image-to-50kb', resizeig: 'resize-image-for-instagram' },
  tr: { remove: 'arka-plan-kaldir', color: 'arka-plan-degistir', watermark: 'filigran', compress: 'resim-sikistir', compress100kb: 'resim-sikistir-100kb', convert: 'resim-donustur', resize: 'boyutlandir', crop: 'resim-kirp', rotate: 'resim-dondur', picker: 'renk-secici', blurface: 'yuz-bulaniklastirma', design: 'gelismis-editor', brush: 'sihirli-firca', compress50kb: 'resim-sikistir-50kb', resizeig: 'instagram-icin-boyutlandir' },
  uk: { remove: 'vydalyty-tlo', color: 'zminyty-tlo', watermark: 'vodyanyy-znak', compress: 'stysnuty-zobrazhennya', compress100kb: 'stysnuty-do-100kb', convert: 'konvertuvaty-zobrazhennya', resize: 'zminyty-rozmir', crop: 'obrizaty-zobrazhennya', rotate: 'povernuty-zobrazhennya', picker: 'vybir-koloru', blurface: 'rozmyty-oblychchya', design: 'rozshyrenyy-redaktor', brush: 'charivnyy-penzel', compress50kb: 'stysnuty-do-50kb', resizeig: 'zminyty-rozmir-instagram' },
  vi: { remove: 'xoa-nen', color: 'doi-nen', watermark: 'dong-dau-anh', compress: 'nen-anh', compress100kb: 'nen-anh-100kb', convert: 'chuyen-doi-anh', resize: 'doi-kich-thuoc', crop: 'cat-anh', rotate: 'xoay-anh', picker: 'chon-mau', blurface: 'lam-mo-khuon-mat', design: 'trinh-chinh-sua', brush: 'co-ma-thuat', compress50kb: 'nen-anh-50kb', resizeig: 'doi-kich-thuoc-instagram' },
  zh: { remove: 'quchu-beijing', color: 'genghuan-beijing', watermark: 'shuiyin', compress: 'yasuo-tupian', compress100kb: 'yasuo-tupian-100kb', convert: 'zhuanhuan-tupian', resize: 'tiaozheng-daxiao', crop: 'caijian-tupian', rotate: 'xuanzhuan-tupian', picker: 'yanse-xuanze', blurface: 'mohu-renlian', design: 'gaoji-bianjiqi', brush: 'moshu-huabi', compress50kb: 'yasuo-tupian-50kb', resizeig: 'tiaozheng-ins-chicun' }
};

// Flatten to reverse lookup (slug -> {lang, tool})
const REVERSE_LOOKUP: Record<string, { lang: string; tool: InternalTool }> = {};

Object.entries(SLUG_MAP).forEach(([lang, tools]) => {
  Object.entries(tools).forEach(([tool, slug]) => {
    REVERSE_LOOKUP[slug] = { lang, tool: tool as InternalTool };
  });
});

/**
 * Get internal tool name from a localized slug.
 */
export function getToolFromSlug(slug: string, _oldLang?: string): InternalTool {
  if (REVERSE_LOOKUP[slug]) {
    return REVERSE_LOOKUP[slug].tool;
  }
  
  // Fallback to check EN standard slugs
  if (slug === 'remove-background') return 'remove';
  if (slug === 'change-background') return 'color';
  if (slug === 'watermark-image') return 'watermark';
  if (slug === 'compress-image') return 'compress';
  if (slug === 'compress-image-to-100kb') return 'compress100kb';
  if (slug === 'compress-image-to-50kb') return 'compress50kb';
  if (slug === 'resize-image-for-instagram') return 'resizeig';
  if (slug === 'convert-image') return 'convert';
  if (slug === 'resize-image') return 'resize';
  if (slug === 'crop-image') return 'crop';
  if (slug === 'rotate-image') return 'rotate';
  if (slug === 'image-color-picker') return 'picker';
  if (slug === 'blur-face') return 'blurface';
  if (slug === 'advanced-editor') return 'design';
  
  return 'remove'; // Default fallback
}

/**
 * Get localized slug for a given tool and language.
 */
export function getLocalizedSlug(tool: InternalTool, lang: string): string {
  if (SLUG_MAP[lang] && SLUG_MAP[lang][tool]) {
    return SLUG_MAP[lang][tool];
  }
  
  return FALLBACK_SLUGS[tool] || FALLBACK_SLUGS['remove'];
}
