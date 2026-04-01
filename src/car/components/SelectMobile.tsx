import React, {useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {ChevronDown} from 'lucide-react-native';
import CustomBottomSheet from '../../common/components/CustomBottomSheet';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectMobileProps {
  label?: string;
  placeholder?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SelectMobile({
  label,
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  disabled = false,
}: SelectMobileProps) {
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
      {label && (
        <CustomText variant="text-xs-semibold" color="neutral900" style={styles.label}>
          {label}
        </CustomText>
      )}
      <TouchableOpacity
        style={[
          styles.selectButton,
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
        <CustomText
          variant="text-sm-normal"
          color={value ? (disabled ? 'neutral400' : 'neutral900') : 'neutral400'}>
          {displayValue}
        </CustomText>
        <ChevronDown size={16} color={disabled ? colors.neutral300 : colors.neutral600} />
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
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  selectButton: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
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
