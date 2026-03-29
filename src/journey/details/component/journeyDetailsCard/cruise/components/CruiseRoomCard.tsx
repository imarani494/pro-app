import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from '../../../../../../common/components';
import {Check, Info} from 'lucide-react-native';
import {useTheme} from '../../../../../../context/ThemeContext';
import {RefundabilityStatus} from '../types/CruiseTypes';

interface CruiseRoomCardProps {
  roomName: string;
  mealPlan?: string;
  amenities: string[];
  refundability: RefundabilityStatus;
  paxDisplay: string;
}

const ICON_SIZES = {
  check: 16,
  infoSmall: 12,
} as const;

const CruiseRoomCard: React.FC<CruiseRoomCardProps> = ({
  roomName,
  mealPlan,
  amenities,
  refundability,
  paxDisplay,
}) => {
  const {colors} = useTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: colors.neutral50,
          borderColor: colors.neutral200,
        },
      ]}>
      <View style={styles.viewRow}>
        <CustomText variant="text-sm-semibold" color="neutral900">
          Room Info:
        </CustomText>

        <View
          style={[
            styles.iconRow,
            {
              backgroundColor: refundability.isRefundable
                ? colors.green50
                : colors.red50,
            },
          ]}>
          <CustomText
            variant="text-xs-medium"
            color={refundability.isRefundable ? 'green600' : 'red600'}>
            {refundability.text}
          </CustomText>
          <Info
            size={ICON_SIZES.infoSmall}
            color={refundability.isRefundable ? colors.green600 : colors.red600}
          />
        </View>
      </View>

      <View
        style={[
          styles.cityView,
          {
            backgroundColor: colors.white,
            borderColor: colors.neutral200,
          },
        ]}>
        <CustomText variant="text-xs-medium" color="neutral900">
          {paxDisplay}
        </CustomText>
      </View>

      <View style={styles.timeSlotContent}>
        <View style={styles.textTick}>
          <Check size={ICON_SIZES.check} color={colors.green700} />
          <CustomText variant="text-xs-medium" color="neutral900">
            {roomName}
          </CustomText>
        </View>

        {mealPlan && (
          <View style={styles.alignedText}>
            <CustomText variant="text-xs-normal" color="neutral500">
              {mealPlan}
            </CustomText>
          </View>
        )}

        {amenities.length > 0 && (
          <View style={styles.alignedText}>
            <CustomText variant="text-xs-normal" color="neutral500">
              {amenities.slice(0, 3).join(', ')}
            </CustomText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    gap: 14,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cityView: {
    flexDirection: 'row',
    minHeight: 26,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  timeSlotContent: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  textTick: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  alignedText: {
    marginLeft: 24,
  },
});

export default CruiseRoomCard;
