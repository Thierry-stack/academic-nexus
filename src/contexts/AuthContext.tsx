'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { parseApiErrorMessage } from '@/lib/httpErrorMessage';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'librarian';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearSessionCookie = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' });
      if (!res.ok) {
        if ([401, 403, 404].includes(res.status)) {
          await clearSessionCookie();
        }
        setUser(null);
        return;
      }
      const data = await res.json();
      const u = data.user;
      if (!u || u.role !== 'librarian') {
        await clearSessionCookie();
        setUser(null);
        return;
      }
      setUser({
        id: String(u.id),
        email: u.email,
        name: u.name,
        role: 'librarian',
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    }
  }, [clearSessionCookie]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      await checkAuthStatus();
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [checkAuthStatus]);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        throw new Error(await parseApiErrorMessage(res));
      }
      const data = await res.json();
      const u = data.user;
      const nextUser: User = {
        id: String(u.id),
        email: u.email,
        name: u.name,
        role: u.role,
      };
      setUser(nextUser);
      return nextUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/librarian/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, name }),
      });
      if (!res.ok) {
        throw new Error(await parseApiErrorMessage(res));
      }
      // Account exists but is not signed in until they use /librarian/login.
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
