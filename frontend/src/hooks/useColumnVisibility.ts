'use client';

import { useState, useEffect } from 'react';

export interface Column {
  id: string;
  label: string;
  isEssential?: boolean;
  defaultVisible?: boolean;
}

interface UseColumnVisibilityOptions {
  columns: Column[];
  storageKey?: string;
}

export function useColumnVisibility({
  columns,
  storageKey = 'table-columns-visibility',
}: UseColumnVisibilityOptions) {
  // Initialize visible columns with default values
  const getInitialVisibleColumns = (): string[] => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Validate that the saved columns still exist
          const validColumns = parsed.filter((id: string) =>
            columns.some((col) => col.id === id)
          );
          if (validColumns.length > 0) {
            return validColumns;
          }
        } catch (error) {
          console.error('Error parsing saved column visibility:', error);
        }
      }
    }

    // Fall back to default columns
    return columns
      .filter((col) => col.isEssential || col.defaultVisible)
      .map((col) => col.id);
  };

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    getInitialVisibleColumns()
  );

  // Sync with localStorage whenever visible columns change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(visibleColumns));
    }
  }, [visibleColumns, storageKey]);

  const handleVisibilityChange = (newVisibleColumns: string[]) => {
    setVisibleColumns(newVisibleColumns);
  };

  const isColumnVisible = (columnId: string): boolean => {
    return visibleColumns.includes(columnId);
  };

  const toggleColumn = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (column?.isEssential) return; // Cannot hide essential columns

    setVisibleColumns((prev) =>
      prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId]
    );
  };

  const showAllColumns = () => {
    setVisibleColumns(columns.map((col) => col.id));
  };

  const resetToDefault = () => {
    const defaultColumns = columns
      .filter((col) => col.isEssential || col.defaultVisible)
      .map((col) => col.id);
    setVisibleColumns(defaultColumns);
  };

  return {
    visibleColumns,
    setVisibleColumns: handleVisibilityChange,
    isColumnVisible,
    toggleColumn,
    showAllColumns,
    resetToDefault,
  };
}
