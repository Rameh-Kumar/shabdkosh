import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { openDB, IDBPDatabase } from 'idb';
import { DefinitionGroup } from '../services/geminiService';

export interface WordData {
  word: string;
  pronunciation: {
    text: string;
    audio?: string;
  };
  definitions: Array<{ partOfSpeech: string; meaning: string; example?: string; } | DefinitionGroup>;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology: string;
  timestamp: string;
}

interface HistoryItem {
  id?: number;
  word: string;
  timestamp: string;
}

interface FavoriteItem {
  word: string;
  timestamp: string;
}

export interface PreferenceItem {
  [key: string]: any;
}

interface DatabaseContextType {
  db: IDBPDatabase | null;
  isInitialized: boolean;
  // Word operations
  getWord: (word: string) => Promise<WordData | undefined>;
  saveWord: (wordData: WordData) => Promise<void>;
  deleteWord: (word: string) => Promise<void>;
  getAllWords: () => Promise<WordData[]>;
  // History operations
  addToHistory: (word: string) => Promise<void>;
  getHistory: () => Promise<HistoryItem[]>;
  clearHistory: () => Promise<void>;
  removeWordFromHistory: (word: string) => Promise<void>;
  // Favorites operations
  addToFavorites: (word: string) => Promise<void>;
  removeFromFavorites: (word: string) => Promise<void>;
  clearAllFavorites: () => Promise<void>;
  getFavorites: () => Promise<FavoriteItem[]>;
  isWordFavorited: (word: string) => Promise<boolean>;
  // Offline words operations
  saveForOffline: (wordData: WordData) => Promise<void>;
  removeFromOffline: (word: string) => Promise<void>;
  clearAllOfflineWords: () => Promise<void>;
  getOfflineWords: () => Promise<WordData[]>;
  isWordOffline: (word: string) => Promise<boolean>;
  // Preferences operations
  getPreference: (id: string) => Promise<PreferenceItem | null>;
  setPreference: (id: string, data: PreferenceItem) => Promise<void>;
}

const DB_NAME = 'lexiai-db';
const DB_VERSION = 1;

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<IDBPDatabase | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = await openDB(DB_NAME, DB_VERSION, {
          upgrade(db) {
            // Words store
            if (!db.objectStoreNames.contains('words')) {
              db.createObjectStore('words', { keyPath: 'word' });
            }
            
            // Favorites store
            if (!db.objectStoreNames.contains('favorites')) {
              db.createObjectStore('favorites', { keyPath: 'word' });
            }
            
            // History store
            if (!db.objectStoreNames.contains('history')) {
              const historyStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
              historyStore.createIndex('word', 'word', { unique: false });
              historyStore.createIndex('timestamp', 'timestamp', { unique: false });
            }
            
            // User preferences store
            if (!db.objectStoreNames.contains('preferences')) {
              db.createObjectStore('preferences', { keyPath: 'id' });
            }
            
            // Offline words store
            if (!db.objectStoreNames.contains('offline')) {
              db.createObjectStore('offline', { keyPath: 'word' });
            }
          },
        });
        
        setDb(database);
        setIsInitialized(true);
        
        // Set default preferences if not already set
        const preferencesStore = database.transaction('preferences', 'readonly').objectStore('preferences');
        const userPreferences = await preferencesStore.get('userPreferences');
        
        if (!userPreferences) {
          const defaultPreferences = {
            id: 'userPreferences',
            theme: 'light',
            fontSize: 'medium',
            notifications: true,
            lastVisit: new Date().toISOString()
          };
          
          await database.put('preferences', defaultPreferences);
        } else {
          // Update last visit
          const updatedPreferences = {
            ...userPreferences,
            lastVisit: new Date().toISOString()
          };
          
          await database.put('preferences', updatedPreferences);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  // Word operations
  const getWord = async (word: string): Promise<WordData | undefined> => {
    if (!db) return undefined;
    return db.get('words', word);
  };

  const saveWord = async (wordData: WordData): Promise<void> => {
    if (!db) return;
    await db.put('words', wordData);
  };

  const deleteWord = async (word: string): Promise<void> => {
    if (!db) return;
    await db.delete('words', word);
  };

  const getAllWords = async (): Promise<WordData[]> => {
    if (!db) return [];
    return db.getAll('words');
  };

  // History operations
  const addToHistory = async (word: string): Promise<void> => {
    if (!db) return;
    const historyItem: HistoryItem = {
      word,
      timestamp: new Date().toISOString()
    };
    await db.add('history', historyItem);
  };

  const getHistory = async (): Promise<HistoryItem[]> => {
    if (!db) return [];
    return db.getAllFromIndex('history', 'timestamp');
  };

  const clearHistory = async (): Promise<void> => {
    if (!db) return;
    await db.clear('history');
  };
  
  const removeWordFromHistory = async (word: string): Promise<void> => {
    if (!db) return;
    const tx = db.transaction('history', 'readwrite');
    const store = tx.objectStore('history');
    const wordIndex = store.index('word');
    let cursor = await wordIndex.openCursor(word);
    
    while (cursor) {
      await cursor.delete();
      cursor = await cursor.continue();
    }
  };

  // Favorites operations
  const addToFavorites = async (word: string): Promise<void> => {
    if (!db) return;
    const favoriteItem: FavoriteItem = {
      word,
      timestamp: new Date().toISOString()
    };
    await db.put('favorites', favoriteItem);
  };

  const removeFromFavorites = async (word: string): Promise<void> => {
    if (!db) return;
    await db.delete('favorites', word);
  };

  const clearAllFavorites = async (): Promise<void> => {
    if (!db) return;
    await db.clear('favorites');
  };

  const getFavorites = async (): Promise<FavoriteItem[]> => {
    if (!db) return [];
    return db.getAll('favorites');
  };

  const isWordFavorited = async (word: string): Promise<boolean> => {
    if (!db) return false;
    const result = await db.get('favorites', word);
    return !!result;
  };

  // Offline words operations
  const saveForOffline = async (wordData: WordData): Promise<void> => {
    if (!db) return;
    await db.put('offline', wordData);
  };

  const removeFromOffline = async (word: string): Promise<void> => {
    if (!db) return;
    await db.delete('offline', word);
  };

  const clearAllOfflineWords = async (): Promise<void> => {
    if (!db) return;
    await db.clear('offline');
  };

  const getOfflineWords = async (): Promise<WordData[]> => {
    if (!db) return [];
    return db.getAll('offline');
  };

  const isWordOffline = async (word: string): Promise<boolean> => {
    if (!db) return false;
    const result = await db.get('offline', word);
    return !!result;
  };

  // Preferences operations
  const getPreference = async (id: string): Promise<PreferenceItem | null> => {
    if (!db) return null;
    return db.get('preferences', id);
  };

  const setPreference = async (id: string, data: PreferenceItem): Promise<void> => {
    if (!db) return;
    await db.put('preferences', { id, ...data });
  };

  const contextValue: DatabaseContextType = {
    db,
    isInitialized,
    getWord,
    saveWord,
    deleteWord,
    getAllWords,
    addToHistory,
    getHistory,
    clearHistory,
    removeWordFromHistory,
    addToFavorites,
    removeFromFavorites,
    clearAllFavorites,
    getFavorites,
    isWordFavorited,
    saveForOffline,
    removeFromOffline,
    clearAllOfflineWords,
    getOfflineWords,
    isWordOffline,
    getPreference,
    setPreference
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  
  return context;
};