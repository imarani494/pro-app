import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import {useTheme} from '../../../../../../context/ThemeContext';
import {QUANTAS} from '../../../../../../utils/assetUtil';
import {CustomText} from '../../../../../../common/components';
import {Info} from 'lucide-react-native';

const AirlineDetails: React.FC = () => {
  const {colors} = useTheme();

  return (
    <View style={styles.airlineRow}>
      <View style={styles.airlineInfo}>
        <View style={styles.logoContainer}>
          <Image
            source={QUANTAS}
            style={styles.airlineLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.airlineTextContainer}>
          <CustomText variant="text-sm-medium" color="neutral900">
            Qantas
          </CustomText>

          <View style={styles.flightClassRow}>
            <CustomText variant="text-xs-normal" color="neutral500">
              QF-12
            </CustomText>
            <CustomText variant="text-xs-normal" color="neutral300">
               • 
            </CustomText>
            <CustomText variant="text-xs-normal" color="neutral500">
              Economy
            </CustomText>
          </View>
        </View>
      </View>
      <View style={[styles.refundableBadge, {backgroundColor: colors.red50}]}>
        <Info size={14} color={colors.red600} />
        <CustomText variant="text-xs-medium" color="red600">
          Non-Refundable
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  airlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',

    width: '100%',
  },
  airlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    marginRight: 12,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  airlineLogo: {
    width: 32,
    height: 32,
    borderRadius: 3.2,
  },
  airlineTextContainer: {
    flex: 1,
    gap: 4,
  },
  flightClassRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  refundableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9,
    marginLeft: 8,
    gap: 6,
    flexShrink: 0,
  },
});

export default AirlineDetails;
