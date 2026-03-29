import React, {useMemo, useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {CalendarList, DateData} from 'react-native-calendars';
import {useTheme} from '../../context/ThemeContext';
import CustomBottomSheet from './CustomBottomSheet';
import moment from 'moment';

export interface DateCalendarBottomSheetProps {
  bottomSheetOptions: {
    bottomSheetRef: React.RefObject<any>;
    openBottomSheet: () => void;
    closeBottomSheet: () => void;
  };
  minDate?: string;
  maxDate?: string;
  title?: string;
  onClose: () => void;
  mode?: 'single' | 'range';
  onChange: (date: string, endDate?: string) => void;
  restrictedDates?: string[];
  initialDate?: string;
  initialEndDate?: string;
}

const DateCalendarBottomSheet = ({
  bottomSheetOptions,
  minDate,
  maxDate,
  title = 'Select Date',
  onClose,
  mode = 'single',
  onChange,
  restrictedDates = [],
  initialDate,
  initialEndDate,
}: DateCalendarBottomSheetProps) => {
  const {colors} = useTheme();
  const [selectedDate, setSelectedDate] = useState<string>(initialDate || '');
  const [selectedEndDate, setSelectedEndDate] = useState<string>(
    initialEndDate || '',
  );

  // Reset selected dates when initial dates change
  useEffect(() => {
    setSelectedDate(initialDate || '');
    setSelectedEndDate(initialEndDate || '');
  }, [initialDate, initialEndDate]);

  // Create marked dates object for calendar
  const markedDates = useMemo(() => {
    const marked: any = {};

    // Mark restricted dates
    restrictedDates.forEach(date => {
      marked[date] = {
        disabled: true,
        disableTouchEvent: true,
        color: colors.neutral300,
        textColor: colors.neutral400,
      };
    });

    if (mode === 'single' && selectedDate) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.neutral900,
        selectedTextColor: colors.white,
        customStyles: {
          container: {
            backgroundColor: colors.neutral900,
            borderRadius: 16,
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          },
          text: {
            color: colors.white,
            fontWeight: '500',
          },
        },
      };
    } else if (mode === 'range' && selectedDate) {
      marked[selectedDate] = {
        startingDay: true,
        selected: true,
        selectedColor: colors.neutral900,
        selectedTextColor: colors.white,
        customStyles: {
          container: {
            backgroundColor: colors.neutral900,
            borderRadius: 16,
            width: 32,
            height: 32,
            justifyContent: 'center',
            alignItems: 'center',
          },
          text: {
            color: colors.white,
            fontWeight: '500',
          },
        },
      };

      if (selectedEndDate) {
        marked[selectedEndDate] = {
          endingDay: true,
          selected: true,
          selectedColor: colors.neutral900,
          selectedTextColor: colors.white,
          customStyles: {
            container: {
              backgroundColor: colors.neutral900,
              borderRadius: 16,
              width: 32,
              height: 32,
              justifyContent: 'center',
              alignItems: 'center',
            },
            text: {
              color: colors.white,
              fontWeight: '500',
            },
          },
        };

        // Mark dates in between
        const start = moment(selectedDate);
        const end = moment(selectedEndDate);
        const current = start.clone().add(1, 'day');

        while (current.isBefore(end)) {
          const dateStr = current.format('YYYY-MM-DD');
          marked[dateStr] = {
            selected: true,
            selectedColor: colors.neutral300,
            selectedTextColor: colors.neutral900,
          };
          current.add(1, 'day');
        }
      }
    }

    return marked;
  }, [selectedDate, selectedEndDate, restrictedDates, colors, mode]);

  // Calculate dynamic scroll ranges to ensure current month is always visible
  const calculateScrollRanges = () => {
    const currentDate = moment();
    const targetDate = moment(selectedDate || initialDate || currentDate);

    // Calculate months between current and target date
    const monthsDiff = targetDate.diff(currentDate, 'months');

    let pastRange, futureRange;

    if (monthsDiff > 0) {
      // Selected date is in future
      pastRange = Math.max(2, monthsDiff + 2); // Ensure current month + buffer
      futureRange = 20; // Increased to show more future months
    } else if (monthsDiff < 0) {
      // Selected date is in past
      pastRange = Math.max(2, Math.abs(monthsDiff) + 2); // Ensure enough past months
      futureRange = 20; // Increased to show more future months
    } else {
      // Selected date is in current month
      pastRange = 2;
      futureRange = 20; // Increased to show more future months
    }

    return {pastRange, futureRange};
  };

  const {pastRange, futureRange} = calculateScrollRanges();

  const handleDayPress = (day: DateData) => {
    const dateStr = day.dateString;

    // Check if date is restricted
    if (restrictedDates.includes(dateStr)) {
      return;
    }

    if (mode === 'single') {
      // Direct selection for single mode
      onChange(dateStr);
      onClose();
    } else if (mode === 'range') {
      if (!selectedDate || (selectedDate && selectedEndDate)) {
        // Start new range
        setSelectedDate(dateStr);
        setSelectedEndDate('');
      } else if (selectedDate && !selectedEndDate) {
        // Complete the range
        const start = moment(selectedDate);
        const selected = moment(dateStr);

        if (selected.isSameOrAfter(start)) {
          setSelectedEndDate(dateStr);
          // Auto-confirm range selection
          onChange(selectedDate, dateStr);
          onClose();
        } else {
          // If selected date is before start date, make it the new start
          setSelectedDate(dateStr);
          setSelectedEndDate('');
        }
      }
    }
  };

  return (
    <CustomBottomSheet
      ref={bottomSheetOptions.bottomSheetRef}
      snapPoints={['80%']}
      title={title}
      onClose={onClose}
      enablePanDownToClose={true}>
      <View style={[styles.container, {backgroundColor: colors.white}]}>
        <CalendarList
          onDayPress={handleDayPress}
          markedDates={markedDates}
          markingType={mode === 'range' ? 'period' : 'dot'}
          minDate={minDate}
          maxDate={maxDate || moment().add(5, 'years').format('YYYY-MM-DD')}
          current={selectedDate || initialDate || moment().format('YYYY-MM-DD')}
          pastScrollRange={pastRange}
          futureScrollRange={futureRange}
          scrollEnabled={true}
          showScrollIndicator={false}
          horizontal={false}
          pagingEnabled={false}
          calendarHeight={320}
          removeClippedSubviews={true}
          theme={{
            backgroundColor: colors.white,
            calendarBackground: colors.white,
            textSectionTitleColor: colors.neutral600,
            textSectionTitleDisabledColor: colors.neutral400,
            selectedDayBackgroundColor: colors.neutral900,
            selectedDayTextColor: colors.white,
            todayTextColor: colors.blue500,
            dayTextColor: colors.neutral900,
            textDisabledColor: colors.neutral300,
            dotColor: colors.blue500,
            selectedDotColor: colors.white,
            arrowColor: colors.blue500,
            disabledArrowColor: colors.neutral300,
            monthTextColor: colors.neutral900,
            indicatorColor: colors.blue500,
            textDayFontFamily: 'System',
            textMonthFontFamily: 'System',
            textDayHeaderFontFamily: 'System',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 13,
            textDayFontWeight: '400',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '500',
          }}
          style={styles.calendar}
        />
      </View>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },
  calendar: {
    marginHorizontal: 10,
  },
});

export default DateCalendarBottomSheet;
