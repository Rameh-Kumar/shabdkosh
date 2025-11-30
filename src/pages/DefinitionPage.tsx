import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Volume2, Heart, BookOpen, Sparkles, Link2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWord } from '../contexts/WordContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useNotification } from '../contexts/NotificationContext';
import type { DefinitionGroup, MeaningDetail } from '../services/geminiService';
import SearchBar from '../components/search/SearchBar';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, type: 'spring', stiffness: 50 }
  })
};

const DefinitionPage: React.FC = () => {
  const { word } = useParams<{ word: string }>();
  const { initializeWord, wordData, isLoading, error, searchWord } = useWord();
  const { isWordFavorited, addToFavorites, removeFromFavorites } = useDatabase();
  const { showNotification } = useNotification();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

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
    } else {
      await addToFavorites(wordData.word);
      showNotification('Added to favorites', 'success');
    }
    setIsFavorited(!isFavorited);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const playAudio = async () => {
    if (isPlayingAudio || !wordData) return;
    setIsPlayingAudio(true);

    const play = (url: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.onended = () => resolve();
        audio.onerror = () => reject();
        audio.play().catch(reject);
      });
    };

    try {
      // 1. Try provided audio
      if (wordData.pronunciation?.audio) {
        await play(wordData.pronunciation.audio);
        setIsPlayingAudio(false);
        return;
      }

      // 2. Try Dictionary API fallback
      try {
        const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${wordData.word}`);
        if (res.ok) {
          const data = await res.json();
          const audioUrl = data[0]?.phonetics?.find((p: any) => p.audio && p.audio !== '')?.audio;
          if (audioUrl) {
            await play(audioUrl);
            setIsPlayingAudio(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Dictionary API fallback failed', e);
      }

      // 3. Final Fallback: Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(wordData.word);
        utterance.lang = 'en-US';
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          showNotification('Audio unavailable', 'error');
        };
        window.speechSynthesis.speak(utterance);
      } else {
        throw new Error('No audio source available');
      }

    } catch (e) {
      setIsPlayingAudio(false);
      showNotification('Audio unavailable', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-8 animate-pulse">
        <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl w-full"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-3xl w-full"></div>
        <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-3xl w-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="glass-panel p-8 rounded-3xl border-red-100 dark:border-red-900/30">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Definition Not Found</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary bg-red-500 hover:bg-red-600 shadow-red-500/30"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!wordData) return null;

  // Normalization logic
  let definitionGroups: DefinitionGroup[] = [];
  if (Array.isArray(wordData.definitions)) {
    if (wordData.definitions.length > 0) {
      if (typeof wordData.definitions[0] === 'object' && wordData.definitions[0] !== null && 'meanings' in wordData.definitions[0]) {
        definitionGroups = wordData.definitions as DefinitionGroup[];
      } else {
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

  if (definitionGroups.length === 0) {
    definitionGroups = [{
      partOfSpeech: 'unknown',
      meanings: [{ meaning: 'No definition found for this word.' }]
    }];
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Search Bar */}
      <div className="mb-8">
        <SearchBar />
      </div>

      {/* Word Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-4 drop-shadow-md">
              {wordData.word}
            </h1>
            <div className="flex items-center gap-4">
              <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-xl font-mono text-lg tracking-wide border border-white/10">
                {wordData.pronunciation?.text || "/.../"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ActionButton
              onClick={playAudio}
              icon={<Volume2 size={24} className={isPlayingAudio ? "animate-pulse" : ""} />}
              label="Pronounce"
              active={isPlayingAudio}
            />
            <ActionButton
              onClick={handleFavoriteClick}
              icon={<Heart size={24} fill={isFavorited ? "currentColor" : "none"} className={isFavorited ? "text-pink-400" : ""} />}
              label="Favorite"
              active={isFavorited}
            />
          </div>
        </div>
      </motion.div>

      {/* AI Insights Section */}
      {wordData.aiInsights && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-3xl p-8 border-indigo-100/50 dark:border-indigo-500/20 bg-gradient-to-br from-white/40 to-indigo-50/40 dark:from-slate-800/40 dark:to-indigo-900/20"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Sparkles size={20} />
            </div>
            <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">AI Insights</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                Simple Explanation
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                {wordData.aiInsights.simpleExplanation}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Pro Tips
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                {wordData.aiInsights.usageTips}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Fun Fact
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white/50 dark:bg-black/20 p-4 rounded-2xl">
                {wordData.aiInsights.funFact}
              </p>
            </div>
          </div>
        </motion.section>
      )}

      {/* Definitions */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="glass-panel rounded-3xl p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600 dark:text-indigo-400">
            <BookOpen size={24} />
          </div>
          <h2 className="text-2xl font-serif font-bold text-slate-800 dark:text-slate-100">Definitions</h2>
        </div>

        <div className="space-y-12">
          {definitionGroups.map((group, idx) => (
            <div key={idx} className="relative">
              <div className="flex items-center gap-4 mb-6">
                <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 rounded-lg text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {group.partOfSpeech}
                </span>
                <div className="h-px flex-1 bg-indigo-50 dark:bg-indigo-900/30"></div>
              </div>

              <div className="space-y-8">
                {group.meanings.map((meaning, mIdx) => (
                  <div key={mIdx} className="group relative pl-6 border-l-2 border-indigo-100 dark:border-indigo-900/50 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors py-1">
                    <div className="flex items-start gap-4">
                      <span className="text-indigo-300 dark:text-indigo-700 font-serif font-bold text-lg mt-0.5 select-none">{mIdx + 1}.</span>
                      <div className="flex-1 space-y-3">
                        <div className="relative">
                          <p className="text-xl text-slate-800 dark:text-slate-100 leading-relaxed font-serif">
                            {meaning.meaning}
                            <button
                              onClick={() => handleCopy(meaning.meaning, `${idx}-${mIdx}`)}
                              className="ml-3 inline-flex opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-500 align-middle"
                              title="Copy definition"
                            >
                              {copiedIndex === `${idx}-${mIdx}` ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                          </p>

                          {/* Metadata Badges */}
                          {(meaning.usage || meaning.register) && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {meaning.usage && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50">
                                  {meaning.usage}
                                </span>
                              )}
                              {meaning.register && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50">
                                  {meaning.register}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {meaning.example && (
                          <div className="pl-4 border-l-2 border-slate-200 dark:border-slate-700/50">
                            <p className="text-slate-600 dark:text-slate-400 italic font-medium">"{meaning.example}"</p>
                          </div>
                        )}

                        {(meaning.synonyms?.length > 0 || meaning.antonyms?.length > 0) && (
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm pt-1">
                            {meaning.synonyms?.length > 0 && (
                              <div className="flex items-center gap-2">
                                <span className="text-indigo-500 font-bold text-xs uppercase tracking-wide">Synonyms</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {meaning.synonyms.slice(0, 4).map(syn => (
                                    <span
                                      key={syn}
                                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 rounded-md text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 cursor-pointer transition-colors text-xs font-medium"
                                      onClick={() => searchWord(syn)}
                                    >
                                      {syn}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Examples & Etymology Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {wordData.examples.length > 0 && (
          <motion.section
            custom={1}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="glass-panel rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Sparkles size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">Examples</h2>
            </div>
            <ul className="space-y-4">
              {wordData.examples.slice(0, 4).map((ex, i) => (
                <li key={i} className="flex gap-3 text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  <span className="text-emerald-400 font-serif">"</span>
                  {ex}
                  <span className="text-emerald-400 font-serif">"</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {wordData.etymology && (
          <motion.section
            custom={2}
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            className="glass-panel rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <Link2 size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">Etymology</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {wordData.etymology}
            </p>
          </motion.section>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon, label, active = false }: { onClick: () => void, icon: React.ReactNode, label: string, active?: boolean }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 ${active
      ? 'bg-white text-indigo-600 shadow-lg scale-105'
      : 'bg-white/10 text-white hover:bg-white/20'
      }`}
    title={label}
  >
    {icon}
  </button>
);

export default DefinitionPage;