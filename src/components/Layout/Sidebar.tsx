import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, X } from 'lucide-react';
import { useWord } from '../../contexts/WordContext';
import { useDatabase } from '../../contexts/DatabaseContext';
// Animation imports commented out since we're not using them currently
// import { motion } from 'framer-motion';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  // State for recent searches (currently hidden but keeping for future use)
  // To re-enable, uncomment the following line and related code
  // const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { getWordOfTheDay, searchWord } = useWord();
  const { isWordFavorited, addToFavorites, removeFromFavorites } = useDatabase();
  const [wotdFavorited, setWotdFavorited] = useState(false);
  
  const wordOfDay = getWordOfTheDay();

  useEffect(() => {
    const checkWotdFavorited = async () => {
      const isFavorited = await isWordFavorited(wordOfDay.word);
      setWotdFavorited(isFavorited);
    };
    
    checkWotdFavorited();
  }, [isWordFavorited, wordOfDay.word]);

  // Load recent searches (functionality hidden but keeping for future use)
  // To re-enable, uncomment this effect and related code
  /*
  useEffect(() => {
    const loadRecentSearches = async () => {
      const history = await getHistory();
      
      // Get unique words, most recent first
      const words = Array.from(
        new Set(
          history
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .map(item => item.word)
        )
      ).slice(0, 5);
      
      setRecentSearches(words);
    };
    
    loadRecentSearches();
  }, [pathname, getHistory]);
  */

  const toggleWotdFavorite = async () => {
    if (wotdFavorited) {
      await removeFromFavorites(wordOfDay.word);
    } else {
      await addToFavorites(wordOfDay.word);
    }
    setWotdFavorited(!wotdFavorited);
  };

  const menuItems: MenuItem[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} />, path: '/' },
    { id: 'favorites', label: 'Favorites', icon: <Heart size={18} />, path: '/favorites' },
    // Hidden for now, but keeping the code for future use
    // { id: 'history', label: 'Search History', icon: <History size={18} />, path: '/history' },
    // { id: 'offline', label: 'Offline Words', icon: <Download size={18} />, path: '/offline' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  const handleWordClick = (word: string) => {
    searchWord(word);
    if (window.innerWidth < 768) {
      closeSidebar();
    }
  };

  // Function to handle removing a word from recent searches
  // (Functionality hidden but keeping for future use)
  // To re-enable, uncomment this function and related imports
  /*
  const handleRemoveWord = async (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    await removeWordFromHistory(word);
    setRecentSearches(prev => prev.filter(w => w !== word));
  };
  */

  const sidebarClass = `sidebar bg-gray-50 dark:bg-gray-800 w-64 md:w-72 flex-shrink-0 h-screen overflow-y-auto md:sticky top-16 ${isOpen ? 'open' : ''}`;

  return (
    <aside className={sidebarClass}>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Dictionary</h2>
          <button
            className="md:hidden rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-2">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`menu-item flex items-center cursor-pointer p-3 rounded-md transition-all ${
                pathname === item.path ? 'active bg-indigo-100 dark:bg-indigo-900 dark:bg-opacity-50 font-medium' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => handleNavigation(item.path)}
            >
              <span className="mr-3 text-indigo-600 dark:text-indigo-400">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
        
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        
        
        <h3 className="text-md font-semibold mb-2">Word of the Day</h3>
        <div className="card p-3">
          <div className="flex justify-between items-start">
            <h4 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
              {wordOfDay.word}
            </h4>
            <button 
              className={`focus:outline-none ${wotdFavorited ? 'text-red-500' : 'text-gray-400 hover:text-indigo-500'}`}
              onClick={toggleWotdFavorite}
              aria-label={wotdFavorited ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart size={18} fill={wotdFavorited ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {wordOfDay.pronunciation.text}
          </p>
          <p className="text-sm mt-2">
            {/* Handle both simple definition and DefinitionGroup types */}
            {'meanings' in wordOfDay.definitions[0] 
              ? wordOfDay.definitions[0].meanings[0]?.meaning 
              : wordOfDay.definitions[0].meaning}
          </p>
          <button 
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-block mt-2"
            onClick={() => handleWordClick(wordOfDay.word)}
          >
            See full definition
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;