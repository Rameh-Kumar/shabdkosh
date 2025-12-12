import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Volume2, Heart, BookOpen, Sparkles, Link2, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWord } from '../contexts/WordContext';
import { useDatabase } from '../contexts/DatabaseContext';
import { useNotification } from '../contexts/NotificationContext';
import type { DefinitionGroup } from '../services/geminiService';
import SearchBar from '../components/search/SearchBar';
import AdUnit from '../components/ads/AdUnit';
import Skeleton from '../components/ui/Skeleton';

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
  const navigate = useNavigate();
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

      // 3. Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(wordData.word);
      utterance.rate = 0.8;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Audio playback failed:', error);
      setIsPlayingAudio(false);
      showNotification('Could not play pronunciation', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20">
        {/* Header Skeleton */}
        <div className="glass-panel p-8 md:p-10 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-slate-200 dark:bg-slate-700/50" />
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4">
              <Skeleton width={300} height={60} className="mb-2" />
              <Skeleton width={150} height={24} />
              <div className="flex gap-2 mt-4">
                <Skeleton width={80} height={32} variant="circular" />
                <Skeleton width={80} height={32} variant="circular" />
              </div>
            </div>
            <div className="flex gap-3">
              <Skeleton width={48} height={48} variant="rectangular" />
              <Skeleton width={48} height={48} variant="rectangular" />
            </div>
          </div>
        </div>

        {/* AI Insights Skeleton */}
        <div className="glass-panel rounded-3xl p-8">
          <Skeleton width={150} height={32} className="mb-6" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-3">
                <Skeleton width={120} height={24} />
                <Skeleton height={100} className="w-full rounded-2xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Definitions Skeleton */}
        <div className="glass-panel rounded-3xl p-8">
          <Skeleton width={180} height={32} className="mb-8" />
          <div className="space-y-12">
            {[1, 2].map(i => (
              <div key={i} className="space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton width={100} height={32} className="rounded-lg" />
                  <div className="h-px flex-1 bg-slate-200 dark:bg-slate-700/50" />
                </div>
                <div className="space-y-6 pl-6">
                  <div className="flex gap-4">
                    <Skeleton width={20} height={20} />
                    <div className="flex-1 space-y-3">
                      <Skeleton width="90%" height={24} />
                      <Skeleton width="60%" height={24} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  }

  if (error) {
    const isNotFound = error.toLowerCase().includes('not found');

    return (
      <div className="max-w-3xl mx-auto p-8 text-center">
        <div className="glass-panel p-8 rounded-3xl border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
          <h2 className="text-2xl font-bold text-red-500 mb-4">
            {isNotFound ? 'Word Not Found' : 'Something went wrong'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-6">{error}</p>

          {isNotFound && (
            <div className="mb-8">
              <SearchBar />
            </div>
          )}

          <button
            onClick={() => isNotFound ? navigate('/') : window.location.reload()}
            className="btn-primary bg-red-500 hover:bg-red-600 shadow-red-500/30"
          >
            {isNotFound ? 'Back to Home' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  if (!wordData) return null;

  const definitionGroups = wordData.definitions as DefinitionGroup[];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <Helmet>
        <title>{wordData.word} - Definition, Meaning & Usage | ShabdkoshAI</title>
        <meta name="description" content={`Definition of ${wordData.word}: ${definitionGroups[0]?.meanings[0]?.meaning}`} />
      </Helmet>

      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-3xl overflow-hidden relative"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        <div className="p-5 md:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-baseline gap-4 mb-3 flex-wrap">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white tracking-tight break-words">
                  {wordData.word}
                </h1>
                {wordData.pronunciation?.text && (
                  <span className="text-lg md:text-xl text-slate-500 dark:text-slate-400 font-mono">
                    {wordData.pronunciation.text}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {definitionGroups.map((g, i) => (
                  <span key={i} className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {g.partOfSpeech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 self-start md:self-auto">
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

      {/* In-Article Ad Unit */}
      <AdUnit slot="8899513285" />

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

                        {((meaning.synonyms?.length ?? 0) > 0 || (meaning.antonyms?.length ?? 0) > 0) && (
                          <div className="pt-2">
                            {meaning.synonyms && meaning.synonyms.length > 0 && (
                              <div className="space-y-2">
                                <span className="text-indigo-500 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                                  Synonyms
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                                    {meaning.synonyms.length}
                                  </span>
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {meaning.synonyms.map(syn => (
                                    <button
                                      key={syn}
                                      onClick={() => searchWord(syn)}
                                      className="group px-3 py-1.5 bg-slate-50 hover:bg-white dark:bg-slate-800/50 dark:hover:bg-slate-800 rounded-full text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md active:scale-95 flex items-center gap-1"
                                    >
                                      {syn}
                                      <Link2 size={12} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-3 group-hover:ml-0 overflow-hidden w-0 group-hover:w-auto" />
                                    </button>
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
        {/* Examples */}
        {wordData.examples && wordData.examples.length > 0 && (
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                <Link2 size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">Examples</h2>
            </div>
            <ul className="space-y-4">
              {wordData.examples.map((example, idx) => (
                <li key={idx} className="flex gap-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </motion.section>
        )}

        {/* Etymology */}
        {wordData.etymology && (
          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-panel rounded-3xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-serif font-bold text-slate-800 dark:text-slate-100">Etymology</h2>
            </div>
            <div className="text-slate-600 dark:text-slate-300 leading-relaxed space-y-4">
              {wordData.etymology.includes('Origin:') ? (
                wordData.etymology.split(/(?=(?:Origin|Development|Current):)/g).map((part, i) => {
                  const [label, ...content] = part.split(':');
                  if (!content.length) return null;
                  return (
                    <div key={i}>
                      <span className="font-bold text-slate-800 dark:text-slate-100">{label}:</span>
                      <span>{content.join(':')}</span>
                    </div>
                  );
                })
              ) : (
                <p>{wordData.etymology}</p>
              )}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, icon, label, active = false }: { onClick: () => void, icon: React.ReactNode, label: string, active?: boolean }) => (
  <button
    onClick={onClick}
    className={`p-3 rounded-xl backdrop-blur-md transition-all duration-300 border ${active
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border-transparent'
      : 'bg-white dark:bg-white/10 text-slate-500 dark:text-white border-slate-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-white/30 hover:text-indigo-600 dark:hover:text-indigo-300 hover:shadow-md'
      }`}
    title={label}
    aria-label={label}
  >
    {icon}
  </button>
);

export default DefinitionPage;