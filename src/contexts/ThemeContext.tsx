import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize theme with a function to avoid hydration mismatch
  const [theme, setThemeState] = useState<Theme>(() => {
    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme as Theme;
    }

    // If no saved theme, check system preference
    // If user explicitly prefers light, give them light.
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    // Otherwise default to dark (this covers no preference or dark preference)
    return 'dark';
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove both classes first to ensure clean state
    root.classList.remove('light', 'dark');

    // Add the current theme class
    root.classList.add(theme);

    // Update data attribute for components that might use it
    root.setAttribute('data-theme', theme);

    // Save to localStorage
    localStorage.setItem('theme', theme);

    // Note: Body background and text colors are handled by index.css 
    // using the 'dark' class on the html element.
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (!localStorage.getItem('theme')) {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };

    // Add event listener with newer API if available
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};