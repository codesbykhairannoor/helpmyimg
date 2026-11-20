// src/types/auth.ts
// Definisi tipe data profil pengguna dan status langganan SaaS

export type SubscriptionPlan = 'free' | 'pro';
export type SubscriptionStatus = 'active' | 'inactive' | 'trial' | 'past_due' | 'cancelled';

export interface DailyQuotaRecord {
  date: string; // Format 'YYYY-MM-DD'
  used: number; // Jumlah pemakaian 4K hari ini (maks 3 untuk free member)
  lastUpdatedAt?: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  plan: SubscriptionPlan;
  subscriptionStatus: SubscriptionStatus;
  subscriptionId?: string | null;
  customerId?: string | null;
  expiresAt?: number | null; // Timestamp millisecond
  createdAt: number;
  lastLoginAt: number;
  emailVerified?: boolean;
  app?: string;
  hmi_daily4kQuota?: DailyQuotaRecord;
}

export interface AuthContextType {
  user: any | null; // Firebase User
  profile: UserProfile | null;
  loading: boolean;
  isPro: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendEmailVerificationLink: () => Promise<void>;
  verifyEmailWithCode: (oobCode: string) => Promise<void>;
  reloadUser: () => Promise<boolean>;
  deleteAccount: (password?: string) => Promise<void>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  confirmNewPassword: (oobCode: string, newPassword: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthModalOpen: boolean;
  authModalInitialMode?: 'signin' | 'signup' | 'forgot' | 'reset' | 'verifyEmail' | null;
  openAuthModal: (initialMode?: 'signin' | 'signup' | 'forgot' | 'reset' | 'verifyEmail') => void;
  closeAuthModal: () => void;
  refreshProfile: () => Promise<void>;
}
