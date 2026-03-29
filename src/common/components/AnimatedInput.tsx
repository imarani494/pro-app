import React, {forwardRef, useCallback, useEffect, useRef} from 'react';
import {
  TextInputProps as NativeTextInputProps,
  TextInput as NativeTextInput,
  Animated,
  StyleSheet,
  KeyboardTypeOptions,
  View,
  TextInput,
} from 'react-native';
import CustomText from './CustomText';
import {useTheme} from '../../context/ThemeContext';
export interface AnimatedTextInputProps extends NativeTextInputProps {
  label: string;
  hasError?: boolean;
  isPassword?: boolean;
  setShowValue?: React.Dispatch<React.SetStateAction<boolean>>;
  backgoundColor?: any;
  errorText?: string;
  editFillText?: string;
  openBottomSheet?: () => void;
  setFocused: React.Dispatch<React.SetStateAction<boolean>>;
  isFocused: boolean;
  onChangeText?: ((newText: string) => void) | undefined;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  textStyle?: any;
}

const AnimatedInput = forwardRef<NativeTextInput, AnimatedTextInputProps>(
  (
    {
      label,
      value,
      placeholder,
      setFocused,
      isFocused,
      onChangeText,
      keyboardType,
      maxLength,
      errorText,
      textStyle,
      ...inputProps
    }: AnimatedTextInputProps,
    ref,
  ) => {
    const {colors} = useTheme();
    const animatedIsFocused = useRef(
      new Animated.Value(value || placeholder ? 1 : 0),
    ).current;

    const handleFocus = useCallback(() => {
      Animated.timing(animatedIsFocused, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [animatedIsFocused]);

    const handleBlur = useCallback(() => {
      Animated.timing(animatedIsFocused, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [animatedIsFocused, value]);

    useEffect(() => {
      if (isFocused) {
        handleFocus();
      } else {
        handleBlur();
      }
    }, [handleBlur, handleFocus, isFocused]);

    return (
      <View style={{flex: 1}}>
        {label !== '' && (
          <Animated.Text
            style={[
              isFocused || value ? styles.focusedLabel : styles.floatingLabel,
              {
                paddingHorizontal: 16,
                color: colors.neutral500,
                transform: [
                  {
                    translateY: animatedIsFocused.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 2],
                    }),
                  },
                ],
              },
            ]}>
            {label}
          </Animated.Text>
        )}
        <TextInput
          style={[
            {
              paddingHorizontal: 16,
              paddingTop: 12,
              paddingBottom: 12,
              fontFamily: 'Geist-SemiBold',
              fontSize: 16,
              color: colors.neutral900,
            },
            textStyle,
          ]}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          clearButtonMode="never"
          autoCapitalize={undefined}
          onChangeText={onChangeText}
          onFocus={() => {
            setFocused(true);
          }}
          onBlur={() => {
            setFocused(false);
          }}
          {...inputProps}
          ref={ref}
          keyboardType={keyboardType}
          placeholderTextColor={colors.neutral900}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -20,
          }}>
          <CustomText
            variant="text-xs-normal"
            color="red600"
            style={{
              marginTop: isFocused || errorText === 'Invalid Email' ? 0 : 0,
            }}>
            {(isFocused || errorText) && errorText}
          </CustomText>
        </View>
      </View>
    );
  },
);

export default AnimatedInput;

const styles = StyleSheet.create({
  edit: {
    height: 16,
    width: 16,
  },
  floatingLabel: {
    position: 'absolute',
    top: 8,
    fontSize: 14,
    fontFamily: 'Geist-Regular',
  },
  focusedLabel: {
    top: 6,
    fontSize: 12,
    fontFamily: 'Geist-Regular',
  },
});
