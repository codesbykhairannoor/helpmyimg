// src/utils/quotaManager.ts
// Manajemen kuota harian untuk HelpMyIMG (Ekspor 4K & Batas Batch)
// Menggunakan prefix 'hmi_' agar terisolasi dan tidak berbenturan dengan web apps lain di ekosistem (HandleMyFile, SolveMyMedia, CreateMy-QR)

export const QUOTA_CONFIG = {
  GUEST_DAILY_4K: 0,
  MEMBER_DAILY_4K: 3,
  GUEST_MAX_BATCH: 5,
  MEMBER_MAX_BATCH: 10,
  PRO_MAX_BATCH: 100,
  MAX_FREE_DIMENSION: 1920,
};

const KEY_PREFIX = 'hmi_daily_quota_v1_';

function getTodayString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export interface QuotaState {
  used4k: number;
  remaining4k: number;
  max4k: number;
  isPro: boolean;
  canExport4k: boolean;
}

/**
 * Mendapatkan status kuota ekspor 4K harian saat ini
 */
export function get4kQuotaInfo(userId?: string | null, isPro?: boolean): QuotaState {
  if (isPro) {
    return {
      used4k: 0,
      remaining4k: Infinity,
      max4k: Infinity,
      isPro: true,
      canExport4k: true,
    };
  }

  if (!userId) {
    return {
      used4k: 0,
      remaining4k: 0,
      max4k: 0,
      isPro: false,
      canExport4k: false,
    };
  }

  const today = getTodayString();
  const storageKey = `${KEY_PREFIX}4k_${userId}_${today}`;
  let used = 0;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (raw) used = parseInt(raw, 10) || 0;
  } catch (e) {
    used = 0;
  }

  const max = QUOTA_CONFIG.MEMBER_DAILY_4K;
  const remaining = Math.max(0, max - used);

  return {
    used4k: used,
    remaining4k: remaining,
    max4k: max,
    isPro: false,
    canExport4k: remaining > 0,
  };
}

/**
 * Mengurangi 1 kuota ekspor 4K harian
 */
export function consume4kQuota(userId?: string | null, isPro?: boolean): boolean {
  if (isPro) return true;
  if (!userId) return false;

  const today = getTodayString();
  const storageKey = `${KEY_PREFIX}4k_${userId}_${today}`;
  let used = 0;
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (raw) used = parseInt(raw, 10) || 0;
  } catch (e) {
    used = 0;
  }

  if (used >= QUOTA_CONFIG.MEMBER_DAILY_4K) {
    return false;
  }

  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, String(used + 1));
      // Dispatch storage event untuk sinkronisasi instan di UI
      window.dispatchEvent(new Event('hmi-quota-updated'));
    }
  } catch (e) {
    console.warn('Failed to update 4k quota in localStorage:', e);
  }

  return true;
}

/**
 * Mendapatkan batas maksimal file batch sesuai status pengguna
 */
export function getMaxBatchAllowed(isLoggedIn: boolean, isPro: boolean): number {
  if (isPro) return QUOTA_CONFIG.PRO_MAX_BATCH;
  if (isLoggedIn) return QUOTA_CONFIG.MEMBER_MAX_BATCH;
  return QUOTA_CONFIG.GUEST_MAX_BATCH;
}
