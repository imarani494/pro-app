import React, {useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Check, X} from 'lucide-react-native';
import {Colors} from '../../styles';
import CustomText from './CustomText';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

export const Toast = ({
  visible,
  message,
  type,
  position,
  onDismiss,
  duration = 3000,
}: {
  visible: boolean;
  message: string;
  type: 'success' | 'error';
  position: 'top' | 'bottom';
  onDismiss?: () => void;
  duration?: number;
}) => {
  if (!visible) return null;
  const translateY = useSharedValue(position === 'top' ? -100 : 100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
      opacity.value = withTiming(1, {duration: 300});

      // Auto-hide after specified duration
      const timer = setTimeout(() => {
        onDismiss?.();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      translateY.value = withTiming(position === 'top' ? -100 : 100, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      opacity.value = withTiming(0, {duration: 300});
    }
  }, [visible, duration]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.shadowWrap,
        position === 'top' ? styles.top : styles.bottom,
        animatedStyle,
      ]}>
      <View
        style={[
          styles.shadowWrap,
          position === 'top' ? styles.top : styles.bottom,
        ]}>
        <View
          style={[
            styles.toast,
            {backgroundColor: Colors.lightThemeColors.white},
          ]}>
          <View
            style={{
              backgroundColor:
                type === 'success'
                  ? Colors.lightThemeColors.green800
                  : Colors.lightThemeColors.red500,
              borderRadius: 12,
              padding: 2,
            }}>
            {type === 'success' ? (
              <Check size={16} color="white" />
            ) : (
              <X size={16} color="white" />
            )}
          </View>

          <CustomText color="neutral900" variant="text-sm-medium">
            {message}
          </CustomText>

          <TouchableOpacity onPress={onDismiss}>
            <X size={18} color={Colors.lightThemeColors.neutral500} />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  top: {
    top: 40,
  },

  bottom: {
    bottom: 40,
  },
  shadowWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    minWidth: '80%',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: Colors.lightThemeColors.black,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    elevation: 6,
  },
});
