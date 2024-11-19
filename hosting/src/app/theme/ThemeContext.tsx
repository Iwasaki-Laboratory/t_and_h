'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme, blackTheme } from './theme';
import { setCookie } from '../lib/cookieUtils';

interface ThemeContextProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProviderContext = ({ children, initialTheme }: { children: ReactNode, initialTheme: boolean }) => {
  const [isDarkMode, setIsDarkMode] = useState(initialTheme);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      setCookie('isDarkMode', newMode ? 'true' : 'false', 365 * 24 * 60 * 60);
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={isDarkMode ? blackTheme : lightTheme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProviderContext");
  }
  return context;
};
