import React from 'react';
import {View, StyleSheet, ViewStyle} from 'react-native';
import CustomText from '../../../../../../common/components/CustomText';
import {useTheme} from '../../../../../../context/ThemeContext';

export interface BookingDate {
  time: string;
  date: string; // Should be formatted as "Thu, 18 Jan 2022"
}

export interface BookingLabels {
  checkIn: string;
  checkOut: string;
}


export interface BookingDatesProps {
  checkIn: BookingDate;
  checkOut: BookingDate;
  duration: string;
  containerStyle?: ViewStyle;
  labels?: BookingLabels;
}

const BookingDates: React.FC<BookingDatesProps> = ({
  checkIn,
  checkOut,
  duration,
  containerStyle,
  labels = {checkIn: 'Pick up', checkOut: 'Drop off'},
}) => {
  const {colors} = useTheme();

  return (
    <View style={[styles.cardView, containerStyle]}>
      <View style={styles.col}>
        <CustomText variant="text-xs-normal" color="neutral500">
          {labels.checkIn}
        </CustomText>
        <CustomText variant="text-sm-semibold" color="neutral900">
          {checkIn.date} 
        </CustomText>
        <CustomText variant="text-xs-normal" color="neutral500">
          {checkIn.time}
        </CustomText>
      </View>

      <View style={styles.rowAlign}>
        <View
          style={[
            styles.smallLine,
            {
              borderColor: colors.neutral200,
              backgroundColor: colors.neutral100,
            },
          ]}
        />
        <View
          style={[
            styles.nightsBadge,
            {
              backgroundColor: colors.neutral100,
              borderColor: colors.neutral100,
            },
          ]}>
          <CustomText variant="text-xs-normal" color="neutral900">
            {duration}
          </CustomText>
        </View>
        <View
          style={[
            styles.smallLine,
            {
              borderColor: colors.neutral200,
              backgroundColor: colors.neutral100,
            },
          ]}
        />
      </View>

      <View style={styles.colName}>
        <CustomText variant="text-xs-normal" color="neutral500">
          {labels.checkOut}
        </CustomText>
        <CustomText
          variant="text-sm-semibold"
          color="neutral900"
          style={styles.rightAlign}>
          {checkOut.date}
        </CustomText>
        <CustomText variant="text-xs-normal" color="neutral500">
          {checkOut.time}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  col: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
    width: '33.33%',
    justifyContent: 'center',
  },
  colName: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    width: '33.33%',
    justifyContent: 'center',
  },
  rightAlign: {
    textAlign: 'right',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '33.33%',
    alignSelf: 'center',
  },
  nightsBadge: {
    minWidth: 64,
    height: 22,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  smallLine: {
    width: 14,
    borderBottomWidth: 1,
    opacity: 1,
    borderRadius: 1,
  },
});

export default BookingDates;