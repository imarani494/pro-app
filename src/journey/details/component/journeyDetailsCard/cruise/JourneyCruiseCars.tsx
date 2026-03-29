import {View, Image, StyleSheet} from 'react-native';
import React, {useMemo} from 'react';
import {useTheme} from '../../../../../context/ThemeContext';
import {CRUISE_SHIP} from '../../../../../utils/assetUtil';
import {CustomText} from '../../../../../common/components';
import {Check, Info} from 'lucide-react-native';
import BookingDates from '../car/components/BookingDates';
import TravelerSummary from '../../../../../common/components/TravelersTag';
import {CruiseApiData} from './types/CruiseTypes';
import {
  getTravelersFromPaxes,
  formatCruiseDate,
  calculateNights,
  extractAmenities,
  getRefundabilityStatus,
} from './utils/cruiseHelpers';
import DashedDrawLine from '../../../../../common/components/DashedDrawLine';

interface JourneyCruiseProps {
  containerStyle?: any;
  apiData: CruiseApiData;
  onReadMorePress?: () => void;
}

const ICON_SIZES = {
  check: 16,
  info: 16,
  infoSmall: 12,
} as const;

const JourneyCruise: React.FC<JourneyCruiseProps> = ({apiData}) => {
  const {colors} = useTheme();

  
  if (!apiData?.details?.hotelName || !apiData?.srchO || !apiData?.rmA?.[0]) {
    return null;
  }

  
  const travelers = useMemo(
    () => getTravelersFromPaxes(apiData.srchO.paxes),
    [apiData.srchO.paxes],
  );

 
  const selectedRoom = useMemo(
    () => apiData.rmA[0]?.roptA?.[0],
    [apiData.rmA],
  );

  const roomName =
    selectedRoom?.name || selectedRoom?.mp || apiData.rmA[0]?.nm || 'Standard Room';
  const mealPlan = selectedRoom?.mlD || selectedRoom?.mpN || '';


  const amenities = useMemo(
    () => extractAmenities(apiData.details.hotelDesc || ''),
    [apiData.details.hotelDesc],
  );


  const refundability = useMemo(
    () => getRefundabilityStatus(selectedRoom?.key || []),
    [selectedRoom?.key],
  );

 
  const checkInDate = formatCruiseDate(apiData.srchO.chkIn);
  const checkOutDate = formatCruiseDate(apiData.srchO.chkOut);
  const nights = calculateNights(apiData.srchO.chkIn, apiData.srchO.chkOut);

  
  const imageUrl = apiData.details.hotelImages?.[0]?.imageUrl;

 
  const cityName = apiData.details.hotelCity || '';

 
  const paxDisplay = apiData.srchO.paxD || `${travelers.length} travelers`;


  const bookingInfoText = useMemo(() => {
    const city = cityName || 'This';
    const nightsText = `${nights} ${nights === 1 ? 'night' : 'nights'}`;
    return `${city} cruise booking includes ${nightsText} accommodation. Please verify room configuration details.`;
  }, [cityName, nights]);

  return (
    <View style={styles.wrapper}>
    
      <View style={[styles.imageWrapper, {backgroundColor: colors.white}]}>
        <Image
          source={imageUrl ? {uri: imageUrl} : CRUISE_SHIP}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

     
      <View style={styles.viewDraw}>
        <CustomText variant="text-base-semibold" color="darkCharcoal">
          {apiData.details.hotelName}
        </CustomText>
      </View>

    /}
      <View style={styles.viewChild}>
        <TravelerSummary travelers={travelers} paxD={paxDisplay} />
      </View>

     
      <BookingDates
        checkIn={{
          time: '',
          date: checkInDate,
        }}
        checkOut={{
          time: '',
          date: checkOutDate,
        }}
        duration={`${nights} ${nights === 1 ? 'Night' : 'Nights'}`}
        labels={{checkIn: 'Departure', checkOut: 'Arrival'}}
      />

     
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
              color={
                refundability.isRefundable ? colors.green600 : colors.red600
              }
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

          {/* Dynamic Meal Plan */}
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

    
      <View style={styles.viewDrop}>
        <Info
          size={ICON_SIZES.info}
          color={colors.neutral500}
          style={styles.infoIcon}
        />
        <View style={styles.textContainer}>
          <CustomText variant="text-xs-normal" color="slate500">
            {bookingInfoText}
          </CustomText>
        </View>
      </View>

      <DashedDrawLine
        dashLength={4}
        dashGap={4}
        dashColor={colors.neutral300}
        dashThickness={1}
        style={{width: '100%', marginTop: 16}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    padding: 14,
    paddingTop: 16,
  },
  viewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timeSlotContent: {
    flexDirection: 'column',
    gap: 12,
    width: '100%',
  },
  viewDraw: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: 16,
  },
  viewChild: {
    marginTop: 10,
    marginBottom: 16,
  },
  textTick: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    width: '100%',
  },
  viewDrop: {
    flexDirection: 'row',
    marginTop: 14,
    alignItems: 'flex-start',
    width: '100%',
    gap: 8,
  },
  infoIcon: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  alignedText: {
    marginLeft: 24,
  },
  imageWrapper: {
    borderRadius: 8,
    height: 128,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
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
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cardContainer: {
    width: '100%',
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    gap: 14,
  },
});

export default JourneyCruise;
