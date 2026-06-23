'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  messagesService,
  Message,
  MessageFilters,
  getStatusLabel,
  getStatusColor,
  getPriorityLabel,
  getPriorityColor,
  formatDate,
} from '@/services/messagesService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const previousMessageCount = useRef(0);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;
  
  // Filters & View
  const [filters, setFilters] = useState<MessageFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Load messages
  useEffect(() => {
    loadMessages();
  }, [currentPage, filters]);

  // Auto-search as user types (debounced)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery !== (filters.search || '')) {
        setFilters({ ...filters, search: searchQuery || undefined });
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Poll for new messages every 30 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await messagesService.getMessageStats();
        if (response.success) {
          const newCount = response.data.newMessages;
          if (previousMessageCount.current > 0 && newCount > previousMessageCount.current) {
            const diff = newCount - previousMessageCount.current;
            toast.success(`${diff} nouveau${diff > 1 ? 'x' : ''} message${diff > 1 ? 's' : ''} reçu${diff > 1 ? 's' : ''}!`, {
              icon: '📬',
              duration: 5000,
            });
            // Reload messages if on first page
            if (currentPage === 1) {
              loadMessages();
            }
          }
          previousMessageCount.current = newCount;
        }
      } catch (error) {
        // Silent fail
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, [currentPage]);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await messagesService.getMessages(filters, currentPage, limit);
      
      if (response.success) {
        setMessages(response.data);
        setTotalPages(response.pagination.pages);
        setTotal(response.pagination.total);
        
        // Initialize message count on first load
        if (previousMessageCount.current === 0) {
          const statsResponse = await messagesService.getMessageStats();
          if (statsResponse.success) {
            previousMessageCount.current = statsResponse.data.newMessages;
          }
        }
      }
    } catch (err: any) {
      console.error('Error loading messages:', err);
      setError(err.message || 'Erreur lors du chargement des messages');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof MessageFilters, value: any) => {
    setFilters({ ...filters, [key]: value });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setCurrentPage(1);
  };

  const getActiveFiltersCount = () => {
    return Object.keys(filters).filter(key => filters[key as keyof MessageFilters]).length;
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return '📬';
      case 'read': return '📭';
      case 'replied': return '✅';
      case 'archived': return '📦';
      default: return '📧';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-amber-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Responsive */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-amber-800 bg-clip-text text-transparent">
                Messages
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600">
                📬 Gérez vos messages clients en temps réel
              </p>
            </div>
            
            {/* View Toggle - Responsive */}
            <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1 w-full sm:w-auto">
              <button
                onClick={() => setViewMode('cards')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all ${
                  viewMode === 'cards'
                    ? 'bg-[#C9A14A] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mx-auto sm:mx-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-md transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#C9A14A] text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <svg className="w-5 h-5 mx-auto sm:mx-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-amber-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Rechercher par nom..."
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A14A] focus:border-transparent transition-all"
                />
                <AnimatePresence>
                  {isLoading && searchQuery && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <svg className="animate-spin h-5 w-5 text-[#C9A14A]" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isLoading && searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A14A] focus:border-transparent transition-all"
            >
              <option value="">📊 Tous les statuts</option>
              <option value="new">📬 Nouveau</option>
              <option value="read">📭 Lu</option>
              <option value="replied">✅ Répondu</option>
              <option value="archived">📦 Archivé</option>
            </select>

            {/* Priority Filter */}
            <select
              value={filters.priority || ''}
              onChange={(e) => handleFilterChange('priority', e.target.value || undefined)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C9A14A] focus:border-transparent transition-all"
            >
              <option value="">⭐ Toutes les priorités</option>
              <option value="high">🔴 Haute</option>
              <option value="medium">🟡 Moyenne</option>
              <option value="low">🟢 Basse</option>
            </select>
          </div>

          {/* Active Filters */}
          <AnimatePresence>
            {getActiveFiltersCount() > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between pt-4 border-t border-amber-100"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    🎯 {getActiveFiltersCount()} filtre(s) actif(s)
                  </span>
                  {searchQuery && (
                    <span className="text-sm text-gray-600">
                      • <span className="font-semibold text-[#C9A14A]">{total}</span> résultat(s)
                    </span>
                  )}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1 hover:underline"
                >
                  🗑️ Effacer les filtres
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Messages Content */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg p-12"
          >
            <div className="flex flex-col items-center justify-center">
              <LoadingSpinner size="lg" />
              <p className="mt-6 text-gray-600 font-medium">Chargement des messages...</p>
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-start gap-4 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
              <svg className="w-6 h-6 text-red-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-lg font-bold text-red-800">Erreur de chargement</h3>
                <p className="text-red-700 mt-2">{error}</p>
              </div>
            </div>
          </motion.div>
        ) : messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-16 text-center"
          >
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Aucun message trouvé</h3>
            {searchQuery ? (
              <div className="text-gray-600 space-y-4">
                <p>Aucun résultat pour "<span className="font-bold text-[#C9A14A]">{searchQuery}</span>"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 bg-[#C9A14A] text-white rounded-xl hover:bg-[#B8903A] transition-all shadow-lg hover:shadow-xl"
                >
                  Effacer la recherche
                </button>
              </div>
            ) : getActiveFiltersCount() > 0 ? (
              <div className="text-gray-600 space-y-4">
                <p>Aucun message ne correspond aux filtres sélectionnés</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-[#C9A14A] text-white rounded-xl hover:bg-[#B8903A] transition-all shadow-lg hover:shadow-xl"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <p className="text-gray-600">Vous n'avez reçu aucun message pour le moment</p>
            )}
          </motion.div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/admin/messages/${message._id}`)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden border border-gray-100 hover:border-[#C9A14A] group"
                >
                  {/* Card Header */}
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-white border-b border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getStatusIcon(message.status)}</span>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#C9A14A] transition-colors">
                            {message.name}
                          </h3>
                        </div>
                        <p className="text-sm text-gray-600">{message.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(message.status)}`}>
                          {getStatusLabel(message.status)}
                        </span>
                        <span className="text-2xl">{getPriorityIcon(message.priority)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {message.subject}
                    </h4>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {message.message}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        🕐 {formatDate(message.createdAt)}
                      </span>
                      <span className="text-[#C9A14A] font-medium group-hover:underline">
                        Voir détails →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
          >
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-amber-50 to-white border-b-2 border-amber-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Expéditeur
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Sujet
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {messages.map((message) => (
                  <motion.tr
                    key={message._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => router.push(`/admin/messages/${message._id}`)}
                    className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getStatusIcon(message.status)}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{message.name}</div>
                          <div className="text-sm text-gray-600">{message.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 line-clamp-1 max-w-xs">
                        {message.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(message.status)}`}>
                        {getStatusLabel(message.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getPriorityIcon(message.priority)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(message.priority)}`}>
                          {getPriorityLabel(message.priority)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(message.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/messages/${message._id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[#C9A14A] hover:text-[#B8903A] font-semibold"
                      >
                        Voir →
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Pagination */}
        {messages.length > 0 && totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-amber-100"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm font-medium text-gray-700">
                📄 Affichage de {Math.min((currentPage - 1) * limit + 1, total)} à {Math.min(currentPage * limit, total)} sur {total} messages
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:border-[#C9A14A] transition-all flex items-center gap-2 font-medium"
                >
                  ← Précédent
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-bold transition-all ${
                          pageNum === currentPage
                            ? 'bg-[#C9A14A] text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-700 hover:bg-amber-100'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:border-[#C9A14A] transition-all flex items-center gap-2 font-medium"
                >
                  Suivant →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
