import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Book, Clock, Heart } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl mb-20 md:mb-0">
        {children}
      </main>

      <Footer />

      {/* Mobile Navigation Bottom Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-2 flex justify-around items-center z-50">
        <MobileNavLink to="/" icon={<Book size={24} />} label="Dictionary" active={isActive('/')} />
        <MobileNavLink to="/history" icon={<Clock size={24} />} label="History" active={isActive('/history')} />
        <MobileNavLink to="/favorites" icon={<Heart size={24} />} label="Favorites" active={isActive('/favorites')} />
      </div>
    </div>
  );
};

const MobileNavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 active:scale-95 ${active
      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-800'
      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
  >
    {icon}
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </Link>
);

export default Layout;