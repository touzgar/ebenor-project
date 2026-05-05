'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminNavigation } from '@/components/admin/AdminNavigation';
import { Breadcrumb } from '@/components/admin/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  console.log('🏠 AdminLayout render:', { pathname, isAuthenticated, isLoading });

  // Redirect to login if not authenticated (except on login page)
  useEffect(() => {
    console.log('🔄 AdminLayout effect:', { isLoading, isAuthenticated, pathname });
    if (!isLoading && !isAuthenticated && pathname !== '/admin/login') {
      console.log('⚠️ Not authenticated, redirecting to login...');
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  // Don't show navigation on login page
  const isLoginPage = pathname === '/admin/login';

  // Show loading state while checking authentication
  if (isLoading && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
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
    <div className="min-h-screen bg-neutral-50">
      <AdminNavigation />
      
      {/* Main content with sidebar offset on desktop */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        {/* Breadcrumb navigation */}
        <div className="bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Breadcrumb />
          </div>
        </div>
        
        {/* Page content */}
        <div className="min-h-[calc(100vh-4rem)]">
          {children}
        </div>
      </main>
    </div>
  );
}