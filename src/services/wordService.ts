import { getWordDefinition, parseGeminiResponse, DefinitionGroup } from './geminiService';

interface WordResponse {
  word: string;
  pronunciation: {
    text: string;
  };
  definitions: DefinitionGroup[];
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology: string;
  timestamp: string;
}

// Function to fetch pronunciation audio from Free Dictionary API
const fetchPronunciationAudio = async (word: string): Promise<{ text: string, audio?: string }> => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);

    if (!response.ok) {
      console.warn(`Could not fetch pronunciation for "${word}" from Free Dictionary API`);
      return { text: word }; // Use the word itself instead of empty string
    }

    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      // Extract phonetics information
      const phonetics = data[0].phonetics || [];

      // Find the first phonetic entry with audio
      const phoneticWithAudio = phonetics.find((p: any) => p.audio && p.audio.trim() !== '');

      if (phoneticWithAudio) {
        return {
          text: phoneticWithAudio.text || data[0].phonetic || word, // Fallback to word
          audio: phoneticWithAudio.audio
        };
      }

      // If no audio but phonetic text exists
      if (data[0].phonetic) {
        return { text: data[0].phonetic };
      }
    }

    return { text: word }; // Use the word itself instead of empty string
  } catch (error) {
    console.error('Error fetching pronunciation:', error);
    return { text: word }; // Use the word itself instead of empty string
  }
};

export const fetchWordDefinition = async (word: string): Promise<WordResponse> => {
  try {
    console.log(`WordService: Fetching definition for "${word}"`);
    const geminiResponse = await getWordDefinition(word);
    const parsedData = parseGeminiResponse(geminiResponse);
    console.log(`WordService: Successfully parsed definition for "${word}"`);

    // Fetch pronunciation audio
    const pronunciation = await fetchPronunciationAudio(word);

    // Filter out 'none' values from synonyms and antonyms
    const synonyms = parsedData.synonyms?.filter(syn => syn.toLowerCase() !== 'none') || [];
    const antonyms = parsedData.antonyms?.filter(ant => ant.toLowerCase() !== 'none') || [];

    return {
      word,
      pronunciation,
      ...parsedData,
      synonyms,
      antonyms,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error fetching word definition:', error);

    // Create a more specific error message based on the error type
    let errorMessage = 'Unable to fetch definition. Please try again later.';

    if (error.message.includes('API key')) {
      errorMessage = 'Dictionary service is not properly configured. Please check your API key.';
    } else if (error.message.toLowerCase().includes('not found')) {
      errorMessage = 'Definition Not Found: The word you are looking for does not exist in our dictionary.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection and try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. Please try again later.';
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'Too many requests. Please try again in a few minutes.';
    }

    // Return a more informative fallback response
    return {
      word,
      pronunciation: {
        text: word // Use the word itself instead of empty string
      },
      definitions: [{
        partOfSpeech: 'error',
        meanings: [{ meaning: errorMessage }],
      }],
      examples: ['No examples available.'],
      synonyms: [],
      antonyms: [],
      etymology: 'Etymology information unavailable.',
      timestamp: new Date().toISOString()
    };
  }
};

export const fetchWordSuggestions = async (query: string): Promise<string[]> => {
  // This is a mock implementation. In a real application, you would call an actual API
  const mockSuggestions = [
    `${query}able`,
    `${query}ful`,
    `${query}ness`,
    `${query}ing`,
    `${query}ed`
  ].filter(word => word.length > 2);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));

  return mockSuggestions;
};

// Fetch Word of the Day from the Free Dictionary API
export const fetchWordOfTheDay = async (): Promise<WordResponse> => {
  try {
    // List of interesting words that could be featured as Word of the Day
    const wordList = [
      'serendipity', 'ephemeral', 'ubiquitous', 'mellifluous', 'quintessential',
      'eloquent', 'resilience', 'paradigm', 'panacea', 'euphoria',
      'luminous', 'nostalgia', 'ethereal', 'serene', 'enigma',
      'cognizant', 'benevolent', 'cacophony', 'diaphanous', 'ebullient',
      'fastidious', 'garrulous', 'halcyon', 'ineffable', 'juxtapose'
    ];

    // Use the current date to select a word (ensures the same word is shown all day)
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
    const dateHash = Array.from(dateString).reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);

    const wordIndex = Math.abs(dateHash) % wordList.length;
    const wordOfTheDay = wordList[wordIndex];

    // Fetch the actual definition using our existing function
    return await fetchWordDefinition(wordOfTheDay);
  } catch (error) {
    console.error('Error fetching word of the day:', error);

    // Fallback response if API fails
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
  }
};

// Track and fetch trending words based on recent searches
let trendingWordsCache: { word: string, count: number, timestamp: string }[] = [];

export const trackWordSearch = (word: string): void => {
  // Don't track very short words
  if (word.length < 3) return;

  const now = new Date().toISOString();
  const existingIndex = trendingWordsCache.findIndex(item => item.word === word);

  if (existingIndex >= 0) {
    // Update existing word count and timestamp
    trendingWordsCache[existingIndex].count += 1;
    trendingWordsCache[existingIndex].timestamp = now;
  } else {
    // Add new word to tracking
    trendingWordsCache.push({
      word,
      count: 1,
      timestamp: now
    });
  }

  // Keep only the most recent 100 entries to prevent memory issues
  if (trendingWordsCache.length > 100) {
    trendingWordsCache = trendingWordsCache
      .sort((a, b) => b.count - a.count)
      .slice(0, 100);
  }
};

export const fetchTrendingWords = async (limit: number = 3): Promise<WordResponse[]> => {
  try {
    // Filter out entries older than 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentWords = trendingWordsCache.filter(item =>
      new Date(item.timestamp) > oneWeekAgo
    );

    // Sort by count (most searched first)
    const sortedWords = recentWords
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(item => item.word);

    // If we have trending words, fetch their definitions
    if (sortedWords.length > 0) {
      const wordPromises = sortedWords.map(word => fetchWordDefinition(word));
      return await Promise.all(wordPromises);
    }

    // Fallback to default trending words if no real trends exist yet
    const defaultTrendingWords = ['paradigm', 'ephemeral', 'ubiquitous'];
    const defaultPromises = defaultTrendingWords.map(word => fetchWordDefinition(word));
    return await Promise.all(defaultPromises);
  } catch (error) {
    console.error('Error fetching trending words:', error);

    // Fallback trending words if API fails
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
  }
};