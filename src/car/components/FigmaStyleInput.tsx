import React, {useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {CustomText} from '../../common/components';
import {useTheme} from '../../context/ThemeContext';
import {ChevronDown, Clock} from 'lucide-react-native';
import CustomBottomSheet from '../../common/components/CustomBottomSheet';

interface FigmaStyleInputProps {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onPress?: () => void;
  showIcon?: 'dropdown' | 'clock' | 'none';
  disabled?: boolean;
  options?: Array<{value: string; label: string}>;
  onChange?: (value: string) => void;
}

const FigmaStyleInput: React.FC<FigmaStyleInputProps> = ({
  label,
  value,
  placeholder,
  required = false,
  onPress,
  showIcon = 'dropdown',
  disabled = false,
  options,
  onChange,
}) => {
  const {colors} = useTheme();
  const [showPicker, setShowPicker] = useState(false);
  const bottomSheetRef = useRef<any>(null);

  const handlePress = () => {
    if (disabled) return;
    
    if (options && onChange) {
      setShowPicker(true);
      if (bottomSheetRef.current) {
        bottomSheetRef.current.present();
      }
    } else if (onPress) {
      onPress();
    }
  };

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
    setShowPicker(false);
    if (bottomSheetRef.current) {
      bottomSheetRef.current.dismiss();
    }
  };

  const selectedOption = options?.find(opt => opt.value === value);
  const displayValue = selectedOption?.label || value || placeholder;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            borderColor: colors.neutral200,
            backgroundColor: colors.white,
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          <View style={styles.labelContainer}>
            <CustomText 
              variant="text-xs-normal" 
              color="neutral500"
              style={styles.label}
            >
              {label}
            </CustomText>
            {required && (
              <CustomText 
                variant="text-xs-normal" 
                color="neutral500"
                style={styles.asterisk}
              >
                *
              </CustomText>
            )}
          </View>
          <CustomText 
            variant="text-sm-medium" 
            color={value ? "neutral900" : "neutral500"}
            style={styles.value}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {displayValue}
          </CustomText>
        </View>
        {showIcon === 'dropdown' && (
          <ChevronDown size={16} color={colors.neutral500} />
        )}
        {showIcon === 'clock' && (
          <Clock size={16} color={colors.neutral500} />
        )}
      </TouchableOpacity>

      {/* Options Bottom Sheet */}
      {options && (
        <CustomBottomSheet
          ref={bottomSheetRef}
          snapPoints={['50%']}
          title={label || 'Select'}
          onClose={() => setShowPicker(false)}
          enablePanDownToClose={true}
        >
          <View style={styles.optionsContainer}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.option,
                    {
                      backgroundColor: value === item.value ? colors.blue50 : colors.white,
                      borderColor: colors.neutral200,
                    }
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <CustomText 
                    variant="text-sm-normal" 
                    color={value === item.value ? "blue600" : "neutral900"}
                  >
                    {item.label}
                  </CustomText>
                </TouchableOpacity>
              )}
            />
          </View>
        </CustomBottomSheet>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  content: {
    flex: 1,
    gap: 4,
    justifyContent: 'center',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  label: {
    fontSize: 11,
    lineHeight: 16,
  },
  asterisk: {
    fontSize: 12,
    lineHeight: 16,
  },
  value: {
    fontSize: 14,
    lineHeight: 20,
    minWidth: '100%',
  },
  optionsContainer: {
    padding: 16,
    gap: 8,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export default FigmaStyleInput;