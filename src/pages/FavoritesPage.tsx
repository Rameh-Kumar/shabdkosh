import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, Search, ArrowRight, Calendar } from 'lucide-react';
import { useDatabase } from '../contexts/DatabaseContext';
import { useNotification } from '../contexts/NotificationContext';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Array<{ word: string; timestamp: string }>>([]);
  const { getFavorites, removeFromFavorites, clearAllFavorites } = useDatabase();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleRemove = async (e: React.MouseEvent, word: string) => {
    e.stopPropagation();
    await removeFromFavorites(word);
    await loadFavorites();
    showNotification(`Removed "${word}" from favorites`, 'info');
  };

  const handleClearAll = async () => {
    if (favorites.length === 0) return;

    // Immediate action as requested, no native alert
    await clearAllFavorites();
    setFavorites([]);
    showNotification('All favorites cleared', 'info');
  };

  const handleWordClick = (word: string) => {
    navigate(`/word/${word}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-2">
            Favorites
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Your curated collection of words
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Clear Collection
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div
          className="glass-panel p-12 rounded-3xl text-center border-dashed border-2 border-slate-200 dark:border-slate-700"
        >
          <div className="w-20 h-20 bg-pink-50 dark:bg-pink-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-pink-400">
            <Heart size={40} />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 mb-2">
            No favorites yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            Save words you want to remember by clicking the heart icon on any definition.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Search size={18} />
            Find Words
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {favorites.map((fav) => (
              <motion.div
                key={fav.word}
                variants={itemVariants}
                layout
                className="group glass-panel p-6 rounded-2xl relative overflow-hidden hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
                onClick={() => handleWordClick(fav.word)}
              >
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleRemove(e, fav.word)}
                    className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                    title="Remove from favorites"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-serif font-bold text-xl">
                    {fav.word.charAt(0).toUpperCase()}
                  </div>
                  <Heart size={20} className="text-pink-500 fill-pink-500" />
                </div>

                <h3 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {fav.word}
                </h3>

                <div className="flex items-center gap-2 text-xs text-slate-400 mt-4">
                  <Calendar size={12} />
                  <span>Added {new Date(fav.timestamp).toLocaleDateString()}</span>
                </div>

                <div className="absolute bottom-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg">
                    <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;