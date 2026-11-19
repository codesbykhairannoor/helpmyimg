// src/context/AuthContext.tsx
// Provider global autentikasi Firebase & manajemen langganan (Free vs Pro)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
  applyActionCode,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase';
import type { UserProfile, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<
    'signin' | 'signup' | 'forgot' | 'reset' | 'verifyEmail' | null
  >(null);

  const fetchOrCreateProfile = useCallback(async (firebaseUser: User): Promise<UserProfile> => {
    const fallbackProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      plan: 'free',
      subscriptionStatus: 'inactive',
      createdAt: Date.now(),
      lastLoginAt: Date.now(),
      emailVerified: Boolean(firebaseUser.emailVerified),
      app: 'helpmyimg',
    };

    if (!db) {
      return fallbackProfile;
    }

    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data() as UserProfile;
        let currentPlan = data.plan;
        let currentStatus = data.subscriptionStatus;

        if (data.plan === 'pro' && data.expiresAt && Date.now() > data.expiresAt) {
          currentPlan = 'free';
          currentStatus = 'inactive';
          await updateDoc(userDocRef, {
            plan: 'free',
            subscriptionStatus: 'inactive',
            lastLoginAt: Date.now(),
            emailVerified: Boolean(firebaseUser.emailVerified),
          });
        } else {
          await updateDoc(userDocRef, {
            lastLoginAt: Date.now(),
            emailVerified: Boolean(firebaseUser.emailVerified),
            displayName: firebaseUser.displayName || data.displayName,
            photoURL: firebaseUser.photoURL || data.photoURL,
          });
        }

        return {
          ...data,
          plan: currentPlan,
          subscriptionStatus: currentStatus,
          lastLoginAt: Date.now(),
          emailVerified: Boolean(firebaseUser.emailVerified),
          app: 'helpmyimg',
        };
      } else {
        await setDoc(userDocRef, fallbackProfile);
        return fallbackProfile;
      }
    } catch (firestoreError) {
      console.warn('Firestore profile sync failed or permission denied (using fallback profile):', firestoreError);
      return fallbackProfile;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const refreshed = await fetchOrCreateProfile(user);
      setProfile(refreshed);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  }, [user, fetchOrCreateProfile]);

  useEffect(() => {
    if (!auth || !isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    // Tangani hasil sign-in redirect jika popup diblokir
    getRedirectResult(auth)
      .then(async (result) => {
        if (result?.user) {
          try {
            const userProfile = await fetchOrCreateProfile(result.user);
            setProfile(userProfile);
            setIsAuthModalOpen(false);
          } catch (e) {
            console.error('Error fetching profile from redirect result:', e);
          }
        }
      })
      .catch((err) => {
        if (err?.code !== 'auth/popup-closed-by-user') {
          console.error('Google Redirect Sign-In Error:', err);
        }
      });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Hanya tutup modal secara otomatis jika user sudah terverifikasi (misal login via Google)
        // Jangan tutup modal jika belum terverifikasi agar tampilan instruksi verifikasi email tetap terlihat
        if (currentUser.emailVerified) {
          setIsAuthModalOpen(false);
        }
        try {
          const userProfile = await fetchOrCreateProfile(currentUser);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchOrCreateProfile]);

  const signInWithGoogle = async () => {
    if (!isFirebaseConfigured || !auth || !googleProvider) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userProfile = await fetchOrCreateProfile(result.user);
      setProfile(userProfile);
      setIsAuthModalOpen(false);
    } catch (error: any) {
      // Abaikan jika user menutup popup sendiri
      if (error?.code === 'auth/popup-closed-by-user') {
        return;
      }
      // Jika browser memblokir popup, fallback otomatis ke signInWithRedirect
      if (error?.code === 'auth/popup-blocked') {
        console.warn('Popup blocked by browser. Automatically falling back to signInWithRedirect...');
        await signInWithRedirect(auth, googleProvider);
        return;
      }
      console.error('Google Sign-In Error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const result = await signInWithEmailAndPassword(auth, email.trim(), password);
    const userProfile = await fetchOrCreateProfile(result.user);
    setProfile(userProfile);
    setIsAuthModalOpen(false);
  };

  const signUpWithEmail = async (email: string, password: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const currentLang = typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'en') : 'en';
    auth.languageCode = currentLang.split('-')[0] || 'en';

    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://helpmyimg.com';

    const actionCodeSettings = {
      url: `${origin}/?mode=verifyEmail`,
      handleCodeInApp: true,
    };

    try {
      await sendEmailVerification(result.user, actionCodeSettings);
    } catch (emailErr) {
      console.warn('Initial verification email failed:', emailErr);
    }

    const userProfile = await fetchOrCreateProfile(result.user);
    setProfile(userProfile);
    setIsAuthModalOpen(true);
  };

  const sendEmailVerificationLink = async () => {
    if (!isFirebaseConfigured || !auth || !auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://helpmyimg.com';

    const currentLang = typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'en') : 'en';
    auth.languageCode = currentLang.split('-')[0] || 'en';

    const actionCodeSettings = {
      url: `${origin}/?mode=verifyEmail`,
      handleCodeInApp: true,
    };

    await sendEmailVerification(auth.currentUser, actionCodeSettings);
  };

  const verifyEmailWithCode = async (oobCode: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error('Firebase belum dikonfigurasi.');
    }

    await applyActionCode(auth, oobCode);
    if (auth.currentUser) {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      if (db) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, {
          emailVerified: true,
          lastLoginAt: Date.now(),
        }).catch(() => { });
      }
      const updatedProfile = await fetchOrCreateProfile(auth.currentUser);
      setProfile(updatedProfile);
    }
  };

  const reloadUser = async (): Promise<boolean> => {
    if (!auth || !auth.currentUser) return false;
    await auth.currentUser.reload();
    const isVerified = Boolean(auth.currentUser.emailVerified);
    setUser({ ...auth.currentUser });
    if (isVerified && db) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        emailVerified: true,
        lastLoginAt: Date.now(),
      }).catch(() => { });
    }
    const updatedProfile = await fetchOrCreateProfile(auth.currentUser);
    setProfile(updatedProfile);
    return isVerified;
  };

  const sendPasswordReset = async (email: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : 'https://helpmyimg.com';

    const currentLang = typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'en') : 'en';
    auth.languageCode = currentLang.split('-')[0] || 'en';

    // 1. Coba serverless custom branded Resend API jika endpoint tersedia
    try {
      const response = await fetch('/api/reset-password/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), origin }),
      });
      if (response.ok) return;
    } catch {
      // Endpoint lokal/offline: fallback otomatis ke Firebase native
    }

    // 2. Fallback aman ke Firebase native sendPasswordResetEmail dengan actionCodeSettings
    const actionCodeSettings = {
      url: `${origin}/?mode=resetPassword`,
      handleCodeInApp: true,
    };
    await sendPasswordResetEmail(auth, email.trim(), actionCodeSettings);
  };

  const confirmNewPassword = async (oobCode: string, newPassword: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    await confirmPasswordReset(auth, oobCode, newPassword);
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!isFirebaseConfigured || !auth || !auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    const currentUser = auth.currentUser;
    if (!currentUser.email) {
      throw new Error('User has no email associated.');
    }

    try {
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
    } catch (err: any) {
      if (
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/invalid-login-credentials'
      ) {
        throw new Error('WRONG_PASSWORD');
      }
      if (err?.code === 'auth/weak-password') {
        throw new Error('WEAK_PASSWORD');
      }
      if (err?.code === 'auth/requires-recent-login') {
        throw new Error('REQUIRES_RECENT_LOGIN');
      }
      throw err;
    }
  };

  const deleteAccount = async (password?: string) => {
    if (!isFirebaseConfigured || !auth || !auth.currentUser) {
      throw new Error('No user is currently signed in.');
    }
    const currentUser = auth.currentUser;
    const uid = currentUser.uid;

    try {
      const isPasswordProvider = currentUser.providerData.some((p) => p.providerId === 'password');
      if (isPasswordProvider && password && currentUser.email) {
        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
      }

      // 1. Bersihkan dokumen profil pengguna di Firestore
      if (db) {
        try {
          const userDocRef = doc(db, 'users', uid);
          await deleteDoc(userDocRef);
        } catch (firestoreErr) {
          console.warn('Could not delete user Firestore document:', firestoreErr);
        }
      }

      // 2. Hapus akun pengguna di Firebase Auth
      await deleteUser(currentUser);
      setUser(null);
      setProfile(null);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      if (
        err?.code === 'auth/wrong-password' ||
        err?.code === 'auth/invalid-credential' ||
        err?.code === 'auth/invalid-login-credentials'
      ) {
        throw new Error('WRONG_PASSWORD');
      }
      if (err?.code === 'auth/requires-recent-login') {
        throw new Error('REQUIRES_RECENT_LOGIN');
      }
      throw err;
    }
  };

  const signOut = async () => {
    if (!auth) return;
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  };

  const openAuthModal = (initialMode?: 'signin' | 'signup' | 'forgot' | 'reset' | 'verifyEmail') => {
    setAuthModalInitialMode(initialMode || null);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => {
    setAuthModalInitialMode(null);
    setIsAuthModalOpen(false);
  };

  const isPro = Boolean(
    profile?.plan === 'pro' &&
    profile?.subscriptionStatus === 'active' &&
    (!profile.expiresAt || profile.expiresAt > Date.now())
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isPro,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendEmailVerificationLink,
        verifyEmailWithCode,
        reloadUser,
        deleteAccount,
        updateUserPassword,
        sendPasswordReset,
        confirmNewPassword,
        signOut,
        isAuthModalOpen,
        authModalInitialMode,
        openAuthModal,
        closeAuthModal,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
