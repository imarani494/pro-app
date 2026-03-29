import React from 'react';
import {View, StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {Check, ChevronDown, Info} from 'lucide-react-native';
import {CustomText} from '../../../../../common/components';
import {useTheme} from '../../../../../context/ThemeContext';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import DashedDrawLine from '../../../../../common/components/DashedDrawLine';

import {TransferApiData} from './types/TransferTypes';
import {transformTransferApiData} from './utils/transferDataTransformer';
import {useBottomSheet} from '../../../../../common/hooks/useBottomSheet';

interface JourneyTransferProps {
  apiData: TransferApiData;
  containerStyle?: ViewStyle;
}

const getTravelersFromApi = (tvlA: string[]) => {
  let adultIndex = 1;
  let childIndex = 1;

  return tvlA.map(travelerId => {
    const isAdult = travelerId.includes('ADULT');
    return {
      id: travelerId,
      t: (isAdult ? 'Adult' : 'Child') as const,
      nm: isAdult ? `Adult ${adultIndex++}` : `Child ${childIndex++}`,
    };
  });
};

const formatPrice = (amount: number, currency: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const JourneyTransferCard: React.FC<JourneyTransferProps> = ({
  apiData,
  containerStyle,
}) => {
  const {colors} = useTheme();
  const {bottomSheetRef, openBottomSheet, closeBottomSheet} = useBottomSheet();

  const transferData = React.useMemo(() => {
    if (!apiData) return null;
    return transformTransferApiData(apiData);
  }, [apiData]);

  const travelers = React.useMemo(() => {
    if (!apiData?.tvlG?.tvlA || apiData.tvlG.tvlA.length === 0) return [];
    return getTravelersFromApi(apiData.tvlG.tvlA);
  }, [apiData?.tvlG?.tvlA]);

  const featureBadges = React.useMemo(() => {
    const badges = [];

    if (apiData?.txpL?.nm) {
      const transferName =
        apiData.txpL.nm.toUpperCase() === 'SIC'
          ? 'Shared Transfers'
          : apiData.txpL.nm;

      badges.push({
        id: 'transfer-type',
        text: transferName,
        type: 'transferType',
      });
    }

    if (apiData?.bggN) {
      badges.push({
        id: 'baggage',
        text: apiData.bggN,
        type: 'baggage',
      });
    }

    return badges;
  }, [apiData?.txpL?.nm, apiData?.bggN]);

  const hasData = transferData && apiData;

  if (!hasData) return null;

  const handleViewAllVariants = React.useCallback((): void => {
    console.log('View all variants pressed');
  }, []);

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {(transferData.title || transferData.cdnm) && (
        <View style={styles.textContainer}>
          <CustomText variant="text-base-semibold" color="darkCharcoal">
            {transferData.title || transferData.cdnm}
          </CustomText>
        </View>
      )}

      {travelers.length > 0 && transferData.passengerInfo && (
        <TravelerSummary
          travelers={travelers}
          paxD={transferData.passengerInfo}
        />
      )}

      {apiData?.txptA && apiData.txptA.length > 0 && (
        <View style={styles.infoText}>
          <Info size={16} color={colors.neutral500} />
          <View style={styles.infoTextContent}>
            {apiData.txptA.map((item, index) => (
              <CustomText
                key={`txpt-${index}`}
                variant="text-xs-normal"
                color="neutral600"
                numberOfLines={3}
                selectable={true}>
                {item.txt}
              </CustomText>
            ))}
          </View>
        </View>
      )}

      <View style={[styles.divider, {backgroundColor: colors.neutral300}]} />

      {transferData.pickupInfo && transferData.pickupInfo.details && (
        <View style={styles.textPickup}>
          <CustomText variant="text-xs-normal" color="slate500">
            {transferData.pickupInfo.label}
          </CustomText>
          <CustomText variant="text-sm-semibold" color="darkCharcoal">
            {transferData.pickupInfo.details}
          </CustomText>
        </View>
      )}

      {featureBadges.length > 0 && (
        <View style={styles.viewRow}>
          {featureBadges.map(badge => {
            const isPrivateBadge = badge.text.toLowerCase().includes('private');

            return (
              <View
                key={badge.id}
                style={[
                  styles.featureBadge,
                  {
                    backgroundColor: isPrivateBadge
                      ? colors.lightPurple100
                      : colors.neutral100,
                  },
                ]}>
                <CustomText
                  variant="text-xs-medium"
                  color={isPrivateBadge ? 'lightPurple900' : 'neutral700'}
                  numberOfLines={1}>
                  {badge.text}
                </CustomText>
              </View>
            );
          })}
        </View>
      )}

      {apiData?.slotD && (
        <View style={styles.timeSlotsWrapper}>
          <View
            style={[
              styles.timeSlotsContainer,
              {
                backgroundColor: colors.neutral50,
                borderColor: colors.neutral200,
              },
            ]}>
            <View style={styles.timeSlotsContent}>
              <View style={styles.singleTimeSlot}>
                <Check size={16} color={colors.green700} />
                <CustomText variant="text-xs-normal" color="neutral500">
                  Selected time slot: {apiData.slotD}
                </CustomText>
              </View>
            </View>
          </View>
        </View>
      )}

      {Array.isArray(apiData.variants) && apiData.variants.length > 0 && (
        <View style={[styles.containerMain, {borderColor: colors.neutral200}]}>
          <View
            style={[styles.leftLine, {borderLeftColor: colors.darkCharcoal}]}
          />
          <View style={styles.contentContainer}>
            <View style={styles.variantTextContainer}>
              <CustomText variant="text-base-semibold" color="neutral900">
                Explore other variants
              </CustomText>
              <CustomText variant="text-xs-normal" color="neutral500">
                More variants may be available
              </CustomText>
            </View>
            <TouchableOpacity
              style={[styles.button, {borderColor: colors.neutral200}]}
              onPress={handleViewAllVariants}
              activeOpacity={0.7}>
              <CustomText variant="text-xs-medium" color="neutral900">
                View all
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {transferData?.pricing &&
        transferData.pricing.paymentType === 'pay_at_pickup' &&
        transferData.pricing.currency &&
        typeof transferData.pricing.totalSell === 'number' && (
          <TouchableOpacity
            style={[
              styles.priceInfo,
              {
                borderColor: colors.neutral200,
                borderWidth: 1,
              },
            ]}
            activeOpacity={0.7}>
            <Info size={16} color={colors.neutral900} />
            <CustomText variant="text-sm-semibold" color="darkCharcoal">
              Pay at Pickup: {transferData.pricing.currency}{' '}
              {transferData.pricing.totalSell.toFixed(2)}
            </CustomText>
            <ChevronDown size={16} color={colors.neutral900} />
          </TouchableOpacity>
        )}

      <DashedDrawLine
        dashLength={4}
        dashGap={4}
        dashColor={colors.neutral300}
        dashThickness={1}
        style={styles.dashedLine}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 14,
    marginTop: 6,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  timeSlotsWrapper: {
    // marginBottom: 20,
    marginTop: 20,
  },
  timeSlotsContainer: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeSlotsContent: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  singleTimeSlot: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '90%',
  },
  badgeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  textContainer: {
    width: '100%',
    // marginTop: 10,
    marginBottom: 10,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  leftLine: {
    width: 0,
    height: 24,
    borderLeftWidth: 2,
    marginTop: -18,
  },
  containerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  variantTextContainer: {
    flex: 1,
    gap: 4,
  },
  button: {
    width: 70,
    height: 35,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 10,
    width: '100%',
  },
  infoTextContent: {
    flex: 1,
    flexShrink: 1,
  },
  textPickup: {
    width: '100%',
    gap: 4,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
    alignItems: 'center',
    marginTop: 20,
    // marginBottom: 20,
    flexWrap: 'wrap',
  },
  featureBadge: {
    height: 24,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dashedLine: {
    width: '100%',
    marginTop: 20,
  },
  pointsToNoteWrapper: {
    width: '100%',
  },

  priceInfo: {
    marginTop: 20,
    gap: 8,
    width: '80%',
    flexDirection: 'row',
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 8,
  },
});

export default JourneyTransferCard;
