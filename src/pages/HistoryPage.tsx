import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, Search, ArrowRight, Calendar } from 'lucide-react';
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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-2">
            Search History
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Your recent linguistic explorations
          </p>
        </div>
        
        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium"
          >
            <Trash2 size={16} />
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div 
          className="glass-panel p-12 rounded-3xl text-center border-dashed border-2 border-slate-200 dark:border-slate-700"
        >
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <Clock size={40} />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-700 dark:text-slate-200 mb-2">
            No history yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
            Words you search will appear here. Start your journey by searching for a word!
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Search size={18} />
            Start Searching
          </button>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4"
        >
          <AnimatePresence>
            {history.map((item, index) => (
              <motion.div
                key={`${item.word}-${item.timestamp}`}
                variants={itemVariants}
                layout
                className="group glass-panel p-4 rounded-2xl flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer"
                onClick={() => handleWordClick(item.word)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 font-serif font-bold text-lg group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    {item.word.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {item.word}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Calendar size={12} />
                      {new Date(item.timestamp).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/30 transition-all transform group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default HistoryPage;