import React, {useMemo, useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Check, Info, Utensils} from 'lucide-react-native';
import {useTheme} from '../../../../../../context/ThemeContext';
import {CustomText} from '../../../../../../common/components';
import {
  HotelApiResponse,
  mapHotelApiToCardProps,
} from '../utils/hotelDataMapper';
import {useNavigation} from '@react-navigation/native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import CustomBottomSheet from '../../../../../../common/components/CustomBottomSheet';
import PointsToNote from '../../../../../../common/components/PointsToNote';
import PointsToNoteModal from './PointsToNoteModal';
import ViewMoreModal from './ViewMoreModal';
import NonRefundableModal from './NonRefundableModal';

interface JourentBenefitsCardProps {
  apiData: HotelApiResponse;
  onBreakfastPress?: () => void;
  onCancellationPress?: () => void;
  onMorePress?: () => void;
  onViewServicesPress?: () => void;
  onCancellationPolicyPress?: () => void;
}

const ICON_SIZES = {
  check: 16,
  info: 16,
  utensils: 16,
} as const;

const UI_CONSTANTS = {
  activeOpacity: 0.7,
  spacerWidth: 16,
  initialHighlightsCount: 3,
  initialSupplementsCount: 3,
} as const;

const JourentBenefitsCard: React.FC<JourentBenefitsCardProps> = ({
  apiData,
  onBreakfastPress,
  onCancellationPress,
  onMorePress,
  onViewServicesPress,
  onCancellationPolicyPress,
}) => {
  const {colors} = useTheme();
  const navigation = useNavigation();

  // ✅ BottomSheet Refs
  const pointsBottomSheetRef = useRef<BottomSheetModal>(null);
  const hotelHighlightsBottomSheetRef = useRef<BottomSheetModal>(null);
  const cityHighlightsBottomSheetRef = useRef<BottomSheetModal>(null);
  const supplementsBottomSheetRef = useRef<BottomSheetModal>(null);
  const nonRefundableBottomSheetRef = useRef<BottomSheetModal>(null); // ✅ NEW

  const hotelData = mapHotelApiToCardProps(apiData);

  // ✅ Data extraction
  const roomType = apiData.rmA?.[0]?.rmN?.trim() || '';
  const roomQuantity = Number(apiData.rmA?.[0]?.qty) || 1;
  const mealsIncluded = apiData.mlD?.trim() || '';
  const roomInclusions = Array.isArray(apiData.rmA?.[0]?.inc)
    ? apiData.rmA[0].inc.filter((inc: string) => inc?.trim())
    : [];
  const hotelName = apiData.hnm?.trim() || '';
  const hotelId = apiData.hid?.toString() || '';

  const hotelHighlightsData =
    Array.isArray(apiData.hlA) && apiData.hlA.length > 0
      ? apiData.hlA.filter(Boolean)
      : [];
  const cityHighlightsData =
    Array.isArray(apiData.fdIncA) && apiData.fdIncA.length > 0
      ? apiData.fdIncA.filter(Boolean)
      : [];

  const roomDescription =
    roomQuantity > 1 ? `${roomQuantity}x ${roomType}` : roomType;

  // ✅ Callback handlers
  const handlePointsToNotePress = useCallback(() => {
    pointsBottomSheetRef.current?.present();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    pointsBottomSheetRef.current?.dismiss();
  }, []);

  const handleViewMoreHotelModal = useCallback(() => {
    hotelHighlightsBottomSheetRef.current?.present();
  }, []);

  const handleCloseHotelHighlightsSheet = useCallback(() => {
    hotelHighlightsBottomSheetRef.current?.dismiss();
  }, []);

  const handleViewMoreCityModal = useCallback(() => {
    cityHighlightsBottomSheetRef.current?.present();
  }, []);

  const handleCloseCityHighlightsSheet = useCallback(() => {
    cityHighlightsBottomSheetRef.current?.dismiss();
  }, []);

  const handleViewMoreSupplementsModal = useCallback(() => {
    supplementsBottomSheetRef.current?.present();
  }, []);

  const handleCloseSupplementsSheet = useCallback(() => {
    supplementsBottomSheetRef.current?.dismiss();
  }, []);

  // ✅ NEW: Non-Refundable BottomSheet handlers
  const handleNonRefundablePress = useCallback(() => {
    nonRefundableBottomSheetRef.current?.present();
  }, []);

  const handleCloseNonRefundableSheet = useCallback(() => {
    nonRefundableBottomSheetRef.current?.dismiss();
  }, []);

  const handleBreakfast = useCallback((): void => {
    onBreakfastPress?.();
  }, [onBreakfastPress]);

  const handleCancellation = useCallback((): void => {
    onCancellationPress?.();
  }, [onCancellationPress]);

  const handleViewServices = useCallback((): void => {
    // Navigate to Hotel Supplements screen
    navigation.navigate('HotelSupplements' as any, {
      hotelId: hotelId,
      hotelName: hotelName,
    });
    // Also call the original callback if provided
    onViewServicesPress?.();
  }, [navigation, hotelId, hotelName, onViewServicesPress]);

  // ✅ Memoized theme styles
  const themeStyles = useMemo(
    () => ({
      card: {
        ...styles.card,
        backgroundColor: colors.neutral50,
        borderColor: colors.neutral200,
      } as ViewStyle,

      newCard: {
        ...styles.newCard,
        borderColor: colors.neutral200,
        backgroundColor: colors.white,
      } as ViewStyle,

      underlineText: {
        textDecorationLine: 'underline',
      } as TextStyle,

      flexText: {
        flex: 1,
      } as TextStyle,

      actionButton: {
        backgroundColor: colors.greenChip,
      } as ViewStyle,

      spacer: {
        width: UI_CONSTANTS.spacerWidth,
      } as ViewStyle,
    }),
    [colors],
  );

  // ✅ Memoized calculations
  const hotelHighlights = useMemo(() => {
    if (hotelHighlightsData.length === 0) return [];

    return hotelHighlightsData
      .slice(0, UI_CONSTANTS.initialHighlightsCount)
      .map((item, index) => ({
        id: index + 1,
        text: item?.toString()?.trim() || '',
      }))
      .filter(h => h.text);
  }, [hotelHighlightsData]);

  const cityHighlights = useMemo(() => {
    if (cityHighlightsData.length === 0) return [];

    return cityHighlightsData
      .slice(0, UI_CONSTANTS.initialHighlightsCount)
      .map((item, index) => ({
        id: index + 1,
        text: item?.toString()?.trim() || '',
      }))
      .filter(h => h.text);
  }, [cityHighlightsData]);

  const includedServices = useMemo(() => {
    const services: Array<{id: number; text: string; icon: string}> = [];

    if (roomType && roomType.trim()) {
      services.push({
        id: 1,
        text: `Room: ${roomDescription}`,
        icon: 'check',
      });
    }

    if (hotelHighlightsData.length > 0) {
      hotelHighlightsData.forEach(highlight => {
        const text = highlight?.toString()?.trim();
        if (text) {
          services.push({
            id: services.length + 1,
            text,
            icon: 'check',
          });
        }
      });
    }

    return services;
  }, [roomType, roomDescription, hotelHighlightsData]);

  const displayedSupplements = useMemo(() => {
    return includedServices.slice(0, UI_CONSTANTS.initialSupplementsCount);
  }, [includedServices]);

  const totalHotelHighlights = hotelHighlightsData.length;
  const totalCityHighlights = cityHighlightsData.length;
  const totalSupplements = includedServices.length;

  const showCancellationBadge = useMemo(() => {
    if (!apiData?.xpSmry || typeof apiData.xpSmry !== 'string') return false;
    const trimmed = apiData.xpSmry.trim();
    if (trimmed === '') return false;

    const lowerCase = trimmed.toLowerCase();
    return (
      !lowerCase.includes('fully refund') && !lowerCase.includes('full refund')
    );
  }, [apiData?.xpSmry]);

  // ✅ Early return if essential data missing
  if (!hotelName || !roomType) {
    return null;
  }

const hasHotelSupplements =
  (
    (Array.isArray(apiData.rmA) && apiData.rmA.some(rm => !!rm?.rmN?.trim()))
    ||
    (Array.isArray(apiData.hlA) && apiData.hlA.some(h => !!h?.toString()?.trim()))
  )
  && displayedSupplements.length > 0;

const hasPointsToNote =
  !!apiData.hid && !!apiData.mFeTxt && apiData.mFeTxt.trim().length > 0;


  return (
    <View style={styles.container}>
      <View style={styles.benefitsRow}>
        {/* Room Info Card */}
        <View style={themeStyles.card}>
          <CustomText variant="text-sm-semibold" color="neutral900">
            Room Info
          </CustomText>
          <View style={styles.cardRow}>
            <Check size={ICON_SIZES.check} color={colors.green800} />
            <View style={styles.textColumn}>
              <CustomText variant="text-xs-semibold" color="neutral900">
                {roomType}
              </CustomText>

              {roomInclusions.length > 0 && (
                <View style={styles.inclusionsContainer}>
                  {roomInclusions.map((inclusion: string, index: number) => (
                    <CustomText
                      key={index}
                      variant="text-xs-normal"
                      color="neutral500">
                      {inclusion}
                    </CustomText>
                  ))}
                </View>
              )}

              <View style={styles.iconRow}>
                {/* Meals Badge */}
                {mealsIncluded && mealsIncluded.trim() && (
                  <TouchableOpacity
                    style={[styles.actionButton, themeStyles.actionButton]}
                    onPress={handleBreakfast}
                    activeOpacity={UI_CONSTANTS.activeOpacity}>
                    <View style={styles.buttonInnerContent}>
                      <Utensils
                        size={ICON_SIZES.utensils}
                        color={colors.green900}
                      />
                      <CustomText
                        variant="text-xs-medium"
                        color="green900"
                        numberOfLines={1}
                        style={styles.buttonText}>
                        {mealsIncluded}
                      </CustomText>
                    </View>
                  </TouchableOpacity>
                )}

                {/* ✅ Non-Refundable Badge - Opens BottomSheet */}
                {showCancellationBadge && (
                  <TouchableOpacity
                    style={[
                      styles.nonButton,
                      {backgroundColor: colors.red50},
                    ]}
                    onPress={handleNonRefundablePress}
                    activeOpacity={UI_CONSTANTS.activeOpacity}>
                    <View style={styles.buttonInnerContent}>
                      <Info size={ICON_SIZES.info} color={colors.red600} />
                      <CustomText
                        variant="text-xs-medium"
                        color="red600"
                        numberOfLines={1}
                        style={styles.buttonText}>
                        {apiData.xpSmry}
                      </CustomText>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Hotel Highlights */}
        {totalHotelHighlights > 0 && (
          <View style={themeStyles.newCard}>
            <CustomText variant="text-sm-semibold" color="neutral900">
              What to know about this hotel
            </CustomText>

            {hotelHighlights.map(highlight => (
              <View key={highlight.id} style={styles.highlightRow}>
                <Check size={ICON_SIZES.check} color={colors.green700} />
                <CustomText
                  variant="text-xs-normal"
                  color="neutral500"
                  style={themeStyles.flexText}>
                  {highlight.text}
                </CustomText>
              </View>
            ))}

            {totalHotelHighlights > UI_CONSTANTS.initialHighlightsCount && (
              <View style={styles.viewMoreContainer}>
                <View style={themeStyles.spacer} />
                <TouchableOpacity
                  onPress={handleViewMoreHotelModal}
                  activeOpacity={UI_CONSTANTS.activeOpacity}>
                  <CustomText
                    variant="text-xs-semibold"
                    color="neutral900"
                    style={themeStyles.underlineText}>
                    View More
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* City Highlights */}
        {totalCityHighlights > 0 && (
          <View style={themeStyles.newCard}>
            <CustomText variant="text-sm-semibold" color="neutral900">
              City Highlights and Inclusions
            </CustomText>

            {cityHighlights.map(highlight => (
              <View key={highlight.id} style={styles.highlightRow}>
                <Check size={ICON_SIZES.check} color={colors.green700} />
                <CustomText
                  variant="text-xs-normal"
                  color="neutral500"
                  style={themeStyles.flexText}>
                  {highlight.text}
                </CustomText>
              </View>
            ))}

            {totalCityHighlights > UI_CONSTANTS.initialHighlightsCount && (
              <View style={styles.viewMoreContainer}>
                <View style={themeStyles.spacer} />
                <TouchableOpacity
                  onPress={handleViewMoreCityModal}
                  activeOpacity={UI_CONSTANTS.activeOpacity}>
                  <CustomText
                    variant="text-xs-semibold"
                    color="neutral900"
                    style={themeStyles.underlineText}>
                    View More
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

     {hasHotelSupplements && (
          <View
            style={[
              styles.hotelSupplementsCard,
              {backgroundColor: colors.white, borderColor: colors.neutral200},
            ]}>
            <View
              style={[styles.leftLine, {borderLeftColor: colors.darkCharcoal}]}
            />

            <View style={styles.hotelSupplyHeader}>
              <CustomText variant="text-sm-semibold" color="neutral900">
                Hotel Supplements
              </CustomText>
              <TouchableOpacity
                style={[
                  styles.addMoreButton,
                  {
                    backgroundColor: colors.white,
                    borderColor: colors.neutral300,
                  },
                ]}
                activeOpacity={UI_CONSTANTS.activeOpacity}
                onPress={handleViewServices}>
                <CustomText variant="text-xs-medium" color="neutral900">
                  Add more
                </CustomText>
              </TouchableOpacity>
            </View>

            <View style={styles.supplementsList}>
              {displayedSupplements.map(service => (
                <View key={service.id} style={styles.supplementItem}>
                  <Check size={ICON_SIZES.check} color={colors.green700} />
                  <CustomText
                    variant="text-xs-normal"
                    color="neutral500"
                    style={themeStyles.flexText}>
                    {service.text}
                  </CustomText>
                </View>
              ))}
            </View>

            {totalSupplements > UI_CONSTANTS.initialSupplementsCount && (
              <View style={styles.viewMoreContainer}>
                <View style={themeStyles.spacer} />
                <TouchableOpacity
                  onPress={handleViewMoreSupplementsModal}
                  activeOpacity={UI_CONSTANTS.activeOpacity}>
                  <CustomText
                    variant="text-xs-semibold"
                    color="neutral900"
                    style={themeStyles.underlineText}>
                    View More
                  </CustomText>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    

     {/* Points to Note */}
    {hasPointsToNote && (
      <PointsToNote hotelId={apiData.hid?.toString()} onPress={handlePointsToNotePress} />
    )}
      {/* Points to Note BottomSheet */}
   {hasPointsToNote && (
      <CustomBottomSheet
        ref={pointsBottomSheetRef}
        snapPoints={['38%', '75%']}
        title="Points to note"
        onClose={handleCloseBottomSheet}
        enablePanDownToClose={true}
        enableBackdrop={true}>
        <BottomSheetScrollView
          contentContainerStyle={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}>
          <PointsToNoteModal
            hotelName={hotelName}
            apiData={apiData}
            onButtonPress={handleCloseBottomSheet}
          />
        </BottomSheetScrollView>
      </CustomBottomSheet>
)}
      {/* ✅ NEW: Non-Refundable BottomSheet */}
      {showCancellationBadge && (
        <CustomBottomSheet
          ref={nonRefundableBottomSheetRef}
          snapPoints={['30%', '60%']}
          // title={apiData.xpSmry || 'Cancellation Policy'}
          onClose={handleCloseNonRefundableSheet}
          enablePanDownToClose={true}
          enableBackdrop={true}>
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}>
            <NonRefundableModal
              summary={apiData.xpSmry}
              details={Array.isArray(apiData.xpDtlA) ? apiData.xpDtlA : []}
              colors={colors}
              onClose={handleCloseNonRefundableSheet}
            />
          </BottomSheetScrollView>
        </CustomBottomSheet>
      )}

      {/* Hotel Highlights BottomSheet */}
      {totalHotelHighlights > 0 && (
        <CustomBottomSheet
          ref={hotelHighlightsBottomSheetRef}
          snapPoints={['72%', '75%']}
          title="What to know about this hotel"
          onClose={handleCloseHotelHighlightsSheet}
          enablePanDownToClose={true}
          enableBackdrop={true}>
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}>
            <ViewMoreModal
              subtitle={hotelName}
              items={hotelHighlightsData}
              onButtonPress={handleCloseHotelHighlightsSheet}
            />
          </BottomSheetScrollView>
        </CustomBottomSheet>
      )}

      {/* City Highlights BottomSheet */}
      {totalCityHighlights > 0 && hotelData.city && (
        <CustomBottomSheet
          ref={cityHighlightsBottomSheetRef}
          snapPoints={['50%', '75%']}
          title="City Highlights and Inclusions"
          onClose={handleCloseCityHighlightsSheet}
          enablePanDownToClose={true}
          enableBackdrop={true}>
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}>
            <ViewMoreModal
              subtitle={hotelData.city}
              items={cityHighlightsData}
              onButtonPress={handleCloseCityHighlightsSheet}
            />
          </BottomSheetScrollView>
        </CustomBottomSheet>
      )}

      {/* Hotel Supplements BottomSheet */}
      {totalSupplements > 0 && (
        <CustomBottomSheet
          ref={supplementsBottomSheetRef}
          snapPoints={['76%', '78%']}
          title="Hotel Supplements"
          onClose={handleCloseSupplementsSheet}
          enablePanDownToClose={true}
          enableBackdrop={true}>
          <BottomSheetScrollView
            contentContainerStyle={styles.bottomSheetContent}
            showsVerticalScrollIndicator={false}>
            <ViewMoreModal
              subtitle={hotelName}
              items={includedServices}
              onButtonPress={handleCloseSupplementsSheet}
            />
          </BottomSheetScrollView>
        </CustomBottomSheet>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  benefitsRow: {
    flexDirection: 'column',
    gap: 20,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    flexWrap: 'wrap',
  },
  actionButton: {
    borderRadius: 32,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 0,
    maxWidth: 'auto',
  },
  nonButton: {
    borderRadius: 32,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 0,
  },
  buttonInnerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  buttonText: {
    flexShrink: 1,
    textAlign: 'center',
    flexWrap: 'wrap',
    minWidth: 0,
  },
  card: {
    width: '100%',
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
  },
  hotelSupplementsCard: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    gap: 8,
    position: 'relative',
  },
  leftLine: {
    position: 'absolute',
    left: -1,
    top: 14,
    minHeight: 24,
    borderLeftWidth: 2,
  },
  hotelSupplyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 32,
  },
  addMoreButton: {
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  supplementsList: {
    flex: 1,
    gap: 14,
  },
  supplementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    maxWidth: '100%',
  },
  newCard: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    padding: 14,
    gap: 14,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    gap: 8,
  },
  textColumn: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  inclusionsContainer: {
    flexDirection: 'column',
    gap: 4,
    marginTop: 4,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    maxWidth: '100%',
  },
  viewMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bottomSheetContent: {
    paddingBottom: 20,
  },
});

export default JourentBenefitsCard;
