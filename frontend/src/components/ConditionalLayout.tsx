'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import Footer from './Footer';

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Check if we're on an admin page
  const isAdminPage = pathname.startsWith('/admin');
  
  // Admin pages handle their own navigation and footer
  if (isAdminPage) {
    return <>{children}</>;
  }
  
  // Regular pages get the standard navigation and footer
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}