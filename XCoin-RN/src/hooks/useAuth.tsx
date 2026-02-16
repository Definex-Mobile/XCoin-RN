import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserInfo } from '../types/userInfo';
import { clearUserInfo, getUserInfo, saveUserInfo } from '../services/userInfoStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  login: (payload: Pick<UserInfo, 'email' | 'lastLoginDate'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    let isMounted = true;

    const hydrateAuth = async () => {
      const storedUserInfo = await getUserInfo();
      if (!isMounted || !storedUserInfo) {
        return;
      }

      setUserInfo(storedUserInfo);
      setIsAuthenticated(storedUserInfo.isActive ?? true);
    };

    hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (payload: Pick<UserInfo, 'email' | 'lastLoginDate'>) => {
    const nextUserInfo: UserInfo = {
      ...payload,
      isActive: true,
    };

    const isSaved = await saveUserInfo(nextUserInfo);
    if (!isSaved) {
      console.warn('User info could not be persisted in secure storage');
    }
    setUserInfo(nextUserInfo);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    await clearUserInfo();
    setUserInfo(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
