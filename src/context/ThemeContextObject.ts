// rsschool-cv\src\context\ThemeContextObject.ts
import { createContext } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Чистый объект контекста
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);