// src/context/ProGateContext.tsx
// Provider global untuk manajemen modal gate (Trial Sign-in vs PRO Upgrade) dan kuota 4K HelpMyIMG

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { get4kQuotaInfo, consume4kQuota, type QuotaState } from '../utils/quotaManager';

export type ProGateFeature = 'export-4k' | 'batch-limit' | 'rename-zip' | 'general';

export interface ProGateOptions {
  feature?: ProGateFeature;
  onProceedFallback?: () => void; // Aksi jika user memilih "Mungkin nanti" (misal: tetap unduh HD 1080p)
  onSuccess?: () => void; // Aksi jika user berhasil login
}

interface ProGateContextType {
  isOpen: boolean;
  gateOptions: ProGateOptions;
  openProGate: (options?: ProGateOptions) => void;
  closeProGate: () => void;
  quotaState: QuotaState;
  refreshQuota: () => void;
  consume4k: () => boolean;
}

const ProGateContext = createContext<ProGateContextType | undefined>(undefined);

export const ProGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isPro } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [gateOptions, setGateOptions] = useState<ProGateOptions>({ feature: 'export-4k' });
  const [quotaState, setQuotaState] = useState<QuotaState>(() => get4kQuotaInfo(user?.uid, isPro));

  const refreshQuota = useCallback(() => {
    setQuotaState(get4kQuotaInfo(user?.uid, isPro));
  }, [user?.uid, isPro]);

  useEffect(() => {
    refreshQuota();

    const handleQuotaUpdated = () => {
      refreshQuota();
    };

    window.addEventListener('hmi-quota-updated', handleQuotaUpdated);
    window.addEventListener('storage', handleQuotaUpdated);
    return () => {
      window.removeEventListener('hmi-quota-updated', handleQuotaUpdated);
      window.removeEventListener('storage', handleQuotaUpdated);
    };
  }, [refreshQuota]);

  const openProGate = useCallback((options?: ProGateOptions) => {
    setGateOptions(options || { feature: 'export-4k' });
    setIsOpen(true);
  }, []);

  const closeProGate = useCallback(() => {
    setIsOpen(false);
  }, []);

  const consume4k = useCallback(() => {
    const success = consume4kQuota(user?.uid, isPro);
    if (success) {
      refreshQuota();
    }
    return success;
  }, [user?.uid, isPro, refreshQuota]);

  return (
    <ProGateContext.Provider
      value={{
        isOpen,
        gateOptions,
        openProGate,
        closeProGate,
        quotaState,
        refreshQuota,
        consume4k,
      }}
    >
      {children}
    </ProGateContext.Provider>
  );
};

export const useProGate = (): ProGateContextType => {
  const context = useContext(ProGateContext);
  if (!context) {
    throw new Error('useProGate must be used within a ProGateProvider');
  }
  return context;
};
