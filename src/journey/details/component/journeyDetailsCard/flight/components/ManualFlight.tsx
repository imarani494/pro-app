import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomText from '../../../../../../common/components/CustomText';
import {useTheme} from '../../../../../../context/ThemeContext';

const ManualFlight: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View style={styles.pnrRow}>
      <View
        style={[
          styles.manualFlightBadge,
          {backgroundColor: colors.neutral100},
        ]}>
        <CustomText variant="text-xs-medium" color="neutral900">
          Manual Flight
        </CustomText>
      </View>
      <CustomText variant="text-xs-medium" color="neutral600">
        PNR WEREE34
      </CustomText>
    </View>
  );
};

const styles = StyleSheet.create({
  pnrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
    width: '100%',
  },
  manualFlightBadge: {
    borderRadius: 12,

    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ManualFlight;
