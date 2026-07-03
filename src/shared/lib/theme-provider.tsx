import { createContext, useContext, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
};

export function ThemeProvider({ children, defaultTheme = 'light' }: ThemeProviderProps): React.ReactElement {
  const value: ThemeContextValue = {
    theme: defaultTheme,
    setTheme: (_theme: Theme) => undefined,
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', defaultTheme === 'dark');
  }, [defaultTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
