import {TextStyle, ViewStyle} from 'react-native';
import * as Outlines from './outlines';
import * as Sizing from './sizing';
import * as Typography from './typography';
import {Colors} from './colors';

type Bar = 'primary' | 'secondary';

// Function to get bar styles with theme colors
export const getBarStyles = (
  colors: Record<Colors, string>,
): Record<Bar, ViewStyle> => ({
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Sizing.layout.x10,
    borderRadius: Outlines.borderRadius.small,
    backgroundColor: colors.neutral900,
  },
  secondary: {
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: Sizing.layout.x1,
    borderRadius: Outlines.borderRadius.small,
    backgroundColor: colors.gray400,
  },
});

type BarText = 'primary' | 'secondary';

// Function to get bar text styles with theme colors
export const getBarTextStyles = (
  colors: Record<Colors, string>,
): Record<BarText, TextStyle> => ({
  primary: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 30,
    color: colors.white,
  },
  secondary: {
    fontFamily: 'Geist-Regular',
    fontSize: 16,
    color: colors.neutral900,
  },
});

// For backward compatibility, export as functions that need to be called with colors
export const bar = getBarStyles;
export const barText = getBarTextStyles;
