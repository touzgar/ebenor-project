'use client';

import { motion } from 'framer-motion';
import { useProductCategories } from '@/hooks/useAnalytics';

export function CategoryBreakdown() {
  const { categories, loading } = useProductCategories();

  // Calculate total for percentage (with safety check)
  const total = Array.isArray(categories) ? categories.reduce((sum, cat) => sum + cat.count, 0) : 0;

  // Color palette for categories
  const colors = [
    'bg-amber-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6"
    >
      <h3 className="text-lg font-semibold text-neutral-900 mb-4">
        Produits par Catégorie
      </h3>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2" />
              <div className="h-6 bg-neutral-200 rounded" />
            </div>
          ))}
        </div>
      ) : !Array.isArray(categories) || categories.length === 0 ? (
        <div className="text-center py-8 text-neutral-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p>Aucune catégorie disponible</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((category, index) => {
            const percentage = total > 0 ? (category.count / total) * 100 : 0;
            const colorClass = colors[index % colors.length];

            return (
              <div key={category.category || `category-${index}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${colorClass}`} />
                    <span className="text-sm font-medium text-neutral-900">
                      {category.category || 'Sans catégorie'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-neutral-600">
                      {category.count} {category.count === 1 ? 'produit' : 'produits'}
                    </span>
                    <span className="text-sm font-semibold text-neutral-900">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`h-full ${colorClass}`}
                  />
                </div>

                {/* Subcategories */}
                {category.subcategories && category.subcategories.length > 0 && (
                  <div className="mt-2 ml-5 flex flex-wrap gap-1">
                    {category.subcategories.map((sub, subIndex) => (
                      <span
                        key={subIndex}
                        className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
