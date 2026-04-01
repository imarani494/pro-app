import React, {useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {ChevronDown, Clock} from 'lucide-react-native';
import CustomBottomSheet from '../../common/components/CustomBottomSheet';

interface SelectOption {
  value: string;
  label: string;
}

interface FigmaSelectMobileProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  type?: 'default' | 'time'; // To show different icons
}

export default function FigmaSelectMobile({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  disabled = false,
  type = 'default',
}: FigmaSelectMobileProps) {
  const {colors} = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const bottomSheetRef = useRef<any>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setShowPicker(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.inputField,
          {
            backgroundColor: disabled ? colors.neutral100 : colors.white,
            borderColor: colors.neutral200,
          },
          disabled && styles.disabled,
        ]}
        onPress={() => {
          if (!disabled) {
            setShowPicker(true);
            if (bottomSheetRef.current) {
              bottomSheetRef.current.present();
            }
          }
        }}
        disabled={disabled}
        activeOpacity={0.8}>
        <View style={styles.fieldContainer}>
          <View style={styles.titleContainer}>
            <CustomText variant="text-xs-normal" color="neutral500" style={styles.labelText}>
              {label}
            </CustomText>
            {label && (
              <CustomText variant="text-xs-normal" color="neutral500" style={styles.asterisk}>
                *
              </CustomText>
            )}
          </View>
          <View style={styles.valueContainer}>
            <CustomText
              variant="text-sm-medium"
              color={value ? (disabled ? 'neutral400' : 'neutral900') : 'neutral400'}
              style={styles.valueText}>
              {displayValue}
            </CustomText>
          </View>
        </View>
        <View style={styles.iconContainer}>
          {type === 'time' ? (
            <Clock size={16} color={disabled ? colors.neutral300 : colors.neutral500} />
          ) : (
            <ChevronDown size={16} color={disabled ? colors.neutral300 : colors.neutral500} />
          )}
        </View>
      </TouchableOpacity>

      {/* Picker Bottom Sheet */}
      <CustomBottomSheet
        ref={bottomSheetRef}
        snapPoints={['50%']}
        title={label || 'Select'}
        onClose={() => setShowPicker(false)}
        enablePanDownToClose={true}>
        <View style={styles.optionsContainer}>
          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    backgroundColor: value === item.value ? colors.blue50 : colors.white,
                    borderColor: value === item.value ? colors.blue600 : colors.neutral200,
                  },
                ]}
                onPress={() => handleSelect(item.value)}>
                <CustomText
                  variant="text-base-medium"
                  color={value === item.value ? 'blue600' : 'neutral900'}>
                  {item.label}
                </CustomText>
              </TouchableOpacity>
            )}
          />
        </View>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // No margin bottom as it's handled by the parent gap
  },
  inputField: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    gap: 10,
  },
  fieldContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
    minHeight: 1,
    minWidth: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  labelText: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'Geist-Regular', // You may need to adjust font family
  },
  asterisk: {
    fontSize: 12,
    lineHeight: 16,
  },
  valueContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: '100%',
    overflow: 'hidden',
  },
  valueText: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Geist-Medium', // You may need to adjust font family
    overflow: 'hidden',
  },
  iconContainer: {
    width: 16,
    height: 16,
    overflow: 'hidden',
    flexShrink: 0,
  },
  disabled: {
    opacity: 0.6,
  },
  optionsContainer: {
    padding: 16,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
});