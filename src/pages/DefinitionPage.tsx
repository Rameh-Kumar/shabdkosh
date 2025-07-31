import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { Volume2, Heart, BookOpen, List, Sparkles, Link2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWord } from '../contexts/WordContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useNotification } from '../contexts/NotificationContext';
import type { DefinitionGroup, MeaningDetail } from '../services/geminiService';

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, type: 'spring', stiffness: 60 }
  })
};

const DefinitionPage: React.FC = () => {
  const { word } = useParams<{ word: string }>();
  const { initializeWord, wordData, isLoading, error, searchWord } = useWord();
  const { isWordFavorited, addToFavorites, removeFromFavorites } = useDatabase();
  const { showNotification } = useNotification();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    if (word) {
      initializeWord(word);
      checkFavoriteStatus(word);
    }
  }, [word]);

  const checkFavoriteStatus = async (word: string) => {
    const favorited = await isWordFavorited(word);
    setIsFavorited(favorited);
  };

  const handleFavoriteClick = async () => {
    if (!wordData) return;

    if (isFavorited) {
      await removeFromFavorites(wordData.word);
      showNotification('Removed from favorites', 'info');
      if (analytics) {
        logEvent(analytics, 'remove_from_favorites', { word: wordData.word });
      }
    } else {
      await addToFavorites(wordData.word);
      showNotification('Added to favorites', 'success');
      if (analytics) {
        logEvent(analytics, 'add_to_favorites', { word: wordData.word });
      }
    }
    setIsFavorited(!isFavorited);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse max-w-4xl mx-auto p-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-red-200 dark:border-red-900 text-center my-8">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400">Error Loading Definition</h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg">{error}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Please try searching for another word or check your connection.</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!wordData) return null;

  // Ensure definitions are typed and normalized
  let definitionGroups: DefinitionGroup[] = [];
  if (Array.isArray(wordData.definitions)) {
    if (wordData.definitions.length > 0) {
      if (typeof wordData.definitions[0] === 'object' && wordData.definitions[0] !== null && 'meanings' in wordData.definitions[0]) {
        // Already grouped
        definitionGroups = wordData.definitions as DefinitionGroup[];
      } else {
        // Flat array, group by partOfSpeech
        const flatDefs = wordData.definitions as Array<{ partOfSpeech: string; meaning: string; example?: string }>;
        const groupMap: Record<string, MeaningDetail[]> = {};
        flatDefs.forEach(def => {
          if (!groupMap[def.partOfSpeech]) groupMap[def.partOfSpeech] = [];
          groupMap[def.partOfSpeech].push({
            meaning: def.meaning,
            example: def.example
          });
        });
        definitionGroups = Object.entries(groupMap).map(([partOfSpeech, meanings]) => ({ partOfSpeech, meanings }));
      }
    }
  }
  
  // Add fallback if no definitions are found
  if (definitionGroups.length === 0) {
    definitionGroups = [{
      partOfSpeech: 'unknown',
      meanings: [{ meaning: 'No definition found for this word. Please try another word or check your spelling.' }]
    }];
  }

  return (
    <div className="max-w-3xl mx-auto p-2 sm:p-4 space-y-8 sm:space-y-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 min-h-[90vh] rounded-xl shadow-xl dark:text-white">
      {/* Word Header */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-8 rounded-2xl shadow-2xl mb-2 sm:mb-4"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="w-full">
            <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 flex items-center gap-2 sm:gap-3 font-serif tracking-tight drop-shadow-lg break-words">
              <BookOpen className="inline-block" size={32} />
              {wordData.word}
            </h1>
            <div className="flex items-center gap-2 sm:gap-4 mt-2 flex-wrap">
              <span className="text-lg sm:text-2xl font-light tracking-wide font-mono bg-white/10 px-2 sm:px-3 py-1 rounded-lg shadow-inner">
                {wordData.pronunciation?.text || ""}
              </span>
              <button 
                onClick={async () => {
                  if (isPlayingAudio) return; // Prevent multiple clicks
                  
                  // Check if we already have audio URL
                  if (wordData.pronunciation?.audio) {
                    try {
                      setIsPlayingAudio(true);
                      const audio = new Audio(wordData.pronunciation.audio);
                      
                      // Add event listener for when audio ends
                      audio.addEventListener('ended', () => {
                        setIsPlayingAudio(false);
                      });
                      
                      // Add error event listener
                      audio.addEventListener('error', () => {
                        console.error('Audio failed to load');
                        setIsPlayingAudio(false);
                        tryFallbackAudio();
                      });
                      
                      await audio.play();
                      // Audio playing successfully
                    } catch (err) {
                      console.error('Error playing audio:', err);
                      setIsPlayingAudio(false);
                      tryFallbackAudio();
                    }
                  } else {
                    tryFallbackAudio();
                  }
                  
                  // Fallback function to try fetching audio from Free Dictionary API directly
                  async function tryFallbackAudio() {
                    try {
                      if (!wordData) return; // Add null check for wordData
                      
                      setIsPlayingAudio(true);
                      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wordData.word)}`);
                      
                      if (!response.ok) {
                        throw new Error('Could not fetch pronunciation');
                      }
                      
                      const data = await response.json();
                      
                      if (Array.isArray(data) && data.length > 0) {
                        const phonetics = data[0].phonetics || [];
                        const phoneticWithAudio = phonetics.find((p: any) => p.audio && p.audio.trim() !== '');
                        
                        if (phoneticWithAudio && phoneticWithAudio.audio) {
                          const audio = new Audio(phoneticWithAudio.audio);
                          
                          audio.addEventListener('ended', () => {
                            setIsPlayingAudio(false);
                          });
                          
                          await audio.play();
                          return; // Success
                        }
                      }
                      
                      throw new Error('No audio available');
                    } catch (err) {
                      console.error('Fallback audio failed:', err);
                      showNotification('Audio pronunciation not available for this word', 'info');
                      setIsPlayingAudio(false);
                    }
                  }
                }}
                className={`p-2 rounded-full transition-all focus:ring-2 focus:ring-white ${isPlayingAudio ? 'bg-white/30 animate-pulse' : 'hover:bg-white/20'}`}
                aria-label="Play pronunciation"
                title="Play pronunciation"
                disabled={isPlayingAudio}
              >
                <Volume2 size={22} />
              </button>
              <button 
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-all focus:ring-2 focus:ring-white ${isFavorited ? 'bg-pink-500 text-white' : 'hover:bg-white/20'}`}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart fill={isFavorited ? "currentColor" : "none"} size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Definitions Section */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-blue-100 dark:border-blue-900"
      >
        <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30 rounded-t-2xl">
          <List className="text-blue-500" size={22} />
          <h2 className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-200 font-serif tracking-tight">Definitions</h2>
        </div>
        <div className="p-4 sm:p-6 space-y-8">
          {definitionGroups.length > 0 ? (
            definitionGroups.map((defGroup: DefinitionGroup, groupIdx: number) => (
              <div key={groupIdx} className="mb-6">
                {defGroup.partOfSpeech !== 'unknown' && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100 uppercase tracking-wider">
                      {defGroup.partOfSpeech}
                    </span>
                  </div>
                )}
                <ol className="space-y-6 ml-2">
                  {defGroup.meanings && defGroup.meanings.map((meaning: MeaningDetail, idx: number) => (
                    <li key={idx} className="relative bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 shadow-sm border-l-4 border-blue-400">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-blue-900 dark:text-blue-100 text-lg">{idx + 1}.</span>
                        <span className="font-serif text-base sm:text-lg text-blue-900 dark:text-blue-100">{meaning.meaning}</span>
                        <button
                          className="ml-2 p-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                          onClick={() => navigator.clipboard.writeText(meaning.meaning)}
                          title="Copy definition"
                        >
                          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="3" y="3" width="13" height="13" rx="2"/></svg>
                        </button>
                      </div>
                      {meaning.example && (
                        <div className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm mt-1 italic flex items-center gap-1">
                          <Sparkles size={14} className="inline-block" /> "{meaning.example}"
                          <button
                            className="ml-1 p-1 rounded hover:bg-blue-200 dark:hover:bg-blue-800"
                            onClick={() => navigator.clipboard.writeText(meaning.example!)}
                            title="Copy example"
                          >
                            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="3" y="3" width="13" height="13" rx="2"/></svg>
                          </button>
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        {meaning.usage && (
                          <span className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <List size={12} /> {meaning.usage}
                          </span>
                        )}
                        {meaning.register && (
                          <span className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <BookOpen size={12} /> {meaning.register}
                          </span>
                        )}
                      </div>
                      {(meaning.synonyms && meaning.synonyms.length > 0) && (
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                          <span className="text-purple-700 dark:text-purple-200 font-semibold flex items-center gap-1"><Link2 size={14} />Synonyms:</span>
                          {meaning.synonyms.map((syn: string, sidx: number) => (
                            <span key={sidx} className="bg-purple-100 dark:bg-purple-900 rounded-full px-2 py-0.5 text-purple-800 dark:text-purple-100 text-xs font-medium">{syn}</span>
                          ))}
                        </div>
                      )}
                      {(meaning.antonyms && meaning.antonyms.length > 0) && (
                        <div className="mt-1 flex flex-wrap gap-2 items-center">
                          <span className="text-red-700 dark:text-red-200 font-semibold flex items-center gap-1"><Link2 size={14} />Antonyms:</span>
                          {meaning.antonyms.map((ant: string, aidx: number) => (
                            <span key={aidx} className="bg-red-100 dark:bg-red-900 rounded-full px-2 py-0.5 text-red-800 dark:text-red-100 text-xs font-medium">{ant}</span>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            ))
          ) : (
            <div className="p-6 text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-blue-800 dark:text-blue-200 text-lg font-serif">No definitions found for this word.</p>
            </div>
          )}
        </div>
      </motion.section>

      {/* Examples Section */}
      <motion.section
        custom={1}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-green-100 dark:border-green-900"
      >
        <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-green-100 dark:border-green-900 bg-green-50 dark:bg-green-900/30 rounded-t-2xl">
          <Sparkles className="text-green-500" size={22} />
          <h2 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-200 font-serif tracking-tight">Examples</h2>
        </div>
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
          {wordData.examples.map((example, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="p-3 sm:p-4 bg-green-50/40 dark:bg-green-900/20 rounded-lg shadow-sm border-l-4 border-green-400"
            >
              <p className="italic text-base sm:text-lg text-green-900 dark:text-green-100 font-serif">"{example}"</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Synonyms Section */}
      {wordData.synonyms.length > 0 && (
        <motion.section
          custom={2}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900"
        >
          <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-purple-100 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/30 rounded-t-2xl">
            <Link2 className="text-purple-500" size={22} />
            <h2 className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-200 font-serif tracking-tight">Synonyms</h2>
          </div>
          <div className="p-4 sm:p-6 flex flex-wrap gap-2 sm:gap-3">
            {wordData.synonyms.map((syn, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-800 dark:text-purple-100 text-sm sm:text-base font-semibold shadow hover:scale-105 transition-transform cursor-pointer select-text"
                onClick={() => searchWord(syn)}
                title={`View definition for '${syn}'`}
                role="button"
                tabIndex={0}
              >
                {syn}
              </motion.span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Antonyms Section */}
      {wordData.antonyms.length > 0 && (
        <motion.section
          custom={3}
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-red-100 dark:border-red-900"
        >
          <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/30 rounded-t-2xl">
            <Link2 className="text-red-500" size={22} />
            <h2 className="text-xl sm:text-2xl font-bold text-red-700 dark:text-red-200 font-serif tracking-tight">Antonyms</h2>
          </div>
          <div className="p-4 sm:p-6 flex flex-wrap gap-2 sm:gap-3">
            {wordData.antonyms.map((ant, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="px-3 sm:px-4 py-1 sm:py-2 bg-red-100 dark:bg-red-900 rounded-full text-red-800 dark:text-red-100 text-sm sm:text-base font-semibold shadow hover:scale-105 transition-transform cursor-pointer select-text"
                onClick={() => searchWord(ant)}
                title={`View definition for '${ant}'`}
                role="button"
                tabIndex={0}
              >
                {ant}
              </motion.span>
            ))}
          </div>
        </motion.section>
      )}

      {/* Etymology Section */}
      <motion.section
        custom={4}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-amber-100 dark:border-amber-900"
      >
        <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/30 rounded-t-2xl">
          <Sparkles className="text-amber-500" size={22} />
          <h2 className="text-xl sm:text-2xl font-bold text-amber-700 dark:text-amber-300 font-serif tracking-tight">Etymology</h2>
        </div>
        <div className="p-4 sm:p-6">
          <p className="leading-relaxed text-base sm:text-lg font-serif text-amber-900 dark:text-amber-100 animate-fade-in">
            {wordData.etymology}
          </p>
        </div>
      </motion.section>
    </div>
  );
};

export default DefinitionPage;