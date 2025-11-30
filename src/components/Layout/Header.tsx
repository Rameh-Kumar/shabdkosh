import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Book, Clock, Heart } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../search/SearchBar';

interface HeaderProps {
  // No props needed anymore
}

const Header: React.FC<HeaderProps> = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b-0 rounded-b-2xl mx-2 mt-2">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <div className="relative w-10 h-10 mr-3 transition-transform duration-300 group-hover:scale-110">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl rotate-3 opacity-80 group-hover:rotate-6 transition-transform"></div>
            <div className="absolute inset-0 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">S</span>
            </div>
          </div>
          <h1 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            Shabdkosh<span className="text-indigo-500">AI</span>
          </h1>
        </Link>

        <nav className="hidden md:flex items-center space-x-1 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-full backdrop-blur-sm">
          <NavLink to="/" icon={<Book size={18} />} label="Dictionary" active={isActive('/')} />
          <NavLink to="/history" icon={<Clock size={18} />} label="History" active={isActive('/history')} />
          <NavLink to="/favorites" icon={<Heart size={18} />} label="Favorites" active={isActive('/favorites')} />
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-all duration-300 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm hover:shadow-md"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Bottom Bar */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/30 p-2 flex justify-around items-center z-50">
        <MobileNavLink to="/" icon={<Book size={24} />} label="Dictionary" active={isActive('/')} />
        <MobileNavLink to="/history" icon={<Clock size={24} />} label="History" active={isActive('/history')} />
        <MobileNavLink to="/favorites" icon={<Heart size={24} />} label="Favorites" active={isActive('/favorites')} />
      </div>
    </header>
  );
};

const NavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${active
        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm font-medium'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
      }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const MobileNavLink = ({ to, icon, label, active }: { to: string, icon: React.ReactNode, label: string, active: boolean }) => (
  <Link
    to={to}
    className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${active
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
        : 'text-slate-500 dark:text-slate-400'
      }`}
  >
    {icon}
    <span className="text-[10px] font-medium mt-1">{label}</span>
  </Link>
);

export default Header;