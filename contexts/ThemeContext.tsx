import React, { createContext, useContext, ReactNode } from 'react';
import { useColorScheme } from 'react-native';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryText: string;
}

export interface Theme {
  colors: ThemeColors;
  isDark: boolean;
}

const lightTheme: ThemeColors = {
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#000000',
  textSecondary: '#666666',
  border: '#e9ecef',
  primary: '#007AFF',
  primaryText: '#ffffff',
};

const darkTheme: ThemeColors = {
  background: '#000000',
  surface: '#1c1c1e',
  text: '#ffffff',
  textSecondary: '#999999',
  border: '#38383a',
  primary: '#0A84FF',
  primaryText: '#ffffff',
};

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const theme: Theme = {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}