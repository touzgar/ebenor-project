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
  const [state, setState] = useState({
    user: null as User | null,
    isLoading: true,
    isAuthenticated: false,
    error: null as string | null,
  });

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔍 [AuthContext] Checking auth, token:', token ? token.substring(0, 20) + '...' : 'none');
      
      if (!token) {
        console.log('❌ [AuthContext] No token found');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      console.log('📡 [AuthContext] Fetching profile...');
      const response = await authService.getProfile();
      console.log('📥 [AuthContext] Profile response:', response);
      
      if (response.success && response.data) {
        console.log('✅ [AuthContext] Auth check successful, user:', response.data);
        setState({
          user: response.data as User,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        console.log('⚠️ [AuthContext] Token invalid, clearing...');
        localStorage.removeItem('auth_token');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('❌ [AuthContext] Auth check error:', error);
      localStorage.removeItem('auth_token');
      setState(prev => ({ ...prev, isLoading: false, error: null }));
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log('🔐 [AuthContext] Login attempt:', email);
      const response = await authService.login(email, password);
      console.log('📥 [AuthContext] Login response:', response);
      
      if (response.success && response.data) {
        const { token, user } = response.data as any;
        
        console.log('✅ [AuthContext] Login successful, token:', token?.substring(0, 20) + '...');
        console.log('👤 [AuthContext] User:', user);
        
        // Store token
        apiClient.setAuthToken(token);
        
        setState({
          user: user as User,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
        
        console.log('🚀 [AuthContext] Redirecting to dashboard...');
        // Redirect to dashboard
        router.push('/admin/dashboard');
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ [AuthContext] Login error:', error);
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
