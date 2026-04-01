import React, {useState, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {Calendar} from 'lucide-react-native';
import DateCalendarBottomSheet from '../../common/components/DateCalendarBottomSheet';
import CustomBottomSheet from '../../common/components/CustomBottomSheet';
import DateUtil from '../../utils/DateUtil';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

interface DateTimePickerMobileProps {
  label: string;
  date: string;
  onDateChange: (date: string) => void;
  timeOptions?: string[];
  onTimeChange?: (time: string) => void;
  selectedTime?: string;
}

export default function DateTimePickerMobile({
  label,
  date,
  onDateChange,
  timeOptions = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
  onTimeChange,
  selectedTime,
}: DateTimePickerMobileProps) {
  const {colors} = useTheme();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const dateBottomSheetRef = useRef<BottomSheetModal>(null);
  const timeBottomSheetRef = useRef<BottomSheetModal>(null);
  
  // Create bottomSheetOptions for DateCalendarBottomSheet
  const dateBottomSheetOptions = React.useMemo(() => ({
    bottomSheetRef: dateBottomSheetRef,
    openBottomSheet: () => {
      setShowDatePicker(true);
      dateBottomSheetRef.current?.present();
    },
    closeBottomSheet: () => {
      setShowDatePicker(false);
      dateBottomSheetRef.current?.dismiss();
    },
  }), []);

  const formatTimeDisplay = (time: string): string => {
    if (!time) return 'Select time';
    // Handle both "HH:mm" and "HH:mm:ss" formats
    const timePart = time.split(' ')[0]; // Take only the time part if there's a space
    const [hour, minute] = timePart.split(':');
    const h = parseInt(hour, 10);
    if (isNaN(h)) return 'Select time';
    const period = h >= 12 ? 'PM' : 'AM';
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const m = minute || '00';
    return `${displayHour}:${m} ${period}`;
  };

  const formatDateDisplay = (dateStr: string): string => {
    if (!dateStr) return 'Select date';
    // Use DateUtil if available, otherwise format manually
    try {
      // If it's already in "dd MMM yyyy" format, return as is
      if (/^\d{1,2}\s\w{3}\s\d{4}$/.test(dateStr)) {
        return dateStr;
      }
      // If it's in YYYY-MM-DD format, convert to dd MMM yyyy
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return DateUtil.formatDate(dateStr, 'dd MMM yyyy');
      }
      // Try using DateUtil
      const formatted = DateUtil.formatDate(dateStr, 'dd MMM yyyy');
      if (formatted) return formatted;
      // Fallback to manual formatting
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const month = d.toLocaleDateString('en-US', {month: 'short'});
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const handleDateSelect = (selectedDate: string, endDate?: string) => {
    // DateCalendarBottomSheet returns YYYY-MM-DD format, convert to dd MMM yyyy
    if (selectedDate) {
      try {
        const formattedDate = DateUtil.formatDate(selectedDate, 'dd MMM yyyy');
        if (formattedDate) {
          onDateChange(formattedDate);
        } else {
          // Fallback conversion
          const d = new Date(selectedDate);
          if (!isNaN(d.getTime())) {
            const day = String(d.getDate()).padStart(2, '0');
            const month = d.toLocaleDateString('en-US', {month: 'short'});
            const year = d.getFullYear();
            onDateChange(`${day} ${month} ${year}`);
          } else {
            onDateChange(selectedDate);
          }
        }
      } catch {
        onDateChange(selectedDate);
      }
    }
    setShowDatePicker(false);
    dateBottomSheetRef.current?.dismiss();
  };

  const handleTimeSelect = (time: string) => {
    if (onTimeChange) {
      onTimeChange(time);
    }
    setShowTimePicker(false);
    timeBottomSheetRef.current?.dismiss();
  };

  return (
    <View style={styles.container}>
      <CustomText variant="text-xs-semibold" color="neutral900" style={styles.label}>
        {label}
      </CustomText>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.white,
              borderColor: colors.neutral200,
            },
          ]}
        onPress={() => {
          dateBottomSheetOptions.openBottomSheet();
        }}>
          <Calendar size={16} color={colors.neutral600} />
          <CustomText variant="text-sm-normal" color={date ? 'neutral900' : 'neutral400'}>
            {formatDateDisplay(date || '')}
          </CustomText>
        </TouchableOpacity>

        {onTimeChange && (
          <TouchableOpacity
            style={[
              styles.timeButton,
              {
                backgroundColor: colors.white,
                borderColor: colors.neutral200,
              },
            ]}
        onPress={() => {
          setShowTimePicker(true);
          timeBottomSheetRef.current?.present();
        }}>
            <CustomText variant="text-sm-normal" color={selectedTime ? 'neutral900' : 'neutral400'}>
              {formatTimeDisplay(selectedTime || '')}
            </CustomText>
          </TouchableOpacity>
        )}
      </View>

      {/* Date Picker Bottom Sheet */}
      <DateCalendarBottomSheet
        bottomSheetOptions={dateBottomSheetOptions}
        title="Select Date"
        onClose={() => {
          setShowDatePicker(false);
          dateBottomSheetRef.current?.dismiss();
        }}
        onChange={handleDateSelect}
        initialDate={
          date
            ? date.includes('-')
              ? date
              : (() => {
                  // Convert dd MMM yyyy to YYYY-MM-DD for calendar
                  try {
                    const d = new Date(date);
                    if (!isNaN(d.getTime())) {
                      const year = d.getFullYear();
                      const month = String(d.getMonth() + 1).padStart(2, '0');
                      const day = String(d.getDate()).padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    }
                  } catch {}
                  return undefined;
                })()
            : undefined
        }
        minDate={new Date().toISOString().split('T')[0]}
      />

      {/* Time Picker Bottom Sheet */}
      {onTimeChange && (
        <CustomBottomSheet
          ref={timeBottomSheetRef}
          snapPoints={['40%']}
          title="Select Time"
          onClose={() => {
            setShowTimePicker(false);
            timeBottomSheetRef.current?.dismiss();
          }}
          onDismiss={() => setShowTimePicker(false)}
          enablePanDownToClose={true}>
          <View style={styles.timePickerContainer}>
            <FlatList
              data={timeOptions}
              keyExtractor={item => item}
              renderItem={({item}) => {
                // Normalize both times for comparison (handle "HH:mm" and "HH:mm:ss" formats)
                const normalizeTime = (t: string) => {
                  if (!t) return '';
                  const timePart = t.split(' ')[0]; // Take only the time part
                  const [hour, minute] = timePart.split(':');
                  return `${hour.padStart(2, '0')}:${(minute || '00').padStart(2, '0')}`;
                };
                const normalizedSelected = normalizeTime(selectedTime || '');
                const normalizedItem = normalizeTime(item);
                const isSelected = normalizedSelected === normalizedItem;
                
                return (
                  <TouchableOpacity
                    style={[
                      styles.timeOption,
                      {
                        backgroundColor: isSelected ? colors.blue50 : colors.white,
                        borderColor: isSelected ? colors.blue600 : colors.neutral200,
                      },
                    ]}
                    onPress={() => handleTimeSelect(item)}>
                    <CustomText
                      variant="text-base-medium"
                      color={isSelected ? 'blue600' : 'neutral900'}>
                      {formatTimeDisplay(item)}
                    </CustomText>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </CustomBottomSheet>
      )}
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
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  dateButton: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  timeButton: {
    flex: 1,
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 6,
  },
  timePickerContainer: {
    padding: 16,
  },
  timeOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
});
