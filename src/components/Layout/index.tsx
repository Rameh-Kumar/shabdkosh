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
    <div className="min-h-screen flex flex-col transition-colors duration-500 pb-40 md:pb-0">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 max-w-5xl md:mb-0">
        {children}
      </main>

      <div>
        <Footer />
      </div>

      {/* Mobile Navigation Bottom Bar */}
      <div className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        {/* Glass Container with Gradient Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-sm transform -inset-[1px]" />
        <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-2 flex justify-around items-center ring-1 ring-black/5 dark:ring-white/5">
          <MobileNavLink to="/" icon={<Book size={20} />} activeIcon={<Book size={20} fill="currentColor" />} label="Dictionary" active={isActive('/')} />
          <MobileNavLink to="/history" icon={<Clock size={20} />} activeIcon={<Clock size={20} fill="currentColor" />} label="History" active={isActive('/history')} />
          <MobileNavLink to="/favorites" icon={<Heart size={20} />} activeIcon={<Heart size={20} fill="currentColor" />} label="Favorites" active={isActive('/favorites')} />
        </div>
      </div>
    </div>
  );
};

const MobileNavLink = ({ to, icon, activeIcon, label, active }: { to: string, icon: React.ReactNode, activeIcon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-300 w-16 ${active
      ? 'text-indigo-600 dark:text-indigo-400 scale-110'
      : 'text-slate-400 dark:text-slate-500 hover:text-indigo-500 dark:hover:text-indigo-400'
      }`}
  >
    {/* Active Glow Background */}
    {active && (
      <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-400/20 rounded-xl blur-lg -z-10" />
    )}

    <div className={`transition-transform duration-300 ${active ? '-translate-y-1' : ''}`}>
      {active ? activeIcon : icon}
    </div>
    <span className={`text-[10px] font-bold mt-1 transition-opacity duration-300 ${active ? 'opacity-100' : 'opacity-0 h-0 hidden'}`}>
      {label}
    </span>

  </Link>
);

export default Layout;