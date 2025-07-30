import React, { createContext, useContext, ReactNode } from 'react';
import { supabase } from '../services/supabaseClient';
import { DefinitionGroup } from '../services/geminiService';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';

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

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {


  // Word operations (Supabase)
  const getWord = async (word: string): Promise<WordData | undefined> => {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('word', word)
      .single();
    if (error) {
      console.error('Supabase getWord error:', error);
      return undefined;
    }
    return data as WordData;
  };

  const saveWord = async (wordData: WordData): Promise<void> => {
    const { error } = await supabase
      .from('words')
      .upsert([wordData]);
    if (!error) {
      logEvent(analytics, 'save_for_offline', { word: wordData.word });
    }
    if (error) {
      console.error('Supabase saveWord error:', error);
    }
  };

  const deleteWord = async (word: string): Promise<void> => {
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('word', word);
    if (error) {
      console.error('Supabase deleteWord error:', error);
    }
  };

  const getAllWords = async (): Promise<WordData[]> => {
    const { data, error } = await supabase
      .from('words')
      .select('*');
    if (error) {
      console.error('Supabase getAllWords error:', error);
      return [];
    }
    return data as WordData[];
  };


  // History operations (Supabase)
  const addToHistory = async (word: string): Promise<void> => {
    const historyItem: HistoryItem = {
      word,
      timestamp: new Date().toISOString()
    };
    const { error } = await supabase
      .from('history')
      .insert([historyItem]);
    if (error) {
      console.error('Supabase addToHistory error:', error);
    }
  };

  const getHistory = async (): Promise<HistoryItem[]> => {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) {
      console.error('Supabase getHistory error:', error);
      return [];
    }
    return data as HistoryItem[];
  };

  const clearHistory = async (): Promise<void> => {
    const { error } = await supabase
      .from('history')
      .delete(); // delete all
    if (error) {
      console.error('Supabase clearHistory error:', error);
    }
  };

  const removeWordFromHistory = async (word: string): Promise<void> => {
    const { error } = await supabase
      .from('history')
      .delete()
      .eq('word', word);
    if (error) {
      console.error('Supabase removeWordFromHistory error:', error);
    }
  };


  // Favorites operations (Supabase)
  const addToFavorites = async (word: string): Promise<void> => {
    const favoriteItem: FavoriteItem = {
      word,
      timestamp: new Date().toISOString()
    };
    const { error } = await supabase
      .from('favorites')
      .upsert([favoriteItem]);
    if (error) {
      console.error('Supabase addToFavorites error:', error);
    }
  };

  const removeFromFavorites = async (word: string): Promise<void> => {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('word', word);
    if (error) {
      console.error('Supabase removeFromFavorites error:', error);
    }
  };

  const clearAllFavorites = async (): Promise<void> => {
    const { error } = await supabase
      .from('favorites')
      .delete(); // delete all
    if (error) {
      console.error('Supabase clearAllFavorites error:', error);
    }
  };

  const getFavorites = async (): Promise<FavoriteItem[]> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('*');
    if (error) {
      console.error('Supabase getFavorites error:', error);
      return [];
    }
    return data as FavoriteItem[];
  };

  const isWordFavorited = async (word: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('favorites')
      .select('word')
      .eq('word', word)
      .single();
    if (error) {
      return false;
    }
    return !!data;
  };


  // Offline words operations (Supabase)
  const saveForOffline = async (wordData: WordData): Promise<void> => {
    const { error } = await supabase
      .from('offline')
      .upsert([wordData]);
    if (error) {
      console.error('Supabase saveForOffline error:', error);
    }
  };

  const removeFromOffline = async (word: string): Promise<void> => {
    const { error } = await supabase
      .from('offline')
      .delete()
      .eq('word', word);
    if (error) {
      console.error('Supabase removeFromOffline error:', error);
    }
  };

  const clearAllOfflineWords = async (): Promise<void> => {
    const { error } = await supabase
      .from('offline')
      .delete(); // delete all
    if (error) {
      console.error('Supabase clearAllOfflineWords error:', error);
    }
  };

  const getOfflineWords = async (): Promise<WordData[]> => {
    const { data, error } = await supabase
      .from('offline')
      .select('*');
    if (error) {
      console.error('Supabase getOfflineWords error:', error);
      return [];
    }
    return data as WordData[];
  };

  const isWordOffline = async (word: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('offline')
      .select('word')
      .eq('word', word)
      .single();
    if (error) {
      return false;
    }
    return !!data;
  };


  // Preferences operations (Supabase)
  const getPreference = async (id: string): Promise<PreferenceItem | null> => {
    const { data, error } = await supabase
      .from('preferences')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      return null;
    }
    return data as PreferenceItem;
  };

  const setPreference = async (id: string, data: PreferenceItem): Promise<void> => {
    const { error } = await supabase
      .from('preferences')
      .upsert([{ id, ...data }]);
    if (error) {
      console.error('Supabase setPreference error:', error);
    }
  };

  const contextValue: DatabaseContextType = {
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