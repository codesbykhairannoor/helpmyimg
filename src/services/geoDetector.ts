// src/services/geoDetector.ts
// Layanan Deteksi Geografis & Bahasa Otomatis dengan Anti-Bot Trap ("The Secret / Chameleon Hat")
// Mencegah Googlebot dan AI Crawlers terkena redirect loop atau cloaking penalty
import { getLocalizedSlug } from '../utils/urlMapper';

const BOT_USER_AGENTS_REGEX = /googlebot|bingbot|yandexbot|duckduckbot|slurp|baiduspider|ia_archiver|gptbot|chatgpt-user|perplexitybot|claudebot|applebot|facebookexternalhit|twitterbot|linkedinbot|embedly|quora|pinterest|slackbot|vkShare|w3c_validator|validator|cf\.client\.bot/i;

/**
 * Memeriksa apakah pengunjung saat ini adalah robot perayap mesin pencari atau AI
 */
export function isBot(): boolean {
  if (typeof window === 'undefined' || !window.navigator) {
    return true; // SSR / Node environment dianggap bot/server
  }
  const ua = window.navigator.userAgent || '';
  return BOT_USER_AGENTS_REGEX.test(ua);
}

/**
 * Pemetaan zona waktu ke kode bahasa standar (Fallback jika navigator.language tidak akurat)
 */
const TIMEZONE_TO_LANG: Record<string, string> = {
  'Asia/Jakarta': 'id',
  'Asia/Makassar': 'id',
  'Asia/Jayapura': 'id',
  'Asia/Seoul': 'ko',
  'Asia/Tokyo': 'ja',
  'Asia/Shanghai': 'zh',
  'Asia/Hong_Kong': 'zh',
  'Asia/Taipei': 'zh',
  'Asia/Kolkata': 'hi',
  'Asia/Riyadh': 'ar',
  'Asia/Dubai': 'ar',
  'Asia/Bangkok': 'th',
  'Asia/Ho_Chi_Minh': 'vi',
  'Asia/Manila': 'tl',
  'Asia/Kuala_Lumpur': 'ms',
  'Europe/Moscow': 'ru',
  'Europe/Madrid': 'es',
  'Europe/Paris': 'fr',
  'Europe/Berlin': 'de',
  'Europe/Rome': 'it',
  'Europe/Istanbul': 'tr',
  'Europe/Warsaw': 'pl',
  'Europe/Amsterdam': 'nl',
  'Europe/Stockholm': 'sv',
  'Europe/Kiev': 'uk',
  'Europe/Bucharest': 'ro',
  'Europe/Athens': 'el',
  'Europe/Prague': 'cs',
  'Europe/Budapest': 'hu',
  'Europe/Copenhagen': 'da',
  'Europe/Helsinki': 'fi',
  'Europe/Oslo': 'no',
  'Asia/Jerusalem': 'he',
  'America/Sao_Paulo': 'pt',
  'America/Mexico_City': 'es',
  'America/Buenos_Aires': 'es',
  'America/Bogota': 'es'
};

/**
 * Mendeteksi bahasa preferensi pengguna manusia berdasarkan browser & zona waktu
 */
export function getPreferredLanguage(supportedCodes: string[], defaultLang = 'id'): string {
  if (typeof window === 'undefined' || !window.navigator) {
    return defaultLang;
  }

  // 1. Cek navigator.languages atau navigator.language
  const browserLangs = window.navigator.languages || [window.navigator.language];
  for (const langStr of browserLangs) {
    if (!langStr) continue;
    const code = langStr.toLowerCase().split('-')[0];
    if (supportedCodes.includes(code)) {
      return code;
    }
  }

  // 2. Fallback menggunakan Zona Waktu (Intl.DateTimeFormat)
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz && TIMEZONE_TO_LANG[tz] && supportedCodes.includes(TIMEZONE_TO_LANG[tz])) {
      return TIMEZONE_TO_LANG[tz];
    }
  } catch (e) {
    console.warn('Timezone detection failed:', e);
  }

  return defaultLang;
}

/**
 * Menentukan apakah aplikasi harus melakukan pengalihan otomatis (Auto-Redirect)
 * CRITICAL RULE: BOT TIDAK BOLEH DI-REDIRECT AGAR 30 SUBDIREKTORI TERINDEKS SEMUA!
 */
export function shouldAutoRedirectToLang(currentPathname: string, supportedCodes: string[]): string | null {
  // 1. KUNCI RAHASIA: Jika yang datang adalah Bot/Crawler, JANGAN PERNAH DI-REDIRECT!
  // Biarkan Googlebot dan AI crawlers merayapi URL apa adanya tanpa gangguan redirect loop.
  if (isBot()) {
    return null;
  }

  // 2. Jika pengguna manusia mengunjungi Root ("/" atau ""), arahkan ke subdirektori bahasa mereka beserta slug tool defaultnya
  if (currentPathname === '/' || currentPathname === '') {
    const prefLang = getPreferredLanguage(supportedCodes, 'en');
    return `/${prefLang}/${getLocalizedSlug('remove', prefLang)}`;
  }

  // 3. Jika pengguna manusia sudah berada di subdirektori (/id, /es, /ru, dll.), jangan di-redirect!
  return null;
}
