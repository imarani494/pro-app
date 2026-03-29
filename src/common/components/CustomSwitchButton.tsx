import React, {useEffect} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Colors} from '../../styles';

interface CustomSwitchButtonProps {
  value: boolean;
  onToggle: (value: boolean) => void;
  disabled?: boolean;
}

const SWITCH_WIDTH = 52;
const SWITCH_HEIGHT = 28;
const PADDING = 3;
const KNOB_SIZE = 22;
const TRANSLATE_X = SWITCH_WIDTH - KNOB_SIZE - PADDING * 2;

const CustomSwitchButton = ({
  value,
  onToggle,
  disabled = false,
}: CustomSwitchButtonProps) => {
  const translateX = useSharedValue(value ? TRANSLATE_X : 0);

  useEffect(() => {
    translateX.value = withTiming(value ? TRANSLATE_X : 0, {duration: 200});
  }, [value]);

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={() => onToggle(!value)}
      style={[
        styles.container,
        {
          backgroundColor: value
            ? Colors.lightThemeColors.neutral900
            : Colors.lightThemeColors.neutral300,
          opacity: disabled ? 0.5 : 1,
        },
      ]}>
      <Animated.View style={[styles.knob, knobStyle]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    padding: PADDING,
    justifyContent: 'center',
  },
  knob: {
    width: KNOB_SIZE,
    height: KNOB_SIZE,
    borderRadius: KNOB_SIZE / 2,
    backgroundColor: Colors.lightThemeColors.white,
  },
});

export default CustomSwitchButton;
