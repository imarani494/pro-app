import {ViewStyle, Platform} from 'react-native';

// Shadow styles configuration
// React Native doesn't support multiple shadows like CSS,
// so we use the most prominent shadow values and approximate the effect

export type ShadowVariant =
  | 'shadow-2xs'
  | 'shadow-xs'
  | 'shadow-sm'
  | 'shadow-md'
  | 'shadow-lg'
  | 'shadow-xl'
  | 'shadow-2xl'
  | 'shadow-default';

export const shadows: Record<ShadowVariant, ViewStyle> = {
  'shadow-2xs': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.04,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }) as ViewStyle,

  'shadow-xs': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
  }) as ViewStyle,

  'shadow-sm': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.06,
      shadowRadius: 3,
    },
    android: {
      elevation: 2,
    },
  }) as ViewStyle,

  'shadow-md': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    android: {
      elevation: 4,
    },
  }) as ViewStyle,

  'shadow-lg': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.10,
      shadowRadius: 15,
    },
    android: {
      elevation: 8,
    },
  }) as ViewStyle,

  'shadow-xl': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 12},
      shadowOpacity: 0.12,
      shadowRadius: 24,
    },
    android: {
      elevation: 12,
    },
  }) as ViewStyle,

  'shadow-2xl': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 20},
      shadowOpacity: 0.14,
      shadowRadius: 40,
    },
    android: {
      elevation: 16,
    },
  }) as ViewStyle,

  'shadow-default': Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
  }) as ViewStyle,
};

export default shadows;

