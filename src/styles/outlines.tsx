import {StyleSheet, ViewStyle} from 'react-native';
import * as Colors from './colors';

type BorderRadius = 'small' | 'base' | 'large' | 'max';
export const borderRadius: Record<BorderRadius, number> = {
  small: 5,
  base: 10,
  large: 20,
  max: 9999,
};

type BorderWidth = 'hairline' | 'thin' | 'base' | 'thick';
export const borderWidth: Record<BorderWidth, number> = {
  hairline: StyleSheet.hairlineWidth,
  thin: 1,
  base: 2,
  thick: 3,
};

type Divider = 'base' | 'medium';
export const divider: Record<Divider, ViewStyle> = {
  base: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral200,
    marginTop: 32,
    marginBottom: 28,
  },
  medium: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral200,
    marginVertical: 16,
  },
};
