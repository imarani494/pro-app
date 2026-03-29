import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {Colors} from '../../styles';
import shadows from '../../styles/shadows';

interface RadioButtonProps {
  selected: boolean;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  style?: any;
  activeColor?: string;
  inactiveColor?: string;
}

const CustomRadioButton = ({
  selected,
  onPress,
  size = 'medium',
  disabled = false,
  style,
  activeColor,
  inactiveColor,
}: RadioButtonProps) => {
  const {colors} = useTheme();

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          radioSize: 16,
          innerSize: 6,
          borderWidth: 1,
        };
      case 'large':
        return {
          radioSize: 24,
          innerSize: 10,
          borderWidth: 2,
        };
      default: // medium
        return {
          radioSize: 20,
          innerSize: 9,
          borderWidth: 1,
        };
    }
  };

  const {radioSize, innerSize, borderWidth} = getSizeConfig();

  const radioButtonStyle = [
    styles.radioButton,
    {
      width: radioSize,
      height: radioSize,
      borderRadius: radioSize / 2,
      borderWidth,
      borderColor: colors.neutral200,
      backgroundColor: selected ? activeColor || colors.white : colors.white,
      opacity: disabled ? 0.5 : 1,
    },
    style,
  ];

  const innerDotStyle = [
    styles.radioButtonInner,
    {
      width: innerSize,
      height: innerSize,
      borderRadius: innerSize / 2,
      backgroundColor: colors.neutral700,
    },
  ];

  const Component = onPress ? TouchableOpacity : View;

  return (
    <Component
      style={radioButtonStyle}
      onPress={!disabled ? onPress : undefined}
      disabled={disabled}
      activeOpacity={0.7}>
      {selected && <View style={innerDotStyle} />}
    </Component>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows['shadow-xs'],
  },
  radioButtonInner: {
    // Inner dot styles are dynamically applied
  },
});

export default CustomRadioButton;
