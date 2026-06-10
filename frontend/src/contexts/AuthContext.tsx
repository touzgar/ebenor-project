'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, apiClient } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState({
    user: null as User | null,
    isLoading: true,
    isAuthenticated: false,
    error: null as string | null,
  });

  // Set mounted on client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  const checkAuth = useCallback(async () => {
    // Skip during SSR
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        setState({
          user: response.data as User,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        localStorage.removeItem('auth_token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      setState(prev => ({ ...prev, isLoading: false, error: null }));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      checkAuth();
    }
  }, [checkAuth, mounted]);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login(email, password);
      
      if (response.success && response.data) {
        const { token, user } = response.data as any;
        
        // Store token
        apiClient.setAuthToken(token);
        
        setState({
          user: user as User,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        
        // Redirect to dashboard
        router.push('/admin/dashboard');
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Une erreur est survenue lors de la connexion';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  }, [router]);

  const logout = useCallback(async () => {
    await authService.logout();
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      error: null,
    });
    router.push('/admin/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
