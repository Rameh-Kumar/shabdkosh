import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../contexts/DatabaseContext';
import { useNotification } from '../contexts/NotificationContext';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Array<{ word: string; timestamp: string }>>([]);
  const { getHistory, clearHistory } = useDatabase();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const hist = await getHistory();
    setHistory(hist);
  };

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
    showNotification('Search history cleared', 'info');
  };

  const handleWordClick = (word: string) => {
    navigate(`/word/${word}`);
  };

  if (history.length === 0) {
    return (
      <div className="card p-6 text-center">
        <i className="fas fa-history text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
        <h3 className="text-xl font-semibold mb-2">No search history</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Words you search will appear here for easy reference.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Search History</h2>
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-4">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
          >
            <button
              onClick={() => handleWordClick(item.word)}
              className="font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              {item.word}
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(item.timestamp).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;