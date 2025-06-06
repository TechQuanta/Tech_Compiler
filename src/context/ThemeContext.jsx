// src/context/ThemeContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') { // Check if window is defined (for SSR compatibility)
      const storedTheme = localStorage.getItem('theme');
      // Prefer stored theme, otherwise check system preference, fallback to 'light'
      return storedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    return 'light'; // Default for SSR or when window is not available
  });

  // Effect to apply/remove 'dark' class on the HTML element
  useEffect(() => {
    const root = window.document.documentElement; // Refers to <html> tag
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]); // Re-run effect whenever 'theme' state changes

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to consume the theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};