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
      {/* Ambient Background Gradient */}
      <div className="absolute top-0 right-0 w-full h-96 bg-pink-500/10 dark:bg-pink-900/20 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 dark:from-pink-300 dark:via-purple-300 dark:to-indigo-300 mb-2 tracking-tight">
            Favorites
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
            Your personal treasury of words ✨
          </p>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="group relative flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 rounded-2xl overflow-hidden transition-all duration-300 w-full md:w-auto shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-red-200 dark:border-red-900/30 group-hover:border-red-300 dark:group-hover:border-red-800 transition-colors" />
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors" />
            <span className="relative flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm">
              <Trash2 size={18} className="transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Clear Collection
            </span>
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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          <AnimatePresence>
            {favorites.map((fav) => (
              <motion.div
                key={fav.word}
                variants={itemVariants}
                layout
                className="group glass-panel p-4 md:p-6 rounded-2xl relative overflow-hidden hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer aspect-square md:aspect-auto flex flex-col justify-between"
                onClick={() => handleWordClick(fav.word)}
              >
                <div className="absolute top-2 right-2 md:top-3 md:right-3 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={(e) => handleRemove(e, fav.word)}
                    className="p-1.5 md:p-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                    title="Remove from favorites"
                  >
                    <Trash2 size={14} className="md:w-4 md:h-4" />
                  </button>
                </div>

                <div className="flex items-start justify-between mb-2">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-300 font-serif font-bold text-lg md:text-xl">
                    {fav.word.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors break-words">
                    {fav.word}
                  </h3>

                  <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-400 mt-2 font-medium">
                    <Calendar size={10} className="md:w-3 md:h-3" />
                    <span>{new Date(fav.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 p-3 md:p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ArrowRight size={16} className="text-indigo-500" />
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