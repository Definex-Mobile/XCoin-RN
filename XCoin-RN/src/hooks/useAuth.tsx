import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { UserInfo } from '../types/userInfo';
import { clearUserInfo, getUserInfo, saveUserInfo } from '../services/userInfoStorage';

type LoginPayload = {
  email: string;
  password: string;
  lastLoginDate: string;
};

interface AuthContextType {
  isAuthenticated: boolean;
  userInfo: UserInfo | null;
  login: (payload: LoginPayload) => Promise<void>;
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
      setIsAuthenticated(Boolean(storedUserInfo.isActive));
    };

    hydrateAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    const storedUserInfo = await getUserInfo();

    if (!storedUserInfo?.email) {
      throw new Error('No user account found');
    }

    const normalizedStoredEmail = storedUserInfo.email.trim().toLowerCase();
    const normalizedPayloadEmail = payload.email.trim().toLowerCase();
    const hasStoredPassword = Boolean(storedUserInfo.password);
    const doesPasswordMatch = hasStoredPassword
      ? storedUserInfo.password === payload.password
      : true;

    if (normalizedStoredEmail !== normalizedPayloadEmail || !doesPasswordMatch) {
      throw new Error('Invalid credentials');
    }

    const nextUserInfo: UserInfo = {
      ...storedUserInfo,
      password: storedUserInfo.password ?? payload.password,
      isActive: true,
      lastLoginDate: payload.lastLoginDate,
    };

    const isSaved = await saveUserInfo(nextUserInfo);
    if (!isSaved) {
      console.warn('User info could not be persisted in secure storage');
    }
    setUserInfo(nextUserInfo);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    if (!userInfo) {
      await clearUserInfo();
      setIsAuthenticated(false);
      return;
    }

    const nextUserInfo: UserInfo = {
      ...userInfo,
      isActive: false,
    };

    const isSaved = await saveUserInfo(nextUserInfo);
    if (!isSaved) {
      console.warn('User info could not be persisted in secure storage');
    }

    setUserInfo(nextUserInfo);
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
