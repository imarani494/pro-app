import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {Star, MapPin} from 'lucide-react-native';
import {CustomText} from '../../../../../common/components';
import BookingDates from '../car/components/BookingDates';
import {useTheme} from '../../../../../context/ThemeContext';
import JourentBenefitsCard from './components/JourentBenefitsCard';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {
  HotelApiResponse,
  mapHotelApiToCardProps,
  mapTravelersFromApi,
  extractHotelActions,
  extractPaxD,
} from '../hotel/utils/hotelDataMapper';
import DashedDrawLine from '../../../../../common/components/DashedDrawLine';

interface HotelCardProps {
  apiData: HotelApiResponse;
  onImagePress?: () => void;
  onRatingPress?: () => void;
  onLocationPress?: () => void;
  onBookingDatesPress?: () => void;
  onTagPress?: (tag: any) => void;
}

const HotelCard: React.FC<HotelCardProps> = ({
  apiData,
  onRatingPress,
  onLocationPress,
  onTagPress,
}) => {
  const {colors} = useTheme();

  const hotelData = mapHotelApiToCardProps(apiData);
  const travelers = mapTravelersFromApi(apiData);
  const hotelActions = extractHotelActions(apiData);
  const paxD = extractPaxD(apiData);

  const tags = Array.isArray(apiData.tagA) ? apiData.tagA : [];
  const groupTourTag = tags.find((tag: any) => tag?.nm?.includes('Group Tour'));
  const hasGroupTourTag = !!groupTourTag;

  const showSimilarBadge = !!(
    apiData?.tagA?.[0]?.nm && apiData.tagA[0].nm.trim()
  );

  const labels: Record<string, string> = hotelData.labels ?? {};
  const maxStars = hotelData.maxStars ?? 5;
  const currentRating = Math.min(hotelData.rating ?? 0, maxStars);

  const renderStars = (rating: number) => {
    if (rating === 0 || !rating) return null;

    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {Array.from({length: maxStars}).map((_, index) => {
          const filled = index < Math.floor(rating);

          return (
            <Star
              key={index}
              size={16}
              color={filled ? '#262626' : '#D1D5DB'}
              fill={filled ? '#262626' : 'transparent'}
              strokeWidth={filled ? 0 : 1.5}
            />
          );
        })}
      </View>
    );
  };

  const handleTagPress = () => {
    if (groupTourTag && onTagPress) {
      onTagPress(groupTourTag);
    }
  };

  if (!hotelData.hotelName || !hotelData.city) {
    return null;
  }

  const reviewLabel =
    Number(hotelData.reviewCount || 0) === 1
      ? labels.reviewSingular ?? 'review'
      : labels.reviewPlural ?? 'reviews';

  return (
    <View style={[styles.wrapper, {backgroundColor: colors.white}]}>
      {hotelData.hotelImage?.uri && hotelData.hotelImage.uri.trim() && (
        <View style={[styles.imageWrapper, {backgroundColor: colors.white}]}>
          <Image
            source={hotelData.hotelImage}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {currentRating > 0 && (
        <TouchableOpacity
          style={styles.centerRow}
          onPress={onRatingPress}
          activeOpacity={0.7}>
          <View style={styles.starsContainer}>
            {renderStars(currentRating)}
          </View>
          <View style={styles.row}>
            {Number(hotelData.reviewCount || 0) > 0 && (
              <CustomText variant="text-xs-normal" color="neutral500">
                {hotelData.reviewCount + ' ' + reviewLabel}
              </CustomText>
            )}

            {hotelData.reviewText && hotelData.reviewText.trim() && (
              <CustomText variant="text-xs-semibold" color="green800">
                {hotelData.reviewText}
              </CustomText>
            )}

            {hotelData.score && (
              <View
                style={[styles.scoreBox, {backgroundColor: colors.neutral900}]}>
                <CustomText variant="text-sm-semibold" color="white">
                  {hotelData.score}
                </CustomText>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}

      <View style={styles.header}>
        <View style={styles.hotelNameContainer}>
          <CustomText
            variant="text-base-semibold"
            color="darkCharcoal"
            numberOfLines={1}
            style={styles.hotelNameText}>
            {hotelData.hotelName}
          </CustomText>

          {showSimilarBadge && (
            <View
              style={[styles.cardOrange, {backgroundColor: colors.orange100}]}>
              <CustomText variant="text-xs-medium" color="orange700">
                or Similar
              </CustomText>
            </View>
          )}
        </View>
      </View>

      {hotelData.address && hotelData.address.trim() && (
        <TouchableOpacity
          style={styles.summaryRow}
          onPress={onLocationPress}
          activeOpacity={0.7}>
          <MapPin size={16} color={colors.neutral500} />
          <CustomText variant="text-sm-normal" color="neutral500">
            {hotelData.address}
          </CustomText>
        </TouchableOpacity>
      )}

      {travelers.length > 0 && (
        <TravelerSummary travelers={travelers} paxD={paxD} />
      )}

      {(apiData?.tagA?.[0]?.nm?.trim() || apiData?.cdnm?.trim()) && (
        <View style={styles.tagBadgeContainer}>
          <View
            style={[styles.tagBadge, {backgroundColor: colors.lightPurple100}]}>
            <CustomText variant="text-xs-medium" color="lightPurple900">
              {apiData?.tagA?.[0]?.nm || apiData?.cdnm}
            </CustomText>
          </View>
        </View>
      )}

      {hasGroupTourTag && groupTourTag && !apiData?.tagA?.[0]?.nm && (
        <TouchableOpacity
          style={styles.passengerContainer}
          activeOpacity={0.7}
          onPress={handleTagPress}>
          <View
            style={[styles.cardInfo, {backgroundColor: colors.lightPurple100}]}>
            <CustomText variant="text-xs-medium" color="lightPurple900">
              {groupTourTag.nm}
            </CustomText>
          </View>
        </TouchableOpacity>
      )}

      <View style={[styles.divider, {backgroundColor: colors.neutral300}]} />

      {hotelData.checkIn && hotelData.checkOut && (
        <BookingDates
          checkIn={hotelData.checkIn}
          checkOut={hotelData.checkOut}
          duration={hotelData.duration || ''}
          labels={{
            checkIn: hotelData.labels?.checkIn || 'Check-in',
            checkOut: hotelData.labels?.checkOut || 'Check-out',
          }}
        />
      )}

      <JourentBenefitsCard apiData={apiData} />

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

// Styles remain the same
const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 14,
    paddingTop: 16,
  },
  imageWrapper: {
    borderRadius: 8,
    height: 128,
    overflow: 'hidden',
    marginTop: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  passengerContainer: {
    alignItems: 'flex-start',
    marginTop: 10,
  },
  header: {
    width: '100%',
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  cardOrange: {
    height: 20,
    borderRadius: 9999,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    flexShrink: 0,
    flexGrow: 0,
  },
  hotelNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    flexWrap: 'wrap',
  },
  hotelNameText: {
    flexShrink: 1,
    flexGrow: 0,
    minWidth: 0,
  },
  tagBadgeContainer: {
    marginTop: 12,
    alignItems: 'flex-start',
  },
  tagBadge: {
    minWidth: 60,
    height: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  cardInfo: {
    minWidth: 80,
    height: 22,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  centerRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 26,
    width: '100%',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'flex-end',
  },
  scoreBox: {
    width: 42,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 4,
    marginBottom: 8,
    marginTop: 10,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  dashedLine: {
    width: '100%',
    marginTop: 20,
  },
});

export default HotelCard;
