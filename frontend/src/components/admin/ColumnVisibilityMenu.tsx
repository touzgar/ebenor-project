'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  CheckIcon,
  XMarkIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

export interface Column {
  id: string;
  label: string;
  isEssential?: boolean; // Cannot be hidden
  defaultVisible?: boolean;
}

interface ColumnVisibilityMenuProps {
  columns: Column[];
  visibleColumns: string[];
  onVisibilityChange: (visibleColumns: string[]) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  storageKey?: string;
}

export default function ColumnVisibilityMenu({
  columns,
  visibleColumns,
  onVisibilityChange,
  storageKey = 'table-columns-visibility',
}: ColumnVisibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Filter columns based on search query
  const filteredColumns = columns.filter((column) =>
    column.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if all non-essential columns are visible
  const nonEssentialColumns = columns.filter((col) => !col.isEssential);
  const allVisible =
    nonEssentialColumns.length > 0 &&
    nonEssentialColumns.every((col) => visibleColumns.includes(col.id));

  const handleToggleColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (column?.isEssential) return; // Cannot hide essential columns

    const newVisibleColumns = visibleColumns.includes(columnId)
      ? visibleColumns.filter((id) => id !== columnId)
      : [...visibleColumns, columnId];

    onVisibilityChange(newVisibleColumns);

    // Save to localStorage
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(newVisibleColumns));
    }
  };

  const handleSelectAll = () => {
    const allColumnIds = columns.map((col) => col.id);
    onVisibilityChange(allColumnIds);

    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(allColumnIds));
    }
  };

  const handleResetToDefault = () => {
    const defaultColumns = columns
      .filter((col) => col.isEssential || col.defaultVisible)
      .map((col) => col.id);

    onVisibilityChange(defaultColumns);

    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(defaultColumns));
    }

    setSearchQuery('');
  };

  const visibleCount = visibleColumns.length;
  const totalCount = columns.length;

  return (
    <div className="relative inline-block">
      {/* Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 hover:border-neutral-400 transition-all shadow-sm hover:shadow-md"
        title="Gérer les colonnes"
      >
        <EllipsisVerticalIcon className="h-5 w-5 text-neutral-600" />
        <span className="hidden sm:inline font-semibold">Colonnes</span>
        <span className="inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-bold text-amber-700 bg-amber-100 rounded-full border border-amber-200">
          {visibleCount}
        </span>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-[100] lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed lg:absolute left-4 right-4 lg:left-auto lg:right-0 top-20 lg:top-full lg:mt-2 w-auto lg:w-96 bg-white rounded-xl shadow-2xl border border-neutral-200 z-[110] overflow-hidden"
              style={{ maxHeight: 'min(600px, calc(100vh - 10rem))' }}
            >
            {/* Header */}
            <div className="px-4 py-3 border-b border-neutral-200 bg-gradient-to-r from-amber-50 to-neutral-50">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-neutral-900">
                  Gérer les colonnes
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-xs text-neutral-500">
                {visibleCount} sur {totalCount} colonnes visibles
              </p>
            </div>

            {/* Search Input */}
            <div className="px-4 py-3 border-b border-neutral-100">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une colonne..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-b border-neutral-100 bg-neutral-50 flex gap-2">
              <button
                onClick={handleSelectAll}
                disabled={allVisible}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <CheckIcon className="h-3.5 w-3.5 inline mr-1" />
                Tout sélectionner
              </button>
              <button
                onClick={handleResetToDefault}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
              >
                <ArrowPathIcon className="h-3.5 w-3.5 inline mr-1" />
                Réinitialiser
              </button>
            </div>

            {/* Columns List */}
            <div className="max-h-80 overflow-y-auto overscroll-contain">
              {filteredColumns.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-neutral-300 mb-2" />
                  <p className="text-sm text-neutral-500">Aucune colonne trouvée</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredColumns.map((column) => {
                    const isVisible = visibleColumns.includes(column.id);
                    const isDisabled = column.isEssential;

                    return (
                      <motion.button
                        key={column.id}
                        onClick={() => handleToggleColumn(column.id)}
                        disabled={isDisabled}
                        className={`w-full px-4 py-2.5 flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                          isDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                        }`}
                        whileHover={!isDisabled ? { x: 4 } : {}}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="flex items-center gap-3">
                          {/* Checkbox */}
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                              isVisible
                                ? 'bg-amber-600 border-amber-600'
                                : 'bg-white border-neutral-300'
                            }`}
                          >
                            {isVisible && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.15 }}
                              >
                                <CheckIcon className="h-3.5 w-3.5 text-white stroke-[3]" />
                              </motion.div>
                            )}
                          </div>

                          {/* Column Label */}
                          <span className="text-sm font-medium text-neutral-900">
                            {column.label}
                          </span>
                        </div>

                        {/* Essential Badge */}
                        {column.isEssential && (
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                            Essentiel
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-3 border-t border-neutral-200 bg-neutral-50">
              <p className="text-xs text-neutral-500 text-center">
                Les préférences sont sauvegardées automatiquement
              </p>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
