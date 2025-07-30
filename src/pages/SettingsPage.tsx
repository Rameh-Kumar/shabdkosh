import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useNotification } from '../contexts/NotificationContext';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

const SettingsPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { clearHistory, clearAllFavorites, clearAllOfflineWords } = useDatabase();
  const { showNotification } = useNotification();

  const handleClearHistory = async () => {
    await clearHistory();
    showNotification('Search history cleared', 'success');
    logEvent(analytics, 'clear_search_history');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Appearance</h3>
        <div className="flex items-center justify-between">
          <span>Theme</span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Clear Data</h3>
          <button
            onClick={handleClearHistory}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mb-2"
          >
            Clear Search History
          </button>
          <button
            onClick={async () => {
              await clearAllFavorites();
              showNotification('All favorites cleared', 'success');
              logEvent(analytics, 'clear_all_favorites_from_settings');
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Clear All Favorites
          </button>
          <button
            onClick={async () => {
              await clearAllOfflineWords();
              showNotification('All offline words cleared', 'success');
              logEvent(analytics, 'clear_all_offline_words_from_settings');
            }}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 mt-2"
          >
            Clear All Offline Words
          </button>
      </div>
    </div>
  );
};

export default SettingsPage;