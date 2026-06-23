'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { Breadcrumb } from '@/components/admin/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { DashboardProvider } from '@/contexts/DashboardContext';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import '@/styles/admin-responsive.css';
import '@/styles/admin-fullwidth.css';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated (except on login page)
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Don't show navigation on login page
  const isLoginPage = pathname === '/admin/login';

  // Show loading state while checking authentication
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-amber-50/20 to-neutral-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          {/* Animated loader */}
          <div className="relative mb-8 w-20 h-20 mx-auto">
            {/* Outer rotating ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient1)"
                  strokeWidth="3"
                  strokeDasharray="70 200"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#D97706" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>

            {/* Inner pulsing circle */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-lg" />
            </motion.div>
          </div>

          {/* Animated text */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <p className="text-lg font-semibold text-neutral-800">
              Chargement en cours
            </p>
            
            {/* Animated dots */}
            <div className="flex items-center justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                  className="w-2 h-2 bg-amber-600 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          {/* Progress bar effect */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="mt-6 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full max-w-xs mx-auto"
          />
        </motion.div>
      </div>
    );
  }

  // Render login page without navigation
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Don't render admin content if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#C9A14A',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="min-h-screen bg-neutral-50">
        <AdminNavigation />
        
        {/* Main content with sidebar offset on desktop - FULL WIDTH */}
        <main className="lg:pl-64 pt-16 lg:pt-0">
          {/* Breadcrumb navigation */}
          <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <Breadcrumb />
            </div>
          </div>
          
          {/* Page content - FULL WIDTH - No max-width constraint */}
          <div className="min-h-[calc(100vh-4rem)] w-full">
            {children}
          </div>
        </main>
      </div>
    </DashboardProvider>
  );
}