'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'librarian';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string, role?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export AuthProvider as a named export
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user is already authenticated via localStorage
      const savedUser = localStorage.getItem('librarian_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        // Verify it's the correct admin user
        if (user.email === 'admin@academic.com' && user.role === 'librarian') {
          setUser(user);
          return;
        }
      }
      setUser(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      
      // Only allow specific admin credentials
      if (email === 'admin@academic.com' && password === 'admin123') {
        const user = {
          id: 'admin-user-id',
          email: email,
          name: 'Admin Librarian',
          role: 'librarian' as const,
        };
        
        // Save user to localStorage for persistence
        localStorage.setItem('librarian_user', JSON.stringify(user));
        
        setUser(user);
        return user;
      } else {
        throw new Error('Invalid credentials. Only authorized librarians can access this system.');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role?: string) => {
    setIsLoading(true);
    try {
      // Mock registration for demo
      const mockUser = {
        id: 'demo-user-id',
        email: email,
        name: name,
        role: (role as 'librarian') || 'librarian',
      };
      setUser(mockUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Clear the user from state
      setUser(null);
      
      // Clear stored user data
      localStorage.removeItem('librarian_user');
      
      return true; // Indicate successful logout
    } catch (error) {
      console.error('Logout error:', error);
      return false; // Indicate logout failure
    }
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
