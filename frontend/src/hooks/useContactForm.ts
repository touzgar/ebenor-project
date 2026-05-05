import { useState } from 'react';
import { messagesService } from '@/lib/api';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface UseContactFormReturn {
  submitMessage: (data: ContactFormData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export function useContactForm(): UseContactFormReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitMessage = async (data: ContactFormData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const response = await messagesService.send(data);

      if (response.success) {
        setSuccess(true);
        return true;
      } else {
        throw new Error(response.message || 'Erreur lors de l\'envoi du message');
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitMessage,
    loading,
    error,
    success,
  };
}