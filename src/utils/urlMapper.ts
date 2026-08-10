// src/utils/urlMapper.ts

// Defines internal tool types
export type InternalTool = 'remove' | 'color' | 'watermark' | 'brush' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker' | 'blurface' | 'design';

// Fallback mapped slugs for English
export const FALLBACK_SLUGS: Record<InternalTool, string> = {
  remove: 'remove-background',
  color: 'change-background',
  watermark: 'watermark-image',
  brush: 'magic-brush',
  compress: 'compress-image',
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
  ar: { remove: 'izalat-khalfia', color: 'taghyir-khalfia', watermark: 'alama-maiya', compress: 'daght-sura', convert: 'tahwil-sura', resize: 'taghyir-hajm', crop: 'qass-sura', rotate: 'tadwir-sura', picker: 'istikhraja-alwan', blurface: 'tamwih-al-wajh', design: 'muharrir-tasamim', brush: 'furshat-sihriya' },
  bg: { remove: 'premahvane-fon', color: 'smyana-fon', watermark: 'voden-znak', compress: 'kompresirane-izobrazhenie', convert: 'konvertirane-izobrazhenie', resize: 'orazmeryavane-izobrazhenie', crop: 'izryazvane-izobrazhenie', rotate: 'zavartane-izobrazhenie', picker: 'izvilichane-tsvetove', blurface: 'zamazvane-na-litse', design: 'redaktor-za-dizayn', brush: 'magicheska-chetka' },
  cs: { remove: 'odstraneni-pozadi', color: 'zmena-pozadi', watermark: 'vodoznak', compress: 'komprese-obrazku', convert: 'prevod-obrazku', resize: 'zmena-velikosti', crop: 'oriznuti-obrazku', rotate: 'otoceni-obrazku', picker: 'vyber-barev', blurface: 'rozmazat-oblicej', design: 'pokrocily-editor', brush: 'kouzelny-stetec' },
  da: { remove: 'fjern-baggrund', color: 'skift-baggrund', watermark: 'vandmaerke', compress: 'komprimer-billede', convert: 'konverter-billede', resize: 'tilpas-billede', crop: 'beskaer-billede', rotate: 'roter-billede', picker: 'farvevaelger', blurface: 'sloret-ansigt', design: 'avanceret-editor', brush: 'magisk-pensel' },
  de: { remove: 'hintergrund-entfernen', color: 'hintergrund-aendern', watermark: 'wasserzeichen', compress: 'bild-komprimieren', convert: 'bild-konvertieren', resize: 'bild-skalieren', crop: 'bild-zuschneiden', rotate: 'bild-drehen', picker: 'farbauswahl', blurface: 'gesicht-verwischen', design: 'fortgeschrittener-editor', brush: 'magischer-pinsel' },
  el: { remove: 'afairesi-fontou', color: 'allagi-fontou', watermark: 'ydatografima', compress: 'sympiesi-eikonas', convert: 'metatropi-eikonas', resize: 'allagi-megethous', crop: 'perikopi-eikonas', rotate: 'peristrafi-eikonas', picker: 'epilogi-chromatos', blurface: 'tholo-prosopo', design: 'programma-epexergasias', brush: 'magiko-pinelo' },
  en: { remove: 'remove-background', color: 'change-background', watermark: 'watermark-image', compress: 'compress-image', convert: 'convert-image', resize: 'resize-image', crop: 'crop-image', rotate: 'rotate-image', picker: 'image-color-picker', blurface: 'blur-face', design: 'advanced-editor', brush: 'magic-brush' },
  es: { remove: 'quitar-fondo', color: 'cambiar-fondo', watermark: 'marca-de-agua', compress: 'comprimir-imagen', convert: 'convertir-imagen', resize: 'redimensionar-imagen', crop: 'recortar-imagen', rotate: 'rotar-imagen', picker: 'selector-de-color', blurface: 'difuminar-rostro', design: 'editor-de-diseno', brush: 'pincel-magico' },
  fi: { remove: 'poista-tausta', color: 'vaihda-tausta', watermark: 'vesileima', compress: 'pakkaa-kuva', convert: 'muunna-kuva', resize: 'muuta-kokoa', crop: 'rajaa-kuva', rotate: 'kierita-kuva', picker: 'varipaletti', blurface: 'sumentaa-kasvot', design: 'kehittynyt-editori', brush: 'taikasivellin' },
  fr: { remove: 'supprimer-fond', color: 'changer-fond', watermark: 'filigrane', compress: 'compresser-image', convert: 'convertir-image', resize: 'redimensionner-image', crop: 'rogner-image', rotate: 'pivoter-image', picker: 'pipette-couleur', blurface: 'flouter-visage', design: 'editeur-avance', brush: 'pinceau-magique' },
  he: { remove: 'hasarat-reka', color: 'shinui-reka', watermark: 'siman-maim', compress: 'dchisat-tmuna', convert: 'hamarat-tmuna', resize: 'shinui-godel', crop: 'chitucha-tmuna', rotate: 'sivuv-tmuna', picker: 'bocher-tseva', blurface: 'tistush-panim', design: 'orech-itzuv', brush: 'mivreshet-kesem' },
  hi: { remove: 'background-hatao', color: 'background-badlo', watermark: 'watermark-lagao', compress: 'image-compress', convert: 'image-convert', resize: 'image-resize', crop: 'image-crop', rotate: 'image-rotate', picker: 'rang-chunen', blurface: 'chehra-dhundhla-kare', design: 'design-editor', brush: 'magic-brush' },
  hu: { remove: 'hatter-eltavolitas', color: 'hatter-modositas', watermark: 'vizjel', compress: 'kep-tomorites', convert: 'kep-konvertalas', resize: 'kep-atmeretezes', crop: 'kep-vagas', rotate: 'kep-forgatas', picker: 'szinvalaszto', blurface: 'arc-elmosasa', design: 'fejlett-szerkeszto', brush: 'varazsecset' },
  id: { remove: 'hapus-latar-belakang', color: 'ganti-background', watermark: 'buat-watermark', compress: 'kompres-gambar', convert: 'ubah-format-gambar', resize: 'ubah-ukuran-gambar', crop: 'potong-gambar', rotate: 'putar-gambar', picker: 'ambil-warna-gambar', blurface: 'sensor-wajah', design: 'editor-desain', brush: 'kuas-ajaib' },
  it: { remove: 'rimuovi-sfondo', color: 'cambia-sfondo', watermark: 'filigrana', compress: 'comprimi-immagine', convert: 'converti-immagine', resize: 'ridimensiona-immagine', crop: 'ritaglia-immagine', rotate: 'ruota-immagine', picker: 'selettore-colore', blurface: 'sfoca-viso', design: 'editor-di-design', brush: 'pennello-magico' },
  ja: { remove: 'haikei-sakuzyo', color: 'haikei-henko', watermark: 'sukashi', compress: 'gazo-asshuku', convert: 'gazo-henkan', resize: 'gazo-ri-saizu', crop: 'gazo-torimingu', rotate: 'gazo-kaiten', picker: 'iro-supotto', blurface: 'kao-bokashi', design: 'dezain-edita', brush: 'majikku-burashi' },
  ko: { remove: 'baegyeong-jegeo', color: 'baegyeong-byeongyeong', watermark: 'woteomakeu', compress: 'imiji-abchuk', convert: 'imiji-byeonhwan', resize: 'imiji-keugi-jojeong', crop: 'imiji-jareugi', rotate: 'imiji-hoejeon', picker: 'saek-chuchul', blurface: 'eolgul-beulleo', design: 'dijain-editeo', brush: 'maejik-beureosi' },
  ms: { remove: 'buang-latar-belakang', color: 'tukar-latar-belakang', watermark: 'tanda-air', compress: 'mampat-imej', convert: 'tukar-imej', resize: 'ubah-saiz-imej', crop: 'pangkas-imej', rotate: 'putar-imej', picker: 'pemilih-warna', blurface: 'kabur-wajah', design: 'editor-reka-bentuk', brush: 'berus-ajaib' },
  nl: { remove: 'achtergrond-verwijderen', color: 'achtergrond-wijzigen', watermark: 'watermerk', compress: 'afbeelding-comprimeren', convert: 'afbeelding-converteren', resize: 'afbeelding-verkleinen', crop: 'afbeelding-bijsnijden', rotate: 'afbeelding-draaien', picker: 'kleurkiezer', blurface: 'gezicht-vervagen', design: 'geavanceerde-editor', brush: 'magisch-penseel' },
  no: { remove: 'fjern-bakgrunn', color: 'endre-bakgrunn', watermark: 'vannmerke', compress: 'komprimer-bilde', convert: 'konverter-bilde', resize: 'endre-bildestorrelse', crop: 'beskjaer-bilde', rotate: 'roter-bilde', picker: 'fargevelger', blurface: 'sladd-ansikt', design: 'avansert-editor', brush: 'magisk-pensel' },
  pl: { remove: 'usun-tlo', color: 'zmien-tlo', watermark: 'znak-wodny', compress: 'kompresja-obrazu', convert: 'konwersja-obrazu', resize: 'zmiana-rozmiaru', crop: 'przycinanie-obrazu', rotate: 'obroc-obraz', picker: 'wybieracz-kolorow', blurface: 'rozmycie-twarzy', design: 'zaawansowany-edytor', brush: 'magiczny-pedzel' },
  pt: { remove: 'remover-fundo', color: 'mudar-fundo', watermark: 'marca-dagua', compress: 'comprimir-imagem', convert: 'converter-imagem', resize: 'redimensionar-imagem', crop: 'cortar-imagem', rotate: 'girar-imagem', picker: 'seletor-de-cores', blurface: 'desfocar-rosto', design: 'editor-de-design', brush: 'pincel-magico' },
  ro: { remove: 'eliminare-fundal', color: 'schimbare-fundal', watermark: 'filigran', compress: 'comprimare-imagine', convert: 'convertire-imagine', resize: 'redimensionare-imagine', crop: 'decupare-imagine', rotate: 'rotire-imagine', picker: 'selector-culori', blurface: 'estompare-fata', design: 'editor-avansat', brush: 'pensula-magica' },
  ru: { remove: 'udalit-fon', color: 'izmenit-fon', watermark: 'vodyanoy-znak', compress: 'szhat-izobrazhenie', convert: 'konvertirovat-izobrazhenie', resize: 'izmenit-razmer', crop: 'obrezat-izobrazhenie', rotate: 'povernut-izobrazhenie', picker: 'vybor-tsveta', blurface: 'razmyt-litso', design: 'rasshirennyy-redaktor', brush: 'volshebnaya-kist' },
  sv: { remove: 'ta-bort-bakgrund', color: 'andra-bakgrund', watermark: 'vattenstampel', compress: 'komprimera-bild', convert: 'konvertera-bild', resize: 'andra-storlek', crop: 'beskara-bild', rotate: 'rotera-bild', picker: 'fargvaljare', blurface: 'oskarpt-ansikte', design: 'avancerad-redigerare', brush: 'magisk-pensel' },
  th: { remove: 'lop-phun-lang', color: 'plian-phun-lang', watermark: 'lai-nam', compress: 'bip-ad-rup-phap', convert: 'plaeng-rup-phap', resize: 'plian-kha-nad-rup', crop: 'tat-rup-phap', rotate: 'mun-rup-phap', picker: 'luk-si', blurface: 'blae-na', design: 'khrueang-mue-ook-baeb', brush: 'paeng-wises' },
  tl: { remove: 'alisin-background', color: 'palitan-background', watermark: 'watermark', compress: 'i-compress-larawan', convert: 'i-convert-larawan', resize: 'baguhin-sukat', crop: 'i-crop-larawan', rotate: 'i-rotate-larawan', picker: 'tagapili-kulay', blurface: 'palabuin-ang-mukha', design: 'advanced-na-editor', brush: 'magic-brush' },
  tr: { remove: 'arka-plan-kaldir', color: 'arka-plan-degistir', watermark: 'filigran', compress: 'resim-sikistir', convert: 'resim-donustur', resize: 'boyutlandir', crop: 'resim-kirp', rotate: 'resim-dondur', picker: 'renk-secici', blurface: 'yuz-bulaniklastirma', design: 'gelismis-editor', brush: 'sihirli-firca' },
  uk: { remove: 'vydalyty-tlo', color: 'zminyty-tlo', watermark: 'vodyanyy-znak', compress: 'stysnuty-zobrazhennya', convert: 'konvertuvaty-zobrazhennya', resize: 'zminyty-rozmir', crop: 'obrizaty-zobrazhennya', rotate: 'povernuty-zobrazhennya', picker: 'vybir-koloru', blurface: 'rozmyty-oblychchya', design: 'rozshyrenyy-redaktor', brush: 'charivnyy-penzel' },
  vi: { remove: 'xoa-nen', color: 'doi-nen', watermark: 'dong-dau-anh', compress: 'nen-anh', convert: 'chuyen-doi-anh', resize: 'doi-kich-thuoc', crop: 'cat-anh', rotate: 'xoay-anh', picker: 'chon-mau', blurface: 'lam-mo-khuon-mat', design: 'trinh-chinh-sua', brush: 'co-ma-thuat' },
  zh: { remove: 'quchu-beijing', color: 'genghuan-beijing', watermark: 'shuiyin', compress: 'yasuo-tupian', convert: 'zhuanhuan-tupian', resize: 'tiaozheng-daxiao', crop: 'caijian-tupian', rotate: 'xuanzhuan-tupian', picker: 'yanse-xuanze', blurface: 'mohu-renlian', design: 'gaoji-bianjiqi', brush: 'moshu-huabi' }
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
