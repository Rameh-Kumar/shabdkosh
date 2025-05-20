import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase, WordData } from '../contexts/DatabaseContext';
import { useNotification } from '../contexts/NotificationContext';
import { X } from 'lucide-react';

const OfflinePage: React.FC = () => {
  const [offlineWords, setOfflineWords] = useState<WordData[]>([]);
  const { getOfflineWords, removeFromOffline, clearAllOfflineWords } = useDatabase();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    loadOfflineWords();
  }, []);

  const loadOfflineWords = async () => {
    const words = await getOfflineWords();
    setOfflineWords(words);
  };

  const handleRemove = async (word: string) => {
    await removeFromOffline(word);
    showNotification(`"${word}" removed from offline storage`, 'info');
    await loadOfflineWords();
  };

  const handleClearAll = async () => {
    setShowConfirmation(true);
  };

  const confirmClearAll = async () => {
    await clearAllOfflineWords();
    showNotification('All offline words have been cleared', 'info');
    setShowConfirmation(false);
    await loadOfflineWords();
  };

  const cancelClearAll = () => {
    setShowConfirmation(false);
  };

  const handleWordClick = (word: string) => {
    navigate(`/word/${word}`);
  };

  if (offlineWords.length === 0) {
    return (
      <div className="card p-6 text-center">
        <i className="fas fa-cloud-download-alt text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 className="text-xl font-semibold mb-2">No offline words</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Save words for offline access by clicking the download icon on any word definition.
        </p>
      </div>
    );
  }

  const totalSize = Math.round(
    offlineWords.reduce((size, word) => size + JSON.stringify(word).length, 0) / 1024
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Offline Words</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {offlineWords.length} words ({totalSize} KB)
          </div>
          {offlineWords.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 rounded-md transition-colors"
              aria-label="Clear all offline words"
            >
              <X size={16} className="mr-1" />
              Clear All
            </button>
          )}
        </div>
      </div>
      
      {showConfirmation && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="mb-3">Are you sure you want to clear all offline words? This cannot be undone.</p>
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
        {offlineWords.map((word) => (
          <div key={word.word} className="card p-4 flex justify-between items-start">
            <div>
              <button
                onClick={() => handleWordClick(word.word)}
                className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {word.word}
              </button>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Saved: {new Date(word.timestamp).toLocaleString()}
              </div>
            </div>
            <button
              onClick={() => handleRemove(word.word)}
              className="text-gray-400 hover:text-red-500"
              aria-label="Remove from offline storage"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfflinePage;