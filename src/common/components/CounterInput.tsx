import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import CustomText from './CustomText';
import {Colors} from '../../styles';
import {Minus, Plus} from 'lucide-react-native';

export interface CounterInputProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  minValue?: number;
  maxValue?: number;
  disabled?: boolean;
  style?: any;
}

const CounterInput = ({
  value,
  onIncrement,
  onDecrement,
  minValue = 0,
  maxValue = 99,
  disabled = false,
  style,
}: CounterInputProps) => {
  const {colors} = useTheme();

  const isMinDisabled = disabled || value <= minValue;
  const isMaxDisabled = disabled || value >= maxValue;

  return (
    <View style={[styles.counter, style]}>
      <TouchableOpacity
        style={[
          styles.counterButton,
          {
            // borderColor: colors.neutral200,
            // backgroundColor: isMinDisabled ? colors.neutral100 : colors.white,
          },
        ]}
        onPress={onDecrement}
        disabled={isMinDisabled}>
        <Minus
          size={16}
          style={styles.minus}
          color={isMinDisabled ? colors.neutral200 : colors.neutral500}
        />
      </TouchableOpacity>

      <View style={[styles.counterValue, {borderColor: colors.neutral200}]}>
        <CustomText variant="text-sm-semibold" color="neutral900">
          {value}
        </CustomText>
      </View>

      <TouchableOpacity
        style={[
          styles.counterButton,
          {
            // borderColor: colors.neutral200,
            // backgroundColor: isMaxDisabled ? colors.neutral100 : colors.white,
          },
        ]}
        onPress={onIncrement}
        disabled={isMaxDisabled}>
        <Plus
          size={16}
          color={isMaxDisabled ? colors.neutral200 : colors.neutral500}
          style={styles.plus}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.lightThemeColors.neutral200,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  counterButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterValue: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  minus: {
    marginRight: 12,
  },
  plus: {
    marginLeft: 12,
  },
});

export default CounterInput;
