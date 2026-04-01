import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {CommonActions} from '@react-navigation/native';
import {CarReantalStackParamList} from '../../navigators/types';
import {Colors, Typography} from '../../styles';
import {CustomText} from '../../common/components';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {ArrowLeft, X, Check, Info} from 'lucide-react-native';
import {useTheme} from '../../context/ThemeContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {useCarRental} from '../hooks/useCarPickupSearch';
import {useJournery} from '../../journey/hooks/useJournery';
import {useUpdateJourney} from '../../journey/hooks/useUpdateJourney';
import {saveCarQuoteDetails} from '../redux/carRentalSlice';
import {
  transformCarDataForDetails,
  getOptionalExtras,
  getGroupedExtras,
  type CarRentalApiData,
} from '../utils/carDataTransformer';
import {PreocessImageUrl} from '../../common/hooks/getAirLineLogo';
import {AppDispatch, RootState} from '../../store';
import SelectMobile from '../components/SelectMobile';

type Props = NativeStackScreenProps<CarReantalStackParamList, 'CarRentalDetails'>;

const CarRentalDetailsScreen: React.FC<Props> = ({navigation, route}) => {
  const {colors} = useTheme();
  const {
    carkey,
    selectedTvlG = [],
    pickupLocation: routePickupLocation,
    dropoffLocation: routeDropoffLocation,
    pickupTime: routePickupTime,
    dropoffTime: routeDropoffTime,
  } = route.params || {};
  const dispatch = useDispatch<AppDispatch>();

  const {
    carDetailsData,
    carDetailsApiLoading,
    carDetailsApiError,
    actionData,
    carQuoteDetailsSaveLoading,
  } = useCarRental();
              const actionDataTyped = actionData as any;
          console.log('actionDataTyped', actionDataTyped);

  const journeyState = useJournery();
    const journeyId = journeyState.id;
    const journeyJdid = journeyState?.jdid;

        console.log('journeyId', journeyId);
        console.log('journeyJdid', journeyJdid);
    
  const updateJourney = useUpdateJourney();

  const [showError, setShowError] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<string>('');
  const [fuelTooltipVisible, setFuelTooltipVisible] = useState<boolean>(false);

  // State for tracking selected extras quantities (for dropdown extras)
  const [selectedExtras, setSelectedExtras] = useState<Record<string, number>>({});

  // State for tracking selected radio options (for grouped extras)
  const [selectedRadioOptions, setSelectedRadioOptions] = useState<Record<string, string>>({});

  // Only transform data when it's available and not loading
  const carData = useMemo(() => {
    if (carDetailsApiLoading || !carDetailsData || !(carDetailsData as any)?._data) {
      return null;
    }
    const apiData = (carDetailsData as any)._data as CarRentalApiData;
    return transformCarDataForDetails(apiData, {
      pickupLocation: routePickupLocation,
      dropoffLocation: routeDropoffLocation,
      pickupTime: routePickupTime,
      dropoffTime: routeDropoffTime,
    });
  }, [carDetailsApiLoading, carDetailsData]);

  const optionalExtras = useMemo(() => {
    if (carDetailsApiLoading || !carDetailsData || !(carDetailsData as any)?._data) {
      return [];
    }
    return getOptionalExtras((carDetailsData as any)._data as CarRentalApiData);
  }, [carDetailsApiLoading, carDetailsData]);

  const groupedExtras = useMemo(() => {
    if (carDetailsApiLoading || !carDetailsData || !(carDetailsData as any)?._data) {
      return [];
    }
    return getGroupedExtras((carDetailsData as any)._data as CarRentalApiData);
  }, [carDetailsApiLoading, carDetailsData]);

  // Initialize default selections for radio button groups
  useEffect(() => {
    if (groupedExtras.length > 0) {
      const initialSelections: Record<string, string> = {};
      groupedExtras.forEach(group => {
        if (group.isOne && group.options.length > 0) {
          // Select the first option as default
          initialSelections[group.groupName] = group.options[0].id;
        }
      });
      setSelectedRadioOptions(initialSelections);
    }
  }, [groupedExtras]);

  // Handle extra selection change (for dropdown extras)
  const handleExtraChange = (extraId: string, quantity: number): void => {
    setSelectedExtras(prev => ({
      ...prev,
      [extraId]: quantity,
    }));
  };

  // Handle radio option change (for grouped extras)
  const handleRadioChange = (groupName: string, optionId: string): void => {
    setSelectedRadioOptions(prev => ({
      ...prev,
      [groupName]: optionId,
    }));
  };

  // Calculate total price with extras (excluding pay-at-pickup items)
  const calculateTotalPrice = (): number => {
    if (!carData) return 0;
    let extrasCost = 0;

    // Add dropdown extras cost
    Object.entries(selectedExtras).forEach(([extraId, quantity]) => {
      if (quantity > 0) {
        const extra = optionalExtras.find(e => e.id === extraId);
        if (extra && !extra.payAtPickup) {
          extrasCost += extra.price * quantity * carData.days;
        }
      }
    });

    // Add radio button selection costs
    Object.entries(selectedRadioOptions).forEach(([groupName, optionId]) => {
      const group = groupedExtras.find(g => g.groupName === groupName);
      const selectedOption = group?.options.find(opt => opt.id === optionId);
      if (selectedOption) {
        extrasCost += selectedOption.price * carData.days;
      }
    });
    return (carData.price || 0) + extrasCost;
  };

  // Helper to get total pay-at-pickup extras
  const calculatePayAtPickupTotal = (): number => {
    if (!carData) return 0;
    const extrasTotal = Object.entries(selectedExtras).reduce(
      (total, [extraId, quantity]) => {
        if (quantity === 0) return total;
        const extra = optionalExtras.find(e => e.id === extraId);
        if (!extra?.payAtPickup) return total;
        return total + extra.price * quantity * carData.days;
      },
      0,
    );

    // Include incA items flagged as pay-at-pickup (iPyL)
    const incA = ((carDetailsData as any)?._data as CarRentalApiData | undefined)?.carO?.incA || [];
    const incPayAtPickupTotal = incA.reduce((sum, inc) => {
      const isPay = !!(inc as any).iPyL;
      const prc = (inc as any).prc || 0;
      return isPay ? sum + prc : sum;
    }, 0);

    return extrasTotal + incPayAtPickupTotal;
  };

  const handleSaveCarQuote = async (): Promise<void> => {
    try {
      // Build the car update object (matches JSP updCarO structure)
      const updIncA: Array<{id: string; q: number}> = [];

      // Add selected radio options to the update array
      Object.values(selectedRadioOptions).forEach(optionId => {
        if (optionId) {
          updIncA.push({id: optionId, q: 1});
        }
      });

      // Add selected dropdown quantities to the update array
      Object.entries(selectedExtras).forEach(([optionId, quantity]) => {
        if (quantity > 0) {
          updIncA.push({id: optionId, q: quantity});
        }
      });

      const updCarO = {incA: updIncA};
        console.log('journeyId', journeyId);

      // First API call: Save car quote details
      const carDetailsApiData = (carDetailsData as any)?._data as CarRentalApiData | undefined;
        const carkeyValue = carkey || (carDetailsApiData?.carO as any)?.key || '';
        
      const saveResult = await dispatch(
        saveCarQuoteDetails({
          jid: journeyId || '',
          carkey: carkeyValue,
          carupdstr: JSON.stringify(updCarO),
          prCar: false,
          __xreq__: true,
          tvlG: {
            tvlA: selectedTvlG,
            },
          jdid: journeyJdid || '',
        }) as any,
      );

      // Check if first API call was successful
      if (saveResult.meta.requestStatus === 'fulfilled') {
        // Second API call: Update journey
          const actionDataTyped = actionData as any;
          
       const journeyResult = await updateJourney(
          [
            {
              type: 'CAR_RENTAL_ADD',
              ctype: 'CAR_RENTAL',
              tvlG: {
                tvlA: selectedTvlG,
              },
              rentalData: {
                id: carkeyValue,
              },
              dayNum: actionDataTyped?.dayNum,
              blockId: actionDataTyped?.blockId,
              date: actionDataTyped?.date,
            },
          ],
          null,
          {},
       );
          const data = journeyResult.payload
          if(data && data?.success) {
            // Navigate to JourneyDetails in the parent JourneyStack
            // Since CarRentalDetailsScreen is in a nested CarReantalStack,
            // we need to use getParent() to access the parent navigator
            const parentNavigation = navigation.getParent();
            if (parentNavigation) {
              // Use CommonActions for type-safe navigation to parent stack
              parentNavigation.dispatch(
                CommonActions.navigate({
                  name: 'JourneyDetails',
                  params: {
                    journeyId: journeyId || 'dad1acca72c2216e',
                    jdid: data?._data?.journey?.id,
                  },
                })
              );
            } else {
              // Fallback: try direct navigation (might work if navigator structure allows it)
              (navigation as any).navigate('JourneyDetails', {
                journeyId: journeyId || 'dad1acca72c2216e',
                jdid: data?._data?.journey?.id,
              });
            }
          } 
          else {
            setShowError(true);
            setShowMessage('Failed to update journey');
          }
      } else {
        setShowError(true);
        setShowMessage('Failed to save car quote details');
      }
    } catch (error) {
      console.warn('Error in handleSaveCarQuote:', error);
      setShowError(true);
      setShowMessage('An error occurred while saving');
    }
  };

  const carOData = (carDetailsData as any)?._data?.carO;

  const goBack = () => {
      navigation.goBack();
  };

  // Show loading state
  if (carDetailsApiLoading || !carData) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.blue600} />
          <CustomText variant="text-base-medium" color="neutral900" style={styles.loadingText}>
            Loading car details
          </CustomText>
        </View>
      </SafeAreaView>
    );
  }

  const hasIncPayAtPickup = ((carDetailsData as any)?._data as CarRentalApiData | undefined)?.carO?.incA?.some(
    inc => !!(inc as any).iPyL,
  );
  const hasSelectedPayAtPickup = Object.entries(selectedExtras).some(([extraId, quantity]) => {
    if (quantity === 0) return false;
    const extra = optionalExtras.find(e => e.id === extraId);
    return extra?.payAtPickup;
  });

  return (
    <BottomSheetModalProvider>
      <SafeAreaView style={[styles.safeArea, {backgroundColor: colors.white}]} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
        {/* Header */}
        <View style={[styles.header, {borderBottomColor: colors.neutral200}]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={goBack} activeOpacity={0.7}>
              <ArrowLeft size={20} color={colors.neutral900} />
            </TouchableOpacity>
            <CustomText variant="text-lg-semibold" color="neutral900">
              {carData.carName} Details
          </CustomText>
          </View>
          <TouchableOpacity onPress={goBack} activeOpacity={0.7}>
            <X size={20} color={colors.neutral400} />
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Main Car Card */}
          <View style={[styles.carCard, {borderBottomColor: colors.neutral200}]}>
            <View style={styles.carCardContent}>
              {/* Car Image */}
              <View style={styles.carImageContainer}>
                <Image
                  source={{uri: carData.imageUrl}}
                  style={styles.carImage}
                  resizeMode="contain"
                />
              </View>

              {/* Car Details */}
              <View style={styles.carDetailsContainer}>
                <View style={styles.carDetailsHeader}>
                  <View style={styles.carNameContainer}>
                    <CustomText variant="text-base-semibold" color="neutral900">
                      {carData.carName}
                    </CustomText>
                    {/* Feature Badges */}
                    <View style={styles.featureBadges}>
                      <View style={[styles.badge, {borderColor: colors.neutral200}]}>
                        <CustomText variant="text-xs-medium" color="neutral600">
                          {carData.seats} seats
                        </CustomText>
                      </View>
                      <View style={[styles.badge, {borderColor: colors.neutral200}]}>
                        <CustomText variant="text-xs-medium" color="neutral600">
                          {carData.doors} doors
                        </CustomText>
                      </View>
                      <View style={[styles.badge, {borderColor: colors.neutral200}]}>
                        <CustomText variant="text-xs-medium" color="neutral600">
                          {carData.bags} bag
                        </CustomText>
                      </View>
                      <View style={[styles.badge, {borderColor: colors.neutral200}]}>
                        <CustomText variant="text-xs-medium" color="neutral600">
                          {carData.transmission}
                        </CustomText>
                      </View>
                      {carData.airConditioning && (
                        <View style={[styles.badge, {borderColor: colors.neutral200}]}>
                          <CustomText variant="text-xs-medium" color="neutral600">
                            AC
                          </CustomText>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Provider Logo */}
                  {carData.provider?.lg ? (
                    <View style={styles.providerLogoContainer}>
                      <Image
                        source={{uri: PreocessImageUrl(carData.provider.lg)}}
                        style={styles.providerLogo}
                        resizeMode="contain"
                      />
                    </View>
                  ) : (
                    carData.provider?.nm && (
                      <View style={[styles.providerBadge, {backgroundColor: colors.green50}]}>
                        <CustomText variant="text-sm-medium" color="neutral900">
                          {carData.provider.nm}
                        </CustomText>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>

            {/* Pickup/Dropoff Box */}
            <View style={[styles.locationBox, {borderColor: colors.neutral200}]}>
              <View style={styles.locationInfo}>
                <View style={styles.locationTimeRow}>
                  <CustomText variant="text-xxs-semibold" color="neutral600">
                    Pick-up :
                  </CustomText>
                  {carData.pickupTime && (
                    <CustomText variant="text-xxs-semibold" color="neutral600">
                      {carData.pickupTime}
                    </CustomText>
                  )}
                </View>
                <CustomText variant="text-sm-normal" color="neutral900">
                  {carData.pickupLocation}
                </CustomText>
              </View>

              <View style={styles.daysBadge}>
                <CustomText variant="text-xs-normal" color="neutral900">
                  {carData.days} {carData.days === 1 ? 'Day' : 'Days'}
                </CustomText>
              </View>

              <View style={styles.locationInfo}>
                <View style={styles.locationTimeRow}>
                  <CustomText variant="text-xxs-semibold" color="neutral600">
                    Drop-off :
                  </CustomText>
                  {carData.dropoffTime && (
                    <CustomText variant="text-xxs-semibold" color="neutral600">
                      {carData.dropoffTime}
                    </CustomText>
                  )}
                </View>
                <CustomText variant="text-sm-normal" color="neutral900">
                  {carData.dropoffLocation}
                </CustomText>
              </View>
            </View>

            {/* Features */}
            {carData.features?.length > 0 && (
              <View style={styles.featuresSection}>
                <CustomText variant="text-xxs-semibold" color="neutral600" style={styles.inclusionsHeader}>
                  INCLUSIONS
                </CustomText>
                <View style={styles.featuresGrid}>
                  {carData.features.map((feature, index) => {
                    const isFuel =
                      String(feature).toLowerCase().includes('fuel') ||
                      String(feature).toLowerCase().includes('full to full');
                    return (
                      <TouchableOpacity
                        key={`feature-${index}`}
                        style={styles.featureItem}
                        onPress={() => isFuel && setFuelTooltipVisible(true)}
                        activeOpacity={isFuel ? 0.7 : 1}>
                        <Check size={16} color={Colors.lightThemeColors.green600} />
                        <CustomText
                          variant="text-xs-normal"
                          color="neutral600"
                          style={isFuel ? styles.underlineText : undefined}>
                          {feature}
                        </CustomText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </View>

          {/* Extras Section */}
          <View style={styles.extrasSection}>
            <CustomText variant="text-lg-semibold" color="neutral900" style={styles.extrasTitle}>
              Extra
            </CustomText>
            <CustomText variant="text-xs-normal" color="neutral600" style={styles.extrasNote}>
              Please note that prices and availability of optional extras are fully controlled by
              the car rental company and that prices are subject to change.
            </CustomText>

            <View style={styles.extrasList}>
              {/* Grouped Extras (Radio Button Groups) */}
              {groupedExtras.map(group => (
                <View key={group.groupName} style={styles.extraGroup}>
                  {group.isOne ? (
                    /* Radio button group for single selection */
                    <View style={[styles.radioGroup, {borderColor: colors.neutral200}]}>
                      <CustomText variant="text-sm-semibold" color="neutral900" style={styles.groupTitle}>
                        {group.groupName}
                      </CustomText>
                      <View style={[styles.divider, {backgroundColor: colors.neutral200}]} />
                      {group.options.map((option, index) => (
                        <View key={option.id}>
                          <TouchableOpacity
                            style={styles.radioOption}
                            onPress={() => handleRadioChange(group.groupName, option.id)}
                            activeOpacity={0.7}>
                            <View style={styles.radioButtonContainer}>
                              <View
                                style={[
                                  styles.radioButton,
                                  {
                                    borderColor:
                                      selectedRadioOptions[group.groupName] === option.id
                                        ? colors.blue600
                                        : colors.neutral300,
                                  },
                                ]}>
                                {selectedRadioOptions[group.groupName] === option.id && (
                                  <View
                                    style={[
                                      styles.radioButtonInner,
                                      {backgroundColor: colors.blue600},
                                    ]}
                                  />
                                )}
                              </View>
                            </View>
                            <View style={styles.radioOptionContent}>
                              <View style={styles.radioOptionLeft}>
                                <CustomText variant="text-sm-medium" color="neutral900">
                                  {option.name}
                                </CustomText>
                                {option.description && (
                                  <CustomText variant="text-xs-normal" color="neutral600" style={styles.radioDescription}>
                                    {option.description}
                                  </CustomText>
                                )}
                              </View>
                              {option.priceDisplay && (
                                <View style={styles.radioOptionRight}>
                                  <CustomText variant="text-sm-bold" color="neutral900">
                                    {option.priceDisplay}
                                  </CustomText>
                                  {option.priceQualifier && (
                                    <CustomText variant="text-xs-normal" color="neutral600">
                                      {option.priceQualifier}
                                    </CustomText>
                                  )}
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                          {index < group.options.length - 1 && (
                            <View style={[styles.divider, {backgroundColor: colors.neutral200}]} />
                          )}
                        </View>
                      ))}
                    </View>
                  ) : (
                    /* Dropdown selection for multiple quantities */
                    <View style={[styles.dropdownGroup, {borderColor: colors.neutral200}]}>
                      <View style={[styles.dropdownGroupHeader, {backgroundColor: colors.neutral50}]}>
                        <CustomText variant="text-sm-semibold" color="neutral900">
                          {group.groupName}
                        </CustomText>
                      </View>
                      <View style={[styles.divider, {backgroundColor: colors.neutral200}]} />
                      {group.options.map(option => (
                        <View
                          key={option.id}
                          style={[styles.dropdownOption, {backgroundColor: colors.white}]}>
                          <View style={styles.dropdownOptionLeft}>
                            <CustomText variant="text-sm-normal" color="neutral900">
                              {option.name}
                            </CustomText>
                            {option.description && (
                              <CustomText variant="text-xs-normal" color="neutral400" style={styles.dropdownDescription}>
                                {option.description}
                              </CustomText>
                            )}
                          </View>
                          <View style={styles.dropdownOptionRight}>
                            <View style={styles.priceContainer}>
                              <CustomText variant="text-sm-bold" color="neutral900">
                                {option.priceDisplay}
                              </CustomText>
                              {option.priceQualifier && (
                                <CustomText variant="text-xs-normal" color="neutral600">
                                  {option.priceQualifier}
                                </CustomText>
                              )}
                            </View>
                            <View style={styles.quantityPicker}>
                              <SelectMobile
                                value={String(selectedExtras[option.id] || 0)}
                                options={Array.from({length: (option.mxq || 7) + 1}, (_, i) => ({
                                  value: String(i),
                                  label: String(i),
                                }))}
                                onChange={value => handleExtraChange(option.id, parseInt(value, 10))}
                              />
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Terms & Conditions Link */}
            <TouchableOpacity style={styles.termsButton} activeOpacity={0.7}>
              <CustomText variant="text-sm-medium" color="neutral900">
                Terms & Conditions
              </CustomText>
            </TouchableOpacity>

            {/* Pricing Summary */}
            <View style={[styles.priceSummary, {borderColor: colors.neutral200, backgroundColor: colors.white}]}>
              <CustomText variant="text-base-bold" color="neutral900" style={styles.priceSummaryTitle}>
                Price Summary
              </CustomText>
              <View style={[styles.priceDivider, {backgroundColor: colors.neutral200}]} />
              <View style={styles.priceItems}>
                <View style={styles.priceItem}>
                  <CustomText variant="text-sm-normal" color="neutral700">
                    Rental fee x {carData.days} days
                  </CustomText>
                  <CustomText variant="text-sm-bold" color="neutral900">
                    {carData.currency} {carData.price?.toLocaleString()}
                  </CustomText>
                </View>

                {/* Show included items from incA (exclude pay-at-pickup inclusions) */}
                {(() => {
                  const incA = ((carDetailsData as any)?._data as CarRentalApiData | undefined)?.carO?.incA || [];
                  const incIncluded = incA.filter(inc => !(inc as any).iPyL);
                  return incIncluded.map(inc => (
                    <View key={inc.nm} style={styles.priceItem}>
                      <CustomText variant="text-xs-normal" color="neutral600">
                        {inc.nm}
                      </CustomText>
                      <View style={[styles.includedBadge, {backgroundColor: colors.green50, borderColor: colors.green100}]}>
                        {inc.iPrcInc ? (
                          <View style={styles.includedBadgeContent}>
                            <Check size={12} color={Colors.lightThemeColors.green600} />
                            <CustomText variant="text-xs-semibold" color="green600">
                              Included
                            </CustomText>
                          </View>
                        ) : (
                          <CustomText variant="text-xs-semibold" color="green600">
                            {carData.currency} {Math.round((inc as any).prc || 0).toLocaleString()}
                          </CustomText>
                        )}
                      </View>
                    </View>
                  ));
                })()}

                {/* Show selected extras that are NOT pay at pickup */}
                {Object.entries(selectedExtras).map(([extraId, quantity]) => {
                  if (quantity === 0) return null;
                  const extra = optionalExtras.find(e => e.id === extraId);
                  if (!extra || extra.payAtPickup) return null;
                  const totalExtraPrice = extra.price * quantity * carData.days;

                  return (
                    <View key={extraId} style={styles.priceItem}>
                      <CustomText variant="text-xs-normal" color="neutral700">
                        {extra.name}
                      </CustomText>
                      <CustomText variant="text-sm-bold" color="neutral900">
                        {carData.currency} {Math.round(totalExtraPrice).toLocaleString()}
                      </CustomText>
                    </View>
                  );
                })}

                {/* Show selected radio button options */}
                {Object.entries(selectedRadioOptions).map(([groupName, optionId]) => {
                  const group = groupedExtras.find(g => g.groupName === groupName);
                  const selectedOption = group?.options.find(opt => opt.id === optionId);
                  if (!selectedOption) return null;
                  const totalPrice = selectedOption.price * carData.days;

                  return (
                    <View key={optionId} style={styles.priceItem}>
                      <CustomText variant="text-xs-normal" color="neutral700">
                        {selectedOption.name}
                      </CustomText>
                      <CustomText
                        variant="text-sm-bold"
                        color={selectedOption.price === 0 ? 'green600' : 'neutral900'}>
                        {selectedOption.price === 0
                          ? 'Included'
                          : `${carData.currency} ${Math.round(totalPrice).toLocaleString()}`}
                      </CustomText>
                    </View>
                  );
                })}

                {/* Pay at pick-up section */}
                {(hasIncPayAtPickup || hasSelectedPayAtPickup) && (
                  <>
                    <View style={styles.payAtPickupHeader}>
                      <CustomText variant="text-base-bold" color="neutral900">
                        Pay at pick-up
                      </CustomText>
                    </View>

                    {/* Render incA pay-at-pickup inclusions first */}
                    {(() => {
                      const incA = ((carDetailsData as any)?._data as CarRentalApiData | undefined)?.carO?.incA || [];
                      return incA
                        .filter(inc => !!(inc as any).iPyL)
                        .map(inc => (
                          <View key={`inc-pu-${inc.nm}`} style={styles.priceItem}>
                            <CustomText variant="text-xs-normal" color="neutral700">
                              {inc.nm}
                            </CustomText>
                            <CustomText variant="text-sm-bold" color="neutral900">
                              {(inc as any).iPrcInc
                                ? 'Included'
                                : `${carData.currency} ${Math.round((inc as any).prc || 0).toLocaleString()}`}
                            </CustomText>
                          </View>
                        ));
                    })()}

                    {/* Then render selected extras which are pay-at-pickup */}
                    {Object.entries(selectedExtras).map(([extraId, quantity]) => {
                      if (quantity === 0) return null;
                      const extra = optionalExtras.find(e => e.id === extraId);
                      if (!extra || !extra.payAtPickup) return null;
                      const totalExtraPrice = extra.price * quantity * carData.days;

                      return (
                        <View key={`pickup-${extraId}`} style={styles.priceItem}>
                          <CustomText variant="text-xs-normal" color="neutral700">
                            {extra.name}
                          </CustomText>
                          <CustomText variant="text-sm-bold" color="neutral900">
                            {carData.currency} {Math.round(totalExtraPrice).toLocaleString()}
                          </CustomText>
                        </View>
                      );
                    })}

                    <View style={[styles.priceDivider, {backgroundColor: colors.neutral200}]} />
                    <View style={styles.priceItem}>
                      <CustomText variant="text-base-bold" color="neutral900">
                        Total Pay at pick-up
                      </CustomText>
                      <CustomText variant="text-base-bold" color="neutral900">
                        {carData.currency} {Math.round(calculatePayAtPickupTotal()).toLocaleString()}
                      </CustomText>
                    </View>
                  </>
                )}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={[styles.actionBar, {borderTopColor: colors.neutral200, backgroundColor: colors.white}]}>
          <View style={styles.totalContainer}>
            <CustomText variant="text-xs-medium" color="neutral600">
              Total amount
            </CustomText>
            <CustomText variant="text-lg-bold" color="neutral900">
              {carData.currency} {Math.round(calculateTotalPrice() + calculatePayAtPickupTotal()).toLocaleString()}
            </CustomText>
          </View>
          <TouchableOpacity
            style={[styles.addButton, {backgroundColor: colors.blue600}]}
            onPress={handleSaveCarQuote}
            disabled={carQuoteDetailsSaveLoading}
            activeOpacity={0.8}>
            {carQuoteDetailsSaveLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <CustomText variant="text-base-semibold" color="white">
                Add to Package
              </CustomText>
            )}
          </TouchableOpacity>
        </View>

        {/* Error Toast Message */}
        {showError && (
          <View style={styles.errorToast}>
            <View style={styles.errorToastContent}>
              <X size={20} color={Colors.lightThemeColors.red700} />
              <CustomText variant="text-sm-normal" color="red700" style={styles.errorText}>
                {showMessage || 'An error occurred'}
              </CustomText>
            </View>
          </View>
        )}

        {/* Fuel Tooltip Modal */}
        <Modal
          visible={fuelTooltipVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setFuelTooltipVisible(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setFuelTooltipVisible(false)}>
            <View style={[styles.tooltipContainer, {backgroundColor: colors.white, borderColor: colors.neutral200}]}>
              <CustomText variant="text-sm-normal" color="neutral900">
                {String(carOData?.fpT || '')
                  .split('\n')
                  .map((line, i) => (
                    <CustomText key={`fp-${i}`} variant="text-sm-normal" color="neutral900" style={styles.tooltipLine}>
                      {line}
                    </CustomText>
                  ))}
              </CustomText>
      </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  carCard: {
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  carCardContent: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  carImageContainer: {
    width: 176,
    height: 128,
    marginRight: 24,
  },
  carImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  carDetailsContainer: {
    flex: 1,
  },
  carDetailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  carNameContainer: {
    flex: 1,
  },
  featureBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  badge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  providerLogoContainer: {
    width: 96,
    height: 32,
  },
  providerLogo: {
    width: '100%',
    height: '100%',
  },
  providerBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  locationBox: {
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  daysBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 12,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  inclusionsHeader: {
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
    marginBottom: 8,
  },
  underlineText: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  extrasSection: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  extrasTitle: {
    marginBottom: 8,
  },
  extrasNote: {
    marginBottom: 24,
  },
  extrasList: {
    gap: 32,
  },
  extraGroup: {
    marginBottom: 32,
  },
  radioGroup: {
    borderWidth: 1,
    borderRadius: 8,
  },
  groupTitle: {
    padding: 16,
  },
  divider: {
    height: 1,
  },
  radioOption: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  radioButtonContainer: {
    marginTop: 2,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  radioOptionContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioOptionLeft: {
    flex: 1,
  },
  radioDescription: {
    marginTop: 4,
  },
  radioOptionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dropdownGroup: {
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownGroupHeader: {
    padding: 16,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownOptionLeft: {
    flex: 1,
  },
  dropdownDescription: {
    marginTop: 4,
  },
  dropdownOptionRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  quantityPicker: {
    minWidth: 80,
  },
  termsButton: {
    paddingVertical: 24,
  },
  priceSummary: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  priceSummaryTitle: {
    marginBottom: 16,
  },
  priceDivider: {
    height: 1,
    marginVertical: 16,
  },
  priceItems: {
    gap: 12,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  includedBadge: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  includedBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  payAtPickupHeader: {
    marginTop: 24,
    marginBottom: 16,
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  totalContainer: {
    gap: 4,
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorToast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.red200,
    backgroundColor: Colors.lightThemeColors.red50,
    borderRadius: 8,
    padding: 12,
  },
  errorToastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  tooltipContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tooltipLine: {
    marginBottom: 4,
  },
});

export default CarRentalDetailsScreen;
