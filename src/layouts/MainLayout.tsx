import type { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Shell mobile-first da aplicação.
 * Headers e footers específicos ficam nas páginas (ex.: fluxo da comanda).
 */
export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};
