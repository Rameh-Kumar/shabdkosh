import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, TrendingUp, BookOpen, ArrowRight } from 'lucide-react';
import { useWord } from '../contexts/WordContext';
import SearchBar from '../components/search/SearchBar';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { getWordOfTheDay, getTrendingWords } = useWord();
  const wordOfTheDay = getWordOfTheDay();
  const trendingWords = getTrendingWords();

  const handleWordClick = (word: string) => {
    navigate(`/word/${word}`);
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 text-center space-y-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full blur-3xl -z-10"></div>

        <div className="space-y-4 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">
            Discover the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Power</span> of Words
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-light">
            Explore definitions, etymologies, and relationships in a beautiful, distraction-free environment.
          </p>
        </div>

        <div className="px-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <SearchBar />
        </div>
      </section>

      {/* Word of the Day Section */}
      <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
            <Sparkles size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-slate-100">Word of the Day</h2>
        </div>

        <div
          className="group relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700/50 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
          onClick={() => handleWordClick(wordOfTheDay.word)}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 duration-700"></div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-baseline gap-4 mb-6">
              <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {wordOfTheDay.word}
              </h3>
              <span className="text-xl font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/50 px-3 py-1 rounded-lg">
                {wordOfTheDay.pronunciation.text}
              </span>
            </div>

            <div className="space-y-4 max-w-3xl">
              {wordOfTheDay.definitions.slice(0, 1).map((def, index) => {
                const isGrouped = 'meanings' in def;
                const partOfSpeech = isGrouped ? (def as any).partOfSpeech : (def as any).partOfSpeech;
                const meaning = isGrouped ? (def as any).meanings[0].meaning : (def as any).meaning;
                const example = isGrouped ? (def as any).meanings[0].example : (def as any).example;

                return (
                  <div key={index} className="space-y-3">
                    <span className="inline-block px-3 py-1 text-sm font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full uppercase">
                      {partOfSpeech}
                    </span>
                    <p className="text-xl text-slate-700 dark:text-slate-200 leading-relaxed font-serif">
                      {meaning}
                    </p>
                    {example && (
                      <p className="text-slate-500 dark:text-slate-400 italic pl-4 border-l-2 border-indigo-200 dark:border-indigo-800">
                        "{example}"
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center text-indigo-600 dark:text-indigo-400 font-medium group-hover:translate-x-2 transition-transform">
              View full definition <ArrowRight size={18} className="ml-2" />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Words Section */}
      <section className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
            <TrendingUp size={24} />
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-800 dark:text-slate-100">Trending Now</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trendingWords.map((word, index) => (
            <div
              key={index}
              className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-100 dark:border-slate-700/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              onClick={() => handleWordClick(word.word)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {word.word}
                </h3>
                <BookOpen size={16} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 line-clamp-2 text-sm leading-relaxed">
                {'meanings' in word.definitions[0]
                  ? (word.definitions[0] as any).meanings[0].meaning
                  : (word.definitions[0] as any).meaning
                }
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;