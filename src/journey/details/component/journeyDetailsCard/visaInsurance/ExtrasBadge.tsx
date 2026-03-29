
import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from '../../../../../common/components/CustomText';
import {useTheme} from '../../../../../context/ThemeContext';
import {IdCard} from 'lucide-react-native';

export function ExtrasBadge() {
  const {colors} = useTheme();
  return (
    <View style={styles.container}>
      <IdCard size={16} color={colors.sky800} />
      <CustomText variant="text-sm-medium" color="sky800">
        VISA
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  icon: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  text: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '800',
  },
});
