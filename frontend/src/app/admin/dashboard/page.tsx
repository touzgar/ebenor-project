'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DashboardStats, 
  RecentActivity,
  QuickActions,
  CategoryBreakdown,
  RecentUploads,
  StorageUsage
} from '@/components/admin';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [systemStatus, setSystemStatus] = useState('Optimal');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // Fetch system health status
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/health');
        if (response.ok) {
          const data = await response.json();
          setSystemStatus(data.status === 'OK' ? 'Optimal' : 'Vérifie');
        }
      } catch (error) {
        console.error('Failed to fetch health status:', error);
      }
    };
    checkHealth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-amber-50/20 to-neutral-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-neutral-200 sticky top-0 z-10">
        <div className="px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 via-amber-800 to-neutral-900 bg-clip-text text-transparent">
                Tableau de bord
              </h1>
              <p className="mt-2 text-neutral-600">
                Bienvenue, <span className="font-semibold text-amber-600">{user?.name || 'Administrateur'}</span>. Voici un aperçu de votre plateforme.
              </p>
            </div>
            <div className="hidden lg:flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg shadow-green-500/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="font-semibold text-sm">{systemStatus}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Stats Grid */}
          <DashboardStats />

          {/* Quick Actions and Recent Uploads */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <QuickActions />
            <RecentUploads />
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <CategoryBreakdown />

            {/* Storage Usage */}
            <StorageUsage />
          </div>
        </div>
      </div>

      {/* Debug Component removed */}
    </div>
  );
}
