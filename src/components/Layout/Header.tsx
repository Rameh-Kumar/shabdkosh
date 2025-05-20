import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Sun, Moon, ChevronDown, User } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import SearchBar from '../search/SearchBar';

interface HeaderProps {
  toggleSidebar: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, onShowLogin, onShowRegister }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <Menu size={20} />
          </button>
          <Link to="/" className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
              <circle cx="32" cy="32" r="30" fill="url(#shabdkosh-gradient)" />
              <path d="M22 44 Q32 24 42 44" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <defs>
                <linearGradient id="shabdkosh-gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366F1" />
                  <stop offset="1" stopColor="#4F46E5" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Shabdkosh</h1>
          </Link>
        </div>
        
        <div className="hidden md:block flex-grow mx-4 max-w-2xl">
          <SearchBar />
        </div>
        
        <div className="flex items-center space-x-4">
          <div id="online-status" className="hidden">
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">Offline</span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition-colors duration-200 text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={toggleUserMenu}
              className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="User menu"
              aria-expanded={isUserMenuOpen}
            >
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                {isAuthenticated ? (
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={16} className="text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
              <span className="hidden md:block">
                {isAuthenticated ? user?.name : 'Guest'}
              </span>
              <ChevronDown size={16} />
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-20">
                {isAuthenticated ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onShowLogin();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Log In
                    </button>
                    <button 
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onShowRegister();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="md:hidden px-4 pb-3">
        <SearchBar />
      </div>
    </header>
  );
};

export default Header;