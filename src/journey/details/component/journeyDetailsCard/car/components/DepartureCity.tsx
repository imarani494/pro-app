// components/DepartureCity.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {CustomText} from '../../../../../../common/components';
import {useTheme} from '../../../../../../context/ThemeContext';
import DashedDrawLine from '../../../../../../common/components/DashedDrawLine';
import {Check, XCircle} from 'lucide-react-native';

const ICON_SIZES = {
  check: 16,
  xCircle: 16,
};

export interface DepartureCityProps {
  pickupLocation?: string;
  dropoffLocation?: string;
  pickupDate?: string;
  dropoffDate?: string;
  pickupTime?: string;
  dropoffTime?: string;
  days?: number;
  inclusions?: string[];
  exclusions?: string[];
  carFeatures?: string[];
  price?: string;
  currency?: string;
  mileage?: string;
  fuelPolicy?: string;
  availability?: string;
  pickupLabel?: string;
  dropoffLabel?: string;
}

const DepartureCity: React.FC<DepartureCityProps> = ({
  pickupLocation,
  dropoffLocation,
  pickupDate,
  pickupTime,
  dropoffDate,
  dropoffTime,
  days = 0,
  inclusions = [],
  exclusions = [],
  carFeatures = [],
  price,
  currency = '',
  mileage,
  fuelPolicy,
  availability,
  pickupLabel = 'Pick up',
  dropoffLabel = 'Drop off',
}) => {
  const {colors} = useTheme();

  if (!pickupLocation && !dropoffLocation) return null;

  const getDisplayFeatures = () => {
    const base = carFeatures.length ? carFeatures : inclusions;

    const cleaned = base.filter(
      f => f && f.trim() && !f.toLowerCase().includes('excess'),
    );

    const doors =
      cleaned.find(f => f.toLowerCase().includes('door')) ||
      cleaned.find(f => f.toLowerCase().includes('doors'));

    const bags =
      cleaned.find(f => f.toLowerCase().includes('bag')) ||
      cleaned.find(f => f.toLowerCase().includes('bags'));

    const mileageFeature =
      mileage || cleaned.find(f => f.toLowerCase().includes('mileage'));

    const rest = cleaned.filter(
      f => f !== doors && f !== bags && f !== mileageFeature,
    );

    const ordered = [doors, bags, mileageFeature, ...rest].filter(Boolean);

    return ordered.slice(0, 2).map((text, index) => ({
      id: `feat-${index}`,
      text: text!.length > 30 ? text!.slice(0, 30) + '...' : text!,
    }));
  };

  const displayFeatures = getDisplayFeatures();
  const totalFeatureCount = (
    carFeatures.length ? carFeatures : inclusions
  ).filter(f => f && f.trim() && !f.toLowerCase().includes('excess')).length;
  const remainingCount =
    totalFeatureCount > displayFeatures.length
      ? totalFeatureCount - displayFeatures.length
      : 0;

  const formatLocation = (loc?: string) => {
    if (!loc) return 'Location TBD';
    if (loc.length <= 22) return loc;
    return loc.slice(0, 22) + '...';
  };

  const getDaysBadgeText = () => {
    if (days === 0) return 'Same day';
    if (days === 1) return '1 Day';
    return `${days} Days`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationsRow}>
        <View style={styles.pickupColumn}>
          <CustomText variant="text-xs-normal" color="slate500">
            {pickupLabel}
          </CustomText>
          <CustomText variant="text-sm-medium" color="darkCharcoal">
            {formatLocation(pickupLocation)}
          </CustomText>
          <CustomText variant="text-xs-normal" color="slate500">
            {pickupDate}
          </CustomText>
        </View>

        {days >= 0 && (
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
                {getDaysBadgeText()}
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
        )}

        <View style={styles.dropoffColumn}>
          <CustomText variant="text-xs-normal" color="slate500">
            {dropoffLabel}
          </CustomText>
          <CustomText variant="text-sm-medium" color="darkCharcoal">
            {formatLocation(dropoffLocation)}
          </CustomText>
          <CustomText variant="text-xs-normal" color="slate500">
            {dropoffDate}
          </CustomText>
        </View>
      </View>

      {displayFeatures.length > 0 && (
        <View style={styles.featuresRow}>
          {displayFeatures.map(f => (
            <View
              key={f.id}
              style={[
                styles.featureChip,
                {backgroundColor: colors.neutral100},
              ]}>
              <CustomText variant="text-xs-medium" color="neutral700">
                {f.text}
              </CustomText>
            </View>
          ))}
          {remainingCount > 0 && (
            <CustomText
              variant="text-xs-semibold"
              color="neutral900"
              style={styles.moreText}>
              + {remainingCount} more
            </CustomText>
          )}
        </View>
      )}

      {inclusions.length > 0 && (
        <View
          style={[
            styles.inclusionsCard,
            {
              borderColor: colors.neutral200,
              backgroundColor: colors.white,
            },
          ]}>
          <CustomText
            variant="text-sm-semibold"
            color="neutral900"
            style={styles.sectionTitle}>
            Inclusions
          </CustomText>

          {inclusions.map((item, index) => (
            <View key={`inc-${index}`} style={styles.highlightRow}>
              <Check size={ICON_SIZES.check} color={colors.green700} />
              <CustomText
                variant="text-xs-normal"
                color="neutral700"
                style={styles.flexText}>
                {item}
              </CustomText>
            </View>
          ))}
        </View>
      )}

      {exclusions.length > 0 && (
        <View
          style={[
            styles.exclusionsCard,
            {
              borderColor: colors.neutral200,
              backgroundColor: colors.white,
            },
          ]}>
          <CustomText
            variant="text-sm-semibold"
            color="neutral900"
            style={styles.sectionTitle}>
            Exclusions (Payable)
          </CustomText>

          {exclusions.map((item, index) => (
            <View key={`exc-${index}`} style={styles.highlightRow}>
              <XCircle size={ICON_SIZES.xCircle} color={colors.red700} />
              <CustomText
                variant="text-xs-normal"
                color="neutral700"
                style={styles.flexText}>
                {item}
              </CustomText>
            </View>
          ))}
        </View>
      )}

      <DashedDrawLine />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 10,
  },
  locationsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  pickupColumn: {
    flex: 1,
    gap: 8,
    alignItems: 'flex-start',
  },
  dropoffColumn: {
    flex: 1,
    gap: 8,
    alignItems: 'flex-end',
  },
  rowAlign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20.33%',
    alignSelf: 'center',
  },
  smallLine: {
    width: 10,
    borderBottomWidth: 1,
    opacity: 1,
    borderRadius: 1,
  },
  nightsBadge: {
    minWidth: 54,
    height: 20,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  featuresRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  featureChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  moreText: {
    marginLeft: 4,
  },
  inclusionsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    height:'auto',
    marginBottom: 16,
    gap: 12,
  },
  exclusionsCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    maxWidth: '100%',
  },
  flexText: {
    flex: 1,
    flexWrap: 'wrap',
  },
});

export default DepartureCity;
