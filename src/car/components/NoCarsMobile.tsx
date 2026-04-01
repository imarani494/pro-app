import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {Car} from 'lucide-react-native';

export default function NoCarsMobile() {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      {/* Icon Circle */}
      <View style={[styles.iconCircle, {backgroundColor: colors.neutral50}]}>
        <Car size={40} color={colors.neutral400} />
      </View>

      {/* Main Title */}
      <CustomText variant="text-xl-semibold" color="neutral900" style={styles.title}>
        No Rental Cars Available
      </CustomText>

      {/* Subtitle */}
      <CustomText variant="text-base-normal" color="neutral600" style={styles.subtitle}>
        Try adjusting your dates or filters to see available rentals.
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral200,
  },
  title: {
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
  },
});
