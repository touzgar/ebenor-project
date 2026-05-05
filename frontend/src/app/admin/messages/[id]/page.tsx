'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  messagesService,
  Message,
  getStatusLabel,
  getStatusColor,
  getPriorityLabel,
  getPriorityColor,
  formatDate,
} from '@/services/messagesService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { HiArrowLeft, HiMail, HiPhone, HiClock, HiUser } from 'react-icons/hi';

export default function MessageDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  useEffect(() => {
    loadMessage();
  }, [id]);

  const loadMessage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await messagesService.getMessageById(id);
      
      if (response.success) {
        setMessage(response.data);
        
        // Auto-mark as read if status is "new"
        if (response.data.status === 'new') {
          await messagesService.markAsRead(id);
        }
      }
    } catch (err: any) {
      console.error('Error loading message:', err);
      setError(err.message || 'Erreur lors du chargement du message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsReplied = async () => {
    if (!message) return;
    
    try {
      setIsUpdating(true);
      const response = await messagesService.markAsReplied(id);
      
      if (response.success) {
        setMessage(response.data);
        alert('Message marqué comme répondu');
      }
    } catch (err: any) {
      console.error('Error marking as replied:', err);
      alert(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchive = async () => {
    if (!message) return;
    
    if (!confirm('Êtes-vous sûr de vouloir archiver ce message ?')) {
      return;
    }
    
    try {
      setIsUpdating(true);
      const response = await messagesService.archiveMessage(id);
      
      if (response.success) {
        alert('Message archivé');
        router.push('/admin/messages');
      }
    } catch (err: any) {
      console.error('Error archiving message:', err);
      alert(err.message || 'Erreur lors de l\'archivage');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePriority = async (priority: 'low' | 'medium' | 'high') => {
    if (!message) return;
    
    try {
      setIsUpdating(true);
      const response = await messagesService.changePriority(id, priority);
      
      if (response.success) {
        setMessage(response.data);
      }
    } catch (err: any) {
      console.error('Error changing priority:', err);
      alert(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!noteText.trim()) {
      alert('Veuillez saisir une note');
      return;
    }
    
    try {
      setIsAddingNote(true);
      const response = await messagesService.addNote(id, noteText.trim());
      
      if (response.success) {
        setMessage(response.data);
        setNoteText('');
      }
    } catch (err: any) {
      console.error('Error adding note:', err);
      alert(err.message || 'Erreur lors de l\'ajout de la note');
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleReplyByEmail = () => {
    if (!message) return;
    
    const subject = `Re: ${message.subject}`;
    const body = `\n\n---\nMessage original de ${message.name} (${formatDate(message.createdAt)}):\n${message.message}`;
    
    window.location.href = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !message) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
            {error || 'Message non trouvé'}
          </div>
          <Link
            href="/admin/messages"
            className="mt-4 inline-flex items-center text-[#C9A14A] hover:text-[#B8903A]"
          >
            <HiArrowLeft className="mr-2" />
            Retour aux messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/admin/messages"
            className="inline-flex items-center text-[#C9A14A] hover:text-[#B8903A] mb-4"
          >
            <HiArrowLeft className="mr-2" />
            Retour aux messages
          </Link>
          
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Détails du message</h1>
            
            <div className="flex gap-2">
              <button
                onClick={handleReplyByEmail}
                className="px-4 py-2 bg-[#C9A14A] text-white rounded-lg hover:bg-[#B8903A] transition-colors"
              >
                Répondre par email
              </button>
              
              {message.status !== 'replied' && (
                <button
                  onClick={handleMarkAsReplied}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Marquer comme répondu
                </button>
              )}
              
              {message.status !== 'archived' && (
                <button
                  onClick={handleArchive}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Archiver
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{message.subject}</h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <HiUser className="mr-1" />
                    {message.name}
                  </div>
                  <div className="flex items-center">
                    <HiMail className="mr-1" />
                    {message.email}
                  </div>
                  {message.phone && (
                    <div className="flex items-center">
                      <HiPhone className="mr-1" />
                      {message.phone}
                    </div>
                  )}
                  <div className="flex items-center">
                    <HiClock className="mr-1" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{message.message}</p>
              </div>
            </motion.div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes internes</h3>
              
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="mb-6">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Ajouter une note interne..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A14A] focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={isAddingNote || !noteText.trim()}
                  className="mt-2 px-4 py-2 bg-[#C9A14A] text-white rounded-lg hover:bg-[#B8903A] transition-colors disabled:opacity-50"
                >
                  {isAddingNote ? 'Ajout...' : 'Ajouter une note'}
                </button>
              </form>
              
              {/* Notes List */}
              {message.notes.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucune note pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {message.notes.map((note, index) => (
                    <div key={index} className="border-l-4 border-[#C9A14A] pl-4 py-2">
                      <p className="text-gray-700">{note.text}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {note.createdBy} • {formatDate(note.createdAt)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                  <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${getStatusColor(message.status)}`}>
                    {getStatusLabel(message.status)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priorité</label>
                  <select
                    value={message.priority}
                    onChange={(e) => handleChangePriority(e.target.value as any)}
                    disabled={isUpdating}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#C9A14A] focus:border-transparent"
                  >
                    <option value="low">Basse</option>
                    <option value="medium">Moyenne</option>
                    <option value="high">Haute</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                  <p className="text-sm text-gray-600">{message.source}</p>
                </div>
                
                {message.readAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Lu le</label>
                    <p className="text-sm text-gray-600">{formatDate(message.readAt)}</p>
                    {message.readBy && (
                      <p className="text-xs text-gray-500">Par {message.readBy}</p>
                    )}
                  </div>
                )}
                
                {message.repliedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Répondu le</label>
                    <p className="text-sm text-gray-600">{formatDate(message.repliedAt)}</p>
                    {message.repliedBy && (
                      <p className="text-xs text-gray-500">Par {message.repliedBy}</p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Technical Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations techniques</h3>
              
              <div className="space-y-2 text-sm">
                {message.ipAddress && (
                  <div>
                    <span className="font-medium text-gray-700">IP :</span>
                    <span className="ml-2 text-gray-600">{message.ipAddress}</span>
                  </div>
                )}
                
                {message.userAgent && (
                  <div>
                    <span className="font-medium text-gray-700">Navigateur :</span>
                    <p className="text-gray-600 text-xs mt-1 break-all">{message.userAgent}</p>
                  </div>
                )}
                
                <div>
                  <span className="font-medium text-gray-700">ID :</span>
                  <span className="ml-2 text-gray-600 text-xs">{message._id}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
