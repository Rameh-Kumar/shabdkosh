import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { useDatabase } from '../contexts/DatabaseContext';
import { Heart } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Array<{ word: string; timestamp: string }>>([]);
  const { getFavorites, removeFromFavorites, clearAllFavorites } = useDatabase();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleRemove = async (word: string) => {
    await removeFromFavorites(word);
    await loadFavorites();
    logEvent(analytics, 'remove_from_favorites', { word });
  };

  const handleClearAll = async () => {
    setShowConfirmation(true);
  };

  const confirmClearAll = async () => {
    await clearAllFavorites();
    showNotification('All favorites have been cleared', 'info');
    logEvent(analytics, 'clear_all_favorites');
    setShowConfirmation(false);
    await loadFavorites();
  };

  const cancelClearAll = () => {
    setShowConfirmation(false);
  };

  const handleWordClick = (word: string) => {
    navigate(`/word/${word}`);
  };

  if (favorites.length === 0) {
    return (
      <div className="card p-6 text-center">
        <i className="far fa-heart text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Words you favorite will appear here for easy access.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors"
        >
          Explore Words
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Favorites</h2>
        {favorites.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition-colors"
            aria-label="Clear all favorites"
          >
            <Heart size={16} className="mr-1" />
            Clear All
          </button>
        )}
      </div>

      {showConfirmation && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="mb-3">Are you sure you want to clear all favorites? This cannot be undone.</p>
          <div className="flex space-x-3">
            <button 
              onClick={confirmClearAll}
              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Yes, clear all
            </button>
            <button 
              onClick={cancelClearAll}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {favorites.map((fav) => (
          <div key={fav.word} className="card p-4 flex justify-between items-start">
            <button
              onClick={() => handleWordClick(fav.word)}
              className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline text-left"
            >
              {fav.word}
            </button>
            <button
              onClick={() => handleRemove(fav.word)}
              className="text-gray-400 hover:text-red-500"
              aria-label="Remove from favorites"
            >
              <Heart size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;