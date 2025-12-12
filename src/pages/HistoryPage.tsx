import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trash2, Search, ArrowRight } from 'lucide-react';
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
      {/* Ambient Background Gradient */}
      <div className="absolute top-0 left-0 w-full h-96 bg-purple-500/10 dark:bg-purple-900/20 blur-3xl rounded-full -translate-y-1/2 pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white mb-2 tracking-tight">
            Search History
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg">
            Rewind your linguistic journey 🕰️
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClear}
            className="group relative flex items-center justify-center gap-2 px-5 py-3 md:py-2.5 rounded-2xl overflow-hidden transition-all duration-300 w-full md:w-auto shadow-sm hover:shadow-md"
          >
            <div className="absolute inset-0 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-red-200 dark:border-red-900/30 group-hover:border-red-300 dark:group-hover:border-red-800 transition-colors" />
            <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors" />
            <span className="relative flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm">
              <Trash2 size={18} className="transition-transform group-hover:scale-110 group-hover:rotate-12" />
              Clear History
            </span>
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
        <div className="relative border-l-2 border-indigo-100 dark:border-indigo-900/50 ml-4 md:ml-6 space-y-12">
          {(() => {
            const grouped = history.reduce<Record<string, typeof history>>((acc, item) => {
              const date = new Date(item.timestamp);
              const today = new Date();
              const yesterday = new Date(today);
              yesterday.setDate(yesterday.getDate() - 1);

              let key = 'Earlier';
              if (date.toDateString() === today.toDateString()) key = 'Today';
              else if (date.toDateString() === yesterday.toDateString()) key = 'Yesterday';

              if (!acc[key]) acc[key] = [];
              acc[key].push(item);
              return acc;
            }, {});

            const sectionOrder = ['Today', 'Yesterday', 'Earlier'];

            const sortedEntries = Object.entries(grouped).sort(([keyA], [keyB]) => {
              const indexA = sectionOrder.indexOf(keyA);
              const indexB = sectionOrder.indexOf(keyB);
              // If both are in the known list, sort by index
              if (indexA !== -1 && indexB !== -1) return indexA - indexB;
              // If only A is known, it comes first
              if (indexA !== -1) return -1;
              // If only B is known, it comes first
              if (indexB !== -1) return 1;
              // Otherwise sort alphabetically (fallback)
              return keyA.localeCompare(keyB);
            });

            return sortedEntries.map(([label, items]) => (
              <div key={label} className="relative">
                {/* Timeline Dot & Label */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="-ml-[7px] w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-white dark:ring-slate-900 shadow-lg shadow-indigo-500/30 z-10" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 bg-white dark:bg-slate-900 px-2 rounded-lg">
                    {label}
                  </h3>
                </div>

                <div className="grid gap-4 pl-8 md:pl-12">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.word}-${item.timestamp}`}
                        variants={itemVariants}
                        layout
                        initial="hidden"
                        animate="visible"
                        className="group glass-panel p-4 rounded-2xl flex items-center justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-1"
                        onClick={() => handleWordClick(item.word)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-serif font-bold text-xl group-hover:scale-110 transition-transform shadow-inner">
                            {item.word.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {item.word}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                              {new Date(item.timestamp).toLocaleTimeString(undefined, {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-indigo-500 transition-all transform group-hover:rotate-[-45deg] shadow-sm group-hover:shadow-indigo-500/30">
                          <ArrowRight size={20} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
