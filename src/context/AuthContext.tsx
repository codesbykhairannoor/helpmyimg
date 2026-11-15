// src/context/AuthContext.tsx
// Provider global autentikasi Firebase & manajemen langganan (Free vs Pro)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase';
import type { UserProfile, AuthContextType } from '../types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const fetchOrCreateProfile = useCallback(async (firebaseUser: User): Promise<UserProfile> => {
    if (!db) {
      // Fallback local memory profile if db is not ready
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        plan: 'free',
        subscriptionStatus: 'inactive',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
    }

    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const data = userDocSnap.data() as UserProfile;
      // Periksa masa berlaku jika berstatus pro
      let currentPlan = data.plan;
      let currentStatus = data.subscriptionStatus;

      if (data.plan === 'pro' && data.expiresAt && Date.now() > data.expiresAt) {
        currentPlan = 'free';
        currentStatus = 'inactive';
        await updateDoc(userDocRef, {
          plan: 'free',
          subscriptionStatus: 'inactive',
          lastLoginAt: Date.now(),
        });
      } else {
        await updateDoc(userDocRef, {
          lastLoginAt: Date.now(),
          displayName: firebaseUser.displayName || data.displayName,
          photoURL: firebaseUser.photoURL || data.photoURL,
        });
      }

      return {
        ...data,
        plan: currentPlan,
        subscriptionStatus: currentStatus,
        lastLoginAt: Date.now(),
      };
    } else {
      // Buat data profil baru untuk pengguna pertama kali
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        plan: 'free',
        subscriptionStatus: 'inactive',
        createdAt: Date.now(),
        lastLoginAt: Date.now(),
      };
      await setDoc(userDocRef, newProfile);
      return newProfile;
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

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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
      // Ignore user closing popup
      if (error?.code !== 'auth/popup-closed-by-user') {
        console.error('Google Sign-In Error:', error);
        throw error;
      }
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

    const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
    const userProfile = await fetchOrCreateProfile(result.user);
    setProfile(userProfile);
    setIsAuthModalOpen(false);
  };

  const sendPasswordReset = async (email: string) => {
    if (!isFirebaseConfigured || !auth) {
      throw new Error(
        'Firebase belum dikonfigurasi. Silakan isi konfigurasi VITE_FIREBASE_* di file .env.local.'
      );
    }

    await sendPasswordResetEmail(auth, email.trim());
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

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

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
        sendPasswordReset,
        signOut,
        isAuthModalOpen,
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
