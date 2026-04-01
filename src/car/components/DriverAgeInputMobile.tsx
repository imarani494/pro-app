import React from 'react';
import {View, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {Info, ChevronUp, ChevronDown} from 'lucide-react-native';

interface DriverAgeInputMobileProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
}

export default function DriverAgeInputMobile({
  label,
  value,
  onChange,
  min = 25,
  max = 99,
}: DriverAgeInputMobileProps) {
  const {colors} = useTheme();

  const handleIncrement = () => {
    const current = Number(value || min);
    const newValue = Math.min(max, current + 1);
    onChange(String(newValue));
  };

  const handleDecrement = () => {
    if (!value) return;
    const current = Number(value);
    const newValue = Math.max(min, current - 1);
    onChange(String(newValue));
  };

  const handleTextChange = (text: string) => {
    const numericValue = text.replace(/[^\d]/g, '');
    onChange(numericValue);
  };

  const handleBlur = () => {
    if (!value) return;
    const num = Number(value);
    const clamped = Math.min(max, Math.max(min, num));
    onChange(String(clamped));
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <CustomText variant="text-xs-semibold" color="neutral900">
          {label}
        </CustomText>
        <View style={styles.infoIcon}>
          <Info size={14} color={colors.neutral500} />
          {/* <View style={[styles.tooltip, {backgroundColor: colors.white}]}>
            <CustomText variant="text-xs-normal" color="neutral900">
              Driver must be {min} years old or more.
            </CustomText>
          </View> */}
        </View>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.white,
              borderColor: colors.neutral200,
              color: colors.neutral900,
            },
          ]}
          value={value}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          keyboardType="numeric"
          placeholder={`${min}+`}
          placeholderTextColor={colors.neutral400}
        />
        <View style={[styles.spinner, {borderColor: colors.neutral200, backgroundColor: colors.neutral50}]}>
          <TouchableOpacity
            style={styles.spinnerButton}
            onPress={handleIncrement}
            activeOpacity={0.7}>
            <ChevronUp size={10} color={colors.neutral600} />
          </TouchableOpacity>
          <View style={[styles.spinnerDivider, {borderColor: colors.neutral200}]} />
          <TouchableOpacity
            style={styles.spinnerButton}
            onPress={handleDecrement}
            activeOpacity={0.7}
            disabled={!value || Number(value) <= min}>
            <ChevronDown
              size={10}
              color={!value || Number(value) <= min ? colors.neutral300 : colors.neutral600}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoIcon: {
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    marginBottom: 8,
    padding: 8,
    borderRadius: 6,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 36,
    paddingHorizontal: 12,
    paddingRight: 50,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 14,
  },
  spinner: {
    position: 'absolute',
    right: 8,
    top: 4,
    bottom: 4,
    width: 36,
    borderWidth: 1,
    borderRadius: 6,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  spinnerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinnerDivider: {
    width: '100%',
    borderTopWidth: 1,
  },
});
