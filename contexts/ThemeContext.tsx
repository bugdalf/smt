import React, { createContext, ReactNode, useContext } from 'react';
import { useColorScheme } from 'react-native';

export interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  primary: string;
  primaryText: string;
  // colores de acento
  // **Rojos**
  red: string;
  pink: string;
  rose: string;
  coral: string;
  // **Púrpuras**
  purple: string;
  violet: string;
  fuchsia: string;
  lavender: string;
  // **Azules**
  blue: string;
  indigo: string;
  cyan: string;
  sky: string;
  // **Verdes**
  green: string;
  emerald: string;
  teal: string;
  mint: string;
  lime: string;
  // **Amarillos/Naranjas**
  yellow: string;
  amber: string;
  orange: string;
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
  // Colores de acento para tema light
  // **Rojos**
  red: '#EF4444',
  pink: '#EC4899',
  rose: '#F43F5E',
  coral: '#FF6B6B',
  // **Púrpuras**
  purple: '#8B5CF6',
  violet: '#7C3AED',
  fuchsia: '#D946EF',
  lavender: '#9D7AEA',
  // **Azules**
  blue: '#3B82F6',
  indigo: '#6366F1',
  cyan: '#06B6D4',
  sky: '#0EA5E9',
  // **Verdes**
  green: '#22C55E',
  emerald: '#10B981',
  teal: '#14B8A6',
  mint: '#00D4AA',
  lime: '#84CC16',
  // **Amarillos/Naranjas**
  yellow: '#EAB308',
  amber: '#F59E0B',
  orange: '#F97316',
};

const darkTheme: ThemeColors = {
  background: '#000000',
  surface: '#1c1c1e',
  text: '#ffffff',
  textSecondary: '#999999',
  border: '#38383a',
  primary: '#0A84FF',
  primaryText: '#ffffff',
  // Colores de acento para tema dark (versiones más suaves)
  // **Rojos**
  red: '#F87171',
  pink: '#F472B6',
  rose: '#FB7185',
  coral: '#FF8A8A',
  // **Púrpuras**
  purple: '#A78BFA',
  violet: '#8B5CF6',
  fuchsia: '#E879F9',
  lavender: '#B794F6',
  // **Azules**
  blue: '#60A5FA',
  indigo: '#818CF8',
  cyan: '#22D3EE',
  sky: '#38BDF8',
  // **Verdes**
  green: '#4ADE80',
  emerald: '#34D399',
  teal: '#2DD4BF',
  mint: '#5EEAD4',
  lime: '#A3E635',
  // **Amarillos/Naranjas**
  yellow: '#FDE047',
  amber: '#FBBF24',
  orange: '#FB923C',
};

// Type para las claves de colores válidas
export type ColorKey = keyof Pick<ThemeColors, 
  'red' | 'pink' | 'rose' | 'coral' | 'purple' | 'violet' | 'fuchsia' | 'lavender' |
  'blue' | 'indigo' | 'cyan' | 'sky' | 'green' | 'emerald' | 'teal' | 'mint' | 'lime' |
  'yellow' | 'amber' | 'orange'
>;

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