import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Cloud, Globe } from 'lucide-react';
import { useWord } from '../contexts/WordContext';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { getWordOfTheDay, getTrendingWords } = useWord();
  const wordOfTheDay = getWordOfTheDay();
  const trendingWords = getTrendingWords();

  const handleWordClick = (word: string) => {
    navigate(`/word/${word}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <section className="mb-12">
        <div className="card p-6 animate__animated animate__fadeIn">
          <h2 className="text-2xl font-bold mb-2">Welcome to Shabdkosh</h2>
          <p className="mb-4">Your AI-powered dictionary that provides comprehensive word definitions, examples, and more.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 bg-indigo-50 dark:bg-indigo-900 dark:bg-opacity-20">
              <div className="flex items-center mb-2">
                <Brain className="text-indigo-500 mr-2" size={20} />
                <h3 className="font-semibold">AI-Powered Definitions</h3>
              </div>
              <p className="text-sm">Get comprehensive definitions powered by advanced AI technology.</p>
            </div>
            <div className="border rounded-md p-4 bg-purple-50 dark:bg-purple-900 dark:bg-opacity-20">
              <div className="flex items-center mb-2">
                <Cloud className="text-purple-500 mr-2" size={20} />
                <h3 className="font-semibold">Offline Access</h3>
              </div>
              <p className="text-sm">Save words for offline access and continue learning anywhere.</p>
            </div>
            <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20">
              <div className="flex items-center mb-2">
                <Globe className="text-blue-500 mr-2" size={20} />
                <h3 className="font-semibold">Word Relationships</h3>
              </div>
              <p className="text-sm">Explore connections between words with interactive visualizations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Word of the Day Section */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Word of the Day</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-baseline justify-between mb-4">
            <h3 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 cursor-pointer hover:underline" onClick={() => handleWordClick(wordOfTheDay.word)}>
              {wordOfTheDay.word}
            </h3>
            <span className="text-gray-500 dark:text-gray-400">{wordOfTheDay.pronunciation.text}</span>
          </div>
          <div className="space-y-4">
            {wordOfTheDay.definitions.map((def, index) => {
              // Handle both flat definition format and grouped definition format
              if ('meanings' in def) {
                // Grouped format
                const groupedDef = def as { partOfSpeech: string; meanings: Array<{ meaning: string; example?: string }> };
                return (
                  <div key={index}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{groupedDef.partOfSpeech}</p>
                    {groupedDef.meanings.map((meaning, mIdx) => (
                      <div key={`${index}-${mIdx}`} className="mt-1">
                        <p className="text-gray-800 dark:text-gray-200">{meaning.meaning}</p>
                        {meaning.example && (
                          <p className="text-gray-600 dark:text-gray-300 italic mt-1">"{meaning.example}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                );
              } else {
                // Flat format
                const flatDef = def as { partOfSpeech: string; meaning: string; example?: string };
                return (
                  <div key={index}>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{flatDef.partOfSpeech}</p>
                    <p className="text-gray-800 dark:text-gray-200">{flatDef.meaning}</p>
                    {flatDef.example && (
                      <p className="text-gray-600 dark:text-gray-300 italic mt-2">"{flatDef.example}"</p>
                    )}
                  </div>
                );
              }
            })}
          </div>
        </div>
      </section>

      {/* Trending Words Section */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Trending Words</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trendingWords.map((word, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => handleWordClick(word.word)}
            >
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">{word.word}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{word.pronunciation.text}</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200">
                {'meanings' in word.definitions[0] 
                  ? (word.definitions[0] as { meanings: Array<{ meaning: string }> }).meanings[0].meaning
                  : (word.definitions[0] as { meaning: string }).meaning
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