import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

/**
 * Public Layout Component
 * 
 * Minimal layout for public pages
 * Individual pages handle their own navigation/footer structure
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>;
}