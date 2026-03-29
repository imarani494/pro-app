import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ArrowUpDown, SlidersHorizontal, ChevronDown} from 'lucide-react-native';
import {CustomText} from '../../../common/components';
import {Colors} from '../../../styles';

export function HotelFiltersRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}>
      <FilterPill icon={<ArrowUpDown size={16} />} label="Sort" />
      <FilterPill icon={<SlidersHorizontal size={16} />} label="Filter" />
      <FilterPill label="Price" rightIcon />
      <FilterPill label="Star Rating" rightIcon />
      <FilterPill label="Search for hotels" rightIcon />
    </ScrollView>
  );
}

function FilterPill({
  label,
  icon,
  rightIcon,
}: {
  label: string;
  icon?: React.ReactNode;
  rightIcon?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.pill}>
      {icon}
      <CustomText variant="text-sm-medium" color="neutral900">
        {label}
      </CustomText>
      {rightIcon && (
        <ChevronDown size={16} color={Colors.lightThemeColors.neutral700} />
      )}
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    columnGap: 12,
    alignItems: 'center',
  },

  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral300,
    backgroundColor: Colors.lightThemeColors.white,
  },
});
