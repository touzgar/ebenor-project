'use client';

import { motion } from 'framer-motion';
import { useProductStats, useGalleryStats } from '@/hooks/useAnalytics';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'amber' | 'blue' | 'green' | 'purple';
  loading?: boolean;
}

const colorClasses = {
  amber: {
    bg: 'from-amber-500 to-amber-600',
    light: 'bg-amber-50',
    text: 'text-amber-600',
    border: 'border-amber-200',
  },
  blue: {
    bg: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
  green: {
    bg: 'from-green-500 to-green-600',
    light: 'bg-green-50',
    text: 'text-green-600',
    border: 'border-green-200',
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50',
    text: 'text-purple-600',
    border: 'border-purple-200',
  },
};

function StatCard({ title, value, subtitle, icon, color, loading }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          {loading ? (
            <div className="h-9 w-16 bg-neutral-200 animate-pulse rounded" />
          ) : (
            <p className="text-3xl font-bold text-neutral-900">{value}</p>
          )}
          
          {subtitle && !loading && (
            <div className="mt-2">
              <span className="text-sm font-medium text-neutral-600">
                {subtitle}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.bg}`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardStats() {
  const { stats: productStats, loading: productLoading } = useProductStats();
  const { stats: galleryStats, loading: galleryLoading } = useGalleryStats();

  const stats = [
    {
      title: 'Total Produits',
      value: productStats?.totalProducts ?? 0,
      subtitle: `${productStats?.featuredProducts ?? 0} en vedette`,
      color: 'amber' as const,
      loading: productLoading,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      title: 'Images Galerie',
      value: galleryStats?.totalImages ?? 0,
      subtitle: `${galleryStats?.featuredImages ?? 0} en vedette`,
      color: 'blue' as const,
      loading: galleryLoading,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Catégories',
      value: productStats?.categoriesCount ?? 0,
      subtitle: 'catégories de produits',
      color: 'green' as const,
      loading: productLoading,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      title: 'Stockage',
      value: galleryStats ? `${galleryStats.totalSize.toFixed(1)} MB` : '0 MB',
      subtitle: 'espace utilisé',
      color: 'purple' as const,
      loading: galleryLoading,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}
