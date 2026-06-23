'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Product } from '@/lib/api/products';
import { 
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline';

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  categoryNameMap?: Record<string, string>;
}

type ViewMode = 'grid' | 'list';

export default function ProductGrid({ products, loading = false, categoryNameMap = {} }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  if (loading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-neutral-200 to-neutral-300 mb-4" />
            <div className="space-y-3 p-4">
              <div className="h-4 bg-neutral-200 rounded-full w-1/4" />
              <div className="h-6 bg-neutral-300 rounded-full w-3/4" />
              <div className="h-4 bg-neutral-200 rounded-full w-full" />
              <div className="h-4 bg-neutral-200 rounded-full w-2/3" />
              <div className="flex justify-between items-center pt-4">
                <div className="h-8 bg-neutral-300 rounded-full w-1/3" />
                <div className="h-10 bg-neutral-200 rounded-full w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 mb-6">
          <span className="text-5xl">🔍</span>
        </div>
        <h3 className="text-3xl font-bold text-neutral-900 mb-3">
          Aucun produit trouvé
        </h3>
        <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
          Essayez de modifier vos filtres ou votre recherche pour découvrir nos créations
        </p>
        <button
          onClick={() => window.location.href = '/produits'}
          className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl"
        >
          Voir tous les produits
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {/* View Toggle - Modern Design */}
      <div className="flex justify-end">
        <div className="inline-flex items-center gap-2 p-1.5 bg-white rounded-2xl border-2 border-neutral-200 shadow-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              viewMode === 'grid'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
            aria-label="Vue grille"
          >
            <Squares2X2Icon className="w-5 h-5" />
            <span className="hidden sm:inline">Grille</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
            }`}
            aria-label="Vue liste"
          >
            <ListBulletIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Liste</span>
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid gap-6 grid-cols-1 md:grid-cols-2'
        }
      >
        {products.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            priority={index < 4} // Prioritize first 4 images
            categoryNameMap={categoryNameMap}
          />
        ))}
      </div>
    </div>
  );
}
