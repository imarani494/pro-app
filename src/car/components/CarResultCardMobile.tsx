import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {CustomText} from '../../common/components';
import {Colors} from '../../styles';
import {useTheme} from '../../context/ThemeContext';
import {Info} from 'lucide-react-native';
import {LOGO_EURO} from '../../utils/assetUtil';
import DashedLine from '../../common/components/DashedLine';
import DashedDrawLine from '../../common/components/DashedDrawLine';

interface TimeLocation {
  loc?: string;
  isApt?: boolean;
  locTm?: string;
}

interface Supplier {
  nm?: string;
  lg?: string;
}

interface CarResultCardMobileProps {
  carName: string;
  seats: number;
  doors: number;
  bags: number;
  transmission: string;
  airConditioning: boolean;
  price: number;
  displayPrice: string;
  imageUrl: string;
  features: string[];
  pickupLocation?: TimeLocation;
  dropoffLocation?: TimeLocation;
  onSelect?: () => void;
  supplier?: Supplier;
  refundabletxt?: string;
}

function toDisplayTimeLabel(raw?: string): string {
  if (!raw) return '';
  if (/\b(am|pm)\b/i.test(raw)) return raw;

  const m = /^(\d{1,2}):(\d{2})$/.exec(raw);
  if (!m) return raw;

  let hour = parseInt(m[1], 10);
  const minute = m[2].padStart(2, '0');
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute} ${period}`;
}

export default function CarResultCardMobile({
  carName,
  seats,
  doors,
  bags,
  transmission,
  airConditioning,
  price,
  displayPrice,
  imageUrl,
  features,
  pickupLocation,
  dropoffLocation,
  onSelect,
  supplier,
  refundabletxt,
}: CarResultCardMobileProps) {
  const {colors} = useTheme();
  const [carImageError, setCarImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const pickupTimeLabel = toDisplayTimeLabel(pickupLocation?.locTm);
  const dropoffTimeLabel = toDisplayTimeLabel(dropoffLocation?.locTm);

  return (
    <View style={[styles.container, {borderColor: colors.neutral200}]}>
      {/* Car Image Hero Section */}
      <View style={styles.heroImageContainer}>
        {!carImageError && imageUrl ? (
          <>
            {imageLoading && (
              <View style={styles.imageLoader}>
                <ActivityIndicator size="small" color={colors.neutral400} />
              </View>
            )}
            <Image
              source={{uri: imageUrl}}
              style={styles.heroImage}
              resizeMode="contain"
              onError={() => {
                setCarImageError(true);
                setImageLoading(false);
              }}
              onLoad={() => setImageLoading(false)}
            />
          </>
        ) : (
          <View></View>
        )}
      </View>

      {/* Card Content */}
      <View style={styles.cardContent}>
        {/* Car Details Section */}
        <View style={styles.carDetailsSection}>
          {/* Title and Supplier Row */}
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <CustomText variant="text-base-semibold" color="neutral900">
                {carName}
              </CustomText>
            </View>

            {LOGO_EURO && (
              <View style={styles.carLogo}>
                <Image
                  source={LOGO_EURO}
                  style={styles.imageLogo}
                  resizeMode="contain"
                />
              </View>
            )}
          </View>

          {/* Features as Text with Dots */}
          <View style={styles.featuresRow}>
            <CustomText variant="text-sm-normal" color="neutral500">
              {seats} seats
              {airConditioning && ' • Air conditioning'}
              {' • '}
              {bags} bag{bags !== 1 ? 's' : ''}
              {' • '} {'\n'}
              {transmission}
            </CustomText>
          </View>
        </View>

        {/* Separator */}
        <View
          style={[styles.separator, {backgroundColor: colors.neutral200}]}
        />

        {/* Pickup/Dropoff Info */}
        <View style={styles.locationContainer}>
          <View style={styles.locationItem}>
            <CustomText variant="text-xs-normal" color="neutral500">
              Pick up
            </CustomText>
            <CustomText variant="text-sm-medium" color="neutral900">
              {pickupLocation?.loc || ''}
            </CustomText>
            <CustomText variant="text-xs-semibold" color="neutral500">
              {pickupTimeLabel}
            </CustomText>
          </View>
          <View style={styles.locationItem}>
            <CustomText
              variant="text-xs-normal"
              color="neutral500"
              style={styles.rightAlignedText}>
              Drop off
            </CustomText>
            <CustomText
              variant="text-sm-medium"
              color="neutral900"
              style={styles.rightAlignedText}>
              {dropoffLocation?.loc || ''}
            </CustomText>
            <CustomText
              variant="text-xs-semibold"
              color="neutral500"
              style={styles.rightAlignedText}>
              {dropoffTimeLabel}
            </CustomText>
          </View>
        </View>

        {/* Features as Badges */}
        <View style={styles.featureBadgesContainer}>
          {features &&
            features.slice(0, 2).map((feature, index) => (
              <View
                key={index}
                style={[
                  styles.featureBadge,
                  {backgroundColor: colors.neutral100},
                ]}>
                <CustomText variant="text-xs-medium" color="neutral900">
                  {feature}
                </CustomText>
              </View>
            ))}
          {features && features.length > 2 && (
            <TouchableOpacity style={styles.moreButton}>
              <CustomText
                variant="text-xs-semibold"
                color="neutral900"
                style={styles.underlineText}>
                + {features.length - 2} more
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>

     <DashedDrawLine style={[styles.footerSeparator, {marginTop:20}]} />
      <TouchableOpacity
        style={styles.priceContainer}
        onPress={onSelect}
        activeOpacity={0.8}>
        <View style={styles.priceContent}>
          {/* Refundable Badge */}
          {refundabletxt && (
            <View
              style={[
                styles.refundableBadge,
                refundabletxt.toLowerCase().includes('refundable') &&
                !refundabletxt.toLowerCase().includes('partial')
                  ? {backgroundColor: '#d6f1df'}
                  : refundabletxt.toLowerCase().includes('partial')
                  ? {backgroundColor: colors.blue50}
                  : {backgroundColor: '#fef3c7'},
              ]}>
              {refundabletxt.toLowerCase().includes('request') && (
                <Info size={16} color={colors.yellow800} />
              )}
              <CustomText
                variant="text-xs-medium"
                color={
                  refundabletxt.toLowerCase().includes('refundable') &&
                  !refundabletxt.toLowerCase().includes('partial')
                    ? 'green900'
                    : refundabletxt.toLowerCase().includes('partial')
                    ? 'blue800'
                    : 'yellow800'
                }>
                {refundabletxt}
              </CustomText>
              {refundabletxt.toLowerCase().includes('request') && (
                <Info size={16} color={colors.yellow800} />
              )}
            </View>
          )}
          <CustomText variant="text-xl-bold" color="neutral900">
            {displayPrice}
          </CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightThemeColors.white,
    borderWidth: 1,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  heroImageContainer: {
    height: 128,
    width: '100%',
    marginTop: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  cardContent: {
    padding: 0,
    gap: 20,
  },
  carDetailsSection: {
    // gap: 6,
    marginTop: 10,
  },
  separator: {
    height: 1,
    
  },
  imageLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
   
  },
  titleContainer: {
    flex: 1,
  },
  featuresRow: {
    gap: 6,
    transform: [{rotate: '0deg'}],
    opacity: 1,
  },
  supplierContainer: {
    height: 29,
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    overflow: 'hidden',
  },
  locationContainer: {
    flexDirection: 'row',

    gap: 20,
  },
  locationItem: {
    flex: 1,
    gap: 8,
  },
  rightAlignedText: {
    textAlign: 'right',
  },
  featureBadgesContainer: {
    flexDirection: 'row',

    gap: 8,
    flexWrap: 'wrap',
  },
  featureBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  moreButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  footerSeparator: {
    height: 1,
  
  },
  priceContainer: {
    marginBottom:20,
    paddingTop:20,
  },
  priceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refundableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 9999,
    gap: 4,
  },
  carLogo: {
    marginLeft: 8,
  },
  imageLogo: {
    width: 40,
    height: 20,
  },
});
