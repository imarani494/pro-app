import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {ChevronDown} from 'lucide-react-native';
import {useTheme} from '../../context/ThemeContext';
import {Colors} from '../../styles';
import CustomText from './CustomText';
import {CitySuggestion} from '../../journey/create/redux/customTripSlice';

export interface SelectableInputProps {
  label: string;
  placeholder?: string;
  value?: string;
  displayValue?: string | undefined;
  hasValue?: boolean;
  onPress: () => void;
  required?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  disabled?: boolean;
  hasError?: boolean;
}

const SelectableInput: React.FC<SelectableInputProps> = ({
  label,
  placeholder,
  value,
  displayValue,
  hasValue,
  onPress,
  required = false,
  containerStyle,
  inputStyle,
  disabled = false,
  hasError = false,
}) => {
  const {colors} = useTheme();

  const labelText = required ? `${label} *` : label;
  const showValue = hasValue || value || displayValue;

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={[
          styles.selectButton,
          inputStyle,
          disabled && styles.disabledButton,
          hasError && styles.errorButton,
        ]}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.7}>
        <View style={styles.inputContent}>
          <View style={styles.inputTextContainer}>
            <CustomText
              variant={showValue ? 'text-xxs-normal' : 'text-sm-normal'}
              color="neutral500">
              {labelText}
            </CustomText>
            {showValue ? (
              <CustomText
                variant="text-sm-medium"
                color={disabled ? 'neutral400' : 'neutral900'}
                numberOfLines={1}>
                {displayValue || value || placeholder || ''}
              </CustomText>
            ) : null}
          </View>
          <ChevronDown
            size={20}
            color={disabled ? colors.neutral300 : colors.neutral400}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.lightThemeColors.white,
    height: 56,
    width: '100%',
  },
  disabledButton: {
    backgroundColor: Colors.lightThemeColors.neutral50,
    borderColor: Colors.lightThemeColors.neutral300,
  },
  errorButton: {
    borderColor: Colors.lightThemeColors.red500 || '#EF4444',
  },
  inputContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  inputTextContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
});

export default SelectableInput;
