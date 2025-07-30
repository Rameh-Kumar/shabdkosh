import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useDatabase } from './DatabaseContext';
import { analytics } from '../firebase';
import { logEvent } from 'firebase/analytics';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be set in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { getPreference, setPreference } = useDatabase();

  useEffect(() => {
    const checkLoggedInUser = async () => {
      try {
        const prefs = await getPreference('userPreferences');
        if (prefs?.user) {
          setUser(prefs.user);
        }
      } catch (error) {
        if (error instanceof Error) {
        console.error('Error checking logged in user:', error);
        throw new Error('Failed to check logged in user: ' + error.message);
      } else {
        console.error('Unexpected error checking logged in user:', error);
        throw new Error('Failed to check logged in user');
      }
      }
    };

    checkLoggedInUser();
  }, [getPreference]);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (!error) {
        logEvent(analytics, 'login', { method: 'email_password' });
      }
  
      if (error) {
        console.error('Error during login:', error);
        // Return the error message directly from Supabase
        return { 
          success: false, 
          message: error.message
        };
      }
  
      const user = {
        id: data.user.id,
        name: data.user.email?.split('@')[0] || '',
        email: data.user.email || ''
      };
  
      setUser(user);
  
      const prefs = await getPreference('userPreferences') || {};
      await setPreference('userPreferences', {
        ...prefs,
        user
      });
  
      return { success: true };
    } catch (error) {
      if (error instanceof Error) {
        console.error('Login error:', error);
        return { success: false, message: error.message };
      } else {
        console.error('Unexpected login error:', error);
        return { success: false, message: 'An unexpected error occurred' };
      }
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });

      if (!error) {
        logEvent(analytics, 'sign_up', { method: 'email_password' });
      }

      if (error) {
        console.error('Error during registration:', error);
        throw error;
      }

      const user = {
        id: data.user?.id || '',
        name,
        email
      };

      setUser(user);

      const prefs = await getPreference('userPreferences') || {};
      await setPreference('userPreferences', {
        ...prefs,
        user
      });

      return true;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Registration error:', error);
      } else {
        console.error('Unexpected registration error:', error);
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      logEvent(analytics, 'logout');

      const prefs = await getPreference('userPreferences') || {};
      delete prefs.user;
      await setPreference('userPreferences', prefs);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Logout error:', error);
      } else {
        console.error('Unexpected logout error:', error);
      }
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};