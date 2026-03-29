import React from 'react';
import {Text as RNText, TextProps as RNTextProps} from 'react-native';
import fontConfig from '../../styles/fontConfig';
import {useTheme} from '../../context/ThemeContext';
import {Colors} from '../../styles/colors';

type FontVariant = keyof typeof fontConfig;
type ColorKey = Colors;

interface TextProps extends RNTextProps {
  variant?: FontVariant | string;
  color?: ColorKey;
}

const CustomText: React.FC<TextProps> = ({
  variant,
  color,
  style,
  children,
  ...props
}) => {
  const {colors} = useTheme();

  const variantStyle = variant && fontConfig[variant as FontVariant];
  const colorStyle = color ? {color: colors[color]} : null;

  const textStyle = [variantStyle, colorStyle, style].filter(Boolean);

  return (
    <RNText style={textStyle} {...props}>
      {children}
    </RNText>
  );
};

export default CustomText;
