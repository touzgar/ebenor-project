'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function AboutPageAdmin() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the accueil section which handles about content
    router.push('/admin/homepage/accueil');
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">Redirection vers la section À propos...</p>
      </div>
    </div>
  );
}
