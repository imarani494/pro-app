import {
  ArrowLeft,
  Check,
  ChevronRight,
  Cross,
  Images,
  MapPin,
  Star,
  X,
} from 'lucide-react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {Colors} from '../../../styles';
import {CustomBottomSheet, CustomText} from '../../../common/components';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {IHotelDetailsData} from '../../types/detailsType';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';
import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../../common/components/CustomButton';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';

const IMAGE_HEIGHT = 340;

const {width} = Dimensions.get('window');

const ReadMoreButton = ({
  title,
  onClick,
}: TouchableOpacityProps & {title: string; onClick?: () => void}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      style={{
        backgroundColor: Colors.lightThemeColors.neutral100,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 8,
        padding: 12,
      }}>
      <CustomText color="neutral900" variant="text-sm-medium">
        {title}
      </CustomText>
    </TouchableOpacity>
  );
};

export default function HotelDetails({
  data,
  paxD,
}: {
  data: IHotelDetailsData;
  paxD: string;
}) {
  type SheetType = 'ABOUT' | 'AMENITIES' | null;

  const [isHeaderVisible, setIsHeaderVisible] = useState<boolean>(false);
  const [sheetType, setSheetType] = useState<SheetType>(null);
  const [selectedPrIds, setSelectedPrIds] = useState<string[]>([]);
  const selectedRoomsCount = selectedPrIds?.length || 0;

  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation =
    useNavigation<NativeStackNavigationProp<JourneyStackParamList>>();
  const insets = useSafeAreaInsets();
  const {bottomSheetRef, openBottomSheet, closeBottomSheet} = useBottomSheet();

  const hotelPrice = useSelector((state: RootState) => state.hotel.prD);

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [180, 220],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerBgOpacity = scrollY.interpolate({
    inputRange: [160, 220],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const listener = scrollY.addListener(({value}) => {
      setIsHeaderVisible(value >= 180);
    });

    return () => scrollY.removeListener(listener);
  }, [scrollY]);

  const formatAmenityText = (text: string): string => {
    return text
      .replace(/_/g, ' ') // Replace underscores with spaces
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const galleryBtnOpacity = scrollY.interpolate({
    inputRange: [0, 10, 50],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const galleryBtnScale = scrollY.interpolate({
    inputRange: [0, 180],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  // Calculate total price of all selected rooms
  const totalPrice = React.useMemo(() => {
    if (!selectedPrIds?.length || !data?.rmA) {
      return {total: 0, currency: '₹', formatted: ''};
    }

    let total = 0;
    let currency = '₹'; // Default currency

    selectedPrIds.forEach(prId => {
      const room = data?.rmA.find(r => r.roptA?.some(opt => opt.prId === prId));
      if (room) {
        const option = room.roptA?.find(opt => opt.prId === prId);
        if (option?.absPrc) {
          total += option.absPrc;
          // Extract currency from first option's prD if available
          if (option.prD && currency === '₹') {
            const match = option.prD.match(/[₹$€£¥]/);
            if (match) currency = match[0];
          }
          currency = option.cur;
        }
      }
    });

    // Format the total price
    // const formatted = new Intl.NumberFormat("en-IN", {
    //   style: "currency",
    //   currency: "INR",
    //   minimumFractionDigits: 0,
    //   maximumFractionDigits: 0,
    // }).format(total);

    return {
      total,
      currency,
      //  formatted
    };
  }, [selectedPrIds, data?.rmA]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* 🔹 IMAGE BACKGROUND (BEHIND EVERYTHING) */}
      <Animated.Image
        source={{
          uri: data?.details.hotelImages[0]?.imageUrl,
        }}
        style={[styles.imageBg, {opacity: imageOpacity}]}
      />
      <Animated.View
        style={[
          styles.showImagesButton,
          {
            opacity: galleryBtnOpacity,
            transform: [{scale: galleryBtnScale}],
          },
        ]}
        pointerEvents={isHeaderVisible ? 'none' : 'auto'} // 👈 disables touch when hidden
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('HotelImages')}
          style={styles.imageIcon}>
          <Images size={18} />
          <CustomText variant="text-xs-medium" color="neutral900">
            1/{data?.details?.hotelImages?.length}
          </CustomText>
        </TouchableOpacity>
      </Animated.View>

      {/* 🔹 STICKY HEADER */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            paddingTop: insets.top,
            paddingBottom: 16,
          },
        ]}>
        {/* 🔥 WHITE BG OVERLAY */}
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            styles.headerBg,
            {opacity: headerBgOpacity},
          ]}
        />

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft
            color={
              isHeaderVisible
                ? Colors.lightThemeColors.neutral900
                : Colors.lightThemeColors.neutral100
            }
          />
        </TouchableOpacity>

        <Animated.View style={[{opacity: titleOpacity, marginLeft: 10}]}>
          <CustomText variant="text-lg-semibold">
            {data?.details?.hotelName}
          </CustomText>
        </Animated.View>
      </Animated.View>

      {/* 🔹 CONTENT */}
      <Animated.ScrollView
        contentContainerStyle={{paddingTop: IMAGE_HEIGHT - 60}}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        {/* 🔥 FLOATING CARD */}
        <View style={styles.card}>
          <View style={styles.floatingCard}>
            {Array.from({length: 5}).map((_, idx) => (
              <Star key={idx} fill={'black'} size={16} />
            ))}
          </View>
          <CustomText variant="text-2xl-semibold" color="neutral900">
            {data?.details?.hotelName}
          </CustomText>
          <View style={styles.locationInfo}>
            <MapPin size={18} color={Colors.lightThemeColors.neutral500} />
            <CustomText variant="text-sm-normal" color="neutral900">
              {`${data?.details?.hotelAddress},  ${data?.details?.hotelCity}`}
            </CustomText>
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 12,
            }}>
            <View style={styles.ratingRow}>
              <View style={styles.rating}>
                <CustomText variant="text-sm-semibold" color="neutral100">
                  {data?.details?.guestRating?.or}
                </CustomText>
              </View>
              <CustomText variant="text-sm-semibold" color={'green800'}>
                {data?.details?.guestRating?.t > 3 ? 'Very good' : 'good'}
              </CustomText>
              <CustomText variant="text-sm-normal" color="neutral500">
                {`( ${data?.details.guestRating?.t} reviews )`}
              </CustomText>
            </View>

            <ChevronRight />
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          <View
            style={{
              width: width * 0.9,
              alignSelf: 'center',
              rowGap: 12,
              marginVertical: 12,
            }}>
            <CustomText
              numberOfLines={5}
              color="neutral700"
              variant="text-sm-normal">
              {data?.details?.hotelDesc}
            </CustomText>
            <ReadMoreButton
              title="Read more"
              onClick={() => {
                setSheetType('ABOUT');
                openBottomSheet();
              }}
            />
          </View>

          {/* Separator */}
          <View style={styles.separator} />

          {/* Stay Card */}
          <View style={{rowGap: 8, marginVertical: 18}}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              Choose your Stay
            </CustomText>
            <View style={styles.chooseYourStay}>
              <View style={{rowGap: 5}}>
                <CustomText variant="text-xs-normal" color="neutral500">
                  Check - in & Check - out
                </CustomText>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {data?.details?.policy?.checkIn} -{' '}
                  {data?.details?.policy?.checkout}
                </CustomText>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <View style={[styles.separator, {width: width * 0.75}]} />
                <ChevronRight />
              </View>
              <View style={{rowGap: 5}}>
                <CustomText variant="text-xs-normal" color="neutral500">
                  Rooms and Guests
                </CustomText>
                <CustomText variant="text-sm-medium" color="neutral900">
                  {paxD}
                </CustomText>
              </View>
            </View>
          </View>
          <View style={[styles.separator]}></View>

          {/* Amenties */}
          <View style={{padding: 5, rowGap: 6, marginBottom: 10}}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              Amenities
            </CustomText>
            <View style={{marginBottom: 10, rowGap: 6}}>
              {data?.details?.amentities.slice(0, 4).map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    columnGap: 6,
                  }}>
                  <Check size={16} color={Colors.lightThemeColors.green700} />
                  <CustomText variant="text-sm-normal" color="neutral700">
                    {formatAmenityText(item)}
                  </CustomText>
                </View>
              ))}
            </View>
            <ReadMoreButton
              title={`Show ${
                data?.details?.amentities.length - 4
              } more amenities`}
              onClick={() => {
                setSheetType('AMENITIES');
                openBottomSheet();
              }}
            />
          </View>

          {/* Separator */}
          <View style={[styles.separator]} />

          {/* Policies */}
          {/* polices section will appear here  */}
          <View style={{gap: 12, paddingHorizontal: 8}}>
            <CustomText variant="text-lg-semibold" color="neutral900">
              Policies
            </CustomText>
            <RenderHTML
              contentWidth={width}
              source={{html: data?.details?.optionalFees || ''}}
              tagsStyles={{
                li: {
                  marginBottom: 6,
                  color: Colors.lightThemeColors.neutral700,
                },
                p: {
                  color: Colors.lightThemeColors.neutral700,
                  marginVertical: 6,
                },
              }}
            />
          </View>

          {/* Special Instruction */}
          <View style={styles.specialInstructions}>
            <CustomText variant="text-sm-semibold" color="neutral900">
              Special Instructions:
            </CustomText>
            <CustomText variant="text-sm-normal" color="neutral700">
              {data?.details?.specialInstructions}
            </CustomText>
          </View>

          {/* Separator */}
          <View style={[styles.separator]} />

          {/* Map Section Here */}
        </View>
      </Animated.ScrollView>
      <CustomBottomSheet
        snapPoints={['70%']}
        ref={bottomSheetRef}
        onClose={closeBottomSheet}>
        {/* Amenities Header */}
        {sheetType === 'AMENITIES' && (
          <>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 18,
                paddingBottom: 10,
              }}>
              <CustomText variant="text-lg-semibold">Amenities</CustomText>
              <X onPress={() => closeBottomSheet()} size={24} />
            </View>
            <View
              style={{
                height: 1,
                width: '100%',
                backgroundColor: Colors.lightThemeColors.neutral300,
              }}
            />
          </>
        )}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding: 16}}
          keyboardShouldPersistTaps="handled">
          {sheetType === 'ABOUT' && (
            <View style={{paddingHorizontal: 4, paddingBottom: 20, rowGap: 16}}>
              <CustomText variant="text-lg-semibold" color="neutral900">
                About this hotel
              </CustomText>
              <RenderHTML
                contentWidth={width}
                source={{html: data?.details?.hotelDesc || ''}}
              />
              <CustomButton
                title="Okay got it"
                textColor="neutral50"
                variant="text-base-normal"
                handleOnPress={() => closeBottomSheet()}
              />
            </View>
          )}

          {sheetType === 'AMENITIES' && (
            <>
              {data.details.amentities.map((item, idx) => (
                <View
                  key={idx}
                  style={{flexDirection: 'row', gap: 8, marginVertical: 10}}>
                  <Check size={16} color={Colors.lightThemeColors.green700} />
                  <CustomText>{formatAmenityText(item)}</CustomText>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      </CustomBottomSheet>

      {/* botom sticky price bar */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 30,
          paddingVertical: 12,
          backgroundColor: Colors.lightThemeColors.white,
          borderTopColor: Colors.lightThemeColors.neutral300,
          borderLeftColor: 'white',
          borderRightColor: 'white',
          borderWidth: 1,
        }}>
        <CustomText variant="text-lg-bold" color="neutral900">
          {hotelPrice}
        </CustomText>
        <View style={{width: '45%'}}>
          <CustomButton
            onPress={() => navigation.navigate('SelectedRoomListing')}
            variant="text-base-medium"
            title="Select room"
            textColor="neutral100"></CustomButton>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  /* IMAGE LAYER */
  imageBg: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  /* FLOATING CARD */
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 24,
    width: '100%',
    alignSelf: 'center',
    height: '100%',
  },
  headerBg: {
    backgroundColor: 'white',
  },
  stickyHeader: {
    position: 'absolute',
    //
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightThemeColors.neutral300,
    marginVertical: 10,
  },
  locationInfo: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  showImagesButton: {
    position: 'absolute',
    right: '8%',
    top: '26%',
    zIndex: 50,
    elevation: 50,
  },
  imageIcon: {
    backgroundColor: Colors.lightThemeColors.neutral300,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 5,
  },
  floatingCard: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 5,
  },
  specialInstructions: {
    backgroundColor: Colors.lightThemeColors.amber50,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.lightThemeColors.amber400,
    padding: 12,
    borderRadius: 8,
    rowGap: 6,
    marginVertical: 10,
  },
  rating: {
    backgroundColor: 'black',
    borderRadius: 100,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    columnGap: 12,
    alignItems: 'center',
  },
  chooseYourStay: {
    width: width * 0.9,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral300,
    borderRadius: 12,
    padding: 12,
    gap: 6,
  },
});
