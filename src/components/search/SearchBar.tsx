import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { useWord } from '../../contexts/WordContext';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { searchWord, getWordSuggestions } = useWord();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length >= 2) {
        const results = await getWordSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, getWordSuggestions]);

  const handleSearch = (term: string) => {
    searchWord(term);
    setQuery('');
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-3xl mx-auto group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a word..."
            className="w-full pl-14 pr-12 py-5 bg-white dark:bg-slate-800 border-none rounded-2xl shadow-xl text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:ring-0 focus:outline-none transition-all duration-300"
          />
          <Search className="absolute left-5 text-indigo-500 dark:text-indigo-400" size={24} />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 overflow-hidden animate-fade-in">
          <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50 flex items-center text-xs font-medium text-slate-500 uppercase tracking-wider">
            <Sparkles size={12} className="mr-2 text-indigo-500" />
            Suggestions
          </div>
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSearch(suggestion)}
              className="w-full px-6 py-3 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-slate-200 transition-colors flex items-center group/item"
            >
              <Search size={16} className="mr-3 text-slate-300 group-hover/item:text-indigo-400 transition-colors" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;