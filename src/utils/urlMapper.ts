// src/utils/urlMapper.ts

// Defines internal tool types
export type InternalTool = 'remove' | 'color' | 'watermark' | 'brush' | 'compress' | 'convert' | 'resize' | 'crop' | 'rotate' | 'picker';

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
  picker: 'image-color-picker'
};

// Tool Slugs mapping for 30 Languages
// Structure: SLUG_MAP[lang][tool] = localized-slug
export const SLUG_MAP: Record<string, Record<string, string>> = {
  ar: { remove: 'izalat-khalfia', color: 'taghyir-khalfia', watermark: 'alama-maiya', compress: 'daght-sura', convert: 'tahwil-sura', resize: 'taghyir-hajm', crop: 'qass-sura', rotate: 'tadwir-sura', picker: 'istikhraja-alwan' },
  bg: { remove: 'premahvane-fon', color: 'smyana-fon', watermark: 'voden-znak', compress: 'kompresirane-izobrazhenie', convert: 'konvertirane-izobrazhenie', resize: 'orazmeryavane-izobrazhenie', crop: 'izryazvane-izobrazhenie', rotate: 'zavartane-izobrazhenie', picker: 'izvilichane-tsvetove' },
  cs: { remove: 'odstraneni-pozadi', color: 'zmena-pozadi', watermark: 'vodoznak', compress: 'komprese-obrazku', convert: 'prevod-obrazku', resize: 'zmena-velikosti', crop: 'oriznuti-obrazku', rotate: 'otoceni-obrazku', picker: 'vyber-barev' },
  da: { remove: 'fjern-baggrund', color: 'skift-baggrund', watermark: 'vandmaerke', compress: 'komprimer-billede', convert: 'konverter-billede', resize: 'tilpas-billede', crop: 'beskaer-billede', rotate: 'roter-billede', picker: 'farvevaelger' },
  de: { remove: 'hintergrund-entfernen', color: 'hintergrund-aendern', watermark: 'wasserzeichen', compress: 'bild-komprimieren', convert: 'bild-konvertieren', resize: 'bild-skalieren', crop: 'bild-zuschneiden', rotate: 'bild-drehen', picker: 'farbauswahl' },
  el: { remove: 'afairesi-fontou', color: 'allagi-fontou', watermark: 'ydatografima', compress: 'sympiesi-eikonas', convert: 'metatropi-eikonas', resize: 'allagi-megethous', crop: 'perikopi-eikonas', rotate: 'peristrafi-eikonas', picker: 'epilogi-chromatos' },
  en: { remove: 'remove-background', color: 'change-background', watermark: 'watermark-image', compress: 'compress-image', convert: 'convert-image', resize: 'resize-image', crop: 'crop-image', rotate: 'rotate-image', picker: 'image-color-picker' },
  es: { remove: 'quitar-fondo', color: 'cambiar-fondo', watermark: 'marca-de-agua', compress: 'comprimir-imagen', convert: 'convertir-imagen', resize: 'redimensionar-imagen', crop: 'recortar-imagen', rotate: 'rotar-imagen', picker: 'selector-de-color' },
  fi: { remove: 'poista-tausta', color: 'vaihda-tausta', watermark: 'vesileima', compress: 'pakkaa-kuva', convert: 'muunna-kuva', resize: 'muuta-kokoa', crop: 'rajaa-kuva', rotate: 'kierita-kuva', picker: 'varipaletti' },
  fr: { remove: 'supprimer-fond', color: 'changer-fond', watermark: 'filigrane', compress: 'compresser-image', convert: 'convertir-image', resize: 'redimensionner-image', crop: 'rogner-image', rotate: 'pivoter-image', picker: 'pipette-couleur' },
  he: { remove: 'hasarat-reka', color: 'shinui-reka', watermark: 'siman-maim', compress: 'dchisat-tmuna', convert: 'hamarat-tmuna', resize: 'shinui-godel', crop: 'chitucha-tmuna', rotate: 'sivuv-tmuna', picker: 'bocher-tseva' },
  hi: { remove: 'background-hatao', color: 'background-badlo', watermark: 'watermark-lagao', compress: 'image-compress', convert: 'image-convert', resize: 'image-resize', crop: 'image-crop', rotate: 'image-rotate', picker: 'rang-chunen' },
  hu: { remove: 'hatter-eltavolitas', color: 'hatter-modositas', watermark: 'vizjel', compress: 'kep-tomorites', convert: 'kep-konvertalas', resize: 'kep-atmeretezes', crop: 'kep-vagas', rotate: 'kep-forgatas', picker: 'szinvalaszto' },
  id: { remove: 'hapus-latar-belakang', color: 'ganti-background', watermark: 'buat-watermark', compress: 'kompres-gambar', convert: 'ubah-format-gambar', resize: 'ubah-ukuran-gambar', crop: 'potong-gambar', rotate: 'putar-gambar', picker: 'ambil-warna-gambar' },
  it: { remove: 'rimuovi-sfondo', color: 'cambia-sfondo', watermark: 'filigrana', compress: 'comprimi-immagine', convert: 'converti-immagine', resize: 'ridimensiona-immagine', crop: 'ritaglia-immagine', rotate: 'ruota-immagine', picker: 'selettore-colore' },
  ja: { remove: 'haikei-sakuzyo', color: 'haikei-henko', watermark: 'sukashi', compress: 'gazo-asshuku', convert: 'gazo-henkan', resize: 'gazo-ri-saizu', crop: 'gazo-torimingu', rotate: 'gazo-kaiten', picker: 'iro-supotto' },
  ko: { remove: 'baegyeong-jegeo', color: 'baegyeong-byeongyeong', watermark: 'woteomakeu', compress: 'imiji-abchuk', convert: 'imiji-byeonhwan', resize: 'imiji-keugi-jojeong', crop: 'imiji-jareugi', rotate: 'imiji-hoejeon', picker: 'saek-chuchul' },
  ms: { remove: 'buang-latar-belakang', color: 'tukar-latar-belakang', watermark: 'tanda-air', compress: 'mampat-imej', convert: 'tukar-imej', resize: 'ubah-saiz-imej', crop: 'pangkas-imej', rotate: 'putar-imej', picker: 'pemilih-warna' },
  nl: { remove: 'achtergrond-verwijderen', color: 'achtergrond-wijzigen', watermark: 'watermerk', compress: 'afbeelding-comprimeren', convert: 'afbeelding-converteren', resize: 'afbeelding-verkleinen', crop: 'afbeelding-bijsnijden', rotate: 'afbeelding-draaien', picker: 'kleurkiezer' },
  no: { remove: 'fjern-bakgrunn', color: 'endre-bakgrunn', watermark: 'vannmerke', compress: 'komprimer-bilde', convert: 'konverter-bilde', resize: 'endre-bildestorrelse', crop: 'beskjaer-bilde', rotate: 'roter-bilde', picker: 'fargevelger' },
  pl: { remove: 'usun-tlo', color: 'zmien-tlo', watermark: 'znak-wodny', compress: 'kompresja-obrazu', convert: 'konwersja-obrazu', resize: 'zmiana-rozmiaru', crop: 'przycinanie-obrazu', rotate: 'obroc-obraz', picker: 'wybieracz-kolorow' },
  pt: { remove: 'remover-fundo', color: 'mudar-fundo', watermark: 'marca-dagua', compress: 'comprimir-imagem', convert: 'converter-imagem', resize: 'redimensionar-imagem', crop: 'recortar-imagem', rotate: 'girar-imagem', picker: 'seletor-de-cor' },
  ro: { remove: 'eliminare-fundal', color: 'schimbare-fundal', watermark: 'filigran', compress: 'comprimare-imagine', convert: 'convertire-imagine', resize: 'redimensionare-imagine', crop: 'decupare-imagine', rotate: 'rotire-imagine', picker: 'selector-culoare' },
  ru: { remove: 'udalit-fon', color: 'izmenit-fon', watermark: 'vodyanoy-znak', compress: 'szhat-foto', convert: 'konvertirovat-foto', resize: 'izmenit-razmer', crop: 'obrezat-foto', rotate: 'povernut-foto', picker: 'pipetka-tsvet' },
  sv: { remove: 'ta-bort-bakgrund', color: 'andra-bakgrund', watermark: 'vattenstampel', compress: 'komprimera-bild', convert: 'konvertera-bild', resize: 'andra-bildstorlek', crop: 'beskara-bild', rotate: 'rotera-bild', picker: 'fargvaeljare' },
  th: { remove: 'lob-peun-lang', color: 'plian-peun-lang', watermark: 'lai-nam', compress: 'yoo-roop-pab', convert: 'plian-fai-roop', resize: 'yoo-kanad-roop', crop: 'tat-roop', rotate: 'mun-roop', picker: 'lueak-see' },
  tl: { remove: 'alisin-background', color: 'palitan-background', watermark: 'watermark', compress: 'i-compress-ang-larawan', convert: 'i-convert-ang-larawan', resize: 'i-resize-ang-larawan', crop: 'i-crop-ang-larawan', rotate: 'i-rotate-ang-larawan', picker: 'pumili-kulay' },
  tr: { remove: 'arka-plan-kaldir', color: 'arka-plan-degistir', watermark: 'filigran', compress: 'resim-sikistir', convert: 'resim-donustur', resize: 'resim-boyutlandir', crop: 'resim-kirp', rotate: 'resim-dondur', picker: 'renk-secici' },
  uk: { remove: 'vydalyty-tlo', color: 'zminyty-tlo', watermark: 'vodyanyy-znak', compress: 'stysnuty-foto', convert: 'konvertuvaty-foto', resize: 'zminyty-rozmir', crop: 'obrizaty-foto', rotate: 'povernuty-foto', picker: 'pipetka-koloriv' },
  vi: { remove: 'xoa-nen', color: 'doi-nen', watermark: 'dong-dau-anh', compress: 'nen-anh', convert: 'chuyen-doi-anh', resize: 'doi-kich-thuoc-anh', crop: 'cat-anh', rotate: 'xoay-anh', picker: 'chon-mau-anh' },
  zh: { remove: 'qu-beijing', color: 'huan-beijing', watermark: 'shuiyin', compress: 'yasuo-tupian', convert: 'zhuanhuan-tupian', resize: 'xiugai-chicun', crop: 'caijian-tupian', rotate: 'xuanzhuan-tupian', picker: 'xise-quse' }
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
  if (slug === 'magic-brush') return 'brush';
  
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
  
  return 'remove'; // Default fallback
}

/**
 * Get localized slug for a given tool and language.
 */
export function getLocalizedSlug(tool: InternalTool, lang: string): string {
  if (tool === 'brush') return 'magic-brush'; // currently unlocalized
  
  if (SLUG_MAP[lang] && SLUG_MAP[lang][tool]) {
    return SLUG_MAP[lang][tool];
  }
  
  return FALLBACK_SLUGS[tool] || FALLBACK_SLUGS['remove'];
}
