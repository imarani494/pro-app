import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';

interface VehicleTypeSelectorMobileProps {
  selectedType: 'car' | 'motorhome';
  onTypeChange: (type: 'car' | 'motorhome') => void;
}

export default function VehicleTypeSelectorMobile({
  selectedType,
  onTypeChange,
}: VehicleTypeSelectorMobileProps) {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: selectedType === 'car' ? colors.neutral900 : colors.neutral100,
          },
        ]}
        onPress={() => onTypeChange('car')}
        activeOpacity={0.8}>
        <CustomText
          variant="text-sm-medium"
          color={selectedType === 'car' ? 'white' : 'neutral700'}>
          Car
        </CustomText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: selectedType === 'motorhome' ? colors.neutral900 : colors.neutral100,
          },
        ]}
        onPress={() => onTypeChange('motorhome')}
        activeOpacity={0.8}>
        <CustomText
          variant="text-sm-medium"
          color={selectedType === 'motorhome' ? 'white' : 'neutral700'}>
          Motor Home
        </CustomText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
