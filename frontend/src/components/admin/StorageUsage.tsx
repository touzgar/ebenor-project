'use client';

import { motion } from 'framer-motion';
import { useMediaStats } from '@/hooks/useAnalytics';

export function StorageUsage() {
  const { stats, loading } = useMediaStats();

  // Calculate storage breakdown percentages
  const totalSize = stats?.totalSize || 0;
  const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);

  // Storage limit (5GB = 5120 MB) - can be customized via environment variable
  const storageLimitMB = parseInt(process.env.NEXT_PUBLIC_STORAGE_LIMIT_MB || '5120', 10);
  const usagePercentage = totalSize > 0 ? (parseFloat(totalSizeMB) / storageLimitMB) * 100 : 0;

  // Calculate breakdown by source
  const productSize = stats?.bySource?.product || 0;
  const gallerySize = stats?.bySource?.gallery || 0;
  const homepageSize = stats?.bySource?.homepage || 0;
  const totalItems = productSize + gallerySize + homepageSize;

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getUsageTextColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 75) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-neutral-900">
          Utilisation du Stockage
        </h3>
        <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 bg-neutral-200 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 rounded" />
          <div className="space-y-2">
            <div className="h-3 bg-neutral-200 rounded" />
            <div className="h-3 bg-neutral-200 rounded" />
            <div className="h-3 bg-neutral-200 rounded" />
          </div>
        </div>
      ) : (
        <>
          {/* Total usage */}
          <div className="mb-6">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-3xl font-bold text-neutral-900">
                {totalSizeMB} MB
              </span>
              <span className="text-sm text-neutral-600">
                sur {storageLimitMB} MB
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full ${getUsageColor(usagePercentage)}`}
              />
            </div>
            
            <div className="mt-2 flex items-center justify-between">
              <span className={`text-sm font-medium ${getUsageTextColor(usagePercentage)}`}>
                {usagePercentage.toFixed(1)}% utilisé
              </span>
              <span className="text-sm text-neutral-600">
                {(storageLimitMB - parseFloat(totalSizeMB)).toFixed(2)} MB disponible
              </span>
            </div>
          </div>

          {/* Breakdown by source */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700 mb-3">
              Répartition par Source
            </h4>

            {/* Products */}
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Produits</p>
                  <p className="text-xs text-neutral-600">{productSize} fichiers</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {totalItems > 0 ? ((productSize / totalItems) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Gallery */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Galerie</p>
                  <p className="text-xs text-neutral-600">{gallerySize} fichiers</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {totalItems > 0 ? ((gallerySize / totalItems) * 100).toFixed(0) : 0}%
              </span>
            </div>

            {/* Homepage */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-900">Page d'accueil</p>
                  <p className="text-xs text-neutral-600">{homepageSize} fichiers</p>
                </div>
              </div>
              <span className="text-sm font-semibold text-neutral-900">
                {totalItems > 0 ? ((homepageSize / totalItems) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>

          {/* Media stats */}
          <div className="mt-6 pt-6 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-neutral-600 mb-1">Total Médias</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {stats?.totalMedia || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 mb-1">Images</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {stats?.totalImages || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 mb-1">Vidéos</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {stats?.totalVideos || 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-neutral-600 mb-1">Taille Moyenne</p>
                <p className="text-lg font-semibold text-neutral-900">
                  {stats?.totalMedia && stats.totalMedia > 0
                    ? ((totalSize / stats.totalMedia) / (1024 * 1024)).toFixed(2)
                    : '0'} MB
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}
