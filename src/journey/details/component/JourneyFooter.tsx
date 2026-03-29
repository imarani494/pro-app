import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {CustomText} from '../../../common/components';
import {useTheme} from '../../../context/ThemeContext';
import {Colors} from '../../../styles';
import {flex} from '../../../styles/typography';
import {
  ArrowDown,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react-native';
import {Calendar} from 'react-native-calendars';
import shadows from '../../../styles/shadows';

export type TabView = 'day' | 'summary' | 'detailed' | 'map';

interface JourneyFooterProps {
  isEditMode?: boolean;
  onDoneChanges?: () => void;
  onBookNow?: () => void;
  onFABPress?: () => void;
  journeyData?: any;
}

export function JourneyFooter({
  isEditMode = false,
  onDoneChanges,
  onBookNow,
  onFABPress,
  journeyData,
}: JourneyFooterProps) {
  const {colors} = useTheme();

  return (
    <View style={{backgroundColor: Colors.lightThemeColors.white}}>
      <TouchableOpacity style={styles.fabButton} onPress={onFABPress}>
        <CalendarDays size={20} color={colors.neutral50} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttonView,
          {
            backgroundColor: Colors.lightThemeColors.blue100,
            paddingVertical: 8,
          },
        ]}>
        <CustomText variant="text-sm-medium" color={'sky800'}>
          View Journey Options
        </CustomText>
        <ChevronUp size={20} color={colors.sky800} />
      </TouchableOpacity>
      <View style={styles.container}>
        <View>
          <CustomText variant="text-xs-medium" color={'neutral400'}>
            Total price
          </CustomText>
          <View style={styles.buttonView}>
            <CustomText variant="text-lg-bold" color={'neutral900'}>
              $ 2,59,000
            </CustomText>
            <TouchableOpacity>
              <Info size={20} color={colors.neutral900} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={isEditMode ? onDoneChanges : onBookNow}>
          {isEditMode ? <Check size={16} color={colors.neutral50} /> : null}

          <CustomText variant="text-sm-medium" color={'neutral50'}>
            {isEditMode ? 'Done Changes' : 'Book Now'}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightThemeColors.white,
    ...flex.rowJustifyBetweenItemCenter,
  },
  buttonContainer: {
    height: 52,
    width: 162,
    borderRadius: 8,
    backgroundColor: Colors.lightThemeColors.neutral900,
    ...flex.rowItemCenter,
    gap: 8,
  },
  buttonView: {
    ...flex.rowItemCenter,
    gap: 8,
  },
  fabButton: {
    backgroundColor: Colors.lightThemeColors.neutral900,
    height: 56,
    width: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: -70,
    right: 20,
    zIndex: 1,
    ...shadows['shadow-md'],
  },
});

export default JourneyFooter;
