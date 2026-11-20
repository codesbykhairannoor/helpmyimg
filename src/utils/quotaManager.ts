// src/utils/quotaManager.ts
// Manajemen kuota harian untuk HelpMyIMG (Ekspor 4K & Batas Batch)
// Terintegrasi langsung dengan Firebase Firestore (users/{uid}) agar kebal abuse (anti-abuse multi-device & private browsing)
// Menggunakan prefix field 'hmi_' agar terisolasi dan tidak berbenturan dengan web apps lain di ekosistem (HandleMyFile, SolveMyMedia, CreateMy-QR)

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProfile } from '../types/auth';

export const QUOTA_CONFIG = {
  GUEST_DAILY_4K: 0,
  MEMBER_DAILY_4K: 3,
  GUEST_MAX_BATCH: 5,
  MEMBER_MAX_BATCH: 10,
  PRO_MAX_BATCH: 100,
  MAX_FREE_DIMENSION: 1920,
};

const inMemoryQuotaStore = new Map<string, number>();

// Clean up any historical quota keys in localStorage to ensure zero persistent client storage
if (typeof window !== 'undefined') {
  try {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith('hmi_daily_quota')) {
        localStorage.removeItem(k);
      }
    }
  } catch {
    // Ignore storage cleanup errors
  }
}

export function getTodayString(): string {
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
 * Mendapatkan status kuota ekspor 4K harian saat ini (Firestore-backed)
 */
export function get4kQuotaInfo(
  userId?: string | null,
  isPro?: boolean,
  profile?: UserProfile | null
): QuotaState {
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
  const memoryKey = `${userId}_${today}`;
  let used = 0;

  // 1. Ambil dari profil Firestore jika tersedia dan tanggalnya hari ini
  if (profile?.hmi_daily4kQuota) {
    if (profile.hmi_daily4kQuota.date === today) {
      used = profile.hmi_daily4kQuota.used || 0;
      inMemoryQuotaStore.set(memoryKey, used);
    } else {
      // Tanggal di Firestore adalah kemarin atau lebih lama -> reset otomatis ke 0
      used = 0;
      inMemoryQuotaStore.set(memoryKey, 0);
    }
  } else if (inMemoryQuotaStore.has(memoryKey)) {
    used = inMemoryQuotaStore.get(memoryKey) || 0;
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
 * Mengurangi 1 kuota ekspor 4K harian dan menyinkronkan langsung ke cloud Firebase Firestore
 */
export function consume4kQuota(
  userId?: string | null,
  isPro?: boolean,
  profile?: UserProfile | null
): boolean {
  if (isPro) return true;
  if (!userId) return false;

  const today = getTodayString();
  const memoryKey = `${userId}_${today}`;
  let used = 0;

  if (profile?.hmi_daily4kQuota && profile.hmi_daily4kQuota.date === today) {
    used = profile.hmi_daily4kQuota.used || 0;
  } else if (inMemoryQuotaStore.has(memoryKey)) {
    used = inMemoryQuotaStore.get(memoryKey) || 0;
  }

  if (used >= QUOTA_CONFIG.MEMBER_DAILY_4K) {
    return false;
  }

  const newUsed = used + 1;

  // 1. Update in-memory state seketika untuk responsivitas UI 100% instan
  inMemoryQuotaStore.set(memoryKey, newUsed);
  if (profile) {
    profile.hmi_daily4kQuota = {
      date: today,
      used: newUsed,
      lastUpdatedAt: Date.now(),
    };
  }

  // 2. Sinkronkan secara asinkron ke dokumen Firestore pengguna di users/{userId}
  // Hanya memperbarui field 'hmi_daily4kQuota', aman 100% tanpa menimpa data app lain di ekosistem
  if (db && userId) {
    try {
      const userDocRef = doc(db, 'users', userId);
      updateDoc(userDocRef, {
        hmi_daily4kQuota: {
          date: today,
          used: newUsed,
          lastUpdatedAt: Date.now(),
        },
      }).catch((err) => {
        console.warn('[HelpMyIMG] Failed to sync 4K quota to Firestore in background:', err);
      });
    } catch (err) {
      console.warn('[HelpMyIMG] Firestore reference error:', err);
    }
  }

  if (typeof window !== 'undefined') {
    // Dispatch event untuk sinkronisasi instan di seluruh komponen UI (Navbar, ExportPanel, Modal)
    window.dispatchEvent(new Event('hmi-quota-updated'));
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
