import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;