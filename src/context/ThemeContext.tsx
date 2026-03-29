import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import {useColorScheme} from 'react-native';
import {MD3LightTheme, MD3DarkTheme, configureFonts} from 'react-native-paper';
import type {MD3Theme} from 'react-native-paper';
import {lightThemeColors, darkThemeColors, Colors} from '../styles/colors';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  colors: Record<Colors, string>;
  paperTheme: MD3Theme;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');

  const getTheme = (): 'light' | 'dark' => {
    if (themeMode === 'auto') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return themeMode;
  };

  const theme = getTheme();
  const colors = theme === 'dark' ? darkThemeColors : lightThemeColors;

  // Create Paper theme based on current theme
  const paperTheme = useMemo(() => {
    const baseTheme = theme === 'dark' ? MD3DarkTheme : MD3LightTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        // Map your custom colors to Paper's theme structure
        primary: colors.blue500,
        secondary: colors.indigo500,
        tertiary: colors.cyan500,
        surface: colors.neutral50,
        surfaceVariant: colors.neutral100,
        background: colors.neutral50,
        error: colors.red500,
        errorContainer: colors.red50,
        onPrimary: colors.neutral900,
        onSecondary: colors.neutral900,
        onTertiary: colors.neutral900,
        onSurface: colors.neutral900,
        onSurfaceVariant: colors.neutral700,
        onBackground: colors.neutral900,
        onError: colors.neutral900,
        onErrorContainer: colors.red900,
        outline: colors.neutral400,
        outlineVariant: colors.neutral200,
        shadow: colors.black,
        scrim: colors.black,
        inverseSurface: colors.neutral900,
        inverseOnSurface: colors.neutral50,
        inversePrimary: colors.blue100,
        elevation: {
          level0: 'transparent',
          level1: colors.black + '0d',
          level2: colors.black + '0d',
          level3: colors.black + '0d',
          level4: colors.black + '0d',
          level5: colors.black + '0d',
        },
      },
      fonts: configureFonts({
        config: {
          fontFamily: 'Geist-Regular',
        },
      }),
    };
  }, [theme, colors]);

  const toggleTheme = () => {
    setThemeMode(prev => {
      if (prev === 'auto') return 'light';
      if (prev === 'light') return 'dark';
      return 'auto';
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        colors,
        paperTheme,
        setThemeMode,
        toggleTheme,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
