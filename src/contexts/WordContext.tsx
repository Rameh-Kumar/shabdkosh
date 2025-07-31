import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { useDatabase, WordData } from './DatabaseContext';
import { useNotification } from './NotificationContext';
import * as wordService from '../services/wordService';
import { DefinitionGroup, MeaningDetail, testGeminiApiKey } from '../services/geminiService';

interface WordContextType {
  currentWord: string;
  wordData: WordData | null;
  isLoading: boolean;
  error: string | null;
  searchWord: (word: string) => Promise<void>;
  initializeWord: (word: string) => Promise<void>;
  getWordSuggestions: (query: string) => Promise<string[]>;
  getWordOfTheDay: () => WordData;
  getTrendingWords: () => WordData[];
}

const WordContext = createContext<WordContextType | undefined>(undefined);

export const WordProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentWord, setCurrentWord] = useState<string>('');
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyValid, setApiKeyValid] = useState<boolean | null>(null);
  const [wordOfTheDay, setWordOfTheDay] = useState<WordData | null>(null);
  const [trendingWords, setTrendingWords] = useState<WordData[]>([]);
  
  const navigate = useNavigate();
  const { getWord, saveWord, addToHistory, isWordOffline } = useDatabase();
  const { showNotification } = useNotification();
  
  // Test API key on component mount
  useEffect(() => {
    const checkApiKey = async () => {
      const isValid = await testGeminiApiKey();
      setApiKeyValid(isValid);
      if (!isValid) {
        console.error('Gemini API key validation failed');
        // Removed notification to stop showing error message
      }
    };
    
    checkApiKey();
  }, []);

  // Function to fetch word data without navigation
  const initializeWord = async (word: string): Promise<void> => {
    if (!word.trim()) return;
    
    const searchTerm = word.trim().toLowerCase();
    setCurrentWord(searchTerm);
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if API key is valid before proceeding
      if (apiKeyValid === false) {
        throw new Error('Dictionary service is not properly configured. Please check your API key.');
      }
      
      const isOffline = await isWordOffline(searchTerm);
      
      if (isOffline) {
        const offlineData = await getWord(searchTerm);
        if (offlineData) {
          setWordData(offlineData);
          await addToHistory(searchTerm);
          setIsLoading(false);
          return;
        }
      }
      
      console.log(`Initializing word: ${searchTerm}`);
      const data = await wordService.fetchWordDefinition(searchTerm);
      
      // Check if the response contains an error message
      if (data.definitions.length === 1 && 
          data.definitions[0].partOfSpeech === 'error') {
        throw new Error(data.definitions[0].meanings[0].meaning);
      }
      
      // Transform flat definitions into grouped format
      let groupedDefinitions: DefinitionGroup[] = [];
      
      if (Array.isArray(data.definitions)) {
        // Check if definitions are already in the grouped format
        if (data.definitions.length > 0 && 'meanings' in data.definitions[0]) {
          // Already in the correct format
          groupedDefinitions = data.definitions as DefinitionGroup[];
        } else {
          // Convert flat definitions to grouped format
          const definitionsByPOS: Record<string, MeaningDetail[]> = {};
          
          data.definitions.forEach((def) => {
            if ('meaning' in def && typeof def.meaning === 'string') {
              const flatDef = def as { partOfSpeech: string; meaning: string; example?: string };
              if (!definitionsByPOS[flatDef.partOfSpeech]) {
                definitionsByPOS[flatDef.partOfSpeech] = [];
              }
              definitionsByPOS[flatDef.partOfSpeech].push({
                meaning: flatDef.meaning,
                example: flatDef.example
              });
            }
          });
          
          Object.entries(definitionsByPOS).forEach(([partOfSpeech, meanings]) => {
            groupedDefinitions.push({ partOfSpeech, meanings });
          });
        }
      }

      const wordDataForContext: WordData = {
        ...data,
        definitions: groupedDefinitions
      };
      setWordData(wordDataForContext);
      await saveWord(wordDataForContext);
      await addToHistory(searchTerm);
    } catch (err) {
      setError('Failed to load definition. Please try again.');
      showNotification('Failed to load definition. Please try again.', 'error');
      console.error('Error fetching word definition:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle search with navigation
  const searchWord = async (word: string): Promise<void> => {
    if (!word.trim()) return;
    const searchTerm = word.trim().toLowerCase();
    
    // Track this search for trending words
    wordService.trackWordSearch(searchTerm);
    if (analytics) {
      logEvent(analytics, 'word_search', { search_term: searchTerm });
    }
    
    navigate(`/word/${searchTerm}`);
  };

  const getWordSuggestions = async (query: string): Promise<string[]> => {
    if (!query || query.length < 2) return [];
    
    try {
      return await wordService.fetchWordSuggestions(query);
    } catch (err) {
      console.error('Error fetching word suggestions:', err);
      return [];
    }
  };

  // Load word of the day and trending words on component mount
  useEffect(() => {
    const loadFeaturedWords = async () => {
      try {
        // Fetch word of the day
        const wotd = await wordService.fetchWordOfTheDay();
        setWordOfTheDay(wotd);
        
        // Fetch trending words
        const trending = await wordService.fetchTrendingWords(3);
        setTrendingWords(trending);
      } catch (err) {
        console.error('Error loading featured words:', err);
      }
    };
    
    loadFeaturedWords();
    
    // Refresh featured words every 24 hours
    const refreshInterval = setInterval(() => {
      loadFeaturedWords();
    }, 24 * 60 * 60 * 1000); // 24 hours
    
    return () => clearInterval(refreshInterval);
  }, []);

  const getWordOfTheDay = (): WordData => {
    // Return the fetched word of the day or a fallback if not loaded yet
    if (wordOfTheDay) {
      return wordOfTheDay;
    }
    
    // Fallback data while loading
    return {
      word: 'serendipity',
      pronunciation: {
        text: '/ˌser.ənˈdɪp.ɪ.ti/'
      },
      definitions: [{
        partOfSpeech: 'noun',
        meanings: [{
          meaning: 'The occurrence and development of events by chance in a happy or beneficial way.',
          example: 'A fortunate stroke of serendipity'
        }]
      }],
      examples: [
        'A series of happy serendipities led to his discovery.',
        'Finding that rare book was pure serendipity.'
      ],
      synonyms: ['chance', 'fate', 'fortuity', 'providence'],
      antonyms: ['misfortune', 'calamity', 'disaster'],
      etymology: 'The word "serendipity" was coined by Horace Walpole in 1754, based on the Persian fairy tale "The Three Princes of Serendip" whose heroes often made discoveries by accident.',
      timestamp: new Date().toISOString()
    };
  };

  const getTrendingWords = (): WordData[] => {
    // Return the fetched trending words or fallback if not loaded yet
    if (trendingWords && trendingWords.length > 0) {
      return trendingWords;
    }
    
    // Fallback data while loading
    return [
      {
        word: 'paradigm',
        pronunciation: { text: '/ˈpærəˌdaɪm/' },
        definitions: [{
          partOfSpeech: 'noun',
          meanings: [{ 
            meaning: 'A typical example or pattern of something',
            example: 'This is a paradigm of excellence'
          }]
        }],
        examples: ['This is a paradigm of excellence'],
        synonyms: ['model', 'pattern', 'example'],
        antonyms: ['anomaly'],
        etymology: 'Late 15th century: via late Latin from Greek paradeigma, from paradeiknunai "show side by side"',
        timestamp: new Date().toISOString()
      },
      {
        word: 'ephemeral',
        pronunciation: { text: '/ɪˈfɛm(ə)rəl/' },
        definitions: [{
          partOfSpeech: 'adjective',
          meanings: [{
            meaning: 'Lasting for a very short time',
            example: 'Fashions are ephemeral'
          }]
        }],
        examples: ['Fashions are ephemeral'],
        synonyms: ['fleeting', 'transient', 'momentary'],
        antonyms: ['permanent', 'enduring'],
        etymology: 'From Greek ephēmeros "lasting only a day"',
        timestamp: new Date().toISOString()
      },
      {
        word: 'ubiquitous',
        pronunciation: { text: '/juːˈbɪkwɪtəs/' },
        definitions: [{
          partOfSpeech: 'adjective',
          meanings: [{
            meaning: 'Present, appearing, or found everywhere',
            example: 'Smartphones have become ubiquitous in modern society'
          }]
        }],
        examples: ['Smartphones have become ubiquitous in modern society'],
        synonyms: ['omnipresent', 'universal', 'pervasive'],
        antonyms: ['rare', 'scarce', 'uncommon'],
        etymology: 'From Latin ubique meaning "everywhere"',
        timestamp: new Date().toISOString()
      }
    ];
  };

  const contextValue: WordContextType = {
    currentWord,
    wordData,
    isLoading,
    error,
    searchWord,
    initializeWord,
    getWordSuggestions,
    getWordOfTheDay,
    getTrendingWords
  };

  return (
    <WordContext.Provider value={contextValue}>
      {children}
    </WordContext.Provider>
  );
};

export const useWord = (): WordContextType => {
  const context = useContext(WordContext);
  
  if (context === undefined) {
    throw new Error('useWord must be used within a WordProvider');
  }
  
  return context;
};