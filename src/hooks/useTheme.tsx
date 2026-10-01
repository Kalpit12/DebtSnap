import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { darkTheme, lightTheme, Theme, ThemeMode } from '@/constants/theme';
import { readStorage, writeStorage } from '@/lib/storage';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    readStorage()
      .then((storage) => {
        if (!cancelled) {
          setThemeModeState(storage.preferences.themeMode);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const resolvedScheme = useMemo(() => {
    const mode = isReady ? themeMode : 'system';
    if (mode === 'system') {
      return systemScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  }, [isReady, themeMode, systemScheme]);

  const theme = resolvedScheme === 'dark' ? darkTheme : lightTheme;

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    readStorage().then((storage) => {
      writeStorage({
        ...storage,
        preferences: {
          ...storage.preferences,
          themeMode: mode,
        },
      });
    });
  }, []);

  const value = useMemo(
    () => ({
      theme,
      themeMode: isReady ? themeMode : 'system',
      setThemeMode,
    }),
    [theme, themeMode, isReady, setThemeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
