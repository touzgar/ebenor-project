import { apiClient } from '@/lib/api';

export interface Message {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'medium' | 'high';
  source: string;
  ipAddress?: string;
  userAgent?: string;
  readAt?: string;
  readBy?: string;
  repliedAt?: string;
  repliedBy?: string;
  notes: Array<{
    text: string;
    createdBy: string;
    createdAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface MessageStats {
  totalMessages: number;
  newMessages: number;
  readMessages: number;
  repliedMessages: number;
  archivedMessages: number;
  highPriorityMessages: number;
  mediumPriorityMessages: number;
  lowPriorityMessages: number;
  sourceStats: Array<{
    _id: string;
    count: number;
  }>;
  recentCount: number;
}

export interface MessageFilters {
  status?: 'new' | 'read' | 'replied' | 'archived';
  priority?: 'low' | 'medium' | 'high';
  source?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sort?: 'date' | 'priority' | 'status' | 'name';
}

export interface PaginatedMessages {
  success: boolean;
  data: Message[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

/**
 * Messages Service
 * 
 * Handles all API calls related to message management
 */
export const messagesService = {
  /**
   * Get all messages with filters and pagination
   */
  async getMessages(
    filters: MessageFilters = {},
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedMessages> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.source && { source: filters.source }),
      ...(filters.dateFrom && { dateFrom: filters.dateFrom }),
      ...(filters.dateTo && { dateTo: filters.dateTo }),
      ...(filters.search && { search: filters.search }),
      ...(filters.sort && { sort: filters.sort }),
    });

    const response = await apiClient.get(`/admin/messages?${params}`);
    return response;
  },

  /**
   * Get a single message by ID
   */
  async getMessageById(id: string): Promise<{ success: boolean; data: Message }> {
    const response = await apiClient.get(`/admin/messages/${id}`);
    return response;
  },

  /**
   * Get message statistics
   */
  async getMessageStats(): Promise<{ success: boolean; data: MessageStats }> {
    const response = await apiClient.get('/admin/messages/stats');
    return response;
  },

  /**
   * Get unread messages
   */
  async getUnreadMessages(limit: number = 10): Promise<{ success: boolean; data: Message[] }> {
    const response = await apiClient.get(`/admin/messages/unread?limit=${limit}`);
    return response;
  },

  /**
   * Mark a message as read
   */
  async markAsRead(id: string): Promise<{ success: boolean; message: string; data: Message }> {
    const response = await apiClient.put(`/admin/messages/${id}/read`);
    return response;
  },

  /**
   * Mark a message as replied
   */
  async markAsReplied(id: string): Promise<{ success: boolean; message: string; data: Message }> {
    const response = await apiClient.put(`/admin/messages/${id}/replied`);
    return response;
  },

  /**
   * Archive a message
   */
  async archiveMessage(id: string): Promise<{ success: boolean; message: string; data: Message }> {
    const response = await apiClient.put(`/admin/messages/${id}/archive`);
    return response;
  },

  /**
   * Change message priority
   */
  async changePriority(
    id: string,
    priority: 'low' | 'medium' | 'high'
  ): Promise<{ success: boolean; message: string; data: Message }> {
    const response = await apiClient.put(`/admin/messages/${id}/priority`, { priority });
    return response;
  },

  /**
   * Add a note to a message
   */
  async addNote(id: string, text: string): Promise<{ success: boolean; message: string; data: Message }> {
    const response = await apiClient.post(`/admin/messages/${id}/notes`, { text });
    return response;
  },

  /**
   * Reply to a message by email
   */
  async replyByEmail(id: string, replyText: string): Promise<{ success: boolean; message: string; data: Message }> {
    const response = await apiClient.post(`/admin/messages/${id}/reply`, { replyText });
    return response;
  },
};

/**
 * Helper functions
 */

export const getStatusLabel = (status: Message['status']): string => {
  const labels = {
    new: 'Nouveau',
    read: 'Lu',
    replied: 'Répondu',
    archived: 'Archivé',
  };
  return labels[status];
};

export const getStatusColor = (status: Message['status']): string => {
  const colors = {
    new: 'bg-blue-100 text-blue-800',
    read: 'bg-yellow-100 text-yellow-800',
    replied: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-800',
  };
  return colors[status];
};

export const getPriorityLabel = (priority: Message['priority']): string => {
  const labels = {
    low: 'Basse',
    medium: 'Moyenne',
    high: 'Haute',
  };
  return labels[priority];
};

export const getPriorityColor = (priority: Message['priority']): string => {
  const colors = {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800',
  };
  return colors[priority];
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
